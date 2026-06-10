// UserManagementTabContent.tsx
"use client";
import React, { useState } from "react";
import { MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetAllQuery } from "@/redux/api/userApi";

export function UserManagementTabContent() {
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, error, refetch } = useGetAllQuery({
    path: "auth/users",
    page,
    limit,
    sort: "-createdAt",
  });

  const users = data?.data || [];
  const pagination = data?.pagination || data?.meta || {};

  const total = pagination.total || 0;
  const totalPages = pagination.totalPages || 1;
  const hasNext = pagination.hasNext || page < totalPages;
  const hasPrevious = pagination.hasPrevious || page > 1;

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="flex items-center justify-between">
        <div>
          <h3
            className="font-display text-lg font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            All Users
          </h3>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {data?.meta?.pagination?.total || 0} total users
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="p-2 hover:bg-white/10 rounded-md transition-colors"
          title="Refresh"
        >
          ↻
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="card p-6 text-center text-red-400 border border-red-500/30 rounded-[5px]">
          Failed to load users. Please try again.
        </div>
      )}

      <div className="card rounded-[5px] overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500"></div>
            </div>
          ) : (
            <table className="w-full text-sm font-body">
              <thead>
                <tr
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  {["Name", "Email", "Role", "Status", "Joined", "Actions"].map(
                    (h, i) => (
                      <th
                        key={i}
                        className="text-left py-3 px-4 text-xs font-semibold"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center text-gray-400">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user: any) => {
                    const fullName =
                      [user.firstName, user.lastName]
                        .filter(Boolean)
                        .join(" ") ||
                      user.displayName ||
                      "Unnamed User";

                    return (
                      <tr
                        key={user.id || user._id}
                        className="hover:opacity-80 transition-opacity"
                        style={{ borderBottom: "1px solid var(--border)" }}
                      >
                        {/* Name Column */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white overflow-hidden"
                              style={{ backgroundColor: "var(--emerald)" }}
                            >
                              {user.avatarUrl ? (
                                <img
                                  src={user.avatarUrl}
                                  alt={fullName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                fullName
                                  .split(" ")
                                  .map((n: string) => n[0]?.toUpperCase())
                                  .join("")
                                  .slice(0, 2)
                              )}
                            </div>
                            <div>
                              <span
                                className="font-semibold block"
                                style={{ color: "var(--text-primary)" }}
                              >
                                {fullName}
                              </span>
                              {user.username && (
                                <span
                                  className="text-xs"
                                  style={{ color: "var(--text-muted)" }}
                                >
                                  @{user.username}
                                </span>
                              )}
                            </div>
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
                            className="badge text-[10px] px-2 py-0.5 capitalize"
                            style={{
                              backgroundColor: "var(--bg-surface)",
                              color: "var(--text-primary)",
                              border: "1px solid var(--border)",
                            }}
                          >
                            {user.role}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className="badge text-[10px] px-2 py-0.5"
                            style={{
                              backgroundColor:
                                user.status === "active" || user.emailVerifiedAt
                                  ? "var(--emerald-light)"
                                  : "var(--coral-light)",
                              color:
                                user.status === "active" || user.emailVerifiedAt
                                  ? "var(--emerald)"
                                  : "var(--coral)",
                            }}
                          >
                            ●{" "}
                            {user.status === "pending_verification"
                              ? "Pending"
                              : user.status || "Inactive"}
                          </span>
                        </td>

                        <td
                          className="py-3 px-4 text-xs"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>

                        <td className="py-3 px-4">
                          <button style={{ color: "var(--text-muted)" }}>
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div
            className="flex items-center justify-between border-t px-4 py-3"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="text-sm text-gray-400">
              Showing {(page - 1) * limit + 1} to{" "}
              {Math.min(page * limit, total)} of {total} users
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!hasPrevious}
                className="flex items-center gap-1 px-3 py-1.5 rounded-[5px] text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
                style={{ color: "var(--text-muted)" }}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              <div
                className="px-4 py-1.5 text-sm font-medium"
                style={{ color: "var(--text-primary)" }}
              >
                Page {page} of {totalPages}
              </div>

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasNext}
                className="flex items-center gap-1 px-3 py-1.5 rounded-[5px] text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
                style={{ color: "var(--text-muted)" }}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
