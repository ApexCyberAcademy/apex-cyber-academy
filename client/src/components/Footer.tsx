import { Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#D4CBBA] py-16 bg-[#F5F0E8]">
      <div className="container">
        <div className="grid sm:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <a href="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-8 h-8 bg-[#D4AF37] flex items-center justify-center transform rotate-45">
                <span className="text-[#0C3C3C] font-['Montserrat'] font-extrabold text-sm transform -rotate-45">A</span>
              </div>
              <div>
                <span className="text-[#0C3C3C] font-['Montserrat'] font-bold text-sm">APEX</span>
                <span className="text-[#D4AF37] font-['Montserrat'] text-[9px] tracking-[0.2em] uppercase block">Cyber Academy</span>
              </div>
            </a>
            <p className="text-[#0C3C3C] font-['Work_Sans'] text-sm font-medium leading-relaxed">
              Professional certification prep courses trusted by IT professionals worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#D4AF37] font-['Montserrat'] text-sm font-bold tracking-[0.15em] uppercase mb-4">Quick Links</h4>
            <div className="space-y-3">
              <a href="/" className="block text-[#0C3C3C] hover:text-[#D4AF37] font-['Work_Sans'] text-sm font-medium transition-colors duration-300">Home</a>
              <a href="/course" className="block text-[#0C3C3C] hover:text-[#D4AF37] font-['Work_Sans'] text-sm font-medium transition-colors duration-300">Courses</a>
              <a href="/about" className="block text-[#0C3C3C] hover:text-[#D4AF37] font-['Work_Sans'] text-sm font-medium transition-colors duration-300">About</a>
              <a href="/contact" className="block text-[#0C3C3C] hover:text-[#D4AF37] font-['Work_Sans'] text-sm font-medium transition-colors duration-300">Contact</a>
              <a href="/refund-policy" className="block text-[#0C3C3C] hover:text-[#D4AF37] font-['Work_Sans'] text-sm font-medium transition-colors duration-300">Refund Policy</a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[#D4AF37] font-['Montserrat'] text-sm font-bold tracking-[0.15em] uppercase mb-4">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[#0C3C3C] font-['Work_Sans'] text-sm font-medium">info@apexcyberacademy.org</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-[#0C3C3C] font-['Work_Sans'] text-sm font-medium">Serving Professionals Worldwide</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#D4CBBA] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-[#0C3C3C]/50 font-['Work_Sans'] text-xs">&copy; 2026 Apex Cyber Academy. All rights reserved.</span>
          <span className="text-[#0C3C3C]/30 font-['Work_Sans'] text-xs">apexcyberacademy.org</span>
        </div>
      </div>
    </footer>
  );
}
