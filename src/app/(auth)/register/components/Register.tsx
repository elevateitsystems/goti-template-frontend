"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Check, User, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePostMutation } from "@/redux/api/userApi";
import { ButtonSkeleton } from "@/components/ui/Skeleton";

export function Register() {
  const router = useRouter();
  const [registerApi, { isLoading }] = usePostMutation();
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [plan, setPlan] = useState<"free" | "pro">("free");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    // Passwords must match backend criteria: min 8, one lowercase, one uppercase, one digit
    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }
    if (!/^(?=.*[a-z])/.test(password)) {
      setErrorMsg("Password must contain at least one lowercase letter.");
      return;
    }
    if (!/^(?=.*[A-Z])/.test(password)) {
      setErrorMsg("Password must contain at least one uppercase letter.");
      return;
    }
    if (!/^(?=.*\d)/.test(password)) {
      setErrorMsg("Password must contain at least one number.");
      return;
    }

    try {
      let requestBody: any;
      let isFormData = false;

      if (avatar) {
        const formData = new FormData();
        formData.append("firstName", firstName);
        formData.append("lastName", lastName);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("confirmPassword", confirmPassword);
        formData.append("role", "user");
        formData.append("avatar", avatar);
        requestBody = formData;
        isFormData = true;
      } else {
        requestBody = {
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
          role: "user",
        };
      }

      const response = await registerApi({
        path: "auth/register",
        body: requestBody,
        formData: isFormData,
      }).unwrap();

      setSuccessMsg("Registration successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      console.error("Register error:", err);
      setErrorMsg(
        err?.data?.message ||
          err?.message ||
          "Registration failed. Please try again.",
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
          className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full opacity-5"
          style={{ backgroundColor: "var(--gold)", filter: "blur(80px)" }}
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
          </Link>
          <h1
            className="font-display text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Create Your Account
          </h1>
          <p
            className="text-sm font-body mt-1"
            style={{ color: "var(--text-muted)" }}
          >
            Start getting an edge today
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="card rounded-[5px] p-8 space-y-5"
        >
          {/* Plan Selection */}
          <div className="grid grid-cols-2 gap-3">
            {(["free", "pro"] as const).map((p) => (
              <button
                type="button"
                key={p}
                onClick={() => setPlan(p)}
                className="p-3 rounded-[5px] border-2 text-left transition-all"
                style={{
                  borderColor:
                    plan === p
                      ? p === "pro"
                        ? "var(--gold)"
                        : "var(--emerald)"
                      : "var(--border)",
                  backgroundColor:
                    plan === p
                      ? p === "pro"
                        ? "var(--gold-light)"
                        : "var(--emerald-light)"
                      : "transparent",
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="text-sm font-body font-bold capitalize"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {p === "pro" ? "Pro" : "Free"}
                  </span>
                  {plan === p && (
                    <Check
                      className="h-4 w-4"
                      style={{
                        color: p === "pro" ? "var(--gold)" : "var(--emerald)",
                      }}
                    />
                  )}
                </div>
                <p
                  className="text-xs font-body"
                  style={{ color: "var(--text-muted)" }}
                >
                  {p === "free" ? "$0/mo" : "$20/mo — 7-day trial"}
                </p>
              </button>
            ))}
          </div>

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
              className="p-3 text-xs rounded-[5px] font-body font-medium border"
              style={{
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                borderColor: "rgba(16, 185, 129, 0.2)",
                color: "#34d399",
              }}
            >
              {successMsg}
            </div>
          )}

          {/* Avatar */}
          <div className="space-y-2">
            <label
              className="text-sm font-body font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Avatar
            </label>

            <div className="flex justify-center">
              <div className="relative">
                <div
                  className="w-24 h-24 rounded-full border-2 flex items-center justify-center overflow-hidden"
                  style={{
                    borderColor: "var(--border)",
                    backgroundColor: "var(--bg-surface)",
                  }}
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User
                      className="h-10 w-10"
                      style={{ color: "var(--text-muted)" }}
                    />
                  )}
                </div>

                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer border"
                  style={{
                    backgroundColor: "var(--emerald)",
                    borderColor: "var(--bg)",
                    color: "white",
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </label>

                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];

                    if (file) {
                      setAvatar(file);
                      setAvatarPreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label
                className="text-sm font-body font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                First Name
              </label>
              <input
                type="text"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
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
            <div className="space-y-1.5">
              <label
                className="text-sm font-body font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Last Name
              </label>
              <input
                type="text"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
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
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          <div
            className="mt-2 text-xs space-y-1"
            style={{ color: "var(--text-muted)" }}
          >
            <p>✓ Minimum 8 characters</p>
            <p>✓ At least one lowercase letter (a-z)</p>
            <p>✓ At least one uppercase letter (A-Z)</p>
            <p>✓ At least one number (0-9)</p>
          </div>

          {/* Confirm Password */}
          <div className="space-y-1.5">
            <label
              className="text-sm font-body font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              Confirm Password
            </label>
            <input
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

          {isLoading ? (
            <ButtonSkeleton className="w-full" />
          ) : (
            <button
              type="submit"
              className="w-full py-3 rounded-[5px] text-white font-body font-semibold text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: "var(--emerald)" }}
            >
              Create Account
            </button>
          )}

          <p
            className="text-center text-sm font-body"
            style={{ color: "var(--text-muted)" }}
          >
            Already have an account?{" "}
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
