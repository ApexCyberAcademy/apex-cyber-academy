/*
  Security Architecture Lab - CISM Day 6
  Students design security architecture solutions.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { Blocks, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [{"id": 1, "scenario": "An organization is migrating to cloud services. What is the MOST important security consideration for the information security manager?", "scenarioAr": "منظمة تنتقل لخدمات السحابة. ما هو أهم اعتبار أمني لمدير أمن المعلومات؟", "correct": "Understanding the shared responsibility model and ensuring contractual security obligations", "options": ["Blocking all cloud services", "Understanding the shared responsibility model and ensuring contractual security obligations", "Requiring the cloud provider to handle all security", "Moving all data to the cloud immediately"], "optionsAr": ["حظر جميع خدمات السحابة", "فهم نموذج المسؤولية المشتركة وضمان الالتزامات الأمنية التعاقدية", "مطالبة مزود السحابة بالتعامل مع كل الأمن", "نقل جميع البيانات للسحابة فوراً"], "explanation": "The shared responsibility model defines which security controls the cloud provider manages vs. what the customer must handle. In IaaS, the customer manages OS, apps, and data. In SaaS, the provider manages most infrastructure but the customer still owns data classification, access control, and compliance. Contracts (SLAs) must specify security requirements, audit rights, and incident notification.", "explanationAr": "نموذج المسؤولية المشتركة يحدد أي ضوابط أمنية يديرها مزود السحابة مقابل ما يجب على العميل التعامل معه."}, {"id": 2, "scenario": "What is defense-in-depth and how does it apply to security architecture?", "scenarioAr": "ما هو الدفاع في العمق وكيف ينطبق على هندسة الأمن؟", "correct": "Multiple layers of security controls so that if one fails, others still protect assets", "options": ["Having one very strong firewall", "Multiple layers of security controls so that if one fails, others still protect assets", "Encrypting everything with the strongest algorithm", "Hiring more security staff"], "optionsAr": ["وجود جدار حماية واحد قوي جداً", "طبقات متعددة من ضوابط الأمن بحيث إذا فشلت واحدة، الأخرى لا تزال تحمي الأصول", "تشفير كل شيء بأقوى خوارزمية", "توظيف المزيد من موظفي الأمن"], "explanation": "Defense-in-depth uses multiple, overlapping security layers: physical (locks, guards), network (firewalls, IDS), host (antivirus, hardening), application (input validation, WAF), data (encryption, DLP), and administrative (policies, training). If an attacker bypasses one layer, subsequent layers still provide protection. No single control is relied upon exclusively.", "explanationAr": "الدفاع في العمق يستخدم طبقات أمنية متعددة ومتداخلة: فيزيائية، شبكية، مضيف، تطبيق، بيانات، وإدارية. إذا تجاوز المهاجم طبقة واحدة، الطبقات اللاحقة لا تزال توفر الحماية."}, {"id": 3, "scenario": "What is the purpose of network segmentation in security architecture?", "scenarioAr": "ما هو الغرض من تقسيم الشبكة في هندسة الأمن؟", "correct": "Isolating network zones to contain breaches and control traffic flow between segments", "options": ["Making the network faster", "Isolating network zones to contain breaches and control traffic flow between segments", "Reducing the number of IP addresses needed", "Simplifying network management"], "optionsAr": ["جعل الشبكة أسرع", "عزل مناطق الشبكة لاحتواء الاختراقات والتحكم في تدفق حركة المرور بين الأجزاء", "تقليل عدد عناوين IP المطلوبة", "تبسيط إدارة الشبكة"], "explanation": "Network segmentation divides the network into isolated zones (DMZ, internal, management, PCI). Benefits: limits lateral movement during a breach, enables granular access control between zones, supports compliance (PCI DSS requires cardholder data isolation), and improves monitoring by reducing traffic scope per segment. Implement with VLANs, firewalls, and micro-segmentation.", "explanationAr": "تقسيم الشبكة يقسم الشبكة إلى مناطق معزولة. الفوائد: يحد من الحركة الجانبية أثناء الاختراق، يمكّن التحكم الدقيق في الوصول بين المناطق، ويدعم الامتثال."}];

export default function SecurityArchitectureLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Blocks className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Security Architecture Lab", "مختبر هندسة الأمن")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <Blocks className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Security Architect!", "مهندس أمن!")}</h4>
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
