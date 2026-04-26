/*
  Incident Response Lab
  Students handle a simulated security breach step by step.
  Maps to CEH Day 13: Incident Response & Forensics
  Bilingual: English + Arabic
*/

import { useState, useCallback } from "react";
import { AlertTriangle, CheckCircle, XCircle, RotateCcw, ArrowRight, Shield } from "lucide-react";
import { useLabLang } from "./labI18n";

type IRStep = {
  id: number;
  timestamp: string;
  alert: string;
  alertAr: string;
  logEntries: string[];
  question: string;
  questionAr: string;
  options: string[];
  optionsAr: string[];
  correctIndex: number;
  explanation: string;
  explanationAr: string;
};

const STEPS: IRStep[] = [
  {
    id: 1, timestamp: "09:15 AM - Day 1",
    alert: "SIEM Alert: Multiple failed login attempts detected on domain controller DC01",
    alertAr: "تنبيه SIEM: اكتشاف محاولات تسجيل دخول فاشلة متعددة على وحدة تحكم المجال DC01",
    logEntries: [
      "09:12:01 FAILED LOGIN: admin@corp.local from 10.0.1.99 (5 attempts)",
      "09:12:15 FAILED LOGIN: administrator@corp.local from 10.0.1.99 (8 attempts)",
      "09:12:30 FAILED LOGIN: svc_backup@corp.local from 10.0.1.99 (3 attempts)",
      "09:13:01 SUCCESS LOGIN: svc_backup@corp.local from 10.0.1.99",
      "09:13:05 PRIVILEGE ESCALATION: svc_backup added to Domain Admins",
    ],
    question: "What is the FIRST action in the incident response process?",
    questionAr: "ما هو الإجراء الأول في عملية الاستجابة للحوادث؟",
    options: ["Immediately shut down DC01", "Identify and confirm the incident (triage and scope assessment)", "Call law enforcement", "Restore from backup"],
    optionsAr: ["إيقاف DC01 فوراً", "تحديد وتأكيد الحادث (الفرز وتقييم النطاق)", "الاتصال بجهات إنفاذ القانون", "الاستعادة من النسخة الاحتياطية"],
    correctIndex: 1,
    explanation: "Per NIST SP 800-61, the first step is Identification: confirm this is a real incident (not a false positive), assess scope, and determine severity. The logs show a brute-force attack that succeeded on svc_backup, followed by privilege escalation to Domain Admin - this is a confirmed critical incident.",
    explanationAr: "وفقاً لـ NIST SP 800-61، الخطوة الأولى هي التحديد: تأكيد أن هذا حادث حقيقي (ليس إيجابي كاذب)، تقييم النطاق، وتحديد الخطورة. السجلات تظهر هجوم قوة غاشمة نجح على svc_backup، متبوعاً بتصعيد الامتيازات.",
  },
  {
    id: 2, timestamp: "09:45 AM - Day 1",
    alert: "Confirmed: Attacker has Domain Admin access via compromised svc_backup account",
    alertAr: "مؤكد: المهاجم لديه وصول مسؤول المجال عبر حساب svc_backup المخترق",
    logEntries: [
      "09:20:00 svc_backup: Accessed \\\\fileserver\\HR\\salary_data.xlsx",
      "09:25:00 svc_backup: Ran mimikatz.exe on DC01",
      "09:30:00 svc_backup: Created new account 'support_admin'",
      "09:35:00 svc_backup: Installed remote access tool (AnyDesk)",
      "09:40:00 Outbound: 500MB data transfer to 185.x.x.x:443",
    ],
    question: "What is the correct CONTAINMENT strategy?",
    questionAr: "ما هي استراتيجية الاحتواء الصحيحة؟",
    options: ["Delete the svc_backup account and continue monitoring", "Isolate affected systems, disable compromised accounts, block attacker C2 IP, preserve evidence", "Shut down the entire network immediately", "Only block the external IP address"],
    optionsAr: ["حذف حساب svc_backup ومتابعة المراقبة", "عزل الأنظمة المتأثرة، تعطيل الحسابات المخترقة، حظر IP C2 للمهاجم، الحفاظ على الأدلة", "إيقاف الشبكة بالكامل فوراً", "حظر عنوان IP الخارجي فقط فقط"],
    correctIndex: 1,
    explanation: "Proper containment involves multiple parallel actions: (1) Isolate DC01 and fileserver from the network, (2) Disable svc_backup AND support_admin accounts, (3) Block C2 IP (185.x.x.x) at the firewall, (4) Preserve forensic evidence (memory dumps, logs). Don't just delete accounts - you need evidence.",
    explanationAr: "الاحتواء الصحيح يتضمن إجراءات متوازية متعددة: (1) عزل DC01 وخادم الملفات، (2) تعطيل حسابات svc_backup وsupport_admin، (3) حظر IP C2 في جدار الحماية، (4) الحفاظ على الأدلة الجنائية.",
  },
  {
    id: 3, timestamp: "02:00 PM - Day 1",
    alert: "Forensic analysis in progress. Memory dump captured from DC01.",
    alertAr: "التحليل الجنائي قيد التنفيذ. تم التقاط تفريغ الذاكرة من DC01.",
    logEntries: [
      "$ volatility -f dc01_memory.raw --profile=Win2019 pslist",
      "PID  PPID  Name           Start",
      "4    0     System         2024-01-15 08:00:00",
      "892  4     svchost.exe    2024-01-15 08:00:15",
      "1204 892   mimikatz.exe   2024-01-15 09:25:00",
      "1456 892   AnyDesk.exe    2024-01-15 09:35:00",
      "",
      "$ volatility hashdump",
      "Administrator:500:aad3b435...:::  (NTLM hash extracted)",
    ],
    question: "What does the mimikatz execution on DC01 indicate?",
    questionAr: "ماذا يشير تنفيذ mimikatz على DC01؟",
    options: ["The attacker was testing antivirus detection", "The attacker extracted ALL domain credentials from memory (credential dumping)", "Mimikatz was used for legitimate administration", "The attacker was only targeting the svc_backup password"],
    optionsAr: ["المهاجم كان يختبر كشف مضاد الفيروسات", "المهاجم استخرج جميع بيانات اعتماد المجال من الذاكرة (تفريغ بيانات الاعتماد)", "mimikatz استُخدم للإدارة الشرعية", "المهاجم كان يستهدف فقط كلمة مرور svc_backup"],
    correctIndex: 1,
    explanation: "Mimikatz on a Domain Controller extracts ALL cached credentials from LSASS memory, including NTLM hashes for every domain user. This means the attacker likely has credentials for ALL accounts. Response: force password reset for ALL domain accounts, not just the compromised ones.",
    explanationAr: "mimikatz على وحدة تحكم المجال يستخرج جميع بيانات الاعتماد المخزنة من ذاكرة LSASS، بما في ذلك تجزئات NTLM لكل مستخدم في المجال. هذا يعني أن المهاجم لديه بيانات اعتماد لجميع الحسابات.",
  },
  {
    id: 4, timestamp: "Day 2 - Eradication Phase",
    alert: "Containment successful. Moving to eradication and recovery.",
    alertAr: "الاحتواء ناجح. الانتقال إلى الإزالة والاسترداد.",
    logEntries: [
      "=== Eradication Checklist ===",
      "[ ] Remove attacker persistence mechanisms",
      "[ ] Reset ALL domain passwords (mimikatz compromise)",
      "[ ] Rebuild DC01 from clean media",
      "[ ] Patch initial attack vector (RDP brute force)",
      "[ ] Deploy MFA on all privileged accounts",
      "[ ] Update firewall rules",
      "[ ] Scan all endpoints for AnyDesk/RATs",
    ],
    question: "What is the MOST important eradication step to prevent re-compromise?",
    questionAr: "ما هي أهم خطوة إزالة لمنع إعادة الاختراق؟",
    options: ["Update firewall rules", "Reset ALL domain passwords (because mimikatz extracted them all)", "Remove AnyDesk from DC01", "Deploy new antivirus software"],
    optionsAr: ["تحديث قواعد جدار الحماية", "إعادة تعيين جميع كلمات مرور المجال (لأن mimikatz استخرجها جميعاً)", "إزالة AnyDesk من DC01", "نشر برنامج مضاد فيروسات جديد"],
    correctIndex: 1,
    explanation: "Since mimikatz was run on the DC, ALL domain credentials are compromised. Even if you remove the attacker's tools and accounts, they can return using any stolen credential. A domain-wide password reset (including the KRBTGT account twice) is essential to invalidate all stolen tickets and hashes.",
    explanationAr: "بما أن mimikatz تم تشغيله على DC، جميع بيانات اعتماد المجال مخترقة. حتى لو أزلت أدوات وحسابات المهاجم، يمكنهم العودة باستخدام أي بيانات اعتماد مسروقة. إعادة تعيين كلمات المرور على مستوى المجال ضرورية.",
  },
  {
    id: 5, timestamp: "Day 5 - Lessons Learned",
    alert: "Incident closed. Post-incident review meeting scheduled.",
    alertAr: "الحادث مغلق. اجتماع مراجعة ما بعد الحادث مجدول.",
    logEntries: [
      "=== Incident Timeline Summary ===",
      "Attack vector: RDP brute force from internet",
      "Initial access: svc_backup (weak password, no MFA)",
      "Lateral movement: mimikatz credential dumping",
      "Persistence: New admin account + AnyDesk RAT",
      "Exfiltration: 500MB to external server",
      "Detection time: 3 minutes (SIEM alert)",
      "Containment time: 30 minutes",
      "Total incident duration: 5 days",
    ],
    question: "What is the MOST impactful preventive measure to recommend?",
    questionAr: "ما هو الإجراء الوقائي الأكثر تأثيراً للتوصية به؟",
    options: ["Install better antivirus software", "Implement Multi-Factor Authentication (MFA) on all accounts, especially privileged ones", "Increase password length to 20 characters", "Block all RDP access permanently"],
    optionsAr: ["تثبيت برنامج مضاد فيروسات أفضل", "تنفيذ المصادقة متعددة العوامل (MFA) على جميع الحسابات، خاصة المميزة", "زيادة طول كلمة المرور إلى 20 حرف", "حظر جميع وصول RDP بشكل دائم"],
    correctIndex: 1,
    explanation: "MFA would have prevented this entire incident. Even though the attacker brute-forced the password, MFA would have blocked the login. MFA is the single most effective control against credential-based attacks (which account for 80%+ of breaches). Combine with: PAM, network segmentation, and EDR.",
    explanationAr: "MFA كان سيمنع هذا الحادث بالكامل. حتى لو كسر المهاجم كلمة المرور بالقوة الغاشمة، MFA كان سيحظر تسجيل الدخول. MFA هو أكثر تحكم فعال ضد الهجمات القائمة على بيانات الاعتماد.",
  },
];

export default function IncidentResponseLab({ onComplete }: { onComplete?: (score?: number) => void }) {
  const { tx } = useLabLang();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const step = STEPS[current];

  const handleSubmit = useCallback(() => { if (selected === null) return; setShowResult(true); if (selected === step.correctIndex) setScore(s => s + 1); }, [selected, step]);
  const handleNext = useCallback(() => { if (current < STEPS.length - 1) { setCurrent(c => c + 1); setSelected(null); setShowResult(false); } else { setCompleted(true); } }, [current]);
  const reset = useCallback(() => { setCurrent(0); setSelected(null); setShowResult(false); setScore(0); setCompleted(false); }, []);

  return (
    <div className="bg-[#F5F0E8] border-2 border-[#227C82]/40 p-6 my-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><AlertTriangle className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Incident Response Simulation", "محاكاة الاستجابة للحوادث")}</h3>
          <p className="text-[#1A5C5C] font-['Work_Sans'] text-xs">{tx("Phase", "مرحلة")} {current + 1}/{STEPS.length} - {tx("Score", "النتيجة")}: {score}/{STEPS.length}</p>
        </div>
      </div>

      {completed ? (
        <div className="text-center py-8">
          <Shield className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#0C3C3C] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Incident Resolved!", "تم حل الحادث!")}</h4>
          <p className="text-[#1A5C5C] font-['Work_Sans'] mb-4">{tx(`You scored ${score}/${STEPS.length}. Expert incident responder!`, `حصلت على ${score}/${STEPS.length}. خبير استجابة للحوادث!`)}</p>
          <button onClick={reset} className="flex items-center gap-2 mx-auto px-6 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all"><RotateCcw className="w-4 h-4" /> {tx("Play Again", "ابدأ من جديد")}</button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#D4AF37] text-[#0C3C3C] font-mono text-xs px-2 py-1 font-bold">{step.timestamp}</span>
          </div>
          <div className="bg-red-50 border border-red-200 p-3 mb-3">
            <p className="text-red-700 font-['Work_Sans'] text-sm font-medium">{tx(step.alert, step.alertAr)}</p>
          </div>
          <div className="bg-[#0a0a0a] border border-[#333] p-3 mb-4 font-mono text-xs max-h-48 overflow-y-auto">
            {step.logEntries.map((line, i) => (
              <div key={i} className={line.includes("FAILED") || line.includes("mimikatz") || line.includes("ESCALATION") ? "text-red-400" : line.includes("SUCCESS") || line.includes("[x]") ? "text-green-400" : line.includes("$") ? "text-green-400" : line.includes("===") || line.includes("[ ]") ? "text-blue-300" : "text-gray-300"}>{line || "\u00A0"}</div>
            ))}
          </div>

          <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm font-medium mb-3">{tx(step.question, step.questionAr)}</p>
          <div className="space-y-2 mb-4">
            {(tx(step.options.join("|"), step.optionsAr.join("|"))).split("|").map((opt, i) => (
              <button key={i} onClick={() => !showResult && setSelected(i)}
                className={`w-full text-start p-3 border font-['Work_Sans'] text-sm transition-all ${showResult ? i === step.correctIndex ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#0C3C3C]" : i === selected ? "border-red-500/50 bg-red-500/10 text-red-600" : "border-[#D4CBBA] text-[#1A5C5C]/50" : selected === i ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#0C3C3C]" : "border-[#D4CBBA] text-[#1A5C5C] hover:border-[#D4AF37]/50"}`}>{opt}</button>
            ))}
          </div>

          {!showResult ? (
            <button onClick={handleSubmit} disabled={selected === null} className="px-6 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all disabled:opacity-40">{tx("Submit Decision", "إرسال القرار")}</button>
          ) : (
            <div className="bg-[#164A4A]/10 border border-[#D4CBBA] p-4">
              <div className="flex items-center gap-2 mb-2">
                {selected === step.correctIndex ? <><CheckCircle className="w-5 h-5 text-[#D4AF37]" /><span className="text-[#D4AF37] font-['Montserrat'] font-bold text-sm">{tx("Correct!", "صحيح!")}</span></> : <><XCircle className="w-5 h-5 text-red-500" /><span className="text-red-500 font-['Montserrat'] font-bold text-sm">{tx("Incorrect", "غير صحيح")}</span></>}
              </div>
              <p className="text-[#1A5C5C] font-['Work_Sans'] text-sm">{tx(step.explanation, step.explanationAr)}</p>
              <button onClick={handleNext} className="mt-3 flex items-center gap-2 px-5 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all">
                {current < STEPS.length - 1 ? tx("Next Phase", "المرحلة التالية") : tx("See Results", "عرض النتائج")} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
