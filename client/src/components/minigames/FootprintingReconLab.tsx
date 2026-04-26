/*
  Footprinting & Reconnaissance Lab
  Students perform OSINT reconnaissance by analyzing target information and identifying data sources.
  Maps to CEH Day 2: Footprinting & Reconnaissance Techniques
  Bilingual: English + Arabic
*/

import { useState, useCallback } from "react";
import { Search, CheckCircle, XCircle, RotateCcw, ArrowRight, Globe } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = {
  id: number;
  targetInfo: string;
  targetInfoAr: string;
  question: string;
  questionAr: string;
  options: string[];
  optionsAr: string[];
  correctIndex: number;
  explanation: string;
  explanationAr: string;
};

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    targetInfo: "Target: MegaCorp Inc.\nDomain: megacorp.com\nTask: You need to find the company's mail server and IP address ranges without sending any packets to their network.",
    targetInfoAr: "الهدف: شركة ميجاكورب\nالنطاق: megacorp.com\nالمهمة: تحتاج إلى إيجاد خادم البريد ونطاقات عناوين IP دون إرسال أي حزم إلى شبكتهم.",
    question: "Which passive reconnaissance tool would reveal MX records and IP ranges?",
    questionAr: "أي أداة استطلاع سلبي ستكشف سجلات MX ونطاقات IP؟",
    options: ["Nmap port scan", "DNS lookup (dig/nslookup)", "Metasploit exploit", "Wireshark capture"],
    optionsAr: ["مسح منافذ Nmap", "استعلام DNS (dig/nslookup)", "استغلال Metasploit", "التقاط Wireshark"],
    correctIndex: 1,
    explanation: "DNS lookups using dig or nslookup are passive reconnaissance. 'dig megacorp.com MX' reveals mail servers, and 'dig megacorp.com ANY' can reveal IP ranges. No packets are sent to the target's infrastructure.",
    explanationAr: "استعلامات DNS باستخدام dig أو nslookup هي استطلاع سلبي. 'dig megacorp.com MX' يكشف خوادم البريد، و'dig megacorp.com ANY' يمكن أن يكشف نطاقات IP. لا يتم إرسال حزم إلى بنية الهدف التحتية.",
  },
  {
    id: 2,
    targetInfo: "Target: A web application at https://shop.example.com\nTask: Discover the web technologies, frameworks, and server software used by the target.",
    targetInfoAr: "الهدف: تطبيق ويب على https://shop.example.com\nالمهمة: اكتشاف تقنيات الويب والأطر وبرامج الخادم المستخدمة من قبل الهدف.",
    question: "Which tool is best for fingerprinting web technologies without active scanning?",
    questionAr: "أي أداة هي الأفضل لبصمة تقنيات الويب دون مسح نشط؟",
    options: ["Wappalyzer / BuiltWith", "SQLMap", "Burp Suite Intruder", "Hydra"],
    optionsAr: ["Wappalyzer / BuiltWith", "SQLMap", "Burp Suite Intruder", "Hydra"],
    correctIndex: 0,
    explanation: "Wappalyzer and BuiltWith analyze HTTP headers, JavaScript libraries, and HTML patterns to identify web technologies passively. SQLMap tests for SQL injection, Burp Intruder fuzzes parameters, and Hydra brute-forces credentials.",
    explanationAr: "Wappalyzer وBuiltWith يحللان رؤوس HTTP ومكتبات JavaScript وأنماط HTML لتحديد تقنيات الويب بشكل سلبي.",
  },
  {
    id: 3,
    targetInfo: "Target: Company employees at TechStartup LLC\nTask: Gather employee names, job titles, and email patterns for a social engineering assessment.",
    targetInfoAr: "الهدف: موظفو شركة TechStartup LLC\nالمهمة: جمع أسماء الموظفين والمسميات الوظيفية وأنماط البريد الإلكتروني لتقييم الهندسة الاجتماعية.",
    question: "Which OSINT platform is most effective for gathering employee information?",
    questionAr: "أي منصة OSINT هي الأكثر فعالية لجمع معلومات الموظفين؟",
    options: ["Shodan", "LinkedIn + theHarvester", "Censys", "VirusTotal"],
    optionsAr: ["Shodan", "LinkedIn + theHarvester", "Censys", "VirusTotal"],
    correctIndex: 1,
    explanation: "LinkedIn provides employee names, titles, and organizational structure. theHarvester automates email harvesting from search engines and public sources. Shodan/Censys scan for internet-connected devices, not people.",
    explanationAr: "LinkedIn يوفر أسماء الموظفين والمسميات والهيكل التنظيمي. theHarvester يؤتمت جمع البريد الإلكتروني من محركات البحث والمصادر العامة.",
  },
  {
    id: 4,
    targetInfo: "Target: 192.168.1.0/24 network\nTask: You found a cached version of the target's old website that reveals internal server names and an admin portal URL.",
    targetInfoAr: "الهدف: شبكة 192.168.1.0/24\nالمهمة: وجدت نسخة مخبأة من موقع الهدف القديم تكشف أسماء الخوادم الداخلية وعنوان URL لبوابة المسؤول.",
    question: "Which service provides cached/archived versions of websites?",
    questionAr: "أي خدمة توفر نسخاً مخبأة/مؤرشفة من المواقع؟",
    options: ["Nmap NSE scripts", "Wayback Machine (web.archive.org)", "Nikto scanner", "OpenVAS"],
    optionsAr: ["نصوص Nmap NSE", "آلة الرجوع (web.archive.org)", "ماسح Nikto", "OpenVAS"],
    correctIndex: 1,
    explanation: "The Wayback Machine at web.archive.org stores historical snapshots of websites. Ethical hackers use it to find old pages, removed content, exposed directories, and configuration files that reveal valuable intelligence.",
    explanationAr: "آلة الرجوع في web.archive.org تخزن لقطات تاريخية للمواقع. يستخدمها المخترقون الأخلاقيون للعثور على صفحات قديمة ومحتوى محذوف وأدلة مكشوفة.",
  },
  {
    id: 5,
    targetInfo: "Target: A company's network infrastructure\nTask: Identify all subdomains associated with the target domain to map the attack surface.",
    targetInfoAr: "الهدف: البنية التحتية لشبكة شركة\nالمهمة: تحديد جميع النطاقات الفرعية المرتبطة بنطاق الهدف لرسم خريطة سطح الهجوم.",
    question: "Which technique is MOST effective for subdomain enumeration?",
    questionAr: "أي تقنية هي الأكثر فعالية لتعداد النطاقات الفرعية؟",
    options: ["ARP spoofing", "Certificate Transparency logs + Sublist3r", "Port scanning with Nmap", "Packet sniffing with tcpdump"],
    optionsAr: ["انتحال ARP", "سجلات شفافية الشهادات + Sublist3r", "مسح المنافذ بـ Nmap", "التقاط الحزم بـ tcpdump"],
    correctIndex: 1,
    explanation: "Certificate Transparency (CT) logs record all SSL/TLS certificates issued, revealing subdomains. Tools like Sublist3r, Amass, and crt.sh aggregate CT logs, DNS brute-forcing, and search engine results for comprehensive subdomain discovery.",
    explanationAr: "سجلات شفافية الشهادات تسجل جميع شهادات SSL/TLS الصادرة، مما يكشف النطاقات الفرعية. أدوات مثل Sublist3r وAmass وcrt.sh تجمع سجلات CT واستعلامات DNS ونتائج محركات البحث.",
  },
];

export default function FootprintingReconLab({ onComplete }: { onComplete?: (score?: number) => void }) {
  const { tx } = useLabLang();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const scenario = SCENARIOS[current];

  const handleSubmit = useCallback(() => {
    if (selected === null) return;
    setShowResult(true);
    if (selected === scenario.correctIndex) setScore(s => s + 1);
  }, [selected, scenario]);

  const handleNext = useCallback(() => {
    if (current < SCENARIOS.length - 1) {
      setCurrent(c => c + 1); setSelected(null); setShowResult(false);
    } else { setCompleted(true); }
  }, [current]);

  const reset = useCallback(() => {
    setCurrent(0); setSelected(null); setShowResult(false); setScore(0); setCompleted(false);
  }, []);

  return (
    <div className="bg-[#F5F0E8] border-2 border-[#227C82]/40 p-6 my-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Search className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("OSINT Reconnaissance Lab", "مختبر استطلاع OSINT")}</h3>
          <p className="text-[#0C3C3C] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} - {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>

      {completed ? (
        <div className="text-center py-8">
          <Globe className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#0C3C3C] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Recon Complete!", "اكتمل الاستطلاع!")}</h4>
          <p className="text-[#0C3C3C] font-['Work_Sans'] mb-4">{tx(`You scored ${score}/${SCENARIOS.length}. Excellent OSINT skills!`, `حصلت على ${score}/${SCENARIOS.length}. مهارات OSINT ممتازة!`)}</p>
          <button onClick={reset} className="flex items-center gap-2 mx-auto px-6 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all">
            <RotateCcw className="w-4 h-4" /> {tx("Play Again", "ابدأ من جديد")}
          </button>
        </div>
      ) : (
        <>
          <div className="bg-[#0C3C3C] border border-[#227C82]/50 p-4 mb-4 font-mono text-xs">
            <div className="text-[#D4AF37] mb-1">$ cat mission_brief.txt</div>
            {tx(scenario.targetInfo, scenario.targetInfoAr).split("\n").map((line, i) => (
              <div key={i} className="text-[#F5F0E8]/80">{line}</div>
            ))}
          </div>

          <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm font-medium mb-3">{tx(scenario.question, scenario.questionAr)}</p>
          <div className="space-y-2 mb-4">
            {(tx(scenario.options.join("|"), scenario.optionsAr.join("|"))).split("|").map((opt, i) => (
              <button key={i} onClick={() => !showResult && setSelected(i)}
                className={`w-full text-start p-3 border font-['Work_Sans'] text-sm transition-all ${
                  showResult
                    ? i === scenario.correctIndex ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#0C3C3C]" : i === selected ? "border-red-500/50 bg-red-500/10 text-red-600" : "border-[#D4CBBA] text-[#0C3C3C]/50"
                    : selected === i ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#0C3C3C]" : "border-[#D4CBBA] text-[#0C3C3C] hover:border-[#D4AF37]/50"
                }`}>
                {opt}
              </button>
            ))}
          </div>

          {!showResult ? (
            <button onClick={handleSubmit} disabled={selected === null} className="px-6 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all disabled:opacity-40">
              {tx("Submit", "إرسال")}
            </button>
          ) : (
            <div className="bg-[#164A4A]/10 border border-[#D4CBBA] p-4">
              <div className="flex items-center gap-2 mb-2">
                {selected === scenario.correctIndex ? <><CheckCircle className="w-5 h-5 text-[#D4AF37]" /><span className="text-[#D4AF37] font-['Montserrat'] font-bold text-sm">{tx("Correct!", "صحيح!")}</span></> : <><XCircle className="w-5 h-5 text-red-500" /><span className="text-red-500 font-['Montserrat'] font-bold text-sm">{tx("Incorrect", "غير صحيح")}</span></>}
              </div>
              <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm">{tx(scenario.explanation, scenario.explanationAr)}</p>
              <button onClick={handleNext} className="mt-3 flex items-center gap-2 px-5 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all">
                {current < SCENARIOS.length - 1 ? tx("Next Scenario", "السيناريو التالي") : tx("See Results", "عرض النتائج")} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
