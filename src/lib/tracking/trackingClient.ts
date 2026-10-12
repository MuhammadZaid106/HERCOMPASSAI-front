import { authClient } from "@/lib/auth/authClient";
import type { ApiResult } from "@/lib/member/memberTypes";
import type {
  TrackingEntryType,
  TrackingPayload,
  TrackingRange,
  TrackingSaveResult,
  TrackingSummaryData,
} from "./trackingTypes";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:5000";

async function save(
  path: string,
  payload: TrackingPayload,
): Promise<TrackingSaveResult> {
  const response = await authClient.authenticatedFetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return (await response
    .json()
    .catch(() => ({
      success: false,
      message: "Network error",
    }))) as TrackingSaveResult;
}

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiResult<T>> {
  try {
    const response = await authClient.authenticatedFetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
    return (await response.json().catch(() => ({
      success: false,
      message: "Network error",
    }))) as ApiResult<T>;
  } catch {
    return {
      success: false,
      message: "We couldn't reach HerCompass just now. Your information is safe.",
    };
  }
}

export const trackingClient = {
  saveSymptoms: (payload: TrackingPayload) =>
    save("/api/tracking/symptoms", payload),
  saveMood: (payload: TrackingPayload) => save("/api/tracking/mood", payload),
  saveSleep: (payload: TrackingPayload) => save("/api/tracking/sleep", payload),
  saveEnergy: (payload: TrackingPayload) =>
    save("/api/tracking/energy", payload),
  saveLifestyle: (payload: TrackingPayload) =>
    save("/api/tracking/lifestyle", payload),

  getSummary(range: TrackingRange = "7d"): Promise<ApiResult<TrackingSummaryData>> {
    return request<TrackingSummaryData>(`/api/tracking/summary?range=${range}`);
  },

  getEntry(
    type: TrackingEntryType,
    id: string,
  ): Promise<ApiResult<{ type: TrackingEntryType; entry: Record<string, unknown> }>> {
    return request(`/api/tracking/${type}/${id}`);
  },

  deleteEntry(
    type: TrackingEntryType,
    id: string,
  ): Promise<ApiResult<{ type: TrackingEntryType; id: string; entryDate: string | null }>> {
    return request(`/api/tracking/${type}/${id}`, { method: "DELETE" });
  },
};
