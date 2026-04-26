/*
  MiniGameMapper - maps lecture titles to appropriate mini-game components.
  Uses keyword matching so it works regardless of database IDs.
  Covers all 62 lectures across 5 courses.
*/

import { lazy, Suspense } from "react";
import { Loader2, Gamepad2 } from "lucide-react";
import { useLabLang } from "./labI18n";

// ── Security+ (14 labs) ──
const FirewallRuleBuilder = lazy(() => import("./FirewallRuleBuilder"));
const ZeroTrustLab = lazy(() => import("./ZeroTrustLab"));
const EncryptionChallenge = lazy(() => import("./EncryptionChallenge"));
const ThreatClassifier = lazy(() => import("./ThreatClassifier"));
const VulnerabilityScannerLab = lazy(() => import("./VulnerabilityScannerLab"));
const MitigationMatchLab = lazy(() => import("./MitigationMatchLab"));
const NetworkHardeningLab = lazy(() => import("./NetworkHardeningLab"));
const SecureInfraLab = lazy(() => import("./SecureInfraLab"));
const DataProtectionLab = lazy(() => import("./DataProtectionLab"));
const AssetManagementLab = lazy(() => import("./AssetManagementLab"));
const LogAnalysisLab = lazy(() => import("./LogAnalysisLab"));
const AutomationScriptingLab = lazy(() => import("./AutomationScriptingLab"));
const IncidentResponseSim = lazy(() => import("./IncidentResponseSim"));
const ComplianceAuditLab = lazy(() => import("./ComplianceAuditLab"));

// ── SecAI+ (10 labs) ──
const AIThreatDetection = lazy(() => import("./AIThreatDetection"));
const AIDataSecurityLab = lazy(() => import("./AIDataSecurityLab"));
const PromptInjectionChallenge = lazy(() => import("./PromptInjectionChallenge"));
const AISecurityControlsLab = lazy(() => import("./AISecurityControlsLab"));
const AIMonitoringLab = lazy(() => import("./AIMonitoringLab"));
const AIAttackAnalysisLab = lazy(() => import("./AIAttackAnalysisLab"));
const AISecurityToolsLab = lazy(() => import("./AISecurityToolsLab"));
const AIEnhancedAttacksLab = lazy(() => import("./AIEnhancedAttacksLab"));
const DataClassificationGame = lazy(() => import("./DataClassificationGame"));
const AIComplianceLab = lazy(() => import("./AIComplianceLab"));

// ── Tech+ (10 labs) ──
const TroubleshootingMethodLab = lazy(() => import("./TroubleshootingMethodLab"));
const ComponentIdentifierLab = lazy(() => import("./ComponentIdentifierLab"));
const StorageInterfaceLab = lazy(() => import("./StorageInterfaceLab"));
const NetworkBasicsLab = lazy(() => import("./NetworkBasicsLab"));
const CloudVirtualizationLab = lazy(() => import("./CloudVirtualizationLab"));
const OSCommandLab = lazy(() => import("./OSCommandLab"));
const ProgrammingConceptsLab = lazy(() => import("./ProgrammingConceptsLab"));
const DatabaseQueryLab = lazy(() => import("./DatabaseQueryLab"));
const DeviceHardeningLab = lazy(() => import("./DeviceHardeningLab"));
const TechPlusReviewLab = lazy(() => import("./TechPlusReviewLab"));

// ── Network+ (14 labs) ──
const OSIModelLab = lazy(() => import("./OSIModelLab"));
const SwitchConfigLab = lazy(() => import("./SwitchConfigLab"));
const IPSubnettingLab = lazy(() => import("./IPSubnettingLab"));
const QoSLab = lazy(() => import("./QoSLab"));
const RoutingProtocolLab = lazy(() => import("./RoutingProtocolLab"));
const VPNTunnelLab = lazy(() => import("./VPNTunnelLab"));
const WirelessSecurityLab = lazy(() => import("./WirelessSecurityLab"));
const NetworkDocumentationLab = lazy(() => import("./NetworkDocumentationLab"));
const NetworkMonitoringLab = lazy(() => import("./NetworkMonitoringLab"));
const NetworkServicesLab = lazy(() => import("./NetworkServicesLab"));
const NetworkSecurityDeviceLab = lazy(() => import("./NetworkSecurityDeviceLab"));
const WANTechnologyLab = lazy(() => import("./WANTechnologyLab"));
const NetworkTroubleshootLab = lazy(() => import("./NetworkTroubleshootLab"));
const NetworkPlusReviewLab = lazy(() => import("./NetworkPlusReviewLab"));

// ── CISM (14 labs) ──
const InfoSecGovernanceLab = lazy(() => import("./InfoSecGovernanceLab"));
const RiskAssessmentLab = lazy(() => import("./RiskAssessmentLab"));
const RiskTreatmentLab = lazy(() => import("./RiskTreatmentLab"));
const SecurityProgramLab = lazy(() => import("./SecurityProgramLab"));
const AccessControlLab = lazy(() => import("./AccessControlLab"));
const SecurityArchitectureLab = lazy(() => import("./SecurityArchitectureLab"));
const IncidentResponsePlanLab = lazy(() => import("./IncidentResponsePlanLab"));
const IncidentDetectionLab = lazy(() => import("./IncidentDetectionLab"));
const IncidentContainmentLab = lazy(() => import("./IncidentContainmentLab"));
const ForensicsEvidenceLab = lazy(() => import("./ForensicsEvidenceLab"));
const BCPDRPlanningLab = lazy(() => import("./BCPDRPlanningLab"));
const ComplianceFrameworkLab = lazy(() => import("./ComplianceFrameworkLab"));
const SecurityAwarenessLab = lazy(() => import("./SecurityAwarenessLab"));
const CISMReviewLab = lazy(() => import("./CISMReviewLab"));

// ── CEH (14 labs) ──
const EthicalHackingIntroLab = lazy(() => import("./EthicalHackingIntroLab"));
const FootprintingReconLab = lazy(() => import("./FootprintingReconLab"));
const NmapScannerLab = lazy(() => import("./NmapScannerLab"));
const CEHVulnerabilityAnalysisLab = lazy(() => import("./CEHVulnerabilityAnalysisLab"));
const SystemHackingLab = lazy(() => import("./SystemHackingLab"));
const MalwareAnalysisLab = lazy(() => import("./MalwareAnalysisLab"));
const NetworkSniffingLab = lazy(() => import("./NetworkSniffingLab"));
const SocialEngineeringLab = lazy(() => import("./SocialEngineeringLab"));
const DosDdosLab = lazy(() => import("./DosDdosLab"));
const IDSEvasionLab = lazy(() => import("./IDSEvasionLab"));
const WebAppHackingLab = lazy(() => import("./WebAppHackingLab"));
const CEHWirelessLab = lazy(() => import("./CEHWirelessLab"));
const MobileIoTLab = lazy(() => import("./MobileIoTLab"));
const CloudSecurityLab = lazy(() => import("./CloudSecurityLab"));

type LabComponentProps = { onComplete?: (score?: number) => void };

type MiniGameMapping = {
  keywords: string[];
  courseSlugPattern: string;
  component: React.LazyExoticComponent<React.ComponentType<LabComponentProps>>;
  name: string;
  nameAr: string;
};

const MAPPINGS: MiniGameMapping[] = [
  // ═══════════════════════════════════════════
  // SECURITY+ SY0-701 (14 lectures → 14 labs)
  // ═══════════════════════════════════════════
  {
    keywords: ["security controls and fundamental"],
    courseSlugPattern: "security-plus",
    component: FirewallRuleBuilder,
    name: "Firewall Rule Builder",
    nameAr: "بناء قواعد جدار الحماية",
  },
  {
    keywords: ["zero trust", "physical security", "deception"],
    courseSlugPattern: "security-plus",
    component: ZeroTrustLab,
    name: "Zero Trust Architecture Lab",
    nameAr: "مختبر بنية الثقة المعدومة",
  },
  {
    keywords: ["change management and cryptography"],
    courseSlugPattern: "security-plus",
    component: EncryptionChallenge,
    name: "Encryption Challenge",
    nameAr: "تحدي التشفير",
  },
  {
    keywords: ["threat actors", "motivations", "attack vectors"],
    courseSlugPattern: "security-plus",
    component: ThreatClassifier,
    name: "Threat Classifier",
    nameAr: "مصنّف التهديدات",
  },
  {
    keywords: ["vulnerabilities and indicators"],
    courseSlugPattern: "security-plus",
    component: VulnerabilityScannerLab,
    name: "Vulnerability Scanner Lab",
    nameAr: "مختبر فحص الثغرات",
  },
  {
    keywords: ["mitigation techniques"],
    courseSlugPattern: "security-plus",
    component: MitigationMatchLab,
    name: "Mitigation Match Lab",
    nameAr: "مختبر مطابقة التخفيف",
  },
  {
    keywords: ["architecture models", "infrastructure concepts"],
    courseSlugPattern: "security-plus",
    component: NetworkHardeningLab,
    name: "Ransomware Hospital Attack",
    nameAr: "محاكاة هجوم فدية على مستشفى",
  },
  {
    keywords: ["securing enterprise infrastructure"],
    courseSlugPattern: "security-plus",
    component: SecureInfraLab,
    name: "Secure Infrastructure Lab",
    nameAr: "مختبر البنية التحتية الآمنة",
  },
  {
    keywords: ["data protection", "resilience", "recovery"],
    courseSlugPattern: "security-plus",
    component: DataProtectionLab,
    name: "Data Protection Lab",
    nameAr: "مختبر حماية البيانات",
  },
  {
    keywords: ["computing resources", "asset management"],
    courseSlugPattern: "security-plus",
    component: AssetManagementLab,
    name: "Asset Management Lab",
    nameAr: "مختبر إدارة الأصول",
  },
  {
    keywords: ["vulnerability management", "alerting", "monitoring"],
    courseSlugPattern: "security-plus",
    component: LogAnalysisLab,
    name: "Log Analysis Lab",
    nameAr: "مختبر تحليل السجلات",
  },
  {
    keywords: ["enhancement", "iam", "automation"],
    courseSlugPattern: "security-plus",
    component: AutomationScriptingLab,
    name: "Automation & Scripting Lab",
    nameAr: "مختبر الأتمتة والبرمجة",
  },
  {
    keywords: ["security governance", "risk management", "incident response"],
    courseSlugPattern: "security-plus",
    component: IncidentResponseSim,
    name: "Incident Response Simulator",
    nameAr: "محاكي الاستجابة للحوادث",
  },
  {
    keywords: ["third-party risk", "compliance", "audits", "security awareness"],
    courseSlugPattern: "security-plus",
    component: ComplianceAuditLab,
    name: "Compliance Audit Lab",
    nameAr: "مختبر تدقيق الامتثال",
  },

  // ═══════════════════════════════════════════
  // SECAI+ CY0-001 (10 lectures → 10 labs)
  // ═══════════════════════════════════════════
  {
    keywords: ["introduction to ai"],
    courseSlugPattern: "secai",
    component: AIThreatDetection,
    name: "AI Threat Detection",
    nameAr: "كشف تهديدات الذكاء الاصطناعي",
  },
  {
    keywords: ["data security for ai"],
    courseSlugPattern: "secai",
    component: AIDataSecurityLab,
    name: "AI Data Security Lab",
    nameAr: "مختبر أمن بيانات الذكاء الاصطناعي",
  },
  {
    keywords: ["ai threat modeling"],
    courseSlugPattern: "secai",
    component: PromptInjectionChallenge,
    name: "Prompt Injection Challenge",
    nameAr: "تحدي حقن الأوامر",
  },
  {
    keywords: ["security controls for ai"],
    courseSlugPattern: "secai",
    component: AISecurityControlsLab,
    name: "AI Security Controls Lab",
    nameAr: "مختبر ضوابط أمن الذكاء الاصطناعي",
  },
  {
    keywords: ["data security and monitoring for ai"],
    courseSlugPattern: "secai",
    component: AIMonitoringLab,
    name: "AI Monitoring Lab",
    nameAr: "مختبر مراقبة الذكاء الاصطناعي",
  },
  {
    keywords: ["ai attack analysis", "compensating controls"],
    courseSlugPattern: "secai",
    component: AIAttackAnalysisLab,
    name: "AI Attack Analysis Lab",
    nameAr: "مختبر تحليل هجمات الذكاء الاصطناعي",
  },
  {
    keywords: ["ai-enabled security tools"],
    courseSlugPattern: "secai",
    component: AISecurityToolsLab,
    name: "AI Security Tools Lab",
    nameAr: "مختبر أدوات أمن الذكاء الاصطناعي",
  },
  {
    keywords: ["ai-enhanced attacks", "security automation"],
    courseSlugPattern: "secai",
    component: AIEnhancedAttacksLab,
    name: "AI-Enhanced Attacks Lab",
    nameAr: "مختبر الهجمات المعززة بالذكاء الاصطناعي",
  },
  {
    keywords: ["ai governance and risk"],
    courseSlugPattern: "secai",
    component: DataClassificationGame,
    name: "Data Classification Game",
    nameAr: "لعبة تصنيف البيانات",
  },
  {
    keywords: ["ai compliance", "review", "exam preparation"],
    courseSlugPattern: "secai",
    component: AIComplianceLab,
    name: "AI Compliance Lab",
    nameAr: "مختبر امتثال الذكاء الاصطناعي",
  },

  // ═══════════════════════════════════════════
  // TECH+ FC0-U71 (10 lectures → 10 labs)
  // ═══════════════════════════════════════════
  {
    keywords: ["computing foundations", "troubleshooting methodology"],
    courseSlugPattern: "tech-plus",
    component: TroubleshootingMethodLab,
    name: "Troubleshooting Method Lab",
    nameAr: "مختبر منهجية استكشاف الأخطاء",
  },
  {
    keywords: ["computing devices", "internal components"],
    courseSlugPattern: "tech-plus",
    component: ComponentIdentifierLab,
    name: "Component Identifier Lab",
    nameAr: "مختبر تحديد المكونات",
  },
  {
    keywords: ["storage", "peripherals", "device interfaces"],
    courseSlugPattern: "tech-plus",
    component: StorageInterfaceLab,
    name: "Storage & Interface Lab",
    nameAr: "مختبر التخزين والواجهات",
  },
  {
    keywords: ["networking fundamentals", "wireless technologies"],
    courseSlugPattern: "tech-plus",
    component: NetworkBasicsLab,
    name: "Network Basics Lab",
    nameAr: "مختبر أساسيات الشبكات",
  },
  {
    keywords: ["virtualization", "cloud computing"],
    courseSlugPattern: "tech-plus",
    component: CloudVirtualizationLab,
    name: "Cloud & Virtualization Lab",
    nameAr: "مختبر الحوسبة السحابية والافتراضية",
  },
  {
    keywords: ["operating systems", "software applications"],
    courseSlugPattern: "tech-plus",
    component: OSCommandLab,
    name: "OS Command Lab",
    nameAr: "مختبر أوامر نظام التشغيل",
  },
  {
    keywords: ["programming languages", "development concepts"],
    courseSlugPattern: "tech-plus",
    component: ProgrammingConceptsLab,
    name: "Programming Concepts Lab",
    nameAr: "مختبر مفاهيم البرمجة",
  },
  {
    keywords: ["data", "databases", "backup"],
    courseSlugPattern: "tech-plus",
    component: DatabaseQueryLab,
    name: "Database Query Lab",
    nameAr: "مختبر استعلامات قواعد البيانات",
  },
  {
    keywords: ["security concepts", "device hardening", "encryption"],
    courseSlugPattern: "tech-plus",
    component: DeviceHardeningLab,
    name: "Device Hardening Lab",
    nameAr: "مختبر تقوية الأجهزة",
  },
  {
    keywords: ["comprehensive review", "exam preparation"],
    courseSlugPattern: "tech-plus",
    component: TechPlusReviewLab,
    name: "Tech+ Review Lab",
    nameAr: "مختبر مراجعة Tech+",
  },

  // ═══════════════════════════════════════════
  // NETWORK+ N10-009 (14 lectures → 14 labs)
  // ═══════════════════════════════════════════
  {
    keywords: ["introduction to networking", "osi model"],
    courseSlugPattern: "network-plus",
    component: OSIModelLab,
    name: "OSI Model Lab",
    nameAr: "مختبر نموذج OSI",
  },
  {
    keywords: ["network devices", "infrastructure"],
    courseSlugPattern: "network-plus",
    component: SwitchConfigLab,
    name: "Switch Configuration Lab",
    nameAr: "مختبر تكوين المحولات",
  },
  {
    keywords: ["ip addressing", "subnetting", "topologies"],
    courseSlugPattern: "network-plus",
    component: IPSubnettingLab,
    name: "IP Subnetting Lab",
    nameAr: "مختبر تقسيم الشبكات الفرعية",
  },
  {
    keywords: ["ports", "protocols", "cloud", "traffic types"],
    courseSlugPattern: "network-plus",
    component: QoSLab,
    name: "QoS & Protocols Lab",
    nameAr: "مختبر جودة الخدمة والبروتوكولات",
  },
  {
    keywords: ["routing technologies"],
    courseSlugPattern: "network-plus",
    component: RoutingProtocolLab,
    name: "Routing Protocol Lab",
    nameAr: "مختبر بروتوكولات التوجيه",
  },
  {
    keywords: ["switching", "vlans", "spanning tree"],
    courseSlugPattern: "network-plus",
    component: VPNTunnelLab,
    name: "VPN & Tunnel Lab",
    nameAr: "مختبر VPN والأنفاق",
  },
  {
    keywords: ["wireless networking", "physical installations"],
    courseSlugPattern: "network-plus",
    component: WirelessSecurityLab,
    name: "Wireless Security Lab",
    nameAr: "مختبر أمن الشبكات اللاسلكية",
  },
  {
    keywords: ["network documentation", "lifecycle"],
    courseSlugPattern: "network-plus",
    component: NetworkDocumentationLab,
    name: "Network Documentation Lab",
    nameAr: "مختبر توثيق الشبكات",
  },
  {
    keywords: ["network monitoring", "configuration management"],
    courseSlugPattern: "network-plus",
    component: NetworkMonitoringLab,
    name: "Network Monitoring Lab",
    nameAr: "مختبر مراقبة الشبكات",
  },
  {
    keywords: ["network services", "disaster recovery"],
    courseSlugPattern: "network-plus",
    component: NetworkServicesLab,
    name: "Network Services Lab",
    nameAr: "مختبر خدمات الشبكات",
  },
  {
    keywords: ["network security fundamentals"],
    courseSlugPattern: "network-plus",
    component: NetworkSecurityDeviceLab,
    name: "Network Security Device Lab",
    nameAr: "مختبر أجهزة أمن الشبكات",
  },
  {
    keywords: ["network attacks", "defense strategies"],
    courseSlugPattern: "network-plus",
    component: WANTechnologyLab,
    name: "WAN Technology Lab",
    nameAr: "مختبر تقنيات WAN",
  },
  {
    keywords: ["troubleshooting methodology", "physical issues"],
    courseSlugPattern: "network-plus",
    component: NetworkTroubleshootLab,
    name: "Network Troubleshooting Lab",
    nameAr: "مختبر استكشاف أخطاء الشبكات",
  },
  {
    keywords: ["network services troubleshooting", "tools"],
    courseSlugPattern: "network-plus",
    component: NetworkPlusReviewLab,
    name: "Network+ Review Lab",
    nameAr: "مختبر مراجعة Network+",
  },

  // ═══════════════════════════════════════════
  // CISM (14 lectures → 14 labs)
  // ═══════════════════════════════════════════
  {
    keywords: ["enterprise governance", "organizational culture"],
    courseSlugPattern: "cism",
    component: InfoSecGovernanceLab,
    name: "InfoSec Governance Lab",
    nameAr: "مختبر حوكمة أمن المعلومات",
  },
  {
    keywords: ["information security strategy"],
    courseSlugPattern: "cism",
    component: RiskAssessmentLab,
    name: "Risk Assessment Lab",
    nameAr: "مختبر تقييم المخاطر",
  },
  {
    keywords: ["risk assessment fundamentals", "threat landscape"],
    courseSlugPattern: "cism",
    component: RiskTreatmentLab,
    name: "Risk Treatment Lab",
    nameAr: "مختبر معالجة المخاطر",
  },
  {
    keywords: ["vulnerability analysis", "risk assessment methods"],
    courseSlugPattern: "cism",
    component: SecurityProgramLab,
    name: "Security Program Lab",
    nameAr: "مختبر البرنامج الأمني",
  },
  {
    keywords: ["risk response", "ownership", "monitoring"],
    courseSlugPattern: "cism",
    component: AccessControlLab,
    name: "Access Control Lab",
    nameAr: "مختبر التحكم في الوصول",
  },
  {
    keywords: ["security program development", "resources"],
    courseSlugPattern: "cism",
    component: SecurityArchitectureLab,
    name: "Security Architecture Lab",
    nameAr: "مختبر هندسة الأمن",
  },
  {
    keywords: ["frameworks", "standards", "security policies"],
    courseSlugPattern: "cism",
    component: IncidentResponsePlanLab,
    name: "Incident Response Plan Lab",
    nameAr: "مختبر خطة الاستجابة للحوادث",
  },
  {
    keywords: ["control design", "selection", "implementation"],
    courseSlugPattern: "cism",
    component: IncidentDetectionLab,
    name: "Incident Detection Lab",
    nameAr: "مختبر كشف الحوادث",
  },
  {
    keywords: ["control testing", "awareness", "training programs"],
    courseSlugPattern: "cism",
    component: IncidentContainmentLab,
    name: "Incident Containment Lab",
    nameAr: "مختبر احتواء الحوادث",
  },
  {
    keywords: ["third-party management", "program reporting"],
    courseSlugPattern: "cism",
    component: ForensicsEvidenceLab,
    name: "Forensics & Evidence Lab",
    nameAr: "مختبر الأدلة الجنائية",
  },
  {
    keywords: ["incident management readiness", "planning"],
    courseSlugPattern: "cism",
    component: BCPDRPlanningLab,
    name: "BCP/DR Planning Lab",
    nameAr: "مختبر تخطيط استمرارية الأعمال",
  },
  {
    keywords: ["incident classification", "testing", "exercises"],
    courseSlugPattern: "cism",
    component: ComplianceFrameworkLab,
    name: "Compliance Framework Lab",
    nameAr: "مختبر إطار الامتثال",
  },
  {
    keywords: ["incident response operations", "post-incident"],
    courseSlugPattern: "cism",
    component: SecurityAwarenessLab,
    name: "Security Awareness Lab",
    nameAr: "مختبر التوعية الأمنية",
  },
  {
    keywords: ["comprehensive review", "exam preparation"],
    courseSlugPattern: "cism",
    component: CISMReviewLab,
    name: "CISM Review Lab",
    nameAr: "مختبر مراجعة CISM",
  },

  // ═══════════════════════════════════════════
  // CEH CERTIFIED ETHICAL HACKER (14 lectures → 14 labs)
  // ═══════════════════════════════════════════
  {
    keywords: ["introduction to ethical hacking", "information security"],
    courseSlugPattern: "ceh",
    component: EthicalHackingIntroLab,
    name: "Ethical Hacking Intro Lab",
    nameAr: "مختبر مقدمة القرصنة الأخلاقية",
  },
  {
    keywords: ["footprinting", "reconnaissance"],
    courseSlugPattern: "ceh",
    component: FootprintingReconLab,
    name: "Footprinting & Recon Lab",
    nameAr: "مختبر البصمة والاستطلاع",
  },
  {
    keywords: ["scanning networks", "enumeration"],
    courseSlugPattern: "ceh",
    component: NmapScannerLab,
    name: "Nmap Scanner Simulator",
    nameAr: "محاكي ماسح Nmap",
  },
  {
    keywords: ["vulnerability analysis", "assessment"],
    courseSlugPattern: "ceh",
    component: CEHVulnerabilityAnalysisLab,
    name: "Vulnerability Analysis Lab",
    nameAr: "مختبر تحليل الثغرات",
  },
  {
    keywords: ["system hacking", "gaining", "maintaining access"],
    courseSlugPattern: "ceh",
    component: SystemHackingLab,
    name: "System Hacking Lab",
    nameAr: "مختبر اختراق الأنظمة",
  },
  {
    keywords: ["malware threats"],
    courseSlugPattern: "ceh",
    component: MalwareAnalysisLab,
    name: "Malware Analysis Lab",
    nameAr: "مختبر تحليل البرمجيات الخبيثة",
  },
  {
    keywords: ["network sniffing", "traffic analysis"],
    courseSlugPattern: "ceh",
    component: NetworkSniffingLab,
    name: "Network Sniffing Lab",
    nameAr: "مختبر التنصت على الشبكات",
  },
  {
    keywords: ["social engineering", "human-based attacks"],
    courseSlugPattern: "ceh",
    component: SocialEngineeringLab,
    name: "Social Engineering Lab",
    nameAr: "مختبر الهندسة الاجتماعية",
  },
  {
    keywords: ["dos/ddos", "session hijacking"],
    courseSlugPattern: "ceh",
    component: DosDdosLab,
    name: "DoS/DDoS & Session Hijacking Lab",
    nameAr: "مختبر هجمات حجب الخدمة واختطاف الجلسات",
  },
  {
    keywords: ["evading ids", "firewalls", "honeypots"],
    courseSlugPattern: "ceh",
    component: IDSEvasionLab,
    name: "IDS Evasion & Honeypot Lab",
    nameAr: "مختبر التهرب من IDS والمصائد",
  },
  {
    keywords: ["web server", "web application hacking"],
    courseSlugPattern: "ceh",
    component: WebAppHackingLab,
    name: "Web Application Hacking Lab",
    nameAr: "مختبر اختراق تطبيقات الويب",
  },
  {
    keywords: ["sql injection", "wireless hacking"],
    courseSlugPattern: "ceh",
    component: CEHWirelessLab,
    name: "SQL Injection & Wireless Lab",
    nameAr: "مختبر حقن SQL والشبكات اللاسلكية",
  },
  {
    keywords: ["mobile", "iot", "ot hacking"],
    courseSlugPattern: "ceh",
    component: MobileIoTLab,
    name: "Mobile, IoT & OT Lab",
    nameAr: "مختبر الأجهزة المحمولة وIoT وOT",
  },
  {
    keywords: ["cloud computing security", "cryptography"],
    courseSlugPattern: "ceh",
    component: CloudSecurityLab,
    name: "Cloud Security & Cryptography Lab",
    nameAr: "مختبر أمن السحابة والتشفير",
  },
];

function findMiniGame(lectureTitle: string, courseSlug: string): MiniGameMapping | null {
  const titleLower = lectureTitle.toLowerCase();
  const slugLower = courseSlug.toLowerCase();

  for (const mapping of MAPPINGS) {
    if (!slugLower.includes(mapping.courseSlugPattern)) continue;
    const matches = mapping.keywords.some(kw => titleLower.includes(kw));
    if (matches) return mapping;
  }
  return null;
}

function MiniGameFallback() {
  return (
    <div className="bg-[#001A16] border-2 border-[#0A6B5A]/40 p-6 my-8 flex items-center justify-center">
      <Loader2 className="w-6 h-6 text-[#D4AF37] animate-spin mr-3" />
      <span className="text-[#C4B9A8] font-['Work_Sans'] text-sm">Loading mini-game...</span>
    </div>
  );
}

export default function MiniGameMapper({ lectureTitle, courseSlug, onLabComplete }: { lectureTitle: string; courseSlug: string; onLabComplete?: (score?: number) => void }) {
  const mapping = findMiniGame(lectureTitle, courseSlug);
  const { tx } = useLabLang();

  if (!mapping) return null;

  const Component = mapping.component;

  return (
    <div className="my-8">
      {/* Mini-Game Banner */}
      <div className="flex items-center gap-3 mb-2 px-2">
        <Gamepad2 className="w-5 h-5 text-[#D4AF37]" />
        <span className="text-[#D4AF37] font-['Montserrat'] text-sm font-bold uppercase tracking-wider">
          {tx("Interactive Lab:", "مختبر تفاعلي:")} {tx(mapping.name, mapping.nameAr)}
        </span>
      </div>
      <Suspense fallback={<MiniGameFallback />}>
        <Component onComplete={onLabComplete} />
      </Suspense>
    </div>
  );
}
