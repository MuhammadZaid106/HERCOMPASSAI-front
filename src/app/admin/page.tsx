"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Brain,
  HeartHandshake,
  Server,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  ADMIN_NAV,
  AdminShell,
  AdminStat,
} from "@/components/admin/AdminShell";
import { AdminBarChart, AdminDonut } from "@/components/admin/AdminCharts";
import { adminClient, type AdminMetrics, type SystemCheck } from "@/lib/admin/adminClient";
import { INVITE_LABEL, PLAN_LABEL, shortDay } from "@/lib/admin/labels";
import { DashboardSkeleton } from "@/components/ui/LoadState";

const PLAN_COLOR: Record<string, string> = {
  free: "#94A3B8",
  plus: "#7C5CFC",
  premium: "#6366F1",
};

const INVITE_COLOR: Record<string, string> = {
  sent: "#E8A598",
  accepted: "#5EAE8A",
  declined: "#94A3B8",
  revoked: "#E11D48",
};

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [checks, setChecks] = useState<SystemCheck[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void adminClient.metrics().then((result) => {
      if (!active) return;
      if (!result.ok || !result.data) {
        setError(result.message || "The operations counts are unavailable right now.");
        setMetrics(null);
        return;
      }
      setError(null);
      setMetrics(result.data);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    void adminClient.system(false).then((result) => {
      if (!active) return;
      if (result.ok && result.data) setChecks(result.data.checks);
    });
    return () => {
      active = false;
    };
  }, []);

  const severityPoints = metrics?.flagSeverity
    ? [
        { label: "Low", value: metrics.flagSeverity.low, color: "#94A3B8" },
        { label: "Medium", value: metrics.flagSeverity.medium, color: "#D97706" },
        { label: "High", value: metrics.flagSeverity.high, color: "#E11D48" },
      ]
    : null;

  const scorecard = metrics?.scorecard;

  return (
    <AdminShell title="Admin Dashboard" subtitle="HerCompassAI Operations Center">
      <div className="space-y-8">
        <section className="rounded-2xl border border-violet-200/70 bg-linear-to-r from-violet-50 to-indigo-50 p-6">
          <h2 className="text-lg font-bold text-slate-900">
            What is happening across HerCompassAI
          </h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-600">
            Counts come from accounts, snapshots, partner invitations, and the AI
            review queue. A dash means that measure is not recorded yet.
          </p>
        </section>

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800"
          >
            {error}
          </p>
        )}

        {!metrics && !error && <DashboardSkeleton />}

        {metrics && (
          <>
            <section>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">
                Platform overview
              </h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <AdminStat label="Members" value={metrics.members} icon={Users} tone="violet" />
                <AdminStat label="Snapshots" value={metrics.snapshots} icon={Activity} tone="rose" />
                <AdminStat
                  label="Median time to value"
                  value={metrics.medianTtfv ?? "—"}
                  icon={TrendingUp}
                  tone="amber"
                />
                <AdminStat
                  label="Open AI flags"
                  value={metrics.openAiFlags}
                  icon={AlertTriangle}
                  tone="emerald"
                />
                <AdminStat
                  label="Partner connections"
                  value={metrics.acceptedPartnerConnections}
                  icon={HeartHandshake}
                  tone="sky"
                />
              </div>
              <p className="mt-3 text-xs text-slate-500">
                Partner connections counts accepted invitations. Median time to value
                is the middle time from a new account to its saved snapshot.
              </p>
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900">New member accounts</h3>
                <p className="mt-1 text-xs text-slate-500">Last 14 days, UTC</p>
                <div className="mt-4">
                  <AdminBarChart
                    empty="Nothing here yet."
                    points={metrics.signupsByDay.map((row) => ({
                      label: shortDay(row.day),
                      value: row.count,
                      color: "#7C5CFC",
                    }))}
                  />
                </div>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900">Members by plan</h3>
                <p className="mt-1 text-xs text-slate-500">Member accounts only</p>
                <div className="mt-4">
                  <AdminDonut
                    empty="Nothing here yet."
                    points={metrics.membersByPlan.map((row) => ({
                      label: PLAN_LABEL[row.plan] ?? row.plan,
                      value: row.count,
                      color: PLAN_COLOR[row.plan],
                    }))}
                  />
                </div>
              </article>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900">Partner invitations</h3>
              <p className="mt-1 text-xs text-slate-500">
                Waiting, accepted, declined, and revoked. No shared health detail.
              </p>
              <div className="mt-4 w-full min-w-0">
                <AdminBarChart
                  empty="Nothing here yet."
                  points={metrics.invitesByState.map((row) => ({
                    label: INVITE_LABEL[row.status] ?? row.status,
                    value: row.count,
                    color: INVITE_COLOR[row.status],
                  }))}
                />
              </div>
            </section>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <Brain className="h-4 w-4 text-violet-600" />
                    AI quality
                  </h3>
                  <Link href="/admin/ai" className="text-xs font-semibold text-violet-700">
                    Open queue
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "P0", value: scorecard?.p0 ?? null },
                    { label: "P1", value: scorecard?.p1 ?? null },
                    { label: "P2", value: scorecard?.p2 ?? null },
                    { label: "P3", value: scorecard?.p3 ?? null },
                  ].map((item) => (
                    <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <p className="text-xl font-bold text-slate-900">
                        {item.value == null ? "—" : item.value}
                      </p>
                      <p className="mt-0.5 text-[11px] font-semibold text-slate-500">{item.label}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xl font-bold text-slate-900">
                      {scorecard?.goldCasePassRate == null ? "—" : scorecard.goldCasePassRate}
                    </p>
                    <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
                      Gold-case pass rate
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xl font-bold text-slate-900">
                      {scorecard?.citationIssues == null ? "—" : scorecard.citationIssues}
                    </p>
                    <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
                      Citation issues
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-xl font-bold text-slate-900">
                      {scorecard?.nonDiagnosticViolations == null
                        ? "—"
                        : scorecard.nonDiagnosticViolations}
                    </p>
                    <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
                      Non-diagnostic violations
                    </p>
                  </div>
                </div>
                {scorecard?.latestRunAt == null ? (
                  <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
                    No evaluation run is recorded yet. Priority counts stay empty
                    rather than defaulting to zero.
                  </p>
                ) : (
                  <p className="mt-4 text-xs text-slate-500">
                    Latest evaluation run: {String(scorecard.latestRunAt)}
                  </p>
                )}
                <div className="mt-4">
                  {severityPoints ? (
                    <AdminBarChart empty="Nothing here yet." points={severityPoints} />
                  ) : (
                    <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-600">
                      Nothing here yet. No review flags have been recorded.
                    </p>
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <Server className="h-4 w-4 text-violet-600" />
                    System health
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Live
                  </span>
                </div>
                <ul className="space-y-2">
                  {(checks ?? []).map((check) => (
                    <li
                      key={check.id}
                      className="flex items-center justify-between gap-3 border-b border-slate-100 py-1.5 last:border-0"
                    >
                      <span className="text-sm font-medium text-slate-700">{check.label}</span>
                      <span className="text-right text-xs font-semibold text-slate-500">{check.detail}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/admin/system" className="mt-4 inline-block text-xs font-semibold text-violet-700">
                  Open system health
                </Link>
              </section>
            </div>
          </>
        )}

        <section>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">
            Sections
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {ADMIN_NAV.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs transition hover:border-violet-300"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="truncate text-sm font-semibold text-slate-700">{label}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}
