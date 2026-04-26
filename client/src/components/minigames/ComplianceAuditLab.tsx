/*
  Compliance & Audit Lab
  Students match regulatory frameworks to business scenarios.
  Maps to Security+ Day 14: Governance, Compliance, and Exam Preparation
  Bilingual: English + Arabic
*/

import { useState, useEffect, useCallback } from "react";
import { Scale, CheckCircle, XCircle, RotateCcw, ArrowRight, FileCheck } from "lucide-react";
import { useLabLang } from "./labI18n";

type ComplianceQ = {
  id: number;
  scenario: string;
  scenarioAr: string;
  correctFramework: string;
  options: string[];
  optionsAr: string[];
  explanation: string;
  explanationAr: string;
};

const QUESTIONS: ComplianceQ[] = [
  {
    id: 1,
    scenario: "A US hospital is implementing a new patient portal where patients can view lab results, schedule appointments, and message their doctors. What is the PRIMARY compliance framework they must follow?",
    scenarioAr: "مستشفى أمريكي ينفذ بوابة مرضى جديدة حيث يمكن للمرضى عرض نتائج المختبر وجدولة المواعيد ومراسلة أطبائهم. ما هو إطار الامتثال الأساسي الذي يجب اتباعه؟",
    correctFramework: "HIPAA (Health Insurance Portability and Accountability Act)",
    options: ["PCI-DSS", "HIPAA (Health Insurance Portability and Accountability Act)", "SOX (Sarbanes-Oxley Act)", "GDPR (General Data Protection Regulation)"],
    optionsAr: ["PCI-DSS", "HIPAA (قانون قابلية نقل التأمين الصحي والمساءلة)", "SOX (قانون ساربينز-أوكسلي)", "GDPR (اللائحة العامة لحماية البيانات)"],
    explanation: "HIPAA governs the protection of Protected Health Information (PHI) in the US healthcare system. Any system handling patient medical records, lab results, or doctor communications must comply with HIPAA's Privacy Rule, Security Rule, and Breach Notification Rule.",
    explanationAr: "HIPAA يحكم حماية المعلومات الصحية المحمية (PHI) في نظام الرعاية الصحية الأمريكي. أي نظام يتعامل مع السجلات الطبية للمرضى أو نتائج المختبر أو اتصالات الأطباء يجب أن يمتثل لقاعدة الخصوصية وقاعدة الأمان وقاعدة إشعار الاختراق في HIPAA.",
  },
  {
    id: 2,
    scenario: "A European online retailer processes credit card payments and ships to customers across the EU. They store customer names, addresses, and payment card numbers. Which TWO frameworks apply?",
    scenarioAr: "بائع تجزئة أوروبي عبر الإنترنت يعالج مدفوعات بطاقات الائتمان ويشحن للعملاء عبر الاتحاد الأوروبي. يخزنون أسماء العملاء والعناوين وأرقام بطاقات الدفع. أي إطارين ينطبقان؟",
    correctFramework: "PCI-DSS + GDPR",
    options: ["HIPAA + SOX", "PCI-DSS + GDPR", "NIST CSF + ISO 27001", "FERPA + COPPA"],
    optionsAr: ["HIPAA + SOX", "PCI-DSS + GDPR", "NIST CSF + ISO 27001", "FERPA + COPPA"],
    explanation: "PCI-DSS applies because they process and store payment card data. GDPR applies because they process personal data of EU residents (names, addresses). Both frameworks must be satisfied simultaneously — PCI-DSS for card data security, GDPR for personal data rights and privacy.",
    explanationAr: "PCI-DSS ينطبق لأنهم يعالجون ويخزنون بيانات بطاقات الدفع. GDPR ينطبق لأنهم يعالجون البيانات الشخصية لسكان الاتحاد الأوروبي (الأسماء والعناوين). يجب تلبية كلا الإطارين في وقت واحد — PCI-DSS لأمان بيانات البطاقات، GDPR لحقوق البيانات الشخصية والخصوصية.",
  },
  {
    id: 3,
    scenario: "A publicly traded US financial services company is implementing new internal controls for their financial reporting systems after their auditors flagged deficiencies.",
    scenarioAr: "شركة خدمات مالية أمريكية مدرجة في البورصة تنفذ ضوابط داخلية جديدة لأنظمة التقارير المالية بعد أن أشار مدققوها إلى أوجه قصور.",
    correctFramework: "SOX (Sarbanes-Oxley Act)",
    options: ["PCI-DSS", "HIPAA", "SOX (Sarbanes-Oxley Act)", "CCPA (California Consumer Privacy Act)"],
    optionsAr: ["PCI-DSS", "HIPAA", "SOX (قانون ساربينز-أوكسلي)", "CCPA (قانون خصوصية المستهلك في كاليفورنيا)"],
    explanation: "SOX (Sarbanes-Oxley) requires publicly traded companies to maintain adequate internal controls over financial reporting. Section 404 specifically mandates management assessment of internal controls. Auditor-flagged deficiencies must be remediated under SOX compliance.",
    explanationAr: "SOX (ساربينز-أوكسلي) يتطلب من الشركات المدرجة في البورصة الحفاظ على ضوابط داخلية كافية على التقارير المالية. القسم 404 يفرض تحديداً تقييم الإدارة للضوابط الداخلية. أوجه القصور التي يشير إليها المدققون يجب معالجتها بموجب امتثال SOX.",
  },
  {
    id: 4,
    scenario: "A US university is building a mobile app for students to access grades, financial aid information, and class schedules. The app will also be used by students under 13 in their early college program.",
    scenarioAr: "جامعة أمريكية تبني تطبيق جوال للطلاب للوصول إلى الدرجات ومعلومات المساعدة المالية وجداول الحصص. سيُستخدم التطبيق أيضاً من قبل طلاب تحت 13 عاماً في برنامج الكلية المبكر.",
    correctFramework: "FERPA + COPPA",
    options: ["HIPAA + PCI-DSS", "GDPR + CCPA", "FERPA + COPPA", "SOX + GLBA"],
    optionsAr: ["HIPAA + PCI-DSS", "GDPR + CCPA", "FERPA + COPPA", "SOX + GLBA"],
    explanation: "FERPA (Family Educational Rights and Privacy Act) protects student education records at institutions receiving federal funding. COPPA (Children's Online Privacy Protection Act) applies because the app collects data from children under 13. Both must be satisfied — FERPA for all student records, COPPA for the under-13 users.",
    explanationAr: "FERPA (قانون حقوق الأسرة التعليمية والخصوصية) يحمي سجلات الطلاب التعليمية في المؤسسات التي تتلقى تمويلاً فيدرالياً. COPPA (قانون حماية خصوصية الأطفال عبر الإنترنت) ينطبق لأن التطبيق يجمع بيانات من أطفال تحت 13 عاماً. يجب تلبية كليهما — FERPA لجميع سجلات الطلاب، COPPA للمستخدمين تحت 13.",
  },
  {
    id: 5,
    scenario: "During an audit, you discover that an employee has been accessing customer financial records without a legitimate business need. What type of policy violation is this?",
    scenarioAr: "أثناء التدقيق، تكتشف أن موظفاً كان يصل إلى السجلات المالية للعملاء بدون حاجة عمل مشروعة. ما نوع انتهاك السياسة هذا؟",
    correctFramework: "Least Privilege / Need-to-Know violation",
    options: ["Acceptable Use Policy (AUP) violation", "Least Privilege / Need-to-Know violation", "Data Retention Policy violation", "Change Management Policy violation"],
    optionsAr: ["انتهاك سياسة الاستخدام المقبول (AUP)", "انتهاك مبدأ الامتياز الأدنى / الحاجة للمعرفة", "انتهاك سياسة الاحتفاظ بالبيانات", "انتهاك سياسة إدارة التغيير"],
    explanation: "The Principle of Least Privilege states users should only have access to resources needed for their job function. Accessing customer financial records without business need violates both least privilege and need-to-know principles. This is a serious security and compliance concern that may also violate regulations like GLBA.",
    explanationAr: "مبدأ الامتياز الأدنى ينص على أن المستخدمين يجب أن يكون لديهم فقط الوصول للموارد اللازمة لوظيفتهم. الوصول للسجلات المالية للعملاء بدون حاجة عمل ينتهك كلاً من مبدأ الامتياز الأدنى والحاجة للمعرفة.",
  },
];

export default function ComplianceAuditLab({ onComplete }: { onComplete?: (score?: number) => void }) {
  const { tx } = useLabLang();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const q = QUESTIONS[current];

  const handleSubmit = useCallback(() => {
    if (selected === null) return;
    setShowResult(true);
    if (q.options[selected] === q.correctFramework) setScore(s => s + 1);
  }, [selected, q]);

  const handleNext = useCallback(() => {
    if (current < QUESTIONS.length - 1) { setCurrent(c => c + 1); setSelected(null); setShowResult(false); }
    else setCompleted(true);
  }, [current]);

  const reset = useCallback(() => { setCurrent(0); setSelected(null); setShowResult(false); setScore(0); setCompleted(false); }, []);

  return (
    <div className="bg-[#001A16] border-2 border-[#0A6B5A]/40 p-6 my-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Scale className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Compliance & Governance Lab", "مختبر الامتثال والحوكمة")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Case", "حالة")} {current + 1}/{QUESTIONS.length} - {tx("Score", "النتيجة")}: {score}/{QUESTIONS.length}</p>
        </div>
      </div>

      {completed ? (
        <div className="text-center py-8">
          <FileCheck className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Compliance Officer!", "مسؤول الامتثال!")}</h4>
          <p className="text-[#C4B9A8] font-['Work_Sans'] mb-4">{tx(`You scored ${score}/${QUESTIONS.length}!`, `حصلت على ${score}/${QUESTIONS.length}!`)}</p>
          <button onClick={reset} className="flex items-center gap-2 mx-auto px-6 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all"><RotateCcw className="w-4 h-4" /> {tx("Play Again", "ابدأ من جديد")}</button>
        </div>
      ) : (
        <>
          <div className="bg-[#002F24]/50 border border-[#0A6B5A]/30 p-4 mb-4">
            <p className="text-[#E8E0D4] font-['Work_Sans'] text-sm">{tx(q.scenario, q.scenarioAr)}</p>
          </div>

          <div className="space-y-2 mb-4">
            {q.options.map((opt, i) => (
              <button key={i} onClick={() => !showResult && setSelected(i)}
                className={`w-full text-left p-3 border font-['Work_Sans'] text-sm transition-all ${
                  showResult
                    ? opt === q.correctFramework ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]" : i === selected ? "border-red-500/50 bg-red-500/10 text-red-400" : "border-[#0A6B5A]/20 text-[#C4B9A8]/50"
                    : selected === i ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]" : "border-[#0A6B5A]/30 text-[#C4B9A8] hover:border-[#D4AF37]/50"
                }`}>
                {tx(opt, q.optionsAr[i])}
              </button>
            ))}
          </div>

          {!showResult ? (
            <button onClick={handleSubmit} disabled={selected === null} className="px-6 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all disabled:opacity-40">{tx("Submit", "إرسال")}</button>
          ) : (
            <div className="bg-[#0A3D33]/40 border border-[#0A6B5A]/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                {q.options[selected!] === q.correctFramework ? <><CheckCircle className="w-5 h-5 text-[#D4AF37]" /><span className="text-[#D4AF37] font-['Montserrat'] font-bold text-sm">{tx("Correct!", "صحيح!")}</span></> : <><XCircle className="w-5 h-5 text-red-400" /><span className="text-red-400 font-['Montserrat'] font-bold text-sm">{tx("Incorrect", "غير صحيح")}</span></>}
              </div>
              <p className="text-[#C4B9A8] font-['Work_Sans'] text-sm">{tx(q.explanation, q.explanationAr)}</p>
              <button onClick={handleNext} className="mt-3 flex items-center gap-2 px-5 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all">
                {current < QUESTIONS.length - 1 ? tx("Next Case", "الحالة التالية") : tx("See Results", "عرض النتائج")} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
