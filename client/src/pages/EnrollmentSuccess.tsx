import { useEffect, useState } from "react";
import { CheckCircle, Loader2, AlertCircle, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

interface SessionInfo {
  status: string;
  email?: string;
  courseId?: string;
  courseName?: string;
  accountExists?: boolean;
  error?: string;
}

export default function EnrollmentSuccess() {
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (!sessionId) {
      setSessionInfo({ status: "error", error: "No session ID found" });
      setLoading(false);
      return;
    }

    fetch(`/api/stripe/session-status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setSessionInfo(data);
        setLoading(false);
      })
      .catch(() => {
        setSessionInfo({ status: "error", error: "Failed to verify payment" });
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);

    try {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get("session_id");

      const res = await fetch("/api/stripe/create-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create account");
        setSubmitting(false);
        return;
      }

      // Success — account created and session cookie set (auto-logged in)
      setSuccess(true);

      // Redirect to dashboard after a brief moment
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  };

  // ─── Loading state ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#D4AF37] animate-spin mx-auto mb-4" />
          <p className="text-white text-lg font-['Montserrat']">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  // ─── Error / unpaid state ──────────────────────────────────────
  if (!sessionInfo || sessionInfo.status === "error" || sessionInfo.status === "unpaid") {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#12121a] border border-red-500/30 rounded-lg p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white font-['Montserrat'] mb-2">Payment Issue</h1>
          <p className="text-[#C4B9A8] font-['Montserrat']">
            {sessionInfo?.error || "Your payment could not be verified. Please contact support if you were charged."}
          </p>
          <a
            href="/course"
            className="inline-block mt-6 px-6 py-3 bg-[#D4AF37] text-black font-bold font-['Montserrat'] rounded hover:bg-[#b8962e] transition-colors"
          >
            Back to Courses
          </a>
        </div>
      </div>
    );
  }

  // ─── Success state (account created, redirecting) ──────────────
  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-[#12121a] border border-[#D4AF37]/30 rounded-lg p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white font-['Montserrat'] mb-2">
            You're All Set!
          </h1>
          <p className="text-[#C4B9A8] font-['Montserrat'] mb-4">
            Your account has been created and you're enrolled in{" "}
            <span className="text-[#D4AF37] font-semibold">{sessionInfo.courseName}</span>.
          </p>
          <p className="text-[#C4B9A8] font-['Montserrat'] text-sm">
            Redirecting to your dashboard...
          </p>
          <Loader2 className="w-6 h-6 text-[#D4AF37] animate-spin mx-auto mt-4" />
        </div>
      </div>
    );
  }

  // ─── Existing account — just log them in ───────────────────────
  if (sessionInfo.accountExists) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <div className="max-w-lg w-full bg-[#12121a] border border-[#D4AF37]/30 rounded-lg p-8">
          <div className="text-center mb-6">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white font-['Montserrat'] mb-2">
              Payment Confirmed!
            </h1>
            <p className="text-[#C4B9A8] font-['Montserrat']">
              You're now enrolled in{" "}
              <span className="text-[#D4AF37] font-semibold">{sessionInfo.courseName}</span>
            </p>
          </div>

          <div className="bg-[#1a1a2e] border border-[#D4AF37]/20 rounded-lg p-6 mb-6">
            <p className="text-[#C4B9A8] font-['Montserrat'] text-sm mb-4">
              An account already exists for <span className="text-white font-medium">{sessionInfo.email}</span>.
              Enter your password to access your course immediately, or set a new one.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[#C4B9A8] text-sm font-['Montserrat'] block mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0a0a0f] border border-[#D4AF37]/30 rounded px-4 py-3 text-white font-['Montserrat'] focus:outline-none focus:border-[#D4AF37] pr-12"
                    placeholder="Enter your password"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C4B9A8] hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[#C4B9A8] text-sm font-['Montserrat'] block mb-1">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#0a0a0f] border border-[#D4AF37]/30 rounded px-4 py-3 text-white font-['Montserrat'] focus:outline-none focus:border-[#D4AF37]"
                  placeholder="Confirm your password"
                  required
                  minLength={8}
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm font-['Montserrat']">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#D4AF37] text-black font-bold font-['Montserrat'] rounded hover:bg-[#b8962e] transition-colors disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ArrowRight className="w-5 h-5" />
                    Access My Course
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ─── New account — set password form ───────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-[#12121a] border border-[#D4AF37]/30 rounded-lg p-8">
        <div className="text-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white font-['Montserrat'] mb-2">
            Payment Confirmed!
          </h1>
          <p className="text-[#C4B9A8] font-['Montserrat']">
            You're enrolled in{" "}
            <span className="text-[#D4AF37] font-semibold">{sessionInfo.courseName}</span>
          </p>
        </div>

        <div className="bg-[#1a1a2e] border border-[#D4AF37]/20 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-white font-['Montserrat'] mb-2">
            Set Up Your Account
          </h2>
          <p className="text-[#C4B9A8] text-sm font-['Montserrat'] mb-4">
            Create a password for <span className="text-white font-medium">{sessionInfo.email}</span> to access your course.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[#C4B9A8] text-sm font-['Montserrat'] block mb-1">
                Create Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C4B9A8]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0a0a0f] border border-[#D4AF37]/30 rounded pl-11 pr-12 py-3 text-white font-['Montserrat'] focus:outline-none focus:border-[#D4AF37]"
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C4B9A8] hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[#C4B9A8] text-sm font-['Montserrat'] block mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C4B9A8]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#0a0a0f] border border-[#D4AF37]/30 rounded pl-11 pr-4 py-3 text-white font-['Montserrat'] focus:outline-none focus:border-[#D4AF37]"
                  placeholder="Re-enter your password"
                  required
                  minLength={8}
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm font-['Montserrat']">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#D4AF37] text-black font-bold font-['Montserrat'] rounded hover:bg-[#b8962e] transition-colors disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <ArrowRight className="w-5 h-5" />
                  Create Account & Start Learning
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-[#C4B9A8] text-xs text-center font-['Montserrat']">
          You'll be logged in automatically and taken to your course.
        </p>
      </div>
    </div>
  );
}
