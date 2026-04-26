/*
  Network Sniffing Lab
  Students analyze captured network packets and identify security issues.
  Maps to CEH Day 7: Network Sniffing & Traffic Analysis
  Bilingual: English + Arabic
*/

import { useState, useCallback } from "react";
import { Eye, CheckCircle, XCircle, RotateCcw, ArrowRight, Activity } from "lucide-react";
import { useLabLang } from "./labI18n";

type PacketChallenge = {
  id: number;
  capture: string[];
  question: string;
  questionAr: string;
  options: string[];
  optionsAr: string[];
  correctIndex: number;
  explanation: string;
  explanationAr: string;
};

const CHALLENGES: PacketChallenge[] = [
  {
    id: 1,
    capture: [
      "No. | Time     | Source        | Destination   | Protocol | Info",
      "1   | 0.000000 | 10.0.1.50    | 10.0.1.1      | ARP      | Who has 10.0.1.1? Tell 10.0.1.50",
      "2   | 0.000234 | 10.0.1.1     | 10.0.1.50     | ARP      | 10.0.1.1 is at AA:BB:CC:11:22:33",
      "3   | 0.001000 | 10.0.1.99    | 10.0.1.50     | ARP      | 10.0.1.1 is at DE:AD:BE:EF:00:01",
      "4   | 0.001500 | 10.0.1.99    | 10.0.1.50     | ARP      | 10.0.1.1 is at DE:AD:BE:EF:00:01",
      "5   | 0.002000 | 10.0.1.99    | 10.0.1.50     | ARP      | 10.0.1.1 is at DE:AD:BE:EF:00:01",
    ],
    question: "What attack is being performed by 10.0.1.99?",
    questionAr: "ما الهجوم الذي يقوم به 10.0.1.99؟",
    options: ["DNS spoofing", "ARP poisoning / ARP spoofing", "DHCP starvation", "MAC flooding"],
    optionsAr: ["انتحال DNS", "تسميم ARP / انتحال ARP", "إنهاك DHCP", "إغراق MAC"],
    correctIndex: 1,
    explanation: "10.0.1.99 is sending unsolicited ARP replies claiming that 10.0.1.1 (the gateway) is at its own MAC address (DE:AD:BE:EF:00:01). This is ARP poisoning, which redirects traffic through the attacker for man-in-the-middle interception.",
    explanationAr: "10.0.1.99 يرسل ردود ARP غير مطلوبة يدعي أن 10.0.1.1 (البوابة) على عنوان MAC الخاص به. هذا تسميم ARP، الذي يعيد توجيه حركة المرور عبر المهاجم لاعتراض الرجل في المنتصف.",
  },
  {
    id: 2,
    capture: [
      "No. | Time     | Source        | Destination   | Protocol | Info",
      "1   | 0.000000 | 10.0.1.50    | 93.184.216.34 | HTTP     | GET /login HTTP/1.1",
      "2   | 0.050000 | 10.0.1.50    | 93.184.216.34 | HTTP     | POST /auth",
      "     Content-Type: application/x-www-form-urlencoded",
      "     username=admin&password=P@ssw0rd123!",
      "3   | 0.100000 | 93.184.216.34| 10.0.1.50     | HTTP     | 200 OK Set-Cookie: session=abc123",
    ],
    question: "What critical security issue does this capture reveal?",
    questionAr: "ما المشكلة الأمنية الحرجة التي يكشفها هذا الالتقاط؟",
    options: ["The server is using an outdated HTTP version", "Credentials are transmitted in plaintext over HTTP (not HTTPS)", "The session cookie is too short", "The login page loads too slowly"],
    optionsAr: ["الخادم يستخدم إصدار HTTP قديم", "بيانات الاعتماد تُنقل بنص واضح عبر HTTP (ليس HTTPS)", "ملف تعريف الجلسة قصير جداً", "صفحة تسجيل الدخول تحمل ببطء"],
    correctIndex: 1,
    explanation: "The login form submits credentials (username=admin, password=P@ssw0rd123!) over unencrypted HTTP. Any network sniffer can capture these credentials in plaintext. This should always use HTTPS/TLS to encrypt the traffic.",
    explanationAr: "نموذج تسجيل الدخول يرسل بيانات الاعتماد عبر HTTP غير مشفر. أي متشمم شبكة يمكنه التقاط هذه البيانات بنص واضح. يجب استخدام HTTPS/TLS دائماً لتشفير حركة المرور.",
  },
  {
    id: 3,
    capture: [
      "No. | Time     | Source        | Destination   | Protocol | Info",
      "1   | 0.000000 | 10.0.1.99    | 10.0.1.1      | DNS      | Query: A bank.example.com",
      "2   | 0.000500 | 10.0.1.1     | 10.0.1.99     | DNS      | Response: 93.184.216.34",
      "3   | 0.001000 | 10.0.1.99    | 10.0.1.50     | DNS      | Response: 185.99.99.99",
      "     (Spoofed response for bank.example.com)",
      "4   | 0.001200 | 10.0.1.50    | 185.99.99.99  | HTTPS    | Client Hello (bank.example.com)",
    ],
    question: "What type of attack is being performed?",
    questionAr: "ما نوع الهجوم الذي يتم تنفيذه؟",
    options: ["ARP spoofing", "DNS spoofing / DNS cache poisoning", "SSL stripping", "ICMP redirect"],
    optionsAr: ["انتحال ARP", "انتحال DNS / تسميم ذاكرة DNS", "تجريد SSL", "إعادة توجيه ICMP"],
    correctIndex: 1,
    explanation: "10.0.1.99 is sending a spoofed DNS response (185.99.99.99) for bank.example.com before the legitimate DNS server can respond. The victim (10.0.1.50) connects to the attacker's server instead of the real bank. This is DNS spoofing.",
    explanationAr: "10.0.1.99 يرسل استجابة DNS مزورة (185.99.99.99) لـ bank.example.com قبل أن يتمكن خادم DNS الشرعي من الرد. الضحية يتصل بخادم المهاجم بدلاً من البنك الحقيقي.",
  },
  {
    id: 4,
    capture: [
      "No. | Time     | Source        | Destination   | Protocol | Info",
      "1   | 0.000000 | AA:11:22:33  | FF:FF:FF:FF   | ARP      | Who has 10.0.1.1?",
      "2   | 0.000100 | BB:22:33:44  | FF:FF:FF:FF   | ARP      | Who has 10.0.1.2?",
      "... (thousands of ARP requests from random MACs)",
      "8000| 2.500000 | ZZ:99:88:77  | FF:FF:FF:FF   | ARP      | Who has 10.0.1.254?",
      "CAM table overflow detected - switch entering hub mode",
    ],
    question: "What attack is flooding the switch with random MAC addresses?",
    questionAr: "ما الهجوم الذي يغمر المحول بعناوين MAC عشوائية؟",
    options: ["VLAN hopping", "MAC flooding / CAM table overflow", "Port scanning", "SYN flood"],
    optionsAr: ["قفز VLAN", "إغراق MAC / تجاوز جدول CAM", "مسح المنافذ", "إغراق SYN"],
    correctIndex: 1,
    explanation: "MAC flooding sends thousands of frames with random source MAC addresses to overflow the switch's CAM (Content Addressable Memory) table. When the table is full, the switch falls back to hub mode, broadcasting all traffic to all ports, allowing the attacker to sniff all network traffic.",
    explanationAr: "إغراق MAC يرسل آلاف الإطارات بعناوين MAC مصدر عشوائية لتجاوز جدول CAM في المحول. عندما يمتلئ الجدول، يعود المحول إلى وضع المحور، مما يبث كل حركة المرور لجميع المنافذ.",
  },
  {
    id: 5,
    capture: [
      "Wireshark Filter: tcp.flags.syn==1 && tcp.flags.ack==0",
      "",
      "No. | Time     | Source        | Destination   | Protocol | Dst Port",
      "1   | 0.000000 | 10.0.1.50    | 10.0.1.25     | TCP      | 80 [SYN]",
      "2   | 0.000100 | 10.0.1.25    | 10.0.1.50     | TCP      | 80 [SYN,ACK]",
      "3   | 0.000200 | 10.0.1.50    | 10.0.1.25     | TCP      | 443 [SYN]",
      "4   | 0.000250 | 10.0.1.25    | 10.0.1.50     | TCP      | 443 [SYN,ACK]",
      "5   | 0.000300 | 10.0.1.50    | 10.0.1.25     | TCP      | 22 [SYN]",
      "6   | 0.000350 | 10.0.1.25    | 10.0.1.50     | TCP      | 22 [SYN,ACK]",
      "7   | 0.000400 | 10.0.1.50    | 10.0.1.25     | TCP      | 3389 [SYN]",
      "8   | 0.000500 | 10.0.1.25    | 10.0.1.50     | TCP      | 3389 [RST,ACK]",
    ],
    question: "Analyzing the Wireshark capture, which port is CLOSED on the target?",
    questionAr: "بتحليل التقاط Wireshark، أي منفذ مغلق على الهدف؟",
    options: ["Port 80 (HTTP)", "Port 443 (HTTPS)", "Port 22 (SSH)", "Port 3389 (RDP)"],
    optionsAr: ["المنفذ 80 (HTTP)", "المنفذ 443 (HTTPS)", "المنفذ 22 (SSH)", "المنفذ 3389 (RDP)"],
    correctIndex: 3,
    explanation: "Port 3389 (RDP) responded with RST,ACK (reset), indicating it's closed. Ports 80, 443, and 22 responded with SYN,ACK (the second step of the TCP three-way handshake), confirming they're open and listening for connections.",
    explanationAr: "المنفذ 3389 (RDP) استجاب بـ RST,ACK (إعادة تعيين)، مما يشير إلى أنه مغلق. المنافذ 80 و443 و22 استجابت بـ SYN,ACK، مما يؤكد أنها مفتوحة وتستمع للاتصالات.",
  },
];

export default function NetworkSniffingLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Packet Analysis Lab", "مختبر تحليل الحزم")}</h3>
          <p className="text-[#0C3C3C] font-['Work_Sans'] text-xs">{tx("Capture", "التقاط")} {current + 1}/{CHALLENGES.length} - {tx("Score", "النتيجة")}: {score}/{CHALLENGES.length}</p>
        </div>
      </div>

      {completed ? (
        <div className="text-center py-8">
          <Activity className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#0C3C3C] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Analysis Complete!", "اكتمل التحليل!")}</h4>
          <p className="text-[#0C3C3C] font-['Work_Sans'] mb-4">{tx(`You scored ${score}/${CHALLENGES.length}. Excellent packet analysis skills!`, `حصلت على ${score}/${CHALLENGES.length}. مهارات تحليل حزم ممتازة!`)}</p>
          <button onClick={reset} className="flex items-center gap-2 mx-auto px-6 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all"><RotateCcw className="w-4 h-4" /> {tx("Play Again", "ابدأ من جديد")}</button>
        </div>
      ) : (
        <>
          <div className="bg-[#0a0a0a] border border-[#333] p-3 mb-4 font-mono text-xs max-h-52 overflow-y-auto">
            <div className="text-[#D4AF37] mb-1">Wireshark Capture:</div>
            {challenge.capture.map((line, i) => (
              <div key={i} className={line.includes("SYN,ACK") ? "text-green-300" : line.includes("RST") ? "text-red-400" : line.includes("spoofed") || line.includes("overflow") ? "text-yellow-400" : line.startsWith("No.") || line.startsWith("Wireshark") ? "text-blue-300" : "text-gray-300"}>{line || "\u00A0"}</div>
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
            <button onClick={handleSubmit} disabled={selected === null} className="px-6 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all disabled:opacity-40">{tx("Submit Analysis", "إرسال التحليل")}</button>
          ) : (
            <div className="bg-[#164A4A]/10 border border-[#D4CBBA] p-4">
              <div className="flex items-center gap-2 mb-2">
                {selected === challenge.correctIndex ? <><CheckCircle className="w-5 h-5 text-[#D4AF37]" /><span className="text-[#D4AF37] font-['Montserrat'] font-bold text-sm">{tx("Correct!", "صحيح!")}</span></> : <><XCircle className="w-5 h-5 text-red-500" /><span className="text-red-500 font-['Montserrat'] font-bold text-sm">{tx("Incorrect", "غير صحيح")}</span></>}
              </div>
              <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm">{tx(challenge.explanation, challenge.explanationAr)}</p>
              <button onClick={handleNext} className="mt-3 flex items-center gap-2 px-5 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all">
                {current < CHALLENGES.length - 1 ? tx("Next Capture", "الالتقاط التالي") : tx("See Results", "عرض النتائج")} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
