/*
  Incident Detection Lab - CISM Day 8
  Students identify and classify security incidents.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { Radar, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [{"id": 1, "scenario": "A SIEM alert shows 500 failed login attempts from a single IP address within 5 minutes targeting the VPN gateway. How should this be classified?", "scenarioAr": "تنبيه SIEM يظهر 500 محاولة تسجيل دخول فاشلة من عنوان IP واحد خلال 5 دقائق تستهدف بوابة VPN. كيف يجب تصنيف هذا؟", "correct": "Brute-force attack — automated credential guessing against the VPN", "options": ["Normal user behavior — they forgot their password", "Brute-force attack — automated credential guessing against the VPN", "A false positive from the SIEM", "A network scanning event"], "optionsAr": ["سلوك مستخدم طبيعي — نسوا كلمة المرور", "هجوم القوة الغاشمة — تخمين بيانات اعتماد آلي ضد VPN", "إنذار كاذب من SIEM", "حدث فحص شبكة"], "explanation": "500 failed logins in 5 minutes from one IP is a clear brute-force attack pattern. Response: 1) Block the source IP immediately, 2) Check if any attempts succeeded, 3) Verify affected accounts aren't compromised, 4) Review VPN logs for the time period, 5) Consider implementing account lockout and rate limiting if not already in place.", "explanationAr": "500 محاولة تسجيل دخول فاشلة في 5 دقائق من IP واحد هو نمط واضح لهجوم القوة الغاشمة. الاستجابة: 1) حظر IP المصدر فوراً، 2) التحقق مما إذا نجحت أي محاولات."}, {"id": 2, "scenario": "What is the difference between an event, an alert, and an incident in security monitoring?", "scenarioAr": "ما الفرق بين حدث وتنبيه وحادث في مراقبة الأمن؟", "correct": "Event = any observable occurrence; Alert = event matching a rule; Incident = confirmed security violation requiring response", "options": ["They are all the same thing", "Event = any observable occurrence; Alert = event matching a rule; Incident = confirmed security violation requiring response", "Event = major breach; Alert = minor issue; Incident = false positive", "Event = automated; Alert = manual; Incident = external"], "optionsAr": ["كلها نفس الشيء", "حدث = أي حدوث ملاحظ؛ تنبيه = حدث يطابق قاعدة؛ حادث = انتهاك أمني مؤكد يتطلب استجابة", "حدث = اختراق كبير؛ تنبيه = مشكلة صغيرة؛ حادث = إنذار كاذب", "حدث = آلي؛ تنبيه = يدوي؛ حادث = خارجي"], "explanation": "The hierarchy: Events are any observable occurrences (user login, file access). Alerts are events that match detection rules or thresholds (multiple failed logins). Incidents are confirmed security events that violate policy or threaten assets and require formal response. Not all events become alerts, and not all alerts become incidents. Triage determines escalation.", "explanationAr": "التسلسل: الأحداث هي أي حدوث ملاحظ. التنبيهات هي أحداث تطابق قواعد الكشف. الحوادث هي أحداث أمنية مؤكدة تنتهك السياسة وتتطلب استجابة رسمية."}, {"id": 3, "scenario": "What are Indicators of Compromise (IoCs) and how are they used in incident detection?", "scenarioAr": "ما هي مؤشرات الاختراق (IoCs) وكيف تُستخدم في كشف الحوادث؟", "correct": "Artifacts that indicate a system has been compromised — used to detect and hunt for threats", "options": ["Marketing metrics for security products", "Artifacts that indicate a system has been compromised — used to detect and hunt for threats", "Compliance checkboxes for auditors", "Performance benchmarks for security tools"], "optionsAr": ["مقاييس تسويقية لمنتجات الأمن", "قطع أثرية تشير إلى أن النظام قد تم اختراقه — تُستخدم لكشف التهديدات والبحث عنها", "مربعات اختيار الامتثال للمدققين", "معايير أداء لأدوات الأمن"], "explanation": "IoCs are forensic artifacts that indicate malicious activity: IP addresses, domain names, file hashes, registry keys, unusual network patterns, or specific malware signatures. They're shared via threat intelligence feeds (STIX/TAXII format) and loaded into SIEM/IDS systems to detect known threats. IoCs enable proactive threat hunting and faster incident detection.", "explanationAr": "مؤشرات الاختراق هي قطع أثرية جنائية تشير إلى نشاط خبيث: عناوين IP، أسماء النطاقات، تجزئات الملفات، مفاتيح السجل، أنماط شبكة غير عادية."}];

export default function IncidentDetectionLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Radar className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Incident Detection Lab", "مختبر كشف الحوادث")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <Radar className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Detection Specialist!", "أخصائي كشف!")}</h4>
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
