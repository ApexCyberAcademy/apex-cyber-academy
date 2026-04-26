/*
  Data Classification Game Mini-Game
  Students sort data samples into sensitivity categories for AI training pipelines.
  Maps to SecAI+ Module 3: AI Governance and Compliance
  Bilingual: English + Arabic
*/

import { useState, useEffect, useCallback } from "react";
import { Database, CheckCircle, XCircle, RotateCcw, ArrowRight, Shield, Eye, Lock, FileText } from "lucide-react";
import { useLabLang } from "./labI18n";

type DataSample = {
  id: number;
  title: string;
  titleAr: string;
  content: string;
  contentAr: string;
  source: string;
  sourceAr: string;
  correctClassification: Classification;
  canUseForTraining: boolean;
  explanation: string;
  explanationAr: string;
  regulations: string[];
};

type Classification = "public" | "internal" | "confidential" | "restricted";

const CLASSIFICATION_INFO: Record<Classification, { label: string; labelAr: string; color: string; bgColor: string; icon: React.ReactNode; description: string; descriptionAr: string }> = {
  public: {
    label: "Public",
    labelAr: "عام",
    color: "text-green-400",
    bgColor: "bg-green-500/10 border-green-500/30",
    icon: <Eye className="w-4 h-4" />,
    description: "Freely available, no restrictions on use",
    descriptionAr: "متاح بحرية، لا قيود على الاستخدام",
  },
  internal: {
    label: "Internal",
    labelAr: "داخلي",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10 border-blue-500/30",
    icon: <FileText className="w-4 h-4" />,
    description: "For organizational use, not for public release",
    descriptionAr: "للاستخدام المؤسسي، ليس للنشر العام",
  },
  confidential: {
    label: "Confidential",
    labelAr: "سري",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10 border-orange-500/30",
    icon: <Shield className="w-4 h-4" />,
    description: "Sensitive data requiring access controls",
    descriptionAr: "بيانات حساسة تتطلب ضوابط وصول",
  },
  restricted: {
    label: "Restricted / PII",
    labelAr: "مقيد / بيانات شخصية",
    color: "text-red-400",
    bgColor: "bg-red-500/10 border-red-500/30",
    icon: <Lock className="w-4 h-4" />,
    description: "Highly sensitive, regulated data - strict controls required",
    descriptionAr: "بيانات حساسة للغاية ومنظمة - تتطلب ضوابط صارمة",
  },
};

const DATA_SAMPLES: DataSample[] = [
  {
    id: 1,
    title: "Patient Medical Records",
    titleAr: "سجلات المرضى الطبية",
    content: "Dataset: 50,000 patient records from City Hospital including diagnoses (ICD-10 codes), prescribed medications, lab results, and patient names/DOBs/SSNs.",
    contentAr: "مجموعة بيانات: 50,000 سجل مريض من مستشفى المدينة تشمل التشخيصات (رموز ICD-10)، الأدوية الموصوفة، نتائج المختبر، وأسماء المرضى/تواريخ الميلاد/أرقام الضمان الاجتماعي.",
    source: "Hospital EHR System Export",
    sourceAr: "تصدير نظام السجلات الصحية الإلكترونية للمستشفى",
    correctClassification: "restricted",
    canUseForTraining: false,
    explanation: "Patient medical records are Protected Health Information (PHI) under HIPAA. Using raw PHI for AI training without proper de-identification violates federal law. Even de-identified data must meet HIPAA's Safe Harbor or Expert Determination standards before use.",
    explanationAr: "سجلات المرضى الطبية هي معلومات صحية محمية (PHI) بموجب HIPAA. استخدام PHI الخام لتدريب الذكاء الاصطناعي بدون إزالة الهوية بشكل صحيح ينتهك القانون الفيدرالي. حتى البيانات منزوعة الهوية يجب أن تستوفي معايير HIPAA قبل الاستخدام.",
    regulations: ["HIPAA", "HITECH Act", "State health privacy laws"],
  },
  {
    id: 2,
    title: "Public Wikipedia Articles",
    titleAr: "مقالات ويكيبيديا العامة",
    content: "Dataset: 100,000 Wikipedia articles on cybersecurity topics including encryption algorithms, network protocols, and security frameworks.",
    contentAr: "مجموعة بيانات: 100,000 مقالة ويكيبيديا عن مواضيع الأمن السيبراني تشمل خوارزميات التشفير، بروتوكولات الشبكة، وأطر الأمان.",
    source: "Wikipedia API (CC BY-SA 4.0 License)",
    sourceAr: "واجهة برمجة ويكيبيديا (ترخيص CC BY-SA 4.0)",
    correctClassification: "public",
    canUseForTraining: true,
    explanation: "Wikipedia content is publicly available under Creative Commons license. It's generally safe for AI training, though you must comply with the CC BY-SA 4.0 license terms (attribution and share-alike). This is one of the most commonly used datasets for NLP training.",
    explanationAr: "محتوى ويكيبيديا متاح للعامة بموجب ترخيص المشاع الإبداعي. آمن عموماً لتدريب الذكاء الاصطناعي، مع الالتزام بشروط ترخيص CC BY-SA 4.0 (الإسناد والمشاركة بالمثل). هذه واحدة من أكثر مجموعات البيانات استخداماً لتدريب معالجة اللغة الطبيعية.",
    regulations: ["CC BY-SA 4.0 License", "Copyright law (fair use)"],
  },
  {
    id: 3,
    title: "Employee Performance Reviews",
    titleAr: "تقييمات أداء الموظفين",
    content: "Dataset: 5,000 annual performance reviews containing manager assessments, salary information, promotion recommendations, and disciplinary notes.",
    contentAr: "مجموعة بيانات: 5,000 تقييم أداء سنوي تحتوي على تقييمات المديرين، معلومات الرواتب، توصيات الترقية، وملاحظات تأديبية.",
    source: "HR Management System",
    sourceAr: "نظام إدارة الموارد البشرية",
    correctClassification: "confidential",
    canUseForTraining: false,
    explanation: "Employee performance data is confidential HR information. Using it for AI training could expose salary data, create bias in hiring models, and violate employment privacy laws. Even anonymized, small datasets can be re-identified through correlation attacks.",
    explanationAr: "بيانات أداء الموظفين هي معلومات سرية للموارد البشرية. استخدامها لتدريب الذكاء الاصطناعي قد يكشف بيانات الرواتب، يخلق تحيزاً في نماذج التوظيف، وينتهك قوانين خصوصية التوظيف. حتى مع إخفاء الهوية، يمكن إعادة تحديد مجموعات البيانات الصغيرة من خلال هجمات الارتباط.",
    regulations: ["Employment privacy laws", "GDPR (if EU employees)", "Company HR policies"],
  },
  {
    id: 4,
    title: "Credit Card Transaction Logs",
    titleAr: "سجلات معاملات بطاقات الائتمان",
    content: "Dataset: 2 million transaction records including card numbers (full PAN), merchant names, amounts, timestamps, and cardholder names.",
    contentAr: "مجموعة بيانات: 2 مليون سجل معاملة تشمل أرقام البطاقات (PAN كامل)، أسماء التجار، المبالغ، الطوابع الزمنية، وأسماء حاملي البطاقات.",
    source: "Payment Processing System",
    sourceAr: "نظام معالجة المدفوعات",
    correctClassification: "restricted",
    canUseForTraining: false,
    explanation: "Full credit card numbers (PAN) are restricted under PCI DSS. This data must never be used for AI training in its raw form. Even tokenized transaction data requires careful handling. PCI DSS violations can result in fines of $5,000-$100,000 per month.",
    explanationAr: "أرقام بطاقات الائتمان الكاملة (PAN) مقيدة بموجب PCI DSS. يجب ألا تُستخدم هذه البيانات أبداً لتدريب الذكاء الاصطناعي بشكلها الخام. حتى بيانات المعاملات المرمزة تتطلب معالجة دقيقة. انتهاكات PCI DSS قد تؤدي إلى غرامات من 5,000 إلى 100,000 دولار شهرياً.",
    regulations: ["PCI DSS", "State financial privacy laws", "GDPR (if EU cardholders)"],
  },
  {
    id: 5,
    title: "Company Security Policies",
    titleAr: "سياسات أمن الشركة",
    content: "Dataset: Internal security policy documents including incident response procedures, network architecture diagrams, firewall rules, and vendor access protocols.",
    contentAr: "مجموعة بيانات: وثائق سياسات أمنية داخلية تشمل إجراءات الاستجابة للحوادث، مخططات بنية الشبكة، قواعد جدار الحماية، وبروتوكولات وصول الموردين.",
    source: "Corporate SharePoint / Confluence",
    sourceAr: "SharePoint / Confluence المؤسسي",
    correctClassification: "internal",
    canUseForTraining: false,
    explanation: "Security policies are internal documents that reveal the organization's defensive posture. Using them for AI training risks exposure through model inversion or data extraction attacks. An attacker could potentially extract firewall rules or IR procedures from a trained model.",
    explanationAr: "سياسات الأمان هي وثائق داخلية تكشف الوضع الدفاعي للمؤسسة. استخدامها لتدريب الذكاء الاصطناعي يخاطر بالكشف من خلال هجمات عكس النموذج أو استخراج البيانات. يمكن للمهاجم استخراج قواعد جدار الحماية أو إجراءات الاستجابة للحوادث من نموذج مدرب.",
    regulations: ["Internal classification policy", "NDA obligations", "SOC 2 controls"],
  },
  {
    id: 6,
    title: "Open Source Vulnerability Database",
    titleAr: "قاعدة بيانات الثغرات مفتوحة المصدر",
    content: "Dataset: CVE entries from the National Vulnerability Database (NVD) including vulnerability descriptions, CVSS scores, affected products, and remediation guidance.",
    contentAr: "مجموعة بيانات: إدخالات CVE من قاعدة بيانات الثغرات الوطنية (NVD) تشمل أوصاف الثغرات، درجات CVSS، المنتجات المتأثرة، وإرشادات المعالجة.",
    source: "NIST NVD API (Public Domain)",
    sourceAr: "واجهة برمجة NIST NVD (ملكية عامة)",
    correctClassification: "public",
    canUseForTraining: true,
    explanation: "The NVD is a public government resource in the public domain. CVE data is specifically designed for sharing and is widely used for training security AI models. This is an ideal training dataset for vulnerability detection and prioritization models.",
    explanationAr: "NVD هو مورد حكومي عام في الملكية العامة. بيانات CVE مصممة خصيصاً للمشاركة وتُستخدم على نطاق واسع لتدريب نماذج أمن الذكاء الاصطناعي. هذه مجموعة بيانات مثالية لنماذج كشف الثغرات وتحديد أولوياتها.",
    regulations: ["Public domain (US Government work)", "CVE usage terms"],
  },
  {
    id: 7,
    title: "Children's Online Activity Logs",
    titleAr: "سجلات نشاط الأطفال عبر الإنترنت",
    content: "Dataset: Browsing history, app usage patterns, and chat logs from an educational platform used by children ages 8-13.",
    contentAr: "مجموعة بيانات: سجل التصفح، أنماط استخدام التطبيقات، وسجلات المحادثات من منصة تعليمية يستخدمها أطفال بأعمار 8-13 سنة.",
    source: "EdTech Platform Analytics",
    sourceAr: "تحليلات منصة التكنولوجيا التعليمية",
    correctClassification: "restricted",
    canUseForTraining: false,
    explanation: "Children's data is among the most heavily regulated data categories. COPPA requires verifiable parental consent for collecting data from children under 13. Using children's behavioral data for AI training without explicit consent violates COPPA and potentially GDPR's special protections for minors.",
    explanationAr: "بيانات الأطفال من أكثر فئات البيانات تنظيماً. يتطلب COPPA موافقة أبوية قابلة للتحقق لجمع بيانات الأطفال دون 13 عاماً. استخدام بيانات سلوك الأطفال لتدريب الذكاء الاصطناعي بدون موافقة صريحة ينتهك COPPA وربما حماية GDPR الخاصة للقاصرين.",
    regulations: ["COPPA", "GDPR Article 8 (children's consent)", "State student privacy laws (FERPA)"],
  },
  {
    id: 8,
    title: "Synthetic Customer Service Transcripts",
    titleAr: "نصوص خدمة عملاء اصطناعية",
    content: "Dataset: 500,000 AI-generated customer service conversations covering common support scenarios. No real customer data - all names, account numbers, and scenarios are synthetic.",
    contentAr: "مجموعة بيانات: 500,000 محادثة خدمة عملاء مولدة بالذكاء الاصطناعي تغطي سيناريوهات الدعم الشائعة. لا بيانات عملاء حقيقية - جميع الأسماء وأرقام الحسابات والسيناريوهات اصطناعية.",
    source: "Internal AI Data Generation Pipeline",
    sourceAr: "خط أنابيب توليد البيانات الداخلي بالذكاء الاصطناعي",
    correctClassification: "internal",
    canUseForTraining: true,
    explanation: "Synthetic data is one of the safest options for AI training because it contains no real personal information. However, it should still be classified as internal since it may reflect business processes and product details. Synthetic data generation is a key privacy-preserving technique for AI development.",
    explanationAr: "البيانات الاصطناعية من أكثر الخيارات أماناً لتدريب الذكاء الاصطناعي لأنها لا تحتوي على معلومات شخصية حقيقية. ومع ذلك، يجب تصنيفها كداخلية لأنها قد تعكس عمليات الأعمال وتفاصيل المنتجات. توليد البيانات الاصطناعية تقنية رئيسية للحفاظ على الخصوصية في تطوير الذكاء الاصطناعي.",
    regulations: ["Internal data governance policy", "AI Ethics guidelines"],
  },
];

export default function DataClassificationGame({ onComplete }: { onComplete?: (score?: number) => void }) {
  const { tx } = useLabLang();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userClassification, setUserClassification] = useState<Classification | null>(null);
  const [userTrainingDecision, setUserTrainingDecision] = useState<boolean | null>(null);
  const [step, setStep] = useState<"classify" | "training" | "result">("classify");
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [results, setResults] = useState<Array<{ sampleId: number; classCorrect: boolean; trainingCorrect: boolean }>>([]);

  const sample = DATA_SAMPLES[currentIdx];

  const handleClassify = useCallback((classification: Classification) => {
    setUserClassification(classification);
    setStep("training");
  }, []);

  const handleTrainingDecision = useCallback((canUse: boolean) => {
    setUserTrainingDecision(canUse);
    const classCorrect = userClassification === sample.correctClassification;
    const trainingCorrect = canUse === sample.canUseForTraining;
    const points = (classCorrect ? 1 : 0) + (trainingCorrect ? 1 : 0);
    setScore(prev => prev + points);
    setResults(prev => [...prev, { sampleId: sample.id, classCorrect, trainingCorrect }]);
    setStep("result");
  }, [userClassification, sample]);

  const nextSample = useCallback(() => {
    if (currentIdx < DATA_SAMPLES.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setUserClassification(null);
      setUserTrainingDecision(null);
      setStep("classify");
    } else {
      setCompleted(true);
    }
  }, [currentIdx]);

  const reset = useCallback(() => {
    setCurrentIdx(0);
    setUserClassification(null);
    setUserTrainingDecision(null);
    setStep("classify");
    setScore(0);
    setCompleted(false);
    setResults([]);
  }, []);

  const maxScore = DATA_SAMPLES.length * 2;
  const percentage = Math.round((score / maxScore) * 100);

  return (
    <div className="bg-[#001A16] border-2 border-[#0A6B5A]/40 p-6 my-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center">
          <Database className="w-5 h-5 text-[#D4AF37]" />
        </div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">
            {tx("Data Classification Challenge", "تحدي تصنيف البيانات")}
          </h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">
            {tx("Sample", "عينة")} {currentIdx + 1}/{DATA_SAMPLES.length} - {tx("Score", "النتيجة")}: {score}/{maxScore} {tx("points", "نقطة")}
          </p>
        </div>
      </div>

      {completed ? (
        <div className="text-center py-8">
          <Database className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">
            {percentage >= 80
              ? tx("Data Governance Expert!", "خبير حوكمة البيانات!")
              : percentage >= 50
              ? tx("Good Classification Skills", "مهارات تصنيف جيدة")
              : tx("Review Data Privacy Regulations", "راجع لوائح خصوصية البيانات")}
          </h4>
          <p className="text-[#C4B9A8] font-['Work_Sans'] mb-2">
            {tx("Score", "النتيجة")}: {score}/{maxScore} ({percentage}%)
          </p>

          {/* Results Summary */}
          <div className="max-w-md mx-auto mt-4 mb-6 text-left">
            {results.map((r, idx) => {
              const s = DATA_SAMPLES.find(d => d.id === r.sampleId)!;
              return (
                <div key={idx} className="flex items-center gap-2 py-1.5 border-b border-[#0A6B5A]/15">
                  <span className="text-[#C4B9A8] font-['Work_Sans'] text-xs flex-1">
                    {tx(s.title, s.titleAr)}
                  </span>
                  <span className={`font-mono text-xs ${r.classCorrect ? "text-[#D4AF37]" : "text-red-400"}`}>
                    {r.classCorrect ? "✓" : "✗"} {tx("Class", "تصنيف")}
                  </span>
                  <span className={`font-mono text-xs ${r.trainingCorrect ? "text-[#D4AF37]" : "text-red-400"}`}>
                    {r.trainingCorrect ? "✓" : "✗"} {tx("Training", "تدريب")}
                  </span>
                </div>
              );
            })}
          </div>

          <button onClick={reset} className="flex items-center gap-2 mx-auto px-6 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all">
            <RotateCcw className="w-4 h-4" /> {tx("Play Again", "ابدأ من جديد")}
          </button>
        </div>
      ) : (
        <>
          {/* Data Sample */}
          <div className="bg-[#002F24]/50 border border-[#0A6B5A]/30 p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[#D4AF37] font-['Montserrat'] text-xs font-bold">
                {tx(sample.title, sample.titleAr)}
              </span>
            </div>
            <p className="text-[#E8E0D4] font-['Work_Sans'] text-sm mb-2">
              {tx(sample.content, sample.contentAr)}
            </p>
            <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">
              <span className="text-[#D4AF37]">{tx("Source:", "المصدر:")}</span> {tx(sample.source, sample.sourceAr)}
            </p>
          </div>

          {/* Step 1: Classify */}
          {step === "classify" && (
            <>
              <p className="text-[#C4B9A8] font-['Montserrat'] text-xs font-semibold mb-3">
                {tx("Step 1: What is the correct data classification?", "الخطوة 1: ما التصنيف الصحيح للبيانات؟")}
              </p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {(Object.keys(CLASSIFICATION_INFO) as Classification[]).map(cls => {
                  const info = CLASSIFICATION_INFO[cls];
                  return (
                    <button
                      key={cls}
                      onClick={() => handleClassify(cls)}
                      className={`border p-3 text-left transition-all hover:border-[#D4AF37]/50 ${info.bgColor}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={info.color}>{info.icon}</span>
                        <span className={`${info.color} font-['Montserrat'] text-sm font-bold`}>
                          {tx(info.label, info.labelAr)}
                        </span>
                      </div>
                      <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">
                        {tx(info.description, info.descriptionAr)}
                      </p>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Step 2: Training Decision */}
          {step === "training" && (
            <>
              <div className="flex items-center gap-2 mb-3">
                <span className={CLASSIFICATION_INFO[userClassification!].color}>
                  {CLASSIFICATION_INFO[userClassification!].icon}
                </span>
                <span className={`${CLASSIFICATION_INFO[userClassification!].color} font-['Montserrat'] text-sm font-semibold`}>
                  {tx("Classified as:", "صُنّف كـ:")} {tx(CLASSIFICATION_INFO[userClassification!].label, CLASSIFICATION_INFO[userClassification!].labelAr)}
                </span>
              </div>

              <p className="text-[#C4B9A8] font-['Montserrat'] text-xs font-semibold mb-3">
                {tx("Step 2: Can this data be used for AI model training?", "الخطوة 2: هل يمكن استخدام هذه البيانات لتدريب نموذج ذكاء اصطناعي؟")}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleTrainingDecision(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-green-500/30 text-green-400 font-['Montserrat'] font-bold text-sm hover:bg-green-500/10 transition-all"
                >
                  <CheckCircle className="w-4 h-4" /> {tx("YES - Safe for Training", "نعم - آمن للتدريب")}
                </button>
                <button
                  onClick={() => handleTrainingDecision(false)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-red-500/30 text-red-400 font-['Montserrat'] font-bold text-sm hover:bg-red-500/10 transition-all"
                >
                  <XCircle className="w-4 h-4" /> {tx("NO - Cannot Use", "لا - لا يمكن استخدامه")}
                </button>
              </div>
            </>
          )}

          {/* Step 3: Result */}
          {step === "result" && (
            <div className="space-y-3">
              {/* Classification Result */}
              <div className={`border p-3 ${userClassification === sample.correctClassification ? "border-[#D4AF37]/30 bg-[#0A3D33]/20" : "border-red-500/20 bg-[#3D0A0A]/10"}`}>
                <div className="flex items-center gap-2">
                  {userClassification === sample.correctClassification ? (
                    <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                  <span className="font-['Montserrat'] text-sm font-bold text-[#E8E0D4]">
                    {tx("Classification:", "التصنيف:")}{" "}
                    {userClassification === sample.correctClassification
                      ? tx("Correct!", "صحيح!")
                      : tx(
                          `Incorrect - Should be ${CLASSIFICATION_INFO[sample.correctClassification].label}`,
                          `خطأ - يجب أن يكون ${CLASSIFICATION_INFO[sample.correctClassification].labelAr}`
                        )
                    }
                  </span>
                </div>
              </div>

              {/* Training Decision Result */}
              <div className={`border p-3 ${userTrainingDecision === sample.canUseForTraining ? "border-[#D4AF37]/30 bg-[#0A3D33]/20" : "border-red-500/20 bg-[#3D0A0A]/10"}`}>
                <div className="flex items-center gap-2">
                  {userTrainingDecision === sample.canUseForTraining ? (
                    <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                  <span className="font-['Montserrat'] text-sm font-bold text-[#E8E0D4]">
                    {tx("Training Decision:", "قرار التدريب:")}{" "}
                    {userTrainingDecision === sample.canUseForTraining
                      ? tx("Correct!", "صحيح!")
                      : tx(
                          `Incorrect - ${sample.canUseForTraining ? "CAN be used" : "CANNOT be used"} for training`,
                          `خطأ - ${sample.canUseForTraining ? "يمكن استخدامه" : "لا يمكن استخدامه"} للتدريب`
                        )
                    }
                  </span>
                </div>
              </div>

              {/* Explanation */}
              <div className="bg-[#0A3D33]/30 border border-[#0A6B5A]/30 p-4">
                <p className="text-[#C4B9A8] font-['Work_Sans'] text-sm mb-2">
                  {tx(sample.explanation, sample.explanationAr)}
                </p>
                {/* Keep regulation names in English as they are proper nouns */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {sample.regulations.map((reg, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-[#D4AF37]/10 text-[#D4AF37] font-mono text-xs border border-[#D4AF37]/20">
                      {reg}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={nextSample}
                className="flex items-center gap-2 px-5 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all"
              >
                {currentIdx < DATA_SAMPLES.length - 1
                  ? tx("Next Sample", "العينة التالية")
                  : tx("See Results", "عرض النتائج")
                } <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
