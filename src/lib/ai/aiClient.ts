import { authClient } from "@/lib/auth/authClient";

/**
 * Client for the HerCompassAI Gateway (`/api/ai/*`).
 *
 * All calls go through `authClient.authenticatedFetch`, which attaches the
 * Bearer access token and transparently rotates it on a 401 before retrying.
 */

export type AiGenerateKind = "snapshot" | "insight";

export type AiFeature = "personal_snapshot" | "ai_insight";

export type AiRating = "helpful" | "not_helpful" | "report_concern";

export interface AiGenerateMeta {
  requestId: string;
  resultStatus: string;
  confidence: unknown;
  safetyStatus: string;
  promptVersion: string;
  evidenceVersion: string;
  sciVersion: string;
  modelVersion: string;
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
  message: string;
  data?: T;
  errors?: Record<string, string[]> | string[];
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

async function toResult<T>(response: Response): Promise<AiResult<T>> {
  const json = await response.json().catch(() => ({
    success: false,
    message: `Server returned ${response.status} ${response.statusText}`,
  }));
  return {
    ok: response.ok && json?.success === true,
    status: response.status,
    message: json?.message ?? `Server returned ${response.status}`,
    data: json?.data,
    errors: json?.errors,
  };
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
    const response = await authClient.authenticatedFetch(
      `${API_BASE}${aiClient.endpoints(kind).path}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );
    return toResult<AiGenerateData>(response);
  },

  async health(): Promise<AiResult<unknown>> {
    const response = await authClient.authenticatedFetch(`${API_BASE}/api/ai/health`);
    return toResult(response);
  },

  async feedback(payload: AiFeedbackPayload): Promise<AiResult<unknown>> {
    const response = await authClient.authenticatedFetch(`${API_BASE}/api/ai/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return toResult(response);
  },
};