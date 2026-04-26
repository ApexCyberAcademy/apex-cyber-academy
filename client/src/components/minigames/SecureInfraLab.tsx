/*
  Secure Infrastructure Lab
  Students configure security settings for enterprise infrastructure components.
  Maps to Security+ Day 8: Securing Enterprise Infrastructure
  Bilingual: English + Arabic
*/

import { useState, useEffect, useCallback } from "react";
import { Server, CheckCircle, XCircle, RotateCcw, ArrowRight, Wifi } from "lucide-react";
import { useLabLang } from "./labI18n";

type ConfigTask = {
  id: number;
  system: string;
  systemAr: string;
  scenario: string;
  scenarioAr: string;
  settings: { name: string; nameAr: string; options: string[]; optionsAr: string[]; correct: number }[];
  explanation: string;
  explanationAr: string;
};

const TASKS: ConfigTask[] = [
  {
    id: 1,
    system: "Wireless Access Point",
    systemAr: "نقطة وصول لاسلكية",
    scenario: "Configure a new corporate wireless access point for the office. The network will carry sensitive business data.",
    scenarioAr: "قم بتكوين نقطة وصول لاسلكية جديدة للمكتب. ستحمل الشبكة بيانات أعمال حساسة.",
    settings: [
      { name: "Encryption", nameAr: "التشفير", options: ["WEP", "WPA2-Personal", "WPA3-Enterprise", "Open (No encryption)"], optionsAr: ["WEP", "WPA2-شخصي", "WPA3-مؤسسي", "مفتوح (بدون تشفير)"], correct: 2 },
      { name: "SSID Broadcast", nameAr: "بث SSID", options: ["Enabled (visible)", "Disabled (hidden)"], optionsAr: ["مفعل (مرئي)", "معطل (مخفي)"], correct: 0 },
      { name: "Authentication", nameAr: "المصادقة", options: ["Pre-shared key", "802.1X/RADIUS", "MAC filtering only", "No authentication"], optionsAr: ["مفتاح مشترك مسبقاً", "802.1X/RADIUS", "تصفية MAC فقط", "بدون مصادقة"], correct: 1 },
    ],
    explanation: "WPA3-Enterprise provides the strongest wireless encryption with individual session keys. 802.1X/RADIUS authenticates each user individually (not a shared password). SSID hiding provides no real security (easily discovered) — keep it visible for usability.",
    explanationAr: "WPA3-المؤسسي يوفر أقوى تشفير لاسلكي مع مفاتيح جلسة فردية. 802.1X/RADIUS يصادق كل مستخدم بشكل فردي (ليس كلمة مرور مشتركة). إخفاء SSID لا يوفر أماناً حقيقياً (يُكتشف بسهولة) — أبقه مرئياً لسهولة الاستخدام.",
  },
  {
    id: 2,
    system: "Email Server",
    systemAr: "خادم البريد الإلكتروني",
    scenario: "Harden the corporate email server to prevent spoofing, phishing, and unauthorized relay.",
    scenarioAr: "قم بتقوية خادم البريد الإلكتروني للشركة لمنع الانتحال والتصيد والترحيل غير المصرح به.",
    settings: [
      { name: "SPF Record", nameAr: "سجل SPF", options: ["Not configured", "v=spf1 +all", "v=spf1 include:mail.corp.com -all", "v=spf1 ?all"], optionsAr: ["غير مكوّن", "v=spf1 +all", "v=spf1 include:mail.corp.com -all", "v=spf1 ?all"], correct: 2 },
      { name: "DKIM", nameAr: "DKIM", options: ["Disabled", "Enabled with 1024-bit key", "Enabled with 2048-bit key"], optionsAr: ["معطل", "مفعل بمفتاح 1024 بت", "مفعل بمفتاح 2048 بت"], correct: 2 },
      { name: "Open Relay", nameAr: "الترحيل المفتوح", options: ["Enabled (accept all)", "Disabled (authenticated only)"], optionsAr: ["مفعل (قبول الكل)", "معطل (المصادق فقط)"], correct: 1 },
    ],
    explanation: "SPF with '-all' (hard fail) tells receivers to reject emails not from authorized servers. DKIM with 2048-bit keys provides stronger cryptographic signing. Open relay must always be disabled — it allows anyone to send email through your server (spam relay).",
    explanationAr: "SPF مع '-all' (فشل صارم) يخبر المستلمين برفض الرسائل ليست من خوادم مصرح بها. DKIM بمفاتيح 2048 بت يوفر توقيعاً تشفيرياً أقوى. يجب دائماً تعطيل الترحيل المفتوح — فهو يسمح لأي شخص بإرسال بريد عبر خادمك (ترحيل البريد العشوائي).",
  },
  {
    id: 3,
    system: "Database Server",
    systemAr: "خادم قاعدة البيانات",
    scenario: "Secure a MySQL database server that stores customer PII and payment records.",
    scenarioAr: "قم بتأمين خادم قاعدة بيانات MySQL يخزن بيانات العملاء الشخصية وسجلات الدفع.",
    settings: [
      { name: "Network Binding", nameAr: "ربط الشبكة", options: ["0.0.0.0 (all interfaces)", "127.0.0.1 (localhost only)", "10.0.1.5 (app server subnet)"], optionsAr: ["0.0.0.0 (جميع الواجهات)", "127.0.0.1 (المضيف المحلي فقط)", "10.0.1.5 (شبكة خادم التطبيق)"], correct: 2 },
      { name: "Root Remote Login", nameAr: "تسجيل دخول Root عن بُعد", options: ["Allowed", "Disabled"], optionsAr: ["مسموح", "معطل"], correct: 1 },
      { name: "Encryption at Rest", nameAr: "التشفير في حالة السكون", options: ["Disabled", "TDE (Transparent Data Encryption)"], optionsAr: ["معطل", "TDE (تشفير البيانات الشفاف)"], correct: 1 },
    ],
    explanation: "Bind to the specific app server subnet IP — not all interfaces (exposes to internet) and not localhost only (app server can't connect). Disable root remote login to prevent brute-force attacks. Enable TDE for PII/payment data compliance (PCI-DSS requires encryption at rest).",
    explanationAr: "اربط بعنوان IP لشبكة خادم التطبيق المحددة — ليس جميع الواجهات (يعرض للإنترنت) وليس المضيف المحلي فقط (خادم التطبيق لا يمكنه الاتصال). عطّل تسجيل دخول root عن بُعد لمنع هجمات القوة الغاشمة. فعّل TDE لامتثال بيانات PII/الدفع (PCI-DSS يتطلب التشفير في حالة السكون).",
  },
];

export default function SecureInfraLab({ onComplete }: { onComplete?: (score?: number) => void }) {
  const { tx } = useLabLang();
  const [current, setCurrent] = useState(0);
  const [selections, setSelections] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const task = TASKS[current];

  const handleSelect = useCallback((settingIdx: number, optionIdx: number) => {
    if (showResult) return;
    setSelections(prev => {
      const next = [...prev];
      next[settingIdx] = optionIdx;
      return next;
    });
  }, [showResult]);

  const handleSubmit = useCallback(() => {
    if (selections.length < task.settings.length) return;
    setShowResult(true);
    const allCorrect = task.settings.every((s, i) => selections[i] === s.correct);
    if (allCorrect) setScore(s => s + 1);
  }, [selections, task]);

  const handleNext = useCallback(() => {
    if (current < TASKS.length - 1) { setCurrent(c => c + 1); setSelections([]); setShowResult(false); }
    else setCompleted(true);
  }, [current]);

  const reset = useCallback(() => { setCurrent(0); setSelections([]); setShowResult(false); setScore(0); setCompleted(false); }, []);

  return (
    <div className="bg-[#001A16] border-2 border-[#0A6B5A]/40 p-6 my-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Server className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Infrastructure Hardening Lab", "مختبر تقوية البنية التحتية")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("System", "نظام")} {current + 1}/{TASKS.length} - {tx("Score", "النتيجة")}: {score}/{TASKS.length}</p>
        </div>
      </div>

      {completed ? (
        <div className="text-center py-8">
          <Server className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Infrastructure Secured!", "تم تأمين البنية التحتية!")}</h4>
          <p className="text-[#C4B9A8] font-['Work_Sans'] mb-4">{tx(`You scored ${score}/${TASKS.length}!`, `حصلت على ${score}/${TASKS.length}!`)}</p>
          <button onClick={reset} className="flex items-center gap-2 mx-auto px-6 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all"><RotateCcw className="w-4 h-4" /> {tx("Play Again", "ابدأ من جديد")}</button>
        </div>
      ) : (
        <>
          <div className="bg-[#002F24]/50 border border-[#0A6B5A]/30 p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              {task.system.includes("Wireless") ? <Wifi className="w-4 h-4 text-[#D4AF37]" /> : <Server className="w-4 h-4 text-[#D4AF37]" />}
              <span className="text-[#D4AF37] font-['Montserrat'] font-bold text-sm">{tx(task.system, task.systemAr)}</span>
            </div>
            <p className="text-[#C4B9A8] font-['Work_Sans'] text-sm">{tx(task.scenario, task.scenarioAr)}</p>
          </div>

          <div className="space-y-4 mb-4">
            {task.settings.map((setting, si) => (
              <div key={si}>
                <p className="text-[#C4B9A8] font-['Montserrat'] text-xs font-semibold mb-2">{tx(setting.name, setting.nameAr)}:</p>
                <div className="grid grid-cols-2 gap-2">
                  {setting.options.map((opt, oi) => (
                    <button key={oi} onClick={() => handleSelect(si, oi)}
                      className={`p-2 border font-['Work_Sans'] text-xs transition-all text-left ${
                        showResult
                          ? oi === setting.correct ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]" : selections[si] === oi ? "border-red-500/50 bg-red-500/10 text-red-400" : "border-[#0A6B5A]/20 text-[#C4B9A8]/50"
                          : selections[si] === oi ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]" : "border-[#0A6B5A]/30 text-[#C4B9A8] hover:border-[#D4AF37]/50"
                      }`}>
                      {tx(opt, setting.optionsAr[oi])}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {!showResult ? (
            <button onClick={handleSubmit} disabled={selections.length < task.settings.length || selections.some(s => s === undefined)} className="px-6 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all disabled:opacity-40">{tx("Apply Configuration", "تطبيق التكوين")}</button>
          ) : (
            <div className="bg-[#0A3D33]/40 border border-[#0A6B5A]/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                {task.settings.every((s, i) => selections[i] === s.correct) ? <><CheckCircle className="w-5 h-5 text-[#D4AF37]" /><span className="text-[#D4AF37] font-['Montserrat'] font-bold text-sm">{tx("All Correct!", "كلها صحيحة!")}</span></> : <><XCircle className="w-5 h-5 text-red-400" /><span className="text-red-400 font-['Montserrat'] font-bold text-sm">{tx("Some settings incorrect", "بعض الإعدادات غير صحيحة")}</span></>}
              </div>
              <p className="text-[#C4B9A8] font-['Work_Sans'] text-sm">{tx(task.explanation, task.explanationAr)}</p>
              <button onClick={handleNext} className="mt-3 flex items-center gap-2 px-5 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all">
                {current < TASKS.length - 1 ? tx("Next System", "النظام التالي") : tx("See Results", "عرض النتائج")} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
