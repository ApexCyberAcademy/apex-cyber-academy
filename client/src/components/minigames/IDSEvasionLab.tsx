/*
  IDS Evasion Lab
  Students learn techniques to evade IDS, firewalls, and detect honeypots.
  Maps to CEH Day 10: Evading IDS, Firewalls & Honeypots
  Bilingual: English + Arabic
*/

import { useState, useCallback } from "react";
import { Eye, CheckCircle, XCircle, RotateCcw, ArrowRight, ShieldOff } from "lucide-react";
import { useLabLang } from "./labI18n";

type EvasionChallenge = {
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

const CHALLENGES: EvasionChallenge[] = [
  {
    id: 1,
    scenario: "During a penetration test, your Nmap scans are being blocked by the target's IDS/IPS. You need to evade detection.",
    scenarioAr: "أثناء اختبار اختراق، يتم حظر مسوحات Nmap بواسطة IDS/IPS الهدف. تحتاج للتهرب من الكشف.",
    terminalOutput: [
      "$ nmap -sS 10.0.1.0/24",
      "Nmap scan report: All 1000 ports filtered (IDS blocking!)",
      "",
      "$ nmap -sS -T0 --data-length 50 -D RND:10 -f 10.0.1.100",
      "  -T0: Paranoid timing (5 min between probes)",
      "  --data-length 50: Random payload padding",
      "  -D RND:10: 10 random decoy IP addresses",
      "  -f: Fragment packets into 8-byte chunks",
      "",
      "Nmap scan report for 10.0.1.100:",
      "PORT    STATE  SERVICE",
      "22/tcp  open   ssh",
      "80/tcp  open   http",
      "443/tcp open   https",
    ],
    question: "Which evasion technique is MOST effective against signature-based IDS?",
    questionAr: "أي تقنية تهرب هي الأكثر فعالية ضد IDS القائم على التوقيعات؟",
    options: ["Slow timing (-T0) to avoid rate-based detection", "Packet fragmentation (-f) to split attack signatures across multiple packets", "Using decoy IPs (-D) to confuse the analyst", "Random data padding (--data-length)"],
    optionsAr: ["التوقيت البطيء (-T0) لتجنب الكشف القائم على المعدل", "تجزئة الحزم (-f) لتقسيم توقيعات الهجوم عبر حزم متعددة", "استخدام عناوين IP خادعة (-D) لإرباك المحلل", "حشو بيانات عشوائي (--data-length)"],
    correctIndex: 1,
    explanation: "Packet fragmentation (-f) is most effective against signature-based IDS because it splits the attack payload across multiple small packets. The IDS must reassemble fragments to match signatures, and many IDS implementations fail to properly reassemble fragmented traffic, allowing the attack to pass undetected.",
    explanationAr: "تجزئة الحزم (-f) هي الأكثر فعالية ضد IDS القائم على التوقيعات لأنها تقسم حمولة الهجوم عبر حزم صغيرة متعددة. يجب على IDS إعادة تجميع الأجزاء لمطابقة التوقيعات، والعديد من تطبيقات IDS تفشل في ذلك.",
  },
  {
    id: 2,
    scenario: "You suspect a system on the network is a honeypot designed to trap attackers. You need to identify it.",
    scenarioAr: "تشتبه أن نظاماً على الشبكة هو مصيدة (honeypot) مصممة لاصطياد المهاجمين. تحتاج لتحديده.",
    terminalOutput: [
      "$ nmap -sV -O 10.0.1.200",
      "PORT     STATE SERVICE  VERSION",
      "21/tcp   open  ftp      vsftpd 2.3.4 (known vuln!)",
      "22/tcp   open  ssh      OpenSSH 4.3 (ancient!)",
      "23/tcp   open  telnet   Linux telnetd",
      "80/tcp   open  http     Apache 2.2.3 (outdated!)",
      "443/tcp  open  https    Apache 2.2.3",
      "3306/tcp open  mysql    MySQL 5.0.45",
      "8080/tcp open  http     Tomcat 5.5 (ancient!)",
      "",
      "OS: Linux 2.6.x (outdated kernel)",
      "All services respond instantly with no rate limiting",
      "Every port appears vulnerable to known exploits",
    ],
    question: "What are the RED FLAGS that indicate this is a honeypot?",
    questionAr: "ما هي العلامات الحمراء التي تشير إلى أن هذا مصيدة (honeypot)؟",
    options: ["The server is running Linux", "Too many vulnerable services on one host, all with known exploits, ancient versions, and no rate limiting", "The server has MySQL exposed", "The server uses Apache web server"],
    optionsAr: ["الخادم يعمل بنظام Linux", "خدمات ضعيفة كثيرة جداً على مضيف واحد، جميعها مع ثغرات معروفة وإصدارات قديمة وبدون تحديد معدل", "الخادم يكشف MySQL", "الخادم يستخدم خادم Apache"],
    correctIndex: 1,
    explanation: "Multiple red flags indicate a honeypot: (1) Too many services with known vulnerabilities on one host, (2) All services are intentionally outdated versions with public exploits, (3) No rate limiting or security hardening, (4) It's \"too easy\" to exploit. Real production servers don't expose this many vulnerable services simultaneously.",
    explanationAr: "علامات حمراء متعددة تشير إلى مصيدة: (1) خدمات كثيرة جداً مع ثغرات معروفة على مضيف واحد، (2) جميع الخدمات إصدارات قديمة عمداً مع ثغرات عامة، (3) بدون تحديد معدل أو تقوية أمنية، (4) \"سهل جداً\" للاستغلال.",
  },
  {
    id: 3,
    scenario: "You need to bypass a web application firewall (WAF) that is blocking SQL injection attempts.",
    scenarioAr: "تحتاج لتجاوز جدار حماية تطبيقات الويب (WAF) الذي يحظر محاولات حقن SQL.",
    terminalOutput: [
      "=== Blocked Attempts ===",
      "Input: ' OR 1=1 --           → WAF: BLOCKED (SQL keyword detected)",
      "Input: ' UNION SELECT * --   → WAF: BLOCKED (UNION detected)",
      "Input: '; DROP TABLE --      → WAF: BLOCKED (DROP detected)",
      "",
      "=== Evasion Techniques ===",
      "1. Case variation:  ' uNiOn SeLeCt * --",
      "2. Comment insertion: ' UN/**/ION SEL/**/ECT * --",
      "3. URL encoding: %27%20OR%201%3D1%20--",
      "4. Double encoding: %2527%2520OR%25201%253D1",
      "5. Null bytes: %00' OR 1=1 --",
    ],
    question: "Which WAF evasion technique exploits differences in how the WAF and database parse input?",
    questionAr: "أي تقنية تهرب من WAF تستغل الاختلافات في كيفية تحليل WAF وقاعدة البيانات للمدخلات؟",
    options: ["Case variation (uNiOn SeLeCt)", "Comment insertion (UN/**/ION) - WAF sees comments, DB ignores them and executes the query", "URL encoding (%27)", "Using longer payloads"],
    optionsAr: ["تنويع الحالة (uNiOn SeLeCt)", "إدراج التعليقات (UN/**/ION) - WAF يرى تعليقات، قاعدة البيانات تتجاهلها وتنفذ الاستعلام", "ترميز URL (%27)", "استخدام حمولات أطول"],
    correctIndex: 1,
    explanation: "Comment insertion (UN/**/ION SEL/**/ECT) exploits the parsing gap: the WAF's pattern matching doesn't recognize 'UNION SELECT' when split by comments, but the SQL parser strips comments and executes 'UNION SELECT' normally. This is a classic example of the impedance mismatch between security filters and backend interpreters.",
    explanationAr: "إدراج التعليقات (UN/**/ION SEL/**/ECT) يستغل فجوة التحليل: مطابقة أنماط WAF لا تتعرف على 'UNION SELECT' عند تقسيمها بالتعليقات، لكن محلل SQL يزيل التعليقات وينفذ 'UNION SELECT' بشكل طبيعي.",
  },
  {
    id: 4,
    scenario: "You're testing a network with a stateful firewall. You need to understand its rule set to find gaps.",
    scenarioAr: "تختبر شبكة مع جدار حماية ذو حالة. تحتاج لفهم مجموعة قواعده لإيجاد ثغرات.",
    terminalOutput: [
      "$ nmap -sA 10.0.1.0/24    (ACK scan - firewall mapping)",
      "PORT    STATE      SERVICE",
      "22/tcp  unfiltered ssh        (firewall allows ACK)",
      "80/tcp  unfiltered http       (firewall allows ACK)",
      "443/tcp unfiltered https      (firewall allows ACK)",
      "8080/tcp filtered   http-alt  (firewall blocks ACK)",
      "",
      "$ nmap -sS 10.0.1.100    (SYN scan - actual port state)",
      "PORT    STATE  SERVICE",
      "22/tcp  open   ssh",
      "80/tcp  open   http",
      "443/tcp open   https",
      "8080/tcp closed http-alt",
    ],
    question: "What does the ACK scan (-sA) reveal that a SYN scan cannot?",
    questionAr: "ماذا يكشف مسح ACK (-sA) ما لا يستطيع مسح SYN كشفه؟",
    options: ["Which ports have services running", "The firewall rule set - which ports are filtered vs unfiltered by the firewall", "The operating system version", "Whether services are vulnerable"],
    optionsAr: ["أي المنافذ تعمل عليها خدمات", "مجموعة قواعد جدار الحماية - أي المنافذ مفلترة مقابل غير مفلترة بواسطة جدار الحماية", "إصدار نظام التشغيل", "ما إذا كانت الخدمات ضعيفة"],
    correctIndex: 1,
    explanation: "ACK scans map firewall rules, not port states. An 'unfiltered' response means the firewall allows the ACK packet through (stateless rule or no rule), while 'filtered' means the firewall actively blocks it. This reveals which ports the firewall protects, helping identify gaps in the firewall configuration.",
    explanationAr: "مسوحات ACK تخطط قواعد جدار الحماية وليس حالات المنافذ. استجابة 'unfiltered' تعني أن جدار الحماية يسمح بمرور حزمة ACK، بينما 'filtered' تعني أن جدار الحماية يحظرها بنشاط.",
  },
  {
    id: 5,
    scenario: "You're designing a defense-in-depth strategy to detect and prevent advanced evasion techniques.",
    scenarioAr: "تصمم استراتيجية دفاع في العمق لكشف ومنع تقنيات التهرب المتقدمة.",
    terminalOutput: [
      "=== Current Security Stack ===",
      "Layer 1: Perimeter firewall (stateful, basic rules)",
      "Layer 2: IDS (signature-based only, Snort)",
      "Layer 3: WAF (OWASP ModSecurity CRS)",
      "",
      "=== Gaps Identified ===",
      "- No behavioral/anomaly detection",
      "- No encrypted traffic inspection (TLS blind spot)",
      "- No deception technology (honeypots/honeytokens)",
      "- Single-vendor IDS (easy to fingerprint and evade)",
      "- No network segmentation",
    ],
    question: "What addition would MOST improve detection of advanced evasion techniques?",
    questionAr: "أي إضافة ستحسن بشكل أكبر كشف تقنيات التهرب المتقدمة؟",
    options: ["Add another signature-based IDS from a different vendor", "Deploy behavioral/anomaly-based detection (ML-powered) alongside signature-based IDS", "Increase firewall rule complexity", "Add more WAF rules"],
    optionsAr: ["إضافة IDS آخر قائم على التوقيعات من مورد مختلف", "نشر كشف قائم على السلوك/الشذوذ (مدعوم بالتعلم الآلي) إلى جانب IDS القائم على التوقيعات", "زيادة تعقيد قواعد جدار الحماية", "إضافة المزيد من قواعد WAF"],
    correctIndex: 1,
    explanation: "Behavioral/anomaly-based detection complements signature-based IDS by detecting unknown attacks and evasion techniques. While signature-based systems only catch known patterns (which can be evaded), anomaly detection identifies deviations from normal behavior - catching zero-day attacks, encrypted threats, and novel evasion techniques.",
    explanationAr: "الكشف القائم على السلوك/الشذوذ يكمل IDS القائم على التوقيعات بكشف الهجمات غير المعروفة وتقنيات التهرب. بينما الأنظمة القائمة على التوقيعات تلتقط فقط الأنماط المعروفة، كشف الشذوذ يحدد الانحرافات عن السلوك الطبيعي.",
  },
];

export default function IDSEvasionLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Eye className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("IDS Evasion & Honeypot Lab", "مختبر التهرب من IDS والمصائد")}</h3>
          <p className="text-[#0C3C3C] font-['Work_Sans'] text-xs">{tx("Challenge", "تحدي")} {current + 1}/{CHALLENGES.length} - {tx("Score", "النتيجة")}: {score}/{CHALLENGES.length}</p>
        </div>
      </div>

      {completed ? (
        <div className="text-center py-8">
          <ShieldOff className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#0C3C3C] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Lab Complete!", "اكتمل المختبر!")}</h4>
          <p className="text-[#0C3C3C] font-['Work_Sans'] mb-4">{tx(`You scored ${score}/${CHALLENGES.length}. Evasion expert!`, `حصلت على ${score}/${CHALLENGES.length}. خبير تهرب!`)}</p>
          <button onClick={reset} className="flex items-center gap-2 mx-auto px-6 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all"><RotateCcw className="w-4 h-4" /> {tx("Play Again", "ابدأ من جديد")}</button>
        </div>
      ) : (
        <>
          <div className="bg-white/50 border border-[#D4CBBA] p-3 mb-3">
            <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm">{tx(challenge.scenario, challenge.scenarioAr)}</p>
          </div>
          <div className="bg-[#0a0a0a] border border-[#333] p-3 mb-4 font-mono text-xs max-h-48 overflow-y-auto">
            {challenge.terminalOutput.map((line, i) => (
              <div key={i} className={line.startsWith("$") ? "text-green-400" : line.includes("BLOCKED") || line.includes("filtered") ? "text-red-400" : line.includes("===") || line.includes("Evasion") ? "text-blue-300" : line.includes("open") || line.includes("unfiltered") ? "text-yellow-400" : "text-gray-300"}>{line || "\u00A0"}</div>
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
