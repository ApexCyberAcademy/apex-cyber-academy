/*
  Component Identifier Lab - Tech+ Day 2
  Students identify internal computer components and their functions.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { Cpu, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [
  {
    "id": 1,
    "scenario": "A user wants to upgrade their computer to run multiple virtual machines simultaneously. They currently have 8GB RAM and an i5 processor. What should be upgraded FIRST?",
    "scenarioAr": "مستخدم يريد ترقية حاسوبه لتشغيل عدة أجهزة افتراضية في وقت واحد. لديه حالياً 8GB RAM ومعالج i5. ما الذي يجب ترقيته أولاً؟",
    "correct": "RAM — virtual machines are memory-intensive; upgrade to 32GB or more",
    "options": [
      "Graphics card — VMs need GPU acceleration",
      "RAM — virtual machines are memory-intensive; upgrade to 32GB or more",
      "Hard drive to SSD — faster storage helps VMs",
      "Monitor — larger display for multiple VM windows"
    ],
    "optionsAr": [
      "بطاقة الرسومات — الأجهزة الافتراضية تحتاج تسريع GPU",
      "RAM — الأجهزة الافتراضية كثيفة الذاكرة؛ الترقية لـ 32GB أو أكثر",
      "القرص الصلب لـ SSD — تخزين أسرع يساعد الأجهزة الافتراضية",
      "الشاشة — شاشة أكبر لنوافذ الأجهزة الافتراضية المتعددة"
    ],
    "explanation": "Each VM needs its own allocated RAM. With 8GB, you can barely run 2 VMs alongside the host OS. Upgrading to 32GB+ allows running 4-6 VMs comfortably. RAM is the #1 bottleneck for virtualization, followed by CPU cores and storage speed.",
    "explanationAr": "كل جهاز افتراضي يحتاج ذاكرة RAM مخصصة. مع 8GB، بالكاد يمكنك تشغيل جهازين افتراضيين مع نظام التشغيل المضيف. الترقية لـ 32GB+ تسمح بتشغيل 4-6 أجهزة افتراضية بشكل مريح."
  },
  {
    "id": 2,
    "scenario": "A computer is randomly shutting down during heavy gaming sessions. The system runs fine during normal office work. What is the most likely cause?",
    "scenarioAr": "حاسوب ينطفئ عشوائياً أثناء جلسات الألعاب الثقيلة. النظام يعمل بشكل جيد أثناء العمل المكتبي العادي. ما السبب الأكثر احتمالاً؟",
    "correct": "Overheating — CPU/GPU thermal throttling and shutdown under heavy load",
    "options": [
      "Faulty RAM module",
      "Overheating — CPU/GPU thermal throttling and shutdown under heavy load",
      "Corrupted operating system files",
      "Insufficient hard drive space"
    ],
    "optionsAr": [
      "وحدة RAM معيبة",
      "ارتفاع الحرارة — خنق حراري لـ CPU/GPU وإيقاف تحت الحمل الثقيل",
      "ملفات نظام تشغيل تالفة",
      "مساحة قرص صلب غير كافية"
    ],
    "explanation": "Random shutdowns only during heavy load (gaming) strongly indicate thermal issues. CPUs and GPUs have thermal protection that forces shutdown when temperatures exceed safe limits. Check: thermal paste condition, fan operation, dust buildup, and case airflow.",
    "explanationAr": "الإيقاف العشوائي فقط أثناء الحمل الثقيل (الألعاب) يشير بقوة لمشاكل حرارية. المعالجات وبطاقات الرسومات لديها حماية حرارية تفرض الإيقاف عندما تتجاوز الحرارة الحدود الآمنة."
  },
  {
    "id": 3,
    "scenario": "You need to install a new NVMe SSD in a desktop computer. Which slot on the motherboard do you use?",
    "scenarioAr": "تحتاج لتثبيت SSD NVMe جديد في حاسوب مكتبي. أي فتحة على اللوحة الأم تستخدم؟",
    "correct": "M.2 slot — NVMe drives use the M.2 form factor with PCIe interface",
    "options": [
      "SATA port — same as traditional hard drives",
      "M.2 slot — NVMe drives use the M.2 form factor with PCIe interface",
      "PCIe x16 slot — the large graphics card slot",
      "USB 3.0 header on the motherboard"
    ],
    "optionsAr": [
      "منفذ SATA — نفس الأقراص الصلبة التقليدية",
      "فتحة M.2 — محركات NVMe تستخدم عامل شكل M.2 مع واجهة PCIe",
      "فتحة PCIe x16 — فتحة بطاقة الرسومات الكبيرة",
      "رأس USB 3.0 على اللوحة الأم"
    ],
    "explanation": "NVMe (Non-Volatile Memory Express) SSDs use the M.2 slot on the motherboard, connecting via PCIe lanes for speeds up to 7,000 MB/s. This is much faster than SATA SSDs (550 MB/s). The M.2 slot is a small, flat connector typically located near the CPU socket.",
    "explanationAr": "محركات NVMe SSD تستخدم فتحة M.2 على اللوحة الأم، متصلة عبر ممرات PCIe بسرعات تصل إلى 7,000 ميجابايت/ثانية. هذا أسرع بكثير من SATA SSD (550 ميجابايت/ثانية)."
  }
];

export default function ComponentIdentifierLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Cpu className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Component Identifier Lab", "مختبر تحديد المكونات")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <Cpu className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Hardware Expert!", "خبير الأجهزة!")}</h4>
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
