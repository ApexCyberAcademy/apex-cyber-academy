/*
  Incident Response Planning Lab - CISM Day 7
  Students develop incident response plans and procedures.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { FileWarning, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [{"id": 1, "scenario": "What are the correct phases of the NIST Incident Response lifecycle in order?", "scenarioAr": "ما هي المراحل الصحيحة لدورة حياة الاستجابة للحوادث وفقاً لـ NIST بالترتيب؟", "correct": "Preparation → Detection & Analysis → Containment, Eradication & Recovery → Post-Incident Activity", "options": ["Detection → Response → Recovery → Lessons Learned", "Preparation → Detection & Analysis → Containment, Eradication & Recovery → Post-Incident Activity", "Identification → Containment → Eradication → Recovery", "Alert → Investigate → Remediate → Close"], "optionsAr": ["الكشف ← الاستجابة ← الاستعادة ← الدروس المستفادة", "التحضير ← الكشف والتحليل ← الاحتواء والاستئصال والاستعادة ← نشاط ما بعد الحادث", "التعريف ← الاحتواء ← الاستئصال ← الاستعادة", "تنبيه ← تحقيق ← معالجة ← إغلاق"], "explanation": "NIST SP 800-61 defines four phases: 1) Preparation (plans, tools, training), 2) Detection & Analysis (identify and validate incidents), 3) Containment, Eradication & Recovery (stop spread, remove threat, restore systems), 4) Post-Incident Activity (lessons learned, improve processes). The cycle is iterative — lessons learned feed back into preparation.", "explanationAr": "NIST SP 800-61 يحدد أربع مراحل: 1) التحضير، 2) الكشف والتحليل، 3) الاحتواء والاستئصال والاستعادة، 4) نشاط ما بعد الحادث. الدورة تكرارية."}, {"id": 2, "scenario": "During incident response, who should be the FIRST person notified when a potential data breach is detected?", "scenarioAr": "أثناء الاستجابة للحوادث، من يجب أن يكون أول شخص يتم إخطاره عند اكتشاف خرق بيانات محتمل؟", "correct": "The designated incident response team lead, as defined in the IR plan", "options": ["The CEO immediately", "The media/PR department", "The designated incident response team lead, as defined in the IR plan", "Law enforcement"], "optionsAr": ["الرئيس التنفيذي فوراً", "قسم الإعلام/العلاقات العامة", "قائد فريق الاستجابة للحوادث المعين، كما هو محدد في خطة الاستجابة", "جهات إنفاذ القانون"], "explanation": "The IR plan should define a clear escalation path. The first notification goes to the IR team lead who can assess severity and activate appropriate response. They then escalate to management, legal, PR, and regulators as needed based on severity classification. Premature notification to executives or media before assessment can cause unnecessary panic.", "explanationAr": "خطة الاستجابة يجب أن تحدد مسار تصعيد واضح. الإخطار الأول يذهب لقائد فريق الاستجابة الذي يمكنه تقييم الخطورة وتفعيل الاستجابة المناسبة."}, {"id": 3, "scenario": "What is the PRIMARY purpose of conducting a tabletop exercise for incident response?", "scenarioAr": "ما هو الغرض الأساسي من إجراء تمرين طاولة للاستجابة للحوادث؟", "correct": "To test the IR plan and identify gaps in a low-risk discussion format", "options": ["To practice technical skills on live systems", "To test the IR plan and identify gaps in a low-risk discussion format", "To satisfy compliance requirements only", "To train new employees on company policies"], "optionsAr": ["لممارسة المهارات التقنية على أنظمة حية", "لاختبار خطة الاستجابة وتحديد الفجوات في شكل مناقشة منخفضة المخاطر", "لتلبية متطلبات الامتثال فقط", "لتدريب الموظفين الجدد على سياسات الشركة"], "explanation": "Tabletop exercises are discussion-based simulations where team members walk through a hypothetical incident scenario. Benefits: tests decision-making processes, identifies gaps in the IR plan, clarifies roles and responsibilities, improves communication paths, and builds team familiarity — all without the risk or cost of a full simulation.", "explanationAr": "تمارين الطاولة هي محاكاة قائمة على المناقشة حيث يمر أعضاء الفريق عبر سيناريو حادث افتراضي. الفوائد: اختبار عمليات اتخاذ القرار، تحديد الفجوات في خطة الاستجابة."}];

export default function IncidentResponsePlanLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><FileWarning className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("IR Planning Lab", "مختبر تخطيط الاستجابة للحوادث")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <FileWarning className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("IR Planner!", "مخطط استجابة للحوادث!")}</h4>
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
