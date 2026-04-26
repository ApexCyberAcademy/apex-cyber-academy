/*
  Firewall Rule Builder Mini-Game
  Students build firewall rules to allow/block traffic based on scenarios.
  Maps to Security+ Module 1: Security Controls and Fundamental Concepts
  Bilingual: English + Arabic
*/

import { useState, useEffect, useCallback } from "react";
import { Shield, CheckCircle, XCircle, RotateCcw, Zap, AlertTriangle } from "lucide-react";
import { useLabLang } from "./labI18n";

type FirewallRule = {
  action: "ALLOW" | "DENY";
  protocol: "TCP" | "UDP" | "ICMP" | "ANY";
  sourceIp: string;
  destPort: string;
};

type Scenario = {
  id: number;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  hint: string;
  hintAr: string;
  expectedRules: Array<{
    action: "ALLOW" | "DENY";
    protocol: string;
    sourceIp: string;
    destPort: string;
  }>;
  trafficTests: Array<{
    description: string;
    descriptionAr: string;
    protocol: string;
    sourceIp: string;
    destPort: string;
    shouldAllow: boolean;
  }>;
};

const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "Web Server Protection",
    titleAr: "حماية خادم الويب",
    description: "Your company runs a public web server. You need to:\n• Allow HTTP (port 80) and HTTPS (port 443) from any source\n• Block all other inbound traffic",
    descriptionAr: "تدير شركتك خادم ويب عام. تحتاج إلى:\n• السماح بـ HTTP (المنفذ 80) و HTTPS (المنفذ 443) من أي مصدر\n• حظر جميع حركة المرور الواردة الأخرى",
    hint: "Create ALLOW rules for ports 80 and 443 with TCP protocol, then a DENY rule for everything else.",
    hintAr: "أنشئ قواعد سماح للمنافذ 80 و 443 مع بروتوكول TCP، ثم قاعدة حظر لكل شيء آخر.",
    expectedRules: [
      { action: "ALLOW", protocol: "TCP", sourceIp: "0.0.0.0/0", destPort: "80" },
      { action: "ALLOW", protocol: "TCP", sourceIp: "0.0.0.0/0", destPort: "443" },
      { action: "DENY", protocol: "ANY", sourceIp: "0.0.0.0/0", destPort: "*" },
    ],
    trafficTests: [
      { description: "HTTP request from 192.168.1.5", descriptionAr: "طلب HTTP من 192.168.1.5", protocol: "TCP", sourceIp: "192.168.1.5", destPort: "80", shouldAllow: true },
      { description: "HTTPS request from 10.0.0.1", descriptionAr: "طلب HTTPS من 10.0.0.1", protocol: "TCP", sourceIp: "10.0.0.1", destPort: "443", shouldAllow: true },
      { description: "SSH attempt from 172.16.0.1", descriptionAr: "محاولة SSH من 172.16.0.1", protocol: "TCP", sourceIp: "172.16.0.1", destPort: "22", shouldAllow: false },
      { description: "FTP from external host", descriptionAr: "FTP من مضيف خارجي", protocol: "TCP", sourceIp: "8.8.8.8", destPort: "21", shouldAllow: false },
    ],
  },
  {
    id: 2,
    title: "Internal Network Segmentation",
    titleAr: "تجزئة الشبكة الداخلية",
    description: "Secure the database server (internal only):\n• Allow MySQL (port 3306) only from the app server subnet 10.0.1.0/24\n• Allow SSH (port 22) only from admin subnet 10.0.0.0/24\n• Deny everything else",
    descriptionAr: "تأمين خادم قاعدة البيانات (داخلي فقط):\n• السماح بـ MySQL (المنفذ 3306) فقط من شبكة خادم التطبيق 10.0.1.0/24\n• السماح بـ SSH (المنفذ 22) فقط من شبكة المسؤولين 10.0.0.0/24\n• حظر كل شيء آخر",
    hint: "Use specific source IP ranges for MySQL and SSH, then deny all other traffic.",
    hintAr: "استخدم نطاقات IP محددة للمصدر لـ MySQL و SSH، ثم احظر كل حركة المرور الأخرى.",
    expectedRules: [
      { action: "ALLOW", protocol: "TCP", sourceIp: "10.0.1.0/24", destPort: "3306" },
      { action: "ALLOW", protocol: "TCP", sourceIp: "10.0.0.0/24", destPort: "22" },
      { action: "DENY", protocol: "ANY", sourceIp: "0.0.0.0/0", destPort: "*" },
    ],
    trafficTests: [
      { description: "App server DB query (10.0.1.50)", descriptionAr: "استعلام قاعدة بيانات من خادم التطبيق (10.0.1.50)", protocol: "TCP", sourceIp: "10.0.1.50", destPort: "3306", shouldAllow: true },
      { description: "Admin SSH (10.0.0.10)", descriptionAr: "SSH للمسؤول (10.0.0.10)", protocol: "TCP", sourceIp: "10.0.0.10", destPort: "22", shouldAllow: true },
      { description: "External DB access (8.8.8.8)", descriptionAr: "وصول خارجي لقاعدة البيانات (8.8.8.8)", protocol: "TCP", sourceIp: "8.8.8.8", destPort: "3306", shouldAllow: false },
      { description: "Dev SSH from wrong subnet (10.0.2.5)", descriptionAr: "SSH من شبكة خاطئة (10.0.2.5)", protocol: "TCP", sourceIp: "10.0.2.5", destPort: "22", shouldAllow: false },
    ],
  },
  {
    id: 3,
    title: "Block Ping Flood (DDoS Mitigation)",
    titleAr: "حظر هجوم Ping (تخفيف DDoS)",
    description: "Your server is under an ICMP flood attack:\n• Block all ICMP traffic from any source\n• Keep HTTP/HTTPS accessible\n• Block everything else",
    descriptionAr: "خادمك تحت هجوم إغراق ICMP:\n• حظر جميع حركة ICMP من أي مصدر\n• إبقاء HTTP/HTTPS متاحين\n• حظر كل شيء آخر",
    hint: "Create a DENY rule for ICMP protocol, ALLOW for HTTP/HTTPS, then deny the rest.",
    hintAr: "أنشئ قاعدة حظر لبروتوكول ICMP، وسماح لـ HTTP/HTTPS، ثم احظر الباقي.",
    expectedRules: [
      { action: "DENY", protocol: "ICMP", sourceIp: "0.0.0.0/0", destPort: "*" },
      { action: "ALLOW", protocol: "TCP", sourceIp: "0.0.0.0/0", destPort: "80" },
      { action: "ALLOW", protocol: "TCP", sourceIp: "0.0.0.0/0", destPort: "443" },
      { action: "DENY", protocol: "ANY", sourceIp: "0.0.0.0/0", destPort: "*" },
    ],
    trafficTests: [
      { description: "Ping from attacker", descriptionAr: "Ping من المهاجم", protocol: "ICMP", sourceIp: "45.33.32.156", destPort: "*", shouldAllow: false },
      { description: "Legitimate web request", descriptionAr: "طلب ويب شرعي", protocol: "TCP", sourceIp: "192.168.1.1", destPort: "80", shouldAllow: true },
      { description: "HTTPS traffic", descriptionAr: "حركة HTTPS", protocol: "TCP", sourceIp: "10.0.0.1", destPort: "443", shouldAllow: true },
      { description: "Telnet attempt", descriptionAr: "محاولة Telnet", protocol: "TCP", sourceIp: "172.16.0.1", destPort: "23", shouldAllow: false },
    ],
  },
];

function evaluateRules(rules: FirewallRule[], test: { protocol: string; sourceIp: string; destPort: string }): boolean {
  for (const rule of rules) {
    const protocolMatch = rule.protocol === "ANY" || rule.protocol === test.protocol;
    const sourceMatch = rule.sourceIp === "0.0.0.0/0" || rule.sourceIp === "*" || test.sourceIp.startsWith(rule.sourceIp.replace("/24", "").replace(/\.\d+$/, ""));
    const portMatch = rule.destPort === "*" || rule.destPort === test.destPort;

    if (protocolMatch && sourceMatch && portMatch) {
      return rule.action === "ALLOW";
    }
  }
  return false; // Default deny
}

export default function FirewallRuleBuilder({ onComplete }: { onComplete?: (score?: number) => void }) {
  const { tx } = useLabLang();
  const [currentScenario, setCurrentScenario] = useState(0);
  const [rules, setRules] = useState<FirewallRule[]>([]);
  const [newRule, setNewRule] = useState<FirewallRule>({
    action: "ALLOW",
    protocol: "TCP",
    sourceIp: "0.0.0.0/0",
    destPort: "80",
  });
  const [testResults, setTestResults] = useState<Array<{ passed: boolean; description: string; descriptionAr: string }> | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const scenario = SCENARIOS[currentScenario];

  const addRule = useCallback(() => {
    setRules(prev => [...prev, { ...newRule }]);
    setTestResults(null);
  }, [newRule]);

  const removeRule = useCallback((index: number) => {
    setRules(prev => prev.filter((_, i) => i !== index));
    setTestResults(null);
  }, []);

  const moveRule = useCallback((index: number, direction: "up" | "down") => {
    setRules(prev => {
      const next = [...prev];
      const swapIdx = direction === "up" ? index - 1 : index + 1;
      if (swapIdx < 0 || swapIdx >= next.length) return prev;
      [next[index], next[swapIdx]] = [next[swapIdx], next[index]];
      return next;
    });
    setTestResults(null);
  }, []);

  const testRules = useCallback(() => {
    const results = scenario.trafficTests.map(test => {
      const allowed = evaluateRules(rules, test);
      return {
        passed: allowed === test.shouldAllow,
        description: test.description,
        descriptionAr: test.descriptionAr,
      };
    });
    setTestResults(results);

    const allPassed = results.every(r => r.passed);
    if (allPassed) {
      setScore(prev => prev + 1);
      if (currentScenario === SCENARIOS.length - 1) {
        setCompleted(true);
      }
    }
  }, [rules, scenario, currentScenario]);

  const nextScenario = useCallback(() => {
    if (currentScenario < SCENARIOS.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setRules([]);
      setTestResults(null);
      setShowHint(false);
    }
  }, [currentScenario]);

  const reset = useCallback(() => {
    setCurrentScenario(0);
    setRules([]);
    setTestResults(null);
    setShowHint(false);
    setScore(0);
    setCompleted(false);
  }, []);

  const allPassed = testResults?.every(r => r.passed) ?? false;

  // Call onComplete when all scenarios are done
  useEffect(() => {
    if (currentScenario >= SCENARIOS.length && onComplete) {
      onComplete(score);
    }
  }, [currentScenario]);

  return (
    <div className="bg-[#001A16] border-2 border-[#0A6B5A]/40 p-6 my-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center">
          <Shield className="w-5 h-5 text-[#D4AF37]" />
        </div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">
            {tx("Firewall Rule Builder", "بناء قواعد جدار الحماية")}
          </h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">
            {tx("Scenario", "السيناريو")} {currentScenario + 1}/{SCENARIOS.length} - {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}
          </p>
        </div>
      </div>

      {completed ? (
        <div className="text-center py-8">
          <CheckCircle className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">
            {tx("Challenge Complete!", "اكتمل التحدي!")}
          </h4>
          <p className="text-[#C4B9A8] font-['Work_Sans'] mb-4">
            {tx(
              `You scored ${score}/${SCENARIOS.length}. You understand how firewall rules work!`,
              `حصلت على ${score}/${SCENARIOS.length}. أنت تفهم كيف تعمل قواعد جدار الحماية!`
            )}
          </p>
          <button onClick={reset} className="flex items-center gap-2 mx-auto px-6 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all">
            <RotateCcw className="w-4 h-4" /> {tx("Play Again", "ابدأ من جديد")}
          </button>
        </div>
      ) : (
        <>
          {/* Scenario Description */}
          <div className="bg-[#002F24]/50 border border-[#0A6B5A]/30 p-4 mb-4">
            <h4 className="text-[#E8E0D4] font-['Montserrat'] text-sm font-bold mb-2">
              {tx(scenario.title, scenario.titleAr)}
            </h4>
            <p className="text-[#C4B9A8] font-['Work_Sans'] text-sm whitespace-pre-line">
              {tx(scenario.description, scenario.descriptionAr)}
            </p>
          </div>

          {/* Rule Builder */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 items-end mb-3">
              <div>
                <label className="text-[#C4B9A8] font-['Montserrat'] text-xs font-semibold block mb-1">
                  {tx("Action", "الإجراء")}
                </label>
                <select
                  value={newRule.action}
                  onChange={e => setNewRule(prev => ({ ...prev, action: e.target.value as "ALLOW" | "DENY" }))}
                  className="bg-[#0A3D33] border border-[#0A6B5A]/50 text-[#E8E0D4] font-['Work_Sans'] text-sm px-3 py-2 focus:border-[#D4AF37] outline-none"
                >
                  <option value="ALLOW">ALLOW</option>
                  <option value="DENY">DENY</option>
                </select>
              </div>
              <div>
                <label className="text-[#C4B9A8] font-['Montserrat'] text-xs font-semibold block mb-1">
                  {tx("Protocol", "البروتوكول")}
                </label>
                <select
                  value={newRule.protocol}
                  onChange={e => setNewRule(prev => ({ ...prev, protocol: e.target.value as FirewallRule["protocol"] }))}
                  className="bg-[#0A3D33] border border-[#0A6B5A]/50 text-[#E8E0D4] font-['Work_Sans'] text-sm px-3 py-2 focus:border-[#D4AF37] outline-none"
                >
                  <option value="TCP">TCP</option>
                  <option value="UDP">UDP</option>
                  <option value="ICMP">ICMP</option>
                  <option value="ANY">ANY</option>
                </select>
              </div>
              <div>
                <label className="text-[#C4B9A8] font-['Montserrat'] text-xs font-semibold block mb-1">
                  {tx("Source IP", "عنوان IP المصدر")}
                </label>
                <input
                  type="text"
                  value={newRule.sourceIp}
                  onChange={e => setNewRule(prev => ({ ...prev, sourceIp: e.target.value }))}
                  className="bg-[#0A3D33] border border-[#0A6B5A]/50 text-[#E8E0D4] font-['Work_Sans'] text-sm px-3 py-2 w-40 focus:border-[#D4AF37] outline-none"
                  placeholder="0.0.0.0/0"
                />
              </div>
              <div>
                <label className="text-[#C4B9A8] font-['Montserrat'] text-xs font-semibold block mb-1">
                  {tx("Dest Port", "منفذ الوجهة")}
                </label>
                <input
                  type="text"
                  value={newRule.destPort}
                  onChange={e => setNewRule(prev => ({ ...prev, destPort: e.target.value }))}
                  className="bg-[#0A3D33] border border-[#0A6B5A]/50 text-[#E8E0D4] font-['Work_Sans'] text-sm px-3 py-2 w-24 focus:border-[#D4AF37] outline-none"
                  placeholder="80"
                />
              </div>
              <button
                onClick={addRule}
                className="px-4 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all"
              >
                {tx("+ Add Rule", "+ أضف قاعدة")}
              </button>
            </div>

            {/* Rule Table */}
            {rules.length > 0 && (
              <div className="border border-[#0A6B5A]/30 mb-3">
                <div className="grid grid-cols-[60px_80px_80px_150px_80px_80px] gap-0 bg-[#0A3D33]/50 px-3 py-2 text-[#D4AF37] font-['Montserrat'] text-xs font-bold">
                  <span>#</span><span>{tx("Action", "الإجراء")}</span><span>{tx("Proto", "البروتوكول")}</span><span>{tx("Source IP", "المصدر")}</span><span>{tx("Port", "المنفذ")}</span><span></span>
                </div>
                {rules.map((rule, idx) => (
                  <div key={idx} className="grid grid-cols-[60px_80px_80px_150px_80px_80px] gap-0 px-3 py-2 border-t border-[#0A6B5A]/20 text-[#E8E0D4] font-['Work_Sans'] text-sm items-center">
                    <span className="text-[#C4B9A8]">{idx + 1}</span>
                    <span className={rule.action === "ALLOW" ? "text-green-400" : "text-red-400"}>{rule.action}</span>
                    <span>{rule.protocol}</span>
                    <span className="text-[#C4B9A8] text-xs">{rule.sourceIp}</span>
                    <span>{rule.destPort}</span>
                    <div className="flex gap-1">
                      <button onClick={() => moveRule(idx, "up")} className="text-[#C4B9A8] hover:text-[#D4AF37] text-xs" disabled={idx === 0}>▲</button>
                      <button onClick={() => moveRule(idx, "down")} className="text-[#C4B9A8] hover:text-[#D4AF37] text-xs" disabled={idx === rules.length - 1}>▼</button>
                      <button onClick={() => removeRule(idx)} className="text-red-400 hover:text-red-300 text-xs ml-1">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="text-[#C4B9A8]/60 font-['Work_Sans'] text-xs italic mb-3">
              {tx(
                "Rules are evaluated top-to-bottom. First matching rule wins. Order matters!",
                "يتم تقييم القواعد من الأعلى إلى الأسفل. أول قاعدة مطابقة تفوز. الترتيب مهم!"
              )}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={testRules}
              disabled={rules.length === 0}
              className="flex items-center gap-2 px-5 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Zap className="w-4 h-4" /> {tx("Test Rules", "اختبر القواعد")}
            </button>
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 px-5 py-2 border border-[#0A6B5A]/50 text-[#C4B9A8] font-['Montserrat'] font-semibold text-sm hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition-all"
            >
              <AlertTriangle className="w-4 h-4" /> {showHint ? tx("Hide Hint", "إخفاء التلميح") : tx("Show Hint", "عرض التلميح")}
            </button>
            {allPassed && currentScenario < SCENARIOS.length - 1 && (
              <button
                onClick={nextScenario}
                className="flex items-center gap-2 px-5 py-2 bg-[#0A6B5A] text-[#E8E0D4] font-['Montserrat'] font-bold text-sm hover:bg-[#0A6B5A]/80 transition-all"
              >
                {tx("Next Scenario →", "السيناريو التالي →")}
              </button>
            )}
          </div>

          {showHint && (
            <div className="bg-[#0A3D33]/30 border border-[#D4AF37]/20 p-3 mb-4">
              <p className="text-[#D4AF37] font-['Work_Sans'] text-sm">{tx(scenario.hint, scenario.hintAr)}</p>
            </div>
          )}

          {/* Test Results */}
          {testResults && (
            <div className="border border-[#0A6B5A]/30 p-4">
              <h5 className="text-[#E8E0D4] font-['Montserrat'] text-sm font-bold mb-3">
                {tx("Traffic Test Results:", "نتائج اختبار حركة المرور:")}
              </h5>
              <div className="space-y-2">
                {testResults.map((result, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    {result.passed ? (
                      <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                    <span className={`font-['Work_Sans'] text-sm ${result.passed ? "text-[#E8E0D4]" : "text-red-300"}`}>
                      {tx(result.description, result.descriptionAr)} - {result.passed ? tx("CORRECT", "صحيح") : tx("INCORRECT", "خطأ")}
                    </span>
                  </div>
                ))}
              </div>
              {allPassed && (
                <div className="mt-3 pt-3 border-t border-[#0A6B5A]/20">
                  <p className="text-[#D4AF37] font-['Montserrat'] text-sm font-bold">
                    {tx("All tests passed! Great work!", "نجحت جميع الاختبارات! عمل رائع!")}
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
