import { authClient } from "@/lib/auth/authClient";
import type { TrackingPayload, TrackingSaveResult } from "./trackingTypes";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:5000";

async function save(
  path: string,
  payload: TrackingPayload,
): Promise<TrackingSaveResult> {
  const token = authClient.getStoredTokens()?.accessToken;
  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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

export const trackingClient = {
  saveSymptoms: (payload: TrackingPayload) =>
    save("/api/tracking/symptoms", payload),
  saveMood: (payload: TrackingPayload) => save("/api/tracking/mood", payload),
  saveSleep: (payload: TrackingPayload) => save("/api/tracking/sleep", payload),
  saveEnergy: (payload: TrackingPayload) =>
    save("/api/tracking/energy", payload),
  saveLifestyle: (payload: TrackingPayload) =>
    save("/api/tracking/lifestyle", payload),
};
