/*
  Automation & Scripting Lab
  Students identify correct scripting/automation approaches for security tasks.
  Maps to Security+ Day 12: Security Automation, Scripting, and Digital Forensics
  Bilingual: English + Arabic
*/

import { useState, useEffect, useCallback } from "react";
import { Code, CheckCircle, XCircle, RotateCcw, ArrowRight, Terminal } from "lucide-react";
import { useLabLang } from "./labI18n";

type ScriptTask = {
  id: number;
  task: string;
  taskAr: string;
  codeSnippets: { label: string; code: string }[];
  correctIndex: number;
  explanation: string;
  explanationAr: string;
};

const TASKS: ScriptTask[] = [
  {
    id: 1,
    task: "Write a script to check if any user accounts have passwords older than 90 days and export a report.",
    taskAr: "اكتب سكريبت للتحقق مما إذا كانت أي حسابات مستخدمين لديها كلمات مرور أقدم من 90 يوماً وتصدير تقرير.",
    codeSnippets: [
      { label: "Option A", code: `Get-ADUser -Filter * -Properties PasswordLastSet |\nWhere-Object { $_.PasswordLastSet -lt (Get-Date).AddDays(-90) } |\nSelect-Object Name, PasswordLastSet |\nExport-Csv -Path "stale_passwords.csv"` },
      { label: "Option B", code: `net user /domain | findstr "Password"\n> stale_passwords.txt` },
      { label: "Option C", code: `SELECT username FROM users\nWHERE password_date < NOW() - 90\nINTO OUTFILE 'stale_passwords.csv'` },
    ],
    correctIndex: 0,
    explanation: "PowerShell's Get-ADUser cmdlet queries Active Directory directly, filtering by PasswordLastSet property. The pipeline filters, selects relevant fields, and exports to CSV. Option B only shows basic info without date filtering. Option C is SQL — not how you query Active Directory.",
    explanationAr: "أمر Get-ADUser في PowerShell يستعلم من Active Directory مباشرة، مع التصفية حسب خاصية PasswordLastSet. خط الأنابيب يرشح، يختار الحقول ذات الصلة، ويصدر إلى CSV. الخيار B يعرض معلومات أساسية فقط بدون تصفية التاريخ. الخيار C هو SQL — ليس كيفية الاستعلام من Active Directory.",
  },
  {
    id: 2,
    task: "Automate blocking a list of malicious IP addresses on a Linux firewall.",
    taskAr: "أتمتة حظر قائمة عناوين IP الخبيثة على جدار حماية Linux.",
    codeSnippets: [
      { label: "Option A", code: `for ip in $(cat malicious_ips.txt); do\n  ping -c 1 $ip\ndone` },
      { label: "Option B", code: `while read ip; do\n  iptables -A INPUT -s "$ip" -j DROP\n  echo "Blocked: $ip"\ndone < malicious_ips.txt\niptables-save > /etc/iptables/rules.v4` },
      { label: "Option C", code: `cat malicious_ips.txt | xargs rm -rf` },
    ],
    correctIndex: 1,
    explanation: "Option B correctly reads each IP from the file, adds an iptables DROP rule for inbound traffic from that IP, logs the action, and persists the rules. Option A just pings the IPs (useless and potentially dangerous). Option C is a destructive command that has nothing to do with firewalls.",
    explanationAr: "الخيار B يقرأ كل IP من الملف بشكل صحيح، يضيف قاعدة DROP في iptables لحركة المرور الواردة من ذلك IP، يسجل الإجراء، ويحفظ القواعد. الخيار A يقوم فقط بعمل ping للعناوين (عديم الفائدة وربما خطير). الخيار C أمر تدميري لا علاقة له بجدران الحماية.",
  },
  {
    id: 3,
    task: "Create a forensic disk image of a suspect's hard drive while preserving evidence integrity.",
    taskAr: "إنشاء صورة قرص جنائية لمحرك الأقراص الصلبة للمشتبه به مع الحفاظ على سلامة الأدلة.",
    codeSnippets: [
      { label: "Option A", code: `cp -r /dev/sda /evidence/suspect_drive/` },
      { label: "Option B", code: `dd if=/dev/sda of=/evidence/suspect.img bs=4M\nmd5sum /dev/sda > /evidence/source.md5\nmd5sum /evidence/suspect.img > /evidence/image.md5` },
      { label: "Option C", code: `tar -czf /evidence/suspect.tar.gz /dev/sda` },
    ],
    correctIndex: 1,
    explanation: "dd creates a bit-for-bit forensic image of the entire drive (including deleted files, slack space, and unallocated areas). The MD5 hashes of both source and image prove the image is an exact copy — critical for chain of custody. cp only copies files (misses deleted data). tar compresses but doesn't create a forensic image.",
    explanationAr: "dd ينشئ صورة جنائية بت-ببت للمحرك بالكامل (بما في ذلك الملفات المحذوفة والمساحة الفارغة والمناطق غير المخصصة). تجزئات MD5 للمصدر والصورة تثبت أن الصورة نسخة طبق الأصل — حاسم لسلسلة الحفظ. cp ينسخ الملفات فقط (يفقد البيانات المحذوفة). tar يضغط لكنه لا ينشئ صورة جنائية.",
  },
  {
    id: 4,
    task: "Set up automated log collection from multiple servers to a central SIEM.",
    taskAr: "إعداد جمع السجلات الآلي من خوادم متعددة إلى SIEM مركزي.",
    codeSnippets: [
      { label: "Option A", code: `# rsyslog.conf on each server\n*.* @@siem.corp.local:514\n\n# On SIEM server\n$ModLoad imtcp\n$InputTCPServerRun 514\n$template RemoteLogs,"/var/log/remote/%HOSTNAME%/%PROGRAMNAME%.log"\n*.* ?RemoteLogs` },
      { label: "Option B", code: `# Cron job on each server\n0 * * * * scp /var/log/*.log admin@siem:/logs/` },
      { label: "Option C", code: `# On SIEM server\nwhile true; do\n  ssh server1 cat /var/log/syslog >> /var/log/collected.log\n  sleep 60\ndone` },
    ],
    correctIndex: 0,
    explanation: "rsyslog with TCP forwarding (@@) provides real-time, reliable log shipping to a central SIEM. The template organizes logs by hostname and program. Option B (hourly SCP) creates gaps and is not real-time. Option C (SSH polling) is fragile, not scalable, and creates security risks with persistent SSH sessions.",
    explanationAr: "rsyslog مع إعادة توجيه TCP (@@) يوفر شحن سجلات موثوق في الوقت الفعلي إلى SIEM مركزي. القالب ينظم السجلات حسب اسم المضيف والبرنامج. الخيار B (SCP كل ساعة) ينشئ فجوات وليس في الوقت الفعلي. الخيار C (استطلاع SSH) هش وغير قابل للتوسع وينشئ مخاطر أمنية مع جلسات SSH المستمرة.",
  },
];

export default function AutomationScriptingLab({ onComplete }: { onComplete?: (score?: number) => void }) {
  const { tx } = useLabLang();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const t = TASKS[current];

  const handleSubmit = useCallback(() => {
    if (selected === null) return;
    setShowResult(true);
    if (selected === t.correctIndex) setScore(s => s + 1);
  }, [selected, t]);

  const handleNext = useCallback(() => {
    if (current < TASKS.length - 1) { setCurrent(c => c + 1); setSelected(null); setShowResult(false); }
    else setCompleted(true);
  }, [current]);

  const reset = useCallback(() => { setCurrent(0); setSelected(null); setShowResult(false); setScore(0); setCompleted(false); }, []);

  return (
    <div className="bg-[#001A16] border-2 border-[#0A6B5A]/40 p-6 my-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Code className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Security Automation Lab", "مختبر أتمتة الأمان")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Task", "مهمة")} {current + 1}/{TASKS.length} - {tx("Score", "النتيجة")}: {score}/{TASKS.length}</p>
        </div>
      </div>

      {completed ? (
        <div className="text-center py-8">
          <Terminal className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Automation Expert!", "خبير الأتمتة!")}</h4>
          <p className="text-[#C4B9A8] font-['Work_Sans'] mb-4">{tx(`You scored ${score}/${TASKS.length}!`, `حصلت على ${score}/${TASKS.length}!`)}</p>
          <button onClick={reset} className="flex items-center gap-2 mx-auto px-6 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all"><RotateCcw className="w-4 h-4" /> {tx("Play Again", "ابدأ من جديد")}</button>
        </div>
      ) : (
        <>
          <div className="bg-[#002F24]/50 border border-[#0A6B5A]/30 p-4 mb-4">
            <p className="text-[#E8E0D4] font-['Work_Sans'] text-sm">{tx(t.task, t.taskAr)}</p>
          </div>

          <p className="text-[#C4B9A8] font-['Montserrat'] text-xs font-semibold mb-3">{tx("Which script correctly accomplishes this task?", "أي سكريبت ينجز هذه المهمة بشكل صحيح؟")}</p>
          <div className="space-y-3 mb-4">
            {t.codeSnippets.map((snippet, i) => (
              <button key={i} onClick={() => !showResult && setSelected(i)}
                className={`w-full text-left border transition-all ${
                  showResult
                    ? i === t.correctIndex ? "border-[#D4AF37] bg-[#D4AF37]/5" : i === selected ? "border-red-500/50 bg-red-500/5" : "border-[#0A6B5A]/20 opacity-50"
                    : selected === i ? "border-[#D4AF37] bg-[#D4AF37]/5" : "border-[#0A6B5A]/30 hover:border-[#D4AF37]/50"
                }`}>
                <div className="px-3 py-2 text-xs font-['Montserrat'] font-semibold text-[#C4B9A8]">{snippet.label}</div>
                <pre className="px-3 pb-3 font-mono text-xs text-green-400 whitespace-pre-wrap">{snippet.code}</pre>
              </button>
            ))}
          </div>

          {!showResult ? (
            <button onClick={handleSubmit} disabled={selected === null} className="px-6 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all disabled:opacity-40">{tx("Submit", "إرسال")}</button>
          ) : (
            <div className="bg-[#0A3D33]/40 border border-[#0A6B5A]/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                {selected === t.correctIndex ? <><CheckCircle className="w-5 h-5 text-[#D4AF37]" /><span className="text-[#D4AF37] font-['Montserrat'] font-bold text-sm">{tx("Correct!", "صحيح!")}</span></> : <><XCircle className="w-5 h-5 text-red-400" /><span className="text-red-400 font-['Montserrat'] font-bold text-sm">{tx("Incorrect", "غير صحيح")}</span></>}
              </div>
              <p className="text-[#C4B9A8] font-['Work_Sans'] text-sm">{tx(t.explanation, t.explanationAr)}</p>
              <button onClick={handleNext} className="mt-3 flex items-center gap-2 px-5 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all">
                {current < TASKS.length - 1 ? tx("Next Task", "المهمة التالية") : tx("See Results", "عرض النتائج")} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
