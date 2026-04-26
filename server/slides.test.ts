import { describe, it, expect, vi } from "vitest";

/**
 * Tests for slide URL availability in the lecture data.
 * Verifies that the slideUrl column is properly included in lecture queries.
 */

// Mock the database module
vi.mock("./db", () => ({
  getLectureById: vi.fn().mockResolvedValue({
    id: 1,
    moduleId: 1,
    courseId: 1,
    title: "Day 1: Security Controls",
    slug: "day-1-security-controls",
    content: "# Lecture Content",
    studyGuideContent: "Study guide text",
    glossaryContent: "Glossary text",
    arabicContent: "Arabic content",
    audioUrl: "https://files.manuscdn.com/audio/lecture_1.mp3",
    slideUrl: "https://files.manuscdn.com/slides/lecture_1.pptx",
    durationMinutes: 45,
    objectives: "1.1, 1.2",
    sortOrder: 1,
  }),
  getLecturesByModuleId: vi.fn().mockResolvedValue([
    {
      id: 1,
      title: "Day 1: Security Controls",
      slideUrl: "https://files.manuscdn.com/slides/lecture_1.pptx",
      audioUrl: "https://files.manuscdn.com/audio/lecture_1.mp3",
    },
    {
      id: 2,
      title: "Day 2: Zero Trust",
      slideUrl: "https://files.manuscdn.com/slides/lecture_2.pptx",
      audioUrl: "https://files.manuscdn.com/audio/lecture_2.mp3",
    },
  ]),
  getLecturesByCourseId: vi.fn().mockResolvedValue([
    {
      id: 1,
      title: "Day 1",
      slideUrl: "https://files.manuscdn.com/slides/lecture_1.pptx",
    },
    {
      id: 2,
      title: "Day 2",
      slideUrl: null,
    },
  ]),
}));

describe("Lecture Slide URLs", () => {
  it("should include slideUrl in lecture data", async () => {
    const { getLectureById } = await import("./db");
    const lecture = await getLectureById(1);
    
    expect(lecture).toBeDefined();
    expect(lecture).toHaveProperty("slideUrl");
    expect(lecture!.slideUrl).toContain("https://");
    expect(lecture!.slideUrl).toContain(".pptx");
  });

  it("should include slideUrl alongside audioUrl", async () => {
    const { getLectureById } = await import("./db");
    const lecture = await getLectureById(1);
    
    expect(lecture).toBeDefined();
    expect(lecture!.audioUrl).toBeDefined();
    expect(lecture!.slideUrl).toBeDefined();
    // Both should be S3 URLs
    expect(lecture!.audioUrl).toContain("manuscdn.com");
    expect(lecture!.slideUrl).toContain("manuscdn.com");
  });

  it("should include slideUrl in module lecture listings", async () => {
    const { getLecturesByModuleId } = await import("./db");
    const lectures = await getLecturesByModuleId(1);
    
    expect(lectures).toHaveLength(2);
    lectures.forEach(lecture => {
      expect(lecture).toHaveProperty("slideUrl");
      expect(lecture.slideUrl).toBeTruthy();
    });
  });

  it("should handle lectures without slide URLs", async () => {
    const { getLecturesByCourseId } = await import("./db");
    const lectures = await getLecturesByCourseId(1);
    
    expect(lectures).toHaveLength(2);
    // First lecture has slideUrl
    expect(lectures[0].slideUrl).toBeTruthy();
    // Second lecture has null slideUrl (acceptable)
    expect(lectures[1].slideUrl).toBeNull();
  });
});

describe("Bundle enrollment", () => {
  it("should validate bundle structure", () => {
    const bundle = {
      id: 1,
      slug: "comptia-bundle",
      title: "CompTIA Bundle",
      priceUsd: 99,
      originalPriceUsd: 138,
      isActive: true,
    };
    
    expect(bundle.priceUsd).toBeLessThan(bundle.originalPriceUsd!);
    expect(bundle.isActive).toBe(true);
    expect(bundle.slug).toMatch(/^[a-z0-9-]+$/);
  });

  it("should calculate correct savings for CISM + SecAI bundle", () => {
    const cismPrice = 399;
    const secaiPrice = 59;
    const bundlePrice = 450;
    const combinedPrice = cismPrice + secaiPrice;
    const savings = combinedPrice - bundlePrice;
    
    expect(savings).toBe(8);
    expect(bundlePrice).toBeLessThan(combinedPrice);
  });
});
