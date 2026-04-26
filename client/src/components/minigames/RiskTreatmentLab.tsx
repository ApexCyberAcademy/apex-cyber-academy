/*
  Risk Treatment Lab - CISM Day 3
  Students select appropriate risk treatment strategies.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { Shield, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [{"id": 1, "scenario": "A company determines that the cost of mitigating a specific risk exceeds the potential loss. The risk has low probability and moderate impact. What is the MOST appropriate risk treatment?", "scenarioAr": "شركة تحدد أن تكلفة تخفيف خطر معين تتجاوز الخسارة المحتملة. المخاطر ذات احتمالية منخفضة وتأثير معتدل. ما هي معالجة المخاطر الأنسب؟", "correct": "Accept the risk — document the decision and monitor", "options": ["Implement the control regardless of cost", "Accept the risk — document the decision and monitor", "Transfer the risk to a third party", "Avoid the risk by discontinuing the business process"], "optionsAr": ["تنفيذ الضابط بغض النظر عن التكلفة", "قبول المخاطر — توثيق القرار والمراقبة", "نقل المخاطر لطرف ثالث", "تجنب المخاطر بإيقاف عملية الأعمال"], "explanation": "Risk acceptance is appropriate when the cost of mitigation exceeds the potential loss AND the risk level is within the organization's risk appetite. Key requirements: the decision must be formally documented, approved by appropriate management, and the risk must be monitored for changes. This is a valid business decision, not negligence.", "explanationAr": "قبول المخاطر مناسب عندما تتجاوز تكلفة التخفيف الخسارة المحتملة والمخاطر ضمن شهية المخاطر للمنظمة. المتطلبات الرئيسية: يجب توثيق القرار رسمياً والموافقة عليه."}, {"id": 2, "scenario": "An e-commerce company wants to protect against financial losses from credit card fraud. Which risk treatment strategy involves purchasing cyber insurance?", "scenarioAr": "شركة تجارة إلكترونية تريد الحماية من الخسائر المالية من الاحتيال ببطاقات الائتمان. أي استراتيجية معالجة مخاطر تتضمن شراء تأمين سيبراني؟", "correct": "Risk transfer — shifting the financial impact to an insurer", "options": ["Risk avoidance", "Risk mitigation", "Risk transfer — shifting the financial impact to an insurer", "Risk acceptance"], "optionsAr": ["تجنب المخاطر", "تخفيف المخاطر", "نقل المخاطر — تحويل التأثير المالي لشركة تأمين", "قبول المخاطر"], "explanation": "Risk transfer shifts the financial consequence of a risk to a third party, typically through insurance or contractual agreements. Cyber insurance transfers the financial impact but NOT the accountability — the organization remains responsible for security. Other transfer methods include outsourcing, SLAs, and indemnification clauses.", "explanationAr": "نقل المخاطر يحول العواقب المالية للمخاطر لطرف ثالث، عادة من خلال التأمين أو الاتفاقيات التعاقدية. التأمين السيبراني ينقل التأثير المالي لكن ليس المساءلة."}, {"id": 3, "scenario": "After implementing a new encryption solution, the organization still has some residual risk. What should be done with residual risk?", "scenarioAr": "بعد تنفيذ حل تشفير جديد، لا تزال المنظمة لديها بعض المخاطر المتبقية. ماذا يجب فعله بالمخاطر المتبقية؟", "correct": "Ensure residual risk falls within the organization's risk appetite and formally accept it", "options": ["Ignore it since controls are in place", "Ensure residual risk falls within the organization's risk appetite and formally accept it", "Implement additional controls until risk is zero", "Report it as a security incident"], "optionsAr": ["تجاهلها لأن الضوابط موجودة", "التأكد من أن المخاطر المتبقية تقع ضمن شهية المخاطر للمنظمة وقبولها رسمياً", "تنفيذ ضوابط إضافية حتى تصبح المخاطر صفر", "الإبلاغ عنها كحادث أمني"], "explanation": "Residual risk is the risk remaining after controls are applied. It can never be zero. The key principle: residual risk must be formally evaluated against the organization's risk appetite. If it exceeds risk appetite, additional controls are needed. If within appetite, it should be formally accepted by management and documented in the risk register.", "explanationAr": "المخاطر المتبقية هي المخاطر المتبقية بعد تطبيق الضوابط. لا يمكن أن تكون صفراً أبداً. المبدأ الرئيسي: يجب تقييم المخاطر المتبقية رسمياً مقابل شهية المخاطر للمنظمة."}];

export default function RiskTreatmentLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Shield className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Risk Treatment Lab", "مختبر معالجة المخاطر")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <Shield className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Risk Strategist!", "استراتيجي مخاطر!")}</h4>
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
