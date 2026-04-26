/*
  Nmap Port Scanner Simulator Lab
  Students type Nmap commands into a simulated terminal and analyze scan results.
  Maps to CEH Day 3: Scanning Networks & Enumeration
  Bilingual: English + Arabic
*/

import { useState, useCallback, useRef, useEffect } from "react";
import { Terminal, CheckCircle, RotateCcw, ArrowRight, Wifi } from "lucide-react";
import { useLabLang } from "./labI18n";

type ScanTask = {
  id: number;
  briefing: string;
  briefingAr: string;
  hint: string;
  hintAr: string;
  acceptedCommands: string[];
  output: string[];
  followUpQuestion: string;
  followUpQuestionAr: string;
  followUpOptions: string[];
  followUpOptionsAr: string[];
  correctFollowUp: number;
  explanation: string;
  explanationAr: string;
};

const TASKS: ScanTask[] = [
  {
    id: 1,
    briefing: "Your client wants to know which hosts are alive on the 10.0.1.0/24 subnet without triggering IDS alerts. Perform a stealthy host discovery scan.",
    briefingAr: "يريد عميلك معرفة الأجهزة النشطة على الشبكة الفرعية 10.0.1.0/24 دون إثارة تنبيهات IDS. قم بإجراء مسح اكتشاف خفي.",
    hint: "Use -sn for ping sweep (no port scan)",
    hintAr: "استخدم -sn لمسح ping (بدون مسح منافذ)",
    acceptedCommands: ["nmap -sn 10.0.1.0/24", "nmap -sn 10.0.1.*", "nmap -sP 10.0.1.0/24"],
    output: [
      "Starting Nmap 7.94 ( https://nmap.org )",
      "Nmap scan report for 10.0.1.1",
      "Host is up (0.0012s latency).",
      "MAC Address: 00:1A:2B:3C:4D:5E (Cisco Systems)",
      "Nmap scan report for 10.0.1.10",
      "Host is up (0.0034s latency).",
      "MAC Address: AA:BB:CC:DD:EE:01 (Dell)",
      "Nmap scan report for 10.0.1.25",
      "Host is up (0.0089s latency).",
      "MAC Address: AA:BB:CC:DD:EE:02 (VMware)",
      "Nmap scan report for 10.0.1.100",
      "Host is up (0.0056s latency).",
      "MAC Address: AA:BB:CC:DD:EE:03 (HP)",
      "Nmap done: 256 IP addresses (4 hosts up) scanned in 2.31 seconds",
    ],
    followUpQuestion: "Based on the scan results, which host is most likely the default gateway/router?",
    followUpQuestionAr: "بناءً على نتائج المسح، أي جهاز هو على الأرجح البوابة الافتراضية/الموجه؟",
    followUpOptions: ["10.0.1.10 (Dell)", "10.0.1.1 (Cisco Systems)", "10.0.1.25 (VMware)", "10.0.1.100 (HP)"],
    followUpOptionsAr: ["10.0.1.10 (Dell)", "10.0.1.1 (Cisco Systems)", "10.0.1.25 (VMware)", "10.0.1.100 (HP)"],
    correctFollowUp: 1,
    explanation: "10.0.1.1 with a Cisco MAC address is the default gateway. The .1 address is the conventional gateway IP, and Cisco is a major router/switch manufacturer. The lowest latency (0.0012s) also suggests it's the nearest network device.",
    explanationAr: "10.0.1.1 مع عنوان MAC من Cisco هو البوابة الافتراضية. العنوان .1 هو عنوان IP التقليدي للبوابة، وCisco هي شركة رائدة في تصنيع الموجهات والمحولات.",
  },
  {
    id: 2,
    briefing: "You identified a web server at 10.0.1.25. Perform a SYN stealth scan on the most common ports to identify running services.",
    briefingAr: "حددت خادم ويب على 10.0.1.25. قم بإجراء مسح SYN خفي على المنافذ الأكثر شيوعاً لتحديد الخدمات العاملة.",
    hint: "Use -sS for SYN stealth scan, -sV for version detection",
    hintAr: "استخدم -sS لمسح SYN الخفي، -sV لكشف الإصدار",
    acceptedCommands: ["nmap -sS 10.0.1.25", "nmap -sS -sV 10.0.1.25", "nmap -sS -sV -p- 10.0.1.25", "nmap -sS -sV -p 1-1000 10.0.1.25"],
    output: [
      "Starting Nmap 7.94 ( https://nmap.org )",
      "Nmap scan report for 10.0.1.25",
      "Host is up (0.0089s latency).",
      "",
      "PORT     STATE    SERVICE     VERSION",
      "22/tcp   open     ssh         OpenSSH 8.9p1",
      "80/tcp   open     http        Apache httpd 2.4.54",
      "443/tcp  open     ssl/http    Apache httpd 2.4.54",
      "3306/tcp open     mysql       MySQL 8.0.32",
      "8080/tcp filtered http-proxy",
      "8443/tcp closed   https-alt",
      "",
      "Service detection performed.",
      "Nmap done: 1 IP address (1 host up) scanned in 12.45 seconds",
    ],
    followUpQuestion: "Which finding represents the HIGHEST security risk on this server?",
    followUpQuestionAr: "أي اكتشاف يمثل أعلى خطر أمني على هذا الخادم؟",
    followUpOptions: [
      "Port 22 (SSH) is open",
      "Port 3306 (MySQL) is exposed to the network",
      "Port 8080 is filtered",
      "Port 8443 is closed",
    ],
    followUpOptionsAr: [
      "المنفذ 22 (SSH) مفتوح",
      "المنفذ 3306 (MySQL) مكشوف للشبكة",
      "المنفذ 8080 مُرشّح",
      "المنفذ 8443 مغلق",
    ],
    correctFollowUp: 1,
    explanation: "MySQL (port 3306) being exposed to the network is the highest risk. Database servers should never be directly accessible. An attacker could attempt brute-force attacks or exploit MySQL vulnerabilities. SSH is expected, filtered/closed ports are not risks.",
    explanationAr: "MySQL (المنفذ 3306) المكشوف للشبكة هو أعلى خطر. خوادم قواعد البيانات لا يجب أن تكون متاحة مباشرة. يمكن للمهاجم محاولة هجمات القوة الغاشمة أو استغلال ثغرات MySQL.",
  },
  {
    id: 3,
    briefing: "You need to detect the operating system of the target server at 10.0.1.100 for your penetration test report.",
    briefingAr: "تحتاج إلى كشف نظام التشغيل للخادم المستهدف على 10.0.1.100 لتقرير اختبار الاختراق.",
    hint: "Use -O for OS detection (requires root/sudo)",
    hintAr: "استخدم -O لكشف نظام التشغيل (يتطلب صلاحيات root/sudo)",
    acceptedCommands: ["nmap -O 10.0.1.100", "sudo nmap -O 10.0.1.100", "nmap -O -sV 10.0.1.100", "nmap -A 10.0.1.100"],
    output: [
      "Starting Nmap 7.94 ( https://nmap.org )",
      "Nmap scan report for 10.0.1.100",
      "Host is up (0.0056s latency).",
      "",
      "PORT     STATE SERVICE      VERSION",
      "135/tcp  open  msrpc        Microsoft Windows RPC",
      "139/tcp  open  netbios-ssn  Microsoft Windows netbios-ssn",
      "445/tcp  open  microsoft-ds Windows Server 2019 Standard",
      "3389/tcp open  ms-wbt-server Microsoft Terminal Services",
      "5985/tcp open  http         Microsoft HTTPAPI httpd 2.0",
      "",
      "OS details: Microsoft Windows Server 2019 (95% confidence)",
      "Network Distance: 1 hop",
      "Nmap done: 1 IP address (1 host up) scanned in 18.92 seconds",
    ],
    followUpQuestion: "Port 5985 (WinRM) is open. What attack technique does this enable?",
    followUpQuestionAr: "المنفذ 5985 (WinRM) مفتوح. ما تقنية الهجوم التي يمكّنها هذا؟",
    followUpOptions: [
      "SQL injection attacks",
      "Remote PowerShell execution with stolen credentials",
      "DNS zone transfer",
      "ARP cache poisoning",
    ],
    followUpOptionsAr: [
      "هجمات حقن SQL",
      "تنفيذ PowerShell عن بُعد باستخدام بيانات اعتماد مسروقة",
      "نقل منطقة DNS",
      "تسميم ذاكرة ARP",
    ],
    correctFollowUp: 1,
    explanation: "WinRM (Windows Remote Management) on port 5985 allows remote PowerShell execution. If an attacker obtains valid credentials (via phishing, pass-the-hash, or credential stuffing), they can execute commands remotely on the server.",
    explanationAr: "WinRM (إدارة Windows عن بُعد) على المنفذ 5985 يسمح بتنفيذ PowerShell عن بُعد. إذا حصل المهاجم على بيانات اعتماد صالحة، يمكنه تنفيذ أوامر عن بُعد على الخادم.",
  },
  {
    id: 4,
    briefing: "Scan the target 10.0.1.10 using an aggressive scan to gather maximum information including OS, services, scripts, and traceroute.",
    briefingAr: "امسح الهدف 10.0.1.10 باستخدام مسح عدواني لجمع أقصى قدر من المعلومات بما في ذلك نظام التشغيل والخدمات والنصوص وتتبع المسار.",
    hint: "Use -A for aggressive scan (OS + version + scripts + traceroute)",
    hintAr: "استخدم -A للمسح العدواني (نظام التشغيل + الإصدار + النصوص + تتبع المسار)",
    acceptedCommands: ["nmap -A 10.0.1.10", "nmap -A -T4 10.0.1.10", "nmap -sS -sV -O -A 10.0.1.10"],
    output: [
      "Starting Nmap 7.94 ( https://nmap.org )",
      "Nmap scan report for 10.0.1.10",
      "Host is up (0.0034s latency).",
      "",
      "PORT    STATE SERVICE  VERSION",
      "21/tcp  open  ftp      vsftpd 2.3.4",
      "| ftp-anon: Anonymous FTP login allowed",
      "|_drwxr-xr-x  2 0 0  4096 Jan 15 backup",
      "22/tcp  open  ssh      OpenSSH 7.2p2",
      "80/tcp  open  http     nginx 1.18.0",
      "| http-title: Company Intranet",
      "|_http-server-header: nginx/1.18.0",
      "",
      "OS details: Linux 4.15 - 5.8 (96% confidence)",
      "TRACEROUTE: 1 hop (0.003s latency): 10.0.1.1",
      "Nmap done: 1 IP address (1 host up) scanned in 24.67 seconds",
    ],
    followUpQuestion: "The scan reveals a critical vulnerability. Which finding is most dangerous?",
    followUpQuestionAr: "يكشف المسح عن ثغرة حرجة. أي اكتشاف هو الأكثر خطورة؟",
    followUpOptions: [
      "nginx 1.18.0 is running",
      "vsftpd 2.3.4 with anonymous FTP login and a backup directory",
      "SSH is using OpenSSH 7.2p2",
      "The OS is Linux 4.15-5.8",
    ],
    followUpOptionsAr: [
      "nginx 1.18.0 يعمل",
      "vsftpd 2.3.4 مع تسجيل دخول FTP مجهول ودليل نسخ احتياطي",
      "SSH يستخدم OpenSSH 7.2p2",
      "نظام التشغيل هو Linux 4.15-5.8",
    ],
    correctFollowUp: 1,
    explanation: "vsftpd 2.3.4 is infamous for a backdoor vulnerability (CVE-2011-2523). Combined with anonymous FTP access and a 'backup' directory, this is extremely dangerous. An attacker could download sensitive backup files and potentially exploit the backdoor for remote code execution.",
    explanationAr: "vsftpd 2.3.4 مشهور بثغرة الباب الخلفي (CVE-2011-2523). مع الوصول المجهول لـ FTP ودليل 'backup'، هذا خطير للغاية. يمكن للمهاجم تنزيل ملفات النسخ الاحتياطي الحساسة واستغلال الباب الخلفي.",
  },
  {
    id: 5,
    briefing: "You need to scan a target while evading firewall detection. Use fragmented packets and decoy IP addresses to mask your scan.",
    briefingAr: "تحتاج إلى مسح هدف مع التهرب من كشف جدار الحماية. استخدم حزماً مجزأة وعناوين IP وهمية لإخفاء مسحك.",
    hint: "Use -f for fragmentation and -D for decoys",
    hintAr: "استخدم -f للتجزئة و-D للعناوين الوهمية",
    acceptedCommands: ["nmap -f -D RND:5 10.0.1.25", "nmap -sS -f -D RND:5 10.0.1.25", "nmap -f -D decoy1,decoy2,ME 10.0.1.25", "nmap -f 10.0.1.25"],
    output: [
      "Starting Nmap 7.94 ( https://nmap.org )",
      "WARNING: Packet fragmentation enabled (-f)",
      "Decoys: 192.168.5.12, 10.10.10.5, 172.16.0.99, 10.0.1.50, 192.168.1.200, ME",
      "",
      "Nmap scan report for 10.0.1.25",
      "Host is up (0.015s latency).",
      "",
      "PORT    STATE    SERVICE",
      "22/tcp  open     ssh",
      "80/tcp  open     http",
      "443/tcp open     https",
      "3306/tcp filtered mysql",
      "",
      "Note: MySQL port now shows as filtered (firewall detected fragments)",
      "Nmap done: 1 IP address (1 host up) scanned in 8.34 seconds",
    ],
    followUpQuestion: "MySQL changed from 'open' to 'filtered'. What does this indicate?",
    followUpQuestionAr: "تغير MySQL من 'مفتوح' إلى 'مُرشّح'. ماذا يشير هذا؟",
    followUpOptions: [
      "MySQL service crashed",
      "A firewall or IPS is blocking fragmented packets to port 3306",
      "The decoy IPs are interfering with the scan",
      "MySQL only accepts local connections now",
    ],
    followUpOptionsAr: [
      "خدمة MySQL تعطلت",
      "جدار حماية أو IPS يحجب الحزم المجزأة إلى المنفذ 3306",
      "عناوين IP الوهمية تتداخل مع المسح",
      "MySQL يقبل الاتصالات المحلية فقط الآن",
    ],
    correctFollowUp: 1,
    explanation: "The 'filtered' state means a firewall, IDS, or IPS is actively blocking packets to that port. The firewall detected the fragmented scan attempt and blocked access to MySQL (3306), while allowing standard web ports. This is a common defensive response.",
    explanationAr: "حالة 'مُرشّح' تعني أن جدار حماية أو IDS أو IPS يحجب الحزم بنشاط إلى ذلك المنفذ. كشف جدار الحماية محاولة المسح المجزأ وحجب الوصول إلى MySQL (3306).",
  },
];

export default function NmapScannerLab({ onComplete }: { onComplete?: (score?: number) => void }) {
  const { tx } = useLabLang();
  const [currentTask, setCurrentTask] = useState(0);
  const [commandInput, setCommandInput] = useState("");
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [phase, setPhase] = useState<"command" | "output" | "question" | "result" | "complete">("command");
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const task = TASKS[currentTask];

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  useEffect(() => {
    if (phase === "command" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [phase, currentTask]);

  const handleCommand = useCallback(() => {
    const cmd = commandInput.trim().toLowerCase();
    if (!cmd) return;

    const isAccepted = task.acceptedCommands.some(ac => {
      const acLower = ac.toLowerCase();
      // Check if the core flags match
      if (cmd === acLower) return true;
      // Flexible matching: check if key flags are present
      if (cmd.startsWith("nmap") && acLower.startsWith("nmap")) {
        const cmdParts = cmd.split(/\s+/);
        const acParts = acLower.split(/\s+/);
        // Must have the target IP
        const hasTarget = cmdParts.some(p => acParts.includes(p) && p.includes("10.0."));
        const hasMainFlag = acParts.slice(1, -1).some(flag => cmdParts.includes(flag));
        return hasTarget && hasMainFlag;
      }
      return false;
    });

    if (isAccepted) {
      setTerminalLines(prev => [...prev, `root@kali:~# ${commandInput}`, ...task.output]);
      setPhase("output");
      setCommandInput("");
    } else {
      setTerminalLines(prev => [
        ...prev,
        `root@kali:~# ${commandInput}`,
        "Error: Invalid or incomplete command. Check your syntax and flags.",
        `Hint: ${tx(task.hint, task.hintAr)}`,
      ]);
      setCommandInput("");
    }
  }, [commandInput, task, tx]);

  const handleAnalyze = useCallback(() => {
    setPhase("question");
  }, []);

  const handleAnswer = useCallback(() => {
    if (selected === null) return;
    if (selected === task.correctFollowUp) setScore(s => s + 1);
    setPhase("result");
  }, [selected, task]);

  const handleNext = useCallback(() => {
    if (currentTask < TASKS.length - 1) {
      setCurrentTask(c => c + 1);
      setTerminalLines([]);
      setSelected(null);
      setShowHint(false);
      setPhase("command");
      setCommandInput("");
    } else {
      setPhase("complete");
    }
  }, [currentTask]);

  const reset = useCallback(() => {
    setCurrentTask(0); setTerminalLines([]); setSelected(null); setScore(0);
    setPhase("command"); setCommandInput(""); setShowHint(false);
  }, []);

  return (
    <div className="bg-[#F5F0E8] border-2 border-[#227C82]/40 p-6 my-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Terminal className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Nmap Port Scanner Simulator", "محاكي ماسح المنافذ Nmap")}</h3>
          <p className="text-[#0C3C3C] font-['Work_Sans'] text-xs">{tx("Mission", "مهمة")} {currentTask + 1}/{TASKS.length} - {tx("Score", "النتيجة")}: {score}/{TASKS.length}</p>
        </div>
      </div>

      {phase === "complete" ? (
        <div className="text-center py-8">
          <Wifi className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#0C3C3C] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Scan Complete!", "اكتمل المسح!")}</h4>
          <p className="text-[#0C3C3C] font-['Work_Sans'] mb-4">{tx(`You scored ${score}/${TASKS.length}. Expert-level network scanning skills!`, `حصلت على ${score}/${TASKS.length}. مهارات مسح شبكات على مستوى الخبراء!`)}</p>
          <button onClick={reset} className="flex items-center gap-2 mx-auto px-6 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all">
            <RotateCcw className="w-4 h-4" /> {tx("Play Again", "ابدأ من جديد")}
          </button>
        </div>
      ) : (
        <>
          {/* Mission Briefing */}
          <div className="bg-white/50 border border-[#D4CBBA] p-3 mb-4">
            <div className="flex items-center gap-2 mb-1">
              <Wifi className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[#D4AF37] font-['Montserrat'] text-xs font-bold uppercase">{tx("Mission Briefing", "إحاطة المهمة")}</span>
            </div>
            <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm">{tx(task.briefing, task.briefingAr)}</p>
          </div>

          {/* Terminal */}
          <div className="bg-[#0a0a0a] border border-[#333] rounded-sm mb-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#1a1a1a] border-b border-[#333]">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="text-[#888] text-xs font-mono ms-2">root@kali ~ nmap</span>
            </div>
            <div ref={terminalRef} className="p-3 max-h-64 overflow-y-auto font-mono text-xs leading-relaxed">
              {terminalLines.map((line, i) => (
                <div key={i} className={line.startsWith("root@") ? "text-green-400" : line.startsWith("Error") || line.startsWith("Hint") ? "text-yellow-400" : line.includes("open") ? "text-green-300" : line.includes("filtered") ? "text-orange-400" : line.includes("closed") ? "text-red-400" : "text-gray-300"}>
                  {line || "\u00A0"}
                </div>
              ))}
              {phase === "command" && (
                <div className="flex items-center text-green-400">
                  <span>root@kali:~#&nbsp;</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={commandInput}
                    onChange={e => setCommandInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleCommand()}
                    className="flex-1 bg-transparent outline-none text-green-300 font-mono text-xs caret-green-400"
                    placeholder={tx("Type your nmap command...", "اكتب أمر nmap...")}
                    spellCheck={false}
                    autoComplete="off"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Hint toggle */}
          {phase === "command" && (
            <div className="mb-4">
              <button onClick={() => setShowHint(!showHint)} className="text-[#D4AF37] font-['Work_Sans'] text-xs underline">
                {showHint ? tx("Hide Hint", "إخفاء التلميح") : tx("Show Hint", "إظهار التلميح")}
              </button>
              {showHint && <p className="text-[#0C3C3C] font-mono text-xs mt-1 bg-[#D4AF37]/10 p-2">{tx(task.hint, task.hintAr)}</p>}
            </div>
          )}

          {/* Analyze button after output */}
          {phase === "output" && (
            <button onClick={handleAnalyze} className="px-6 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all">
              {tx("Analyze Results", "تحليل النتائج")} <ArrowRight className="w-4 h-4 inline ms-1" />
            </button>
          )}

          {/* Follow-up question */}
          {(phase === "question" || phase === "result") && (
            <div className="mt-4">
              <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm font-medium mb-3">{tx(task.followUpQuestion, task.followUpQuestionAr)}</p>
              <div className="space-y-2 mb-4">
                {(tx(task.followUpOptions.join("|"), task.followUpOptionsAr.join("|"))).split("|").map((opt, i) => (
                  <button key={i} onClick={() => phase === "question" && setSelected(i)}
                    className={`w-full text-start p-3 border font-['Work_Sans'] text-sm transition-all ${
                      phase === "result"
                        ? i === task.correctFollowUp ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#0C3C3C]" : i === selected ? "border-red-500/50 bg-red-500/10 text-red-600" : "border-[#D4CBBA] text-[#0C3C3C]/50"
                        : selected === i ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#0C3C3C]" : "border-[#D4CBBA] text-[#0C3C3C] hover:border-[#D4AF37]/50"
                    }`}>
                    {opt}
                  </button>
                ))}
              </div>

              {phase === "question" && (
                <button onClick={handleAnswer} disabled={selected === null} className="px-6 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all disabled:opacity-40">
                  {tx("Submit Analysis", "إرسال التحليل")}
                </button>
              )}

              {phase === "result" && (
                <div className="bg-[#164A4A]/10 border border-[#D4CBBA] p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {selected === task.correctFollowUp ? <><CheckCircle className="w-5 h-5 text-[#D4AF37]" /><span className="text-[#D4AF37] font-['Montserrat'] font-bold text-sm">{tx("Correct!", "صحيح!")}</span></> : <><span className="text-red-500 font-['Montserrat'] font-bold text-sm">{tx("Incorrect", "غير صحيح")}</span></>}
                  </div>
                  <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm">{tx(task.explanation, task.explanationAr)}</p>
                  <button onClick={handleNext} className="mt-3 flex items-center gap-2 px-5 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all">
                    {currentTask < TASKS.length - 1 ? tx("Next Mission", "المهمة التالية") : tx("See Results", "عرض النتائج")} <ArrowRight className="w-4 h-4" />
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
