/*
  Network Troubleshooting Lab - Network+ Day 10
  Students apply systematic troubleshooting methodology.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { Wrench, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [{"id": 1, "scenario": "Users in Building A can access the internet but cannot reach servers in Building B. Users in Building B can access everything normally. Where should you start troubleshooting?", "scenarioAr": "مستخدمون في المبنى A يمكنهم الوصول للإنترنت لكن لا يمكنهم الوصول لخوادم المبنى B. مستخدمو المبنى B يمكنهم الوصول لكل شيء بشكل طبيعي. من أين يجب أن تبدأ استكشاف الأخطاء؟", "correct": "Check the link between buildings — the inter-building connection or routing between the two subnets", "options": ["Restart the internet router", "Check the link between buildings — the inter-building connection or routing between the two subnets", "Replace all cables in Building A", "Update DNS records"], "optionsAr": ["إعادة تشغيل جهاز توجيه الإنترنت", "التحقق من الرابط بين المباني — الاتصال بين المباني أو التوجيه بين الشبكتين الفرعيتين", "استبدال جميع الكابلات في المبنى A", "تحديث سجلات DNS"], "explanation": "Building A has internet (so their gateway works) but can't reach Building B specifically. Building B works fine. This points to a unidirectional routing issue or a problem with the inter-building link. Check: the trunk/uplink between buildings, routing tables, ACLs that might block traffic from Building A's subnet.", "explanationAr": "المبنى A لديه إنترنت (لذا بوابتهم تعمل) لكن لا يمكنه الوصول للمبنى B تحديداً. المبنى B يعمل بشكل جيد. هذا يشير لمشكلة توجيه أحادية الاتجاه أو مشكلة في الرابط بين المباني."}, {"id": 2, "scenario": "A user reports intermittent connectivity — the connection drops for 30 seconds every few minutes then recovers. What tool should you use first?", "scenarioAr": "مستخدم يبلغ عن اتصال متقطع — الاتصال ينقطع لـ 30 ثانية كل بضع دقائق ثم يتعافى. أي أداة يجب استخدامها أولاً؟", "correct": "Continuous ping (ping -t) to the gateway to establish a pattern and measure packet loss", "options": ["nslookup to check DNS", "Continuous ping (ping -t) to the gateway to establish a pattern and measure packet loss", "traceroute to an external server", "netstat to check open ports"], "optionsAr": ["nslookup للتحقق من DNS", "ping مستمر (ping -t) للبوابة لإنشاء نمط وقياس فقدان الحزم", "traceroute لخادم خارجي", "netstat للتحقق من المنافذ المفتوحة"], "explanation": "A continuous ping (ping -t on Windows, ping -c 1000 on Linux) to the default gateway reveals the pattern: when drops occur, duration, and frequency. If pings to the gateway fail, it's a local issue (cable, NIC, switch port). If gateway pings succeed but external fails, it's upstream. This narrows the scope quickly.", "explanationAr": "ping مستمر للبوابة الافتراضية يكشف النمط: متى تحدث الانقطاعات، المدة، والتكرار. إذا فشل ping للبوابة، إنها مشكلة محلية. إذا نجح ping للبوابة لكن فشل الخارجي، إنها مشكلة أعلى."}, {"id": 3, "scenario": "After replacing a switch, several devices connected to it get APIPA addresses (169.254.x.x) instead of DHCP addresses. The DHCP server is on a different subnet. What's missing?", "scenarioAr": "بعد استبدال محول، عدة أجهزة متصلة به تحصل على عناوين APIPA (169.254.x.x) بدلاً من عناوين DHCP. خادم DHCP على شبكة فرعية مختلفة. ما المفقود؟", "correct": "IP helper-address (DHCP relay) not configured on the new switch/router interface", "options": ["The DHCP server is down", "IP helper-address (DHCP relay) not configured on the new switch/router interface", "The switch needs a firmware update", "Devices need static IP addresses"], "optionsAr": ["خادم DHCP معطل", "عنوان IP المساعد (ترحيل DHCP) غير مُعد على واجهة المحول/جهاز التوجيه الجديد", "المحول يحتاج تحديث البرنامج الثابت", "الأجهزة تحتاج عناوين IP ثابتة"], "explanation": "DHCP broadcasts don't cross subnet boundaries. When the DHCP server is on a different subnet, a DHCP relay agent (ip helper-address) must be configured on the router/L3 switch interface to forward DHCP requests to the server. The old switch had this configured; the replacement doesn't.", "explanationAr": "بث DHCP لا يعبر حدود الشبكات الفرعية. عندما يكون خادم DHCP على شبكة فرعية مختلفة، يجب تكوين وكيل ترحيل DHCP (ip helper-address) على واجهة جهاز التوجيه/المحول L3 لتوجيه طلبات DHCP للخادم."}];

export default function NetworkTroubleshootLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Wrench className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Network Troubleshooting Lab", "مختبر استكشاف أخطاء الشبكة")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <Wrench className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Troubleshooting Pro!", "محترف استكشاف الأخطاء!")}</h4>
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
