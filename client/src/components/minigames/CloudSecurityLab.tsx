/*
  Cloud Security Lab
  Students identify cloud misconfigurations and security issues.
  Maps to CEH Day 12: Cloud Computing & IoT Security
  Bilingual: English + Arabic
*/

import { useState, useCallback } from "react";
import { Cloud, CheckCircle, XCircle, RotateCcw, ArrowRight, Server } from "lucide-react";
import { useLabLang } from "./labI18n";

type CloudChallenge = {
  id: number;
  scenario: string;
  scenarioAr: string;
  terminalOutput: string[];
  question: string;
  questionAr: string;
  options: string[];
  optionsAr: string[];
  correctIndex: number;
  explanation: string;
  explanationAr: string;
};

const CHALLENGES: CloudChallenge[] = [
  {
    id: 1,
    scenario: "During a cloud security assessment, you discover an S3 bucket with public access enabled.",
    scenarioAr: "أثناء تقييم أمان السحابة، اكتشفت حاوية S3 مع تمكين الوصول العام.",
    terminalOutput: [
      "$ aws s3 ls s3://company-backup-prod/ --no-sign-request",
      "2024-01-15 database_backup_2024.sql.gz",
      "2024-01-14 customer_data_export.csv",
      "2024-01-13 employee_records.xlsx",
      "2024-01-12 financial_report_Q4.pdf",
      "2024-01-11 api_keys_and_secrets.env",
      "",
      "$ aws s3api get-bucket-acl --bucket company-backup-prod",
      "  Grantee: AllUsers, Permission: READ",
    ],
    question: "What is the MOST critical finding and immediate action?",
    questionAr: "ما هو الاكتشاف الأكثر أهمية والإجراء الفوري؟",
    options: ["The bucket name reveals it's a production backup", "The bucket is publicly readable, exposing sensitive data (credentials, PII, financials)", "The files are not encrypted at rest", "The bucket doesn't have versioning enabled"],
    optionsAr: ["اسم الحاوية يكشف أنها نسخة احتياطية للإنتاج", "الحاوية قابلة للقراءة عامة، مما يكشف بيانات حساسة (بيانات اعتماد، PII، مالية)", "الملفات غير مشفرة في حالة السكون", "الحاوية لا تحتوي على تمكين الإصدارات"],
    correctIndex: 1,
    explanation: "The S3 bucket grants READ access to AllUsers (public internet). This exposes database backups, customer PII, employee records, financial data, and API keys/secrets. Immediate action: remove public access, rotate all exposed API keys, notify affected individuals (data breach), and enable S3 Block Public Access.",
    explanationAr: "حاوية S3 تمنح وصول READ لـ AllUsers (الإنترنت العام). هذا يكشف نسخ قاعدة البيانات، PII العملاء، سجلات الموظفين، البيانات المالية، ومفاتيح API. الإجراء الفوري: إزالة الوصول العام، تدوير جميع مفاتيح API المكشوفة.",
  },
  {
    id: 2,
    scenario: "You're auditing IAM policies in an AWS account and find an overly permissive policy attached to a developer role.",
    scenarioAr: "تدقق سياسات IAM في حساب AWS وتجد سياسة مفرطة الصلاحيات مرتبطة بدور مطور.",
    terminalOutput: [
      "$ aws iam get-role-policy --role-name DevTeamRole --policy-name DevPolicy",
      "{",
      "  \"PolicyDocument\": {",
      "    \"Statement\": [{",
      "      \"Effect\": \"Allow\",",
      "      \"Action\": \"*\",",
      "      \"Resource\": \"*\"",
      "    }]",
      "  }",
      "}",
    ],
    question: "What security principle does this policy violate?",
    questionAr: "أي مبدأ أمني تنتهكه هذه السياسة؟",
    options: ["Defense in depth", "Principle of Least Privilege", "Separation of duties", "Security through obscurity"],
    optionsAr: ["الدفاع في العمق", "مبدأ الحد الأدنى من الصلاحيات", "فصل الواجبات", "الأمان بالغموض"],
    correctIndex: 1,
    explanation: "Action: * and Resource: * grants full administrator access to ALL AWS services. This violates the Principle of Least Privilege - users should only have the minimum permissions needed for their job. A compromised developer account would give an attacker complete control over the AWS environment.",
    explanationAr: "Action: * و Resource: * يمنح وصول مسؤول كامل لجميع خدمات AWS. هذا ينتهك مبدأ الحد الأدنى من الصلاحيات - يجب أن يكون للمستخدمين فقط الحد الأدنى من الصلاحيات اللازمة لعملهم.",
  },
  {
    id: 3,
    scenario: "A Docker container running in production is found to have several security issues during a container security scan.",
    scenarioAr: "حاوية Docker تعمل في الإنتاج وُجد أن لديها عدة مشاكل أمنية أثناء فحص أمان الحاويات.",
    terminalOutput: [
      "$ docker inspect webapp-prod",
      "  User: root",
      "  Privileged: true",
      "  NetworkMode: host",
      "",
      "$ trivy image webapp:latest",
      "  CRITICAL: 12 vulnerabilities",
      "  HIGH: 34 vulnerabilities",
      "  Base image: ubuntu:18.04 (EOL)",
      "",
      "  CVE-2024-1234: Remote Code Execution (CRITICAL)",
      "  CVE-2024-5678: Privilege Escalation (HIGH)",
    ],
    question: "What is the MOST dangerous configuration in this container?",
    questionAr: "ما هو التكوين الأكثر خطورة في هذه الحاوية؟",
    options: ["Using ubuntu:18.04 as base image", "Running as root with privileged mode and host networking", "Having 12 critical vulnerabilities", "Not using a container orchestrator"],
    optionsAr: ["استخدام ubuntu:18.04 كصورة أساسية", "التشغيل كـ root مع وضع الامتياز وشبكة المضيف", "وجود 12 ثغرة حرجة", "عدم استخدام منسق حاويات"],
    correctIndex: 1,
    explanation: "Running as root + privileged: true + host networking is the most dangerous combination. Privileged mode gives the container full access to the host kernel, effectively breaking container isolation. Combined with root user and host networking, a container escape would give full host access.",
    explanationAr: "التشغيل كـ root + privileged: true + شبكة المضيف هو التركيبة الأكثر خطورة. وضع الامتياز يعطي الحاوية وصولاً كاملاً لنواة المضيف، مما يكسر عزل الحاوية فعلياً.",
  },
  {
    id: 4,
    scenario: "You discover that a company's Kubernetes cluster has exposed its API server to the public internet.",
    scenarioAr: "اكتشفت أن مجموعة Kubernetes لشركة كشفت خادم API الخاص بها للإنترنت العام.",
    terminalOutput: [
      "$ kubectl --server=https://k8s.company.com:6443 get pods --all-namespaces",
      "NAMESPACE     NAME                        READY   STATUS",
      "default       webapp-7d8f9c6b5d-x2k4l    1/1     Running",
      "default       api-server-5f4d3c2b1a-m9n8  1/1     Running",
      "kube-system   etcd-master                 1/1     Running",
      "kube-system   kube-apiserver-master        1/1     Running",
      "",
      "$ kubectl get secrets --all-namespaces",
      "NAMESPACE   NAME                  TYPE",
      "default     db-credentials        Opaque",
      "default     aws-access-keys       Opaque",
      "default     tls-certificate       kubernetes.io/tls",
    ],
    question: "What is the immediate risk of an exposed Kubernetes API server?",
    questionAr: "ما هو الخطر الفوري لخادم API Kubernetes المكشوف؟",
    options: ["Pods might restart unexpectedly", "An attacker can access all cluster resources including secrets, deploy malicious containers, and pivot to internal networks", "The cluster will run out of resources", "Container images might be outdated"],
    optionsAr: ["قد تعيد الحاويات التشغيل بشكل غير متوقع", "يمكن للمهاجم الوصول لجميع موارد المجموعة بما في ذلك الأسرار، ونشر حاويات خبيثة، والتحول إلى الشبكات الداخلية", "ستنفد موارد المجموعة", "قد تكون صور الحاويات قديمة"],
    correctIndex: 1,
    explanation: "An exposed K8s API server with insufficient authentication allows attackers to: (1) read all secrets (DB credentials, AWS keys, TLS certs), (2) deploy cryptominers or backdoors, (3) pivot to internal networks via pod networking, (4) access etcd (the cluster's brain). Always restrict API server access to private networks and use RBAC.",
    explanationAr: "خادم API K8s المكشوف مع مصادقة غير كافية يسمح للمهاجمين بـ: (1) قراءة جميع الأسرار، (2) نشر حاويات خبيثة، (3) التحول إلى الشبكات الداخلية، (4) الوصول إلى etcd.",
  },
  {
    id: 5,
    scenario: "An IoT device manufacturer asks you to assess the security of their smart home camera product.",
    scenarioAr: "شركة مصنعة لأجهزة IoT تطلب منك تقييم أمان منتج كاميرا المنزل الذكي.",
    terminalOutput: [
      "=== IoT Security Assessment ===",
      "",
      "Firmware Analysis:",
      "  Default credentials: admin/admin (hardcoded)",
      "  Telnet: Enabled on port 23 (no option to disable)",
      "  Firmware updates: HTTP (not HTTPS)",
      "  Encryption: None (video stream in plaintext)",
      "",
      "Network Analysis:",
      "  UPnP: Enabled (auto port-forwarding)",
      "  Cloud API: No authentication required",
      "  Data sent to: servers in unknown jurisdiction",
    ],
    question: "Which finding poses the GREATEST risk to end users?",
    questionAr: "أي اكتشاف يشكل أكبر خطر على المستخدمين النهائيين؟",
    options: ["Telnet enabled on port 23", "Hardcoded default credentials (admin/admin) with no forced change", "UPnP auto port-forwarding", "HTTP firmware updates"],
    optionsAr: ["Telnet مفعل على المنفذ 23", "بيانات اعتماد افتراضية مشفرة (admin/admin) بدون تغيير إجباري", "UPnP إعادة توجيه المنافذ التلقائي", "تحديثات البرامج الثابتة عبر HTTP"],
    correctIndex: 1,
    explanation: "Hardcoded default credentials are the #1 IoT vulnerability (OWASP IoT Top 10). Most users never change defaults, and Mirai-style botnets scan the internet for devices with default passwords. Combined with UPnP (which exposes the device to the internet), this creates a massive attack surface.",
    explanationAr: "بيانات الاعتماد الافتراضية المشفرة هي الثغرة رقم 1 في IoT (OWASP IoT Top 10). معظم المستخدمين لا يغيرون الإعدادات الافتراضية، وبوتنتات مثل Mirai تمسح الإنترنت بحثاً عن أجهزة بكلمات مرور افتراضية.",
  },
];

export default function CloudSecurityLab({ onComplete }: { onComplete?: (score?: number) => void }) {
  const { tx } = useLabLang();
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const challenge = CHALLENGES[current];

  const handleSubmit = useCallback(() => { if (selected === null) return; setShowResult(true); if (selected === challenge.correctIndex) setScore(s => s + 1); }, [selected, challenge]);
  const handleNext = useCallback(() => { if (current < CHALLENGES.length - 1) { setCurrent(c => c + 1); setSelected(null); setShowResult(false); } else { setCompleted(true); } }, [current]);
  const reset = useCallback(() => { setCurrent(0); setSelected(null); setShowResult(false); setScore(0); setCompleted(false); }, []);

  return (
    <div className="bg-[#F5F0E8] border-2 border-[#227C82]/40 p-6 my-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#D4AF37]/20 flex items-center justify-center"><Cloud className="w-5 h-5 text-[#D4AF37]" /></div>
        <div>
          <h3 className="text-[#D4AF37] font-['Montserrat'] text-lg font-bold">{tx("Cloud & IoT Security Lab", "مختبر أمان السحابة وإنترنت الأشياء")}</h3>
          <p className="text-[#0C3C3C] font-['Work_Sans'] text-xs">{tx("Challenge", "تحدي")} {current + 1}/{CHALLENGES.length} - {tx("Score", "النتيجة")}: {score}/{CHALLENGES.length}</p>
        </div>
      </div>

      {completed ? (
        <div className="text-center py-8">
          <Server className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
          <h4 className="text-[#0C3C3C] font-['Playfair_Display'] text-2xl font-bold mb-2">{tx("Lab Complete!", "اكتمل المختبر!")}</h4>
          <p className="text-[#0C3C3C] font-['Work_Sans'] mb-4">{tx(`You scored ${score}/${CHALLENGES.length}. Cloud security expert!`, `حصلت على ${score}/${CHALLENGES.length}. خبير أمان سحابي!`)}</p>
          <button onClick={reset} className="flex items-center gap-2 mx-auto px-6 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all"><RotateCcw className="w-4 h-4" /> {tx("Play Again", "ابدأ من جديد")}</button>
        </div>
      ) : (
        <>
          <div className="bg-white/50 border border-[#D4CBBA] p-3 mb-3">
            <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm">{tx(challenge.scenario, challenge.scenarioAr)}</p>
          </div>
          <div className="bg-[#0a0a0a] border border-[#333] p-3 mb-4 font-mono text-xs max-h-48 overflow-y-auto">
            {challenge.terminalOutput.map((line, i) => (
              <div key={i} className={line.startsWith("$") ? "text-green-400" : line.includes("CRITICAL") || line.includes("admin/admin") || line.includes("root") || line.includes("*") ? "text-red-400" : line.includes("===") ? "text-blue-300" : line.includes("Allow") || line.includes("Running") ? "text-yellow-300" : "text-gray-300"}>{line || "\u00A0"}</div>
            ))}
          </div>

          <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm font-medium mb-3">{tx(challenge.question, challenge.questionAr)}</p>
          <div className="space-y-2 mb-4">
            {(tx(challenge.options.join("|"), challenge.optionsAr.join("|"))).split("|").map((opt, i) => (
              <button key={i} onClick={() => !showResult && setSelected(i)}
                className={`w-full text-start p-3 border font-['Work_Sans'] text-sm transition-all ${showResult ? i === challenge.correctIndex ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#0C3C3C]" : i === selected ? "border-red-500/50 bg-red-500/10 text-red-600" : "border-[#D4CBBA] text-[#0C3C3C]/50" : selected === i ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#0C3C3C]" : "border-[#D4CBBA] text-[#0C3C3C] hover:border-[#D4AF37]/50"}`}>{opt}</button>
            ))}
          </div>

          {!showResult ? (
            <button onClick={handleSubmit} disabled={selected === null} className="px-6 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all disabled:opacity-40">{tx("Submit", "إرسال")}</button>
          ) : (
            <div className="bg-[#164A4A]/10 border border-[#D4CBBA] p-4">
              <div className="flex items-center gap-2 mb-2">
                {selected === challenge.correctIndex ? <><CheckCircle className="w-5 h-5 text-[#D4AF37]" /><span className="text-[#D4AF37] font-['Montserrat'] font-bold text-sm">{tx("Correct!", "صحيح!")}</span></> : <><XCircle className="w-5 h-5 text-red-500" /><span className="text-red-500 font-['Montserrat'] font-bold text-sm">{tx("Incorrect", "غير صحيح")}</span></>}
              </div>
              <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm">{tx(challenge.explanation, challenge.explanationAr)}</p>
              <button onClick={handleNext} className="mt-3 flex items-center gap-2 px-5 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all">
                {current < CHALLENGES.length - 1 ? tx("Next Challenge", "التحدي التالي") : tx("See Results", "عرض النتائج")} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
