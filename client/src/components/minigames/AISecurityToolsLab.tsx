/*
  AI Security Tools Lab - SecAI+ Day 7
  Students match AI-enabled security tools to appropriate use cases.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { Wrench, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [
  {
    "id": 1,
    "scenario": "Your SOC team receives 50,000 security alerts per day. Analysts can only investigate 200. Which AI-enabled tool would best help prioritize the most critical alerts?",
    "scenarioAr": "فريق SOC يتلقى 50,000 تنبيه أمني يومياً. المحللون يمكنهم التحقيق في 200 فقط. أي أداة مدعومة بالذكاء الاصطناعي ستساعد في تحديد أولويات التنبيهات الأكثر أهمية؟",
    "correct": "AI-powered SOAR (Security Orchestration, Automation, and Response)",
    "options": [
      "Traditional SIEM with more storage",
      "AI-powered SOAR (Security Orchestration, Automation, and Response)",
      "Additional firewall rules",
      "More SOC analysts"
    ],
    "optionsAr": [
      "SIEM تقليدي بمزيد من التخزين",
      "SOAR مدعوم بالذكاء الاصطناعي (تنسيق الأمان والأتمتة والاستجابة)",
      "قواعد جدار حماية إضافية",
      "المزيد من محللي SOC"
    ],
    "explanation": "AI-powered SOAR uses machine learning to automatically triage, correlate, and prioritize alerts based on risk scores, reducing the 50,000 alerts to the most actionable ones. It can also automate responses for known patterns, freeing analysts to focus on novel threats.",
    "explanationAr": "SOAR المدعوم بالذكاء الاصطناعي يستخدم التعلم الآلي لفرز وربط وتحديد أولويات التنبيهات تلقائياً بناءً على درجات المخاطر، مما يقلل 50,000 تنبيه إلى الأكثر قابلية للتنفيذ."
  },
  {
    "id": 2,
    "scenario": "You need to detect insider threats by identifying unusual patterns in employee behavior — like accessing files at odd hours, downloading large volumes of data, or accessing systems outside their role. Which tool?",
    "scenarioAr": "تحتاج لكشف التهديدات الداخلية بتحديد أنماط غير عادية في سلوك الموظفين — مثل الوصول للملفات في ساعات غريبة أو تنزيل كميات كبيرة من البيانات أو الوصول لأنظمة خارج دورهم. أي أداة؟",
    "correct": "User and Entity Behavior Analytics (UEBA)",
    "options": [
      "Data Loss Prevention (DLP)",
      "User and Entity Behavior Analytics (UEBA)",
      "Network Intrusion Detection System (NIDS)",
      "Endpoint Detection and Response (EDR)"
    ],
    "optionsAr": [
      "منع فقدان البيانات (DLP)",
      "تحليلات سلوك المستخدم والكيان (UEBA)",
      "نظام كشف تسلل الشبكة (NIDS)",
      "كشف واستجابة نقاط النهاية (EDR)"
    ],
    "explanation": "UEBA uses AI/ML to establish behavioral baselines for each user and entity, then detects anomalies that deviate from normal patterns. It's specifically designed for insider threat detection — correlating multiple weak signals (odd hours + unusual file access + role mismatch) into high-confidence alerts.",
    "explanationAr": "UEBA يستخدم الذكاء الاصطناعي/التعلم الآلي لإنشاء خطوط أساس سلوكية لكل مستخدم وكيان، ثم يكشف الشذوذ الذي ينحرف عن الأنماط العادية. مصمم خصيصاً لكشف التهديدات الداخلية."
  },
  {
    "id": 3,
    "scenario": "Your organization wants to automatically scan all code commits for security vulnerabilities, hardcoded secrets, and insecure coding patterns before they reach production. Which AI tool?",
    "scenarioAr": "منظمتك تريد فحص جميع التزامات الكود تلقائياً بحثاً عن ثغرات أمنية وأسرار مشفرة وأنماط ترميز غير آمنة قبل وصولها للإنتاج. أي أداة ذكاء اصطناعي؟",
    "correct": "AI-powered SAST (Static Application Security Testing) in CI/CD pipeline",
    "options": [
      "AI-powered SAST (Static Application Security Testing) in CI/CD pipeline",
      "Web Application Firewall (WAF)",
      "Runtime Application Self-Protection (RASP)",
      "Manual code review only"
    ],
    "optionsAr": [
      "SAST مدعوم بالذكاء الاصطناعي (اختبار أمان التطبيقات الثابت) في خط أنابيب CI/CD",
      "جدار حماية تطبيقات الويب (WAF)",
      "حماية التطبيقات الذاتية أثناء التشغيل (RASP)",
      "مراجعة الكود اليدوية فقط"
    ],
    "explanation": "AI-powered SAST tools (like Semgrep, Snyk Code, or GitHub Copilot security) analyze source code statically in the CI/CD pipeline, catching vulnerabilities before deployment. AI enhances traditional SAST by reducing false positives and detecting complex vulnerability patterns that rule-based scanners miss.",
    "explanationAr": "أدوات SAST المدعومة بالذكاء الاصطناعي تحلل الكود المصدري بشكل ثابت في خط أنابيب CI/CD، تلتقط الثغرات قبل النشر. الذكاء الاصطناعي يعزز SAST التقليدي بتقليل الإيجابيات الكاذبة وكشف أنماط الثغرات المعقدة."
  }
];

export default function AISecurityToolsLab({ onComplete }: { onComplete?: (score?: number) => void }) {
  const { tx } = useLabLang();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const s = SCENARIOS[current];
  const handleSubmit = useCallback(() => { if (selected === null) return; setShowResult(true); if (s.options[selected] === s.correct) setScore(sc => sc + 1); }, [selected, s]);
  const handleNext = useCallback(() => { if (current < SCENARIOS.length - 1) { setCurrent(c => c + 1); setSelected(null); setShowResult(false); } else setCompleted(true); }, [current]);
  const reset = useCallback(() => { setCurrent(0); setSelected(null); setShowResult(false); setScore(0); setCompleted(false); }, []);

  return (
    <div className="bg-[#001A16] border-2 border-[#0A6B5A]/40 p-6 my-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Wrench className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("AI Security Tools Lab", "مختبر أدوات أمان الذكاء الاصطناعي")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <Wrench className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Tools Expert!", "خبير الأدوات!")}</h4>
          <p className="text-[#C4B9A8] font-['Work_Sans'] mb-4">{tx(`You scored ${score}/${SCENARIOS.length}!`, `حصلت على ${score}/${SCENARIOS.length}!`)}</p>
          <button onClick={reset} className="flex items-center gap-2 mx-auto px-6 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E]"><RotateCcw className="w-4 h-4" /> {tx("Play Again", "ابدأ من جديد")}</button>
        </div>
      ) : (
        <>
          <div className="bg-[#002F24]/50 border border-[#0A6B5A]/30 p-4 mb-4"><p className="text-[#E8E0D4] font-['Work_Sans'] text-sm">{tx(s.scenario, s.scenarioAr)}</p></div>
          <div className="space-y-2 mb-4">
            {s.options.map((opt, i) => (
              <button key={i} onClick={() => !showResult && setSelected(i)} className={`w-full text-left p-3 border font-['Work_Sans'] text-sm transition-all ${showResult ? opt === s.correct ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]" : i === selected ? "border-red-500/50 bg-red-500/10 text-red-400" : "border-[#0A6B5A]/20 text-[#C4B9A8]/50" : selected === i ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]" : "border-[#0A6B5A]/30 text-[#C4B9A8] hover:border-[#D4AF37]/50"}`}>
                <div className="flex items-center gap-2">{showResult && opt === s.correct && <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0" />}{showResult && i === selected && opt !== s.correct && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}{tx(opt, s.optionsAr[i])}</div>
              </button>
            ))}
          </div>
          {!showResult ? (
            <button onClick={handleSubmit} disabled={selected === null} className="px-6 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] disabled:opacity-40">{tx("Submit", "إرسال")}</button>
          ) : (
            <div className="bg-[#0A3D33]/40 border border-[#0A6B5A]/30 p-4">
              <div className="flex items-center gap-2 mb-2">{s.options[selected!] === s.correct ? <><CheckCircle className="w-5 h-5 text-[#D4AF37]" /><span className="text-[#D4AF37] font-['Montserrat'] font-bold text-sm">{tx("Correct!", "صحيح!")}</span></> : <><XCircle className="w-5 h-5 text-red-400" /><span className="text-red-400 font-['Montserrat'] font-bold text-sm">{tx("Incorrect", "غير صحيح")}</span></>}</div>
              <p className="text-[#C4B9A8] font-['Work_Sans'] text-sm">{tx(s.explanation, s.explanationAr)}</p>
              <button onClick={handleNext} className="mt-3 flex items-center gap-2 px-5 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E]">{current < SCENARIOS.length - 1 ? tx("Next Scenario", "السيناريو التالي") : tx("See Results", "عرض النتائج")} <ArrowRight className="w-4 h-4" /></button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
