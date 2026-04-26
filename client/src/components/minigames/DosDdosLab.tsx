/*
  DoS/DDoS & Session Hijacking Lab
  Students analyze denial-of-service attacks and session hijacking techniques.
  Maps to CEH Day 9: DoS/DDoS Attacks & Session Hijacking
  Bilingual: English + Arabic
*/

import { useState, useCallback } from "react";
import { Zap, CheckCircle, XCircle, RotateCcw, ArrowRight, ShieldAlert } from "lucide-react";
import { useLabLang } from "./labI18n";

type DosChallenge = {
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

const CHALLENGES: DosChallenge[] = [
  {
    id: 1,
    scenario: "Your company's web server is experiencing a sudden spike in traffic. You analyze the incoming connections.",
    scenarioAr: "خادم الويب لشركتك يعاني من ارتفاع مفاجئ في حركة المرور. تحلل الاتصالات الواردة.",
    terminalOutput: [
      "$ netstat -an | grep :80 | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -rn | head",
      "  45832  192.168.1.50",
      "  45120  192.168.1.50",
      "  44998  192.168.1.50",
      "",
      "$ netstat -an | grep SYN_RECV | wc -l",
      "135000",
      "",
      "$ ss -s",
      "TCP: 142000 (estab 200, closed 0, orphaned 0, synrecv 135000)",
    ],
    question: "What type of DoS attack is this?",
    questionAr: "ما نوع هجوم حجب الخدمة هذا؟",
    options: ["HTTP flood attack", "SYN flood attack (half-open connections exhaustion)", "Slowloris attack", "DNS amplification attack"],
    optionsAr: ["هجوم إغراق HTTP", "هجوم إغراق SYN (استنزاف الاتصالات نصف المفتوحة)", "هجوم Slowloris", "هجوم تضخيم DNS"],
    correctIndex: 1,
    explanation: "The 135,000 SYN_RECV connections indicate a SYN flood attack. The attacker sends massive SYN packets without completing the TCP 3-way handshake, exhausting the server's connection table. Mitigation: SYN cookies, rate limiting, and increasing the backlog queue.",
    explanationAr: "135,000 اتصال SYN_RECV يشير إلى هجوم إغراق SYN. المهاجم يرسل حزم SYN ضخمة بدون إكمال مصافحة TCP الثلاثية، مما يستنزف جدول اتصالات الخادم. التخفيف: SYN cookies، تحديد المعدل.",
  },
  {
    id: 2,
    scenario: "A DDoS attack is targeting your DNS infrastructure. You capture traffic to analyze the attack vector.",
    scenarioAr: "هجوم DDoS يستهدف بنية DNS التحتية. تلتقط حركة المرور لتحليل متجه الهجوم.",
    terminalOutput: [
      "$ tcpdump -i eth0 port 53 -c 10",
      "10:15:01 IP 1.2.3.4.53 > victim.80: UDP, length 4096",
      "10:15:01 IP 5.6.7.8.53 > victim.80: UDP, length 3890",
      "10:15:01 IP 9.10.11.12.53 > victim.80: UDP, length 4096",
      "",
      "$ tcpdump -i eth0 src port 53 | wc -l",
      "2,847,000 packets in 60 seconds",
      "",
      "Note: Small DNS query (60 bytes) → Large response (4096 bytes)",
      "Amplification factor: ~68x",
    ],
    question: "What type of DDoS attack is this and why is it effective?",
    questionAr: "ما نوع هجوم DDoS هذا ولماذا هو فعال؟",
    options: ["DNS cache poisoning", "DNS amplification attack - small queries generate large responses (68x amplification)", "DNS tunneling", "DNS zone transfer attack"],
    optionsAr: ["تسميم ذاكرة DNS المؤقتة", "هجوم تضخيم DNS - استعلامات صغيرة تولد استجابات كبيرة (تضخيم 68x)", "نفق DNS", "هجوم نقل منطقة DNS"],
    correctIndex: 1,
    explanation: "DNS amplification uses open DNS resolvers as amplifiers. The attacker sends small queries (60 bytes) with a spoofed source IP (the victim's). The DNS server sends large responses (4096 bytes) to the victim. With 68x amplification, 1 Gbps of attacker bandwidth becomes 68 Gbps hitting the victim.",
    explanationAr: "تضخيم DNS يستخدم محللات DNS المفتوحة كمضخمات. المهاجم يرسل استعلامات صغيرة (60 بايت) مع IP مصدر مزيف (الضحية). خادم DNS يرسل استجابات كبيرة (4096 بايت) للضحية. مع تضخيم 68x.",
  },
  {
    id: 3,
    scenario: "You're investigating a session hijacking incident. A user reports that their banking session was taken over.",
    scenarioAr: "تحقق في حادثة اختطاف جلسة. مستخدم يبلغ أن جلسته المصرفية تم الاستيلاء عليها.",
    terminalOutput: [
      "=== Web Server Access Log ===",
      "10:00:01 User login: session_id=abc123 IP=10.0.1.5 (legitimate)",
      "10:05:00 GET /account  session_id=abc123 IP=10.0.1.5",
      "10:05:30 GET /account  session_id=abc123 IP=85.214.x.x (DIFFERENT IP!)",
      "10:06:00 POST /transfer session_id=abc123 IP=85.214.x.x",
      "         Amount: $50,000 → External account",
      "",
      "=== Cookie Analysis ===",
      "Set-Cookie: session_id=abc123; path=/",
      "Missing: Secure flag, HttpOnly flag, SameSite attribute",
    ],
    question: "What enabled this session hijacking attack?",
    questionAr: "ما الذي مكّن هجوم اختطاف الجلسة هذا؟",
    options: ["The session ID was too short", "Missing cookie security flags (Secure, HttpOnly, SameSite) allowed session token theft", "The server didn't use HTTPS", "The user's password was weak"],
    optionsAr: ["معرف الجلسة كان قصيراً جداً", "علامات أمان الكوكيز المفقودة (Secure، HttpOnly، SameSite) سمحت بسرقة رمز الجلسة", "الخادم لم يستخدم HTTPS", "كلمة مرور المستخدم كانت ضعيفة"],
    correctIndex: 1,
    explanation: "The session cookie lacks critical security flags: (1) Secure - ensures cookie only sent over HTTPS, (2) HttpOnly - prevents JavaScript access (XSS theft), (3) SameSite - prevents CSRF attacks. Without these, the session token can be stolen via XSS, network sniffing, or CSRF.",
    explanationAr: "كوكيز الجلسة تفتقر لعلامات أمان حرجة: (1) Secure - يضمن إرسال الكوكيز فقط عبر HTTPS، (2) HttpOnly - يمنع وصول JavaScript، (3) SameSite - يمنع هجمات CSRF.",
  },
  {
    id: 4,
    scenario: "Your security team detects a Slowloris attack targeting the Apache web server.",
    scenarioAr: "فريق الأمان يكتشف هجوم Slowloris يستهدف خادم Apache.",
    terminalOutput: [
      "$ netstat -an | grep :80 | grep ESTABLISHED | wc -l",
      "10,000 (max connections reached!)",
      "",
      "$ tcpdump -i eth0 port 80 -A | head -20",
      "GET / HTTP/1.1\\r\\n",
      "Host: target.com\\r\\n",
      "X-header-1: value\\r\\n",
      "... (headers sent one byte at a time, every 10 seconds)",
      "... (connection never completed, kept alive indefinitely)",
      "",
      "$ apache2ctl status",
      "Server uptime: 2 hours",
      "Total accesses: 45 (legitimate requests blocked!)",
      "Workers: 10000/10000 busy (100% utilized by attack)",
    ],
    question: "How does Slowloris differ from a traditional DDoS attack?",
    questionAr: "كيف يختلف Slowloris عن هجوم DDoS التقليدي؟",
    options: ["Slowloris uses more bandwidth", "Slowloris uses minimal bandwidth by keeping connections open with partial HTTP headers", "Slowloris only works on Linux servers", "Slowloris targets the database, not the web server"],
    optionsAr: ["Slowloris يستخدم نطاق ترددي أكبر", "Slowloris يستخدم نطاق ترددي ضئيل بإبقاء الاتصالات مفتوحة بترويسات HTTP جزئية", "Slowloris يعمل فقط على خوادم Linux", "Slowloris يستهدف قاعدة البيانات وليس خادم الويب"],
    correctIndex: 1,
    explanation: "Slowloris is a low-bandwidth DoS attack. It opens many connections and sends partial HTTP headers very slowly (one byte every 10 seconds), keeping connections alive indefinitely. This exhausts the server's connection pool with minimal attacker bandwidth. Mitigation: connection timeouts, reverse proxy (Nginx), rate limiting per IP.",
    explanationAr: "Slowloris هجوم حجب خدمة منخفض النطاق الترددي. يفتح اتصالات كثيرة ويرسل ترويسات HTTP جزئية ببطء شديد، مما يبقي الاتصالات حية إلى أجل غير مسمى. هذا يستنزف مجموعة اتصالات الخادم.",
  },
  {
    id: 5,
    scenario: "You need to recommend a comprehensive DDoS mitigation strategy for a critical e-commerce platform.",
    scenarioAr: "تحتاج لتوصية باستراتيجية شاملة للتخفيف من DDoS لمنصة تجارة إلكترونية حرجة.",
    terminalOutput: [
      "=== Current Infrastructure ===",
      "Single origin server: 1 Gbps bandwidth",
      "No CDN or DDoS protection",
      "No rate limiting configured",
      "No geographic restrictions",
      "",
      "=== Recent Attack History ===",
      "Attack 1: 50 Gbps volumetric (UDP flood)",
      "Attack 2: 2M requests/sec HTTP flood",
      "Attack 3: Slowloris (10K connections)",
      "Downtime: 12 hours total in past month",
    ],
    question: "What is the MOST effective first step for DDoS mitigation?",
    questionAr: "ما هي الخطوة الأولى الأكثر فعالية للتخفيف من DDoS؟",
    options: ["Increase server bandwidth to 100 Gbps", "Deploy a cloud-based DDoS mitigation service (e.g., Cloudflare, AWS Shield) that can absorb volumetric attacks", "Add more origin servers", "Block all international traffic"],
    optionsAr: ["زيادة نطاق ترددي الخادم إلى 100 Gbps", "نشر خدمة تخفيف DDoS سحابية (مثل Cloudflare، AWS Shield) يمكنها امتصاص الهجمات الحجمية", "إضافة المزيد من خوادم الأصل", "حظر جميع حركة المرور الدولية"],
    correctIndex: 1,
    explanation: "A cloud-based DDoS mitigation service is the most effective first step because: (1) It can absorb multi-Tbps volumetric attacks (far beyond any single server), (2) It filters malicious traffic before it reaches your origin, (3) It handles all three attack types (volumetric, protocol, application layer), (4) It provides always-on protection with global anycast networks.",
    explanationAr: "خدمة تخفيف DDoS السحابية هي الخطوة الأولى الأكثر فعالية لأنها: (1) يمكنها امتصاص هجمات حجمية بالتيرابت، (2) تصفي حركة المرور الخبيثة قبل وصولها لخادمك، (3) تتعامل مع جميع أنواع الهجمات الثلاثة.",
  },
];

export default function DosDdosLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Zap className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("DoS/DDoS & Session Hijacking Lab", "مختبر هجمات حجب الخدمة واختطاف الجلسات")}</h3>
          <p className="text-[#0C3C3C] font-['Work_Sans'] text-xs">{tx("Challenge", "تحدي")} {current + 1}/{CHALLENGES.length} - {tx("Score", "النتيجة")}: {score}/{CHALLENGES.length}</p>
        </div>
      </div>

      {completed ? (
        <div className="text-center py-8">
          <ShieldAlert className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#0C3C3C] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Lab Complete!", "اكتمل المختبر!")}</h4>
          <p className="text-[#0C3C3C] font-['Work_Sans'] mb-4">{tx(`You scored ${score}/${CHALLENGES.length}. DDoS defense expert!`, `حصلت على ${score}/${CHALLENGES.length}. خبير دفاع DDoS!`)}</p>
          <button onClick={reset} className="flex items-center gap-2 mx-auto px-6 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all"><RotateCcw className="w-4 h-4" /> {tx("Play Again", "ابدأ من جديد")}</button>
        </div>
      ) : (
        <>
          <div className="bg-white/50 border border-[#D4CBBA] p-3 mb-3">
            <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm">{tx(challenge.scenario, challenge.scenarioAr)}</p>
          </div>
          <div className="bg-[#0a0a0a] border border-[#333] p-3 mb-4 font-mono text-xs max-h-48 overflow-y-auto">
            {challenge.terminalOutput.map((line, i) => (
              <div key={i} className={line.startsWith("$") ? "text-green-400" : line.includes("SYN_RECV") || line.includes("DIFFERENT IP") || line.includes("attack") ? "text-red-400" : line.includes("===") ? "text-blue-300" : line.includes("Amplification") || line.includes("Missing") ? "text-yellow-400" : "text-gray-300"}>{line || "\u00A0"}</div>
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
