"use client";

import { useEffect, useState } from "react";
import { Activity, BarChart3, LineChart, Moon, Smile, Zap } from "lucide-react";
import { memberClient } from "@/lib/member/memberClient";
import type {
  MemberProgressData,
  TrackingRange,
} from "@/lib/member/memberTypes";

const metrics = [
  { key: "symptoms", label: "Symptoms", icon: Activity },
  { key: "mood", label: "Mood", icon: Smile },
  { key: "sleep", label: "Sleep", icon: Moon },
  { key: "energy", label: "Energy", icon: Zap },
] as const;

export default function ProgressPage() {
  const [range, setRange] = useState<TrackingRange>("7d");
  const [data, setData] = useState<MemberProgressData | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    setData(null);
    void memberClient.getProgress(range).then((result) => {
      if (!active) return;
      if (result.success && result.data) setData(result.data);
      else setError(result.message);
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
          <div className="grid gap-3 sm:grid-cols-4">
            {metrics.map(({ key, label, icon: Icon }) => (
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
              </div>
            ))}
          </div>
          <section className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-violet-600" />
              <h2 className="text-xl font-extrabold text-slate-900">
                Recorded signals
              </h2>
            </div>
            {data.entryCount === 0 ? (
              <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <LineChart className="mx-auto h-8 w-8 text-slate-400" />
                <h3 className="mt-3 text-sm font-bold text-slate-900">
                  Your picture will build here
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Log a few daily check-ins to see descriptive trends.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {metrics.map(({ key, label }) => (
                  <div key={key}>
                    <div className="mb-1 flex justify-between text-xs font-bold text-slate-600">
                      <span>{label}</span>
                      <span>{data.points[key].length} entries</span>
                    </div>
                    <div className="flex h-12 items-end gap-1 rounded-xl bg-slate-50 p-2">
                      {data.points[key].map((point) => (
                        <div
                          key={`${key}-${point.date}`}
                          title={`${point.date}: ${point.value}`}
                          className="min-w-2 flex-1 rounded-t bg-linear-to-t from-violet-600 to-rose-400"
                          style={{
                            height: `${Math.max(12, point.value * 20)}%`,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
