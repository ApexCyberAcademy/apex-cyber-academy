/*
  QoS & Traffic Management Lab - Network+ Day 12
  Students configure Quality of Service policies.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { Gauge, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [{"id": 1, "scenario": "A company's VoIP calls are experiencing choppy audio and delays. Their network also carries large file transfers and web browsing. What QoS mechanism should be implemented?", "scenarioAr": "مكالمات VoIP لشركة تعاني من صوت متقطع وتأخيرات. شبكتهم تنقل أيضاً نقل ملفات كبيرة وتصفح الويب. أي آلية QoS يجب تطبيقها؟", "correct": "Priority queuing — mark VoIP packets as high priority (DSCP EF) and guarantee bandwidth", "options": ["Increase total bandwidth", "Priority queuing — mark VoIP packets as high priority (DSCP EF) and guarantee bandwidth", "Block file transfers during business hours", "Use a separate physical network for VoIP"], "optionsAr": ["زيادة النطاق الإجمالي", "الطابور ذو الأولوية — وسم حزم VoIP كأولوية عالية (DSCP EF) وضمان النطاق", "حظر نقل الملفات أثناء ساعات العمل", "استخدام شبكة فيزيائية منفصلة لـ VoIP"], "explanation": "VoIP requires low latency (<150ms), low jitter (<30ms), and minimal packet loss (<1%). QoS with DSCP EF (Expedited Forwarding) marking prioritizes voice packets over bulk data. This ensures voice quality even when the network is congested. Simply adding bandwidth doesn't guarantee priority.", "explanationAr": "VoIP يتطلب تأخيراً منخفضاً (<150ms)، اهتزازاً منخفضاً (<30ms)، وفقدان حزم أدنى (<1%). QoS مع وسم DSCP EF (التوجيه المعجل) يعطي أولوية لحزم الصوت على البيانات الكبيرة."}, {"id": 2, "scenario": "What is the difference between traffic shaping and traffic policing?", "scenarioAr": "ما الفرق بين تشكيل حركة المرور وضبط حركة المرور؟", "correct": "Shaping buffers excess traffic to smooth bursts; policing drops excess traffic that exceeds the rate limit", "options": ["They are the same thing", "Shaping buffers excess traffic to smooth bursts; policing drops excess traffic that exceeds the rate limit", "Shaping is for inbound; policing is for outbound", "Shaping encrypts traffic; policing filters it"], "optionsAr": ["هما نفس الشيء", "التشكيل يخزن حركة المرور الزائدة لتنعيم الانفجارات؛ الضبط يسقط حركة المرور الزائدة التي تتجاوز حد المعدل", "التشكيل للوارد؛ الضبط للصادر", "التشكيل يشفر حركة المرور؛ الضبط يصفيها"], "explanation": "Traffic shaping queues (buffers) excess packets and sends them later, smoothing out bursts — gentler but adds latency. Traffic policing drops or re-marks packets that exceed the configured rate — harsher but no added latency. Shaping is typically used on outbound traffic; policing on inbound.", "explanationAr": "تشكيل حركة المرور يضع في الطابور (يخزن مؤقتاً) الحزم الزائدة ويرسلها لاحقاً، مما ينعم الانفجارات — ألطف لكن يضيف تأخيراً. ضبط حركة المرور يسقط أو يعيد وسم الحزم التي تتجاوز المعدل المُعد — أقسى لكن بدون تأخير إضافي."}, {"id": 3, "scenario": "Which DSCP marking is recommended for video conferencing traffic?", "scenarioAr": "أي وسم DSCP موصى به لحركة مرور مؤتمرات الفيديو؟", "correct": "AF41 (Assured Forwarding class 4, low drop) — high priority with drop protection", "options": ["BE (Best Effort) — default", "EF (Expedited Forwarding) — reserved for voice only", "AF41 (Assured Forwarding class 4, low drop) — high priority with drop protection", "CS1 (Scavenger) — lowest priority"], "optionsAr": ["BE (أفضل جهد) — افتراضي", "EF (التوجيه المعجل) — محجوز للصوت فقط", "AF41 (التوجيه المضمون فئة 4، إسقاط منخفض) — أولوية عالية مع حماية الإسقاط", "CS1 (الكاسح) — أقل أولوية"], "explanation": "RFC 4594 recommends AF41 for video conferencing. EF is reserved for voice (which needs the absolute lowest latency). AF41 provides high priority with low drop probability — appropriate for video which is bandwidth-intensive but slightly more tolerant of jitter than voice. This is the industry standard marking.", "explanationAr": "RFC 4594 يوصي بـ AF41 لمؤتمرات الفيديو. EF محجوز للصوت (الذي يحتاج أقل تأخير مطلق). AF41 يوفر أولوية عالية مع احتمال إسقاط منخفض — مناسب للفيديو الذي يستهلك نطاقاً عريضاً."}];

export default function QoSLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Gauge className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("QoS & Traffic Lab", "مختبر جودة الخدمة وإدارة حركة المرور")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <Gauge className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("QoS Expert!", "خبير جودة الخدمة!")}</h4>
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
