/**
 * Login Page — Built-in email/password authentication
 * Replaces the Manus OAuth redirect flow.
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { Shield, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type Mode = "login" | "register";

export default function Login() {
  const [, navigate] = useLocation();
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const body =
        mode === "login"
          ? { email: form.email, password: form.password }
          : { name: form.name, email: form.email, password: form.password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Something went wrong");
        return;
      }

      toast.success(mode === "login" ? "Welcome back!" : "Account created! Welcome to Apex Cyber Academy.");

      // Redirect to dashboard or the page they came from
      const params = new URLSearchParams(window.location.search);
      const returnTo = params.get("returnTo") || "/dashboard";
      navigate(returnTo);
      // Force a full reload so tRPC re-fetches the auth state
      window.location.href = returnTo;
    } catch (err) {
      toast.error("Network error — please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0C3C3C] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 bg-[#D4AF37] flex items-center justify-center transform rotate-45 mb-4">
            <span className="text-[#0C3C3C] font-['Montserrat'] font-extrabold text-xl transform -rotate-45">
              A
            </span>
          </div>
          <h1 className="text-white font-['Montserrat'] font-bold text-2xl tracking-wide">
            APEX
          </h1>
          <p className="text-[#D4AF37] font-['Montserrat'] font-semibold text-xs tracking-[0.3em] uppercase">
            Cyber Academy
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#F5F0E8] rounded-2xl p-8 shadow-2xl">
          <h2 className="text-[#0C3C3C] font-['Montserrat'] font-bold text-xl mb-1 text-center">
            {mode === "login" ? "Sign In" : "Create Account"}
          </h2>
          <p className="text-[#5C5C5C] text-sm text-center mb-6">
            {mode === "login"
              ? "Access your courses and progress"
              : "Start your certification journey"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-[#0C3C3C] font-semibold text-sm">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Jane Smith"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="border-[#D4CBBA] focus:border-[#0C3C3C] bg-white"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-[#0C3C3C] font-semibold text-sm">
                Email Address
              </Label>
              <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={(e) => e.target.removeAttribute('readonly')}
                  required
                  autoComplete="off"
                  className="border-[#D4CBBA] focus:border-[#0C3C3C] bg-white"
                />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-[#0C3C3C] font-semibold text-sm">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={mode === "register" ? "At least 8 characters" : "••••••••"}
                  value={form.password}
                  onChange={handleChange}
                  onFocus={(e) => e.target.removeAttribute('readonly')}
                  required
                  minLength={mode === "register" ? 8 : 1}
                  autoComplete="new-password"
                  className="border-[#D4CBBA] focus:border-[#0C3C3C] bg-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C5C5C] hover:text-[#0C3C3C]"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0C3C3C] hover:bg-[#0a3030] text-white font-['Montserrat'] font-bold tracking-wide h-11 mt-2"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Shield className="w-4 h-4 mr-2" />
              )}
              {mode === "login" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          {/* Toggle mode */}
          <div className="mt-5 text-center text-sm text-[#5C5C5C]">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => setMode("register")}
                  className="text-[#0C3C3C] font-semibold hover:text-[#D4AF37] transition-colors"
                >
                  Create one
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-[#0C3C3C] font-semibold hover:text-[#D4AF37] transition-colors"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>

        <p className="text-center text-[#D4CBBA] text-xs mt-6">
          © 2026 Apex Cyber Academy. All rights reserved.
        </p>
      </div>
    </div>
  );
}
