/**
 * OAuth Routes - Stub
 * Manus OAuth replaced with built-in email/password auth.
 * See server/localAuth.ts for the new login/register endpoints.
 */
import type { Express } from "express";

export function registerOAuthRoutes(_app: Express) {
  // No-op: Manus OAuth removed. Login is now at /api/auth/login
}
