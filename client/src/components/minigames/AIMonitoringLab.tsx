/*
  AI Monitoring Lab - SecAI+ Day 5
  Students configure monitoring for AI systems in production.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { Activity, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [
  {
    "id": 1,
    "scenario": "Your AI model's accuracy has dropped from 94% to 78% over the past month, but no code changes were made. What is the most likely cause?",
    "scenarioAr": "دقة نموذج الذكاء الاصطناعي انخفضت من 94% إلى 78% خلال الشهر الماضي، لكن لم تُجرَ تغييرات على الكود. ما السبب الأكثر احتمالاً؟",
    "correct": "Data drift — the input data distribution has shifted from training data",
    "options": [
      "Hardware failure on the inference server",
      "Data drift — the input data distribution has shifted from training data",
      "A bug introduced in the latest deployment",
      "The model was accidentally retrained"
    ],
    "optionsAr": [
      "عطل في أجهزة خادم الاستدلال",
      "انحراف البيانات — توزيع بيانات الإدخال تحول عن بيانات التدريب",
      "خطأ أُدخل في آخر نشر",
      "النموذج أُعيد تدريبه عن طريق الخطأ"
    ],
    "explanation": "Data drift (also called concept drift) occurs when real-world data patterns change over time, making the model's training data no longer representative. This is the #1 cause of gradual accuracy degradation without code changes. Monitoring for drift requires tracking input distributions and model performance metrics continuously.",
    "explanationAr": "انحراف البيانات (المعروف أيضاً بانحراف المفهوم) يحدث عندما تتغير أنماط البيانات في العالم الحقيقي بمرور الوقت، مما يجعل بيانات تدريب النموذج لم تعد تمثيلية. هذا السبب الأول لتدهور الدقة التدريجي بدون تغييرات في الكود."
  },
  {
    "id": 2,
    "scenario": "You notice that your AI fraud detection system is flagging 10x more transactions as fraudulent this week compared to the baseline. No model updates were deployed. What should you investigate?",
    "scenarioAr": "لاحظت أن نظام كشف الاحتيال بالذكاء الاصطناعي يُعلّم 10 أضعاف المعاملات كاحتيالية هذا الأسبوع مقارنة بخط الأساس. لم يتم نشر تحديثات للنموذج. ما الذي يجب التحقيق فيه؟",
    "correct": "Check for data pipeline issues AND a real spike in fraud activity",
    "options": [
      "Immediately retrain the model with new data",
      "Check for data pipeline issues AND a real spike in fraud activity",
      "Disable the model and switch to manual review",
      "Increase the fraud threshold to reduce alerts"
    ],
    "optionsAr": [
      "إعادة تدريب النموذج فوراً ببيانات جديدة",
      "التحقق من مشاكل خط أنابيب البيانات وارتفاع حقيقي في نشاط الاحتيال",
      "تعطيل النموذج والتبديل للمراجعة اليدوية",
      "زيادة عتبة الاحتيال لتقليل التنبيهات"
    ],
    "explanation": "A 10x spike could be either a data pipeline issue (corrupted/malformed input data causing false positives) or a genuine fraud wave. Investigate both before taking action. Retraining on potentially corrupted data would make things worse. Raising thresholds could miss real fraud.",
    "explanationAr": "ارتفاع 10 أضعاف يمكن أن يكون إما مشكلة في خط أنابيب البيانات (بيانات إدخال تالفة/مشوهة تسبب إيجابيات كاذبة) أو موجة احتيال حقيقية. تحقق من كليهما قبل اتخاذ إجراء."
  },
  {
    "id": 3,
    "scenario": "Your organization wants to implement comprehensive AI monitoring. Which metrics should be tracked for a production AI system?",
    "scenarioAr": "منظمتك تريد تنفيذ مراقبة شاملة للذكاء الاصطناعي. أي مقاييس يجب تتبعها لنظام ذكاء اصطناعي في الإنتاج؟",
    "correct": "Model accuracy + Input data drift + Prediction latency + Fairness metrics",
    "options": [
      "Only model accuracy and response time",
      "Model accuracy + Input data drift + Prediction latency + Fairness metrics",
      "Server CPU and memory usage only",
      "Number of API calls per day"
    ],
    "optionsAr": [
      "دقة النموذج ووقت الاستجابة فقط",
      "دقة النموذج + انحراف بيانات الإدخال + زمن التنبؤ + مقاييس العدالة",
      "استخدام CPU والذاكرة للخادم فقط",
      "عدد استدعاءات API يومياً"
    ],
    "explanation": "Comprehensive AI monitoring requires: accuracy/performance metrics (is the model still performing well?), data drift detection (has the input distribution changed?), latency monitoring (are predictions fast enough?), and fairness metrics (is the model treating all groups equitably?). Infrastructure metrics alone miss AI-specific issues.",
    "explanationAr": "المراقبة الشاملة للذكاء الاصطناعي تتطلب: مقاييس الدقة/الأداء، كشف انحراف البيانات، مراقبة زمن الاستجابة، ومقاييس العدالة. مقاييس البنية التحتية وحدها تفوت مشاكل خاصة بالذكاء الاصطناعي."
  }
];

export default function AIMonitoringLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Activity className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("AI Monitoring Lab", "مختبر مراقبة الذكاء الاصطناعي")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <Activity className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Monitoring Expert!", "خبير المراقبة!")}</h4>
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
