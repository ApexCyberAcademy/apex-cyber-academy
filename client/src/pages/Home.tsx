/*
  DESIGN: "Luminous Pathway" - Global Edition
  Beige-dominant canvas with teal accent bands and luminous gold accents.
  Playfair Display headlines, Work Sans body, Montserrat accents.
  English-only. Worldwide audience.
*/

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Shield, BookOpen, Monitor, Award, CheckCircle, ArrowRight, Clock, Globe2, Target, Zap, Brain, Play, Star, MessageSquare, Quote, Briefcase, Crown, Wifi, Laptop, Sparkles, Crosshair } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

const HERO_BG = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663216536998/WsCDIPwbZObZWUpr.jpg";
const SECPLUS_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663216536998/NuavqWVlEMFJnuvv.jpg";
const SECAI_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663216536998/XSyslDMOFSsLCYib.jpg";
const PATTERN_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663216536998/wPemGyWvkVyFtIcM.jpg";
const CISM_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663216536998/LBJqFpKzhYTivekFRuNFRp/cism_course_hero-dXHGw5xyKcciyCGMHUd9CG.webp";
const NETPLUS_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663216536998/LBJqFpKzhYTivekFRuNFRp/network_plus_hero_3a9abe7e.jpg";
const TECHPLUS_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663216536998/LBJqFpKzhYTivekFRuNFRp/tech_plus_hero_67ff2467.jpeg";
const CEH_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663216536998/LBJqFpKzhYTivekFRuNFRp/ceh_hero_d6cff93d.jpg";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let current = 0;
    const step = Math.max(1, Math.floor(target / 30));
    const interval = setInterval(() => {
      current += step;
      if (current >= target) { setCount(target); clearInterval(interval); }
      else setCount(current);
    }, 40);
    return () => clearInterval(interval);
  }, [started, target]);

  return <div ref={ref}>{count}{suffix}</div>;
}

function FadeInSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F0E8] overflow-x-hidden">
      <Navbar />

      {/* ===== HERO SECTION — compact teal band ===== */}
      <section id="home" className="relative min-h-[50vh] flex items-center">
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0C3C3C] via-[#0C3C3C]/85 to-[#0C3C3C]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C3C3C] via-transparent to-[#0C3C3C]/40" />
        </div>

        <div className="container relative z-10 pt-32 pb-20">
          <div className="max-w-3xl">
            <FadeInSection>
              <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#D4AF37]/40 bg-[#D4AF37]/10 mb-8">
                <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse" />
                <span className="text-[#D4AF37] font-['Montserrat'] text-sm font-semibold tracking-wide">
                  Now Enrolling Worldwide
                </span>
              </div>
            </FadeInSection>

            <FadeInSection delay={100}>
              <h1 className="mb-6">
                <span className="block text-[#F5F0E8] font-['Playfair_Display'] text-6xl sm:text-7xl lg:text-8xl font-bold leading-[1.1]">
                  Master
                </span>
                <span className="block text-[#D4AF37] font-['Playfair_Display'] text-6xl sm:text-7xl lg:text-8xl font-bold leading-[1.1] text-glow">
                  Cybersecurity
                </span>
                <span className="block text-[#F5F0E8] font-['Playfair_Display'] text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight mt-3">
                  Get Certified. Get Ahead.
                </span>
              </h1>
            </FadeInSection>

            <FadeInSection delay={200}>
              <p className="text-[#F5F0E8] font-['Work_Sans'] text-lg sm:text-xl font-medium leading-relaxed max-w-2xl mb-10">
                Industry-recognized certifications with expert-led content, interactive labs, and exam-focused preparation. Special offer, limited time.
              </p>
            </FadeInSection>

            <FadeInSection delay={300}>
              <div className="flex flex-wrap gap-4 mb-16">
                <a
                  href="/course"
                  className="px-8 py-4 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-base tracking-wide hover:bg-[#B8962E] transition-all duration-300 gold-glow-strong flex items-center gap-2"
                >
                  Explore Courses
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href="/contact"
                  className="px-8 py-4 border-2 border-[#F5F0E8]/40 text-[#F5F0E8] font-['Montserrat'] font-semibold text-base tracking-wide hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300"
                >
                  Contact Us
                </a>
                {import.meta.env.VITE_PREVIEW_MODE === "true" && (
                  <a
                    href="/api/preview-login?returnTo=/dashboard"
                    className="px-8 py-4 border-2 border-[#D4AF37]/60 bg-[#D4AF37]/10 text-[#D4AF37] font-['Montserrat'] font-semibold text-base tracking-wide hover:bg-[#D4AF37]/20 hover:border-[#D4AF37] transition-all duration-300 flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Preview as Student
                  </a>
                )}
              </div>
            </FadeInSection>

            <FadeInSection delay={400}>
              <div className="flex gap-8 sm:gap-16">
                {[
                  { num: 6, label: "Certifications" },
                  { num: 152, label: "Hours of Content" },
                  { num: 1058, label: "Practice Questions" },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <div className="text-[#D4AF37] font-['Montserrat'] text-4xl sm:text-5xl font-extrabold text-glow">
                      <AnimatedCounter target={stat.num} />
                    </div>
                    <div className="text-[#F5F0E8] font-['Work_Sans'] text-xs sm:text-sm font-medium mt-1 max-w-[100px]">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </FadeInSection>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F5F0E8] to-transparent" />
      </section>

      {/* ===== COURSES SECTION (Beige) ===== */}
      <section id="courses" className="py-24 sm:py-32 relative bg-[#F5F0E8]">
        <div className="container">
          <FadeInSection>
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 border border-[#0C3C3C]/20 text-[#0C3C3C] font-['Montserrat'] text-xs font-bold tracking-[0.2em] uppercase mb-4">
                Professional Certifications
              </span>
              <h2 className="text-[#0C3C3C] font-['Playfair_Display'] text-4xl sm:text-5xl font-bold mb-3">
                Choose Your Path
              </h2>
              <p className="text-[#0C3C3C] font-['Work_Sans'] text-lg font-medium max-w-xl mx-auto">
                Industry-recognized certifications to advance your cybersecurity career
              </p>
            </div>
          </FadeInSection>

          {/* CISM Flagship Banner */}
          <FadeInSection>
            <a href="/course" className="block group mb-12">
              <div className="relative max-w-5xl mx-auto bg-white border-2 border-[#D4AF37]/40 hover:border-[#D4AF37]/60 transition-all duration-500 overflow-hidden shadow-lg">
                <div className="absolute -top-0 left-0 z-10 px-4 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] text-xs font-bold tracking-wider uppercase flex items-center gap-2">
                  <Crown className="w-3.5 h-3.5" />
                  Flagship Program
                </div>
                <div className="grid lg:grid-cols-5 gap-0">
                  <div className="lg:col-span-2 relative h-[220px] lg:h-full overflow-hidden">
                    <img src={CISM_IMG} alt="ISACA CISM" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/60 hidden lg:block" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent lg:hidden" />
                  </div>
                  <div className="lg:col-span-3 p-6 lg:p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                      <Briefcase className="w-5 h-5 text-[#D4AF37]" />
                      <Tooltip><TooltipTrigger asChild><span className="text-[#D4AF37] font-['Montserrat'] text-xs font-bold tracking-wide cursor-help">ISACA CISM</span></TooltipTrigger><TooltipContent className="bg-[#0C3C3C] text-[#F5F0E8] font-['Work_Sans'] text-xs max-w-[220px]">Information Systems Audit and Control Association \u2014 Certified Information Security Manager</TooltipContent></Tooltip>
                    </div>
                    <h3 className="text-[#0C3C3C] font-['Playfair_Display'] text-2xl sm:text-3xl font-bold mb-2">
                      Certified Information Security Manager
                    </h3>
                    <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm font-medium leading-relaxed mb-4 max-w-lg">
                      The gold standard for information security management. Master governance, risk management, and incident response for executive-level roles.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {["4 Domains", "14 Study Guides", "150 Questions", "Audio Narrations"].map((f, i) => (
                        <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F5F0E8] border border-[#0C3C3C]/10 text-[#0C3C3C] font-['Work_Sans'] text-xs font-semibold">
                          <CheckCircle className="w-3 h-3 text-[#D4AF37]" />
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </FadeInSection>

          {/* Course Cards Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { img: SECPLUS_IMG, title: "CompTIA Security+", code: "SY0-701", codeTip: "CompTIA Security+ exam code \u2014 validates core cybersecurity skills", desc: "The foundational cybersecurity certification. Master network security, threats, and risk management.", features: ["14 Study Guides", "5 Interactive Labs", "200+ Questions"], icon: Shield },
              { img: CEH_IMG, title: "EC-Council CEH", code: "CEH v13", codeTip: "Certified Ethical Hacker version 13 \u2014 offensive security certification by EC-Council", desc: "Certified Ethical Hacker. Learn offensive security, penetration testing, and vulnerability assessment.", features: ["14 Study Guides", "14 Interactive Labs", "200 Questions"], icon: Crosshair, badge: "NEW" },
              { img: SECAI_IMG, title: "CompTIA SecAI+", code: "CY0-001", codeTip: "CompTIA SecAI+ exam code \u2014 AI-driven security operations certification", desc: "AI-powered security operations. Master machine learning for threat detection and automated response.", features: ["10 Study Guides", "3 Interactive Labs", "100+ Questions"], icon: Brain },
              { img: NETPLUS_IMG, title: "CompTIA Network+", code: "N10-009", codeTip: "CompTIA Network+ exam code \u2014 networking fundamentals certification", desc: "Networking fundamentals for cybersecurity professionals. Routing, switching, and network troubleshooting.", features: ["14 Study Guides", "5 Domain Modules", "200+ Questions"], icon: Wifi, badge: "NEW" },
              { img: TECHPLUS_IMG, title: "CompTIA Tech+", code: "FC0-U71", codeTip: "CompTIA Tech+ exam code \u2014 IT fundamentals entry-level certification", desc: "Your entry point into IT. Master hardware, software, and operational technology fundamentals.", features: ["10 Study Guides", "5 Domains", "100+ Questions"], icon: Laptop },
            ].map((course, i) => (
              <FadeInSection key={i} delay={i * 100}>
                <a href="/course" className="block group h-full">
                  <div className="bg-white border border-[#0C3C3C]/10 overflow-hidden shadow-md hover:shadow-lg hover:border-[#D4AF37]/30 transition-all duration-500 h-full flex flex-col">
                    <div className="relative h-[160px] overflow-hidden">
                      <img src={course.img} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      {course.badge && (
                        <div className="absolute top-3 right-3 px-2 py-1 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] text-[10px] font-bold tracking-wider">{course.badge}</div>
                      )}
                      <div className="absolute bottom-3 left-3 flex items-center gap-2">
                        <course.icon className="w-5 h-5 text-[#D4AF37]" />
                        <Tooltip><TooltipTrigger asChild><span className="text-white font-['Montserrat'] text-xs font-bold tracking-wide cursor-help">{course.code}</span></TooltipTrigger><TooltipContent className="bg-[#0C3C3C] text-[#F5F0E8] font-['Work_Sans'] text-xs max-w-[220px]">{course.codeTip}</TooltipContent></Tooltip>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-[#0C3C3C] font-['Playfair_Display'] text-lg font-bold mb-2">{course.title}</h3>
                      <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm font-medium leading-relaxed mb-4 flex-1">{course.desc}</p>
                      <div className="flex flex-wrap gap-2">
                        {course.features.map((f, j) => (
                          <span key={j} className="inline-flex items-center gap-1 text-[#0C3C3C] font-['Work_Sans'] text-xs font-semibold">
                            <CheckCircle className="w-3 h-3 text-[#D4AF37]" />
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </a>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY APEX SECTION ===== */}
      <section id="why" className="py-24 sm:py-32 relative bg-white">
        <div className="container">
          <FadeInSection>
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 border border-[#0C3C3C]/20 text-[#0C3C3C] font-['Montserrat'] text-xs font-bold tracking-[0.2em] uppercase mb-4">
                Why Choose Us
              </span>
              <h2 className="text-[#0C3C3C] font-['Playfair_Display'] text-4xl sm:text-5xl font-bold mb-3">
                The Apex Advantage
              </h2>
              <p className="text-[#0C3C3C] font-['Work_Sans'] text-lg font-medium max-w-xl mx-auto">
                What makes our certification programs different
              </p>
            </div>
          </FadeInSection>

          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { title: "Exam-Aligned Content", desc: "Every lesson maps directly to official exam objectives from CompTIA, ISACA, and EC-Council.", icon: Monitor },
              { title: "Learn Anywhere", desc: "Study at your own pace with 24/7 access to all materials, on any device.", icon: Globe2 },
              { title: "Verified Certificates", desc: "Earn blockchain-verified completion certificates to showcase your achievement.", icon: Award },
              { title: "Hands-On Practice", desc: "Interactive labs and 1000+ practice questions to build real-world skills.", icon: Target },
            ].map((reason, i) => (
              <FadeInSection key={i} delay={i * 100}>
                <div className="p-8 bg-[#F5F0E8]/50 border border-[#D4CBBA] hover:border-[#D4AF37]/30 transition-all duration-500 group h-full">
                  <reason.icon className="w-8 h-8 text-[#D4AF37] mb-4 group-hover:scale-110 transition-transform duration-300" />
                  <h3 className="text-[#0C3C3C] font-['Montserrat'] text-lg font-bold mb-3">{reason.title}</h3>
                  <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm font-medium leading-relaxed">{reason.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== EXPERT-LED TRAINING ===== */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="container">
          <FadeInSection>
            <div className="max-w-3xl mx-auto text-center">
              <span className="inline-block px-4 py-1.5 border border-[#0C3C3C]/20 text-[#0C3C3C] font-['Montserrat'] text-xs font-bold tracking-[0.2em] uppercase mb-6">
                Expert-Led Training
              </span>
              <h2 className="text-[#0C3C3C] font-['Playfair_Display'] text-3xl sm:text-4xl font-bold mb-6">
                Learn from Industry Professionals
              </h2>
              <p className="text-[#0C3C3C] font-['Work_Sans'] text-base font-medium leading-relaxed mb-10">
                Our curriculum is developed and delivered by certified cybersecurity professionals with years of real-world experience. Every course is designed to bridge the gap between theory and practice, ensuring you're prepared for both the certification exam and the challenges of the field.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                {["Industry-Certified Content", "Real-World Experience", "Exam-Focused Preparation"].map((cert, i) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-2 bg-[#F5F0E8] border border-[#0C3C3C]/10">
                    <CheckCircle className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-[#0C3C3C] font-['Work_Sans'] text-sm font-bold">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ===== INTERACTIVE LABS — beige with teal accent strip ===== */}
      <section className="relative">
        <div className="bg-[#0C3C3C] py-4">
          <div className="container">
            <div className="flex items-center justify-center gap-3">
              <Zap className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[#F5F0E8] font-['Montserrat'] text-sm font-bold tracking-wider uppercase">Hands-On Learning</span>
              <span className="w-1 h-1 bg-[#D4AF37] rounded-full" />
              <span className="text-[#D4AF37] font-['Montserrat'] text-sm font-bold">8 Interactive Labs</span>
              <span className="text-[#F5F0E8] font-['Work_Sans'] text-sm font-medium">Included</span>
            </div>
          </div>
        </div>
        <div className="py-20 sm:py-24 bg-[#F5F0E8]">
          <div className="container">
            <FadeInSection>
              <div className="text-center mb-14">
                <h2 className="text-[#0C3C3C] font-['Playfair_Display'] text-4xl sm:text-5xl font-bold mb-4">Learn by Doing</h2>
                <p className="text-[#0C3C3C] font-['Work_Sans'] text-lg font-medium max-w-2xl mx-auto">Practice real-world scenarios in our browser-based interactive labs</p>
              </div>
            </FadeInSection>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
              {[
                { title: "Network Defense", desc: "Configure firewalls, detect intrusions, and secure network perimeters.", icon: Shield },
                { title: "Vulnerability Scanning", desc: "Identify and assess security weaknesses using industry-standard tools.", icon: Target },
                { title: "Threat Analysis", desc: "Analyze malware samples and investigate security incidents.", icon: Brain },
                { title: "Security Operations", desc: "Monitor, respond to, and remediate real-time security events.", icon: Monitor },
              ].map((lab, i) => (
                <FadeInSection key={i} delay={i * 100}>
                  <div className="p-6 bg-white border border-[#D4CBBA] hover:border-[#D4AF37]/50 transition-all duration-500 group h-full">
                    <div className="w-10 h-10 flex items-center justify-center mb-4 border border-[#D4AF37]/30 bg-[#D4AF37]/10">
                      <lab.icon className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <h3 className="text-[#0C3C3C] font-['Montserrat'] text-sm font-bold mb-2">{lab.title}</h3>
                    <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm font-medium leading-relaxed">{lab.desc}</p>
                  </div>
                </FadeInSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== PRICING SECTION ===== */}
      <section id="pricing" className="py-24 sm:py-32 relative bg-[#F5F0E8]">
        <div className="container">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2 className="text-[#0C3C3C] font-['Playfair_Display'] text-4xl sm:text-5xl font-bold mb-4">Invest in Your Future</h2>
              <p className="text-[#0C3C3C] font-['Work_Sans'] text-lg font-medium max-w-xl mx-auto">Special offer, limited time. Lock in these prices before they increase.</p>
            </div>
          </FadeInSection>

          {/* CISM Flagship Pricing */}
          <FadeInSection delay={0}>
            <div className="max-w-6xl mx-auto mb-10">
              <div className="relative p-8 border-2 border-[#D4AF37]/60 bg-white shadow-lg">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] text-xs font-bold tracking-wider flex items-center gap-2">
                  <Crown className="w-3.5 h-3.5" />
                  FLAGSHIP PROGRAM
                </div>
                <div className="grid lg:grid-cols-2 gap-8 items-center mt-2">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Briefcase className="w-6 h-6 text-[#D4AF37]" />
                      <h3 className="text-[#0C3C3C] font-['Playfair_Display'] text-2xl font-bold">ISACA CISM</h3>
                    </div>
                    <p className="text-[#0C3C3C] font-['Work_Sans'] text-xs font-medium mb-1">Certified Information Security Manager</p>
                    <div className="mb-4">
                      <span className="text-[#D4AF37] font-['Montserrat'] text-5xl font-extrabold text-glow">$399</span>
                      <span className="text-[#0C3C3C] font-['Work_Sans'] text-lg font-medium ms-2">USD</span>
                    </div>
                    <button onClick={() => handleCheckout('cism')} className="inline-block px-8 py-3 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm tracking-wide hover:bg-[#B8962E] transition-all duration-300 gold-glow-strong cursor-pointer">
                      Enroll Now
                    </button>
                  </div>
                  <div>
                    <ul className="grid sm:grid-cols-2 gap-2.5">
                      {["14 in-depth study guides", "4 domain modules", "150 practice questions", "Audio narrations", "Exam-day strategies", "CISO career pathway", "24/7 access", "28 hours of content"].map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                          <span className="text-[#0C3C3C] font-['Work_Sans'] text-sm font-medium">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </FadeInSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Security+ */}
            <FadeInSection delay={100}>
              <div className="relative p-8 bg-white border border-[#0C3C3C]/10 shadow-md h-full flex flex-col">
                <div className="text-center mb-6">
                  <Shield className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
                  <h3 className="text-[#0C3C3C] font-['Playfair_Display'] text-xl font-bold mb-1">CompTIA Security+</h3>
                  <Tooltip><TooltipTrigger asChild><p className="text-[#0C3C3C] font-['Work_Sans'] text-xs font-medium cursor-help">SY0-701</p></TooltipTrigger><TooltipContent className="bg-[#0C3C3C] text-[#F5F0E8] font-['Work_Sans'] text-xs max-w-[220px]">CompTIA Security+ exam code \u2014 validates core cybersecurity skills</TooltipContent></Tooltip>
                </div>
                <div className="text-center mb-6">
                  <span className="text-[#D4AF37] font-['Montserrat'] text-4xl font-extrabold text-glow">$75</span>
                  <span className="text-[#0C3C3C] font-['Work_Sans'] text-sm ms-2">USD</span>
                </div>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {["14 study guides", "5 Interactive Labs", "5 quizzes + final exam", "24/7 access"].map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span className="text-[#0C3C3C] font-['Work_Sans'] text-sm font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleCheckout('secplus')} className="block w-full text-center py-3 border border-[#D4AF37]/50 text-[#D4AF37] font-['Montserrat'] font-bold text-sm hover:bg-[#D4AF37]/10 transition-all duration-300 cursor-pointer">Enroll Now</button>
              </div>
            </FadeInSection>

            {/* CEH */}
            <FadeInSection delay={200}>
              <div className="relative p-8 bg-white border border-[#0C3C3C]/10 shadow-md h-full flex flex-col">
                <div className="absolute -top-3 right-6 z-10 px-3 py-1 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] text-[10px] font-bold tracking-wider">NEW</div>
                <div className="text-center mb-6">
                  <Crosshair className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
                  <h3 className="text-[#0C3C3C] font-['Playfair_Display'] text-xl font-bold mb-1">EC-Council CEH</h3>
                  <Tooltip><TooltipTrigger asChild><p className="text-[#0C3C3C] font-['Work_Sans'] text-xs font-medium cursor-help">CEH v13</p></TooltipTrigger><TooltipContent className="bg-[#0C3C3C] text-[#F5F0E8] font-['Work_Sans'] text-xs max-w-[220px]">Certified Ethical Hacker version 13 \u2014 offensive security certification by EC-Council</TooltipContent></Tooltip>
                </div>
                <div className="text-center mb-6">
                  <span className="text-[#D4AF37] font-['Montserrat'] text-4xl font-extrabold text-glow">$89</span>
                  <span className="text-[#0C3C3C] font-['Work_Sans'] text-sm ms-2">USD</span>
                </div>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {["14 study guides", "14 Interactive Labs", "200 practice questions", "42 concept diagrams", "Audio narrations"].map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span className="text-[#0C3C3C] font-['Work_Sans'] text-sm font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleCheckout('ceh')} className="block w-full text-center py-3 border border-[#D4AF37]/50 text-[#D4AF37] font-['Montserrat'] font-bold text-sm hover:bg-[#D4AF37]/10 transition-all duration-300 cursor-pointer">Enroll Now</button>
              </div>
            </FadeInSection>

            {/* SecAI+ */}
            <FadeInSection delay={300}>
              <div className="relative p-8 bg-white border border-[#0C3C3C]/10 shadow-md h-full flex flex-col">
                <div className="text-center mb-6">
                  <Brain className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
                  <h3 className="text-[#0C3C3C] font-['Playfair_Display'] text-xl font-bold mb-1">CompTIA SecAI+</h3>
                  <Tooltip><TooltipTrigger asChild><p className="text-[#0C3C3C] font-['Work_Sans'] text-xs font-medium cursor-help">CY0-001</p></TooltipTrigger><TooltipContent className="bg-[#0C3C3C] text-[#F5F0E8] font-['Work_Sans'] text-xs max-w-[220px]">CompTIA SecAI+ exam code \u2014 AI-driven security operations certification</TooltipContent></Tooltip>
                </div>
                <div className="text-center mb-6">
                  <span className="text-[#D4AF37] font-['Montserrat'] text-4xl font-extrabold text-glow">$59</span>
                  <span className="text-[#0C3C3C] font-['Work_Sans'] text-sm ms-2">USD</span>
                </div>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {["10 study guides", "3 Interactive Labs", "4 quizzes + final exam", "24/7 access"].map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span className="text-[#0C3C3C] font-['Work_Sans'] text-sm font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleCheckout('secai')} className="block w-full text-center py-3 border border-[#D4AF37]/50 text-[#D4AF37] font-['Montserrat'] font-bold text-sm hover:bg-[#D4AF37]/10 transition-all duration-300 cursor-pointer">Enroll Now</button>
              </div>
            </FadeInSection>

            {/* Network+ */}
            <FadeInSection delay={400}>
              <div className="relative p-8 bg-white border border-[#0C3C3C]/10 shadow-md h-full flex flex-col">
                <div className="absolute -top-3 right-6 z-10 px-3 py-1 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] text-[10px] font-bold tracking-wider">NEW</div>
                <div className="text-center mb-6">
                  <Wifi className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
                  <h3 className="text-[#0C3C3C] font-['Playfair_Display'] text-xl font-bold mb-1">CompTIA Network+</h3>
                  <Tooltip><TooltipTrigger asChild><p className="text-[#0C3C3C] font-['Work_Sans'] text-xs font-medium cursor-help">N10-009</p></TooltipTrigger><TooltipContent className="bg-[#0C3C3C] text-[#F5F0E8] font-['Work_Sans'] text-xs max-w-[220px]">CompTIA Network+ exam code \u2014 networking fundamentals certification</TooltipContent></Tooltip>
                </div>
                <div className="text-center mb-6">
                  <span className="text-[#D4AF37] font-['Montserrat'] text-4xl font-extrabold text-glow">$79</span>
                  <span className="text-[#0C3C3C] font-['Work_Sans'] text-sm ms-2">USD</span>
                </div>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {["14 study guides", "5 domain modules", "200+ practice questions", "24/7 access"].map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span className="text-[#0C3C3C] font-['Work_Sans'] text-sm font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleCheckout('netplus')} className="block w-full text-center py-3 border border-[#D4AF37]/50 text-[#D4AF37] font-['Montserrat'] font-bold text-sm hover:bg-[#D4AF37]/10 transition-all duration-300 cursor-pointer">Enroll Now</button>
              </div>
            </FadeInSection>

            {/* Tech+ */}
            <FadeInSection delay={500}>
              <div className="relative p-8 bg-white border border-[#0C3C3C]/10 shadow-md h-full flex flex-col">
                <div className="text-center mb-6">
                  <Laptop className="w-8 h-8 text-[#D4AF37] mx-auto mb-3" />
                  <h3 className="text-[#0C3C3C] font-['Playfair_Display'] text-xl font-bold mb-1">CompTIA Tech+</h3>
                  <Tooltip><TooltipTrigger asChild><p className="text-[#0C3C3C] font-['Work_Sans'] text-xs font-medium cursor-help">FC0-U71</p></TooltipTrigger><TooltipContent className="bg-[#0C3C3C] text-[#F5F0E8] font-['Work_Sans'] text-xs max-w-[220px]">CompTIA Tech+ exam code \u2014 IT fundamentals entry-level certification</TooltipContent></Tooltip>
                </div>
                <div className="text-center mb-6">
                  <span className="text-[#D4AF37] font-['Montserrat'] text-4xl font-extrabold text-glow">$49</span>
                  <span className="text-[#0C3C3C] font-['Work_Sans'] text-sm ms-2">USD</span>
                </div>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {["10 study guides", "5 domain modules", "100+ practice questions", "Beginner-friendly", "24/7 access"].map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span className="text-[#0C3C3C] font-['Work_Sans'] text-sm font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleCheckout('techplus')} className="block w-full text-center py-3 border border-[#D4AF37]/50 text-[#D4AF37] font-['Montserrat'] font-bold text-sm hover:bg-[#D4AF37]/10 transition-all duration-300 cursor-pointer">Enroll Now</button>
              </div>
            </FadeInSection>

            {/* Bundles */}
            <FadeInSection delay={600}>
              <div className="relative p-8 border-2 border-[#D4AF37]/50 bg-white shadow-lg h-full flex flex-col">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] text-[10px] font-bold tracking-wider">BEST VALUE</div>
                <div className="text-center mb-6 mt-2">
                  <h3 className="text-[#0C3C3C] font-['Playfair_Display'] text-xl font-bold mb-1">CEH + Security+</h3>
                  <p className="text-[#0C3C3C] font-['Work_Sans'] text-xs font-medium">Offense & Defense Bundle</p>
                </div>
                <div className="text-center mb-1">
                  <span className="text-[#0C3C3C]/50 font-['Montserrat'] text-base line-through">$164 USD</span>
                </div>
                <div className="text-center mb-6">
                  <span className="text-[#D4AF37] font-['Montserrat'] text-4xl font-extrabold text-glow">$149</span>
                  <span className="text-[#0C3C3C] font-['Work_Sans'] text-sm ms-2">USD</span>
                </div>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {["Full CEH course (14 lectures)", "Full Security+ course (14 lectures)", "400+ practice questions", "19 Interactive Labs", "Audio narrations"].map((f, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                      <span className="text-[#0C3C3C] font-['Work_Sans'] text-sm font-medium">{f}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => handleCheckout('bundle')} className="block w-full text-center py-3 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm hover:bg-[#B8962E] transition-all duration-300 cursor-pointer">Get the Bundle</button>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ===== SOCIAL PROOF ===== */}
      <section className="py-24 sm:py-32 relative">
        <div className="absolute inset-0 opacity-[0.03]">
          <img src={PATTERN_IMG} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container relative z-10">
          <FadeInSection>
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1.5 border border-[#D4AF37]/30 text-[#D4AF37] font-['Montserrat'] text-xs font-bold tracking-[0.2em] uppercase mb-6">Student Success</span>
              <h2 className="text-[#0C3C3C] font-['Playfair_Display'] text-4xl sm:text-5xl font-bold mb-4">Built for Results</h2>
              <p className="text-[#0C3C3C] font-['Work_Sans'] text-lg font-medium max-w-2xl mx-auto">Our first cohorts are forming now. Here's what our curriculum is designed to deliver.</p>
            </div>
          </FadeInSection>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Target, stat: "100%", label: "Exam-Aligned", desc: "Every session, quiz, and practice question maps directly to official exam objectives from CompTIA, ISACA, and EC-Council." },
              { icon: Play, stat: "24/7", label: "On-Demand Access", desc: "Comprehensive study guides, interactive labs, and practice exams - available anytime, anywhere." },
              { icon: Award, stat: "1050+", label: "Practice Questions", desc: "Module quizzes and a full-length practice exam weighted to mirror the real test." },
            ].map((item, i) => (
              <FadeInSection key={i} delay={i * 150}>
                <div className="p-8 bg-white/40 border border-[#D4CBBA] text-center hover:border-[#D4AF37]/30 transition-all duration-500 h-full">
                  <item.icon className="w-8 h-8 text-[#D4AF37] mx-auto mb-4" />
                  <div className="text-[#D4AF37] font-['Montserrat'] text-4xl font-extrabold text-glow mb-1">{item.stat}</div>
                  <div className="text-[#0C3C3C] font-['Montserrat'] text-sm font-bold tracking-wide uppercase mb-4">{item.label}</div>
                  <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm font-medium leading-relaxed">{item.desc}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section id="contact" className="py-24 sm:py-32 relative">
        <div className="absolute inset-0 opacity-[0.06]">
          <img src={PATTERN_IMG} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container relative z-10">
          <FadeInSection>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-[#0C3C3C] font-['Playfair_Display'] text-4xl sm:text-5xl font-bold mb-6">Ready to Start?</h2>
              <p className="text-[#0C3C3C] font-['Work_Sans'] text-lg font-medium leading-relaxed mb-10 max-w-xl mx-auto">
                Join professionals worldwide who are advancing their cybersecurity careers with Apex Cyber Academy.
              </p>
              <a
                href="/course#pricing"
                className="inline-flex items-center gap-3 px-10 py-5 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-lg tracking-wide hover:bg-[#B8962E] transition-all duration-300 gold-glow-strong"
              >
                Enroll Now
                <ArrowRight className="w-5 h-5" />
              </a>
              <p className="text-[#0C3C3C]/70 font-['Work_Sans'] text-sm font-medium mt-6">Limited-time pricing. Secure your spot today.</p>
            </div>
          </FadeInSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}
