import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useState, useEffect } from "react";
import { Menu, X, LayoutDashboard, LogIn, LogOut, Shield, Award } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Courses", href: "/course" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#F5F0E8] border-b border-[#D4CBBA] shadow-md"
          : "bg-[#F5F0E8]/95 backdrop-blur-sm"
      }`}
    >
      <div className="container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 bg-[#D4AF37] flex items-center justify-center transform rotate-45 group-hover:rotate-[405deg] transition-transform duration-700">
            <span className="text-[#0C3C3C] font-['Montserrat'] font-extrabold text-base transform -rotate-45 group-hover:rotate-[-405deg] transition-transform duration-700">
              A
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[#0C3C3C] font-['Montserrat'] font-bold text-sm leading-tight tracking-wide">
              APEX
            </span>
            <span className="text-[#D4AF37] font-['Montserrat'] font-semibold text-[9px] tracking-[0.3em] uppercase">
              Cyber Academy
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors duration-300 font-['Work_Sans'] text-sm tracking-wide ${
                isActive(link.href)
                  ? "text-[#D4AF37] font-bold"
                  : "text-[#0C3C3C] font-semibold hover:text-[#D4AF37]"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Auth-aware CTA */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm tracking-wide hover:bg-[#B8962E] transition-all duration-300"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                My Dashboard
              </Link>
              <Link
                href="/certificates"
                className="flex items-center gap-2 px-3 py-2 border border-[#0C3C3C]/20 text-[#0C3C3C] hover:border-[#D4AF37] hover:text-[#D4AF37] font-['Montserrat'] font-semibold text-sm tracking-wide transition-all duration-300"
              >
                <Award className="w-3.5 h-3.5" />
                Credentials
              </Link>
              {user?.role === "admin" && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-3 py-2 border border-[#D4AF37] text-[#D4AF37] font-['Montserrat'] font-bold text-sm tracking-wide hover:bg-[#D4AF37]/10 transition-all duration-300"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin
                </Link>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => { window.location.href = getLoginUrl(); }}
                className="flex items-center gap-2 px-3 py-2 border border-[#0C3C3C]/20 text-[#0C3C3C] hover:border-[#D4AF37] hover:text-[#D4AF37] font-['Montserrat'] font-semibold text-sm tracking-wide transition-all duration-300"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
              <Link
                href="/contact"
                className="px-5 py-2 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-sm tracking-wide hover:bg-[#B8962E] transition-all duration-300"
              >
                Enroll Now
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-[#0C3C3C] p-2"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#F5F0E8] border-t border-[#D4CBBA] pb-6">
          <div className="container flex flex-col gap-4 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`transition-colors py-2 font-['Work_Sans'] text-base font-semibold ${
                  isActive(link.href) ? "text-[#D4AF37]" : "text-[#0C3C3C] hover:text-[#D4AF37]"
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-center justify-center"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  My Dashboard
                </Link>
                <Link
                  href="/certificates"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-6 py-3 border border-[#0C3C3C]/20 text-[#0C3C3C] font-['Montserrat'] font-semibold justify-center"
                >
                  <Award className="w-4 h-4" />
                  Credentials
                </Link>
                {user?.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-6 py-3 border border-[#D4AF37] text-[#D4AF37] font-['Montserrat'] font-bold text-center justify-center"
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="flex items-center gap-2 text-[#0C3C3C] hover:text-red-500 py-2 font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { window.location.href = getLoginUrl(); }}
                  className="flex items-center gap-2 px-6 py-3 border border-[#0C3C3C]/20 text-[#0C3C3C] font-['Montserrat'] font-semibold justify-center"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </button>
                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="px-6 py-3 bg-[#D4AF37] text-[#0C3C3C] font-['Montserrat'] font-bold text-center"
                >
                  Enroll Now
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
