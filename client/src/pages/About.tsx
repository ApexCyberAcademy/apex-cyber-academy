/*
  DESIGN: "Luminous Pathway" - Global Edition
  Beige-dominant canvas with compact teal hero band and gold accents.
  Playfair Display headlines, Work Sans body, Montserrat accents.
  English-only. Worldwide audience.
*/

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, Target, Globe2, Users, TrendingUp, Award, BookOpen, Lightbulb } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const HERO_BG = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663216536998/WsCDIPwbZObZWUpr.jpg";
const PATTERN_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663216536998/wPemGyWvkVyFtIcM.jpg";
const STUDENTS_IMG = "https://files.manuscdn.com/user_upload_by_module/session_file/310519663216536998/raipPLrUqsJMuedI.jpg";

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

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting && !started) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);
  useEffect(() => {
    if (!started) return;
    let current = 0;
    const step = Math.max(1, Math.floor(target / 30));
    const interval = setInterval(() => {
      current += step;
      if (current >= target) { setCount(target); clearInterval(interval); } else setCount(current);
    }, 40);
    return () => clearInterval(interval);
  }, [started, target]);
  return <div ref={ref}>{count}{suffix}</div>;
}

export default function About() {
  return (
    <div className="min-h-screen bg-[#F5F0E8] overflow-x-hidden">
      <Navbar />

      {/* ===== HERO (compact teal band) ===== */}
      <section className="relative min-h-[50vh] flex items-center">
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0C3C3C] via-[#0C3C3C]/90 to-[#0C3C3C]/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0C3C3C] via-transparent to-[#0C3C3C]/50" />
        </div>
        <div className="container relative z-10 pt-32 pb-20">
          <FadeInSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#D4AF37]/40 bg-[#D4AF37]/10 mb-8">
              <Lightbulb className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[#D4AF37] font-['Montserrat'] text-sm font-semibold tracking-wide">Our Story</span>
            </div>
          </FadeInSection>
          <FadeInSection delay={100}>
            <h1 className="mb-6 max-w-4xl">
              <span className="block text-[#F5F0E8] font-['Playfair_Display'] text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">Building the Future of</span>
              <span className="block text-[#D4AF37] font-['Playfair_Display'] text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-glow">Professional Certification</span>
              <span className="block text-[#F5F0E8] font-['Playfair_Display'] text-2xl sm:text-3xl lg:text-4xl font-normal leading-tight mt-2">Worldwide</span>
            </h1>
          </FadeInSection>
          <FadeInSection delay={200}>
            <p className="text-[#F5F0E8] font-['Work_Sans'] text-lg font-medium leading-relaxed max-w-2xl">
              Apex Cyber Academy was built with a clear mission: to make world-class certification training accessible and affordable for professionals everywhere. We combine expert-crafted content with self-paced flexibility so you can advance your career on your own terms.
            </p>
          </FadeInSection>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#F5F0E8] to-transparent" />
      </section>

      {/* ===== MISSION & VISION ===== */}
      <section className="py-24 sm:py-32">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <FadeInSection>
              <div className="p-10 bg-white/40 border border-[#D4CBBA] h-full">
                <div className="w-14 h-14 bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-[#D4AF37]" />
                </div>
                <h2 className="text-[#0C3C3C] font-['Playfair_Display'] text-3xl font-bold mb-4">Our Mission</h2>
                <div className="w-12 h-0.5 bg-[#D4AF37] mb-6" />
                <p className="text-[#0C3C3C] font-['Work_Sans'] text-base font-medium leading-relaxed">
                  To remove every barrier between you and your next certification. We believe that cost, location, and schedule should never hold back a motivated professional. Our courses deliver the same rigor as premium boot camps at a fraction of the price.
                </p>
              </div>
            </FadeInSection>
            <FadeInSection delay={150}>
              <div className="p-10 bg-white/40 border border-[#D4CBBA] h-full">
                <div className="w-14 h-14 bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mb-6">
                  <Globe2 className="w-7 h-7 text-[#D4AF37]" />
                </div>
                <h2 className="text-[#0C3C3C] font-['Playfair_Display'] text-3xl font-bold mb-4">Our Vision</h2>
                <div className="w-12 h-0.5 bg-[#D4AF37] mb-6" />
                <p className="text-[#0C3C3C] font-['Work_Sans'] text-base font-medium leading-relaxed">
                  To become the most trusted online certification academy worldwide, recognized for excellence in instruction, student success rates, and the quality of our self-paced learning materials.
                </p>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* ===== MARKET STATS ===== */}
      <section className="py-24 sm:py-32 relative">
        <div className="absolute inset-0 opacity-[0.03]">
          <img src={PATTERN_IMG} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container relative z-10">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2 className="text-[#0C3C3C] font-['Playfair_Display'] text-4xl sm:text-5xl font-bold mb-4">The Market Opportunity</h2>
              <p className="text-[#0C3C3C] font-['Work_Sans'] text-lg font-medium">The numbers speak for themselves</p>
            </div>
          </FadeInSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { num: 298, suffix: "B", label: "Global cybersecurity market by 2028 (USD)", icon: TrendingUp },
              { num: 3, suffix: ".5M", label: "Unfilled cybersecurity jobs worldwide", icon: Shield },
              { num: 20, suffix: "%", label: "Higher salary for certified professionals", icon: Award },
              { num: 12, suffix: ".4%", label: "Annual growth rate of cybersecurity sector", icon: TrendingUp },
            ].map((stat, i) => (
              <FadeInSection key={i} delay={i * 100}>
                <div className="p-6 bg-white/40 border border-[#D4CBBA] text-center hover:border-[#D4AF37]/30 transition-all duration-500">
                  <stat.icon className="w-6 h-6 text-[#D4AF37] mx-auto mb-3" />
                  <div className="text-[#D4AF37] font-['Montserrat'] text-4xl font-extrabold text-glow mb-2">
                    <AnimatedCounter target={stat.num} suffix={stat.suffix} />
                  </div>
                  <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm font-medium leading-snug">{stat.label}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
          <FadeInSection delay={400}>
            <p className="text-center text-[#0C3C3C]/40 font-['Work_Sans'] text-xs mt-8">
              Sources: Statista, Cybersecurity Ventures, ISC2 Workforce Study 2025
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* ===== WHAT SETS US APART ===== */}
      <section className="py-24 sm:py-32">
        <div className="container">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2 className="text-[#0C3C3C] font-['Playfair_Display'] text-4xl sm:text-5xl font-bold">What Sets Us Apart</h2>
            </div>
          </FadeInSection>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              { title: "Learn at Your Own Pace", desc: "Comprehensive study guides, interactive labs, and practice exams - all available on demand. Study whenever and wherever works for you, with no deadlines or schedules.", icon: Users },
              { title: "Expert-Crafted Content", desc: "Every lecture, lab, and quiz is developed by certified professionals with real-world experience. No generic content - only material that directly prepares you for exam day.", icon: Globe2 },
              { title: "Exam-Mapped Curriculum", desc: "Every module, every quiz, every practice question maps directly to official exam objectives. No filler content. No wasted time.", icon: BookOpen },
              { title: "Unbeatable Value", desc: "Premium training at a fraction of boot camp prices. Our launch pricing starts at just $35 USD - quality certification prep accessible to everyone, everywhere.", icon: Award },
            ].map((item, i) => (
              <FadeInSection key={i} delay={i * 100}>
                <div className="flex gap-6 p-6 group">
                  <div className="w-12 h-12 bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center shrink-0 group-hover:bg-[#D4AF37]/20 transition-colors duration-300">
                    <item.icon className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h3 className="text-[#0C3C3C] font-['Montserrat'] text-lg font-bold mb-2">{item.title}</h3>
                    <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>

          {/* Students image */}
          <FadeInSection delay={400}>
            <div className="mt-16 max-w-4xl mx-auto overflow-hidden relative">
              <img src={STUDENTS_IMG} alt="Online Learning" className="w-full h-[280px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#F5F0E8] via-transparent to-[#F5F0E8]/30" />
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 sm:py-32">
        <div className="container">
          <FadeInSection>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-[#0C3C3C] font-['Playfair_Display'] text-4xl sm:text-5xl font-bold mb-6">Join Us on This Journey</h2>
              <p className="text-[#0C3C3C] font-['Work_Sans'] text-lg font-medium leading-relaxed mb-10 max-w-xl mx-auto">
                Whether you're a student, a professional, or a potential partner - we'd love to hear from you.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-3 px-10 py-5 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-lg tracking-wide hover:bg-[#B8962E] transition-all duration-300 gold-glow-strong"
              >
                Get in Touch
              </a>
            </div>
          </FadeInSection>
        </div>
      </section>

      <Footer />
    </div>
  );
}
