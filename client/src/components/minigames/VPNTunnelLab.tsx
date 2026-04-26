/*
  VPN & Tunneling Lab - Network+ Day 11
  Students configure VPN types and tunneling protocols.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { Lock, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [{"id": 1, "scenario": "A remote employee needs to securely access the company's internal network from home. Which VPN type is most appropriate?", "scenarioAr": "موظف عن بعد يحتاج للوصول بشكل آمن لشبكة الشركة الداخلية من المنزل. أي نوع VPN هو الأنسب؟", "correct": "Remote access VPN (client-to-site) — connects individual users to the corporate network", "options": ["Site-to-site VPN", "Remote access VPN (client-to-site) — connects individual users to the corporate network", "MPLS VPN", "SSL proxy"], "optionsAr": ["VPN من موقع لموقع", "VPN الوصول عن بعد (عميل لموقع) — يربط المستخدمين الأفراد بشبكة الشركة", "VPN MPLS", "وكيل SSL"], "explanation": "Remote access (client-to-site) VPN allows individual users to connect to the corporate network from any location. The user runs a VPN client that creates an encrypted tunnel to the VPN gateway. Site-to-site VPN connects entire networks (office to office), not individual users.", "explanationAr": "VPN الوصول عن بعد (عميل لموقع) يسمح للمستخدمين الأفراد بالاتصال بشبكة الشركة من أي موقع. المستخدم يشغل عميل VPN ينشئ نفقاً مشفراً لبوابة VPN."}, {"id": 2, "scenario": "Which VPN protocol operates at Layer 3 and provides both encryption and authentication for IP packets?", "scenarioAr": "أي بروتوكول VPN يعمل في الطبقة 3 ويوفر التشفير والمصادقة لحزم IP؟", "correct": "IPsec — provides encryption (ESP) and authentication (AH) at the network layer", "options": ["SSL/TLS", "IPsec — provides encryption (ESP) and authentication (AH) at the network layer", "PPTP", "GRE"], "optionsAr": ["SSL/TLS", "IPsec — يوفر التشفير (ESP) والمصادقة (AH) في طبقة الشبكة", "PPTP", "GRE"], "explanation": "IPsec operates at Layer 3 (Network) and provides two security protocols: ESP (Encapsulating Security Payload) for encryption + authentication, and AH (Authentication Header) for authentication only. It's the standard for site-to-site VPNs and is used in IKEv2 remote access VPNs.", "explanationAr": "IPsec يعمل في الطبقة 3 (الشبكة) ويوفر بروتوكولين أمنيين: ESP (حمولة الأمان المغلفة) للتشفير + المصادقة، و AH (رأس المصادقة) للمصادقة فقط."}, {"id": 3, "scenario": "What is split tunneling in a VPN configuration, and what is the security concern?", "scenarioAr": "ما هو التقسيم النفقي في تكوين VPN، وما هو القلق الأمني؟", "correct": "Only corporate traffic goes through VPN; internet traffic goes directly — risk: the device becomes a bridge between networks", "options": ["Splitting one VPN into two for load balancing", "Only corporate traffic goes through VPN; internet traffic goes directly — risk: the device becomes a bridge between networks", "Using two VPN servers for redundancy", "Encrypting traffic twice for extra security"], "optionsAr": ["تقسيم VPN واحد لاثنين لموازنة الحمل", "فقط حركة مرور الشركة تمر عبر VPN؛ حركة الإنترنت تذهب مباشرة — الخطر: الجهاز يصبح جسراً بين الشبكات", "استخدام خادمي VPN للتكرار", "تشفير حركة المرور مرتين لأمان إضافي"], "explanation": "Split tunneling routes only corporate-destined traffic through the VPN tunnel; all other traffic (web browsing, streaming) goes directly to the internet. This saves bandwidth but creates a security risk: if the user's device is compromised while browsing, the attacker could pivot through the VPN into the corporate network.", "explanationAr": "التقسيم النفقي يوجه فقط حركة المرور الموجهة للشركة عبر نفق VPN؛ كل حركة المرور الأخرى تذهب مباشرة للإنترنت. هذا يوفر النطاق لكن ينشئ خطراً أمنياً."}];

export default function VPNTunnelLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Lock className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("VPN & Tunneling Lab", "مختبر VPN والأنفاق")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <Lock className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("VPN Expert!", "خبير VPN!")}</h4>
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
