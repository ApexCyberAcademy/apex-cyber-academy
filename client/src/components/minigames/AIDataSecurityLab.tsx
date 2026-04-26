/*
  AI Data Security Lab - SecAI+ Day 2
  Students identify data security risks in AI training pipelines.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { Database, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [
  { id: 1, scenario: "Your company is training an AI model on customer support tickets. The dataset contains customer names, email addresses, and account numbers embedded in the ticket text. What is the FIRST step before training?", scenarioAr: "شركتك تدرب نموذج ذكاء اصطناعي على تذاكر دعم العملاء. مجموعة البيانات تحتوي على أسماء العملاء وعناوين البريد الإلكتروني وأرقام الحسابات المضمنة في نص التذكرة. ما هي الخطوة الأولى قبل التدريب؟", correct: "Data anonymization — remove/mask all PII before training", options: ["Encrypt the training data at rest", "Data anonymization — remove/mask all PII before training", "Add access controls to the training server", "Proceed with training — the model won't memorize individual records"], optionsAr: ["تشفير بيانات التدريب في حالة السكون", "إخفاء هوية البيانات — إزالة/إخفاء جميع PII قبل التدريب", "إضافة ضوابط وصول لخادم التدريب", "المتابعة بالتدريب — النموذج لن يحفظ السجلات الفردية"], explanation: "LLMs CAN memorize and regurgitate training data (known as data extraction attacks). PII must be anonymized/pseudonymized BEFORE training. Encryption protects data at rest but doesn't prevent the model from learning PII patterns. Access controls are important but don't address the core data leakage risk.", explanationAr: "نماذج اللغة الكبيرة يمكنها حفظ واسترجاع بيانات التدريب (المعروفة بهجمات استخراج البيانات). يجب إخفاء هوية PII قبل التدريب. التشفير يحمي البيانات في حالة السكون لكنه لا يمنع النموذج من تعلم أنماط PII." },
  { id: 2, scenario: "A data scientist discovers that the AI model's training dataset was scraped from public websites without checking copyright or licensing terms. The model is about to be deployed commercially. What is the PRIMARY risk?", scenarioAr: "اكتشف عالم بيانات أن مجموعة بيانات تدريب نموذج الذكاء الاصطناعي تم جمعها من مواقع عامة بدون التحقق من حقوق النشر أو شروط الترخيص. النموذج على وشك النشر تجارياً. ما هو الخطر الأساسي؟", correct: "Intellectual property infringement and legal liability", options: ["Data poisoning from malicious web content", "Intellectual property infringement and legal liability", "Model accuracy degradation", "Excessive storage costs"], optionsAr: ["تسميم البيانات من محتوى ويب خبيث", "انتهاك الملكية الفكرية والمسؤولية القانونية", "تدهور دقة النموذج", "تكاليف تخزين مفرطة"], explanation: "Using copyrighted data without proper licensing for commercial AI training exposes the organization to significant legal liability. Multiple lawsuits (NYT v. OpenAI, Getty v. Stability AI) demonstrate this risk. Data provenance and licensing must be verified before training.", explanationAr: "استخدام بيانات محمية بحقوق النشر بدون ترخيص مناسب لتدريب الذكاء الاصطناعي التجاري يعرض المنظمة لمسؤولية قانونية كبيرة. دعاوى قضائية متعددة توضح هذا الخطر. يجب التحقق من مصدر البيانات والترخيص قبل التدريب." },
  { id: 3, scenario: "During model evaluation, you notice the AI fraud detection system has a 95% accuracy rate overall, but only 60% accuracy for transactions from a specific geographic region. What type of data issue is this?", scenarioAr: "أثناء تقييم النموذج، لاحظت أن نظام كشف الاحتيال بالذكاء الاصطناعي لديه معدل دقة 95% إجمالاً، لكن 60% فقط للمعاملات من منطقة جغرافية محددة. ما نوع مشكلة البيانات هذه؟", correct: "Training data bias — underrepresentation of that region in training data", options: ["Data poisoning attack targeting that region", "Training data bias — underrepresentation of that region in training data", "Overfitting to the majority class", "Normal statistical variance"], optionsAr: ["هجوم تسميم بيانات يستهدف تلك المنطقة", "تحيز بيانات التدريب — نقص تمثيل تلك المنطقة في بيانات التدريب", "الإفراط في التخصيص للفئة الأغلبية", "تباين إحصائي طبيعي"], explanation: "A 35-point accuracy gap for a specific region strongly indicates training data bias — the model wasn't trained on enough representative examples from that region. This is a fairness and ethical AI concern that can lead to discriminatory outcomes. The fix requires balanced, representative training data.", explanationAr: "فجوة دقة 35 نقطة لمنطقة محددة تشير بقوة إلى تحيز بيانات التدريب — النموذج لم يُدرب على أمثلة تمثيلية كافية من تلك المنطقة. هذا مصدر قلق للعدالة والذكاء الاصطناعي الأخلاقي يمكن أن يؤدي لنتائج تمييزية." },
  { id: 4, scenario: "Your organization stores AI training datasets in a cloud storage bucket. An audit reveals the bucket has public read access and no encryption. The data includes proprietary business logic patterns. What should be done IMMEDIATELY?", scenarioAr: "منظمتك تخزن مجموعات بيانات تدريب الذكاء الاصطناعي في حاوية تخزين سحابية. كشف التدقيق أن الحاوية لديها وصول قراءة عام وبدون تشفير. البيانات تتضمن أنماط منطق أعمال خاصة. ما الذي يجب فعله فوراً؟", correct: "Revoke public access immediately, then enable encryption and audit access logs", options: ["Enable encryption first, then address access controls", "Revoke public access immediately, then enable encryption and audit access logs", "Move data to a different cloud provider", "Delete the bucket and re-upload with correct settings"], optionsAr: ["تفعيل التشفير أولاً، ثم معالجة ضوابط الوصول", "إلغاء الوصول العام فوراً، ثم تفعيل التشفير ومراجعة سجلات الوصول", "نقل البيانات لمزود سحابي مختلف", "حذف الحاوية وإعادة الرفع بالإعدادات الصحيحة"], explanation: "Public access is the most critical vulnerability — anyone can download your proprietary training data right now. Revoke public access FIRST to stop the bleeding, then enable encryption at rest, and audit access logs to determine if data was already exfiltrated. Encryption without fixing access is like locking a door that's wide open.", explanationAr: "الوصول العام هو الثغرة الأكثر خطورة — أي شخص يمكنه تنزيل بيانات التدريب الخاصة بك الآن. ألغِ الوصول العام أولاً لإيقاف النزيف، ثم فعّل التشفير في حالة السكون، وراجع سجلات الوصول لتحديد ما إذا تم تسريب البيانات بالفعل." },
];

export default function AIDataSecurityLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Database className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("AI Data Security Lab", "مختبر أمان بيانات الذكاء الاصطناعي")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <Database className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Data Security Expert!", "خبير أمان البيانات!")}</h4>
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
