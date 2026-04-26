/*
  InfoSec Governance Lab - CISM Day 1
  Students evaluate information security governance scenarios.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { Building2, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [{"id": 1, "scenario": "The board of directors asks the CISO to present the information security strategy. What should be the PRIMARY focus of this presentation?", "scenarioAr": "مجلس الإدارة يطلب من مسؤول أمن المعلومات تقديم استراتيجية أمن المعلومات. ما الذي يجب أن يكون التركيز الأساسي لهذا العرض؟", "correct": "How security initiatives align with and enable business objectives", "options": ["Technical details of firewall configurations", "How security initiatives align with and enable business objectives", "A list of all security incidents from the past year", "The budget needed for new security tools"], "optionsAr": ["التفاصيل التقنية لتكوينات جدار الحماية", "كيف تتوافق مبادرات الأمن مع أهداف العمل وتمكنها", "قائمة بجميع حوادث الأمن من العام الماضي", "الميزانية المطلوبة لأدوات أمن جديدة"], "explanation": "Board-level presentations must focus on business alignment. The board cares about how security enables business strategy, manages risk to acceptable levels, and provides return on investment. Technical details should be abstracted to business impact language. This is a core CISM principle: security exists to serve business objectives.", "explanationAr": "العروض على مستوى مجلس الإدارة يجب أن تركز على التوافق مع الأعمال. المجلس يهتم بكيفية تمكين الأمن لاستراتيجية الأعمال وإدارة المخاطر لمستويات مقبولة."}, {"id": 2, "scenario": "Which of the following BEST describes the role of an information security steering committee?", "scenarioAr": "أي مما يلي يصف بشكل أفضل دور لجنة توجيه أمن المعلومات؟", "correct": "Providing strategic direction and ensuring alignment between security and business goals", "options": ["Implementing security patches on servers", "Providing strategic direction and ensuring alignment between security and business goals", "Conducting penetration testing", "Writing firewall rules"], "optionsAr": ["تنفيذ تصحيحات الأمان على الخوادم", "توفير التوجيه الاستراتيجي وضمان التوافق بين الأمن وأهداف العمل", "إجراء اختبارات الاختراق", "كتابة قواعد جدار الحماية"], "explanation": "The steering committee is a governance body that provides strategic oversight. It typically includes representatives from IT, legal, HR, finance, and business units. Its role is to prioritize security initiatives, allocate resources, review policies, and ensure security strategy supports business objectives. It does NOT perform operational tasks.", "explanationAr": "لجنة التوجيه هي هيئة حوكمة توفر الرقابة الاستراتيجية. تشمل عادة ممثلين من تكنولوجيا المعلومات والقانون والموارد البشرية والمالية ووحدات الأعمال."}, {"id": 3, "scenario": "An organization is developing its information security policy framework. What is the correct hierarchy from highest to lowest level?", "scenarioAr": "منظمة تطور إطار سياسة أمن المعلومات الخاص بها. ما هو التسلسل الهرمي الصحيح من الأعلى إلى الأدنى؟", "correct": "Policies → Standards → Procedures → Guidelines", "options": ["Guidelines → Procedures → Standards → Policies", "Procedures → Policies → Guidelines → Standards", "Policies → Standards → Procedures → Guidelines", "Standards → Policies → Procedures → Guidelines"], "optionsAr": ["إرشادات ← إجراءات ← معايير ← سياسات", "إجراءات ← سياسات ← إرشادات ← معايير", "سياسات ← معايير ← إجراءات ← إرشادات", "معايير ← سياسات ← إجراءات ← إرشادات"], "explanation": "The policy framework hierarchy: Policies (high-level, mandatory, approved by management), Standards (specific mandatory requirements), Procedures (step-by-step instructions), Guidelines (recommended practices, optional). Each level provides increasing detail and decreasing authority.", "explanationAr": "التسلسل الهرمي لإطار السياسات: السياسات (عالية المستوى، إلزامية)، المعايير (متطلبات إلزامية محددة)، الإجراءات (تعليمات خطوة بخطوة)، الإرشادات (ممارسات موصى بها، اختيارية)."}];

export default function InfoSecGovernanceLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Building2 className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("InfoSec Governance Lab", "مختبر حوكمة أمن المعلومات")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <Building2 className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Governance Expert!", "خبير الحوكمة!")}</h4>
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
