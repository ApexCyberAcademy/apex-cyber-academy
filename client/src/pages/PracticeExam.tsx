/*
  Practice Exam Mode - timed, randomized exam simulation.
  Pulls random questions from all quizzes in a course.
  Shows objective-level breakdown at the end.
*/

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Link, useParams } from "wouter";
import {
  ArrowLeft, CheckCircle, XCircle, FileText, Loader2,
  Clock, Award, AlertTriangle, RotateCcw, Target,
  BarChart3, Play, Settings2
} from "lucide-react";
import { useState, useCallback, useEffect, useRef, useMemo } from "react";

type PracticeQuestion = {
  id: number;
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  objective: string | null;
};

type PracticeResults = {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  passed: boolean;
  timeTakenSeconds?: number;
  results: Array<{
    questionId: number;
    selected: string;
    correct: string;
    isCorrect: boolean;
    explanation: string | null;
    objective: string | null;
  }>;
  objectiveBreakdown: Array<{
    objective: string;
    correct: number;
    total: number;
    percentage: number;
  }>;
};

export default function PracticeExam() {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { lang } = useLanguage();

  // Setup state
  const [questionCount, setQuestionCount] = useState(50);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState(90);
  const [started, setStarted] = useState(false);

  // Exam state
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<PracticeResults | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [startTime] = useState(() => Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showReview, setShowReview] = useState(false);

  const QUESTIONS_PER_PAGE = 5;

  // Get course info
  const { data: courseData, isLoading: courseLoading } = trpc.course.getBySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );
  const course = courseData?.course;

  // Generate exam mutation
  const generateExam = trpc.practiceExam.generate.useMutation({
    onSuccess: (data) => {
      setQuestions(data.questions);
      setTimeLeft(data.timeLimitMinutes * 60);
      setStarted(true);
    },
  });

  // Submit exam mutation
  const submitExam = trpc.practiceExam.submit.useMutation({
    onSuccess: (data) => {
      setResults(data);
      if (timerRef.current) clearInterval(timerRef.current);
    },
  });

  // Timer
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || results) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timeLeft, results]);

  const handleStart = useCallback(() => {
    if (!course) return;
    generateExam.mutate({
      courseId: course.id,
      questionCount,
      timeLimitMinutes,
    });
  }, [course, questionCount, timeLimitMinutes]);

  const handleAnswer = useCallback((questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [String(questionId)]: answer }));
  }, []);

  const handleSubmit = useCallback(() => {
    if (!course) return;
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    submitExam.mutate({
      courseId: course.id,
      answers,
      questionIds: questions.map(q => q.id),
      timeTakenSeconds: timeTaken,
    });
    setShowConfirm(false);
  }, [course, answers, questions, startTime]);

  const handleReset = useCallback(() => {
    setStarted(false);
    setQuestions([]);
    setAnswers({});
    setResults(null);
    setTimeLeft(null);
    setShowConfirm(false);
    setCurrentPage(0);
    setShowReview(false);
  }, []);

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length;
  const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE);
  const pageQuestions = questions.slice(currentPage * QUESTIONS_PER_PAGE, (currentPage + 1) * QUESTIONS_PER_PAGE);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

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
          <Link href="/dashboard" className="text-[#D4AF37] hover:underline">
            {lang === "en" ? "Back to Dashboard" : "العودة إلى اللوحة"}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // ─── RESULTS VIEW ──────────────────────────────────────────
  if (results) {
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

          {/* Score Card */}
          <div className={`border-2 p-8 mb-8 text-center ${results.passed ? "bg-[#0A3D33]/40 border-[#D4AF37]/50" : "bg-[#3D0A0A]/30 border-red-500/30"}`}>
            <div className="mb-4">
              {results.passed ? (
                <Award className="w-16 h-16 text-[#D4AF37] mx-auto" />
              ) : (
                <AlertTriangle className="w-16 h-16 text-red-400 mx-auto" />
              )}
            </div>
            <h1 className="text-[#E8E0D4] font-['Playfair_Display'] text-4xl font-bold mb-2">
              {results.score}%
            </h1>
            <p className={`font-['Montserrat'] text-lg font-bold mb-1 ${results.passed ? "text-[#D4AF37]" : "text-red-400"}`}>
              {results.passed
                ? (lang === "en" ? "PASSED" : "ناجح")
                : (lang === "en" ? "NOT PASSED" : "لم ينجح")
              }
            </p>
            <p className="text-[#C4B9A8] font-['Work_Sans'] text-sm">
              {results.correctAnswers}/{results.totalQuestions} {lang === "en" ? "correct" : "صحيح"} — {lang === "en" ? "Passing: 70%" : "النجاح: 70%"}
            </p>
            {results.timeTakenSeconds && (
              <p className="text-[#C4B9A8]/60 font-['Work_Sans'] text-xs mt-2">
                {lang === "en" ? "Time taken:" : "الوقت المستغرق:"} {formatTime(results.timeTakenSeconds)}
              </p>
            )}

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 border border-[#0A6B5A]/50 text-[#E8E0D4] font-['Montserrat'] font-semibold text-sm hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-all duration-300"
              >
                <RotateCcw className="w-4 h-4" />
                {lang === "en" ? "New Practice Exam" : "امتحان تدريبي جديد"}
              </button>
              <Link
                href={`/learn/${slug}`}
                className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all duration-300"
              >
                {lang === "en" ? "Back to Course" : "العودة إلى الدورة"}
              </Link>
            </div>
          </div>

          {/* Objective Breakdown */}
          {results.objectiveBreakdown.length > 0 && (
            <div className="bg-[#002F24]/40 border border-[#0A6B5A]/30 p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="text-[#E8E0D4] font-['Playfair_Display'] text-xl font-bold">
                  {lang === "en" ? "Performance by Objective" : "الأداء حسب الهدف"}
                </h2>
              </div>
              <div className="space-y-3">
                {results.objectiveBreakdown.map((obj, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[#C4B9A8] font-['Work_Sans'] text-sm flex-1 mr-4 truncate">
                        {obj.objective}
                      </span>
                      <span className={`font-['Montserrat'] text-sm font-bold shrink-0 ${
                        obj.percentage >= 70 ? "text-[#D4AF37]" : "text-red-400"
                      }`}>
                        {obj.correct}/{obj.total} ({obj.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#0A3D33] overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          obj.percentage >= 70 ? "bg-[#D4AF37]" : "bg-red-400"
                        }`}
                        style={{ width: `${obj.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Toggle Review */}
          <button
            onClick={() => setShowReview(!showReview)}
            className="flex items-center gap-2 text-[#D4AF37] font-['Montserrat'] text-sm font-bold mb-6 hover:underline"
          >
            <BarChart3 className="w-4 h-4" />
            {showReview
              ? (lang === "en" ? "Hide Question Review" : "إخفاء مراجعة الأسئلة")
              : (lang === "en" ? "Show Question Review" : "عرض مراجعة الأسئلة")
            }
          </button>

          {/* Detailed Results */}
          {showReview && (
            <div className="space-y-4">
              {questions.map((q, idx) => {
                const result = results.results.find(r => r.questionId === q.id);
                if (!result) return null;
                return (
                  <div
                    key={q.id}
                    className={`border p-5 ${result.isCorrect ? "border-[#0A6B5A]/40 bg-[#002F24]/20" : "border-red-500/20 bg-[#3D0A0A]/10"}`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      {result.isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <span className="text-[#C4B9A8] font-['Montserrat'] text-xs font-bold">
                          Q{idx + 1}
                          {result.objective && ` — ${result.objective}`}
                        </span>
                        <p className="text-[#E8E0D4] font-['Work_Sans'] text-sm mt-1">{q.questionText}</p>
                      </div>
                    </div>
                    <div className="ml-8 space-y-1.5">
                      {(["A", "B", "C", "D"] as const).map((opt) => {
                        const optKey = `option${opt}` as "optionA" | "optionB" | "optionC" | "optionD";
                        const isSelected = result.selected.toUpperCase() === opt;
                        const isCorrectOpt = result.correct.toUpperCase() === opt;
                        let bgClass = "bg-transparent";
                        let textClass = "text-[#C4B9A8]";
                        if (isCorrectOpt) {
                          bgClass = "bg-[#0A6B5A]/20";
                          textClass = "text-[#D4AF37]";
                        } else if (isSelected && !result.isCorrect) {
                          bgClass = "bg-red-500/10";
                          textClass = "text-red-400";
                        }
                        return (
                          <div key={opt} className={`flex items-center gap-2 px-3 py-1.5 ${bgClass}`}>
                            <span className={`font-['Montserrat'] text-xs font-bold ${textClass}`}>{opt}.</span>
                            <span className={`font-['Work_Sans'] text-sm ${textClass}`}>{q[optKey]}</span>
                            {isCorrectOpt && <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37] ml-auto shrink-0" />}
                            {isSelected && !result.isCorrect && <XCircle className="w-3.5 h-3.5 text-red-400 ml-auto shrink-0" />}
                          </div>
                        );
                      })}
                      {result.explanation && (
                        <div className="mt-2 px-3 py-2 bg-[#0A3D33]/30 border-l-2 border-[#D4AF37]/50">
                          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs italic">{result.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <Footer />
      </div>
    );
  }

  // ─── SETUP VIEW (before starting) ──────────────────────────
  if (!started) {
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

          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <Target className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
              <h1 className="text-[#E8E0D4] font-['Playfair_Display'] text-3xl sm:text-4xl font-bold mb-3">
                {lang === "en" ? "Practice Exam" : "الامتحان التدريبي"}
              </h1>
              <p className="text-[#C4B9A8] font-['Work_Sans'] text-base">
                {course.title} — {course.certCode}
              </p>
              <p className="text-[#C4B9A8]/70 font-['Work_Sans'] text-sm mt-2">
                {lang === "en"
                  ? "Simulate the real certification exam with randomized questions from all modules. Timed and scored to match exam conditions."
                  : "حاكِ الامتحان الحقيقي بأسئلة عشوائية من جميع الوحدات. موقوت ومُقيَّم لمطابقة ظروف الامتحان."
                }
              </p>
            </div>

            {/* Configuration */}
            <div className="bg-[#002F24]/40 border border-[#0A6B5A]/30 p-6 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Settings2 className="w-5 h-5 text-[#D4AF37]" />
                <h2 className="text-[#E8E0D4] font-['Montserrat'] text-lg font-bold">
                  {lang === "en" ? "Exam Settings" : "إعدادات الامتحان"}
                </h2>
              </div>

              <div className="space-y-6">
                {/* Question Count */}
                <div>
                  <label className="text-[#C4B9A8] font-['Work_Sans'] text-sm block mb-3">
                    {lang === "en" ? "Number of Questions" : "عدد الأسئلة"}
                  </label>
                  <div className="flex gap-3">
                    {[20, 30, 50, 75, 100].map(n => (
                      <button
                        key={n}
                        onClick={() => setQuestionCount(n)}
                        className={`flex-1 py-3 font-['Montserrat'] text-sm font-bold transition-all ${
                          questionCount === n
                            ? "bg-[#D4AF37] text-[#001A16]"
                            : "bg-[#0A3D33]/40 text-[#C4B9A8] border border-[#0A6B5A]/30 hover:border-[#D4AF37]/40 hover:text-[#E8E0D4]"
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Limit */}
                <div>
                  <label className="text-[#C4B9A8] font-['Work_Sans'] text-sm block mb-3">
                    {lang === "en" ? "Time Limit (minutes)" : "الحد الزمني (دقائق)"}
                  </label>
                  <div className="flex gap-3">
                    {[30, 60, 90, 120, 180].map(m => (
                      <button
                        key={m}
                        onClick={() => setTimeLimitMinutes(m)}
                        className={`flex-1 py-3 font-['Montserrat'] text-sm font-bold transition-all ${
                          timeLimitMinutes === m
                            ? "bg-[#D4AF37] text-[#001A16]"
                            : "bg-[#0A3D33]/40 text-[#C4B9A8] border border-[#0A6B5A]/30 hover:border-[#D4AF37]/40 hover:text-[#E8E0D4]"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-[#0A3D33]/20 border border-[#0A6B5A]/20 p-5 mb-8">
              <h3 className="text-[#D4AF37] font-['Montserrat'] text-sm font-bold mb-3">
                {lang === "en" ? "Exam Tips" : "نصائح الامتحان"}
              </h3>
              <ul className="space-y-2 text-[#C4B9A8] font-['Work_Sans'] text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#0A6B5A] shrink-0 mt-0.5" />
                  {lang === "en"
                    ? "Questions are randomly selected from all course modules"
                    : "يتم اختيار الأسئلة عشوائيًا من جميع وحدات الدورة"
                  }
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#0A6B5A] shrink-0 mt-0.5" />
                  {lang === "en"
                    ? "The exam auto-submits when time runs out"
                    : "يُقدَّم الامتحان تلقائيًا عند انتهاء الوقت"
                  }
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#0A6B5A] shrink-0 mt-0.5" />
                  {lang === "en"
                    ? "Passing score is 70% — matching real exam standards"
                    : "درجة النجاح 70% — مطابقة لمعايير الامتحان الحقيقي"
                  }
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[#0A6B5A] shrink-0 mt-0.5" />
                  {lang === "en"
                    ? "Review your performance by objective after submission"
                    : "راجع أدائك حسب الهدف بعد التقديم"
                  }
                </li>
              </ul>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStart}
              disabled={generateExam.isPending}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-lg tracking-wide hover:bg-[#B8962E] transition-all duration-300 gold-glow-strong disabled:opacity-50"
            >
              {generateExam.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Play className="w-5 h-5" />
              )}
              {generateExam.isPending
                ? (lang === "en" ? "Generating Exam..." : "جارٍ إنشاء الامتحان...")
                : (lang === "en" ? "Start Practice Exam" : "ابدأ الامتحان التدريبي")
              }
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ─── EXAM TAKING VIEW ──────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#001A16]">
      <Navbar />

      <div className="pt-28 pb-20 container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl sm:text-3xl font-bold">
              {lang === "en" ? "Practice Exam" : "الامتحان التدريبي"}
            </h1>
            <p className="text-[#C4B9A8] font-['Work_Sans'] text-sm mt-1">
              {course.title}
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            {timeLeft !== null && (
              <div className={`flex items-center gap-2 px-4 py-2 border ${
                timeLeft < 300 ? "border-red-500/50 text-red-400 animate-pulse" : "border-[#0A6B5A]/50 text-[#E8E0D4]"
              } font-['Montserrat'] text-sm font-bold`}>
                <Clock className="w-4 h-4" />
                {formatTime(timeLeft)}
              </div>
            )}
            <div className="text-[#C4B9A8] font-['Work_Sans'] text-sm">
              {answeredCount}/{totalQuestions} {lang === "en" ? "answered" : "مُجاب"}
            </div>
          </div>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {Array.from({ length: totalPages }, (_, i) => {
            const pageStart = i * QUESTIONS_PER_PAGE;
            const pageEnd = Math.min(pageStart + QUESTIONS_PER_PAGE, totalQuestions);
            const pageAnswered = questions.slice(pageStart, pageEnd).filter(q => answers[String(q.id)]).length;
            const pageTotal = pageEnd - pageStart;
            const allAnswered = pageAnswered === pageTotal;
            return (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                className={`px-3 py-1.5 font-['Montserrat'] text-xs font-bold transition-all shrink-0 ${
                  currentPage === i
                    ? "bg-[#D4AF37] text-[#001A16]"
                    : allAnswered
                      ? "bg-[#0A6B5A]/30 text-[#D4AF37] border border-[#0A6B5A]/50"
                      : "bg-[#0A3D33]/30 text-[#C4B9A8] border border-[#0A6B5A]/20 hover:border-[#D4AF37]/30"
                }`}
              >
                {pageStart + 1}-{pageEnd}
              </button>
            );
          })}
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-8">
          {pageQuestions.map((q, localIdx) => {
            const globalIdx = currentPage * QUESTIONS_PER_PAGE + localIdx;
            return (
              <div key={q.id} className="bg-[#002F24]/30 border border-[#0A6B5A]/20 p-5 sm:p-6">
                <div className="flex items-start gap-3 mb-4">
                  <span className="bg-[#D4AF37]/10 text-[#D4AF37] font-['Montserrat'] text-xs font-bold px-2.5 py-1 shrink-0">
                    {globalIdx + 1}
                  </span>
                  <div>
                    <p className="text-[#E8E0D4] font-['Work_Sans'] text-sm leading-relaxed">{q.questionText}</p>
                    {q.objective && (
                      <span className="text-[#C4B9A8]/50 font-['Montserrat'] text-xs mt-1 block">
                        {lang === "en" ? "Objective:" : "الهدف:"} {q.objective}
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-2 ml-0 sm:ml-9">
                  {(["A", "B", "C", "D"] as const).map((opt) => {
                    const optKey = `option${opt}` as "optionA" | "optionB" | "optionC" | "optionD";
                    const isSelected = answers[String(q.id)] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => handleAnswer(q.id, opt)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 ${
                          isSelected
                            ? "bg-[#D4AF37]/15 border border-[#D4AF37]/50 text-[#E8E0D4]"
                            : "bg-[#0A3D33]/20 border border-[#0A6B5A]/15 text-[#C4B9A8] hover:border-[#D4AF37]/30 hover:text-[#E8E0D4]"
                        }`}
                      >
                        <span className={`font-['Montserrat'] text-xs font-bold w-6 h-6 flex items-center justify-center shrink-0 ${
                          isSelected ? "bg-[#D4AF37] text-[#001A16]" : "bg-[#0A6B5A]/30 text-[#C4B9A8]"
                        }`}>
                          {opt}
                        </span>
                        <span className="font-['Work_Sans'] text-sm">{q[optKey]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Page Navigation Buttons */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="flex items-center gap-2 px-4 py-2 border border-[#0A6B5A]/50 text-[#C4B9A8] font-['Montserrat'] font-semibold text-sm hover:text-[#E8E0D4] transition-colors disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4" />
            {lang === "en" ? "Previous" : "السابق"}
          </button>
          <span className="text-[#C4B9A8] font-['Work_Sans'] text-sm">
            {lang === "en" ? "Page" : "صفحة"} {currentPage + 1}/{totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage >= totalPages - 1}
            className="flex items-center gap-2 px-4 py-2 border border-[#0A6B5A]/50 text-[#C4B9A8] font-['Montserrat'] font-semibold text-sm hover:text-[#E8E0D4] transition-colors disabled:opacity-30"
          >
            {lang === "en" ? "Next" : "التالي"}
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </button>
        </div>

        {/* Submit Bar */}
        <div className="sticky bottom-0 bg-[#001A16]/95 backdrop-blur-xl border-t border-[#0A6B5A]/30 py-4 -mx-4 px-4 sm:-mx-6 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <span className="text-[#C4B9A8] font-['Work_Sans'] text-sm">
              {answeredCount}/{totalQuestions} {lang === "en" ? "answered" : "مُجاب"}
            </span>
            {showConfirm ? (
              <div className="flex items-center gap-3">
                <span className="text-[#E8E0D4] font-['Work_Sans'] text-sm hidden sm:inline">
                  {answeredCount < totalQuestions
                    ? (lang === "en" ? `${totalQuestions - answeredCount} unanswered. Submit anyway?` : `${totalQuestions - answeredCount} بدون إجابة. هل تريد التقديم؟`)
                    : (lang === "en" ? "Ready to submit?" : "هل أنت مستعد للتقديم؟")
                  }
                </span>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 border border-[#0A6B5A]/50 text-[#C4B9A8] font-['Montserrat'] font-semibold text-sm hover:text-[#E8E0D4] transition-colors"
                >
                  {lang === "en" ? "Cancel" : "إلغاء"}
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitExam.isPending}
                  className="flex items-center gap-2 px-6 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all duration-300 disabled:opacity-50"
                >
                  {submitExam.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {lang === "en" ? "Confirm Submit" : "تأكيد التقديم"}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 px-8 py-3 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all duration-300 gold-glow"
              >
                <FileText className="w-4 h-4" />
                {lang === "en" ? "Submit Exam" : "تقديم الامتحان"}
              </button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
