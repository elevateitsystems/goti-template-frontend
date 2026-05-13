"use client";
import { Search, MoreHorizontal } from "lucide-react";

interface UserManagementTabContentProps {
  search: string;
  setSearch: (v: string) => void;
  users: any[];
}

export function UserManagementTabContent({
  search,
  setSearch,
  users,
}: UserManagementTabContentProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
            style={{ color: "var(--text-muted)" }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-9 pr-4 py-2.5 rounded-[5px] border text-sm font-body outline-none"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border)",
              color: "var(--text-primary)",
            }}
          />
        </div>
        <span
          className="text-sm font-body"
          style={{ color: "var(--text-muted)" }}
        >
          {users.length} users
        </span>
      </div>
      <div className="card rounded-[5px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm font-body">
            <thead>
              <tr
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                {[
                  "Name",
                  "Email",
                  "Plan",
                  "Status",
                  "Joined",
                  "Revenue",
                  "",
                ].map((h, i) => (
                  <th
                    key={i}
                    className="text-left py-3 px-4 text-xs font-semibold"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:opacity-80 transition-opacity"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: "var(--emerald)" }}
                      >
                        {user.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </div>
                      <span
                        className="font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td
                    className="py-3 px-4"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {user.email}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className="badge text-[10px] px-2"
                      style={{
                        backgroundColor:
                          user.plan === "Institutional"
                            ? "var(--intel-blue-light)"
                            : user.plan === "Pro"
                              ? "var(--gold-light)"
                              : "var(--bg-surface)",
                        color:
                          user.plan === "Institutional"
                            ? "var(--intel-blue)"
                            : user.plan === "Pro"
                              ? "var(--gold)"
                              : "var(--text-muted)",
                        border: `1px solid ${user.plan === "Institutional" ? "var(--intel-blue)" : user.plan === "Pro" ? "var(--gold)" : "var(--border)"}`,
                      }}
                    >
                      {user.plan}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className="badge text-[10px] px-2"
                      style={{
                        backgroundColor:
                          user.status === "Active"
                            ? "var(--emerald-light)"
                            : "var(--coral-light)",
                        color:
                          user.status === "Active"
                            ? "var(--emerald)"
                            : "var(--coral)",
                      }}
                    >
                      ● {user.status}
                    </span>
                  </td>
                  <td
                    className="py-3 px-4 text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {user.joined}
                  </td>
                  <td
                    className="py-3 px-4 font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {user.revenue}
                  </td>
                  <td className="py-3 px-4">
                    <button style={{ color: "var(--text-muted)" }}>
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
