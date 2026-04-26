/*
  Ransomware Hospital Attack Mini-Game
  Students respond to a ransomware attack on a hospital network.
  Three phases: Identify the attack vector, Contain the breach, Recover the network.
  Maps to Security+ Module 3: Security Architecture + Module 4: Security Operations
  Bilingual: English + Arabic
*/

import { useState, useEffect, useCallback, useMemo } from "react";
import { Skull, CheckCircle, XCircle, RotateCcw, Shield, AlertTriangle, Activity, Server, Clock, ArrowRight } from "lucide-react";
import { useLabLang } from "./labI18n";

type Phase = "identify" | "contain" | "recover";

type Decision = {
  id: string;
  phase: Phase;
  prompt: string;
  promptAr: string;
  options: Array<{
    label: string;
    labelAr: string;
    correct: boolean;
    feedback: string;
    feedbackAr: string;
  }>;
  context: string;
  contextAr: string;
};

const ATTACK_TIMELINE = [
  { time: "03:12 AM", event: "Phishing email opened by billing department employee", eventAr: "فتح موظف قسم الفواتير بريداً إلكترونياً تصيدياً" },
  { time: "03:14 AM", event: "Macro executes PowerShell dropper from email attachment", eventAr: "ماكرو ينفذ PowerShell dropper من مرفق البريد" },
  { time: "03:17 AM", event: "Cobalt Strike beacon established to C2 server", eventAr: "إنشاء إشارة Cobalt Strike إلى خادم C2" },
  { time: "03:45 AM", event: "Lateral movement via compromised admin credentials (Pass-the-Hash)", eventAr: "حركة جانبية عبر بيانات اعتماد مسؤول مخترقة (Pass-the-Hash)" },
  { time: "04:02 AM", event: "Active Directory domain controller compromised", eventAr: "اختراق وحدة تحكم مجال Active Directory" },
  { time: "04:30 AM", event: "Ransomware payload deployed to 847 endpoints via GPO", eventAr: "نشر حمولة الفدية على 847 نقطة نهاية عبر GPO" },
  { time: "04:31 AM", event: "Encryption begins - patient records, imaging systems, pharmacy", eventAr: "بدء التشفير - سجلات المرضى، أنظمة التصوير، الصيدلية" },
  { time: "05:15 AM", event: "Ransom note displayed: 75 BTC ($4.2M) demanded within 48 hours", eventAr: "عرض مذكرة الفدية: 75 BTC (4.2 مليون دولار) خلال 48 ساعة" },
];

const DECISIONS: Decision[] = [
  {
    id: "identify-1",
    phase: "identify",
    prompt: "The SOC receives alerts at 5:15 AM. Multiple systems display ransom notes. What is the FIRST thing the incident response team should do?",
    promptAr: "يتلقى مركز العمليات الأمنية تنبيهات في 5:15 صباحاً. أنظمة متعددة تعرض مذكرات فدية. ما أول شيء يجب أن يفعله فريق الاستجابة للحوادث؟",
    context: "847 endpoints encrypted. Emergency department, pharmacy, and radiology systems are down. Patient monitors on ICU are still operational (separate VLAN).",
    contextAr: "847 نقطة نهاية مشفرة. قسم الطوارئ والصيدلية وأنظمة الأشعة معطلة. أجهزة مراقبة المرضى في العناية المركزة لا تزال تعمل (VLAN منفصل).",
    options: [
      { label: "Immediately pay the ransom to restore patient care systems", labelAr: "دفع الفدية فوراً لاستعادة أنظمة رعاية المرضى", correct: false, feedback: "Never pay immediately. Payment doesn't guarantee decryption, funds criminal operations, and you may be targeted again. FBI advises against paying.", feedbackAr: "لا تدفع أبداً فوراً. الدفع لا يضمن فك التشفير، ويموّل العمليات الإجرامية، وقد تُستهدف مرة أخرى. مكتب التحقيقات الفيدرالي ينصح بعدم الدفع." },
      { label: "Activate the Incident Response Plan and assemble the IR team", labelAr: "تفعيل خطة الاستجابة للحوادث وتجميع فريق الاستجابة", correct: true, feedback: "Correct! The first step is always to activate your IR plan. This ensures a coordinated response with defined roles, communication channels, and decision authority.", feedbackAr: "صحيح! الخطوة الأولى دائماً هي تفعيل خطة الاستجابة. هذا يضمن استجابة منسقة بأدوار محددة وقنوات اتصال وسلطة اتخاذ القرار." },
      { label: "Shut down all servers and network equipment immediately", labelAr: "إيقاف جميع الخوادم ومعدات الشبكة فوراً", correct: false, feedback: "A full shutdown destroys volatile forensic evidence (RAM, network connections, running processes) and may cause more harm to patient care than the ransomware.", feedbackAr: "الإيقاف الكامل يدمر الأدلة الجنائية المتطايرة (RAM، اتصالات الشبكة، العمليات الجارية) وقد يسبب ضرراً لرعاية المرضى أكثر من الفدية." },
      { label: "Post about the attack on social media to warn other hospitals", labelAr: "النشر عن الهجوم على وسائل التواصل لتحذير المستشفيات الأخرى", correct: false, feedback: "Public disclosure without legal counsel and proper investigation could violate HIPAA, compromise the investigation, and cause unnecessary panic.", feedbackAr: "الإفصاح العام بدون مستشار قانوني وتحقيق مناسب قد ينتهك HIPAA، ويعرض التحقيق للخطر، ويسبب ذعراً غير ضروري." },
    ],
  },
  {
    id: "identify-2",
    phase: "identify",
    prompt: "The IR team needs to determine the attack vector. Which evidence source is MOST valuable for identifying how the attacker got in?",
    promptAr: "يحتاج فريق الاستجابة لتحديد ناقل الهجوم. أي مصدر أدلة هو الأكثر قيمة لتحديد كيف دخل المهاجم؟",
    context: "The ransomware variant is identified as LockBit 3.0. The ransom note references stolen patient data (double extortion).",
    contextAr: "تم تحديد متغير الفدية على أنه LockBit 3.0. تشير مذكرة الفدية إلى بيانات مرضى مسروقة (ابتزاز مزدوج).",
    options: [
      { label: "Email gateway logs showing the phishing email and attachment", labelAr: "سجلات بوابة البريد التي تظهر البريد التصيدي والمرفق", correct: true, feedback: "Correct! Email logs reveal the initial access vector - the phishing email with the malicious macro. This tells you exactly how the attacker got in and helps prevent reinfection.", feedbackAr: "صحيح! سجلات البريد تكشف ناقل الوصول الأولي - البريد التصيدي مع الماكرو الخبيث. هذا يخبرك بالضبط كيف دخل المهاجم ويساعد في منع إعادة العدوى." },
      { label: "The ransom note text file left on encrypted systems", labelAr: "ملف مذكرة الفدية المتروك على الأنظمة المشفرة", correct: false, feedback: "The ransom note identifies the ransomware variant but doesn't reveal the attack vector. It's useful for threat intelligence but not for root cause analysis.", feedbackAr: "مذكرة الفدية تحدد متغير الفدية لكنها لا تكشف ناقل الهجوم. مفيدة لاستخبارات التهديد لكن ليس لتحليل السبب الجذري." },
      { label: "Social media posts from the attacker group", labelAr: "منشورات وسائل التواصل من مجموعة المهاجمين", correct: false, feedback: "Threat actor communications may provide context but are unreliable and don't show your specific attack chain. Focus on your own logs first.", feedbackAr: "اتصالات الجهة المهاجمة قد توفر سياقاً لكنها غير موثوقة ولا تظهر سلسلة هجومك المحددة. ركز على سجلاتك أولاً." },
      { label: "Interviewing all 2,000 employees about suspicious activity", labelAr: "مقابلة جميع الموظفين البالغ عددهم 2,000 حول النشاط المشبوه", correct: false, feedback: "While user interviews can help, they're slow and unreliable. Technical evidence from logs is faster and more accurate for identifying the attack vector.", feedbackAr: "بينما قد تساعد مقابلات المستخدمين، إلا أنها بطيئة وغير موثوقة. الأدلة التقنية من السجلات أسرع وأدق لتحديد ناقل الهجوم." },
    ],
  },
  {
    id: "contain-1",
    phase: "contain",
    prompt: "You've confirmed the attack vector. Now you need to contain the spread. The ransomware is still actively encrypting on some systems. What's the priority containment action?",
    promptAr: "أكدت ناقل الهجوم. الآن تحتاج لاحتواء الانتشار. الفدية لا تزال تشفر بنشاط على بعض الأنظمة. ما إجراء الاحتواء ذو الأولوية؟",
    context: "The C2 server IP is 185.220.101.42. The attacker used compromised domain admin credentials. Some systems in the pharmacy and lab are still being encrypted.",
    contextAr: "عنوان IP لخادم C2 هو 185.220.101.42. استخدم المهاجم بيانات اعتماد مسؤول المجال المخترقة. بعض الأنظمة في الصيدلية والمختبر لا تزال تُشفر.",
    options: [
      { label: "Isolate affected network segments and block the C2 IP at the firewall", labelAr: "عزل أجزاء الشبكة المتأثرة وحظر عنوان IP لخادم C2 في جدار الحماية", correct: true, feedback: "Correct! Network isolation stops lateral movement and blocks C2 communication. This is the most effective containment - cut the attacker's access while preserving evidence.", feedbackAr: "صحيح! عزل الشبكة يوقف الحركة الجانبية ويحظر اتصال C2. هذا أكثر احتواء فعالية - قطع وصول المهاجم مع الحفاظ على الأدلة." },
      { label: "Change all Active Directory passwords immediately", labelAr: "تغيير جميع كلمات مرور Active Directory فوراً", correct: false, feedback: "Password resets are important but doing this FIRST while the attacker still has network access means they can intercept the new credentials. Isolate first, then reset.", feedbackAr: "إعادة تعيين كلمات المرور مهمة لكن القيام بذلك أولاً بينما المهاجم لا يزال لديه وصول للشبكة يعني أنه يمكنه اعتراض بيانات الاعتماد الجديدة. اعزل أولاً، ثم أعد التعيين." },
      { label: "Format and reinstall all 847 affected machines", labelAr: "تهيئة وإعادة تثبيت جميع الأجهزة المتأثرة البالغ عددها 847", correct: false, feedback: "Wiping systems destroys forensic evidence needed for investigation and doesn't address the root cause. The attacker could re-compromise through the same vector.", feedbackAr: "مسح الأنظمة يدمر الأدلة الجنائية اللازمة للتحقيق ولا يعالج السبب الجذري. يمكن للمهاجم إعادة الاختراق من خلال نفس الناقل." },
      { label: "Disconnect the hospital from the internet entirely", labelAr: "فصل المستشفى عن الإنترنت بالكامل", correct: false, feedback: "A full internet disconnect may be too broad - it could affect cloud-based patient care systems, telemedicine, and external communications needed for incident response.", feedbackAr: "فصل الإنترنت الكامل قد يكون واسعاً جداً - قد يؤثر على أنظمة رعاية المرضى السحابية والطب عن بعد والاتصالات الخارجية اللازمة للاستجابة." },
    ],
  },
  {
    id: "contain-2",
    phase: "contain",
    prompt: "The network is segmented and C2 is blocked. The attacker claims to have exfiltrated 12TB of patient records (double extortion). What should you do about the data exfiltration claim?",
    promptAr: "الشبكة مجزأة وC2 محظور. يدعي المهاجم أنه سرّب 12 تيرابايت من سجلات المرضى (ابتزاز مزدوج). ماذا يجب أن تفعل بشأن ادعاء تسريب البيانات؟",
    context: "HIPAA requires breach notification within 60 days if PHI is compromised. The attacker's leak site shows a countdown timer.",
    contextAr: "يتطلب HIPAA إشعار الاختراق خلال 60 يوماً إذا تم اختراق المعلومات الصحية المحمية. يعرض موقع تسريب المهاجم مؤقتاً للعد التنازلي.",
    options: [
      { label: "Ignore it - focus only on restoring systems", labelAr: "تجاهل ذلك - ركز فقط على استعادة الأنظمة", correct: false, feedback: "Ignoring potential data exfiltration violates HIPAA. If patient data was stolen, you have legal obligations for breach notification and must assess the scope.", feedbackAr: "تجاهل تسريب البيانات المحتمل ينتهك HIPAA. إذا سُرقت بيانات المرضى، لديك التزامات قانونية لإشعار الاختراق ويجب تقييم النطاق." },
      { label: "Analyze network flow logs and DLP alerts to verify if data was actually exfiltrated", labelAr: "تحليل سجلات تدفق الشبكة وتنبيهات DLP للتحقق مما إذا كانت البيانات قد سُرّبت فعلاً", correct: true, feedback: "Correct! Verify the claim with evidence. Check NetFlow data, firewall logs, and DLP alerts for large outbound data transfers. Attackers sometimes bluff about exfiltration to increase pressure.", feedbackAr: "صحيح! تحقق من الادعاء بالأدلة. افحص بيانات NetFlow وسجلات جدار الحماية وتنبيهات DLP لعمليات نقل البيانات الصادرة الكبيرة. المهاجمون أحياناً يخادعون بشأن التسريب لزيادة الضغط." },
      { label: "Pay the ransom to prevent the data from being leaked", labelAr: "دفع الفدية لمنع تسريب البيانات", correct: false, feedback: "Payment doesn't guarantee the attacker will delete stolen data. Many groups leak data even after payment. You still need to investigate and notify under HIPAA regardless.", feedbackAr: "الدفع لا يضمن أن المهاجم سيحذف البيانات المسروقة. العديد من المجموعات تسرب البيانات حتى بعد الدفع. لا تزال بحاجة للتحقيق والإبلاغ بموجب HIPAA." },
      { label: "Immediately notify all patients that their data was stolen", labelAr: "إبلاغ جميع المرضى فوراً بأن بياناتهم سُرقت", correct: false, feedback: "Premature notification without verification causes unnecessary panic. HIPAA gives 60 days - use that time to investigate the actual scope before notifying.", feedbackAr: "الإبلاغ المبكر بدون تحقق يسبب ذعراً غير ضروري. HIPAA يمنح 60 يوماً - استخدم ذلك الوقت للتحقيق في النطاق الفعلي قبل الإبلاغ." },
    ],
  },
  {
    id: "recover-1",
    phase: "recover",
    prompt: "Containment is complete. Time to recover. Your backup strategy includes: daily incremental backups (stored on-network), weekly full backups (stored off-site on tape), and the last clean backup is 6 days old. What's the best recovery approach?",
    promptAr: "الاحتواء مكتمل. حان وقت الاستعادة. استراتيجية النسخ الاحتياطي تشمل: نسخ احتياطية تزايدية يومية (مخزنة على الشبكة)، نسخ احتياطية كاملة أسبوعية (مخزنة خارج الموقع على شريط)، وآخر نسخة احتياطية نظيفة عمرها 6 أيام. ما أفضل نهج للاستعادة؟",
    context: "The attacker was in the network for approximately 26 hours before deploying ransomware. On-network backups may be compromised.",
    contextAr: "كان المهاجم في الشبكة لمدة 26 ساعة تقريباً قبل نشر الفدية. النسخ الاحتياطية على الشبكة قد تكون مخترقة.",
    options: [
      { label: "Restore from the on-network daily incremental backups (1 day old)", labelAr: "الاستعادة من النسخ الاحتياطية التزايدية اليومية على الشبكة (عمرها يوم واحد)", correct: false, feedback: "On-network backups are likely compromised! Ransomware groups specifically target backup systems. The attacker had 26 hours of access - enough to encrypt or corrupt on-network backups.", feedbackAr: "النسخ الاحتياطية على الشبكة على الأرجح مخترقة! مجموعات الفدية تستهدف أنظمة النسخ الاحتياطي تحديداً. كان لدى المهاجم 26 ساعة من الوصول - كافية لتشفير أو إفساد النسخ الاحتياطية." },
      { label: "Restore from the off-site weekly tape backup (6 days old) after verifying integrity", labelAr: "الاستعادة من النسخة الاحتياطية الأسبوعية خارج الموقع (عمرها 6 أيام) بعد التحقق من السلامة", correct: true, feedback: "Correct! Off-site tape backups are air-gapped and likely clean. Verify integrity before restoring. Yes, you lose 6 days of data, but it's better than restoring from compromised backups or paying ransom.", feedbackAr: "صحيح! النسخ الاحتياطية على الشريط خارج الموقع معزولة هوائياً وعلى الأرجح نظيفة. تحقق من السلامة قبل الاستعادة. نعم، تفقد 6 أيام من البيانات، لكنه أفضل من الاستعادة من نسخ مخترقة أو دفع الفدية." },
      { label: "Use the ransomware decryption tool from the attacker (pay the ransom)", labelAr: "استخدام أداة فك تشفير الفدية من المهاجم (دفع الفدية)", correct: false, feedback: "Decryption tools from attackers are unreliable - they may not work, may contain additional malware, or may only partially decrypt. Off-site backups are safer.", feedbackAr: "أدوات فك التشفير من المهاجمين غير موثوقة - قد لا تعمل، قد تحتوي على برمجيات خبيثة إضافية، أو قد تفك التشفير جزئياً فقط. النسخ الاحتياطية خارج الموقع أكثر أماناً." },
      { label: "Rebuild all systems from scratch without any backups", labelAr: "إعادة بناء جميع الأنظمة من الصفر بدون أي نسخ احتياطية", correct: false, feedback: "A full rebuild without backups means losing all patient records, billing data, and operational data. This is a last resort only if ALL backups are confirmed compromised.", feedbackAr: "إعادة البناء الكاملة بدون نسخ احتياطية تعني فقدان جميع سجلات المرضى وبيانات الفواتير والبيانات التشغيلية. هذا ملاذ أخير فقط إذا تأكد اختراق جميع النسخ الاحتياطية." },
    ],
  },
  {
    id: "recover-2",
    phase: "recover",
    prompt: "Systems are being restored. What security improvements should be implemented BEFORE bringing systems back online to prevent reinfection?",
    promptAr: "الأنظمة قيد الاستعادة. ما التحسينات الأمنية التي يجب تنفيذها قبل إعادة الأنظمة للعمل لمنع إعادة العدوى؟",
    context: "Root cause: phishing email → macro execution → credential theft → lateral movement → ransomware deployment.",
    contextAr: "السبب الجذري: بريد تصيدي → تنفيذ ماكرو → سرقة بيانات اعتماد → حركة جانبية → نشر فدية.",
    options: [
      { label: "Just restore and monitor - the same attack won't work twice", labelAr: "فقط استعد وراقب - نفس الهجوم لن يعمل مرتين", correct: false, feedback: "Without addressing the root causes, the same attack WILL work again. The attacker still knows your network and may have planted additional backdoors.", feedbackAr: "بدون معالجة الأسباب الجذرية، نفس الهجوم سيعمل مرة أخرى. المهاجم لا يزال يعرف شبكتك وقد يكون قد زرع أبواباً خلفية إضافية." },
      { label: "Reset all credentials, deploy EDR, disable macros, segment the network, and enable MFA", labelAr: "إعادة تعيين جميع بيانات الاعتماد، نشر EDR، تعطيل الماكرو، تجزئة الشبكة، وتفعيل MFA", correct: true, feedback: "Correct! Address every link in the kill chain: reset credentials (stolen creds), deploy EDR (detect malware), disable macros (initial access), segment network (lateral movement), enable MFA (credential abuse). Defense in depth!", feedbackAr: "صحيح! عالج كل حلقة في سلسلة القتل: إعادة تعيين بيانات الاعتماد (بيانات مسروقة)، نشر EDR (كشف البرمجيات الخبيثة)، تعطيل الماكرو (الوصول الأولي)، تجزئة الشبكة (الحركة الجانبية)، تفعيل MFA (إساءة استخدام بيانات الاعتماد). دفاع في العمق!" },
      { label: "Install antivirus on all endpoints and call it done", labelAr: "تثبيت مضاد فيروسات على جميع نقاط النهاية والاكتفاء بذلك", correct: false, feedback: "Traditional AV alone wouldn't have stopped this attack. LockBit uses living-off-the-land techniques that bypass signature-based detection. You need EDR, network segmentation, and credential hygiene.", feedbackAr: "مضاد الفيروسات التقليدي وحده لم يكن ليوقف هذا الهجوم. LockBit يستخدم تقنيات العيش من الأرض التي تتجاوز الكشف القائم على التوقيعات. تحتاج EDR وتجزئة الشبكة ونظافة بيانات الاعتماد." },
      { label: "Block all email attachments permanently", labelAr: "حظر جميع مرفقات البريد الإلكتروني بشكل دائم", correct: false, feedback: "Blocking all attachments is too disruptive for hospital operations (lab results, referrals, insurance documents). Instead, disable macros, implement email sandboxing, and train users.", feedbackAr: "حظر جميع المرفقات مدمر جداً لعمليات المستشفى (نتائج المختبر، الإحالات، وثائق التأمين). بدلاً من ذلك، عطّل الماكرو، نفّذ صندوق رمل البريد، ودرّب المستخدمين." },
    ],
  },
];

const PHASE_CONFIG: Record<Phase, { title: string; titleAr: string; icon: React.ReactNode; color: string; description: string; descriptionAr: string }> = {
  identify: {
    title: "Phase 1: Identify & Assess",
    titleAr: "المرحلة 1: التحديد والتقييم",
    icon: <AlertTriangle className="w-5 h-5" />,
    color: "text-red-400",
    description: "The attack has been discovered. Determine what happened and how.",
    descriptionAr: "تم اكتشاف الهجوم. حدد ما حدث وكيف.",
  },
  contain: {
    title: "Phase 2: Contain the Breach",
    titleAr: "المرحلة 2: احتواء الاختراق",
    icon: <Shield className="w-5 h-5" />,
    color: "text-orange-400",
    description: "Stop the bleeding. Prevent further damage and preserve evidence.",
    descriptionAr: "أوقف النزيف. امنع المزيد من الضرر واحفظ الأدلة.",
  },
  recover: {
    title: "Phase 3: Recover & Harden",
    titleAr: "المرحلة 3: الاستعادة والتقوية",
    icon: <Activity className="w-5 h-5" />,
    color: "text-[#D4AF37]",
    description: "Restore operations and prevent reinfection.",
    descriptionAr: "استعد العمليات وامنع إعادة العدوى.",
  },
};

export default function NetworkHardeningLab({ onComplete }: { onComplete?: (score?: number) => void }) {
  const { tx } = useLabLang();
  const [currentDecisionIdx, setCurrentDecisionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showTimeline, setShowTimeline] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [answers, setAnswers] = useState<Array<{ correct: boolean; decisionId: string }>>([]);

  const decision = DECISIONS[currentDecisionIdx];
  const phaseConfig = decision ? PHASE_CONFIG[decision.phase] : null;
  const currentPhase = decision?.phase;

  const phaseCounts = useMemo(() => {
    const counts: Record<Phase, { total: number; correct: number }> = {
      identify: { total: 0, correct: 0 },
      contain: { total: 0, correct: 0 },
      recover: { total: 0, correct: 0 },
    };
    answers.forEach(a => {
      const d = DECISIONS.find(dd => dd.id === a.decisionId);
      if (d) {
        counts[d.phase].total++;
        if (a.correct) counts[d.phase].correct++;
      }
    });
    return counts;
  }, [answers]);

  const handleSelect = useCallback((optionIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optionIdx);
    const isCorrect = decision.options[optionIdx].correct;
    if (isCorrect) setScore(prev => prev + 1);
    setAnswers(prev => [...prev, { correct: isCorrect, decisionId: decision.id }]);
  }, [selectedOption, decision]);

  const nextDecision = useCallback(() => {
    if (currentDecisionIdx < DECISIONS.length - 1) {
      setCurrentDecisionIdx(prev => prev + 1);
      setSelectedOption(null);
      setShowTimeline(false);
    } else {
      setCompleted(true);
    }
  }, [currentDecisionIdx]);

  const reset = useCallback(() => {
    setCurrentDecisionIdx(0);
    setSelectedOption(null);
    setScore(0);
    setShowTimeline(true);
    setCompleted(false);
    setAnswers([]);
  }, []);

  return (
    <div className="bg-[#001A16] border-2 border-red-500/30 p-6 my-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-red-500/20 flex items-center justify-center">
          <Skull className="w-5 h-5 text-red-400" />
        </div>
        <div>
          <h3 className="text-red-400 font-['Montserrat'] text-lg font-bold">
            {tx("RANSOMWARE ATTACK: St. Mercy General Hospital", "هجوم فدية: مستشفى سانت ميرسي العام")}
          </h3>
          <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs">
            {tx("Incident Response Simulation", "محاكاة الاستجابة للحوادث")} - {tx("Score", "النتيجة")}: {score}/{DECISIONS.length}
          </p>
        </div>
      </div>

      {/* Attack Timeline (shown at start) */}
      {showTimeline && !completed && (
        <div className="bg-[#0A0A0A]/60 border border-red-500/20 p-4 mb-5">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-red-400" />
            <span className="text-red-400 font-['Montserrat'] text-xs font-bold tracking-wider">
              {tx("ATTACK TIMELINE - FEBRUARY 25, 2026", "الجدول الزمني للهجوم - 25 فبراير 2026")}
            </span>
          </div>
          <div className="space-y-2">
            {ATTACK_TIMELINE.map((entry, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="text-red-400/70 font-mono text-xs shrink-0 pt-0.5 w-16">{entry.time}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                <span className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{tx(entry.event, entry.eventAr)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-red-300 font-['Montserrat'] text-xs font-bold">
                {tx(
                  "SITUATION: 847 endpoints encrypted. ER, pharmacy, radiology, and billing systems DOWN. Patient care at risk. You are the Incident Response Lead. What do you do?",
                  "الوضع: 847 نقطة نهاية مشفرة. الطوارئ والصيدلية والأشعة والفواتير معطلة. رعاية المرضى في خطر. أنت قائد الاستجابة للحوادث. ماذا تفعل؟"
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {completed ? (
        <div className="text-center py-8">
          <div className="mb-4">
            {score >= 5 ? (
              <Shield className="w-16 h-16 text-[#D4AF37] mx-auto" />
            ) : score >= 3 ? (
              <Activity className="w-16 h-16 text-orange-400 mx-auto" />
            ) : (
              <Skull className="w-16 h-16 text-red-400 mx-auto" />
            )}
          </div>
          <h4 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold mb-2">
            {score >= 5
              ? tx("Expert Incident Responder!", "خبير استجابة للحوادث!")
              : score >= 3
              ? tx("Solid Response", "استجابة جيدة")
              : tx("Needs Improvement", "يحتاج تحسين")}
          </h4>
          <p className="text-[#C4B9A8] font-['Work_Sans'] mb-4">
            {tx("Final Score", "النتيجة النهائية")}: {score}/{DECISIONS.length}
          </p>

          {/* Phase Breakdown */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto mb-6">
            {(["identify", "contain", "recover"] as Phase[]).map(phase => (
              <div key={phase} className="border border-[#0A6B5A]/30 p-3">
                <div className={`font-['Montserrat'] text-xs font-bold mb-1 ${PHASE_CONFIG[phase].color}`}>
                  {tx(
                    phase === "identify" ? "Identify" : phase === "contain" ? "Contain" : "Recover",
                    phase === "identify" ? "التحديد" : phase === "contain" ? "الاحتواء" : "الاستعادة"
                  )}
                </div>
                <div className="text-[#E8E0D4] font-['Montserrat'] text-lg font-bold">
                  {phaseCounts[phase].correct}/{phaseCounts[phase].total}
                </div>
              </div>
            ))}
          </div>

          <button onClick={reset} className="flex items-center gap-2 mx-auto px-6 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all">
            <RotateCcw className="w-4 h-4" /> {tx("Run Simulation Again", "ابدأ من جديد")}
          </button>
        </div>
      ) : (
        <>
          {/* Phase Indicator */}
          {phaseConfig && (
            <div className="flex items-center gap-2 mb-3">
              <span className={phaseConfig.color}>{phaseConfig.icon}</span>
              <span className={`${phaseConfig.color} font-['Montserrat'] text-sm font-bold`}>
                {tx(phaseConfig.title, phaseConfig.titleAr)}
              </span>
            </div>
          )}

          {/* Decision Context */}
          <div className="bg-[#002F24]/50 border border-[#0A6B5A]/30 p-4 mb-4">
            <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs mb-3 italic">
              <Server className="w-3 h-3 inline mr-1" />
              {tx("SITREP", "تقرير الوضع")}: {tx(decision.context, decision.contextAr)}
            </p>
            <p className="text-[#E8E0D4] font-['Work_Sans'] text-sm leading-relaxed font-semibold">
              {tx(decision.prompt, decision.promptAr)}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2 mb-4">
            {decision.options.map((option, idx) => {
              let borderClass = "border-[#0A6B5A]/30 hover:border-[#D4AF37]/40 cursor-pointer";
              let bgClass = "";

              if (selectedOption !== null) {
                if (option.correct) {
                  borderClass = "border-[#D4AF37]";
                  bgClass = "bg-[#D4AF37]/10";
                } else if (idx === selectedOption && !option.correct) {
                  borderClass = "border-red-500/50";
                  bgClass = "bg-red-500/10";
                } else {
                  borderClass = "border-[#0A6B5A]/15 opacity-40";
                }
              }

              return (
                <div key={idx}>
                  <button
                    onClick={() => handleSelect(idx)}
                    disabled={selectedOption !== null}
                    className={`w-full text-left border p-3 transition-all ${borderClass} ${bgClass}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-[#D4AF37] font-['Montserrat'] text-sm font-bold shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <span className="text-[#E8E0D4] font-['Work_Sans'] text-sm">{tx(option.label, option.labelAr)}</span>
                      {selectedOption !== null && option.correct && (
                        <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5 ml-auto" />
                      )}
                      {selectedOption === idx && !option.correct && (
                        <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5 ml-auto" />
                      )}
                    </div>
                  </button>
                  {selectedOption !== null && (idx === selectedOption || option.correct) && (
                    <div className={`px-4 py-2 border-x border-b text-xs ${option.correct ? "border-[#D4AF37]/20 text-[#D4AF37]" : "border-red-500/15 text-red-300"}`}>
                      <span className="font-['Work_Sans']">{tx(option.feedback, option.feedbackAr)}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Next Button */}
          {selectedOption !== null && (
            <button
              onClick={nextDecision}
              className="flex items-center gap-2 px-5 py-2 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all"
            >
              {currentDecisionIdx < DECISIONS.length - 1 ? (
                <>
                  {DECISIONS[currentDecisionIdx + 1]?.phase !== currentPhase
                    ? tx(
                        `Proceed to ${PHASE_CONFIG[DECISIONS[currentDecisionIdx + 1].phase].title}`,
                        `انتقل إلى ${PHASE_CONFIG[DECISIONS[currentDecisionIdx + 1].phase].titleAr}`
                      )
                    : tx("Next Decision", "القرار التالي")
                  }
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>{tx("After-Action Report", "تقرير ما بعد العملية")} <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          )}
        </>
      )}
    </div>
  );
}
