/*
  System Hacking Lab
  Students work through system hacking scenarios: password cracking, privilege escalation, maintaining access.
  Maps to CEH Day 5: System Hacking - Gaining & Maintaining Access
  Bilingual: English + Arabic
*/

import { useState, useCallback } from "react";
import { Lock, CheckCircle, XCircle, RotateCcw, ArrowRight, Key } from "lucide-react";
import { useLabLang } from "./labI18n";

type Challenge = {
  id: number;
  scenario: string;
  scenarioAr: string;
  terminalOutput: string[];
  question: string;
  questionAr: string;
  options: string[];
  optionsAr: string[];
  correctIndex: number;
  explanation: string;
  explanationAr: string;
};

const CHALLENGES: Challenge[] = [
  {
    id: 1,
    scenario: "You've obtained a password hash from the SAM database of a Windows target: Administrator:500:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::",
    scenarioAr: "حصلت على تجزئة كلمة مرور من قاعدة بيانات SAM لهدف Windows: Administrator:500:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::",
    terminalOutput: [
      "$ cat sam_hashes.txt",
      "Administrator:500:aad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::",
      "Guest:501:aad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::",
      "$ hashcat -m 1000 hash.txt rockyou.txt",
      "31d6cfe0d16ae931b73c59d7e0c089c0: (empty password)",
    ],
    question: "The NTLM hash 31d6cfe0d16ae931b73c59d7e0c089c0 resolves to an empty password. What does this indicate?",
    questionAr: "تجزئة NTLM 31d6cfe0d16ae931b73c59d7e0c089c0 تحل إلى كلمة مرور فارغة. ماذا يشير هذا؟",
    options: ["The account is disabled", "The Administrator account has no password set", "The hash file is corrupted", "The password is encrypted with AES"],
    optionsAr: ["الحساب معطل", "حساب المسؤول ليس له كلمة مرور", "ملف التجزئة تالف", "كلمة المرور مشفرة بـ AES"],
    correctIndex: 1,
    explanation: "The hash 31d6cfe0d16ae931b73c59d7e0c089c0 is the well-known NTLM hash for an empty/blank password. This means the Administrator account has no password set, which is a critical security misconfiguration allowing direct login.",
    explanationAr: "التجزئة 31d6cfe0d16ae931b73c59d7e0c089c0 هي تجزئة NTLM المعروفة لكلمة مرور فارغة. هذا يعني أن حساب المسؤول ليس له كلمة مرور.",
  },
  {
    id: 2,
    scenario: "You have a low-privilege shell on a Linux server. You need to escalate to root. You run 'sudo -l' and find interesting results.",
    scenarioAr: "لديك صدفة بصلاحيات منخفضة على خادم Linux. تحتاج للتصعيد إلى root. تشغل 'sudo -l' وتجد نتائج مثيرة.",
    terminalOutput: [
      "$ whoami",
      "webuser",
      "$ sudo -l",
      "User webuser may run the following commands:",
      "  (root) NOPASSWD: /usr/bin/vim",
      "  (root) NOPASSWD: /usr/bin/find",
    ],
    question: "How can you escalate to root using the sudo permissions shown?",
    questionAr: "كيف يمكنك التصعيد إلى root باستخدام صلاحيات sudo المعروضة؟",
    options: [
      "Run 'sudo su' to switch to root",
      "Use 'sudo vim -c \":!bash\"' to spawn a root shell from vim",
      "Modify /etc/passwd directly",
      "Restart the SSH service as root",
    ],
    optionsAr: [
      "تشغيل 'sudo su' للتبديل إلى root",
      "استخدام 'sudo vim -c \":!bash\"' لإنشاء صدفة root من vim",
      "تعديل /etc/passwd مباشرة",
      "إعادة تشغيل خدمة SSH كـ root",
    ],
    correctIndex: 1,
    explanation: "Vim can execute shell commands. Running 'sudo vim -c \":!bash\"' opens vim as root, then immediately spawns a bash shell with root privileges. This is a classic GTFOBins privilege escalation technique. Similarly, 'sudo find / -exec /bin/bash \\;' would also work.",
    explanationAr: "Vim يمكنه تنفيذ أوامر الصدفة. تشغيل 'sudo vim -c \":!bash\"' يفتح vim كـ root، ثم ينشئ فوراً صدفة bash بصلاحيات root. هذه تقنية تصعيد صلاحيات كلاسيكية من GTFOBins.",
  },
  {
    id: 3,
    scenario: "After gaining root access, you want to maintain persistent access. You discover the target uses SSH key-based authentication.",
    scenarioAr: "بعد الحصول على وصول root، تريد الحفاظ على وصول دائم. تكتشف أن الهدف يستخدم مصادقة مفتاح SSH.",
    terminalOutput: [
      "# cat /root/.ssh/authorized_keys",
      "ssh-rsa AAAAB3NzaC1yc2EA... admin@company.com",
      "# ls -la /root/.ssh/",
      "-rw------- 1 root root 1679 authorized_keys",
      "-rw------- 1 root root 1675 id_rsa",
    ],
    question: "Which persistence technique is MOST stealthy for maintaining access?",
    questionAr: "أي تقنية استمرارية هي الأكثر خفاءً للحفاظ على الوصول؟",
    options: [
      "Add a new user account with root privileges",
      "Add your SSH public key to /root/.ssh/authorized_keys",
      "Install a reverse shell in /etc/rc.local",
      "Change the root password",
    ],
    optionsAr: [
      "إضافة حساب مستخدم جديد بصلاحيات root",
      "إضافة مفتاح SSH العام الخاص بك إلى /root/.ssh/authorized_keys",
      "تثبيت صدفة عكسية في /etc/rc.local",
      "تغيير كلمة مرور root",
    ],
    correctIndex: 1,
    explanation: "Adding an SSH key to authorized_keys is the stealthiest option. It blends in with existing keys, doesn't create new accounts (which would appear in logs), and doesn't modify system startup scripts. The key is just one more line in an existing file.",
    explanationAr: "إضافة مفتاح SSH إلى authorized_keys هو الخيار الأكثر خفاءً. يندمج مع المفاتيح الموجودة، ولا ينشئ حسابات جديدة، ولا يعدل نصوص بدء التشغيل.",
  },
  {
    id: 4,
    scenario: "You need to cover your tracks after a penetration test. The client wants to know what an attacker would do to hide their activities.",
    scenarioAr: "تحتاج لإخفاء آثارك بعد اختبار اختراق. يريد العميل معرفة ما سيفعله المهاجم لإخفاء أنشطته.",
    terminalOutput: [
      "# cat /var/log/auth.log | tail -5",
      "Mar 15 14:23:01 server sshd: Accepted publickey for root",
      "Mar 15 14:23:45 server sudo: webuser : TTY=pts/0 ; COMMAND=/usr/bin/vim",
      "Mar 15 14:24:12 server su: pam_unix: session opened for user root",
      "# history",
      "  1  sudo -l",
      "  2  sudo vim -c ':!bash'",
    ],
    question: "Which log file is MOST important to clear to hide SSH-based unauthorized access?",
    questionAr: "أي ملف سجل هو الأهم لمسحه لإخفاء الوصول غير المصرح به عبر SSH؟",
    options: ["/var/log/syslog", "/var/log/auth.log", "/var/log/apache2/access.log", "/var/log/kern.log"],
    optionsAr: ["/var/log/syslog", "/var/log/auth.log", "/var/log/apache2/access.log", "/var/log/kern.log"],
    correctIndex: 1,
    explanation: "/var/log/auth.log records all authentication events including SSH logins, sudo usage, and user switching. It's the primary evidence trail for unauthorized access. An attacker would also clear .bash_history and /var/log/wtmp (login records).",
    explanationAr: "/var/log/auth.log يسجل جميع أحداث المصادقة بما في ذلك تسجيلات SSH واستخدام sudo وتبديل المستخدمين. إنه أثر الأدلة الرئيسي للوصول غير المصرح به.",
  },
  {
    id: 5,
    scenario: "During a pentest, you capture NTLM hashes from network traffic. Instead of cracking them, you want to use them directly.",
    scenarioAr: "أثناء اختبار اختراق، التقطت تجزئات NTLM من حركة الشبكة. بدلاً من كسرها، تريد استخدامها مباشرة.",
    terminalOutput: [
      "$ responder -I eth0",
      "[+] Captured NTLMv2 Hash:",
      "admin::CORP:1122334455667788:A1B2C3D4E5F6...",
      "",
      "$ crackmapexec smb 10.0.1.0/24 -u admin -H A1B2C3D4E5F6...",
      "SMB  10.0.1.100  445  DC01  [+] CORP\\admin A1B2C3... (Pwn3d!)",
    ],
    question: "What attack technique is being demonstrated here?",
    questionAr: "ما تقنية الهجوم التي يتم عرضها هنا؟",
    options: ["Brute force attack", "Pass-the-Hash (PtH) attack", "Rainbow table attack", "Dictionary attack"],
    optionsAr: ["هجوم القوة الغاشمة", "هجوم تمرير التجزئة (PtH)", "هجوم جدول قوس قزح", "هجوم القاموس"],
    correctIndex: 1,
    explanation: "Pass-the-Hash (PtH) uses captured NTLM hashes to authenticate without knowing the plaintext password. CrackMapExec's -H flag passes the hash directly to SMB authentication. This works because Windows NTLM authentication only requires the hash, not the password itself.",
    explanationAr: "تمرير التجزئة (PtH) يستخدم تجزئات NTLM الملتقطة للمصادقة دون معرفة كلمة المرور النصية. علامة -H في CrackMapExec تمرر التجزئة مباشرة لمصادقة SMB.",
  },
];

export default function SystemHackingLab({ onComplete }: { onComplete?: (score?: number) => void }) {
  const { tx } = useLabLang();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const challenge = CHALLENGES[current];

  const handleSubmit = useCallback(() => { if (selected === null) return; setShowResult(true); if (selected === challenge.correctIndex) setScore(s => s + 1); }, [selected, challenge]);
  const handleNext = useCallback(() => { if (current < CHALLENGES.length - 1) { setCurrent(c => c + 1); setSelected(null); setShowResult(false); } else { setCompleted(true); } }, [current]);
  const reset = useCallback(() => { setCurrent(0); setSelected(null); setShowResult(false); setScore(0); setCompleted(false); }, []);

  return (
    <div className="bg-[#F5F0E8] border-2 border-[#227C82]/40 p-6 my-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Lock className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("System Hacking Lab", "مختبر اختراق الأنظمة")}</h3>
          <p className="text-[#0C3C3C] font-['Work_Sans'] text-xs">{tx("Challenge", "تحدي")} {current + 1}/{CHALLENGES.length} - {tx("Score", "النتيجة")}: {score}/{CHALLENGES.length}</p>
        </div>
      </div>

      {completed ? (
        <div className="text-center py-8">
          <Key className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#0C3C3C] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Lab Complete!", "اكتمل المختبر!")}</h4>
          <p className="text-[#0C3C3C] font-['Work_Sans'] mb-4">{tx(`You scored ${score}/${CHALLENGES.length}. Impressive system hacking knowledge!`, `حصلت على ${score}/${CHALLENGES.length}. معرفة مثيرة باختراق الأنظمة!`)}</p>
          <button onClick={reset} className="flex items-center gap-2 mx-auto px-6 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all"><RotateCcw className="w-4 h-4" /> {tx("Play Again", "ابدأ من جديد")}</button>
        </div>
      ) : (
        <>
          <div className="bg-white/50 border border-[#D4CBBA] p-3 mb-3">
            <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm">{tx(challenge.scenario, challenge.scenarioAr)}</p>
          </div>
          <div className="bg-[#0a0a0a] border border-[#333] p-3 mb-4 font-mono text-xs max-h-40 overflow-y-auto">
            {challenge.terminalOutput.map((line, i) => (
              <div key={i} className={line.startsWith("$") || line.startsWith("#") ? "text-green-400" : line.includes("Pwn3d") || line.includes("Accepted") ? "text-red-400" : "text-gray-300"}>{line || "\u00A0"}</div>
            ))}
          </div>

          <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm font-medium mb-3">{tx(challenge.question, challenge.questionAr)}</p>
          <div className="space-y-2 mb-4">
            {(tx(challenge.options.join("|"), challenge.optionsAr.join("|"))).split("|").map((opt, i) => (
              <button key={i} onClick={() => !showResult && setSelected(i)}
                className={`w-full text-start p-3 border font-['Work_Sans'] text-sm transition-all ${showResult ? i === challenge.correctIndex ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#0C3C3C]" : i === selected ? "border-red-500/50 bg-red-500/10 text-red-600" : "border-[#D4CBBA] text-[#0C3C3C]/50" : selected === i ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#0C3C3C]" : "border-[#D4CBBA] text-[#0C3C3C] hover:border-[#D4AF37]/50"}`}>{opt}</button>
            ))}
          </div>

          {!showResult ? (
            <button onClick={handleSubmit} disabled={selected === null} className="px-6 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all disabled:opacity-40">{tx("Submit", "إرسال")}</button>
          ) : (
            <div className="bg-[#164A4A]/10 border border-[#D4CBBA] p-4">
              <div className="flex items-center gap-2 mb-2">
                {selected === challenge.correctIndex ? <><CheckCircle className="w-5 h-5 text-[#D4AF37]" /><span className="text-[#D4AF37] font-['Montserrat'] font-bold text-sm">{tx("Correct!", "صحيح!")}</span></> : <><XCircle className="w-5 h-5 text-red-500" /><span className="text-red-500 font-['Montserrat'] font-bold text-sm">{tx("Incorrect", "غير صحيح")}</span></>}
              </div>
              <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm">{tx(challenge.explanation, challenge.explanationAr)}</p>
              <button onClick={handleNext} className="mt-3 flex items-center gap-2 px-5 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all">
                {current < CHALLENGES.length - 1 ? tx("Next Challenge", "التحدي التالي") : tx("See Results", "عرض النتائج")} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
