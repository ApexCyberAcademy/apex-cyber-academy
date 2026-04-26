/*
  Network Services Lab - Network+ Day 6
  Students configure DHCP, DNS, and NTP services.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { Server, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [{"id": 1, "scenario": "A DHCP server is configured with a scope of 192.168.1.100-200 and a lease time of 8 hours. After a power outage, 50 devices reconnect simultaneously. What happens?", "scenarioAr": "خادم DHCP مُعد بنطاق 192.168.1.100-200 ومدة إيجار 8 ساعات. بعد انقطاع الكهرباء، 50 جهاز يعيد الاتصال في وقت واحد. ماذا يحدث؟", "correct": "Devices request their previous IP via DHCP Request; server confirms if still available", "options": ["All devices get new random IPs", "Devices request their previous IP via DHCP Request; server confirms if still available", "DHCP server crashes from overload", "Devices use APIPA addresses (169.254.x.x)"], "optionsAr": ["جميع الأجهزة تحصل على عناوين IP عشوائية جديدة", "الأجهزة تطلب عنوان IP السابق عبر DHCP Request؛ الخادم يؤكد إذا كان لا يزال متاحاً", "خادم DHCP يتعطل من الحمل الزائد", "الأجهزة تستخدم عناوين APIPA (169.254.x.x)"], "explanation": "DHCP clients remember their last IP and attempt to reclaim it using a DHCP Request (DORA: Discover, Offer, Request, Acknowledge). If the lease hasn't expired and the IP is still available, the server sends an ACK. This is faster than a full DORA process and reduces IP churn after outages.", "explanationAr": "عملاء DHCP يتذكرون آخر عنوان IP ويحاولون استعادته باستخدام DHCP Request (DORA: اكتشاف، عرض، طلب، إقرار). إذا لم تنته مدة الإيجار والعنوان لا يزال متاحاً، الخادم يرسل ACK."}, {"id": 2, "scenario": "You need to ensure that a web server always gets the same IP address from DHCP without configuring a static IP on the server itself. What should you configure?", "scenarioAr": "تحتاج لضمان أن خادم ويب يحصل دائماً على نفس عنوان IP من DHCP بدون تكوين IP ثابت على الخادم نفسه. ماذا يجب أن تُعد؟", "correct": "DHCP reservation — binds a specific IP to the server's MAC address", "options": ["Shorter lease time", "DHCP reservation — binds a specific IP to the server's MAC address", "DHCP exclusion range", "DNS A record"], "optionsAr": ["مدة إيجار أقصر", "حجز DHCP — يربط عنوان IP محدد بعنوان MAC الخادم", "نطاق استبعاد DHCP", "سجل DNS A"], "explanation": "A DHCP reservation maps a specific MAC address to a fixed IP address. The server still uses DHCP (centralized management) but always receives the same IP. This is preferred over static IPs because all IP assignments are managed in one place (the DHCP server) rather than on individual devices.", "explanationAr": "حجز DHCP يربط عنوان MAC محدد بعنوان IP ثابت. الخادم لا يزال يستخدم DHCP (إدارة مركزية) لكن يحصل دائماً على نفس عنوان IP."}, {"id": 3, "scenario": "What type of DNS record maps a domain name to an IPv6 address?", "scenarioAr": "أي نوع سجل DNS يربط اسم نطاق بعنوان IPv6؟", "correct": "AAAA record", "options": ["A record", "AAAA record", "CNAME record", "MX record"], "optionsAr": ["سجل A", "سجل AAAA", "سجل CNAME", "سجل MX"], "explanation": "AAAA (quad-A) records map hostnames to IPv6 addresses (128-bit). A records map to IPv4 (32-bit). CNAME creates aliases. MX specifies mail servers. PTR does reverse lookups. The 'AAAA' name comes from IPv6 being 4x the size of IPv4 (128 vs 32 bits).", "explanationAr": "سجلات AAAA (رباعي A) تربط أسماء المضيفين بعناوين IPv6 (128 بت). سجلات A تربط بـ IPv4 (32 بت). CNAME ينشئ أسماء مستعارة. MX يحدد خوادم البريد."}];

export default function NetworkServicesLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Server className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Network Services Lab", "مختبر خدمات الشبكة")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <Server className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Services Expert!", "خبير الخدمات!")}</h4>
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
