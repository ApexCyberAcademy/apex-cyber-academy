/*
  CertificationComparisonTable — English-only version for global site.
  Design: beige canvas, dark emerald text, gold accents.
*/

import {
  Shield, Brain, Briefcase, Wifi, Laptop, Skull,
  BookOpen, Target, TrendingUp, Users,
  ArrowRight
} from "lucide-react";
import { useState } from "react";

/* ---- data ---- */

interface CertRow {
  id: string;
  name: string;
  code: string;
  icon: typeof Shield;
  vendor: string;
  level: string;
  levelNum: number;
  prereqs: string;
  sessions: number;
  hours: number;
  domains: number;
  questions: string;
  labs: number;
  price: number;
  careerPath: string;
  bestFor: string;
  hasAudio: boolean;
  hasDiagrams: boolean;
  isNew?: boolean;
}

const certs: CertRow[] = [
  {
    id: "techplus",
    name: "CompTIA Tech+",
    code: "FC0-U71",
    icon: Laptop,
    vendor: "CompTIA",
    level: "Foundation",
    levelNum: 1,
    prereqs: "None",
    sessions: 10,
    hours: 20,
    domains: 5,
    questions: "100+",
    labs: 0,
    price: 49,
    careerPath: "Help Desk → IT Support → Jr. Admin",
    bestFor: "Career changers & IT beginners",
    hasAudio: true,
    hasDiagrams: false,
  },
  {
    id: "netplus",
    name: "CompTIA Network+",
    code: "N10-009",
    icon: Wifi,
    vendor: "CompTIA",
    level: "Intermediate",
    levelNum: 2,
    prereqs: "Tech+ or equivalent experience",
    sessions: 14,
    hours: 28,
    domains: 5,
    questions: "200+",
    labs: 0,
    price: 79,
    careerPath: "Network Tech → Network Admin → Network Engineer",
    bestFor: "IT professionals managing networks",
    hasAudio: true,
    hasDiagrams: false,
    isNew: true,
  },
  {
    id: "secplus",
    name: "CompTIA Security+",
    code: "SY0-701",
    icon: Shield,
    vendor: "CompTIA",
    level: "Intermediate",
    levelNum: 3,
    prereqs: "Network+ or 2 yrs IT experience",
    sessions: 14,
    hours: 28,
    domains: 5,
    questions: "190",
    labs: 5,
    price: 75,
    careerPath: "Security Analyst → SOC Analyst → Security Engineer",
    bestFor: "IT pros entering cybersecurity",
    hasAudio: false,
    hasDiagrams: false,
  },
  {
    id: "secai",
    name: "CompTIA SecAI+",
    code: "CY0-001",
    icon: Brain,
    vendor: "CompTIA",
    level: "Intermediate",
    levelNum: 3,
    prereqs: "Security+ recommended",
    sessions: 10,
    hours: 20,
    domains: 4,
    questions: "155",
    labs: 3,
    price: 59,
    careerPath: "AI Security Analyst → AI Security Engineer → AI CISO",
    bestFor: "Security pros exploring AI",
    hasAudio: false,
    hasDiagrams: false,
    isNew: true,
  },
  {
    id: "ceh",
    name: "EC-Council CEH",
    code: "CEH v13",
    icon: Skull,
    vendor: "EC-Council",
    level: "Advanced",
    levelNum: 4,
    prereqs: "Security+ or 2 yrs security experience",
    sessions: 14,
    hours: 28,
    domains: 9,
    questions: "200",
    labs: 0,
    price: 89,
    careerPath: "Pen Tester → Red Team Lead → Security Consultant",
    bestFor: "Offensive security & ethical hacking",
    hasAudio: true,
    hasDiagrams: true,
    isNew: true,
  },
  {
    id: "cism",
    name: "ISACA CISM",
    code: "CISM",
    icon: Briefcase,
    vendor: "ISACA",
    level: "Executive",
    levelNum: 5,
    prereqs: "5+ years in information security",
    sessions: 14,
    hours: 28,
    domains: 4,
    questions: "150",
    labs: 0,
    price: 399,
    careerPath: "Security Manager → Director → CISO",
    bestFor: "Senior professionals pursuing CISO roles",
    hasAudio: true,
    hasDiagrams: false,
  },
];

/* ---- level bar ---- */

function LevelBar({ level, maxLevel = 5 }: { level: number; maxLevel?: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxLevel }).map((_, i) => (
        <div
          key={i}
          className={`h-2.5 w-5 transition-colors ${
            i < level ? "bg-[#D4AF37]" : "bg-[#D4CBBA]/40"
          }`}
        />
      ))}
    </div>
  );
}

/* ---- mobile card ---- */

function MobileCard({ cert }: { cert: CertRow }) {
  const [expanded, setExpanded] = useState(false);
  const Icon = cert.icon;

  return (
    <div className="border border-[#D4CBBA] bg-white/40 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center gap-3 text-start hover:bg-[#F5F0E8]/60 transition-colors"
      >
        <div className="w-10 h-10 flex items-center justify-center shrink-0 bg-[#D4AF37]/10 border border-[#D4AF37]/30">
          <Icon className="w-5 h-5 text-[#D4AF37]" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-['Montserrat'] text-sm font-bold text-[#0C3C3C]">{cert.name}</h4>
            {cert.isNew && (
              <span className="px-1.5 py-0.5 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] text-[9px] font-bold tracking-wider">NEW</span>
            )}
          </div>
          <p className="text-[#D4AF37] font-['Montserrat'] text-xs font-semibold">{cert.code}</p>
        </div>
        <div className="text-end shrink-0">
          <span className="text-[#D4AF37] font-['Montserrat'] text-lg font-extrabold">${cert.price}</span>
        </div>
        <ArrowRight className={`w-4 h-4 text-[#D4AF37] shrink-0 transition-transform duration-300 ${expanded ? "rotate-90" : ""}`} />
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-[#D4CBBA]">
          <div className="pt-3 grid grid-cols-2 gap-3">
            <div>
              <span className="text-[#0C3C3C]/60 font-['Montserrat'] text-[10px] uppercase tracking-wider">Level</span>
              <p className="text-[#0C3C3C] font-['Montserrat'] text-xs font-bold mt-0.5">{cert.level}</p>
              <LevelBar level={cert.levelNum} />
            </div>
            <div>
              <span className="text-[#0C3C3C]/60 font-['Montserrat'] text-[10px] uppercase tracking-wider">Vendor</span>
              <p className="text-[#0C3C3C] font-['Montserrat'] text-xs font-bold mt-0.5">{cert.vendor}</p>
            </div>
            <div>
              <span className="text-[#0C3C3C]/60 font-['Montserrat'] text-[10px] uppercase tracking-wider">Sessions</span>
              <p className="text-[#0C3C3C] font-['Montserrat'] text-xs font-bold mt-0.5">{cert.sessions}</p>
            </div>
            <div>
              <span className="text-[#0C3C3C]/60 font-['Montserrat'] text-[10px] uppercase tracking-wider">Hours</span>
              <p className="text-[#0C3C3C] font-['Montserrat'] text-xs font-bold mt-0.5">{cert.hours}</p>
            </div>

          </div>

          <div>
            <span className="text-[#0C3C3C]/60 font-['Montserrat'] text-[10px] uppercase tracking-wider">Prerequisites</span>
            <p className="text-[#0C3C3C] font-['Work_Sans'] text-xs mt-0.5">{cert.prereqs}</p>
          </div>

          <div>
            <span className="text-[#0C3C3C]/60 font-['Montserrat'] text-[10px] uppercase tracking-wider">Career Path</span>
            <p className="text-[#D4AF37] font-['Work_Sans'] text-xs font-semibold mt-0.5">{cert.careerPath}</p>
          </div>

          <div>
            <span className="text-[#0C3C3C]/60 font-['Montserrat'] text-[10px] uppercase tracking-wider">Best For</span>
            <p className="text-[#0C3C3C] font-['Work_Sans'] text-xs mt-0.5">{cert.bestFor}</p>
          </div>

          <a
            href="/contact"
            className="block text-center py-2.5 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-xs hover:bg-[#B8962E] transition-all duration-300"
          >
            Enroll Now
          </a>
        </div>
      )}
    </div>
  );
}

/* ---- main component ---- */

export default function CertificationComparisonTable() {
  return (
    <section className="py-24 sm:py-32 relative">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 border border-[#D4AF37]/30 text-[#D4AF37] font-['Montserrat'] text-xs font-bold tracking-[0.2em] uppercase mb-6">
            <Target className="w-3.5 h-3.5 inline-block me-2 -mt-0.5" />
            Decision Guide
          </span>
          <h2 className="text-[#0C3C3C] font-['Playfair_Display'] text-4xl sm:text-5xl font-bold mb-4">
            Compare Certifications
          </h2>
          <p className="text-[#0C3C3C] font-['Work_Sans'] text-lg max-w-2xl mx-auto">
            Find the right certification for your career stage and goals.
          </p>
        </div>

        {/* ===== LEARNING PATH VISUAL ===== */}
        <div className="mb-16 max-w-6xl mx-auto">
          <div className="text-center mb-6">
            <h3 className="text-[#0C3C3C] font-['Montserrat'] text-sm font-bold tracking-wider uppercase">
              <TrendingUp className="w-4 h-4 inline-block me-2 -mt-0.5 text-[#D4AF37]" />
              Suggested Learning Path
            </h3>
            <p className="text-[#0C3C3C]/70 font-['Work_Sans'] text-xs mt-1">Start from the left and progress right based on your experience level.</p>
          </div>
          <div className="relative hidden lg:block">
            <div className="absolute top-1/2 left-[8%] right-[8%] h-[2px] bg-gradient-to-r from-[#D4CBBA] via-[#D4AF37] to-[#D4AF37] -translate-y-1/2 z-0" />
            <div className="grid grid-cols-6 gap-3 relative z-10">
              {certs.map((cert) => {
                const Icon = cert.icon;
                return (
                  <div key={cert.id} className="flex flex-col items-center">
                    <div className="w-12 h-12 flex items-center justify-center bg-[#F5F0E8] border-2 border-[#D4AF37] mb-2">
                      <Icon className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <span className="text-[#0C3C3C] font-['Montserrat'] text-[10px] font-bold text-center leading-tight">{cert.name}</span>
                    <span className="text-[#D4AF37] font-['Montserrat'] text-[9px] font-semibold">{cert.code}</span>
                    <LevelBar level={cert.levelNum} />
                    <span className="text-[#0C3C3C]/60 font-['Work_Sans'] text-[9px] mt-0.5">{cert.level}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ===== DESKTOP TABLE ===== */}
        <div className="hidden lg:block max-w-[1200px] mx-auto overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-3 text-start bg-[#0C3C3C] text-[#F5F0E8] font-['Montserrat'] text-xs font-bold tracking-wider uppercase border-r border-[#1A5C5C] w-[140px]">
                  Certification
                </th>
                {certs.map((cert) => {
                  const Icon = cert.icon;
                  return (
                    <th key={cert.id} className="p-3 text-center bg-[#0C3C3C] border-r border-[#1A5C5C] last:border-r-0 min-w-[150px]">
                      <div className="flex flex-col items-center gap-1">
                        <Icon className="w-5 h-5 text-[#D4AF37]" />
                        <span className="text-[#F5F0E8] font-['Montserrat'] text-[11px] font-bold leading-tight">{cert.name}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-[#D4AF37] font-['Montserrat'] text-[10px] font-semibold">{cert.code}</span>
                          {cert.isNew && (
                            <span className="px-1 py-0.5 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] text-[8px] font-bold leading-none">NEW</span>
                          )}
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {/* Level */}
              <tr className="border-b border-[#D4CBBA]">
                <td className="p-3 bg-[#F5F0E8]/80 font-['Montserrat'] text-xs font-bold text-[#0C3C3C] border-r border-[#D4CBBA]">
                  <TrendingUp className="w-3.5 h-3.5 inline-block me-1.5 text-[#D4AF37] -mt-0.5" />
                  Level
                </td>
                {certs.map((cert) => (
                  <td key={cert.id} className="p-3 text-center border-r border-[#D4CBBA] last:border-r-0 bg-white/30">
                    <span className="text-[#0C3C3C] font-['Montserrat'] text-xs font-bold block mb-1">{cert.level}</span>
                    <div className="flex justify-center"><LevelBar level={cert.levelNum} /></div>
                  </td>
                ))}
              </tr>

              {/* Prerequisites */}
              <tr className="border-b border-[#D4CBBA]">
                <td className="p-3 bg-[#F5F0E8]/80 font-['Montserrat'] text-xs font-bold text-[#0C3C3C] border-r border-[#D4CBBA]">
                  <Users className="w-3.5 h-3.5 inline-block me-1.5 text-[#D4AF37] -mt-0.5" />
                  Prerequisites
                </td>
                {certs.map((cert) => (
                  <td key={cert.id} className="p-3 text-center border-r border-[#D4CBBA] last:border-r-0 bg-white/30">
                    <span className="text-[#0C3C3C] font-['Work_Sans'] text-[11px] leading-tight">{cert.prereqs}</span>
                  </td>
                ))}
              </tr>

              {/* Content */}
              <tr className="border-b border-[#D4CBBA]">
                <td className="p-3 bg-[#F5F0E8]/80 font-['Montserrat'] text-xs font-bold text-[#0C3C3C] border-r border-[#D4CBBA]">
                  <BookOpen className="w-3.5 h-3.5 inline-block me-1.5 text-[#D4AF37] -mt-0.5" />
                  Content
                </td>
                {certs.map((cert) => (
                  <td key={cert.id} className="p-3 text-center border-r border-[#D4CBBA] last:border-r-0 bg-white/30">
                    <span className="text-[#D4AF37] font-['Montserrat'] text-sm font-extrabold">{cert.sessions}</span>
                    <span className="text-[#0C3C3C] font-['Work_Sans'] text-[10px] block">sessions</span>
                    <span className="text-[#0C3C3C]/60 font-['Montserrat'] text-[10px]">{cert.hours} hrs · {cert.domains} domains</span>
                  </td>
                ))}
              </tr>



              {/* Career Path */}
              <tr className="border-b border-[#D4CBBA]">
                <td className="p-3 bg-[#F5F0E8]/80 font-['Montserrat'] text-xs font-bold text-[#0C3C3C] border-r border-[#D4CBBA]">
                  <TrendingUp className="w-3.5 h-3.5 inline-block me-1.5 text-[#D4AF37] -mt-0.5" />
                  Career Path
                </td>
                {certs.map((cert) => (
                  <td key={cert.id} className="p-3 text-center border-r border-[#D4CBBA] last:border-r-0 bg-white/30">
                    <span className="text-[#0C3C3C] font-['Work_Sans'] text-[10px] leading-tight">{cert.careerPath}</span>
                  </td>
                ))}
              </tr>

              {/* Best For */}
              <tr className="border-b border-[#D4CBBA]">
                <td className="p-3 bg-[#F5F0E8]/80 font-['Montserrat'] text-xs font-bold text-[#0C3C3C] border-r border-[#D4CBBA]">
                  <Target className="w-3.5 h-3.5 inline-block me-1.5 text-[#D4AF37] -mt-0.5" />
                  Best For
                </td>
                {certs.map((cert) => (
                  <td key={cert.id} className="p-3 text-center border-r border-[#D4CBBA] last:border-r-0 bg-white/30">
                    <span className="text-[#0C3C3C] font-['Work_Sans'] text-[11px] font-semibold italic">{cert.bestFor}</span>
                  </td>
                ))}
              </tr>

              {/* Price */}
              <tr className="border-b border-[#D4CBBA]">
                <td className="p-3 bg-[#F5F0E8]/80 font-['Montserrat'] text-xs font-bold text-[#0C3C3C] border-r border-[#D4CBBA]">
                  Price
                </td>
                {certs.map((cert) => (
                  <td key={cert.id} className="p-3 text-center border-r border-[#D4CBBA] last:border-r-0 bg-white/30">
                    <span className="text-[#D4AF37] font-['Montserrat'] text-xl font-extrabold">${cert.price}</span>
                    <span className="text-[#0C3C3C]/50 font-['Work_Sans'] text-[10px] block">USD</span>
                  </td>
                ))}
              </tr>

              {/* CTA */}
              <tr>
                <td className="p-3 bg-[#F5F0E8]/80 border-r border-[#D4CBBA]" />
                {certs.map((cert) => (
                  <td key={cert.id} className="p-3 text-center border-r border-[#D4CBBA] last:border-r-0 bg-white/30">
                    <a
                      href="/contact"
                      className="inline-block px-4 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-[11px] hover:bg-[#B8962E] transition-all duration-300"
                    >
                      Enroll
                    </a>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* ===== MOBILE CARDS ===== */}
        <div className="lg:hidden space-y-3 max-w-lg mx-auto">
          {certs.map((cert) => (
            <MobileCard key={cert.id} cert={cert} />
          ))}
        </div>
      </div>
    </section>
  );
}
