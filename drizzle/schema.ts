import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  passwordHash: varchar("passwordHash", { length: 255 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Bundles — course packages (e.g. CompTIA Bundle, CISM + SecAI+ Bundle)
 */
export const bundles = mysqlTable("bundles", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  priceUsd: int("priceUsd").notNull(), // bundle price in USD
  originalPriceUsd: int("originalPriceUsd"), // combined individual price before discount
  isActive: boolean("isActive").default(true).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Bundle = typeof bundles.$inferSelect;
export type InsertBundle = typeof bundles.$inferInsert;

/**
 * Bundle-Course mapping — which courses belong to which bundle
 */
export const bundleCourses = mysqlTable("bundle_courses", {
  id: int("id").autoincrement().primaryKey(),
  bundleId: int("bundleId").notNull(),
  courseId: int("courseId").notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
});

export type BundleCourse = typeof bundleCourses.$inferSelect;
export type InsertBundleCourse = typeof bundleCourses.$inferInsert;

/**
 * Courses — all certification courses
 */
export const courses = mysqlTable("courses", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 500 }),
  description: text("description"),
  certCode: varchar("certCode", { length: 50 }), // e.g. "SY0-701", "CY0-001"
  totalHours: int("totalHours"),
  totalSessions: int("totalSessions"),
  examFormat: varchar("examFormat", { length: 255 }),
  priceSelfPaced: int("priceSelfPaced"), // in USD
  priceLive: int("priceLive"), // in USD
  imageUrl: varchar("imageUrl", { length: 500 }),
  isPublished: boolean("isPublished").default(false).notNull(),
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

/**
 * Modules — e.g. "Module 1: General Security Concepts"
 */
export const modules = mysqlTable("modules", {
  id: int("id").autoincrement().primaryKey(),
  courseId: int("courseId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  sortOrder: int("sortOrder").default(0).notNull(),
  examWeight: varchar("examWeight", { length: 20 }), // e.g. "12%"
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Module = typeof modules.$inferSelect;
export type InsertModule = typeof modules.$inferInsert;

/**
 * Lectures — individual lesson sessions within a module
 */
export const lectures = mysqlTable("lectures", {
  id: int("id").autoincrement().primaryKey(),
  moduleId: int("moduleId").notNull(),
  courseId: int("courseId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull(),
  content: text("content"), // markdown content from lesson plans
  studyGuideContent: text("studyGuideContent"), // from study guides
  glossaryContent: text("glossaryContent"), // from glossaries
  arabicContent: text("arabicContent"), // Arabic translation of content
  arabicStudyGuide: text("arabicStudyGuide"), // Arabic translation of study guide
  arabicGlossary: text("arabicGlossary"), // Arabic translation of glossary
  audioUrl: varchar("audioUrl", { length: 500 }), // TTS audio URL (English)
  arabicAudioUrl: varchar("arabicAudioUrl", { length: 500 }), // TTS audio URL (Arabic)
  slideUrl: varchar("slideUrl", { length: 500 }), // PPTX slide deck URL (with embedded audio)
  studySheetEnUrl: varchar("study_sheet_en_url", { length: 500 }), // English study sheet PDF URL
  studySheetArUrl: varchar("study_sheet_ar_url", { length: 500 }), // Arabic study sheet PDF URL
  durationMinutes: int("durationMinutes"),
  objectives: text("objectives"), // exam objectives covered, e.g. "1.1, 1.2"
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Lecture = typeof lectures.$inferSelect;
export type InsertLecture = typeof lectures.$inferInsert;

/**
 * Quizzes — end-of-module quizzes and final exam
 */
export const quizzes = mysqlTable("quizzes", {
  id: int("id").autoincrement().primaryKey(),
  moduleId: int("moduleId"), // null for final exam
  courseId: int("courseId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  arabicTitle: varchar("arabicTitle", { length: 500 }), // Arabic translation of quiz title
  description: text("description"),
  arabicDescription: text("arabicDescription"), // Arabic translation of description
  isFinalExam: boolean("isFinalExam").default(false).notNull(),
  timeLimitMinutes: int("timeLimitMinutes"), // null = no time limit, set for final exam
  passingScore: int("passingScore").default(70), // percentage
  sortOrder: int("sortOrder").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = typeof quizzes.$inferInsert;

/**
 * Questions — individual quiz/exam questions
 */
export const questions = mysqlTable("questions", {
  id: int("id").autoincrement().primaryKey(),
  quizId: int("quizId").notNull(),
  questionText: text("questionText").notNull(),
  optionA: text("optionA").notNull(),
  optionB: text("optionB").notNull(),
  optionC: text("optionC").notNull(),
  optionD: text("optionD").notNull(),
  correctAnswer: varchar("correctAnswer", { length: 1 }).notNull(), // "A", "B", "C", "D"
  explanation: text("explanation"), // answer explanation
  arabicQuestionText: text("arabicQuestionText"), // Arabic translation of question
  arabicOptionA: text("arabicOptionA"), // Arabic translation of option A
  arabicOptionB: text("arabicOptionB"), // Arabic translation of option B
  arabicOptionC: text("arabicOptionC"), // Arabic translation of option C
  arabicOptionD: text("arabicOptionD"), // Arabic translation of option D
  arabicExplanation: text("arabicExplanation"), // Arabic translation of explanation
  objective: varchar("objective", { length: 50 }), // exam objective reference
  sortOrder: int("sortOrder").default(0).notNull(),
});

export type Question = typeof questions.$inferSelect;
export type InsertQuestion = typeof questions.$inferInsert;

/**
 * Enrollments — student course enrollments
 */
export const enrollments = mysqlTable("enrollments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseId: int("courseId").notNull(),
  tier: mysqlEnum("tier", ["self_paced", "live"]).notNull(),
  status: mysqlEnum("status", ["active", "completed", "suspended"]).default("active").notNull(),
  enrolledAt: timestamp("enrolledAt").defaultNow().notNull(),
  bundleId: int("bundleId"), // if enrolled via a bundle purchase
  completedAt: timestamp("completedAt"),
});

export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = typeof enrollments.$inferInsert;

/**
 * Lecture Progress — tracks which lectures a student has completed
 */
export const lectureProgress = mysqlTable("lecture_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  lectureId: int("lectureId").notNull(),
  courseId: int("courseId").notNull(),
  completed: boolean("completed").default(false).notNull(),
  completedAt: timestamp("completedAt"),
  lastAccessedAt: timestamp("lastAccessedAt").defaultNow().notNull(),
});

export type LectureProgress = typeof lectureProgress.$inferSelect;
export type InsertLectureProgress = typeof lectureProgress.$inferInsert;

/**
 * Quiz Attempts — records each quiz attempt with score
 */
export const quizAttempts = mysqlTable("quiz_attempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  quizId: int("quizId").notNull(),
  courseId: int("courseId").notNull(),
  score: int("score").notNull(), // percentage 0-100
  totalQuestions: int("totalQuestions").notNull(),
  correctAnswers: int("correctAnswers").notNull(),
  answers: json("answers"), // JSON: { questionId: selectedAnswer }
  passed: boolean("passed").default(false).notNull(),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type InsertQuizAttempt = typeof quizAttempts.$inferInsert;

/**
 * Certificates — issued when a student passes the final exam with >= 80%
 */
export const certificates = mysqlTable("certificates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseId: int("courseId").notNull(),
  quizAttemptId: int("quizAttemptId").notNull(), // the passing final exam attempt
  certificateNumber: varchar("certificateNumber", { length: 50 }).notNull().unique(), // e.g. "APEX-SEC-2026-0001"
  studentName: varchar("studentName", { length: 255 }).notNull(),
  courseTitle: varchar("courseTitle", { length: 255 }).notNull(),
  certCode: varchar("certCode", { length: 50 }), // e.g. "SY0-701"
  score: int("score").notNull(), // final exam score
  pdfUrl: varchar("pdfUrl", { length: 500 }), // S3 URL to generated PDF
  issuedAt: timestamp("issuedAt").defaultNow().notNull(),
});

export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = typeof certificates.$inferInsert;

/**
 * Badges — earned for achievements (course completion, high scores, mini-game mastery)
 */
export const badges = mysqlTable("badges", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseId: int("courseId"),
  badgeType: mysqlEnum("badgeType", [
    "course_complete",     // Passed the final exam
    "perfect_score",       // 100% on any quiz
    "speed_demon",         // Completed final exam in under 30 min
    "all_lectures",        // Completed all lectures in a course
    "quiz_master",         // Passed all module quizzes in a course
    "honor_roll",          // 90%+ on final exam
  ]).notNull(),
  title: varchar("title", { length: 100 }).notNull(),
  description: varchar("description", { length: 500 }),
  iconEmoji: varchar("iconEmoji", { length: 10 }).notNull(), // emoji icon for the badge
  earnedAt: timestamp("earnedAt").defaultNow().notNull(),
});

export type Badge = typeof badges.$inferSelect;
export type InsertBadge = typeof badges.$inferInsert;

/**
 * Slide Downloads — tracks which lecture slides a student has downloaded
 */
export const slideDownloads = mysqlTable("slide_downloads", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  lectureId: int("lectureId").notNull(),
  courseId: int("courseId").notNull(),
  downloadedAt: timestamp("downloadedAt").defaultNow().notNull(),
});

export type SlideDownload = typeof slideDownloads.$inferSelect;
export type InsertSlideDownload = typeof slideDownloads.$inferInsert;

/**
 * Lab Completions — tracks which interactive labs a student has completed
 */
export const labCompletions = mysqlTable("lab_completions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  lectureId: int("lectureId").notNull(),
  courseId: int("courseId").notNull(),
  score: int("score"), // optional score 0-100 if the lab tracks it
  completedAt: timestamp("completedAt").defaultNow().notNull(),
});

export type LabCompletion = typeof labCompletions.$inferSelect;
export type InsertLabCompletion = typeof labCompletions.$inferInsert;

/**
 * Flashcard Reviews — spaced repetition tracking for glossary terms
 * Uses SM-2 algorithm: interval grows based on ease factor and quality of recall
 */
export const flashcardReviews = mysqlTable("flashcard_reviews", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  courseId: int("courseId").notNull(),
  lectureId: int("lectureId").notNull(),
  term: varchar("term", { length: 500 }).notNull(), // the glossary term
  definition: text("definition").notNull(), // the glossary definition
  arabicTerm: varchar("arabicTerm", { length: 500 }), // Arabic term
  arabicDefinition: text("arabicDefinition"), // Arabic definition
  // SM-2 algorithm fields
  interval: int("interval_days").default(1).notNull(), // days until next review
  repetitions: int("repetitions").default(0).notNull(), // number of successful reviews
  easeFactor: int("easeFactor").default(250).notNull(), // ease factor * 100 (250 = 2.5)
  nextReviewAt: timestamp("nextReviewAt").defaultNow().notNull(), // when to show this card next
  lastReviewedAt: timestamp("lastReviewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FlashcardReview = typeof flashcardReviews.$inferSelect;
export type InsertFlashcardReview = typeof flashcardReviews.$inferInsert;

/**
 * Enrollment Log — audit trail for all enrollment actions performed by admin
 * Tracks who was enrolled, by whom, in what course/bundle, and whether email was sent.
 */
export const enrollmentLog = mysqlTable("enrollment_log", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // the student being enrolled
  adminId: int("adminId").notNull(), // the admin who performed the action
  courseId: int("courseId"), // null if bundle enrollment (multiple courses)
  bundleId: int("bundleId"), // null if single course enrollment
  tier: mysqlEnum("tier", ["self_paced", "live"]).notNull(),
  action: mysqlEnum("action", ["enroll_course", "enroll_bundle"]).notNull(),
  coursesEnrolled: int("coursesEnrolled").default(1).notNull(), // number of courses in this action
  emailSent: boolean("emailSent").default(false).notNull(),
  emailError: text("emailError"), // error message if email failed
  notes: text("notes"), // optional admin notes
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EnrollmentLog = typeof enrollmentLog.$inferSelect;
export type InsertEnrollmentLog = typeof enrollmentLog.$inferInsert;
