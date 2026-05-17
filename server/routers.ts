import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { checkAndIssueCredentials } from "./credentialIssuance";
import { sendEnrollmentEmail, previewEnrollmentEmail, isEmailServiceConfigured } from "./emailService";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── COURSE ROUTES ──────────────────────────────────────────
  course: router({
    list: publicProcedure.query(async () => {
      return db.getAllCourses();
    }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const course = await db.getCourseBySlug(input.slug);
        if (!course) return null;
        const courseModules = await db.getModulesByCourseId(course.id);
        const courseLectures = await db.getLecturesByCourseId(course.id);
        const courseQuizzes = await db.getQuizzesByCourseId(course.id);
        return { course, modules: courseModules, lectures: courseLectures, quizzes: courseQuizzes };
      }),

    getModules: publicProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ input }) => {
        return db.getModulesByCourseId(input.courseId);
      }),

    getLectures: publicProcedure
      .input(z.object({ moduleId: z.number() }))
      .query(async ({ input }) => {
        return db.getLecturesByModuleId(input.moduleId);
      }),
  }),

  // --- BUNDLE ROUTES ---
  bundle: router({
    list: publicProcedure.query(async () => {
      return db.getAllBundlesWithCourses();
    }),

    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const bundle = await db.getBundleBySlug(input.slug);
        if (!bundle) return null;
        const courses = await db.getBundleCourses(bundle.id);
        return { ...bundle, courses };
      }),

    enrollInBundle: protectedProcedure
      .input(z.object({
        bundleId: z.number(),
        tier: z.enum(["self_paced", "live"]),
      }))
      .mutation(async ({ ctx, input }) => {
        const bundle = await db.getBundleById(input.bundleId);
        if (!bundle) return { success: false, message: "Bundle not found" };
        const enrollmentIds = await db.enrollInBundle(ctx.user.id, input.bundleId, input.tier);
        return { success: true, enrollmentIds, coursesEnrolled: enrollmentIds.length };
      }),
  }),

  // ─── ENROLLMENT ROUTES ────────────────────────────────────
  enrollment: router({
    myEnrollments: protectedProcedure.query(async ({ ctx }) => {
      const enrollmentList = await db.getUserEnrollments(ctx.user.id);
      // Attach course info and progress
      const result = [];
      for (const e of enrollmentList) {
        const course = await db.getCourseById(e.courseId);
        const progress = await db.getCourseProgressStats(ctx.user.id, e.courseId);
        result.push({ ...e, course, progress });
      }
      return result;
    }),

    checkEnrollment: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ ctx, input }) => {
        const enrollment = await db.getUserEnrollmentForCourse(ctx.user.id, input.courseId);
        return enrollment ?? null;
      }),

    enroll: protectedProcedure
      .input(z.object({
        courseId: z.number(),
        tier: z.enum(["self_paced", "live"]),
      }))
      .mutation(async ({ ctx, input }) => {
        // Check if already enrolled
        const existing = await db.getUserEnrollmentForCourse(ctx.user.id, input.courseId);
        if (existing) {
          return { success: false, message: "Already enrolled in this course" };
        }
        const id = await db.createEnrollment({
          userId: ctx.user.id,
          courseId: input.courseId,
          tier: input.tier,
          status: "active",
        });
        return { success: true, enrollmentId: id };
      }),
  }),

  // ─── LECTURE / PROGRESS ROUTES ────────────────────────────────
  lecture: router({
    get: protectedProcedure
      .input(z.object({ lectureId: z.number() }))
      .query(async ({ ctx, input }) => {
        const lec = await db.getLectureById(input.lectureId);
        if (!lec) return null;
        // Verify enrollment
        const enrollment = await db.getUserEnrollmentForCourse(ctx.user.id, lec.courseId);
        if (!enrollment) return null;
        // Update access timestamp
        await db.updateLectureAccess(ctx.user.id, lec.id, lec.courseId);
        return lec;
      }),

    getBySlug: protectedProcedure
      .input(z.object({ slug: z.string(), courseId: z.number() }))
      .query(async ({ ctx, input }) => {
        const lec = await db.getLectureBySlug(input.slug, input.courseId);
        if (!lec) return null;
        const enrollment = await db.getUserEnrollmentForCourse(ctx.user.id, lec.courseId);
        if (!enrollment) return null;
        await db.updateLectureAccess(ctx.user.id, lec.id, lec.courseId);
        return lec;
      }),

    markComplete: protectedProcedure
      .input(z.object({ lectureId: z.number(), courseId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.markLectureComplete(ctx.user.id, input.lectureId, input.courseId);
        return { success: true };
      }),

    progress: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ ctx, input }) => {
        const progressList = await db.getUserLectureProgress(ctx.user.id, input.courseId);
        const stats = await db.getCourseProgressStats(ctx.user.id, input.courseId);
        return { progress: progressList, stats };
      }),
  }),
  // ─── SLIDE DOWNLOAD TRACKING ────────────────────────────────────────
  slideDownload: router({
    record: protectedProcedure
      .input(z.object({ lectureId: z.number(), courseId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const id = await db.recordSlideDownload(ctx.user.id, input.lectureId, input.courseId);
        return { success: true, id };
      }),

    forCourse: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ ctx, input }) => {
        return db.getSlideDownloadsForCourse(ctx.user.id, input.courseId);
      }),

    all: protectedProcedure.query(async ({ ctx }) => {
      return db.getAllSlideDownloads(ctx.user.id);
    }),
  }),

  // ─── LAB COMPLETION TRACKING ────────────────────────────────────────
  labCompletion: router({
    record: protectedProcedure
      .input(z.object({ lectureId: z.number(), courseId: z.number(), score: z.number().optional() }))
      .mutation(async ({ ctx, input }) => {
        const id = await db.recordLabCompletion(ctx.user.id, input.lectureId, input.courseId, input.score);
        return { success: true, id };
      }),

    forCourse: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ ctx, input }) => {
        return db.getUserLabCompletions(ctx.user.id, input.courseId);
      }),

    all: protectedProcedure.query(async ({ ctx }) => {
      return db.getAllLabCompletions(ctx.user.id);
    }),
  }),

  // ─── PRACTICE EXAM ROUTES ──────────────────────────────────────────
  practiceExam: router({
    generate: protectedProcedure
      .input(z.object({
        courseId: z.number(),
        questionCount: z.number().min(10).max(100).default(50),
        timeLimitMinutes: z.number().min(10).max(180).default(90),
      }))
      .mutation(async ({ ctx, input }) => {
        // Verify enrollment
        const enrollment = await db.getUserEnrollmentForCourse(ctx.user.id, input.courseId);
        if (!enrollment) throw new Error("Not enrolled in this course");
        // Pull random questions from all quizzes in this course
        const courseQuizzes = await db.getQuizzesByCourseId(input.courseId);
        const allQuestions: Array<{ id: number; questionText: string; optionA: string; optionB: string; optionC: string; optionD: string; objective: string | null; sortOrder: number; quizId: number; arabicQuestionText: string | null; arabicOptionA: string | null; arabicOptionB: string | null; arabicOptionC: string | null; arabicOptionD: string | null }> = [];
        for (const quiz of courseQuizzes) {
          const qs = await db.getQuestionsByQuizId(quiz.id);
          allQuestions.push(...qs.map(q => ({ ...q, quizId: quiz.id })));
        }
        // Shuffle and pick requested count
        const shuffled = allQuestions.sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(input.questionCount, shuffled.length));
        // Strip correct answers
        const questionsForStudent = selected.map(q => ({
          id: q.id,
          questionText: q.questionText,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          objective: q.objective,
          arabicQuestionText: q.arabicQuestionText,
          arabicOptionA: q.arabicOptionA,
          arabicOptionB: q.arabicOptionB,
          arabicOptionC: q.arabicOptionC,
          arabicOptionD: q.arabicOptionD,
        }));
        return {
          questions: questionsForStudent,
          totalQuestions: questionsForStudent.length,
          timeLimitMinutes: input.timeLimitMinutes,
          courseId: input.courseId,
        };
      }),

    submit: protectedProcedure
      .input(z.object({
        courseId: z.number(),
        answers: z.record(z.string(), z.string()),
        questionIds: z.array(z.number()),
        timeTakenSeconds: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Grade the practice exam
        const results: Array<{
          questionId: number;
          selected: string;
          correct: string;
          isCorrect: boolean;
          explanation: string | null;
          arabicExplanation: string | null;
          objective: string | null;
        }> = [];
        let correctCount = 0;
        const objectiveScores: Record<string, { correct: number; total: number }> = {};

        for (const qId of input.questionIds) {
          const question = await db.getQuestionById(qId);
          if (!question) continue;
          const selected = input.answers[String(qId)] || "";
          const isCorrect = selected.toUpperCase() === question.correctAnswer.toUpperCase();
          if (isCorrect) correctCount++;

          const obj = question.objective || "General";
          if (!objectiveScores[obj]) objectiveScores[obj] = { correct: 0, total: 0 };
          objectiveScores[obj].total++;
          if (isCorrect) objectiveScores[obj].correct++;

          results.push({
            questionId: qId,
            selected,
            correct: question.correctAnswer,
            isCorrect,
            explanation: question.explanation,
            arabicExplanation: question.arabicExplanation,
            objective: question.objective,
          });
        }

        const totalQuestions = input.questionIds.length;
        const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

        // Build objective breakdown
        const objectiveBreakdown = Object.entries(objectiveScores).map(([obj, s]) => ({
          objective: obj,
          correct: s.correct,
          total: s.total,
          percentage: Math.round((s.correct / s.total) * 100),
        })).sort((a, b) => a.objective.localeCompare(b.objective));

        return {
          score,
          totalQuestions,
          correctAnswers: correctCount,
          passed: score >= 70,
          timeTakenSeconds: input.timeTakenSeconds,
          results,
          objectiveBreakdown,
        };
      }),
  }),

  // ─── QUIZ ROUTES ──────────────────────────────────────────────────────
  quiz: router({
    listForCourse: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ ctx, input }) => {
        const enrollment = await db.getUserEnrollmentForCourse(ctx.user.id, input.courseId);
        if (!enrollment) return [];
        return db.getQuizzesByCourseId(input.courseId);
      }),

    get: protectedProcedure
      .input(z.object({ quizId: z.number() }))
      .query(async ({ ctx, input }) => {
        const quiz = await db.getQuizById(input.quizId);
        if (!quiz) return null;
        // Verify enrollment
        const enrollment = await db.getUserEnrollmentForCourse(ctx.user.id, quiz.courseId);
        if (!enrollment) return null;
        // Get questions (without correct answers for the student)
        const allQuestions = await db.getQuestionsByQuizId(quiz.id);
        const questionsForStudent = allQuestions.map(q => ({
          id: q.id,
          questionText: q.questionText,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          objective: q.objective,
          sortOrder: q.sortOrder,
          arabicQuestionText: q.arabicQuestionText,
          arabicOptionA: q.arabicOptionA,
          arabicOptionB: q.arabicOptionB,
          arabicOptionC: q.arabicOptionC,
          arabicOptionD: q.arabicOptionD,
        }));
        return { quiz, questions: questionsForStudent };
      }),

    submit: protectedProcedure
      .input(z.object({
        quizId: z.number(),
        answers: z.record(z.string(), z.string()), // { questionId: "A"|"B"|"C"|"D" }
        startTime: z.number().optional(), // timestamp when quiz was started
        origin: z.string().optional(), // site origin for certificate email links
      }))
      .mutation(async ({ ctx, input }) => {
        const quiz = await db.getQuizById(input.quizId);
        if (!quiz) throw new Error("Quiz not found");
        const enrollment = await db.getUserEnrollmentForCourse(ctx.user.id, quiz.courseId);
        if (!enrollment) throw new Error("Not enrolled");

        const allQuestions = await db.getQuestionsByQuizId(quiz.id);
        let correctCount = 0;
        const results: Array<{
          questionId: number;
          selected: string;
          correct: string;
          isCorrect: boolean;
          explanation: string | null;
          arabicExplanation: string | null;
        }> = [];

        for (const q of allQuestions) {
          const selected = input.answers[String(q.id)] || "";
          const isCorrect = selected.toUpperCase() === q.correctAnswer.toUpperCase();
          if (isCorrect) correctCount++;
          results.push({
            questionId: q.id,
            selected,
            correct: q.correctAnswer,
            isCorrect,
            explanation: q.explanation,
            arabicExplanation: q.arabicExplanation,
          });
        }

        const totalQuestions = allQuestions.length;
        const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
        const passed = score >= (quiz.passingScore ?? 70);

        const attemptId = await db.createQuizAttempt({
          userId: ctx.user.id,
          quizId: quiz.id,
          courseId: quiz.courseId,
          score,
          totalQuestions,
          correctAnswers: correctCount,
          answers: input.answers,
          passed,
          completedAt: new Date(),
        });

        // Check and issue certificates/badges
        let credentials: { certificate: { issued: boolean; certificateNumber?: string; pdfUrl?: string; emailSent?: boolean; emailError?: string }; badges: Array<{ type: string; title: string; iconEmoji: string }> } = { certificate: { issued: false }, badges: [] };
        try {
          const timeTakenMinutes = input.startTime
            ? Math.round((Date.now() - input.startTime) / 60000)
            : undefined;
          credentials = await checkAndIssueCredentials({
            userId: ctx.user.id,
            courseId: quiz.courseId,
            quizId: quiz.id,
            score,
            passed,
            isFinalExam: quiz.isFinalExam,
            totalQuestions,
            correctAnswers: correctCount,
            attemptId,
            timeTakenMinutes,
            siteOrigin: input.origin,
          });
        } catch (error) {
          console.error("[Credentials] Error checking credentials:", error);
        }

        return {
          attemptId,
          score,
          totalQuestions,
          correctAnswers: correctCount,
          passed,
          passingScore: quiz.passingScore ?? 70,
          results,
          credentials,
        };
      }),

    attempts: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ ctx, input }) => {
        return db.getUserQuizAttempts(ctx.user.id, input.courseId);
      }),

    bestAttempt: protectedProcedure
      .input(z.object({ quizId: z.number() }))
      .query(async ({ ctx, input }) => {
        return db.getBestQuizAttempt(ctx.user.id, input.quizId) ?? null;
      }),

    listForCourse: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ ctx, input }) => {
        const enrollment = await db.getUserEnrollmentForCourse(ctx.user.id, input.courseId);
        if (!enrollment) return [];
        return db.getQuizzesByCourseId(input.courseId);
      }),
  }),

  // ─── CERTIFICATE & BADGE ROUTES ────────────────────────────────
  credential: router({
    myCertificates: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserCertificates(ctx.user.id);
    }),

    myBadges: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserBadges(ctx.user.id);
    }),

    certificateForCourse: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ ctx, input }) => {
        return db.getCertificateForCourse(ctx.user.id, input.courseId) ?? null;
      }),

    badgesForCourse: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ ctx, input }) => {
        return db.getUserBadgesForCourse(ctx.user.id, input.courseId);
      }),

    verify: publicProcedure
      .input(z.object({ certificateNumber: z.string() }))
      .query(async ({ input }) => {
        const cert = await db.getCertificateByNumber(input.certificateNumber);
        if (!cert) return null;
        return {
          valid: true,
          studentName: cert.studentName,
          courseTitle: cert.courseTitle,
          certCode: cert.certCode,
          score: cert.score,
          issuedAt: cert.issuedAt,
          certificateNumber: cert.certificateNumber,
        };
      }),
  }),

  // ─── STUDY PLANNER ROUTES ──────────────────────────────────────
  studyPlanner: router({
    analyze: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ ctx, input }) => {
        const enrollment = await db.getUserEnrollmentForCourse(ctx.user.id, input.courseId);
        if (!enrollment) throw new Error("Not enrolled in this course");

        const data = await db.getStudyPlannerData(ctx.user.id, input.courseId);
        if (!data) return null;

        // Build a question lookup
        const questionMap = new Map(data.allQuestions.map(q => [q.id, q]));

        // Analyze all attempts to find weak objectives
        const objectiveStats: Record<string, { correct: number; total: number; recentWrong: number[] }> = {};

        for (const attempt of data.attempts) {
          if (!attempt.answers) continue;
          const answers = typeof attempt.answers === 'string' ? JSON.parse(attempt.answers) : attempt.answers;
          // answers is Record<questionId, selectedAnswer>
          for (const [qIdStr, selectedAnswer] of Object.entries(answers as Record<string, string>)) {
            const qId = parseInt(qIdStr);
            const question = questionMap.get(qId);
            if (!question) continue;
            const objective = question.objective || 'General';
            if (!objectiveStats[objective]) {
              objectiveStats[objective] = { correct: 0, total: 0, recentWrong: [] };
            }
            objectiveStats[objective].total++;
            const isCorrect = selectedAnswer.toUpperCase() === question.correctAnswer.toUpperCase();
            if (isCorrect) {
              objectiveStats[objective].correct++;
            } else {
              objectiveStats[objective].recentWrong.push(qId);
            }
          }
        }

        // Build objective-to-module mapping
        // Questions belong to quizzes, quizzes belong to modules
        const objectiveModuleMap: Record<string, Set<number>> = {};
        for (const q of data.allQuestions) {
          const obj = q.objective || 'General';
          const moduleId = data.quizModuleMap[q.quizId];
          if (moduleId) {
            if (!objectiveModuleMap[obj]) objectiveModuleMap[obj] = new Set();
            objectiveModuleMap[obj].add(moduleId);
          }
        }

        // Build weakness analysis sorted by error rate (worst first)
        const weakAreas = Object.entries(objectiveStats)
          .map(([objective, stats]) => {
            const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
            const moduleIds = objectiveModuleMap[objective] ? Array.from(objectiveModuleMap[objective]) : [];
            // Find recommended lectures from those modules
            const recommendedLectures: Array<{ id: number; title: string; moduleTitle: string; completed: boolean; labDone: boolean }> = [];
            for (const ml of data.moduleLectures) {
              if (moduleIds.includes(ml.module.id)) {
                for (const lec of ml.lectures) {
                  const completed = data.lectureProgress.some(p => p.lectureId === lec.id && p.completed);
                  const labDone = data.labCompletions.some(l => l.lectureId === lec.id);
                  recommendedLectures.push({
                    id: lec.id,
                    title: lec.title,
                    moduleTitle: ml.module.title,
                    completed,
                    labDone,
                  });
                }
              }
            }
            return {
              objective,
              accuracy,
              correct: stats.correct,
              total: stats.total,
              wrongCount: stats.total - stats.correct,
              status: accuracy >= 80 ? 'strong' as const : accuracy >= 60 ? 'moderate' as const : 'weak' as const,
              recommendedLectures,
            };
          })
          .sort((a, b) => a.accuracy - b.accuracy);

        // Overall stats
        const totalAnswered = Object.values(objectiveStats).reduce((s, o) => s + o.total, 0);
        const totalCorrect = Object.values(objectiveStats).reduce((s, o) => s + o.correct, 0);
        const overallAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
        const weakCount = weakAreas.filter(a => a.status === 'weak').length;
        const moderateCount = weakAreas.filter(a => a.status === 'moderate').length;
        const strongCount = weakAreas.filter(a => a.status === 'strong').length;

        // Build a prioritized study plan (top 5 weakest areas)
        const studyPlan = weakAreas
          .filter(a => a.status !== 'strong')
          .slice(0, 10)
          .map((area, idx) => ({
            priority: idx + 1,
            objective: area.objective,
            accuracy: area.accuracy,
            status: area.status,
            recommendedLectures: area.recommendedLectures,
            actionItems: [
              ...(!area.recommendedLectures.every(l => l.completed) ? ['Review the lecture content'] : []),
              ...(!area.recommendedLectures.every(l => l.labDone) ? ['Complete the interactive lab'] : []),
              'Retake the module quiz focusing on this objective',
            ],
          }));

        return {
          hasData: data.attempts.length > 0,
          totalAttempts: data.attempts.length,
          overallAccuracy,
          totalAnswered,
          totalCorrect,
          weakCount,
          moderateCount,
          strongCount,
          weakAreas,
          studyPlan,
        };
      }),
  }),

  // ─── ADMIN ROUTES ─────────────────────────────────────────────
  admin: router({
    stats: adminProcedure.query(async () => {
      return db.getAdminStats();
    }),

    students: adminProcedure.query(async () => {
      return db.getAllStudents();
    }),

    enrollments: adminProcedure.query(async () => {
      return db.getAllEnrollments();
    }),

    studentProgress: adminProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        return db.getStudentProgress(input.userId);
      }),

    courses: adminProcedure.query(async () => {
      return db.getAllCoursesAdmin();
    }),

    enrollStudent: adminProcedure
      .input(z.object({
        userId: z.number(),
        courseId: z.number(),
        tier: z.enum(["self_paced", "live"]),
        sendEmail: z.boolean().optional().default(true),
        origin: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const existing = await db.getUserEnrollmentForCourse(input.userId, input.courseId);
        if (existing) {
          return { success: false, message: "Student already enrolled", emailSent: false };
        }
        const id = await db.createEnrollment({
          userId: input.userId,
          courseId: input.courseId,
          tier: input.tier,
          status: "active",
        });

        // Send enrollment confirmation email
        let emailSent = false;
        let emailError: string | undefined;
        if (input.sendEmail) {
          try {
            const student = await db.getUserById(input.userId);
            const course = await db.getCourseById(input.courseId);
            if (student?.email && course) {
              const siteOrigin = input.origin || "https://apex-cyber-academy.manus.space";
              const result = await sendEnrollmentEmail({
                studentEmail: student.email,
                studentName: student.name || "Student",
                courseNames: [course.title],
                tier: input.tier,
                siteOrigin,
              });
              emailSent = result.success;
              if (!result.success) {
                emailError = result.error;
                console.warn("[Enrollment] Email failed:", result.error);
              }
            } else if (!student?.email) {
              emailError = "No email on file for student";
              console.warn("[Enrollment] No email on file for user", input.userId);
            }
          } catch (err) {
            emailError = err instanceof Error ? err.message : String(err);
            console.error("[Enrollment] Email error:", err);
          }
        }

        // Write audit log entry
        try {
          await db.createEnrollmentLogEntry({
            userId: input.userId,
            adminId: ctx.user.id,
            courseId: input.courseId,
            bundleId: null,
            tier: input.tier,
            action: "enroll_course",
            coursesEnrolled: 1,
            emailSent,
            emailError: emailError || null,
          });
        } catch (logErr) {
          console.error("[AuditLog] Failed to write enrollment log:", logErr);
        }

        // Notify admin/owner
        try {
          const student = await db.getUserById(input.userId);
          const course = await db.getCourseById(input.courseId);
          await notifyOwner({
            title: "New Enrollment",
            content: `${student?.name || "User #" + input.userId} enrolled in ${course?.title || "Course #" + input.courseId} (${input.tier}). Email sent: ${emailSent ? "Yes" : "No"}`,
          });
        } catch (_) { /* notification is best-effort */ }

        return { success: true, enrollmentId: id, emailSent };
      }),

    enrollStudentInBundle: adminProcedure
      .input(z.object({
        userId: z.number(),
        bundleId: z.number(),
        tier: z.enum(["self_paced", "live"]),
        sendEmail: z.boolean().optional().default(true),
        origin: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const bundle = await db.getBundleById(input.bundleId);
        if (!bundle) return { success: false, message: "Bundle not found", emailSent: false };
        const enrollmentIds = await db.enrollInBundle(input.userId, input.bundleId, input.tier);

        // Send enrollment confirmation email
        let emailSent = false;
        let emailError: string | undefined;
        if (input.sendEmail && enrollmentIds.length > 0) {
          try {
            const student = await db.getUserById(input.userId);
            const bundleCourses = await db.getBundleCourses(input.bundleId);
            const courseNames = bundleCourses.map((bc) => bc.courseTitle);
            if (student?.email && courseNames.length > 0) {
              const siteOrigin = input.origin || "https://apex-cyber-academy.manus.space";
              const result = await sendEnrollmentEmail({
                studentEmail: student.email,
                studentName: student.name || "Student",
                courseNames,
                tier: input.tier,
                bundleName: bundle.title,
                siteOrigin,
              });
              emailSent = result.success;
              if (!result.success) {
                emailError = result.error;
                console.warn("[Enrollment] Email failed:", result.error);
              }
            } else if (!student?.email) {
              emailError = "No email on file for student";
              console.warn("[Enrollment] No email on file for user", input.userId);
            }
          } catch (err) {
            emailError = err instanceof Error ? err.message : String(err);
            console.error("[Enrollment] Email error:", err);
          }
        }

        // Write audit log entry
        try {
          await db.createEnrollmentLogEntry({
            userId: input.userId,
            adminId: ctx.user.id,
            bundleId: input.bundleId,
            courseId: null,
            tier: input.tier,
            action: "enroll_bundle",
            coursesEnrolled: enrollmentIds.length,
            emailSent,
            emailError: emailError || null,
          });
        } catch (logErr) {
          console.error("[AuditLog] Failed to write enrollment log:", logErr);
        }

        // Notify admin/owner
        try {
          const student = await db.getUserById(input.userId);
          await notifyOwner({
            title: "New Bundle Enrollment",
            content: `${student?.name || "User #" + input.userId} enrolled in ${bundle.title} (${enrollmentIds.length} courses, ${input.tier}). Email sent: ${emailSent ? "Yes" : "No"}`,
          });
        } catch (_) { /* notification is best-effort */ }

        return { success: true, enrollmentIds, coursesEnrolled: enrollmentIds.length, emailSent };
      }),

    bundles: adminProcedure.query(async () => {
      return db.getAllBundlesAdmin();
    }),

    // Email service status
    emailStatus: adminProcedure.query(async () => {
      return { configured: isEmailServiceConfigured() };
    }),

    // Enrollment audit log
    enrollmentLogs: adminProcedure
      .input(z.object({
        limit: z.number().min(1).max(100).optional().default(50),
        offset: z.number().min(0).optional().default(0),
      }))
      .query(async ({ input }) => {
        const logs = await db.getEnrollmentLogsWithDetails({
          limit: input.limit,
          offset: input.offset,
        });
        const total = await db.getEnrollmentLogCount();
        return { logs, total };
      }),

    // Preview enrollment email HTML
    previewEmail: adminProcedure
      .input(z.object({
        studentName: z.string(),
        courseNames: z.array(z.string()),
        tier: z.string(),
        bundleName: z.string().optional(),
        origin: z.string(),
        language: z.enum(["en", "ar"]).optional(),
      }))
      .query(({ input }) => {
        return {
          html: previewEnrollmentEmail({
            studentName: input.studentName,
            courseNames: input.courseNames,
            tier: input.tier,
            bundleName: input.bundleName,
            siteOrigin: input.origin,
            language: input.language,
          }),
        };
      }),
  }),

  // ─── FLASHCARD ROUTES (Spaced Repetition) ──────────────────
  flashcard: router({
    // Initialize flashcards from glossary for a course
    initialize: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const count = await db.initializeFlashcardsFromGlossary(ctx.user.id, input.courseId);
        return { success: true, cardsCreated: count };
      }),

    // Get all flashcards for a course
    list: protectedProcedure
      .input(z.object({ courseId: z.number() }))
      .query(async ({ ctx, input }) => {
        return db.getUserFlashcards(ctx.user.id, input.courseId);
      }),

    // Get cards due for review
    due: protectedProcedure
      .input(z.object({ courseId: z.number(), limit: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        return db.getDueFlashcards(ctx.user.id, input.courseId, input.limit ?? 20);
      }),

    // Get stats across all courses
    stats: protectedProcedure.query(async ({ ctx }) => {
      return db.getFlashcardStats(ctx.user.id);
    }),

    // Review a flashcard (submit quality rating)
    review: protectedProcedure
      .input(z.object({
        cardId: z.number(),
        quality: z.number().min(0).max(5),
      }))
      .mutation(async ({ ctx, input }) => {
        const result = await db.reviewFlashcard(input.cardId, ctx.user.id, input.quality);
        return { success: true, ...result };
      }),
  }),
});
export type AppRouter = typeof appRouter;
