"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { usePostMutation } from "@/redux/api/userApi";
import { setCredentials } from "@/redux/features/authSlice";

export function Login() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loginApi, { isLoading }] = usePostMutation();

  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    try {
      const response = await loginApi({
        path: "auth/login",
        body: { email, password },
      }).unwrap();

      if (response && response.data) {
        const { user, token } = response.data;
        dispatch(setCredentials({ user, token }));

        // Redirect based on role
        if (user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        setErrorMsg("Failed to authenticate. No data returned.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setErrorMsg(
        err?.data?.message || err?.message || "Invalid email or password."
      );
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
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
          <Link href={"/"}
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
          </Link>
          <h1
            className="font-display text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            PrimeIQ Intelligence
          </h1>
          <p
            className="text-sm font-body mt-1"
            style={{ color: "var(--text-muted)" }}
          >
            Sign in to your account
          </p>
        </div>

        {/* Card */}
        <form onSubmit={handleSubmit} className="card rounded-[5px] p-8 space-y-5">
          {/* Error Message */}
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
              required
              disabled={isLoading}
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
                required
                disabled={isLoading}
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
              href="/forgot-password"
              className="text-xs font-body hover:underline"
              style={{ color: "var(--emerald)" }}
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-[5px] text-white font-body font-semibold text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2"
            style={{ backgroundColor: "var(--emerald)" }}
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? "Signing In..." : "Sign In"}
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
        </form>
      </div>
    </div>
  );
}
