import {
  buildAssessmentPayload,
} from "./onboardingClient";
import type { OnboardingFormValues, PersonalSnapshotData } from "./onboardingTypes";
import { AI_CONNECTION_MESSAGE, AI_UNREADABLE_RESPONSE_MESSAGE } from "../ai/aiErrors";

/**
 * One free, no-signup Personal Menopause Snapshot.
 *
 * This used to build a hardcoded Snapshot in the browser and set a localStorage
 * flag. That was not a Snapshot and not a limit: the content was the same for
 * everyone, it never came from the AI Gateway, and clearing storage reset the
 * "one free" allowance. It now posts the guest's real answers to the public
 * endpoint, which runs the same Gateway the member flow uses and enforces the
 * allowance server-side.
 *
 * The device id here is a convenience so the browser can be recognised on
 * return; it is never trusted on its own. The server combines it with the
 * request IP and a secret before deciding whether the allowance is spent.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

/** Storage keys shared with the wizard and the Snapshot page. */
export const GUEST_SNAPSHOT_STORAGE = {
  /** The real Snapshot returned by the API, rendered by the Snapshot page. */
  data: "hercompass_guest_snapshot_data",
  /** Set once the free Snapshot has been used, so the UI can prompt signup. */
  used: "hercompass_guest_snapshot_used",
  /** Signed handoff token that claims the guest account at signup. */
  claim: "hercompass_guest_claim_token",
  /** Persistent, per-browser id mixed into the server-side allowance key. */
  device: "hercompass_guest_device_id",
  /** The answers, kept so signup can carry them over. */
  assessment: "hercompass_guest_assessment",
};

export type GuestSnapshotReason =
  | "guest_limit_reached"
  | "ai_unavailable"
  | "network"
  | "invalid"
  | "used";

export interface GuestSnapshotRequestResult {
  ok: boolean;
  reason: GuestSnapshotReason | null;
  message: string;
  snapshot?: PersonalSnapshotData;
}

function deviceId(): string {
  if (typeof window === "undefined") return "server";
  try {
    let id = localStorage.getItem(GUEST_SNAPSHOT_STORAGE.device);
    if (!id) {
      id =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(GUEST_SNAPSHOT_STORAGE.device, id);
    }
    return id;
  } catch {
    // Private mode or blocked storage: fall back to a per-request id rather than
    // throwing. The server still applies its IP-based half of the key.
    return `ephemeral-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

export async function requestGuestSnapshot(
  values: OnboardingFormValues
): Promise<GuestSnapshotRequestResult> {
  if (
    typeof window !== "undefined" &&
    localStorage.getItem(GUEST_SNAPSHOT_STORAGE.used) === "true"
  ) {
    return {
      ok: false,
      reason: "used",
      message:
        "You've already used your free Snapshot on this device. Create a free account to keep your results and continue.",
    };
  }

  const payload = { ...buildAssessmentPayload(values), fingerprint: deviceId() };

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/public/snapshot`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    return { ok: false, reason: "network", message: AI_CONNECTION_MESSAGE };
  }

  const json = await res.json().catch(() => null);

  if (!res.ok || json?.success !== true || !json?.data?.snapshot) {
    const reasonField = json?.errors?.reason ?? json?.reason;
    const reason: GuestSnapshotReason =
      reasonField === "guest_limit_reached"
        ? "guest_limit_reached"
        : reasonField === "ai_unavailable" || res.status >= 500
          ? "ai_unavailable"
          : "invalid";

    // The allowance is spent as soon as the server says so, so a reload shows the
    // signup prompt instead of offering the free Snapshot again.
    if (reason === "guest_limit_reached") {
      try {
        localStorage.setItem(GUEST_SNAPSHOT_STORAGE.used, "true");
      } catch {
        // Ignore storage failures; the server is the source of truth.
      }
    }

    const message =
      typeof json?.message === "string" && json.message.trim() !== ""
        ? json.message
        : AI_UNREADABLE_RESPONSE_MESSAGE;

    return { ok: false, reason, message };
  }

  try {
    localStorage.setItem(
      GUEST_SNAPSHOT_STORAGE.data,
      JSON.stringify(json.data.snapshot)
    );
    localStorage.setItem(GUEST_SNAPSHOT_STORAGE.used, "true");
    if (typeof json.data.claimToken === "string") {
      localStorage.setItem(GUEST_SNAPSHOT_STORAGE.claim, json.data.claimToken);
    }
    sessionStorage.setItem(
      GUEST_SNAPSHOT_STORAGE.assessment,
      JSON.stringify(values)
    );
  } catch {
    // Rendering still works from the in-memory result even if storage is blocked.
  }

  return {
    ok: true,
    reason: null,
    message: typeof json.message === "string" ? json.message : "",
    snapshot: json.data.snapshot as PersonalSnapshotData,
  };
}
