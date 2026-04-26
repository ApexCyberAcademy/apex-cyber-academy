/**
 * Generate seed data for Tech+, CISM, and Network+ courses.
 * Reads study guide markdown files and builds JSON seed data.
 * Run: node generate-new-courses-seed.mjs
 */

import { readFileSync, writeFileSync } from 'fs';

// ─── TECH+ FC0-U71 (Lectures 25–34) ─────────────────────────────
const techPlus = {
  slug: "tech-plus-fc0-u71",
  title: "CompTIA Tech+ (FC0-U71)",
  subtitle: "Entry-level IT fundamentals certification prep",
  description: "Comprehensive preparation for the CompTIA Tech+ FC0-U71 certification exam. Covers all six exam domains: Tech Concepts, Infrastructure, Applications & Software, Software Development, Data & Databases, and Security. 10 sessions of expert-led instruction designed for complete beginners with no prior IT experience.",
  certCode: "FC0-U71",
  totalHours: 20,
  totalSessions: 10,
  examFormat: "70 multiple-choice questions, 60 minutes, passing score 650/900",
  priceSelfPaced: 49,
  priceLive: 99,
  imageUrl: null,
  sortOrder: 1,
  modules: [
    {
      title: "Module 1: Tech Concepts & Terminology",
      description: "Computing foundations, troubleshooting methodology, notational systems, and units of measure.",
      sortOrder: 1,
      examWeight: "13%",
      lectures: [25],
      lectureTitles: ["Computing Foundations & Troubleshooting Methodology"],
      lectureSlugs: ["computing-foundations-troubleshooting-methodology"],
      lectureObjectives: ["1.1, 1.2, 1.3, 1.4"],
    },
    {
      title: "Module 2: Infrastructure",
      description: "Computing devices, internal components, storage, peripherals, networking fundamentals, wireless technologies, virtualization, and cloud computing.",
      sortOrder: 2,
      examWeight: "24%",
      lectures: [26, 27, 28, 29],
      lectureTitles: [
        "Computing Devices & Internal Components",
        "Storage, Peripherals & Device Interfaces",
        "Networking Fundamentals & Wireless Technologies",
        "Virtualization, Cloud Computing & Infrastructure Review",
      ],
      lectureSlugs: [
        "computing-devices-internal-components",
        "storage-peripherals-device-interfaces",
        "networking-fundamentals-wireless-technologies",
        "virtualization-cloud-computing-infrastructure-review",
      ],
      lectureObjectives: ["2.1, 2.2", "2.3, 2.4, 2.5", "2.7, 2.8", "2.6"],
    },
    {
      title: "Module 3: Applications & Software",
      description: "Operating systems, software applications, web technologies, and application management.",
      sortOrder: 3,
      examWeight: "18%",
      lectures: [30],
      lectureTitles: ["Operating Systems & Software Applications"],
      lectureSlugs: ["operating-systems-software-applications"],
      lectureObjectives: ["3.1, 3.2, 3.3, 3.4, 3.5"],
    },
    {
      title: "Module 4: Software Development",
      description: "Programming languages, development concepts, version control, and software testing.",
      sortOrder: 4,
      examWeight: "13%",
      lectures: [31],
      lectureTitles: ["Programming Languages & Development Concepts"],
      lectureSlugs: ["programming-languages-development-concepts"],
      lectureObjectives: ["4.1, 4.2, 4.3, 4.4"],
    },
    {
      title: "Module 5: Data & Databases",
      description: "Data types, databases, SQL fundamentals, backup strategies, and data management.",
      sortOrder: 5,
      examWeight: "13%",
      lectures: [32],
      lectureTitles: ["Data, Databases & Backup Fundamentals"],
      lectureSlugs: ["data-databases-backup-fundamentals"],
      lectureObjectives: ["5.1, 5.2, 5.3, 5.4"],
    },
    {
      title: "Module 6: Security",
      description: "Security concepts, device hardening, encryption, and best practices for protecting systems.",
      sortOrder: 6,
      examWeight: "19%",
      lectures: [33, 34],
      lectureTitles: [
        "Security Concepts, Device Hardening & Encryption",
        "Comprehensive Review & Exam Preparation",
      ],
      lectureSlugs: [
        "security-concepts-device-hardening-encryption",
        "comprehensive-review-exam-preparation",
      ],
      lectureObjectives: ["6.1, 6.2, 6.3, 6.4", "All Domains"],
    },
  ],
  quizQuestionCounts: [12, 20, 15, 10, 10, 15],
  finalExamQuestionCount: 70,
};

// ─── CISM (Lectures 35–48) ───────────────────────────────────────
const cism = {
  slug: "cism-certified-information-security-manager",
  title: "ISACA CISM",
  subtitle: "Certified Information Security Manager certification prep",
  description: "Premium preparation for the ISACA Certified Information Security Manager (CISM) exam. Covers all four exam domains: Information Security Governance, Risk Management, Security Program, and Incident Management. 14 sessions of expert-led instruction targeting IT managers, security consultants, and aspiring CISOs.",
  certCode: "CISM",
  totalHours: 28,
  totalSessions: 14,
  examFormat: "150 multiple-choice questions, 4 hours, passing score 450/800",
  priceSelfPaced: 399,
  priceLive: 799,
  imageUrl: null,
  sortOrder: 4,
  modules: [
    {
      title: "Domain 1: Information Security Governance",
      description: "Enterprise governance, organizational culture, legal and regulatory requirements, and information security strategy development.",
      sortOrder: 1,
      examWeight: "17%",
      lectures: [35, 36],
      lectureTitles: [
        "Enterprise Governance & Organizational Culture",
        "Information Security Strategy Development",
      ],
      lectureSlugs: [
        "enterprise-governance-organizational-culture",
        "information-security-strategy-development",
      ],
      lectureObjectives: ["1A", "1B"],
    },
    {
      title: "Domain 2: Information Security Risk Management",
      description: "Risk assessment fundamentals, vulnerability analysis, risk response strategies, and continuous risk monitoring.",
      sortOrder: 2,
      examWeight: "20%",
      lectures: [37, 38, 39],
      lectureTitles: [
        "Risk Assessment Fundamentals & Threat Landscape",
        "Vulnerability Analysis & Risk Assessment Methods",
        "Risk Response, Ownership & Monitoring",
      ],
      lectureSlugs: [
        "risk-assessment-fundamentals-threat-landscape",
        "vulnerability-analysis-risk-assessment-methods",
        "risk-response-ownership-monitoring",
      ],
      lectureObjectives: ["2A", "2A", "2B"],
    },
    {
      title: "Domain 3: Information Security Program",
      description: "Security program development, frameworks, standards, control design, awareness training, and third-party management.",
      sortOrder: 3,
      examWeight: "33%",
      lectures: [40, 41, 42, 43, 44],
      lectureTitles: [
        "Security Program Development & Resources",
        "Frameworks, Standards & Security Policies",
        "Control Design, Selection & Implementation",
        "Control Testing, Awareness & Training Programs",
        "Third-Party Management & Program Reporting",
      ],
      lectureSlugs: [
        "security-program-development-resources",
        "frameworks-standards-security-policies",
        "control-design-selection-implementation",
        "control-testing-awareness-training-programs",
        "third-party-management-program-reporting",
      ],
      lectureObjectives: ["3A", "3A", "3B", "3B", "3B"],
    },
    {
      title: "Domain 4: Incident Management",
      description: "Incident response planning, business continuity, disaster recovery, incident classification, and post-incident review.",
      sortOrder: 4,
      examWeight: "30%",
      lectures: [45, 46, 47, 48],
      lectureTitles: [
        "Incident Management Readiness & Planning",
        "Incident Classification, Testing & Exercises",
        "Incident Response Operations & Post-Incident Review",
        "Comprehensive Review & Exam Preparation",
      ],
      lectureSlugs: [
        "incident-management-readiness-planning",
        "incident-classification-testing-exercises",
        "incident-response-operations-post-incident-review",
        "comprehensive-review-exam-preparation-cism",
      ],
      lectureObjectives: ["4A", "4A", "4B", "All Domains"],
    },
  ],
  quizQuestionCounts: [15, 20, 30, 25],
  finalExamQuestionCount: 90,
};

// ─── NETWORK+ N10-009 (Lectures 49–62) ──────────────────────────
const networkPlus = {
  slug: "network-plus-n10-009",
  title: "CompTIA Network+ (N10-009)",
  subtitle: "Professional networking certification prep",
  description: "Comprehensive preparation for the CompTIA Network+ N10-009 certification exam. Covers all five exam domains: Networking Concepts, Network Implementation, Network Operations, Network Security, and Network Troubleshooting. 14 sessions of expert-led instruction with hands-on labs and practice exams.",
  certCode: "N10-009",
  totalHours: 28,
  totalSessions: 14,
  examFormat: "Max 90 questions, 90 minutes, passing score 720/900",
  priceSelfPaced: 79,
  priceLive: 159,
  imageUrl: null,
  sortOrder: 2,
  modules: [
    {
      title: "Domain 1: Networking Concepts",
      description: "OSI model, network devices, IP addressing, subnetting, ports, protocols, cloud concepts, and transmission media.",
      sortOrder: 1,
      examWeight: "23%",
      lectures: [49, 50, 51, 52],
      lectureTitles: [
        "Introduction to Networking & the OSI Model",
        "Network Devices & Infrastructure",
        "IP Addressing, Subnetting & Network Topologies",
        "Ports, Protocols, Cloud & Traffic Types",
      ],
      lectureSlugs: [
        "introduction-networking-osi-model",
        "network-devices-infrastructure",
        "ip-addressing-subnetting-network-topologies",
        "ports-protocols-cloud-traffic-types",
      ],
      lectureObjectives: ["1.1, 1.2", "1.3, 1.4", "1.5, 1.6", "1.7, 1.8"],
    },
    {
      title: "Domain 2: Network Implementation",
      description: "Routing technologies, switching and VLANs, wireless networking, and physical installations.",
      sortOrder: 2,
      examWeight: "20%",
      lectures: [53, 54, 55],
      lectureTitles: [
        "Routing Technologies",
        "Switching, VLANs & Spanning Tree",
        "Wireless Networking & Physical Installations",
      ],
      lectureSlugs: [
        "routing-technologies",
        "switching-vlans-spanning-tree",
        "wireless-networking-physical-installations",
      ],
      lectureObjectives: ["2.1, 2.2", "2.3, 2.4", "2.5, 2.6"],
    },
    {
      title: "Domain 3: Network Operations",
      description: "Network documentation, lifecycle management, monitoring, configuration management, and disaster recovery.",
      sortOrder: 3,
      examWeight: "19%",
      lectures: [56, 57, 58],
      lectureTitles: [
        "Network Documentation & Lifecycle Management",
        "Network Monitoring & Configuration Management",
        "Network Services & Disaster Recovery",
      ],
      lectureSlugs: [
        "network-documentation-lifecycle-management",
        "network-monitoring-configuration-management",
        "network-services-disaster-recovery",
      ],
      lectureObjectives: ["3.1, 3.2", "3.3, 3.4", "3.5, 3.6"],
    },
    {
      title: "Domain 4: Network Security",
      description: "Security fundamentals, CIA triad, authentication, network attacks, defense strategies, and compliance.",
      sortOrder: 4,
      examWeight: "14%",
      lectures: [59, 60],
      lectureTitles: [
        "Network Security Fundamentals",
        "Network Attacks & Defense Strategies",
      ],
      lectureSlugs: [
        "network-security-fundamentals",
        "network-attacks-defense-strategies",
      ],
      lectureObjectives: ["4.1, 4.2", "4.3, 4.4"],
    },
    {
      title: "Domain 5: Network Troubleshooting",
      description: "Troubleshooting methodology, physical issues, cable testing, network services troubleshooting, and command-line tools.",
      sortOrder: 5,
      examWeight: "24%",
      lectures: [61, 62],
      lectureTitles: [
        "Troubleshooting Methodology & Physical Issues",
        "Network Services Troubleshooting & Tools",
      ],
      lectureSlugs: [
        "troubleshooting-methodology-physical-issues",
        "network-services-troubleshooting-tools",
      ],
      lectureObjectives: ["5.1, 5.2, 5.3", "5.4, 5.5"],
    },
  ],
  quizQuestionCounts: [20, 18, 18, 15, 20],
  finalExamQuestionCount: 90,
};

// ─── QUESTION GENERATOR ──────────────────────────────────────────
function generateQuestions(courseName, moduleTitle, count, objectives) {
  // Generate placeholder questions that will be replaced with real ones
  // For now, create structurally valid questions
  const questions = [];
  for (let i = 1; i <= count; i++) {
    questions.push({
      number: i,
      questionText: `[${courseName}] ${moduleTitle} - Question ${i}: This question covers ${objectives}. (Placeholder - to be replaced with real exam-style questions)`,
      optionA: "Option A",
      optionB: "Option B",
      optionC: "Option C",
      optionD: "Option D",
      objective: objectives.split(",")[0]?.trim() || objectives,
      correctAnswer: ["A", "B", "C", "D"][Math.floor(Math.random() * 4)],
      explanation: `This is a placeholder explanation for ${moduleTitle} question ${i}.`,
    });
  }
  return questions;
}

// ─── BUILD COURSE DATA ───────────────────────────────────────────
function buildCourse(config) {
  const studyGuidePath = {
    "tech-plus-fc0-u71": "/home/ubuntu/apex_master_package/courses/03_CompTIA_Tech_Plus_FC0-U71/study_guides",
    "cism-certified-information-security-manager": "/home/ubuntu/apex_master_package/courses/04_ISACA_CISM/study_guides",
    "network-plus-n10-009": "/home/ubuntu/apex_master_package/courses/05_CompTIA_Network_Plus_N10-009/study_guides",
  }[config.slug];

  const courseData = {
    slug: config.slug,
    title: config.title,
    subtitle: config.subtitle,
    description: config.description,
    certCode: config.certCode,
    totalHours: config.totalHours,
    totalSessions: config.totalSessions,
    examFormat: config.examFormat,
    priceSelfPaced: config.priceSelfPaced,
    priceLive: config.priceLive,
    imageUrl: config.imageUrl,
    sortOrder: config.sortOrder,
    modules: [],
    finalExam: null,
  };

  let lectureSort = 1;

  for (let mi = 0; mi < config.modules.length; mi++) {
    const mod = config.modules[mi];
    const moduleData = {
      title: mod.title,
      description: mod.description,
      sortOrder: mod.sortOrder,
      examWeight: mod.examWeight,
      lectures: [],
      quiz: null,
    };

    for (let li = 0; li < mod.lectures.length; li++) {
      const lectureNum = mod.lectures[li];
      let studyGuideContent = null;
      try {
        studyGuideContent = readFileSync(`${studyGuidePath}/lecture_${lectureNum}_en.md`, 'utf-8');
      } catch (e) {
        console.warn(`  Warning: No study guide for lecture ${lectureNum}`);
      }

      // Use study guide as content too (same as existing courses)
      moduleData.lectures.push({
        title: `Day ${lectureSort}: ${mod.lectureTitles[li]}`,
        slug: `day-${lectureSort}-${mod.lectureSlugs[li]}`,
        content: studyGuideContent,
        studyGuideContent: studyGuideContent,
        glossaryContent: null,
        durationMinutes: 120,
        objectives: mod.lectureObjectives[li],
        sortOrder: lectureSort,
      });
      lectureSort++;
    }

    // Module quiz
    const qCount = config.quizQuestionCounts[mi];
    if (qCount > 0) {
      moduleData.quiz = {
        title: `${mod.title} Quiz`,
        description: `Test your knowledge of ${mod.title}`,
        isFinalExam: false,
        timeLimitMinutes: null,
        passingScore: 70,
        sortOrder: mod.sortOrder,
        questions: generateQuestions(config.title, mod.title, qCount, mod.examWeight),
      };
    }

    courseData.modules.push(moduleData);
  }

  // Final exam
  courseData.finalExam = {
    title: `${config.title} Final Practice Exam`,
    description: `Comprehensive final practice exam covering all domains of the ${config.certCode} certification.`,
    isFinalExam: true,
    timeLimitMinutes: config.certCode === "CISM" ? 240 : 90,
    passingScore: config.certCode === "CISM" ? 56 : 70,
    questions: generateQuestions(config.title, "Final Exam", config.finalExamQuestionCount, "All Domains"),
  };

  return courseData;
}

// ─── MAIN ────────────────────────────────────────────────────────
console.log("Building Tech+ course data...");
const techPlusData = buildCourse(techPlus);
console.log(`  ${techPlusData.modules.length} modules, ${techPlusData.modules.reduce((s, m) => s + m.lectures.length, 0)} lectures`);

console.log("Building CISM course data...");
const cismData = buildCourse(cism);
console.log(`  ${cismData.modules.length} modules, ${cismData.modules.reduce((s, m) => s + m.lectures.length, 0)} lectures`);

console.log("Building Network+ course data...");
const networkPlusData = buildCourse(networkPlus);
console.log(`  ${networkPlusData.modules.length} modules, ${networkPlusData.modules.reduce((s, m) => s + m.lectures.length, 0)} lectures`);

// Write to file
const seedData = {
  courses: [techPlusData, cismData, networkPlusData],
};

writeFileSync('new_courses_seed.json', JSON.stringify(seedData, null, 2));
console.log("\nSeed data written to new_courses_seed.json");
console.log(`File size: ${(JSON.stringify(seedData).length / 1024).toFixed(1)} KB`);
