/*
  AI Compliance Lab - SecAI+ Day 10
  Students match AI regulations and compliance frameworks to scenarios.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { Scale, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [
  {
    "id": 1,
    "scenario": "Your company deploys an AI system that automatically screens job applicants and rejects candidates. Under the EU AI Act, what risk category does this fall into?",
    "scenarioAr": "شركتك تنشر نظام ذكاء اصطناعي يفرز المتقدمين للوظائف تلقائياً ويرفض المرشحين. بموجب قانون الذكاء الاصطناعي للاتحاد الأوروبي، ما فئة المخاطر التي ينتمي إليها هذا؟",
    "correct": "High-risk AI system — requires conformity assessment and human oversight",
    "options": [
      "Minimal risk — no special requirements",
      "Limited risk — transparency obligations only",
      "High-risk AI system — requires conformity assessment and human oversight",
      "Unacceptable risk — must be banned"
    ],
    "optionsAr": [
      "مخاطر دنيا — لا متطلبات خاصة",
      "مخاطر محدودة — التزامات شفافية فقط",
      "نظام ذكاء اصطناعي عالي المخاطر — يتطلب تقييم المطابقة والإشراف البشري",
      "مخاطر غير مقبولة — يجب حظره"
    ],
    "explanation": "Under the EU AI Act, AI systems used in employment (recruitment, screening, hiring decisions) are classified as high-risk. They require: conformity assessments, human oversight mechanisms, transparency documentation, data governance, and ongoing monitoring. They're not banned but heavily regulated.",
    "explanationAr": "بموجب قانون الذكاء الاصطناعي للاتحاد الأوروبي، أنظمة الذكاء الاصطناعي المستخدمة في التوظيف (التوظيف، الفرز، قرارات التعيين) تُصنف كعالية المخاطر. تتطلب: تقييمات مطابقة، آليات إشراف بشري، توثيق شفافية، حوكمة بيانات، ومراقبة مستمرة."
  },
  {
    "id": 2,
    "scenario": "A patient asks a hospital to explain how the AI diagnostic system determined their treatment recommendation. Under GDPR, does the patient have this right?",
    "scenarioAr": "مريض يطلب من مستشفى شرح كيف حدد نظام التشخيص بالذكاء الاصطناعي توصية علاجه. بموجب GDPR، هل لدى المريض هذا الحق؟",
    "correct": "Yes — GDPR Article 22 grants the right to explanation for automated decisions",
    "options": [
      "No — AI decisions are proprietary trade secrets",
      "Yes — GDPR Article 22 grants the right to explanation for automated decisions",
      "Only if the patient pays for the explanation",
      "Only if the decision was wrong"
    ],
    "optionsAr": [
      "لا — قرارات الذكاء الاصطناعي أسرار تجارية خاصة",
      "نعم — المادة 22 من GDPR تمنح حق التفسير للقرارات الآلية",
      "فقط إذا دفع المريض مقابل التفسير",
      "فقط إذا كان القرار خاطئاً"
    ],
    "explanation": "GDPR Article 22 gives individuals the right not to be subject to solely automated decisions that significantly affect them, and the right to obtain meaningful information about the logic involved. For healthcare AI, this means patients can request explanations of how the AI reached its recommendation.",
    "explanationAr": "المادة 22 من GDPR تمنح الأفراد الحق في عدم الخضوع لقرارات آلية بالكامل تؤثر عليهم بشكل كبير، والحق في الحصول على معلومات ذات مغزى حول المنطق المتضمن. لذكاء اصطناعي الرعاية الصحية، هذا يعني أن المرضى يمكنهم طلب تفسيرات لكيفية وصول الذكاء الاصطناعي لتوصيته."
  },
  {
    "id": 3,
    "scenario": "Your organization is creating an AI ethics board. What should be its PRIMARY responsibilities?",
    "scenarioAr": "منظمتك تنشئ مجلس أخلاقيات الذكاء الاصطناعي. ما يجب أن تكون مسؤولياته الأساسية؟",
    "correct": "Review AI projects for bias, fairness, transparency, and societal impact before deployment",
    "options": [
      "Approve all AI project budgets",
      "Review AI projects for bias, fairness, transparency, and societal impact before deployment",
      "Only handle AI-related legal disputes",
      "Market the company's AI ethics commitment"
    ],
    "optionsAr": [
      "الموافقة على جميع ميزانيات مشاريع الذكاء الاصطناعي",
      "مراجعة مشاريع الذكاء الاصطناعي للتحيز والعدالة والشفافية والتأثير المجتمعي قبل النشر",
      "معالجة النزاعات القانونية المتعلقة بالذكاء الاصطناعي فقط",
      "تسويق التزام الشركة بأخلاقيات الذكاء الاصطناعي"
    ],
    "explanation": "An AI ethics board's primary role is pre-deployment review of AI systems for ethical concerns: bias and fairness, transparency and explainability, privacy implications, societal impact, and alignment with organizational values. It should have authority to block or require changes to AI projects that don't meet ethical standards.",
    "explanationAr": "الدور الأساسي لمجلس أخلاقيات الذكاء الاصطناعي هو المراجعة قبل النشر لأنظمة الذكاء الاصطناعي للمخاوف الأخلاقية: التحيز والعدالة، الشفافية وقابلية التفسير، تأثيرات الخصوصية، التأثير المجتمعي، والتوافق مع قيم المنظمة."
  }
];

export default function AIComplianceLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("AI Compliance Lab", "مختبر امتثال الذكاء الاصطناعي")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <Scale className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Compliance Expert!", "خبير الامتثال!")}</h4>
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
