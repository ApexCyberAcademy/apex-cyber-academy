/*
  Documentation & Compliance Lab - Network+ Day 13
  Students create network documentation and understand compliance.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { FileText, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [{"id": 1, "scenario": "A network engineer is leaving the company. Which documentation is MOST critical to have updated before their departure?", "scenarioAr": "مهندس شبكات يغادر الشركة. أي توثيق هو الأكثر أهمية لتحديثه قبل مغادرتهم؟", "correct": "Network topology diagrams, IP address management (IPAM), and device configuration backups", "options": ["Their personal notes and bookmarks", "Network topology diagrams, IP address management (IPAM), and device configuration backups", "The company org chart", "Meeting minutes from the last quarter"], "optionsAr": ["ملاحظاتهم الشخصية والإشارات المرجعية", "مخططات طوبولوجيا الشبكة، إدارة عناوين IP (IPAM)، ونسخ احتياطية لتكوين الأجهزة", "مخطط الهيكل التنظيمي للشركة", "محاضر الاجتماعات من الربع الأخير"], "explanation": "When a network engineer leaves, the most critical documentation includes: 1) Updated network topology (physical and logical diagrams), 2) IP address management records (subnets, VLANs, DHCP scopes), 3) Device configuration backups (switches, routers, firewalls), and 4) Credential/access information. Without these, the replacement engineer is flying blind.", "explanationAr": "عندما يغادر مهندس شبكات، أهم التوثيق يشمل: 1) طوبولوجيا الشبكة المحدثة، 2) سجلات إدارة عناوين IP، 3) نسخ احتياطية لتكوين الأجهزة، و 4) معلومات بيانات الاعتماد/الوصول."}, {"id": 2, "scenario": "Your company processes credit card payments. Which compliance standard MUST your network meet?", "scenarioAr": "شركتك تعالج مدفوعات بطاقات الائتمان. أي معيار امتثال يجب أن تستوفيه شبكتك؟", "correct": "PCI DSS (Payment Card Industry Data Security Standard)", "options": ["HIPAA", "PCI DSS (Payment Card Industry Data Security Standard)", "SOX (Sarbanes-Oxley)", "FERPA"], "optionsAr": ["HIPAA", "PCI DSS (معيار أمان بيانات صناعة بطاقات الدفع)", "SOX (ساربانيس-أوكسلي)", "FERPA"], "explanation": "PCI DSS is mandatory for any organization that stores, processes, or transmits credit card data. It requires: network segmentation, encryption of cardholder data, firewall protection, access controls, regular vulnerability scanning, and penetration testing. Non-compliance can result in fines and loss of card processing ability.", "explanationAr": "PCI DSS إلزامي لأي منظمة تخزن أو تعالج أو تنقل بيانات بطاقات الائتمان. يتطلب: تقسيم الشبكة، تشفير بيانات حامل البطاقة، حماية جدار الحماية، ضوابط الوصول، فحص الثغرات المنتظم، واختبار الاختراق."}, {"id": 3, "scenario": "What is a change management process and why is it important for network operations?", "scenarioAr": "ما هي عملية إدارة التغيير ولماذا هي مهمة لعمليات الشبكة؟", "correct": "A formal process to request, review, approve, implement, and document network changes — prevents outages from untested changes", "options": ["A way to track employee promotions", "A formal process to request, review, approve, implement, and document network changes — prevents outages from untested changes", "Software for version control", "A backup strategy"], "optionsAr": ["طريقة لتتبع ترقيات الموظفين", "عملية رسمية لطلب ومراجعة والموافقة على وتنفيذ وتوثيق تغييرات الشبكة — تمنع الانقطاعات من التغييرات غير المختبرة", "برمجيات للتحكم في الإصدارات", "استراتيجية نسخ احتياطي"], "explanation": "Change management ensures that network modifications (firmware updates, configuration changes, new equipment) are planned, tested, approved, and documented. It includes: change request, impact assessment, approval by CAB (Change Advisory Board), implementation window, rollback plan, and post-change verification. Most network outages are caused by unplanned changes.", "explanationAr": "إدارة التغيير تضمن أن تعديلات الشبكة (تحديثات البرنامج الثابت، تغييرات التكوين، معدات جديدة) مخططة ومختبرة ومعتمدة وموثقة."}];

export default function NetworkDocumentationLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><FileText className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Documentation & Compliance Lab", "مختبر التوثيق والامتثال")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <FileText className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Documentation Pro!", "محترف التوثيق!")}</h4>
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
