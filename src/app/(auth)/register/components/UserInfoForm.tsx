import { Eye, EyeOff, User, Pencil, Check, X } from "lucide-react";

interface UserInfoFormProps {
  firstName: string;
  setFirstName: (v: string) => void;
  lastName: string;
  setLastName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  avatar: File | null;
  setAvatar: (f: File | null) => void;
  avatarPreview: string;
  setAvatarPreview: (s: string) => void;
  showPass: boolean;
  setShowPass: (b: boolean) => void;
  errorMsg: string;
  setErrorMsg: (s: string) => void;
  onNext: () => void;
}

export function UserInfoForm({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  avatar,
  setAvatar,
  avatarPreview,
  setAvatarPreview,
  showPass,
  setShowPass,
  errorMsg,
  setErrorMsg,
  onNext,
}: UserInfoFormProps) {
  const hasAvatar = !!avatar;
  const handleNext = () => {
    setErrorMsg("");
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setErrorMsg("Please fill all fields.");
      return;
    }
    onNext();
  };

  // Password requirements checker
  const passwordChecks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
  };

  const allRequirementsMet = Object.values(passwordChecks).every(Boolean);

  return (
    <div className="card rounded-[5px] p-8 space-y-5">
      {errorMsg && <ErrorMessage message={errorMsg} />}

      {/* Avatar - Now Required */}
      <div className="space-y-2">
        {/* <label
          className="text-sm font-body font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          Avatar <span className="text-red-500">*</span>
        </label> */}
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
                  alt="Preview"
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
              htmlFor="avatar"
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
              id="avatar"
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
        {!hasAvatar && (
          <p className="text-sm text-red-500 text-center">Avatar is required</p>
        )}
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-3">
        <InputField
          label="First Name"
          value={firstName}
          onChange={setFirstName}
          placeholder="John"
        />
        <InputField
          label="Last Name"
          value={lastName}
          onChange={setLastName}
          placeholder="Doe"
        />
      </div>

      <InputField
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        placeholder="you@example.com"
      />

      {/* Password Field with Live Guide */}
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
            className="w-full px-4 py-3 pr-11 rounded-[5px] border text-sm font-body"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderColor: "var(--border)",
              color: "var(--text-primary)",
            }}
            placeholder="••••••••"
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

        {/* Password Strength Guide */}
        {password && (
          <div
            className="mt-3 text-xs space-y-2 bg-[var(--bg-surface)] p-3 rounded-[5px] border"
            style={{ borderColor: "var(--border)" }}
          >
            <p className="font-medium text-[var(--text-secondary)] mb-2">
              Password requirements:
            </p>

            <PasswordCheck
              label="At least 8 characters"
              met={passwordChecks.length}
            />
            <PasswordCheck
              label="At least one lowercase letter (a-z)"
              met={passwordChecks.lowercase}
            />
            <PasswordCheck
              label="At least one uppercase letter (A-Z)"
              met={passwordChecks.uppercase}
            />
            <PasswordCheck
              label="At least one number (0-9)"
              met={passwordChecks.number}
            />

            {allRequirementsMet && (
              <p className="text-emerald-600 text-xs font-medium mt-2 flex items-center gap-1">
                <Check className="h-3 w-3" /> Strong password!
              </p>
            )}
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label
          className="text-sm font-body font-medium"
          style={{ color: "var(--text-secondary)" }}
        >
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={showPass ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-[5px] border text-sm font-body"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderColor: "var(--border)",
              color: "var(--text-primary)",
            }}
            placeholder="••••••••"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleNext}
        className="w-full py-3 rounded-[5px] text-white font-semibold text-sm hover:opacity-90 mt-2"
        style={{ backgroundColor: "var(--emerald)" }}
        disabled={!allRequirementsMet && password.length > 0}
      >
        Continue to Plan Selection
      </button>
    </div>
  );
}

/* Reusable Components */
function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: any) {
  return (
    <div className="space-y-1.5">
      <label
        className="text-sm font-body font-medium"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-[5px] border text-sm font-body"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border)",
          color: "var(--text-primary)",
        }}
      />
    </div>
  );
}

function PasswordCheck({ label, met }: { label: string; met: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {met ? (
        <Check className="h-3.5 w-3.5 text-emerald-600" />
      ) : (
        <X className="h-3.5 w-3.5 text-red-500" />
      )}
      <span
        style={{ color: met ? "var(--text-primary)" : "var(--text-muted)" }}
      >
        {label}
      </span>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div
      className="p-3 text-xs rounded-[5px] font-medium border"
      style={{
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderColor: "rgba(239, 68, 68, 0.2)",
        color: "#f87171",
      }}
    >
      {message}
    </div>
  );
}
