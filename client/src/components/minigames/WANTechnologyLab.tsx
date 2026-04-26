/*
  WAN Technology Lab - Network+ Day 8
  Students identify WAN technologies and their use cases.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { Globe, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [{"id": 1, "scenario": "A company needs to securely connect their headquarters to a branch office over the public internet. Which technology provides an encrypted tunnel between the two sites?", "scenarioAr": "شركة تحتاج لتوصيل مقرها الرئيسي بمكتب فرعي بشكل آمن عبر الإنترنت العام. أي تقنية توفر نفقاً مشفراً بين الموقعين؟", "correct": "Site-to-site VPN — creates an encrypted tunnel over the internet", "options": ["Dedicated leased line", "Site-to-site VPN — creates an encrypted tunnel over the internet", "MPLS circuit", "Dial-up connection"], "optionsAr": ["خط مؤجر مخصص", "VPN من موقع لموقع — ينشئ نفقاً مشفراً عبر الإنترنت", "دائرة MPLS", "اتصال هاتفي"], "explanation": "A site-to-site VPN uses IPsec or similar protocols to create an encrypted tunnel over the public internet, connecting two networks securely. It's cost-effective compared to dedicated lines (MPLS, leased lines) since it uses existing internet connections. The trade-off is that performance depends on internet quality.", "explanationAr": "VPN من موقع لموقع يستخدم IPsec أو بروتوكولات مماثلة لإنشاء نفق مشفر عبر الإنترنت العام، يربط شبكتين بشكل آمن. إنه فعال من حيث التكلفة مقارنة بالخطوط المخصصة."}, {"id": 2, "scenario": "What is SD-WAN and why are enterprises adopting it?", "scenarioAr": "ما هو SD-WAN ولماذا تتبناه المؤسسات؟", "correct": "Software-defined WAN that intelligently routes traffic across multiple links based on application requirements", "options": ["A new type of fiber optic cable", "Software-defined WAN that intelligently routes traffic across multiple links based on application requirements", "A replacement for local area networks", "A cloud-only networking solution"], "optionsAr": ["نوع جديد من كابلات الألياف الضوئية", "WAN معرّف بالبرمجيات يوجه حركة المرور بذكاء عبر روابط متعددة بناءً على متطلبات التطبيق", "بديل للشبكات المحلية", "حل شبكات سحابي فقط"], "explanation": "SD-WAN abstracts the WAN transport layer, allowing enterprises to use multiple connection types (MPLS, broadband, LTE) and intelligently route traffic based on application needs. Video calls go over the lowest-latency link, bulk transfers over the cheapest link. It reduces costs and improves performance.", "explanationAr": "SD-WAN يجرد طبقة نقل WAN، مما يسمح للمؤسسات باستخدام أنواع اتصال متعددة (MPLS، النطاق العريض، LTE) وتوجيه حركة المرور بذكاء بناءً على احتياجات التطبيق."}, {"id": 3, "scenario": "Which WAN technology provides the highest bandwidth and lowest latency for a dedicated point-to-point connection?", "scenarioAr": "أي تقنية WAN توفر أعلى عرض نطاق وأقل تأخير لاتصال مخصص من نقطة لنقطة؟", "correct": "Dark fiber — dedicated fiber optic connection with virtually unlimited bandwidth", "options": ["DSL — uses existing phone lines", "Cable — uses coaxial TV infrastructure", "Dark fiber — dedicated fiber optic connection with virtually unlimited bandwidth", "Satellite — global coverage"], "optionsAr": ["DSL — يستخدم خطوط الهاتف الموجودة", "كابل — يستخدم بنية التلفزيون المحورية", "الألياف المظلمة — اتصال ألياف ضوئية مخصص مع عرض نطاق غير محدود فعلياً", "القمر الصناعي — تغطية عالمية"], "explanation": "Dark fiber is unlit (unused) fiber optic cable that an organization leases and lights with their own equipment. It provides the highest possible bandwidth (100 Gbps+) and lowest latency since it's a dedicated physical connection. The trade-off is high cost and limited availability.", "explanationAr": "الألياف المظلمة هي كابل ألياف ضوئية غير مضاء (غير مستخدم) تستأجره المنظمة وتضيئه بمعداتها الخاصة. يوفر أعلى عرض نطاق ممكن (100+ جيجابت/ثانية) وأقل تأخير."}];

export default function WANTechnologyLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Globe className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("WAN Technology Lab", "مختبر تقنيات WAN")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <Globe className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("WAN Expert!", "خبير WAN!")}</h4>
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
