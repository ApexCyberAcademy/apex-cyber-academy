/*
  Network Monitoring Lab - Network+ Day 9
  Students use monitoring tools and interpret network metrics.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { Activity, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [{"id": 1, "scenario": "You notice that a switch port is showing a high number of CRC errors. What does this typically indicate?", "scenarioAr": "لاحظت أن منفذ محول يظهر عدداً كبيراً من أخطاء CRC. ماذا يشير هذا عادة؟", "correct": "Physical layer problem — damaged cable, bad connector, or electromagnetic interference", "options": ["Software bug in the switch firmware", "Physical layer problem — damaged cable, bad connector, or electromagnetic interference", "Too many VLANs configured", "DNS resolution failures"], "optionsAr": ["خلل برمجي في برنامج المحول الثابت", "مشكلة في الطبقة الفيزيائية — كابل تالف أو موصل سيء أو تداخل كهرومغناطيسي", "عدد كبير جداً من VLANs مُعدة", "فشل حل DNS"], "explanation": "CRC (Cyclic Redundancy Check) errors indicate that frames are being corrupted during transmission — a Layer 1 (Physical) issue. Common causes: damaged Ethernet cables, loose connectors, electromagnetic interference from power cables, or failing network interface cards. Replace the cable first.", "explanationAr": "أخطاء CRC (فحص التكرار الدوري) تشير إلى أن الإطارات تتلف أثناء الإرسال — مشكلة الطبقة 1 (الفيزيائية). الأسباب الشائعة: كابلات إيثرنت تالفة، موصلات فضفاضة، تداخل كهرومغناطيسي."}, {"id": 2, "scenario": "Which protocol is used to collect performance data (CPU usage, interface statistics, bandwidth utilization) from network devices?", "scenarioAr": "أي بروتوكول يُستخدم لجمع بيانات الأداء (استخدام CPU، إحصائيات الواجهة، استخدام النطاق) من أجهزة الشبكة؟", "correct": "SNMP (Simple Network Management Protocol)", "options": ["HTTP", "SNMP (Simple Network Management Protocol)", "FTP", "SMTP"], "optionsAr": ["HTTP", "SNMP (بروتوكول إدارة الشبكة البسيط)", "FTP", "SMTP"], "explanation": "SNMP is the standard protocol for network monitoring. It uses agents on devices that expose a MIB (Management Information Base) of metrics. An SNMP manager (like PRTG, Nagios, Zabbix) polls these agents to collect data. SNMPv3 adds encryption and authentication for security.", "explanationAr": "SNMP هو البروتوكول القياسي لمراقبة الشبكة. يستخدم وكلاء على الأجهزة تكشف MIB (قاعدة معلومات الإدارة) من المقاييس. مدير SNMP يستطلع هؤلاء الوكلاء لجمع البيانات."}, {"id": 3, "scenario": "A network baseline shows average bandwidth utilization at 40%. You now see sustained 95% utilization. What should you investigate?", "scenarioAr": "خط أساس الشبكة يظهر متوسط استخدام النطاق عند 40%. الآن ترى استخداماً مستمراً عند 95%. ماذا يجب أن تحقق؟", "correct": "Check for bandwidth-hogging applications, malware, or unauthorized traffic using NetFlow/sFlow", "options": ["Ignore it — networks are supposed to be busy", "Check for bandwidth-hogging applications, malware, or unauthorized traffic using NetFlow/sFlow", "Immediately upgrade the internet connection", "Reboot all switches"], "optionsAr": ["تجاهلها — الشبكات من المفترض أن تكون مشغولة", "التحقق من التطبيقات المستهلكة للنطاق أو البرمجيات الخبيثة أو حركة المرور غير المصرح بها باستخدام NetFlow/sFlow", "ترقية اتصال الإنترنت فوراً", "إعادة تشغيل جميع المحولات"], "explanation": "A jump from 40% to 95% baseline deviation is a red flag. Use flow analysis tools (NetFlow, sFlow, IPFIX) to identify what's consuming bandwidth. Common causes: malware/botnet activity, unauthorized streaming/downloads, backup jobs running during business hours, or a DDoS attack.", "explanationAr": "قفزة من 40% إلى 95% انحراف عن خط الأساس هي علامة تحذير. استخدم أدوات تحليل التدفق (NetFlow، sFlow، IPFIX) لتحديد ما يستهلك النطاق."}];

export default function NetworkMonitoringLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Activity className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Network Monitoring Lab", "مختبر مراقبة الشبكة")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <Activity className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Monitoring Pro!", "محترف المراقبة!")}</h4>
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
