import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ──────────────────────────────────────────────────────────────
// Helpers to build mock tRPC contexts
// ──────────────────────────────────────────────────────────────

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function makeUser(overrides: Partial<AuthenticatedUser> = {}): AuthenticatedUser {
  return {
    id: 1,
    openId: "test-user-001",
    email: "student@apex.test",
    name: "Test Student",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    ...overrides,
  };
}

function makeCtx(user: AuthenticatedUser | null = null): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

// ──────────────────────────────────────────────────────────────
// Mock the database layer so tests don't need a real DB
// ──────────────────────────────────────────────────────────────

vi.mock("./db", () => ({
  getAllCourses: vi.fn().mockResolvedValue([
    { id: 1, title: "CompTIA Security+ (SY0-701)", slug: "security-plus-sy0-701", code: "SY0-701", description: "Industry-leading cybersecurity certification prep", duration: 28, totalSessions: 14, deliveryMode: "self_paced", isActive: true, sortOrder: 1, createdAt: new Date() },
    { id: 2, title: "CompTIA SecAI+ (CY0-001)", slug: "secai-plus-cy0-001", code: "CY0-001", description: "AI meets cybersecurity", duration: 20, totalSessions: 10, deliveryMode: "live", isActive: true, sortOrder: 2, createdAt: new Date() },
  ]),
  getCourseBySlug: vi.fn().mockImplementation(async (slug: string) => {
    if (slug === "security-plus-sy0-701") {
      return { id: 1, title: "CompTIA Security+ (SY0-701)", slug, code: "SY0-701", description: "desc", duration: 28, totalSessions: 14, deliveryMode: "self_paced", isActive: true, sortOrder: 1, createdAt: new Date() };
    }
    return null;
  }),
  getModulesByCourseId: vi.fn().mockResolvedValue([
    { id: 1, courseId: 1, title: "General Security Concepts", sortOrder: 1, examWeight: "12%", totalLectures: 3 },
  ]),
  getLecturesByCourseId: vi.fn().mockResolvedValue([
    { id: 1, moduleId: 1, courseId: 1, title: "Day 1: Security Controls", slug: "day-1-security-controls", sortOrder: 1, durationMinutes: 120, content: "# Lecture content" },
  ]),
  getQuizzesByCourseId: vi.fn().mockResolvedValue([
    { id: 1, moduleId: 1, courseId: 1, title: "Module 1 Quiz", quizType: "module", totalQuestions: 15, passingScore: 70, timeLimitMinutes: null },
  ]),
  getUserEnrollments: vi.fn().mockResolvedValue([
    { id: 1, userId: 1, courseId: 1, tier: "self_paced", status: "active", enrolledAt: new Date() },
  ]),
  getCourseById: vi.fn().mockResolvedValue(
    { id: 1, title: "CompTIA Security+ (SY0-701)", slug: "security-plus-sy0-701", code: "SY0-701" },
  ),
  getCourseProgressStats: vi.fn().mockResolvedValue({ completedLectures: 3, totalLectures: 14, percentage: 21 }),
  getUserEnrollmentForCourse: vi.fn().mockResolvedValue(
    { id: 1, userId: 1, courseId: 1, tier: "self_paced", status: "active" },
  ),
  createEnrollment: vi.fn().mockResolvedValue(99),
  getLectureById: vi.fn().mockResolvedValue(
    { id: 1, moduleId: 1, courseId: 1, title: "Day 1: Security Controls", slug: "day-1", sortOrder: 1, durationMinutes: 120, content: "# Content", arabicContent: "# محتوى" },
  ),
  updateLectureAccess: vi.fn().mockResolvedValue(undefined),
  markLectureComplete: vi.fn().mockResolvedValue(undefined),
  getUserLectureProgress: vi.fn().mockResolvedValue([]),
  getQuizById: vi.fn().mockResolvedValue(
    { id: 1, moduleId: 1, courseId: 1, title: "Module 1 Quiz", quizType: "module", totalQuestions: 2, passingScore: 70, timeLimitMinutes: null },
  ),
  getQuestionsByQuizId: vi.fn().mockResolvedValue([
    { id: 1, quizId: 1, questionText: "Q1?", optionA: "A", optionB: "B", optionC: "C", optionD: "D", correctAnswer: "B", explanation: "B is correct", objective: "1.1", sortOrder: 1 },
    { id: 2, quizId: 1, questionText: "Q2?", optionA: "A", optionB: "B", optionC: "C", optionD: "D", correctAnswer: "C", explanation: "C is correct", objective: "1.2", sortOrder: 2 },
  ]),
  createQuizAttempt: vi.fn().mockResolvedValue(42),
  getUserQuizAttempts: vi.fn().mockResolvedValue([]),
  getBestQuizAttempt: vi.fn().mockResolvedValue(null),
  getAdminStats: vi.fn().mockResolvedValue({ totalStudents: 5, totalEnrollments: 8, totalCourses: 2, totalQuizAttempts: 15 }),
  getAllStudents: vi.fn().mockResolvedValue([]),
  getAllEnrollments: vi.fn().mockResolvedValue([]),
  getStudentProgress: vi.fn().mockResolvedValue([]),
  getAllCoursesAdmin: vi.fn().mockResolvedValue([]),
  getLecturesByModuleId: vi.fn().mockResolvedValue([]),
  getLectureBySlug: vi.fn().mockResolvedValue(null),
  getUserCertificates: vi.fn().mockResolvedValue([
    { id: 1, userId: 1, courseId: 1, courseTitle: "CompTIA Security+ (SY0-701)", certCode: "SY0-701", studentName: "Test Student", certificateNumber: "APEX-SY0701-000001", score: 85, pdfUrl: "https://cdn.example.com/cert.pdf", issuedAt: new Date() },
  ]),
  getUserBadges: vi.fn().mockResolvedValue([
    { id: 1, userId: 1, courseId: 1, badgeType: "course_complete", title: "Security+ Certified", iconEmoji: "\uD83C\uDF96\uFE0F", earnedAt: new Date() },
  ]),
  getCertificateForCourse: vi.fn().mockImplementation(async (userId: number, courseId: number) => {
    if (courseId === 1) return { id: 1, certificateNumber: "APEX-SY0701-000001", score: 85, pdfUrl: "https://cdn.example.com/cert.pdf", issuedAt: new Date() };
    return null;
  }),
  getUserBadgesForCourse: vi.fn().mockResolvedValue([
    { id: 1, badgeType: "course_complete", title: "Security+ Certified", iconEmoji: "\uD83C\uDF96\uFE0F", earnedAt: new Date() },
  ]),
  getCertificateByNumber: vi.fn().mockImplementation(async (certNumber: string) => {
    if (certNumber === "APEX-SY0701-000001") return {
      id: 1, studentName: "Test Student", courseTitle: "CompTIA Security+ (SY0-701)",
      certCode: "SY0-701", score: 85, issuedAt: new Date(), certificateNumber: "APEX-SY0701-000001",
    };
    return null;
  }),
  getAllCertificatesAdmin: vi.fn().mockResolvedValue([]),
  hasBadge: vi.fn().mockResolvedValue(false),
  createCertificate: vi.fn().mockResolvedValue(1),
  createBadge: vi.fn().mockResolvedValue(1),
  getNextCertificateNumber: vi.fn().mockResolvedValue("APEX-SY0701-000002"),
  updateCertificatePdfUrl: vi.fn().mockResolvedValue(undefined),
}));

// ──────────────────────────────────────────────────────────────
// COURSE ROUTES (public)
// ──────────────────────────────────────────────────────────────

describe("course.list", () => {
  it("returns all courses without authentication", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const courses = await caller.course.list();

    expect(courses).toHaveLength(2);
    expect(courses[0].title).toContain("Security+");
    expect(courses[1].title).toContain("SecAI+");
  });
});

describe("course.getBySlug", () => {
  it("returns course with modules, lectures, and quizzes", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.course.getBySlug({ slug: "security-plus-sy0-701" });

    expect(result).not.toBeNull();
    expect(result!.course.code).toBe("SY0-701");
    expect(result!.modules).toHaveLength(1);
    expect(result!.lectures).toHaveLength(1);
    expect(result!.quizzes).toHaveLength(1);
  });

  it("returns null for non-existent slug", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.course.getBySlug({ slug: "non-existent" });
    expect(result).toBeNull();
  });
});

// ──────────────────────────────────────────────────────────────
// ENROLLMENT ROUTES (protected)
// ──────────────────────────────────────────────────────────────

describe("enrollment.myEnrollments", () => {
  it("requires authentication", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    await expect(caller.enrollment.myEnrollments()).rejects.toThrow();
  });

  it("returns enrolled courses with progress for authenticated user", async () => {
    const caller = appRouter.createCaller(makeCtx(makeUser()));
    const enrollments = await caller.enrollment.myEnrollments();

    expect(enrollments).toHaveLength(1);
    expect(enrollments[0].course).toBeDefined();
    expect(enrollments[0].progress.percentage).toBe(21);
  });
});

describe("enrollment.enroll", () => {
  it("prevents duplicate enrollment", async () => {
    const caller = appRouter.createCaller(makeCtx(makeUser()));
    const result = await caller.enrollment.enroll({ courseId: 1, tier: "self_paced" });

    expect(result.success).toBe(false);
    expect(result.message).toContain("Already enrolled");
  });
});

// ──────────────────────────────────────────────────────────────
// LECTURE ROUTES (protected)
// ──────────────────────────────────────────────────────────────

describe("lecture.get", () => {
  it("requires authentication", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    await expect(caller.lecture.get({ lectureId: 1 })).rejects.toThrow();
  });

  it("returns lecture content with Arabic translation for enrolled user", async () => {
    const caller = appRouter.createCaller(makeCtx(makeUser()));
    const lecture = await caller.lecture.get({ lectureId: 1 });

    expect(lecture).not.toBeNull();
    expect(lecture!.title).toContain("Security Controls");
    expect(lecture!.arabicContent).toBeTruthy();
    expect(lecture!.content).toContain("# Content");
  });
});

describe("lecture.markComplete", () => {
  it("marks a lecture as complete", async () => {
    const caller = appRouter.createCaller(makeCtx(makeUser()));
    const result = await caller.lecture.markComplete({ lectureId: 1, courseId: 1 });
    expect(result.success).toBe(true);
  });
});

// ──────────────────────────────────────────────────────────────
// QUIZ ROUTES (protected)
// ──────────────────────────────────────────────────────────────

describe("quiz.get", () => {
  it("returns quiz questions without correct answers", async () => {
    const caller = appRouter.createCaller(makeCtx(makeUser()));
    const result = await caller.quiz.get({ quizId: 1 });

    expect(result).not.toBeNull();
    expect(result!.quiz.title).toContain("Module 1");
    expect(result!.questions).toHaveLength(2);
    // Verify correct answers are NOT exposed to student
    const q = result!.questions[0] as Record<string, unknown>;
    expect(q).not.toHaveProperty("correctAnswer");
    expect(q).not.toHaveProperty("explanation");
  });
});

describe("quiz.submit", () => {
  it("scores quiz and returns results with correct/incorrect flags", async () => {
    const caller = appRouter.createCaller(makeCtx(makeUser()));
    const result = await caller.quiz.submit({
      quizId: 1,
      answers: { "1": "B", "2": "A" }, // Q1 correct (B), Q2 wrong (should be C)
    });

    expect(result.totalQuestions).toBe(2);
    expect(result.correctAnswers).toBe(1);
    expect(result.score).toBe(50);
    expect(result.passed).toBe(false); // 50 < 70 passing score
    expect(result.results).toHaveLength(2);
    expect(result.results[0].isCorrect).toBe(true);
    expect(result.results[1].isCorrect).toBe(false);
    expect(result.results[1].correct).toBe("C");
  });

  it("returns passed=true when score meets passing threshold", async () => {
    const caller = appRouter.createCaller(makeCtx(makeUser()));
    const result = await caller.quiz.submit({
      quizId: 1,
      answers: { "1": "B", "2": "C" }, // Both correct
    });

    expect(result.score).toBe(100);
    expect(result.passed).toBe(true);
    expect(result.correctAnswers).toBe(2);
  });
});

// ──────────────────────────────────────────────────────────────
// ADMIN ROUTES (admin only)
// ──────────────────────────────────────────────────────────────

describe("admin.stats", () => {
  it("rejects non-admin users", async () => {
    const caller = appRouter.createCaller(makeCtx(makeUser({ role: "user" })));
    await expect(caller.admin.stats()).rejects.toThrow();
  });

  it("rejects unauthenticated users", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    await expect(caller.admin.stats()).rejects.toThrow();
  });

  it("returns stats for admin users", async () => {
    const caller = appRouter.createCaller(makeCtx(makeUser({ role: "admin" })));
    const stats = await caller.admin.stats();

    expect(stats.totalStudents).toBe(5);
    expect(stats.totalEnrollments).toBe(8);
    expect(stats.totalCourses).toBe(2);
    expect(stats.totalQuizAttempts).toBe(15);
  });
});

describe("admin.enrollStudent", () => {
  it("rejects non-admin users", async () => {
    const caller = appRouter.createCaller(makeCtx(makeUser({ role: "user" })));
    await expect(
      caller.admin.enrollStudent({ userId: 2, courseId: 1, tier: "live" })
    ).rejects.toThrow();
  });

  it("prevents duplicate enrollment via admin", async () => {
    const caller = appRouter.createCaller(makeCtx(makeUser({ role: "admin" })));
    const result = await caller.admin.enrollStudent({ userId: 1, courseId: 1, tier: "live" });

    expect(result.success).toBe(false);
    expect(result.message).toContain("already enrolled");
  });
});

// ──────────────────────────────────────────────────────────────
// CREDENTIAL ROUTES
// ──────────────────────────────────────────────────────────────

describe("credential.myCertificates", () => {
  it("requires authentication", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    await expect(caller.credential.myCertificates()).rejects.toThrow();
  });

  it("returns certificates for authenticated user", async () => {
    const caller = appRouter.createCaller(makeCtx(makeUser()));
    const certs = await caller.credential.myCertificates();

    expect(certs).toHaveLength(1);
    expect(certs[0].certificateNumber).toBe("APEX-SY0701-000001");
    expect(certs[0].courseTitle).toContain("Security+");
    expect(certs[0].score).toBe(85);
  });
});

describe("credential.myBadges", () => {
  it("requires authentication", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    await expect(caller.credential.myBadges()).rejects.toThrow();
  });

  it("returns badges for authenticated user", async () => {
    const caller = appRouter.createCaller(makeCtx(makeUser()));
    const badges = await caller.credential.myBadges();

    expect(badges).toHaveLength(1);
    expect(badges[0].badgeType).toBe("course_complete");
    expect(badges[0].title).toContain("Security+");
  });
});

describe("credential.certificateForCourse", () => {
  it("returns certificate for enrolled course", async () => {
    const caller = appRouter.createCaller(makeCtx(makeUser()));
    const cert = await caller.credential.certificateForCourse({ courseId: 1 });

    expect(cert).not.toBeNull();
    expect(cert!.certificateNumber).toBe("APEX-SY0701-000001");
    expect(cert!.score).toBe(85);
  });

  it("returns null for course without certificate", async () => {
    const caller = appRouter.createCaller(makeCtx(makeUser()));
    const cert = await caller.credential.certificateForCourse({ courseId: 999 });
    expect(cert).toBeNull();
  });
});

describe("credential.verify", () => {
  it("verifies a valid certificate number (public)", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.credential.verify({ certificateNumber: "APEX-SY0701-000001" });

    expect(result).not.toBeNull();
    expect(result!.valid).toBe(true);
    expect(result!.studentName).toBe("Test Student");
    expect(result!.certCode).toBe("SY0-701");
    expect(result!.score).toBe(85);
  });

  it("returns null for invalid certificate number", async () => {
    const caller = appRouter.createCaller(makeCtx());
    const result = await caller.credential.verify({ certificateNumber: "FAKE-000000" });
    expect(result).toBeNull();
  });
});
