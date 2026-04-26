/*
  StudyPlanner page - Personalized study recommendations based on quiz performance.
  Analyzes weak objectives and recommends specific lectures to revisit.
*/

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Link, useParams } from "wouter";
import {
  ArrowLeft, Target, BookOpen, Brain, AlertTriangle,
  CheckCircle, XCircle, TrendingUp, Loader2, Beaker,
  BarChart3, ChevronDown, ChevronRight, Lightbulb, Play
} from "lucide-react";
import { useState } from "react";

type WeakArea = {
  objective: string;
  accuracy: number;
  correct: number;
  total: number;
  wrongCount: number;
  status: "strong" | "moderate" | "weak";
  recommendedLectures: Array<{
    id: number;
    title: string;
    moduleTitle: string;
    completed: boolean;
    labDone: boolean;
  }>;
};

type StudyPlanItem = {
  priority: number;
  objective: string;
  accuracy: number;
  status: "moderate" | "weak";
  recommendedLectures: WeakArea["recommendedLectures"];
  actionItems: string[];
};

type AnalysisData = {
  hasData: boolean;
  totalAttempts: number;
  overallAccuracy: number;
  totalAnswered: number;
  totalCorrect: number;
  weakCount: number;
  moderateCount: number;
  strongCount: number;
  weakAreas: WeakArea[];
  studyPlan: StudyPlanItem[];
};

export default function StudyPlanner() {
  const { slug } = useParams<{ slug: string }>();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { lang } = useLanguage();
  const isAr = false; // Global site is English-only
  const [expandedObjectives, setExpandedObjectives] = useState<Set<string>>(new Set());

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

  const { data: analysis, isLoading: analysisLoading } = trpc.studyPlanner.analyze.useQuery(
    { courseId },
    { enabled: isAuthenticated && isEnrolled && courseId > 0 }
  ) as { data: AnalysisData | null | undefined; isLoading: boolean };

  const course = courseData?.course;

  const toggleObjective = (obj: string) => {
    setExpandedObjectives(prev => {
      const next = new Set(prev);
      if (next.has(obj)) next.delete(obj);
      else next.add(obj);
      return next;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "weak": return "text-red-400";
      case "moderate": return "text-yellow-400";
      case "strong": return "text-emerald-400";
      default: return "text-muted-foreground";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "weak": return "bg-red-500/20 border-red-500/30";
      case "moderate": return "bg-yellow-500/20 border-yellow-500/30";
      case "strong": return "bg-emerald-500/20 border-emerald-500/30";
      default: return "bg-muted/20 border-border";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "weak": return <XCircle className="w-5 h-5 text-red-400" />;
      case "moderate": return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case "strong": return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      default: return null;
    }
  };

  const getAccuracyBarColor = (accuracy: number) => {
    if (accuracy >= 80) return "bg-emerald-500";
    if (accuracy >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (authLoading || courseLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-gold" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isAr ? "rtl" : "ltr"}>
      <Navbar />

      <main className="container max-w-5xl mx-auto px-4 py-8 pt-24">
        {/* Back navigation */}
        <Link href={`/learn/${slug}`}>
          <span className="inline-flex items-center gap-2 text-gold hover:text-gold/80 mb-6 cursor-pointer transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {isAr ? "العودة إلى المقرر" : "Back to Course"}
          </span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="w-8 h-8 text-gold" />
            <h1 className="text-3xl font-bold font-[Playfair_Display]">
              {isAr ? "مخطط الدراسة الذكي" : "Smart Study Planner"}
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            {course?.title} — {isAr
              ? "تحليل شخصي لنقاط القوة والضعف بناءً على أدائك في الاختبارات"
              : "Personalized analysis of your strengths and weaknesses based on quiz performance"}
          </p>
        </div>

        {/* No data state */}
        {(!analysis || !analysis.hasData) && !analysisLoading && (
          <div className="bg-emerald-mid/30 border border-gold/20 rounded-xl p-12 text-center">
            <BarChart3 className="w-16 h-16 text-gold/40 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-3 font-[Playfair_Display]">
              {isAr ? "لا توجد بيانات بعد" : "No Data Yet"}
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              {isAr
                ? "أكمل اختبارًا واحدًا على الأقل أو امتحانًا تدريبيًا لتحصل على خطة دراسة مخصصة."
                : "Complete at least one quiz or practice exam to get your personalized study plan."}
            </p>
            <div className="flex gap-4 justify-center">
              <Link href={`/learn/${slug}/quizzes`}>
                <span className="inline-flex items-center gap-2 bg-gold text-emerald-deep px-6 py-3 rounded-lg font-semibold hover:bg-gold/90 transition-colors cursor-pointer">
                  <Target className="w-5 h-5" />
                  {isAr ? "ابدأ اختبارًا" : "Take a Quiz"}
                </span>
              </Link>
              <Link href={`/learn/${slug}/practice-exam`}>
                <span className="inline-flex items-center gap-2 border border-gold/40 text-gold px-6 py-3 rounded-lg font-semibold hover:bg-gold/10 transition-colors cursor-pointer">
                  <Brain className="w-5 h-5" />
                  {isAr ? "امتحان تدريبي" : "Practice Exam"}
                </span>
              </Link>
            </div>
          </div>
        )}

        {/* Loading state */}
        {analysisLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-10 h-10 animate-spin text-gold mx-auto mb-4" />
              <p className="text-muted-foreground">{isAr ? "جارٍ تحليل أدائك..." : "Analyzing your performance..."}</p>
            </div>
          </div>
        )}

        {/* Analysis results */}
        {analysis && analysis.hasData && (
          <div className="space-y-8">
            {/* Overview cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-emerald-mid/30 border border-gold/20 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-gold">{analysis.overallAccuracy}%</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {isAr ? "الدقة الإجمالية" : "Overall Accuracy"}
                </div>
              </div>
              <div className="bg-emerald-mid/30 border border-gold/20 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-foreground">{analysis.totalAttempts}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {isAr ? "المحاولات" : "Attempts"}
                </div>
              </div>
              <div className="bg-emerald-mid/30 border border-gold/20 rounded-xl p-5 text-center">
                <div className="text-3xl font-bold text-foreground">
                  {analysis.totalCorrect}/{analysis.totalAnswered}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {isAr ? "الإجابات الصحيحة" : "Correct Answers"}
                </div>
              </div>
              <div className="bg-emerald-mid/30 border border-gold/20 rounded-xl p-5 text-center">
                <div className="flex justify-center gap-3">
                  <span className="text-emerald-400 font-bold">{analysis.strongCount}</span>
                  <span className="text-yellow-400 font-bold">{analysis.moderateCount}</span>
                  <span className="text-red-400 font-bold">{analysis.weakCount}</span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {isAr ? "قوي / متوسط / ضعيف" : "Strong / Moderate / Weak"}
                </div>
              </div>
            </div>

            {/* Study Plan - Priority recommendations */}
            {analysis.studyPlan.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Lightbulb className="w-6 h-6 text-gold" />
                  <h2 className="text-2xl font-bold font-[Playfair_Display]">
                    {isAr ? "خطة الدراسة المقترحة" : "Recommended Study Plan"}
                  </h2>
                </div>
                <p className="text-muted-foreground mb-6">
                  {isAr
                    ? "ركز على هذه المجالات أولاً لتحسين درجاتك بشكل أسرع."
                    : "Focus on these areas first to improve your score the fastest."}
                </p>

                <div className="space-y-4">
                  {analysis.studyPlan.map((item: StudyPlanItem) => (
                    <div
                      key={item.objective}
                      className={`border rounded-xl p-5 ${getStatusBg(item.status)}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gold/20 text-gold font-bold text-sm">
                            {item.priority}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {isAr ? `الهدف ${item.objective}` : `Objective ${item.objective}`}
                            </h3>
                            <span className={`text-sm ${getStatusColor(item.status)}`}>
                              {item.accuracy}% {isAr ? "دقة" : "accuracy"} — {
                                item.status === "weak"
                                  ? (isAr ? "يحتاج تحسين" : "Needs Improvement")
                                  : (isAr ? "متوسط" : "Moderate")
                              }
                            </span>
                          </div>
                        </div>
                        {getStatusIcon(item.status)}
                      </div>

                      {/* Recommended lectures */}
                      {item.recommendedLectures.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <p className="text-sm font-medium text-muted-foreground mb-2">
                            {isAr ? "المحاضرات الموصى بها:" : "Recommended Lectures:"}
                          </p>
                          {item.recommendedLectures.map(lec => (
                            <Link key={lec.id} href={`/learn/${slug}/lecture/${lec.id}`}>
                              <div className="flex items-center gap-3 p-3 rounded-lg bg-background/30 hover:bg-background/50 cursor-pointer transition-colors group">
                                <Play className="w-4 h-4 text-gold group-hover:scale-110 transition-transform" />
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{lec.title}</div>
                                  <div className="text-xs text-muted-foreground">{lec.moduleTitle}</div>
                                </div>
                                <div className="flex gap-2">
                                  {lec.completed ? (
                                    <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                                      {isAr ? "مكتمل" : "Reviewed"}
                                    </span>
                                  ) : (
                                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">
                                      {isAr ? "لم يُراجع" : "Not Reviewed"}
                                    </span>
                                  )}
                                  {lec.labDone ? (
                                    <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                                      <Beaker className="w-3 h-3 inline" /> {isAr ? "مختبر" : "Lab"}
                                    </span>
                                  ) : (
                                    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded">
                                      <Beaker className="w-3 h-3 inline" /> {isAr ? "مختبر" : "Lab"}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}

                      {/* Action items */}
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <p className="text-xs text-muted-foreground mb-1">
                          {isAr ? "خطوات العمل:" : "Action Items:"}
                        </p>
                        <ul className="space-y-1">
                          {item.actionItems.map((action: string, i: number) => (
                            <li key={i} className="text-sm flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Full Objective Breakdown */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="w-6 h-6 text-gold" />
                <h2 className="text-2xl font-bold font-[Playfair_Display]">
                  {isAr ? "تحليل جميع الأهداف" : "Full Objective Breakdown"}
                </h2>
              </div>

              <div className="space-y-2">
                {analysis.weakAreas.map((area: WeakArea) => (
                  <div
                    key={area.objective}
                    className="border border-border/30 rounded-lg overflow-hidden"
                  >
                    <button
                      onClick={() => toggleObjective(area.objective)}
                      className="w-full flex items-center gap-3 p-4 hover:bg-emerald-mid/20 transition-colors text-left"
                    >
                      {getStatusIcon(area.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {isAr ? `الهدف ${area.objective}` : `Objective ${area.objective}`}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded ${getStatusBg(area.status)} ${getStatusColor(area.status)}`}>
                            {area.status === "weak" ? (isAr ? "ضعيف" : "Weak")
                              : area.status === "moderate" ? (isAr ? "متوسط" : "Moderate")
                              : (isAr ? "قوي" : "Strong")}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex-1 h-2 bg-background/30 rounded-full overflow-hidden max-w-xs">
                            <div
                              className={`h-full rounded-full transition-all ${getAccuracyBarColor(area.accuracy)}`}
                              style={{ width: `${area.accuracy}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {area.accuracy}% ({area.correct}/{area.total})
                          </span>
                        </div>
                      </div>
                      {expandedObjectives.has(area.objective) ? (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>

                    {expandedObjectives.has(area.objective) && area.recommendedLectures.length > 0 && (
                      <div className="px-4 pb-4 space-y-2 border-t border-border/20 pt-3">
                        <p className="text-sm text-muted-foreground">
                          {isAr ? "المحاضرات ذات الصلة:" : "Related Lectures:"}
                        </p>
                        {area.recommendedLectures.map(lec => (
                          <Link key={lec.id} href={`/learn/${slug}/lecture/${lec.id}`}>
                            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-emerald-mid/20 cursor-pointer transition-colors">
                              <BookOpen className="w-4 h-4 text-gold" />
                              <span className="text-sm">{lec.title}</span>
                              <span className="text-xs text-muted-foreground ml-auto">{lec.moduleTitle}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick actions */}
            <div className="bg-emerald-mid/20 border border-gold/20 rounded-xl p-6">
              <h3 className="text-lg font-bold mb-4 font-[Playfair_Display]">
                {isAr ? "إجراءات سريعة" : "Quick Actions"}
              </h3>
              <div className="flex flex-wrap gap-3">
                <Link href={`/learn/${slug}/practice-exam`}>
                  <span className="inline-flex items-center gap-2 bg-gold text-emerald-deep px-5 py-2.5 rounded-lg font-semibold hover:bg-gold/90 transition-colors cursor-pointer">
                    <Brain className="w-4 h-4" />
                    {isAr ? "امتحان تدريبي جديد" : "New Practice Exam"}
                  </span>
                </Link>
                <Link href={`/learn/${slug}/quizzes`}>
                  <span className="inline-flex items-center gap-2 border border-gold/40 text-gold px-5 py-2.5 rounded-lg font-semibold hover:bg-gold/10 transition-colors cursor-pointer">
                    <Target className="w-4 h-4" />
                    {isAr ? "اختبارات الوحدات" : "Module Quizzes"}
                  </span>
                </Link>
                <Link href={`/learn/${slug}`}>
                  <span className="inline-flex items-center gap-2 border border-border/40 text-foreground px-5 py-2.5 rounded-lg font-semibold hover:bg-emerald-mid/30 transition-colors cursor-pointer">
                    <BookOpen className="w-4 h-4" />
                    {isAr ? "محتوى المقرر" : "Course Content"}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
