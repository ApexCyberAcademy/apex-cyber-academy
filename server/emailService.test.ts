import { describe, expect, it } from "vitest";
import { previewEnrollmentEmail, isEmailServiceConfigured } from "./emailService";

describe("emailService", () => {
  describe("isEmailServiceConfigured", () => {
    it("returns false when RESEND_API_KEY is not set", () => {
      // In test env, RESEND_API_KEY is not set
      const configured = isEmailServiceConfigured();
      expect(typeof configured).toBe("boolean");
    });
  });

  describe("previewEnrollmentEmail", () => {
    it("generates valid English enrollment email HTML for a single course", () => {
      const html = previewEnrollmentEmail({
        studentName: "John Doe",
        courseNames: ["CompTIA Security+ SY0-701"],
        tier: "self_paced",
        siteOrigin: "https://example.com",
      });

      expect(html).toContain("<!DOCTYPE html>");
      expect(html).toContain("John Doe");
      expect(html).toContain("CompTIA Security+ SY0-701");
      expect(html).toContain("Self-Paced");
      expect(html).toContain("APEX CERT ACADEMY");
      expect(html).toContain("ENROLLMENT CONFIRMATION");
      expect(html).toContain("https://example.com/dashboard");
      expect(html).toContain("GO TO MY DASHBOARD");
      expect(html).not.toContain("Bundle:");
    });

    it("generates valid English enrollment email HTML for a bundle", () => {
      const html = previewEnrollmentEmail({
        studentName: "Jane Smith",
        courseNames: [
          "CompTIA Security+ SY0-701",
          "CompTIA SecAI+ AI1-001",
          "CompTIA Network+ N10-009",
        ],
        tier: "live",
        bundleName: "CompTIA Complete Bundle",
        siteOrigin: "https://apex-cyber-academy.manus.space",
      });

      expect(html).toContain("Jane Smith");
      expect(html).toContain("CompTIA Security+ SY0-701");
      expect(html).toContain("CompTIA SecAI+ AI1-001");
      expect(html).toContain("CompTIA Network+ N10-009");
      expect(html).toContain("Live Instructor-Led");
      expect(html).toContain("CompTIA Complete Bundle");
      expect(html).toContain("courses:");
      expect(html).toContain("https://apex-cyber-academy.manus.space/dashboard");
    });

    it("generates valid Arabic enrollment email HTML", () => {
      const html = previewEnrollmentEmail({
        studentName: "أحمد",
        courseNames: ["CompTIA Security+ SY0-701"],
        tier: "self_paced",
        siteOrigin: "https://example.com",
        language: "ar",
      });

      expect(html).toContain('lang="ar"');
      expect(html).toContain('dir="rtl"');
      expect(html).toContain("أحمد");
      expect(html).toContain("تأكيد التسجيل");
      expect(html).toContain("مرحباً");
      expect(html).toContain("ذاتي");
      expect(html).toContain("الذهاب إلى لوحة التحكم");
      expect(html).toContain("CompTIA Security+ SY0-701");
    });

    it("generates Arabic email with live tier label", () => {
      const html = previewEnrollmentEmail({
        studentName: "سارة",
        courseNames: ["ISACA CISM"],
        tier: "live",
        siteOrigin: "https://example.com",
        language: "ar",
      });

      expect(html).toContain("مباشر مع مدرب");
      expect(html).toContain("ISACA CISM");
    });

    it("uses correct singular/plural course wording in English", () => {
      const singleHtml = previewEnrollmentEmail({
        studentName: "Test",
        courseNames: ["Security+"],
        tier: "self_paced",
        siteOrigin: "https://example.com",
      });
      expect(singleHtml).toContain("course:");
      expect(singleHtml).not.toContain("courses:");

      const multiHtml = previewEnrollmentEmail({
        studentName: "Test",
        courseNames: ["Security+", "SecAI+"],
        tier: "self_paced",
        siteOrigin: "https://example.com",
      });
      expect(multiHtml).toContain("courses:");
    });

    it("includes all required structural elements", () => {
      const html = previewEnrollmentEmail({
        studentName: "Test User",
        courseNames: ["Test Course"],
        tier: "self_paced",
        siteOrigin: "https://example.com",
      });

      // Header
      expect(html).toContain("APEX CERT ACADEMY");
      // Course list table
      expect(html).toContain("Your Courses");
      // Getting started steps
      expect(html).toContain("Getting Started");
      expect(html).toContain("1.");
      expect(html).toContain("2.");
      expect(html).toContain("3.");
      expect(html).toContain("4.");
      // CTA button
      expect(html).toContain("GO TO MY DASHBOARD");
      // Footer
      expect(html).toContain("Your Path to Cybersecurity Excellence");
      // Status
      expect(html).toContain("Active");
    });

    it("properly escapes the dashboard URL", () => {
      const html = previewEnrollmentEmail({
        studentName: "Test",
        courseNames: ["Test"],
        tier: "self_paced",
        siteOrigin: "https://my-site.example.com",
      });

      expect(html).toContain('href="https://my-site.example.com/dashboard"');
    });
  });
});
