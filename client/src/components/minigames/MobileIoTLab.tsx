/*
  Mobile, IoT & OT Hacking Lab
  Students analyze mobile app vulnerabilities, IoT device security, and OT/SCADA systems.
  Maps to CEH Day 13: Mobile, IoT & OT Hacking
  Bilingual: English + Arabic
*/

import { useState, useCallback } from "react";
import { Smartphone, CheckCircle, XCircle, RotateCcw, ArrowRight, Cpu } from "lucide-react";
import { useLabLang } from "./labI18n";

type MobileChallenge = {
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

const CHALLENGES: MobileChallenge[] = [
  {
    id: 1,
    scenario: "You're performing a mobile application penetration test on an Android banking app. You intercept the app's network traffic.",
    scenarioAr: "تجري اختبار اختراق لتطبيق مصرفي على Android. تعترض حركة مرور التطبيق.",
    terminalOutput: [
      "$ mitmproxy --mode transparent",
      "",
      "POST /api/login HTTP/1.1",
      "Host: api.bank-app.com",
      "Content-Type: application/json",
      "",
      "{\"username\":\"user@email.com\",\"password\":\"MyP@ss123!\"}",
      "",
      "Response: 200 OK",
      "{\"token\":\"eyJhbGciOiJub25lIn0.eyJ1c2VyIjoiYWRtaW4ifQ.\"}",
      "",
      "Note: JWT header: {\"alg\":\"none\"} (NO SIGNATURE!)",
    ],
    question: "What are the TWO critical vulnerabilities in this mobile app?",
    questionAr: "ما هما الثغرتان الحرجتان في هذا التطبيق المحمول؟",
    options: ["The app uses HTTP instead of HTTPS", "No certificate pinning (MITM possible) AND JWT with 'none' algorithm (token forgery)", "The username format is wrong", "The API endpoint is not RESTful"],
    optionsAr: ["التطبيق يستخدم HTTP بدلاً من HTTPS", "لا يوجد تثبيت شهادات (MITM ممكن) وJWT بخوارزمية 'none' (تزوير الرمز)", "تنسيق اسم المستخدم خاطئ", "نقطة نهاية API ليست RESTful"],
    correctIndex: 1,
    explanation: "Two critical issues: (1) No certificate pinning - mitmproxy can intercept HTTPS traffic, meaning the app trusts any certificate. (2) JWT uses 'alg: none' - no signature verification, allowing anyone to forge tokens and impersonate any user. Both are OWASP Mobile Top 10 vulnerabilities.",
    explanationAr: "مشكلتان حرجتان: (1) لا يوجد تثبيت شهادات - mitmproxy يمكنه اعتراض حركة HTTPS. (2) JWT يستخدم 'alg: none' - بدون تحقق من التوقيع، مما يسمح لأي شخص بتزوير الرموز وانتحال شخصية أي مستخدم.",
  },
  {
    id: 2,
    scenario: "You discover an IoT smart thermostat on the corporate network that communicates with a cloud service.",
    scenarioAr: "اكتشفت منظم حرارة ذكي IoT على شبكة الشركة يتواصل مع خدمة سحابية.",
    terminalOutput: [
      "$ nmap -sV 10.0.1.50",
      "PORT     STATE SERVICE",
      "23/tcp   open  telnet  (default: admin/admin)",
      "80/tcp   open  http    (no auth required!)",
      "8883/tcp open  mqtt    (no TLS, no auth)",
      "",
      "$ mosquitto_sub -h 10.0.1.50 -t '#' -v",
      "home/thermostat/temp  72.5",
      "home/thermostat/schedule  {\"wake\":\"6:00\",\"sleep\":\"22:00\"}",
      "home/thermostat/location  {\"lat\":40.7128,\"lon\":-74.0060}",
      "home/thermostat/firmware_url  http://update.vendor.com/fw.bin",
    ],
    question: "What is the MOST dangerous attack possible with this IoT device?",
    questionAr: "ما هو أخطر هجوم ممكن مع جهاز IoT هذا؟",
    options: ["Changing the temperature settings", "Using the unsecured MQTT broker as a pivot point to attack the corporate network and exfiltrate data", "Reading the thermostat schedule", "Updating the firmware"],
    optionsAr: ["تغيير إعدادات درجة الحرارة", "استخدام وسيط MQTT غير المؤمن كنقطة محورية لمهاجمة شبكة الشركة وتسريب البيانات", "قراءة جدول منظم الحرارة", "تحديث البرامج الثابتة"],
    correctIndex: 1,
    explanation: "The unsecured IoT device is a gateway to the corporate network. With telnet (default creds), unauthenticated MQTT, and no encryption, an attacker can: (1) Pivot to internal network resources, (2) Exfiltrate data via MQTT, (3) Install malicious firmware, (4) Use it as a persistent backdoor. IoT devices must be segmented on isolated VLANs.",
    explanationAr: "جهاز IoT غير المؤمن هو بوابة لشبكة الشركة. مع telnet (بيانات اعتماد افتراضية)، MQTT بدون مصادقة، وبدون تشفير، يمكن للمهاجم: (1) التحول إلى موارد الشبكة الداخلية، (2) تسريب البيانات عبر MQTT.",
  },
  {
    id: 3,
    scenario: "A SCADA system controlling a water treatment plant is found to be accessible from the corporate network.",
    scenarioAr: "نظام SCADA يتحكم في محطة معالجة مياه وُجد أنه يمكن الوصول إليه من شبكة الشركة.",
    terminalOutput: [
      "$ nmap -sV 10.0.5.10",
      "PORT     STATE SERVICE",
      "502/tcp  open  modbus  (Modbus TCP - no auth!)",
      "102/tcp  open  s7comm  (Siemens S7 protocol)",
      "44818/tcp open  etherip (EtherNet/IP)",
      "",
      "$ python3 modbus_scanner.py 10.0.5.10",
      "Coil 0: ON  (Chemical dosing pump)",
      "Coil 1: OFF (Emergency shutoff valve)",
      "Register 0: 7.2 (pH level - normal: 6.5-8.5)",
      "Register 1: 150 (Chlorine ppm - normal: 1-4 ppm!)",
      "",
      "WARNING: No authentication on Modbus. Any device on",
      "the network can read/write SCADA registers!",
    ],
    question: "Why are OT/SCADA systems particularly dangerous when compromised?",
    questionAr: "لماذا أنظمة OT/SCADA خطيرة بشكل خاص عند اختراقها؟",
    options: ["They contain valuable intellectual property", "They control physical processes - manipulation can cause real-world harm (safety, environmental, infrastructure damage)", "They are expensive to replace", "They run outdated operating systems"],
    optionsAr: ["تحتوي على ملكية فكرية قيمة", "تتحكم في عمليات فيزيائية - التلاعب يمكن أن يسبب ضرراً حقيقياً (سلامة، بيئة، أضرار بنية تحتية)", "مكلفة للاستبدال", "تعمل بأنظمة تشغيل قديمة"],
    correctIndex: 1,
    explanation: "SCADA/OT systems control physical infrastructure (water, power, manufacturing). The Modbus protocol has NO authentication - anyone on the network can change chemical dosing (chlorine at 150 ppm vs normal 1-4 ppm could be lethal). This is a cyber-physical attack with real-world consequences. Air-gap or segment OT networks!",
    explanationAr: "أنظمة SCADA/OT تتحكم في البنية التحتية الفيزيائية (مياه، كهرباء، تصنيع). بروتوكول Modbus ليس لديه مصادقة - أي شخص على الشبكة يمكنه تغيير جرعات المواد الكيميائية. هذا هجوم سيبراني-فيزيائي بعواقب حقيقية.",
  },
  {
    id: 4,
    scenario: "You're reverse-engineering an Android APK to find hardcoded secrets and vulnerabilities.",
    scenarioAr: "تقوم بالهندسة العكسية لملف APK Android لإيجاد أسرار مشفرة وثغرات.",
    terminalOutput: [
      "$ apktool d banking_app.apk",
      "$ grep -r 'api_key\\|secret\\|password' ./banking_app/",
      "",
      "res/values/strings.xml:",
      "  <string name=\"api_key\">sk_live_EXAMPLE_KEY_REDACTED_FOR_DEMO</string>",
      "  <string name=\"encryption_key\">AES256_KEY_HARDCODED_12345</string>",
      "",
      "smali/com/bank/utils/CryptoHelper.smali:",
      "  const-string v0, \"AES/ECB/PKCS5Padding\"",
      "",
      "AndroidManifest.xml:",
      "  android:debuggable=\"true\"",
      "  android:allowBackup=\"true\"",
    ],
    question: "How many OWASP Mobile Top 10 vulnerabilities are present?",
    questionAr: "كم عدد ثغرات OWASP Mobile Top 10 الموجودة؟",
    options: ["1 vulnerability", "2 vulnerabilities", "At least 4: hardcoded secrets, weak crypto (ECB mode), debuggable in production, insecure data storage (allowBackup)", "No vulnerabilities found"],
    optionsAr: ["ثغرة واحدة", "ثغرتان", "4 على الأقل: أسرار مشفرة، تشفير ضعيف (وضع ECB)، قابل للتصحيح في الإنتاج، تخزين بيانات غير آمن (allowBackup)", "لم يتم العثور على ثغرات"],
    correctIndex: 2,
    explanation: "At least 4 critical vulnerabilities: (1) Hardcoded API key and encryption key in strings.xml, (2) AES/ECB mode - ECB doesn't hide data patterns (use CBC or GCM), (3) debuggable=true in production allows attaching debuggers, (4) allowBackup=true lets anyone extract app data via ADB backup.",
    explanationAr: "4 ثغرات حرجة على الأقل: (1) مفتاح API ومفتاح تشفير مشفران في strings.xml، (2) وضع AES/ECB - ECB لا يخفي أنماط البيانات، (3) debuggable=true في الإنتاج، (4) allowBackup=true يسمح لأي شخص باستخراج بيانات التطبيق.",
  },
  {
    id: 5,
    scenario: "You need to recommend a security architecture for a smart factory with both IT and OT networks.",
    scenarioAr: "تحتاج لتوصية بهندسة أمنية لمصنع ذكي مع شبكات IT وOT.",
    terminalOutput: [
      "=== Current Architecture (FLAT NETWORK) ===",
      "Corporate IT ←→ SCADA/PLCs ←→ Internet",
      "All on same subnet: 10.0.0.0/16",
      "No segmentation, no DMZ, no monitoring",
      "",
      "=== Purdue Model (Recommended) ===",
      "Level 5: Enterprise (IT network)",
      "Level 4: Business planning (ERP)",
      "--- DMZ / Firewall ---",
      "Level 3: Site operations (SCADA servers)",
      "Level 2: Area control (HMI, engineering)",
      "Level 1: Basic control (PLCs, RTUs)",
      "Level 0: Physical process (sensors, actuators)",
    ],
    question: "What is the MOST critical security measure for IT/OT convergence?",
    questionAr: "ما هو الإجراء الأمني الأكثر أهمية لتقارب IT/OT؟",
    options: ["Install antivirus on all SCADA systems", "Network segmentation with a DMZ between IT and OT networks (Purdue Model)", "Encrypt all OT traffic", "Regular password changes on PLCs"],
    optionsAr: ["تثبيت مضاد فيروسات على جميع أنظمة SCADA", "تقسيم الشبكة مع DMZ بين شبكات IT وOT (نموذج Purdue)", "تشفير جميع حركة مرور OT", "تغيير كلمات المرور بانتظام على PLCs"],
    correctIndex: 1,
    explanation: "The Purdue Model with network segmentation is the gold standard for IT/OT security. A DMZ between IT (Level 4-5) and OT (Level 0-3) prevents direct access from corporate networks to industrial control systems. This limits blast radius if either network is compromised and is required by IEC 62443.",
    explanationAr: "نموذج Purdue مع تقسيم الشبكة هو المعيار الذهبي لأمن IT/OT. DMZ بين IT (المستوى 4-5) وOT (المستوى 0-3) يمنع الوصول المباشر من شبكات الشركة إلى أنظمة التحكم الصناعي.",
  },
];

export default function MobileIoTLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Smartphone className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Mobile, IoT & OT Hacking Lab", "مختبر اختراق الأجهزة المحمولة وIoT وOT")}</h3>
          <p className="text-[#0C3C3C] font-['Work_Sans'] text-xs">{tx("Challenge", "تحدي")} {current + 1}/{CHALLENGES.length} - {tx("Score", "النتيجة")}: {score}/{CHALLENGES.length}</p>
        </div>
      </div>

      {completed ? (
        <div className="text-center py-8">
          <Cpu className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#0C3C3C] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Lab Complete!", "اكتمل المختبر!")}</h4>
          <p className="text-[#0C3C3C] font-['Work_Sans'] mb-4">{tx(`You scored ${score}/${CHALLENGES.length}. Mobile & IoT security expert!`, `حصلت على ${score}/${CHALLENGES.length}. خبير أمان الأجهزة المحمولة وIoT!`)}</p>
          <button onClick={reset} className="flex items-center gap-2 mx-auto px-6 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all"><RotateCcw className="w-4 h-4" /> {tx("Play Again", "ابدأ من جديد")}</button>
        </div>
      ) : (
        <>
          <div className="bg-white/50 border border-[#D4CBBA] p-3 mb-3">
            <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm">{tx(challenge.scenario, challenge.scenarioAr)}</p>
          </div>
          <div className="bg-[#0a0a0a] border border-[#333] p-3 mb-4 font-mono text-xs max-h-48 overflow-y-auto">
            {challenge.terminalOutput.map((line, i) => (
              <div key={i} className={line.startsWith("$") ? "text-green-400" : line.includes("WARNING") || line.includes("no auth") || line.includes("HARDCODED") || line.includes("none") ? "text-red-400" : line.includes("===") || line.includes("Level") ? "text-blue-300" : line.includes("api_key") || line.includes("debuggable") ? "text-yellow-400" : "text-gray-300"}>{line || "\u00A0"}</div>
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
