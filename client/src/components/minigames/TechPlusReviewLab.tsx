/*
  Comprehensive Review Lab - Tech+ Day 10
  Students tackle mixed questions across all Tech+ domains.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { BookOpen, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [
  {
    "id": 1,
    "scenario": "A user reports that their computer is running very slowly. Task Manager shows 98% disk usage but low CPU and RAM usage. What is the most likely cause and fix?",
    "scenarioAr": "مستخدم يبلغ أن حاسوبه يعمل ببطء شديد. مدير المهام يظهر 98% استخدام قرص لكن استخدام CPU و RAM منخفض. ما السبب الأكثر احتمالاً والإصلاح؟",
    "correct": "Traditional HDD bottleneck — upgrade to SSD for dramatic improvement",
    "options": [
      "Need more RAM",
      "Traditional HDD bottleneck — upgrade to SSD for dramatic improvement",
      "CPU needs to be overclocked",
      "Windows needs to be reinstalled"
    ],
    "optionsAr": [
      "تحتاج المزيد من RAM",
      "عنق زجاجة HDD تقليدي — الترقية لـ SSD لتحسين كبير",
      "CPU يحتاج لكسر السرعة",
      "ويندوز يحتاج لإعادة التثبيت"
    ],
    "explanation": "98% disk usage with low CPU/RAM is the classic symptom of an HDD bottleneck. Traditional hard drives (5400-7200 RPM) can't keep up with modern OS demands. Upgrading to an SSD is the single most impactful upgrade for perceived system speed — often making an old computer feel new.",
    "explanationAr": "98% استخدام قرص مع CPU/RAM منخفض هو العرض الكلاسيكي لعنق زجاجة HDD. الأقراص الصلبة التقليدية لا تستطيع مواكبة متطلبات أنظمة التشغيل الحديثة. الترقية لـ SSD هي أكثر ترقية تأثيراً على سرعة النظام المحسوسة."
  },
  {
    "id": 2,
    "scenario": "What is the purpose of a BIOS/UEFI password?",
    "scenarioAr": "ما هو الغرض من كلمة مرور BIOS/UEFI؟",
    "correct": "Prevents unauthorized changes to firmware settings and boot order",
    "options": [
      "Encrypts the hard drive contents",
      "Prevents unauthorized changes to firmware settings and boot order",
      "Replaces the Windows login password",
      "Speeds up the boot process"
    ],
    "optionsAr": [
      "يشفر محتويات القرص الصلب",
      "يمنع التغييرات غير المصرح بها لإعدادات البرنامج الثابت وترتيب التمهيد",
      "يستبدل كلمة مرور تسجيل دخول ويندوز",
      "يسرّع عملية التمهيد"
    ],
    "explanation": "A BIOS/UEFI password prevents unauthorized users from changing firmware settings (like boot order, secure boot, virtualization). This stops attackers from booting from USB drives to bypass OS security. It's a physical security control — part of defense in depth.",
    "explanationAr": "كلمة مرور BIOS/UEFI تمنع المستخدمين غير المصرح لهم من تغيير إعدادات البرنامج الثابت (مثل ترتيب التمهيد، التمهيد الآمن، المحاكاة الافتراضية). هذا يمنع المهاجمين من التمهيد من محركات USB لتجاوز أمان نظام التشغيل."
  },
  {
    "id": 3,
    "scenario": "A company is choosing between SaaS, PaaS, and IaaS for their email system. They want zero maintenance and just need email to work. Which model?",
    "scenarioAr": "شركة تختار بين SaaS و PaaS و IaaS لنظام بريدهم الإلكتروني. يريدون صيانة صفرية ويحتاجون فقط أن يعمل البريد الإلكتروني. أي نموذج؟",
    "correct": "SaaS — fully managed software like Microsoft 365 or Google Workspace",
    "options": [
      "IaaS — set up your own email server on a VM",
      "PaaS — deploy an email application on a managed platform",
      "SaaS — fully managed software like Microsoft 365 or Google Workspace",
      "On-premises Exchange server"
    ],
    "optionsAr": [
      "IaaS — إعداد خادم بريد إلكتروني خاص على جهاز افتراضي",
      "PaaS — نشر تطبيق بريد إلكتروني على منصة مُدارة",
      "SaaS — برمجيات مُدارة بالكامل مثل Microsoft 365 أو Google Workspace",
      "خادم Exchange محلي"
    ],
    "explanation": "SaaS (Software as a Service) like Microsoft 365 or Google Workspace provides fully managed email with zero infrastructure maintenance. The provider handles servers, updates, security, and uptime. For standard business email, SaaS is the most cost-effective and lowest-maintenance option.",
    "explanationAr": "SaaS (البرمجيات كخدمة) مثل Microsoft 365 أو Google Workspace يوفر بريداً إلكترونياً مُداراً بالكامل بدون صيانة بنية تحتية. المزود يتعامل مع الخوادم والتحديثات والأمان ووقت التشغيل."
  }
];

export default function TechPlusReviewLab({ onComplete }: { onComplete?: (score?: number) => void }) {
  const { tx } = useLabLang();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const s = SCENARIOS[current];
  const handleSubmit = useCallback(() => { if (selected === null) return; setShowResult(true); if (s.options[selected] === s.correct) setScore(sc => sc + 1); }, [selected, s]);
  const handleNext = useCallback(() => { if (current < SCENARIOS.length - 1) { setCurrent(c => c + 1); setSelected(null); setShowResult(false); } else setCompleted(true); }, [current]);
  const reset = useCallback(() => { setCurrent(0); setSelected(null); setShowResult(false); setScore(0); setCompleted(false); }, []);

  return (
    <div className="bg-[#001A16] border-2 border-[#0A6B5A]/40 p-6 my-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><BookOpen className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Tech+ Review Lab", "مختبر مراجعة Tech+")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <BookOpen className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Tech+ Ready!", "جاهز لـ Tech+!")}</h4>
          <p className="text-[#C4B9A8] font-['Work_Sans'] mb-4">{tx(`You scored ${score}/${SCENARIOS.length}!`, `حصلت على ${score}/${SCENARIOS.length}!`)}</p>
          <button onClick={reset} className="flex items-center gap-2 mx-auto px-6 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E]"><RotateCcw className="w-4 h-4" /> {tx("Play Again", "ابدأ من جديد")}</button>
        </div>
      ) : (
        <>
          <div className="bg-[#002F24]/50 border border-[#0A6B5A]/30 p-4 mb-4"><p className="text-[#E8E0D4] font-['Work_Sans'] text-sm">{tx(s.scenario, s.scenarioAr)}</p></div>
          <div className="space-y-2 mb-4">
            {s.options.map((opt, i) => (
              <button key={i} onClick={() => !showResult && setSelected(i)} className={`w-full text-left p-3 border font-['Work_Sans'] text-sm transition-all ${showResult ? opt === s.correct ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]" : i === selected ? "border-red-500/50 bg-red-500/10 text-red-400" : "border-[#0A6B5A]/20 text-[#C4B9A8]/50" : selected === i ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]" : "border-[#0A6B5A]/30 text-[#C4B9A8] hover:border-[#D4AF37]/50"}`}>
                <div className="flex items-center gap-2">{showResult && opt === s.correct && <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0" />}{showResult && i === selected && opt !== s.correct && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}{tx(opt, s.optionsAr[i])}</div>
              </button>
            ))}
          </div>
          {!showResult ? (
            <button onClick={handleSubmit} disabled={selected === null} className="px-6 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] disabled:opacity-40">{tx("Submit", "إرسال")}</button>
          ) : (
            <div className="bg-[#0A3D33]/40 border border-[#0A6B5A]/30 p-4">
              <div className="flex items-center gap-2 mb-2">{s.options[selected!] === s.correct ? <><CheckCircle className="w-5 h-5 text-[#D4AF37]" /><span className="text-[#D4AF37] font-['Montserrat'] font-bold text-sm">{tx("Correct!", "صحيح!")}</span></> : <><XCircle className="w-5 h-5 text-red-400" /><span className="text-red-400 font-['Montserrat'] font-bold text-sm">{tx("Incorrect", "غير صحيح")}</span></>}</div>
              <p className="text-[#C4B9A8] font-['Work_Sans'] text-sm">{tx(s.explanation, s.explanationAr)}</p>
              <button onClick={handleNext} className="mt-3 flex items-center gap-2 px-5 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E]">{current < SCENARIOS.length - 1 ? tx("Next Scenario", "السيناريو التالي") : tx("See Results", "عرض النتائج")} <ArrowRight className="w-4 h-4" /></button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
