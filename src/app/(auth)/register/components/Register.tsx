"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGetAllQuery, usePostMutation } from "@/redux/api/userApi";
import { RegisterHeader } from "./RegisterHeader";
import { UserInfoForm } from "./UserInfoForm";
import { PlanSelection } from "./PlanSelection";

interface Pricing {
  id: string;
  title: string;
  price: number;
  currency: string;
  billingInterval: string;
  description?: string;
  trialDays?: number;
}

export function Register() {
  const { data: pricingResponse, isLoading: pricingLoading } = useGetAllQuery({
    path: "pricing",
  });
  const pricings: Pricing[] =
    pricingResponse?.data?.filter((p: any) => p.isActive) || [];

  const router = useRouter();
  const [registerApi, { isLoading: registerLoading }] = usePostMutation();
  const [createCheckoutApi, { isLoading: checkoutLoading }] = usePostMutation();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [showPass, setShowPass] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Auto-select first paid plan
  useEffect(() => {
    if (pricings.length > 0 && !selectedPlanId) {
      setSelectedPlanId(pricings[0].id);
    }
  }, [pricings, selectedPlanId]);

  const selectedPlan = pricings.find((p) => p.id === selectedPlanId);
  const isPaidPlan = selectedPlan ? selectedPlan.price > 0 : false;

  const handleRegister = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !selectedPlanId
    ) {
      setErrorMsg("Please fill all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }
    if (
      password.length < 8 ||
      !/^(?=.*[a-z])/.test(password) ||
      !/^(?=.*[A-Z])/.test(password) ||
      !/^(?=.*\d)/.test(password)
    ) {
      setErrorMsg("Password must meet all requirements.");
      return;
    }

    try {
      const isFreePlan = selectedPlanId === "free";

      // ALWAYS use FormData (safer with multer + avatar handling)
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("confirmPassword", confirmPassword);
      formData.append("role", "user");

      // Only append avatar if user selected one
      if (avatar) {
        formData.append("avatar", avatar);
      }

      // 1. Register user
      await registerApi({
        path: "auth/register",
        body: formData,
        formData: true,
      }).unwrap();

      setSuccessMsg("Account created successfully!");

      // 2. Paid plan → redirect to Stripe
      if (!isFreePlan && selectedPlanId) {
        const checkoutRes = await createCheckoutApi({
          path: "subscription/checkout",
          body: { pricingId: selectedPlanId },
        }).unwrap();

        if (checkoutRes?.data) {
          router.push(checkoutRes?.data?.url);
          // window.location.href = checkoutRes.url;
          return;
        }
      }

      // Free plan success
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      console.error("Register error:", err);
      setErrorMsg(
        err?.data?.message ||
          err?.message ||
          "Registration failed. Please try again.",
      );
    }
  };
  if (pricingLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading plans...
      </div>
    );

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
        <RegisterHeader />

        {step === 1 ? (
          <UserInfoForm
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            avatar={avatar}
            setAvatar={setAvatar}
            avatarPreview={avatarPreview}
            setAvatarPreview={setAvatarPreview}
            showPass={showPass}
            setShowPass={setShowPass}
            errorMsg={errorMsg}
            setErrorMsg={setErrorMsg}
            onNext={() => setStep(2)}
          />
        ) : (
          <PlanSelection
            pricings={pricings}
            selectedPlanId={selectedPlanId}
            setSelectedPlanId={setSelectedPlanId}
            errorMsg={errorMsg}
            successMsg={successMsg}
            isSubmitting={registerLoading || checkoutLoading}
            onSubmit={handleRegister}
            onBack={() => setStep(1)}
            selectedPlan={selectedPlan}
          />
        )}

        <p
          className="text-center text-sm font-body mt-6"
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
      </div>
    </div>
  );
}
