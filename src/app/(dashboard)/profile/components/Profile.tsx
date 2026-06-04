"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Shield, CreditCard, CheckCircle2, User } from "lucide-react";
import { NotificationsSection } from "./NotificationsSection";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { usePostMutation, usePutMutation } from "@/redux/api/userApi";
import { updateUser } from "@/redux/features/authSlice";
import { Skeleton } from "@/components/ui/Skeleton";
import Cookies from "js-cookie";

export function Profile() {
  const { theme, setTheme } = useTheme();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const [changePasswordApi, { isLoading: isSubmitting }] = usePostMutation();
  const [updateProfileApi, { isLoading: isUpdating }] = usePutMutation();

  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState<string>("");
  const [profileSubmitError, setProfileSubmitError] = useState<string>("");

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loadedProfile, setLoadedProfile] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    username?: string;
    bio?: string;
    avatarUrl?: string;
  } | null>(null);

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

  const userInitials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || user?.email?.[0]?.toUpperCase() || "JD";
  const userFullName = `${firstName || user?.firstName || "John"} ${lastName || user?.lastName || "Doe"}`;
  const userEmail = email || user?.email || "john@example.com";
  const userRole = user?.role === "admin" ? "Admin" : "Pro Plan";

  useEffect(() => {
    const loadProfile = async () => {
      setProfileLoading(true);
      setProfileError(null);
      setProfileSuccess("");
      setProfileSubmitError("");

      try {
        const token = Cookies.get("token");
        const response = await fetch("/api/auth/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          credentials: "include",
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(errorText || "Failed to load profile.");
        }

        const json = await response.json();
        const profileData = json.data || json;

        setFirstName(profileData.firstName || "");
        setLastName(profileData.lastName || "");
        setEmail(profileData.email || "");
        setUsername(profileData.username || "");
        setBio(profileData.bio || "");
        setAvatarUrl(profileData.avatarUrl || "");
        setLoadedProfile({
          firstName: profileData.firstName || "",
          lastName: profileData.lastName || "",
          email: profileData.email || "",
          username: profileData.username || "",
          bio: profileData.bio || "",
          avatarUrl: profileData.avatarUrl || "",
        });
        dispatch(updateUser({
          ...user,
          firstName: profileData.firstName || user?.firstName || "",
          lastName: profileData.lastName || user?.lastName || "",
          username: profileData.username || user?.username || "",
          email: profileData.email || user?.email || "",
          avatarUrl: profileData.avatarUrl || user?.avatarUrl,
        } as any));
      } catch (error: any) {
        console.error("Profile load failed:", error);
        setProfileError(error?.message || "Unable to fetch your profile.");
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, [dispatch, user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess("");
    setProfileSubmitError("");

    if (!firstName.trim() || !lastName.trim()) {
      setProfileSubmitError("Please enter your first and last name.");
      return;
    }

    try {
      const updated = await updateProfileApi({
        path: "auth/update-profile",
        body: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          username: username.trim() || undefined,
          bio: bio.trim() || undefined,
          avatarUrl: avatarUrl.trim() || undefined,
        },
      }).unwrap();

      dispatch(updateUser(updated));
      setProfileSuccess("Profile updated successfully.");
    } catch (error: any) {
      console.error("Update profile failed:", error);
      setProfileSubmitError(
        error?.data?.message || error?.message || "Failed to update profile.",
      );
    }
  };

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

      <div className="card rounded-[5px] p-5 space-y-4">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4" style={{ color: "var(--emerald)" }} />
          <h3
            className="font-display text-sm font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Account Details
          </h3>
        </div>
        <div className="gold-divider opacity-50" />

        {profileLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 rounded-[5px]" />
            <Skeleton className="h-10 rounded-[5px]" />
            <Skeleton className="h-10 rounded-[5px]" />
          </div>
        ) : profileError ? (
          <div
            className="p-4 rounded-[5px] text-sm"
            style={{
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              color: "#f87171",
            }}
          >
            {profileError}
          </div>
        ) : (
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            {profileSubmitError && (
              <div
                className="p-3 text-xs rounded-[5px] font-body font-medium border"
                style={{
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  borderColor: "rgba(239, 68, 68, 0.2)",
                  color: "#f87171",
                }}
              >
                {profileSubmitError}
              </div>
            )}

            {profileSuccess && (
              <div
                className="p-3 text-xs rounded-[5px] font-body font-medium border flex items-start gap-2"
                style={{
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  borderColor: "rgba(16, 185, 129, 0.2)",
                  color: "#34d399",
                }}
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{profileSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-body font-medium" style={{ color: "var(--text-secondary)" }}>
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First Name"
                  required
                  className="w-full px-4 py-2.5 rounded-[5px] border text-sm font-body outline-none"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    borderColor: "var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-body font-medium" style={{ color: "var(--text-secondary)" }}>
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last Name"
                  required
                  className="w-full px-4 py-2.5 rounded-[5px] border text-sm font-body outline-none"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    borderColor: "var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-body font-medium" style={{ color: "var(--text-secondary)" }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                readOnly
                disabled
                className="w-full px-4 py-2.5 rounded-[5px] border text-sm font-body outline-none bg-gray-100/80"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text-secondary)",
                }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-body font-medium" style={{ color: "var(--text-secondary)" }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full px-4 py-2.5 rounded-[5px] border text-sm font-body outline-none"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-body font-medium" style={{ color: "var(--text-secondary)" }}>
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us a bit about yourself"
                rows={3}
                className="w-full px-4 py-2.5 rounded-[5px] border text-sm font-body outline-none resize-none"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-body font-medium" style={{ color: "var(--text-secondary)" }}>
                Avatar URL
              </label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="w-full px-4 py-2.5 rounded-[5px] border text-sm font-body outline-none"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            <div className="flex flex-col md:flex-row gap-3 mt-4">
              {isUpdating ? (
                <Skeleton className="flex-1 h-10 rounded-[5px]" />
              ) : (
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-[5px] text-white font-body font-semibold text-sm transition-all hover:opacity-90"
                  style={{ backgroundColor: "var(--emerald)" }}
                >
                  Save changes
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setFirstName(loadedProfile?.firstName || user?.firstName || "");
                  setLastName(loadedProfile?.lastName || user?.lastName || "");
                  setEmail(loadedProfile?.email || user?.email || "");
                  setUsername(loadedProfile?.username || user?.username || "");
                  setBio(loadedProfile?.bio || "");
                  setAvatarUrl(loadedProfile?.avatarUrl || "");
                  setProfileSubmitError("");
                  setProfileSuccess("");
                }}
                className="flex-1 py-2 rounded-[5px] border font-body text-sm hover:bg-white/5 transition-all"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
              >
                Reset
              </button>
            </div>
          </form>
        )}
      </div>

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
              {isSubmitting ? (
                <Skeleton className="flex-1 h-10 rounded-[5px]" />
              ) : (
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-[5px] text-white font-body font-semibold text-sm transition-all hover:opacity-90"
                  style={{ backgroundColor: "var(--emerald)" }}
                >
                  Update Password
                </button>
              )}
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
