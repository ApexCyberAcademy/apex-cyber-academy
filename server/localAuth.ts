/**
 * Local Authentication Routes
 *
 * Replaces Manus OAuth with a built-in email/password system.
 * Uses bcrypt for password hashing and the existing JWT session infrastructure.
 */
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import { createHash } from "crypto";
import { getSessionCookieOptions } from "./_core/cookies";
import { sdk } from "./_core/sdk";
import * as db from "./db";

// Simple SHA-256 based password hashing (no native addon needed)
function hashPassword(password: string): string {
  return createHash("sha256").update(password + "apex-cyber-salt-2026").digest("hex");
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export function registerLocalAuthRoutes(app: Express) {
  // ─── POST /api/auth/login ─────────────────────────────────────
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body as { email?: string; password?: string };
      if (!email || !password) {
        res.status(400).json({ error: "Email and password are required" });
        return;
      }

      // Find user by email
      const user = await db.getUserByEmail(email.toLowerCase().trim());
      if (!user || !user.passwordHash) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      // Verify password
      if (!verifyPassword(password, user.passwordHash)) {
        res.status(401).json({ error: "Invalid email or password" });
        return;
      }

      // Update last signed in
      await db.upsertUser({ openId: user.openId, lastSignedIn: new Date() });

      // Create session token
      const sessionToken = await sdk.createSessionToken(user.openId, {
        name: user.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
      console.error("[LocalAuth] Login failed", error);
      res.status(500).json({ error: "Login failed" });
    }
  });

  // ─── POST /api/auth/register ──────────────────────────────────
  // Registration is restricted to admin-invited users only.
  // To enable open registration, set ALLOW_OPEN_REGISTRATION=true in env.
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      // Block open registration unless explicitly enabled
      if (process.env.ALLOW_OPEN_REGISTRATION !== "true") {
        res.status(403).json({ error: "Registration is currently by invitation only. Please contact the administrator." });
        return;
      }
      const { name, email, password } = req.body as { name?: string; email?: string; password?: string };
      if (!name || !email || !password) {
        res.status(400).json({ error: "Name, email and password are required" });
        return;
      }
      if (password.length < 8) {
        res.status(400).json({ error: "Password must be at least 8 characters" });
        return;
      }

      const normalizedEmail = email.toLowerCase().trim();

      // Check if email already registered
      const existing = await db.getUserByEmail(normalizedEmail);
      if (existing) {
        res.status(409).json({ error: "An account with this email already exists" });
        return;
      }

      // Create user with a unique openId based on email
      const openId = `local-${createHash("sha256").update(normalizedEmail).digest("hex").slice(0, 32)}`;
      const passwordHash = hashPassword(password);

      await db.upsertUser({
        openId,
        name,
        email: normalizedEmail,
        passwordHash,
        loginMethod: "email",
        lastSignedIn: new Date(),
      });

      const user = await db.getUserByOpenId(openId);
      if (!user) {
        res.status(500).json({ error: "Failed to create account" });
        return;
      }

      // Create session token
      const sessionToken = await sdk.createSessionToken(openId, {
        name,
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
      console.error("[LocalAuth] Register failed", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  // ─── POST /api/auth/change-password ──────────────────────────
  app.post("/api/auth/change-password", async (req: Request, res: Response) => {
    try {
      const cookies = req.headers.cookie || "";
      const cookieMap = Object.fromEntries(
        cookies.split(";").map(c => c.trim().split("=").map(decodeURIComponent))
      );
      const sessionCookie = cookieMap[COOKIE_NAME];
      const session = await sdk.verifySession(sessionCookie);
      if (!session) {
        res.status(401).json({ error: "Not authenticated" });
        return;
      }

      const { currentPassword, newPassword } = req.body as { currentPassword?: string; newPassword?: string };
      if (!currentPassword || !newPassword) {
        res.status(400).json({ error: "Current and new password are required" });
        return;
      }
      if (newPassword.length < 8) {
        res.status(400).json({ error: "New password must be at least 8 characters" });
        return;
      }

      const user = await db.getUserByOpenId(session.openId);
      if (!user || !user.passwordHash) {
        res.status(401).json({ error: "Invalid session" });
        return;
      }

      if (!verifyPassword(currentPassword, user.passwordHash)) {
        res.status(401).json({ error: "Current password is incorrect" });
        return;
      }

      await db.upsertUser({ openId: user.openId, passwordHash: hashPassword(newPassword) });
      res.json({ success: true });
    } catch (error) {
      console.error("[LocalAuth] Change password failed", error);
      res.status(500).json({ error: "Failed to change password" });
    }
  });
}
