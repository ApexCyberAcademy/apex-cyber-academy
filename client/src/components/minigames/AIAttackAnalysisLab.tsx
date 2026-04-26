/*
  AI Attack Analysis Lab - SecAI+ Day 6
  Students analyze AI-specific attacks and identify compensating controls.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { AlertTriangle, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [
  {
    "id": 1,
    "scenario": "An attacker adds imperceptible noise to stop sign images, causing an autonomous vehicle's AI to classify them as speed limit signs. What type of attack is this?",
    "scenarioAr": "مهاجم يضيف ضوضاء غير محسوسة لصور علامات التوقف، مما يجعل ذكاء اصطناعي لمركبة ذاتية القيادة يصنفها كعلامات حد السرعة. ما نوع هذا الهجوم؟",
    "correct": "Adversarial example / Evasion attack",
    "options": [
      "Data poisoning attack",
      "Adversarial example / Evasion attack",
      "Model inversion attack",
      "Membership inference attack"
    ],
    "optionsAr": [
      "هجوم تسميم البيانات",
      "مثال عدائي / هجوم التهرب",
      "هجوم عكس النموذج",
      "هجوم استدلال العضوية"
    ],
    "explanation": "Adversarial examples add carefully crafted perturbations to inputs that are imperceptible to humans but cause AI misclassification. This is an evasion attack because it happens at inference time (not training). It's one of the most dangerous AI attacks for safety-critical systems like autonomous vehicles.",
    "explanationAr": "الأمثلة العدائية تضيف اضطرابات مصممة بعناية للمدخلات غير محسوسة للبشر لكنها تسبب تصنيفاً خاطئاً من الذكاء الاصطناعي. هذا هجوم تهرب لأنه يحدث في وقت الاستدلال (ليس التدريب)."
  },
  {
    "id": 2,
    "scenario": "A malicious insider at a data labeling company intentionally mislabels 5% of training images for a medical AI system, causing it to miss certain cancer indicators. What attack is this?",
    "scenarioAr": "شخص داخلي خبيث في شركة تصنيف بيانات يتعمد تصنيف 5% من صور التدريب بشكل خاطئ لنظام ذكاء اصطناعي طبي، مما يجعله يفوت مؤشرات سرطان معينة. ما هذا الهجوم؟",
    "correct": "Data poisoning / Training data manipulation",
    "options": [
      "Adversarial example attack",
      "Data poisoning / Training data manipulation",
      "Model extraction attack",
      "Backdoor attack"
    ],
    "optionsAr": [
      "هجوم مثال عدائي",
      "تسميم البيانات / التلاعب ببيانات التدريب",
      "هجوم استخراج النموذج",
      "هجوم الباب الخلفي"
    ],
    "explanation": "Data poisoning corrupts the training data to degrade model performance or introduce targeted biases. Unlike adversarial examples (which attack at inference), poisoning attacks happen during training. The 5% mislabeling rate is enough to significantly impact model accuracy for specific cases while being hard to detect in quality checks.",
    "explanationAr": "تسميم البيانات يُفسد بيانات التدريب لتدهور أداء النموذج أو إدخال تحيزات مستهدفة. على عكس الأمثلة العدائية (التي تهاجم عند الاستدلال)، هجمات التسميم تحدث أثناء التدريب."
  },
  {
    "id": 3,
    "scenario": "An attacker queries your AI API thousands of times with carefully chosen inputs, then uses the responses to build a functionally equivalent copy of your proprietary model. What attack is this?",
    "scenarioAr": "مهاجم يستعلم من واجهة برمجة الذكاء الاصطناعي آلاف المرات بمدخلات مختارة بعناية، ثم يستخدم الردود لبناء نسخة مكافئة وظيفياً من نموذجك الخاص. ما هذا الهجوم؟",
    "correct": "Model extraction / Model stealing attack",
    "options": [
      "Prompt injection",
      "Model extraction / Model stealing attack",
      "Data exfiltration",
      "Side-channel attack"
    ],
    "optionsAr": [
      "حقن الأوامر",
      "هجوم استخراج/سرقة النموذج",
      "تسريب البيانات",
      "هجوم القناة الجانبية"
    ],
    "explanation": "Model extraction (model stealing) uses the target model as an oracle — querying it systematically to train a substitute model that mimics its behavior. Defenses include rate limiting, query pattern detection, watermarking, and limiting output confidence scores.",
    "explanationAr": "استخراج النموذج (سرقة النموذج) يستخدم النموذج المستهدف كمرجع — يستعلم منه بشكل منهجي لتدريب نموذج بديل يحاكي سلوكه. الدفاعات تشمل تحديد المعدل وكشف أنماط الاستعلام والوسم وتحديد درجات ثقة المخرجات."
  }
];

export default function AIAttackAnalysisLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("AI Attack Analysis Lab", "مختبر تحليل هجمات الذكاء الاصطناعي")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <AlertTriangle className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Attack Analyst!", "محلل الهجمات!")}</h4>
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
