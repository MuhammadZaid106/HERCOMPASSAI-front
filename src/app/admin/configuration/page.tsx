"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminClient } from "@/lib/admin/adminClient";
import { TableSkeleton } from "@/components/ui/LoadState";

export default function AdminConfigurationPage() {
  const [cap, setCap] = useState("");
  const [mail, setMail] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void adminClient.settings().then((result) => {
      if (!active) return;
      if (!result.ok || !result.data) {
        setError(result.message || "Settings are unavailable right now.");
        return;
      }
      setError(null);
      setCap(String(result.data.foundingCap));
      setMail(result.data.mailConfigured);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <AdminShell title="Configuration" subtitle="Settings the app enforces">
      <div className="max-w-xl space-y-5">
        <p className="text-sm leading-relaxed text-slate-600">
          Billing is not connected, so prices are not edited here. Mail is shown
          as configured or not. Passwords stay in the server environment.
        </p>
        {error && (
          <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </p>
        )}
        {mail === null && !error && <TableSkeleton rows={3} />}
        {mail !== null && (
          <form
            className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
            onSubmit={(event) => {
              event.preventDefault();
              setNotice(null);
              void adminClient.saveSettings(Number(cap)).then((result) => {
                if (!result.ok || !result.data) {
                  setError(result.message || "That cap was not saved.");
                  return;
                }
                setError(null);
                setCap(String(result.data.foundingCap));
                setNotice("Cap saved.");
              });
            }}
          >
            <p className="text-sm text-slate-700">Billing is not connected.</p>
            <p className="text-sm text-slate-700">{mail ? "Mail is configured." : "Mail is not configured."}</p>
            <label className="block text-sm font-semibold text-slate-700">
              Founding Women cap
              <input
                type="number"
                min={1}
                max={10000}
                value={cap}
                onChange={(event) => setCap(event.target.value)}
                className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
              />
            </label>
            {notice && <p className="text-sm text-slate-600">{notice}</p>}
            <button type="submit" className="h-11 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white">
              Save cap
            </button>
          </form>
        )}
      </div>
    </AdminShell>
  );
}
