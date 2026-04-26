/*
  Compliance Framework Lab - CISM Day 12
  Students navigate regulatory compliance requirements.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { Scale, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [{"id": 1, "scenario": "An organization processes both healthcare data (HIPAA) and credit card data (PCI DSS). How should the security manager handle overlapping compliance requirements?", "scenarioAr": "منظمة تعالج بيانات رعاية صحية (HIPAA) وبيانات بطاقات ائتمان (PCI DSS). كيف يجب على مدير الأمن التعامل مع متطلبات الامتثال المتداخلة؟", "correct": "Map controls to a unified framework that satisfies both standards simultaneously", "options": ["Implement separate, duplicate controls for each standard", "Map controls to a unified framework that satisfies both standards simultaneously", "Focus only on the stricter standard", "Outsource compliance to a third party"], "optionsAr": ["تنفيذ ضوابط منفصلة ومكررة لكل معيار", "ربط الضوابط بإطار موحد يلبي كلا المعيارين في وقت واحد", "التركيز فقط على المعيار الأكثر صرامة", "الاستعانة بمصادر خارجية للامتثال لطرف ثالث"], "explanation": "A unified control framework maps common requirements across multiple standards (encryption satisfies both HIPAA and PCI DSS). This approach: reduces duplicate effort, ensures comprehensive coverage, simplifies audit preparation, and is more cost-effective. Frameworks like NIST CSF or ISO 27001 can serve as the unified baseline with mappings to specific regulations.", "explanationAr": "إطار ضوابط موحد يربط المتطلبات المشتركة عبر معايير متعددة. هذا النهج: يقلل الجهد المكرر، يضمن التغطية الشاملة، يبسط إعداد التدقيق، وأكثر فعالية من حيث التكلفة."}, {"id": 2, "scenario": "What is the PRIMARY difference between a compliance audit and a security assessment?", "scenarioAr": "ما هو الفرق الأساسي بين تدقيق الامتثال وتقييم الأمن؟", "correct": "Compliance audit checks adherence to specific standards; security assessment evaluates overall security posture", "options": ["They are the same thing", "Compliance audit checks adherence to specific standards; security assessment evaluates overall security posture", "Compliance audits are internal only; security assessments are external only", "Compliance audits are free; security assessments are expensive"], "optionsAr": ["هما نفس الشيء", "تدقيق الامتثال يتحقق من الالتزام بمعايير محددة؛ تقييم الأمن يقيم الوضع الأمني العام", "تدقيقات الامتثال داخلية فقط؛ تقييمات الأمن خارجية فقط", "تدقيقات الامتثال مجانية؛ تقييمات الأمن مكلفة"], "explanation": "Compliance audit: verifies adherence to specific regulatory requirements (PCI DSS, HIPAA, SOX). It's a pass/fail assessment against defined criteria. Security assessment: evaluates the overall effectiveness of security controls, identifies vulnerabilities, and provides recommendations. An organization can be compliant but still insecure (compliance is the minimum bar, not the goal).", "explanationAr": "تدقيق الامتثال: يتحقق من الالتزام بمتطلبات تنظيمية محددة. إنه تقييم نجاح/فشل مقابل معايير محددة. تقييم الأمن: يقيم الفعالية العامة لضوابط الأمن."}, {"id": 3, "scenario": "A new data privacy regulation requires organizations to report data breaches within 72 hours. What should the security manager do FIRST?", "scenarioAr": "تنظيم جديد لخصوصية البيانات يتطلب من المنظمات الإبلاغ عن خروقات البيانات خلال 72 ساعة. ماذا يجب على مدير الأمن فعله أولاً؟", "correct": "Update the incident response plan to include the 72-hour notification requirement and identify responsible parties", "options": ["Wait until a breach occurs to figure out the process", "Update the incident response plan to include the 72-hour notification requirement and identify responsible parties", "Hire a lawyer immediately", "Send an email to all employees about the new regulation"], "optionsAr": ["الانتظار حتى يحدث خرق لمعرفة العملية", "تحديث خطة الاستجابة للحوادث لتشمل متطلب الإخطار خلال 72 ساعة وتحديد الأطراف المسؤولة", "توظيف محامٍ فوراً", "إرسال بريد إلكتروني لجميع الموظفين حول التنظيم الجديد"], "explanation": "Proactive preparation is key. Update the IR plan to: 1) Define what constitutes a reportable breach under the new regulation, 2) Establish the 72-hour notification workflow, 3) Identify who must be notified (regulator, affected individuals), 4) Designate responsible parties for each step, 5) Create notification templates, 6) Test the process via tabletop exercise.", "explanationAr": "التحضير الاستباقي هو المفتاح. تحديث خطة الاستجابة لتشمل: 1) تعريف ما يشكل خرقاً يجب الإبلاغ عنه، 2) إنشاء سير عمل الإخطار خلال 72 ساعة، 3) تحديد من يجب إخطاره."}];

export default function ComplianceFrameworkLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Scale className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Compliance Lab", "مختبر الامتثال")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <Scale className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Compliance Pro!", "محترف امتثال!")}</h4>
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
