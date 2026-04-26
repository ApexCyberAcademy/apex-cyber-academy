/*
  Switch Configuration Lab - Network+ Day 3
  Students configure VLANs and switch ports.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { GitBranch, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [{"id": 1, "scenario": "You need to separate HR and Engineering departments on the same physical switch for security. What technology should you implement?", "scenarioAr": "تحتاج لفصل أقسام الموارد البشرية والهندسة على نفس المحول الفيزيائي للأمان. أي تقنية يجب تطبيقها؟", "correct": "VLANs — create separate broadcast domains on one physical switch", "options": ["Port mirroring", "VLANs — create separate broadcast domains on one physical switch", "Link aggregation", "Spanning Tree Protocol"], "optionsAr": ["نسخ المنافذ", "VLANs — إنشاء نطاقات بث منفصلة على محول فيزيائي واحد", "تجميع الروابط", "بروتوكول الشجرة الممتدة"], "explanation": "VLANs (Virtual LANs) logically segment a physical switch into separate broadcast domains. HR traffic stays in VLAN 10, Engineering in VLAN 20 — they can't communicate without a Layer 3 device (router or L3 switch). This provides security isolation without buying separate switches.", "explanationAr": "VLANs (الشبكات المحلية الافتراضية) تقسم منطقياً محولاً فيزيائياً إلى نطاقات بث منفصلة. حركة مرور الموارد البشرية تبقى في VLAN 10، الهندسة في VLAN 20 — لا يمكنهم التواصل بدون جهاز الطبقة 3."}, {"id": 2, "scenario": "Two switches need to carry traffic for VLANs 10, 20, and 30 between them over a single cable. What type of port configuration is needed on the interconnecting ports?", "scenarioAr": "محولان يحتاجان لنقل حركة مرور VLANs 10 و 20 و 30 بينهما عبر كابل واحد. أي نوع تكوين منفذ مطلوب على المنافذ المتصلة؟", "correct": "Trunk port — carries multiple VLANs using 802.1Q tagging", "options": ["Access port assigned to VLAN 10", "Trunk port — carries multiple VLANs using 802.1Q tagging", "Port channel with LACP", "Monitor/SPAN port"], "optionsAr": ["منفذ وصول مخصص لـ VLAN 10", "منفذ trunk — ينقل عدة VLANs باستخدام وسم 802.1Q", "قناة منفذ مع LACP", "منفذ مراقبة/SPAN"], "explanation": "Trunk ports carry traffic for multiple VLANs over a single link using 802.1Q tagging. Each frame is tagged with its VLAN ID so the receiving switch knows which VLAN it belongs to. Access ports carry only one VLAN's traffic (untagged). Trunking is essential for multi-switch VLAN deployments.", "explanationAr": "منافذ trunk تنقل حركة مرور عدة VLANs عبر رابط واحد باستخدام وسم 802.1Q. كل إطار يُوسم بمعرف VLAN الخاص به حتى يعرف المحول المستقبل أي VLAN ينتمي إليه."}, {"id": 3, "scenario": "What is the purpose of Spanning Tree Protocol (STP) in a switched network?", "scenarioAr": "ما هو الغرض من بروتوكول الشجرة الممتدة (STP) في شبكة محولة؟", "correct": "Prevents Layer 2 switching loops by blocking redundant paths", "options": ["Encrypts traffic between switches", "Prevents Layer 2 switching loops by blocking redundant paths", "Assigns IP addresses to switch ports", "Balances traffic across multiple switches"], "optionsAr": ["يشفر حركة المرور بين المحولات", "يمنع حلقات التبديل في الطبقة 2 بحظر المسارات الزائدة", "يعيّن عناوين IP لمنافذ المحول", "يوازن حركة المرور عبر عدة محولات"], "explanation": "STP (IEEE 802.1D) prevents broadcast storms caused by Layer 2 loops. When redundant paths exist between switches, STP elects a root bridge and blocks redundant ports, creating a loop-free topology. If an active link fails, STP unblocks a backup path for failover.", "explanationAr": "STP (IEEE 802.1D) يمنع عواصف البث الناتجة عن حلقات الطبقة 2. عندما توجد مسارات زائدة بين المحولات، STP ينتخب جسراً جذرياً ويحظر المنافذ الزائدة، مما ينشئ طوبولوجيا خالية من الحلقات."}];

export default function SwitchConfigLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><GitBranch className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Switch Configuration Lab", "مختبر تكوين المحولات")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <GitBranch className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Switch Config Pro!", "محترف تكوين المحولات!")}</h4>
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
