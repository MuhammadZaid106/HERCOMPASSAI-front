"use client";

import { useEffect, useState } from "react";
import { AdminBarChart, AdminDonut } from "@/components/admin/AdminCharts";
import { AdminShell, AdminStat } from "@/components/admin/AdminShell";
import { adminClient, type AdminMetrics } from "@/lib/admin/adminClient";
import { INVITE_LABEL, PLAN_LABEL, shortDay } from "@/lib/admin/labels";
import { DashboardSkeleton } from "@/components/ui/LoadState";
import { HeartHandshake, Timer, Users } from "lucide-react";

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

export default function AdminAnalyticsPage() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void adminClient.metrics(30).then((result) => {
      if (!active) return;
      if (!result.ok || !result.data) {
        setError(result.message || "Counts are unavailable right now.");
        return;
      }
      setError(null);
      setMetrics(result.data);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <AdminShell title="Analytics" subtitle="The same counts as home, over 30 days">
      <div className="space-y-6">
        <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
          New member accounts cover the last 30 days. Plan and invitation splits
          are current totals, the same figures as the home desk.
        </p>
        {error && (
          <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </p>
        )}
        {!metrics && !error && <DashboardSkeleton />}
        {metrics && (
          <>
            <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
              <AdminStat label="Members" value={metrics.members} icon={Users} />
              <AdminStat label="Snapshots" value={metrics.snapshots} icon={Timer} />
              <AdminStat
                label="Median time to value"
                value={metrics.medianTtfv ?? "—"}
                icon={Timer}
              />
              <AdminStat label="Open AI flags" value={metrics.openAiFlags} icon={Users} />
              <AdminStat
                label="Partner connections"
                value={metrics.acceptedPartnerConnections}
                icon={HeartHandshake}
              />
            </div>
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900">New member accounts</h3>
              <p className="mt-1 text-xs text-slate-500">Last 30 days, UTC</p>
              <div className="mt-4 w-full min-w-0">
                <AdminBarChart
                  empty="Nothing here yet."
                  points={metrics.signupsByDay.map((row) => ({
                    label: shortDay(row.day),
                    value: row.count,
                    color: "#7C5CFC",
                  }))}
                />
              </div>
            </section>
            <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900">Members by plan</h3>
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
              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900">Partner invitations</h3>
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
              </article>
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900">Funnel intervals</h3>
              <p className="mt-1 text-xs text-slate-500">
                Median time between first-write stamps. A dash means that pair has no
                completed samples yet. Overall time to value (signup → first saved
                snapshot) stays in the card above.
              </p>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {(metrics.funnelIntervals ?? []).map((row) => (
                  <li
                    key={row.id}
                    className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3"
                  >
                    <p className="text-xs font-medium text-slate-500">{row.label}</p>
                    <p className="mt-1 text-lg font-bold tabular-nums text-slate-900">
                      {row.median ?? "—"}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {row.sampleSize === 0
                        ? "No samples yet"
                        : row.sampleSize === 1
                          ? "1 member"
                          : `${row.sampleSize} members`}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900">Product events</h3>
              <p className="mt-1 text-xs text-slate-500">
                Counts from the event stream only — zeros mean nothing was recorded in that window.
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[28rem] text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                      <th className="py-2 pr-4 font-semibold">Event</th>
                      <th className="py-2 pr-4 font-semibold">Last 14 days</th>
                      <th className="py-2 font-semibold">Last 30 days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(metrics.productEvents?.last14Days ?? []).map((row) => {
                      const count30 =
                        metrics.productEvents.last30Days.find(
                          (item) => item.eventName === row.eventName,
                        )?.count ?? 0;
                      return (
                        <tr key={row.eventName} className="border-b border-slate-100 last:border-0">
                          <td className="py-2.5 pr-4 font-medium text-slate-900">{row.eventName}</td>
                          <td className="py-2.5 pr-4 tabular-nums text-slate-700">{row.count}</td>
                          <td className="py-2.5 tabular-nums text-slate-700">{count30}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </div>
    </AdminShell>
  );
}
