import { createContext, useContext, useCallback, type ReactNode } from "react";

/**
 * Global version - English only. This stub keeps the same API surface
 * so existing components don't need import changes, just simpler usage.
 */

interface LanguageContextType {
  lang: "en" | "ar";
  toggleLang: () => void;
  setLang: (lang: string) => void;
  t: (key: string) => string;
  dir: "ltr";
}

const translations: Record<string, string> = {
  // Navigation
  "nav.home": "Home",
  "nav.courses": "Courses",
  "nav.about": "About",
  "nav.contact": "Contact",
  "nav.enroll": "Enroll Now",

  // Hero
  "hero.badge": "Special Offer - Limited Time Only",
  "hero.title1": "Master",
  "hero.title2": "Cybersecurity.",
  "hero.title3": "Advance Your Career.",
  "hero.subtitle": "Self-paced certification prep courses with comprehensive study guides, interactive labs, and expert-led instruction. Trusted by professionals worldwide.",
  "hero.cta1": "View Courses",
  "hero.cta2": "Free Consultation",

  // Course Section
  "courses.badge": "Our Courses",
  "courses.title": "Four Paths to Certification",
  "courses.subtitle": "From foundational to executive-level - choose the certification that matches your career goals",
  "courses.desc": "The industry standard for cybersecurity professionals. 14 sessions covering all five exam domains with hands-on practice and real-world scenarios.",

  // Pricing
  "pricing.title": "Limited Time Pricing",
  "pricing.subtitle": "Launch special - save up to 40% on all courses. Prices increase after the promotional period ends.",

  // Why Us
  "why.title": "Why Apex?",
  "why.subtitle": "Built by industry professionals, for industry professionals",
  "why.reason1.title": "Learn at Your Own Pace",
  "why.reason1.desc": "Comprehensive study guides, interactive labs, and practice exams - all available on demand. Study whenever and wherever works for you.",
  "why.reason2.title": "Expert-Led Curriculum",
  "why.reason2.desc": "Developed by certified professionals with real-world experience in cybersecurity and IT operations.",
  "why.reason3.title": "Unbeatable Value",
  "why.reason3.desc": "No hidden fees. Transparent pricing with limited-time launch discounts. Premium training at a fraction of the cost.",
  "why.reason4.title": "Exam-Focused Curriculum",
  "why.reason4.desc": "Every module maps directly to official exam objectives. We teach what you need to pass.",

  // Expert-Led Training
  "instructor.badge": "Expert-Led Training",
  "instructor.name": "Learn from Industry Professionals",
  "instructor.desc": "Our curriculum is developed and delivered by certified cybersecurity professionals with years of real-world experience. Every course is designed to bridge the gap between theory and practice.",
  "instructor.cert1": "Industry-Certified Content",
  "instructor.cert2": "Real-World Experience",
  "instructor.cert3": "Exam-Focused Preparation",

  // Interactive Labs
  "labs.badge": "Hands-On Learning",
  "labs.title": "Interactive Labs",
  "labs.subtitle": "Learn by doing. Our courses include real-world simulations built into every module.",
  "labs.lab1.title": "Firewall Rule Builder",
  "labs.lab1.desc": "Build and test firewall rules to allow or block network traffic by port, protocol, and IP.",
  "labs.lab2.title": "Ransomware Hospital Attack",
  "labs.lab2.desc": "Respond to a live ransomware attack on a hospital network. Contain, recover, and harden.",
  "labs.lab3.title": "Prompt Injection Challenge",
  "labs.lab3.desc": "Attack an AI system with prompt injection, then fix the vulnerabilities you exploited.",
  "labs.lab4.title": "Encryption Challenge",
  "labs.lab4.desc": "Encrypt and decrypt messages using Caesar cipher and XOR to master cryptographic fundamentals.",
  "labs.count": "8 Interactive Labs",
  "labs.included": "Included with every course",

  // CTA
  "cta.title": "Ready to Start Your Journey?",
  "cta.subtitle": "Get instant access to comprehensive study guides, interactive labs, and practice exams. Study at your own pace, on your own schedule.",
  "cta.button": "Enroll Now",
  "cta.note": "Launch pricing from $49 USD per course. CISM flagship program at $299 USD.",

  // Footer
  "footer.tagline": "Professional certification prep courses trusted by IT professionals worldwide.",
  "footer.quicklinks": "Quick Links",
  "footer.contact": "Contact",
  "footer.email": "info@apexcyberacademy.org",
  "footer.location": "Serving Professionals Worldwide",
  "footer.rights": "All rights reserved.",
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const t = useCallback((key: string) => translations[key] || key, []);

  return (
    <LanguageContext.Provider value={{ lang: "en", toggleLang: () => {}, setLang: () => {}, t, dir: "ltr" }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
