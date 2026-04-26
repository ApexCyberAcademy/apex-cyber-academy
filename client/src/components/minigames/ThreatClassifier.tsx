/*
  Threat Classifier Mini-Game
  Students classify attack scenarios by threat type in a timed challenge.
  Maps to Security+ Module 2: Threats, Vulnerabilities, and Mitigations
  Bilingual: English + Arabic
*/

import { useState, useCallback, useEffect, useRef } from "react";
import { AlertTriangle, CheckCircle, XCircle, RotateCcw, Clock, Target, Zap } from "lucide-react";
import { useLabLang } from "./labI18n";

type ThreatScenario = {
  id: number;
  scenario: string;
  scenarioAr: string;
  correctType: string;
  options: string[];
  explanation: string;
  explanationAr: string;
};

const SCENARIOS: ThreatScenario[] = [
  {
    id: 1,
    scenario: "An employee receives an email appearing to be from the CEO, urgently requesting a wire transfer to a new vendor account.",
    scenarioAr: "يتلقى موظف بريداً إلكترونياً يبدو أنه من المدير التنفيذي، يطلب بشكل عاجل تحويلاً مصرفياً إلى حساب مورد جديد.",
    correctType: "Business Email Compromise (BEC)",
    options: ["Phishing", "Business Email Compromise (BEC)", "Vishing", "Watering Hole Attack"],
    explanation: "BEC specifically targets business processes by impersonating executives or trusted partners. Unlike generic phishing, BEC is highly targeted and focuses on financial fraud.",
    explanationAr: "يستهدف BEC تحديداً العمليات التجارية من خلال انتحال صفة المديرين التنفيذيين أو الشركاء الموثوقين. على عكس التصيد العام، فإن BEC مستهدف بشكل كبير ويركز على الاحتيال المالي.",
  },
  {
    id: 2,
    scenario: "A web application allows users to input search terms, but an attacker enters: ' OR '1'='1' -- into the search field, gaining access to the entire database.",
    scenarioAr: "يسمح تطبيق ويب للمستخدمين بإدخال مصطلحات البحث، لكن مهاجماً يدخل: ' OR '1'='1' -- في حقل البحث، ويحصل على وصول لقاعدة البيانات بالكامل.",
    correctType: "SQL Injection",
    options: ["Cross-Site Scripting (XSS)", "SQL Injection", "Command Injection", "LDAP Injection"],
    explanation: "SQL Injection exploits unsanitized user input to manipulate database queries. The ' OR '1'='1' payload creates a condition that's always true, bypassing authentication or exposing data.",
    explanationAr: "يستغل SQL Injection المدخلات غير المعقمة للتلاعب باستعلامات قاعدة البيانات. الحمولة ' OR '1'='1' تنشئ شرطاً صحيحاً دائماً، متجاوزة المصادقة أو كاشفة البيانات.",
  },
  {
    id: 3,
    scenario: "Thousands of compromised IoT devices simultaneously send traffic to a company's web server, making it unreachable for legitimate users.",
    scenarioAr: "تقوم آلاف أجهزة IoT المخترقة بإرسال حركة مرور في وقت واحد إلى خادم ويب الشركة، مما يجعله غير قابل للوصول للمستخدمين الشرعيين.",
    correctType: "DDoS (Distributed Denial of Service)",
    options: ["DDoS (Distributed Denial of Service)", "Man-in-the-Middle", "DNS Poisoning", "ARP Spoofing"],
    explanation: "DDoS uses multiple compromised systems (a botnet) to flood a target with traffic. IoT botnets like Mirai have been responsible for some of the largest DDoS attacks in history.",
    explanationAr: "يستخدم DDoS أنظمة مخترقة متعددة (شبكة بوت) لإغراق الهدف بحركة المرور. شبكات بوت IoT مثل Mirai كانت مسؤولة عن بعض أكبر هجمات DDoS في التاريخ.",
  },
  {
    id: 4,
    scenario: "An attacker places a malicious USB drive in a company parking lot. An employee picks it up and plugs it into their workstation, installing malware.",
    scenarioAr: "يضع مهاجم محرك USB خبيث في موقف سيارات الشركة. يلتقطه موظف ويوصله بمحطة عمله، مما يثبت برمجية خبيثة.",
    correctType: "Social Engineering (Baiting)",
    options: ["Tailgating", "Social Engineering (Baiting)", "Shoulder Surfing", "Dumpster Diving"],
    explanation: "Baiting exploits human curiosity by leaving infected physical media where targets will find them. This is a classic social engineering technique that bypasses all technical controls.",
    explanationAr: "يستغل الطُعم فضول الإنسان بترك وسائط مادية مصابة حيث سيجدها الأهداف. هذه تقنية هندسة اجتماعية كلاسيكية تتجاوز جميع الضوابط التقنية.",
  },
  {
    id: 5,
    scenario: "Malware encrypts all files on a hospital's network and displays a message demanding Bitcoin payment for the decryption key.",
    scenarioAr: "تشفر برمجية خبيثة جميع الملفات على شبكة مستشفى وتعرض رسالة تطالب بدفع بيتكوين مقابل مفتاح فك التشفير.",
    correctType: "Ransomware",
    options: ["Trojan Horse", "Ransomware", "Spyware", "Rootkit"],
    explanation: "Ransomware encrypts victim data and demands payment for decryption. Healthcare is a prime target because downtime directly threatens patient safety, increasing pressure to pay.",
    explanationAr: "يشفر برنامج الفدية بيانات الضحية ويطالب بالدفع مقابل فك التشفير. الرعاية الصحية هدف رئيسي لأن التوقف يهدد سلامة المرضى مباشرة، مما يزيد الضغط للدفع.",
  },
  {
    id: 6,
    scenario: "An attacker compromises a popular JavaScript library on npm. When developers install the package, a backdoor is silently added to their applications.",
    scenarioAr: "يخترق مهاجم مكتبة JavaScript شائعة على npm. عندما يثبت المطورون الحزمة، يُضاف باب خلفي بصمت إلى تطبيقاتهم.",
    correctType: "Supply Chain Attack",
    options: ["Zero-Day Exploit", "Supply Chain Attack", "Privilege Escalation", "Backdoor"],
    explanation: "Supply chain attacks target the software development pipeline. By compromising a trusted dependency, attackers can reach thousands of downstream applications - like the SolarWinds attack.",
    explanationAr: "تستهدف هجمات سلسلة التوريد خط أنابيب تطوير البرمجيات. من خلال اختراق تبعية موثوقة، يمكن للمهاجمين الوصول إلى آلاف التطبيقات - مثل هجوم SolarWinds.",
  },
  {
    id: 7,
    scenario: "An attacker sets up a rogue Wi-Fi access point named 'Airport_Free_WiFi' at an airport. Travelers connect and the attacker intercepts their unencrypted traffic.",
    scenarioAr: "يقوم مهاجم بإعداد نقطة وصول Wi-Fi مزيفة باسم 'Airport_Free_WiFi' في مطار. يتصل المسافرون ويعترض المهاجم حركة مرورهم غير المشفرة.",
    correctType: "Evil Twin Attack",
    options: ["Evil Twin Attack", "Bluetooth Attack", "Replay Attack", "Session Hijacking"],
    explanation: "An Evil Twin is a rogue access point that mimics a legitimate one. It's a form of Man-in-the-Middle attack specific to wireless networks. Always verify Wi-Fi networks and use VPNs.",
    explanationAr: "التوأم الشرير هو نقطة وصول مزيفة تحاكي نقطة شرعية. إنه شكل من أشكال هجوم الرجل في المنتصف خاص بالشبكات اللاسلكية. تحقق دائماً من شبكات Wi-Fi واستخدم VPN.",
  },
  {
    id: 8,
    scenario: "After gaining initial access to a workstation, an attacker exploits a kernel vulnerability to gain root/SYSTEM privileges on the machine.",
    scenarioAr: "بعد الحصول على وصول أولي لمحطة عمل، يستغل مهاجم ثغرة في النواة للحصول على صلاحيات root/SYSTEM على الجهاز.",
    correctType: "Privilege Escalation",
    options: ["Lateral Movement", "Privilege Escalation", "Persistence", "Credential Harvesting"],
    explanation: "Privilege escalation is when an attacker elevates their access level. Vertical escalation (user→admin) is shown here. This is a critical step in most attack chains.",
    explanationAr: "تصعيد الصلاحيات هو عندما يرفع المهاجم مستوى وصوله. التصعيد العمودي (مستخدم→مسؤول) موضح هنا. هذه خطوة حاسمة في معظم سلاسل الهجوم.",
  },
];

export default function ThreatClassifier({ onComplete }: { onComplete?: (score?: number) => void }) {
  const { tx } = useLabLang();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [gameOver, setGameOver] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scenario = SCENARIOS[currentIdx];

  useEffect(() => {
    if (gameOver || isCorrect !== null) return;
    setTimeLeft(20);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setTimedOut(true);
          setIsCorrect(false);
          setStreak(0);
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [currentIdx, gameOver, isCorrect]);

  const handleSelect = useCallback((option: string) => {
    if (isCorrect !== null) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setSelected(option);
    const correct = option === scenario.correctType;
    setIsCorrect(correct);
    if (correct) {
      setScore(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        setBestStreak(best => Math.max(best, newStreak));
        return newStreak;
      });
    } else {
      setStreak(0);
    }
  }, [isCorrect, scenario]);

  const nextScenario = useCallback(() => {
    if (currentIdx < SCENARIOS.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelected(null);
      setIsCorrect(null);
      setTimedOut(false);
    } else {
      setGameOver(true);
    }
  }, [currentIdx]);

  const reset = useCallback(() => {
    setCurrentIdx(0);
    setSelected(null);
    setIsCorrect(null);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setTimeLeft(20);
    setGameOver(false);
    setTimedOut(false);
  }, []);

  return (
    <div className="bg-[#001A16] border-2 border-[#0A6B5A]/40 p-6 my-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">
              {tx("Threat Classifier", "مصنّف التهديدات")}
            </h3>
            <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">
              {currentIdx + 1}/{SCENARIOS.length} - {tx("Score", "النتيجة")}: {score} - {tx("Streak", "سلسلة")}: {streak}
            </p>
          </div>
        </div>
        {!gameOver && isCorrect === null && (
          <div className={`flex items-center gap-2 px-3 py-1.5 border ${timeLeft <= 5 ? "border-red-500/50 text-red-400" : "border-[#0A6B5A]/50 text-[#C4B9A8]"}`}>
            <Clock className="w-4 h-4" />
            <span className="font-mono text-sm font-bold">{timeLeft}{tx("s", "ث")}</span>
          </div>
        )}
      </div>

      {gameOver ? (
        <div className="text-center py-8">
          <AlertTriangle className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">
            {tx("Challenge Complete!", "اكتمل التحدي!")}
          </h4>
          <p className="text-[#C4B9A8] font-['Work_Sans'] mb-2">
            {tx("Final Score", "النتيجة النهائية")}: {score}/{SCENARIOS.length}
          </p>
          <p className="text-[#D4AF37] font-['Montserrat'] text-sm font-semibold mb-4">
            {tx("Best Streak", "أفضل سلسلة")}: {bestStreak}
          </p>
          <button onClick={reset} className="flex items-center gap-2 mx-auto px-6 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all">
            <RotateCcw className="w-4 h-4" /> {tx("Play Again", "ابدأ من جديد")}
          </button>
        </div>
      ) : (
        <>
          {/* Scenario */}
          <div className="bg-[#002F24]/50 border border-[#0A6B5A]/30 p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[#D4AF37] font-['Montserrat'] text-xs font-bold">
                {tx("INCIDENT REPORT", "تقرير الحادثة")}
              </span>
            </div>
            <p className="text-[#E8E0D4] font-['Work_Sans'] text-sm leading-relaxed">
              {tx(scenario.scenario, scenario.scenarioAr)}
            </p>
          </div>

          {/* Options - keep technical names in English */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {scenario.options.map(option => {
              let borderClass = "border-[#0A6B5A]/30 hover:border-[#D4AF37]/50";
              let textClass = "text-[#E8E0D4]";

              if (isCorrect !== null) {
                if (option === scenario.correctType) {
                  borderClass = "border-[#D4AF37] bg-[#D4AF37]/10";
                  textClass = "text-[#D4AF37]";
                } else if (option === selected && !isCorrect) {
                  borderClass = "border-red-500/50 bg-red-500/10";
                  textClass = "text-red-400";
                } else {
                  borderClass = "border-[#0A6B5A]/15 opacity-50";
                }
              }

              return (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  disabled={isCorrect !== null}
                  className={`border p-3 text-left transition-all ${borderClass}`}
                >
                  <span className={`font-['Montserrat'] text-sm font-semibold ${textClass}`}>{option}</span>
                </button>
              );
            })}
          </div>

          {/* Result */}
          {isCorrect !== null && (
            <div className={`border p-4 mb-4 ${isCorrect ? "border-[#D4AF37]/30 bg-[#0A3D33]/30" : "border-red-500/20 bg-[#3D0A0A]/10"}`}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-[#D4AF37]" />
                    <span className="text-[#D4AF37] font-['Montserrat'] text-sm font-bold">{tx("Correct!", "صحيح!")}</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span className="text-red-400 font-['Montserrat'] text-sm font-bold">
                      {timedOut ? tx("Time's up!", "انتهى الوقت!") : tx("Incorrect!", "خطأ!")} {tx("The answer is", "الإجابة هي")}: {scenario.correctType}
                    </span>
                  </>
                )}
              </div>
              <p className="text-[#C4B9A8] font-['Work_Sans'] text-sm">
                {tx(scenario.explanation, scenario.explanationAr)}
              </p>
              <button
                onClick={nextScenario}
                className="flex items-center gap-2 mt-3 px-5 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all"
              >
                {currentIdx < SCENARIOS.length - 1
                  ? tx("Next Scenario", "السيناريو التالي")
                  : tx("See Results", "عرض النتائج")
                } <Zap className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
