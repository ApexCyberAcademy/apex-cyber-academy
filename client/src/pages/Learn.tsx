/*
  Learn page - course overview with module/lecture navigation.
  Shows all modules, lectures, quizzes, and progress.
*/

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Link, useParams } from "wouter";
import {
  BookOpen, CheckCircle, ChevronDown, ChevronRight, Play,
  FileText, Loader2, Shield, Brain, Lock, ArrowLeft, Clock, Target
} from "lucide-react";
import { useState, useMemo } from "react";

export default function Learn() {
  const { slug } = useParams<{ slug: string }>();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { lang } = useLanguage();
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());

  const { data: courseData, isLoading: courseLoading } = trpc.course.getBySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  const courseId = courseData?.course?.id ?? 0;

  const { data: enrollment } = trpc.enrollment.checkEnrollment.useQuery(
    { courseId },
    { enabled: isAuthenticated && courseId > 0 }
  );

  const isEnrolled = !!enrollment;

  const { data: progressData } = trpc.lecture.progress.useQuery(
    { courseId },
    { enabled: isAuthenticated && isEnrolled && courseId > 0 }
  );

  const { data: quizzes } = trpc.quiz.listForCourse.useQuery(
    { courseId },
    { enabled: isAuthenticated && isEnrolled && courseId > 0 }
  );

  const course = courseData?.course;
  const modulesArr = courseData?.modules || [];
  const lecturesArr = courseData?.lectures || [];
  const isSecAI = course?.slug?.includes("secai") ?? false;

  const completedLectureIds = useMemo(() => {
    if (!progressData?.progress) return new Set<number>();
    return new Set(
      progressData.progress.filter(p => p.completed).map(p => p.lectureId)
    );
  }, [progressData]);

  // Group lectures by module
  const lecturesByModule = useMemo(() => {
    const map = new Map<number, typeof lecturesArr>();
    for (const lec of lecturesArr) {
      const arr = map.get(lec.moduleId) || [];
      arr.push(lec);
      map.set(lec.moduleId, arr);
    }
    return map;
  }, [lecturesArr]);

  // Group quizzes by module
  const quizByModule = useMemo(() => {
    const map = new Map<number, NonNullable<typeof quizzes>[number]>();
    const finalExam: NonNullable<typeof quizzes>[number][] = [];
    if (quizzes) {
      for (const q of quizzes) {
        if (q.isFinalExam) {
          finalExam.push(q);
        } else if (q.moduleId) {
          map.set(q.moduleId, q);
        }
      }
    }
    return { byModule: map, finalExams: finalExam };
  }, [quizzes]);

  const progressPct = progressData?.stats
    ? progressData.stats.totalLectures > 0
      ? Math.round((progressData.stats.completedLectures / progressData.stats.totalLectures) * 100)
      : 0
    : 0;

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(moduleId)) next.delete(moduleId);
      else next.add(moduleId);
      return next;
    });
  };

  // ─── EARLY RETURNS (after all hooks) ───────────────────────────

  if (authLoading || courseLoading) {
    return (
      <div className="min-h-screen bg-[#001A16] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#001A16]">
        <Navbar />
        <div className="pt-32 pb-20 container text-center">
          <h1 className="text-[#E8E0D4] font-['Playfair_Display'] text-3xl font-bold mb-4">
            {lang === "en" ? "Course Not Found" : "الدورة غير موجودة"}
          </h1>
          <Link href="/course" className="text-[#D4AF37] hover:underline">
            {lang === "en" ? "Browse Courses" : "تصفح الدورات"}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#001A16]">
      <Navbar />

      <div className="pt-28 pb-20 container">
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[#C4B9A8] hover:text-[#D4AF37] font-['Work_Sans'] text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === "en" ? "Back to Dashboard" : "العودة إلى اللوحة"}
        </Link>

        {/* Course Header */}
        <div className="bg-[#002F24]/40 border border-[#0A6B5A]/30 p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-3 mb-3">
            {isSecAI ? <Brain className="w-6 h-6 text-[#D4AF37]" /> : <Shield className="w-6 h-6 text-[#D4AF37]" />}
            <span className="text-[#D4AF37] font-['Montserrat'] text-xs font-bold tracking-wide">{course.certCode}</span>
          </div>
          <h1 className="text-[#E8E0D4] font-['Playfair_Display'] text-3xl sm:text-4xl font-bold mb-2">
            {course.title}
          </h1>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-base mb-4">{course.subtitle}</p>

          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[#E8E0D4] font-['Montserrat'] text-xs font-semibold">{course.totalHours} {lang === "en" ? "Hours" : "ساعة"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[#E8E0D4] font-['Montserrat'] text-xs font-semibold">{course.totalSessions} {lang === "en" ? "Sessions" : "جلسة"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Target className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[#E8E0D4] font-['Montserrat'] text-xs font-semibold">{modulesArr.length} {lang === "en" ? "Modules" : "وحدات"}</span>
            </div>
          </div>

          {isEnrolled && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{lang === "en" ? "Overall Progress" : "التقدم الكلي"}</span>
                <span className="text-[#D4AF37] font-['Montserrat'] text-sm font-bold">{progressPct}%</span>
              </div>
              <div className="w-full h-2 bg-[#0A3D33] overflow-hidden">
                <div className="h-full bg-[#D4AF37] transition-all duration-500" style={{ width: `${progressPct}%` }} />
              </div>
            </div>
          )}

          {!isEnrolled && !authLoading && (
            <div className="mt-4 p-4 bg-[#0A3D33]/50 border border-[#D4AF37]/20">
              <p className="text-[#E8E0D4] font-['Work_Sans'] text-sm mb-3">
                {lang === "en"
                  ? "You need to be enrolled to access course content."
                  : "يجب أن تكون مسجلاً للوصول إلى محتوى الدورة."
                }
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all duration-300"
              >
                {lang === "en" ? "Contact to Enroll" : "تواصل للتسجيل"}
              </Link>
            </div>
          )}
        </div>

        {/* Module List */}
        <div className="space-y-4">
          {modulesArr.map((mod, modIdx) => {
            const modLectures = lecturesByModule.get(mod.id) || [];
            const modQuiz = quizByModule.byModule.get(mod.id);
            const isExpanded = expandedModules.has(mod.id);
            const completedInModule = modLectures.filter(l => completedLectureIds.has(l.id)).length;
            const moduleProgress = modLectures.length > 0 ? Math.round((completedInModule / modLectures.length) * 100) : 0;

            return (
              <div key={mod.id} className="bg-[#002F24]/30 border border-[#0A6B5A]/20 overflow-hidden">
                {/* Module Header */}
                <button
                  onClick={() => toggleModule(mod.id)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 hover:bg-[#002F24]/60 transition-colors text-left"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 bg-[#D4AF37]/10 flex items-center justify-center shrink-0">
                      <span className="text-[#D4AF37] font-['Montserrat'] text-sm font-bold">{modIdx + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[#E8E0D4] font-['Montserrat'] text-base font-bold">{mod.title}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[#C4B9A8] font-['Work_Sans'] text-xs">
                          {modLectures.length} {lang === "en" ? "lectures" : "محاضرات"}
                        </span>
                        {mod.examWeight && (
                          <span className="text-[#D4AF37]/70 font-['Montserrat'] text-xs font-semibold">
                            {lang === "en" ? "Exam Weight:" : "وزن الامتحان:"} {mod.examWeight}
                          </span>
                        )}
                        {isEnrolled && (
                          <span className="text-[#C4B9A8]/60 font-['Work_Sans'] text-xs">
                            {completedInModule}/{modLectures.length} {lang === "en" ? "complete" : "مكتمل"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-[#D4AF37] shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-[#C4B9A8] shrink-0" />
                  )}
                </button>

                {/* Module Content */}
                {isExpanded && (
                  <div className="border-t border-[#0A6B5A]/20 px-5 sm:px-6 pb-5">
                    {/* Lectures */}
                    <div className="space-y-2 mt-4">
                      {modLectures.map((lec, lecIdx) => {
                        const isComplete = completedLectureIds.has(lec.id);
                        return (
                          <div key={lec.id} className="flex items-center gap-3">
                            {isEnrolled ? (
                              <Link
                                href={`/learn/${course.slug}/lecture/${lec.id}`}
                                className="flex items-center gap-3 flex-1 py-3 px-4 hover:bg-[#0A3D33]/50 transition-colors group"
                              >
                                {isComplete ? (
                                  <CheckCircle className="w-5 h-5 text-[#D4AF37] shrink-0" />
                                ) : (
                                  <Play className="w-5 h-5 text-[#0A6B5A] group-hover:text-[#D4AF37] shrink-0 transition-colors" />
                                )}
                                <div className="flex-1">
                                  <span className="text-[#E8E0D4] font-['Work_Sans'] text-sm group-hover:text-[#D4AF37] transition-colors">
                                    {lang === "en" ? `Lecture ${lecIdx + 1}: ` : `المحاضرة ${lecIdx + 1}: `}
                                    {lec.title}
                                  </span>
                                </div>
                                {lec.durationMinutes && (
                                  <span className="text-[#C4B9A8]/50 font-['Work_Sans'] text-xs shrink-0">
                                    {lec.durationMinutes} {lang === "en" ? "min" : "د"}
                                  </span>
                                )}
                              </Link>
                            ) : (
                              <div className="flex items-center gap-3 flex-1 py-3 px-4 opacity-50">
                                <Lock className="w-5 h-5 text-[#0A6B5A] shrink-0" />
                                <span className="text-[#C4B9A8] font-['Work_Sans'] text-sm">
                                  {lang === "en" ? `Lecture ${lecIdx + 1}: ` : `المحاضرة ${lecIdx + 1}: `}
                                  {lec.title}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Module Quiz */}
                    {modQuiz && (
                      <div className="mt-4 pt-4 border-t border-[#0A6B5A]/15">
                        {isEnrolled ? (
                          <Link
                            href={`/learn/${course.slug}/quiz/${modQuiz.id}`}
                            className="flex items-center gap-3 py-3 px-4 hover:bg-[#0A3D33]/50 transition-colors group"
                          >
                            <FileText className="w-5 h-5 text-[#D4AF37] shrink-0" />
                            <span className="text-[#E8E0D4] font-['Montserrat'] text-sm font-semibold group-hover:text-[#D4AF37] transition-colors">
                              {modQuiz.title}
                            </span>
                          </Link>
                        ) : (
                          <div className="flex items-center gap-3 py-3 px-4 opacity-50">
                            <Lock className="w-5 h-5 text-[#0A6B5A] shrink-0" />
                            <span className="text-[#C4B9A8] font-['Montserrat'] text-sm font-semibold">{modQuiz.title}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Final Exam */}
          {quizByModule.finalExams.length > 0 && (
            <div className="bg-[#002F24]/40 border-2 border-[#D4AF37]/30 p-5 sm:p-6 mt-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-[#D4AF37] font-['Montserrat'] text-base font-bold">
                    {lang === "en" ? "Final Practice Exam" : "الامتحان التدريبي النهائي"}
                  </h3>
                  <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">
                    {lang === "en"
                      ? "Comprehensive exam covering all modules"
                      : "امتحان شامل يغطي جميع الوحدات"
                    }
                  </p>
                </div>
              </div>
              {isEnrolled ? (
                <Link
                  href={`/learn/${course.slug}/quiz/${quizByModule.finalExams[0].id}`}
                  className="inline-flex items-center gap-2 mt-3 px-6 py-2.5 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all duration-300 gold-glow"
                >
                  {lang === "en" ? "Take Final Exam" : "خض الامتحان النهائي"}
                </Link>
              ) : (
                <p className="text-[#C4B9A8]/50 font-['Work_Sans'] text-xs mt-2">
                  {lang === "en" ? "Enroll to access" : "سجّل للوصول"}
                </p>
              )}
            </div>
          )}

          {/* Practice Exam Mode */}
          {isEnrolled && (
            <div className="bg-[#0A3D33]/20 border border-[#D4AF37]/20 p-5 sm:p-6 mt-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#D4AF37]/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-[#E8E0D4] font-['Montserrat'] text-base font-bold">
                    {lang === "en" ? "Practice Exam Mode" : "وضع الامتحان التدريبي"}
                  </h3>
                  <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">
                    {lang === "en"
                      ? "Simulate the real certification exam with randomized questions, timer, and objective-level scoring"
                      : "حاكِ الامتحان الحقيقي بأسئلة عشوائية وموقت وتقييم حسب الأهداف"
                    }
                  </p>
                </div>
              </div>
              <Link
                href={`/learn/${course.slug}/practice-exam`}
                className="inline-flex items-center gap-2 mt-3 px-6 py-2.5 border-2 border-[#D4AF37]/50 text-[#D4AF37] font-['Montserrat'] font-bold text-sm hover:bg-[#D4AF37] hover:text-[#001A16] transition-all duration-300"
              >
                <Target className="w-4 h-4" />
                {lang === "en" ? "Start Practice Exam" : "ابدأ الامتحان التدريبي"}
              </Link>
            </div>
          )}

          {/* Smart Study Planner */}
          {isEnrolled && (
            <div className="bg-[#0A3D33]/20 border border-[#D4AF37]/20 p-5 sm:p-6 mt-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#D4AF37]/10 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <h3 className="text-[#E8E0D4] font-['Montserrat'] text-base font-bold">
                    {lang === "en" ? "Smart Study Planner" : "مخطط الدراسة الذكي"}
                  </h3>
                  <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">
                    {lang === "en"
                      ? "AI-powered analysis of your quiz results to identify weak areas and recommend lectures to revisit"
                      : "تحليل ذكي لنتائج اختباراتك لتحديد نقاط الضعف واقتراح محاضرات للمراجعة"}
                  </p>
                </div>
              </div>
              <Link
                href={`/learn/${course.slug}/study-planner`}
                className="inline-flex items-center gap-2 mt-3 px-6 py-2.5 border-2 border-[#D4AF37]/50 text-[#D4AF37] font-['Montserrat'] font-bold text-sm hover:bg-[#D4AF37] hover:text-[#001A16] transition-all duration-300"
              >
                <Brain className="w-4 h-4" />
                {lang === "en" ? "Open Study Planner" : "افتح مخطط الدراسة"}
              </Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
