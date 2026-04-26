/*
  Network+ Review Lab - Network+ Day 14
  Comprehensive review across all Network+ domains.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { Award, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [{"id": 1, "scenario": "A company's web server is accessible from the internet but internal users report they cannot access it using the public URL. Internal users CAN access it via the private IP. What is likely the issue?", "scenarioAr": "خادم ويب لشركة يمكن الوصول إليه من الإنترنت لكن المستخدمين الداخليين يبلغون أنهم لا يمكنهم الوصول إليه باستخدام URL العام. المستخدمون الداخليون يمكنهم الوصول عبر IP الخاص. ما المشكلة المحتملة؟", "correct": "NAT hairpinning (NAT loopback) is not configured on the firewall", "options": ["The web server is down", "NAT hairpinning (NAT loopback) is not configured on the firewall", "DNS is not working", "The switch port is misconfigured"], "optionsAr": ["خادم الويب معطل", "NAT hairpinning (استرجاع NAT) غير مُعد على جدار الحماية", "DNS لا يعمل", "منفذ المحول مُعد بشكل خاطئ"], "explanation": "NAT hairpinning (also called NAT loopback) allows internal users to access an internal server using its public IP/URL. Without it, the firewall doesn't know how to route traffic from internal → public IP → back to internal. Solutions: enable hairpin NAT, use split-horizon DNS (internal DNS resolves to private IP), or configure a DNS override.", "explanationAr": "NAT hairpinning (يُسمى أيضاً استرجاع NAT) يسمح للمستخدمين الداخليين بالوصول لخادم داخلي باستخدام IP/URL العام. بدونه، جدار الحماية لا يعرف كيف يوجه حركة المرور من داخلي ← IP عام ← عودة للداخلي."}, {"id": 2, "scenario": "Which cable type should be used for a new installation connecting a switch to a patch panel in a commercial building, supporting 10 Gbps up to 100 meters?", "scenarioAr": "أي نوع كابل يجب استخدامه لتركيب جديد يربط محولاً بلوحة توصيل في مبنى تجاري، يدعم 10 جيجابت/ثانية حتى 100 متر؟", "correct": "Cat 6a — supports 10 Gbps up to 100 meters", "options": ["Cat 5e — supports up to 1 Gbps", "Cat 6 — supports 10 Gbps up to 55 meters", "Cat 6a — supports 10 Gbps up to 100 meters", "Cat 7 — not a TIA/EIA standard"], "optionsAr": ["Cat 5e — يدعم حتى 1 جيجابت/ثانية", "Cat 6 — يدعم 10 جيجابت/ثانية حتى 55 متر", "Cat 6a — يدعم 10 جيجابت/ثانية حتى 100 متر", "Cat 7 — ليس معيار TIA/EIA"], "explanation": "Cat 6a (augmented) supports 10 Gbps at the full 100-meter distance, making it the right choice for new commercial installations. Cat 6 only supports 10 Gbps up to 55 meters. Cat 5e maxes out at 1 Gbps. For new installations, always install the highest practical category to future-proof the infrastructure.", "explanationAr": "Cat 6a (المعزز) يدعم 10 جيجابت/ثانية على المسافة الكاملة 100 متر، مما يجعله الخيار الصحيح للتركيبات التجارية الجديدة. Cat 6 يدعم 10 جيجابت/ثانية فقط حتى 55 متر."}, {"id": 3, "scenario": "What is the purpose of the 802.1X protocol in network security?", "scenarioAr": "ما هو الغرض من بروتوكول 802.1X في أمان الشبكة؟", "correct": "Port-based network access control (NAC)", "options": ["Wireless encryption standard", "Port-based network access control (NAC)", "VLAN tagging protocol", "Spanning tree protocol"], "optionsAr": ["معيار تشفير لاسلكي", "التحكم في الوصول للشبكة المستند للمنفذ (NAC)", "بروتوكول وسم VLAN", "بروتوكول الشجرة الممتدة"], "explanation": "802.1X is a port-based network access control (NAC) standard. It uses EAP (Extensible Authentication Protocol) to authenticate devices before allowing them onto the network. Components: supplicant (client), authenticator (switch/AP), authentication server (RADIUS). Until authenticated, the port only allows EAP traffic.", "explanationAr": "802.1X هو معيار التحكم في الوصول للشبكة المستند للمنفذ. يستخدم EAP لمصادقة الأجهزة قبل السماح لها بالدخول للشبكة."}];

export default function NetworkPlusReviewLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Award className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Network+ Review Lab", "مختبر مراجعة Network+")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <Award className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Network+ Ready!", "جاهز لـ Network+!")}</h4>
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
