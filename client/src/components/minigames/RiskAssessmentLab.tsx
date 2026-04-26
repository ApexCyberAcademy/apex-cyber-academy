/*
  Risk Assessment Lab - CISM Day 2
  Students perform risk assessment calculations and decisions.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { BarChart3, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [{"id": 1, "scenario": "An organization identifies a threat with an Annual Rate of Occurrence (ARO) of 0.5 and a Single Loss Expectancy (SLE) of $200,000. What is the Annual Loss Expectancy (ALE)?", "scenarioAr": "منظمة تحدد تهديداً بمعدل حدوث سنوي (ARO) 0.5 وتوقع خسارة مفردة (SLE) 200,000 دولار. ما هو توقع الخسارة السنوية (ALE)؟", "correct": "$100,000 — ALE = SLE × ARO = $200,000 × 0.5", "options": ["$400,000", "$200,000", "$100,000 — ALE = SLE × ARO = $200,000 × 0.5", "$50,000"], "optionsAr": ["400,000 دولار", "200,000 دولار", "100,000 دولار — ALE = SLE × ARO = 200,000 × 0.5", "50,000 دولار"], "explanation": "ALE (Annual Loss Expectancy) = SLE × ARO. SLE ($200,000) × ARO (0.5) = $100,000. This means the organization can expect to lose $100,000 per year from this threat. This calculation helps justify security spending: any control costing less than $100,000/year that eliminates this risk is cost-effective.", "explanationAr": "ALE = SLE × ARO. SLE (200,000 دولار) × ARO (0.5) = 100,000 دولار. هذا يعني أن المنظمة يمكن أن تتوقع خسارة 100,000 دولار سنوياً من هذا التهديد."}, {"id": 2, "scenario": "When should a qualitative risk assessment be preferred over a quantitative one?", "scenarioAr": "متى يجب تفضيل تقييم المخاطر النوعي على الكمي؟", "correct": "When historical data is insufficient to calculate reliable monetary values", "options": ["When exact dollar amounts are required for insurance", "When historical data is insufficient to calculate reliable monetary values", "When the board demands precise financial figures", "When regulatory compliance requires specific numbers"], "optionsAr": ["عندما تكون المبالغ الدقيقة بالدولار مطلوبة للتأمين", "عندما تكون البيانات التاريخية غير كافية لحساب قيم نقدية موثوقة", "عندما يطلب المجلس أرقاماً مالية دقيقة", "عندما يتطلب الامتثال التنظيمي أرقاماً محددة"], "explanation": "Qualitative risk assessment uses categories (High/Medium/Low) rather than monetary values. It's preferred when: historical loss data is unavailable, the organization lacks actuarial data, speed is more important than precision, or when communicating risk to non-technical stakeholders. Quantitative is better when precise financial data exists.", "explanationAr": "تقييم المخاطر النوعي يستخدم فئات (عالي/متوسط/منخفض) بدلاً من القيم النقدية. يُفضل عندما: بيانات الخسائر التاريخية غير متوفرة، أو عندما تكون السرعة أهم من الدقة."}, {"id": 3, "scenario": "What is the PRIMARY purpose of a risk register?", "scenarioAr": "ما هو الغرض الأساسي من سجل المخاطر؟", "correct": "To document identified risks, their assessment, treatment decisions, and current status", "options": ["To list all security incidents", "To document identified risks, their assessment, treatment decisions, and current status", "To track employee security training completion", "To store vulnerability scan results"], "optionsAr": ["لسرد جميع حوادث الأمن", "لتوثيق المخاطر المحددة وتقييمها وقرارات المعالجة والحالة الحالية", "لتتبع إكمال تدريب أمن الموظفين", "لتخزين نتائج فحص الثغرات"], "explanation": "A risk register is a centralized document that tracks all identified risks throughout their lifecycle. It typically includes: risk description, likelihood, impact, risk level, risk owner, treatment strategy (accept/mitigate/transfer/avoid), control measures, residual risk, and review dates. It's a living document updated regularly.", "explanationAr": "سجل المخاطر هو مستند مركزي يتتبع جميع المخاطر المحددة طوال دورة حياتها. يشمل عادة: وصف المخاطر، الاحتمالية، التأثير، مستوى المخاطر، مالك المخاطر، واستراتيجية المعالجة."}];

export default function RiskAssessmentLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><BarChart3 className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Risk Assessment Lab", "مختبر تقييم المخاطر")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <BarChart3 className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Risk Analyst!", "محلل مخاطر!")}</h4>
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
