import { authClient } from "@/lib/auth/authClient";
import { AI_CONNECTION_MESSAGE, NETWORK_ERROR_STATUS, aiErrorMessage } from "./aiErrors";

/**
 * Client for the HerCompassAI Gateway (`/api/ai/*`).
 *
 * All calls go through `authClient.authenticatedFetch`, which attaches the
 * Bearer access token and transparently rotates it on a 401 before retrying.
 */

export type AiGenerateKind = "snapshot" | "insight";

export type AiFeature = "personal_snapshot" | "ai_insight";

export type AiRating = "helpful" | "not_helpful" | "report_concern";

/**
 * Member-safe explanation of a degraded generation.
 *
 * Classification only. The upstream provider's own message is deliberately
 * absent — this surface is reachable by members, and "we pointed at a model the
 * provider does not host" is a support ticket generator, not a member concern.
 */
export interface AiDegradation {
  degraded: true;
  reason: string;
  message: string;
  engines: Array<{
    provider: string;
    kind: string;
    httpStatus: number | null;
    retryable: boolean;
  }>;
  retryable: boolean;
}

export interface AiGenerateMeta {
  requestId: string;
  resultStatus: string;
  confidence: unknown;
  safetyStatus: string;
  promptVersion: string;
  evidenceVersion: string;
  sciVersion: string;
  /**
   * Null when the deterministic fallback produced the response, because no model
   * ran and there is therefore no version to cite.
   */
  modelVersion: string | null;
  /** Present only when the response was degraded. */
  diagnostics?: AiDegradation;
}

export interface AiGenerateData {
  output: unknown;
  meta: AiGenerateMeta;
}

export interface AiFeedbackPayload {
  requestId: string;
  feature: AiFeature;
  rating: AiRating;
  comment?: string;
}

export interface AiResult<T = unknown> {
  ok: boolean;
  status: number;
  /** Safe to render. Empty on success. Never contains provider detail. */
  message: string;
  data?: T;
  errors?: Record<string, string[]> | string[] | Record<string, string>;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

/**
 * Every AI call resolves — it never rejects.
 *
 * `authenticatedFetch` throws when the backend is unreachable, the request is
 * aborted, or a CORS pre-flight fails. Callers previously wrote
 * `const res = await aiClient.generate(...)` and then read `res.ok`, so a thrown
 * fetch became an unhandled rejection with no message on screen at all: the
 * button stopped spinning and nothing explained why. Catching here means every
 * caller gets the same `AiResult` shape whether the failure was a 503 from the
 * gateway or a laptop that went to sleep.
 */
async function toResult<T>(response: Response): Promise<AiResult<T>> {
  const json = await response.json().catch(() => null);
  const ok = response.ok && json?.success === true;

  return {
    ok,
    status: response.status,
    // Only failures get a message. An empty string on success keeps callers
    // from rendering an error banner for a request that worked.
    message: ok ? (typeof json?.message === "string" ? json.message : "") : aiErrorMessage(response.status, json?.message),
    data: json?.data,
    errors: json?.errors,
  };
}

async function request<T>(
  path: string,
  init?: RequestInit
): Promise<AiResult<T>> {
  try {
    const response = await authClient.authenticatedFetch(`${API_BASE}${path}`, init);
    return await toResult<T>(response);
  } catch {
    return {
      ok: false,
      status: NETWORK_ERROR_STATUS,
      message: AI_CONNECTION_MESSAGE,
    };
  }
}

export const aiClient = {
  /** Map the user-facing generate kind to its backend route and feedback feature. */
  endpoints(kind: AiGenerateKind): { path: string; feature: AiFeature } {
    return kind === "snapshot"
      ? { path: "/api/ai/snapshot", feature: "personal_snapshot" }
      : { path: "/api/ai/insight", feature: "ai_insight" };
  },

  async generate(
    kind: AiGenerateKind,
    body: { promptVersion?: string; locale?: "en-GB" | "en-US" } = {}
  ): Promise<AiResult<AiGenerateData>> {
    return request<AiGenerateData>(aiClient.endpoints(kind).path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  },

  async health(): Promise<AiResult<unknown>> {
    return request("/api/ai/health");
  },

  async feedback(payload: AiFeedbackPayload): Promise<AiResult<unknown>> {
    return request("/api/ai/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
};