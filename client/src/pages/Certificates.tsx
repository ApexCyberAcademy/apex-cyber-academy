/*
  Certificates Page - displays earned certificates with download links and badge showcase.
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
  Award, Download, Shield, ExternalLink, Loader2,
  Trophy, Star, Zap, BookOpen, Brain, CheckCircle
} from "lucide-react";

const BADGE_COLORS: Record<string, string> = {
  course_complete: "from-[#D4AF37] to-[#B8962E]",
  perfect_score: "from-[#FF6B6B] to-[#EE5A24]",
  speed_demon: "from-[#6C5CE7] to-[#A29BFE]",
  all_lectures: "from-[#0A6B5A] to-[#00B894]",
  quiz_master: "from-[#0984E3] to-[#74B9FF]",
  honor_roll: "from-[#FDCB6E] to-[#F39C12]",
};

const BADGE_ICONS: Record<string, React.ReactNode> = {
  course_complete: <Award className="w-6 h-6" />,
  perfect_score: <Star className="w-6 h-6" />,
  speed_demon: <Zap className="w-6 h-6" />,
  all_lectures: <BookOpen className="w-6 h-6" />,
  quiz_master: <Brain className="w-6 h-6" />,
  honor_roll: <Trophy className="w-6 h-6" />,
};

export default function Certificates() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { lang } = useLanguage();

  const { data: certificates, isLoading: certsLoading } = trpc.credential.myCertificates.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  const { data: allBadges, isLoading: badgesLoading } = trpc.credential.myBadges.useQuery(
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
            <Award className="w-16 h-16 text-[#D4AF37] mx-auto mb-6" />
            <h1 className="text-[#E8E0D4] font-['Playfair_Display'] text-3xl font-bold mb-4">
              {lang === "en" ? "Sign In to View Credentials" : "سجّل الدخول لعرض الشهادات"}
            </h1>
            <p className="text-[#C4B9A8] font-['Work_Sans'] text-base mb-8">
              {lang === "en"
                ? "View your earned certificates and achievement badges."
                : "عرض الشهادات والأوسمة المكتسبة."
              }
            </p>
            <button
              onClick={() => { window.location.href = getLoginUrl(); }}
              className="px-8 py-4 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-base tracking-wide hover:bg-[#B8962E] transition-all duration-300"
            >
              {lang === "en" ? "Sign In" : "تسجيل الدخول"}
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isLoading = certsLoading || badgesLoading;

  return (
    <div className="min-h-screen bg-[#001A16]">
      <Navbar />

      <div className="pt-28 pb-20 container">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-8 h-8 text-[#D4AF37]" />
            <h1 className="text-[#E8E0D4] font-['Playfair_Display'] text-3xl sm:text-4xl font-bold">
              {lang === "en" ? "My Credentials" : "شهاداتي"}
            </h1>
          </div>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-base">
            {lang === "en"
              ? "Your earned certificates and achievement badges"
              : "الشهادات والأوسمة المكتسبة"
            }
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
          </div>
        ) : (
          <>
            {/* ─── CERTIFICATES SECTION ──────────────────────────── */}
            <div className="mb-12">
              <h2 className="text-[#D4AF37] font-['Montserrat'] text-sm font-bold tracking-widest uppercase mb-6">
                {lang === "en" ? "Certificates" : "الشهادات"}
              </h2>

              {!certificates || certificates.length === 0 ? (
                <div className="bg-[#002F24]/40 border border-[#0A6B5A]/30 p-8 text-center">
                  <Shield className="w-12 h-12 text-[#0A6B5A] mx-auto mb-4" />
                  <h3 className="text-[#E8E0D4] font-['Playfair_Display'] text-xl font-bold mb-2">
                    {lang === "en" ? "No Certificates Yet" : "لا توجد شهادات بعد"}
                  </h3>
                  <p className="text-[#C4B9A8] font-['Work_Sans'] text-sm max-w-md mx-auto mb-4">
                    {lang === "en"
                      ? "Pass the final exam with 80% or higher to earn your completion certificate."
                      : "اجتز الامتحان النهائي بنسبة 80% أو أعلى للحصول على شهادة الإتمام."
                    }
                  </p>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-[#D4AF37] font-['Montserrat'] text-sm font-bold hover:underline"
                  >
                    {lang === "en" ? "Go to Dashboard" : "الذهاب إلى لوحة التحكم"}
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="grid gap-6">
                  {certificates.map((cert) => (
                    <div
                      key={cert.id}
                      className="bg-[#002F24]/40 border border-[#D4AF37]/30 p-6 sm:p-8 relative overflow-hidden"
                    >
                      {/* Gold accent stripe */}
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#D4AF37] via-[#B8962E] to-[#D4AF37]" />

                      <div className="flex flex-col lg:flex-row gap-6 items-start">
                        {/* Certificate Icon */}
                        <div className="w-20 h-20 bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
                          <Award className="w-10 h-10 text-[#D4AF37]" />
                        </div>

                        {/* Certificate Details */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CheckCircle className="w-4 h-4 text-[#00B894]" />
                            <span className="text-[#00B894] font-['Montserrat'] text-xs font-bold tracking-wide uppercase">
                              {lang === "en" ? "Verified Certificate" : "شهادة موثقة"}
                            </span>
                          </div>
                          <h3 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-1">
                            {cert.courseTitle}
                          </h3>
                          {cert.certCode && (
                            <p className="text-[#D4AF37] font-['Montserrat'] text-sm font-bold mb-2">
                              {lang === "en" ? "Exam Code:" : "رمز الامتحان:"} {cert.certCode}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-4 text-[#C4B9A8] font-['Work_Sans'] text-sm">
                            <span>
                              {lang === "en" ? "Certificate #:" : "رقم الشهادة:"}{" "}
                              <span className="text-[#E8E0D4] font-bold">{cert.certificateNumber}</span>
                            </span>
                            <span>
                              {lang === "en" ? "Score:" : "النتيجة:"}{" "}
                              <span className="text-[#D4AF37] font-bold">{cert.score}%</span>
                              {cert.score >= 90 && (
                                <span className="ml-1 text-[#FDCB6E] text-xs">
                                  ({lang === "en" ? "With Distinction" : "بامتياز"})
                                </span>
                              )}
                            </span>
                            <span>
                              {lang === "en" ? "Issued:" : "صدرت في:"}{" "}
                              <span className="text-[#E8E0D4]">
                                {new Date(cert.issuedAt).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </span>
                            </span>
                          </div>
                        </div>

                        {/* Download Button */}
                        <div className="flex flex-col gap-2 shrink-0">
                          {cert.pdfUrl && (
                            <a
                              href={cert.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm tracking-wide hover:bg-[#B8962E] transition-all duration-300"
                            >
                              <Download className="w-4 h-4" />
                              {lang === "en" ? "Download PDF" : "تحميل PDF"}
                            </a>
                          )}
                          <Link
                            href={`/verify/${cert.certificateNumber}`}
                            className="flex items-center justify-center gap-2 px-6 py-3 border border-[#0A6B5A]/50 text-[#E8E0D4] font-['Montserrat'] font-semibold text-sm hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-all duration-300"
                          >
                            <ExternalLink className="w-4 h-4" />
                            {lang === "en" ? "Verify" : "تحقق"}
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ─── BADGES SECTION ────────────────────────────────── */}
            <div>
              <h2 className="text-[#D4AF37] font-['Montserrat'] text-sm font-bold tracking-widest uppercase mb-6">
                {lang === "en" ? "Achievement Badges" : "أوسمة الإنجاز"}
              </h2>

              {!allBadges || allBadges.length === 0 ? (
                <div className="bg-[#002F24]/40 border border-[#0A6B5A]/30 p-8 text-center">
                  <Trophy className="w-12 h-12 text-[#0A6B5A] mx-auto mb-4" />
                  <h3 className="text-[#E8E0D4] font-['Playfair_Display'] text-xl font-bold mb-2">
                    {lang === "en" ? "No Badges Yet" : "لا توجد أوسمة بعد"}
                  </h3>
                  <p className="text-[#C4B9A8] font-['Work_Sans'] text-sm max-w-md mx-auto">
                    {lang === "en"
                      ? "Complete courses, ace quizzes, and achieve milestones to earn badges."
                      : "أكمل الدورات واجتز الاختبارات وحقق الإنجازات لكسب الأوسمة."
                    }
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className="bg-[#002F24]/40 border border-[#0A6B5A]/30 p-5 hover:border-[#D4AF37]/30 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${BADGE_COLORS[badge.badgeType] || "from-[#0A6B5A] to-[#00B894]"} flex items-center justify-center text-white shrink-0`}>
                          {BADGE_ICONS[badge.badgeType] || <Star className="w-6 h-6" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">{badge.iconEmoji}</span>
                            <h3 className="text-[#E8E0D4] font-['Montserrat'] text-sm font-bold">
                              {badge.title}
                            </h3>
                          </div>
                          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs leading-relaxed mb-2">
                            {badge.description}
                          </p>
                          <span className="text-[#0A6B5A] font-['Work_Sans'] text-xs">
                            {new Date(badge.earnedAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
