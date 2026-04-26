/*
  Database & Backup Lab - Tech+ Day 8
  Students identify database types and backup strategies.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { Database, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [
  {
    "id": 1,
    "scenario": "A company stores customer orders with structured relationships between customers, products, and invoices. They need ACID compliance for financial transactions. Which database type is best?",
    "scenarioAr": "شركة تخزن طلبات العملاء مع علاقات منظمة بين العملاء والمنتجات والفواتير. يحتاجون امتثال ACID للمعاملات المالية. أي نوع قاعدة بيانات هو الأفضل؟",
    "correct": "Relational database (SQL) — structured data with ACID guarantees",
    "options": [
      "NoSQL document database",
      "Relational database (SQL) — structured data with ACID guarantees",
      "Graph database",
      "Flat file storage"
    ],
    "optionsAr": [
      "قاعدة بيانات مستندات NoSQL",
      "قاعدة بيانات علائقية (SQL) — بيانات منظمة مع ضمانات ACID",
      "قاعدة بيانات رسومية",
      "تخزين ملفات مسطحة"
    ],
    "explanation": "Relational databases (MySQL, PostgreSQL, SQL Server) are ideal for structured data with defined relationships and ACID (Atomicity, Consistency, Isolation, Durability) requirements. Financial transactions need ACID to ensure data integrity — no partial transactions or inconsistent states.",
    "explanationAr": "قواعد البيانات العلائقية (MySQL، PostgreSQL، SQL Server) مثالية للبيانات المنظمة مع علاقات محددة ومتطلبات ACID (الذرية، الاتساق، العزل، المتانة). المعاملات المالية تحتاج ACID لضمان سلامة البيانات."
  },
  {
    "id": 2,
    "scenario": "Your backup strategy uses a full backup every Sunday and incremental backups Monday through Saturday. On Wednesday, the server crashes. How many backup sets do you need to restore?",
    "scenarioAr": "استراتيجية النسخ الاحتياطي تستخدم نسخة كاملة كل أحد ونسخ تزايدية من الاثنين للسبت. يوم الأربعاء، الخادم يتعطل. كم مجموعة نسخ احتياطي تحتاج للاستعادة؟",
    "correct": "4 — Sunday full + Monday, Tuesday, Wednesday incrementals",
    "options": [
      "1 — just the latest incremental",
      "2 — Sunday full + Wednesday incremental",
      "4 — Sunday full + Monday, Tuesday, Wednesday incrementals",
      "7 — all backups from the week"
    ],
    "optionsAr": [
      "1 — فقط آخر نسخة تزايدية",
      "2 — النسخة الكاملة ليوم الأحد + النسخة التزايدية ليوم الأربعاء",
      "4 — النسخة الكاملة ليوم الأحد + النسخ التزايدية ليوم الاثنين والثلاثاء والأربعاء",
      "7 — جميع النسخ الاحتياطية من الأسبوع"
    ],
    "explanation": "Incremental backups only contain changes since the LAST backup (not since the last full). To restore, you need the full backup PLUS every incremental in sequence: Sunday full → Monday incremental → Tuesday incremental → Wednesday incremental = 4 sets. This is why differential backups (changes since last full) are sometimes preferred — they only need 2 sets.",
    "explanationAr": "النسخ التزايدية تحتوي فقط على التغييرات منذ آخر نسخة احتياطية (ليس منذ آخر نسخة كاملة). للاستعادة، تحتاج النسخة الكاملة بالإضافة لكل نسخة تزايدية بالتسلسل: الأحد الكاملة ← الاثنين التزايدية ← الثلاثاء التزايدية ← الأربعاء التزايدية = 4 مجموعات."
  },
  {
    "id": 3,
    "scenario": "What does the 3-2-1 backup rule recommend?",
    "scenarioAr": "ماذا توصي قاعدة النسخ الاحتياطي 3-2-1؟",
    "correct": "3 copies of data, on 2 different media types, with 1 copy offsite",
    "options": [
      "3 full backups per week, 2 incremental, 1 differential",
      "3 copies of data, on 2 different media types, with 1 copy offsite",
      "Backup 3 times daily, keep 2 weeks, delete after 1 month",
      "3 servers, 2 data centers, 1 cloud provider"
    ],
    "optionsAr": [
      "3 نسخ كاملة أسبوعياً، 2 تزايدية، 1 تفاضلية",
      "3 نسخ من البيانات، على نوعين مختلفين من الوسائط، مع نسخة واحدة خارج الموقع",
      "النسخ الاحتياطي 3 مرات يومياً، الاحتفاظ لأسبوعين، الحذف بعد شهر",
      "3 خوادم، مركزي بيانات، مزود سحابي واحد"
    ],
    "explanation": "The 3-2-1 rule is the gold standard for backup strategy: 3 total copies of your data (1 primary + 2 backups), stored on 2 different media types (e.g., local SSD + tape/cloud), with 1 copy stored offsite (protects against physical disasters like fire or flood).",
    "explanationAr": "قاعدة 3-2-1 هي المعيار الذهبي لاستراتيجية النسخ الاحتياطي: 3 نسخ إجمالية من بياناتك (1 أساسية + 2 احتياطية)، مخزنة على نوعين مختلفين من الوسائط، مع نسخة واحدة مخزنة خارج الموقع."
  }
];

export default function DatabaseQueryLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Database & Backup Lab", "مختبر قواعد البيانات والنسخ الاحتياطي")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <Database className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Data Management Pro!", "محترف إدارة البيانات!")}</h4>
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
