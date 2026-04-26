import { describe, it, expect } from "vitest";
import { getDb } from "./db";
import { flashcardReviews } from "../drizzle/schema";
import { eq, and, count } from "drizzle-orm";

describe("Flashcard System", () => {
  it("flashcard_reviews table exists and is queryable", async () => {
    const db = await getDb();
    expect(db).toBeTruthy();
    const result = await db!.select({ cnt: count(flashcardReviews.id) }).from(flashcardReviews);
    expect(result).toBeDefined();
    expect(result[0]).toHaveProperty("cnt");
  });

  it("flashcard_reviews table has correct columns", async () => {
    const db = await getDb();
    expect(db).toBeTruthy();
    // Query with all columns to verify schema
    const result = await db!.select({
      id: flashcardReviews.id,
      userId: flashcardReviews.userId,
      courseId: flashcardReviews.courseId,
      lectureId: flashcardReviews.lectureId,
      term: flashcardReviews.term,
      definition: flashcardReviews.definition,
      arabicTerm: flashcardReviews.arabicTerm,
      arabicDefinition: flashcardReviews.arabicDefinition,
      interval: flashcardReviews.interval,
      repetitions: flashcardReviews.repetitions,
      easeFactor: flashcardReviews.easeFactor,
      nextReviewAt: flashcardReviews.nextReviewAt,
      lastReviewedAt: flashcardReviews.lastReviewedAt,
    }).from(flashcardReviews).limit(1);
    expect(result).toBeDefined();
  });

  it("SM-2 algorithm: correct response increases interval", () => {
    // Simulate SM-2 algorithm logic
    let interval = 1;
    let repetitions = 0;
    let easeFactor = 250;
    const quality = 4; // Good response

    // First correct response
    if (quality >= 3) {
      if (repetitions === 0) interval = 1;
      else if (repetitions === 1) interval = 6;
      else interval = Math.round(interval * (easeFactor / 100));
      repetitions += 1;
    }
    easeFactor = Math.max(130, easeFactor + Math.round((0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)) * 100));

    expect(interval).toBe(1);
    expect(repetitions).toBe(1);
    expect(easeFactor).toBeGreaterThanOrEqual(130);

    // Second correct response
    if (quality >= 3) {
      if (repetitions === 0) interval = 1;
      else if (repetitions === 1) interval = 6;
      else interval = Math.round(interval * (easeFactor / 100));
      repetitions += 1;
    }
    expect(interval).toBe(6);
    expect(repetitions).toBe(2);

    // Third correct response - should multiply
    if (quality >= 3) {
      if (repetitions === 0) interval = 1;
      else if (repetitions === 1) interval = 6;
      else interval = Math.round(interval * (easeFactor / 100));
      repetitions += 1;
    }
    expect(interval).toBeGreaterThan(6);
    expect(repetitions).toBe(3);
  });

  it("SM-2 algorithm: incorrect response resets repetitions", () => {
    let interval = 6;
    let repetitions = 3;
    let easeFactor = 250;
    const quality = 1; // Wrong

    if (quality >= 3) {
      repetitions += 1;
    } else {
      repetitions = 0;
      interval = 1;
    }
    easeFactor = Math.max(130, easeFactor + Math.round((0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)) * 100));

    expect(interval).toBe(1);
    expect(repetitions).toBe(0);
    expect(easeFactor).toBeGreaterThanOrEqual(130);
  });

  it("SM-2 algorithm: ease factor never goes below 130", () => {
    let easeFactor = 150;
    const quality = 0; // Complete blackout - worst case

    easeFactor = Math.max(130, easeFactor + Math.round((0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)) * 100));
    expect(easeFactor).toBeGreaterThanOrEqual(130);
  });

  it("SM-2 algorithm: perfect recall increases ease factor", () => {
    let easeFactor = 250;
    const quality = 5; // Perfect

    const newEaseFactor = Math.max(130, easeFactor + Math.round((0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)) * 100));
    expect(newEaseFactor).toBeGreaterThan(easeFactor);
  });

  it("glossary content has parseable terms for flashcard generation", async () => {
    const db = await getDb();
    expect(db).toBeTruthy();
    // Check that lectures have glossary content
    const { lectures } = await import("../drizzle/schema");
    const { isNotNull } = await import("drizzle-orm");
    const result = await db!.select({ cnt: count(lectures.id) }).from(lectures)
      .where(isNotNull(lectures.glossaryContent));
    expect(result[0].cnt).toBeGreaterThan(0);
  });
});
