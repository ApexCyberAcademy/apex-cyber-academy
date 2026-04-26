/*
  IP Subnetting Lab - Network+ Day 2
  Students solve subnetting problems.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { Network, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [{"id": 1, "scenario": "You have the network 192.168.10.0/24 and need to create 4 equal subnets. What is the new subnet mask?", "scenarioAr": "لديك الشبكة 192.168.10.0/24 وتحتاج لإنشاء 4 شبكات فرعية متساوية. ما هو قناع الشبكة الفرعية الجديد؟", "correct": "/26 (255.255.255.192) — borrowing 2 bits gives 4 subnets", "options": ["/25 (255.255.255.128)", "/26 (255.255.255.192) — borrowing 2 bits gives 4 subnets", "/27 (255.255.255.224)", "/28 (255.255.255.240)"], "optionsAr": ["/25 (255.255.255.128)", "/26 (255.255.255.192) — استعارة 2 بت تعطي 4 شبكات فرعية", "/27 (255.255.255.224)", "/28 (255.255.255.240)"], "explanation": "To create 4 subnets, you need 2 bits (2²=4). Starting from /24, borrow 2 bits: /24 + 2 = /26. Each subnet has 62 usable hosts (2⁶ - 2 = 62). The 4 subnets are: .0-.63, .64-.127, .128-.191, .192-.255.", "explanationAr": "لإنشاء 4 شبكات فرعية، تحتاج 2 بت (2²=4). بدءاً من /24، استعر 2 بت: /24 + 2 = /26. كل شبكة فرعية لديها 62 مضيف قابل للاستخدام (2⁶ - 2 = 62)."}, {"id": 2, "scenario": "A host has the IP address 10.50.100.200/20. What is the network address for this host?", "scenarioAr": "مضيف لديه عنوان IP 10.50.100.200/20. ما هو عنوان الشبكة لهذا المضيف؟", "correct": "10.50.96.0", "options": ["10.50.100.0", "10.50.96.0", "10.50.0.0", "10.50.112.0"], "optionsAr": ["10.50.100.0", "10.50.96.0", "10.50.0.0", "10.50.112.0"], "explanation": "With /20, the subnet mask is 255.255.240.0. The third octet (100) in binary is 01100100. ANDing with 240 (11110000): 01100100 AND 11110000 = 01100000 = 96. So the network address is 10.50.96.0. The block size in the third octet is 16 (256-240), and 96 is the nearest multiple of 16 below 100.", "explanationAr": "مع /20، قناع الشبكة الفرعية هو 255.255.240.0. البايت الثالث (100) بالثنائي هو 01100100. عملية AND مع 240 (11110000): 01100100 AND 11110000 = 01100000 = 96. لذا عنوان الشبكة هو 10.50.96.0."}, {"id": 3, "scenario": "Which of the following is a valid IPv6 address representation?", "scenarioAr": "أي من التالي هو تمثيل صحيح لعنوان IPv6؟", "correct": "2001:0db8::1 — double colon replaces consecutive groups of zeros", "options": ["192.168.1.256", "2001:0db8::1 — double colon replaces consecutive groups of zeros", "FE80:0000:0000:0000:0000:0000:0000:0000:0001", "2001.0db8.0000.0001"], "optionsAr": ["192.168.1.256", "2001:0db8::1 — النقطتان المزدوجتان تستبدلان مجموعات متتالية من الأصفار", "FE80:0000:0000:0000:0000:0000:0000:0000:0001", "2001.0db8.0000.0001"], "explanation": "2001:0db8::1 is valid IPv6. The :: notation replaces one or more consecutive groups of all-zero 16-bit groups. IPv6 uses colons (not dots), has 8 groups of 4 hex digits (128 bits total), and leading zeros in each group can be omitted. 192.168.1.256 is invalid IPv4 (max 255).", "explanationAr": "2001:0db8::1 هو IPv6 صحيح. تدوين :: يستبدل مجموعة واحدة أو أكثر من مجموعات 16 بت المتتالية كلها أصفار. IPv6 يستخدم نقطتين (ليس نقاط)، لديه 8 مجموعات من 4 أرقام ست عشرية."}];

export default function IPSubnettingLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Network className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("IP Subnetting Lab", "مختبر تقسيم الشبكات الفرعية")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <Network className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Subnetting Pro!", "محترف تقسيم الشبكات!")}</h4>
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
