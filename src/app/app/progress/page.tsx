"use client";

import { useEffect, useState } from "react";
import {
  Activity,
  BarChart3,
  Flame,
  LineChart,
  Minus,
  Moon,
  Smile,
  TrendingDown,
  TrendingUp,
  Zap,
} from "lucide-react";
import { memberClient } from "@/lib/member/memberClient";
import type {
  DomainTrend,
  MemberProgressData,
  TrackingRange,
  TrendDirection,
} from "@/lib/member/memberTypes";
import { ProgressTimelineChart } from "@/components/member/ProgressTimelineChart";
import { formatChangePercent, trendLabel } from "@/lib/member/trendDisplay";
import type { ProgressMetricKey } from "@/lib/member/progressChartUtils";

const metrics = [
  { key: "symptoms", trendKey: "symptoms", label: "Symptoms", icon: Activity },
  { key: "mood", trendKey: "mood", label: "Mood", icon: Smile },
  { key: "sleep", trendKey: "sleep", label: "Sleep", icon: Moon },
  { key: "energy", trendKey: "energy", label: "Energy", icon: Zap },
] as const;

function TrendBadge({ domain }: { domain: DomainTrend }) {
  const Icon =
    domain.trend === "increasing"
      ? TrendingUp
      : domain.trend === "decreasing"
        ? TrendingDown
        : Minus;
  const tone: Record<TrendDirection, string> = {
    increasing: "bg-amber-50 text-amber-800 border-amber-200",
    decreasing: "bg-sky-50 text-sky-800 border-sky-200",
    stable: "bg-slate-50 text-slate-700 border-slate-200",
  };
  return (
    <span
      className={`mt-2 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${tone[domain.trend]}`}
    >
      <Icon className="h-3 w-3" />
      {trendLabel(domain.trend)}
      {domain.sufficientData && domain.changePercent !== null && (
        <span className="normal-case">
          ({formatChangePercent(domain.changePercent)})
        </span>
      )}
    </span>
  );
}

export default function ProgressPage() {
  const [range, setRange] = useState<TrackingRange>("7d");
  const [data, setData] = useState<MemberProgressData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setError(null);
    setData(null);
    void memberClient.getProgress(range).then((result) => {
      if (!active) return;
      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.message || "We couldn't load your progress.");
      }
    });
    return () => {
      active = false;
    };
  }, [range]);
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-violet-700">
          Your progress
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
          See what is changing over time
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          These are descriptive patterns from your entries. They do not
          establish medical causes or diagnoses.
        </p>
      </div>
      <div className="flex gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
        {(["7d", "30d", "90d"] as TrackingRange[]).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setRange(option)}
            className={`rounded-xl px-4 py-2 text-sm font-bold ${range === option ? "bg-violet-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}
          >
            {option === "7d"
              ? "7 days"
              : option === "30d"
                ? "30 days"
                : "90 days"}
          </button>
        ))}
      </div>
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}
      {!data ? (
        <div className="h-72 animate-pulse rounded-3xl bg-slate-100" />
      ) : (
        <>
          {data.trends && !data.trends.insufficientData && (
            <section className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-violet-200/80 bg-violet-50/50 p-4">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-800">
                  <Flame className="h-4 w-4" />
                  Check-in streak
                </div>
                <p className="mt-2 text-2xl font-extrabold text-slate-900">
                  {data.trends.checkInStreak}{" "}
                  <span className="text-sm font-bold text-slate-600">
                    {data.trends.checkInStreak === 1 ? "day" : "days"}
                  </span>
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Logging consistency
                </p>
                <p className="mt-2 text-2xl font-extrabold text-slate-900">
                  {data.trends.consistencyScore}%
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  {data.trends.daysWithAnyEntry} days with any entry in this
                  window
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Symptom frequency
                </p>
                <p className="mt-2 text-2xl font-extrabold text-slate-900">
                  {data.trends.symptomFrequency ?? "—"}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Avg. symptoms logged per day (when logged)
                </p>
              </div>
            </section>
          )}

          <div className="grid gap-3 sm:grid-cols-4">
            {metrics.map(({ key, trendKey, label, icon: Icon }) => {
              const domain = data.trends?.[trendKey];
              return (
                <div
                  key={key}
                  className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>{label}</span>
                    <Icon className="h-4 w-4 text-violet-600" />
                  </div>
                  <p className="mt-3 text-2xl font-extrabold text-slate-900">
                    {data.averages[key]}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Average recorded level
                  </p>
                  {domain && <TrendBadge domain={domain} />}
                </div>
              );
            })}
          </div>

          {data.trends?.patternIndicators &&
            data.trends.patternIndicators.length > 0 && (
              <section className="rounded-2xl border border-indigo-200/80 bg-indigo-50/40 p-5">
                <h2 className="text-sm font-extrabold text-slate-900">
                  Pattern notes (deterministic)
                </h2>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-700">
                  {data.trends.patternIndicators.map((line) => (
                    <li key={line}>• {line}</li>
                  ))}
                </ul>
              </section>
            )}

          <section className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-start gap-2">
              <BarChart3 className="mt-0.5 h-5 w-5 shrink-0 text-violet-600" />
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Daily log timeline
                </h2>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
                  One column per day in your selected window. This shows what you
                  recorded—not a medical diagnosis or proof of cause.
                </p>
              </div>
            </div>
            {data.entryCount === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <LineChart className="mx-auto h-8 w-8 text-slate-400" />
                <h3 className="mt-3 text-sm font-bold text-slate-900">
                  Your picture will build here
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Use Daily check-in a few times to fill in the timeline.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {metrics.map(({ key }) => (
                  <ProgressTimelineChart
                    key={key}
                    metricKey={key as ProgressMetricKey}
                    range={range}
                    points={data.points[key]}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
