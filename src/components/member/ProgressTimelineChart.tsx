"use client";

import type { ProgressMetricKey } from "@/lib/member/progressChartUtils";
import {
  buildTimelineDates,
  formatTimelineDateShort,
  formatTimelineDayLabel,
  getMetricChartMeta,
  pointsByDate,
} from "@/lib/member/progressChartUtils";
import type { TrackingRange } from "@/lib/member/memberTypes";

interface ProgressTimelineChartProps {
  metricKey: ProgressMetricKey;
  range: TrackingRange;
  points: Array<{ date: string; value: number }>;
}

export function ProgressTimelineChart({
  metricKey,
  range,
  points,
}: ProgressTimelineChartProps) {
  const meta = getMetricChartMeta(metricKey);
  const timeline = buildTimelineDates(range);
  const byDate = pointsByDate(points);
  const loggedCount = points.length;
  const isWeekView = range === "7d";

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">{meta.title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-slate-600">
            {meta.unit}. Higher fill = higher value on that scale.
          </p>
        </div>
        <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-800 ring-1 ring-violet-200/80">
          {loggedCount} / {timeline.length} days logged
        </span>
      </div>

      {isWeekView && (
        <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-600 sm:grid-cols-4">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded border border-violet-300 bg-violet-50" />
            Logged day
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded border border-dashed border-slate-300 bg-slate-50" />
            No entry
          </span>
          <span className="col-span-2 flex items-center gap-2 sm:col-span-2">
            <span className="h-2 flex-1 max-w-[80px] rounded-full bg-slate-200">
              <span className="block h-full w-1/2 rounded-full bg-violet-600" />
            </span>
            Fill bar = your level that day
          </span>
        </div>
      )}

      <div
        className={`mt-4 w-full ${isWeekView ? "grid grid-cols-7 gap-2" : "grid grid-cols-7 gap-1.5 sm:gap-2"}`}
        role="img"
        aria-label={`${meta.title} daily log for the selected period`}
      >
        {timeline.map((date) => {
          const value = byDate.get(date);
          const hasLog = value !== undefined;
          const fillPct = hasLog
            ? Math.max(8, Math.round((value / meta.max) * 100))
            : 0;

          return (
            <div
              key={date}
              className={`flex min-w-0 flex-col rounded-xl border p-2 text-center sm:p-2.5 ${
                hasLog
                  ? "border-violet-200 bg-violet-50/90 shadow-sm"
                  : "border-dashed border-slate-200 bg-slate-50/80"
              } ${isWeekView ? "min-h-[108px]" : "min-h-[88px]"}`}
              title={
                hasLog
                  ? `${date}: ${meta.valueLabel(value)}`
                  : `${date}: no check-in for ${meta.title.toLowerCase()}`
              }
            >
              <span className="text-[11px] font-extrabold text-slate-800 sm:text-xs">
                {formatTimelineDayLabel(date, range)}
              </span>
              <span className="text-[10px] font-medium text-slate-500">
                {formatTimelineDateShort(date)}
              </span>

              <div className="mt-2 flex flex-1 flex-col justify-end">
                <div
                  className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200/90"
                  aria-hidden
                >
                  {hasLog && (
                    <div
                      className="h-full rounded-full bg-linear-to-r from-violet-600 to-rose-500 transition-[width]"
                      style={{ width: `${fillPct}%` }}
                    />
                  )}
                </div>
                <p
                  className={`mt-2 line-clamp-2 text-[10px] font-semibold leading-tight sm:text-[11px] ${
                    hasLog ? "text-violet-900" : "text-slate-400"
                  }`}
                >
                  {hasLog ? meta.valueLabel(value) : "No log"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
