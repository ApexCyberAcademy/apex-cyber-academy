/*
  Web Application Hacking Lab
  Students identify and exploit web vulnerabilities: SQL injection, XSS, CSRF.
  Maps to CEH Day 9: Web Application Hacking & Security
  Bilingual: English + Arabic
*/

import { useState, useCallback, useRef, useEffect } from "react";
import { Globe, CheckCircle, XCircle, RotateCcw, ArrowRight, Code } from "lucide-react";
import { useLabLang } from "./labI18n";

type WebChallenge = {
  id: number;
  title: string;
  titleAr: string;
  scenario: string;
  scenarioAr: string;
  codeSnippet: string;
  hint: string;
  hintAr: string;
  acceptedInputs: string[];
  successOutput: string[];
  question: string;
  questionAr: string;
  options: string[];
  optionsAr: string[];
  correctIndex: number;
  explanation: string;
  explanationAr: string;
};

const CHALLENGES: WebChallenge[] = [
  {
    id: 1, title: "SQL Injection - Login Bypass", titleAr: "حقن SQL - تجاوز تسجيل الدخول",
    scenario: "You found a login form at https://target.com/login. The backend query is: SELECT * FROM users WHERE username='INPUT' AND password='INPUT'",
    scenarioAr: "وجدت نموذج تسجيل دخول على https://target.com/login. استعلام الخلفية هو: SELECT * FROM users WHERE username='INPUT' AND password='INPUT'",
    codeSnippet: "// Vulnerable PHP code:\n$query = \"SELECT * FROM users WHERE\n  username='\" . $_POST['user'] . \"'\n  AND password='\" . $_POST['pass'] . \"'\";",
    hint: "Try to make the WHERE clause always true",
    hintAr: "حاول جعل شرط WHERE صحيحاً دائماً",
    acceptedInputs: ["' or '1'='1", "' or 1=1--", "admin' --", "' or '1'='1' --", "' or ''='"],
    successOutput: ["HTTP/1.1 200 OK", "Set-Cookie: session=admin_token_xyz", "Welcome, Administrator!", "Dashboard loaded successfully."],
    question: "What is the BEST defense against this SQL injection?",
    questionAr: "ما هو أفضل دفاع ضد حقن SQL هذا؟",
    options: ["Input length validation", "Parameterized queries / Prepared statements", "Encoding special characters in output", "Using a web application firewall only"],
    optionsAr: ["التحقق من طول المدخلات", "الاستعلامات المعلمة / العبارات المُعدة", "ترميز الأحرف الخاصة في المخرجات", "استخدام جدار حماية تطبيقات الويب فقط"],
    correctIndex: 1,
    explanation: "Parameterized queries (prepared statements) separate SQL code from data, making injection impossible. The database treats user input as data, never as executable SQL. WAFs can be bypassed, and input validation alone is insufficient.",
    explanationAr: "الاستعلامات المعلمة (العبارات المُعدة) تفصل كود SQL عن البيانات، مما يجعل الحقن مستحيلاً. قاعدة البيانات تعامل مدخلات المستخدم كبيانات، وليس كـ SQL قابل للتنفيذ.",
  },
  {
    id: 2, title: "Reflected XSS Attack", titleAr: "هجوم XSS المنعكس",
    scenario: "A search page at https://target.com/search?q=INPUT reflects the search term directly in the HTML without sanitization.",
    scenarioAr: "صفحة بحث على https://target.com/search?q=INPUT تعكس مصطلح البحث مباشرة في HTML بدون تطهير.",
    codeSnippet: "<!-- Vulnerable HTML -->\n<h2>Search results for: <?= $_GET['q'] ?></h2>\n\n<!-- No output encoding! -->",
    hint: "Inject a script tag in the search parameter",
    hintAr: "أدخل وسم script في معامل البحث",
    acceptedInputs: ["<script>alert('xss')</script>", "<script>alert(1)</script>", "<img src=x onerror=alert(1)>", "<svg onload=alert(1)>"],
    successOutput: ["HTTP/1.1 200 OK", "<h2>Search results for: <script>alert('xss')</script></h2>", "⚠ JavaScript executed in victim's browser!", "Cookie stolen: session=admin_token_xyz"],
    question: "Which HTTP header helps prevent XSS attacks?",
    questionAr: "أي رأس HTTP يساعد في منع هجمات XSS؟",
    options: ["X-Frame-Options", "Content-Security-Policy (CSP)", "Cache-Control", "Accept-Encoding"],
    optionsAr: ["X-Frame-Options", "Content-Security-Policy (CSP)", "Cache-Control", "Accept-Encoding"],
    correctIndex: 1,
    explanation: "Content-Security-Policy (CSP) restricts which scripts can execute on a page. A strict CSP like 'script-src self' prevents inline scripts and scripts from unauthorized domains, effectively blocking most XSS attacks even if injection occurs.",
    explanationAr: "Content-Security-Policy (CSP) يقيد النصوص التي يمكن تنفيذها على الصفحة. CSP صارم مثل 'script-src self' يمنع النصوص المضمنة والنصوص من نطاقات غير مصرح بها.",
  },
  {
    id: 3, title: "IDOR - Insecure Direct Object Reference", titleAr: "IDOR - مرجع كائن مباشر غير آمن",
    scenario: "After logging in as user ID 1042, you notice the API endpoint: GET /api/users/1042/profile returns your profile. What happens if you change the ID?",
    scenarioAr: "بعد تسجيل الدخول كمستخدم ID 1042، لاحظت أن نقطة API: GET /api/users/1042/profile تعيد ملفك الشخصي. ماذا يحدث إذا غيرت المعرف؟",
    codeSnippet: "// Vulnerable API endpoint:\napp.get('/api/users/:id/profile', (req, res) => {\n  const user = db.getUser(req.params.id);\n  // No authorization check!\n  res.json(user);\n});",
    hint: "Change the user ID in the URL to access other profiles",
    hintAr: "غير معرف المستخدم في الرابط للوصول إلى ملفات شخصية أخرى",
    acceptedInputs: ["1", "1041", "1043", "0", "admin"],
    successOutput: ["GET /api/users/1/profile", "HTTP/1.1 200 OK", "{\"id\": 1, \"name\": \"Admin\", \"email\": \"admin@target.com\",", " \"role\": \"administrator\", \"ssn\": \"123-45-6789\"}"],
    question: "How should this IDOR vulnerability be fixed?",
    questionAr: "كيف يجب إصلاح ثغرة IDOR هذه؟",
    options: ["Encrypt the user IDs in the URL", "Add server-side authorization to verify the requesting user owns the resource", "Use POST instead of GET", "Add rate limiting to the API"],
    optionsAr: ["تشفير معرفات المستخدم في الرابط", "إضافة تفويض من جانب الخادم للتحقق من أن المستخدم الطالب يملك المورد", "استخدام POST بدلاً من GET", "إضافة تحديد معدل إلى API"],
    correctIndex: 1,
    explanation: "The fix is server-side authorization: verify that the authenticated user (from session/token) matches the requested resource owner. Encrypting IDs is security through obscurity (can be broken), and changing HTTP methods doesn't add security.",
    explanationAr: "الإصلاح هو التفويض من جانب الخادم: التحقق من أن المستخدم المصادق (من الجلسة/الرمز) يطابق مالك المورد المطلوب. تشفير المعرفات هو أمان بالغموض.",
  },
  {
    id: 4, title: "Command Injection", titleAr: "حقن الأوامر",
    scenario: "A web app has a 'Ping Tool' feature that pings an IP address. The input is passed directly to the system shell.",
    scenarioAr: "تطبيق ويب لديه ميزة 'أداة Ping' التي تقوم بعمل ping لعنوان IP. المدخلات تُمرر مباشرة إلى صدفة النظام.",
    codeSnippet: "// Vulnerable code:\nconst ip = req.body.ip;\nexec(`ping -c 4 ${ip}`, (err, stdout) => {\n  res.send(stdout);\n});",
    hint: "Chain commands using ; or && or |",
    hintAr: "اربط الأوامر باستخدام ; أو && أو |",
    acceptedInputs: ["127.0.0.1; cat /etc/passwd", "127.0.0.1 && whoami", "127.0.0.1 | id", "; ls -la /"],
    successOutput: ["PING 127.0.0.1: 64 bytes, time=0.034ms", "---", "root:x:0:0:root:/root:/bin/bash", "www-data:x:33:33:www-data:/var/www:/bin/sh", "mysql:x:27:27:MySQL Server:/var/lib/mysql:/bin/false"],
    question: "What is the MOST effective prevention for command injection?",
    questionAr: "ما هو المنع الأكثر فعالية لحقن الأوامر؟",
    options: ["Blacklist dangerous characters like ; and |", "Avoid calling system commands; use language-native libraries instead", "Run the application as root for better control", "Add input length limits"],
    optionsAr: ["حظر الأحرف الخطرة مثل ; و|", "تجنب استدعاء أوامر النظام؛ استخدم مكتبات اللغة الأصلية بدلاً من ذلك", "تشغيل التطبيق كـ root لتحكم أفضل", "إضافة حدود طول المدخلات"],
    correctIndex: 1,
    explanation: "The best defense is to avoid system commands entirely. Use language-native libraries (e.g., Node's net.ping module instead of exec('ping')). If system commands are unavoidable, use parameterized execution (execFile) and strict input validation with allowlists.",
    explanationAr: "أفضل دفاع هو تجنب أوامر النظام تماماً. استخدم مكتبات اللغة الأصلية. إذا كانت أوامر النظام لا مفر منها، استخدم التنفيذ المعلم (execFile) والتحقق الصارم من المدخلات.",
  },
  {
    id: 5, title: "CSRF - Cross-Site Request Forgery", titleAr: "CSRF - تزوير طلب عبر المواقع",
    scenario: "A banking app processes transfers via: POST /transfer with body {to: 'account', amount: 100}. The request only validates the session cookie.",
    scenarioAr: "تطبيق مصرفي يعالج التحويلات عبر: POST /transfer مع جسم {to: 'account', amount: 100}. الطلب يتحقق فقط من ملف تعريف الجلسة.",
    codeSnippet: "<!-- Attacker's malicious page -->\n<form action=\"https://bank.com/transfer\" method=\"POST\">\n  <input type=\"hidden\" name=\"to\" value=\"attacker_acct\">\n  <input type=\"hidden\" name=\"amount\" value=\"10000\">\n</form>\n<script>document.forms[0].submit();</script>",
    hint: "The form auto-submits when the victim visits the attacker's page",
    hintAr: "النموذج يُرسل تلقائياً عندما يزور الضحية صفحة المهاجم",
    acceptedInputs: ["csrf", "auto-submit form", "hidden form"],
    successOutput: ["Victim visits attacker's page while logged into bank", "Browser automatically includes bank session cookie", "POST /transfer {to: 'attacker_acct', amount: 10000}", "Transfer completed! $10,000 sent to attacker."],
    question: "Which defense mechanism prevents CSRF attacks?",
    questionAr: "أي آلية دفاع تمنع هجمات CSRF؟",
    options: ["Input validation", "Anti-CSRF tokens (unique per-session/per-request tokens)", "HTTPS encryption", "Content-Security-Policy"],
    optionsAr: ["التحقق من المدخلات", "رموز مضادة لـ CSRF (رموز فريدة لكل جلسة/طلب)", "تشفير HTTPS", "Content-Security-Policy"],
    correctIndex: 1,
    explanation: "Anti-CSRF tokens are unique, unpredictable values embedded in forms and validated server-side. Since the attacker's page cannot read the token (same-origin policy), they cannot include it in the forged request. SameSite cookies also help prevent CSRF.",
    explanationAr: "رموز مضادة لـ CSRF هي قيم فريدة وغير قابلة للتنبؤ مضمنة في النماذج ويتم التحقق منها من جانب الخادم. بما أن صفحة المهاجم لا يمكنها قراءة الرمز، لا يمكنها تضمينه في الطلب المزور.",
  },
];

export default function WebAppHackingLab({ onComplete }: { onComplete?: (score?: number) => void }) {
  const { tx } = useLabLang();
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<"inject" | "output" | "question" | "result" | "complete">("inject");
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const challenge = CHALLENGES[current];

  useEffect(() => { if (phase === "inject" && inputRef.current) inputRef.current.focus(); }, [phase, current]);

  const handleInject = useCallback(() => {
    const trimmed = input.trim().toLowerCase();
    const isAccepted = challenge.acceptedInputs.some(a => trimmed.includes(a.toLowerCase()) || a.toLowerCase().includes(trimmed));
    if (isAccepted) { setPhase("output"); setInput(""); }
    else { setInput(""); }
  }, [input, challenge]);

  const handleAnalyze = useCallback(() => setPhase("question"), []);
  const handleAnswer = useCallback(() => { if (selected === null) return; if (selected === challenge.correctIndex) setScore(s => s + 1); setPhase("result"); }, [selected, challenge]);
  const handleNext = useCallback(() => { if (current < CHALLENGES.length - 1) { setCurrent(c => c + 1); setInput(""); setSelected(null); setShowHint(false); setPhase("inject"); } else { setPhase("complete"); } }, [current]);
  const reset = useCallback(() => { setCurrent(0); setInput(""); setSelected(null); setScore(0); setPhase("inject"); setShowHint(false); }, []);

  return (
    <div className="bg-[#F5F0E8] border-2 border-[#227C82]/40 p-6 my-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Globe className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Web App Exploitation Lab", "مختبر استغلال تطبيقات الويب")}</h3>
          <p className="text-[#0C3C3C] font-['Work_Sans'] text-xs">{tx("Challenge", "تحدي")} {current + 1}/{CHALLENGES.length} - {tx("Score", "النتيجة")}: {score}/{CHALLENGES.length}</p>
        </div>
      </div>

      {phase === "complete" ? (
        <div className="text-center py-8">
          <Code className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#0C3C3C] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Lab Complete!", "اكتمل المختبر!")}</h4>
          <p className="text-[#0C3C3C] font-['Work_Sans'] mb-4">{tx(`You scored ${score}/${CHALLENGES.length}. Web app security expert!`, `حصلت على ${score}/${CHALLENGES.length}. خبير أمان تطبيقات الويب!`)}</p>
          <button onClick={reset} className="flex items-center gap-2 mx-auto px-6 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all"><RotateCcw className="w-4 h-4" /> {tx("Play Again", "ابدأ من جديد")}</button>
        </div>
      ) : (
        <>
          <div className="bg-white/50 border border-[#D4CBBA] p-3 mb-3">
            <h4 className="text-[#D4AF37] font-['Montserrat'] text-sm font-bold mb-1">{tx(challenge.title, challenge.titleAr)}</h4>
            <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm">{tx(challenge.scenario, challenge.scenarioAr)}</p>
          </div>

          <div className="bg-[#0a0a0a] border border-[#333] p-3 mb-4 font-mono text-xs">
            {challenge.codeSnippet.split("\n").map((line, i) => (
              <div key={i} className={line.startsWith("//") || line.startsWith("<!--") ? "text-gray-500" : line.includes("$_") || line.includes("req.") ? "text-red-400" : "text-green-300"}>{line}</div>
            ))}
          </div>

          {phase === "inject" && (
            <>
              <div className="flex gap-2 mb-3">
                <input ref={inputRef} type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && handleInject()}
                  className="flex-1 bg-[#0a0a0a] border border-[#333] text-green-300 font-mono text-xs p-2 outline-none" placeholder={tx("Enter your payload...", "أدخل حمولتك...")} spellCheck={false} />
                <button onClick={handleInject} className="px-4 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-xs hover:bg-[#B8962E] transition-all">{tx("Inject", "حقن")}</button>
              </div>
              <button onClick={() => setShowHint(!showHint)} className="text-[#D4AF37] font-['Work_Sans'] text-xs underline">
                {showHint ? tx("Hide Hint", "إخفاء التلميح") : tx("Show Hint", "إظهار التلميح")}
              </button>
              {showHint && <p className="text-[#0C3C3C] font-mono text-xs mt-1 bg-[#D4AF37]/10 p-2">{tx(challenge.hint, challenge.hintAr)}</p>}
            </>
          )}

          {phase === "output" && (
            <>
              <div className="bg-[#0a0a0a] border border-[#333] p-3 mb-3 font-mono text-xs">
                <div className="text-[#D4AF37] mb-1">{tx("SERVER RESPONSE:", "استجابة الخادم:")}</div>
                {challenge.successOutput.map((line, i) => (
                  <div key={i} className={line.includes("200") || line.includes("Welcome") || line.includes("completed") ? "text-green-400" : line.includes("⚠") ? "text-yellow-400" : "text-gray-300"}>{line}</div>
                ))}
              </div>
              <button onClick={handleAnalyze} className="px-6 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all">{tx("Analyze & Fix", "تحليل وإصلاح")} <ArrowRight className="w-4 h-4 inline ms-1" /></button>
            </>
          )}

          {(phase === "question" || phase === "result") && (
            <div className="mt-3">
              <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm font-medium mb-3">{tx(challenge.question, challenge.questionAr)}</p>
              <div className="space-y-2 mb-4">
                {(tx(challenge.options.join("|"), challenge.optionsAr.join("|"))).split("|").map((opt, i) => (
                  <button key={i} onClick={() => phase === "question" && setSelected(i)}
                    className={`w-full text-start p-3 border font-['Work_Sans'] text-sm transition-all ${phase === "result" ? i === challenge.correctIndex ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#0C3C3C]" : i === selected ? "border-red-500/50 bg-red-500/10 text-red-600" : "border-[#D4CBBA] text-[#0C3C3C]/50" : selected === i ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#0C3C3C]" : "border-[#D4CBBA] text-[#0C3C3C] hover:border-[#D4AF37]/50"}`}>{opt}</button>
                ))}
              </div>
              {phase === "question" && <button onClick={handleAnswer} disabled={selected === null} className="px-6 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all disabled:opacity-40">{tx("Submit", "إرسال")}</button>}
              {phase === "result" && (
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
            </div>
          )}
        </>
      )}
    </div>
  );
}
