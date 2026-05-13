"use client";
import { User } from "lucide-react";

export function AccountDetailsSection() {
  const fields = ["Full Name", "Email", "Username"];
  const data: Record<string, string> = {
    "Full Name": "John Doe",
    Email: "john@example.com",
    Username: "@johndoe",
  };

  return (
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
      <div className="space-y-3">
        {fields.map((f, i) => (
          <div key={i} className="flex items-center justify-between">
            <span
              className="text-sm font-body"
              style={{ color: "var(--text-muted)" }}
            >
              {f}
            </span>
            <span
              className="text-sm font-body font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {data[f]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
