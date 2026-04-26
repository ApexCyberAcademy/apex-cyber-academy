/*
  Network Basics Lab - Tech+ Day 4
  Students configure basic network settings and identify wireless standards.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { Wifi, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [
  {
    "id": 1,
    "scenario": "A user can access local network resources but cannot reach any websites. They can ping 8.8.8.8 but cannot ping google.com. What is the most likely issue?",
    "scenarioAr": "مستخدم يمكنه الوصول لموارد الشبكة المحلية لكن لا يمكنه الوصول لأي مواقع. يمكنه عمل ping لـ 8.8.8.8 لكن لا يمكنه عمل ping لـ google.com. ما المشكلة الأكثر احتمالاً؟",
    "correct": "DNS configuration issue — can reach IPs but not resolve domain names",
    "options": [
      "Default gateway is misconfigured",
      "DNS configuration issue — can reach IPs but not resolve domain names",
      "The ISP is down",
      "The Ethernet cable is faulty"
    ],
    "optionsAr": [
      "البوابة الافتراضية مضبوطة بشكل خاطئ",
      "مشكلة تكوين DNS — يمكن الوصول لعناوين IP لكن لا يمكن حل أسماء النطاقات",
      "مزود الإنترنت معطل",
      "كابل الإيثرنت معيب"
    ],
    "explanation": "Being able to ping 8.8.8.8 (IP address) but not google.com (domain name) is the classic symptom of a DNS failure. The network connection works fine — the computer just can't translate domain names to IP addresses. Fix: check DNS server settings (try 8.8.8.8 or 1.1.1.1 as DNS).",
    "explanationAr": "القدرة على عمل ping لـ 8.8.8.8 (عنوان IP) لكن ليس google.com (اسم نطاق) هو العرض الكلاسيكي لفشل DNS. اتصال الشبكة يعمل بشكل جيد — الحاسوب فقط لا يمكنه ترجمة أسماء النطاقات لعناوين IP."
  },
  {
    "id": 2,
    "scenario": "An office is upgrading their Wi-Fi. They need to support 100+ devices with minimal interference in a crowded building. Which Wi-Fi standard and band should they prioritize?",
    "scenarioAr": "مكتب يرقي شبكة Wi-Fi. يحتاجون لدعم 100+ جهاز مع أقل تداخل في مبنى مزدحم. أي معيار Wi-Fi ونطاق يجب أن يعطوه الأولوية؟",
    "correct": "Wi-Fi 6 (802.11ax) on 5 GHz band — better device handling and less interference",
    "options": [
      "Wi-Fi 4 (802.11n) on 2.4 GHz — widest compatibility",
      "Wi-Fi 6 (802.11ax) on 5 GHz band — better device handling and less interference",
      "Wi-Fi 5 (802.11ac) on 2.4 GHz — good balance",
      "Any standard on 2.4 GHz — better range through walls"
    ],
    "optionsAr": [
      "Wi-Fi 4 (802.11n) على 2.4 GHz — أوسع توافق",
      "Wi-Fi 6 (802.11ax) على نطاق 5 GHz — تعامل أفضل مع الأجهزة وتداخل أقل",
      "Wi-Fi 5 (802.11ac) على 2.4 GHz — توازن جيد",
      "أي معيار على 2.4 GHz — نطاق أفضل عبر الجدران"
    ],
    "explanation": "Wi-Fi 6 (802.11ax) introduces OFDMA and MU-MIMO technologies that efficiently handle many simultaneous connections. The 5 GHz band has more non-overlapping channels and less interference in crowded environments. 2.4 GHz has better range but more congestion.",
    "explanationAr": "Wi-Fi 6 (802.11ax) يقدم تقنيات OFDMA و MU-MIMO التي تتعامل بكفاءة مع العديد من الاتصالات المتزامنة. نطاق 5 GHz لديه المزيد من القنوات غير المتداخلة وتداخل أقل في البيئات المزدحمة."
  },
  {
    "id": 3,
    "scenario": "What is the purpose of a subnet mask in IPv4 networking?",
    "scenarioAr": "ما هو الغرض من قناع الشبكة الفرعية في شبكات IPv4؟",
    "correct": "It defines which portion of the IP address identifies the network vs. the host",
    "options": [
      "It encrypts network traffic for security",
      "It defines which portion of the IP address identifies the network vs. the host",
      "It assigns IP addresses to devices automatically",
      "It determines the maximum speed of the network"
    ],
    "optionsAr": [
      "يشفر حركة مرور الشبكة للأمان",
      "يحدد أي جزء من عنوان IP يعرّف الشبكة مقابل المضيف",
      "يعيّن عناوين IP للأجهزة تلقائياً",
      "يحدد السرعة القصوى للشبكة"
    ],
    "explanation": "A subnet mask (e.g., 255.255.255.0 or /24) separates the network portion from the host portion of an IP address. This determines which devices are on the same local network (can communicate directly) vs. which need to go through a router. It's fundamental to IP routing.",
    "explanationAr": "قناع الشبكة الفرعية (مثل 255.255.255.0 أو /24) يفصل جزء الشبكة عن جزء المضيف في عنوان IP. هذا يحدد أي أجهزة على نفس الشبكة المحلية (يمكنها التواصل مباشرة) مقابل التي تحتاج المرور عبر جهاز توجيه."
  }
];

export default function NetworkBasicsLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Wifi className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Network Basics Lab", "مختبر أساسيات الشبكات")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <Wifi className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Network Basics Pro!", "محترف أساسيات الشبكات!")}</h4>
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
