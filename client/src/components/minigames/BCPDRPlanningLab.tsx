/*
  BCP/DR Planning Lab - CISM Day 11
  Students develop business continuity and disaster recovery plans.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { LifeBuoy, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [{"id": 1, "scenario": "A Business Impact Analysis (BIA) identifies that the order processing system has an RTO of 4 hours and an RPO of 1 hour. What does this mean?", "scenarioAr": "تحليل تأثير الأعمال (BIA) يحدد أن نظام معالجة الطلبات لديه RTO 4 ساعات و RPO ساعة واحدة. ماذا يعني هذا؟", "correct": "System must be restored within 4 hours, and maximum acceptable data loss is 1 hour of transactions", "options": ["The system can be down for 4 days", "System must be restored within 4 hours, and maximum acceptable data loss is 1 hour of transactions", "Backups run every 4 hours", "The system needs 1 hour of maintenance daily"], "optionsAr": ["النظام يمكن أن يكون معطلاً لمدة 4 أيام", "يجب استعادة النظام خلال 4 ساعات، والحد الأقصى المقبول لفقدان البيانات هو ساعة واحدة من المعاملات", "النسخ الاحتياطية تعمل كل 4 ساعات", "النظام يحتاج ساعة واحدة من الصيانة يومياً"], "explanation": "RTO (Recovery Time Objective) = maximum acceptable downtime. The system must be operational within 4 hours of a disruption. RPO (Recovery Point Objective) = maximum acceptable data loss. Backups must be frequent enough that no more than 1 hour of data is lost. This means backups must run at least every hour, and DR infrastructure must support 4-hour recovery.", "explanationAr": "RTO (هدف وقت الاستعادة) = الحد الأقصى المقبول لوقت التوقف. RPO (هدف نقطة الاستعادة) = الحد الأقصى المقبول لفقدان البيانات. هذا يعني أن النسخ الاحتياطية يجب أن تعمل كل ساعة على الأقل."}, {"id": 2, "scenario": "Which disaster recovery site type provides the fastest recovery but at the highest cost?", "scenarioAr": "أي نوع من مواقع التعافي من الكوارث يوفر أسرع استعادة ولكن بأعلى تكلفة؟", "correct": "Hot site — fully equipped, data replicated in real-time, ready to take over immediately", "options": ["Cold site — empty facility with power and connectivity", "Warm site — partially equipped, needs some configuration", "Hot site — fully equipped, data replicated in real-time, ready to take over immediately", "Mobile site — portable data center"], "optionsAr": ["موقع بارد — منشأة فارغة مع طاقة واتصال", "موقع دافئ — مجهز جزئياً، يحتاج بعض التكوين", "موقع ساخن — مجهز بالكامل، بيانات منسوخة في الوقت الفعلي، جاهز للتولي فوراً", "موقع متنقل — مركز بيانات محمول"], "explanation": "Hot site: fully operational duplicate of primary site with real-time data replication. Recovery time: minutes to hours. Cost: highest (maintaining duplicate infrastructure). Warm site: has hardware but needs data restoration. Recovery: hours to days. Cold site: empty facility, needs everything. Recovery: days to weeks. Choose based on RTO requirements and budget.", "explanationAr": "الموقع الساخن: نسخة مكررة تعمل بالكامل من الموقع الأساسي مع نسخ بيانات في الوقت الفعلي. وقت الاستعادة: دقائق إلى ساعات. التكلفة: الأعلى."}, {"id": 3, "scenario": "How often should a BCP/DR plan be tested and what is the MOST effective testing method?", "scenarioAr": "كم مرة يجب اختبار خطة BCP/DR وما هي طريقة الاختبار الأكثر فعالية؟", "correct": "At least annually, with full-scale exercises being the most effective (but tabletops for regular testing)", "options": ["Only after a real disaster occurs", "At least annually, with full-scale exercises being the most effective (but tabletops for regular testing)", "Every 5 years is sufficient", "Only when auditors request it"], "optionsAr": ["فقط بعد حدوث كارثة حقيقية", "مرة واحدة سنوياً على الأقل، مع التمارين الكاملة كونها الأكثر فعالية (لكن تمارين الطاولة للاختبار المنتظم)", "كل 5 سنوات كافية", "فقط عندما يطلب المدققون ذلك"], "explanation": "BCP/DR plans should be tested at least annually, with additional tests after significant changes. Testing types (increasing complexity): 1) Checklist review, 2) Tabletop exercise, 3) Walkthrough/simulation, 4) Parallel test (DR site activated alongside primary), 5) Full interruption test (primary shut down, DR takes over). Full-scale tests are most effective but risky; combine methods throughout the year.", "explanationAr": "خطط BCP/DR يجب اختبارها مرة واحدة سنوياً على الأقل. أنواع الاختبار: 1) مراجعة القائمة، 2) تمرين طاولة، 3) محاكاة، 4) اختبار متوازي، 5) اختبار انقطاع كامل."}];

export default function BCPDRPlanningLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><LifeBuoy className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("BCP/DR Lab", "مختبر استمرارية الأعمال")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <LifeBuoy className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("BCP Expert!", "خبير استمرارية الأعمال!")}</h4>
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
