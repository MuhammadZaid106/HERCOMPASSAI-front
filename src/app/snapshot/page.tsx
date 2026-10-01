"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Sparkles,
  ShieldCheck,
  Moon,
  Zap,
  Smile,
  Heart,
  Flame,
  ArrowRight,
  Info,
  CheckCircle2,
  HeartHandshake,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  BookOpen,
} from "lucide-react";
import { onboardingClient } from "@/lib/onboarding/onboardingClient";
import type {
  PersonalSnapshotData,
  SnapshotResult,
  SnapshotTrend,
} from "@/lib/onboarding/onboardingTypes";
import {
  aiErrorTitle,
  canRetry,
  isNetworkError,
  recoveryHref,
} from "@/lib/ai/aiErrors";
import { useAuth } from "@/lib/auth/AuthContext";

/** A score the backend did not calculate shows as a dash, never as a blank. */
function Score({ value }: { value: number | string | null | undefined }) {
  if (value === null || value === undefined || value === "") {
    return <span className="text-slate-300">—</span>;
  }
  return (
    <>
      {value}
      <span className="text-xs font-medium text-slate-400">/100</span>
    </>
  );
}

const TREND_ICONS = {
  increasing: TrendingUp,
  decreasing: TrendingDown,
  stable: Minus,
} as const;

/**
 * A verified trend, shown next to the section the model interpreted it in.
 *
 * The direction, the averages and the percentage all come from the Deterministic
 * Trend Engine; the client only picks an icon. `sufficientData` is false while a
 * member is still logging, so the badge says so rather than implying a flat line
 * means "no change".
 */
function TrendBadge({ trend }: { trend: SnapshotTrend }) {
  const Icon = TREND_ICONS[trend.direction] ?? Minus;
  const tone =
    trend.direction === "increasing"
      ? "text-rose-600 border-rose-200 bg-rose-50"
      : trend.direction === "decreasing"
        ? "text-indigo-600 border-indigo-200 bg-indigo-50"
        : "text-slate-500 border-slate-200 bg-slate-50";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${tone}`}
      title={
        trend.sufficientData
          ? `Calculated from your logged check-ins: recent average ${trend.recentAverage ?? "n/a"}, prior average ${trend.priorAverage ?? "n/a"}.`
          : "Not enough logged check-ins yet to describe a change."
      }
    >
      <Icon className="h-3.5 w-3.5" />
      {trend.sufficientData
        ? trend.changePercent === null
          ? trend.direction
          : `${trend.direction} ${Math.abs(trend.changePercent)}%`
        : "logging new data"}
    </span>
  );
}

export default function SnapshotPage() {
  const { user } = useAuth();
  const pathname = usePathname();
  const inMemberApp = pathname.startsWith("/app");
  const pageFrame = inMemberApp
    ? "pb-2"
    : "min-h-screen bg-[#FBFBF9] px-4 py-8 sm:px-6 sm:py-10 lg:py-12";
  const [data, setData] = useState<PersonalSnapshotData | null>(null);
  const [hasSnapshot, setHasSnapshot] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<{
    title: string;
    message: string;
    status: number;
    reason: Parameters<typeof canRetry>[1];
  } | null>(null);

  /**
   * A failed load used to be indistinguishable from a member who has not
   * onboarded: the page fell through to "Your Snapshot is not ready yet" and
   * offered the onboarding form. So a gateway outage sent people to re-take an
   * assessment they had already passed, and a revoked consent looked like a
   * missing profile. The reason returned by the client now drives which of
   * those panels is shown.
   */
  const applyResult = useCallback((res: SnapshotResult) => {
    if (res.snapshot) {
      setData(res.snapshot);
      setHasSnapshot(true);
      setError(null);
    } else {
      setHasSnapshot(false);
      setError({
        title: aiErrorTitle(res.status, res.reason),
        message: res.message,
        status: res.status,
        reason: res.reason,
      });
    }
    setIsLoading(false);
  }, []);

  const [versions, setVersions] = useState<
    Array<{
      id: string;
      versionNumber: number;
      completedAt: string;
      dominantFocusArea: string | null;
      payload: Record<string, unknown> | null;
    }>
  >([]);
  const [feedbackNote, setFeedbackNote] = useState<string | null>(null);
  const [feedbackComment, setFeedbackComment] = useState("");

  /** Counts Snapshot requests so `applyFetch` can tell a live one from a stale one. */
  const latestRequest = useRef(0);

  /**
   * The one loader for this page: first paint, "Try again" and "Refresh".
   *
   * It carries both halves that used to be split across two same-named functions —
   * the `refresh` option and the reason-aware error mapping of `applyResult`, and
   * the version history from the second one, whose absence left the "Saved
   * versions" panel permanently empty.
   *
   * Fetching and applying are deliberately separate. `fetchSnapshot` touches no
   * state, so the mount effect below can call it and stay inside the
   * `.then()`-callback shape that `react-hooks/set-state-in-effect` requires of
   * every other page in this app; `applyFetch` is what writes state, and both
   * callers go through it so there is still one definition of "render this".
   *
   * The response carries the id of the request that asked for it, so a stale one
   * can identify itself and drop out.
   */
  const fetchSnapshot = useCallback(
    async (options: { refresh?: boolean } = {}) => {
      const requestId = ++latestRequest.current;
      const res = await onboardingClient.getSnapshot(options);
      // Only fetched inside the member app, the one place the panel is rendered,
      // and only once there is a Snapshot to sit above it.
      const history =
        res.snapshot && inMemberApp
          ? await onboardingClient.getSnapshotVersions()
          : null;
      return { requestId, res, history };
    },
    [inMemberApp]
  );

  const applyFetch = useCallback(
    (bundle: {
      requestId: number;
      res: SnapshotResult;
      history: Awaited<ReturnType<typeof onboardingClient.getSnapshotVersions>> | null;
    }) => {
      // The first load and every refresh can be in flight together, and the
      // older response can arrive second. A superseded request writes nothing,
      // so a slow initial load cannot overwrite a Snapshot the member just
      // rebuilt. Unmounting bumps the same counter, which is what stops a
      // response that lands after the page closes.
      if (bundle.requestId !== latestRequest.current) return;

      // History is applied alongside the Snapshot rather than after it, so the
      // saved-versions list never paints as "Nothing here yet" and then refill.
      if (bundle.history) setVersions(bundle.history.versions);
      applyResult(bundle.res);
    },
    [applyResult]
  );

  /**
   * Rebuild the Snapshot from the latest check-ins.
   *
   * `isLoading` already starts true, so the first load needs no reset and the
   * mount effect does not have to reach for state. A retry does, and keeping it
   * here is what lets the loader above stay free of it.
   */
  const refreshSnapshot = useCallback(() => {
    setIsLoading(true);
    setError(null);
    void fetchSnapshot({ refresh: true }).then(applyFetch);
  }, [fetchSnapshot, applyFetch]);

  useEffect(() => {
    void fetchSnapshot().then(applyFetch);
    return () => {
      // Retire the in-flight request so a response that lands after the page
      // closes finds a newer id and writes nothing.
      latestRequest.current += 1;
    };
  }, [fetchSnapshot, applyFetch]);

  if (user && user.role === "partner") {
    return (
      <div className={`${pageFrame} flex items-center justify-center`}>
        <div className="max-w-md w-full rounded-3xl border border-indigo-200/90 bg-white p-5 shadow-xl space-y-6 text-center animate-fadeIn sm:p-8">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600">
              <HeartHandshake className="h-7 w-7" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-extrabold text-slate-900">Partner Access Notice</h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              The 8-Part Personal Menopause Snapshot™ contains private, raw clinical baseline metrics for member accounts.
            </p>
            <p className="text-xs text-slate-500">
              Your partner companion insights are delivered through the weekly Consented Partner Digest and Men&apos;s Academy.
            </p>
          </div>
          <Link
            href="/app"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm hover:from-indigo-700 hover:to-violet-700 shadow-md transition-all cursor-pointer"
          >
            <span>Return to Partner Portal</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`${pageFrame} flex items-center justify-center py-16`}>
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-2 border-violet-600 border-t-transparent animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading your Snapshot...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const retry = canRetry(error.status, error.reason);
    const recovery = recoveryHref(error.status, error.reason);
    const isOnboardingPrompt = error.reason === "not_completed";

    return (
      <div className="min-h-screen bg-[#FBFBF9] px-4 py-12 sm:px-6">
        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center">
          <div className="w-full rounded-3xl border border-violet-200/80 bg-white p-7 text-center shadow-xl shadow-violet-500/5 sm:p-10">
            <div
              className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl ${isNetworkError(error.status)
                  ? "bg-amber-50 text-amber-600"
                  : isOnboardingPrompt
                    ? "bg-violet-50 text-violet-700"
                    : "bg-rose-50 text-rose-600"
                }`}
            >
              {isNetworkError(error.status) ? (
                <AlertTriangle className="h-7 w-7" />
              ) : isOnboardingPrompt ? (
                <Sparkles className="h-7 w-7" />
              ) : (
                <AlertTriangle className="h-7 w-7" />
              )}
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-violet-700">
              Your Personal Snapshot
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {error.title}
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-600">
              {error.message}
            </p>

            <div className="mt-6 flex flex-col items-center gap-3">
              {retry && (
                <button
                  type="button"
                  onClick={refreshSnapshot}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition hover:bg-violet-700"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try again
                </button>
              )}
              {recovery && (
                <Link
                  href={recovery.href}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition hover:from-violet-700 hover:to-indigo-700"
                >
                  {recovery.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>

            <p className="mt-6 text-[11px] leading-relaxed text-slate-400">
              HerCompass never shows a Snapshot unless it can either generate it or
              clearly explain why it could not. Your answers are stored either way.
            </p>
            <Link href="/app" className="mx-auto mt-4 block text-xs font-semibold text-slate-500 hover:text-violet-700">
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!hasSnapshot) {
    return (
      <div className={pageFrame}>
        <div className={`mx-auto flex max-w-2xl items-center justify-center ${inMemberApp ? "py-4" : "min-h-[70vh]"}`}>
          <div className="w-full rounded-3xl border border-violet-200/80 bg-white p-5 text-center shadow-xl shadow-violet-500/5 sm:p-8 lg:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
              <Sparkles className="h-7 w-7" />
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-violet-700">Your Personal Snapshot</p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Nothing to show yet</h1>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-600">HerCompass confirmed there is no Snapshot to display, but did not say why. Try again, and if it persists return to your profile.</p>
            <button
              type="button"
              onClick={refreshSnapshot}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 hover:bg-violet-700"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
            <Link href="/app" className="mx-auto mt-4 block text-xs font-semibold text-slate-500 hover:text-violet-700">Return to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  const metrics = data?.deterministicMetrics;

  return (
    <div className={pageFrame}>
      <div className="mx-auto max-w-4xl space-y-6 animate-fadeIn sm:space-y-8 lg:space-y-10">
        {/* Top Navigation Bar / Return */}
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/app"
            className="inline-flex items-center gap-2 text-xs font-bold text-violet-700 hover:text-violet-800 transition"
          >
            ← Return to Home
          </Link>
          <div className="flex max-w-full items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
            <span className="min-w-0 leading-snug">Verified Baseline • v{data?.version || "1.0"}</span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="relative space-y-4 overflow-hidden rounded-3xl border border-slate-200/90 bg-white/95 p-4 shadow-xl shadow-slate-200/50 sm:p-6 lg:p-10">
          <div className="absolute top-0 right-0 h-40 w-40 bg-linear-to-bl from-violet-200/40 via-rose-100/30 to-transparent rounded-bl-full pointer-events-none" />

          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-violet-200 bg-violet-50/80 px-3 py-1 text-xs font-bold text-violet-700">
            <Compass className="h-3.5 w-3.5 shrink-0 text-violet-600" />
            <span className="min-w-0 leading-snug">Signature Personal Menopause Snapshot™</span>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Here&apos;s What We&apos;re Noticing Right Now
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            Synthesized from your 5-minute onboarding assessment. Below is your deterministic baseline across sleep, mood, vasomotor signals, and daily vitality.
          </p>

          {/* Dominant Focus Area Banner */}
          {metrics?.dominantFocusArea && (
            <div className="pt-2">
              <span className="inline-flex max-w-full items-start gap-2 rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 px-3 py-2 text-left text-xs font-bold text-white shadow-md shadow-violet-500/20 sm:px-4">
                <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" />
                <span className="min-w-0 leading-snug">Primary Clinical Anchor: {metrics.dominantFocusArea}</span>
              </span>
            </div>
          )}
        </div>

        {/* 4 Deterministic Metric Cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1.5 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-start justify-between gap-2 text-xs font-bold text-slate-500">
              <span className="min-w-0 leading-snug">Symptom Burden</span>
              <Flame className="h-4 w-4 shrink-0 text-rose-500" />
            </div>
            <div className="text-xl font-black text-slate-900 sm:text-2xl">
              <Score value={metrics?.symptomBurdenScore} />
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Calculated from reported concerns &amp; severity.
            </p>
          </div>

          <div className="space-y-1.5 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-start justify-between gap-2 text-xs font-bold text-slate-500">
              <span className="min-w-0 leading-snug">Sleep Disturbance</span>
              <Moon className="h-4 w-4 shrink-0 text-indigo-600" />
            </div>
            <div className="text-xl font-black text-slate-900 sm:text-2xl">
              <Score value={metrics?.sleepDisturbanceScore} />
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Derived from quality & awakening patterns.
            </p>
          </div>

          <div className="space-y-1.5 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-start justify-between gap-2 text-xs font-bold text-slate-500">
              <span className="min-w-0 leading-snug">Vitality Index</span>
              <Zap className="h-4 w-4 shrink-0 text-amber-500" />
            </div>
            <div className="text-xl font-black text-slate-900 sm:text-2xl">
              <Score value={metrics?.vitalityIndex} />
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Activity, post-meal energy & routines.
            </p>
          </div>

          <div className="space-y-1.5 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-start justify-between gap-2 text-xs font-bold text-slate-500">
              <span className="min-w-0 leading-snug">Mood Equilibrium</span>
              <Smile className="h-4 w-4 shrink-0 text-emerald-600" />
            </div>
            <div className="text-xl font-black text-slate-900 sm:text-2xl">
              <Score value={metrics?.emotionalBalanceScore} />
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Normalized balance of positive vs tense states.
            </p>
          </div>
        </div>

        {/* How much of the window the member actually logged */}
        {metrics?.trendDaysLogged !== undefined && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-5 py-4 text-xs text-slate-600">
            <span className="font-bold text-slate-800">Your logged check-ins:</span>{" "}
            {metrics.trendDaysLogged} day{metrics.trendDaysLogged === 1 ? "" : "s"} of the last{" "}
            {metrics.trendRangeDays ?? 30}, {metrics.trendConsistencyScore ?? 0}% consistency
            {metrics.trendCheckInStreak ? `, ${metrics.trendCheckInStreak}-day streak` : ""}.{" "}
            <span className="text-slate-500">
              The trends below are calculated from those entries before anything is interpreted.
            </span>
          </div>
        )}

        {/* 8 Structured Observations */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            Comprehensive 8-Part Baseline Analysis
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {data?.observations?.map((obs) => (
              <div
                key={obs.id}
                className="space-y-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm transition hover:border-slate-300 sm:p-6"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-800">
                      {obs.id}
                    </span>
                    <span className="min-w-0 text-xs font-bold uppercase leading-snug tracking-wide text-violet-700 sm:tracking-wider">
                      {obs.pillar}
                    </span>
                  </div>
                  {obs.trend ? (
                    <TrendBadge trend={obs.trend} />
                  ) : obs.status ? (
                    <span className="w-fit shrink-0 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                      {obs.status}
                    </span>
                  ) : null}
                </div>

                <h3 className="text-base font-bold text-slate-900">{obs.title}</h3>
                {obs.summary && (
                  <p className="text-xs text-slate-600 leading-relaxed">{obs.summary}</p>
                )}

                {/* Sub-elements for recommendations */}
                {obs.recommendations && (
                  <div className="grid grid-cols-1 gap-2.5 pt-2 md:grid-cols-2 lg:grid-cols-3">
                    {obs.recommendations.map((rec, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-1.5"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700">
                          {rec.category}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">{rec.action}</h4>
                        <p className="text-[11px] text-slate-500 leading-snug">{rec.why}</p>
                        {rec.start && (
                          <p className="text-[11px] font-semibold text-violet-700">Start: {rec.start}</p>
                        )}
                        {rec.evidenceNote && (
                          <p className="text-[10px] text-slate-400 italic">Source: {rec.evidenceNote}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {obs.action && (
                  <div className="rounded-xl border border-violet-100 bg-violet-50/60 p-3 text-xs font-semibold text-violet-900">
                    💡 {obs.action}
                  </div>
                )}

                {obs.evidenceNote && (
                  <p className="text-[11px] text-slate-400 italic">
                    Source: {obs.evidenceNote}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {inMemberApp && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
            <h2 className="text-sm font-extrabold text-slate-900">Saved versions</h2>
            {versions.length === 0 ? (
              <p className="text-xs text-slate-500">Nothing here yet.</p>
            ) : (
              <ul className="space-y-2 text-xs text-slate-600">
                {versions.map((version) => (
                  <li key={version.id}>
                    Version {version.versionNumber}
                    {version.dominantFocusArea ? ` · ${version.dominantFocusArea}` : ""} ·{" "}
                    {new Date(version.completedAt).toLocaleDateString()}
                    {version.payload ? null : (
                      // Stated rather than hidden: an old version with no stored
                      // narrative is a real gap, and quietly dropping it would
                      // suggest history is complete when it is not.
                      <span className="block text-[11px] text-slate-400">
                        Narrative not recorded for this version.
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
            <h3 className="text-sm font-extrabold text-slate-900">Was this Snapshot useful?</h3>
            <textarea
              value={feedbackComment}
              onChange={(event) => setFeedbackComment(event.target.value)}
              rows={3}
              placeholder="Optional note"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
            />
            <div className="flex flex-col gap-2 sm:flex-row">
              {(["helpful", "not_helpful", "report_concern"] as const).map((rating) => (
                <button
                  key={rating}
                  type="button"
                  className={`min-h-10 rounded-full border px-4 text-xs font-bold ${
                    rating === "report_concern"
                      ? "border-rose-300 text-rose-700"
                      : "border-slate-300 text-slate-800"
                  }`}
                  onClick={() => {
                    void onboardingClient
                      .sendSnapshotFeedback(rating, feedbackComment)
                      .then((result) => setFeedbackNote(result.message));
                  }}
                >
                  {rating === "helpful"
                    ? "Helpful"
                    : rating === "not_helpful"
                      ? "Not helpful"
                      : "Report a concern"}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              &ldquo;Report a concern&rdquo; sends this to our review team.
            </p>
            {feedbackNote && <p className="text-xs text-slate-600">{feedbackNote}</p>}
          </section>
        )}

        {/* SCI Safety Disclaimer Panel */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-5 text-xs text-slate-600 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <Info className="h-4 w-4 text-violet-600" />
            <span>About This Baseline Snapshot</span>
          </div>
          <p className="leading-relaxed">
            {data?.safetyNotice ||
              "This information is intended to support wellness education, personalized reflection, and proactive lifestyle adjustments. It is not a medical diagnosis or treatment plan."}
          </p>
        </div>

        {/* How this Snapshot was produced: provenance, sources, refresh */}
        <div className="space-y-3 rounded-2xl border border-slate-200/90 bg-white p-5 text-xs text-slate-600">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>How this Snapshot was prepared</span>
            </div>
            <button
              type="button"
              onClick={refreshSnapshot}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-600 transition hover:bg-slate-50"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh with my latest check-ins
            </button>
          </div>

          {data?.generation ? (
            <div className="flex flex-wrap items-center gap-2">
              {data.generation.fallbackUsed ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
                  <Info className="h-3.5 w-3.5" />
                  Written from your verified numbers
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Interpreted from your verified numbers
                </span>
              )}
              {data.generation.confidenceClass && (
                <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                  Confidence: {data.generation.confidenceClass}
                  {data.generation.confidenceScore !== null
                    ? ` (${Math.round(data.generation.confidenceScore * 100)}%)`
                    : ""}
                </span>
              )}
              <span className="text-[11px] text-slate-400">
                Prompt {data.generation.promptVersion} · Evidence {data.generation.evidenceVersion} · Safety
                checks {data.generation.sciVersion}
              </span>
            </div>
          ) : null}

          {/*
            Why the AI part could not run.
            The badge above already says "written from your verified numbers", but
            a member cannot act on that: it does not say whether the problem is
            temporary, whether trying again will help, or whether anything is
            missing from their side. Saying so is the difference between a
            degraded result that looks like a finished product and one that is
            honestly labelled.
          */}
          {data?.generation?.diagnostics && (
            <div
              className="mt-3 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50/70 px-3.5 py-3"
              role="status"
            >
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <div className="min-w-0">
                <p className="text-[13px] leading-relaxed text-amber-900">
                  {data.generation.diagnostics.message}
                </p>
                {data.generation.diagnostics.retryable && (
                  <p className="mt-1 text-[12px] text-amber-800">
                    You can refresh above to try again — everything below is already accurate
                    without it.
                  </p>
                )}
              </div>
            </div>
          )}

          {data?.citations && data.citations.length > 0 && (
            <details className="group">
              <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 font-bold text-slate-700 hover:text-violet-700">
                <BookOpen className="h-3.5 w-3.5 text-violet-600" />
                Sources used ({data.citations.length})
              </summary>
              <ul className="mt-2 space-y-1.5">
                {data.citations.map((citation) => (
                  <li key={citation.citationId} className="leading-snug">
                    <span className="font-bold text-slate-800">{citation.title}</span>{" "}
                    <span className="text-slate-500">
                      — {citation.publisher} ({citation.publicationDate}). {citation.reference}
                    </span>
                  </li>
                ))}
              </ul>
            </details>
          )}

          <p className="text-[11px] leading-relaxed text-slate-400">
            The figures above were calculated by HerCompass from your own entries. The
            wording was written by an AI model that may be wrong; refreshing rebuilds the
            Snapshot from your most recent check-ins.
          </p>
        </div>

        {/* Bottom Pathways */}
        <div className="flex flex-col items-stretch gap-3 border-t border-slate-200 pt-4 lg:flex-row lg:items-center lg:justify-between">
          <Link
            href="/app"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-xs font-bold text-white shadow-md transition hover:bg-slate-800 lg:w-auto"
          >
            <span>Go to Home</span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0" />
          </Link>
          <Link
            href="/partner"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-center text-xs font-bold leading-snug text-slate-700 shadow-sm transition hover:bg-slate-50 lg:w-auto"
          >
            <Heart className="h-3.5 w-3.5 shrink-0 text-rose-500" />
            <span>Explore Partner Support & Men&apos;s Academy</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
