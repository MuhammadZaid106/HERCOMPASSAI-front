"use client";

import { useState } from "react";
import { ChevronDown, Lightbulb, Target } from "lucide-react";

/**
 * The Gateway emits `personalizedRecommendations` (what / why / start / category)
 * and `suggestedNextSteps` (horizon / action) for every insight and Snapshot
 * reading. Both are model output, citation-checked, and owned by the SCI — this
 * component only presents them. It never authors lifestyle advice itself.
 *
 * Both arrays can legitimately arrive empty: the citation verifier strips any
 * recommendation that does not trace back to approved evidence, and a degraded
 * response may carry none. An empty state is shown honestly rather than hidden,
 * because a silent absence is indistinguishable from a page that forgot to
 * render advice.
 */

export interface GatewayRecommendation {
  what: string;
  why: string;
  start?: string | null;
  category?: string | null;
  citationIds?: string[];
}

export interface GatewayNextStep {
  horizon: "today" | "this_week" | "track";
  action: string;
}

const HORIZON_LABELS: Record<GatewayNextStep["horizon"], string> = {
  today: "Today",
  this_week: "This week",
  track: "Keep tracking",
};

/** Longest-first so a member scanning top-down meets the most immediate horizon. */
const HORIZON_ORDER: GatewayNextStep["horizon"][] = ["today", "this_week", "track"];

interface RecommendationBlockProps {
  recommendations?: GatewayRecommendation[] | null;
  nextSteps?: GatewayNextStep[] | null;
  /** Overrides the default heading where the surrounding page already labels it. */
  heading?: string;
}

function isRecommendation(value: unknown): value is GatewayRecommendation {
  return (
    !!value &&
    typeof value === "object" &&
    typeof (value as GatewayRecommendation).what === "string" &&
    (value as GatewayRecommendation).what.trim().length > 0
  );
}

function isNextStep(value: unknown): value is GatewayNextStep {
  return (
    !!value &&
    typeof value === "object" &&
    typeof (value as GatewayNextStep).action === "string" &&
    (value as GatewayNextStep).action.trim().length > 0
  );
}

export default function RecommendationBlock({
  recommendations,
  nextSteps,
  heading = "What you can try",
}: RecommendationBlockProps) {
  const [showAll, setShowAll] = useState(false);

  const recs = (recommendations ?? []).filter(isRecommendation);
  const steps = (nextSteps ?? []).filter(isNextStep);

  if (recs.length === 0 && steps.length === 0) return null;

  const ordered = HORIZON_ORDER.flatMap((horizon) =>
    steps.filter((step) => step.horizon === horizon),
  );
  const visibleRecs = showAll ? recs : recs.slice(0, 2);

  return (
    <div className="mt-5 rounded-3xl border border-emerald-100 bg-emerald-50/40 p-4 sm:p-5">
      <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
        <Lightbulb className="h-3.5 w-3.5" aria-hidden />
        Suggestions
      </p>
      <h3 className="mt-2 text-lg font-extrabold tracking-tight text-slate-900">{heading}</h3>
      <p className="mt-1 text-xs leading-relaxed text-slate-600">
        Drawn from your own entries and the approved sources behind this reading.
      </p>

      {recs.length > 0 && (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {visibleRecs.map((rec, index) => (
            <li
              key={`${rec.category ?? "suggestion"}-${index}`}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              {rec.category && (
                <span className="w-fit rounded-md bg-violet-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-700">
                  {rec.category}
                </span>
              )}
              <p className="mt-2 text-sm font-bold leading-snug text-slate-900">{rec.what}</p>
              {rec.why && (
                <p className="mt-1.5 flex-1 text-xs leading-relaxed text-slate-600">{rec.why}</p>
              )}
              {rec.start && (
                <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold leading-relaxed text-emerald-900">
                  Start: {rec.start}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      {recs.length > 2 && (
        <button
          type="button"
          onClick={() => setShowAll((value) => !value)}
          className="mt-3 min-h-11 text-xs font-bold text-emerald-800 underline underline-offset-4"
        >
          {showAll ? "Show fewer suggestions" : `Show all ${recs.length} suggestions`}
        </button>
      )}

      {ordered.length > 0 && (
        <div className="mt-5 border-t border-emerald-100 pt-4">
          <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <Target className="h-3.5 w-3.5" aria-hidden />
            Your next steps
          </p>
          <ul className="mt-3 space-y-2">
            {ordered.map((step, index) => (
              <li
                key={`${step.horizon}-${index}`}
                className="flex flex-col gap-1 rounded-2xl bg-white p-3.5 shadow-sm sm:flex-row sm:items-start sm:gap-3"
              >
                <span className="w-fit shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 sm:w-28 sm:text-center">
                  {HORIZON_LABELS[step.horizon] ?? step.horizon}
                </span>
                <span className="text-sm leading-relaxed text-slate-700">{step.action}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <details className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-slate-600">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-semibold text-slate-800">
          <span className="min-w-0 flex-1 text-left">
            Where these suggestions come from
          </span>
          <ChevronDown className="h-4 w-4 shrink-0" aria-hidden />
        </summary>
        <p className="mt-3 text-xs leading-relaxed">
          The app calculated your patterns from what you logged. The model only interpreted them and
          proposed these steps. Any suggestion that could not be traced to an approved source was
          removed before this page loaded.
        </p>
        <p className="mt-2 text-xs leading-relaxed">
          These are wellness suggestions for personal reflection. They are not a diagnosis and not a
          substitute for advice from your own clinician.
        </p>
      </details>
    </div>
  );
}