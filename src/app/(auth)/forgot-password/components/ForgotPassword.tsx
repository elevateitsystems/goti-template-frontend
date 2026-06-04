"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePostMutation } from "@/redux/api/userApi";
import { ButtonSkeleton } from "@/components/ui/Skeleton";

type Step = "request" | "verify" | "reset";

export function ForgotPassword() {
  const router = useRouter();
  const [forgotPasswordApi, { isLoading: isRequesting }] = usePostMutation();
  const [verifyOTPApi, { isLoading: isVerifying }] = usePostMutation();
  const [resetPasswordApi, { isLoading: isResetting }] = usePostMutation();

  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email) {
      setErrorMsg("Please enter your email address.");
      return;
    }

    try {
      await forgotPasswordApi({
        path: "auth/forgot-password",
        body: { email },
      }).unwrap();

      setSuccessMsg("We sent a password reset OTP code to your email.");
      setStep("verify");
    } catch (err: any) {
      console.error("Forgot password request error:", err);
      setErrorMsg(
        err?.data?.message || err?.message || "Something went wrong. Please check your email."
      );
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!code) {
      setErrorMsg("Please enter the verification code.");
      return;
    }

    try {
      await verifyOTPApi({
        path: "auth/verify-reset-password-OTP",
        body: { email, code: code.trim() },
      }).unwrap();

      setSuccessMsg("OTP verified successfully. Please enter your new password.");
      setStep("reset");
    } catch (err: any) {
      console.error("OTP verification error:", err);
      setErrorMsg(
        err?.data?.message || err?.message || "Invalid or expired OTP code."
      );
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!newPassword || !confirmNewPassword) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    try {
      await resetPasswordApi({
        path: "auth/reset-password",
        body: { email, newPassword },
      }).unwrap();

      setSuccessMsg("Password reset successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      console.error("Reset password error:", err);
      setErrorMsg(
        err?.data?.message || err?.message || "Failed to reset password."
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
          className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full opacity-5"
          style={{ backgroundColor: "var(--gold)", filter: "blur(80px)" }}
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
            Reset Password
          </h1>
          <p
            className="text-sm font-body mt-1 text-center"
            style={{ color: "var(--text-muted)" }}
          >
            {step === "request" && "Enter your email to receive a recovery code"}
            {step === "verify" && "Enter the verification code sent to your email"}
            {step === "reset" && "Choose a new strong password for your account"}
          </p>
        </div>

        <div className="card rounded-[5px] p-8 space-y-5">
          {/* Feedback Messages */}
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

          {/* STEP 1: REQUEST */}
          {step === "request" && (
            <form onSubmit={handleRequestOTP} className="space-y-4">
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
                  disabled={isRequesting}
                  className="w-full px-4 py-3 rounded-[5px] border text-sm font-body outline-none"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    borderColor: "var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
              {isRequesting ? (
                <ButtonSkeleton className="w-full" />
              ) : (
                <button
                  type="submit"
                  className="w-full py-3 rounded-[5px] text-white font-body font-semibold text-sm transition-all hover:opacity-90"
                  style={{ backgroundColor: "var(--emerald)" }}
                >
                  Send Reset Code
                </button>
              )}
            </form>
          )}

          {/* STEP 2: VERIFY */}
          {step === "verify" && (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  className="text-sm font-body font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  OTP Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  required
                  disabled={isVerifying}
                  className="w-full px-4 py-3 rounded-[5px] border text-sm font-body outline-none tracking-[0.25em] text-center font-bold"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    borderColor: "var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
              {isVerifying ? (
                <ButtonSkeleton className="w-full" />
              ) : (
                <button
                  type="submit"
                  className="w-full py-3 rounded-[5px] text-white font-body font-semibold text-sm transition-all hover:opacity-90"
                  style={{ backgroundColor: "var(--emerald)" }}
                >
                  Verify Code
                </button>
              )}
            </form>
          )}

          {/* STEP 3: RESET */}
          {step === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  className="text-sm font-body font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    disabled={isResetting}
                    className="w-full px-4 py-3 pr-11 rounded-[5px] border text-sm font-body outline-none"
                    style={{
                      backgroundColor: "var(--bg-surface)",
                      borderColor: "var(--border)",
                      color: "var(--text-primary)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {showPass ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  className="text-sm font-body font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Confirm Password
                </label>
                <input
                  type={showPass ? "text" : "password"}
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isResetting}
                  className="w-full px-4 py-3 rounded-[5px] border text-sm font-body outline-none"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    borderColor: "var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              {isResetting ? (
                <ButtonSkeleton className="w-full" />
              ) : (
                <button
                  type="submit"
                  className="w-full py-3 rounded-[5px] text-white font-body font-semibold text-sm transition-all hover:opacity-90"
                  style={{ backgroundColor: "var(--emerald)" }}
                >
                  Reset Password
                </button>
              )}
            </form>
          )}

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
        </div>
      </div>
    </div>
  );
}
