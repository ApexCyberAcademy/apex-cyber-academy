import { eq, and, desc, asc, sql, count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser, users,
  courses, InsertCourse,
  modules, InsertModule,
  lectures, InsertLecture,
  quizzes, InsertQuiz,
  questions, InsertQuestion,
  enrollments, InsertEnrollment,
  lectureProgress, InsertLectureProgress,
  quizAttempts, InsertQuizAttempt,
  certificates, InsertCertificate,
  badges, InsertBadge,
  bundles, InsertBundle,
  bundleCourses, InsertBundleCourse,
  slideDownloads, InsertSlideDownload,
  enrollmentLog, InsertEnrollmentLog,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─── USER QUERIES ───────────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod", "passwordHash"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
    if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
    else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
    if (!values.lastSignedIn) { values.lastSignedIn = new Date(); }
    if (Object.keys(updateSet).length === 0) { updateSet.lastSignedIn = new Date(); }
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot get user: database not available"); return undefined; }
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot get user: database not available"); return undefined; }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─── COURSE QUERIES ─────────────────────────────────────────────

export async function getAllCourses() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(courses).where(eq(courses.isPublished, true)).orderBy(asc(courses.sortOrder));
}

export async function getCourseBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(courses).where(eq(courses.slug, slug)).limit(1);
  return result[0];
}

export async function getCourseById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
  return result[0];
}

export async function getAllCoursesAdmin() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(courses).orderBy(asc(courses.sortOrder));
}

export async function insertCourse(course: InsertCourse) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(courses).values(course);
  return result[0].insertId;
}

// ─── MODULE QUERIES ─────────────────────────────────────────────

export async function getModulesByCourseId(courseId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(modules).where(eq(modules.courseId, courseId)).orderBy(asc(modules.sortOrder));
}

export async function insertModule(mod: InsertModule) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(modules).values(mod);
  return result[0].insertId;
}

// ─── LECTURE QUERIES ────────────────────────────────────────────

export async function getLecturesByModuleId(moduleId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(lectures).where(eq(lectures.moduleId, moduleId)).orderBy(asc(lectures.sortOrder));
}

export async function getLecturesByCourseId(courseId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(lectures).where(eq(lectures.courseId, courseId)).orderBy(asc(lectures.sortOrder));
}

export async function getLectureById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(lectures).where(eq(lectures.id, id)).limit(1);
  return result[0];
}

export async function getLectureBySlug(slug: string, courseId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(lectures).where(and(eq(lectures.slug, slug), eq(lectures.courseId, courseId))).limit(1);
  return result[0];
}

export async function insertLecture(lecture: InsertLecture) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(lectures).values(lecture);
  return result[0].insertId;
}

// ─── QUIZ QUERIES ───────────────────────────────────────────────

export async function getQuizzesByModuleId(moduleId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(quizzes).where(eq(quizzes.moduleId, moduleId)).orderBy(asc(quizzes.sortOrder));
}

export async function getQuizzesByCourseId(courseId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(quizzes).where(eq(quizzes.courseId, courseId)).orderBy(asc(quizzes.sortOrder));
}

export async function getQuizById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(quizzes).where(eq(quizzes.id, id)).limit(1);
  return result[0];
}

export async function insertQuiz(quiz: InsertQuiz) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(quizzes).values(quiz);
  return result[0].insertId;
}

// ─── QUESTION QUERIES ───────────────────────────────────────────

export async function getQuestionsByQuizId(quizId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(questions).where(eq(questions.quizId, quizId)).orderBy(asc(questions.sortOrder));
}

export async function getQuestionById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(questions).where(eq(questions.id, id)).limit(1);
  return result[0];
}

export async function insertQuestion(question: InsertQuestion) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(questions).values(question);
  return result[0].insertId;
}

export async function insertQuestions(questionsList: InsertQuestion[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  if (questionsList.length === 0) return;
  await db.insert(questions).values(questionsList);
}

// ─── ENROLLMENT QUERIES ─────────────────────────────────────────

export async function getUserEnrollments(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(enrollments).where(eq(enrollments.userId, userId)).orderBy(desc(enrollments.enrolledAt));
}

export async function getUserEnrollmentForCourse(userId: number, courseId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(enrollments)
    .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)))
    .limit(1);
  return result[0];
}

export async function createEnrollment(enrollment: InsertEnrollment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(enrollments).values(enrollment);
  return result[0].insertId;
}

export async function getEnrollmentsByCourseId(courseId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    enrollment: enrollments,
    userName: users.name,
    userEmail: users.email,
  }).from(enrollments)
    .innerJoin(users, eq(enrollments.userId, users.id))
    .where(eq(enrollments.courseId, courseId))
    .orderBy(desc(enrollments.enrolledAt));
}

export async function getAllEnrollments() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    enrollment: enrollments,
    userName: users.name,
    userEmail: users.email,
    courseTitle: courses.title,
  }).from(enrollments)
    .innerJoin(users, eq(enrollments.userId, users.id))
    .innerJoin(courses, eq(enrollments.courseId, courses.id))
    .orderBy(desc(enrollments.enrolledAt));
}

// ─── PROGRESS QUERIES ───────────────────────────────────────────

export async function getUserLectureProgress(userId: number, courseId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(lectureProgress)
    .where(and(eq(lectureProgress.userId, userId), eq(lectureProgress.courseId, courseId)));
}

export async function markLectureComplete(userId: number, lectureId: number, courseId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Upsert: insert or update
  const existing = await db.select().from(lectureProgress)
    .where(and(eq(lectureProgress.userId, userId), eq(lectureProgress.lectureId, lectureId)))
    .limit(1);
  if (existing.length > 0) {
    await db.update(lectureProgress)
      .set({ completed: true, completedAt: new Date(), lastAccessedAt: new Date() })
      .where(and(eq(lectureProgress.userId, userId), eq(lectureProgress.lectureId, lectureId)));
  } else {
    await db.insert(lectureProgress).values({
      userId, lectureId, courseId, completed: true, completedAt: new Date(), lastAccessedAt: new Date(),
    });
  }
}

export async function updateLectureAccess(userId: number, lectureId: number, courseId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await db.select().from(lectureProgress)
    .where(and(eq(lectureProgress.userId, userId), eq(lectureProgress.lectureId, lectureId)))
    .limit(1);
  if (existing.length > 0) {
    await db.update(lectureProgress)
      .set({ lastAccessedAt: new Date() })
      .where(and(eq(lectureProgress.userId, userId), eq(lectureProgress.lectureId, lectureId)));
  } else {
    await db.insert(lectureProgress).values({
      userId, lectureId, courseId, completed: false, lastAccessedAt: new Date(),
    });
  }
}

export async function getCourseProgressStats(userId: number, courseId: number) {
  const db = await getDb();
  if (!db) return { totalLectures: 0, completedLectures: 0 };
  const totalResult = await db.select({ count: count() }).from(lectures).where(eq(lectures.courseId, courseId));
  const completedResult = await db.select({ count: count() }).from(lectureProgress)
    .where(and(
      eq(lectureProgress.userId, userId),
      eq(lectureProgress.courseId, courseId),
      eq(lectureProgress.completed, true)
    ));
  return {
    totalLectures: totalResult[0]?.count ?? 0,
    completedLectures: completedResult[0]?.count ?? 0,
  };
}

// ─── QUIZ ATTEMPT QUERIES ───────────────────────────────────────

export async function createQuizAttempt(attempt: InsertQuizAttempt) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(quizAttempts).values(attempt);
  return result[0].insertId;
}

export async function getUserQuizAttempts(userId: number, courseId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    attempt: quizAttempts,
    quizTitle: quizzes.title,
  }).from(quizAttempts)
    .innerJoin(quizzes, eq(quizAttempts.quizId, quizzes.id))
    .where(and(eq(quizAttempts.userId, userId), eq(quizAttempts.courseId, courseId)))
    .orderBy(desc(quizAttempts.startedAt));
}

export async function getUserQuizAttemptsForQuiz(userId: number, quizId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(quizAttempts)
    .where(and(eq(quizAttempts.userId, userId), eq(quizAttempts.quizId, quizId)))
    .orderBy(desc(quizAttempts.startedAt));
}

export async function getBestQuizAttempt(userId: number, quizId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(quizAttempts)
    .where(and(eq(quizAttempts.userId, userId), eq(quizAttempts.quizId, quizId)))
    .orderBy(desc(quizAttempts.score))
    .limit(1);
  return result[0];
}

// ─── ADMIN QUERIES ──────────────────────────────────────────────

export async function getAdminStats() {
  const db = await getDb();
  if (!db) return { totalStudents: 0, totalEnrollments: 0, totalCourses: 0, totalQuizAttempts: 0 };
  const studentsResult = await db.select({ count: count() }).from(users).where(eq(users.role, "user"));
  const enrollmentsResult = await db.select({ count: count() }).from(enrollments);
  const coursesResult = await db.select({ count: count() }).from(courses);
  const attemptsResult = await db.select({ count: count() }).from(quizAttempts);
  return {
    totalStudents: studentsResult[0]?.count ?? 0,
    totalEnrollments: enrollmentsResult[0]?.count ?? 0,
    totalCourses: coursesResult[0]?.count ?? 0,
    totalQuizAttempts: attemptsResult[0]?.count ?? 0,
  };
}

export async function getAllStudents() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).where(eq(users.role, "user")).orderBy(desc(users.createdAt));
}

// ─── CERTIFICATE QUERIES ────────────────────────────────────────

export async function createCertificate(cert: InsertCertificate) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(certificates).values(cert);
  return result[0].insertId;
}

export async function getUserCertificates(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(certificates)
    .where(eq(certificates.userId, userId))
    .orderBy(desc(certificates.issuedAt));
}

export async function getCertificateByNumber(certNumber: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(certificates)
    .where(eq(certificates.certificateNumber, certNumber))
    .limit(1);
  return result[0];
}

export async function getCertificateForCourse(userId: number, courseId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(certificates)
    .where(and(eq(certificates.userId, userId), eq(certificates.courseId, courseId)))
    .limit(1);
  return result[0];
}

export async function getNextCertificateNumber(prefix: string) {
  const db = await getDb();
  if (!db) return `${prefix}-0001`;
  const result = await db.select({ count: count() }).from(certificates);
  const num = (result[0]?.count ?? 0) + 1;
  return `${prefix}-${String(num).padStart(4, "0")}`;
}

export async function updateCertificatePdfUrl(certId: number, pdfUrl: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(certificates).set({ pdfUrl }).where(eq(certificates.id, certId));
}

// ─── BADGE QUERIES ──────────────────────────────────────────────

export async function createBadge(badge: InsertBadge) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(badges).values(badge);
  return result[0].insertId;
}

export async function getUserBadges(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(badges)
    .where(eq(badges.userId, userId))
    .orderBy(desc(badges.earnedAt));
}

export async function getUserBadgesForCourse(userId: number, courseId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(badges)
    .where(and(eq(badges.userId, userId), eq(badges.courseId, courseId)))
    .orderBy(desc(badges.earnedAt));
}

export async function hasBadge(userId: number, badgeType: string, courseId?: number) {
  const db = await getDb();
  if (!db) return false;
  const conditions = [eq(badges.userId, userId), eq(badges.badgeType, badgeType as any)];
  if (courseId !== undefined) conditions.push(eq(badges.courseId, courseId));
  const result = await db.select({ count: count() }).from(badges).where(and(...conditions));
  return (result[0]?.count ?? 0) > 0;
}

export async function getAllCertificatesAdmin() {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    certificate: certificates,
    userName: users.name,
    userEmail: users.email,
  }).from(certificates)
    .innerJoin(users, eq(certificates.userId, users.id))
    .orderBy(desc(certificates.issuedAt));
}

// ─── BUNDLE QUERIES ────────────────────────────────────────────

export async function getAllBundles() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bundles).where(eq(bundles.isActive, true)).orderBy(asc(bundles.sortOrder));
}

export async function getBundleById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(bundles).where(eq(bundles.id, id)).limit(1);
  return result[0];
}

export async function getBundleBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(bundles).where(eq(bundles.slug, slug)).limit(1);
  return result[0];
}

export async function getBundleCourses(bundleId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    bundleCourse: bundleCourses,
    courseTitle: courses.title,
    courseSlug: courses.slug,
    courseId: courses.id,
  }).from(bundleCourses)
    .innerJoin(courses, eq(bundleCourses.courseId, courses.id))
    .where(eq(bundleCourses.bundleId, bundleId))
    .orderBy(asc(bundleCourses.sortOrder));
}

export async function getAllBundlesWithCourses() {
  const db = await getDb();
  if (!db) return [];
  const allBundles = await db.select().from(bundles).where(eq(bundles.isActive, true)).orderBy(asc(bundles.sortOrder));
  const result = [];
  for (const bundle of allBundles) {
    const courses = await getBundleCourses(bundle.id);
    result.push({ ...bundle, courses });
  }
  return result;
}

export async function enrollInBundle(userId: number, bundleId: number, tier: "self_paced" | "live") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const bundleCoursesList = await getBundleCourses(bundleId);
  const enrollmentIds: number[] = [];
  for (const bc of bundleCoursesList) {
    const existing = await getUserEnrollmentForCourse(userId, bc.courseId);
    if (!existing) {
      const id = await createEnrollment({
        userId,
        courseId: bc.courseId,
        tier,
        status: "active",
        bundleId,
      });
      enrollmentIds.push(id);
    }
  }
  return enrollmentIds;
}

export async function getAllBundlesAdmin() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(bundles).orderBy(asc(bundles.sortOrder));
}

// ─── SLIDE DOWNLOAD TRACKING ──────────────────────────────────

export async function recordSlideDownload(userId: number, lectureId: number, courseId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Check if already recorded
  const existing = await db.select().from(slideDownloads)
    .where(and(eq(slideDownloads.userId, userId), eq(slideDownloads.lectureId, lectureId)))
    .limit(1);
  if (existing.length > 0) return existing[0].id;
  const result = await db.insert(slideDownloads).values({ userId, lectureId, courseId });
  return result[0].insertId;
}

export async function getSlideDownloadsForCourse(userId: number, courseId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(slideDownloads)
    .where(and(eq(slideDownloads.userId, userId), eq(slideDownloads.courseId, courseId)))
    .orderBy(desc(slideDownloads.downloadedAt));
}

export async function getAllSlideDownloads(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(slideDownloads)
    .where(eq(slideDownloads.userId, userId))
    .orderBy(desc(slideDownloads.downloadedAt));
}

// ─── STUDENT PROGRESS (ADMIN) ──────────────────────────────────

export async function getStudentProgress(userId: number) {
  const db = await getDb();
  if (!db) return [];
  // Get all enrollments with progress for a student
  const userEnrollments = await db.select({
    enrollment: enrollments,
    courseTitle: courses.title,
    courseSlug: courses.slug,
  }).from(enrollments)
    .innerJoin(courses, eq(enrollments.courseId, courses.id))
    .where(eq(enrollments.userId, userId));

  const result = [];
  for (const e of userEnrollments) {
    const stats = await getCourseProgressStats(userId, e.enrollment.courseId);
    const quizResults = await getUserQuizAttempts(userId, e.enrollment.courseId);
    result.push({
      ...e,
      progress: stats,
      quizAttempts: quizResults,
    });
  }
  return result;
}

// ─── LAB COMPLETION QUERIES ────────────────────────────────────

import { labCompletions, InsertLabCompletion } from "../drizzle/schema";

export async function recordLabCompletion(userId: number, lectureId: number, courseId: number, score?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Check if already completed
  const existing = await db.select().from(labCompletions)
    .where(and(eq(labCompletions.userId, userId), eq(labCompletions.lectureId, lectureId)))
    .limit(1);
  if (existing.length > 0) {
    // Update score if higher
    if (score !== undefined && (existing[0].score === null || score > existing[0].score)) {
      await db.update(labCompletions)
        .set({ score, completedAt: new Date() })
        .where(eq(labCompletions.id, existing[0].id));
    }
    return existing[0].id;
  }
  const result = await db.insert(labCompletions).values({
    userId, lectureId, courseId, score: score ?? null, completedAt: new Date(),
  });
  return result[0].insertId;
}

export async function getUserLabCompletions(userId: number, courseId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(labCompletions)
    .where(and(eq(labCompletions.userId, userId), eq(labCompletions.courseId, courseId)))
    .orderBy(desc(labCompletions.completedAt));
}

export async function getAllLabCompletions(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(labCompletions)
    .where(eq(labCompletions.userId, userId))
    .orderBy(desc(labCompletions.completedAt));
}

// ─── STUDY PLANNER QUERIES ────────────────────────────────────

export async function getStudyPlannerData(userId: number, courseId: number) {
  const db = await getDb();
  if (!db) return null;

  // 1. Get all quiz attempts for this course (with answers JSON)
  const attempts = await db.select().from(quizAttempts)
    .where(and(eq(quizAttempts.userId, userId), eq(quizAttempts.courseId, courseId)))
    .orderBy(desc(quizAttempts.completedAt));

  // 2. Get all questions for this course (with correct answers + objectives)
  const courseQuizzesList = await db.select().from(quizzes)
    .where(eq(quizzes.courseId, courseId));
  const allQuestions: Array<{
    id: number; quizId: number; questionText: string;
    correctAnswer: string; objective: string | null;
    explanation: string | null;
  }> = [];
  for (const quiz of courseQuizzesList) {
    const qs = await db.select().from(questions).where(eq(questions.quizId, quiz.id));
    allQuestions.push(...qs.map(q => ({
      id: q.id, quizId: q.quizId, questionText: q.questionText,
      correctAnswer: q.correctAnswer, objective: q.objective,
      explanation: q.explanation,
    })));
  }

  // 3. Get modules with their lectures
  const courseModules = await db.select().from(modules)
    .where(eq(modules.courseId, courseId))
    .orderBy(asc(modules.sortOrder));
  const moduleLectures: Array<{
    module: typeof courseModules[0];
    lectures: Array<{ id: number; title: string; sortOrder: number; moduleId: number }>;
  }> = [];
  for (const mod of courseModules) {
    const lecs = await db.select({
      id: lectures.id,
      title: lectures.title,
      sortOrder: lectures.sortOrder,
      moduleId: lectures.moduleId,
    }).from(lectures)
      .where(eq(lectures.moduleId, mod.id))
      .orderBy(asc(lectures.sortOrder));
    moduleLectures.push({ module: mod, lectures: lecs });
  }

  // 4. Get quizzes with their module mapping
  const quizModuleMap: Record<number, number | null> = {};
  for (const quiz of courseQuizzesList) {
    quizModuleMap[quiz.id] = quiz.moduleId;
  }

  // 5. Get lecture progress
  const progress = await db.select().from(lectureProgress)
    .where(and(eq(lectureProgress.userId, userId), eq(lectureProgress.courseId, courseId)));

  // 6. Get lab completions
  const labs = await db.select().from(labCompletions)
    .where(and(eq(labCompletions.userId, userId), eq(labCompletions.courseId, courseId)));

  return {
    attempts,
    allQuestions,
    moduleLectures,
    quizModuleMap,
    courseQuizzes: courseQuizzesList,
    lectureProgress: progress,
    labCompletions: labs,
  };
}

// ─── FLASHCARD QUERIES ─────────────────────────────────────────

import { flashcardReviews, InsertFlashcardReview } from "../drizzle/schema";
import { lte } from "drizzle-orm";

/**
 * Get all flashcards for a user in a specific course
 */
export async function getUserFlashcards(userId: number, courseId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(flashcardReviews)
    .where(and(eq(flashcardReviews.userId, userId), eq(flashcardReviews.courseId, courseId)))
    .orderBy(asc(flashcardReviews.nextReviewAt));
}

/**
 * Get flashcards due for review (nextReviewAt <= now)
 */
export async function getDueFlashcards(userId: number, courseId: number, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(flashcardReviews)
    .where(and(
      eq(flashcardReviews.userId, userId),
      eq(flashcardReviews.courseId, courseId),
      lte(flashcardReviews.nextReviewAt, new Date())
    ))
    .orderBy(asc(flashcardReviews.nextReviewAt))
    .limit(limit);
}

/**
 * Get flashcard stats for a user across all courses
 */
export async function getFlashcardStats(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select({
    courseId: flashcardReviews.courseId,
    total: count(flashcardReviews.id),
    due: count(sql`CASE WHEN ${flashcardReviews.nextReviewAt} <= NOW() THEN 1 END`),
    mastered: count(sql`CASE WHEN ${flashcardReviews.repetitions} >= 5 THEN 1 END`),
  }).from(flashcardReviews)
    .where(eq(flashcardReviews.userId, userId))
    .groupBy(flashcardReviews.courseId);
}

/**
 * Initialize flashcards from glossary for a user's course
 */
export async function initializeFlashcardsFromGlossary(userId: number, courseId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Check if user already has flashcards for this course
  const existing = await db.select({ cnt: count(flashcardReviews.id) }).from(flashcardReviews)
    .where(and(eq(flashcardReviews.userId, userId), eq(flashcardReviews.courseId, courseId)));
  if (existing[0]?.cnt > 0) return existing[0].cnt;

  // Get all lectures with glossary content for this course
  const courseLectures = await db.select({
    id: lectures.id,
    glossaryContent: lectures.glossaryContent,
    arabicGlossary: lectures.arabicGlossary,
  }).from(lectures).where(eq(lectures.courseId, courseId));

  const cards: InsertFlashcardReview[] = [];

  for (const lec of courseLectures) {
    if (!lec.glossaryContent) continue;
    // Parse glossary content - supports multiple formats:
    // 1. "**Term**: Definition" or "- **Term**: Definition" (inline)
    // 2. "**Term:**\n> Definition" (blockquote on next line)
    // 3. "**Term:** Definition" (colon inside bold or right after)
    const lines = lec.glossaryContent.split('\n');
    const arabicLines = lec.arabicGlossary ? lec.arabicGlossary.split('\n') : [];

    // Build a map of term indices for Arabic matching
    let termIndex = 0;
    const arabicTerms: Array<{ term: string | null; definition: string | null }> = [];
    // Pre-parse Arabic glossary
    if (arabicLines.length > 0) {
      for (let ai = 0; ai < arabicLines.length; ai++) {
        const arLine = arabicLines[ai].trim();
        const arInlineMatch = arLine.match(/^[-*]*\s*\*\*(.+?)\*\*\s*[-:—]+\s*(.+)/) || arLine.match(/^[-*]*\s*\*\*(.+?):?\*\*:?\s+(.+)/);
        if (arInlineMatch) {
          arabicTerms.push({ term: arInlineMatch[1].trim(), definition: arInlineMatch[2].trim() });
          continue;
        }
        // Check for term-only line with blockquote or definition list on next line
        const arTermOnly = arLine.match(/^[-*]*\s*\*\*(.+?)\*\*\s*[:—]*\s*$/);
        if (arTermOnly) {
          let arDef = '';
          for (let aj = ai + 1; aj < arabicLines.length; aj++) {
            const nextArLine = arabicLines[aj].trim();
            if (nextArLine.startsWith('>')) {
              arDef += (arDef ? ' ' : '') + nextArLine.replace(/^>\s*/, '').trim();
            } else if (nextArLine.startsWith(':')) {
              arDef += (arDef ? ' ' : '') + nextArLine.replace(/^:\s*/, '').trim();
            } else break;
          }
          if (arDef) {
            arabicTerms.push({ term: arTermOnly[1].trim(), definition: arDef });
          }
        }
      }
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      let term: string | null = null;
      let definition: string | null = null;

      // Pattern 1: Inline definition "**Term**: Definition" or "**Term:** Definition"
      // Also handles colon inside bold: "**Term:** Definition"
      const inlineMatch = line.match(/^[-*]*\s*\*\*(.+?)\*\*\s*[-:—]+\s*(.+)/) || line.match(/^[-*]*\s*\*\*(.+?):?\*\*:?\s+(.+)/);
      if (inlineMatch) {
        term = inlineMatch[1].trim();
        // Remove trailing colon from term if present
        term = term.replace(/:$/, '').trim();
        definition = inlineMatch[2].trim();
      }

      // Pattern 2: Term on one line, definition on next line(s)
      // Supports: blockquote "> Definition" and definition list ": Definition"
      if (!term) {
        const termOnlyMatch = line.match(/^[-*]*\s*\*\*(.+?)\*\*\s*[:—]*\s*$/);
        if (termOnlyMatch) {
          term = termOnlyMatch[1].trim().replace(/:$/, '').trim();
          let def = '';
          for (let j = i + 1; j < lines.length; j++) {
            const nextLine = lines[j].trim();
            if (nextLine.startsWith('>')) {
              def += (def ? ' ' : '') + nextLine.replace(/^>\s*/, '').trim();
            } else if (nextLine.startsWith(':')) {
              def += (def ? ' ' : '') + nextLine.replace(/^:\s*/, '').trim();
            } else break;
          }
          if (def) {
            definition = def;
          } else {
            term = null; // No definition found, skip
          }
        }
      }

      if (term && definition) {
        // Try to find corresponding Arabic term by index
        let arabicTerm = null;
        let arabicDefinition = null;
        if (termIndex < arabicTerms.length) {
          arabicTerm = arabicTerms[termIndex].term;
          arabicDefinition = arabicTerms[termIndex].definition;
        }
        termIndex++;

        cards.push({
          userId,
          courseId,
          lectureId: lec.id,
          term,
          definition,
          arabicTerm,
          arabicDefinition,
          interval: 1,
          repetitions: 0,
          easeFactor: 250,
          nextReviewAt: new Date(),
        });
      }
    }
  }

  if (cards.length > 0) {
    // Insert in batches of 100
    for (let i = 0; i < cards.length; i += 100) {
      const batch = cards.slice(i, i + 100);
      await db.insert(flashcardReviews).values(batch);
    }
  }

  return cards.length;
}

/**
 * Update a flashcard after review using SM-2 algorithm
 * quality: 0-5 (0=complete blackout, 5=perfect response)
 */
export async function reviewFlashcard(cardId: number, userId: number, quality: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const card = await db.select().from(flashcardReviews)
    .where(and(eq(flashcardReviews.id, cardId), eq(flashcardReviews.userId, userId)))
    .limit(1);
  if (!card[0]) throw new Error("Flashcard not found");

  const c = card[0];
  let { interval, repetitions, easeFactor } = c;

  // SM-2 algorithm
  if (quality >= 3) {
    // Correct response
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * (easeFactor / 100));
    }
    repetitions += 1;
  } else {
    // Incorrect response - reset
    repetitions = 0;
    interval = 1;
  }

  // Update ease factor: EF' = EF + (0.1 - (5-q) * (0.08 + (5-q) * 0.02))
  easeFactor = Math.max(130, easeFactor + Math.round((0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)) * 100));

  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + interval);

  await db.update(flashcardReviews)
    .set({
      interval,
      repetitions,
      easeFactor,
      nextReviewAt,
      lastReviewedAt: new Date(),
    })
    .where(eq(flashcardReviews.id, cardId));

  return { interval, repetitions, easeFactor, nextReviewAt };
}


// ─── ENROLLMENT AUDIT LOG ──────────────────────────────────────

export async function createEnrollmentLogEntry(entry: InsertEnrollmentLog) {
  const database = await getDb();
  if (!database) return null;
  const [result] = await database.insert(enrollmentLog).values(entry);
  return result.insertId;
}

export async function getEnrollmentLogs(options?: {
  limit?: number;
  offset?: number;
  userId?: number;
  adminId?: number;
  courseId?: number;
  bundleId?: number;
  action?: "enroll_course" | "enroll_bundle";
}) {
  const database = await getDb();
  if (!database) return [];
  const { limit = 50, offset = 0, userId, adminId, courseId, bundleId, action } = options ?? {};

  const conditions = [];
  if (userId) conditions.push(eq(enrollmentLog.userId, userId));
  if (adminId) conditions.push(eq(enrollmentLog.adminId, adminId));
  if (courseId) conditions.push(eq(enrollmentLog.courseId, courseId));
  if (bundleId) conditions.push(eq(enrollmentLog.bundleId, bundleId));
  if (action) conditions.push(eq(enrollmentLog.action, action));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const logs = await database
    .select()
    .from(enrollmentLog)
    .where(whereClause)
    .orderBy(desc(enrollmentLog.createdAt))
    .limit(limit)
    .offset(offset);

  return logs;
}

export async function getEnrollmentLogCount(options?: {
  userId?: number;
  adminId?: number;
  action?: "enroll_course" | "enroll_bundle";
}) {
  const database = await getDb();
  if (!database) return 0;
  const { userId, adminId, action } = options ?? {};

  const conditions = [];
  if (userId) conditions.push(eq(enrollmentLog.userId, userId));
  if (adminId) conditions.push(eq(enrollmentLog.adminId, adminId));
  if (action) conditions.push(eq(enrollmentLog.action, action));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [result] = await database
    .select({ total: count() })
    .from(enrollmentLog)
    .where(whereClause);

  return result?.total ?? 0;
}

export async function getEnrollmentLogsWithDetails(options?: {
  limit?: number;
  offset?: number;
}) {
  const database = await getDb();
  if (!database) return [];
  const { limit = 50, offset = 0 } = options ?? {};

  const logs = await database
    .select()
    .from(enrollmentLog)
    .orderBy(desc(enrollmentLog.createdAt))
    .limit(limit)
    .offset(offset);

  // Enrich with student name, course name, bundle name, admin name
  const enriched = [];
  for (const log of logs) {
    const student = await getUserById(log.userId);
    const admin = await getUserById(log.adminId);
    const course = log.courseId ? await getCourseById(log.courseId) : null;
    const bundle = log.bundleId ? await getBundleById(log.bundleId) : null;

    enriched.push({
      ...log,
      studentName: student?.name || "Unknown",
      studentEmail: student?.email || null,
      adminName: admin?.name || "Unknown",
      courseName: course?.title || null,
      bundleName: bundle?.title || null,
    });
  }

  return enriched;
}
