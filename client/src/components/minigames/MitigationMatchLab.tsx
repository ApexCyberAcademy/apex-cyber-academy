/*
  Mitigation Match Lab
  Students match security threats to their correct mitigation techniques.
  Maps to Security+ Day 6: Mitigation Techniques and Enterprise Security
  Bilingual: English + Arabic
*/

import { useState, useEffect, useCallback } from "react";
import { Shield, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type MitigationQ = {
  id: number;
  threat: string;
  threatAr: string;
  correctMitigation: string;
  options: string[];
  optionsAr: string[];
  explanation: string;
  explanationAr: string;
};

const QUESTIONS: MitigationQ[] = [
  {
    id: 1,
    threat: "An attacker is performing a brute-force attack against user login pages, trying thousands of password combinations per minute.",
    threatAr: "مهاجم يقوم بهجوم القوة الغاشمة ضد صفحات تسجيل الدخول، يجرب آلاف تركيبات كلمات المرور في الدقيقة.",
    correctMitigation: "Account lockout + Rate limiting + MFA",
    options: ["Network segmentation + VLAN isolation", "Account lockout + Rate limiting + MFA", "Full disk encryption + DLP", "Web Application Firewall (WAF) rules"],
    optionsAr: ["تقسيم الشبكة + عزل VLAN", "قفل الحساب + تحديد المعدل + MFA", "تشفير القرص الكامل + DLP", "قواعد جدار حماية تطبيقات الويب (WAF)"],
    explanation: "Account lockout policies stop brute-force after N failed attempts, rate limiting slows automated attacks, and MFA makes stolen passwords useless alone. Together they form defense-in-depth against credential attacks.",
    explanationAr: "سياسات قفل الحساب توقف القوة الغاشمة بعد N محاولات فاشلة، تحديد المعدل يبطئ الهجمات الآلية، و MFA يجعل كلمات المرور المسروقة عديمة الفائدة وحدها. معاً يشكلون دفاعاً متعدد الطبقات ضد هجمات بيانات الاعتماد.",
  },
  {
    id: 2,
    threat: "Sensitive customer data is being exfiltrated by a malicious insider who copies files to a personal USB drive.",
    threatAr: "يتم تسريب بيانات العملاء الحساسة بواسطة شخص داخلي خبيث ينسخ الملفات إلى محرك USB شخصي.",
    correctMitigation: "DLP + USB port control + User behavior analytics",
    options: ["DLP + USB port control + User behavior analytics", "Intrusion Detection System (IDS)", "SSL/TLS certificate pinning", "DNS sinkholing + Threat intelligence feeds"],
    optionsAr: ["DLP + التحكم بمنافذ USB + تحليلات سلوك المستخدم", "نظام كشف التسلل (IDS)", "تثبيت شهادة SSL/TLS", "حفرة DNS + موجزات استخبارات التهديدات"],
    explanation: "Data Loss Prevention (DLP) monitors and blocks sensitive data transfers, USB port control prevents unauthorized removable media, and User Behavior Analytics (UBA) detects anomalous file access patterns by insiders.",
    explanationAr: "منع فقدان البيانات (DLP) يراقب ويحظر نقل البيانات الحساسة، التحكم بمنافذ USB يمنع الوسائط القابلة للإزالة غير المصرح بها، وتحليلات سلوك المستخدم (UBA) تكشف أنماط الوصول الشاذة للملفات من الداخليين.",
  },
  {
    id: 3,
    threat: "A ransomware attack has encrypted the file server. The attackers demand $500,000 in Bitcoin within 48 hours.",
    threatAr: "هجوم فدية شفّر خادم الملفات. يطالب المهاجمون بمبلغ 500,000 دولار بالبيتكوين خلال 48 ساعة.",
    correctMitigation: "Offline backups + Network isolation + Incident response plan",
    options: ["Pay the ransom to restore operations quickly", "Offline backups + Network isolation + Incident response plan", "Antivirus full scan + Reboot servers", "Change all passwords + Enable MFA"],
    optionsAr: ["دفع الفدية لاستعادة العمليات بسرعة", "نسخ احتياطية غير متصلة + عزل الشبكة + خطة استجابة للحوادث", "فحص كامل بمضاد الفيروسات + إعادة تشغيل الخوادم", "تغيير جميع كلمات المرور + تفعيل MFA"],
    explanation: "Never pay the ransom — it funds criminals and doesn't guarantee recovery. Offline (air-gapped) backups allow restoration without paying. Network isolation contains the spread. A tested incident response plan ensures coordinated recovery.",
    explanationAr: "لا تدفع الفدية أبداً — فهي تموّل المجرمين ولا تضمن الاسترداد. النسخ الاحتياطية غير المتصلة تسمح بالاستعادة بدون دفع. عزل الشبكة يحتوي الانتشار. خطة استجابة للحوادث مُختبرة تضمن استرداداً منسقاً.",
  },
  {
    id: 4,
    threat: "SQL injection attacks are targeting the company's e-commerce web application, attempting to extract customer credit card data.",
    threatAr: "هجمات حقن SQL تستهدف تطبيق التجارة الإلكترونية للشركة، محاولة استخراج بيانات بطاقات الائتمان.",
    correctMitigation: "WAF + Parameterized queries + Input validation",
    options: ["Network firewall + Port blocking", "WAF + Parameterized queries + Input validation", "VPN + Network encryption", "Endpoint Detection and Response (EDR)"],
    optionsAr: ["جدار حماية الشبكة + حظر المنافذ", "WAF + استعلامات معلمية + التحقق من المدخلات", "VPN + تشفير الشبكة", "كشف واستجابة نقاط النهاية (EDR)"],
    explanation: "WAF filters malicious SQL patterns at the network edge, parameterized queries prevent SQL injection at the code level (the most effective fix), and input validation adds another defense layer. This is classic defense-in-depth.",
    explanationAr: "WAF يرشح أنماط SQL الخبيثة عند حافة الشبكة، الاستعلامات المعلمية تمنع حقن SQL على مستوى الكود (الإصلاح الأكثر فعالية)، والتحقق من المدخلات يضيف طبقة دفاع أخرى. هذا دفاع متعدد الطبقات كلاسيكي.",
  },
  {
    id: 5,
    threat: "An employee's corporate laptop was stolen from a coffee shop. The laptop contains sensitive project files and VPN credentials.",
    threatAr: "سُرق حاسوب الموظف المؤسسي من مقهى. يحتوي الحاسوب على ملفات مشروع حساسة وبيانات اعتماد VPN.",
    correctMitigation: "Full disk encryption + Remote wipe + Certificate revocation",
    options: ["Change the employee's password only", "Full disk encryption + Remote wipe + Certificate revocation", "File-level encryption + Antivirus", "Physical security training only"],
    optionsAr: ["تغيير كلمة مرور الموظف فقط", "تشفير القرص الكامل + مسح عن بُعد + إلغاء الشهادة", "تشفير على مستوى الملف + مضاد فيروسات", "تدريب الأمن المادي فقط"],
    explanation: "Full disk encryption (BitLocker/FileVault) makes data unreadable without the key. Remote wipe destroys data if the device comes online. Revoking VPN certificates prevents the thief from connecting to the corporate network.",
    explanationAr: "تشفير القرص الكامل (BitLocker/FileVault) يجعل البيانات غير قابلة للقراءة بدون المفتاح. المسح عن بُعد يدمر البيانات إذا اتصل الجهاز بالإنترنت. إلغاء شهادات VPN يمنع السارق من الاتصال بشبكة الشركة.",
  },
];

export default function MitigationMatchLab({ onComplete }: { onComplete?: (score?: number) => void }) {
  const { tx } = useLabLang();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const q = QUESTIONS[current];

  const handleSubmit = useCallback(() => {
    if (selected === null) return;
    setShowResult(true);
    if (q.options[selected] === q.correctMitigation) setScore(s => s + 1);
  }, [selected, q]);

  const handleNext = useCallback(() => {
    if (current < QUESTIONS.length - 1) { setCurrent(c => c + 1); setSelected(null); setShowResult(false); }
    else setCompleted(true);
  }, [current]);

  const reset = useCallback(() => { setCurrent(0); setSelected(null); setShowResult(false); setScore(0); setCompleted(false); }, []);

  return (
    <div className="bg-[#001A16] border-2 border-[#0A6B5A]/40 p-6 my-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Shield className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Mitigation Strategy Lab", "مختبر استراتيجيات التخفيف")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{QUESTIONS.length} - {tx("Score", "النتيجة")}: {score}/{QUESTIONS.length}</p>
        </div>
      </div>

      {completed ? (
        <div className="text-center py-8">
          <Shield className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Defense Expert!", "خبير الدفاع!")}</h4>
          <p className="text-[#C4B9A8] font-['Work_Sans'] mb-4">{tx(`You scored ${score}/${QUESTIONS.length}!`, `حصلت على ${score}/${QUESTIONS.length}!`)}</p>
          <button onClick={reset} className="flex items-center gap-2 mx-auto px-6 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all"><RotateCcw className="w-4 h-4" /> {tx("Play Again", "ابدأ من جديد")}</button>
        </div>
      ) : (
        <>
          <div className="bg-[#002F24]/50 border border-[#0A6B5A]/30 p-4 mb-4">
            <p className="text-[#E8E0D4] font-['Work_Sans'] text-sm">{tx(q.threat, q.threatAr)}</p>
          </div>
          <p className="text-[#C4B9A8] font-['Montserrat'] text-xs font-semibold mb-2">{tx("Select the best mitigation strategy:", "اختر أفضل استراتيجية تخفيف:")}</p>
          <div className="space-y-2 mb-4">
            {q.options.map((opt, i) => (
              <button key={i} onClick={() => !showResult && setSelected(i)}
                className={`w-full text-left p-3 border font-['Work_Sans'] text-sm transition-all ${
                  showResult
                    ? opt === q.correctMitigation ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]" : i === selected ? "border-red-500/50 bg-red-500/10 text-red-400" : "border-[#0A6B5A]/20 text-[#C4B9A8]/50"
                    : selected === i ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]" : "border-[#0A6B5A]/30 text-[#C4B9A8] hover:border-[#D4AF37]/50"
                }`}>
                <div className="flex items-center gap-2">
                  {showResult && opt === q.correctMitigation && <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0" />}
                  {showResult && i === selected && opt !== q.correctMitigation && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
                  {tx(opt, q.optionsAr[i])}
                </div>
              </button>
            ))}
          </div>
          {!showResult ? (
            <button onClick={handleSubmit} disabled={selected === null} className="px-6 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all disabled:opacity-40">{tx("Submit", "إرسال")}</button>
          ) : (
            <div className="bg-[#0A3D33]/40 border border-[#0A6B5A]/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                {q.options[selected!] === q.correctMitigation ? <><CheckCircle className="w-5 h-5 text-[#D4AF37]" /><span className="text-[#D4AF37] font-['Montserrat'] font-bold text-sm">{tx("Correct!", "صحيح!")}</span></> : <><XCircle className="w-5 h-5 text-red-400" /><span className="text-red-400 font-['Montserrat'] font-bold text-sm">{tx("Incorrect", "غير صحيح")}</span></>}
              </div>
              <p className="text-[#C4B9A8] font-['Work_Sans'] text-sm">{tx(q.explanation, q.explanationAr)}</p>
              <button onClick={handleNext} className="mt-3 flex items-center gap-2 px-5 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all">
                {current < QUESTIONS.length - 1 ? tx("Next Scenario", "السيناريو التالي") : tx("See Results", "عرض النتائج")} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
