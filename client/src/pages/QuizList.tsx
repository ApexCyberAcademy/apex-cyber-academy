/*
  Quiz List - shows all quizzes for a course with best scores.
*/

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Link, useParams } from "wouter";
import {
  ArrowLeft, FileText, Award, Loader2, CheckCircle, XCircle, Clock
} from "lucide-react";
import { useMemo } from "react";

export default function QuizList() {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { lang } = useLanguage();

  const { data: courseData, isLoading: courseLoading } = trpc.course.getBySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  const { data: quizzes } = trpc.quiz.listForCourse.useQuery(
    { courseId: courseData?.course?.id ?? 0 },
    { enabled: isAuthenticated && !!courseData?.course?.id }
  );

  const { data: attempts } = trpc.quiz.attempts.useQuery(
    { courseId: courseData?.course?.id ?? 0 },
    { enabled: isAuthenticated && !!courseData?.course?.id }
  );

  const bestByQuiz = useMemo(() => {
    const map = new Map<number, { score: number; passed: boolean }>();
    if (attempts) {
      for (const item of attempts) {
        const a = item.attempt;
        const existing = map.get(a.quizId);
        if (!existing || a.score > existing.score) {
          map.set(a.quizId, { score: a.score, passed: a.passed });
        }
      }
    }
    return map;
  }, [attempts]);

  if (authLoading || courseLoading) {
    return (
      <div className="min-h-screen bg-[#001A16] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  const course = courseData?.course;
  const moduleQuizzes = (quizzes || []).filter(q => !q.isFinalExam);
  const finalExams = (quizzes || []).filter(q => q.isFinalExam);

  return (
    <div className="min-h-screen bg-[#001A16]">
      <Navbar />
      <div className="pt-28 pb-20 container">
        <Link
          href={`/learn/${slug}`}
          className="inline-flex items-center gap-2 text-[#C4B9A8] hover:text-[#D4AF37] font-['Work_Sans'] text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === "en" ? "Back to Course" : "العودة إلى الدورة"}
        </Link>

        <h1 className="text-[#E8E0D4] font-['Playfair_Display'] text-3xl font-bold mb-2">
          {lang === "en" ? "Quizzes & Exams" : "الاختبارات والامتحانات"}
        </h1>
        <p className="text-[#C4B9A8] font-['Work_Sans'] text-base mb-8">
          {course?.title}
        </p>

        {/* Module Quizzes */}
        <h2 className="text-[#D4AF37] font-['Montserrat'] text-sm font-bold tracking-wide uppercase mb-4">
          {lang === "en" ? "Module Quizzes" : "اختبارات الوحدات"}
        </h2>
        <div className="space-y-3 mb-10">
          {moduleQuizzes.map((q) => {
            const best = bestByQuiz.get(q.id);
            return (
              <Link
                key={q.id}
                href={`/learn/${slug}/quiz/${q.id}`}
                className="flex items-center justify-between p-5 bg-[#002F24]/30 border border-[#0A6B5A]/20 hover:border-[#D4AF37]/40 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <FileText className="w-5 h-5 text-[#0A6B5A] group-hover:text-[#D4AF37] transition-colors" />
                  <div>
                    <h3 className="text-[#E8E0D4] font-['Montserrat'] text-sm font-semibold group-hover:text-[#D4AF37] transition-colors">
                      {q.title}
                    </h3>
                    {q.timeLimitMinutes && (
                      <span className="flex items-center gap-1 text-[#C4B9A8]/60 font-['Work_Sans'] text-xs mt-0.5">
                        <Clock className="w-3 h-3" />
                        {q.timeLimitMinutes} {lang === "en" ? "min" : "د"}
                      </span>
                    )}
                  </div>
                </div>
                {best ? (
                  <div className="flex items-center gap-2">
                    {best.passed ? (
                      <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400" />
                    )}
                    <span className={`font-['Montserrat'] text-sm font-bold ${best.passed ? "text-[#D4AF37]" : "text-red-400"}`}>
                      {best.score}%
                    </span>
                  </div>
                ) : (
                  <span className="text-[#C4B9A8]/40 font-['Work_Sans'] text-xs">
                    {lang === "en" ? "Not attempted" : "لم يُحاول"}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Final Exams */}
        {finalExams.length > 0 && (
          <>
            <h2 className="text-[#D4AF37] font-['Montserrat'] text-sm font-bold tracking-wide uppercase mb-4">
              {lang === "en" ? "Final Practice Exam" : "الامتحان التدريبي النهائي"}
            </h2>
            <div className="space-y-3">
              {finalExams.map((q) => {
                const best = bestByQuiz.get(q.id);
                return (
                  <Link
                    key={q.id}
                    href={`/learn/${slug}/quiz/${q.id}`}
                    className="flex items-center justify-between p-6 bg-[#002F24]/40 border-2 border-[#D4AF37]/20 hover:border-[#D4AF37]/50 transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4">
                      <Award className="w-6 h-6 text-[#D4AF37]" />
                      <div>
                        <h3 className="text-[#E8E0D4] font-['Montserrat'] text-base font-bold group-hover:text-[#D4AF37] transition-colors">
                          {q.title}
                        </h3>
                        {q.timeLimitMinutes && (
                          <span className="flex items-center gap-1 text-[#C4B9A8]/60 font-['Work_Sans'] text-xs mt-0.5">
                            <Clock className="w-3 h-3" />
                            {q.timeLimitMinutes} {lang === "en" ? "min" : "د"}
                          </span>
                        )}
                      </div>
                    </div>
                    {best ? (
                      <div className="flex items-center gap-2">
                        {best.passed ? (
                          <CheckCircle className="w-5 h-5 text-[#D4AF37]" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                        <span className={`font-['Montserrat'] text-lg font-bold ${best.passed ? "text-[#D4AF37]" : "text-red-400"}`}>
                          {best.score}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-[#C4B9A8]/40 font-['Work_Sans'] text-sm">
                        {lang === "en" ? "Not attempted" : "لم يُحاول"}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
