import "server-only";

import { ApiError } from "@/server/api";

type QueryValue = string | number | boolean | null | undefined;

export async function moneyline(path: string, query: Record<string, QueryValue> = {}) {
  const baseUrl = process.env.MONEYLINE_BASE_URL ?? "https://mlapi.bet/v1";
  const url = new URL(path.replace(/^\//, ""), `${baseUrl.replace(/\/$/, "")}/`);
  for (const [key, value] of Object.entries(query)) {
    if (value !== null && value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    Number(process.env.MONEYLINE_TIMEOUT_MS) || 15_000,
  );
  try {
    const apiKey = process.env.MONEYLINE_API_KEY;
    const response = await fetch(url, {
      headers: apiKey ? { "x-api-key": apiKey, Authorization: `Bearer ${apiKey}` } : undefined,
      signal: controller.signal,
      next: { revalidate: 30 },
    });
    const payload = (await response.json()) as unknown;
    if (!response.ok) {
      throw new ApiError(502, "Sports data provider request failed", "UPSTREAM_ERROR", payload);
    }
    if (payload && typeof payload === "object" && "data" in payload) {
      return (payload as { data: unknown }).data;
    }
    return payload;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(502, "Sports data provider is unavailable", "UPSTREAM_UNAVAILABLE");
  } finally {
    clearTimeout(timeout);
  }
}

export function searchQuery(searchParams: URLSearchParams) {
  return Object.fromEntries(searchParams.entries());
}
