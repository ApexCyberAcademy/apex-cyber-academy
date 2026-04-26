/*
  Storage & Interface Lab - Tech+ Day 3
  Students match storage types and interfaces to use cases.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { HardDrive, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [
  {
    "id": 1,
    "scenario": "A video editing studio needs storage that can handle sustained 4K video editing with large file transfers. Budget is not a primary concern. Which storage solution is best?",
    "scenarioAr": "استوديو تحرير فيديو يحتاج تخزيناً يمكنه التعامل مع تحرير فيديو 4K مستمر مع نقل ملفات كبيرة. الميزانية ليست مصدر قلق أساسي. أي حل تخزين هو الأفضل؟",
    "correct": "NVMe SSD in RAID 0 — maximum sequential read/write speeds",
    "options": [
      "Traditional HDD — large capacity for video files",
      "NVMe SSD in RAID 0 — maximum sequential read/write speeds",
      "USB 3.0 external drive — portable and convenient",
      "Cloud storage — accessible from anywhere"
    ],
    "optionsAr": [
      "HDD تقليدي — سعة كبيرة لملفات الفيديو",
      "NVMe SSD في RAID 0 — أقصى سرعات قراءة/كتابة تسلسلية",
      "محرك خارجي USB 3.0 — محمول ومريح",
      "تخزين سحابي — يمكن الوصول من أي مكان"
    ],
    "explanation": "4K video editing requires sustained high-bandwidth sequential reads/writes. NVMe SSDs in RAID 0 provide the highest throughput (14,000+ MB/s combined). HDDs are too slow for real-time 4K editing. USB and cloud introduce latency that makes editing impractical.",
    "explanationAr": "تحرير فيديو 4K يتطلب قراءة/كتابة تسلسلية مستمرة عالية النطاق. NVMe SSD في RAID 0 يوفر أعلى إنتاجية (14,000+ ميجابايت/ثانية مجتمعة). الأقراص الصلبة بطيئة جداً لتحرير 4K في الوقت الفعلي."
  },
  {
    "id": 2,
    "scenario": "Which connector type provides the fastest data transfer for an external device?",
    "scenarioAr": "أي نوع موصل يوفر أسرع نقل بيانات لجهاز خارجي؟",
    "correct": "Thunderbolt 4 — up to 40 Gbps",
    "options": [
      "USB 2.0 — 480 Mbps",
      "USB 3.2 Gen 2 — 10 Gbps",
      "Thunderbolt 4 — up to 40 Gbps",
      "eSATA — 6 Gbps"
    ],
    "optionsAr": [
      "USB 2.0 — 480 ميجابت/ثانية",
      "USB 3.2 Gen 2 — 10 جيجابت/ثانية",
      "Thunderbolt 4 — حتى 40 جيجابت/ثانية",
      "eSATA — 6 جيجابت/ثانية"
    ],
    "explanation": "Thunderbolt 4 provides up to 40 Gbps bandwidth, making it the fastest external interface. It uses the USB-C connector form factor but offers significantly more bandwidth than USB 3.2. It can also daisy-chain devices and carry video signals.",
    "explanationAr": "Thunderbolt 4 يوفر حتى 40 جيجابت/ثانية من عرض النطاق، مما يجعله أسرع واجهة خارجية. يستخدم عامل شكل موصل USB-C لكنه يوفر عرض نطاق أكبر بكثير من USB 3.2."
  },
  {
    "id": 3,
    "scenario": "A small business needs a storage solution that provides both data redundancy AND improved read performance for their file server. Which RAID level should they use?",
    "scenarioAr": "شركة صغيرة تحتاج حل تخزين يوفر تكرار البيانات وأداء قراءة محسّن لخادم الملفات. أي مستوى RAID يجب استخدامه؟",
    "correct": "RAID 5 — striping with distributed parity across 3+ drives",
    "options": [
      "RAID 0 — striping for maximum speed",
      "RAID 1 — mirroring for redundancy",
      "RAID 5 — striping with distributed parity across 3+ drives",
      "RAID 10 — mirrored stripes"
    ],
    "optionsAr": [
      "RAID 0 — تقسيم لأقصى سرعة",
      "RAID 1 — نسخ متطابق للتكرار",
      "RAID 5 — تقسيم مع تكافؤ موزع عبر 3+ محركات",
      "RAID 10 — شرائط متطابقة"
    ],
    "explanation": "RAID 5 provides the best balance of redundancy, read performance, and storage efficiency for a small business. It stripes data across 3+ drives with distributed parity, surviving one drive failure. Read performance improves because data is read from multiple drives simultaneously.",
    "explanationAr": "RAID 5 يوفر أفضل توازن بين التكرار وأداء القراءة وكفاءة التخزين للشركات الصغيرة. يقسم البيانات عبر 3+ محركات مع تكافؤ موزع، يتحمل فشل محرك واحد."
  }
];

export default function StorageInterfaceLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><HardDrive className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Storage & Interface Lab", "مختبر التخزين والواجهات")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <HardDrive className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Storage Expert!", "خبير التخزين!")}</h4>
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
