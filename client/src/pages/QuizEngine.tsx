/*
  Quiz Engine - takes a quiz, auto-scores, and shows results.
  Supports module quizzes and final exams.
*/

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Link, useParams } from "wouter";
import {
  ArrowLeft, CheckCircle, XCircle, FileText, Loader2,
  Clock, Award, ChevronRight, AlertTriangle, RotateCcw, AlertCircle, Mail
} from "lucide-react";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";

type QuizResults = {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  passed: boolean;
  passingScore: number;
  results: Array<{
    questionId: number;
    selected: string;
    correct: string;
    isCorrect: boolean;
    explanation: string | null;
    arabicExplanation?: string | null;
  }>;
  credentials?: {
    certificate: { issued: boolean; certificateNumber?: string; pdfUrl?: string; emailSent?: boolean; emailError?: string };
    badges: Array<{ type: string; title: string; iconEmoji: string }>;
  };
};

export default function QuizEngine() {
  const { slug, quizId } = useParams<{ slug: string; quizId: string }>();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { lang } = useLanguage();
  const qId = parseInt(quizId || "0", 10);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<QuizResults | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: quizData, isLoading: quizLoading } = trpc.quiz.get.useQuery(
    { quizId: qId },
    { enabled: qId > 0 && isAuthenticated }
  );

  const { data: bestAttempt } = trpc.quiz.bestAttempt.useQuery(
    { quizId: qId },
    { enabled: qId > 0 && isAuthenticated }
  );

  const submitQuiz = trpc.quiz.submit.useMutation({
    onSuccess: (data) => {
      setResults(data);
      if (timerRef.current) clearInterval(timerRef.current);
    },
  });

  // Timer for timed exams
  useEffect(() => {
    if (quizData?.quiz?.timeLimitMinutes && !results) {
      setTimeLeft(quizData.quiz.timeLimitMinutes * 60);
    }
  }, [quizData?.quiz?.timeLimitMinutes, results]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || results) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          // Auto-submit when time runs out
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timeLeft, results]);

  const handleAnswer = useCallback((questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [String(questionId)]: answer }));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!qId) return;
    submitQuiz.mutate({ quizId: qId, answers, origin: window.location.origin });
    setShowConfirm(false);
  }, [qId, answers]);

  const handleRetake = useCallback(() => {
    setAnswers({});
    setResults(null);
    setShowConfirm(false);
    if (quizData?.quiz?.timeLimitMinutes) {
      setTimeLeft(quizData.quiz.timeLimitMinutes * 60);
    }
  }, [quizData?.quiz?.timeLimitMinutes]);

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = quizData?.questions?.length || 0;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (authLoading || quizLoading) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="min-h-screen bg-[#F5F0E8]">
        <Navbar />
        <div className="pt-32 pb-20 container text-center">
          <h1 className="text-[#0C3C3C] font-['Playfair_Display'] text-3xl font-bold mb-4">
            {lang === "en" ? "Quiz Not Found" : "الاختبار غير موجود"}
          </h1>
          <Link href={`/learn/${slug}`} className="text-[#D4AF37] hover:underline">
            {lang === "en" ? "Back to Course" : "العودة إلى الدورة"}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const quiz = quizData.quiz;
  const questions = quizData.questions;

  // ─── RESULTS VIEW ──────────────────────────────────────────
  if (results) {
    return (
      <div className="min-h-screen bg-[#F5F0E8]">
        <Navbar />
        <div className="pt-28 pb-20 container">
          <Link
            href={`/learn/${slug}`}
            className="inline-flex items-center gap-2 text-[#0C3C3C] hover:text-[#D4AF37] font-['Work_Sans'] text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {lang === "en" ? "Back to Course" : "العودة إلى الدورة"}
          </Link>

          {/* Score Card */}
          <div className={`border-2 p-8 mb-8 text-center ${results.passed ? "bg-[#164A4A]/40 border-[#D4AF37]/50" : "bg-[#3D0A0A]/30 border-red-500/30"}`}>
            <div className="mb-4">
              {results.passed ? (
                <Award className="w-16 h-16 text-[#D4AF37] mx-auto" />
              ) : (
                <AlertTriangle className="w-16 h-16 text-red-400 mx-auto" />
              )}
            </div>
            <h1 className="text-[#0C3C3C] font-['Playfair_Display'] text-4xl font-bold mb-2">
              {results.score}%
            </h1>
            <p className={`font-['Montserrat'] text-lg font-bold mb-1 ${results.passed ? "text-[#D4AF37]" : "text-red-400"}`}>
              {results.passed
                ? (lang === "en" ? "PASSED" : "ناجح")
                : (lang === "en" ? "NOT PASSED" : "لم ينجح")
              }
            </p>
            <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm">
              {results.correctAnswers}/{results.totalQuestions} {lang === "en" ? "correct" : "صحيح"} - {lang === "en" ? `Passing: ${results.passingScore}%` : `النجاح: ${results.passingScore}%`}
            </p>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={handleRetake}
                className="flex items-center gap-2 px-6 py-3 border border-[#D4CBBA] text-[#0C3C3C] font-['Montserrat'] font-semibold text-sm hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-all duration-300"
              >
                <RotateCcw className="w-4 h-4" />
                {lang === "en" ? "Retake Quiz" : "أعد الاختبار"}
              </button>
              <Link
                href={`/learn/${slug}`}
                className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all duration-300"
              >
                {lang === "en" ? "Back to Course" : "العودة إلى الدورة"}
              </Link>
            </div>
          </div>

          {/* Earned Credentials */}
          {results.credentials && (results.credentials.certificate.issued || results.credentials.badges.length > 0) && (
            <div className="border-2 border-[#D4AF37]/40 bg-[#164A4A]/30 p-6 mb-8">
              <h2 className="text-[#D4AF37] font-['Playfair_Display'] text-xl font-bold mb-4 text-center">
                🏆 {lang === "en" ? "Credentials Earned!" : "الشهادات المكتسبة!"}
              </h2>

              {/* Certificate */}
              {results.credentials.certificate.issued && (
                <div className="bg-[#F5F0E8]/60 border border-[#D4AF37]/30 p-4 mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Award className="w-8 h-8 text-[#D4AF37]" />
                    <div>
                      <p className="text-[#0C3C3C] font-['Montserrat'] font-bold text-sm">
                        {lang === "en" ? "Certificate of Completion" : "شهادة إتمام"}
                      </p>
                      <p className="text-[#0C3C3C] font-['Work_Sans'] text-xs">
                        #{results.credentials.certificate.certificateNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {results.credentials.certificate.pdfUrl && (
                      <a
                        href={results.credentials.certificate.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-xs hover:bg-[#B8962E] transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        {lang === "en" ? "Download PDF" : "تحميل PDF"}
                      </a>
                    )}
                    <Link
                      href="/certificates"
                      className="flex items-center gap-2 px-4 py-2 border border-[#D4CBBA] text-[#0C3C3C] font-['Montserrat'] font-semibold text-xs hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-colors"
                    >
                      {lang === "en" ? "View All Credentials" : "عرض جميع الشهادات"}
                    </Link>
                  </div>
                  {/* Email delivery status */}
                  {results.credentials.certificate.emailSent !== undefined && (
                    <div className={`mt-3 flex items-center gap-2 text-xs font-['Work_Sans'] ${
                      results.credentials.certificate.emailSent
                        ? 'text-green-700'
                        : 'text-amber-700'
                    }`}>
                      {results.credentials.certificate.emailSent ? (
                        <><Mail className="w-3.5 h-3.5" />
                          {lang === "en"
                            ? "Certificate emailed to your registered address"
                            : "تم إرسال الشهادة إلى بريدك الإلكتروني المسجل"}
                        </>
                      ) : (
                        <><AlertCircle className="w-3.5 h-3.5" />
                          {lang === "en"
                            ? `Email not sent${results.credentials.certificate.emailError ? ': ' + results.credentials.certificate.emailError : ''}`
                            : `لم يتم إرسال البريد${results.credentials.certificate.emailError ? ': ' + results.credentials.certificate.emailError : ''}`}
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Badges */}
              {results.credentials.badges.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {results.credentials.badges.map((badge, idx) => (
                    <div key={idx} className="bg-[#F5F0E8]/60 border border-[#D4CBBA] p-3 text-center">
                      <span className="text-2xl block mb-1">{badge.iconEmoji}</span>
                      <p className="text-[#0C3C3C] font-['Montserrat'] font-bold text-xs">{badge.title}</p>
                      <p className="text-[#0C3C3C] font-['Work_Sans'] text-[10px] mt-0.5 capitalize">{badge.type.replace(/_/g, " ")}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Detailed Results */}
          <h2 className="text-[#0C3C3C] font-['Playfair_Display'] text-2xl font-bold mb-6">
            {lang === "en" ? "Question Review" : "مراجعة الأسئلة"}
          </h2>
          <div className="space-y-4">
            {questions.map((q, idx) => {
              const result = results.results.find(r => r.questionId === q.id);
              if (!result) return null;
              return (
                <div
                  key={q.id}
                  className={`border p-5 ${result.isCorrect ? "border-[#227C82]/40 bg-white/20" : "border-red-500/20 bg-[#3D0A0A]/10"}`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    {result.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <span className="text-[#0C3C3C] font-['Montserrat'] text-xs font-bold">
                        Q{idx + 1}
                        {q.objective && ` - ${q.objective}`}
                      </span>
                      <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm mt-1">{lang === "ar" && q.arabicQuestionText ? q.arabicQuestionText : q.questionText}</p>
                    </div>
                  </div>
                  <div className="ml-8 space-y-1.5">
                    {(["A", "B", "C", "D"] as const).map((opt) => {
                      const optKey = `option${opt}` as "optionA" | "optionB" | "optionC" | "optionD";
                      const isSelected = result.selected.toUpperCase() === opt;
                      const isCorrectOpt = result.correct.toUpperCase() === opt;
                      let bgClass = "bg-transparent";
                      let textClass = "text-[#0C3C3C]";
                      if (isCorrectOpt) {
                        bgClass = "bg-[#227C82]/20";
                        textClass = "text-[#D4AF37]";
                      } else if (isSelected && !result.isCorrect) {
                        bgClass = "bg-red-500/10";
                        textClass = "text-red-400";
                      }
                      return (
                        <div key={opt} className={`flex items-center gap-2 px-3 py-1.5 ${bgClass}`}>
                          <span className={`font-['Montserrat'] text-xs font-bold ${textClass}`}>{opt}.</span>
                          <span className={`font-['Work_Sans'] text-sm ${textClass}`}>{lang === "ar" && q[`arabic${optKey.charAt(0).toUpperCase() + optKey.slice(1)}` as keyof typeof q] ? q[`arabic${optKey.charAt(0).toUpperCase() + optKey.slice(1)}` as keyof typeof q] as string : q[optKey]}</span>
                          {isCorrectOpt && <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37] ml-auto shrink-0" />}
                          {isSelected && !result.isCorrect && <XCircle className="w-3.5 h-3.5 text-red-400 ml-auto shrink-0" />}
                        </div>
                      );
                    })}
                    {(result.explanation || result.arabicExplanation) && (
                      <div className="mt-2 px-3 py-2 bg-[#164A4A]/30 border-s-2 border-[#D4AF37]/50">
                        <p className="text-[#0C3C3C] font-['Work_Sans'] text-xs italic">{lang === "ar" && result.arabicExplanation ? result.arabicExplanation : result.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ─── QUIZ TAKING VIEW ──────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <Navbar />

      <div className="pt-28 pb-20 container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link
              href={`/learn/${slug}`}
              className="inline-flex items-center gap-2 text-[#0C3C3C] hover:text-[#D4AF37] font-['Work_Sans'] text-sm mb-3 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {lang === "en" ? "Back to Course" : "العودة إلى الدورة"}
            </Link>
            <h1 className="text-[#0C3C3C] font-['Playfair_Display'] text-2xl sm:text-3xl font-bold">
              {lang === "ar" && quiz.arabicTitle ? quiz.arabicTitle : quiz.title}
            </h1>
            {(quiz.description || quiz.arabicDescription) && (
              <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm mt-1">{lang === "ar" && quiz.arabicDescription ? quiz.arabicDescription : quiz.description}</p>
            )}
          </div>
          <div className="flex items-center gap-4 shrink-0">
            {timeLeft !== null && (
              <div className={`flex items-center gap-2 px-4 py-2 border ${timeLeft < 300 ? "border-red-500/50 text-red-400" : "border-[#D4CBBA] text-[#0C3C3C]"} font-['Montserrat'] text-sm font-bold`}>
                <Clock className="w-4 h-4" />
                {formatTime(timeLeft)}
              </div>
            )}
            <div className="text-[#0C3C3C] font-['Work_Sans'] text-sm">
              {answeredCount}/{totalQuestions} {lang === "en" ? "answered" : "مُجاب"}
            </div>
          </div>
        </div>

        {/* Best Previous Attempt */}
        {bestAttempt && (
          <div className="bg-[#164A4A]/30 border border-[#D4CBBA] p-4 mb-6 flex items-center gap-3">
            <Award className="w-5 h-5 text-[#D4AF37] shrink-0" />
            <span className="text-[#0C3C3C] font-['Work_Sans'] text-sm">
              {lang === "en" ? "Your best score:" : "أفضل نتيجة لك:"}{" "}
              <span className="text-[#D4AF37] font-bold">{bestAttempt.score}%</span>
              {" "}({bestAttempt.correctAnswers}/{bestAttempt.totalQuestions})
            </span>
          </div>
        )}

        {/* Questions */}
        <div className="space-y-6 mb-8">
          {questions.map((q, idx) => (
            <div key={q.id} className="bg-white/30 border border-[#D4CBBA] p-5 sm:p-6">
              <div className="flex items-start gap-3 mb-4">
                <span className="bg-[#D4AF37]/10 text-[#D4AF37] font-['Montserrat'] text-xs font-bold px-2.5 py-1 shrink-0">
                  {idx + 1}
                </span>
                <div>
                  <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm leading-relaxed">{lang === "ar" && q.arabicQuestionText ? q.arabicQuestionText : q.questionText}</p>
                  {q.objective && (
                    <span className="text-[#0C3C3C]/50 font-['Montserrat'] text-xs mt-1 block">
                      {lang === "en" ? "Objective:" : "الهدف:"} {q.objective}
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-2 ms-0 sm:ms-9">
                {(["A", "B", "C", "D"] as const).map((opt) => {
                  const optKey = `option${opt}` as "optionA" | "optionB" | "optionC" | "optionD";
                  const isSelected = answers[String(q.id)] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(q.id, opt)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-start transition-all duration-200 ${
                        isSelected
                          ? "bg-[#D4AF37]/15 border border-[#D4AF37]/50 text-[#0C3C3C]"
                          : "bg-[#164A4A]/20 border border-[#227C82]/15 text-[#0C3C3C] hover:border-[#D4AF37]/30 hover:text-[#0C3C3C]"
                      }`}
                    >
                      <span className={`font-['Montserrat'] text-xs font-bold w-6 h-6 flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-[#D4AF37] text-[#0C3C3C]" : "bg-[#227C82]/30 text-[#0C3C3C]"
                      }`}>
                        {opt}
                      </span>
                      <span className="font-['Work_Sans'] text-sm">{lang === "ar" && q[`arabic${optKey.charAt(0).toUpperCase() + optKey.slice(1)}` as keyof typeof q] ? q[`arabic${optKey.charAt(0).toUpperCase() + optKey.slice(1)}` as keyof typeof q] as string : q[optKey]}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="sticky bottom-0 bg-[#F5F0E8]/95 backdrop-blur-xl border-t border-[#D4CBBA] py-4 -mx-4 px-4 sm:-mx-6 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[#0C3C3C] font-['Work_Sans'] text-sm">
              {answeredCount}/{totalQuestions} {lang === "en" ? "answered" : "مُجاب"}
            </span>
            {showConfirm ? (
              <div className="flex items-center gap-3">
                <span className="text-[#0C3C3C] font-['Work_Sans'] text-sm">
                  {answeredCount < totalQuestions
                    ? (lang === "en" ? `${totalQuestions - answeredCount} unanswered. Submit anyway?` : `${totalQuestions - answeredCount} بدون إجابة. هل تريد التقديم؟`)
                    : (lang === "en" ? "Ready to submit?" : "هل أنت مستعد للتقديم؟")
                  }
                </span>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 border border-[#D4CBBA] text-[#0C3C3C] font-['Montserrat'] font-semibold text-sm hover:text-[#0C3C3C] transition-colors"
                >
                  {lang === "en" ? "Cancel" : "إلغاء"}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitQuiz.isPending}
                  className="flex items-center gap-2 px-6 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all duration-300 disabled:opacity-50"
                >
                  {submitQuiz.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {lang === "en" ? "Confirm Submit" : "تأكيد التقديم"}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 px-8 py-3 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all duration-300 gold-glow"
              >
                <FileText className="w-4 h-4" />
                {lang === "en" ? "Submit Quiz" : "تقديم الاختبار"}
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
