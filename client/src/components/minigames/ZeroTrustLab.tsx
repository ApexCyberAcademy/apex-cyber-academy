/*
  Zero Trust Architecture Lab
  Students evaluate access requests using Zero Trust principles.
  Maps to Security+ Day 2: Zero Trust, Physical Security, and Deception Technologies
  Bilingual: English + Arabic
*/

import { useState, useEffect, useCallback } from "react";
import { ShieldCheck, CheckCircle, XCircle, RotateCcw, ArrowRight, ShieldAlert } from "lucide-react";
import { useLabLang } from "./labI18n";

type AccessRequest = {
  id: number;
  scenario: string;
  scenarioAr: string;
  user: string;
  device: string;
  location: string;
  resource: string;
  correctDecision: "allow" | "deny" | "mfa";
  options: { label: string; labelAr: string; value: "allow" | "deny" | "mfa" }[];
  explanation: string;
  explanationAr: string;
};

const REQUESTS: AccessRequest[] = [
  {
    id: 1,
    scenario: "A finance employee is accessing the payroll system from their corporate laptop on the office network during business hours.",
    scenarioAr: "موظف مالية يصل إلى نظام الرواتب من حاسوبه المؤسسي على شبكة المكتب خلال ساعات العمل.",
    user: "Finance Analyst (Role: Finance)",
    device: "Corporate Laptop (Compliant, Patched)",
    location: "Office Network (Trusted Zone)",
    resource: "Payroll System",
    correctDecision: "allow",
    options: [
      { label: "Allow Access", labelAr: "السماح بالوصول", value: "allow" },
      { label: "Deny Access", labelAr: "رفض الوصول", value: "deny" },
      { label: "Require Additional MFA", labelAr: "طلب مصادقة إضافية", value: "mfa" },
    ],
    explanation: "In Zero Trust, even trusted network access is verified. However, this request meets all policy criteria: correct role, compliant device, trusted location, business hours. Access is granted with continuous monitoring.",
    explanationAr: "في نموذج الثقة المعدومة، حتى الوصول من الشبكة الموثوقة يتم التحقق منه. ومع ذلك، هذا الطلب يستوفي جميع معايير السياسة: الدور الصحيح، جهاز متوافق، موقع موثوق، ساعات عمل. يُمنح الوصول مع المراقبة المستمرة.",
  },
  {
    id: 2,
    scenario: "A developer is trying to access the production database from a personal phone connected to a coffee shop Wi-Fi at 2 AM.",
    scenarioAr: "مطور يحاول الوصول إلى قاعدة بيانات الإنتاج من هاتفه الشخصي المتصل بشبكة Wi-Fi في مقهى في الساعة 2 صباحاً.",
    user: "Developer (Role: Engineering)",
    device: "Personal Phone (Unmanaged)",
    location: "Public Wi-Fi (Untrusted)",
    resource: "Production Database",
    correctDecision: "deny",
    options: [
      { label: "Allow Access", labelAr: "السماح بالوصول", value: "allow" },
      { label: "Deny Access", labelAr: "رفض الوصول", value: "deny" },
      { label: "Require Additional MFA", labelAr: "طلب مصادقة إضافية", value: "mfa" },
    ],
    explanation: "Multiple red flags: unmanaged personal device, untrusted public network, unusual time, and production database is a high-value target. Zero Trust denies this — even MFA isn't enough given the device and network risk.",
    explanationAr: "عدة علامات تحذيرية: جهاز شخصي غير مُدار، شبكة عامة غير موثوقة، وقت غير معتاد، وقاعدة بيانات الإنتاج هدف عالي القيمة. الثقة المعدومة ترفض هذا — حتى المصادقة متعددة العوامل ليست كافية بسبب مخاطر الجهاز والشبكة.",
  },
  {
    id: 3,
    scenario: "A remote HR manager needs to access employee records from their corporate laptop at home via VPN. Their device hasn't been updated in 45 days.",
    scenarioAr: "مدير موارد بشرية عن بُعد يحتاج للوصول إلى سجلات الموظفين من حاسوبه المؤسسي في المنزل عبر VPN. لم يتم تحديث جهازه منذ 45 يوماً.",
    user: "HR Manager (Role: HR)",
    device: "Corporate Laptop (Non-Compliant: 45 days unpatched)",
    location: "Home Network via VPN",
    resource: "Employee Records (PII)",
    correctDecision: "mfa",
    options: [
      { label: "Allow Access", labelAr: "السماح بالوصول", value: "allow" },
      { label: "Deny Access", labelAr: "رفض الوصول", value: "deny" },
      { label: "Require Additional MFA + Remediation", labelAr: "طلب مصادقة إضافية + معالجة", value: "mfa" },
    ],
    explanation: "The user has the right role and is using VPN, but the device is non-compliant (unpatched for 45 days). Zero Trust requires step-up authentication and may grant limited access while requiring the device to be updated before full access.",
    explanationAr: "المستخدم لديه الدور الصحيح ويستخدم VPN، لكن الجهاز غير متوافق (لم يتم تحديثه لمدة 45 يوماً). الثقة المعدومة تتطلب مصادقة مرتفعة وقد تمنح وصولاً محدوداً مع مطالبة بتحديث الجهاز قبل الوصول الكامل.",
  },
  {
    id: 4,
    scenario: "An IT admin is accessing the firewall management console from a secure admin workstation in the data center using a hardware token.",
    scenarioAr: "مسؤول تقنية معلومات يصل إلى وحدة تحكم إدارة جدار الحماية من محطة عمل إدارية آمنة في مركز البيانات باستخدام رمز أمان مادي.",
    user: "IT Admin (Role: Infrastructure)",
    device: "Privileged Access Workstation (Hardened)",
    location: "Data Center (Restricted Zone)",
    resource: "Firewall Management Console",
    correctDecision: "allow",
    options: [
      { label: "Allow Access", labelAr: "السماح بالوصول", value: "allow" },
      { label: "Deny Access", labelAr: "رفض الوصول", value: "deny" },
      { label: "Require Additional MFA", labelAr: "طلب مصادقة إضافية", value: "mfa" },
    ],
    explanation: "This meets all Zero Trust criteria for privileged access: correct admin role, hardened PAW, physical presence in restricted zone, hardware token MFA already provided. Access is granted with full session logging.",
    explanationAr: "هذا يستوفي جميع معايير الثقة المعدومة للوصول المميز: دور المسؤول الصحيح، محطة عمل مقواة، تواجد فعلي في منطقة مقيدة، رمز أمان مادي مقدم بالفعل. يُمنح الوصول مع تسجيل كامل للجلسة.",
  },
  {
    id: 5,
    scenario: "A contractor's account that was deactivated last week is making API calls to the customer database at 3 AM from an IP in a foreign country.",
    scenarioAr: "حساب مقاول تم إلغاء تنشيطه الأسبوع الماضي يجري استدعاءات API إلى قاعدة بيانات العملاء في الساعة 3 صباحاً من عنوان IP في بلد أجنبي.",
    user: "Contractor (Status: Deactivated)",
    device: "Unknown Device",
    location: "Foreign IP (Anomalous)",
    resource: "Customer Database",
    correctDecision: "deny",
    options: [
      { label: "Allow Access", labelAr: "السماح بالوصول", value: "allow" },
      { label: "Deny Access + Alert SOC", labelAr: "رفض الوصول + تنبيه مركز العمليات", value: "deny" },
      { label: "Require Additional MFA", labelAr: "طلب مصادقة إضافية", value: "mfa" },
    ],
    explanation: "This is a clear security incident. The account is deactivated, the device is unknown, the location is anomalous, and the timing is suspicious. Zero Trust denies immediately and triggers a SOC alert for investigation.",
    explanationAr: "هذا حادث أمني واضح. الحساب معطل، الجهاز مجهول، الموقع شاذ، والتوقيت مشبوه. الثقة المعدومة ترفض فوراً وتطلق تنبيهاً لمركز العمليات الأمنية للتحقيق.",
  },
];

export default function ZeroTrustLab({ onComplete }: { onComplete?: (score?: number) => void }) {
  const { tx } = useLabLang();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const req = REQUESTS[current];

  const handleSelect = useCallback((value: string) => {
    if (showResult) return;
    setSelected(value);
  }, [showResult]);

  const handleSubmit = useCallback(() => {
    if (!selected) return;
    setShowResult(true);
    if (selected === req.correctDecision) {
      setScore(s => s + 1);
    }
  }, [selected, req]);

  const handleNext = useCallback(() => {
    if (current < REQUESTS.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setCompleted(true);
    }
  }, [current]);

  const reset = useCallback(() => {
    setCurrent(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setCompleted(false);
  }, []);

  return (
    <div className="bg-[#001A16] border-2 border-[#0A6B5A]/40 p-6 my-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
        </div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">
            {tx("Zero Trust Access Control Lab", "مختبر التحكم بالوصول - الثقة المعدومة")}
          </h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">
            {tx("Request", "طلب")} {current + 1}/{REQUESTS.length} - {tx("Score", "النتيجة")}: {score}/{REQUESTS.length}
          </p>
        </div>
      </div>

      {completed ? (
        <div className="text-center py-8">
          <ShieldCheck className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">
            {tx("Zero Trust Expert!", "خبير الثقة المعدومة!")}
          </h4>
          <p className="text-[#C4B9A8] font-['Work_Sans'] mb-4">
            {tx(`You scored ${score}/${REQUESTS.length}. You understand Zero Trust access decisions!`, `حصلت على ${score}/${REQUESTS.length}. أنت تفهم قرارات الوصول في الثقة المعدومة!`)}
          </p>
          <button onClick={reset} className="flex items-center gap-2 mx-auto px-6 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all">
            <RotateCcw className="w-4 h-4" /> {tx("Play Again", "ابدأ من جديد")}
          </button>
        </div>
      ) : (
        <>
          {/* Scenario */}
          <div className="bg-[#002F24]/50 border border-[#0A6B5A]/30 p-4 mb-4">
            <p className="text-[#E8E0D4] font-['Work_Sans'] text-sm mb-4">{tx(req.scenario, req.scenarioAr)}</p>
            <div className="grid grid-cols-2 gap-2 text-xs font-['Work_Sans']">
              <div className="bg-[#0A3D33]/40 p-2"><span className="text-[#D4AF37] font-bold">{tx("User:", "المستخدم:")}</span> <span className="text-[#C4B9A8]">{req.user}</span></div>
              <div className="bg-[#0A3D33]/40 p-2"><span className="text-[#D4AF37] font-bold">{tx("Device:", "الجهاز:")}</span> <span className="text-[#C4B9A8]">{req.device}</span></div>
              <div className="bg-[#0A3D33]/40 p-2"><span className="text-[#D4AF37] font-bold">{tx("Location:", "الموقع:")}</span> <span className="text-[#C4B9A8]">{req.location}</span></div>
              <div className="bg-[#0A3D33]/40 p-2"><span className="text-[#D4AF37] font-bold">{tx("Resource:", "المورد:")}</span> <span className="text-[#C4B9A8]">{req.resource}</span></div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2 mb-4">
            {req.options.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`w-full text-left p-3 border font-['Work_Sans'] text-sm transition-all ${
                  showResult
                    ? opt.value === req.correctDecision
                      ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]"
                      : opt.value === selected
                        ? "border-red-500/50 bg-red-500/10 text-red-400"
                        : "border-[#0A6B5A]/20 text-[#C4B9A8]/50"
                    : selected === opt.value
                      ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]"
                      : "border-[#0A6B5A]/30 text-[#C4B9A8] hover:border-[#D4AF37]/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  {showResult && opt.value === req.correctDecision && <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0" />}
                  {showResult && opt.value === selected && opt.value !== req.correctDecision && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                  {tx(opt.label, opt.labelAr)}
                </div>
              </button>
            ))}
          </div>

          {/* Submit / Result */}
          {!showResult ? (
            <button onClick={handleSubmit} disabled={!selected} className="px-6 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all disabled:opacity-40">
              {tx("Submit Decision", "إرسال القرار")}
            </button>
          ) : (
            <div className="bg-[#0A3D33]/40 border border-[#0A6B5A]/30 p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                {selected === req.correctDecision ? (
                  <><CheckCircle className="w-5 h-5 text-[#D4AF37]" /><span className="text-[#D4AF37] font-['Montserrat'] font-bold text-sm">{tx("Correct!", "صحيح!")}</span></>
                ) : (
                  <><XCircle className="w-5 h-5 text-red-400" /><span className="text-red-400 font-['Montserrat'] font-bold text-sm">{tx("Incorrect", "غير صحيح")}</span></>
                )}
              </div>
              <p className="text-[#C4B9A8] font-['Work_Sans'] text-sm">{tx(req.explanation, req.explanationAr)}</p>
              <button onClick={handleNext} className="mt-3 flex items-center gap-2 px-5 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all">
                {current < REQUESTS.length - 1 ? tx("Next Request", "الطلب التالي") : tx("See Results", "عرض النتائج")} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
