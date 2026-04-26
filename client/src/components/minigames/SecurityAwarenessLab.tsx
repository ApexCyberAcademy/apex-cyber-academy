/*
  Security Awareness Lab - CISM Day 13
  Students design security awareness and training programs.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { GraduationCap, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [{"id": 1, "scenario": "Phishing simulation results show that 35% of employees clicked on the simulated phishing link. What is the MOST effective next step?", "scenarioAr": "نتائج محاكاة التصيد تظهر أن 35% من الموظفين نقروا على رابط التصيد المحاكى. ما هي الخطوة التالية الأكثر فعالية؟", "correct": "Provide targeted training to those who clicked, then retest — and analyze which departments/roles are most vulnerable", "options": ["Terminate all employees who clicked", "Provide targeted training to those who clicked, then retest — and analyze which departments/roles are most vulnerable", "Send a company-wide email warning about phishing", "Disable email for the affected employees"], "optionsAr": ["إنهاء خدمة جميع الموظفين الذين نقروا", "توفير تدريب مستهدف لمن نقروا، ثم إعادة الاختبار — وتحليل أي الأقسام/الأدوار أكثر عرضة", "إرسال بريد إلكتروني على مستوى الشركة يحذر من التصيد", "تعطيل البريد الإلكتروني للموظفين المتأثرين"], "explanation": "Effective response: 1) Provide immediate, targeted training to clickers (not punishment), 2) Analyze patterns (which departments, roles, or email types had highest click rates), 3) Customize future training based on findings, 4) Retest after training to measure improvement, 5) Track metrics over time to show trend improvement. Punitive approaches reduce reporting and create a fear culture.", "explanationAr": "الاستجابة الفعالة: 1) توفير تدريب فوري ومستهدف للناقرين (ليس عقاباً)، 2) تحليل الأنماط، 3) تخصيص التدريب المستقبلي، 4) إعادة الاختبار بعد التدريب لقياس التحسن."}, {"id": 2, "scenario": "What makes a security awareness program effective versus just checking a compliance box?", "scenarioAr": "ما الذي يجعل برنامج التوعية الأمنية فعالاً مقابل مجرد تحقيق متطلب امتثال؟", "correct": "Behavior change — measured through reduced incident rates, improved reporting, and phishing simulation results", "options": ["Completing annual training slides", "Behavior change — measured through reduced incident rates, improved reporting, and phishing simulation results", "Having the most expensive training platform", "Requiring employees to sign a policy acknowledgment"], "optionsAr": ["إكمال شرائح التدريب السنوية", "تغيير السلوك — يُقاس من خلال انخفاض معدلات الحوادث، تحسن الإبلاغ، ونتائج محاكاة التصيد", "امتلاك أغلى منصة تدريب", "مطالبة الموظفين بتوقيع إقرار بالسياسة"], "explanation": "Effective awareness programs focus on behavior change, not just knowledge transfer. Measures of success: declining phishing click rates, increased suspicious email reporting, fewer policy violations, reduced social engineering success. Methods: regular micro-training, gamification, real-world simulations, role-specific content, positive reinforcement for good security behavior.", "explanationAr": "برامج التوعية الفعالة تركز على تغيير السلوك، ليس فقط نقل المعرفة. مقاييس النجاح: انخفاض معدلات النقر على التصيد، زيادة الإبلاغ عن البريد المشبوه."}, {"id": 3, "scenario": "Which group of employees typically poses the HIGHEST risk for social engineering attacks and should receive specialized training?", "scenarioAr": "أي مجموعة من الموظفين عادة تشكل أعلى خطر لهجمات الهندسة الاجتماعية ويجب أن تتلقى تدريباً متخصصاً؟", "correct": "Executive assistants and finance staff — they have access to sensitive data and authority to transfer funds", "options": ["IT security team members", "Executive assistants and finance staff — they have access to sensitive data and authority to transfer funds", "Janitorial staff", "Remote contractors"], "optionsAr": ["أعضاء فريق أمن تكنولوجيا المعلومات", "المساعدون التنفيذيون وموظفو المالية — لديهم وصول لبيانات حساسة وسلطة لتحويل الأموال", "طاقم النظافة", "المقاولون عن بُعد"], "explanation": "Executive assistants and finance staff are prime targets for Business Email Compromise (BEC) and CEO fraud. They can authorize wire transfers, access executive communications, and often have elevated system access. Specialized training should cover: BEC scenarios, wire transfer verification procedures, impersonation tactics, and out-of-band verification for financial requests.", "explanationAr": "المساعدون التنفيذيون وموظفو المالية هم أهداف رئيسية لاختراق البريد الإلكتروني للأعمال (BEC) واحتيال الرئيس التنفيذي. يمكنهم تفويض التحويلات البنكية والوصول لاتصالات المديرين التنفيذيين."}];

export default function SecurityAwarenessLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><GraduationCap className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Security Awareness Lab", "مختبر التوعية الأمنية")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <GraduationCap className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Awareness Champion!", "بطل التوعية!")}</h4>
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
