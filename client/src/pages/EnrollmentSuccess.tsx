import { useEffect, useState } from "react";
import { Link } from "wouter";

interface SessionStatus {
  status: string;
  paid: boolean;
  customerEmail?: string;
  courseName?: string;
  enrolled?: boolean;
  message?: string;
  loginEmail?: string;
  tempPassword?: string;
}

export default function EnrollmentSuccess() {
  const [sessionStatus, setSessionStatus] = useState<SessionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");

    if (!sessionId) {
      setError("No session ID found. Please try again.");
      setLoading(false);
      return;
    }

    fetch(`/api/stripe/session-status?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        setSessionStatus(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to verify payment:", err);
        setError("Failed to verify payment status. Please contact support.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#c9a227] mx-auto mb-4"></div>
          <p className="text-white text-lg">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center px-4">
        <div className="bg-[#1a2744] rounded-2xl p-8 max-w-md w-full text-center border border-red-500/30">
          <div className="text-red-400 text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <Link href="/course">
            <a className="inline-block bg-[#c9a227] text-black font-semibold px-6 py-3 rounded-lg hover:bg-[#d4af37] transition">
              Back to Courses
            </a>
          </Link>
        </div>
      </div>
    );
  }

  if (!sessionStatus?.paid) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center px-4">
        <div className="bg-[#1a2744] rounded-2xl p-8 max-w-md w-full text-center border border-yellow-500/30">
          <div className="text-yellow-400 text-5xl mb-4">⏳</div>
          <h1 className="text-2xl font-bold text-white mb-2">Payment Pending</h1>
          <p className="text-gray-300 mb-6">
            Your payment is still being processed. Please wait a moment and refresh.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="inline-block bg-[#c9a227] text-black font-semibold px-6 py-3 rounded-lg hover:bg-[#d4af37] transition"
          >
            Refresh Status
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center px-4">
      <div className="bg-[#1a2744] rounded-2xl p-8 max-w-lg w-full text-center border border-[#c9a227]/30">
        <div className="text-green-400 text-6xl mb-4">✓</div>
        <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
        <p className="text-[#c9a227] text-lg font-medium mb-4">
          {sessionStatus.courseName || "Your course"}
        </p>
        <p className="text-gray-300 mb-6">{sessionStatus.message}</p>

        {sessionStatus.tempPassword && (
          <div className="bg-[#0a1628] border border-[#c9a227]/50 rounded-lg p-4 mb-6 text-left">
            <p className="text-[#c9a227] font-semibold mb-2">Your Login Credentials:</p>
            <p className="text-gray-300 text-sm">
              <span className="text-gray-400">Email:</span>{" "}
              <span className="font-mono text-white">{sessionStatus.loginEmail}</span>
            </p>
            <p className="text-gray-300 text-sm mt-1">
              <span className="text-gray-400">Temporary Password:</span>{" "}
              <span className="font-mono text-white">{sessionStatus.tempPassword}</span>
            </p>
            <p className="text-yellow-400 text-xs mt-3">
              ⚠️ Please save these credentials and change your password after first login.
            </p>
          </div>
        )}

        {!sessionStatus.tempPassword && sessionStatus.loginEmail && (
          <div className="bg-[#0a1628] border border-[#c9a227]/50 rounded-lg p-4 mb-6 text-left">
            <p className="text-gray-300 text-sm">
              Enrolled under: <span className="font-mono text-white">{sessionStatus.loginEmail}</span>
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Use your existing login credentials to access the course.
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login">
            <a className="inline-block bg-[#c9a227] text-black font-semibold px-6 py-3 rounded-lg hover:bg-[#d4af37] transition">
              Sign In & Start Learning
            </a>
          </Link>
          <Link href="/course">
            <a className="inline-block bg-transparent border border-[#c9a227] text-[#c9a227] font-semibold px-6 py-3 rounded-lg hover:bg-[#c9a227]/10 transition">
              Browse More Courses
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
