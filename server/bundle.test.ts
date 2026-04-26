import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createStudentContext(id = 2): TrpcContext {
  const user: AuthenticatedUser = {
    id,
    openId: "student-user",
    email: "student@example.com",
    name: "Student User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("bundle routes", () => {
  it("bundle.list returns an array of bundles", async () => {
    const caller = appRouter.createCaller(createStudentContext());
    const bundles = await caller.bundle.list();
    expect(Array.isArray(bundles)).toBe(true);
  });

  it("bundle.getBySlug returns null for non-existent slug", async () => {
    const caller = appRouter.createCaller(createStudentContext());
    const result = await caller.bundle.getBySlug({ slug: "non-existent-bundle-xyz" });
    expect(result).toBeNull();
  });
});

describe("admin bundle routes", () => {
  it("admin.bundles returns bundles list for admin", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const bundles = await caller.admin.bundles();
    expect(Array.isArray(bundles)).toBe(true);
  });

  it("admin.enrollStudentInBundle fails for non-existent bundle", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const result = await caller.admin.enrollStudentInBundle({
      userId: 999,
      bundleId: 99999,
      tier: "self_paced",
    });
    expect(result.success).toBe(false);
    expect(result.message).toBe("Bundle not found");
  });

  it("admin.courses returns all courses for admin", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const coursesList = await caller.admin.courses();
    expect(Array.isArray(coursesList)).toBe(true);
    // Should have at least 5 courses
    expect(coursesList.length).toBeGreaterThanOrEqual(5);
  });

  it("admin.stats returns stats object for admin", async () => {
    const caller = appRouter.createCaller(createAdminContext());
    const stats = await caller.admin.stats();
    expect(stats).toBeDefined();
    expect(typeof stats.totalStudents).toBe("number");
    expect(typeof stats.totalEnrollments).toBe("number");
    expect(typeof stats.totalCourses).toBe("number");
  });
});

describe("enrollment access control", () => {
  it("enrollment.myEnrollments returns array for authenticated user", async () => {
    const caller = appRouter.createCaller(createStudentContext());
    const enrollments = await caller.enrollment.myEnrollments();
    expect(Array.isArray(enrollments)).toBe(true);
  });

  it("enrollment.checkEnrollment returns null for non-enrolled course", async () => {
    const caller = appRouter.createCaller(createStudentContext(999));
    const result = await caller.enrollment.checkEnrollment({ courseId: 99999 });
    expect(result).toBeNull();
  });

  it("lecture.get returns null for non-enrolled user", async () => {
    const caller = appRouter.createCaller(createStudentContext(999));
    const result = await caller.lecture.get({ lectureId: 1 });
    // Should be null because user 999 is not enrolled
    expect(result).toBeNull();
  });
});

describe("course routes", () => {
  it("course.list returns all 5 courses", async () => {
    const caller = appRouter.createCaller(createStudentContext());
    const coursesList = await caller.course.list();
    expect(Array.isArray(coursesList)).toBe(true);
    expect(coursesList.length).toBeGreaterThanOrEqual(5);

    const titles = coursesList.map((c) => c.title);
    expect(titles).toContain("CompTIA Security+ (SY0-701)");
    expect(titles).toContain("CompTIA SecAI+ (CY0-001)");
    expect(titles).toContain("ISACA CISM");
    expect(titles).toContain("CompTIA Network+ (N10-009)");
    expect(titles).toContain("CompTIA Tech+ (FC0-U71)");
  });

  it("course.getBySlug returns null for non-existent slug", async () => {
    const caller = appRouter.createCaller(createStudentContext());
    const result = await caller.course.getBySlug({ slug: "non-existent-course-xyz" });
    expect(result).toBeNull();
  });
});
