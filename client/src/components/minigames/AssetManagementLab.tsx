/*
  Asset Management & Secure Computing Lab
  Students classify assets and assign security controls.
  Maps to Security+ Day 10: Securing Computing Resources and Asset Management
  Bilingual: English + Arabic
*/

import { useState, useEffect, useCallback } from "react";
import { Monitor, CheckCircle, XCircle, RotateCcw, ArrowRight, Laptop } from "lucide-react";
import { useLabLang } from "./labI18n";

type Asset = {
  id: number;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  correctCategory: string;
  categories: string[];
  categoriesAr: string[];
  correctControls: number[];
  controls: string[];
  controlsAr: string[];
  explanation: string;
  explanationAr: string;
};

const ASSETS: Asset[] = [
  {
    id: 1, name: "CEO's Laptop", nameAr: "حاسوب المدير التنفيذي",
    description: "Executive laptop containing board meeting notes, M&A documents, and strategic plans. Used for travel and remote work.",
    descriptionAr: "حاسوب تنفيذي يحتوي على محاضر اجتماعات مجلس الإدارة ووثائق الاندماج والاستحواذ والخطط الاستراتيجية. يُستخدم للسفر والعمل عن بُعد.",
    correctCategory: "Critical / High-Value",
    categories: ["Standard", "Critical / High-Value", "Low-Value / Disposable", "Shared / Public"],
    categoriesAr: ["قياسي", "حرج / عالي القيمة", "منخفض القيمة / قابل للتخلص", "مشترك / عام"],
    correctControls: [0, 1, 3],
    controls: ["Full Disk Encryption (FDE)", "Remote Wipe Capability", "Standard Antivirus Only", "Privileged Access Management (PAM)", "No special controls needed"],
    controlsAr: ["تشفير القرص الكامل (FDE)", "قدرة المسح عن بُعد", "مضاد فيروسات قياسي فقط", "إدارة الوصول المميز (PAM)", "لا حاجة لضوابط خاصة"],
    explanation: "CEO's laptop is critical — it contains the most sensitive corporate data. FDE protects data if stolen, remote wipe enables data destruction, and PAM ensures only authorized access to sensitive files. Standard AV alone is insufficient for this asset class.",
    explanationAr: "حاسوب المدير التنفيذي حرج — يحتوي على أكثر بيانات الشركة حساسية. FDE يحمي البيانات إذا سُرق، المسح عن بُعد يمكّن تدمير البيانات، و PAM يضمن الوصول المصرح فقط للملفات الحساسة.",
  },
  {
    id: 2, name: "Lobby Kiosk", nameAr: "كشك الاستقبال",
    description: "A touch-screen kiosk in the building lobby that displays a company directory and allows visitors to check in.",
    descriptionAr: "كشك بشاشة لمس في ردهة المبنى يعرض دليل الشركة ويسمح للزوار بتسجيل الدخول.",
    correctCategory: "Shared / Public",
    categories: ["Standard", "Critical / High-Value", "Low-Value / Disposable", "Shared / Public"],
    categoriesAr: ["قياسي", "حرج / عالي القيمة", "منخفض القيمة / قابل للتخلص", "مشترك / عام"],
    correctControls: [0, 2],
    controls: ["Kiosk mode (locked-down browser)", "Full admin access", "Network isolation (guest VLAN)", "VPN connection to corporate network", "No controls needed"],
    controlsAr: ["وضع الكشك (متصفح مقفل)", "وصول إداري كامل", "عزل الشبكة (VLAN ضيف)", "اتصال VPN بشبكة الشركة", "لا حاجة لضوابط"],
    explanation: "Public kiosks must run in locked-down kiosk mode (preventing access to OS or other apps) and be on an isolated network segment. They should never have admin access or direct corporate network connectivity.",
    explanationAr: "الأكشاك العامة يجب أن تعمل في وضع الكشك المقفل (منع الوصول لنظام التشغيل أو تطبيقات أخرى) وأن تكون على شريحة شبكة معزولة. يجب ألا يكون لديها وصول إداري أو اتصال مباشر بشبكة الشركة.",
  },
  {
    id: 3, name: "Development Server", nameAr: "خادم التطوير",
    description: "An internal server used by the engineering team for testing new features. Contains test data (anonymized copies of production data) and source code.",
    descriptionAr: "خادم داخلي يستخدمه فريق الهندسة لاختبار الميزات الجديدة. يحتوي على بيانات اختبار (نسخ مجهولة من بيانات الإنتاج) وكود المصدر.",
    correctCategory: "Standard",
    categories: ["Standard", "Critical / High-Value", "Low-Value / Disposable", "Shared / Public"],
    categoriesAr: ["قياسي", "حرج / عالي القيمة", "منخفض القيمة / قابل للتخلص", "مشترك / عام"],
    correctControls: [0, 1, 2],
    controls: ["Access control (dev team only)", "Network segmentation from production", "Code repository access logging", "Public internet exposure", "No monitoring needed"],
    controlsAr: ["التحكم بالوصول (فريق التطوير فقط)", "تقسيم الشبكة عن الإنتاج", "تسجيل الوصول لمستودع الكود", "التعرض للإنترنت العام", "لا حاجة للمراقبة"],
    explanation: "Dev servers need access control (only dev team), network segmentation (prevent lateral movement to production), and code access logging (audit trail for IP protection). They should never be publicly exposed.",
    explanationAr: "خوادم التطوير تحتاج للتحكم بالوصول (فريق التطوير فقط)، تقسيم الشبكة (منع الحركة الجانبية للإنتاج)، وتسجيل الوصول للكود (مسار تدقيق لحماية الملكية الفكرية). يجب ألا تكون معرضة للعامة أبداً.",
  },
];

export default function AssetManagementLab({ onComplete }: { onComplete?: (score?: number) => void }) {
  const { tx } = useLabLang();
  const [current, setCurrent] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedControls, setSelectedControls] = useState<Set<number>>(new Set());
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const asset = ASSETS[current];

  const toggleControl = useCallback((idx: number) => {
    if (showResult) return;
    setSelectedControls(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  }, [showResult]);

  const handleSubmit = useCallback(() => {
    if (selectedCategory === null) return;
    setShowResult(true);
    const catCorrect = asset.categories[selectedCategory] === asset.correctCategory;
    const ctrlCorrect = asset.correctControls.length === selectedControls.size && asset.correctControls.every(c => selectedControls.has(c));
    if (catCorrect && ctrlCorrect) setScore(s => s + 1);
  }, [selectedCategory, selectedControls, asset]);

  const handleNext = useCallback(() => {
    if (current < ASSETS.length - 1) { setCurrent(c => c + 1); setSelectedCategory(null); setSelectedControls(new Set()); setShowResult(false); }
    else setCompleted(true);
  }, [current]);

  const reset = useCallback(() => { setCurrent(0); setSelectedCategory(null); setSelectedControls(new Set()); setShowResult(false); setScore(0); setCompleted(false); }, []);

  return (
    <div className="bg-[#001A16] border-2 border-[#0A6B5A]/40 p-6 my-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Monitor className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Asset Classification Lab", "مختبر تصنيف الأصول")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Asset", "أصل")} {current + 1}/{ASSETS.length} - {tx("Score", "النتيجة")}: {score}/{ASSETS.length}</p>
        </div>
      </div>

      {completed ? (
        <div className="text-center py-8">
          <Laptop className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Asset Manager!", "مدير الأصول!")}</h4>
          <p className="text-[#C4B9A8] font-['Work_Sans'] mb-4">{tx(`You scored ${score}/${ASSETS.length}!`, `حصلت على ${score}/${ASSETS.length}!`)}</p>
          <button onClick={reset} className="flex items-center gap-2 mx-auto px-6 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all"><RotateCcw className="w-4 h-4" /> {tx("Play Again", "ابدأ من جديد")}</button>
        </div>
      ) : (
        <>
          <div className="bg-[#002F24]/50 border border-[#0A6B5A]/30 p-4 mb-4">
            <h4 className="text-[#E8E0D4] font-['Montserrat'] font-bold text-sm mb-2">{tx(asset.name, asset.nameAr)}</h4>
            <p className="text-[#C4B9A8] font-['Work_Sans'] text-sm">{tx(asset.description, asset.descriptionAr)}</p>
          </div>

          <p className="text-[#C4B9A8] font-['Montserrat'] text-xs font-semibold mb-2">{tx("1. Classify this asset:", "1. صنّف هذا الأصل:")}</p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {asset.categories.map((cat, i) => (
              <button key={i} onClick={() => !showResult && setSelectedCategory(i)}
                className={`p-2 border font-['Work_Sans'] text-xs transition-all ${
                  showResult
                    ? cat === asset.correctCategory ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]" : selectedCategory === i ? "border-red-500/50 bg-red-500/10 text-red-400" : "border-[#0A6B5A]/20 text-[#C4B9A8]/50"
                    : selectedCategory === i ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]" : "border-[#0A6B5A]/30 text-[#C4B9A8] hover:border-[#D4AF37]/50"
                }`}>
                {tx(cat, asset.categoriesAr[i])}
              </button>
            ))}
          </div>

          <p className="text-[#C4B9A8] font-['Montserrat'] text-xs font-semibold mb-2">{tx("2. Select appropriate security controls:", "2. اختر ضوابط الأمان المناسبة:")}</p>
          <div className="space-y-2 mb-4">
            {asset.controls.map((ctrl, i) => (
              <button key={i} onClick={() => toggleControl(i)}
                className={`w-full text-left p-2 border font-['Work_Sans'] text-xs transition-all ${
                  showResult
                    ? asset.correctControls.includes(i) ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]" : selectedControls.has(i) ? "border-red-500/50 bg-red-500/10 text-red-400" : "border-[#0A6B5A]/20 text-[#C4B9A8]/50"
                    : selectedControls.has(i) ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]" : "border-[#0A6B5A]/30 text-[#C4B9A8] hover:border-[#D4AF37]/50"
                }`}>
                <div className="flex items-center gap-2">
                  <div className={`w-4 h-4 border flex items-center justify-center ${selectedControls.has(i) ? "border-[#D4AF37] bg-[#D4AF37]/20" : "border-[#0A6B5A]/50"}`}>
                    {selectedControls.has(i) && <CheckCircle className="w-3 h-3 text-[#D4AF37]" />}
                  </div>
                  {tx(ctrl, asset.controlsAr[i])}
                </div>
              </button>
            ))}
          </div>

          {!showResult ? (
            <button onClick={handleSubmit} disabled={selectedCategory === null} className="px-6 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all disabled:opacity-40">{tx("Submit", "إرسال")}</button>
          ) : (
            <div className="bg-[#0A3D33]/40 border border-[#0A6B5A]/30 p-4">
              <p className="text-[#C4B9A8] font-['Work_Sans'] text-sm">{tx(asset.explanation, asset.explanationAr)}</p>
              <button onClick={handleNext} className="mt-3 flex items-center gap-2 px-5 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all">
                {current < ASSETS.length - 1 ? tx("Next Asset", "الأصل التالي") : tx("See Results", "عرض النتائج")} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
