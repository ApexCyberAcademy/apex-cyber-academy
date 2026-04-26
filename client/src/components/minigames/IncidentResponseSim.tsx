/*
  Incident Response Simulator Mini-Game
  Students step through a security incident choosing the right response actions in order.
  Maps to Security+ Module 4: Security Operations
  Bilingual: English + Arabic
*/

import { useState, useEffect, useCallback } from "react";
import { FileWarning, CheckCircle, XCircle, RotateCcw, ArrowRight, GripVertical, AlertTriangle } from "lucide-react";
import { useLabLang } from "./labI18n";

type Step = {
  id: string;
  label: string;
  labelAr: string;
  description: string;
  descriptionAr: string;
  order: number;
};

type Scenario = {
  id: number;
  title: string;
  titleAr: string;
  situation: string;
  situationAr: string;
  steps: Step[];
  explanation: string;
  explanationAr: string;
};

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "Data Breach - Customer PII Exposed",
    titleAr: "اختراق بيانات - كشف معلومات العملاء الشخصية",
    situation: "Your company's web application was exploited via a SQL injection vulnerability. An attacker exfiltrated a database containing 50,000 customer records including names, emails, and hashed passwords. The breach was discovered when a security researcher found the data for sale on a dark web marketplace.",
    situationAr: "تم استغلال تطبيق الويب الخاص بشركتك عبر ثغرة SQL injection. سرّب مهاجم قاعدة بيانات تحتوي على 50,000 سجل عميل تشمل الأسماء والبريد الإلكتروني وكلمات المرور المشفرة. تم اكتشاف الاختراق عندما وجد باحث أمني البيانات معروضة للبيع في سوق الويب المظلم.",
    steps: [
      { id: "prep", label: "Preparation", labelAr: "التحضير", description: "Activate the incident response team and review the IR plan", descriptionAr: "تفعيل فريق الاستجابة للحوادث ومراجعة خطة الاستجابة", order: 1 },
      { id: "detect", label: "Detection & Analysis", labelAr: "الكشف والتحليل", description: "Analyze web server logs, WAF alerts, and database query logs to confirm the breach scope", descriptionAr: "تحليل سجلات خادم الويب وتنبيهات WAF وسجلات استعلامات قاعدة البيانات لتأكيد نطاق الاختراق", order: 2 },
      { id: "contain", label: "Containment", labelAr: "الاحتواء", description: "Patch the SQL injection vulnerability, rotate database credentials, and isolate the affected server", descriptionAr: "إصلاح ثغرة SQL injection، تدوير بيانات اعتماد قاعدة البيانات، وعزل الخادم المتأثر", order: 3 },
      { id: "eradicate", label: "Eradication", labelAr: "الاستئصال", description: "Remove any backdoors, scan for additional vulnerabilities, and verify no other systems were compromised", descriptionAr: "إزالة أي أبواب خلفية، فحص الثغرات الإضافية، والتحقق من عدم اختراق أنظمة أخرى", order: 4 },
      { id: "recover", label: "Recovery", labelAr: "الاستعادة", description: "Restore the web application with the patched code, force password resets for affected users, and resume normal operations", descriptionAr: "استعادة تطبيق الويب بالكود المصحح، فرض إعادة تعيين كلمات المرور للمستخدمين المتأثرين، واستئناف العمليات الطبيعية", order: 5 },
      { id: "lessons", label: "Lessons Learned", labelAr: "الدروس المستفادة", description: "Document the incident, update the IR plan, implement parameterized queries, and deploy a WAF", descriptionAr: "توثيق الحادثة، تحديث خطة الاستجابة، تنفيذ الاستعلامات المعلمة، ونشر WAF", order: 6 },
    ],
    explanation: "The NIST Incident Response lifecycle has 4 phases: Preparation → Detection & Analysis → Containment, Eradication & Recovery → Post-Incident Activity. Preparation comes first because you need a plan before you can respond. Detection confirms what happened. Containment stops the bleeding. Eradication removes the threat. Recovery restores operations. Lessons learned prevents recurrence.",
    explanationAr: "دورة حياة الاستجابة للحوادث وفق NIST لها 4 مراحل: التحضير ← الكشف والتحليل ← الاحتواء والاستئصال والاستعادة ← نشاط ما بعد الحادثة. التحضير يأتي أولاً لأنك تحتاج خطة قبل أن تستجيب. الكشف يؤكد ما حدث. الاحتواء يوقف النزيف. الاستئصال يزيل التهديد. الاستعادة تعيد العمليات. الدروس المستفادة تمنع التكرار.",
  },
  {
    id: 2,
    title: "Insider Threat - Employee Data Theft",
    titleAr: "تهديد داخلي - سرقة بيانات من موظف",
    situation: "A departing employee in the finance department has been flagged by the DLP system for emailing large spreadsheets containing proprietary financial data to a personal Gmail account over the past 2 weeks. The employee's last day is tomorrow.",
    situationAr: "تم تنبيه نظام DLP بشأن موظف مغادر في قسم المالية يرسل جداول بيانات كبيرة تحتوي على بيانات مالية خاصة إلى حساب Gmail شخصي خلال الأسبوعين الماضيين. آخر يوم عمل للموظف هو غداً.",
    steps: [
      { id: "confirm", label: "Confirm the Alert", labelAr: "تأكيد التنبيه", description: "Review DLP logs to verify the data transfers and classify the sensitivity of the exfiltrated data", descriptionAr: "مراجعة سجلات DLP للتحقق من عمليات نقل البيانات وتصنيف حساسية البيانات المسربة", order: 1 },
      { id: "legal", label: "Engage Legal & HR", labelAr: "إشراك القانونية والموارد البشرية", description: "Brief legal counsel and HR before taking action - insider threats require careful handling of employment law", descriptionAr: "إحاطة المستشار القانوني والموارد البشرية قبل اتخاذ إجراء - التهديدات الداخلية تتطلب تعاملاً حذراً مع قانون العمل", order: 2 },
      { id: "preserve", label: "Preserve Evidence", labelAr: "حفظ الأدلة", description: "Create forensic images of the employee's workstation, email archives, and access logs", descriptionAr: "إنشاء صور جنائية لمحطة عمل الموظف وأرشيفات البريد وسجلات الوصول", order: 3 },
      { id: "restrict", label: "Restrict Access", labelAr: "تقييد الوصول", description: "Revoke the employee's access to sensitive systems and disable external email forwarding", descriptionAr: "إلغاء وصول الموظف إلى الأنظمة الحساسة وتعطيل إعادة توجيه البريد الخارجي", order: 4 },
      { id: "investigate", label: "Full Investigation", labelAr: "تحقيق كامل", description: "Determine the full scope - what data was taken, where it was sent, and whether any accomplices were involved", descriptionAr: "تحديد النطاق الكامل - ما البيانات المأخوذة، أين أُرسلت، وهل هناك شركاء متورطون", order: 5 },
      { id: "remediate", label: "Remediate & Improve", labelAr: "المعالجة والتحسين", description: "Implement stricter DLP rules, review access controls for departing employees, and update the offboarding process", descriptionAr: "تنفيذ قواعد DLP أكثر صرامة، مراجعة ضوابط الوصول للموظفين المغادرين، وتحديث عملية إنهاء الخدمة", order: 6 },
    ],
    explanation: "Insider threat response requires a different approach than external attacks. Legal and HR involvement is critical BEFORE confronting the employee to avoid legal liability. Evidence preservation must happen before access revocation (or the employee may destroy evidence). The investigation determines if this was malicious or accidental, which affects the response.",
    explanationAr: "الاستجابة للتهديدات الداخلية تتطلب نهجاً مختلفاً عن الهجمات الخارجية. إشراك القانونية والموارد البشرية حاسم قبل مواجهة الموظف لتجنب المسؤولية القانونية. حفظ الأدلة يجب أن يحدث قبل إلغاء الوصول (وإلا قد يدمر الموظف الأدلة). التحقيق يحدد ما إذا كان هذا خبيثاً أو عرضياً، مما يؤثر على الاستجابة.",
  },
];

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function IncidentResponseSim({ onComplete }: { onComplete?: (score?: number) => void }) {
  const { tx } = useLabLang();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [userOrder, setUserOrder] = useState<Step[]>(() => shuffleArray(SCENARIOS[0].steps));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);

  const scenario = SCENARIOS[currentScenario];

  const handleDragStart = useCallback((idx: number) => {
    setDragIdx(idx);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    setUserOrder(prev => {
      const next = [...prev];
      const [dragged] = next.splice(dragIdx, 1);
      next.splice(idx, 0, dragged);
      return next;
    });
    setDragIdx(idx);
  }, [dragIdx]);

  const handleDragEnd = useCallback(() => {
    setDragIdx(null);
  }, []);

  const moveItem = useCallback((idx: number, direction: "up" | "down") => {
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    setUserOrder(prev => {
      if (swapIdx < 0 || swapIdx >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
      return next;
    });
  }, []);

  const submit = useCallback(() => {
    setSubmitted(true);
    const correctCount = userOrder.filter((step, idx) => step.order === idx + 1).length;
    const scenarioScore = Math.round((correctCount / userOrder.length) * 100);
    setScore(prev => prev + scenarioScore);
  }, [userOrder]);

  const nextScenario = useCallback(() => {
    if (currentScenario < SCENARIOS.length - 1) {
      const nextIdx = currentScenario + 1;
      setCurrentScenario(nextIdx);
      setUserOrder(shuffleArray(SCENARIOS[nextIdx].steps));
      setSubmitted(false);
    } else {
      setCompleted(true);
    }
  }, [currentScenario]);

  const reset = useCallback(() => {
    setCurrentScenario(0);
    setUserOrder(shuffleArray(SCENARIOS[0].steps));
    setSubmitted(false);
    setScore(0);
    setCompleted(false);
  }, []);

  // Call onComplete when all scenarios are done
  useEffect(() => {
    if (completed && onComplete) {
      onComplete(Math.round(score / SCENARIOS.length));
    }
  }, [completed]);

  return (
    <div className="bg-[#001A16] border-2 border-[#0A6B5A]/40 p-6 my-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center">
          <FileWarning className="w-5 h-5 text-[#D4AF37]" />
        </div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">
            {tx("Incident Response Simulator", "محاكي الاستجابة للحوادث")}
          </h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">
            {tx("Scenario", "سيناريو")} {currentScenario + 1}/{SCENARIOS.length} - {tx("Put the IR steps in the correct order", "رتّب خطوات الاستجابة بالترتيب الصحيح")}
          </p>
        </div>
      </div>

      {completed ? (
        <div className="text-center py-8">
          <FileWarning className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">
            {tx("Simulation Complete!", "اكتملت المحاكاة!")}
          </h4>
          <p className="text-[#C4B9A8] font-['Work_Sans'] mb-4">
            {tx("Average Score", "متوسط النتيجة")}: {Math.round(score / SCENARIOS.length)}%
          </p>
          <button onClick={reset} className="flex items-center gap-2 mx-auto px-6 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all">
            <RotateCcw className="w-4 h-4" /> {tx("Run Again", "ابدأ من جديد")}
          </button>
        </div>
      ) : (
        <>
          {/* Scenario */}
          <div className="bg-[#002F24]/50 border border-[#0A6B5A]/30 p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span className="text-red-400 font-['Montserrat'] text-xs font-bold">
                {tx(scenario.title, scenario.titleAr)}
              </span>
            </div>
            <p className="text-[#E8E0D4] font-['Work_Sans'] text-sm leading-relaxed">
              {tx(scenario.situation, scenario.situationAr)}
            </p>
          </div>

          <p className="text-[#C4B9A8] font-['Montserrat'] text-xs font-semibold mb-3">
            {tx(
              "Drag and drop (or use arrows) to arrange the incident response steps in the correct order:",
              "اسحب وأفلت (أو استخدم الأسهم) لترتيب خطوات الاستجابة للحوادث بالترتيب الصحيح:"
            )}
          </p>

          {/* Sortable Steps */}
          <div className="space-y-2 mb-4">
            {userOrder.map((step, idx) => {
              let borderClass = "border-[#0A6B5A]/30";
              let numColor = "text-[#C4B9A8]";

              if (submitted) {
                if (step.order === idx + 1) {
                  borderClass = "border-[#D4AF37]/50 bg-[#D4AF37]/5";
                  numColor = "text-[#D4AF37]";
                } else {
                  borderClass = "border-red-500/30 bg-red-500/5";
                  numColor = "text-red-400";
                }
              }

              return (
                <div
                  key={step.id}
                  draggable={!submitted}
                  onDragStart={() => handleDragStart(idx)}
                  onDragOver={e => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-3 border p-3 transition-all ${borderClass} ${!submitted ? "cursor-grab active:cursor-grabbing" : ""}`}
                >
                  {!submitted && (
                    <GripVertical className="w-4 h-4 text-[#C4B9A8]/40 shrink-0" />
                  )}
                  <span className={`font-['Montserrat'] text-sm font-bold shrink-0 w-6 ${numColor}`}>
                    {idx + 1}.
                  </span>
                  <div className="flex-1">
                    <span className="text-[#E8E0D4] font-['Montserrat'] text-sm font-semibold">
                      {tx(step.label, step.labelAr)}
                    </span>
                    <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs mt-0.5">
                      {tx(step.description, step.descriptionAr)}
                    </p>
                  </div>
                  {submitted && (
                    step.order === idx + 1
                      ? <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0" />
                      : <div className="text-red-400 font-mono text-xs shrink-0">→ #{step.order}</div>
                  )}
                  {!submitted && (
                    <div className="flex flex-col gap-0.5 shrink-0">
                      <button onClick={() => moveItem(idx, "up")} disabled={idx === 0} className="text-[#C4B9A8] hover:text-[#D4AF37] text-xs disabled:opacity-20">▲</button>
                      <button onClick={() => moveItem(idx, "down")} disabled={idx === userOrder.length - 1} className="text-[#C4B9A8] hover:text-[#D4AF37] text-xs disabled:opacity-20">▼</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Actions */}
          {!submitted ? (
            <button
              onClick={submit}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all"
            >
              {tx("Submit Order", "تأكيد الترتيب")}
            </button>
          ) : (
            <div className="space-y-4">
              <div className="bg-[#0A3D33]/30 border border-[#0A6B5A]/30 p-4">
                <h5 className="text-[#D4AF37] font-['Montserrat'] text-sm font-bold mb-2">
                  {tx("Why this order matters:", "لماذا هذا الترتيب مهم:")}
                </h5>
                <p className="text-[#C4B9A8] font-['Work_Sans'] text-sm leading-relaxed">
                  {tx(scenario.explanation, scenario.explanationAr)}
                </p>
              </div>
              <button
                onClick={nextScenario}
                className="flex items-center gap-2 px-5 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all"
              >
                {currentScenario < SCENARIOS.length - 1
                  ? tx("Next Scenario", "السيناريو التالي")
                  : tx("See Results", "عرض النتائج")
                } <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
