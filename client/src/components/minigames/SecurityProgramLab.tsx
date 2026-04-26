/*
  Security Program Lab - CISM Day 4
  Students design security program components.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { ClipboardList, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [{"id": 1, "scenario": "A new CISM is tasked with developing an information security program. What should be the FIRST step?", "scenarioAr": "مدير أمن معلومات جديد مكلف بتطوير برنامج أمن المعلومات. ما الخطوة الأولى؟", "correct": "Understand business objectives and perform a gap analysis of current security posture", "options": ["Purchase the latest security tools", "Understand business objectives and perform a gap analysis of current security posture", "Hire a large security team", "Implement multi-factor authentication everywhere"], "optionsAr": ["شراء أحدث أدوات الأمن", "فهم أهداف العمل وإجراء تحليل فجوات للوضع الأمني الحالي", "توظيف فريق أمن كبير", "تنفيذ المصادقة متعددة العوامل في كل مكان"], "explanation": "Before building a security program, you must understand what you're protecting and why. Start with: 1) Understand business objectives and risk appetite, 2) Assess current security posture (gap analysis), 3) Identify regulatory requirements, 4) Define security strategy aligned with business goals. Only then can you design appropriate controls and allocate resources effectively.", "explanationAr": "قبل بناء برنامج أمن، يجب فهم ما تحميه ولماذا. ابدأ بـ: 1) فهم أهداف العمل وشهية المخاطر، 2) تقييم الوضع الأمني الحالي، 3) تحديد المتطلبات التنظيمية."}, {"id": 2, "scenario": "Which framework is MOST commonly used as a foundation for building an information security management system (ISMS)?", "scenarioAr": "أي إطار عمل يُستخدم بشكل أكثر شيوعاً كأساس لبناء نظام إدارة أمن المعلومات (ISMS)؟", "correct": "ISO/IEC 27001 — the international standard for ISMS", "options": ["COBIT — focused on IT governance", "ISO/IEC 27001 — the international standard for ISMS", "PMBOK — project management framework", "ITIL — IT service management"], "optionsAr": ["COBIT — يركز على حوكمة تكنولوجيا المعلومات", "ISO/IEC 27001 — المعيار الدولي لنظام إدارة أمن المعلومات", "PMBOK — إطار إدارة المشاريع", "ITIL — إدارة خدمات تكنولوجيا المعلومات"], "explanation": "ISO/IEC 27001 is the globally recognized standard for establishing, implementing, maintaining, and continually improving an ISMS. It uses a risk-based approach and follows the Plan-Do-Check-Act (PDCA) cycle. ISO 27002 provides the control guidance. Organizations can be certified against 27001, demonstrating compliance to stakeholders.", "explanationAr": "ISO/IEC 27001 هو المعيار المعترف به عالمياً لإنشاء وتنفيذ وصيانة وتحسين نظام إدارة أمن المعلومات باستمرار. يستخدم نهجاً قائماً على المخاطر ويتبع دورة PDCA."}, {"id": 3, "scenario": "What is the PRIMARY purpose of security metrics in an information security program?", "scenarioAr": "ما هو الغرض الأساسي من مقاييس الأمن في برنامج أمن المعلومات؟", "correct": "To measure the effectiveness of security controls and demonstrate value to stakeholders", "options": ["To justify purchasing more security tools", "To measure the effectiveness of security controls and demonstrate value to stakeholders", "To compare the organization with competitors", "To satisfy auditor requirements only"], "optionsAr": ["لتبرير شراء المزيد من أدوات الأمن", "لقياس فعالية ضوابط الأمن وإظهار القيمة لأصحاب المصلحة", "لمقارنة المنظمة بالمنافسين", "لتلبية متطلبات المدقق فقط"], "explanation": "Security metrics serve multiple purposes: measure control effectiveness (are controls working?), demonstrate ROI to management, identify trends and areas for improvement, support risk-based decision making, and provide evidence for compliance. Good metrics are SMART: Specific, Measurable, Achievable, Relevant, and Time-bound.", "explanationAr": "مقاييس الأمن تخدم أغراضاً متعددة: قياس فعالية الضوابط، إظهار العائد على الاستثمار للإدارة، تحديد الاتجاهات ومجالات التحسين، ودعم اتخاذ القرارات القائمة على المخاطر."}];

export default function SecurityProgramLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><ClipboardList className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Security Program Lab", "مختبر برنامج الأمن")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <ClipboardList className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Program Architect!", "مهندس البرنامج!")}</h4>
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
