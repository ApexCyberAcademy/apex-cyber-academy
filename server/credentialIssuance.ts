/**
 * Credential Issuance Service
 * Handles automatic issuance of certificates and badges when students achieve milestones.
 */

import * as db from "./db";
import { generateCertificatePDF } from "./certificateGenerator";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";
import { sendCertificateEmail } from "./emailService";

interface QuizSubmissionContext {
  userId: number;
  courseId: number;
  quizId: number;
  score: number;
  passed: boolean;
  isFinalExam: boolean;
  totalQuestions: number;
  correctAnswers: number;
  attemptId: number;
  timeTakenMinutes?: number;
  siteOrigin?: string; // for email links
}

interface IssuanceResult {
  certificate: {
    issued: boolean;
    certificateNumber?: string;
    pdfUrl?: string;
    emailSent?: boolean;
    emailError?: string;
  };
  badges: Array<{
    type: string;
    title: string;
    iconEmoji: string;
  }>;
}

/**
 * Check and issue credentials after a quiz submission.
 * Called from the quiz.submit mutation after scoring.
 */
export async function checkAndIssueCredentials(ctx: QuizSubmissionContext): Promise<IssuanceResult> {
  const result: IssuanceResult = {
    certificate: { issued: false },
    badges: [],
  };

  const newBadges: Array<{ type: string; title: string; iconEmoji: string; description: string }> = [];

  // ─── PERFECT SCORE BADGE ──────────────────────────────────
  if (ctx.score === 100) {
    const already = await db.hasBadge(ctx.userId, "perfect_score", ctx.courseId);
    if (!already) {
      newBadges.push({
        type: "perfect_score",
        title: "Perfect Score",
        iconEmoji: "💯",
        description: "Achieved 100% on a quiz - flawless knowledge!",
      });
    }
  }

  // ─── FINAL EXAM SPECIFIC ──────────────────────────────────
  if (ctx.isFinalExam && ctx.passed && ctx.score >= 80) {
    // Certificate issuance
    const existingCert = await db.getCertificateForCourse(ctx.userId, ctx.courseId);
    if (!existingCert) {
      try {
        const course = await db.getCourseById(ctx.courseId);
        const user = await db.getUserByOpenId(""); // We need to get user by ID
        // Get user name from the enrollment context
        const enrollments = await db.getUserEnrollments(ctx.userId);
        // We need a getUserById - let's work around it
        const allStudents = await db.getAllStudents();
        const student = allStudents.find(s => s.id === ctx.userId);
        const studentName = student?.name || "Student";
        const courseTitle = course?.title || "Certification Course";
        const certCode = course?.certCode || null;

        // Generate certificate number
        const prefix = certCode
          ? `APEX-${certCode.replace("-", "").substring(0, 4).toUpperCase()}`
          : "APEX-CERT";
        const year = new Date().getFullYear();
        const certNumber = await db.getNextCertificateNumber(`${prefix}-${year}`);

        // Generate PDF
        const pdfBuffer = generateCertificatePDF({
          studentName,
          courseTitle,
          certCode,
          certificateNumber: certNumber,
          score: ctx.score,
          issuedAt: new Date(),
        });

        // Upload to S3
        const fileKey = `certificates/${certNumber}-${nanoid(6)}.pdf`;
        const { url: pdfUrl } = await storagePut(fileKey, pdfBuffer, "application/pdf");

        // Save to database
        const certId = await db.createCertificate({
          userId: ctx.userId,
          courseId: ctx.courseId,
          quizAttemptId: ctx.attemptId,
          certificateNumber: certNumber,
          studentName,
          courseTitle,
          certCode,
          score: ctx.score,
          pdfUrl,
        });

        result.certificate = {
          issued: true,
          certificateNumber: certNumber,
          pdfUrl,
        };

        // ─── SEND CERTIFICATE EMAIL ──────────────────────
        try {
          const studentRecord = await db.getUserById(ctx.userId);
          if (studentRecord?.email) {
            // Determine bundle context for the email
            const userEnrollments = await db.getUserEnrollments(ctx.userId);
            const courseEnrollment = userEnrollments.find(e => e.courseId === ctx.courseId);
            let bundleName: string | undefined;
            let remainingCourses: string[] | undefined;

            if (courseEnrollment?.bundleId) {
              try {
                const bundle = await db.getBundleById(courseEnrollment.bundleId);
                if (bundle) {
                  bundleName = bundle.title;
                  const bundleCourses = await db.getBundleCourses(courseEnrollment.bundleId);
                  // Find which bundle courses the student has NOT yet earned a certificate for
                  const remaining: string[] = [];
                  for (const bc of bundleCourses) {
                    if (bc.courseId === ctx.courseId) continue; // skip current course
                    const cert = await db.getCertificateForCourse(ctx.userId, bc.courseId);
                    if (!cert) {
                      const c = await db.getCourseById(bc.courseId);
                      if (c) remaining.push(c.title);
                    }
                  }
                  remainingCourses = remaining;
                }
              } catch (bundleErr) {
                console.error("[Certificate Email] Error fetching bundle info:", bundleErr);
              }
            }

            // Detect language from student name (Arabic chars = ar)
            const hasArabic = /[\u0600-\u06FF]/.test(studentName);
            const language = hasArabic ? "ar" as const : "en" as const;

            const emailResult = await sendCertificateEmail({
              studentEmail: studentRecord.email,
              studentName,
              courseTitle,
              certCode,
              certificateNumber: certNumber,
              score: ctx.score,
              issuedAt: new Date(),
              pdfBuffer: pdfBuffer as Buffer,
              siteOrigin: ctx.siteOrigin || "https://apex-cyber-academy.manus.space",
              language,
              bundleName,
              remainingCourses,
            });

            result.certificate.emailSent = emailResult.success;
            if (!emailResult.success) {
              result.certificate.emailError = emailResult.error;
              console.error("[Certificate Email] Failed to send:", emailResult.error);
            } else {
              console.log("[Certificate Email] Sent to", studentRecord.email, "for", courseTitle);
            }
          } else {
            console.warn("[Certificate Email] Student has no email address, skipping");
            result.certificate.emailSent = false;
            result.certificate.emailError = "Student has no email address on file";
          }
        } catch (emailErr) {
          console.error("[Certificate Email] Exception:", emailErr);
          result.certificate.emailSent = false;
          result.certificate.emailError = emailErr instanceof Error ? emailErr.message : String(emailErr);
        }
      } catch (error) {
        console.error("[Certificate] Failed to generate certificate:", error);
      }
    }

    // Course Complete badge
    const hasCourseComplete = await db.hasBadge(ctx.userId, "course_complete", ctx.courseId);
    if (!hasCourseComplete) {
      newBadges.push({
        type: "course_complete",
        title: "Course Complete",
        iconEmoji: "🎓",
        description: "Successfully passed the final certification exam!",
      });
    }

    // Honor Roll badge (90%+)
    if (ctx.score >= 90) {
      const hasHonorRoll = await db.hasBadge(ctx.userId, "honor_roll", ctx.courseId);
      if (!hasHonorRoll) {
        newBadges.push({
          type: "honor_roll",
          title: "Honor Roll",
          iconEmoji: "🏆",
          description: "Scored 90% or higher on the final exam - exceptional performance!",
        });
      }
    }

    // Speed Demon badge (under 30 min)
    if (ctx.timeTakenMinutes !== undefined && ctx.timeTakenMinutes < 30) {
      const hasSpeedDemon = await db.hasBadge(ctx.userId, "speed_demon", ctx.courseId);
      if (!hasSpeedDemon) {
        newBadges.push({
          type: "speed_demon",
          title: "Speed Demon",
          iconEmoji: "⚡",
          description: "Completed the final exam in under 30 minutes!",
        });
      }
    }
  }

  // ─── CHECK ALL LECTURES COMPLETED ─────────────────────────
  const progressStats = await db.getCourseProgressStats(ctx.userId, ctx.courseId);
  if (progressStats.totalLectures > 0 && progressStats.completedLectures >= progressStats.totalLectures) {
    const hasAllLectures = await db.hasBadge(ctx.userId, "all_lectures", ctx.courseId);
    if (!hasAllLectures) {
      newBadges.push({
        type: "all_lectures",
        title: "Dedicated Learner",
        iconEmoji: "📚",
        description: "Completed every lecture in the course - true dedication!",
      });
    }
  }

  // ─── CHECK ALL MODULE QUIZZES PASSED ──────────────────────
  const courseQuizzes = await db.getQuizzesByCourseId(ctx.courseId);
  const moduleQuizzes = courseQuizzes.filter(q => !q.isFinalExam);
  if (moduleQuizzes.length > 0) {
    let allPassed = true;
    for (const mq of moduleQuizzes) {
      const best = await db.getBestQuizAttempt(ctx.userId, mq.id);
      if (!best || !best.passed) {
        allPassed = false;
        break;
      }
    }
    if (allPassed) {
      const hasQuizMaster = await db.hasBadge(ctx.userId, "quiz_master", ctx.courseId);
      if (!hasQuizMaster) {
        newBadges.push({
          type: "quiz_master",
          title: "Quiz Master",
          iconEmoji: "🧠",
          description: "Passed every module quiz in the course!",
        });
      }
    }
  }

  // ─── SAVE ALL NEW BADGES ──────────────────────────────────
  for (const badge of newBadges) {
    try {
      await db.createBadge({
        userId: ctx.userId,
        courseId: ctx.courseId,
        badgeType: badge.type as any,
        title: badge.title,
        description: badge.description,
        iconEmoji: badge.iconEmoji,
      });
      result.badges.push({
        type: badge.type,
        title: badge.title,
        iconEmoji: badge.iconEmoji,
      });
    } catch (error) {
      console.error(`[Badge] Failed to create badge ${badge.type}:`, error);
    }
  }

  return result;
}
