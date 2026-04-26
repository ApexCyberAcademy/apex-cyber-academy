/*
  Data Protection & Recovery Lab
  Students design backup and recovery strategies for different scenarios.
  Maps to Security+ Day 9: Data Protection, Resilience, and Recovery
  Bilingual: English + Arabic
*/

import { useState, useEffect, useCallback } from "react";
import { Database, CheckCircle, XCircle, RotateCcw, ArrowRight, HardDrive } from "lucide-react";
import { useLabLang } from "./labI18n";

type RecoveryScenario = {
  id: number;
  title: string;
  titleAr: string;
  scenario: string;
  scenarioAr: string;
  rtoRequired: string;
  rpoRequired: string;
  correctStrategy: string;
  options: string[];
  optionsAr: string[];
  explanation: string;
  explanationAr: string;
};

const SCENARIOS: RecoveryScenario[] = [
  {
    id: 1,
    title: "Hospital Patient Records System",
    titleAr: "نظام سجلات المرضى في المستشفى",
    scenario: "A hospital's electronic health records (EHR) system must be available 24/7. Patient lives depend on immediate access to medical histories, allergies, and current medications.",
    scenarioAr: "يجب أن يكون نظام السجلات الصحية الإلكترونية (EHR) في المستشفى متاحاً على مدار الساعة. تعتمد حياة المرضى على الوصول الفوري للتاريخ الطبي والحساسية والأدوية الحالية.",
    rtoRequired: "< 15 minutes",
    rpoRequired: "< 1 minute (near-zero data loss)",
    correctStrategy: "Hot site + Synchronous replication + Automated failover",
    options: [
      "Weekly full backup to tape + Cold site",
      "Daily differential backup + Warm site",
      "Hot site + Synchronous replication + Automated failover",
      "Cloud backup + Manual restoration procedure",
    ],
    optionsAr: [
      "نسخ احتياطي كامل أسبوعي على شريط + موقع بارد",
      "نسخ احتياطي تفاضلي يومي + موقع دافئ",
      "موقع ساخن + نسخ متزامن + تجاوز فشل تلقائي",
      "نسخ احتياطي سحابي + إجراء استعادة يدوي",
    ],
    explanation: "A hospital EHR requires near-zero RTO and RPO. Hot site provides immediate failover capability, synchronous replication ensures no data loss (RPO ≈ 0), and automated failover eliminates manual intervention delays. This is the most expensive but necessary for life-critical systems.",
    explanationAr: "نظام EHR في المستشفى يتطلب RTO و RPO قريبة من الصفر. الموقع الساخن يوفر قدرة تجاوز فشل فورية، النسخ المتزامن يضمن عدم فقدان البيانات (RPO ≈ 0)، والتجاوز التلقائي يلغي تأخيرات التدخل اليدوي.",
  },
  {
    id: 2,
    title: "E-commerce Product Catalog",
    titleAr: "كتالوج منتجات التجارة الإلكترونية",
    scenario: "An online store's product catalog (images, descriptions, prices) is updated weekly. The catalog generates $50K/day in revenue. Downtime during business hours is costly but not life-threatening.",
    scenarioAr: "كتالوج منتجات متجر إلكتروني (صور، أوصاف، أسعار) يُحدث أسبوعياً. يولد الكتالوج 50,000 دولار/يوم من الإيرادات. التوقف خلال ساعات العمل مكلف لكنه ليس مهدداً للحياة.",
    rtoRequired: "< 4 hours",
    rpoRequired: "< 24 hours",
    correctStrategy: "Daily differential backup + Warm site",
    options: [
      "Hot site + Synchronous replication + Automated failover",
      "Daily differential backup + Warm site",
      "Monthly full backup to tape + Cold site",
      "No backup — rebuild from vendor data feeds",
    ],
    optionsAr: [
      "موقع ساخن + نسخ متزامن + تجاوز فشل تلقائي",
      "نسخ احتياطي تفاضلي يومي + موقع دافئ",
      "نسخ احتياطي كامل شهري على شريط + موقع بارد",
      "بدون نسخ احتياطي — إعادة البناء من تغذيات بيانات الموردين",
    ],
    explanation: "Daily differential backups meet the 24-hour RPO (lose at most one day of catalog changes). A warm site can be brought online within 4 hours (meets RTO). A hot site would be overkill for a product catalog, while monthly backups risk too much data loss.",
    explanationAr: "النسخ الاحتياطي التفاضلي اليومي يلبي RPO 24 ساعة (فقدان يوم واحد كحد أقصى من تغييرات الكتالوج). الموقع الدافئ يمكن تشغيله خلال 4 ساعات (يلبي RTO). الموقع الساخن سيكون مبالغاً فيه لكتالوج المنتجات، بينما النسخ الشهري يخاطر بفقدان بيانات كثيرة.",
  },
  {
    id: 3,
    title: "Company Archive / Legal Hold",
    titleAr: "أرشيف الشركة / الحجز القانوني",
    scenario: "A law firm needs to retain all client correspondence for 7 years per regulatory requirements. The data is rarely accessed but must be retrievable for legal discovery within 72 hours.",
    scenarioAr: "مكتب محاماة يحتاج للاحتفاظ بجميع مراسلات العملاء لمدة 7 سنوات وفقاً للمتطلبات التنظيمية. نادراً ما يتم الوصول للبيانات لكن يجب أن تكون قابلة للاسترجاع للاكتشاف القانوني خلال 72 ساعة.",
    rtoRequired: "< 72 hours",
    rpoRequired: "Zero (immutable archive)",
    correctStrategy: "WORM storage + Cold site + Quarterly integrity checks",
    options: [
      "Hot site + Real-time replication",
      "Daily incremental backup to local NAS",
      "WORM storage + Cold site + Quarterly integrity checks",
      "Cloud object storage with lifecycle deletion",
    ],
    optionsAr: [
      "موقع ساخن + نسخ في الوقت الفعلي",
      "نسخ احتياطي تزايدي يومي إلى NAS محلي",
      "تخزين WORM + موقع بارد + فحوصات سلامة ربع سنوية",
      "تخزين كائنات سحابي مع حذف دورة الحياة",
    ],
    explanation: "WORM (Write Once Read Many) storage ensures data cannot be altered or deleted — critical for legal compliance. A cold site is sufficient given the 72-hour RTO. Quarterly integrity checks verify data hasn't been corrupted. Lifecycle deletion would violate retention requirements.",
    explanationAr: "تخزين WORM (الكتابة مرة واحدة القراءة عدة مرات) يضمن عدم إمكانية تعديل أو حذف البيانات — حاسم للامتثال القانوني. الموقع البارد كافٍ بالنظر إلى RTO 72 ساعة. فحوصات السلامة الربع سنوية تتحقق من عدم تلف البيانات.",
  },
  {
    id: 4,
    title: "SaaS Application Database",
    titleAr: "قاعدة بيانات تطبيق SaaS",
    scenario: "A SaaS company's main application database serves 10,000 active users. Users expect 99.9% uptime (SLA). Transaction data is generated continuously.",
    scenarioAr: "قاعدة بيانات التطبيق الرئيسية لشركة SaaS تخدم 10,000 مستخدم نشط. يتوقع المستخدمون توفر 99.9% (SLA). يتم إنشاء بيانات المعاملات باستمرار.",
    rtoRequired: "< 1 hour (99.9% SLA)",
    rpoRequired: "< 5 minutes",
    correctStrategy: "Warm standby + Asynchronous replication + Point-in-time recovery",
    options: [
      "Weekly full backup only",
      "Warm standby + Asynchronous replication + Point-in-time recovery",
      "Hot site + Synchronous replication (multi-region)",
      "Daily snapshot + Manual failover",
    ],
    optionsAr: [
      "نسخ احتياطي كامل أسبوعي فقط",
      "استعداد دافئ + نسخ غير متزامن + استرداد نقطة زمنية",
      "موقع ساخن + نسخ متزامن (متعدد المناطق)",
      "لقطة يومية + تجاوز فشل يدوي",
    ],
    explanation: "99.9% uptime allows ~8.7 hours downtime/year. Warm standby with async replication provides < 1 hour failover and < 5 minute RPO. Point-in-time recovery handles data corruption. A hot multi-region setup would exceed the SLA requirements and budget.",
    explanationAr: "توفر 99.9% يسمح بـ ~8.7 ساعات توقف/سنة. الاستعداد الدافئ مع النسخ غير المتزامن يوفر تجاوز فشل أقل من ساعة و RPO أقل من 5 دقائق. استرداد النقطة الزمنية يعالج تلف البيانات. الإعداد الساخن متعدد المناطق سيتجاوز متطلبات SLA والميزانية.",
  },
];

export default function DataProtectionLab({ onComplete }: { onComplete?: (score?: number) => void }) {
  const { tx } = useLabLang();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const s = SCENARIOS[current];

  const handleSubmit = useCallback(() => {
    if (selected === null) return;
    setShowResult(true);
    if (s.options[selected] === s.correctStrategy) setScore(sc => sc + 1);
  }, [selected, s]);

  const handleNext = useCallback(() => {
    if (current < SCENARIOS.length - 1) { setCurrent(c => c + 1); setSelected(null); setShowResult(false); }
    else setCompleted(true);
  }, [current]);

  const reset = useCallback(() => { setCurrent(0); setSelected(null); setShowResult(false); setScore(0); setCompleted(false); }, []);

  return (
    <div className="bg-[#001A16] border-2 border-[#0A6B5A]/40 p-6 my-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><HardDrive className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Backup & Recovery Strategy Lab", "مختبر استراتيجية النسخ الاحتياطي والاسترداد")}</h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx("Scenario", "سيناريو")} {current + 1}/{SCENARIOS.length} - {tx("Score", "النتيجة")}: {score}/{SCENARIOS.length}</p>
        </div>
      </div>

      {completed ? (
        <div className="text-center py-8">
          <Database className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Recovery Expert!", "خبير الاسترداد!")}</h4>
          <p className="text-[#C4B9A8] font-['Work_Sans'] mb-4">{tx(`You scored ${score}/${SCENARIOS.length}!`, `حصلت على ${score}/${SCENARIOS.length}!`)}</p>
          <button onClick={reset} className="flex items-center gap-2 mx-auto px-6 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all"><RotateCcw className="w-4 h-4" /> {tx("Play Again", "ابدأ من جديد")}</button>
        </div>
      ) : (
        <>
          <div className="bg-[#002F24]/50 border border-[#0A6B5A]/30 p-4 mb-4">
            <h4 className="text-[#E8E0D4] font-['Montserrat'] font-bold text-sm mb-2">{tx(s.title, s.titleAr)}</h4>
            <p className="text-[#C4B9A8] font-['Work_Sans'] text-sm mb-3">{tx(s.scenario, s.scenarioAr)}</p>
            <div className="grid grid-cols-2 gap-2 text-xs font-['Work_Sans']">
              <div className="bg-[#0A3D33]/40 p-2"><span className="text-[#D4AF37] font-bold">RTO:</span> <span className="text-[#C4B9A8]">{s.rtoRequired}</span></div>
              <div className="bg-[#0A3D33]/40 p-2"><span className="text-[#D4AF37] font-bold">RPO:</span> <span className="text-[#C4B9A8]">{s.rpoRequired}</span></div>
            </div>
          </div>

          <p className="text-[#C4B9A8] font-['Montserrat'] text-xs font-semibold mb-2">{tx("Select the best backup & recovery strategy:", "اختر أفضل استراتيجية نسخ احتياطي واسترداد:")}</p>
          <div className="space-y-2 mb-4">
            {s.options.map((opt, i) => (
              <button key={i} onClick={() => !showResult && setSelected(i)}
                className={`w-full text-left p-3 border font-['Work_Sans'] text-sm transition-all ${
                  showResult
                    ? opt === s.correctStrategy ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]" : i === selected ? "border-red-500/50 bg-red-500/10 text-red-400" : "border-[#0A6B5A]/20 text-[#C4B9A8]/50"
                    : selected === i ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]" : "border-[#0A6B5A]/30 text-[#C4B9A8] hover:border-[#D4AF37]/50"
                }`}>
                {tx(opt, s.optionsAr[i])}
              </button>
            ))}
          </div>

          {!showResult ? (
            <button onClick={handleSubmit} disabled={selected === null} className="px-6 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all disabled:opacity-40">{tx("Submit Strategy", "إرسال الاستراتيجية")}</button>
          ) : (
            <div className="bg-[#0A3D33]/40 border border-[#0A6B5A]/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                {s.options[selected!] === s.correctStrategy ? <><CheckCircle className="w-5 h-5 text-[#D4AF37]" /><span className="text-[#D4AF37] font-['Montserrat'] font-bold text-sm">{tx("Correct!", "صحيح!")}</span></> : <><XCircle className="w-5 h-5 text-red-400" /><span className="text-red-400 font-['Montserrat'] font-bold text-sm">{tx("Incorrect", "غير صحيح")}</span></>}
              </div>
              <p className="text-[#C4B9A8] font-['Work_Sans'] text-sm">{tx(s.explanation, s.explanationAr)}</p>
              <button onClick={handleNext} className="mt-3 flex items-center gap-2 px-5 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all">
                {current < SCENARIOS.length - 1 ? tx("Next Scenario", "السيناريو التالي") : tx("See Results", "عرض النتائج")} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
