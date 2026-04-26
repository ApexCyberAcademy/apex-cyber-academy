/*
  Device Hardening Lab - Tech+ Day 9
  Students apply security hardening practices to devices.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { Shield, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [
  {
    "id": 1,
    "scenario": "You're setting up a new company laptop. Which of the following is the MOST important security step during initial configuration?",
    "scenarioAr": "أنت تُعد حاسوباً محمولاً جديداً للشركة. أي من التالي هو أهم خطوة أمنية أثناء التكوين الأولي؟",
    "correct": "Enable full-disk encryption (BitLocker/FileVault) before storing any data",
    "options": [
      "Install antivirus software",
      "Enable full-disk encryption (BitLocker/FileVault) before storing any data",
      "Set a desktop wallpaper with the company logo",
      "Connect to the company Wi-Fi"
    ],
    "optionsAr": [
      "تثبيت برنامج مكافحة الفيروسات",
      "تفعيل تشفير القرص الكامل (BitLocker/FileVault) قبل تخزين أي بيانات",
      "تعيين خلفية سطح مكتب بشعار الشركة",
      "الاتصال بشبكة Wi-Fi الشركة"
    ],
    "explanation": "Full-disk encryption should be the FIRST security step because it protects all data if the laptop is lost or stolen — the #1 data breach risk for mobile devices. Without encryption, anyone who gets the physical device can access all data by removing the drive. BitLocker (Windows) and FileVault (macOS) are built-in solutions.",
    "explanationAr": "تشفير القرص الكامل يجب أن يكون الخطوة الأمنية الأولى لأنه يحمي جميع البيانات إذا فُقد الحاسوب المحمول أو سُرق — الخطر الأول لاختراق البيانات للأجهزة المحمولة."
  },
  {
    "id": 2,
    "scenario": "A user's password is 'CompanyName2024!'. Why is this considered a weak password despite meeting complexity requirements (uppercase, lowercase, number, special character)?",
    "scenarioAr": "كلمة مرور مستخدم هي 'CompanyName2024!'. لماذا تُعتبر كلمة مرور ضعيفة رغم استيفاء متطلبات التعقيد (أحرف كبيرة، صغيرة، رقم، حرف خاص)؟",
    "correct": "It uses predictable patterns — company name + year + common special character",
    "options": [
      "It's too short",
      "It uses predictable patterns — company name + year + common special character",
      "It doesn't have enough special characters",
      "It uses English words"
    ],
    "optionsAr": [
      "قصيرة جداً",
      "تستخدم أنماطاً متوقعة — اسم الشركة + السنة + حرف خاص شائع",
      "لا تحتوي على حروف خاصة كافية",
      "تستخدم كلمات إنجليزية"
    ],
    "explanation": "Password crackers use dictionary attacks with common patterns: company/personal names + year + trailing special character is one of the most common patterns. Meeting complexity requirements doesn't equal security. A passphrase like 'correct-horse-battery-staple' is much stronger despite no special characters.",
    "explanationAr": "أدوات كسر كلمات المرور تستخدم هجمات القاموس مع أنماط شائعة: أسماء الشركة/الشخصية + السنة + حرف خاص في النهاية هو أحد أكثر الأنماط شيوعاً. استيفاء متطلبات التعقيد لا يعني الأمان."
  },
  {
    "id": 3,
    "scenario": "Which encryption standard should be used for Wi-Fi networks in 2024?",
    "scenarioAr": "أي معيار تشفير يجب استخدامه لشبكات Wi-Fi في 2024؟",
    "correct": "WPA3 — the latest and most secure Wi-Fi encryption standard",
    "options": [
      "WEP — widely compatible",
      "WPA — good enough for most networks",
      "WPA2 — the current standard",
      "WPA3 — the latest and most secure Wi-Fi encryption standard"
    ],
    "optionsAr": [
      "WEP — متوافق على نطاق واسع",
      "WPA — جيد بما فيه الكفاية لمعظم الشبكات",
      "WPA2 — المعيار الحالي",
      "WPA3 — أحدث وأكثر معايير تشفير Wi-Fi أماناً"
    ],
    "explanation": "WPA3 (2018) provides the strongest Wi-Fi security: SAE (Simultaneous Authentication of Equals) replaces the vulnerable PSK handshake, forward secrecy protects past sessions, and 192-bit encryption is available. WEP is broken, WPA is deprecated, and WPA2 has known vulnerabilities (KRACK attack).",
    "explanationAr": "WPA3 (2018) يوفر أقوى أمان Wi-Fi: SAE (المصادقة المتزامنة للأنداد) يستبدل مصافحة PSK الضعيفة، السرية الأمامية تحمي الجلسات السابقة، وتشفير 192 بت متاح."
  }
];

export default function DeviceHardeningLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Shield className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Device Hardening Lab", "مختبر تقوية الأجهزة")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <Shield className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Security Hardening Pro!", "محترف تقوية الأمان!")}</h4>
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
