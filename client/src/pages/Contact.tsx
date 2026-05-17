/*
  DESIGN: "Luminous Pathway" - Global Edition
  Contact & Enrollment page - beige-dominant, English-only, worldwide audience.
*/

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, MapPin, Send, Clock, MessageSquare, Globe2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

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

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("");
  const [message, setMessage] = useState("");

  const contactMutation = trpc.contact.send.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Message sent! We'll get back to you within 24 hours.");
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate({
      name,
      email,
      phone: phone || undefined,
      interest,
      message: message || undefined,
    });
  };

  const handleReset = () => {
    setSubmitted(false);
    setName("");
    setEmail("");
    setPhone("");
    setInterest("");
    setMessage("");
  };

  const inputClasses = "w-full bg-white/60 border border-[#D4CBBA] text-[#0C3C3C] font-['Work_Sans'] text-sm px-4 py-3 focus:border-[#D4AF37] focus:outline-none transition-colors duration-300 placeholder:text-[#0C3C3C]/30";
  const labelClasses = "block text-[#D4AF37] font-['Montserrat'] text-xs font-bold tracking-[0.1em] uppercase mb-2";

  const faqs = [
    { q: "Do I need prior cybersecurity experience?", a: "No. Our courses range from beginner-friendly (Tech+) to advanced (CISM). CompTIA Security+ is a foundational certification designed for beginners with basic IT knowledge, while CISM targets experienced professionals with 3-5+ years." },
    { q: "What's included in each course?", a: "Every course includes in-depth study guides, audio narrations, practice questions, hands-on activities, and a certificate of completion. Some courses also include interactive labs and simulation exercises." },
    { q: "How long do I have access to the course?", a: "Once enrolled, you have lifetime access to all course materials, lectures, labs, and practice exams. Study at your own pace with no time limits." },
    { q: "How do I take the actual certification exam?", a: "CompTIA exams are administered by Pearson VUE. You can take them at a testing center in your country or online via remote proctoring from home. ISACA CISM exams are available at PSI testing centers or online. We'll guide you through the registration process." },
    { q: "Is there a money-back guarantee?", a: "Yes. If you're not satisfied with the course within 14 days of purchase, we'll issue a full refund - no questions asked." },
  ];

  return (
    <div className="min-h-screen bg-[#F5F0E8] overflow-x-hidden">
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative pt-32 pb-16">
        <div className="absolute inset-0 opacity-[0.04]">
          <img src={PATTERN_IMG} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container relative z-10 text-center">
          <FadeInSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#D4AF37]/40 bg-[#D4AF37]/10 mb-6">
              <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[#D4AF37] font-['Montserrat'] text-sm font-semibold tracking-wide">Get Started</span>
            </div>
          </FadeInSection>
          <FadeInSection delay={100}>
            <h1 className="text-[#0C3C3C] font-['Playfair_Display'] text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">Contact Us</h1>
          </FadeInSection>
          <FadeInSection delay={200}>
            <p className="text-[#0C3C3C] font-['Work_Sans'] text-lg font-medium max-w-2xl mx-auto">
              Ready to advance your career? Fill out the form below and our team will get back to you within 24 hours.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* ===== FORM + INFO ===== */}
      <section className="py-24 sm:py-32">
        <div className="container">
          <div className="grid lg:grid-cols-5 gap-12 max-w-6xl mx-auto">

            {/* Contact Info */}
            <div className="lg:col-span-2">
              <FadeInSection>
                <h2 className="text-[#0C3C3C] font-['Playfair_Display'] text-3xl font-bold mb-8">Get in Touch</h2>
                <div className="space-y-6">
                  {[
                    { icon: Mail, label: "info@apexcyberacademy.org" },
                    { icon: Globe2, label: "Available Worldwide" },
                    { icon: MapPin, label: "Online Learning Platform" },
                    { icon: Clock, label: "Support: Mon-Fri, 9AM-6PM EST" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 group">
                      <div className="w-10 h-10 bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center shrink-0 group-hover:bg-[#D4AF37]/20 transition-colors duration-300">
                        <item.icon className="w-5 h-5 text-[#D4AF37]" />
                      </div>
                      <span className="text-[#0C3C3C] font-['Work_Sans'] text-sm font-medium pt-2.5">{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* Trust badges */}
                <div className="mt-10 p-4 bg-white/40 border border-[#D4CBBA]">
                  <p className="text-[#D4AF37] font-['Montserrat'] text-xs font-bold tracking-wider uppercase mb-3">Why Choose Us</p>
                  <ul className="space-y-2">
                    {["14-day money-back guarantee", "Lifetime access to materials", "Self-paced learning", "Certificate of completion"].map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-[#D4AF37]" />
                        <span className="text-[#0C3C3C] font-['Work_Sans'] text-xs font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeInSection>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <FadeInSection delay={150}>
                {submitted ? (
                  <div className="p-12 bg-white/40 border border-[#D4AF37]/30 text-center">
                    <div className="w-16 h-16 bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-6">
                      <Send className="w-8 h-8 text-[#D4AF37]" />
                    </div>
                    <h3 className="text-[#0C3C3C] font-['Playfair_Display'] text-2xl font-bold mb-4">Message sent! We'll get back to you within 24 hours.</h3>
                    <button onClick={handleReset} className="text-[#D4AF37] font-['Montserrat'] text-sm font-bold underline underline-offset-4 hover:text-[#B8962E] transition-colors">
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="p-8 sm:p-10 bg-white/40 border border-[#D4CBBA]">
                    <div className="grid sm:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className={labelClasses}>Full Name</label>
                        <input type="text" required placeholder="Enter your full name" className={inputClasses} value={name} onChange={(e) => setName(e.target.value)} />
                      </div>
                      <div>
                        <label className={labelClasses}>Email Address</label>
                        <input type="email" required placeholder="your@email.com" className={inputClasses} value={email} onChange={(e) => setEmail(e.target.value)} />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label className={labelClasses}>Phone Number (Optional)</label>
                        <input type="tel" placeholder="+1 (555) 000-0000" className={inputClasses} value={phone} onChange={(e) => setPhone(e.target.value)} />
                      </div>
                      <div>
                        <label className={labelClasses}>I'm Interested In</label>
                        <select required className={inputClasses} value={interest} onChange={(e) => setInterest(e.target.value)}>
                          <option value="">Select...</option>
                          <option value="cism">ISACA CISM - $299 USD (50% OFF)</option>
                          <option value="security+">CompTIA Security+ - $49 USD (40% OFF)</option>
                          <option value="ceh">EC-Council CEH v13 - $89 USD (NEW)</option>
                          <option value="network+">CompTIA Network+ - $49 USD (NEW)</option>
                          <option value="secai+">CompTIA SecAI+ - $39 USD (35% OFF)</option>
                          <option value="techplus">CompTIA Tech+ - $35 USD (30% OFF)</option>
                          <option value="bundle">Complete Bundle - All 6 Courses - $449 USD</option>
                          <option value="partner">Partnership Inquiry</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="p-4 bg-red-50 border border-red-200">
                        <p className="text-red-600 font-['Montserrat'] text-xs font-bold tracking-[0.1em] uppercase mb-1">
                          Limited Time Launch Pricing
                        </p>
                        <p className="text-[#0C3C3C] font-['Montserrat'] text-lg font-extrabold">
                          Starting at $35 USD
                          <span className="text-[#0C3C3C]/60 font-['Work_Sans'] text-sm font-normal ml-2">
                            - Save up to 50%
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="mb-8">
                      <label className={labelClasses}>Message (Optional)</label>
                      <textarea rows={4} placeholder="Tell us about your goals or any questions you have..." className={`${inputClasses} resize-none`} value={message} onChange={(e) => setMessage(e.target.value)} />
                    </div>

                    <button
                      type="submit"
                      disabled={contactMutation.isPending}
                      className="w-full flex items-center justify-center gap-3 py-4 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-base tracking-wide hover:bg-[#B8962E] transition-all duration-300 gold-glow-strong disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                      {contactMutation.isPending ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                )}
              </FadeInSection>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-24 sm:py-32 relative">
        <div className="absolute inset-0 opacity-[0.03]">
          <img src={PATTERN_IMG} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="container relative z-10">
          <FadeInSection>
            <div className="text-center mb-16">
              <h2 className="text-[#0C3C3C] font-['Playfair_Display'] text-4xl sm:text-5xl font-bold">Frequently Asked Questions</h2>
            </div>
          </FadeInSection>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <FadeInSection key={i} delay={i * 80}>
                <div className={`border transition-all duration-300 ${openFaq === i ? "border-[#D4AF37]/40 bg-white/60" : "border-[#D4CBBA] bg-white/40"}`}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-6 text-left">
                    <span className="text-[#0C3C3C] font-['Montserrat'] text-sm font-bold pr-4">{faq.q}</span>
                    <span className={`text-[#D4AF37] text-xl shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-6">
                      <div className="border-t border-[#D4CBBA] pt-4">
                        <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm font-medium leading-relaxed">{faq.a}</p>
                      </div>
                    </div>
                  )}
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
