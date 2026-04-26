/*
  CEH Exam Preparation Lab
  Practice exam questions covering all CEH domains.
  Maps to CEH Day 14: Exam Preparation & Review
  Bilingual: English + Arabic
*/

import { useState, useCallback, useMemo } from "react";
import { GraduationCap, CheckCircle, XCircle, RotateCcw, ArrowRight, Trophy } from "lucide-react";
import { useLabLang } from "./labI18n";

type ExamQuestion = {
  id: number;
  domain: string;
  domainAr: string;
  question: string;
  questionAr: string;
  options: string[];
  optionsAr: string[];
  correctIndex: number;
  explanation: string;
  explanationAr: string;
};

const QUESTION_BANK: ExamQuestion[] = [
  { id: 1, domain: "Footprinting & Recon", domainAr: "البصمة والاستطلاع", question: "Which tool is used for passive DNS reconnaissance to find subdomains of a target?", questionAr: "أي أداة تُستخدم لاستطلاع DNS السلبي لإيجاد النطاقات الفرعية للهدف؟", options: ["Nmap", "Sublist3r / Amass", "Metasploit", "Burp Suite"], optionsAr: ["Nmap", "Sublist3r / Amass", "Metasploit", "Burp Suite"], correctIndex: 1, explanation: "Sublist3r and Amass are passive reconnaissance tools that enumerate subdomains using search engines, certificate transparency logs, and DNS databases without directly contacting the target.", explanationAr: "Sublist3r وAmass أدوات استطلاع سلبي تعدد النطاقات الفرعية باستخدام محركات البحث وسجلات شفافية الشهادات وقواعد بيانات DNS." },
  { id: 2, domain: "Scanning & Enumeration", domainAr: "المسح والتعداد", question: "What Nmap flag performs a SYN stealth scan?", questionAr: "أي علم Nmap يؤدي مسح SYN الخفي؟", options: ["-sT (TCP connect)", "-sS (SYN stealth)", "-sU (UDP scan)", "-sV (version detection)"], optionsAr: ["-sT (اتصال TCP)", "-sS (SYN الخفي)", "-sU (مسح UDP)", "-sV (كشف الإصدار)"], correctIndex: 1, explanation: "nmap -sS performs a SYN stealth scan (half-open scan). It sends SYN packets and analyzes responses without completing the TCP handshake, making it harder to detect in logs.", explanationAr: "nmap -sS يؤدي مسح SYN الخفي (مسح نصف مفتوح). يرسل حزم SYN ويحلل الاستجابات بدون إكمال مصافحة TCP." },
  { id: 3, domain: "System Hacking", domainAr: "اختراق الأنظمة", question: "What is the primary purpose of a 'pass-the-hash' attack?", questionAr: "ما هو الغرض الأساسي من هجوم 'تمرير التجزئة'؟", options: ["Crack the password hash to plaintext", "Authenticate using the NTLM hash directly without knowing the password", "Generate rainbow tables", "Encrypt network traffic"], optionsAr: ["كسر تجزئة كلمة المرور إلى نص واضح", "المصادقة باستخدام تجزئة NTLM مباشرة بدون معرفة كلمة المرور", "إنشاء جداول قوس قزح", "تشفير حركة المرور"], correctIndex: 1, explanation: "Pass-the-hash (PtH) uses the captured NTLM hash to authenticate to remote services without cracking it. Windows NTLM authentication accepts the hash directly, making this a powerful lateral movement technique.", explanationAr: "تمرير التجزئة (PtH) يستخدم تجزئة NTLM الملتقطة للمصادقة على الخدمات البعيدة بدون كسرها. مصادقة Windows NTLM تقبل التجزئة مباشرة." },
  { id: 4, domain: "Web Application Security", domainAr: "أمان تطبيقات الويب", question: "Which OWASP Top 10 vulnerability allows an attacker to execute code on the server by manipulating user input?", questionAr: "أي ثغرة من OWASP Top 10 تسمح للمهاجم بتنفيذ كود على الخادم عن طريق التلاعب بمدخلات المستخدم؟", options: ["Broken Access Control", "Injection (SQL, Command, LDAP)", "Security Misconfiguration", "Cryptographic Failures"], optionsAr: ["التحكم في الوصول المكسور", "الحقن (SQL، الأوامر، LDAP)", "سوء تكوين الأمان", "فشل التشفير"], correctIndex: 1, explanation: "Injection flaws (A03:2021) occur when untrusted data is sent to an interpreter as part of a command or query. This includes SQL injection, command injection, LDAP injection, and XPath injection.", explanationAr: "عيوب الحقن (A03:2021) تحدث عندما يتم إرسال بيانات غير موثوقة إلى مفسر كجزء من أمر أو استعلام. يشمل حقن SQL، حقن الأوامر، حقن LDAP." },
  { id: 5, domain: "Network Sniffing", domainAr: "التقاط الشبكة", question: "Which protocol is vulnerable to ARP spoofing attacks?", questionAr: "أي بروتوكول عرضة لهجمات انتحال ARP؟", options: ["HTTPS", "IPv4 (ARP has no authentication mechanism)", "SSH", "DNS over HTTPS"], optionsAr: ["HTTPS", "IPv4 (ARP ليس لديه آلية مصادقة)", "SSH", "DNS عبر HTTPS"], correctIndex: 1, explanation: "ARP (Address Resolution Protocol) has no built-in authentication. Any device can send unsolicited ARP replies claiming to be any IP address. This is fundamental to IPv4 networking and is mitigated by Dynamic ARP Inspection (DAI) on managed switches.", explanationAr: "ARP ليس لديه مصادقة مدمجة. أي جهاز يمكنه إرسال ردود ARP غير مطلوبة يدعي أنه أي عنوان IP. يتم التخفيف بواسطة فحص ARP الديناميكي (DAI)." },
  { id: 6, domain: "Social Engineering", domainAr: "الهندسة الاجتماعية", question: "In a spear phishing attack, what makes it different from regular phishing?", questionAr: "في هجوم التصيد الموجه، ما الذي يجعله مختلفاً عن التصيد العادي؟", options: ["It uses phone calls instead of email", "It targets specific individuals with personalized, researched content", "It only targets financial institutions", "It uses malware attachments"], optionsAr: ["يستخدم المكالمات الهاتفية بدلاً من البريد", "يستهدف أفراداً محددين بمحتوى مخصص ومبحوث", "يستهدف فقط المؤسسات المالية", "يستخدم مرفقات برامج خبيثة"], correctIndex: 1, explanation: "Spear phishing targets specific individuals using personalized information gathered through OSINT (social media, company websites, LinkedIn). This personalization dramatically increases the success rate compared to generic mass phishing.", explanationAr: "التصيد الموجه يستهدف أفراداً محددين باستخدام معلومات مخصصة مجمعة عبر OSINT. هذا التخصيص يزيد بشكل كبير معدل النجاح مقارنة بالتصيد الجماعي العام." },
  { id: 7, domain: "Cryptography", domainAr: "التشفير", question: "What is the key difference between encryption and hashing?", questionAr: "ما الفرق الرئيسي بين التشفير والتجزئة؟", options: ["Hashing is faster than encryption", "Encryption is reversible (with key); hashing is one-way (irreversible)", "Hashing produces longer output", "Encryption doesn't use keys"], optionsAr: ["التجزئة أسرع من التشفير", "التشفير قابل للعكس (بالمفتاح)؛ التجزئة أحادية الاتجاه (غير قابلة للعكس)", "التجزئة تنتج مخرجات أطول", "التشفير لا يستخدم مفاتيح"], correctIndex: 1, explanation: "Encryption is designed to be reversed with the correct key (confidentiality). Hashing is a one-way function that produces a fixed-size digest (integrity verification, password storage). You can decrypt ciphertext; you cannot 'unhash' a hash.", explanationAr: "التشفير مصمم ليكون قابلاً للعكس بالمفتاح الصحيح (السرية). التجزئة دالة أحادية الاتجاه تنتج ملخصاً بحجم ثابت (التحقق من النزاهة، تخزين كلمات المرور)." },
  { id: 8, domain: "Malware Analysis", domainAr: "تحليل البرامج الخبيثة", question: "What is the safest environment to analyze suspected malware?", questionAr: "ما هي البيئة الأكثر أماناً لتحليل البرامج الخبيثة المشتبه بها؟", options: ["A production server with antivirus", "An isolated sandbox/virtual machine with no network access", "A developer's workstation", "A cloud-based server"], optionsAr: ["خادم إنتاج مع مضاد فيروسات", "صندوق رمل/جهاز افتراضي معزول بدون وصول للشبكة", "محطة عمل مطور", "خادم سحابي"], correctIndex: 1, explanation: "Malware should be analyzed in an isolated sandbox (e.g., Cuckoo Sandbox, REMnux, FlareVM) with no network access to prevent it from spreading, communicating with C2 servers, or causing damage. Take snapshots before analysis to restore the clean state.", explanationAr: "يجب تحليل البرامج الخبيثة في صندوق رمل معزول بدون وصول للشبكة لمنعها من الانتشار أو التواصل مع خوادم C2 أو التسبب في ضرر." },
  { id: 9, domain: "Cloud Security", domainAr: "أمان السحابة", question: "In the shared responsibility model, who is responsible for patching the operating system on an EC2 instance?", questionAr: "في نموذج المسؤولية المشتركة، من المسؤول عن تصحيح نظام التشغيل على مثيل EC2؟", options: ["AWS (the cloud provider)", "The customer (you)", "Both equally", "Neither - it's automated"], optionsAr: ["AWS (مزود السحابة)", "العميل (أنت)", "كلاهما بالتساوي", "لا أحد - إنه مؤتمت"], correctIndex: 1, explanation: "In IaaS (EC2), the customer is responsible for: OS patching, application security, data encryption, and network configuration. AWS is responsible for: physical infrastructure, hypervisor, and the underlying hardware. This is 'security OF the cloud' (AWS) vs 'security IN the cloud' (customer).", explanationAr: "في IaaS (EC2)، العميل مسؤول عن: تصحيح نظام التشغيل، أمان التطبيقات، تشفير البيانات، وتكوين الشبكة. AWS مسؤول عن: البنية التحتية المادية والمشرف الافتراضي." },
  { id: 10, domain: "Incident Response", domainAr: "الاستجابة للحوادث", question: "According to NIST, what are the four phases of incident response in order?", questionAr: "وفقاً لـ NIST، ما هي المراحل الأربع للاستجابة للحوادث بالترتيب؟", options: ["Detect, Respond, Recover, Report", "Preparation, Detection & Analysis, Containment/Eradication/Recovery, Post-Incident Activity", "Identify, Protect, Detect, Respond", "Alert, Investigate, Remediate, Close"], optionsAr: ["الكشف، الاستجابة، الاسترداد، الإبلاغ", "التحضير، الكشف والتحليل، الاحتواء/الإزالة/الاسترداد، نشاط ما بعد الحادث", "التحديد، الحماية، الكشف، الاستجابة", "التنبيه، التحقيق، المعالجة، الإغلاق"], correctIndex: 1, explanation: "NIST SP 800-61 defines four phases: (1) Preparation - policies, tools, training, (2) Detection & Analysis - identify and confirm incidents, (3) Containment, Eradication & Recovery - stop, remove, and restore, (4) Post-Incident Activity - lessons learned and improvements.", explanationAr: "NIST SP 800-61 يحدد أربع مراحل: (1) التحضير، (2) الكشف والتحليل، (3) الاحتواء والإزالة والاسترداد، (4) نشاط ما بعد الحادث." },
];

export default function CEHExamPrepLab({ onComplete }: { onComplete?: (score?: number) => void }) {
  const { tx } = useLabLang();
  const questions = useMemo(() => [...QUESTION_BANK].sort(() => Math.random() - 0.5).slice(0, 10), []);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const q = questions[current];

  const handleSubmit = useCallback(() => { if (selected === null) return; setShowResult(true); if (selected === q.correctIndex) setScore(s => s + 1); }, [selected, q]);
  const handleNext = useCallback(() => { if (current < questions.length - 1) { setCurrent(c => c + 1); setSelected(null); setShowResult(false); } else { setCompleted(true); } }, [current, questions.length]);
  const reset = useCallback(() => { setCurrent(0); setSelected(null); setShowResult(false); setScore(0); setCompleted(false); }, []);

  const pct = completed ? Math.round((score / questions.length) * 100) : 0;

  return (
    <div className="bg-[#F5F0E8] border-2 border-[#227C82]/40 p-6 my-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><GraduationCap className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("CEH Exam Practice", "تدريب امتحان CEH")}</h3>
          <p className="text-[#0C3C3C] font-['Work_Sans'] text-xs">{tx("Question", "سؤال")} {current + 1}/{questions.length} - {tx("Score", "النتيجة")}: {score}/{questions.length}</p>
        </div>
      </div>

      {completed ? (
        <div className="text-center py-8">
          <Trophy className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#0C3C3C] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Exam Complete!", "اكتمل الامتحان!")}</h4>
          <div className={`text-4xl font-['Montserrat'] font-bold mb-2 ${pct >= 70 ? "text-[#D4AF37]" : "text-red-500"}`}>{pct}%</div>
          <p className="text-[#0C3C3C] font-['Work_Sans'] mb-2">{tx(`${score}/${questions.length} correct`, `${score}/${questions.length} صحيح`)}</p>
          <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm mb-4">
            {pct >= 70 ? tx("Passing score! You're ready for the CEH exam.", "درجة نجاح! أنت جاهز لامتحان CEH.") : tx("Below passing (70%). Review the topics and try again.", "أقل من النجاح (70%). راجع المواضيع وحاول مرة أخرى.")}
          </p>
          <button onClick={reset} className="flex items-center gap-2 mx-auto px-6 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all"><RotateCcw className="w-4 h-4" /> {tx("Try Again (New Questions)", "حاول مرة أخرى (أسئلة جديدة)")}</button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#164A4A] text-[#D4AF37] font-mono text-xs px-2 py-1">{tx(q.domain, q.domainAr)}</span>
          </div>
          <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm font-medium mb-4">{tx(q.question, q.questionAr)}</p>
          <div className="space-y-2 mb-4">
            {(tx(q.options.join("|"), q.optionsAr.join("|"))).split("|").map((opt, i) => (
              <button key={i} onClick={() => !showResult && setSelected(i)}
                className={`w-full text-start p-3 border font-['Work_Sans'] text-sm transition-all ${showResult ? i === q.correctIndex ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#0C3C3C]" : i === selected ? "border-red-500/50 bg-red-500/10 text-red-600" : "border-[#D4CBBA] text-[#0C3C3C]/50" : selected === i ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#0C3C3C]" : "border-[#D4CBBA] text-[#0C3C3C] hover:border-[#D4AF37]/50"}`}>{opt}</button>
            ))}
          </div>

          {!showResult ? (
            <button onClick={handleSubmit} disabled={selected === null} className="px-6 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all disabled:opacity-40">{tx("Submit Answer", "إرسال الإجابة")}</button>
          ) : (
            <div className="bg-[#164A4A]/10 border border-[#D4CBBA] p-4">
              <div className="flex items-center gap-2 mb-2">
                {selected === q.correctIndex ? <><CheckCircle className="w-5 h-5 text-[#D4AF37]" /><span className="text-[#D4AF37] font-['Montserrat'] font-bold text-sm">{tx("Correct!", "صحيح!")}</span></> : <><XCircle className="w-5 h-5 text-red-500" /><span className="text-red-500 font-['Montserrat'] font-bold text-sm">{tx("Incorrect", "غير صحيح")}</span></>}
              </div>
              <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm">{tx(q.explanation, q.explanationAr)}</p>
              <button onClick={handleNext} className="mt-3 flex items-center gap-2 px-5 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all">
                {current < questions.length - 1 ? tx("Next Question", "السؤال التالي") : tx("See Results", "عرض النتائج")} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Progress bar */}
          <div className="mt-4 bg-[#D4CBBA]/30 h-2 w-full">
            <div className="bg-[#D4AF37] h-2 transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
          </div>
        </>
      )}
    </div>
  );
}
