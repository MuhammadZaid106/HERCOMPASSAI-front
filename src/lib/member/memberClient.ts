import { authClient } from "@/lib/auth/authClient";
import type { ApiResult, MemberDashboardData, MemberProgressData, TrackingRange } from "./memberTypes";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

async function request<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  const token = authClient.getStoredTokens()?.accessToken;
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });
  return (await response.json().catch(() => ({ success: false, message: "Network error" }))) as ApiResult<T>;
}

export const memberClient = {
  getDashboard(): Promise<ApiResult<MemberDashboardData>> {
    return request<MemberDashboardData>("/api/member/dashboard");
  },
  getProgress(range: TrackingRange): Promise<ApiResult<MemberProgressData>> {
    return request<MemberProgressData>(`/api/member/progress?range=${range}`);
  },
};