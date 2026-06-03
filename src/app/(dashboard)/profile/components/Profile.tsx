"use client";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Shield, CreditCard, Loader2, CheckCircle2 } from "lucide-react";
import { AccountDetailsSection } from "./AccountDetailsSection";
import { NotificationsSection } from "./NotificationsSection";
import { useAppSelector } from "@/redux/hooks";
import { usePostMutation } from "@/redux/api/userApi";

export function Profile() {
  const { theme, setTheme } = useTheme();
  const { user } = useAppSelector((state) => state.auth);
  const [changePasswordApi, { isLoading: isSubmitting }] = usePostMutation();

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    evAlerts: true,
    steamAlerts: true,
  });

  // Change Password state
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMsg("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    try {
      await changePasswordApi({
        path: "auth/change-password",
        body: { currentPassword, newPassword, confirmNewPassword },
      }).unwrap();

      setSuccessMsg("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setTimeout(() => {
        setShowChangePassword(false);
        setSuccessMsg("");
      }, 1500);
    } catch (err: any) {
      console.error("Change password error:", err);
      setErrorMsg(
        err?.data?.message || err?.message || "Failed to change password. Make sure current password is correct."
      );
    }
  };

  const userInitials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || user.email[0].toUpperCase()
    : "JD";

  const userFullName = user ? `${user.firstName} ${user.lastName}` : "John Doe";
  const userEmail = user ? user.email : "john@example.com";
  const userRole = user?.role === "admin" ? "Admin" : "Pro Plan";

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-2xl mx-auto">
      <div>
        <h1
          className="font-display text-2xl md:text-3xl font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Profile
        </h1>
        <p
          className="text-sm font-body mt-0.5"
          style={{ color: "var(--text-muted)" }}
        >
          Manage your account settings
        </p>
      </div>

      {/* Profile Card */}
      <div className="card rounded-[5px] p-6">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold font-body"
            style={{ backgroundColor: "var(--emerald)" }}
          >
            {userInitials}
          </div>
          <div>
            <h2
              className="font-display text-xl font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {userFullName}
            </h2>
            <p
              className="text-sm font-body"
              style={{ color: "var(--text-muted)" }}
            >
              {userEmail}
            </p>
            <span
              className="mt-1 badge text-xs px-2 py-0.5"
              style={{
                backgroundColor: "var(--gold-light)",
                color: "var(--gold)",
                border: "1px solid var(--gold)",
              }}
            >
              {userRole}
            </span>
          </div>
        </div>
      </div>

      <AccountDetailsSection />

      {/* Appearance Section */}
      <div className="card rounded-[5px] p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Sun className="h-4 w-4" style={{ color: "var(--emerald)" }} />
          <h3
            className="font-display text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Appearance
          </h3>
        </div>
        <div className="gold-divider opacity-50" />
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-sm font-body font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Theme
            </p>
            <p
              className="text-xs font-body"
              style={{ color: "var(--text-muted)" }}
            >
              Currently {theme === "light" ? "Light" : "Dark"} mode
            </p>
          </div>
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="flex items-center gap-2 px-4 py-2 rounded-[5px] border text-sm font-body font-medium transition-all hover:opacity-80"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-primary)",
              backgroundColor: "var(--bg-surface)",
            }}
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
        </div>
      </div>

      <NotificationsSection
        notifications={notifications}
        setNotifications={setNotifications}
      />

      {/* Subscription Section */}
      <div className="card rounded-[5px] p-5 space-y-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4" style={{ color: "var(--emerald)" }} />
          <h3
            className="font-display text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Subscription
          </h3>
        </div>
        <div className="gold-divider opacity-50" />
        <div className="space-y-3">
          <div
            className="flex items-center justify-between p-3 rounded-[5px]"
            style={{
              backgroundColor: "var(--gold-light)",
              border: "1px solid var(--gold)",
            }}
          >
            <div>
              <p
                className="text-sm font-body font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Pro Plan
              </p>
              <p
                className="text-xs font-body"
                style={{ color: "var(--text-muted)" }}
              >
                $20/month · Renews Apr 12, 2026
              </p>
            </div>
            <span
              className="badge text-white text-[9px]"
              style={{ backgroundColor: "var(--gold)" }}
            >
              ACTIVE
            </span>
          </div>
          <button className="btn-outline text-sm w-full py-2">
            Manage Subscription
          </button>
        </div>
      </div>

      {/* Security Section */}
      <div className="card rounded-[5px] p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4" style={{ color: "var(--emerald)" }} />
          <h3
            className="font-display text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Security
          </h3>
        </div>
        <div className="gold-divider opacity-50" />
        
        {showChangePassword ? (
          <form onSubmit={handleChangePassword} className="space-y-4 mt-2">
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

            <div className="space-y-1.5">
              <label
                className="text-xs font-body font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 rounded-[5px] border text-sm font-body outline-none"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            <div className="space-y-1.5">
              <label
                className="text-xs font-body font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 rounded-[5px] border text-sm font-body outline-none"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            <div className="space-y-1.5">
              <label
                className="text-xs font-body font-medium"
                style={{ color: "var(--text-secondary)" }}
              >
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 rounded-[5px] border text-sm font-body outline-none"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            <div className="flex items-center gap-3 mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2 rounded-[5px] text-white font-body font-semibold text-sm transition-all hover:opacity-90 flex items-center justify-center gap-2"
                style={{ backgroundColor: "var(--emerald)" }}
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isSubmitting ? "Updating..." : "Update Password"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowChangePassword(false);
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                disabled={isSubmitting}
                className="flex-1 py-2 rounded-[5px] border font-body text-sm hover:bg-white/5 transition-all"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-2">
            <button
              onClick={() => setShowChangePassword(true)}
              className="btn-outline text-sm w-full py-2"
            >
              Change Password
            </button>
            <button className="btn-outline text-sm w-full py-2">
              Enable Two-Factor Auth
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
