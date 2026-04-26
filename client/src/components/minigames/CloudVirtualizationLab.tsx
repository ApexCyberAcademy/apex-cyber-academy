/*
  Cloud & Virtualization Lab - Tech+ Day 5
  Students match cloud service models and virtualization concepts.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { Cloud, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [
  {
    "id": 1,
    "scenario": "A startup wants to deploy a web application without managing any servers, operating systems, or runtime environments. They just want to upload their code. Which cloud service model should they use?",
    "scenarioAr": "شركة ناشئة تريد نشر تطبيق ويب بدون إدارة أي خوادم أو أنظمة تشغيل أو بيئات تشغيل. يريدون فقط رفع الكود. أي نموذج خدمة سحابية يجب استخدامه؟",
    "correct": "PaaS (Platform as a Service) — manages infrastructure, you manage code",
    "options": [
      "IaaS (Infrastructure as a Service)",
      "PaaS (Platform as a Service) — manages infrastructure, you manage code",
      "SaaS (Software as a Service)",
      "On-premises hosting"
    ],
    "optionsAr": [
      "IaaS (البنية التحتية كخدمة)",
      "PaaS (المنصة كخدمة) — تدير البنية التحتية، أنت تدير الكود",
      "SaaS (البرمجيات كخدمة)",
      "استضافة محلية"
    ],
    "explanation": "PaaS (like Heroku, AWS Elastic Beanstalk, Google App Engine) handles servers, OS, runtime, and scaling — you just deploy code. IaaS gives you VMs to manage yourself. SaaS is finished software (like Gmail). PaaS is the sweet spot for developers who want to focus on code.",
    "explanationAr": "PaaS (مثل Heroku، AWS Elastic Beanstalk، Google App Engine) يتعامل مع الخوادم ونظام التشغيل وبيئة التشغيل والتوسع — أنت فقط تنشر الكود. IaaS يعطيك أجهزة افتراضية لتديرها بنفسك."
  },
  {
    "id": 2,
    "scenario": "What is the key difference between a Type 1 and Type 2 hypervisor?",
    "scenarioAr": "ما هو الفرق الرئيسي بين المشرف الافتراضي من النوع 1 والنوع 2؟",
    "correct": "Type 1 runs directly on hardware (bare-metal); Type 2 runs on top of an OS",
    "options": [
      "Type 1 is free; Type 2 is paid",
      "Type 1 runs directly on hardware (bare-metal); Type 2 runs on top of an OS",
      "Type 1 is for desktops; Type 2 is for servers",
      "Type 1 supports Linux only; Type 2 supports Windows"
    ],
    "optionsAr": [
      "النوع 1 مجاني؛ النوع 2 مدفوع",
      "النوع 1 يعمل مباشرة على الأجهزة (bare-metal)؛ النوع 2 يعمل فوق نظام تشغيل",
      "النوع 1 لأجهزة سطح المكتب؛ النوع 2 للخوادم",
      "النوع 1 يدعم لينكس فقط؛ النوع 2 يدعم ويندوز"
    ],
    "explanation": "Type 1 (bare-metal) hypervisors like VMware ESXi, Microsoft Hyper-V, and Xen run directly on hardware with no host OS — better performance and security for production. Type 2 (hosted) hypervisors like VirtualBox and VMware Workstation run as applications on a host OS — convenient for development/testing.",
    "explanationAr": "المشرف الافتراضي من النوع 1 (bare-metal) مثل VMware ESXi و Microsoft Hyper-V و Xen يعمل مباشرة على الأجهزة بدون نظام تشغيل مضيف — أداء وأمان أفضل للإنتاج. النوع 2 (المستضاف) مثل VirtualBox و VMware Workstation يعمل كتطبيقات على نظام تشغيل مضيف."
  },
  {
    "id": 3,
    "scenario": "A company wants to keep sensitive data on their own servers but use cloud resources for handling traffic spikes during peak seasons. Which cloud deployment model fits?",
    "scenarioAr": "شركة تريد الاحتفاظ بالبيانات الحساسة على خوادمها الخاصة لكن استخدام موارد سحابية للتعامل مع ذروات حركة المرور في مواسم الذروة. أي نموذج نشر سحابي يناسب؟",
    "correct": "Hybrid cloud — combines private infrastructure with public cloud resources",
    "options": [
      "Public cloud only",
      "Private cloud only",
      "Hybrid cloud — combines private infrastructure with public cloud resources",
      "Community cloud"
    ],
    "optionsAr": [
      "سحابة عامة فقط",
      "سحابة خاصة فقط",
      "سحابة هجينة — تجمع البنية التحتية الخاصة مع موارد السحابة العامة",
      "سحابة مجتمعية"
    ],
    "explanation": "Hybrid cloud keeps sensitive workloads on-premises (private cloud) while bursting to public cloud for scalability during peak demand. This 'cloud bursting' pattern gives the best of both worlds: data sovereignty and control for sensitive data, plus elastic scalability when needed.",
    "explanationAr": "السحابة الهجينة تحتفظ بالأحمال الحساسة محلياً (سحابة خاصة) مع الانفجار للسحابة العامة للتوسع أثناء ذروة الطلب. نمط 'انفجار السحابة' هذا يعطي أفضل ما في العالمين."
  }
];

export default function CloudVirtualizationLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Cloud className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Cloud & Virtualization Lab", "مختبر السحابة والمحاكاة الافتراضية")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <Cloud className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Cloud Expert!", "خبير السحابة!")}</h4>
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
