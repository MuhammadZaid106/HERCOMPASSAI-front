"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  AlertTriangle,
  Check,
  Eye,
  Inbox,
  Loader2,
  RefreshCw,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { homeRouteForRole, isStaff } from "@/lib/auth/routeGuards";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSafetyPanel } from "@/components/admin/AdminSafetyPanel";
import {
  adminClient,
  type AdminResult,
  type ReviewFlag,
  type ReviewQueueData,
} from "@/lib/admin/adminClient";

const FILTERS = [
  { id: "open", label: "Needs review" },
  { id: "all", label: "All" },
  { id: "resolved", label: "Resolved" },
  { id: "dismissed", label: "Dismissed" },
] as const;

const REASON_COPY: Record<ReviewFlag["reason"], string> = {
  user_report_concern: "Member reported a concern",
  user_not_helpful: "Marked not helpful",
  sci_blocked: "Blocked by safety validation",
  guardrail_blocked: "Blocked by a guardrail",
  manual: "Raised by staff",
};

/**
 * Severity on a light surface.
 *
 * The old palette was built for `bg-slate-950` — translucent fills and
 * `-300` text that all relied on a dark backdrop for contrast. On white those
 * washes disappear and the text falls below readable contrast, so these use
 * solid light fills with `-800` text and a matching border.
 */
const SEVERITY_STYLES: Record<ReviewFlag["severity"], string> = {
  high: "border-rose-200 bg-rose-50 text-rose-800",
  medium: "border-amber-200 bg-amber-50 text-amber-800",
  low: "border-slate-200 bg-slate-100 text-slate-600",
};

const STATUS_STYLES: Record<ReviewFlag["reviewStatus"], string> = {
  open: "border-violet-200 bg-violet-50 text-violet-800",
  in_review: "border-sky-200 bg-sky-50 text-sky-800",
  resolved: "border-emerald-200 bg-emerald-50 text-emerald-800",
  dismissed: "border-slate-200 bg-slate-100 text-slate-600",
};

export function AdminReviewQueue({
  title,
  subtitle,
  safetyIntro = false,
}: {
  title: string;
  subtitle: string;
  safetyIntro?: boolean;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("open");
  const [flags, setFlags] = useState<ReviewFlag[]>([]);
  const [summary, setSummary] = useState<{
    open: number;
    inReview: number;
    highSeverity: number;
  } | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  /**
   * Per-row failure, kept apart from the page-level `error`.
   *
   * Triage is a repeated action on a list, so a failure belongs on the row that
   * failed — a single banner above the list leaves the member-facing admin
   * guessing which of six identical buttons did not save. It also means one
   * failed row no longer blanks out the queue.
   */
  const [rowError, setRowError] = useState<{ id: string; message: string } | null>(null);

  /**
   * Which filter's response is currently on screen.
   *
   * `pending` is derived from this rather than set directly, because a filter
   * click that resolves to the same rows still has to read as work — and setting
   * state in the effect body to express that trips `react-hooks/set-state-in-
   * effect`. Comparing the requested filter with the one that has landed gives
   * the same signal with no extra state transition: the gap between the two
   * exists exactly while a request is in flight.
   */
  const [loadedFilter, setLoadedFilter] = useState<string | null>(null);

  /**
   * Writes a response into state. Separated from the request so the mount effect
   * stays inside the `.then()`-callback shape this app's pages all use — calling
   * setState synchronously from an effect body triggers cascading renders.
   */
  const applyResult = useCallback((result: AdminResult<ReviewQueueData>) => {
    if (!result.ok || !result.data) {
      setError(result.message);
      setState("error");
      return;
    }
    setFlags(result.data.flags);
    setSummary(result.data.summary);
    setError(null);
    setState("ready");
  }, []);

  /** For the event-handler paths (Refresh, triage), where showing the spinner is right. */
  const load = useCallback(
    async (status: string) => {
      setState("loading");
      applyResult(await adminClient.listFlags({ status }));
    },
    [applyResult],
  );

  useEffect(() => {
    if (loading) return;
    // No session → /login with `from` so they resume here afterwards.
    // Signed in but not staff → their own dashboard. Bouncing a member to
    // /login read as an expired session rather than "not your area".
    if (!user) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!isStaff(user.role)) {
      router.replace(homeRouteForRole(user.role));
      return;
    }
    // A `filter` change keeps the previous list on screen until the new one
    // arrives rather than flashing a spinner over data that is still valid.
    let active = true;
    const requested = filter;
    void adminClient.listFlags({ status: requested }).then((result) => {
      if (!active) return;
      applyResult(result);
      setLoadedFilter(requested);
    });
    return () => {
      active = false;
    };
  }, [user, loading, filter, applyResult, pathname, router]);

  /**
   * The single path for every triage button.
   *
   * These used to be two separate handlers. `transition` reported its failure and
   * the "Take it" button discarded the result with a bare `.then(() => load())`,
   * so a rejected request reloaded the queue and left the row exactly as it was —
   * indistinguishable from a click that did nothing. Both now go through here, and
   * every failure lands on the row it came from.
   */
  async function transition(
    flag: ReviewFlag,
    status: "in_review" | "resolved" | "dismissed"
  ) {
    setBusyId(flag.id);
    setRowError(null);
    const result = await adminClient.updateFlag(flag.id, status);
    setBusyId(null);
    if (!result.ok) {
      setRowError({ id: flag.id, message: result.message });
      return;
    }
    // Re-read rather than patching local state: the summary counts change too, and
    // a hand-maintained copy of them is exactly how a queue drifts from reality.
    await load(filter);
  }

  /* Non-staff keeps the spinner rather than the review queue. The redirect effect
     above sends them to their dashboard; gating the render stops the flagged
     rows appearing for the frame in between. */
  if (loading || !user || !isStaff(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FBFBF9]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <AdminShell
      title={title}
      subtitle={subtitle}
      badge={
        <button
          type="button"
          onClick={() => void load(filter)}
          aria-label="Refresh queue"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-violet-700"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      }
    >
      <div className="space-y-6">
        {safetyIntro && <AdminSafetyPanel />}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <p className="text-sm leading-relaxed text-slate-600">
            A member choosing <strong>Not helpful</strong> or{" "}
            <strong>Report a concern</strong> on an AI response opens a row here.
            A <strong>Helpful</strong> tap is stored for evaluation but needs no
            review, so it does not appear in this queue.
          </p>
          {summary && (
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { label: "Open", value: summary.open },
                { label: "In review", value: summary.inReview },
                { label: "High severity", value: summary.highSeverity },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                >
                  <p className="text-xl font-bold text-slate-900">{item.value}</p>
                  <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              aria-pressed={filter === item.id}
              className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition ${
                filter === item.id
                  ? "border-violet-600 bg-violet-600 text-white"
                  : "border-slate-300 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900"
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => void load(filter)}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900"
          >
            <Eye className="h-4 w-4" />
            Refresh
          </button>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800"
          >
            {error}
          </p>
        )}

        {state === "loading" && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-violet-600" />
          </div>
        )}

        {/* A filter or refresh that resolves to the same rows still has to read as
            work. Without this the page looked inert on every click. */}
        {loadedFilter !== filter && state === "ready" && (
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin text-violet-600" />
            Updating queue…
          </div>
        )}

        {state === "ready" && flags.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-xs">
            <Inbox className="mx-auto h-8 w-8 text-emerald-600" />
            <p className="mt-3 font-semibold text-slate-900">Nothing in this view.</p>
            <p className="mt-1 text-sm text-slate-600">
              No flagged AI responses match this filter.
            </p>
            <p className="mx-auto mt-4 max-w-md text-xs leading-relaxed text-slate-500">
              This queue is empty until a member rates an AI response
              &ldquo;Not helpful&rdquo; or reports a concern. To confirm the
              pipeline works, generate an insight from the member side, report a
              concern on it, then refresh this page.
            </p>
          </div>
        )}

        {state === "ready" && flags.length > 0 && (
          <ul className="space-y-3">
            {flags.map((flag) => (
              <li
                key={flag.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ${SEVERITY_STYLES[flag.severity]}`}
                      >
                        {flag.severity === "high" && (
                          <AlertTriangle className="h-3 w-3" aria-hidden />
                        )}
                        {flag.severity}
                      </span>
                      <span className="text-sm font-semibold text-slate-900">
                        {REASON_COPY[flag.reason]}
                      </span>
                      <span className="text-xs text-slate-500">
                        {flag.feature}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs text-slate-500">
                      {new Date(flag.createdAt).toLocaleString()}
                      {flag.resultStatus
                        ? ` · result: ${flag.resultStatus}`
                        : ""}
                    </p>
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[flag.reviewStatus]}`}
                  >
                    {flag.reviewStatus.replace(/_/g, " ")}
                  </span>
                </div>

                {flag.memberComment && (
                  <blockquote className="mt-3 border-l-2 border-violet-300 pl-3 text-sm leading-relaxed text-slate-700">
                    {flag.memberComment}
                  </blockquote>
                )}

                <dl className="mt-3 grid gap-x-6 gap-y-1 text-[11px] text-slate-500 sm:grid-cols-2">
                  <div className="flex gap-2">
                    <dt className="font-semibold">request</dt>
                    <dd className="truncate font-mono">{flag.requestId}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-semibold">member</dt>
                    <dd className="truncate font-mono">{flag.userId}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-semibold">citations</dt>
                    <dd className="truncate font-mono">
                      {flag.citationIds?.length
                        ? flag.citationIds.join(", ")
                        : "none"}
                    </dd>
                  </div>
                </dl>

                {rowError?.id === flag.id && (
                  <p
                    role="alert"
                    className="mt-3 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium leading-relaxed text-rose-800"
                  >
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                    <span>
                      {rowError.message} This row was not saved — the buttons below
                      still work.
                    </span>
                  </p>
                )}

                {flag.reviewStatus === "open" || flag.reviewStatus === "in_review" ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {flag.reviewStatus === "open" && (
                      <button
                        type="button"
                        disabled={busyId === flag.id}
                        onClick={() => void transition(flag, "in_review")}
                        className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Take it
                      </button>
                    )}
                    <button
                      type="button"
                      disabled={busyId === flag.id}
                      onClick={() => void transition(flag, "resolved")}
                      className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-60"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Resolved
                    </button>
                    <button
                      type="button"
                      disabled={busyId === flag.id}
                      onClick={() => void transition(flag, "dismissed")}
                      className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-60"
                    >
                      <X className="h-3.5 w-3.5" />
                      Dismiss
                    </button>
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-slate-500">
                    Closed by {flag.reviewedBy ?? "staff"}
                    {flag.reviewedAt
                      ? ` on ${new Date(flag.reviewedAt).toLocaleDateString()}`
                      : ""}
                    .
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminShell>
  );
}