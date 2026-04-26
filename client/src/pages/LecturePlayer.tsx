/*
  Lecture Player - displays lecture content with Arabic subtitle toggle.
  Luminous Pathway design system.
*/

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Link, useParams, useLocation } from "wouter";
import {
  ArrowLeft, ArrowRight, CheckCircle, BookOpen, FileText,
  Loader2, Languages, ChevronLeft, ChevronRight,
  GraduationCap, List, Download, Presentation
} from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Streamdown } from "streamdown";
import MiniGameMapper from "@/components/minigames/MiniGameMapper";

export default function LecturePlayer() {
  const { slug, lectureId } = useParams<{ slug: string; lectureId: string }>();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { lang } = useLanguage();
  const [, setLocation] = useLocation();
  const [showArabic, setShowArabic] = useState(false);
  // Global site is English-only, no Arabic toggle needed
  const [activeTab, setActiveTab] = useState<"content" | "study-guide" | "glossary">("content");
  const lecId = parseInt(lectureId || "0", 10);

  const { data: lectureData, isLoading: lectureLoading } = trpc.lecture.get.useQuery(
    { lectureId: lecId },
    { enabled: lecId > 0 && isAuthenticated }
  );

  const { data: courseData } = trpc.course.getBySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  const { data: enrollment } = trpc.enrollment.checkEnrollment.useQuery(
    { courseId: courseData?.course?.id ?? 0 },
    { enabled: isAuthenticated && !!courseData?.course?.id }
  );

  const { data: progressData } = trpc.lecture.progress.useQuery(
    { courseId: courseData?.course?.id ?? 0 },
    { enabled: isAuthenticated && !!enrollment && !!courseData?.course?.id }
  );

  const markComplete = trpc.lecture.markComplete.useMutation({
    onSuccess: () => {
      utils.lecture.progress.invalidate();
    }
  });

  const utils = trpc.useUtils();

  // Slide download tracking
  const courseIdForDownloads = courseData?.course?.id ?? 0;
  const { data: slideDownloads } = trpc.slideDownload.forCourse.useQuery(
    { courseId: courseIdForDownloads },
    { enabled: isAuthenticated && courseIdForDownloads > 0 }
  );
  const recordDownload = trpc.slideDownload.record.useMutation({
    onSuccess: () => {
      utils.slideDownload.forCourse.invalidate({ courseId: courseIdForDownloads });
    }
  });

  const isSlideDownloaded = useMemo(() => {
    if (!slideDownloads) return false;
    return slideDownloads.some(d => d.lectureId === lecId);
  }, [slideDownloads, lecId]);

  // Lab completion tracking
  const { data: labCompletions } = trpc.labCompletion.forCourse.useQuery(
    { courseId: courseIdForDownloads },
    { enabled: isAuthenticated && courseIdForDownloads > 0 }
  );
  const recordLabComplete = trpc.labCompletion.record.useMutation({
    onSuccess: () => {
      utils.labCompletion.forCourse.invalidate({ courseId: courseIdForDownloads });
    }
  });

  const isLabCompleted = useMemo(() => {
    if (!labCompletions) return false;
    return labCompletions.some(lc => lc.lectureId === lecId);
  }, [labCompletions, lecId]);

  const handleLabComplete = useCallback((score?: number) => {
    if (!courseData?.course?.id || !lecId || isLabCompleted) return;
    recordLabComplete.mutate({ lectureId: lecId, courseId: courseData.course.id, score });
  }, [lecId, courseData?.course?.id, isLabCompleted]);

  const handleSlideDownload = useCallback(() => {
    if (!courseData?.course?.id || !lecId) return;
    recordDownload.mutate({ lectureId: lecId, courseId: courseData.course.id });
  }, [lecId, courseData?.course?.id]);

  // Find prev/next lectures
  const allLectures = courseData?.lectures || [];
  const currentIdx = allLectures.findIndex(l => l.id === lecId);
  const prevLecture = currentIdx > 0 ? allLectures[currentIdx - 1] : null;
  const nextLecture = currentIdx < allLectures.length - 1 ? allLectures[currentIdx + 1] : null;

  const isComplete = useMemo(() => {
    if (!progressData?.progress) return false;
    return progressData.progress.some(p => p.lectureId === lecId && p.completed);
  }, [progressData, lecId]);

  const handleMarkComplete = useCallback(() => {
    if (!courseData?.course?.id || !lecId) return;
    markComplete.mutate({ lectureId: lecId, courseId: courseData.course.id });
  }, [lecId, courseData?.course?.id]);

  if (authLoading || lectureLoading) {
    return (
      <div className="min-h-screen bg-[#001A16] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  if (!lectureData) {
    return (
      <div className="min-h-screen bg-[#001A16]">
        <Navbar />
        <div className="pt-32 pb-20 container text-center">
          <h1 className="text-[#E8E0D4] font-['Playfair_Display'] text-3xl font-bold mb-4">
            {lang === "en" ? "Lecture Not Found" : "المحاضرة غير موجودة"}
          </h1>
          <Link href={`/learn/${slug}`} className="text-[#D4AF37] hover:underline">
            {lang === "en" ? "Back to Course" : "العودة إلى الدورة"}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const lecture = lectureData;

  // Determine which content to show - when Arabic is active, show Arabic content as main
  const getContent = () => {
    const useArabic = showArabic && lecture.arabicContent;
    switch (activeTab) {
      case "study-guide":
        return lecture.studyGuideContent || (lang === "en" ? "*Study guide not available for this lecture.*" : "*دليل الدراسة غير متوفر لهذه المحاضرة.*");
      case "glossary":
        return lecture.glossaryContent || (lang === "en" ? "*Glossary not available for this lecture.*" : "*المسرد غير متوفر لهذه المحاضرة.*");
      default:
        return useArabic ? lecture.arabicContent : (lecture.content || "");
    }
  };

  return (
    <div className="min-h-screen bg-[#001A16]">
      <Navbar />

      <div className="pt-28 pb-20">
        <div className="container">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6 flex-wrap">
            <Link href="/dashboard" className="text-[#C4B9A8] hover:text-[#D4AF37] font-['Work_Sans'] transition-colors">
              {lang === "en" ? "Dashboard" : "اللوحة"}
            </Link>
            <ChevronRight className="w-4 h-4 text-[#0A6B5A]" />
            <Link href={`/learn/${slug}`} className="text-[#C4B9A8] hover:text-[#D4AF37] font-['Work_Sans'] transition-colors">
              {courseData?.course?.certCode || slug}
            </Link>
            <ChevronRight className="w-4 h-4 text-[#0A6B5A]" />
            <span className="text-[#D4AF37] font-['Work_Sans']">{lecture.title}</span>
          </div>

          {/* Lecture Header */}
          <div className="bg-[#002F24]/40 border border-[#0A6B5A]/30 p-6 sm:p-8 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl sm:text-3xl font-bold mb-2">
                  {lecture.title}
                </h1>
                {lecture.durationMinutes && (
                  <span className="text-[#C4B9A8] font-['Work_Sans'] text-sm">
                    {lecture.durationMinutes} {lang === "en" ? "minutes" : "دقيقة"}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {/* Arabic Subtitle Toggle */}
                <button
                  onClick={() => setShowArabic(!showArabic)}
                  className={`flex items-center gap-2 px-4 py-2 border text-sm font-['Montserrat'] font-semibold transition-all duration-300 ${
                    showArabic
                      ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/10"
                      : "border-[#0A6B5A]/50 text-[#C4B9A8] hover:border-[#D4AF37]/50 hover:text-[#D4AF37]"
                  }`}
                >
                  <Languages className="w-4 h-4" />
                  {showArabic ? "العربية ✓" : "العربية"}
                </button>

                {/* Mark Complete */}
                {!isComplete ? (
                  <button
                    onClick={handleMarkComplete}
                    disabled={markComplete.isPending}
                    className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all duration-300 disabled:opacity-50"
                  >
                    {markComplete.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4" />
                    )}
                    {lang === "en" ? "Mark Complete" : "إكمال"}
                  </button>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2 bg-[#0A6B5A]/30 text-[#D4AF37] font-['Montserrat'] font-bold text-sm">
                    <CheckCircle className="w-4 h-4" />
                    {lang === "en" ? "Completed" : "مكتمل"}
                  </div>
                )}
              </div>
            </div>
          </div>


          {/* Audio Player & Slide Download */}
          {(lecture.audioUrl || lecture.slideUrl) && (
            <div className="bg-[#002F24]/40 border border-[#0A6B5A]/30 p-4 sm:p-6 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {lecture.audioUrl && (
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[#D4AF37] font-['Montserrat'] text-xs font-bold tracking-wide uppercase">
                        {lang === "en" ? "Audio Narration" : "السرد الصوتي"}
                      </span>
                    </div>
                    <audio
                      controls
                      className="w-full h-10"
                      style={{ filter: 'sepia(20%) saturate(70%) brightness(90%)' }}
                    >
                      <source src={lecture.audioUrl} type="audio/mpeg" />
                    </audio>
                  </div>
                )}
                {lecture.slideUrl && (
                  <a
                    href={lecture.slideUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleSlideDownload}
                    className={`flex items-center gap-2 px-5 py-3 border font-['Montserrat'] font-semibold text-sm transition-all duration-300 shrink-0 ${
                      isSlideDownloaded
                        ? "border-[#0A6B5A] text-[#0A6B5A] bg-[#0A6B5A]/10"
                        : "border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10"
                    }`}
                  >
                    <Presentation className="w-4 h-4" />
                    {isSlideDownloaded ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    {isSlideDownloaded
                      ? (lang === "en" ? "Downloaded" : "تم التحميل")
                      : (lang === "en" ? "Download Slides" : "تحميل الشرائح")
                    }
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Content Tabs */}
          <div className="flex gap-1 mb-6 bg-[#002F24]/30 p-1 border border-[#0A6B5A]/20 overflow-x-auto">
            <button
              onClick={() => setActiveTab("content")}
              className={`flex items-center gap-2 px-5 py-2.5 font-['Montserrat'] text-sm font-semibold transition-all shrink-0 ${
                activeTab === "content"
                  ? "bg-[#D4AF37] text-[#001A16]"
                  : "text-[#C4B9A8] hover:text-[#D4AF37]"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              {lang === "en" ? "Lecture" : "المحاضرة"}
            </button>
            <button
              onClick={() => setActiveTab("study-guide")}
              className={`flex items-center gap-2 px-5 py-2.5 font-['Montserrat'] text-sm font-semibold transition-all shrink-0 ${
                activeTab === "study-guide"
                  ? "bg-[#D4AF37] text-[#001A16]"
                  : "text-[#C4B9A8] hover:text-[#D4AF37]"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              {lang === "en" ? "Study Guide" : "دليل الدراسة"}
            </button>
            <button
              onClick={() => setActiveTab("glossary")}
              className={`flex items-center gap-2 px-5 py-2.5 font-['Montserrat'] text-sm font-semibold transition-all shrink-0 ${
                activeTab === "glossary"
                  ? "bg-[#D4AF37] text-[#001A16]"
                  : "text-[#C4B9A8] hover:text-[#D4AF37]"
              }`}
            >
              <List className="w-4 h-4" />
              {lang === "en" ? "Glossary" : "المسرد"}
            </button>
          </div>

          {/* Arabic/English indicator banner */}
          {showArabic && lecture.arabicContent && activeTab === "content" && (
            <div className="flex items-center gap-2 mb-4 px-4 py-2 bg-[#0A3D33]/30 border border-[#D4AF37]/20">
              <Languages className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[#D4AF37] font-['Work_Sans'] text-sm font-bold">
                {lang === "en" ? "Viewing in Arabic" : "العرض باللغة العربية"}
              </span>
            </div>
          )}

          {/* Main Content */}
          <div className={`bg-[#002F24]/20 border border-[#0A6B5A]/15 p-6 sm:p-8 mb-8 ${showArabic && activeTab === "content" ? "text-right" : ""}`} dir={showArabic && activeTab === "content" ? "rtl" : "ltr"}>
            <div className="prose prose-invert max-w-none
              prose-headings:font-['Playfair_Display'] prose-headings:text-[#E8E0D4]
              prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
              prose-p:text-[#C4B9A8] prose-p:font-['Work_Sans'] prose-p:leading-relaxed
              prose-strong:text-[#D4AF37]
              prose-li:text-[#C4B9A8] prose-li:font-['Work_Sans']
              prose-a:text-[#D4AF37] prose-a:no-underline hover:prose-a:underline
              prose-code:text-[#D4AF37] prose-code:bg-[#0A3D33]/50 prose-code:px-1.5 prose-code:py-0.5
              prose-table:border-[#0A6B5A]/30
              prose-th:text-[#D4AF37] prose-th:font-['Montserrat'] prose-th:border-[#0A6B5A]/30
              prose-td:text-[#C4B9A8] prose-td:font-['Work_Sans'] prose-td:border-[#0A6B5A]/20
              prose-hr:border-[#0A6B5A]/30
              prose-blockquote:border-[#D4AF37]/50 prose-blockquote:text-[#C4B9A8]
            ">
              <Streamdown>{getContent()}</Streamdown>
            </div>
          </div>

          {/* Interactive Mini-Game */}
          {activeTab === "content" && slug && (
            <div className="relative">
              {isLabCompleted && (
                <div className="flex items-center gap-2 mb-3 px-4 py-2 bg-[#0A6B5A]/20 border border-[#0A6B5A]/40">
                  <CheckCircle className="w-4 h-4 text-[#0A6B5A]" />
                  <span className="text-[#0A6B5A] font-['Montserrat'] text-sm font-bold">
                    {lang === "en" ? "Lab Completed" : "تم إكمال المختبر"}
                  </span>
                </div>
              )}
              <MiniGameMapper lectureTitle={lecture.title} courseSlug={slug} onLabComplete={handleLabComplete} />
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center gap-4">
            {prevLecture ? (
              <Link
                href={`/learn/${slug}/lecture/${prevLecture.id}`}
                className="flex items-center gap-2 px-5 py-3 border border-[#0A6B5A]/50 text-[#C4B9A8] hover:border-[#D4AF37]/50 hover:text-[#D4AF37] font-['Montserrat'] font-semibold text-sm transition-all duration-300"
              >
                <ChevronLeft className="w-4 h-4" />
                {lang === "en" ? "Previous" : "السابق"}
              </Link>
            ) : (
              <div />
            )}
            {nextLecture ? (
              <Link
                href={`/learn/${slug}/lecture/${nextLecture.id}`}
                className="flex items-center gap-2 px-5 py-3 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all duration-300 gold-glow"
              >
                {lang === "en" ? "Next Lecture" : "المحاضرة التالية"}
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link
                href={`/learn/${slug}`}
                className="flex items-center gap-2 px-5 py-3 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all duration-300 gold-glow"
              >
                {lang === "en" ? "Back to Course" : "العودة إلى الدورة"}
              </Link>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
