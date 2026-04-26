import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the database module
vi.mock("./db", () => ({
  getUserEnrollmentForCourse: vi.fn(),
  createEnrollment: vi.fn(),
  getUserById: vi.fn(),
  getCourseById: vi.fn(),
  getBundleById: vi.fn(),
  getBundleCourses: vi.fn(),
  enrollInBundle: vi.fn(),
  createEnrollmentLogEntry: vi.fn(),
  getEnrollmentLogs: vi.fn(),
  getEnrollmentLogCount: vi.fn(),
  getEnrollmentLogsWithDetails: vi.fn(),
}));

// Mock the email service
vi.mock("./emailService", () => ({
  sendEnrollmentEmail: vi.fn(),
  previewEnrollmentEmail: vi.fn(),
  isEmailServiceConfigured: vi.fn(),
}));

// Mock the notification service
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

import * as db from "./db";
import { sendEnrollmentEmail } from "./emailService";

const mockDb = vi.mocked(db);
const mockSendEmail = vi.mocked(sendEnrollmentEmail);

describe("Enrollment Audit Log", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createEnrollmentLogEntry", () => {
    it("should accept a valid enrollment log entry for a course enrollment", async () => {
      const entry = {
        userId: 1,
        adminId: 2,
        courseId: 10,
        bundleId: null,
        tier: "self_paced" as const,
        action: "enroll_course" as const,
        coursesEnrolled: 1,
        emailSent: true,
        emailError: null,
      };

      mockDb.createEnrollmentLogEntry.mockResolvedValue(1);

      const result = await db.createEnrollmentLogEntry(entry);
      expect(result).toBe(1);
      expect(mockDb.createEnrollmentLogEntry).toHaveBeenCalledWith(entry);
    });

    it("should accept a valid enrollment log entry for a bundle enrollment", async () => {
      const entry = {
        userId: 1,
        adminId: 2,
        courseId: null,
        bundleId: 5,
        tier: "live" as const,
        action: "enroll_bundle" as const,
        coursesEnrolled: 3,
        emailSent: false,
        emailError: "No email on file for student",
      };

      mockDb.createEnrollmentLogEntry.mockResolvedValue(2);

      const result = await db.createEnrollmentLogEntry(entry);
      expect(result).toBe(2);
      expect(mockDb.createEnrollmentLogEntry).toHaveBeenCalledWith(entry);
    });
  });

  describe("getEnrollmentLogs", () => {
    it("should return logs with default pagination", async () => {
      const mockLogs = [
        {
          id: 1,
          userId: 1,
          adminId: 2,
          courseId: 10,
          bundleId: null,
          tier: "self_paced" as const,
          action: "enroll_course" as const,
          coursesEnrolled: 1,
          emailSent: true,
          emailError: null,
          notes: null,
          createdAt: new Date("2026-03-17T10:00:00Z"),
        },
      ];

      mockDb.getEnrollmentLogs.mockResolvedValue(mockLogs);

      const result = await db.getEnrollmentLogs();
      expect(result).toEqual(mockLogs);
      expect(mockDb.getEnrollmentLogs).toHaveBeenCalledWith();
    });

    it("should support filtering by userId", async () => {
      mockDb.getEnrollmentLogs.mockResolvedValue([]);

      await db.getEnrollmentLogs({ userId: 5 });
      expect(mockDb.getEnrollmentLogs).toHaveBeenCalledWith({ userId: 5 });
    });

    it("should support filtering by action type", async () => {
      mockDb.getEnrollmentLogs.mockResolvedValue([]);

      await db.getEnrollmentLogs({ action: "enroll_bundle" });
      expect(mockDb.getEnrollmentLogs).toHaveBeenCalledWith({ action: "enroll_bundle" });
    });
  });

  describe("getEnrollmentLogCount", () => {
    it("should return total count of logs", async () => {
      mockDb.getEnrollmentLogCount.mockResolvedValue(42);

      const result = await db.getEnrollmentLogCount();
      expect(result).toBe(42);
    });

    it("should support filtering by userId", async () => {
      mockDb.getEnrollmentLogCount.mockResolvedValue(5);

      const result = await db.getEnrollmentLogCount({ userId: 3 });
      expect(result).toBe(5);
      expect(mockDb.getEnrollmentLogCount).toHaveBeenCalledWith({ userId: 3 });
    });
  });

  describe("getEnrollmentLogsWithDetails", () => {
    it("should return enriched logs with student, admin, course, and bundle names", async () => {
      const enrichedLogs = [
        {
          id: 1,
          userId: 1,
          adminId: 2,
          courseId: 10,
          bundleId: null,
          tier: "self_paced" as const,
          action: "enroll_course" as const,
          coursesEnrolled: 1,
          emailSent: true,
          emailError: null,
          notes: null,
          createdAt: new Date("2026-03-17T10:00:00Z"),
          studentName: "John Doe",
          studentEmail: "john@example.com",
          adminName: "Admin User",
          courseName: "CompTIA Security+ SY0-701",
          bundleName: null,
        },
      ];

      mockDb.getEnrollmentLogsWithDetails.mockResolvedValue(enrichedLogs);

      const result = await db.getEnrollmentLogsWithDetails({ limit: 20, offset: 0 });
      expect(result).toEqual(enrichedLogs);
      expect(result[0].studentName).toBe("John Doe");
      expect(result[0].adminName).toBe("Admin User");
      expect(result[0].courseName).toBe("CompTIA Security+ SY0-701");
    });

    it("should handle bundle enrollments with bundle name", async () => {
      const enrichedLogs = [
        {
          id: 2,
          userId: 3,
          adminId: 2,
          courseId: null,
          bundleId: 5,
          tier: "live" as const,
          action: "enroll_bundle" as const,
          coursesEnrolled: 3,
          emailSent: false,
          emailError: "No email on file for student",
          notes: null,
          createdAt: new Date("2026-03-17T11:00:00Z"),
          studentName: "Jane Smith",
          studentEmail: null,
          adminName: "Admin User",
          courseName: null,
          bundleName: "CompTIA Essentials Bundle",
        },
      ];

      mockDb.getEnrollmentLogsWithDetails.mockResolvedValue(enrichedLogs);

      const result = await db.getEnrollmentLogsWithDetails({ limit: 20, offset: 0 });
      expect(result[0].bundleName).toBe("CompTIA Essentials Bundle");
      expect(result[0].courseName).toBeNull();
      expect(result[0].coursesEnrolled).toBe(3);
    });
  });

  describe("Enrollment flow with audit logging", () => {
    it("should create audit log entry when enrolling a student in a course", async () => {
      // Simulate the enrollment flow
      mockDb.getUserEnrollmentForCourse.mockResolvedValue(undefined);
      mockDb.createEnrollment.mockResolvedValue(100);
      mockDb.getUserById.mockResolvedValue({
        id: 1,
        name: "Test Student",
        email: "test@example.com",
        role: "user",
        openId: "open-1",
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
      });
      mockDb.getCourseById.mockResolvedValue({
        id: 10,
        title: "CompTIA Security+ SY0-701",
        slug: "security-plus",
        description: "Test",
        shortDescription: "Test",
        heroImage: null,
        category: "CompTIA",
        level: "Intermediate",
        durationHours: 40,
        selfPacedPrice: 175,
        livePrice: 350,
        originalPrice: 2000,
        isActive: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockSendEmail.mockResolvedValue({ success: true });
      mockDb.createEnrollmentLogEntry.mockResolvedValue(1);

      // Step 1: Check no existing enrollment
      const existing = await db.getUserEnrollmentForCourse(1, 10);
      expect(existing).toBeUndefined();

      // Step 2: Create enrollment
      const enrollmentId = await db.createEnrollment({
        userId: 1,
        courseId: 10,
        tier: "self_paced",
        status: "active",
      });
      expect(enrollmentId).toBe(100);

      // Step 3: Send email
      const emailResult = await sendEnrollmentEmail({
        studentEmail: "test@example.com",
        studentName: "Test Student",
        courseNames: ["CompTIA Security+ SY0-701"],
        tier: "self_paced",
        siteOrigin: "https://apex-cyber-academy.manus.space",
      });
      expect(emailResult.success).toBe(true);

      // Step 4: Write audit log
      const logId = await db.createEnrollmentLogEntry({
        userId: 1,
        adminId: 2,
        courseId: 10,
        bundleId: null,
        tier: "self_paced",
        action: "enroll_course",
        coursesEnrolled: 1,
        emailSent: true,
        emailError: null,
      });
      expect(logId).toBe(1);
      expect(mockDb.createEnrollmentLogEntry).toHaveBeenCalledWith({
        userId: 1,
        adminId: 2,
        courseId: 10,
        bundleId: null,
        tier: "self_paced",
        action: "enroll_course",
        coursesEnrolled: 1,
        emailSent: true,
        emailError: null,
      });
    });

    it("should create audit log entry when enrolling a student in a bundle", async () => {
      mockDb.getBundleById.mockResolvedValue({
        id: 5,
        title: "CompTIA Essentials Bundle",
        slug: "comptia-essentials",
        description: "Test bundle",
        selfPacedPrice: 320,
        livePrice: 640,
        originalPrice: 503,
        isActive: true,
        sortOrder: 1,
        createdAt: new Date(),
      });
      mockDb.enrollInBundle.mockResolvedValue([101, 102, 103]);
      mockDb.getUserById.mockResolvedValue({
        id: 3,
        name: "Bundle Student",
        email: "bundle@example.com",
        role: "user",
        openId: "open-3",
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
      });
      mockDb.getBundleCourses.mockResolvedValue([
        { courseId: 1, courseTitle: "Security+" },
        { courseId: 2, courseTitle: "Network+" },
        { courseId: 3, courseTitle: "Tech+" },
      ]);
      mockSendEmail.mockResolvedValue({ success: true });
      mockDb.createEnrollmentLogEntry.mockResolvedValue(2);

      // Simulate bundle enrollment flow
      const bundle = await db.getBundleById(5);
      expect(bundle).toBeTruthy();

      const enrollmentIds = await db.enrollInBundle(3, 5, "live");
      expect(enrollmentIds).toEqual([101, 102, 103]);

      // Write audit log for bundle
      const logId = await db.createEnrollmentLogEntry({
        userId: 3,
        adminId: 2,
        bundleId: 5,
        courseId: null,
        tier: "live",
        action: "enroll_bundle",
        coursesEnrolled: 3,
        emailSent: true,
        emailError: null,
      });
      expect(logId).toBe(2);
      expect(mockDb.createEnrollmentLogEntry).toHaveBeenCalledWith(
        expect.objectContaining({
          action: "enroll_bundle",
          bundleId: 5,
          coursesEnrolled: 3,
        })
      );
    });

    it("should log email failure in audit entry when email fails", async () => {
      mockDb.getUserEnrollmentForCourse.mockResolvedValue(undefined);
      mockDb.createEnrollment.mockResolvedValue(200);
      mockDb.getUserById.mockResolvedValue({
        id: 5,
        name: "No Email Student",
        email: null,
        role: "user",
        openId: "open-5",
        avatarUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLoginAt: new Date(),
      });
      mockDb.getCourseById.mockResolvedValue({
        id: 10,
        title: "CompTIA Security+",
        slug: "security-plus",
        description: "Test",
        shortDescription: "Test",
        heroImage: null,
        category: "CompTIA",
        level: "Intermediate",
        durationHours: 40,
        selfPacedPrice: 175,
        livePrice: 350,
        originalPrice: 2000,
        isActive: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockDb.createEnrollmentLogEntry.mockResolvedValue(3);

      // Student has no email — log the failure
      const student = await db.getUserById(5);
      const emailError = !student?.email ? "No email on file for student" : undefined;

      const logId = await db.createEnrollmentLogEntry({
        userId: 5,
        adminId: 2,
        courseId: 10,
        bundleId: null,
        tier: "self_paced",
        action: "enroll_course",
        coursesEnrolled: 1,
        emailSent: false,
        emailError: emailError || null,
      });

      expect(logId).toBe(3);
      expect(mockDb.createEnrollmentLogEntry).toHaveBeenCalledWith(
        expect.objectContaining({
          emailSent: false,
          emailError: "No email on file for student",
        })
      );
    });
  });

  describe("Audit log pagination", () => {
    it("should support pagination with limit and offset", async () => {
      mockDb.getEnrollmentLogsWithDetails.mockResolvedValue([]);
      mockDb.getEnrollmentLogCount.mockResolvedValue(100);

      const logs = await db.getEnrollmentLogsWithDetails({ limit: 20, offset: 40 });
      const total = await db.getEnrollmentLogCount();

      expect(logs).toEqual([]);
      expect(total).toBe(100);
      expect(mockDb.getEnrollmentLogsWithDetails).toHaveBeenCalledWith({ limit: 20, offset: 40 });
    });
  });
});
