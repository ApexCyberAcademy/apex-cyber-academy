/*
  AI-Enhanced Attacks Lab - SecAI+ Day 8
  Students identify AI-enhanced attack techniques and defenses.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { Zap, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [
  {
    "id": 1,
    "scenario": "Attackers use a deepfake video of your CEO in a video call, instructing the CFO to wire $25 million to a 'new acquisition account.' The CFO believes it's real. What is the PRIMARY defense?",
    "scenarioAr": "مهاجمون يستخدمون فيديو مزيف عميق لمديرك التنفيذي في مكالمة فيديو، يوجهون المدير المالي لتحويل 25 مليون دولار لحساب 'استحواذ جديد'. المدير المالي يعتقد أنه حقيقي. ما هو الدفاع الأساسي؟",
    "correct": "Out-of-band verification protocol for high-value transactions",
    "options": [
      "Better video conferencing encryption",
      "Out-of-band verification protocol for high-value transactions",
      "AI deepfake detection software",
      "Employee awareness training only"
    ],
    "optionsAr": [
      "تشفير أفضل لمؤتمرات الفيديو",
      "بروتوكول تحقق خارج النطاق للمعاملات عالية القيمة",
      "برنامج كشف التزييف العميق بالذكاء الاصطناعي",
      "تدريب توعية الموظفين فقط"
    ],
    "explanation": "Out-of-band verification (e.g., calling the CEO on a known phone number, requiring dual authorization) is the strongest defense because it doesn't rely on detecting the deepfake. Deepfake detection is an arms race — detection tools lag behind generation tools. Process controls (verification protocols) are more reliable than technical detection.",
    "explanationAr": "التحقق خارج النطاق (مثل الاتصال بالمدير التنفيذي على رقم هاتف معروف، طلب تفويض مزدوج) هو أقوى دفاع لأنه لا يعتمد على كشف التزييف العميق. كشف التزييف العميق سباق تسلح — أدوات الكشف تتأخر عن أدوات التوليد."
  },
  {
    "id": 2,
    "scenario": "An AI-powered phishing campaign generates highly personalized emails by scraping targets' LinkedIn profiles, recent posts, and company news. The emails have zero grammatical errors and reference real events. How does this differ from traditional phishing?",
    "scenarioAr": "حملة تصيد مدعومة بالذكاء الاصطناعي تولد رسائل بريد إلكتروني مخصصة للغاية بجمع ملفات LinkedIn للأهداف والمنشورات الأخيرة وأخبار الشركة. الرسائل بدون أخطاء نحوية وتشير لأحداث حقيقية. كيف يختلف هذا عن التصيد التقليدي؟",
    "correct": "AI enables mass-personalized spear phishing at scale — previously only possible for high-value targets",
    "options": [
      "It doesn't — all phishing is the same",
      "AI enables mass-personalized spear phishing at scale — previously only possible for high-value targets",
      "The only difference is better grammar",
      "AI phishing is easier to detect because it's automated"
    ],
    "optionsAr": [
      "لا يختلف — كل التصيد متشابه",
      "الذكاء الاصطناعي يمكّن التصيد الموجه المخصص على نطاق واسع — كان ممكناً سابقاً فقط للأهداف عالية القيمة",
      "الفرق الوحيد هو قواعد نحوية أفضل",
      "تصيد الذكاء الاصطناعي أسهل في الكشف لأنه آلي"
    ],
    "explanation": "Traditional spear phishing requires manual research per target — expensive and slow. AI automates the research AND personalization, enabling spear-phishing quality at mass-phishing scale. This eliminates the traditional trade-off between personalization and volume, making it far more dangerous.",
    "explanationAr": "التصيد الموجه التقليدي يتطلب بحثاً يدوياً لكل هدف — مكلف وبطيء. الذكاء الاصطناعي يؤتمت البحث والتخصيص، مما يمكّن جودة التصيد الموجه على نطاق التصيد الجماعي."
  },
  {
    "id": 3,
    "scenario": "An attacker uses AI to automatically discover zero-day vulnerabilities in your web application by fuzzing with intelligent input generation. What is the best defensive approach?",
    "scenarioAr": "مهاجم يستخدم الذكاء الاصطناعي لاكتشاف ثغرات يوم صفر تلقائياً في تطبيق الويب الخاص بك عن طريق التشويش بتوليد مدخلات ذكية. ما أفضل نهج دفاعي؟",
    "correct": "Use AI-powered defensive fuzzing yourself + Bug bounty program + Defense in depth",
    "options": [
      "Block all automated traffic",
      "Use AI-powered defensive fuzzing yourself + Bug bounty program + Defense in depth",
      "Only rely on traditional penetration testing",
      "Wait for vulnerabilities to be reported"
    ],
    "optionsAr": [
      "حظر كل حركة المرور الآلية",
      "استخدام التشويش الدفاعي المدعوم بالذكاء الاصطناعي بنفسك + برنامج مكافآت الثغرات + الدفاع متعدد الطبقات",
      "الاعتماد فقط على اختبار الاختراق التقليدي",
      "انتظار الإبلاغ عن الثغرات"
    ],
    "explanation": "Fight AI with AI — use the same AI fuzzing techniques defensively to find vulnerabilities before attackers do. Bug bounty programs add human creativity. Defense in depth (WAF, input validation, sandboxing) provides layers even if a vulnerability is found. Blocking automated traffic is impractical and easily bypassed.",
    "explanationAr": "حارب الذكاء الاصطناعي بالذكاء الاصطناعي — استخدم نفس تقنيات التشويش بالذكاء الاصطناعي دفاعياً لإيجاد الثغرات قبل المهاجمين. برامج مكافآت الثغرات تضيف إبداعاً بشرياً. الدفاع متعدد الطبقات يوفر طبقات حتى لو وُجدت ثغرة."
  }
];

export default function AIEnhancedAttacksLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Zap className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("AI-Enhanced Attacks Lab", "مختبر الهجمات المعززة بالذكاء الاصطناعي")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <Zap className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Defense Specialist!", "أخصائي الدفاع!")}</h4>
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
