/*
  Refund Policy page — matches "Luminous Pathway" design language.
  72-hour money-back guarantee with 5% content access threshold.
*/

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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

export default function RefundPolicy() {
  const sectionClasses = "mb-10";
  const headingClasses = "text-[#0C3C3C] font-['Playfair_Display'] text-2xl font-bold mb-4";
  const paragraphClasses = "text-[#0C3C3C] font-['Work_Sans'] text-sm font-medium leading-relaxed mb-4";
  const listClasses = "text-[#0C3C3C] font-['Work_Sans'] text-sm font-medium leading-relaxed mb-4 list-disc list-inside space-y-2";

  return (
    <div className="min-h-screen bg-[#F5F0E8] overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16">
        <div className="container relative z-10 text-center">
          <FadeInSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#D4AF37]/40 bg-[#D4AF37]/10 mb-6">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[#D4AF37] font-['Montserrat'] text-sm font-semibold tracking-wide">Our Guarantee</span>
            </div>
          </FadeInSection>
          <FadeInSection delay={100}>
            <h1 className="text-[#0C3C3C] font-['Playfair_Display'] text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">Refund Policy</h1>
          </FadeInSection>
          <FadeInSection delay={200}>
            <p className="text-[#0C3C3C] font-['Work_Sans'] text-lg font-medium max-w-2xl mx-auto">
              We stand behind the quality of our courses. If you're not satisfied, we offer a straightforward refund process.
            </p>
          </FadeInSection>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-16 sm:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <FadeInSection>
              {/* Highlight Box */}
              <div className="p-6 sm:p-8 bg-white/60 border border-[#D4AF37]/30 mb-12">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <div>
                    <h2 className="text-[#0C3C3C] font-['Playfair_Display'] text-xl font-bold mb-2">72-Hour Money-Back Guarantee</h2>
                    <p className={paragraphClasses}>
                      We offer a full refund within <strong>72 hours</strong> of your purchase date, provided you have accessed <strong>less than 5%</strong> of the course content. This gives you enough time to explore the course structure and materials to determine if it's the right fit for you.
                    </p>
                  </div>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection delay={100}>
              <div className={sectionClasses}>
                <h2 className={headingClasses}>1. Eligibility for a Refund</h2>
                <p className={paragraphClasses}>
                  To be eligible for a full refund, the following conditions must be met:
                </p>
                <ul className={listClasses}>
                  <li>Your refund request must be submitted within <strong>72 hours</strong> of the original purchase date.</li>
                  <li>You must have accessed <strong>less than 5%</strong> of the total course content (including lectures, quizzes, labs, and downloadable materials).</li>
                  <li>The request must be submitted via our Contact page or by emailing <strong>info@apexcyberacademy.org</strong>.</li>
                </ul>
              </div>
            </FadeInSection>

            <FadeInSection delay={150}>
              <div className={sectionClasses}>
                <h2 className={headingClasses}>2. Non-Refundable Situations</h2>
                <p className={paragraphClasses}>
                  Refunds will <strong>not</strong> be issued in the following cases:
                </p>
                <ul className={listClasses}>
                  <li>More than 72 hours have passed since the date of purchase.</li>
                  <li>You have accessed <strong>5% or more</strong> of the course content.</li>
                  <li>A certificate of completion has been issued for the course.</li>
                  <li>The purchase was made using a promotional code or voucher that explicitly states "non-refundable."</li>
                </ul>
              </div>
            </FadeInSection>

            <FadeInSection delay={200}>
              <div className={sectionClasses}>
                <h2 className={headingClasses}>3. How Content Access Is Calculated</h2>
                <p className={paragraphClasses}>
                  Course content access is measured as a percentage of the total available materials you have opened or interacted with. This includes:
                </p>
                <ul className={listClasses}>
                  <li>Video lectures viewed (even partially)</li>
                  <li>Study guide pages accessed</li>
                  <li>Quizzes started or completed</li>
                  <li>Practice exams attempted</li>
                  <li>Lab exercises initiated</li>
                  <li>Downloadable materials accessed</li>
                </ul>
                <p className={paragraphClasses}>
                  For example, if a course contains 100 total content items and you have accessed 4 of them, your access rate is 4% — which is within the refund eligibility threshold.
                </p>
              </div>
            </FadeInSection>

            <FadeInSection delay={250}>
              <div className={sectionClasses}>
                <h2 className={headingClasses}>4. Bundle Purchases</h2>
                <p className={paragraphClasses}>
                  For bundle purchases (multiple courses), the 5% access threshold applies to the <strong>combined total content</strong> across all courses in the bundle. If you are eligible for a refund, the entire bundle purchase will be refunded — partial refunds for individual courses within a bundle are not available.
                </p>
              </div>
            </FadeInSection>

            <FadeInSection delay={300}>
              <div className={sectionClasses}>
                <h2 className={headingClasses}>5. How to Request a Refund</h2>
                <p className={paragraphClasses}>
                  To request a refund, please follow these steps:
                </p>
                <ul className={listClasses}>
                  <li>Visit our <a href="/contact" className="text-[#D4AF37] font-bold underline underline-offset-4 hover:text-[#B8962E] transition-colors">Contact page</a> or email us at <strong>info@apexcyberacademy.org</strong>.</li>
                  <li>Include your full name, the email address associated with your account, and the course(s) you'd like refunded.</li>
                  <li>Our team will review your request and verify eligibility within <strong>2 business days</strong>.</li>
                  <li>If approved, the refund will be processed to your original payment method within <strong>5-10 business days</strong>.</li>
                </ul>
              </div>
            </FadeInSection>

            <FadeInSection delay={350}>
              <div className={sectionClasses}>
                <h2 className={headingClasses}>6. Processing Time</h2>
                <p className={paragraphClasses}>
                  Once your refund is approved, please allow 5-10 business days for the funds to appear in your account. The exact timing depends on your payment provider and financial institution. You will receive an email confirmation once the refund has been processed.
                </p>
              </div>
            </FadeInSection>

            <FadeInSection delay={400}>
              <div className={sectionClasses}>
                <h2 className={headingClasses}>7. Account Access After Refund</h2>
                <p className={paragraphClasses}>
                  Once a refund is issued, access to the refunded course(s) will be revoked immediately. Your account will remain active, and any other courses you have purchased separately will not be affected.
                </p>
              </div>
            </FadeInSection>

            <FadeInSection delay={450}>
              <div className={sectionClasses}>
                <h2 className={headingClasses}>8. Disputes and Chargebacks</h2>
                <p className={paragraphClasses}>
                  We encourage you to contact us directly before initiating a chargeback with your bank or credit card company. We are committed to resolving any issues promptly and fairly. Unauthorized chargebacks may result in account suspension.
                </p>
              </div>
            </FadeInSection>

            <FadeInSection delay={500}>
              <div className={sectionClasses}>
                <h2 className={headingClasses}>9. Changes to This Policy</h2>
                <p className={paragraphClasses}>
                  Apex Cyber Academy reserves the right to modify this refund policy at any time. Any changes will apply only to purchases made after the updated policy is published. The policy in effect at the time of your purchase will govern your refund eligibility.
                </p>
              </div>
            </FadeInSection>

            <FadeInSection delay={550}>
              <div className="p-6 bg-white/40 border border-[#D4CBBA] text-center">
                <p className={paragraphClasses + " mb-0"}>
                  Questions about our refund policy? <a href="/contact" className="text-[#D4AF37] font-bold underline underline-offset-4 hover:text-[#B8962E] transition-colors">Contact us</a> and we'll be happy to help.
                </p>
                <p className="text-[#0C3C3C]/50 font-['Work_Sans'] text-xs mt-4">
                  Last updated: May 2026
                </p>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
