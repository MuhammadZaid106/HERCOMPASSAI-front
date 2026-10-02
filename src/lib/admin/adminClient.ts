import { authClient } from "@/lib/auth/authClient";

/**
 * Client for the internal review and operations API (`/api/admin/*`).
 *
 * Staff-only. The backend enforces that on every route, so these calls can assume a
 * 403 means the session genuinely lacks the role rather than that the UI got it
 * wrong.
 */

export interface ReviewFlag {
  id: string;
  requestId: string;
  userId: string;
  feature: string;
  reason:
    | "user_not_helpful"
    | "user_report_concern"
    | "sci_blocked"
    | "guardrail_blocked"
    | "manual";
  severity: "low" | "medium" | "high";
  detail: string | null;
  reviewStatus: "open" | "in_review" | "resolved" | "dismissed";
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
  citationIds: string[] | null;
  resultStatus: string | null;
  memberComment: string | null;
}

export interface ReviewSummary {
  open: number;
  inReview: number;
  highSeverity: number;
  resolved: number;
  dismissed: number;
}

export interface ReviewQueueData {
  flags: ReviewFlag[];
  total: number;
  summary: ReviewSummary;
}

export interface AdminResult<T> {
  ok: boolean;
  message: string;
  data?: T;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

async function request<T>(
  path: string,
  init?: RequestInit
): Promise<AdminResult<T>> {
  try {
    const response = await authClient.authenticatedFetch(`${API_BASE}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
    const json = await response.json().catch(() => null);
    return {
      ok: response.ok && json?.success === true,
      message: json?.message ?? (response.ok ? "" : "Request failed"),
      data: json?.data,
    };
  } catch {
    return {
      ok: false,
      message: "We could not reach the review queue. Check your connection.",
    };
  }
}

export const adminClient = {
  /**
   * List flagged AI events.
   *
   * `status: "open"` returns open plus in-review, which is the set that still needs
   * somebody to look at it.
   */
  listFlags(
    params: { status?: string; severity?: string; limit?: number } = {}
  ): Promise<AdminResult<ReviewQueueData>> {
    const query = new URLSearchParams();
    if (params.status) query.set("status", params.status);
    if (params.severity) query.set("severity", params.severity);
    if (params.limit) query.set("limit", String(params.limit));
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return request<ReviewQueueData>(`/api/admin/ai-flags${suffix}`);
  },

  /** Move a flag through the review lifecycle. */
  updateFlag(
    id: string,
    status: "in_review" | "resolved" | "dismissed"
  ): Promise<AdminResult<{ flag: ReviewFlag }>> {
    return request<{ flag: ReviewFlag }>(`/api/admin/ai-flags/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  /** What a member has spent against their AI allowance, for support. */
  memberUsage(
    userId: string
  ): Promise<
    AdminResult<{
      userId: string;
      usage: {
        used: number;
        limit: number | null;
        remaining: number | null;
        resetsAt: string;
        plan: string;
      };
    }>
  > {
    return request(`/api/admin/ai-usage/${encodeURIComponent(userId)}`);
  },
};
