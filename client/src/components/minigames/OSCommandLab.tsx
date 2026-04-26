/*
  OS Command Lab - Tech+ Day 6
  Students identify correct OS commands for common tasks.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { Terminal, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [
  {
    "id": 1,
    "scenario": "You need to check the IP configuration of a Windows computer, including IP address, subnet mask, and default gateway. Which command do you use?",
    "scenarioAr": "تحتاج للتحقق من تكوين IP لحاسوب ويندوز، بما في ذلك عنوان IP وقناع الشبكة الفرعية والبوابة الافتراضية. أي أمر تستخدم؟",
    "correct": "ipconfig /all",
    "options": [
      "ifconfig -a",
      "ipconfig /all",
      "netstat -an",
      "ping localhost"
    ],
    "optionsAr": [
      "ifconfig -a",
      "ipconfig /all",
      "netstat -an",
      "ping localhost"
    ],
    "explanation": "ipconfig /all is the Windows command that displays complete IP configuration including IP address, subnet mask, default gateway, DNS servers, DHCP status, and MAC address. ifconfig is the Linux/macOS equivalent. netstat shows network connections, not configuration.",
    "explanationAr": "ipconfig /all هو أمر ويندوز الذي يعرض تكوين IP الكامل بما في ذلك عنوان IP وقناع الشبكة الفرعية والبوابة الافتراضية وخوادم DNS وحالة DHCP وعنوان MAC. ifconfig هو المكافئ في لينكس/macOS."
  },
  {
    "id": 2,
    "scenario": "On a Linux system, you need to find all files larger than 100MB in the /home directory. Which command accomplishes this?",
    "scenarioAr": "على نظام لينكس، تحتاج لإيجاد جميع الملفات الأكبر من 100 ميجابايت في مجلد /home. أي أمر يحقق هذا؟",
    "correct": "find /home -size +100M",
    "options": [
      "ls -la /home",
      "find /home -size +100M",
      "grep -r '100M' /home",
      "du -sh /home"
    ],
    "optionsAr": [
      "ls -la /home",
      "find /home -size +100M",
      "grep -r '100M' /home",
      "du -sh /home"
    ],
    "explanation": "The 'find' command with -size +100M searches recursively for files exceeding 100 megabytes. ls only lists the current directory. grep searches file contents, not sizes. du shows directory sizes, not individual files matching a size criteria.",
    "explanationAr": "أمر 'find' مع -size +100M يبحث بشكل متكرر عن ملفات تتجاوز 100 ميجابايت. ls يسرد فقط المجلد الحالي. grep يبحث في محتويات الملفات وليس الأحجام. du يعرض أحجام المجلدات."
  },
  {
    "id": 3,
    "scenario": "A macOS user accidentally deleted important files from their Desktop. The Trash has been emptied. What is the BEST recovery approach?",
    "scenarioAr": "مستخدم macOS حذف ملفات مهمة عن طريق الخطأ من سطح المكتب. تم إفراغ سلة المهملات. ما أفضل نهج للاسترداد؟",
    "correct": "Restore from Time Machine backup if configured",
    "options": [
      "Use Terminal to 'undelete' files",
      "Restore from Time Machine backup if configured",
      "Files are permanently gone — no recovery possible",
      "Reinstall macOS to recover files"
    ],
    "optionsAr": [
      "استخدام Terminal لـ 'إلغاء حذف' الملفات",
      "الاستعادة من نسخة Time Machine الاحتياطية إذا كانت مُعدّة",
      "الملفات ذهبت نهائياً — لا استرداد ممكن",
      "إعادة تثبيت macOS لاسترداد الملفات"
    ],
    "explanation": "Time Machine is macOS's built-in backup solution that creates incremental backups. If configured, you can browse to any point in time and restore deleted files. This is why regular backups are critical. Without Time Machine, data recovery software might help but isn't guaranteed.",
    "explanationAr": "Time Machine هو حل النسخ الاحتياطي المدمج في macOS الذي ينشئ نسخاً احتياطية تزايدية. إذا كان مُعداً، يمكنك التصفح لأي نقطة زمنية واستعادة الملفات المحذوفة."
  }
];

export default function OSCommandLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Terminal className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("OS Command Lab", "مختبر أوامر نظام التشغيل")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <Terminal className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Command Line Pro!", "محترف سطر الأوامر!")}</h4>
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
