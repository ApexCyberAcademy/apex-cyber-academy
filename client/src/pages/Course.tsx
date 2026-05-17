/*
  DESIGN: "Luminous Pathway" - Global Edition
  Courses catalog - showcases all five certifications with limited-time pricing.
  English-only. No Arabic support.
*/

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Shield, BookOpen, Monitor, Zap, Target, Clock, CheckCircle,
  Award, ArrowRight, ChevronDown, Brain, Lock, Cpu,
  Play, FileText, Sparkles, Briefcase, Crown, Building2, AlertTriangle, Timer, Wifi
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CertificationComparisonTable from "@/components/CertificationComparisonTable";

const SECPLUS_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663216536998/NuavqWVlEMFJnuvv.jpg";
const SECAI_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663216536998/XSyslDMOFSsLCYib.jpg";
const CISM_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663216536998/LBJqFpKzhYTivekFRuNFRp/cism_course_hero-dXHGw5xyKcciyCGMHUd9CG.webp";
const PATTERN_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663216536998/wPemGyWvkVyFtIcM.jpg";

function FadeInSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    let deadline = localStorage.getItem("apex_promo_deadline");
    if (!deadline) {
      const d = new Date();
      d.setDate(d.getDate() + 14);
      deadline = d.toISOString();
      localStorage.setItem("apex_promo_deadline", deadline);
    }
    const endDate = new Date(deadline);
    const tick = () => {
      const now = new Date();
      const diff = endDate.getTime() - now.getTime();
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex items-center gap-2">
      {[
        { val: timeLeft.days, label: "Days" },
        { val: timeLeft.hours, label: "Hrs" },
        { val: timeLeft.minutes, label: "Min" },
        { val: timeLeft.seconds, label: "Sec" },
      ].map((unit, i) => (
        <div key={i} className="text-center">
          <div className="w-12 h-12 bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center">
            <span className="text-[#D4AF37] font-['Montserrat'] text-lg font-extrabold">{String(unit.val).padStart(2, "0")}</span>
          </div>
          <span className="text-[#C4B9A8] font-['Montserrat'] text-[9px] tracking-wider uppercase mt-1 block">{unit.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ============ COURSE DATA ============ */

interface CourseInfo {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  tagline: string;
  desc: string;
  img: string;
  icon: typeof Shield;
  stats: { icon: typeof Clock; label: string }[];
  domains: { name: string; weight: string; icon: typeof Shield }[];
  features: string[];
  originalPrice: string;
  salePrice: string;
  discount: string;
  isNew?: boolean;
  isFlagship?: boolean;
}

const courses: CourseInfo[] = [
  {
    id: "cism",
    badge: "Flagship Program",
    title: "ISACA CISM",
    subtitle: "Certified Information Security Manager",
    tagline: "The gold standard for information security management. Built for future CISOs.",
    desc: "14 sessions across four ISACA domains - governance, risk management, security program development, and incident management. Designed for experienced IT professionals with 3-5+ years pursuing CISO-level roles.",
    img: CISM_IMG,
    icon: Briefcase,
    stats: [
      { icon: Clock, label: "28 Hours" },
      { icon: BookOpen, label: "14 Sessions" },
      { icon: Target, label: "4 Domains" },
      { icon: Award, label: "150 Questions" },
    ],
    domains: [
      { name: "Information Security Governance", weight: "17%", icon: Building2 },
      { name: "Information Security Risk Management", weight: "20%", icon: AlertTriangle },
      { name: "Information Security Program", weight: "33%", icon: Shield },
      { name: "Incident Management", weight: "30%", icon: Zap },
    ],
    features: [
      "14 in-depth lecture study guides",
      "All course materials & audio narrations",
      "4 domain quizzes + 150-question practice exam",
      "CISO career pathway guidance",
      "Certificate of completion",
      "Learn at your own pace",
    ],
    originalPrice: "$599",
    salePrice: "$299",
    discount: "50% OFF",
    isFlagship: true,
  },
  {
    id: "secplus",
    badge: "Industry Standard",
    title: "CompTIA Security+",
    subtitle: "SY0-701",
    tagline: "The world's most trusted entry-level cybersecurity certification.",
    desc: "14 sessions covering all five exam domains - from threat analysis and architecture to governance and incident response. Built for IT professionals ready to prove their security skills.",
    img: SECPLUS_IMG,
    icon: Shield,
    stats: [
      { icon: Clock, label: "28 Hours" },
      { icon: BookOpen, label: "14 Sessions" },
      { icon: Target, label: "5 Modules" },
      { icon: Award, label: "190 Questions" },
    ],
    domains: [
      { name: "General Security Concepts", weight: "12%", icon: Shield },
      { name: "Threats, Vulnerabilities & Mitigations", weight: "22%", icon: Target },
      { name: "Security Architecture", weight: "18%", icon: Monitor },
      { name: "Security Operations", weight: "28%", icon: Zap },
      { name: "Governance, Risk & Compliance", weight: "20%", icon: BookOpen },
    ],
    features: [
      "14 in-depth lecture study guides",
      "All course materials & study guides",
      "5 module quizzes + 90-question final exam",
      "5 Interactive Labs (Firewall Builder, Encryption, Ransomware Sim & more)",
      "Audio narrations for every session",
      "Learn at your own pace",
    ],
    originalPrice: "$79",
    salePrice: "$49",
    discount: "40% OFF",
  },
  {
    id: "netplus",
    badge: "New Course",
    title: "CompTIA Network+",
    subtitle: "N10-009",
    tagline: "Master networking fundamentals. The essential credential for network professionals.",
    desc: "14 sessions across five exam domains - network architecture, routing & switching, wireless, security, and troubleshooting. Built for IT professionals who manage and maintain enterprise networks.",
    img: SECPLUS_IMG,
    icon: Wifi,
    stats: [
      { icon: Clock, label: "28 Hours" },
      { icon: BookOpen, label: "14 Sessions" },
      { icon: Target, label: "5 Domains" },
      { icon: Award, label: "200+ Questions" },
    ],
    domains: [
      { name: "Networking Concepts", weight: "24%", icon: Wifi },
      { name: "Network Implementation", weight: "19%", icon: Monitor },
      { name: "Network Operations", weight: "16%", icon: Zap },
      { name: "Network Security", weight: "19%", icon: Shield },
      { name: "Network Troubleshooting", weight: "22%", icon: Target },
    ],
    features: [
      "14 in-depth lecture study guides",
      "14 audio narrations for every session",
      "5 domain modules with practice questions",
      "Hands-on lab activities",
      "Certificate of completion",
      "Learn at your own pace",
    ],
    originalPrice: "$79",
    salePrice: "$49",
    discount: "NEW",
    isNew: true,
  },
  {
    id: "secai",
    badge: "Cutting Edge",
    title: "CompTIA SecAI+",
    subtitle: "CY0-001",
    tagline: "Where artificial intelligence meets cybersecurity. The future starts here.",
    desc: "10 sessions across four domains - securing AI systems, leveraging AI for defense, and managing AI governance and compliance. The first certification of its kind.",
    img: SECAI_IMG,
    icon: Brain,
    stats: [
      { icon: Clock, label: "20 Hours" },
      { icon: BookOpen, label: "10 Sessions" },
      { icon: Target, label: "4 Modules" },
      { icon: Award, label: "155 Questions" },
    ],
    domains: [
      { name: "Basic AI Concepts for Cybersecurity", weight: "17%", icon: Cpu },
      { name: "Securing AI Systems", weight: "40%", icon: Lock },
      { name: "AI-Assisted Security", weight: "24%", icon: Brain },
      { name: "AI Governance, Risk & Compliance", weight: "19%", icon: BookOpen },
    ],
    features: [
      "10 in-depth lecture study guides",
      "All course materials & study guides",
      "4 module quizzes + 75-question final exam",
      "3 Interactive Labs (AI Threat Detection, Prompt Injection & Data Classification)",
      "Audio narrations for every session",
      "Learn at your own pace",
    ],
    originalPrice: "$59",
    salePrice: "$39",
    discount: "35% OFF",
    isNew: true,
  },
  {
    id: "techplus",
    badge: "Foundation Level",
    title: "CompTIA Tech+",
    subtitle: "FC0-U71",
    tagline: "Your entry point into IT. Perfect for career changers and beginners.",
    desc: "10 sessions covering hardware, networking, operating systems, security fundamentals, and troubleshooting. Designed for those starting their IT career journey.",
    img: SECAI_IMG,
    icon: Monitor,
    stats: [
      { icon: Clock, label: "20 Hours" },
      { icon: BookOpen, label: "10 Sessions" },
      { icon: Target, label: "5 Domains" },
      { icon: Award, label: "100+ Questions" },
    ],
    domains: [
      { name: "IT Concepts & Terminology", weight: "22%", icon: BookOpen },
      { name: "Infrastructure", weight: "18%", icon: Monitor },
      { name: "Applications & Software", weight: "18%", icon: Cpu },
      { name: "Software Development Concepts", weight: "12%", icon: Zap },
      { name: "Data & Security", weight: "30%", icon: Shield },
    ],
    features: [
      "10 in-depth lecture study guides",
      "10 audio narrations for every session",
      "5 domain modules with practice questions",
      "Beginner-friendly content",
      "Certificate of completion",
      "Learn at your own pace",
    ],
    originalPrice: "$49",
    salePrice: "$35",
    discount: "30% OFF",
  },
];

/* ============ COURSE CARD COMPONENT ============ */

function CourseCard({ course, index }: { course: CourseInfo; index: number }) {
  const [showDomains, setShowDomains] = useState(false);
  const Icon = course.icon;

  return (
    <FadeInSection delay={index * 100}>
      <div className="relative">
        {course.isNew && (
          <div className="absolute -top-3 right-6 z-10 px-4 py-1.5 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] text-xs font-bold tracking-wider uppercase flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            New
          </div>
        )}

        <div className="bg-[#002F24]/40 border border-[#0A6B5A]/30 hover:border-[#D4AF37]/30 transition-all duration-500 overflow-hidden h-full">
          {/* Image Header */}
          <div className="relative h-[220px] overflow-hidden">
            <img src={course.img} alt={course.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#001A16] via-[#001A16]/40 to-transparent" />
            <div className="absolute top-3 right-3 px-2 py-1 bg-red-500/20 border border-red-500/40 text-red-400 font-['Montserrat'] text-[10px] font-bold tracking-wider">
              {course.discount}
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="px-3 py-1 border border-[#D4AF37]/40 bg-[#D4AF37]/10">
                  <span className="text-[#D4AF37] font-['Montserrat'] text-xs font-bold tracking-wide">{course.badge}</span>
                </div>
              </div>
              <h3 className="text-[#E8E0D4] font-['Playfair_Display'] text-3xl font-bold">{course.title}</h3>
              <p className="text-[#D4AF37] font-['Montserrat'] text-sm font-semibold mt-1">{course.subtitle}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 pt-4">
            <p className="text-[#D4AF37] font-['Work_Sans'] text-sm italic mb-4">{course.tagline}</p>
            <p className="text-[#C4B9A8] font-['Work_Sans'] text-sm leading-relaxed mb-6">{course.desc}</p>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {course.stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 bg-[#001A16]/60 border border-[#0A6B5A]/20">
                  <stat.icon className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span className="text-[#E8E0D4] font-['Montserrat'] text-xs font-semibold">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* Domains Toggle */}
            <button
              onClick={() => setShowDomains(!showDomains)}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#001A16]/60 border border-[#0A6B5A]/30 hover:border-[#D4AF37]/30 transition-all duration-300 mb-4"
            >
              <span className="text-[#D4AF37] font-['Montserrat'] text-xs font-bold tracking-wider uppercase">Exam Domains</span>
              <ChevronDown className={`w-4 h-4 text-[#D4AF37] transition-transform duration-300 ${showDomains ? "rotate-180" : ""}`} />
            </button>

            {showDomains && (
              <div className="space-y-2 mb-6">
                {course.domains.map((domain, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2 bg-[#001A16]/40 border border-[#0A6B5A]/10">
                    <domain.icon className="w-4 h-4 text-[#D4AF37] shrink-0" />
                    <span className="text-[#E8E0D4] font-['Work_Sans'] text-sm flex-1">{domain.name}</span>
                    <span className="text-[#D4AF37] font-['Montserrat'] text-xs font-bold">{domain.weight}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Price + CTA */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-[#C4B9A8]/50 font-['Montserrat'] text-base line-through">{course.originalPrice}</span>
                <span className="text-[#D4AF37] font-['Montserrat'] text-2xl font-extrabold">{course.salePrice}</span>
                <span className="text-[#C4B9A8] font-['Work_Sans'] text-sm">USD</span>
              </div>
            </div>
            <a
              href="#pricing"
              className="block text-center py-3 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all duration-300 gold-glow"
            >
              View Pricing
              <ArrowRight className="w-4 h-4 inline-block ml-2" />
            </a>
          </div>
        </div>
      </div>
    </FadeInSection>
  );
}

/* ============ MAIN PAGE ============ */

async function handleCheckout(courseId: string) {
  try {
    const res = await fetch("/api/stripe/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    });
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Failed to start checkout. Please try again.");
    }
  } catch {
    alert("Failed to start checkout. Please try again.");
  }
}

export default function Course() {
  return (
    <div className="min-h-screen bg-[#001A16] overflow-x-hidden">
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative pt-32 pb-20">
        <div className="absolute inset-0 opacity-[0.04]">
          <img src={PATTERN_IMG} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container relative z-10">
          <FadeInSection>
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 border border-red-500/40 bg-red-500/10 mb-6">
                <Timer className="w-4 h-4 text-red-400 animate-pulse" />
                <span className="text-red-400 font-['Montserrat'] text-sm font-semibold tracking-wide">Limited Time Launch Pricing</span>
              </div>
              <h1 className="text-[#E8E0D4] font-['Playfair_Display'] text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">Our Courses</h1>
              <p className="text-[#D4AF37] font-['Montserrat'] text-lg font-semibold mb-4">Five certifications. From foundational to executive-level.</p>
              <p className="text-[#C4B9A8] font-['Work_Sans'] text-base leading-relaxed max-w-2xl mx-auto">
                Whether you're starting your IT career, building your cybersecurity foundation, mastering networking, stepping into AI security, or pursuing executive-level information security management - we have the curriculum to get you there.
              </p>
            </div>
          </FadeInSection>
        </div>
      </section>

      <div className="section-divider" />

      {/* ===== COURSE CARDS ===== */}
      <section className="py-24 sm:py-32">
        <div className="container">
          {/* CISM Flagship first */}
          <div className="max-w-6xl mx-auto mb-10">
            <CourseCard course={courses[0]} index={0} />
          </div>
          {/* Other 4 courses in 2x2 grid */}
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {courses.slice(1).map((course, i) => (
              <CourseCard key={course.id} course={course} index={i + 1} />
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ===== COMPARISON TABLE ===== */}
      <CertificationComparisonTable />

      <div className="section-divider" />

      {/* ===== WHAT'S INCLUDED ===== */}
      <section className="py-24 sm:py-32 relative">
        <div className="absolute inset-0 opacity-[0.03]">
          <img src={PATTERN_IMG} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container relative z-10">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2 className="text-[#E8E0D4] font-['Playfair_Display'] text-4xl sm:text-5xl font-bold mb-4">What's Included</h2>
              <p className="text-[#C4B9A8] font-['Work_Sans'] text-lg max-w-xl mx-auto">Everything you need to prepare, practice, and pass - at your own pace.</p>
            </div>
          </FadeInSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: BookOpen, title: "In-Depth Study Guides", desc: "Comprehensive guides for every session, aligned to exam objectives." },
              { icon: Monitor, title: "Interactive Labs", desc: "Hands-on simulations - firewalls, encryption, ransomware, AI threats." },
              { icon: FileText, title: "Audio Narrations", desc: "Professional audio narrations for every lecture. Study on the go." },
              { icon: Target, title: "Module Quizzes", desc: "Test your knowledge after each module with targeted assessments." },
              { icon: Award, title: "Practice Exams", desc: "Full-length practice tests that mirror the real certification exam." },
              { icon: Sparkles, title: "Certificates", desc: "Earn a certificate of completion for every course you finish." },
            ].map((item, i) => (
              <FadeInSection key={i} delay={i * 80}>
                <div className="p-6 bg-[#002F24]/30 border border-[#0A6B5A]/20 hover:border-[#D4AF37]/30 transition-all duration-500">
                  <item.icon className="w-6 h-6 text-[#D4AF37] mb-3" />
                  <h4 className="text-[#E8E0D4] font-['Montserrat'] text-sm font-bold mb-2">{item.title}</h4>
                  <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs leading-relaxed">{item.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ===== PRICING ===== */}
      <section id="pricing" className="py-24 sm:py-32">
        <div className="container">
          <FadeInSection>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 border border-red-500/40 bg-red-500/10 mb-6">
                <Timer className="w-4 h-4 text-red-400 animate-pulse" />
                <span className="text-red-400 font-['Montserrat'] text-xs font-bold tracking-wider uppercase">Limited Time - Launch Special</span>
              </div>
              <h2 className="text-[#E8E0D4] font-['Playfair_Display'] text-4xl sm:text-5xl font-bold mb-3">Invest in Your Future</h2>
              <p className="text-[#C4B9A8] font-['Work_Sans'] text-lg max-w-2xl mx-auto mb-6">
                Save up to 50% during our launch period. From $35 USD for entry-level to $299 USD for our flagship CISM program.
              </p>
              <div className="flex justify-center mb-4">
                <CountdownTimer />
              </div>
            </div>
          </FadeInSection>

          {/* CISM Flagship Pricing */}
          <FadeInSection delay={0}>
            <div className="max-w-6xl mx-auto mb-10 mt-8">
              <div className="relative p-8 border-2 border-[#D4AF37]/60 bg-gradient-to-b from-[#D4AF37]/10 to-[#002F24]/40">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] text-xs font-bold tracking-wider flex items-center gap-2">
                  <Crown className="w-3.5 h-3.5" />
                  FLAGSHIP PROGRAM - 50% OFF
                </div>
                <div className="grid lg:grid-cols-2 gap-8 items-center mt-2">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Briefcase className="w-6 h-6 text-[#D4AF37]" />
                      <h3 className="text-[#E8E0D4] font-['Playfair_Display'] text-2xl font-bold">ISACA CISM</h3>
                    </div>
                    <p className="text-[#C4B9A8] font-['Work_Sans'] text-xs mb-1">Certified Information Security Manager</p>
                    <div className="mb-4 flex items-center gap-3">
                      <span className="text-[#C4B9A8]/50 font-['Montserrat'] text-2xl line-through">$599</span>
                      <span className="text-[#D4AF37] font-['Montserrat'] text-5xl font-extrabold text-glow">$299</span>
                      <span className="text-[#C4B9A8] font-['Work_Sans'] text-lg">USD</span>
                    </div>
                    <button onClick={() => handleCheckout('cism')} className="inline-block px-8 py-3 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm tracking-wide hover:bg-[#B8962E] transition-all duration-300 gold-glow-strong cursor-pointer">
                      Enroll Now
                    </button>
                  </div>
                  <div>
                    <ul className="grid sm:grid-cols-2 gap-2.5">
                      {[
                        "14 in-depth study guides",
                        "4 domain modules",
                        "150 practice questions",
                        "Audio narrations",
                        "Exam-day strategies",
                        "CISO career pathway",
                        "Certificate of completion",
                        "28 hours of content",
                      ].map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                          <span className="text-[#C4B9A8] font-['Work_Sans'] text-sm">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </FadeInSection>

          {/* Individual course pricing */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {courses.slice(1).map((course, i) => (
              <FadeInSection key={course.id} delay={(i + 1) * 100}>
                <div className="relative p-6 bg-[#002F24]/40 border border-[#0A6B5A]/30 h-full flex flex-col hover:border-[#D4AF37]/50 transition-all duration-500">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-red-500/80 text-white font-['Montserrat'] text-[10px] font-bold tracking-wider">
                    {course.discount}
                  </div>
                  <div className="text-center mb-4 mt-2">
                    <course.icon className="w-7 h-7 text-[#D4AF37] mx-auto mb-2" />
                    <h4 className="font-['Playfair_Display'] text-lg font-bold text-[#E8E0D4] mb-1">{course.title}</h4>
                    <p className="text-[#C4B9A8] font-['Montserrat'] text-xs">{course.subtitle}</p>
                  </div>
                  <div className="text-center mb-1">
                    <span className="text-[#C4B9A8]/50 font-['Montserrat'] text-sm line-through">{course.originalPrice} USD</span>
                  </div>
                  <div className="text-center mb-5">
                    <span className="text-[#D4AF37] font-['Montserrat'] text-3xl font-extrabold text-glow">{course.salePrice}</span>
                    <span className="text-[#C4B9A8] font-['Work_Sans'] text-sm ml-1">USD</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/30 mb-4 mx-auto">
                    <Play className="w-3 h-3 text-[#D4AF37]" />
                    <span className="text-[#D4AF37] font-['Montserrat'] text-xs font-bold">Self-Paced</span>
                  </div>
                  <ul className="space-y-2 mb-6 flex-1">
                    {course.features.slice(0, 4).map((f, j) => (
                      <li key={j} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-[#0A6B5A] shrink-0" />
                        <span className="text-[#C4B9A8] font-['Work_Sans'] text-xs">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button onClick={() => handleCheckout(course.id)} className="block w-full text-center py-2.5 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all duration-300 gold-glow-strong cursor-pointer">
                    Enroll Now
                  </button>
                </div>
              </FadeInSection>
            ))}
          </div>

          {/* Complete Bundle */}
          <FadeInSection delay={500}>
            <div className="max-w-6xl mx-auto mt-10">
              <div className="p-6 border border-[#0A6B5A]/50 bg-[#002F24]/40 text-center">
                <h3 className="text-[#E8E0D4] font-['Playfair_Display'] text-xl font-bold mb-2">Complete Bundle - All 5 Courses</h3>
                <p className="text-[#C4B9A8] font-['Work_Sans'] text-sm mb-3">CISM + Security+ + Network+ + SecAI+ + Tech+</p>
                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="text-[#C4B9A8]/50 font-['Montserrat'] text-xl line-through">$865</span>
                  <span className="text-[#D4AF37] font-['Montserrat'] text-4xl font-extrabold text-glow">$399</span>
                  <span className="text-[#C4B9A8] font-['Work_Sans'] text-sm">USD</span>
                  <span className="px-2 py-1 bg-red-500/20 border border-red-500/40 text-red-400 font-['Montserrat'] text-[10px] font-bold tracking-wider">SAVE $466</span>
                </div>
                <button onClick={() => handleCheckout('bundle')} className="inline-block px-8 py-3 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-sm tracking-wide hover:bg-[#B8962E] transition-all duration-300 gold-glow cursor-pointer">
                  Get the Complete Bundle
                </button>
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      <div className="section-divider" />

      {/* ===== CTA ===== */}
      <section className="py-24 sm:py-32 relative">
        <div className="absolute inset-0 opacity-[0.06]">
          <img src={PATTERN_IMG} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container relative z-10">
          <FadeInSection>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-[#E8E0D4] font-['Playfair_Display'] text-4xl sm:text-5xl font-bold mb-6">Ready to Get Certified?</h2>
              <p className="text-[#C4B9A8] font-['Work_Sans'] text-lg leading-relaxed mb-10">
                Start learning today with our self-paced courses. Comprehensive study guides, interactive labs, and practice exams - all at your own pace.
              </p>
              <a href="#pricing" className="inline-flex items-center gap-3 px-10 py-5 bg-[#D4AF37] text-[#001A16] font-['Montserrat'] font-bold text-lg tracking-wide hover:bg-[#B8962E] transition-all duration-300 gold-glow-strong">
                Enroll Now
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </FadeInSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}
