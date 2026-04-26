import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the db module
vi.mock("./db", () => ({
  recordSlideDownload: vi.fn().mockResolvedValue(42),
  getSlideDownloadsForCourse: vi.fn().mockResolvedValue([
    { id: 1, userId: 1, lectureId: 10, courseId: 5, downloadedAt: new Date() },
    { id: 2, userId: 1, lectureId: 11, courseId: 5, downloadedAt: new Date() },
  ]),
  getAllSlideDownloads: vi.fn().mockResolvedValue([
    { id: 1, userId: 1, lectureId: 10, courseId: 5, downloadedAt: new Date() },
    { id: 2, userId: 1, lectureId: 11, courseId: 5, downloadedAt: new Date() },
    { id: 3, userId: 1, lectureId: 20, courseId: 6, downloadedAt: new Date() },
  ]),
}));

// Mock credentialIssuance
vi.mock("./credentialIssuance", () => ({
  checkAndIssueCredentials: vi.fn(),
}));

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
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
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

describe("slideDownload routes", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeEach(() => {
    vi.clearAllMocks();
    const ctx = createAuthContext();
    caller = appRouter.createCaller(ctx);
  });

  it("records a slide download", async () => {
    const result = await caller.slideDownload.record({
      lectureId: 10,
      courseId: 5,
    });

    expect(result).toEqual({ success: true, id: 42 });
  });

  it("gets slide downloads for a course", async () => {
    const result = await caller.slideDownload.forCourse({ courseId: 5 });

    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty("lectureId", 10);
    expect(result[1]).toHaveProperty("lectureId", 11);
  });

  it("gets all slide downloads for the user", async () => {
    const result = await caller.slideDownload.all();

    expect(result).toHaveLength(3);
    // Should contain downloads from multiple courses
    const courseIds = [...new Set(result.map(d => d.courseId))];
    expect(courseIds).toHaveLength(2);
  });
});
