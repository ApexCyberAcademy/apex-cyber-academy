import { useEffect, useState } from "react";
import { CheckCircle, Loader2, AlertCircle, Copy, LogIn } from "lucide-react";

interface SessionResult {
  status: string;
  email?: string;
  courseName?: string;
  tempPassword?: string;
  enrolled?: boolean;
  error?: string;
}

export default function EnrollmentSuccess() {
  const [result, setResult] = useState<SessionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (!sessionId) {
      setResult({ status: "error", error: "No session ID found" });
      setLoading(false);
      return;
    }

    fetch(`/api/stripe/session-status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setResult(data);
        setLoading(false);
      })
      .catch(() => {
        setResult({ status: "error", error: "Failed to verify payment" });
        setLoading(false);
      });
  }, []);

  const copyPassword = () => {
    if (result?.tempPassword) {
      navigator.clipboard.writeText(result.tempPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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

  if (!result || result.status === "error" || result.status === "unpaid") {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-[#12121a] border border-red-500/30 rounded-lg p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white font-['Montserrat'] mb-2">Payment Issue</h1>
          <p className="text-[#C4B9A8] font-['Montserrat']">
            {result?.error || "Your payment could not be verified. Please contact support if you were charged."}
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

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-[#12121a] border border-[#D4AF37]/30 rounded-lg p-8">
        <div className="text-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white font-['Montserrat'] mb-2">
            Enrollment Successful!
          </h1>
          <p className="text-[#C4B9A8] font-['Montserrat']">
            You're now enrolled in <span className="text-[#D4AF37] font-semibold">{result.courseName}</span>
          </p>
        </div>

        <div className="bg-[#1a1a2e] border border-[#D4AF37]/20 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-white font-['Montserrat'] mb-4">Your Login Credentials</h2>
          
          <div className="space-y-3">
            <div>
              <label className="text-[#C4B9A8] text-sm font-['Montserrat']">Email</label>
              <p className="text-white font-['Montserrat'] font-medium">{result.email}</p>
            </div>

            {result.tempPassword && (
              <div>
                <label className="text-[#C4B9A8] text-sm font-['Montserrat']">Temporary Password</label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="bg-[#0a0a0f] border border-[#D4AF37]/30 px-3 py-2 rounded text-[#D4AF37] font-mono text-lg flex-1">
                    {result.tempPassword}
                  </code>
                  <button
                    onClick={copyPassword}
                    className="p-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded hover:bg-[#D4AF37]/20 transition-colors"
                    title="Copy password"
                  >
                    <Copy className="w-5 h-5 text-[#D4AF37]" />
                  </button>
                </div>
                {copied && <p className="text-green-400 text-xs mt-1 font-['Montserrat']">Copied!</p>}
              </div>
            )}

            {!result.tempPassword && (
              <div className="bg-[#0a0a0f] border border-[#D4AF37]/20 rounded p-3">
                <p className="text-[#C4B9A8] text-sm font-['Montserrat']">
                  An account already exists for this email. Use your existing password to log in.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#0a0a0f] border border-[#D4AF37]/10 rounded-lg p-4 mb-6">
          <p className="text-[#C4B9A8] text-sm font-['Montserrat']">
            <strong className="text-white">Important:</strong> Save your password now. You can change it after logging in.
          </p>
        </div>

        <a
          href="/login"
          className="flex items-center justify-center gap-2 w-full px-6 py-3 bg-[#D4AF37] text-black font-bold font-['Montserrat'] rounded hover:bg-[#b8962e] transition-colors"
        >
          <LogIn className="w-5 h-5" />
          Go to Login
        </a>
      </div>
    </div>
  );
}
