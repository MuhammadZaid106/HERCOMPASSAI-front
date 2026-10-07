"use client";

import { useEffect, useState } from "react";
import { AdminBarChart } from "@/components/admin/AdminCharts";
import { adminClient, type AdminMetrics } from "@/lib/admin/adminClient";
import { Pulse } from "@/components/ui/LoadState";

export function AdminSafetyPanel() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void adminClient.metrics().then((result) => {
      if (!active) return;
      if (!result.ok || !result.data) {
        setError(result.message || "Flag counts are unavailable right now.");
        return;
      }
      setMetrics(result.data);
    });
    return () => {
      active = false;
    };
  }, []);

  const points = metrics?.flagSeverity
    ? [
        { label: "Low", value: metrics.flagSeverity.low, color: "#94A3B8" },
        { label: "Medium", value: metrics.flagSeverity.medium, color: "#D97706" },
        { label: "High", value: metrics.flagSeverity.high, color: "#E11D48" },
      ]
    : null;

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div>
        <h2 className="text-sm font-bold text-slate-900">Evaluation priorities</h2>
        <p className="mt-1 text-xs text-slate-500">
          Gold-case pass rate and citation issues appear when an evaluation run is stored.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {["P0", "P1", "P2", "P3"].map((label) => (
          <div key={label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xl font-bold text-slate-900">—</p>
            <p className="mt-0.5 text-[11px] font-semibold text-slate-500">{label}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xl font-bold text-slate-900">—</p>
          <p className="mt-0.5 text-[11px] font-semibold text-slate-500">Gold-case pass rate</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xl font-bold text-slate-900">—</p>
          <p className="mt-0.5 text-[11px] font-semibold text-slate-500">Citation issues</p>
        </div>
      </div>
      <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
        No evaluation run is recorded yet. Those counts stay empty rather than
        defaulting to zero.
      </p>
      <div>
        <h3 className="text-sm font-bold text-slate-900">Review flags by severity</h3>
        <div className="mt-3">
          {error && (
            <p role="alert" className="text-sm text-rose-800">
              {error}
            </p>
          )}
          {!error && !metrics && (
            <div aria-busy="true" aria-label="Loading">
              <Pulse className="h-40 rounded-xl" />
            </div>
          )}
          {points && <AdminBarChart empty="Nothing here yet." points={points} />}
          {metrics && !metrics.flagSeverity && (
            <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-600">
              Nothing here yet. No review flags have been recorded.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
