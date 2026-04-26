/*
  Routing Protocol Lab - Network+ Day 4
  Students identify routing protocols and their characteristics.
  Bilingual: English + Arabic
*/
import { useState, useEffect, useCallback } from "react";
import { Route, CheckCircle, XCircle, RotateCcw, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Scenario = { id: number; scenario: string; scenarioAr: string; correct: string; options: string[]; optionsAr: string[]; explanation: string; explanationAr: string };

const SCENARIOS: Scenario[] = [{"id": 1, "scenario": "A company has a large enterprise network with multiple paths to each destination. They need a routing protocol that converges quickly and scales well. Which protocol should they use?", "scenarioAr": "شركة لديها شبكة مؤسسية كبيرة مع مسارات متعددة لكل وجهة. يحتاجون بروتوكول توجيه يتقارب بسرعة ويتوسع بشكل جيد. أي بروتوكول يجب استخدامه؟", "correct": "OSPF — link-state protocol with fast convergence and hierarchical design", "options": ["RIPv2 — simple distance-vector protocol", "OSPF — link-state protocol with fast convergence and hierarchical design", "Static routing — manually configured routes", "Default route only"], "optionsAr": ["RIPv2 — بروتوكول متجه المسافة البسيط", "OSPF — بروتوكول حالة الرابط مع تقارب سريع وتصميم هرمي", "التوجيه الثابت — مسارات مُعدة يدوياً", "المسار الافتراضي فقط"], "explanation": "OSPF (Open Shortest Path First) is a link-state protocol ideal for large networks. It uses Dijkstra's algorithm for fast convergence, supports hierarchical design with areas (reducing routing table size), and has no hop count limit (unlike RIP's 15-hop max). It's the most widely deployed IGP.", "explanationAr": "OSPF (أقصر مسار أولاً المفتوح) هو بروتوكول حالة الرابط مثالي للشبكات الكبيرة. يستخدم خوارزمية Dijkstra للتقارب السريع، يدعم التصميم الهرمي بالمناطق، وليس لديه حد لعدد القفزات."}, {"id": 2, "scenario": "What is the administrative distance (AD) used for in routing?", "scenarioAr": "ما الذي يُستخدم له المسافة الإدارية (AD) في التوجيه؟", "correct": "To determine which routing source is most trustworthy when multiple protocols provide routes to the same destination", "options": ["To calculate the physical distance between routers", "To determine which routing source is most trustworthy when multiple protocols provide routes to the same destination", "To limit the number of hops a packet can take", "To measure network latency"], "optionsAr": ["لحساب المسافة الفيزيائية بين أجهزة التوجيه", "لتحديد أي مصدر توجيه هو الأكثر موثوقية عندما توفر عدة بروتوكولات مسارات لنفس الوجهة", "للحد من عدد القفزات التي يمكن للحزمة أخذها", "لقياس تأخر الشبكة"], "explanation": "Administrative Distance is a value (0-255) that ranks the trustworthiness of routing sources. Lower AD = more trusted. Connected routes (AD 0) > Static (AD 1) > OSPF (AD 110) > RIP (AD 120). When multiple protocols offer routes to the same destination, the route with the lowest AD wins.", "explanationAr": "المسافة الإدارية هي قيمة (0-255) تصنف موثوقية مصادر التوجيه. AD أقل = أكثر موثوقية. المسارات المتصلة (AD 0) > الثابتة (AD 1) > OSPF (AD 110) > RIP (AD 120)."}, {"id": 3, "scenario": "Which routing protocol is used to exchange routing information between different autonomous systems on the internet?", "scenarioAr": "أي بروتوكول توجيه يُستخدم لتبادل معلومات التوجيه بين أنظمة مستقلة مختلفة على الإنترنت؟", "correct": "BGP (Border Gateway Protocol) — the routing protocol of the internet", "options": ["OSPF", "EIGRP", "BGP (Border Gateway Protocol) — the routing protocol of the internet", "RIPv2"], "optionsAr": ["OSPF", "EIGRP", "BGP (بروتوكول بوابة الحدود) — بروتوكول توجيه الإنترنت", "RIPv2"], "explanation": "BGP is the only EGP (Exterior Gateway Protocol) in use today. It exchanges routing information between autonomous systems (AS) — the large networks operated by ISPs, cloud providers, and enterprises. BGP makes the internet work by determining the best path across multiple AS boundaries.", "explanationAr": "BGP هو بروتوكول البوابة الخارجية (EGP) الوحيد المستخدم اليوم. يتبادل معلومات التوجيه بين الأنظمة المستقلة (AS) — الشبكات الكبيرة التي يديرها مزودو الإنترنت ومزودو السحابة والمؤسسات."}];

export default function RoutingProtocolLab({ onComplete }: { onComplete?: (score?: number) => void }) {
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
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Route className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Routing Protocol Lab", "مختبر بروتوكولات التوجيه")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} — {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>
      {completed ? (
        <div className="text-center py-8">
          <Route className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Routing Expert!", "خبير التوجيه!")}</h4>
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
