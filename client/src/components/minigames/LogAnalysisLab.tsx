/*
  Log Analysis Lab
  Students analyze security logs to identify threats and anomalies.
  Maps to Security+ Day 11: Vulnerability Management, Alerting, and Monitoring
  Bilingual: English + Arabic
*/

import { useState, useEffect, useCallback } from "react";
import { FileSearch, CheckCircle, XCircle, RotateCcw, ArrowRight, Terminal } from "lucide-react";
import { useLabLang } from "./labI18n";

type LogEntry = {
  id: number;
  title: string;
  titleAr: string;
  logLines: string[];
  question: string;
  questionAr: string;
  correctAnswer: string;
  options: string[];
  optionsAr: string[];
  explanation: string;
  explanationAr: string;
};

const LOGS: LogEntry[] = [
  {
    id: 1,
    title: "Failed SSH Login Attempts",
    titleAr: "محاولات تسجيل دخول SSH فاشلة",
    logLines: [
      "Mar 10 02:14:01 web-srv sshd[4521]: Failed password for root from 185.220.101.34 port 44821",
      "Mar 10 02:14:03 web-srv sshd[4523]: Failed password for root from 185.220.101.34 port 44825",
      "Mar 10 02:14:04 web-srv sshd[4525]: Failed password for admin from 185.220.101.34 port 44830",
      "Mar 10 02:14:06 web-srv sshd[4527]: Failed password for ubuntu from 185.220.101.34 port 44835",
      "Mar 10 02:14:07 web-srv sshd[4529]: Failed password for test from 185.220.101.34 port 44840",
      "Mar 10 02:14:09 web-srv sshd[4531]: Failed password for postgres from 185.220.101.34 port 44845",
    ],
    question: "What type of attack does this log indicate?",
    questionAr: "ما نوع الهجوم الذي يشير إليه هذا السجل؟",
    correctAnswer: "Brute-force / Credential stuffing attack (multiple usernames from same IP)",
    options: [
      "Normal failed login from a forgetful user",
      "Brute-force / Credential stuffing attack (multiple usernames from same IP)",
      "Distributed Denial of Service (DDoS)",
      "SQL injection attempt",
    ],
    optionsAr: [
      "تسجيل دخول فاشل عادي من مستخدم نسي كلمة المرور",
      "هجوم القوة الغاشمة / حشو بيانات الاعتماد (أسماء مستخدمين متعددة من نفس IP)",
      "هجوم حجب الخدمة الموزع (DDoS)",
      "محاولة حقن SQL",
    ],
    explanation: "Multiple failed logins with different usernames (root, admin, ubuntu, test, postgres) from the same IP within seconds indicates an automated brute-force attack cycling through common usernames. The rapid timing and sequential ports confirm automation.",
    explanationAr: "محاولات تسجيل دخول فاشلة متعددة بأسماء مستخدمين مختلفة (root, admin, ubuntu, test, postgres) من نفس IP خلال ثوانٍ تشير إلى هجوم قوة غاشمة آلي يتنقل بين أسماء المستخدمين الشائعة. التوقيت السريع والمنافذ المتسلسلة تؤكد الأتمتة.",
  },
  {
    id: 2,
    title: "Web Server Access Logs",
    titleAr: "سجلات وصول خادم الويب",
    logLines: [
      "10.0.1.50 - - [10/Mar/2026:14:22:01] \"GET /products?id=1 OR 1=1-- HTTP/1.1\" 200 4521",
      "10.0.1.50 - - [10/Mar/2026:14:22:03] \"GET /products?id=1 UNION SELECT username,password FROM users-- HTTP/1.1\" 500 312",
      "10.0.1.50 - - [10/Mar/2026:14:22:05] \"GET /products?id=1; DROP TABLE users-- HTTP/1.1\" 500 289",
      "10.0.1.50 - - [10/Mar/2026:14:22:08] \"GET /admin/config.php HTTP/1.1\" 403 178",
    ],
    question: "What attack is being attempted and what is the most concerning log entry?",
    questionAr: "ما الهجوم الذي يتم محاولته وما هو أكثر سطر سجل مقلق؟",
    correctAnswer: "SQL injection — the UNION SELECT extracting usernames/passwords is most dangerous",
    options: [
      "Cross-site scripting (XSS) — the admin access attempt is most concerning",
      "SQL injection — the UNION SELECT extracting usernames/passwords is most dangerous",
      "Directory traversal — the config.php access is the main threat",
      "Normal penetration testing — all entries are benign",
    ],
    optionsAr: [
      "البرمجة عبر المواقع (XSS) — محاولة الوصول للمسؤول هي الأكثر إثارة للقلق",
      "حقن SQL — استخراج UNION SELECT لأسماء المستخدمين/كلمات المرور هو الأخطر",
      "اجتياز الدليل — الوصول لـ config.php هو التهديد الرئيسي",
      "اختبار اختراق عادي — جميع الإدخالات حميدة",
    ],
    explanation: "The UNION SELECT query attempts to extract usernames and passwords from the users table — this is active data exfiltration via SQL injection. The first entry (OR 1=1) returned 200, meaning the app may be vulnerable. The DROP TABLE attempt is destructive but the 500 error suggests it failed.",
    explanationAr: "استعلام UNION SELECT يحاول استخراج أسماء المستخدمين وكلمات المرور من جدول المستخدمين — هذا تسريب بيانات نشط عبر حقن SQL. الإدخال الأول (OR 1=1) أعاد 200، مما يعني أن التطبيق قد يكون عرضة للخطر.",
  },
  {
    id: 3,
    title: "Windows Event Log Entries",
    titleAr: "إدخالات سجل أحداث Windows",
    logLines: [
      "Event 4624: Successful logon - User: CORP\\svc_backup, Logon Type: 3 (Network), Source: 10.0.2.15",
      "Event 4672: Special privileges assigned - User: CORP\\svc_backup, Privileges: SeBackupPrivilege, SeRestorePrivilege",
      "Event 4663: Object access - User: CORP\\svc_backup, File: \\\\DC01\\SYSVOL\\corp.local\\Policies\\{GPO}\\Machine\\Preferences\\Groups\\Groups.xml",
      "Event 4663: Object access - User: CORP\\svc_backup, File: \\\\DC01\\NTDS\\ntds.dit",
    ],
    question: "What is the svc_backup account likely doing?",
    questionAr: "ما الذي يفعله حساب svc_backup على الأرجح؟",
    correctAnswer: "Credential theft — accessing ntds.dit (Active Directory database) and Group Policy Preferences",
    options: [
      "Normal backup operations using backup service account",
      "Credential theft — accessing ntds.dit (Active Directory database) and Group Policy Preferences",
      "Group Policy update propagation",
      "Routine Active Directory replication",
    ],
    optionsAr: [
      "عمليات نسخ احتياطي عادية باستخدام حساب خدمة النسخ الاحتياطي",
      "سرقة بيانات اعتماد — الوصول لـ ntds.dit (قاعدة بيانات Active Directory) وتفضيلات سياسة المجموعة",
      "نشر تحديث سياسة المجموعة",
      "نسخ Active Directory الروتيني",
    ],
    explanation: "The ntds.dit file IS the Active Directory database containing all domain password hashes. Groups.xml in GPP may contain cached credentials. A backup account accessing these specific files is a classic credential theft technique (DCSync/ntds.dit extraction). Immediate investigation required.",
    explanationAr: "ملف ntds.dit هو قاعدة بيانات Active Directory التي تحتوي على جميع تجزئات كلمات مرور النطاق. Groups.xml في GPP قد يحتوي على بيانات اعتماد مخزنة مؤقتاً. حساب نسخ احتياطي يصل لهذه الملفات المحددة هو تقنية سرقة بيانات اعتماد كلاسيكية.",
  },
  {
    id: 4,
    title: "Firewall Deny Logs",
    titleAr: "سجلات رفض جدار الحماية",
    logLines: [
      "DENY TCP 10.0.5.22:49152 → 203.0.113.50:443 (HTTPS) - Rule: Outbound-Block-Suspicious",
      "DENY TCP 10.0.5.22:49153 → 203.0.113.50:8443 (Alt-HTTPS) - Rule: Outbound-Block-Suspicious",
      "DENY TCP 10.0.5.22:49154 → 203.0.113.50:53 (DNS-over-TCP) - Rule: Outbound-Block-Suspicious",
      "DENY UDP 10.0.5.22:49155 → 203.0.113.50:53 (DNS) - Rule: Outbound-Block-Suspicious",
      "DENY TCP 10.0.5.22:49156 → 203.0.113.50:80 (HTTP) - Rule: Outbound-Block-Suspicious",
    ],
    question: "What behavior pattern does this indicate?",
    questionAr: "ما نمط السلوك الذي يشير إليه هذا؟",
    correctAnswer: "C2 beaconing — malware trying multiple ports to reach a command-and-control server",
    options: [
      "Normal web browsing being blocked by overly strict rules",
      "C2 beaconing — malware trying multiple ports to reach a command-and-control server",
      "Port scanning from an internal host",
      "DNS resolution failure causing retries",
    ],
    optionsAr: [
      "تصفح ويب عادي يتم حظره بقواعد صارمة جداً",
      "إشارات C2 — برمجية خبيثة تجرب منافذ متعددة للوصول لخادم القيادة والتحكم",
      "فحص منافذ من مضيف داخلي",
      "فشل حل DNS يسبب إعادة المحاولة",
    ],
    explanation: "A single internal host (10.0.5.22) trying to reach the same external IP (203.0.113.50) on multiple ports (443, 8443, 53, 80) is classic C2 beaconing behavior. The malware is trying different ports to find one that's allowed through the firewall. The host needs immediate isolation and forensic investigation.",
    explanationAr: "مضيف داخلي واحد (10.0.5.22) يحاول الوصول لنفس IP الخارجي (203.0.113.50) على منافذ متعددة (443, 8443, 53, 80) هو سلوك إشارات C2 كلاسيكي. البرمجية الخبيثة تجرب منافذ مختلفة لإيجاد منفذ مسموح عبر جدار الحماية.",
  },
];

export default function LogAnalysisLab({ onComplete }: { onComplete?: (score?: number) => void }) {
  const { tx } = useLabLang();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const log = LOGS[current];

  const handleSubmit = useCallback(() => {
    if (selected === null) return;
    setShowResult(true);
    if (log.options[selected] === log.correctAnswer) setScore(s => s + 1);
  }, [selected, log]);

  const handleNext = useCallback(() => {
    if (current < LOGS.length - 1) { setCurrent(c => c + 1); setSelected(null); setShowResult(false); }
    else setCompleted(true);
  }, [current]);

  const reset = useCallback(() => { setCurrent(0); setSelected(null); setShowResult(false); setScore(0); setCompleted(false); }, []);

  return (
    <div className="bg-[#001A16] border-2 border-[#0A6B5A]/40 p-6 my-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><FileSearch className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Security Log Analysis Lab", "مختبر تحليل السجلات الأمنية")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Log", "سجل")} {current + 1}/{LOGS.length} - {tx("Score", "النتيجة")}: {score}/{LOGS.length}</p>
        </div>
      </div>

      {completed ? (
        <div className="text-center py-8">
          <Terminal className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("SOC Analyst!", "محلل SOC!")}</h4>
          <p className="text-[#C4B9A8] font-['Work_Sans'] mb-4">{tx(`You scored ${score}/${LOGS.length}!`, `حصلت على ${score}/${LOGS.length}!`)}</p>
          <button onClick={reset} className="flex items-center gap-2 mx-auto px-6 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all"><RotateCcw className="w-4 h-4" /> {tx("Play Again", "ابدأ من جديد")}</button>
        </div>
      ) : (
        <>
          <div className="bg-[#002F24]/50 border border-[#0A6B5A]/30 p-4 mb-4">
            <h4 className="text-[#E8E0D4] font-['Montserrat'] font-bold text-sm mb-3">{tx(log.title, log.titleAr)}</h4>
            <div className="bg-[#000D0A] p-3 font-mono text-xs text-green-400 overflow-x-auto space-y-1">
              {log.logLines.map((line, i) => <div key={i} className="whitespace-nowrap">{line}</div>)}
            </div>
          </div>

          <p className="text-[#C4B9A8] font-['Work_Sans'] text-sm mb-3">{tx(log.question, log.questionAr)}</p>
          <div className="space-y-2 mb-4">
            {log.options.map((opt, i) => (
              <button key={i} onClick={() => !showResult && setSelected(i)}
                className={`w-full text-left p-3 border font-['Work_Sans'] text-sm transition-all ${
                  showResult
                    ? opt === log.correctAnswer ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]" : i === selected ? "border-red-500/50 bg-red-500/10 text-red-400" : "border-[#0A6B5A]/20 text-[#C4B9A8]/50"
                    : selected === i ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]" : "border-[#0A6B5A]/30 text-[#C4B9A8] hover:border-[#D4AF37]/50"
                }`}>
                {tx(opt, log.optionsAr[i])}
              </button>
            ))}
          </div>

          {!showResult ? (
            <button onClick={handleSubmit} disabled={selected === null} className="px-6 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all disabled:opacity-40">{tx("Submit Analysis", "إرسال التحليل")}</button>
          ) : (
            <div className="bg-[#0A3D33]/40 border border-[#0A6B5A]/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                {log.options[selected!] === log.correctAnswer ? <><CheckCircle className="w-5 h-5 text-[#D4AF37]" /><span className="text-[#D4AF37] font-['Montserrat'] font-bold text-sm">{tx("Correct!", "صحيح!")}</span></> : <><XCircle className="w-5 h-5 text-red-400" /><span className="text-red-400 font-['Montserrat'] font-bold text-sm">{tx("Incorrect", "غير صحيح")}</span></>}
              </div>
              <p className="text-[#C4B9A8] font-['Work_Sans'] text-sm">{tx(log.explanation, log.explanationAr)}</p>
              <button onClick={handleNext} className="mt-3 flex items-center gap-2 px-5 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all">
                {current < LOGS.length - 1 ? tx("Next Log", "السجل التالي") : tx("See Results", "عرض النتائج")} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
