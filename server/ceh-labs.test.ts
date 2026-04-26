import { describe, expect, it } from "vitest";

/**
 * Test that the MiniGameMapper keyword matching logic correctly maps
 * all 14 CEH lecture titles to their corresponding labs.
 *
 * We replicate the matching logic here (pure function) to verify
 * the keyword-to-title mapping without needing a DOM/React environment.
 */

// Replicate the matching logic from MiniGameMapper
type MiniGameMapping = {
  keywords: string[];
  courseSlugPattern: string;
  name: string;
};

const CEH_MAPPINGS: MiniGameMapping[] = [
  { keywords: ["introduction to ethical hacking", "information security"], courseSlugPattern: "ceh", name: "Ethical Hacking Intro Lab" },
  { keywords: ["footprinting", "reconnaissance"], courseSlugPattern: "ceh", name: "Footprinting & Recon Lab" },
  { keywords: ["scanning networks", "enumeration"], courseSlugPattern: "ceh", name: "Nmap Scanner Simulator" },
  { keywords: ["vulnerability analysis", "assessment"], courseSlugPattern: "ceh", name: "Vulnerability Analysis Lab" },
  { keywords: ["system hacking", "gaining", "maintaining access"], courseSlugPattern: "ceh", name: "System Hacking Lab" },
  { keywords: ["malware threats"], courseSlugPattern: "ceh", name: "Malware Analysis Lab" },
  { keywords: ["network sniffing", "traffic analysis"], courseSlugPattern: "ceh", name: "Network Sniffing Lab" },
  { keywords: ["social engineering", "human-based attacks"], courseSlugPattern: "ceh", name: "Social Engineering Lab" },
  { keywords: ["dos/ddos", "session hijacking"], courseSlugPattern: "ceh", name: "DoS/DDoS & Session Hijacking Lab" },
  { keywords: ["evading ids", "firewalls", "honeypots"], courseSlugPattern: "ceh", name: "IDS Evasion & Honeypot Lab" },
  { keywords: ["web server", "web application hacking"], courseSlugPattern: "ceh", name: "Web Application Hacking Lab" },
  { keywords: ["sql injection", "wireless hacking"], courseSlugPattern: "ceh", name: "SQL Injection & Wireless Lab" },
  { keywords: ["mobile", "iot", "ot hacking"], courseSlugPattern: "ceh", name: "Mobile, IoT & OT Lab" },
  { keywords: ["cloud computing security", "cryptography"], courseSlugPattern: "ceh", name: "Cloud Security & Cryptography Lab" },
];

function findMiniGame(lectureTitle: string, courseSlug: string): MiniGameMapping | null {
  const titleLower = lectureTitle.toLowerCase();
  const slugLower = courseSlug.toLowerCase();

  for (const mapping of CEH_MAPPINGS) {
    if (!slugLower.includes(mapping.courseSlugPattern)) continue;
    const matches = mapping.keywords.some(kw => titleLower.includes(kw));
    if (matches) return mapping;
  }
  return null;
}

// Actual CEH lecture titles from the database
const CEH_LECTURES = [
  { title: "Day 1: Introduction to Ethical Hacking & Information Security", expectedLab: "Ethical Hacking Intro Lab" },
  { title: "Day 2: Footprinting & Reconnaissance Techniques", expectedLab: "Footprinting & Recon Lab" },
  { title: "Day 3: Scanning Networks & Enumeration", expectedLab: "Nmap Scanner Simulator" },
  { title: "Day 4: Vulnerability Analysis & Assessment", expectedLab: "Vulnerability Analysis Lab" },
  { title: "Day 5: System Hacking — Gaining & Maintaining Access", expectedLab: "System Hacking Lab" },
  { title: "Day 6: Malware Threats & Analysis", expectedLab: "Malware Analysis Lab" },
  { title: "Day 7: Network Sniffing & Traffic Analysis", expectedLab: "Network Sniffing Lab" },
  { title: "Day 8: Social Engineering & Human-Based Attacks", expectedLab: "Social Engineering Lab" },
  { title: "Day 9: Lecture 9: DoS/DDoS Attacks & Session Hijacking", expectedLab: "DoS/DDoS & Session Hijacking Lab" },
  { title: "Day 10: Evading IDS, Firewalls & Honeypots", expectedLab: "IDS Evasion & Honeypot Lab" },
  { title: "Day 11: Web Server & Web Application Hacking", expectedLab: "Web Application Hacking Lab" },
  { title: "Day 12: SQL Injection & Wireless Hacking", expectedLab: "SQL Injection & Wireless Lab" },
  { title: "Day 13: Mobile, IoT & OT Hacking", expectedLab: "Mobile, IoT & OT Lab" },
  { title: "Day 14: Cloud Computing Security & Cryptography", expectedLab: "Cloud Security & Cryptography Lab" },
];

const CEH_SLUG = "ceh-certified-ethical-hacker";

describe("CEH Interactive Labs Mapping", () => {
  it("should have exactly 14 CEH lab mappings", () => {
    expect(CEH_MAPPINGS.length).toBe(14);
  });

  it("should map all 14 CEH lecture titles to the correct lab", () => {
    for (const lecture of CEH_LECTURES) {
      const result = findMiniGame(lecture.title, CEH_SLUG);
      expect(result, `No lab found for: "${lecture.title}"`).not.toBeNull();
      expect(result!.name, `Wrong lab for: "${lecture.title}"`).toBe(lecture.expectedLab);
    }
  });

  it("should not match CEH labs to non-CEH course slugs", () => {
    const result = findMiniGame("Introduction to Ethical Hacking & Information Security", "security-plus-sy0-701");
    expect(result).toBeNull();
  });

  it("should return null for unrelated lecture titles in CEH course", () => {
    const result = findMiniGame("Unrelated Topic: Cooking Basics", CEH_SLUG);
    expect(result).toBeNull();
  });

  it("each CEH mapping should have unique keywords that don't overlap", () => {
    // Verify no two mappings match the same lecture title
    for (const lecture of CEH_LECTURES) {
      const matches = CEH_MAPPINGS.filter(m => {
        const titleLower = lecture.title.toLowerCase();
        return m.keywords.some(kw => titleLower.includes(kw));
      });
      expect(matches.length, `Multiple labs match: "${lecture.title}" → ${matches.map(m => m.name).join(", ")}`).toBe(1);
    }
  });

  // Test specific lab: Nmap Scanner (the one user specifically requested)
  it("should map Day 3 (Scanning Networks) to the Nmap Scanner Simulator", () => {
    const result = findMiniGame("Day 3: Scanning Networks & Enumeration", CEH_SLUG);
    expect(result).not.toBeNull();
    expect(result!.name).toBe("Nmap Scanner Simulator");
  });
});
