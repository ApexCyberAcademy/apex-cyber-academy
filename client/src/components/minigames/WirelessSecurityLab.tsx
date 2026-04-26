/*
  Wireless Security Lab - Network+ Day 5
  Students configure wireless security settings.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { Wifi, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [{"id": 1, "scenario": "A company is deploying a new wireless network for 200 employees. They need enterprise-grade authentication where each user has unique credentials. Which wireless security configuration should they use?", "scenarioAr": "شركة تنشر شبكة لاسلكية جديدة لـ 200 موظف. يحتاجون مصادقة بمستوى المؤسسات حيث لكل مستخدم بيانات اعتماد فريدة. أي تكوين أمان لاسلكي يجب استخدامه؟", "correct": "WPA3-Enterprise with 802.1X/RADIUS authentication", "options": ["WPA3-Personal with a shared passphrase", "WPA3-Enterprise with 802.1X/RADIUS authentication", "Open network with captive portal", "WPA2-Personal with MAC filtering"], "optionsAr": ["WPA3-Personal مع عبارة مرور مشتركة", "WPA3-Enterprise مع مصادقة 802.1X/RADIUS", "شبكة مفتوحة مع بوابة أسيرة", "WPA2-Personal مع تصفية MAC"], "explanation": "WPA3-Enterprise with 802.1X uses a RADIUS server to authenticate each user individually with unique credentials (username/password or certificates). This provides accountability (know who connected), revocation (disable one user without changing everyone's password), and stronger security than shared passphrases.", "explanationAr": "WPA3-Enterprise مع 802.1X يستخدم خادم RADIUS لمصادقة كل مستخدم بشكل فردي ببيانات اعتماد فريدة. هذا يوفر المساءلة (معرفة من اتصل)، الإلغاء (تعطيل مستخدم واحد بدون تغيير كلمة مرور الجميع)، وأمان أقوى."}, {"id": 2, "scenario": "An attacker sets up a rogue access point with the same SSID as the corporate Wi-Fi to capture employee credentials. What is this attack called?", "scenarioAr": "مهاجم يُعد نقطة وصول مزيفة بنفس SSID كشبكة Wi-Fi الشركة لالتقاط بيانات اعتماد الموظفين. ما يُسمى هذا الهجوم؟", "correct": "Evil twin attack", "options": ["Deauthentication attack", "Evil twin attack", "War driving", "Bluesnarfing"], "optionsAr": ["هجوم إلغاء المصادقة", "هجوم التوأم الشرير", "القيادة الحربية", "Bluesnarfing"], "explanation": "An evil twin attack creates a fake AP mimicking a legitimate network. Victims connect to the rogue AP thinking it's real, and the attacker can intercept all traffic (man-in-the-middle). Defense: use 802.1X authentication (validates the server certificate), WIDS/WIPS to detect rogues, and educate users.", "explanationAr": "هجوم التوأم الشرير ينشئ نقطة وصول مزيفة تحاكي شبكة شرعية. الضحايا يتصلون بنقطة الوصول المزيفة معتقدين أنها حقيقية، والمهاجم يمكنه اعتراض كل حركة المرور."}, {"id": 3, "scenario": "Which wireless frequency band provides more non-overlapping channels but shorter range compared to 2.4 GHz?", "scenarioAr": "أي نطاق تردد لاسلكي يوفر المزيد من القنوات غير المتداخلة لكن نطاق أقصر مقارنة بـ 2.4 GHz؟", "correct": "5 GHz — 25 non-overlapping channels vs. 3 on 2.4 GHz", "options": ["900 MHz", "5 GHz — 25 non-overlapping channels vs. 3 on 2.4 GHz", "60 GHz", "6 GHz"], "optionsAr": ["900 MHz", "5 GHz — 25 قناة غير متداخلة مقابل 3 على 2.4 GHz", "60 GHz", "6 GHz"], "explanation": "The 5 GHz band offers approximately 25 non-overlapping 20 MHz channels (vs. only 3 on 2.4 GHz: channels 1, 6, 11). However, higher frequency means shorter wavelength, which reduces range and wall penetration. 5 GHz is ideal for high-density environments where interference is a bigger concern than range.", "explanationAr": "نطاق 5 GHz يوفر حوالي 25 قناة 20 MHz غير متداخلة (مقابل 3 فقط على 2.4 GHz: القنوات 1، 6، 11). لكن التردد الأعلى يعني طول موجي أقصر، مما يقلل النطاق واختراق الجدران."}];

export default function WirelessSecurityLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Wireless Security Lab", "مختبر أمان الشبكات اللاسلكية")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <Wifi className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Wireless Security Pro!", "محترف أمان اللاسلكي!")}</h4>
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
