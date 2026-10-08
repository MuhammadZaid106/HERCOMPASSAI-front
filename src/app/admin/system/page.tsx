"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminClient, type SystemCheck } from "@/lib/admin/adminClient";
import { TableSkeleton } from "@/components/ui/LoadState";

const STATUS_LABEL: Record<SystemCheck["status"], string> = {
  ready: "Ready",
  attention: "Needs a look",
  not_connected: "Not connected",
  unchecked: "Not probed",
};

export default function AdminSystemPage() {
  const [checks, setChecks] = useState<SystemCheck[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void adminClient.system(true).then((result) => {
      if (!active) return;
      if (!result.ok || !result.data) {
        setError(result.message || "System checks are unavailable right now.");
        return;
      }
      setError(null);
      setChecks(result.data.checks);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <AdminShell title="System health" subtitle="What answered just now">
      <div className="space-y-5">
        <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
          The gateway row is a live probe. Billing stays not connected until a
          provider exists. Mail is reported as configured or not. This page does
          not send a message.
        </p>
        {error && (
          <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </p>
        )}
        {!checks && !error && <TableSkeleton rows={7} />}
        {checks && (
          <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white shadow-xs">
            {checks.map((check) => (
              <li key={check.id} className="flex flex-wrap items-baseline justify-between gap-3 px-4 py-4">
                <div>
                  <p className="font-semibold text-slate-900">{check.label}</p>
                  <p className="mt-1 text-sm text-slate-600">{check.detail}</p>
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {STATUS_LABEL[check.status]}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminShell>
  );
}
