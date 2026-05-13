"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export function Login() {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "var(--bg)" }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-5"
          style={{ backgroundColor: "var(--emerald)", filter: "blur(80px)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full opacity-5"
          style={{ backgroundColor: "var(--gold)", filter: "blur(60px)" }}
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
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background:
                  "radial-gradient(circle at 30% 30%, white, transparent)",
              }}
            />
          </div>
          <h1
            className="font-display text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            PropEdge Intelligence
          </h1>
          <p
            className="text-sm font-body mt-1"
            style={{ color: "var(--text-muted)" }}
          >
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <div className="card rounded-[5px] p-8 space-y-5">
          {/* Google OAuth */}
          <button
            className="w-full flex items-center justify-center gap-3 py-3 rounded-[5px] border text-sm font-body font-medium transition-all hover:opacity-80"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-primary)",
              backgroundColor: "var(--bg-surface)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
                fill="#4285F4"
              />
              <path
                d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
                fill="#34A853"
              />
              <path
                d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
                fill="#FBBC05"
              />
              <path
                d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3">
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: "var(--border)" }}
            />
            <span
              className="text-xs font-body"
              style={{ color: "var(--text-muted)" }}
            >
              or
            </span>
            <div
              className="flex-1 h-px"
              style={{ backgroundColor: "var(--border)" }}
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label
              className="text-sm font-body font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-[5px] border text-sm font-body outline-none transition-colors"
              style={{
                backgroundColor: "var(--bg-surface)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label
              className="text-sm font-body font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-11 rounded-[5px] border text-sm font-body outline-none transition-colors"
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

          <div className="flex justify-end">
            <Link
              href="#"
              className="text-xs font-body hover:underline"
              style={{ color: "var(--emerald)" }}
            >
              Forgot password?
            </Link>
          </div>

          <button
            className="w-full py-3 rounded-[5px] text-white font-body font-semibold text-sm transition-all hover:opacity-90"
            style={{ backgroundColor: "var(--emerald)" }}
          >
            Sign In
          </button>

          <p
            className="text-center text-sm font-body"
            style={{ color: "var(--text-muted)" }}
          >
            No account?{" "}
            <Link
              href="/register"
              className="font-semibold hover:underline"
              style={{ color: "var(--emerald)" }}
            >
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
