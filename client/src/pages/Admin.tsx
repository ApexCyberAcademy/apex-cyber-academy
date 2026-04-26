/*
  Admin Dashboard - manage enrollments, view student progress, and stats.
*/

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import {
  Users, BookOpen, Award, BarChart3, Loader2, Shield,
  UserPlus, ChevronDown, CheckCircle, XCircle, ArrowLeft, Package,
  Mail, MailCheck, MailX, Eye, ClipboardList, ChevronLeft, ChevronRight
} from "lucide-react";
import { useState, useMemo } from "react";
import { toast } from "sonner";

export default function Admin() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { lang } = useLanguage();
  const [enrollTab, setEnrollTab] = useState<"enrollments" | "students" | "audit_log">("enrollments");
  const [auditPage, setAuditPage] = useState(0);
  const [enrollForm, setEnrollForm] = useState({ userId: 0, courseId: 0, tier: "self_paced" as "self_paced" | "live", sendEmail: true });
  const [bundleEnrollForm, setBundleEnrollForm] = useState({ userId: 0, bundleId: 0, tier: "self_paced" as "self_paced" | "live", sendEmail: true });
  const [showEnrollForm, setShowEnrollForm] = useState(false);
  const [showBundleEnrollForm, setShowBundleEnrollForm] = useState(false);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [emailPreviewHtml, setEmailPreviewHtml] = useState("");

  const { data: stats, isLoading: statsLoading } = trpc.admin.stats.useQuery(
    undefined,
    { enabled: isAuthenticated && user?.role === "admin" }
  );

  const { data: students } = trpc.admin.students.useQuery(
    undefined,
    { enabled: isAuthenticated && user?.role === "admin" }
  );

  const { data: enrollments } = trpc.admin.enrollments.useQuery(
    undefined,
    { enabled: isAuthenticated && user?.role === "admin" }
  );

  const { data: courses } = trpc.admin.courses.useQuery(
    undefined,
    { enabled: isAuthenticated && user?.role === "admin" }
  );

  const { data: adminBundles } = trpc.admin.bundles.useQuery(
    undefined,
    { enabled: isAuthenticated && user?.role === "admin" }
  );

  const { data: emailStatus } = trpc.admin.emailStatus.useQuery(
    undefined,
    { enabled: isAuthenticated && user?.role === "admin" }
  );

  const { data: auditData, isLoading: auditLoading } = trpc.admin.enrollmentLogs.useQuery(
    { limit: 20, offset: auditPage * 20 },
    { enabled: isAuthenticated && user?.role === "admin" && enrollTab === "audit_log" }
  );

  const utils = trpc.useUtils();

  const enrollStudent = trpc.admin.enrollStudent.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        const emailMsg = data.emailSent
          ? (lang === "en" ? " — Confirmation email sent" : " — تم إرسال بريد التأكيد")
          : (enrollForm.sendEmail ? (lang === "en" ? " — Email could not be sent" : " — لم يتم إرسال البريد") : "");
        toast.success((lang === "en" ? "Student enrolled successfully" : "تم تسجيل الطالب بنجاح") + emailMsg, {
          icon: data.emailSent ? <MailCheck className="w-4 h-4 text-green-500" /> : undefined,
        });
        setShowEnrollForm(false);
        setEnrollForm({ userId: 0, courseId: 0, tier: "self_paced", sendEmail: true });
        utils.admin.enrollments.invalidate();
        utils.admin.stats.invalidate();
      } else {
        toast.error(data.message || "Enrollment failed");
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const enrollStudentInBundle = trpc.admin.enrollStudentInBundle.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        const emailMsg = data.emailSent
          ? (lang === "en" ? " — Confirmation email sent" : " — تم إرسال بريد التأكيد")
          : (bundleEnrollForm.sendEmail ? (lang === "en" ? " — Email could not be sent" : " — لم يتم إرسال البريد") : "");
        toast.success((lang === "en" ? `Student enrolled in bundle (${data.coursesEnrolled} courses)` : `تم تسجيل الطالب في الحزمة (${data.coursesEnrolled} دورات)`) + emailMsg, {
          icon: data.emailSent ? <MailCheck className="w-4 h-4 text-green-500" /> : undefined,
        });
        setShowBundleEnrollForm(false);
        setBundleEnrollForm({ userId: 0, bundleId: 0, tier: "self_paced", sendEmail: true });
        utils.admin.enrollments.invalidate();
        utils.admin.stats.invalidate();
      } else {
        toast.error(data.message || "Bundle enrollment failed");
      }
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#F5F0E8]">
        <Navbar />
        <div className="pt-32 pb-20 container text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-6" />
          <h1 className="text-[#0C3C3C] font-['Playfair_Display'] text-3xl font-bold mb-4">
            {lang === "en" ? "Access Denied" : "الوصول مرفوض"}
          </h1>
          <p className="text-[#0C3C3C] font-['Work_Sans'] text-base mb-8">
            {lang === "en" ? "You need admin privileges to access this page." : "تحتاج صلاحيات المسؤول للوصول إلى هذه الصفحة."}
          </p>
          <Link href="/" className="text-[#D4AF37] hover:underline font-['Work_Sans']">
            {lang === "en" ? "Go Home" : "الرئيسية"}
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8]">
      <Navbar />

      <div className="pt-28 pb-20 container">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-[#0C3C3C] hover:text-[#D4AF37] font-['Work_Sans'] text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {lang === "en" ? "Back to Dashboard" : "العودة إلى اللوحة"}
        </Link>

        <h1 className="text-[#0C3C3C] font-['Playfair_Display'] text-3xl sm:text-4xl font-bold mb-2">
          {lang === "en" ? "Admin Dashboard" : "لوحة الإدارة"}
        </h1>
        <p className="text-[#0C3C3C] font-['Work_Sans'] text-base mb-8">
          {lang === "en" ? "Manage students, enrollments, and track progress" : "إدارة الطلاب والتسجيلات ومتابعة التقدم"}
        </p>

        {/* Stats Cards */}
        {statsLoading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-6 h-6 text-[#D4AF37] animate-spin" />
          </div>
        ) : stats ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <div className="bg-white/40 border border-[#D4CBBA] p-5">
              <Users className="w-6 h-6 text-[#D4AF37] mb-2" />
              <div className="text-[#0C3C3C] font-['Playfair_Display'] text-3xl font-bold">{stats.totalStudents}</div>
              <div className="text-[#0C3C3C] font-['Work_Sans'] text-xs mt-1">{lang === "en" ? "Total Students" : "إجمالي الطلاب"}</div>
            </div>
            <div className="bg-white/40 border border-[#D4CBBA] p-5">
              <BookOpen className="w-6 h-6 text-[#D4AF37] mb-2" />
              <div className="text-[#0C3C3C] font-['Playfair_Display'] text-3xl font-bold">{stats.totalEnrollments}</div>
              <div className="text-[#0C3C3C] font-['Work_Sans'] text-xs mt-1">{lang === "en" ? "Enrollments" : "التسجيلات"}</div>
            </div>
            <div className="bg-white/40 border border-[#D4CBBA] p-5">
              <Award className="w-6 h-6 text-[#D4AF37] mb-2" />
              <div className="text-[#0C3C3C] font-['Playfair_Display'] text-3xl font-bold">{stats.totalQuizAttempts}</div>
              <div className="text-[#0C3C3C] font-['Work_Sans'] text-xs mt-1">{lang === "en" ? "Quiz Attempts" : "محاولات الاختبار"}</div>
            </div>
            <div className="bg-white/40 border border-[#D4CBBA] p-5">
              <BarChart3 className="w-6 h-6 text-[#D4AF37] mb-2" />
              <div className="text-[#0C3C3C] font-['Playfair_Display'] text-3xl font-bold">{stats.totalCourses}</div>
              <div className="text-[#0C3C3C] font-['Work_Sans'] text-xs mt-1">{lang === "en" ? "Courses" : "الدورات"}</div>
            </div>
          </div>
        ) : null}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white/30 p-1 border border-[#D4CBBA]">
          <button
            onClick={() => setEnrollTab("enrollments")}
            className={`flex items-center gap-2 px-5 py-2.5 font-['Montserrat'] text-sm font-semibold transition-all ${
              enrollTab === "enrollments" ? "bg-[#D4AF37] text-[#0C3C3C]" : "text-[#0C3C3C] hover:text-[#D4AF37]"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            {lang === "en" ? "Enrollments" : "التسجيلات"}
          </button>
          <button
            onClick={() => setEnrollTab("students")}
            className={`flex items-center gap-2 px-5 py-2.5 font-['Montserrat'] text-sm font-semibold transition-all ${
              enrollTab === "students" ? "bg-[#D4AF37] text-[#0C3C3C]" : "text-[#0C3C3C] hover:text-[#D4AF37]"
            }`}
          >
            <Users className="w-4 h-4" />
            {lang === "en" ? "Students" : "الطلاب"}
          </button>
          <button
            onClick={() => setEnrollTab("audit_log")}
            className={`flex items-center gap-2 px-5 py-2.5 font-['Montserrat'] text-sm font-semibold transition-all ${
              enrollTab === "audit_log" ? "bg-[#D4AF37] text-[#0C3C3C]" : "text-[#0C3C3C] hover:text-[#D4AF37]"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            {lang === "en" ? "Audit Log" : "سجل العمليات"}
          </button>
        </div>

        {/* Enroll Student Buttons */}
        <div className="flex justify-end gap-3 mb-4">
          <button
            onClick={() => { setShowBundleEnrollForm(!showBundleEnrollForm); setShowEnrollForm(false); }}
            className="flex items-center gap-2 px-5 py-2.5 border border-[#D4AF37]/50 text-[#D4AF37] font-['Montserrat'] font-bold text-sm hover:bg-[#D4AF37]/10 transition-all duration-300"
          >
            <Package className="w-4 h-4" />
            {lang === "en" ? "Enroll in Bundle" : "تسجيل في حزمة"}
          </button>
          <button
            onClick={() => { setShowEnrollForm(!showEnrollForm); setShowBundleEnrollForm(false); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all duration-300"
          >
            <UserPlus className="w-4 h-4" />
            {lang === "en" ? "Enroll Student" : "تسجيل طالب"}
          </button>
        </div>

        {/* Enroll Form */}
        {showEnrollForm && (
          <div className="bg-white/40 border border-[#D4AF37]/30 p-6 mb-6">
            <h3 className="text-[#0C3C3C] font-['Montserrat'] text-base font-bold mb-4">
              {lang === "en" ? "Enroll a Student" : "تسجيل طالب"}
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[#0C3C3C] font-['Work_Sans'] text-xs block mb-1">
                  {lang === "en" ? "Student" : "الطالب"}
                </label>
                <select
                  value={enrollForm.userId || ""}
                  onChange={(e) => setEnrollForm(prev => ({ ...prev, userId: Number(e.target.value) }))}
                  className="w-full bg-[#164A4A]/50 border border-[#D4CBBA] text-[#0C3C3C] font-['Work_Sans'] text-sm px-3 py-2 focus:border-[#D4AF37]/50 outline-none"
                >
                  <option value="">{lang === "en" ? "Select student..." : "اختر الطالب..."}</option>
                  {students?.map((s) => (
                    <option key={s.id} value={s.id}>{s.name || s.email || `User #${s.id}`}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[#0C3C3C] font-['Work_Sans'] text-xs block mb-1">
                  {lang === "en" ? "Course" : "الدورة"}
                </label>
                <select
                  value={enrollForm.courseId || ""}
                  onChange={(e) => setEnrollForm(prev => ({ ...prev, courseId: Number(e.target.value) }))}
                  className="w-full bg-[#164A4A]/50 border border-[#D4CBBA] text-[#0C3C3C] font-['Work_Sans'] text-sm px-3 py-2 focus:border-[#D4AF37]/50 outline-none"
                >
                  <option value="">{lang === "en" ? "Select course..." : "اختر الدورة..."}</option>
                  {courses?.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[#0C3C3C] font-['Work_Sans'] text-xs block mb-1">
                  {lang === "en" ? "Tier" : "المستوى"}
                </label>
                <select
                  value={enrollForm.tier}
                  onChange={(e) => setEnrollForm(prev => ({ ...prev, tier: e.target.value as "self_paced" | "live" }))}
                  className="w-full bg-[#164A4A]/50 border border-[#D4CBBA] text-[#0C3C3C] font-['Work_Sans'] text-sm px-3 py-2 focus:border-[#D4AF37]/50 outline-none"
                >
                  <option value="self_paced">{lang === "en" ? "Self-Paced" : "ذاتي"}</option>
                  <option value="live">{lang === "en" ? "Live" : "مباشر"}</option>
                </select>
              </div>
            </div>
            {/* Email Toggle */}
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#D4CBBA]/50">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enrollForm.sendEmail}
                  onChange={(e) => setEnrollForm(prev => ({ ...prev, sendEmail: e.target.checked }))}
                  className="w-4 h-4 accent-[#D4AF37]"
                />
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[#0C3C3C] font-['Work_Sans'] text-sm">
                  {lang === "en" ? "Send enrollment confirmation email" : "إرسال بريد تأكيد التسجيل"}
                </span>
              </label>
              {!emailStatus?.configured && (
                <span className="text-xs text-amber-600 font-['Work_Sans'] flex items-center gap-1">
                  <MailX className="w-3 h-3" />
                  {lang === "en" ? "Email service not configured" : "خدمة البريد غير مهيأة"}
                </span>
              )}
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  if (!enrollForm.userId || !enrollForm.courseId) {
                    toast.error(lang === "en" ? "Please select a student and course" : "يرجى اختيار طالب ودورة");
                    return;
                  }
                  enrollStudent.mutate({ ...enrollForm, origin: window.location.origin });
                }}
                disabled={enrollStudent.isPending}
                className="flex items-center gap-2 px-6 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all duration-300 disabled:opacity-50"
              >
                {enrollStudent.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {lang === "en" ? "Enroll" : "تسجيل"}
              </button>
              <button
                onClick={() => setShowEnrollForm(false)}
                className="px-4 py-2 border border-[#D4CBBA] text-[#0C3C3C] font-['Montserrat'] text-sm hover:text-[#0C3C3C] transition-colors"
              >
                {lang === "en" ? "Cancel" : "إلغاء"}
              </button>
            </div>
          </div>
        )}

        {/* Bundle Enroll Form */}
        {showBundleEnrollForm && (
          <div className="bg-white/40 border border-[#D4AF37]/30 p-6 mb-6">
            <h3 className="text-[#0C3C3C] font-['Montserrat'] text-base font-bold mb-4">
              <Package className="w-4 h-4 inline me-2" />
              {lang === "en" ? "Enroll Student in Bundle" : "تسجيل طالب في حزمة"}
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[#0C3C3C] font-['Work_Sans'] text-xs block mb-1">
                  {lang === "en" ? "Student" : "الطالب"}
                </label>
                <select
                  value={bundleEnrollForm.userId || ""}
                  onChange={(e) => setBundleEnrollForm(prev => ({ ...prev, userId: Number(e.target.value) }))}
                  className="w-full bg-[#164A4A]/50 border border-[#D4CBBA] text-[#0C3C3C] font-['Work_Sans'] text-sm px-3 py-2 focus:border-[#D4AF37]/50 outline-none"
                >
                  <option value="">{lang === "en" ? "Select student..." : "اختر الطالب..."}</option>
                  {students?.map((s) => (
                    <option key={s.id} value={s.id}>{s.name || s.email || `User #${s.id}`}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[#0C3C3C] font-['Work_Sans'] text-xs block mb-1">
                  {lang === "en" ? "Bundle" : "الحزمة"}
                </label>
                <select
                  value={bundleEnrollForm.bundleId || ""}
                  onChange={(e) => setBundleEnrollForm(prev => ({ ...prev, bundleId: Number(e.target.value) }))}
                  className="w-full bg-[#164A4A]/50 border border-[#D4CBBA] text-[#0C3C3C] font-['Work_Sans'] text-sm px-3 py-2 focus:border-[#D4AF37]/50 outline-none"
                >
                  <option value="">{lang === "en" ? "Select bundle..." : "اختر الحزمة..."}</option>
                  {adminBundles?.map((b) => (
                    <option key={b.id} value={b.id}>{b.title} (${b.priceUsd})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[#0C3C3C] font-['Work_Sans'] text-xs block mb-1">
                  {lang === "en" ? "Tier" : "المستوى"}
                </label>
                <select
                  value={bundleEnrollForm.tier}
                  onChange={(e) => setBundleEnrollForm(prev => ({ ...prev, tier: e.target.value as "self_paced" | "live" }))}
                  className="w-full bg-[#164A4A]/50 border border-[#D4CBBA] text-[#0C3C3C] font-['Work_Sans'] text-sm px-3 py-2 focus:border-[#D4AF37]/50 outline-none"
                >
                  <option value="self_paced">{lang === "en" ? "Self-Paced" : "ذاتي"}</option>
                  <option value="live">{lang === "en" ? "Live" : "مباشر"}</option>
                </select>
              </div>
            </div>
            {/* Email Toggle */}
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#D4CBBA]/50">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bundleEnrollForm.sendEmail}
                  onChange={(e) => setBundleEnrollForm(prev => ({ ...prev, sendEmail: e.target.checked }))}
                  className="w-4 h-4 accent-[#D4AF37]"
                />
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[#0C3C3C] font-['Work_Sans'] text-sm">
                  {lang === "en" ? "Send enrollment confirmation email" : "إرسال بريد تأكيد التسجيل"}
                </span>
              </label>
              {!emailStatus?.configured && (
                <span className="text-xs text-amber-600 font-['Work_Sans'] flex items-center gap-1">
                  <MailX className="w-3 h-3" />
                  {lang === "en" ? "Email service not configured" : "خدمة البريد غير مهيأة"}
                </span>
              )}
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  if (!bundleEnrollForm.userId || !bundleEnrollForm.bundleId) {
                    toast.error(lang === "en" ? "Please select a student and bundle" : "يرجى اختيار طالب وحزمة");
                    return;
                  }
                  enrollStudentInBundle.mutate({ ...bundleEnrollForm, origin: window.location.origin });
                }}
                disabled={enrollStudentInBundle.isPending}
                className="flex items-center gap-2 px-6 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all duration-300 disabled:opacity-50"
              >
                {enrollStudentInBundle.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                {lang === "en" ? "Enroll in Bundle" : "تسجيل في الحزمة"}
              </button>
              <button
                onClick={() => setShowBundleEnrollForm(false)}
                className="px-4 py-2 border border-[#D4CBBA] text-[#0C3C3C] font-['Montserrat'] text-sm hover:text-[#0C3C3C] transition-colors"
              >
                {lang === "en" ? "Cancel" : "إلغاء"}
              </button>
            </div>
          </div>
        )}

        {/* Enrollments Table */}
        {enrollTab === "enrollments" && (
          <div className="bg-white/20 border border-[#D4CBBA] overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#D4CBBA]">
                  <th className="text-start px-5 py-3 text-[#D4AF37] font-['Montserrat'] text-xs font-bold tracking-wide uppercase">
                    {lang === "en" ? "Student" : "الطالب"}
                  </th>
                  <th className="text-start px-5 py-3 text-[#D4AF37] font-['Montserrat'] text-xs font-bold tracking-wide uppercase">
                    {lang === "en" ? "Course" : "الدورة"}
                  </th>
                  <th className="text-start px-5 py-3 text-[#D4AF37] font-['Montserrat'] text-xs font-bold tracking-wide uppercase">
                    {lang === "en" ? "Tier" : "المستوى"}
                  </th>
                  <th className="text-start px-5 py-3 text-[#D4AF37] font-['Montserrat'] text-xs font-bold tracking-wide uppercase">
                    {lang === "en" ? "Status" : "الحالة"}
                  </th>
                  <th className="text-start px-5 py-3 text-[#D4AF37] font-['Montserrat'] text-xs font-bold tracking-wide uppercase">
                    {lang === "en" ? "Enrolled" : "تاريخ التسجيل"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {enrollments?.map((e) => (
                  <tr key={e.enrollment.id} className="border-b border-[#227C82]/10 hover:bg-[#164A4A]/20 transition-colors">
                    <td className="px-5 py-3 text-[#0C3C3C] font-['Work_Sans'] text-sm">
                      {e.userName || e.userEmail || `User #${e.enrollment.userId}`}
                    </td>
                    <td className="px-5 py-3 text-[#0C3C3C] font-['Work_Sans'] text-sm">
                      {e.courseTitle}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 text-xs font-['Montserrat'] font-bold ${
                        e.enrollment.tier === "live" ? "bg-[#D4AF37]/20 text-[#D4AF37]" : "bg-[#227C82]/30 text-[#227C82]"
                      }`}>
                        {e.enrollment.tier === "live" ? "LIVE" : "SELF-PACED"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 text-xs font-['Montserrat'] font-bold ${
                        e.enrollment.status === "active" ? "text-green-400" : e.enrollment.status === "completed" ? "text-[#D4AF37]" : "text-red-400"
                      }`}>
                        {e.enrollment.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[#0C3C3C] font-['Work_Sans'] text-xs">
                      {new Date(e.enrollment.enrolledAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {(!enrollments || enrollments.length === 0) && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-[#0C3C3C] font-['Work_Sans'] text-sm">
                      {lang === "en" ? "No enrollments yet" : "لا توجد تسجيلات بعد"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Students Table */}
        {enrollTab === "students" && (
          <div className="bg-white/20 border border-[#D4CBBA] overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#D4CBBA]">
                  <th className="text-start px-5 py-3 text-[#D4AF37] font-['Montserrat'] text-xs font-bold tracking-wide uppercase">
                    {lang === "en" ? "Name" : "الاسم"}
                  </th>
                  <th className="text-start px-5 py-3 text-[#D4AF37] font-['Montserrat'] text-xs font-bold tracking-wide uppercase">
                    {lang === "en" ? "Email" : "البريد"}
                  </th>
                  <th className="text-start px-5 py-3 text-[#D4AF37] font-['Montserrat'] text-xs font-bold tracking-wide uppercase">
                    {lang === "en" ? "Role" : "الدور"}
                  </th>
                  <th className="text-start px-5 py-3 text-[#D4AF37] font-['Montserrat'] text-xs font-bold tracking-wide uppercase">
                    {lang === "en" ? "Joined" : "تاريخ الانضمام"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {students?.map((s) => (
                  <tr key={s.id} className="border-b border-[#227C82]/10 hover:bg-[#164A4A]/20 transition-colors">
                    <td className="px-5 py-3 text-[#0C3C3C] font-['Work_Sans'] text-sm">{s.name || " - "}</td>
                    <td className="px-5 py-3 text-[#0C3C3C] font-['Work_Sans'] text-sm">{s.email || " - "}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 text-xs font-['Montserrat'] font-bold ${
                        s.role === "admin" ? "text-[#D4AF37]" : "text-[#0C3C3C]"
                      }`}>
                        {s.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[#0C3C3C] font-['Work_Sans'] text-xs">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Audit Log Table */}
        {enrollTab === "audit_log" && (
          <div>
            {auditLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-6 h-6 text-[#D4AF37] animate-spin" />
              </div>
            ) : !auditData?.logs?.length ? (
              <div className="text-center py-12">
                <ClipboardList className="w-12 h-12 text-[#D4CBBA] mx-auto mb-4" />
                <p className="text-[#0C3C3C]/60 font-['Work_Sans'] text-sm">
                  {lang === "en" ? "No enrollment actions recorded yet." : "لا توجد عمليات تسجيل مسجلة بعد."}
                </p>
                <p className="text-[#0C3C3C]/40 font-['Work_Sans'] text-xs mt-1">
                  {lang === "en" ? "Enrollment actions will appear here automatically." : "ستظهر عمليات التسجيل هنا تلقائيًا."}
                </p>
              </div>
            ) : (
              <>
                <div className="bg-white/20 border border-[#D4CBBA] overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#D4CBBA]">
                        <th className="text-start px-4 py-3 text-[#D4AF37] font-['Montserrat'] text-xs font-bold tracking-wide uppercase">
                          {lang === "en" ? "Date" : "التاريخ"}
                        </th>
                        <th className="text-start px-4 py-3 text-[#D4AF37] font-['Montserrat'] text-xs font-bold tracking-wide uppercase">
                          {lang === "en" ? "Action" : "الإجراء"}
                        </th>
                        <th className="text-start px-4 py-3 text-[#D4AF37] font-['Montserrat'] text-xs font-bold tracking-wide uppercase">
                          {lang === "en" ? "Student" : "الطالب"}
                        </th>
                        <th className="text-start px-4 py-3 text-[#D4AF37] font-['Montserrat'] text-xs font-bold tracking-wide uppercase">
                          {lang === "en" ? "Course / Bundle" : "الدورة / الحزمة"}
                        </th>
                        <th className="text-start px-4 py-3 text-[#D4AF37] font-['Montserrat'] text-xs font-bold tracking-wide uppercase">
                          {lang === "en" ? "Tier" : "المستوى"}
                        </th>
                        <th className="text-start px-4 py-3 text-[#D4AF37] font-['Montserrat'] text-xs font-bold tracking-wide uppercase">
                          {lang === "en" ? "Email" : "البريد"}
                        </th>
                        <th className="text-start px-4 py-3 text-[#D4AF37] font-['Montserrat'] text-xs font-bold tracking-wide uppercase">
                          {lang === "en" ? "Admin" : "المسؤول"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditData.logs.map((log) => (
                        <tr key={log.id} className="border-b border-[#227C82]/10 hover:bg-[#164A4A]/20 transition-colors">
                          <td className="px-4 py-3 text-[#0C3C3C] font-['Work_Sans'] text-xs whitespace-nowrap">
                            {new Date(log.createdAt).toLocaleString()}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-['Montserrat'] font-semibold ${
                              log.action === "enroll_bundle"
                                ? "bg-[#D4AF37]/20 text-[#D4AF37]"
                                : "bg-[#227C82]/20 text-[#227C82]"
                            }`}>
                              {log.action === "enroll_bundle" ? (
                                <><Package className="w-3 h-3" /> {lang === "en" ? "Bundle" : "حزمة"}</>
                              ) : (
                                <><BookOpen className="w-3 h-3" /> {lang === "en" ? "Course" : "دورة"}</>
                              )}
                              {log.coursesEnrolled > 1 && ` (${log.coursesEnrolled})`}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-[#0C3C3C] font-['Work_Sans'] text-sm">{log.studentName}</div>
                            {log.studentEmail && (
                              <div className="text-[#0C3C3C]/50 font-['Work_Sans'] text-xs">{log.studentEmail}</div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-[#0C3C3C] font-['Work_Sans'] text-sm">
                            {log.bundleName || log.courseName || "-"}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 text-xs font-['Montserrat'] font-bold ${
                              log.tier === "live" ? "text-[#D4AF37]" : "text-[#227C82]"
                            }`}>
                              {log.tier === "live" ? (lang === "en" ? "LIVE" : "مباشر") : (lang === "en" ? "SELF-PACED" : "ذاتي")}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {log.emailSent ? (
                              <span className="inline-flex items-center gap-1 text-green-600 text-xs font-['Work_Sans']">
                                <MailCheck className="w-3.5 h-3.5" /> {lang === "en" ? "Sent" : "مرسل"}
                              </span>
                            ) : log.emailError ? (
                              <span className="inline-flex items-center gap-1 text-red-500 text-xs font-['Work_Sans']" title={log.emailError}>
                                <MailX className="w-3.5 h-3.5" /> {lang === "en" ? "Failed" : "فشل"}
                              </span>
                            ) : (
                              <span className="text-[#0C3C3C]/40 text-xs font-['Work_Sans']">
                                {lang === "en" ? "Not sent" : "لم يرسل"}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-[#0C3C3C] font-['Work_Sans'] text-xs">
                            {log.adminName}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {auditData.total > 20 && (
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-[#0C3C3C]/60 font-['Work_Sans'] text-xs">
                      {lang === "en"
                        ? `Showing ${auditPage * 20 + 1}–${Math.min((auditPage + 1) * 20, auditData.total)} of ${auditData.total}`
                        : `عرض ${auditPage * 20 + 1}–${Math.min((auditPage + 1) * 20, auditData.total)} من ${auditData.total}`
                      }
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setAuditPage(p => Math.max(0, p - 1))}
                        disabled={auditPage === 0}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-['Montserrat'] font-semibold text-[#0C3C3C] bg-white/30 border border-[#D4CBBA] hover:bg-[#D4AF37]/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        {lang === "en" ? "Previous" : "السابق"}
                      </button>
                      <button
                        onClick={() => setAuditPage(p => p + 1)}
                        disabled={(auditPage + 1) * 20 >= auditData.total}
                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-['Montserrat'] font-semibold text-[#0C3C3C] bg-white/30 border border-[#D4CBBA] hover:bg-[#D4AF37]/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        {lang === "en" ? "Next" : "التالي"}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
