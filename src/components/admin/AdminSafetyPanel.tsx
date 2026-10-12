"use client";

import { useEffect, useState } from "react";
import { AdminBarChart } from "@/components/admin/AdminCharts";
import { adminClient, type AdminMetrics, type AdminScorecard } from "@/lib/admin/adminClient";
import { Pulse } from "@/components/ui/LoadState";

function dash(value: number | string | null | undefined): string {
  return value == null ? "—" : String(value);
}

export function AdminSafetyPanel() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [scorecard, setScorecard] = useState<AdminScorecard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [runNotice, setRunNotice] = useState<string | null>(null);
  const [running, setRunning] = useState(false);

  function loadMetrics() {
    void adminClient.metrics().then((result) => {
      if (!result.ok || !result.data) {
        setError(result.message || "Flag counts are unavailable right now.");
        return;
      }
      setError(null);
      setMetrics(result.data);
      setScorecard(result.data.scorecard);
    });
  }

  useEffect(() => {
    loadMetrics();
  }, []);

  const points = metrics?.flagSeverity
    ? [
        { label: "Low", value: metrics.flagSeverity.low, color: "#94A3B8" },
        { label: "Medium", value: metrics.flagSeverity.medium, color: "#D97706" },
        { label: "High", value: metrics.flagSeverity.high, color: "#E11D48" },
      ]
    : null;

  const card = scorecard;

  return (
    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Evaluation priorities</h2>
          <p className="mt-1 text-xs text-slate-500">
            Gold-case pass rate and citation issues appear when an evaluation run is stored.
          </p>
        </div>
        <button
          type="button"
          disabled={running}
          onClick={() => {
            setRunning(true);
            setRunNotice(null);
            void adminClient.runEvaluation().then((result) => {
              setRunning(false);
              if (!result.ok || !result.data) {
                setError(result.message || "The baseline evaluation did not finish.");
                return;
              }
              setError(null);
              setScorecard(result.data.summary);
              setRunNotice("Baseline evaluation completed.");
              loadMetrics();
            });
          }}
          className="h-10 rounded-xl bg-[#7C5CFC] px-4 text-xs font-semibold text-white disabled:opacity-60"
        >
          {running ? "Running…" : "Run baseline"}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "P0", value: card?.p0 },
          { label: "P1", value: card?.p1 },
          { label: "P2", value: card?.p2 },
          { label: "P3", value: card?.p3 },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xl font-bold text-slate-900">{dash(item.value)}</p>
            <p className="mt-0.5 text-[11px] font-semibold text-slate-500">{item.label}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xl font-bold text-slate-900">{dash(card?.goldCasePassRate)}</p>
          <p className="mt-0.5 text-[11px] font-semibold text-slate-500">Gold-case pass rate</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xl font-bold text-slate-900">{dash(card?.citationIssues)}</p>
          <p className="mt-0.5 text-[11px] font-semibold text-slate-500">Citation issues</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-xl font-bold text-slate-900">{dash(card?.nonDiagnosticViolations)}</p>
          <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
            Non-diagnostic violations
          </p>
        </div>
      </div>
      {card?.latestRunAt == null ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
          No evaluation run is recorded yet. Those counts stay empty rather than
          defaulting to zero.
        </p>
      ) : (
        <p className="text-xs text-slate-500">Latest run: {String(card.latestRunAt)}</p>
      )}
      {runNotice && <p className="text-xs font-semibold text-emerald-700">{runNotice}</p>}
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
