/*
  Programming Concepts Lab - Tech+ Day 7
  Students identify programming concepts and development methodologies.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { Code, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [
  {
    "id": 1,
    "scenario": "A development team wants to deliver working software in 2-week cycles, with daily standups and regular retrospectives. Which methodology are they following?",
    "scenarioAr": "فريق تطوير يريد تسليم برمجيات عاملة في دورات أسبوعين، مع اجتماعات يومية ومراجعات منتظمة. أي منهجية يتبعون؟",
    "correct": "Agile/Scrum — iterative development with sprints and ceremonies",
    "options": [
      "Waterfall — sequential phases",
      "Agile/Scrum — iterative development with sprints and ceremonies",
      "DevOps — continuous integration/deployment",
      "Extreme Programming (XP) — pair programming focus"
    ],
    "optionsAr": [
      "الشلال — مراحل متتابعة",
      "Agile/Scrum — تطوير تكراري مع سباقات واحتفالات",
      "DevOps — تكامل/نشر مستمر",
      "البرمجة المتطرفة (XP) — تركيز على البرمجة الزوجية"
    ],
    "explanation": "Scrum (an Agile framework) uses fixed-length sprints (typically 2 weeks), daily standups (15-min sync meetings), sprint reviews (demo working software), and retrospectives (improve the process). It's the most widely adopted Agile methodology.",
    "explanationAr": "Scrum (إطار عمل Agile) يستخدم سباقات بطول ثابت (عادة أسبوعين)، اجتماعات يومية (اجتماعات مزامنة 15 دقيقة)، مراجعات السباق (عرض البرمجيات العاملة)، ومراجعات استرجاعية (تحسين العملية)."
  },
  {
    "id": 2,
    "scenario": "What is the difference between compiled and interpreted programming languages?",
    "scenarioAr": "ما الفرق بين لغات البرمجة المترجمة والمفسرة؟",
    "correct": "Compiled languages are translated to machine code before execution; interpreted languages are executed line-by-line at runtime",
    "options": [
      "Compiled languages are faster to write; interpreted are faster to run",
      "Compiled languages are translated to machine code before execution; interpreted languages are executed line-by-line at runtime",
      "There is no practical difference",
      "Compiled languages only work on Windows; interpreted work everywhere"
    ],
    "optionsAr": [
      "اللغات المترجمة أسرع في الكتابة؛ المفسرة أسرع في التشغيل",
      "اللغات المترجمة تُترجم لكود الآلة قبل التنفيذ؛ المفسرة تُنفذ سطراً بسطر أثناء التشغيل",
      "لا يوجد فرق عملي",
      "اللغات المترجمة تعمل فقط على ويندوز؛ المفسرة تعمل في كل مكان"
    ],
    "explanation": "Compiled languages (C, C++, Rust) are translated entirely to machine code by a compiler before execution — resulting in faster runtime performance. Interpreted languages (Python, JavaScript) are executed line-by-line by an interpreter at runtime — offering more flexibility and faster development cycles but typically slower execution.",
    "explanationAr": "اللغات المترجمة (C، C++، Rust) تُترجم بالكامل لكود الآلة بواسطة مترجم قبل التنفيذ — مما ينتج أداء تشغيل أسرع. اللغات المفسرة (Python، JavaScript) تُنفذ سطراً بسطر بواسطة مفسر أثناء التشغيل — توفر مرونة أكثر ودورات تطوير أسرع لكن تنفيذ أبطأ عادة."
  },
  {
    "id": 3,
    "scenario": "A developer writes code that checks if a user's age is over 18 before allowing access to a feature. What programming concept is this?",
    "scenarioAr": "مطور يكتب كوداً يتحقق إذا كان عمر المستخدم أكبر من 18 قبل السماح بالوصول لميزة. ما مفهوم البرمجة هذا؟",
    "correct": "Conditional logic (if/else statement)",
    "options": [
      "Loop/iteration",
      "Conditional logic (if/else statement)",
      "Variable declaration",
      "Function definition"
    ],
    "optionsAr": [
      "حلقة/تكرار",
      "منطق شرطي (عبارة if/else)",
      "إعلان متغير",
      "تعريف دالة"
    ],
    "explanation": "Conditional logic (if/else, switch/case) allows programs to make decisions based on conditions. 'If age > 18, allow access; else, deny access' is a classic conditional statement. It's one of the fundamental building blocks of programming alongside variables, loops, and functions.",
    "explanationAr": "المنطق الشرطي (if/else، switch/case) يسمح للبرامج باتخاذ قرارات بناءً على شروط. 'إذا العمر > 18، اسمح بالوصول؛ وإلا، ارفض الوصول' هي عبارة شرطية كلاسيكية. إنها أحد اللبنات الأساسية للبرمجة."
  }
];

export default function ProgrammingConceptsLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Code className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Programming Concepts Lab", "مختبر مفاهيم البرمجة")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <Code className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Dev Concepts Pro!", "محترف مفاهيم التطوير!")}</h4>
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
