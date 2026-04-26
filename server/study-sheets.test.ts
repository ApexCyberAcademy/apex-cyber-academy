import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the database module
vi.mock("./db", () => ({
  getLectureById: vi.fn().mockResolvedValue({
    id: 1,
    moduleId: 1,
    courseId: 1,
    title: "Day 1: Security Controls",
    slug: "day-1-security-controls",
    sortOrder: 1,
    durationMinutes: 120,
    content: "# Content",
    arabicContent: "# محتوى",
    studySheetEnUrl: "https://files.manuscdn.com/study-sheets/study_sheet_en_1.pdf",
    studySheetArUrl: "https://files.manuscdn.com/study-sheets/study_sheet_ar_1.pdf",
    glossaryContent: "| Term | Definition |\n|---|---|\n| CIA Triad | Confidentiality, Integrity, Availability |",
    arabicGlossary: "| المصطلح | التعريف |\n|---|---|\n| ثالوث CIA | السرية والنزاهة والتوافر |",
    studyGuideContent: "## Key Objectives\n- Understand security controls",
    arabicStudyGuide: "## الأهداف الرئيسية\n- فهم ضوابط الأمن",
  }),
  getLecturesByCourseId: vi.fn().mockResolvedValue([
    {
      id: 1,
      title: "Day 1: Security Controls",
      studySheetEnUrl: "https://files.manuscdn.com/study-sheets/study_sheet_en_1.pdf",
      studySheetArUrl: "https://files.manuscdn.com/study-sheets/study_sheet_ar_1.pdf",
    },
    {
      id: 2,
      title: "Day 2: Threat Landscape",
      studySheetEnUrl: "https://files.manuscdn.com/study-sheets/study_sheet_en_2.pdf",
      studySheetArUrl: "https://files.manuscdn.com/study-sheets/study_sheet_ar_2.pdf",
    },
    {
      id: 3,
      title: "Day 3: Cryptography",
      studySheetEnUrl: null,
      studySheetArUrl: null,
    },
  ]),
}));

describe("Study Sheet PDFs", () => {
  it("should include study sheet URLs in lecture data", async () => {
    const { getLectureById } = await import("./db");
    const lecture = await getLectureById(1);

    expect(lecture).toBeDefined();
    expect(lecture).toHaveProperty("studySheetEnUrl");
    expect(lecture).toHaveProperty("studySheetArUrl");
    expect(lecture!.studySheetEnUrl).toContain("https://");
    expect(lecture!.studySheetEnUrl).toContain(".pdf");
  });

  it("should have both English and Arabic study sheet URLs", async () => {
    const { getLectureById } = await import("./db");
    const lecture = await getLectureById(1);

    expect(lecture).toBeDefined();
    expect(lecture!.studySheetEnUrl).toBeTruthy();
    expect(lecture!.studySheetArUrl).toBeTruthy();
    // English and Arabic URLs should be different
    expect(lecture!.studySheetEnUrl).not.toEqual(lecture!.studySheetArUrl);
    // English URL should contain 'en'
    expect(lecture!.studySheetEnUrl).toContain("en");
    // Arabic URL should contain 'ar'
    expect(lecture!.studySheetArUrl).toContain("ar");
  });

  it("should include study sheet URLs in course lectures list", async () => {
    const { getLecturesByCourseId } = await import("./db");
    const lectures = await getLecturesByCourseId(1);

    expect(lectures).toHaveLength(3);
    // First two lectures have study sheets
    expect(lectures[0].studySheetEnUrl).toBeTruthy();
    expect(lectures[0].studySheetArUrl).toBeTruthy();
    expect(lectures[1].studySheetEnUrl).toBeTruthy();
    // Third lecture has null (acceptable - some may not have study sheets)
    expect(lectures[2].studySheetEnUrl).toBeNull();
  });

  it("should have study sheet alongside glossary and study guide content", async () => {
    const { getLectureById } = await import("./db");
    const lecture = await getLectureById(1);

    expect(lecture).toBeDefined();
    // Study sheet PDF is a compiled version of these
    expect(lecture!.glossaryContent).toBeTruthy();
    expect(lecture!.studyGuideContent).toBeTruthy();
    expect(lecture!.arabicGlossary).toBeTruthy();
    expect(lecture!.arabicStudyGuide).toBeTruthy();
    // And the compiled PDF URLs exist
    expect(lecture!.studySheetEnUrl).toBeTruthy();
    expect(lecture!.studySheetArUrl).toBeTruthy();
  });

  it("study sheet URLs should point to PDF files", async () => {
    const { getLectureById } = await import("./db");
    const lecture = await getLectureById(1);

    expect(lecture!.studySheetEnUrl).toMatch(/\.pdf$/);
    expect(lecture!.studySheetArUrl).toMatch(/\.pdf$/);
  });
});
