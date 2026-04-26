/*
  Troubleshooting Methodology Lab - Tech+ Day 1
  Students apply the CompTIA troubleshooting methodology to scenarios.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { Search, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [
  {
    "id": 1,
    "scenario": "A user reports their laptop won't turn on. Following the CompTIA troubleshooting methodology, what is the FIRST step?",
    "scenarioAr": "مستخدم يبلغ أن حاسوبه المحمول لا يعمل. باتباع منهجية CompTIA لاستكشاف الأخطاء، ما هي الخطوة الأولى؟",
    "correct": "Identify the problem — gather information, question the user, verify symptoms",
    "options": [
      "Replace the battery immediately",
      "Identify the problem — gather information, question the user, verify symptoms",
      "Run hardware diagnostics",
      "Reinstall the operating system"
    ],
    "optionsAr": [
      "استبدال البطارية فوراً",
      "تحديد المشكلة — جمع المعلومات، استجواب المستخدم، التحقق من الأعراض",
      "تشغيل تشخيصات الأجهزة",
      "إعادة تثبيت نظام التشغيل"
    ],
    "explanation": "The CompTIA troubleshooting methodology starts with: 1) Identify the problem. This means gathering information from the user (When did it start? What changed?), verifying symptoms yourself, and documenting findings before jumping to solutions.",
    "explanationAr": "منهجية CompTIA لاستكشاف الأخطاء تبدأ بـ: 1) تحديد المشكلة. هذا يعني جمع المعلومات من المستخدم (متى بدأت؟ ما الذي تغير؟)، التحقق من الأعراض بنفسك، وتوثيق النتائج قبل القفز للحلول."
  },
  {
    "id": 2,
    "scenario": "After identifying that a printer is printing blank pages, you establish a theory that the ink cartridges are empty. What is the NEXT step in the methodology?",
    "scenarioAr": "بعد تحديد أن طابعة تطبع صفحات فارغة، أنشأت نظرية أن خراطيش الحبر فارغة. ما هي الخطوة التالية في المنهجية؟",
    "correct": "Test the theory to determine the cause — check ink levels",
    "options": [
      "Implement the solution — replace the cartridges",
      "Test the theory to determine the cause — check ink levels",
      "Document findings and close the ticket",
      "Escalate to a senior technician"
    ],
    "optionsAr": [
      "تنفيذ الحل — استبدال الخراطيش",
      "اختبار النظرية لتحديد السبب — فحص مستويات الحبر",
      "توثيق النتائج وإغلاق التذكرة",
      "تصعيد لفني أقدم"
    ],
    "explanation": "Step 3 is 'Test the theory to determine the cause.' Don't skip straight to implementing a fix. Check ink levels first — the blank pages could be caused by a clogged print head, driver issue, or wrong paper type, not just empty cartridges.",
    "explanationAr": "الخطوة 3 هي 'اختبار النظرية لتحديد السبب.' لا تقفز مباشرة لتنفيذ الإصلاح. افحص مستويات الحبر أولاً — الصفحات الفارغة قد تكون بسبب رأس طباعة مسدود أو مشكلة في التعريف أو نوع ورق خاطئ."
  },
  {
    "id": 3,
    "scenario": "You've fixed a network connectivity issue by replacing a faulty Ethernet cable. The user confirms internet access is working. What is the FINAL step?",
    "scenarioAr": "أصلحت مشكلة اتصال شبكة باستبدال كابل إيثرنت معيب. المستخدم يؤكد أن الوصول للإنترنت يعمل. ما هي الخطوة الأخيرة؟",
    "correct": "Document findings, actions, and outcomes for future reference",
    "options": [
      "Move on to the next ticket immediately",
      "Document findings, actions, and outcomes for future reference",
      "Run a full system scan",
      "Replace all other Ethernet cables preventatively"
    ],
    "optionsAr": [
      "الانتقال للتذكرة التالية فوراً",
      "توثيق النتائج والإجراءات والنتائج للرجوع إليها مستقبلاً",
      "تشغيل فحص كامل للنظام",
      "استبدال جميع كابلات الإيثرنت الأخرى وقائياً"
    ],
    "explanation": "The final step (Step 7) is 'Document findings, actions, and outcomes.' Documentation creates a knowledge base for future issues, helps other technicians, and provides accountability. Skipping documentation is a common mistake that leads to repeated troubleshooting.",
    "explanationAr": "الخطوة الأخيرة (الخطوة 7) هي 'توثيق النتائج والإجراءات والنتائج.' التوثيق ينشئ قاعدة معرفة للمشاكل المستقبلية، يساعد الفنيين الآخرين، ويوفر المساءلة."
  }
];

export default function TroubleshootingMethodLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Search className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Troubleshooting Methodology Lab", "مختبر منهجية استكشاف الأخطاء")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <Search className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Troubleshooting Pro!", "محترف استكشاف الأخطاء!")}</h4>
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
