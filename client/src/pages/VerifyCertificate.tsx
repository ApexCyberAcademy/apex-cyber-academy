/*
  Certificate Verification Page - public page to verify certificate authenticity.
  Accessible at /verify/:certificateNumber
*/

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { useRoute } from "wouter";
import { Award, CheckCircle, XCircle, Loader2, Shield } from "lucide-react";
import { useMemo } from "react";

export default function VerifyCertificate() {
  const { lang } = useLanguage();
  const [, params] = useRoute("/verify/:certificateNumber");
  const certNumber = params?.certificateNumber || "";

  const stableInput = useMemo(() => ({ certificateNumber: certNumber }), [certNumber]);

  const { data: verification, isLoading, error } = trpc.credential.verify.useQuery(
    stableInput,
    { enabled: !!certNumber }
  );

  return (
    <div className="min-h-screen bg-[#001A16]">
      <Navbar />

      <div className="pt-32 pb-20 container">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <Shield className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
            <h1 className="text-[#E8E0D4] font-['Playfair_Display'] text-3xl font-bold mb-2">
              {lang === "en" ? "Certificate Verification" : "التحقق من الشهادة"}
            </h1>
            <p className="text-[#C4B9A8] font-['Work_Sans'] text-sm">
              {lang === "en"
                ? `Verifying certificate: ${certNumber}`
                : `التحقق من الشهادة: ${certNumber}`
              }
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-[#002F24]/40 border border-red-500/30 p-8 text-center">
              <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-[#E8E0D4] font-['Playfair_Display'] text-xl font-bold mb-2">
                {lang === "en" ? "Verification Error" : "خطأ في التحقق"}
              </h2>
              <p className="text-[#C4B9A8] font-['Work_Sans'] text-sm">
                {lang === "en"
                  ? "An error occurred while verifying this certificate. Please try again."
                  : "حدث خطأ أثناء التحقق من هذه الشهادة. يرجى المحاولة مرة أخرى."
                }
              </p>
            </div>
          ) : !verification ? (
            <div className="bg-[#002F24]/40 border border-red-500/30 p-8 text-center">
              <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-[#E8E0D4] font-['Playfair_Display'] text-xl font-bold mb-2">
                {lang === "en" ? "Certificate Not Found" : "الشهادة غير موجودة"}
              </h2>
              <p className="text-[#C4B9A8] font-['Work_Sans'] text-sm max-w-md mx-auto">
                {lang === "en"
                  ? "This certificate number could not be verified. Please check the number and try again."
                  : "لم يتم التحقق من رقم الشهادة هذا. يرجى التحقق من الرقم والمحاولة مرة أخرى."
                }
              </p>
            </div>
          ) : (
            <div className="bg-[#002F24]/40 border border-[#00B894]/30 p-8 relative overflow-hidden">
              {/* Green verified stripe */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00B894] via-[#0A6B5A] to-[#00B894]" />

              {/* Verified badge */}
              <div className="flex items-center justify-center gap-3 mb-8">
                <CheckCircle className="w-8 h-8 text-[#00B894]" />
                <span className="text-[#00B894] font-['Montserrat'] text-lg font-bold tracking-wide uppercase">
                  {lang === "en" ? "Verified Authentic" : "شهادة موثقة"}
                </span>
              </div>

              {/* Certificate details */}
              <div className="text-center mb-8">
                <Award className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
                <h2 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-1">
                  {lang === "en" ? "Certificate of Completion" : "شهادة إتمام"}
                </h2>
                <p className="text-[#C4B9A8] font-['Work_Sans'] text-sm">
                  Apex Cyber Academy
                </p>
              </div>

              <div className="space-y-4 max-w-md mx-auto">
                <div className="flex justify-between items-center border-b border-[#0A6B5A]/20 pb-3">
                  <span className="text-[#C4B9A8] font-['Work_Sans'] text-sm">
                    {lang === "en" ? "Student Name" : "اسم الطالب"}
                  </span>
                  <span className="text-[#E8E0D4] font-['Montserrat'] text-sm font-bold">
                    {verification.studentName}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-[#0A6B5A]/20 pb-3">
                  <span className="text-[#C4B9A8] font-['Work_Sans'] text-sm">
                    {lang === "en" ? "Course" : "الدورة"}
                  </span>
                  <span className="text-[#E8E0D4] font-['Montserrat'] text-sm font-bold">
                    {verification.courseTitle}
                  </span>
                </div>
                {verification.certCode && (
                  <div className="flex justify-between items-center border-b border-[#0A6B5A]/20 pb-3">
                    <span className="text-[#C4B9A8] font-['Work_Sans'] text-sm">
                      {lang === "en" ? "Exam Code" : "رمز الامتحان"}
                    </span>
                    <span className="text-[#D4AF37] font-['Montserrat'] text-sm font-bold">
                      {verification.certCode}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center border-b border-[#0A6B5A]/20 pb-3">
                  <span className="text-[#C4B9A8] font-['Work_Sans'] text-sm">
                    {lang === "en" ? "Score" : "النتيجة"}
                  </span>
                  <span className="text-[#D4AF37] font-['Montserrat'] text-sm font-bold">
                    {verification.score}%
                    {verification.score >= 90 && (
                      <span className="ml-2 text-[#FDCB6E] text-xs">
                        ({lang === "en" ? "With Distinction" : "بامتياز"})
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-[#0A6B5A]/20 pb-3">
                  <span className="text-[#C4B9A8] font-['Work_Sans'] text-sm">
                    {lang === "en" ? "Certificate #" : "رقم الشهادة"}
                  </span>
                  <span className="text-[#E8E0D4] font-['Montserrat'] text-sm font-bold">
                    {verification.certificateNumber}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#C4B9A8] font-['Work_Sans'] text-sm">
                    {lang === "en" ? "Date Issued" : "تاريخ الإصدار"}
                  </span>
                  <span className="text-[#E8E0D4] font-['Montserrat'] text-sm font-bold">
                    {new Date(verification.issuedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
