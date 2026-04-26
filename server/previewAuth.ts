/**
 * Preview Mode - Demo Student Login
 * 
 * Creates a "Demo Student" user, enrolls them in all published courses,
 * and sets a session cookie so they can experience the full student flow.
 * 
 * Controlled by VITE_PREVIEW_MODE env var.
 * Set to "false" in Settings → Secrets before going live on GoDaddy.
 */
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import { getSessionCookieOptions } from "./_core/cookies";
import { sdk } from "./_core/sdk";
import * as db from "./db";

const DEMO_OPEN_ID = "demo-student-preview-001";
const DEMO_NAME = "Demo Student";
const DEMO_EMAIL = "demo@apexcyberacademy.org";

export function registerPreviewRoutes(app: Express) {
  // Only register if preview mode is enabled
  const previewEnabled = process.env.VITE_PREVIEW_MODE === "true";

  if (!previewEnabled) {
    console.log("[Preview] Preview mode is disabled");
    return;
  }

  console.log("[Preview] Preview mode is ENABLED - /api/preview-login route active");

  app.get("/api/preview-login", async (req: Request, res: Response) => {
    try {
      // 1. Upsert the demo student user
      await db.upsertUser({
        openId: DEMO_OPEN_ID,
        name: DEMO_NAME,
        email: DEMO_EMAIL,
        loginMethod: "preview",
        lastSignedIn: new Date(),
      });

      // 2. Get the user from DB to get their ID
      const user = await db.getUserByOpenId(DEMO_OPEN_ID);
      if (!user) {
        res.status(500).json({ error: "Failed to create demo user" });
        return;
      }

      // 3. Get all published courses and enroll demo user in each
      const allCourses = await db.getAllCourses();
      for (const course of allCourses) {
        const existing = await db.getUserEnrollmentForCourse(user.id, course.id);
        if (!existing) {
          await db.createEnrollment({
            userId: user.id,
            courseId: course.id,
            tier: "self_paced",
            status: "active",
          });
        }
      }

      // 4. Create a session token and set the cookie
      const sessionToken = await sdk.createSessionToken(DEMO_OPEN_ID, {
        name: DEMO_NAME,
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      // 5. Redirect to dashboard
      const returnTo = (req.query.returnTo as string) || "/dashboard";
      res.redirect(302, returnTo);
    } catch (error) {
      console.error("[Preview] Failed to create demo session:", error);
      res.status(500).json({ error: "Preview login failed" });
    }
  });
}
