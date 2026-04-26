import { describe, it, expect } from "vitest";
import { drizzle } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

describe("Bilingual Arabic Content", () => {
  it("all 76 lectures have Arabic content", async () => {
    const rows = await db.execute(
      sql`SELECT COUNT(*) as total FROM lectures WHERE arabicContent IS NOT NULL AND LENGTH(arabicContent) > 100`
    );
    expect(Number((rows[0] as any)[0].total)).toBe(76);
  });

  it("all 76 lectures have Arabic study guides", async () => {
    const rows = await db.execute(
      sql`SELECT COUNT(*) as total FROM lectures WHERE arabicStudyGuide IS NOT NULL AND LENGTH(arabicStudyGuide) > 100`
    );
    expect(Number((rows[0] as any)[0].total)).toBe(76);
  });

  it("all 76 lectures have Arabic glossaries", async () => {
    const rows = await db.execute(
      sql`SELECT COUNT(*) as total FROM lectures WHERE arabicGlossary IS NOT NULL AND LENGTH(arabicGlossary) > 100`
    );
    expect(Number((rows[0] as any)[0].total)).toBe(76);
  });

  it("all 76 lectures have Arabic audio URLs", async () => {
    const rows = await db.execute(
      sql`SELECT COUNT(*) as total FROM lectures WHERE arabicAudioUrl IS NOT NULL AND arabicAudioUrl != ''`
    );
    expect(Number((rows[0] as any)[0].total)).toBe(76);
  });

  it("Arabic audio URLs point to valid S3 paths", async () => {
    const rows = await db.execute(
      sql`SELECT arabicAudioUrl FROM lectures WHERE arabicAudioUrl IS NOT NULL LIMIT 5`
    );
    const urls = (rows[0] as any[]).map((r: any) => r.arabicAudioUrl);
    for (const url of urls) {
      expect(url).toContain("cloudfront.net");
      expect(url).toContain("arabic");
      expect(url).toMatch(/\.mp3$/);
    }
  });

  it("Arabic content contains actual Arabic text", async () => {
    const rows = await db.execute(
      sql`SELECT arabicContent FROM lectures LIMIT 3`
    );
    const contents = (rows[0] as any[]).map((r: any) => r.arabicContent);
    const arabicRegex = /[\u0600-\u06FF]/;
    for (const content of contents) {
      expect(arabicRegex.test(content)).toBe(true);
    }
  });

  it("all 6 courses are represented in Arabic content", async () => {
    const rows = await db.execute(
      sql`SELECT DISTINCT c.title FROM courses c JOIN lectures l ON l.courseId = c.id WHERE l.arabicContent IS NOT NULL AND LENGTH(l.arabicContent) > 100`
    );
    expect((rows[0] as any[]).length).toBe(6);
  });
});

describe("Bilingual Arabic Quiz/Exam Content", () => {
  it("all quiz questions have Arabic translations", async () => {
    const rows = await db.execute(
      sql`SELECT COUNT(*) as total FROM questions WHERE arabicQuestionText IS NOT NULL AND LENGTH(arabicQuestionText) > 10`
    );
    const totalArabic = Number((rows[0] as any)[0].total);
    const allRows = await db.execute(
      sql`SELECT COUNT(*) as total FROM questions`
    );
    const totalAll = Number((allRows[0] as any)[0].total);
    expect(totalArabic).toBe(totalAll);
  });

  it("all quiz questions have Arabic options A-D", async () => {
    const rows = await db.execute(
      sql`SELECT COUNT(*) as total FROM questions WHERE arabicOptionA IS NOT NULL AND arabicOptionB IS NOT NULL AND arabicOptionC IS NOT NULL AND arabicOptionD IS NOT NULL AND LENGTH(arabicOptionA) > 0 AND LENGTH(arabicOptionB) > 0 AND LENGTH(arabicOptionC) > 0 AND LENGTH(arabicOptionD) > 0`
    );
    const totalWithOptions = Number((rows[0] as any)[0].total);
    const allRows = await db.execute(
      sql`SELECT COUNT(*) as total FROM questions`
    );
    const totalAll = Number((allRows[0] as any)[0].total);
    expect(totalWithOptions).toBe(totalAll);
  });

  it("Arabic explanations match English explanations count", async () => {
    const rows = await db.execute(
      sql`SELECT COUNT(*) as total FROM questions WHERE arabicExplanation IS NOT NULL AND LENGTH(arabicExplanation) > 5`
    );
    const arabicExplanationCount = Number((rows[0] as any)[0].total);
    const enRows = await db.execute(
      sql`SELECT COUNT(*) as total FROM questions WHERE explanation IS NOT NULL AND LENGTH(explanation) > 5`
    );
    const enExplanationCount = Number((enRows[0] as any)[0].total);
    // Arabic explanations should match English explanations count
    expect(arabicExplanationCount).toBe(enExplanationCount);
  });

  it("Arabic quiz question text contains actual Arabic text", async () => {
    const rows = await db.execute(
      sql`SELECT arabicQuestionText, arabicExplanation FROM questions LIMIT 10`
    );
    const arabicRegex = /[\u0600-\u06FF]/;
    for (const row of (rows[0] as any[])) {
      expect(arabicRegex.test(row.arabicQuestionText)).toBe(true);
      expect(arabicRegex.test(row.arabicExplanation)).toBe(true);
    }
  });

  it("majority of Arabic options contain Arabic text (some may be technical terms)", async () => {
    const rows = await db.execute(
      sql`SELECT COUNT(*) as total FROM questions WHERE arabicOptionA REGEXP '[ء-ي]'`
    );
    const arabicCount = Number((rows[0] as any)[0].total);
    const allRows = await db.execute(
      sql`SELECT COUNT(*) as total FROM questions`
    );
    const totalAll = Number((allRows[0] as any)[0].total);
    // At least 70% of options should contain Arabic (some are valid English technical terms)
    expect(arabicCount / totalAll).toBeGreaterThan(0.7);
  });

  it("quizzes have Arabic titles", async () => {
    const rows = await db.execute(
      sql`SELECT COUNT(*) as total FROM quizzes WHERE arabicTitle IS NOT NULL AND LENGTH(arabicTitle) > 3`
    );
    const totalWithTitle = Number((rows[0] as any)[0].total);
    const allRows = await db.execute(
      sql`SELECT COUNT(*) as total FROM quizzes`
    );
    const totalAll = Number((allRows[0] as any)[0].total);
    expect(totalWithTitle).toBe(totalAll);
  });

  it("all 6 courses have Arabic quiz content", async () => {
    const rows = await db.execute(
      sql`SELECT DISTINCT q.courseId FROM quizzes q JOIN questions qq ON qq.quizId = q.id WHERE qq.arabicQuestionText IS NOT NULL AND LENGTH(qq.arabicQuestionText) > 10`
    );
    expect((rows[0] as any[]).length).toBe(6);
  });
});
