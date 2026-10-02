"use client";

import { usePathname } from "next/navigation";
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
  isAdminNavActive,
} from "@/components/admin/AdminShell";

/**
 * Operational status per subsystem.
 *
 * These were hardcoded to "Healthy" with no check behind them, which made the
 * panel decorative — worse than showing nothing, because it read as a working
 * monitor. Each row is honest about being unverified until a health endpoint
 * exists to verify it, so nothing here claims a green light it has not earned.
 */
const SERVICES = [
  "AI Gateway",
  "Database",
  "Authentication",
  "Evidence Service",
  "Analytics",
  "Notifications",
  "Billing",
] as const;

export default function AdminDashboard() {
  const pathname = usePathname();

  return (
    <AdminShell
      title="Admin Dashboard"
      subtitle="HerCompassAI Operations Center"
    >
      <div className="space-y-8">
        <section className="rounded-2xl border border-violet-200/70 bg-linear-to-r from-violet-50 to-indigo-50 p-6">
          <h2 className="text-lg font-bold text-slate-900">
            Welcome back. Here is what is happening across HerCompassAI.
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Platform metrics are shown as{" "}
            <span className="font-semibold text-slate-800">—</span> until a
            metrics endpoint is connected. Nothing here is estimated or faked.
          </p>
        </section>

        <section>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">
            Platform Overview
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <AdminStat label="Active Users" value="—" icon={Users} tone="violet" />
            <AdminStat label="Snapshots" value="—" icon={Activity} tone="rose" />
            <AdminStat
              label="Median TTFV"
              value="—"
              icon={TrendingUp}
              tone="amber"
            />
            <AdminStat label="AI Issues" value="—" icon={AlertTriangle} tone="emerald" />
            <AdminStat
              label="Partner Connections"
              value="—"
              icon={HeartHandshake}
              tone="sky"
            />
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Brain className="h-4 w-4 text-violet-600" />
                AI Quality Monitor
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                SCI Layer
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "P0 Issues", value: "—", tone: "text-slate-900" },
                { label: "P1 Issues", value: "—", tone: "text-slate-900" },
                { label: "P2 Issues", value: "—", tone: "text-slate-900" },
                { label: "P3 Issues", value: "—", tone: "text-slate-900" },
              ].map(({ label, value, tone }) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                >
                  <p className={`text-xl font-bold ${tone}`}>{value}</p>
                  <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
                    {label}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-800">
              No evaluation run is recorded yet. Severity counts stay empty
              rather than defaulting to zero, which would read as &ldquo;no problems&rdquo;.
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Server className="h-4 w-4 text-violet-600" />
                System Health
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Unverified
              </span>
            </div>
            <ul className="space-y-2">
              {SERVICES.map((service) => (
                <li
                  key={service}
                  className="flex items-center justify-between border-b border-slate-100 py-1.5 last:border-0"
                >
                  <span className="text-sm font-medium text-slate-700">
                    {service}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Not checked
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">
            Quick Access
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {ADMIN_NAV.slice(0, 8).map(({ label, href, icon: Icon }) => (
              <a
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-2xl border bg-white p-4 shadow-xs transition ${
                  isAdminNavActive(pathname, href)
                    ? "border-violet-300 ring-1 ring-violet-200"
                    : "border-slate-200 hover:border-violet-300"
                }`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="truncate text-sm font-semibold text-slate-700">
                  {label}
                </span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </AdminShell>
  );
}