/**
 * Email Service — sends enrollment confirmation and certificate completion emails via Resend.
 * Falls back gracefully when RESEND_API_KEY is not configured.
 */
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY ?? "";
const FROM_EMAIL = process.env.EMAIL_FROM ?? "Apex Cyber Academy <onboarding@resend.dev>";

let resend: Resend | null = null;

function getResend(): Resend | null {
  if (!RESEND_API_KEY) {
    console.warn("[Email] RESEND_API_KEY not configured, emails will be skipped");
    return null;
  }
  if (!resend) {
    resend = new Resend(RESEND_API_KEY);
  }
  return resend;
}

// ─── HTML EMAIL TEMPLATE ────────────────────────────────────────

function buildEnrollmentEmailHtml(params: {
  studentName: string;
  courseNames: string[];
  tier: string;
  bundleName?: string;
  loginUrl: string;
  dashboardUrl: string;
}): string {
  const { studentName, courseNames, tier, bundleName, loginUrl, dashboardUrl } = params;

  const courseListHtml = courseNames
    .map(
      (name) =>
        '<tr><td style="padding:8px 16px;font-family:\'Segoe UI\',Arial,sans-serif;font-size:15px;color:#0C3C3C;border-bottom:1px solid #E8E0D0;">&#10003; ' + name + '</td></tr>'
    )
    .join("");

  const tierLabel = tier === "live" ? "Live Instructor-Led" : "Self-Paced";
  const enrollmentType = bundleName
    ? '<p style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:14px;color:#666;margin:0 0 4px;">Bundle: <strong style="color:#0C3C3C;">' + bundleName + '</strong></p>'
    : "";

  const courseWord = courseNames.length > 1 ? "courses" : "course";

  return [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>',
    '<body style="margin:0;padding:0;background-color:#F5F0E8;font-family:\'Segoe UI\',Arial,sans-serif;">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F0E8;padding:32px 16px;">',
    '<tr><td align="center">',
    '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">',

    // Header
    '<tr><td style="background-color:#0C3C3C;padding:32px 40px;text-align:center;">',
    '<h1 style="margin:0;font-family:Georgia,\'Times New Roman\',serif;font-size:28px;color:#D4AF37;font-weight:700;letter-spacing:1px;">APEX CERT ACADEMY</h1>',
    '<p style="margin:8px 0 0;font-family:\'Segoe UI\',Arial,sans-serif;font-size:13px;color:#A8C5C5;letter-spacing:2px;">ENROLLMENT CONFIRMATION</p>',
    '</td></tr>',

    // Body
    '<tr><td style="background-color:#FFFFFF;padding:40px;">',
    '<h2 style="margin:0 0 8px;font-family:Georgia,\'Times New Roman\',serif;font-size:22px;color:#0C3C3C;">Welcome, ' + studentName + '!</h2>',
    '<p style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:15px;color:#444;line-height:1.7;margin:0 0 24px;">',
    'Your enrollment has been confirmed. You now have full access to the following ' + courseWord + ':',
    '</p>',

    // Course List
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9F6F0;border:1px solid #E8E0D0;margin:0 0 24px;">',
    '<tr><td style="padding:12px 16px;background-color:#0C3C3C;">',
    '<strong style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:12px;color:#D4AF37;letter-spacing:1.5px;text-transform:uppercase;">Your Courses</strong>',
    '</td></tr>',
    courseListHtml,
    '</table>',

    // Enrollment Details
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">',
    '<tr><td style="padding:16px;background-color:#F9F6F0;border-left:4px solid #D4AF37;">',
    enrollmentType,
    '<p style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:14px;color:#666;margin:0 0 4px;">Access Tier: <strong style="color:#0C3C3C;">' + tierLabel + '</strong></p>',
    '<p style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:14px;color:#666;margin:0;">Status: <strong style="color:#227C82;">Active</strong></p>',
    '</td></tr>',
    '</table>',

    // Getting Started
    '<h3 style="margin:0 0 12px;font-family:Georgia,\'Times New Roman\',serif;font-size:18px;color:#0C3C3C;">Getting Started</h3>',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">',
    '<tr><td style="padding:8px 0;font-family:\'Segoe UI\',Arial,sans-serif;font-size:14px;color:#444;line-height:1.6;">',
    '<strong style="color:#D4AF37;">1.</strong> Log in to your account using the button below',
    '</td></tr>',
    '<tr><td style="padding:8px 0;font-family:\'Segoe UI\',Arial,sans-serif;font-size:14px;color:#444;line-height:1.6;">',
    '<strong style="color:#D4AF37;">2.</strong> Navigate to your Dashboard to see your enrolled courses',
    '</td></tr>',
    '<tr><td style="padding:8px 0;font-family:\'Segoe UI\',Arial,sans-serif;font-size:14px;color:#444;line-height:1.6;">',
    '<strong style="color:#D4AF37;">3.</strong> Click "Start Learning" to begin your first lecture',
    '</td></tr>',
    '<tr><td style="padding:8px 0;font-family:\'Segoe UI\',Arial,sans-serif;font-size:14px;color:#444;line-height:1.6;">',
    '<strong style="color:#D4AF37;">4.</strong> Each course includes video lectures, study guides, quizzes, practice exams, and flashcards',
    '</td></tr>',
    '</table>',

    // CTA Button
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">',
    '<tr><td align="center">',
    '<a href="' + dashboardUrl + '" style="display:inline-block;padding:14px 40px;background-color:#D4AF37;color:#0C3C3C;font-family:\'Segoe UI\',Arial,sans-serif;font-size:15px;font-weight:700;text-decoration:none;letter-spacing:0.5px;">GO TO MY DASHBOARD</a>',
    '</td></tr>',
    '</table>',

    // Support Note
    '<p style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:13px;color:#888;line-height:1.6;margin:0;border-top:1px solid #E8E0D0;padding-top:16px;">',
    'If you have any questions or need assistance, please contact us through the Contact page on our website. Our support team is here to help you succeed.',
    '</p>',

    '</td></tr>',

    // Footer
    '<tr><td style="background-color:#0C3C3C;padding:24px 40px;text-align:center;">',
    '<p style="margin:0 0 4px;font-family:Georgia,\'Times New Roman\',serif;font-size:16px;color:#D4AF37;font-weight:700;">Apex Cyber Academy</p>',
    '<p style="margin:0;font-family:\'Segoe UI\',Arial,sans-serif;font-size:12px;color:#A8C5C5;">Your Path to Cybersecurity Excellence</p>',
    '</td></tr>',

    '</table>',
    '</td></tr>',
    '</table>',
    '</body>',
    '</html>',
  ].join("\n");
}

// ─── ARABIC EMAIL TEMPLATE ──────────────────────────────────────

function buildEnrollmentEmailHtmlArabic(params: {
  studentName: string;
  courseNames: string[];
  tier: string;
  bundleName?: string;
  loginUrl: string;
  dashboardUrl: string;
}): string {
  const { studentName, courseNames, tier, bundleName, dashboardUrl } = params;

  const courseListHtml = courseNames
    .map(
      (name) =>
        '<tr><td style="padding:8px 16px;font-family:\'Segoe UI\',Arial,sans-serif;font-size:15px;color:#0C3C3C;border-bottom:1px solid #E8E0D0;direction:rtl;text-align:right;">&#10003; ' + name + '</td></tr>'
    )
    .join("");

  const tierLabel = tier === "live" ? "مباشر مع مدرب" : "ذاتي";
  const enrollmentType = bundleName
    ? '<p style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:14px;color:#666;margin:0 0 4px;direction:rtl;text-align:right;">الحزمة: <strong style="color:#0C3C3C;">' + bundleName + '</strong></p>'
    : "";

  const courseWord = courseNames.length > 1 ? "الدورات التالية" : "الدورة التالية";

  return [
    '<!DOCTYPE html>',
    '<html lang="ar" dir="rtl">',
    '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>',
    '<body style="margin:0;padding:0;background-color:#F5F0E8;font-family:\'Segoe UI\',Arial,sans-serif;direction:rtl;">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F0E8;padding:32px 16px;">',
    '<tr><td align="center">',
    '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">',

    '<tr><td style="background-color:#0C3C3C;padding:32px 40px;text-align:center;">',
    '<h1 style="margin:0;font-family:Georgia,\'Times New Roman\',serif;font-size:28px;color:#D4AF37;font-weight:700;letter-spacing:1px;">APEX CERT ACADEMY</h1>',
    '<p style="margin:8px 0 0;font-family:\'Segoe UI\',Arial,sans-serif;font-size:13px;color:#A8C5C5;letter-spacing:2px;">تأكيد التسجيل</p>',
    '</td></tr>',

    '<tr><td style="background-color:#FFFFFF;padding:40px;direction:rtl;text-align:right;">',
    '<h2 style="margin:0 0 8px;font-family:Georgia,\'Times New Roman\',serif;font-size:22px;color:#0C3C3C;">مرحباً، ' + studentName + '!</h2>',
    '<p style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:15px;color:#444;line-height:1.7;margin:0 0 24px;">',
    'تم تأكيد تسجيلك بنجاح. لديك الآن صلاحية الوصول الكامل إلى ' + courseWord + ':',
    '</p>',

    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9F6F0;border:1px solid #E8E0D0;margin:0 0 24px;">',
    '<tr><td style="padding:12px 16px;background-color:#0C3C3C;text-align:right;">',
    '<strong style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:12px;color:#D4AF37;letter-spacing:1.5px;">دوراتك</strong>',
    '</td></tr>',
    courseListHtml,
    '</table>',

    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">',
    '<tr><td style="padding:16px;background-color:#F9F6F0;border-right:4px solid #D4AF37;text-align:right;">',
    enrollmentType,
    '<p style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:14px;color:#666;margin:0 0 4px;">مستوى الوصول: <strong style="color:#0C3C3C;">' + tierLabel + '</strong></p>',
    '<p style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:14px;color:#666;margin:0;">الحالة: <strong style="color:#227C82;">نشط</strong></p>',
    '</td></tr>',
    '</table>',

    '<h3 style="margin:0 0 12px;font-family:Georgia,\'Times New Roman\',serif;font-size:18px;color:#0C3C3C;">كيف تبدأ</h3>',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">',
    '<tr><td style="padding:8px 0;font-family:\'Segoe UI\',Arial,sans-serif;font-size:14px;color:#444;line-height:1.6;text-align:right;">',
    '<strong style="color:#D4AF37;">١.</strong> سجّل الدخول إلى حسابك باستخدام الزر أدناه',
    '</td></tr>',
    '<tr><td style="padding:8px 0;font-family:\'Segoe UI\',Arial,sans-serif;font-size:14px;color:#444;line-height:1.6;text-align:right;">',
    '<strong style="color:#D4AF37;">٢.</strong> انتقل إلى لوحة التحكم لرؤية دوراتك المسجلة',
    '</td></tr>',
    '<tr><td style="padding:8px 0;font-family:\'Segoe UI\',Arial,sans-serif;font-size:14px;color:#444;line-height:1.6;text-align:right;">',
    '<strong style="color:#D4AF37;">٣.</strong> اضغط على "ابدأ التعلم" لبدء أول محاضرة',
    '</td></tr>',
    '<tr><td style="padding:8px 0;font-family:\'Segoe UI\',Arial,sans-serif;font-size:14px;color:#444;line-height:1.6;text-align:right;">',
    '<strong style="color:#D4AF37;">٤.</strong> تتضمن كل دورة محاضرات فيديو وأدلة دراسية واختبارات وبطاقات تعليمية',
    '</td></tr>',
    '</table>',

    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">',
    '<tr><td align="center">',
    '<a href="' + dashboardUrl + '" style="display:inline-block;padding:14px 40px;background-color:#D4AF37;color:#0C3C3C;font-family:\'Segoe UI\',Arial,sans-serif;font-size:15px;font-weight:700;text-decoration:none;letter-spacing:0.5px;">الذهاب إلى لوحة التحكم</a>',
    '</td></tr>',
    '</table>',

    '<p style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:13px;color:#888;line-height:1.6;margin:0;border-top:1px solid #E8E0D0;padding-top:16px;text-align:right;">',
    'إذا كان لديك أي أسئلة أو تحتاج إلى مساعدة، يرجى التواصل معنا عبر صفحة الاتصال على موقعنا. فريق الدعم لدينا هنا لمساعدتك على النجاح.',
    '</p>',

    '</td></tr>',

    '<tr><td style="background-color:#0C3C3C;padding:24px 40px;text-align:center;">',
    '<p style="margin:0 0 4px;font-family:Georgia,\'Times New Roman\',serif;font-size:16px;color:#D4AF37;font-weight:700;">Apex Cyber Academy</p>',
    '<p style="margin:0;font-family:\'Segoe UI\',Arial,sans-serif;font-size:12px;color:#A8C5C5;">طريقك نحو التميز في الأمن السيبراني</p>',
    '</td></tr>',

    '</table>',
    '</td></tr>',
    '</table>',
    '</body>',
    '</html>',
  ].join("\n");
}

// ─── SEND ENROLLMENT EMAIL ──────────────────────────────────────

export type EnrollmentEmailParams = {
  studentEmail: string;
  studentName: string;
  courseNames: string[];
  tier: string;
  bundleName?: string;
  siteOrigin: string;
  language?: "en" | "ar";
};

export async function sendEnrollmentEmail(
  params: EnrollmentEmailParams
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const client = getResend();
  if (!client) {
    return { success: false, error: "Email service not configured (RESEND_API_KEY missing)" };
  }

  const { studentEmail, studentName, courseNames, tier, bundleName, siteOrigin, language = "en" } = params;

  const loginUrl = siteOrigin;
  const dashboardUrl = siteOrigin + "/dashboard";

  const templateParams = { studentName, courseNames, tier, bundleName, loginUrl, dashboardUrl };

  const html = language === "ar"
    ? buildEnrollmentEmailHtmlArabic(templateParams)
    : buildEnrollmentEmailHtml(templateParams);

  const courseLabel = courseNames.length > 1
    ? courseNames.length + " courses"
    : courseNames[0];

  const subject = language === "ar"
    ? "تأكيد التسجيل — " + courseLabel + " | Apex Cyber Academy"
    : "Enrollment Confirmed — " + courseLabel + " | Apex Cyber Academy";

  try {
    const result = await client.emails.send({
      from: FROM_EMAIL,
      to: [studentEmail],
      subject,
      html,
    });

    if (result.error) {
      console.error("[Email] Send failed:", result.error);
      return { success: false, error: result.error.message };
    }

    console.log("[Email] Enrollment email sent to", studentEmail, "id:", result.data?.id);
    return { success: true, messageId: result.data?.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Email] Exception sending email:", message);
    return { success: false, error: message };
  }
}

// ─── PREVIEW (returns HTML without sending) ─────────────────────

export function previewEnrollmentEmail(params: {
  studentName: string;
  courseNames: string[];
  tier: string;
  bundleName?: string;
  siteOrigin: string;
  language?: "en" | "ar";
}): string {
  const { studentName, courseNames, tier, bundleName, siteOrigin, language = "en" } = params;
  const loginUrl = siteOrigin;
  const dashboardUrl = siteOrigin + "/dashboard";
  const templateParams = { studentName, courseNames, tier, bundleName, loginUrl, dashboardUrl };

  return language === "ar"
    ? buildEnrollmentEmailHtmlArabic(templateParams)
    : buildEnrollmentEmailHtml(templateParams);
}

// ─── CHECK IF EMAIL SERVICE IS CONFIGURED ───────────────────────

export function isEmailServiceConfigured(): boolean {
  return !!RESEND_API_KEY;
}


// ─── CERTIFICATE COMPLETION EMAIL TEMPLATE (ENGLISH) ──────────────

function buildCertificateEmailHtml(params: {
  studentName: string;
  courseTitle: string;
  certCode: string | null;
  certificateNumber: string;
  score: number;
  issuedAt: Date;
  dashboardUrl: string;
  verifyUrl: string;
  bundleName?: string;
  remainingCourses?: string[];
}): string {
  const { studentName, courseTitle, certCode, certificateNumber, score, issuedAt, dashboardUrl, verifyUrl, bundleName, remainingCourses } = params;

  const dateStr = issuedAt.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const distinction = score >= 90;

  const certCodeLine = certCode
    ? '<p style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:14px;color:#A8C5C5;margin:4px 0 0;">Exam Code: ' + certCode + '</p>'
    : "";

  const distinctionBadge = distinction
    ? '<tr><td style="padding:12px 0;text-align:center;"><span style="display:inline-block;padding:6px 20px;background-color:#D4AF37;color:#0C3C3C;font-family:\'Segoe UI\',Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:1px;">WITH DISTINCTION</span></td></tr>'
    : "";

  // Bundle progress section — shows remaining courses if enrolled via bundle
  let bundleProgressHtml = "";
  if (bundleName && remainingCourses && remainingCourses.length > 0) {
    const remainingListHtml = remainingCourses
      .map(name => '<tr><td style="padding:6px 16px;font-family:\'Segoe UI\',Arial,sans-serif;font-size:14px;color:#444;border-bottom:1px solid #E8E0D0;">&#9744; ' + name + '</td></tr>')
      .join("");

    bundleProgressHtml = [
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">',
      '<tr><td style="padding:16px;background-color:#F0F9F6;border-left:4px solid #0A6B5A;">',
      '<p style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:15px;font-weight:700;color:#0C3C3C;margin:0 0 8px;">Bundle Progress: ' + bundleName + '</p>',
      '<p style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:13px;color:#666;margin:0 0 12px;">You still have ' + remainingCourses.length + ' more course' + (remainingCourses.length > 1 ? 's' : '') + ' in your bundle. Keep going!</p>',
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border:1px solid #E8E0D0;">',
      '<tr><td style="padding:10px 16px;background-color:#0A6B5A;"><strong style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:12px;color:#FFFFFF;letter-spacing:1px;">REMAINING COURSES</strong></td></tr>',
      remainingListHtml,
      '</table>',
      '</td></tr>',
      '</table>',
    ].join("\n");
  } else if (bundleName && (!remainingCourses || remainingCourses.length === 0)) {
    bundleProgressHtml = [
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">',
      '<tr><td style="padding:16px;background-color:#F0F9F6;border-left:4px solid #D4AF37;">',
      '<p style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:15px;font-weight:700;color:#D4AF37;margin:0 0 4px;">&#127942; Bundle Complete!</p>',
      '<p style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:13px;color:#444;margin:0;">Congratulations! You have completed all courses in the <strong>' + bundleName + '</strong> bundle.</p>',
      '</td></tr>',
      '</table>',
    ].join("\n");
  }

  return [
    '<!DOCTYPE html>',
    '<html lang="en">',
    '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>',
    '<body style="margin:0;padding:0;background-color:#F5F0E8;font-family:\'Segoe UI\',Arial,sans-serif;">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F0E8;padding:32px 16px;">',
    '<tr><td align="center">',
    '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">',

    // Header
    '<tr><td style="background-color:#0C3C3C;padding:32px 40px;text-align:center;">',
    '<h1 style="margin:0;font-family:Georgia,\'Times New Roman\',serif;font-size:28px;color:#D4AF37;font-weight:700;letter-spacing:1px;">APEX CERT ACADEMY</h1>',
    '<p style="margin:8px 0 0;font-family:\'Segoe UI\',Arial,sans-serif;font-size:13px;color:#A8C5C5;letter-spacing:2px;">COURSE COMPLETION CERTIFICATE</p>',
    '</td></tr>',

    // Congratulations Banner
    '<tr><td style="background-color:#0A6B5A;padding:24px 40px;text-align:center;">',
    '<p style="margin:0;font-family:Georgia,\'Times New Roman\',serif;font-size:24px;color:#FFFFFF;font-weight:700;">Congratulations, ' + studentName + '!</p>',
    '<p style="margin:8px 0 0;font-family:\'Segoe UI\',Arial,sans-serif;font-size:14px;color:#D4E8E4;">You have successfully completed your certification course.</p>',
    '</td></tr>',

    // Body
    '<tr><td style="background-color:#FFFFFF;padding:40px;">',

    // Course Details
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9F6F0;border:1px solid #E8E0D0;margin:0 0 24px;">',
    '<tr><td style="padding:12px 16px;background-color:#0C3C3C;">',
    '<strong style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:12px;color:#D4AF37;letter-spacing:1.5px;text-transform:uppercase;">Certificate Details</strong>',
    '</td></tr>',
    '<tr><td style="padding:16px;">',
    '<p style="font-family:Georgia,\'Times New Roman\',serif;font-size:20px;color:#0C3C3C;font-weight:700;margin:0 0 4px;">' + courseTitle + '</p>',
    certCodeLine,
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0 0;">',
    '<tr>',
    '<td style="width:33%;padding:8px 0;"><span style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:11px;color:#888;display:block;">Final Score</span><strong style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:18px;color:#D4AF37;">' + score + '%</strong></td>',
    '<td style="width:33%;padding:8px 0;"><span style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:11px;color:#888;display:block;">Certificate No.</span><strong style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:13px;color:#0C3C3C;">' + certificateNumber + '</strong></td>',
    '<td style="width:33%;padding:8px 0;"><span style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:11px;color:#888;display:block;">Date Issued</span><strong style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:13px;color:#0C3C3C;">' + dateStr + '</strong></td>',
    '</tr>',
    '</table>',
    '</td></tr>',
    '</table>',

    // Distinction badge
    distinctionBadge,

    // Certificate attachment note
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">',
    '<tr><td style="padding:16px;background-color:#FFF8E7;border-left:4px solid #D4AF37;">',
    '<p style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:14px;color:#0C3C3C;margin:0;">',
    '<strong>&#128196; Your certificate PDF is attached to this email.</strong> You can also download it anytime from your Dashboard.',
    '</p>',
    '</td></tr>',
    '</table>',

    // Bundle progress
    bundleProgressHtml,

    // Next Steps
    '<h3 style="margin:0 0 12px;font-family:Georgia,\'Times New Roman\',serif;font-size:18px;color:#0C3C3C;">What\'s Next?</h3>',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">',
    '<tr><td style="padding:8px 0;font-family:\'Segoe UI\',Arial,sans-serif;font-size:14px;color:#444;line-height:1.6;">',
    '<strong style="color:#D4AF37;">1.</strong> Download your certificate from the attachment or your Dashboard',
    '</td></tr>',
    '<tr><td style="padding:8px 0;font-family:\'Segoe UI\',Arial,sans-serif;font-size:14px;color:#444;line-height:1.6;">',
    '<strong style="color:#D4AF37;">2.</strong> Share your achievement on LinkedIn and social media',
    '</td></tr>',
    '<tr><td style="padding:8px 0;font-family:\'Segoe UI\',Arial,sans-serif;font-size:14px;color:#444;line-height:1.6;">',
    '<strong style="color:#D4AF37;">3.</strong> Use your certificate number for verification: <strong>' + certificateNumber + '</strong>',
    '</td></tr>',
    '<tr><td style="padding:8px 0;font-family:\'Segoe UI\',Arial,sans-serif;font-size:14px;color:#444;line-height:1.6;">',
    '<strong style="color:#D4AF37;">4.</strong> Register for the official ' + (certCode || 'certification') + ' exam when you are ready',
    '</td></tr>',
    '</table>',

    // CTA Buttons
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">',
    '<tr>',
    '<td align="center" style="padding:0 8px 0 0;">',
    '<a href="' + dashboardUrl + '" style="display:inline-block;padding:14px 32px;background-color:#D4AF37;color:#0C3C3C;font-family:\'Segoe UI\',Arial,sans-serif;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.5px;">VIEW DASHBOARD</a>',
    '</td>',
    '<td align="center" style="padding:0 0 0 8px;">',
    '<a href="' + verifyUrl + '" style="display:inline-block;padding:14px 32px;background-color:#0C3C3C;color:#D4AF37;font-family:\'Segoe UI\',Arial,sans-serif;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.5px;">VERIFY CERTIFICATE</a>',
    '</td>',
    '</tr>',
    '</table>',

    // Support
    '<p style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:13px;color:#888;line-height:1.6;margin:0;border-top:1px solid #E8E0D0;padding-top:16px;">',
    'If you have any questions, please contact us through the Contact page on our website. We are proud of your achievement!',
    '</p>',

    '</td></tr>',

    // Footer
    '<tr><td style="background-color:#0C3C3C;padding:24px 40px;text-align:center;">',
    '<p style="margin:0 0 4px;font-family:Georgia,\'Times New Roman\',serif;font-size:16px;color:#D4AF37;font-weight:700;">Apex Cyber Academy</p>',
    '<p style="margin:0;font-family:\'Segoe UI\',Arial,sans-serif;font-size:12px;color:#A8C5C5;">Your Path to Cybersecurity Excellence</p>',
    '</td></tr>',

    '</table>',
    '</td></tr>',
    '</table>',
    '</body>',
    '</html>',
  ].join("\n");
}

// ─── CERTIFICATE COMPLETION EMAIL TEMPLATE (ARABIC) ───────────────

function buildCertificateEmailHtmlArabic(params: {
  studentName: string;
  courseTitle: string;
  certCode: string | null;
  certificateNumber: string;
  score: number;
  issuedAt: Date;
  dashboardUrl: string;
  verifyUrl: string;
  bundleName?: string;
  remainingCourses?: string[];
}): string {
  const { studentName, courseTitle, certCode, certificateNumber, score, issuedAt, dashboardUrl, verifyUrl, bundleName, remainingCourses } = params;

  const dateStr = issuedAt.toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" });
  const distinction = score >= 90;

  const certCodeLine = certCode
    ? '<p style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:14px;color:#A8C5C5;margin:4px 0 0;">رمز الامتحان: ' + certCode + '</p>'
    : "";

  const distinctionBadge = distinction
    ? '<tr><td style="padding:12px 0;text-align:center;"><span style="display:inline-block;padding:6px 20px;background-color:#D4AF37;color:#0C3C3C;font-family:\'Segoe UI\',Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:1px;">بامتياز</span></td></tr>'
    : "";

  let bundleProgressHtml = "";
  if (bundleName && remainingCourses && remainingCourses.length > 0) {
    const remainingListHtml = remainingCourses
      .map(name => '<tr><td style="padding:6px 16px;font-family:\'Segoe UI\',Arial,sans-serif;font-size:14px;color:#444;border-bottom:1px solid #E8E0D0;direction:rtl;text-align:right;">&#9744; ' + name + '</td></tr>')
      .join("");

    bundleProgressHtml = [
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">',
      '<tr><td style="padding:16px;background-color:#F0F9F6;border-right:4px solid #0A6B5A;direction:rtl;text-align:right;">',
      '<p style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:15px;font-weight:700;color:#0C3C3C;margin:0 0 8px;">تقدم الحزمة: ' + bundleName + '</p>',
      '<p style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:13px;color:#666;margin:0 0 12px;">لا يزال لديك ' + remainingCourses.length + ' دورة أخرى في حزمتك. واصل التقدم!</p>',
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#FFFFFF;border:1px solid #E8E0D0;">',
      '<tr><td style="padding:10px 16px;background-color:#0A6B5A;text-align:right;"><strong style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:12px;color:#FFFFFF;">الدورات المتبقية</strong></td></tr>',
      remainingListHtml,
      '</table>',
      '</td></tr>',
      '</table>',
    ].join("\n");
  } else if (bundleName && (!remainingCourses || remainingCourses.length === 0)) {
    bundleProgressHtml = [
      '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">',
      '<tr><td style="padding:16px;background-color:#F0F9F6;border-right:4px solid #D4AF37;direction:rtl;text-align:right;">',
      '<p style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:15px;font-weight:700;color:#D4AF37;margin:0 0 4px;">&#127942; اكتملت الحزمة!</p>',
      '<p style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:13px;color:#444;margin:0;">تهانينا! لقد أكملت جميع الدورات في حزمة <strong>' + bundleName + '</strong>.</p>',
      '</td></tr>',
      '</table>',
    ].join("\n");
  }

  return [
    '<!DOCTYPE html>',
    '<html lang="ar" dir="rtl">',
    '<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>',
    '<body style="margin:0;padding:0;background-color:#F5F0E8;font-family:\'Segoe UI\',Arial,sans-serif;direction:rtl;">',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F0E8;padding:32px 16px;">',
    '<tr><td align="center">',
    '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">',

    '<tr><td style="background-color:#0C3C3C;padding:32px 40px;text-align:center;">',
    '<h1 style="margin:0;font-family:Georgia,\'Times New Roman\',serif;font-size:28px;color:#D4AF37;font-weight:700;letter-spacing:1px;">APEX CERT ACADEMY</h1>',
    '<p style="margin:8px 0 0;font-family:\'Segoe UI\',Arial,sans-serif;font-size:13px;color:#A8C5C5;letter-spacing:2px;">شهادة إتمام الدورة</p>',
    '</td></tr>',

    '<tr><td style="background-color:#0A6B5A;padding:24px 40px;text-align:center;">',
    '<p style="margin:0;font-family:Georgia,\'Times New Roman\',serif;font-size:24px;color:#FFFFFF;font-weight:700;">تهانينا، ' + studentName + '!</p>',
    '<p style="margin:8px 0 0;font-family:\'Segoe UI\',Arial,sans-serif;font-size:14px;color:#D4E8E4;">لقد أتممت بنجاح دورة التحضير للشهادة.</p>',
    '</td></tr>',

    '<tr><td style="background-color:#FFFFFF;padding:40px;direction:rtl;text-align:right;">',

    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F9F6F0;border:1px solid #E8E0D0;margin:0 0 24px;">',
    '<tr><td style="padding:12px 16px;background-color:#0C3C3C;text-align:right;">',
    '<strong style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:12px;color:#D4AF37;">تفاصيل الشهادة</strong>',
    '</td></tr>',
    '<tr><td style="padding:16px;text-align:right;">',
    '<p style="font-family:Georgia,\'Times New Roman\',serif;font-size:20px;color:#0C3C3C;font-weight:700;margin:0 0 4px;">' + courseTitle + '</p>',
    certCodeLine,
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0 0;">',
    '<tr>',
    '<td style="width:33%;padding:8px 0;text-align:center;"><span style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:11px;color:#888;display:block;">الدرجة النهائية</span><strong style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:18px;color:#D4AF37;">' + score + '%</strong></td>',
    '<td style="width:33%;padding:8px 0;text-align:center;"><span style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:11px;color:#888;display:block;">رقم الشهادة</span><strong style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:13px;color:#0C3C3C;">' + certificateNumber + '</strong></td>',
    '<td style="width:33%;padding:8px 0;text-align:center;"><span style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:11px;color:#888;display:block;">تاريخ الإصدار</span><strong style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:13px;color:#0C3C3C;">' + dateStr + '</strong></td>',
    '</tr>',
    '</table>',
    '</td></tr>',
    '</table>',

    distinctionBadge,

    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">',
    '<tr><td style="padding:16px;background-color:#FFF8E7;border-right:4px solid #D4AF37;text-align:right;">',
    '<p style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:14px;color:#0C3C3C;margin:0;">',
    '<strong>&#128196; شهادتك مرفقة بهذا البريد الإلكتروني.</strong> يمكنك أيضاً تحميلها في أي وقت من لوحة التحكم.',
    '</p>',
    '</td></tr>',
    '</table>',

    bundleProgressHtml,

    '<h3 style="margin:0 0 12px;font-family:Georgia,\'Times New Roman\',serif;font-size:18px;color:#0C3C3C;">الخطوات التالية</h3>',
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">',
    '<tr><td style="padding:8px 0;font-family:\'Segoe UI\',Arial,sans-serif;font-size:14px;color:#444;line-height:1.6;text-align:right;">',
    '<strong style="color:#D4AF37;">١.</strong> حمّل شهادتك من المرفق أو من لوحة التحكم',
    '</td></tr>',
    '<tr><td style="padding:8px 0;font-family:\'Segoe UI\',Arial,sans-serif;font-size:14px;color:#444;line-height:1.6;text-align:right;">',
    '<strong style="color:#D4AF37;">٢.</strong> شارك إنجازك على لينكد إن ووسائل التواصل الاجتماعي',
    '</td></tr>',
    '<tr><td style="padding:8px 0;font-family:\'Segoe UI\',Arial,sans-serif;font-size:14px;color:#444;line-height:1.6;text-align:right;">',
    '<strong style="color:#D4AF37;">٣.</strong> استخدم رقم شهادتك للتحقق: <strong>' + certificateNumber + '</strong>',
    '</td></tr>',
    '<tr><td style="padding:8px 0;font-family:\'Segoe UI\',Arial,sans-serif;font-size:14px;color:#444;line-height:1.6;text-align:right;">',
    '<strong style="color:#D4AF37;">٤.</strong> سجّل لامتحان ' + (certCode || 'الشهادة') + ' الرسمي عندما تكون جاهزاً',
    '</td></tr>',
    '</table>',

    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">',
    '<tr>',
    '<td align="center" style="padding:0 8px 0 0;">',
    '<a href="' + dashboardUrl + '" style="display:inline-block;padding:14px 32px;background-color:#D4AF37;color:#0C3C3C;font-family:\'Segoe UI\',Arial,sans-serif;font-size:14px;font-weight:700;text-decoration:none;">لوحة التحكم</a>',
    '</td>',
    '<td align="center" style="padding:0 0 0 8px;">',
    '<a href="' + verifyUrl + '" style="display:inline-block;padding:14px 32px;background-color:#0C3C3C;color:#D4AF37;font-family:\'Segoe UI\',Arial,sans-serif;font-size:14px;font-weight:700;text-decoration:none;">التحقق من الشهادة</a>',
    '</td>',
    '</tr>',
    '</table>',

    '<p style="font-family:\'Segoe UI\',Arial,sans-serif;font-size:13px;color:#888;line-height:1.6;margin:0;border-top:1px solid #E8E0D0;padding-top:16px;text-align:right;">',
    'إذا كان لديك أي أسئلة، يرجى التواصل معنا عبر صفحة الاتصال. نحن فخورون بإنجازك!',
    '</p>',

    '</td></tr>',

    '<tr><td style="background-color:#0C3C3C;padding:24px 40px;text-align:center;">',
    '<p style="margin:0 0 4px;font-family:Georgia,\'Times New Roman\',serif;font-size:16px;color:#D4AF37;font-weight:700;">Apex Cyber Academy</p>',
    '<p style="margin:0;font-family:\'Segoe UI\',Arial,sans-serif;font-size:12px;color:#A8C5C5;">طريقك نحو التميز في الأمن السيبراني</p>',
    '</td></tr>',

    '</table>',
    '</td></tr>',
    '</table>',
    '</body>',
    '</html>',
  ].join("\n");
}

// ─── SEND CERTIFICATE COMPLETION EMAIL ────────────────────────────

export type CertificateEmailParams = {
  studentEmail: string;
  studentName: string;
  courseTitle: string;
  certCode: string | null;
  certificateNumber: string;
  score: number;
  issuedAt: Date;
  pdfBuffer: Buffer;
  siteOrigin: string;
  language?: "en" | "ar";
  bundleName?: string;
  remainingCourses?: string[];
};

export async function sendCertificateEmail(
  params: CertificateEmailParams
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const client = getResend();
  if (!client) {
    return { success: false, error: "Email service not configured (RESEND_API_KEY missing)" };
  }

  const {
    studentEmail, studentName, courseTitle, certCode, certificateNumber,
    score, issuedAt, pdfBuffer, siteOrigin, language = "en",
    bundleName, remainingCourses,
  } = params;

  const dashboardUrl = siteOrigin + "/dashboard";
  const verifyUrl = siteOrigin + "/verify/" + certificateNumber;

  const templateParams = {
    studentName, courseTitle, certCode, certificateNumber, score, issuedAt,
    dashboardUrl, verifyUrl, bundleName, remainingCourses,
  };

  const html = language === "ar"
    ? buildCertificateEmailHtmlArabic(templateParams)
    : buildCertificateEmailHtml(templateParams);

  const distinction = score >= 90 ? " (With Distinction)" : "";
  const subject = language === "ar"
    ? "شهادة إتمام — " + courseTitle + distinction + " | Apex Cyber Academy"
    : "Certificate of Completion — " + courseTitle + distinction + " | Apex Cyber Academy";

  const pdfFilename = certificateNumber.replace(/\//g, "-") + ".pdf";

  try {
    const result = await client.emails.send({
      from: FROM_EMAIL,
      to: [studentEmail],
      subject,
      html,
      attachments: [
        {
          filename: pdfFilename,
          content: pdfBuffer.toString("base64"),
          contentType: "application/pdf",
        },
      ],
    });

    if (result.error) {
      console.error("[Email] Certificate send failed:", result.error);
      return { success: false, error: result.error.message };
    }

    console.log("[Email] Certificate email sent to", studentEmail, "id:", result.data?.id);
    return { success: true, messageId: result.data?.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Email] Exception sending certificate email:", message);
    return { success: false, error: message };
  }
}

// ─── PREVIEW CERTIFICATE EMAIL (returns HTML without sending) ─────

export function previewCertificateEmail(params: {
  studentName: string;
  courseTitle: string;
  certCode: string | null;
  certificateNumber: string;
  score: number;
  issuedAt: Date;
  siteOrigin: string;
  language?: "en" | "ar";
  bundleName?: string;
  remainingCourses?: string[];
}): string {
  const { studentName, courseTitle, certCode, certificateNumber, score, issuedAt, siteOrigin, language = "en", bundleName, remainingCourses } = params;
  const dashboardUrl = siteOrigin + "/dashboard";
  const verifyUrl = siteOrigin + "/verify/" + certificateNumber;
  const templateParams = {
    studentName, courseTitle, certCode, certificateNumber, score, issuedAt,
    dashboardUrl, verifyUrl, bundleName, remainingCourses,
  };

  return language === "ar"
    ? buildCertificateEmailHtmlArabic(templateParams)
    : buildCertificateEmailHtml(templateParams);
}
