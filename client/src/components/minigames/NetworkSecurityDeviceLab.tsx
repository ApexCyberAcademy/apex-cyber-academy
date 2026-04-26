/*
  Security Devices Lab - Network+ Day 7
  Students identify and configure network security devices.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { ShieldCheck, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [{"id": 1, "scenario": "A company wants to inspect encrypted HTTPS traffic for malware before it reaches internal users. Which security device can accomplish this?", "scenarioAr": "شركة تريد فحص حركة مرور HTTPS المشفرة بحثاً عن البرمجيات الخبيثة قبل وصولها للمستخدمين الداخليين. أي جهاز أمان يمكنه تحقيق هذا؟", "correct": "Next-Generation Firewall (NGFW) with SSL/TLS inspection", "options": ["Traditional packet-filtering firewall", "Next-Generation Firewall (NGFW) with SSL/TLS inspection", "Network switch with port security", "Basic IDS sensor"], "optionsAr": ["جدار حماية تقليدي لتصفية الحزم", "جدار حماية الجيل التالي (NGFW) مع فحص SSL/TLS", "محول شبكة مع أمان المنافذ", "مستشعر IDS أساسي"], "explanation": "NGFWs can perform SSL/TLS decryption (man-in-the-middle with a trusted CA cert), inspect the decrypted content for malware/threats, then re-encrypt and forward. Traditional firewalls only see encrypted blobs. This is critical since 90%+ of web traffic is now encrypted.", "explanationAr": "جدران حماية الجيل التالي يمكنها فك تشفير SSL/TLS، فحص المحتوى المفكك بحثاً عن البرمجيات الخبيثة/التهديدات، ثم إعادة التشفير والتوجيه. جدران الحماية التقليدية ترى فقط كتل مشفرة."}, {"id": 2, "scenario": "What is the key difference between an IDS and an IPS?", "scenarioAr": "ما هو الفرق الرئيسي بين IDS و IPS؟", "correct": "IDS detects and alerts; IPS detects and actively blocks threats inline", "options": ["IDS is hardware; IPS is software", "IDS detects and alerts; IPS detects and actively blocks threats inline", "IDS is for internal networks; IPS is for external", "There is no difference — they are the same"], "optionsAr": ["IDS هو أجهزة؛ IPS هو برمجيات", "IDS يكتشف وينبه؛ IPS يكتشف ويحظر التهديدات بشكل نشط في الخط", "IDS للشبكات الداخلية؛ IPS للخارجية", "لا يوجد فرق — هما نفس الشيء"], "explanation": "IDS (Intrusion Detection System) monitors traffic passively and generates alerts — it's a 'security camera.' IPS (Intrusion Prevention System) sits inline and can actively block malicious traffic in real-time — it's a 'security guard.' IPS adds latency but provides active protection.", "explanationAr": "IDS (نظام كشف التسلل) يراقب حركة المرور بشكل سلبي وينشئ تنبيهات — إنه 'كاميرا أمان.' IPS (نظام منع التسلل) يجلس في الخط ويمكنه حظر حركة المرور الخبيثة بنشاط في الوقت الفعلي — إنه 'حارس أمن.'"}, {"id": 3, "scenario": "A network administrator needs to segment the network so that guest Wi-Fi users cannot access internal servers, but can still reach the internet. What should they configure?", "scenarioAr": "مدير شبكة يحتاج لتقسيم الشبكة بحيث لا يمكن لمستخدمي Wi-Fi الضيوف الوصول للخوادم الداخلية، لكن يمكنهم الوصول للإنترنت. ماذا يجب أن يُعد؟", "correct": "Place guests on a separate VLAN with firewall rules allowing only internet access", "options": ["Disable SSID broadcast for the guest network", "Place guests on a separate VLAN with firewall rules allowing only internet access", "Use MAC address filtering on the guest network", "Give guests the same network but with weaker passwords"], "optionsAr": ["تعطيل بث SSID لشبكة الضيوف", "وضع الضيوف على VLAN منفصل مع قواعد جدار حماية تسمح فقط بالوصول للإنترنت", "استخدام تصفية عنوان MAC على شبكة الضيوف", "إعطاء الضيوف نفس الشبكة لكن بكلمات مرور أضعف"], "explanation": "Network segmentation via VLANs is the correct approach. Place guests on VLAN 99 (for example) with firewall/ACL rules that only permit traffic to the internet gateway and deny access to internal server VLANs. Hiding SSID and MAC filtering are security theater — easily bypassed.", "explanationAr": "تقسيم الشبكة عبر VLANs هو النهج الصحيح. ضع الضيوف على VLAN 99 (مثلاً) مع قواعد جدار حماية/ACL تسمح فقط بحركة المرور لبوابة الإنترنت وترفض الوصول لـ VLANs الخوادم الداخلية."}];

export default function NetworkSecurityDeviceLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Security Devices Lab", "مختبر أجهزة الأمان")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <ShieldCheck className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Security Devices Pro!", "محترف أجهزة الأمان!")}</h4>
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
