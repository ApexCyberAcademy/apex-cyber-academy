/*
  Social Engineering Lab
  Students identify phishing emails, pretexting attacks, and social engineering tactics.
  Maps to CEH Day 8: Social Engineering & Phishing Attacks
  Bilingual: English + Arabic
*/

import { useState, useCallback } from "react";
import { Users, CheckCircle, XCircle, RotateCcw, ArrowRight, Mail } from "lucide-react";
import { useLabLang } from "./labI18n";

type PhishingScenario = {
  id: number;
  emailFrom: string;
  emailSubject: string;
  emailBody: string;
  emailBodyAr: string;
  redFlags: string[];
  redFlagsAr: string[];
  question: string;
  questionAr: string;
  options: string[];
  optionsAr: string[];
  correctIndex: number;
  explanation: string;
  explanationAr: string;
};

const SCENARIOS: PhishingScenario[] = [
  {
    id: 1,
    emailFrom: "security@micros0ft-support.com",
    emailSubject: "URGENT: Your account has been compromised!",
    emailBody: "Dear User,\n\nWe detected suspicious activity on your Microsoft 365 account. Your account will be suspended in 24 hours unless you verify your identity immediately.\n\nClick here to verify: http://micros0ft-verify.com/login\n\nMicrosoft Security Team",
    emailBodyAr: "عزيزي المستخدم،\n\nاكتشفنا نشاطاً مشبوهاً على حساب Microsoft 365 الخاص بك. سيتم تعليق حسابك خلال 24 ساعة ما لم تتحقق من هويتك فوراً.\n\nانقر هنا للتحقق: http://micros0ft-verify.com/login\n\nفريق أمان Microsoft",
    redFlags: ["Sender domain: micros0ft-support.com (zero instead of 'o')", "Urgency pressure: '24 hours'", "Suspicious URL: micros0ft-verify.com", "Generic greeting: 'Dear User'"],
    redFlagsAr: ["نطاق المرسل: micros0ft-support.com (صفر بدلاً من 'o')", "ضغط الاستعجال: '24 ساعة'", "رابط مشبوه: micros0ft-verify.com", "تحية عامة: 'عزيزي المستخدم'"],
    question: "What is the PRIMARY social engineering technique used in this email?",
    questionAr: "ما هي تقنية الهندسة الاجتماعية الأساسية المستخدمة في هذا البريد؟",
    options: ["Baiting", "Urgency and fear (creating time pressure)", "Quid pro quo", "Tailgating"],
    optionsAr: ["الإغراء", "الاستعجال والخوف (خلق ضغط زمني)", "المقابل", "التتبع"],
    correctIndex: 1,
    explanation: "The email uses urgency and fear as its primary weapon: '24 hours' deadline, 'account suspended', 'compromised'. This creates panic that overrides critical thinking, making victims click without checking the suspicious domain (micros0ft with a zero).",
    explanationAr: "يستخدم البريد الاستعجال والخوف كسلاحه الأساسي: موعد '24 ساعة'، 'تعليق الحساب'، 'مخترق'. هذا يخلق ذعراً يتجاوز التفكير النقدي.",
  },
  {
    id: 2,
    emailFrom: "ceo@company.com (via external relay)",
    emailSubject: "Wire Transfer - Confidential",
    emailBody: "Hi Sarah,\n\nI need you to process an urgent wire transfer of $47,500 to the following account. This is for a confidential acquisition - please don't discuss with anyone else.\n\nBank: First National\nAccount: 8847291034\nRouting: 021000089\n\nPlease confirm when done.\n\nJohn (sent from mobile)",
    emailBodyAr: "مرحباً سارة،\n\nأحتاج منك معالجة تحويل مصرفي عاجل بمبلغ 47,500 دولار إلى الحساب التالي. هذا لاستحواذ سري - يرجى عدم مناقشته مع أي شخص آخر.\n\nالبنك: First National\nالحساب: 8847291034\nالتوجيه: 021000089\n\nيرجى التأكيد عند الانتهاء.\n\nجون (مرسل من الجوال)",
    redFlags: ["'via external relay' - not from internal server", "'Confidential' - discourages verification", "Urgency + authority pressure", "'Sent from mobile' - excuses informal tone"],
    redFlagsAr: ["'عبر مرحل خارجي' - ليس من الخادم الداخلي", "'سري' - يثبط التحقق", "ضغط الاستعجال + السلطة", "'مرسل من الجوال' - يبرر النبرة غير الرسمية"],
    question: "This is an example of which specific social engineering attack?",
    questionAr: "هذا مثال على أي هجوم هندسة اجتماعية محدد؟",
    options: ["Spear phishing", "Business Email Compromise (BEC) / CEO Fraud", "Vishing", "Smishing"],
    optionsAr: ["التصيد الموجه", "اختراق البريد التجاري (BEC) / احتيال المدير التنفيذي", "التصيد الصوتي", "التصيد عبر الرسائل"],
    correctIndex: 1,
    explanation: "This is a Business Email Compromise (BEC) / CEO Fraud attack. The attacker impersonates the CEO to authorize a fraudulent wire transfer. Key tactics: authority (CEO), urgency, secrecy ('don't discuss'), and a plausible excuse ('sent from mobile') for the informal request.",
    explanationAr: "هذا هجوم اختراق البريد التجاري (BEC) / احتيال المدير التنفيذي. المهاجم ينتحل شخصية المدير التنفيذي لتفويض تحويل مصرفي احتيالي.",
  },
  {
    id: 3,
    emailFrom: "it-helpdesk@yourcompany.com",
    emailSubject: "Password Reset Required - New Security Policy",
    emailBody: "Hello,\n\nAs part of our new security compliance initiative, all employees must reset their passwords by end of day. Please use the link below to update your credentials:\n\nhttps://yourcompany-passwordreset.external-site.com/reset\n\nYour current password is required to verify your identity.\n\nIT Help Desk",
    emailBodyAr: "مرحباً،\n\nكجزء من مبادرة الامتثال الأمني الجديدة، يجب على جميع الموظفين إعادة تعيين كلمات المرور بنهاية اليوم. يرجى استخدام الرابط أدناه لتحديث بياناتك:\n\nhttps://yourcompany-passwordreset.external-site.com/reset\n\nكلمة المرور الحالية مطلوبة للتحقق من هويتك.\n\nمكتب مساعدة تكنولوجيا المعلومات",
    redFlags: ["External domain disguised as internal", "Asks for current password (legitimate resets don't)", "End of day deadline creates urgency", "Generic greeting"],
    redFlagsAr: ["نطاق خارجي متنكر كداخلي", "يطلب كلمة المرور الحالية (إعادة التعيين الشرعية لا تفعل)", "موعد نهاية اليوم يخلق استعجالاً", "تحية عامة"],
    question: "What is the most critical red flag in this email?",
    questionAr: "ما هو العلم الأحمر الأكثر أهمية في هذا البريد؟",
    options: ["The email is from IT Help Desk", "The URL points to external-site.com, not the company's actual domain", "It mentions a security policy", "It was sent during business hours"],
    optionsAr: ["البريد من مكتب مساعدة تكنولوجيا المعلومات", "الرابط يشير إلى external-site.com، وليس نطاق الشركة الفعلي", "يذكر سياسة أمنية", "أُرسل خلال ساعات العمل"],
    correctIndex: 1,
    explanation: "The URL 'yourcompany-passwordreset.external-site.com' is hosted on external-site.com, NOT the company's domain. The 'yourcompany-passwordreset' part is just a subdomain of the attacker's domain. Legitimate password resets would use the company's actual domain.",
    explanationAr: "الرابط 'yourcompany-passwordreset.external-site.com' مستضاف على external-site.com، وليس نطاق الشركة. جزء 'yourcompany-passwordreset' هو مجرد نطاق فرعي لنطاق المهاجم.",
  },
  {
    id: 4,
    emailFrom: "N/A - Phone Call",
    emailSubject: "Vishing Scenario",
    emailBody: "PHONE TRANSCRIPT:\n\nCaller: 'Hi, this is Mike from IT support. We're seeing some unusual network activity from your workstation. I need to remote in to check for malware. Can you give me your VPN credentials so I can connect to your machine?'\n\nThe caller ID shows an internal extension number.",
    emailBodyAr: "نص المكالمة:\n\nالمتصل: 'مرحباً، أنا مايك من دعم تكنولوجيا المعلومات. نرى بعض النشاط غير العادي من محطة عملك. أحتاج للاتصال عن بُعد للتحقق من البرامج الخبيثة. هل يمكنك إعطائي بيانات VPN الخاصة بك حتى أتمكن من الاتصال بجهازك؟'\n\nمعرف المتصل يظهر رقم تحويلة داخلية.",
    redFlags: ["Unsolicited call requesting credentials", "Caller ID can be spoofed", "Urgency about 'unusual activity'", "IT never asks for passwords over phone"],
    redFlagsAr: ["مكالمة غير مطلوبة تطلب بيانات اعتماد", "معرف المتصل يمكن تزويره", "استعجال حول 'نشاط غير عادي'", "تكنولوجيا المعلومات لا تطلب كلمات المرور عبر الهاتف أبداً"],
    question: "What is the correct response to this phone call?",
    questionAr: "ما هو الرد الصحيح على هذه المكالمة الهاتفية؟",
    options: ["Give the credentials since the caller ID is internal", "Hang up and call IT support using the official number to verify", "Ask the caller to send an email instead", "Give a fake password to test them"],
    optionsAr: ["إعطاء بيانات الاعتماد لأن معرف المتصل داخلي", "إنهاء المكالمة والاتصال بدعم تكنولوجيا المعلومات باستخدام الرقم الرسمي للتحقق", "طلب من المتصل إرسال بريد إلكتروني بدلاً من ذلك", "إعطاء كلمة مرور مزيفة لاختبارهم"],
    correctIndex: 1,
    explanation: "The correct response is to hang up and independently verify by calling IT support through the official directory number. Caller ID can be easily spoofed. Legitimate IT staff never ask for passwords over the phone. This is a classic vishing (voice phishing) attack.",
    explanationAr: "الرد الصحيح هو إنهاء المكالمة والتحقق بشكل مستقل بالاتصال بدعم تكنولوجيا المعلومات عبر رقم الدليل الرسمي. معرف المتصل يمكن تزويره بسهولة.",
  },
  {
    id: 5,
    emailFrom: "rewards@amaz0n-prime.com",
    emailSubject: "You've won a $500 Amazon Gift Card!",
    emailBody: "Congratulations!\n\nYou've been selected as our lucky winner for a $500 Amazon Gift Card! To claim your prize, simply complete a short survey and provide your shipping address.\n\nClaim Now: http://amaz0n-rewards.com/claim?id=8847\n\nOffer expires in 1 hour!\n\nAmazon Rewards Team",
    emailBodyAr: "تهانينا!\n\nلقد تم اختيارك كفائزنا المحظوظ ببطاقة هدايا أمازون بقيمة 500 دولار! للمطالبة بجائزتك، ما عليك سوى إكمال استطلاع قصير وتقديم عنوان الشحن.\n\nالمطالبة الآن: http://amaz0n-rewards.com/claim?id=8847\n\nينتهي العرض خلال ساعة واحدة!\n\nفريق مكافآت أمازون",
    redFlags: ["amaz0n (zero instead of 'o') in both sender and URL", "Too good to be true offer", "1 hour expiry creates urgency", "No personalization"],
    redFlagsAr: ["amaz0n (صفر بدلاً من 'o') في المرسل والرابط", "عرض جيد جداً ليكون حقيقياً", "انتهاء خلال ساعة يخلق استعجالاً", "لا تخصيص"],
    question: "How many red flags can you identify in this email?",
    questionAr: "كم عدد العلامات الحمراء التي يمكنك تحديدها في هذا البريد؟",
    options: ["1-2 red flags", "3-4 red flags", "5-6 red flags", "7+ red flags"],
    optionsAr: ["1-2 علامة حمراء", "3-4 علامات حمراء", "5-6 علامات حمراء", "7+ علامات حمراء"],
    correctIndex: 2,
    explanation: "There are 5-6 red flags: (1) Typosquatted domain 'amaz0n', (2) Too-good-to-be-true prize, (3) Time pressure (1 hour), (4) Generic greeting, (5) HTTP not HTTPS, (6) Survey to harvest personal data. This combines baiting (free gift) with urgency to bypass critical thinking.",
    explanationAr: "هناك 5-6 علامات حمراء: (1) نطاق مزور 'amaz0n'، (2) جائزة جيدة جداً لتكون حقيقية، (3) ضغط زمني (ساعة واحدة)، (4) تحية عامة، (5) HTTP وليس HTTPS، (6) استطلاع لجمع البيانات الشخصية.",
  },
];

export default function SocialEngineeringLab({ onComplete }: { onComplete?: (score?: number) => void }) {
  const { tx } = useLabLang();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const scenario = SCENARIOS[current];

  const handleSubmit = useCallback(() => { if (selected === null) return; setShowResult(true); if (selected === scenario.correctIndex) setScore(s => s + 1); }, [selected, scenario]);
  const handleNext = useCallback(() => { if (current < SCENARIOS.length - 1) { setCurrent(c => c + 1); setSelected(null); setShowResult(false); } else { setCompleted(true); } }, [current]);
  const reset = useCallback(() => { setCurrent(0); setSelected(null); setShowResult(false); setScore(0); setCompleted(false); }, []);

  return (
    <div className="bg-[#F5F0E8] border-2 border-[#227C82]/40 p-6 my-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Users className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Phishing Detection Lab", "مختبر كشف التصيد")}</h3>
          <p className="text-[#0C3C3C] font-['Work_Sans'] text-xs">{tx("Email", "بريد")} {current + 1}/{SCENARIOS.length} - {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>

      {completed ? (
        <div className="text-center py-8">
          <Mail className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#0C3C3C] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Lab Complete!", "اكتمل المختبر!")}</h4>
          <p className="text-[#0C3C3C] font-['Work_Sans'] mb-4">{tx(`You scored ${score}/${SCENARIOS.length}. Sharp phishing detection skills!`, `حصلت على ${score}/${SCENARIOS.length}. مهارات كشف تصيد حادة!`)}</p>
          <button onClick={reset} className="flex items-center gap-2 mx-auto px-6 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all"><RotateCcw className="w-4 h-4" /> {tx("Play Again", "ابدأ من جديد")}</button>
        </div>
      ) : (
        <>
          {/* Email display */}
          <div className="bg-white border border-[#D4CBBA] mb-4">
            <div className="bg-[#f5f5f5] border-b border-[#D4CBBA] p-3">
              <div className="text-xs font-['Work_Sans']"><span className="text-[#0C3C3C]/60">From:</span> <span className="text-[#0C3C3C]">{scenario.emailFrom}</span></div>
              <div className="text-xs font-['Work_Sans']"><span className="text-[#0C3C3C]/60">Subject:</span> <span className="text-[#0C3C3C] font-bold">{scenario.emailSubject}</span></div>
            </div>
            <div className="p-4">
              {tx(scenario.emailBody, scenario.emailBodyAr).split("\n").map((line, i) => (
                <p key={i} className={`text-[#0C3C3C] font-['Work_Sans'] text-sm ${line === "" ? "h-3" : ""}`}>{line}</p>
              ))}
            </div>
          </div>

          {/* Red flags */}
          {showResult && (
            <div className="bg-red-50 border border-red-200 p-3 mb-4">
              <div className="text-red-700 font-['Montserrat'] text-xs font-bold mb-2">{tx("RED FLAGS:", "العلامات الحمراء:")}</div>
              {(tx(scenario.redFlags.join("|"), scenario.redFlagsAr.join("|"))).split("|").map((flag, i) => (
                <div key={i} className="flex items-start gap-2 mb-1">
                  <span className="text-red-500 text-xs">⚠</span>
                  <span className="text-red-700 font-['Work_Sans'] text-xs">{flag}</span>
                </div>
              ))}
            </div>
          )}

          <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm font-medium mb-3">{tx(scenario.question, scenario.questionAr)}</p>
          <div className="space-y-2 mb-4">
            {(tx(scenario.options.join("|"), scenario.optionsAr.join("|"))).split("|").map((opt, i) => (
              <button key={i} onClick={() => !showResult && setSelected(i)}
                className={`w-full text-start p-3 border font-['Work_Sans'] text-sm transition-all ${showResult ? i === scenario.correctIndex ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#0C3C3C]" : i === selected ? "border-red-500/50 bg-red-500/10 text-red-600" : "border-[#D4CBBA] text-[#0C3C3C]/50" : selected === i ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#0C3C3C]" : "border-[#D4CBBA] text-[#0C3C3C] hover:border-[#D4AF37]/50"}`}>{opt}</button>
            ))}
          </div>

          {!showResult ? (
            <button onClick={handleSubmit} disabled={selected === null} className="px-6 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all disabled:opacity-40">{tx("Submit", "إرسال")}</button>
          ) : (
            <div className="bg-[#164A4A]/10 border border-[#D4CBBA] p-4">
              <div className="flex items-center gap-2 mb-2">
                {selected === scenario.correctIndex ? <><CheckCircle className="w-5 h-5 text-[#D4AF37]" /><span className="text-[#D4AF37] font-['Montserrat'] font-bold text-sm">{tx("Correct!", "صحيح!")}</span></> : <><XCircle className="w-5 h-5 text-red-500" /><span className="text-red-500 font-['Montserrat'] font-bold text-sm">{tx("Incorrect", "غير صحيح")}</span></>}
              </div>
              <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm">{tx(scenario.explanation, scenario.explanationAr)}</p>
              <button onClick={handleNext} className="mt-3 flex items-center gap-2 px-5 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all">
                {current < SCENARIOS.length - 1 ? tx("Next Email", "البريد التالي") : tx("See Results", "عرض النتائج")} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
