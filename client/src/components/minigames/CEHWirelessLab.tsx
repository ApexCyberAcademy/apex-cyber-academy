/*
  CEH Wireless Hacking Lab
  Students use aircrack-ng tools to audit wireless networks.
  Maps to CEH Day 10: Wireless Network Hacking
  Bilingual: English + Arabic
*/

import { useState, useCallback } from "react";
import { Wifi, CheckCircle, XCircle, RotateCcw, ArrowRight, Radio } from "lucide-react";
import { useLabLang } from "./labI18n";

type WirelessChallenge = {
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

const CHALLENGES: WirelessChallenge[] = [
  {
    id: 1,
    scenario: "You're conducting a wireless penetration test. You run airodump-ng to scan for nearby access points.",
    scenarioAr: "تجري اختبار اختراق لاسلكي. تشغل airodump-ng لمسح نقاط الوصول القريبة.",
    terminalOutput: [
      "$ airodump-ng wlan0mon",
      "CH 6 ][ Elapsed: 30s",
      "",
      "BSSID              PWR  CH  ENC   CIPHER AUTH  ESSID",
      "AA:BB:CC:11:22:33  -45   6  WPA2  CCMP   PSK  CorpNetwork",
      "DD:EE:FF:44:55:66  -62   1  WEP   WEP    OPN  GuestWiFi",
      "11:22:33:44:55:66  -70  11  WPA2  CCMP   MGT  SecureNet",
      "77:88:99:AA:BB:CC  -80   6  OPN   ---    ---  FreeWiFi",
    ],
    question: "Which network is the EASIEST target for a penetration tester?",
    questionAr: "أي شبكة هي الهدف الأسهل لمختبر الاختراق؟",
    options: ["CorpNetwork (WPA2-PSK)", "GuestWiFi (WEP)", "SecureNet (WPA2-Enterprise)", "FreeWiFi (Open)"],
    optionsAr: ["CorpNetwork (WPA2-PSK)", "GuestWiFi (WEP)", "SecureNet (WPA2-Enterprise)", "FreeWiFi (مفتوح)"],
    correctIndex: 1,
    explanation: "WEP (Wired Equivalent Privacy) is critically broken and can be cracked in minutes using aircrack-ng with enough captured IVs. While FreeWiFi is open (no encryption), WEP provides a false sense of security. WEP should be immediately replaced with WPA2/WPA3.",
    explanationAr: "WEP مكسور بشكل حرج ويمكن كسره في دقائق باستخدام aircrack-ng مع عدد كافٍ من IVs الملتقطة. بينما FreeWiFi مفتوح، WEP يعطي إحساساً زائفاً بالأمان.",
  },
  {
    id: 2,
    scenario: "You capture a WPA2 4-way handshake and attempt to crack the pre-shared key using a dictionary attack.",
    scenarioAr: "التقطت مصافحة WPA2 رباعية الاتجاه وتحاول كسر المفتاح المشترك مسبقاً باستخدام هجوم القاموس.",
    terminalOutput: [
      "$ airodump-ng -c 6 --bssid AA:BB:CC:11:22:33 -w capture wlan0mon",
      "WPA handshake: AA:BB:CC:11:22:33",
      "",
      "$ aircrack-ng -w /usr/share/wordlists/rockyou.txt capture-01.cap",
      "Aircrack-ng 1.7",
      "                [00:02:34] 847293/14344392 keys tested (5621 k/s)",
      "",
      "                KEY FOUND! [ Summer2024! ]",
      "",
      "Master Key: A1 B2 C3 D4 E5 F6 78 9A BC DE F0 12 34 56 78 9A",
    ],
    question: "The password 'Summer2024!' was cracked in 2 minutes. What is the root cause?",
    questionAr: "تم كسر كلمة المرور 'Summer2024!' في دقيقتين. ما السبب الجذري؟",
    options: ["WPA2 encryption algorithm is broken", "The pre-shared key exists in the rockyou.txt wordlist (weak password)", "The handshake was captured incorrectly", "aircrack-ng exploited a WPA2 vulnerability"],
    optionsAr: ["خوارزمية تشفير WPA2 مكسورة", "المفتاح المشترك مسبقاً موجود في قائمة rockyou.txt (كلمة مرور ضعيفة)", "تم التقاط المصافحة بشكل غير صحيح", "aircrack-ng استغل ثغرة WPA2"],
    correctIndex: 1,
    explanation: "WPA2 encryption itself is strong. The vulnerability is the weak password 'Summer2024!' which exists in the rockyou.txt wordlist. Dictionary attacks only succeed against weak passwords. A strong, random passphrase (20+ characters) would make this attack infeasible.",
    explanationAr: "تشفير WPA2 نفسه قوي. الثغرة هي كلمة المرور الضعيفة 'Summer2024!' الموجودة في قائمة rockyou.txt. هجمات القاموس تنجح فقط ضد كلمات المرور الضعيفة.",
  },
  {
    id: 3,
    scenario: "You set up an evil twin access point to test employee security awareness during the penetration test.",
    scenarioAr: "أعددت نقطة وصول توأم شرير لاختبار وعي الموظفين الأمني أثناء اختبار الاختراق.",
    terminalOutput: [
      "$ hostapd rogue_ap.conf",
      "wlan1: AP-ENABLED SSID='CorpNetwork'",
      "",
      "$ aireplay-ng -0 5 -a AA:BB:CC:11:22:33 wlan0mon",
      "Sending 64 directed DeAuth (code 7). STMAC: [ALL]",
      "",
      "$ tail -f /var/log/rogue_ap.log",
      "Client connected: 00:11:22:33:44:55 (iPhone-Sarah)",
      "Client connected: 66:77:88:99:AA:BB (MacBook-Ahmed)",
      "DHCP: Assigned 192.168.1.100 to iPhone-Sarah",
      "DNS: Intercepted query for mail.corp.com",
      "HTTP: Captured POST /login credentials",
    ],
    question: "What TWO attacks are being combined here?",
    questionAr: "ما الهجومان اللذان يتم دمجهما هنا؟",
    options: ["ARP spoofing + DNS poisoning", "Evil Twin + Deauthentication flood", "KRACK + Fragmentation attack", "Bluetooth sniffing + War driving"],
    optionsAr: ["انتحال ARP + تسميم DNS", "التوأم الشرير + إغراق إلغاء المصادقة", "KRACK + هجوم التجزئة", "التقاط Bluetooth + القيادة الحربية"],
    correctIndex: 1,
    explanation: "Two attacks are combined: (1) Evil Twin - a rogue AP with the same SSID, and (2) Deauthentication flood (aireplay-ng -0) to force clients off the legitimate AP so they reconnect to the evil twin. WPA3 and 802.11w (Protected Management Frames) defend against deauth attacks.",
    explanationAr: "يتم دمج هجومين: (1) التوأم الشرير - نقطة وصول مارقة بنفس SSID، و(2) إغراق إلغاء المصادقة (aireplay-ng -0) لإجبار العملاء على الانفصال عن نقطة الوصول الشرعية.",
  },
  {
    id: 4,
    scenario: "You're cracking a WEP-encrypted network by collecting initialization vectors (IVs).",
    scenarioAr: "تقوم بكسر شبكة مشفرة بـ WEP عن طريق جمع متجهات التهيئة (IVs).",
    terminalOutput: [
      "$ aireplay-ng -3 -b DD:EE:FF:44:55:66 wlan0mon",
      "Read 847 packets (got 234 ARP requests), sent 12847 packets...",
      "",
      "$ airodump-ng -c 1 --bssid DD:EE:FF:44:55:66 -w wep_capture wlan0mon",
      "#Data: 85,432 IVs collected",
      "",
      "$ aircrack-ng wep_capture-01.cap",
      "                                 Aircrack-ng 1.7",
      "                 [00:00:03] Tested 847 keys (got 85432 IVs)",
      "                 KEY FOUND! [ 41:42:43:44:45 ] (ASCII: ABCDE)",
      "                 Decrypted correctly: 100%",
    ],
    question: "Why is WEP fundamentally broken regardless of key length?",
    questionAr: "لماذا WEP مكسور جذرياً بغض النظر عن طول المفتاح؟",
    options: ["WEP uses a weak hashing algorithm", "WEP reuses initialization vectors (IVs), enabling statistical key recovery", "WEP doesn't encrypt data at all", "WEP only works on 2.4 GHz networks"],
    optionsAr: ["WEP يستخدم خوارزمية تجزئة ضعيفة", "WEP يعيد استخدام متجهات التهيئة (IVs)، مما يمكّن استرداد المفتاح إحصائياً", "WEP لا يشفر البيانات على الإطلاق", "WEP يعمل فقط على شبكات 2.4 GHz"],
    correctIndex: 1,
    explanation: "WEP's fatal flaw is its 24-bit IV (initialization vector) which is too short. With only 16.7 million possible IVs, they inevitably repeat. By collecting enough packets with reused IVs, statistical attacks (FMS, PTW) can recover the key in minutes regardless of key length (64-bit or 128-bit).",
    explanationAr: "العيب القاتل في WEP هو IV (متجه التهيئة) بطول 24 بت وهو قصير جداً. مع 16.7 مليون IV ممكن فقط، تتكرر حتماً. بجمع حزم كافية مع IVs معاد استخدامها، يمكن للهجمات الإحصائية استرداد المفتاح في دقائق.",
  },
  {
    id: 5,
    scenario: "Your penetration test report needs a recommendation for the most secure wireless configuration.",
    scenarioAr: "تقرير اختبار الاختراق يحتاج توصية لأكثر تكوين لاسلكي أماناً.",
    terminalOutput: [
      "=== Current Network Audit Summary ===",
      "",
      "Finding 1: WEP network still in use (CRITICAL)",
      "Finding 2: WPA2-PSK with weak password (HIGH)",
      "Finding 3: No 802.11w PMF enabled (MEDIUM)",
      "Finding 4: Hidden SSID used as security measure (LOW)",
      "Finding 5: MAC filtering as sole access control (LOW)",
      "",
      "Recommendation needed for enterprise deployment...",
    ],
    question: "What is the BEST recommendation for enterprise wireless security?",
    questionAr: "ما هي أفضل توصية لأمان الشبكات اللاسلكية المؤسسية؟",
    options: ["WPA2-PSK with a 20+ character passphrase", "WPA3-Enterprise with 802.1X/RADIUS + PMF + certificate-based auth", "Hidden SSID + MAC filtering + WPA2-PSK", "Open network with VPN requirement"],
    optionsAr: ["WPA2-PSK مع عبارة مرور 20+ حرف", "WPA3-Enterprise مع 802.1X/RADIUS + PMF + مصادقة قائمة على الشهادات", "SSID مخفي + تصفية MAC + WPA2-PSK", "شبكة مفتوحة مع متطلب VPN"],
    correctIndex: 1,
    explanation: "WPA3-Enterprise with 802.1X provides: (1) Individual user authentication via RADIUS (no shared passwords), (2) Certificate-based authentication prevents credential theft, (3) Protected Management Frames (PMF/802.11w) blocks deauth attacks, (4) SAE handshake resists offline dictionary attacks.",
    explanationAr: "WPA3-Enterprise مع 802.1X يوفر: (1) مصادقة مستخدم فردية عبر RADIUS (بدون كلمات مرور مشتركة)، (2) مصادقة قائمة على الشهادات تمنع سرقة بيانات الاعتماد، (3) PMF يحظر هجمات إلغاء المصادقة.",
  },
];

export default function CEHWirelessLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Radio className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Wireless Hacking Lab", "مختبر اختراق الشبكات اللاسلكية")}</h3>
          <p className="text-[#0C3C3C] font-['Work_Sans'] text-xs">{tx("Challenge", "تحدي")} {current + 1}/{CHALLENGES.length} - {tx("Score", "النتيجة")}: {score}/{CHALLENGES.length}</p>
        </div>
      </div>

      {completed ? (
        <div className="text-center py-8">
          <Wifi className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#0C3C3C] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Lab Complete!", "اكتمل المختبر!")}</h4>
          <p className="text-[#0C3C3C] font-['Work_Sans'] mb-4">{tx(`You scored ${score}/${CHALLENGES.length}. Wireless hacking expert!`, `حصلت على ${score}/${CHALLENGES.length}. خبير اختراق لاسلكي!`)}</p>
          <button onClick={reset} className="flex items-center gap-2 mx-auto px-6 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all"><RotateCcw className="w-4 h-4" /> {tx("Play Again", "ابدأ من جديد")}</button>
        </div>
      ) : (
        <>
          <div className="bg-white/50 border border-[#D4CBBA] p-3 mb-3">
            <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm">{tx(challenge.scenario, challenge.scenarioAr)}</p>
          </div>
          <div className="bg-[#0a0a0a] border border-[#333] p-3 mb-4 font-mono text-xs max-h-48 overflow-y-auto">
            {challenge.terminalOutput.map((line, i) => (
              <div key={i} className={line.startsWith("$") ? "text-green-400" : line.includes("WEP") || line.includes("CRITICAL") || line.includes("DeAuth") ? "text-red-400" : line.includes("KEY FOUND") || line.includes("handshake") ? "text-yellow-400" : line.includes("Finding") ? "text-blue-300" : "text-gray-300"}>{line || "\u00A0"}</div>
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
