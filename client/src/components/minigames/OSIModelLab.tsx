/*
  OSI Model Lab - Network+ Day 1
  Students identify OSI layers and their functions.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { Layers, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [{"id": 1, "scenario": "A network technician is troubleshooting a connectivity issue. They can ping the server by IP address but not by hostname. At which OSI layer is the problem occurring?", "scenarioAr": "فني شبكات يستكشف مشكلة اتصال. يمكنه عمل ping للخادم بعنوان IP لكن ليس باسم المضيف. في أي طبقة OSI تحدث المشكلة؟", "correct": "Layer 7 (Application) — DNS resolution is an application-layer service", "options": ["Layer 1 (Physical)", "Layer 3 (Network)", "Layer 4 (Transport)", "Layer 7 (Application) — DNS resolution is an application-layer service"], "optionsAr": ["الطبقة 1 (الفيزيائية)", "الطبقة 3 (الشبكة)", "الطبقة 4 (النقل)", "الطبقة 7 (التطبيق) — حل DNS هو خدمة طبقة التطبيق"], "explanation": "DNS operates at Layer 7 (Application). Since IP connectivity works (ping by IP succeeds), Layers 1-4 are functioning correctly. The failure is specifically in name resolution, which is an application-layer service. Check DNS server configuration, DNS service status, or hosts file.", "explanationAr": "DNS يعمل في الطبقة 7 (التطبيق). بما أن اتصال IP يعمل (ping بعنوان IP ينجح)، الطبقات 1-4 تعمل بشكل صحيح. الفشل تحديداً في حل الأسماء، وهو خدمة طبقة التطبيق."}, {"id": 2, "scenario": "Which OSI layer is responsible for establishing, managing, and terminating connections between applications?", "scenarioAr": "أي طبقة OSI مسؤولة عن إنشاء وإدارة وإنهاء الاتصالات بين التطبيقات؟", "correct": "Layer 5 (Session) — manages dialog control and synchronization", "options": ["Layer 4 (Transport)", "Layer 5 (Session) — manages dialog control and synchronization", "Layer 6 (Presentation)", "Layer 7 (Application)"], "optionsAr": ["الطبقة 4 (النقل)", "الطبقة 5 (الجلسة) — تدير التحكم في الحوار والتزامن", "الطبقة 6 (العرض)", "الطبقة 7 (التطبيق)"], "explanation": "Layer 5 (Session) establishes, maintains, and terminates sessions between applications. It handles dialog control (half-duplex vs full-duplex), synchronization checkpoints, and session recovery. Examples include NetBIOS, RPC, and SQL sessions.", "explanationAr": "الطبقة 5 (الجلسة) تنشئ وتحافظ على وتنهي الجلسات بين التطبيقات. تتعامل مع التحكم في الحوار (نصف مزدوج مقابل مزدوج كامل)، نقاط تفتيش التزامن، واستعادة الجلسة."}, {"id": 3, "scenario": "A switch uses MAC addresses to forward frames to the correct port. At which OSI layer does a switch primarily operate?", "scenarioAr": "محول يستخدم عناوين MAC لتوجيه الإطارات للمنفذ الصحيح. في أي طبقة OSI يعمل المحول بشكل أساسي؟", "correct": "Layer 2 (Data Link) — MAC addressing and frame switching", "options": ["Layer 1 (Physical)", "Layer 2 (Data Link) — MAC addressing and frame switching", "Layer 3 (Network)", "Layer 4 (Transport)"], "optionsAr": ["الطبقة 1 (الفيزيائية)", "الطبقة 2 (ربط البيانات) — عنونة MAC وتبديل الإطارات", "الطبقة 3 (الشبكة)", "الطبقة 4 (النقل)"], "explanation": "Switches operate at Layer 2 (Data Link), using MAC addresses to make forwarding decisions. They build MAC address tables by learning source addresses and forward frames only to the port where the destination MAC resides. Layer 3 switches can also route using IP addresses.", "explanationAr": "المحولات تعمل في الطبقة 2 (ربط البيانات)، تستخدم عناوين MAC لاتخاذ قرارات التوجيه. تبني جداول عناوين MAC بتعلم عناوين المصدر وتوجيه الإطارات فقط للمنفذ حيث يوجد عنوان MAC الوجهة."}];

export default function OSIModelLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Layers className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("OSI Model Lab", "مختبر نموذج OSI")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <Layers className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("OSI Expert!", "خبير OSI!")}</h4>
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
