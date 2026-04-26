/*
  AI Security Controls Lab - SecAI+ Day 4
  Students select appropriate security controls for AI systems.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { Shield, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [
  {
    "id": 1,
    "scenario": "An AI chatbot deployed for customer service is generating responses that include fragments of other customers' personal data from its training set. Which control addresses this?",
    "scenarioAr": "روبوت محادثة ذكاء اصطناعي منشور لخدمة العملاء يولد ردوداً تتضمن أجزاء من البيانات الشخصية لعملاء آخرين من مجموعة تدريبه. أي ضابط يعالج هذا؟",
    "correct": "Output filtering + Differential privacy in training",
    "options": [
      "Rate limiting on API calls",
      "Output filtering + Differential privacy in training",
      "Stronger encryption for the database",
      "Adding a CAPTCHA to the chatbot"
    ],
    "optionsAr": [
      "تحديد معدل استدعاءات API",
      "تصفية المخرجات + الخصوصية التفاضلية في التدريب",
      "تشفير أقوى لقاعدة البيانات",
      "إضافة CAPTCHA للروبوت"
    ],
    "explanation": "Output filtering catches PII in responses before they reach users. Differential privacy during training adds mathematical noise to prevent the model from memorizing individual records. Together they address both the symptom (leaking data) and root cause (memorization).",
    "explanationAr": "تصفية المخرجات تلتقط PII في الردود قبل وصولها للمستخدمين. الخصوصية التفاضلية أثناء التدريب تضيف ضوضاء رياضية لمنع النموذج من حفظ السجلات الفردية."
  },
  {
    "id": 2,
    "scenario": "Your organization's AI model makes loan approval decisions. Regulators require you to explain WHY each application was approved or denied. Which AI security control is needed?",
    "scenarioAr": "نموذج الذكاء الاصطناعي في منظمتك يتخذ قرارات الموافقة على القروض. يطلب المنظمون شرح لماذا تمت الموافقة أو الرفض لكل طلب. أي ضابط أمان ذكاء اصطناعي مطلوب؟",
    "correct": "Model explainability / Interpretability controls (XAI)",
    "options": [
      "Model explainability / Interpretability controls (XAI)",
      "Stronger model encryption",
      "More training data",
      "Faster inference hardware"
    ],
    "optionsAr": [
      "ضوابط قابلية تفسير النموذج (XAI)",
      "تشفير نموذج أقوى",
      "المزيد من بيانات التدريب",
      "أجهزة استدلال أسرع"
    ],
    "explanation": "Explainable AI (XAI) techniques like SHAP values, LIME, or attention visualization provide human-readable explanations for model decisions. This is required by regulations like GDPR (right to explanation) and fair lending laws.",
    "explanationAr": "تقنيات الذكاء الاصطناعي القابل للتفسير (XAI) مثل قيم SHAP و LIME أو تصور الانتباه توفر تفسيرات مقروءة بشرياً لقرارات النموذج. هذا مطلوب بموجب لوائح مثل GDPR (حق التفسير) وقوانين الإقراض العادل."
  },
  {
    "id": 3,
    "scenario": "A competitor is suspected of sending adversarial inputs to your image classification API to reverse-engineer the model architecture and steal intellectual property. What control should you implement?",
    "scenarioAr": "يُشتبه أن منافساً يرسل مدخلات عدائية لواجهة برمجة تصنيف الصور الخاصة بك لعكس هندسة بنية النموذج وسرقة الملكية الفكرية. ما الضابط الذي يجب تنفيذه؟",
    "correct": "Query rate limiting + Input anomaly detection + Model watermarking",
    "options": [
      "Upgrade to a larger model",
      "Query rate limiting + Input anomaly detection + Model watermarking",
      "Add more training data",
      "Switch to a different cloud provider"
    ],
    "optionsAr": [
      "الترقية لنموذج أكبر",
      "تحديد معدل الاستعلام + كشف شذوذ المدخلات + وسم النموذج",
      "إضافة المزيد من بيانات التدريب",
      "التبديل لمزود سحابي مختلف"
    ],
    "explanation": "Rate limiting prevents mass querying needed for model extraction. Input anomaly detection flags adversarial patterns. Model watermarking embeds traceable markers that prove ownership if the model is stolen. Together they form a defense against model theft attacks.",
    "explanationAr": "تحديد المعدل يمنع الاستعلام الجماعي اللازم لاستخراج النموذج. كشف شذوذ المدخلات يُعلّم الأنماط العدائية. وسم النموذج يضمّن علامات قابلة للتتبع تثبت الملكية إذا سُرق النموذج."
  }
];

export default function AISecurityControlsLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("AI Security Controls Lab", "مختبر ضوابط أمان الذكاء الاصطناعي")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <Shield className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("AI Security Expert!", "خبير أمان الذكاء الاصطناعي!")}</h4>
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
