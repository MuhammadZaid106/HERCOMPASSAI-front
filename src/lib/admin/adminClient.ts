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
  safetyStatus: string | null;
  sciFindingCodes: string[] | null;
  latencyMs: number | null;
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

export interface DayCount {
  day: string;
  count: number;
}

export interface PlanCount {
  plan: "free" | "plus" | "premium";
  count: number;
}

export interface InviteCount {
  status: "sent" | "accepted" | "declined" | "revoked";
  count: number;
}

export interface AdminMetrics {
  members: number;
  snapshots: number;
  openAiFlags: number;
  acceptedPartnerConnections: number;
  medianTtfv: string | null;
  signupsByDay: DayCount[];
  membersByPlan: PlanCount[];
  invitesByState: InviteCount[];
  flagSeverity: { low: number; medium: number; high: number } | null;
}

export interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  role: "member" | "partner" | "admin" | "developer";
  plan: "free" | "plus" | "premium";
  accountStatus: "confirmed" | "unconfirmed";
  hasSnapshot: boolean;
  partnerState: "none" | "sent" | "accepted" | "declined" | "revoked";
  createdAt: string;
}

export interface AdminAuditLine {
  source: "ai" | "partner";
  label: string;
  result: string;
  createdAt: string;
}

export interface AdminUserDetail extends AdminUserRow {
  consent: "on" | "off" | "unknown";
  supportTickets: number;
  audit: AdminAuditLine[];
}

export interface AdminPartnerRow {
  id: string;
  memberFirstName: string;
  partnerEmail: string;
  status: InviteCount["status"];
  scopes: string[];
  createdAt: string;
}

export interface AdminPartnerActivity {
  id: string;
  action: string;
  result: string;
  memberFirstName: string;
  createdAt: string;
}

export interface AdminPartnerSupportNote {
  id: string;
  userId: string;
  memberFirstName: string;
  topic: string;
  message: string;
  createdAt: string;
}

export interface SystemCheck {
  id: string;
  label: string;
  status: "ready" | "attention" | "not_connected" | "unchecked";
  detail: string;
}

export interface BetaCohortCard {
  id: string;
  name: string;
  slug: string;
  invited: number;
  screened: number;
  enrolled: number;
  activated: number;
  snapshot: number;
  medianTtfv: string | null;
}

export interface BetaMemberRow {
  id: string;
  cohortId: string;
  cohortName: string;
  email: string;
  stage: "invited" | "screened";
  enrolled: boolean;
  activated: boolean;
  hasSnapshot: boolean;
}

export interface AdminContentPiece {
  id: string;
  kind: "recipe" | "workout" | "meditation";
  slug: string;
  title: string;
  status: "draft" | "in_review" | "published" | "archived";
  body: Record<string, unknown>;
  updatedAt: string;
}

export interface ProductNote {
  id: string;
  memberFirstName: string;
  topic: string;
  message: string;
  createdAt: string;
  cohortName: string | null;
  theme: string | null;
  severity: "low" | "medium" | "high" | null;
  decision: "open" | "accepted" | "parked" | null;
  resolution: string;
}

export interface AdminAuditRow {
  id: string;
  source: "ai" | "partner";
  label: string;
  result: string;
  detail: string;
  memberFirstName: string;
  createdAt: string;
}

export interface AdminSupportRow {
  id: string;
  memberFirstName: string;
  topic: string;
  message: string;
  createdAt: string;
}

export interface AdminEvidenceRow {
  evidenceId: string;
  citationId: string;
  sourceName: string;
  publisher: string;
  sourceCategory: string;
  publicationDate: string;
  status: string;
  version: string;
  clinicianReview: "pending" | "signed";
  retired: boolean;
}
export interface AdminPlanCard {
  id: "free" | "plus" | "premium";
  label: string;
  summary: string;
  memberCount: number;
  included: string[];
}

export interface CommunityReviewNote {
  id: string;
  topic: string;
  body: string;
  status: "pending" | "approved" | "hidden";
  firstName: string;
  createdAt: string;
  reviewedAt: string | null;
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
      message: "We could not reach the admin desk. Check your connection.",
    };
  }
}

export const adminClient = {
  metrics(days = 14): Promise<AdminResult<AdminMetrics>> {
    return request<AdminMetrics>(`/api/admin/metrics?days=${days}`);
  },

  searchUsers(
    q: string,
    page = 1,
    filters: { plan?: string; role?: string; account?: string } = {},
  ): Promise<AdminResult<{ users: AdminUserRow[]; total: number; page: number; pageSize: number }>> {
    const query = new URLSearchParams();
    if (q.trim()) query.set("q", q.trim());
    if (filters.plan) query.set("plan", filters.plan);
    if (filters.role) query.set("role", filters.role);
    if (filters.account) query.set("account", filters.account);
    query.set("page", String(page));
    return request(`/api/admin/users?${query.toString()}`);
  },

  user(id: string): Promise<AdminResult<{ user: AdminUserDetail }>> {
    return request(`/api/admin/users/${encodeURIComponent(id)}`);
  },

  partners(): Promise<
    AdminResult<{
      invitesByState: InviteCount[];
      invites: AdminPartnerRow[];
      activity: AdminPartnerActivity[];
      supportNotes: AdminPartnerSupportNote[];
    }>
  > {
    return request("/api/admin/partners");
  },

  plans(): Promise<AdminResult<{ billingConnected: false; plans: AdminPlanCard[] }>> {
    return request("/api/admin/plans");
  },

  system(probeGateway = false): Promise<AdminResult<{ checks: SystemCheck[] }>> {
    const suffix = probeGateway ? "?probe=gateway" : "";
    return request(`/api/admin/system${suffix}`);
  },

  beta(cohort = ""): Promise<
    AdminResult<{ cap: number; cohorts: BetaCohortCard[]; members: BetaMemberRow[] }>
  > {
    const query = new URLSearchParams();
    if (cohort) query.set("cohort", cohort);
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return request(`/api/admin/beta${suffix}`);
  },

  addBetaMember(cohortId: string, email: string) {
    return request<{ added: boolean }>("/api/admin/beta/members", {
      method: "POST",
      body: JSON.stringify({ cohortId, email }),
    });
  },

  setBetaStage(id: string, stage: "invited" | "screened") {
    return request(`/api/admin/beta/members/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ stage }),
    });
  },

  content(kind = ""): Promise<AdminResult<{ pieces: AdminContentPiece[] }>> {
    const query = new URLSearchParams();
    if (kind) query.set("kind", kind);
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return request(`/api/admin/content${suffix}`);
  },

  createContent(body: Record<string, unknown>) {
    return request<{ piece: AdminContentPiece }>("/api/admin/content", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  updateContent(id: string, body: Record<string, unknown>) {
    return request<{ piece: AdminContentPiece }>(`/api/admin/content/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  productNotes(page = 1): Promise<
    AdminResult<{ notes: ProductNote[]; total: number; page: number; pageSize: number }>
  > {
    return request(`/api/admin/product-notes?page=${page}`);
  },

  saveProductNote(
    id: string,
    body: { theme: string; severity: string; decision: string; resolution: string },
  ) {
    return request(`/api/admin/product-notes/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  settings(): Promise<
    AdminResult<{ foundingCap: number; billingConnected: false; mailConfigured: boolean }>
  > {
    return request("/api/admin/settings");
  },

  saveSettings(foundingCap: number) {
    return request<{ foundingCap: number }>("/api/admin/settings", {
      method: "PATCH",
      body: JSON.stringify({ foundingCap }),
    });
  },

  setEvidenceStatus(evidenceId: string, status: "active" | "retired") {
    return request(`/api/admin/evidence/${encodeURIComponent(evidenceId)}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  audit(page = 1): Promise<
    AdminResult<{
      rows: AdminAuditRow[];
      total: number;
      page: number;
      pageSize: number;
      resultsByStatus: Array<{ status: string; count: number }>;
    }>
  > {
    return request(`/api/admin/audit?page=${page}`);
  },

  support(
    page = 1,
    userId?: string,
  ): Promise<AdminResult<{ rows: AdminSupportRow[]; total: number; page: number; pageSize: number }>> {
    const query = new URLSearchParams({ page: String(page) });
    if (userId) query.set("userId", userId);
    return request(`/api/admin/support?${query.toString()}`);
  },

  evidence(q = ""): Promise<
    AdminResult<{ records: AdminEvidenceRow[]; clinicianReview: string }>
  > {
    const query = new URLSearchParams();
    if (q.trim()) query.set("q", q.trim());
    const suffix = query.toString() ? `?${query.toString()}` : "";
    return request(`/api/admin/evidence${suffix}`);
  },

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

  listCommunityNotes(status: "pending" | "approved" | "hidden" | "all" = "pending") {
    return request<{ notes: CommunityReviewNote[] }>(
      `/api/admin/community-notes?status=${status}`,
    );
  },

  reviewCommunityNote(id: string, status: "approved" | "hidden") {
    return request<{ note: CommunityReviewNote }>(`/api/admin/community-notes/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
};
