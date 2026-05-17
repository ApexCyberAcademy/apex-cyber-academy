/**
 * Stripe Checkout Integration
 * Handles checkout session creation and webhook for auto-enrollment
 */
import { Express, Request, Response } from "express";
import Stripe from "stripe";
import crypto from "crypto";
import { getCourseBySlug, getUserByEmail, createEnrollment, getUserEnrollmentForCourse, getDb } from "./db";
import { users } from "../drizzle/schema";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

// Course slug mapping: frontend ID -> database slug
const COURSE_SLUG_MAP: Record<string, string> = {
  "cism": "cism-certified-information-security-manager",
  "secplus": "security-plus-sy0-701",
  "netplus": "network-plus-n10-009",
  "secai": "secai-plus-cy0-001",
  "techplus": "tech-plus-fc0-u71",
  "ceh": "ceh-certified-ethical-hacker",
};

// Course prices in cents (sale prices)
const COURSE_PRICES: Record<string, number> = {
  "cism": 29900,
  "secplus": 4900,
  "netplus": 4900,
  "secai": 3900,
  "techplus": 3500,
  "ceh": 8900,
  "bundle": 39900,
};

// Course display names
const COURSE_NAMES: Record<string, string> = {
  "cism": "ISACA CISM - Certified Information Security Manager",
  "secplus": "CompTIA Security+ (SY0-701)",
  "netplus": "CompTIA Network+ (N10-009)",
  "secai": "CompTIA SecAI+ (CY0-001)",
  "techplus": "CompTIA Tech+ (FC0-U71)",
  "ceh": "EC-Council CEH (Certified Ethical Hacker v13)",
  "bundle": "Complete Bundle - All 5 Courses",
};

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "apex-cyber-salt-2026").digest("hex");
}

function generateTempPassword(): string {
  return "Apex" + crypto.randomBytes(4).toString("hex") + "!";
}

export function registerStripeRoutes(app: Express) {
  if (!STRIPE_SECRET_KEY) {
    console.warn("[Stripe] STRIPE_SECRET_KEY not set, Stripe routes disabled");
    return;
  }

  const stripe = new Stripe(STRIPE_SECRET_KEY);

  // Create checkout session
  app.post("/api/stripe/create-checkout-session", async (req: Request, res: Response) => {
    try {
      const { courseId } = req.body;

      if (!courseId || !COURSE_PRICES[courseId]) {
        return res.status(400).json({ error: "Invalid course" });
      }

      const baseUrl = `${req.protocol}://${req.get("host")}`;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{
          price_data: {
            currency: "usd",
            product_data: {
              name: COURSE_NAMES[courseId],
            },
            unit_amount: COURSE_PRICES[courseId],
          },
          quantity: 1,
        }],
        mode: "payment",
        success_url: `${baseUrl}/enrollment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/course#pricing`,
        metadata: {
          courseId,
        },
        customer_creation: "always",
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("[Stripe] Checkout session error:", error.message);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  // Get session status (called by success page)
  app.get("/api/stripe/session-status", async (req: Request, res: Response) => {
    try {
      const sessionId = req.query.session_id as string;
      if (!sessionId) {
        return res.status(400).json({ error: "Missing session_id" });
      }

      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status !== "paid") {
        return res.json({ status: "unpaid" });
      }

      const email = session.customer_details?.email;
      const courseId = session.metadata?.courseId;

      if (!email || !courseId) {
        return res.json({ status: "paid", error: "Missing email or course info" });
      }

      // Try to create account and enroll
      const result = await enrollUserAfterPayment(email, courseId);

      res.json({
        status: "paid",
        email,
        courseName: COURSE_NAMES[courseId],
        ...result,
      });
    } catch (error: any) {
      console.error("[Stripe] Session status error:", error.message);
      res.status(500).json({ error: "Failed to check session" });
    }
  });

  // Webhook handler (raw body is passed by express.raw middleware)
  app.post("/api/stripe/webhook", async (req: Request, res: Response) => {
    try {
      const sig = req.headers["stripe-signature"] as string;
      if (!sig || !STRIPE_WEBHOOK_SECRET) {
        return res.status(400).send("Missing signature or webhook secret");
      }

      const event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const email = session.customer_details?.email;
        const courseId = session.metadata?.courseId;

        if (email && courseId) {
          await enrollUserAfterPayment(email, courseId);
          console.log(`[Stripe] Enrolled ${email} in ${courseId}`);
        }
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error("[Stripe] Webhook error:", error.message);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  });
}

async function enrollUserAfterPayment(email: string, courseId: string): Promise<{ tempPassword?: string; enrolled: boolean }> {
  const db = await getDb();
  if (!db) return { enrolled: false };

  try {
    // Check if user already exists
    let user = await getUserByEmail(email);
    let tempPassword: string | undefined;

    if (!user) {
      // Create new user with temp password
      tempPassword = generateTempPassword();
      const passwordHash = hashPassword(tempPassword);
      const openId = `local_${crypto.randomUUID()}`;

      await db.insert(users).values({
        openId,
        email,
        name: email.split("@")[0],
        loginMethod: "local",
        passwordHash,
        role: "user",
      });

      user = await getUserByEmail(email);
    }

    if (!user) return { enrolled: false };

    // Enroll in course(s)
    if (courseId === "bundle") {
      // Enroll in all courses
      const allSlugs = Object.values(COURSE_SLUG_MAP);
      for (const slug of allSlugs) {
        const course = await getCourseBySlug(slug);
        if (course) {
          const existing = await getUserEnrollmentForCourse(user.id, course.id);
          if (!existing) {
            await createEnrollment({ userId: user.id, courseId: course.id, tier: "self_paced", status: "active" });
          }
        }
      }
    } else {
      const dbSlug = COURSE_SLUG_MAP[courseId];
      if (dbSlug) {
        const course = await getCourseBySlug(dbSlug);
        if (course) {
          const existing = await getUserEnrollmentForCourse(user.id, course.id);
          if (!existing) {
            await createEnrollment({ userId: user.id, courseId: course.id, tier: "self_paced", status: "active" });
          }
        } else {
          console.warn(`[Stripe] Course not found for slug: ${dbSlug}`);
        }
      }
    }

    return { tempPassword, enrolled: true };
  } catch (error: any) {
    console.error("[Stripe] Enrollment error:", error.message);
    return { enrolled: false };
  }
}
