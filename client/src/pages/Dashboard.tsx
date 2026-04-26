/*
  Student Dashboard - shows enrolled courses, progress, and quick links.
  Uses the Luminous Pathway design system.
*/

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";
import {
  BookOpen, Award, Clock, ArrowRight, BarChart3,
  CheckCircle, Play, FileText, Loader2, Shield, Brain,
  Download, Presentation, FlaskConical
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { lang } = useLanguage();

  const { data: enrollments, isLoading: enrollLoading } = trpc.enrollment.myEnrollments.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const { data: allSlideDownloads } = trpc.slideDownload.all.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const { data: allLabCompletions } = trpc.labCompletion.all.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#001A16] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#001A16]">
        <Navbar />
        <div className="pt-32 pb-20 container">
          <div className="max-w-lg mx-auto text-center">
            <Shield className="w-16 h-16 text-[#D4AF37] mx-auto mb-6" />
            <h1 className="text-[#E8E0D4] font-['Playfair_Display'] text-3xl font-bold mb-4">
              {lang === "en" ? "Sign In to Access Your Dashboard" : "سجّل الدخول للوصول إلى لوحتك"}
            </h1>
            <p className="text-[#C4B9A8] font-['Work_Sans'] text-base mb-8">
              {lang === "en"
                ? "Track your progress, access course materials, and take quizzes."
                : "تابع تقدمك، واصل إلى المواد الدراسية، وخض الاختبارات."
              }
            </p>
            <button
              onClick={() => { window.location.href = getLoginUrl(); }}
              className="px-8 py-4 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-base tracking-wide hover:bg-[#B8962E] transition-all duration-300 gold-glow-strong"
            >
              {lang === "en" ? "Sign In" : "تسجيل الدخول"}
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#001A16]">
      <Navbar />

      <div className="pt-28 pb-20 container">
        {/* Welcome Header */}
        <div className="mb-10">
          <h1 className="text-[#E8E0D4] font-['Playfair_Display'] text-3xl sm:text-4xl font-bold mb-2">
            {lang === "en" ? `Welcome back, ${user?.name || "Student"}` : `مرحبًا بعودتك، ${user?.name || "طالب"}`}
          </h1>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-base">
            {lang === "en" ? "Track your certification journey" : "تابع رحلتك نحو الشهادة"}
          </p>
        </div>

        {/* Enrolled Courses */}
        {enrollLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
          </div>
        ) : !enrollments || enrollments.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-[#0A6B5A] mx-auto mb-6" />
            <h2 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-4">
              {lang === "en" ? "No Courses Yet" : "لا توجد دورات بعد"}
            </h2>
            <p className="text-[#C4B9A8] font-['Work_Sans'] text-base mb-8 max-w-md mx-auto">
              {lang === "en"
                ? "You haven't enrolled in any courses yet. Browse our certification programs to get started."
                : "لم تسجل في أي دورة بعد. تصفح برامج الشهادات للبدء."
              }
            </p>
            <Link
              href="/course"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-base tracking-wide hover:bg-[#B8962E] transition-all duration-300 gold-glow-strong"
            >
              {lang === "en" ? "Browse Courses" : "تصفح الدورات"}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {enrollments.map((enrollment) => {
              const course = enrollment.course;
              if (!course) return null;
              const progressPct = enrollment.progress.totalLectures > 0
                ? Math.round((enrollment.progress.completedLectures / enrollment.progress.totalLectures) * 100)
                : 0;
              const isSecAI = course.slug.includes("secai");

              return (
                <div
                  key={enrollment.id}
                  className="bg-[#002F24]/40 border border-[#0A6B5A]/30 hover:border-[#D4AF37]/40 transition-all duration-500 p-6 sm:p-8"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Course Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {isSecAI ? (
                          <Brain className="w-6 h-6 text-[#D4AF37]" />
                        ) : (
                          <Shield className="w-6 h-6 text-[#D4AF37]" />
                        )}
                        <span className="text-[#D4AF37] font-['Montserrat'] text-xs font-bold tracking-wide uppercase">
                          {course.certCode}
                        </span>
                        <span className={`px-2 py-0.5 text-xs font-['Montserrat'] font-bold ${
                          enrollment.tier === "live"
                            ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                            : "bg-[#0A6B5A]/30 text-[#0A6B5A]"
                        }`}>
                          {enrollment.tier === "live"
                            ? (lang === "en" ? "LIVE" : "مباشر")
                            : (lang === "en" ? "SELF-PACED" : "ذاتي")
                          }
                        </span>
                      </div>
                      <h2 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">
                        {course.title}
                      </h2>
                      <p className="text-[#C4B9A8] font-['Work_Sans'] text-sm mb-4">
                        {course.subtitle}
                      </p>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[#C4B9A8] font-['Work_Sans'] text-xs">
                            {lang === "en" ? "Course Progress" : "تقدم الدورة"}
                          </span>
                          <span className="text-[#D4AF37] font-['Montserrat'] text-sm font-bold">
                            {progressPct}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-[#0A3D33] overflow-hidden">
                          <div
                            className="h-full bg-[#D4AF37] transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-[#C4B9A8]/60 font-['Work_Sans'] text-xs">
                            {enrollment.progress.completedLectures} / {enrollment.progress.totalLectures} {lang === "en" ? "lectures" : "محاضرات"}
                          </span>
                        </div>
                      </div>

                      {/* Slide Download Progress */}
                      {(() => {
                        const courseDownloads = allSlideDownloads?.filter(d => d.courseId === course.id) || [];
                        const totalLectures = enrollment.progress.totalLectures;
                        const downloadedCount = courseDownloads.length;
                        const downloadPct = totalLectures > 0 ? Math.round((downloadedCount / totalLectures) * 100) : 0;
                        return (
                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[#C4B9A8] font-['Work_Sans'] text-xs flex items-center gap-1.5">
                                <Presentation className="w-3.5 h-3.5 text-[#0A6B5A]" />
                                {lang === "en" ? "Slides Downloaded" : "الشرائح المحملة"}
                              </span>
                              <span className="text-[#0A6B5A] font-['Montserrat'] text-sm font-bold">
                                {downloadPct}%
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-[#0A3D33] overflow-hidden">
                              <div
                                className="h-full bg-[#0A6B5A] transition-all duration-500"
                                style={{ width: `${downloadPct}%` }}
                              />
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-[#C4B9A8]/60 font-['Work_Sans'] text-xs">
                                {downloadedCount} / {totalLectures} {lang === "en" ? "slides" : "شرائح"}
                              </span>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Lab Completion Progress */}
                      {(() => {
                        const courseLabCompletions = allLabCompletions?.filter(l => l.courseId === course.id) || [];
                        const totalLectures = enrollment.progress.totalLectures;
                        const completedLabs = courseLabCompletions.length;
                        const labPct = totalLectures > 0 ? Math.round((completedLabs / totalLectures) * 100) : 0;
                        const avgScore = completedLabs > 0
                          ? Math.round(courseLabCompletions.reduce((sum, l) => sum + (l.score || 0), 0) / completedLabs)
                          : 0;
                        return (
                          <div className="mb-2">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-[#C4B9A8] font-['Work_Sans'] text-xs flex items-center gap-1.5">
                                <FlaskConical className="w-3.5 h-3.5 text-[#7C5CFC]" />
                                {lang === "en" ? "Labs Completed" : "المختبرات المكتملة"}
                              </span>
                              <span className="text-[#7C5CFC] font-['Montserrat'] text-sm font-bold">
                                {labPct}%
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-[#0A3D33] overflow-hidden">
                              <div
                                className="h-full bg-[#7C5CFC] transition-all duration-500"
                                style={{ width: `${labPct}%` }}
                              />
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-[#C4B9A8]/60 font-['Work_Sans'] text-xs">
                                {completedLabs} / {totalLectures} {lang === "en" ? "labs" : "مختبرات"}
                                {completedLabs > 0 && (
                                  <> · {lang === "en" ? "Avg" : "متوسط"}: {avgScore}%</>
                                )}
                              </span>
                            </div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-col gap-3 lg:w-56 shrink-0">
                      <Link
                        href={`/learn/${course.slug}`}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm tracking-wide hover:bg-[#B8962E] transition-all duration-300 gold-glow"
                      >
                        <Play className="w-4 h-4" />
                        {lang === "en" ? "Continue Learning" : "تابع التعلم"}
                      </Link>
                      <Link
                        href={`/learn/${course.slug}/quizzes`}
                        className="flex items-center justify-center gap-2 px-6 py-3 border border-[#0A6B5A]/50 text-[#E8E0D4] font-['Montserrat'] font-semibold text-sm hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-all duration-300"
                      >
                        <FileText className="w-4 h-4" />
                        {lang === "en" ? "Quizzes & Exams" : "الاختبارات"}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Credentials Section */}
      {isAuthenticated && (
        <div className="container pb-20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold">
              {lang === "en" ? "My Credentials" : "شهاداتي"}
            </h2>
            <Link
              href="/certificates"
              className="flex items-center gap-1.5 text-[#D4AF37] font-['Montserrat'] text-sm font-semibold hover:underline"
            >
              {lang === "en" ? "View All" : "عرض الكل"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="bg-[#002F24]/40 border border-[#0A6B5A]/30 p-6 text-center">
            <Award className="w-10 h-10 text-[#0A6B5A] mx-auto mb-3" />
            <p className="text-[#C4B9A8] font-['Work_Sans'] text-sm">
              {lang === "en"
                ? "Complete a final exam with 80%+ to earn your certificate and badges."
                : "أكمل الامتحان النهائي بنسبة 80%+ للحصول على شهادتك وشاراتك."
              }
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
