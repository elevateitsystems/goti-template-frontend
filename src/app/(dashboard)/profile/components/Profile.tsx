"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  User,
  Mail,
  Calendar,
  Shield,
  LogOut,
  Edit,
  Camera,
} from "lucide-react";
// import { logout, setUser } from "@/redux/features/authSlice"; // assuming you have setUser action
import {
  useGetAllQuery,
  usePatchMutation,
  usePostMutation,
} from "@/redux/api/userApi";
import { logout } from "@/redux/features/authSlice";

export default function ProfilePage() {
  const reduxUser = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // Fetch fresh profile data
  const { data: profileResponse, isLoading: profileLoading } = useGetAllQuery({
    path: "/auth/profile",
  });

  // Subscription remains separate
  const { data: subResponse, isLoading: subLoading } = useGetAllQuery({
    path: "/subscription/my-subscription",
  });

  const user = profileResponse?.data || reduxUser; // Prefer fresh API data

  // Update form when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      });
    }
  }, [user]);

  const [patchProfile, { isLoading: updatingProfile }] = usePatchMutation();
  const [postChangePassword, { isLoading: updatingPassword }] =
    usePostMutation();

  const subscription = subResponse?.data;
  const subscriptionStatus = subscription?.status || "free";
  const planName =
    subscription?.pricing?.title ||
    (subscriptionStatus === "active" ? "Pro Plan" : "Free Plan");

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSaveProfile = async () => {
    try {
      const result = await patchProfile({
        path: "/auth/update-profile",
        body: {
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
      }).unwrap();

      // Update Redux with fresh data if returned

      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err: any) {
      console.log({ err });
      // alert(
      //   err?.data?.error?.message ||
      //     err?.data?.message ||
      //     "Failed to update profile"
      // );
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    try {
      await postChangePassword({
        path: "/auth/change-password",
        body: {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
      }).unwrap();

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordChange(false);
      alert("Password changed successfully!");
    } catch (err: any) {
      alert(
        err?.data?.message ||
          "Failed to change password. Please check your current password.",
      );
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1
            className="font-display text-3xl font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            My Profile
          </h1>
          <p
            className="text-sm font-body mt-1"
            style={{ color: "var(--text-muted)" }}
          >
            Manage your account information
          </p>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-[5px] hover:bg-white/5 transition-colors border"
          style={{ borderColor: "var(--border)" }}
        >
          <Edit className="h-4 w-4" /> Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Card */}
        <div className="lg:col-span-1 h-fit">
          <div
            className="card rounded-[5px] p-6 border h-full"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex flex-col items-center text-center">
              {avatarPreview || user.avatarUrl ? (
                <div className="relative w-28 h-28">
                  <Image
                    src={avatarPreview || user.avatarUrl!}
                    alt="Profile"
                    fill
                    className="rounded-full object-cover border-4"
                    style={{ borderColor: "var(--emerald)" }}
                    sizes="112px"
                  />
                </div>
              ) : (
                <div
                  className="w-28 h-28 rounded-full flex items-center justify-center text-5xl font-bold text-white"
                  style={{ backgroundColor: "var(--emerald)" }}
                >
                  {`${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()}
                </div>
              )}

              <h2
                className="mt-5 text-2xl font-semibold font-display"
                style={{ color: "var(--text-primary)" }}
              >
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-sm text-gray-400 mt-1 font-body">
                {user.email}
              </p>

              <div
                className="mt-4 px-4 py-1.5 rounded-[5px] text-xs font-medium inline-block"
                style={{
                  backgroundColor: "var(--emerald-light)",
                  color: "var(--emerald)",
                }}
              >
                {user.role === "admin" ? "Administrator" : planName}
              </div>
            </div>

            <button
              onClick={() => dispatch(logout())}
              className="mt-8 w-full flex items-center justify-center gap-2 py-3 rounded-[5px] text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Information */}
          <div
            className="card rounded-[5px] p-6 border"
            style={{ borderColor: "var(--border)" }}
          >
            <h3
              className="font-display text-lg font-semibold mb-5"
              style={{ color: "var(--text-primary)" }}
            >
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="flex gap-3">
                <User
                  className="h-5 w-5 mt-0.5"
                  style={{ color: "var(--text-muted)" }}
                />
                <div>
                  <p className="text-gray-400 text-xs font-body">FULL NAME</p>
                  <p style={{ color: "var(--text-primary)" }}>
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Mail
                  className="h-5 w-5 mt-0.5"
                  style={{ color: "var(--text-muted)" }}
                />
                <div>
                  <p className="text-gray-400 text-xs font-body">
                    EMAIL ADDRESS
                  </p>
                  <p style={{ color: "var(--text-primary)" }}>{user.email}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Shield
                  className="h-5 w-5 mt-0.5"
                  style={{ color: "var(--text-muted)" }}
                />
                <div>
                  <p className="text-gray-400 text-xs font-body">ROLE</p>
                  <p
                    className="capitalize"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {user.role}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Calendar
                  className="h-5 w-5 mt-0.5"
                  style={{ color: "var(--text-muted)" }}
                />
                <div>
                  <p className="text-gray-400 text-xs font-body">
                    MEMBER SINCE
                  </p>
                  <p style={{ color: "var(--text-primary)" }}>
                    {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription */}
          <div
            className="card rounded-[5px] p-6 border"
            style={{ borderColor: "var(--border)" }}
          >
            <h3
              className="font-display text-lg font-semibold mb-5"
              style={{ color: "var(--text-primary)" }}
            >
              Subscription
            </h3>

            {subLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500" />
              </div>
            ) : subscription?.status === "active" ? (
              <div className="space-y-5">
                <div className="flex justify-between items-center p-5 rounded-[5px] bg-emerald-500/10 border border-emerald-500/30">
                  <div>
                    <p className="text-emerald-400 font-medium">Active Plan</p>
                    <p
                      className="text-2xl font-semibold mt-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {subscription.pricing?.title || "Pro Plan"}
                    </p>
                  </div>
                  <span className="px-4 py-1 text-xs font-bold rounded-[3px] bg-emerald-500/20 text-emerald-400">
                    ACTIVE
                  </span>
                </div>
                {subscription.currentPeriodEnd && (
                  <p className="text-sm">
                    <span className="text-gray-400">Next Renewal: </span>
                    <span className="font-medium">
                      {formatDate(subscription.currentPeriodEnd)}
                    </span>
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-400">
                <p>No active subscription • {planName}</p>
                <button
                  onClick={() => (window.location.href = "/#pricing")}
                  className="mt-6 px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-[5px] transition-colors w-full"
                >
                  Upgrade Plan
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div
            className="bg-[var(--bg-card)] rounded-[8px] w-full max-w-lg border"
            style={{ borderColor: "var(--border)" }}
          >
            <div
              className="p-6 border-b"
              style={{ borderColor: "var(--border)" }}
            >
              <h2 className="text-xl font-semibold">Edit Profile</h2>
            </div>

            <div className="p-6 space-y-6">
              {/* Avatar Preview (read-only for now) */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  {avatarPreview || user.avatarUrl ? (
                    <Image
                      src={avatarPreview || user.avatarUrl!}
                      alt="Avatar"
                      width={100}
                      height={100}
                      className="rounded-full object-cover border-4"
                      style={{ borderColor: "var(--emerald)" }}
                    />
                  ) : (
                    <div className="w-[100px] h-[100px] rounded-full bg-[var(--emerald)] flex items-center justify-center text-4xl text-white">
                      {user.firstName?.[0] || ""}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-[5px] bg-[var(--bg-surface)] border focus:outline-none"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-[5px] bg-[var(--bg-surface)] border focus:outline-none"
                    style={{ borderColor: "var(--border)" }}
                  />
                </div>
              </div>

              <button
                onClick={() => setShowPasswordChange(!showPasswordChange)}
                className="text-emerald-400 text-sm hover:underline"
              >
                {showPasswordChange
                  ? "Cancel Password Change"
                  : "Change Password"}
              </button>

              {showPasswordChange && (
                <div
                  className="space-y-4 pt-4 border-t"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div>
                    <label className="text-xs text-gray-400">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-[5px] bg-[var(--bg-surface)] border"
                      style={{ borderColor: "var(--border)" }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-[5px] bg-[var(--bg-surface)] border"
                      style={{ borderColor: "var(--border)" }}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-[5px] bg-[var(--bg-surface)] border"
                      style={{ borderColor: "var(--border)" }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div
              className="p-6 border-t flex gap-3"
              style={{ borderColor: "var(--border)" }}
            >
              <button
                onClick={() => {
                  setIsEditing(false);
                  setShowPasswordChange(false);
                }}
                className="flex-1 py-3 rounded-[5px] border hover:bg-white/5 transition-colors"
                style={{ borderColor: "var(--border)" }}
              >
                Cancel
              </button>
              <button
                onClick={
                  showPasswordChange ? handleChangePassword : handleSaveProfile
                }
                disabled={updatingProfile || updatingPassword}
                className="flex-1 py-3 rounded-[5px] text-white font-medium transition-colors"
                style={{ backgroundColor: "var(--emerald)" }}
              >
                {updatingProfile || updatingPassword
                  ? "Saving..."
                  : showPasswordChange
                    ? "Change Password"
                    : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
