/*
  CISM Review Lab - CISM Day 14
  Comprehensive review across all four CISM domains.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { Award, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [{"id": 1, "scenario": "A CISM candidate is asked: What is the MOST important factor in ensuring the success of an information security program?", "scenarioAr": "مرشح CISM يُسأل: ما هو أهم عامل في ضمان نجاح برنامج أمن المعلومات؟", "correct": "Senior management support and commitment", "options": ["The latest security technology", "Senior management support and commitment", "A large security budget", "Hiring certified professionals"], "optionsAr": ["أحدث تكنولوجيا الأمن", "دعم والتزام الإدارة العليا", "ميزانية أمن كبيرة", "توظيف محترفين معتمدين"], "explanation": "This is perhaps the most fundamental CISM concept. Without senior management support, security programs lack: adequate funding, organizational authority, policy enforcement power, and cultural influence. Management commitment manifests as: active participation in governance, adequate resource allocation, visible sponsorship, and holding people accountable for security responsibilities.", "explanationAr": "هذا ربما أهم مفهوم في CISM. بدون دعم الإدارة العليا، برامج الأمن تفتقر للتمويل الكافي والسلطة التنظيمية."}, {"id": 2, "scenario": "An organization wants to measure the maturity of its information security program. Which model is commonly used for this purpose?", "scenarioAr": "منظمة تريد قياس نضج برنامج أمن المعلومات. أي نموذج يُستخدم عادة لهذا الغرض؟", "correct": "Capability Maturity Model (CMM) with levels from Initial (1) to Optimizing (5)", "options": ["The Waterfall model", "Capability Maturity Model (CMM) with levels from Initial (1) to Optimizing (5)", "The Agile framework", "The OSI model"], "optionsAr": ["نموذج الشلال", "نموذج نضج القدرات (CMM) بمستويات من الأولي (1) إلى المحسّن (5)", "إطار Agile", "نموذج OSI"], "explanation": "CMM levels: 1) Initial (ad hoc, chaotic), 2) Repeatable (basic processes established), 3) Defined (standardized processes), 4) Managed (measured and controlled), 5) Optimizing (continuous improvement). This helps organizations benchmark their current state, set improvement targets, and demonstrate progress to stakeholders. COBIT also provides a maturity model specific to IT governance.", "explanationAr": "مستويات CMM: 1) أولي (عشوائي)، 2) قابل للتكرار (عمليات أساسية)، 3) معرّف (عمليات موحدة)، 4) مُدار (مقاس ومتحكم به)، 5) محسّن (تحسين مستمر)."}, {"id": 3, "scenario": "In the context of CISM, what is the relationship between information security governance and information security management?", "scenarioAr": "في سياق CISM، ما هي العلاقة بين حوكمة أمن المعلومات وإدارة أمن المعلومات؟", "correct": "Governance sets direction and oversight (WHAT); management implements and operates (HOW)", "options": ["They are the same thing", "Governance sets direction and oversight (WHAT); management implements and operates (HOW)", "Management is more important than governance", "Governance is only for large enterprises"], "optionsAr": ["هما نفس الشيء", "الحوكمة تحدد الاتجاه والرقابة (ماذا)؛ الإدارة تنفذ وتشغل (كيف)", "الإدارة أهم من الحوكمة", "الحوكمة فقط للمؤسسات الكبيرة"], "explanation": "Governance (board/executive level): sets strategic direction, defines risk appetite, ensures compliance, allocates resources, provides oversight. Management (operational level): implements policies, operates controls, manages day-to-day security, reports to governance. Think of it as: governance asks 'Are we doing the right things?' while management asks 'Are we doing things right?' Both are essential and complementary.", "explanationAr": "الحوكمة (مستوى المجلس/التنفيذي): تحدد الاتجاه الاستراتيجي، تعرّف شهية المخاطر. الإدارة (المستوى التشغيلي): تنفذ السياسات، تشغل الضوابط."}];

export default function CISMReviewLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Award className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("CISM Review Lab", "مختبر مراجعة CISM")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <Award className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("CISM Ready!", "جاهز لـ CISM!")}</h4>
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
