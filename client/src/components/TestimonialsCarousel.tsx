import { useState, useEffect, useCallback, useRef } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    quote: "Passed Security+ on my first try. The labs alone were worth it.",
    name: "Khalid M.",
    avatar: "Khalid",
    role: "SOC Analyst, Riyadh",
    cert: "CompTIA Security+",
    stars: 5,
  },
  {
    quote: "As a mid-career IT manager, the CISM program gave me the strategic framework I was missing. The study guides are thorough and the practice exams mirror the real test. Worth every dollar of the investment.",
    name: "Fatima A.",
    avatar: "FA",
    role: "IT Security Manager, Dubai",
    cert: "ISACA CISM",
    stars: 5,
  },
  {
    quote: "Flashcards + study sheets = game changers. Went from Tech+ beginner to Network+ certified in four months.",
    name: "Omar J.",
    avatar: "Omar",
    role: "Junior Network Engineer, Amman",
    cert: "CompTIA Network+",
    stars: 5,
  },
  {
    quote: "10/10. The SecAI+ content on prompt injection and model poisoning is incredibly relevant. This is the future of security and Apex is ahead of the curve.",
    name: "Sara T.",
    avatar: "S",
    role: "AI Security Researcher, Cairo",
    cert: "CompTIA SecAI+",
    stars: 5,
  },
  {
    quote: "Best study material I've used. Period.",
    name: "Youssef B.",
    avatar: "YB",
    role: "IT Student, Beirut",
    cert: "CompTIA Tech+",
    stars: 5,
  },
  {
    quote: "What sets Apex apart is the quality of the content. Every lecture feels like a conversation with a knowledgeable mentor, not a dry textbook. The concept diagrams and one-page study sheets saved me hours of note-taking.",
    name: "Hassan R.",
    avatar: "HR",
    role: "Cybersecurity Consultant, Doha",
    cert: "CompTIA Security+",
    stars: 5,
  },
  {
    quote: "Got my CISM. Thank you Apex!!",
    name: "Layla S.",
    avatar: "Layla",
    role: "Security Lead, Jeddah",
    cert: "ISACA CISM",
    stars: 5,
  },
  {
    quote: "I enrolled in the CISM + SecAI+ bundle and it was the best decision for my career pivot into security leadership. The smart study planner identified my weak areas and helped me focus my review time efficiently.",
    name: "Nadia K.",
    avatar: "Nadia",
    role: "CISO, Casablanca",
    cert: "CISM + SecAI+ Bundle",
    stars: 5,
  },
  {
    quote: "The interactive labs are unreal. Built firewall rules, responded to a ransomware sim, broke an AI with prompt injection — all in one course. Hands-on learning done right.",
    name: "Tariq D.",
    avatar: "T",
    role: "Penetration Tester, Kuwait City",
    cert: "CompTIA Security+",
    stars: 5,
  },
];

// Show 3 cards at a time on desktop, 1 on mobile
const CARDS_PER_VIEW_DESKTOP = 3;
const AUTO_SLIDE_INTERVAL = 5000;

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const cardsPerView = isMobile ? 1 : CARDS_PER_VIEW_DESKTOP;
  const maxIndex = testimonials.length - cardsPerView;

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Auto-slide
  useEffect(() => {
    if (isPaused) return;
    timerRef.current = setInterval(next, AUTO_SLIDE_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, next]);

  return (
    <div
      className="mt-20 max-w-6xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="text-center mb-12">
        <h3 className="text-[#0C3C3C] font-['Playfair_Display'] text-3xl sm:text-4xl font-bold mb-3">
          What Our Students Say
        </h3>
        <p className="text-[#1A5C5C] font-['Work_Sans'] text-base max-w-xl mx-auto">
          Real feedback from professionals who advanced their careers with Apex.
        </p>
      </div>

      {/* Carousel container */}
      <div className="relative">
        {/* Navigation arrows */}
        <button
          onClick={prev}
          className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/60 border border-[#D4CBBA] hover:border-[#D4AF37]/50 flex items-center justify-center transition-all duration-300"
          aria-label="Previous testimonials"
        >
          <ChevronLeft className="w-5 h-5 text-[#D4AF37]" />
        </button>
        <button
          onClick={next}
          className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/60 border border-[#D4CBBA] hover:border-[#D4AF37]/50 flex items-center justify-center transition-all duration-300"
          aria-label="Next testimonials"
        >
          <ChevronRight className="w-5 h-5 text-[#D4AF37]" />
        </button>

        {/* Cards track */}
        <div className="overflow-hidden mx-4 sm:mx-0">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)`,
            }}
          >
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="px-3 shrink-0"
                style={{ width: `${100 / cardsPerView}%` }}
              >
                <div className="p-6 bg-white/30 border border-[#D4CBBA] hover:border-[#D4AF37]/30 transition-all duration-500 h-full flex flex-col relative min-h-[220px]">
                  <Quote className="w-7 h-7 text-[#D4AF37]/15 absolute top-5 right-5" />
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.stars)].map((_, j) => (
                      <Star
                        key={j}
                        className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]"
                      />
                    ))}
                  </div>
                  <p className="text-[#0C3C3C]/90 font-['Work_Sans'] text-sm leading-relaxed mb-6 flex-1">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-[#D4CBBA]">
                    <div
                      className={`${testimonial.avatar.length > 2 ? "w-auto px-3" : "w-10"} h-10 bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center shrink-0`}
                    >
                      <span
                        className={`text-[#D4AF37] font-['Montserrat'] font-bold ${testimonial.avatar.length > 2 ? "text-[10px] tracking-wide" : "text-xs"}`}
                      >
                        {testimonial.avatar}
                      </span>
                    </div>
                    <div>
                      <p className="text-[#0C3C3C] font-['Montserrat'] text-sm font-semibold">
                        {testimonial.name}
                      </p>
                      <p className="text-[#1A5C5C] font-['Work_Sans'] text-xs">
                        {testimonial.role}
                      </p>
                      <p className="text-[#D4AF37]/70 font-['Montserrat'] text-[10px] font-semibold tracking-wide mt-0.5">
                        {testimonial.cert}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === currentIndex
                  ? "bg-[#D4AF37] w-6"
                  : "bg-[#227C82]/40 hover:bg-[#227C82]/70"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
