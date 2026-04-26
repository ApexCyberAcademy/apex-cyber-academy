/*
  Access Control Lab - CISM Day 5
  Students evaluate access control models and implementations.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { KeyRound, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [{"id": 1, "scenario": "A hospital needs to ensure that doctors can only access patient records for patients currently under their care. Which access control model is MOST appropriate?", "scenarioAr": "مستشفى يحتاج لضمان أن الأطباء يمكنهم فقط الوصول لسجلات المرضى الموجودين حالياً تحت رعايتهم. أي نموذج تحكم في الوصول هو الأنسب؟", "correct": "Attribute-Based Access Control (ABAC) — uses contextual attributes like care assignment", "options": ["Discretionary Access Control (DAC)", "Role-Based Access Control (RBAC)", "Attribute-Based Access Control (ABAC) — uses contextual attributes like care assignment", "Mandatory Access Control (MAC)"], "optionsAr": ["التحكم في الوصول التقديري (DAC)", "التحكم في الوصول القائم على الأدوار (RBAC)", "التحكم في الوصول القائم على السمات (ABAC) — يستخدم سمات سياقية مثل تعيين الرعاية", "التحكم في الوصول الإلزامي (MAC)"], "explanation": "ABAC evaluates multiple attributes (user role, patient assignment, time, location) to make access decisions. RBAC alone would give all doctors access to all patient records. ABAC can enforce: 'Doctor can access records WHERE patient.assignedDoctor = currentUser AND record.department = user.department'. This provides fine-grained, context-aware access control.", "explanationAr": "ABAC يقيم سمات متعددة (دور المستخدم، تعيين المريض، الوقت، الموقع) لاتخاذ قرارات الوصول. RBAC وحده سيعطي جميع الأطباء الوصول لجميع سجلات المرضى."}, {"id": 2, "scenario": "What is the principle of least privilege and why is it critical for information security?", "scenarioAr": "ما هو مبدأ أقل الامتيازات ولماذا هو حاسم لأمن المعلومات؟", "correct": "Users receive only the minimum access rights needed to perform their job functions", "options": ["All users get admin access for convenience", "Users receive only the minimum access rights needed to perform their job functions", "Access is granted based on seniority", "Everyone shares the same credentials"], "optionsAr": ["جميع المستخدمين يحصلون على وصول المسؤول للراحة", "المستخدمون يحصلون فقط على الحد الأدنى من حقوق الوصول اللازمة لأداء وظائفهم", "يُمنح الوصول بناءً على الأقدمية", "الجميع يتشاركون نفس بيانات الاعتماد"], "explanation": "Least privilege limits each user to the minimum permissions necessary for their role. Benefits: reduces attack surface (compromised account has limited access), limits insider threat damage, supports compliance requirements, and simplifies audit trails. Implementation: regular access reviews, just-in-time access, privilege escalation procedures.", "explanationAr": "أقل الامتيازات يحد كل مستخدم إلى الحد الأدنى من الأذونات اللازمة لدوره. الفوائد: يقلل سطح الهجوم، يحد من أضرار التهديد الداخلي، ويدعم متطلبات الامتثال."}, {"id": 3, "scenario": "During an access review, you discover that a former employee's account is still active 3 months after termination. What does this indicate?", "scenarioAr": "أثناء مراجعة الوصول، تكتشف أن حساب موظف سابق لا يزال نشطاً بعد 3 أشهر من إنهاء الخدمة. ماذا يشير هذا؟", "correct": "A failure in the identity lifecycle management process (deprovisioning)", "options": ["Normal behavior for large organizations", "A failure in the identity lifecycle management process (deprovisioning)", "The account is needed for audit purposes", "IT was too busy to disable it"], "optionsAr": ["سلوك طبيعي للمنظمات الكبيرة", "فشل في عملية إدارة دورة حياة الهوية (إلغاء التوفير)", "الحساب مطلوب لأغراض التدقيق", "قسم تكنولوجيا المعلومات كان مشغولاً جداً لتعطيله"], "explanation": "This is a critical identity lifecycle management failure. Orphaned accounts (active accounts for departed employees) are a major security risk: they can be exploited by the former employee or attackers. Proper deprovisioning should be automated and triggered by HR termination processes. Regular access reviews catch these failures.", "explanationAr": "هذا فشل حرج في إدارة دورة حياة الهوية. الحسابات اليتيمة (حسابات نشطة لموظفين مغادرين) هي خطر أمني كبير: يمكن استغلالها من قبل الموظف السابق أو المهاجمين."}];

export default function AccessControlLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><KeyRound className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Access Control Lab", "مختبر التحكم في الوصول")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <KeyRound className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Access Control Master!", "خبير التحكم في الوصول!")}</h4>
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
