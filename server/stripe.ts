/**
 * Stripe Checkout Integration
 * Handles checkout session creation, session verification, account creation after payment,
 * and webhook for fallback auto-enrollment.
 */
import { Express, Request, Response } from "express";
import Stripe from "stripe";
import crypto from "crypto";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { sdk } from "./_core/sdk";
import { getCourseBySlug, getUserByEmail, createEnrollment, getUserEnrollmentForCourse, getDb, upsertUser, getUserByOpenId } from "./db";

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

  // ─── Create checkout session ─────────────────────────────────────
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

  // ─── Verify session (called by success page to get email + course info) ───
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

      // Check if user already exists (returning customer)
      const existingUser = await getUserByEmail(email.toLowerCase().trim());

      res.json({
        status: "paid",
        email: email.toLowerCase().trim(),
        courseId,
        courseName: COURSE_NAMES[courseId],
        accountExists: !!existingUser,
      });
    } catch (error: any) {
      console.error("[Stripe] Session status error:", error.message);
      res.status(500).json({ error: "Failed to check session" });
    }
  });

  // ─── Create account after payment (user sets their own password) ───
  app.post("/api/stripe/create-account", async (req: Request, res: Response) => {
    try {
      const { sessionId, password } = req.body as { sessionId?: string; password?: string };

      if (!sessionId || !password) {
        return res.status(400).json({ error: "Session ID and password are required" });
      }

      if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters" });
      }

      // Verify with Stripe that this session was actually paid
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status !== "paid") {
        return res.status(400).json({ error: "Payment not confirmed" });
      }

      const email = session.customer_details?.email?.toLowerCase().trim();
      const courseId = session.metadata?.courseId;

      if (!email || !courseId) {
        return res.status(400).json({ error: "Missing payment details" });
      }

      const db = await getDb();
      if (!db) {
        return res.status(500).json({ error: "Database unavailable" });
      }

      // Check if user already exists
      let user = await getUserByEmail(email);

      if (!user) {
        // Create new user with their chosen password
        const openId = `local-${crypto.createHash("sha256").update(email).digest("hex").slice(0, 32)}`;
        const passwordHash = hashPassword(password);

        await upsertUser({
          openId,
          name: email.split("@")[0],
          email,
          passwordHash,
          loginMethod: "email",
          lastSignedIn: new Date(),
        });

        user = await getUserByOpenId(openId);
      } else {
        // User already exists — update their password to the one they just set
        // (they may have had a temp password from webhook fallback)
        const passwordHash = hashPassword(password);
        await upsertUser({ openId: user.openId, passwordHash, lastSignedIn: new Date() });
      }

      if (!user) {
        return res.status(500).json({ error: "Failed to create account" });
      }

      // Enroll in course(s)
      await enrollUser(user.id, courseId);

      // Create session token and set cookie (auto-login)
      const sessionToken = await sdk.createSessionToken(user.openId, {
        name: user.name || email.split("@")[0],
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      res.json({
        success: true,
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      });
    } catch (error: any) {
      console.error("[Stripe] Create account error:", error.message);
      res.status(500).json({ error: "Failed to create account" });
    }
  });

  // ─── Webhook handler (fallback — creates account if user closes tab) ───
  app.post("/api/stripe/webhook", async (req: Request, res: Response) => {
    try {
      const sig = req.headers["stripe-signature"] as string;
      if (!sig || !STRIPE_WEBHOOK_SECRET) {
        return res.status(400).send("Missing signature or webhook secret");
      }

      const event = stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);

      if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const email = session.customer_details?.email?.toLowerCase().trim();
        const courseId = session.metadata?.courseId;

        if (email && courseId) {
          // Only create account if user hasn't already set up via the success page
          let user = await getUserByEmail(email);

          if (!user) {
            // User closed the tab — create with temp password as fallback
            const tempPassword = generateTempPassword();
            const openId = `local-${crypto.createHash("sha256").update(email).digest("hex").slice(0, 32)}`;
            const passwordHash = hashPassword(tempPassword);

            await upsertUser({
              openId,
              name: email.split("@")[0],
              email,
              passwordHash,
              loginMethod: "email",
              lastSignedIn: new Date(),
            });

            user = await getUserByOpenId(openId);
            console.log(`[Stripe Webhook] Created fallback account for ${email}`);
          }

          if (user) {
            await enrollUser(user.id, courseId);
            console.log(`[Stripe Webhook] Enrolled ${email} in ${courseId}`);
          }
        }
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error("[Stripe] Webhook error:", error.message);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  });
}

// ─── Helper: Enroll user in course(s) ───────────────────────────────
async function enrollUser(userId: number, courseId: string): Promise<void> {
  if (courseId === "bundle") {
    const allSlugs = Object.values(COURSE_SLUG_MAP);
    for (const slug of allSlugs) {
      const course = await getCourseBySlug(slug);
      if (course) {
        const existing = await getUserEnrollmentForCourse(userId, course.id);
        if (!existing) {
          await createEnrollment({ userId, courseId: course.id, tier: "self_paced", status: "active" });
        }
      }
    }
  } else {
    const dbSlug = COURSE_SLUG_MAP[courseId];
    if (dbSlug) {
      const course = await getCourseBySlug(dbSlug);
      if (course) {
        const existing = await getUserEnrollmentForCourse(userId, course.id);
        if (!existing) {
          await createEnrollment({ userId, courseId: course.id, tier: "self_paced", status: "active" });
        }
      } else {
        console.warn(`[Stripe] Course not found for slug: ${dbSlug}`);
      }
    }
  }
}
