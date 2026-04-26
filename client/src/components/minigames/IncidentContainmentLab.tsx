/*
  Incident Containment Lab - CISM Day 9
  Students make containment and eradication decisions.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { Ban, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [{"id": 1, "scenario": "Ransomware has been detected on 3 workstations in the finance department. The malware appears to be spreading via network shares. What is the IMMEDIATE containment action?", "scenarioAr": "تم اكتشاف برنامج فدية على 3 محطات عمل في قسم المالية. يبدو أن البرنامج الخبيث ينتشر عبر مشاركات الشبكة. ما هو إجراء الاحتواء الفوري؟", "correct": "Isolate the affected segment from the network while preserving evidence", "options": ["Shut down the entire network", "Isolate the affected segment from the network while preserving evidence", "Pay the ransom immediately", "Wait and monitor to see how far it spreads"], "optionsAr": ["إيقاف الشبكة بالكامل", "عزل الجزء المتأثر من الشبكة مع الحفاظ على الأدلة", "دفع الفدية فوراً", "الانتظار والمراقبة لمعرفة مدى انتشاره"], "explanation": "Immediate network isolation of affected systems prevents further spread while preserving forensic evidence. Steps: 1) Disconnect affected machines from network (don't power off — preserves memory evidence), 2) Block the malware's C2 communication at the firewall, 3) Disable affected network shares, 4) Image affected systems for forensics, 5) Identify patient zero and attack vector.", "explanationAr": "العزل الفوري للشبكة للأنظمة المتأثرة يمنع المزيد من الانتشار مع الحفاظ على الأدلة الجنائية. الخطوات: 1) فصل الأجهزة المتأثرة من الشبكة (لا تطفئها — تحافظ على أدلة الذاكرة)."}, {"id": 2, "scenario": "After containing a malware incident, the eradication phase begins. What must be verified BEFORE restoring systems from backup?", "scenarioAr": "بعد احتواء حادث برنامج خبيث، تبدأ مرحلة الاستئصال. ما الذي يجب التحقق منه قبل استعادة الأنظمة من النسخ الاحتياطي؟", "correct": "That backups are clean (pre-date the compromise) and the attack vector has been eliminated", "options": ["That the CEO has approved the restoration", "That backups are clean (pre-date the compromise) and the attack vector has been eliminated", "That all employees have changed their passwords", "That the insurance company has been notified"], "optionsAr": ["أن الرئيس التنفيذي وافق على الاستعادة", "أن النسخ الاحتياطية نظيفة (تسبق الاختراق) وأن ناقل الهجوم قد تم القضاء عليه", "أن جميع الموظفين غيروا كلمات المرور", "أن شركة التأمين تم إخطارها"], "explanation": "Before restoration: 1) Verify backup integrity — ensure backups pre-date the initial compromise (attackers may have been present for weeks), 2) Confirm the attack vector is eliminated (patched vulnerability, removed malware persistence), 3) Rebuild from known-good images when possible, 4) Apply all security patches before reconnecting to network.", "explanationAr": "قبل الاستعادة: 1) التحقق من سلامة النسخ الاحتياطية — التأكد من أنها تسبق الاختراق الأولي، 2) تأكيد القضاء على ناقل الهجوم، 3) إعادة البناء من صور معروفة جيدة عند الإمكان."}, {"id": 3, "scenario": "What is the difference between short-term and long-term containment strategies?", "scenarioAr": "ما الفرق بين استراتيجيات الاحتواء قصيرة المدى وطويلة المدى؟", "correct": "Short-term stops immediate damage (isolate); long-term allows operations while preparing for eradication", "options": ["There is no difference", "Short-term stops immediate damage (isolate); long-term allows operations while preparing for eradication", "Short-term is for small incidents; long-term is for large ones", "Short-term uses software; long-term uses hardware"], "optionsAr": ["لا يوجد فرق", "قصير المدى يوقف الضرر الفوري (العزل)؛ طويل المدى يسمح بالعمليات أثناء التحضير للاستئصال", "قصير المدى للحوادث الصغيرة؛ طويل المدى للكبيرة", "قصير المدى يستخدم البرمجيات؛ طويل المدى يستخدم الأجهزة"], "explanation": "Short-term containment: immediate actions to stop the bleeding (network isolation, blocking IPs, disabling accounts). Long-term containment: temporary measures that allow business to continue while the team prepares for full eradication (setting up clean replacement systems, applying temporary patches, enhanced monitoring). Both are necessary — short-term buys time, long-term maintains operations.", "explanationAr": "الاحتواء قصير المدى: إجراءات فورية لوقف النزيف (عزل الشبكة، حظر عناوين IP). الاحتواء طويل المدى: تدابير مؤقتة تسمح للأعمال بالاستمرار أثناء التحضير للاستئصال الكامل."}];

export default function IncidentContainmentLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Ban className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Containment Lab", "مختبر الاحتواء")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <Ban className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Containment Expert!", "خبير احتواء!")}</h4>
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
