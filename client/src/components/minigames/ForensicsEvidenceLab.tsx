/*
  Forensics & Evidence Lab - CISM Day 10
  Students handle digital forensics and evidence preservation.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { Fingerprint, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [{"id": 1, "scenario": "A security analyst needs to collect evidence from a compromised server. What is the correct order of volatility for evidence collection?", "scenarioAr": "محلل أمني يحتاج لجمع أدلة من خادم مخترق. ما هو الترتيب الصحيح لتقلب جمع الأدلة؟", "correct": "CPU registers → RAM → Swap/temp files → Disk → Network logs → Archival media", "options": ["Disk → RAM → Network → CPU", "CPU registers → RAM → Swap/temp files → Disk → Network logs → Archival media", "Network → Disk → RAM → CPU", "Archival media → Disk → RAM → CPU"], "optionsAr": ["القرص ← الذاكرة ← الشبكة ← المعالج", "سجلات المعالج ← الذاكرة ← ملفات المبادلة/المؤقتة ← القرص ← سجلات الشبكة ← وسائط الأرشيف", "الشبكة ← القرص ← الذاكرة ← المعالج", "وسائط الأرشيف ← القرص ← الذاكرة ← المعالج"], "explanation": "The order of volatility (RFC 3227) dictates collecting the most volatile evidence first: 1) CPU registers/cache (lost immediately), 2) RAM (lost on power off), 3) Swap/temp files, 4) Hard disk, 5) Remote logging/monitoring data, 6) Physical configuration, 7) Archival media. This ensures the most perishable evidence is captured before it's lost.", "explanationAr": "ترتيب التقلب (RFC 3227) يملي جمع الأدلة الأكثر تقلباً أولاً: 1) سجلات/ذاكرة المعالج، 2) الذاكرة العشوائية، 3) ملفات المبادلة/المؤقتة، 4) القرص الصلب."}, {"id": 2, "scenario": "What is the chain of custody and why is it critical in digital forensics?", "scenarioAr": "ما هي سلسلة الحراسة ولماذا هي حاسمة في الأدلة الرقمية؟", "correct": "A documented record of who handled evidence, when, and what they did — ensures evidence admissibility", "options": ["A blockchain for storing evidence", "A documented record of who handled evidence, when, and what they did — ensures evidence admissibility", "The encryption key management process", "A backup rotation schedule"], "optionsAr": ["سلسلة كتل لتخزين الأدلة", "سجل موثق لمن تعامل مع الأدلة ومتى وماذا فعلوا — يضمن قبول الأدلة", "عملية إدارة مفاتيح التشفير", "جدول تدوير النسخ الاحتياطي"], "explanation": "Chain of custody documents every person who handled evidence, when they received/transferred it, what they did with it, and how it was stored. Without proper chain of custody, evidence may be deemed inadmissible in court (could have been tampered with). Requirements: tamper-evident containers, hash verification, signed transfer forms, secure storage.", "explanationAr": "سلسلة الحراسة توثق كل شخص تعامل مع الأدلة، متى استلمها/نقلها، ماذا فعل بها، وكيف تم تخزينها. بدون سلسلة حراسة مناسبة، قد تُعتبر الأدلة غير مقبولة في المحكمة."}, {"id": 3, "scenario": "When creating a forensic image of a hard drive, what tool ensures the integrity of the copy?", "scenarioAr": "عند إنشاء صورة جنائية لقرص صلب، أي أداة تضمن سلامة النسخة؟", "correct": "Cryptographic hash (MD5/SHA-256) — computed before and after imaging to verify exact copy", "options": ["A screenshot of the desktop", "Cryptographic hash (MD5/SHA-256) — computed before and after imaging to verify exact copy", "A virus scan of the drive", "File count comparison"], "optionsAr": ["لقطة شاشة لسطح المكتب", "تجزئة تشفيرية (MD5/SHA-256) — تُحسب قبل وبعد التصوير للتحقق من النسخة الدقيقة", "فحص فيروسات للقرص", "مقارنة عدد الملفات"], "explanation": "Cryptographic hashing (MD5, SHA-1, SHA-256) creates a unique fingerprint of the original drive. After imaging, the same hash is computed on the copy. If hashes match, the copy is a bit-for-bit exact replica. Use write-blockers during imaging to prevent any modification to the original. Tools: FTK Imager, dd, EnCase.", "explanationAr": "التجزئة التشفيرية تنشئ بصمة فريدة للقرص الأصلي. بعد التصوير، يتم حساب نفس التجزئة على النسخة. إذا تطابقت التجزئات، النسخة هي نسخة طبق الأصل بت ببت."}];

export default function ForensicsEvidenceLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Fingerprint className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Digital Forensics Lab", "مختبر الأدلة الرقمية")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <Fingerprint className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Forensics Expert!", "خبير أدلة رقمية!")}</h4>
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
