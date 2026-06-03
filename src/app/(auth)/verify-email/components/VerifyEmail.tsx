"use client";
import { useState } from "react";
import Link from "next/link";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePostMutation } from "@/redux/api/userApi";

export function VerifyEmail() {
  const router = useRouter();
  const [verifyEmailApi, { isLoading }] = usePostMutation();
  const [resendEmailApi, { isLoading: isResending }] = usePostMutation();

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email || !code) {
      setErrorMsg("Please enter both your email and the 6-digit code.");
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      setErrorMsg("Verification code must be exactly 6 digits.");
      return;
    }

    try {
      await verifyEmailApi({
        path: "auth/verify-email",
        body: { email, code: code.trim() },
      }).unwrap();

      setSuccessMsg("Email verified successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      console.error("Verification error:", err);
      setErrorMsg(
        err?.data?.message || err?.message || "Invalid code or email address."
      );
    }
  };

  const handleResend = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!email) {
      setErrorMsg("Please enter your email to resend the code.");
      return;
    }

    try {
      await resendEmailApi({
        path: "auth/resend-email-verification",
        body: { email },
      }).unwrap();

      setSuccessMsg("A new verification code has been sent to your email.");
    } catch (err: any) {
      console.error("Resend error:", err);
      setErrorMsg(
        err?.data?.message || err?.message || "Failed to resend verification email."
      );
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{ backgroundColor: "var(--bg)" }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full opacity-5"
          style={{ backgroundColor: "var(--emerald)", filter: "blur(80px)" }}
        />
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-14 h-14 rounded-[5px] flex items-center justify-center mb-4 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, var(--emerald), #2F7D5B)",
            }}
          >
            <span className="text-white font-bold text-xl font-body z-10">
              PE
            </span>
          </div>
          <h1
            className="font-display text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Verify Your Email
          </h1>
          <p
            className="text-sm font-body mt-1 text-center"
            style={{ color: "var(--text-muted)" }}
          >
            Enter the 6-digit confirmation code sent to your inbox
          </p>
        </div>

        <form onSubmit={handleVerify} className="card rounded-[5px] p-8 space-y-5">
          {/* Messages */}
          {errorMsg && (
            <div
              className="p-3 text-xs rounded-[5px] font-body font-medium border"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                borderColor: "rgba(239, 68, 68, 0.2)",
                color: "#f87171",
              }}
            >
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div
              className="p-3 text-xs rounded-[5px] font-body font-medium border flex items-start gap-2"
              style={{
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                borderColor: "rgba(16, 185, 129, 0.2)",
                color: "#34d399",
              }}
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Email */}
          <div className="space-y-1.5">
            <label
              className="text-sm font-body font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={isLoading || isResending}
              className="w-full px-4 py-3 rounded-[5px] border text-sm font-body outline-none transition-colors"
              style={{
                backgroundColor: "var(--bg-surface)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          {/* Verification Code */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                className="text-sm font-body font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Verification Code
              </label>
              <button
                type="button"
                onClick={handleResend}
                disabled={isLoading || isResending}
                className="text-xs font-body hover:underline font-semibold"
                style={{ color: "var(--emerald)" }}
              >
                {isResending ? "Resending..." : "Resend Code"}
              </button>
            </div>
            <input
              type="text"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              required
              disabled={isLoading || isResending}
              className="w-full px-4 py-3 rounded-[5px] border text-sm font-body outline-none tracking-[0.25em] text-center font-bold"
              style={{
                backgroundColor: "var(--bg-surface)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || isResending}
            className="w-full py-3 rounded-[5px] text-white font-body font-semibold text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2"
            style={{ backgroundColor: "var(--emerald)" }}
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? "Verifying..." : "Verify & Continue"}
          </button>

          <p
            className="text-center text-sm font-body"
            style={{ color: "var(--text-muted)" }}
          >
            Back to{" "}
            <Link
              href="/login"
              className="font-semibold hover:underline"
              style={{ color: "var(--emerald)" }}
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
