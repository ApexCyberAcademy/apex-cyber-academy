/**
 * Stripe Checkout Integration
 *
 * Provides:
 * 1. POST /api/stripe/create-checkout-session — creates a Stripe Checkout session for a course or bundle
 * 2. POST /api/stripe/webhook — handles Stripe webhook events to auto-enroll users after payment
 */
import type { Express, Request, Response } from "express";
import Stripe from "stripe";
import { createHash } from "crypto";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { sdk } from "./_core/sdk";
import * as db from "./db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18.acacia",
});

// Course slug -> price mapping (in cents USD)
// These should match the prices displayed on the site
const COURSE_PRICES: Record<string, { priceInCents: number; name: string }> = {
  "cism": { priceInCents: 39900, name: "ISACA CISM - Certified Information Security Manager" },
  "security-plus-sy0-701": { priceInCents: 7500, name: "CompTIA Security+ (SY0-701)" },
  "ceh-v13": { priceInCents: 8900, name: "EC-Council CEH v13 - Certified Ethical Hacker" },
  "secai-plus-cy0-001": { priceInCents: 5900, name: "CompTIA SecAI+ (CY0-001)" },
  "network-plus-n10-009": { priceInCents: 7900, name: "CompTIA Network+ (N10-009)" },
  "tech-plus-fc0-u71": { priceInCents: 4900, name: "CompTIA Tech+ (FC0-U71)" },
};

const BUNDLE_PRICE = { priceInCents: 14900, name: "CEH + Security+ Offense & Defense Bundle" };

export function registerStripeRoutes(app: Express) {
  // ─── POST /api/stripe/create-checkout-session ─────────────────
  app.post("/api/stripe/create-checkout-session", async (req: Request, res: Response) => {
    try {
      const { courseSlug, bundleSlug, customerEmail } = req.body as {
        courseSlug?: string;
        bundleSlug?: string;
        customerEmail?: string;
      };

      if (!courseSlug && !bundleSlug) {
        res.status(400).json({ error: "courseSlug or bundleSlug is required" });
        return;
      }

      const origin = req.headers.origin || `https://${req.headers.host}`;

      let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
      let metadata: Record<string, string>;

      if (bundleSlug) {
        // Bundle purchase
        lineItems = [
          {
            price_data: {
              currency: "usd",
              product_data: { name: BUNDLE_PRICE.name },
              unit_amount: BUNDLE_PRICE.priceInCents,
            },
            quantity: 1,
          },
        ];
        metadata = { type: "bundle", bundleSlug };
      } else {
        // Single course purchase
        const courseInfo = COURSE_PRICES[courseSlug!];
        if (!courseInfo) {
          res.status(400).json({ error: `Unknown course: ${courseSlug}` });
          return;
        }
        lineItems = [
          {
            price_data: {
              currency: "usd",
              product_data: { name: courseInfo.name },
              unit_amount: courseInfo.priceInCents,
            },
            quantity: 1,
          },
        ];
        metadata = { type: "course", courseSlug: courseSlug! };
      }

      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ["card"],
        mode: "payment",
        line_items: lineItems,
        success_url: `${origin}/enrollment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/course`,
        metadata,
        // Collect customer email if not provided
        ...(customerEmail
          ? { customer_email: customerEmail }
          : { customer_creation: "always" }),
      };

      // If no email provided, let Stripe collect it
      if (!customerEmail) {
        delete sessionParams.customer_email;
      }

      const session = await stripe.checkout.sessions.create(sessionParams);

      res.json({ url: session.url, sessionId: session.id });
    } catch (error: any) {
      console.error("[Stripe] Create checkout session failed:", error);
      res.status(500).json({ error: error.message || "Failed to create checkout session" });
    }
  });

  // ─── POST /api/stripe/webhook ─────────────────────────────────
  // Note: This route needs raw body for signature verification
  app.post(
    "/api/stripe/webhook",
    // express.raw middleware is applied in the main server setup
    async (req: Request, res: Response) => {
      const sig = req.headers["stripe-signature"];
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      let event: Stripe.Event;

      if (webhookSecret && sig) {
        try {
          event = stripe.webhooks.constructEvent(
            (req as any).rawBody || req.body,
            sig as string,
            webhookSecret
          );
        } catch (err: any) {
          console.error("[Stripe Webhook] Signature verification failed:", err.message);
          res.status(400).json({ error: `Webhook signature verification failed` });
          return;
        }
      } else {
        // Without webhook secret, accept the event directly (development mode)
        event = req.body as Stripe.Event;
      }

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleSuccessfulPayment(session);
      }

      res.json({ received: true });
    }
  );

  // ─── GET /api/stripe/session-status ───────────────────────────
  // Used by the success page to verify payment and get enrollment info
  app.get("/api/stripe/session-status", async (req: Request, res: Response) => {
    try {
      const sessionId = req.query.session_id as string;
      if (!sessionId) {
        res.status(400).json({ error: "session_id is required" });
        return;
      }

      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status !== "paid") {
        res.json({ status: "pending", paid: false });
        return;
      }

      const customerEmail = session.customer_details?.email || session.customer_email;
      const metadata = session.metadata || {};

      // Find or create the user and enroll them
      const enrollmentResult = await findOrCreateAndEnroll(
        customerEmail || "",
        metadata
      );

      res.json({
        status: "complete",
        paid: true,
        customerEmail,
        courseName: metadata.type === "bundle" ? BUNDLE_PRICE.name : COURSE_PRICES[metadata.courseSlug || ""]?.name,
        ...enrollmentResult,
      });
    } catch (error: any) {
      console.error("[Stripe] Session status check failed:", error);
      res.status(500).json({ error: "Failed to check session status" });
    }
  });
}

/**
 * Handle successful payment from webhook or session verification
 */
async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  const customerEmail = session.customer_details?.email || session.customer_email;
  const metadata = session.metadata || {};

  if (!customerEmail) {
    console.error("[Stripe] No customer email found in session:", session.id);
    return;
  }

  await findOrCreateAndEnroll(customerEmail, metadata);
}

/**
 * Find or create user by email, then enroll them in the purchased course(s)
 */
async function findOrCreateAndEnroll(
  email: string,
  metadata: Record<string, string>
): Promise<{ enrolled: boolean; message: string; loginEmail?: string; tempPassword?: string }> {
  if (!email) {
    return { enrolled: false, message: "No email provided" };
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Find existing user or create a new one
  let user = await db.getUserByEmail(normalizedEmail);
  let tempPassword: string | undefined;

  if (!user) {
    // Create a new user account with a temporary password
    tempPassword = generateTempPassword();
    const openId = `local-${createHash("sha256").update(normalizedEmail).digest("hex").slice(0, 32)}`;
    const passwordHash = createHash("sha256").update(tempPassword + "apex-cyber-salt-2026").digest("hex");

    await db.upsertUser({
      openId,
      name: normalizedEmail.split("@")[0],
      email: normalizedEmail,
      passwordHash,
      loginMethod: "email",
      lastSignedIn: new Date(),
    });

    user = await db.getUserByOpenId(openId);
    if (!user) {
      console.error("[Stripe] Failed to create user for:", normalizedEmail);
      return { enrolled: false, message: "Failed to create user account" };
    }
  }

  // Enroll the user
  if (metadata.type === "bundle") {
    // Get all published courses and enroll in all of them
    const allCourses = await db.getAllCourses();
    let enrolledCount = 0;
    for (const course of allCourses) {
      const existing = await db.getUserEnrollmentForCourse(user.id, course.id);
      if (!existing) {
        await db.createEnrollment({
          userId: user.id,
          courseId: course.id,
          tier: "self_paced",
          status: "active",
        });
        enrolledCount++;
      }
    }
    console.log(`[Stripe] Enrolled user ${normalizedEmail} in ${enrolledCount} courses (bundle)`);
    return {
      enrolled: true,
      message: `Successfully enrolled in all ${enrolledCount} courses!`,
      loginEmail: normalizedEmail,
      ...(tempPassword ? { tempPassword } : {}),
    };
  } else if (metadata.type === "course" && metadata.courseSlug) {
    // Find the course by slug and enroll
    const course = await db.getCourseBySlug(metadata.courseSlug);
    if (!course) {
      console.error("[Stripe] Course not found:", metadata.courseSlug);
      return { enrolled: false, message: `Course not found: ${metadata.courseSlug}` };
    }

    const existing = await db.getUserEnrollmentForCourse(user.id, course.id);
    if (existing) {
      return {
        enrolled: true,
        message: "You are already enrolled in this course!",
        loginEmail: normalizedEmail,
      };
    }

    await db.createEnrollment({
      userId: user.id,
      courseId: course.id,
      tier: "self_paced",
      status: "active",
    });

    console.log(`[Stripe] Enrolled user ${normalizedEmail} in course: ${course.title}`);
    return {
      enrolled: true,
      message: `Successfully enrolled in ${course.title}!`,
      loginEmail: normalizedEmail,
      ...(tempPassword ? { tempPassword } : {}),
    };
  }

  return { enrolled: false, message: "Invalid purchase metadata" };
}

/**
 * Generate a temporary password for new users created via Stripe checkout
 */
function generateTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}
