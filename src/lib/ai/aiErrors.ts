import type { SnapshotFailureReason } from "@/lib/onboarding/onboardingTypes";

/**
 * User-facing AI failure messages.
 *
 * Two rules shape this file.
 *
 * First, a member is told what happened and what to do next, never what the
 * server was doing. "AI_GATEWAY_ENABLED is false" is a note for a developer; a
 * member needs to know whether to retry, finish onboarding, or stop waiting.
 *
 * Second, the fallback message is written to be *safe when wrong*. If the
 * backend already supplied a message, that message wins, because it knows the
 * real reason. These strings are only used when there is no response at all, or
 * when the failure is one the backend never got to describe — and in both of
 * those cases the member genuinely does not know what happened.
 */

/** Used when the request never reached the backend. */
export const AI_CONNECTION_MESSAGE =
  "We couldn't reach HerCompass just now, so nothing was generated. Your answers are saved — please check your connection and try again.";

/** Used when the backend answered but with no usable body. */
export const AI_UNREADABLE_RESPONSE_MESSAGE =
  "HerCompass sent back a response we couldn't read, so nothing was shown. Your answers are saved — please try again.";

/** Requests that never left the browser carry status 0. */
export const NETWORK_ERROR_STATUS = 0;

export function isNetworkError(status: number): boolean {
  return status === NETWORK_ERROR_STATUS;
}

function reasonFor(status: number, fallbackReason: SnapshotFailureReason): SnapshotFailureReason {
  if (status === 401) return "unauthenticated";
  if (status === 403) return fallbackReason;
  if (status === 404) return "not_completed";
  if (status === 503 || status === 502 || status === 504) return "ai_unavailable";
  return fallbackReason;
}

/**
 * A message for a failed AI request.
 *
 * `serverMessage` is preferred whenever it exists: the backend derives it from
 * the actual failure kind and keeps provider errors, hostnames and keys out of
 * it, so it is both safer and more accurate than anything reconstructed here.
 */
export function aiErrorMessage(status: number, serverMessage: string | null | undefined): string {
  const cleaned = typeof serverMessage === "string" ? serverMessage.trim() : "";
  if (cleaned !== "") return cleaned;

  if (isNetworkError(status)) return AI_CONNECTION_MESSAGE;

  switch (status) {
    case 401:
      return "Your session has expired. Please sign in again to see your Snapshot.";
    case 403:
      return "We need your current consent before we can build a personalised Snapshot. Your answers are saved — please review your privacy settings.";
    case 404:
      return "Complete your 5-minute onboarding assessment to unlock your Personal Snapshot.";
    case 422:
      return "We couldn't complete this safely, so nothing was shown. Your answers are saved — please try again.";
    case 503:
    case 502:
    case 504:
      return "HerCompass is having trouble preparing your Snapshot right now. Your answers are saved — please try again in a moment.";
    case 429:
      return "You've asked for a few Snapshots in a short time. Your answers are saved — please try again shortly.";
    default:
      return AI_UNREADABLE_RESPONSE_MESSAGE;
  }
}

/** Title for the failure panel, chosen from the same reason. */
export function aiErrorTitle(status: number, reason: SnapshotFailureReason | null): string {
  if (isNetworkError(status)) return "Connection problem";
  if (reason === "not_completed") return "Your Snapshot is not ready yet";
  if (reason === "consent_required") return "Consent needed";
  if (reason === "unauthenticated") return "Please sign in again";
  if (status === 429) return "Just a moment";
  return "Your Snapshot could not be prepared";
}

/** Whether a retry button makes sense for this failure. */
export function canRetry(status: number, reason: SnapshotFailureReason | null): boolean {
  if (isNetworkError(status)) return true;
  if (reason === "not_completed" || reason === "consent_required" || reason === "unauthenticated") {
    return false;
  }
  return true;
}

/** The path a member should follow for a non-retryable failure. */
export function recoveryHref(
  status: number,
  reason: SnapshotFailureReason | null
): { href: string; label: string } | null {
  if (isNetworkError(status)) return null;
  if (reason === "not_completed") return { href: "/onboarding", label: "Finish onboarding" };
  if (reason === "unauthenticated") return { href: "/login", label: "Sign in" };
  if (reason === "consent_required") return { href: "/onboarding", label: "Review consent" };
  return null;
}

/** Normalises a backend `reason` into the client's union. */
export function normaliseReason(value: unknown): SnapshotFailureReason | null {
  if (typeof value !== "string") return null;
  const known: SnapshotFailureReason[] = [
    "unauthenticated",
    "forbidden_role",
    "not_completed",
    "consent_required",
    "ai_unavailable",
  ];
  return known.includes(value as SnapshotFailureReason)
    ? (value as SnapshotFailureReason)
    : "unknown";
}

/**
 * Pulls the reason out of a failed API envelope.
 *
 * The backend answers `{ success: false, errors: { reason } }`, so this looks in
 * both `errors.reason` and a top-level `reason` — an error shape that changes
 * must degrade to `unknown`, never to a wrong-but-confident message.
 */
export function reasonFromErrorBody(json: unknown): SnapshotFailureReason | null {
  if (typeof json !== "object" || json === null) return null;
  const body = json as { errors?: unknown; reason?: unknown };
  const candidate = (body.errors as { reason?: unknown } | undefined)?.reason ?? body.reason;
  return normaliseReason(candidate);
}

export { reasonFor as resolveReason };
