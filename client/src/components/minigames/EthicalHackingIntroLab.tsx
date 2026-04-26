/*
  Ethical Hacking Introduction Lab
  Students match hacking phases to their descriptions and classify hacker types.
  Maps to CEH Day 1: Introduction to Ethical Hacking & Information Security
  Bilingual: English + Arabic
*/

import { useState, useCallback } from "react";
import { Shield, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Question = {
  id: number;
  question: string;
  questionAr: string;
  options: string[];
  optionsAr: string[];
  correctIndex: number;
  explanation: string;
  explanationAr: string;
};

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Which phase of ethical hacking involves gathering information about the target without direct interaction?",
    questionAr: "ما هي مرحلة الاختراق الأخلاقي التي تتضمن جمع معلومات عن الهدف دون تفاعل مباشر؟",
    options: ["Scanning", "Passive Reconnaissance", "Gaining Access", "Maintaining Access"],
    optionsAr: ["المسح", "الاستطلاع السلبي", "الحصول على الوصول", "الحفاظ على الوصول"],
    correctIndex: 1,
    explanation: "Passive reconnaissance (footprinting) gathers information from public sources like WHOIS, social media, and DNS records without alerting the target.",
    explanationAr: "الاستطلاع السلبي يجمع المعلومات من مصادر عامة مثل WHOIS ووسائل التواصل الاجتماعي وسجلات DNS دون تنبيه الهدف.",
  },
  {
    id: 2,
    question: "A hacker who breaks into systems without authorization for personal gain is classified as a:",
    questionAr: "المخترق الذي يقتحم الأنظمة بدون إذن لتحقيق مكاسب شخصية يُصنف كـ:",
    options: ["White Hat", "Gray Hat", "Black Hat", "Script Kiddie"],
    optionsAr: ["القبعة البيضاء", "القبعة الرمادية", "القبعة السوداء", "مبتدئ النصوص"],
    correctIndex: 2,
    explanation: "Black hat hackers operate illegally, breaking into systems without permission for malicious purposes or personal gain.",
    explanationAr: "مخترقو القبعة السوداء يعملون بشكل غير قانوني، يقتحمون الأنظمة بدون إذن لأغراض خبيثة أو مكاسب شخصية.",
  },
  {
    id: 3,
    question: "What is the correct order of the five phases of ethical hacking?",
    questionAr: "ما هو الترتيب الصحيح للمراحل الخمس للاختراق الأخلاقي؟",
    options: [
      "Reconnaissance, Scanning, Gaining Access, Maintaining Access, Covering Tracks",
      "Scanning, Reconnaissance, Gaining Access, Covering Tracks, Maintaining Access",
      "Gaining Access, Scanning, Reconnaissance, Maintaining Access, Covering Tracks",
      "Reconnaissance, Gaining Access, Scanning, Covering Tracks, Maintaining Access",
    ],
    optionsAr: [
      "الاستطلاع، المسح، الحصول على الوصول، الحفاظ على الوصول، إخفاء الآثار",
      "المسح، الاستطلاع، الحصول على الوصول، إخفاء الآثار، الحفاظ على الوصول",
      "الحصول على الوصول، المسح، الاستطلاع، الحفاظ على الوصول، إخفاء الآثار",
      "الاستطلاع، الحصول على الوصول، المسح، إخفاء الآثار، الحفاظ على الوصول",
    ],
    correctIndex: 0,
    explanation: "The five phases follow a logical progression: Reconnaissance (gather info) > Scanning (identify targets) > Gaining Access (exploit) > Maintaining Access (persist) > Covering Tracks (hide evidence).",
    explanationAr: "المراحل الخمس تتبع تسلسلاً منطقياً: الاستطلاع > المسح > الحصول على الوصول > الحفاظ على الوصول > إخفاء الآثار.",
  },
  {
    id: 4,
    question: "Which legal framework requires ethical hackers to obtain written authorization before testing?",
    questionAr: "أي إطار قانوني يتطلب من المخترقين الأخلاقيين الحصول على إذن كتابي قبل الاختبار؟",
    options: ["GDPR only", "Rules of Engagement (ROE)", "PCI DSS", "ISO 27001"],
    optionsAr: ["GDPR فقط", "قواعد الاشتباك (ROE)", "PCI DSS", "ISO 27001"],
    correctIndex: 1,
    explanation: "Rules of Engagement (ROE) define the scope, boundaries, and authorization for penetration testing. Written authorization protects both the tester and the organization.",
    explanationAr: "قواعد الاشتباك تحدد النطاق والحدود والتفويض لاختبار الاختراق. التفويض الكتابي يحمي كلاً من المختبر والمنظمة.",
  },
  {
    id: 5,
    question: "What distinguishes a penetration test from a vulnerability assessment?",
    questionAr: "ما الذي يميز اختبار الاختراق عن تقييم الثغرات؟",
    options: [
      "Penetration tests only use automated tools",
      "Vulnerability assessments actively exploit weaknesses",
      "Penetration tests attempt to actively exploit discovered vulnerabilities",
      "There is no difference between them",
    ],
    optionsAr: [
      "اختبارات الاختراق تستخدم أدوات آلية فقط",
      "تقييمات الثغرات تستغل نقاط الضعف بنشاط",
      "اختبارات الاختراق تحاول استغلال الثغرات المكتشفة بنشاط",
      "لا يوجد فرق بينهما",
    ],
    correctIndex: 2,
    explanation: "A vulnerability assessment identifies and reports weaknesses, while a penetration test goes further by actively attempting to exploit those vulnerabilities to demonstrate real-world impact.",
    explanationAr: "تقييم الثغرات يحدد ويبلغ عن نقاط الضعف، بينما اختبار الاختراق يذهب أبعد من ذلك بمحاولة استغلال تلك الثغرات لإظهار التأثير الفعلي.",
  },
];

export default function EthicalHackingIntroLab({ onComplete }: { onComplete?: (score?: number) => void }) {
  const { tx } = useLabLang();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const q = QUESTIONS[current];

  const handleSubmit = useCallback(() => {
    if (selected === null) return;
    setShowResult(true);
    if (selected === q.correctIndex) setScore(s => s + 1);
  }, [selected, q]);

  const handleNext = useCallback(() => {
    if (current < QUESTIONS.length - 1) {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowResult(false);
    } else {
      setCompleted(true);
    }
  }, [current]);

  const reset = useCallback(() => {
    setCurrent(0); setSelected(null); setShowResult(false); setScore(0); setCompleted(false);
  }, []);

  return (
    <div className="bg-[#F5F0E8] border-2 border-[#227C82]/40 p-6 my-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Shield className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Ethical Hacking Fundamentals", "أساسيات الاختراق الأخلاقي")}</h3>
          <p className="text-[#0C3C3C] font-['Work_Sans'] text-xs">{tx("Question", "سؤال")} {current + 1}/{QUESTIONS.length} - {tx("Score", "النتيجة")}: {score}/{QUESTIONS.length}</p>
        </div>
      </div>

      {completed ? (
        <div className="text-center py-8">
          <Shield className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#0C3C3C] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Lab Complete!", "اكتمل المختبر!")}</h4>
          <p className="text-[#0C3C3C] font-['Work_Sans'] mb-4">{tx(`You scored ${score}/${QUESTIONS.length}. Solid ethical hacking foundations!`, `حصلت على ${score}/${QUESTIONS.length}. أساسيات قوية في الاختراق الأخلاقي!`)}</p>
          <button onClick={reset} className="flex items-center gap-2 mx-auto px-6 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all">
            <RotateCcw className="w-4 h-4" /> {tx("Play Again", "ابدأ من جديد")}
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white/50 border border-[#D4CBBA] p-4 mb-4">
            <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm font-medium mb-4">{tx(q.question, q.questionAr)}</p>
            <div className="space-y-2">
              {(tx(q.options.join("|"), q.optionsAr.join("|"))).split("|").map((opt, i) => (
                <button key={i} onClick={() => !showResult && setSelected(i)}
                  className={`w-full text-start p-3 border font-['Work_Sans'] text-sm transition-all ${
                    showResult
                      ? i === q.correctIndex ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#0C3C3C]" : i === selected ? "border-red-500/50 bg-red-500/10 text-red-600" : "border-[#D4CBBA] text-[#0C3C3C]/50"
                      : selected === i ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#0C3C3C]" : "border-[#D4CBBA] text-[#0C3C3C] hover:border-[#D4AF37]/50"
                  }`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {!showResult ? (
            <button onClick={handleSubmit} disabled={selected === null} className="px-6 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all disabled:opacity-40">
              {tx("Submit Answer", "إرسال الإجابة")}
            </button>
          ) : (
            <div className="bg-[#164A4A]/10 border border-[#D4CBBA] p-4">
              <div className="flex items-center gap-2 mb-2">
                {selected === q.correctIndex ? <><CheckCircle className="w-5 h-5 text-[#D4AF37]" /><span className="text-[#D4AF37] font-['Montserrat'] font-bold text-sm">{tx("Correct!", "صحيح!")}</span></> : <><XCircle className="w-5 h-5 text-red-500" /><span className="text-red-500 font-['Montserrat'] font-bold text-sm">{tx("Incorrect", "غير صحيح")}</span></>}
              </div>
              <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm">{tx(q.explanation, q.explanationAr)}</p>
              <button onClick={handleNext} className="mt-3 flex items-center gap-2 px-5 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all">
                {current < QUESTIONS.length - 1 ? tx("Next Question", "السؤال التالي") : tx("See Results", "عرض النتائج")} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
