"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  adminClient,
  type AdminProductSettings,
  type TrialEligibility,
} from "@/lib/admin/adminClient";
import { TRIAL_ELIGIBILITY_LABEL } from "@/lib/admin/labels";
import { TableSkeleton } from "@/components/ui/LoadState";

function priceIdLabel(set: boolean): string {
  return set ? "Set" : "Not set";
}

export default function AdminConfigurationPage() {
  const [settings, setSettings] = useState<AdminProductSettings | null>(null);
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
      setSettings(result.data);
    });
    return () => {
      active = false;
    };
  }, []);

  function update<K extends keyof AdminProductSettings>(key: K, value: AdminProductSettings[K]) {
    setSettings((current) => (current ? { ...current, [key]: value } : current));
  }

  return (
    <AdminShell title="Configuration" subtitle="Settings the app enforces">
      <div className="max-w-2xl space-y-5">
        <p className="text-sm leading-relaxed text-slate-600">
          Trial rules and display price labels live here. Stripe still owns charged
          amounts via env price ids. Secrets are never shown on this desk.
        </p>
        {error && (
          <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </p>
        )}
        {!settings && !error && <TableSkeleton rows={6} />}
        {settings && (
          <form
            className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs"
            onSubmit={(event) => {
              event.preventDefault();
              setNotice(null);
              void adminClient.saveSettings(settings).then((result) => {
                if (!result.ok || !result.data) {
                  setError(result.message || "Those settings were not saved.");
                  return;
                }
                setError(null);
                setSettings(result.data);
                setNotice("Settings saved.");
              });
            }}
          >
            <section className="space-y-3">
              <h2 className="text-sm font-bold text-slate-900">Connection facts</h2>
              <p className="text-sm text-slate-700">
                {settings.billingConnected
                  ? "Billing is configured (Stripe keys present)."
                  : "Billing is not connected."}
              </p>
              <p className="text-sm text-slate-700">
                {settings.mailConfigured ? "Mail is configured." : "Mail is not configured."}
              </p>
              <dl className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Plus monthly price id
                  </dt>
                  <dd className="mt-1 font-semibold text-slate-800">
                    {priceIdLabel(settings.stripePriceIds.plusMonthly)}
                  </dd>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Plus annual price id
                  </dt>
                  <dd className="mt-1 font-semibold text-slate-800">
                    {priceIdLabel(settings.stripePriceIds.plusAnnual)}
                  </dd>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Premium monthly price id
                  </dt>
                  <dd className="mt-1 font-semibold text-slate-800">
                    {priceIdLabel(settings.stripePriceIds.premiumMonthly)}
                  </dd>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Premium annual price id
                  </dt>
                  <dd className="mt-1 font-semibold text-slate-800">
                    {priceIdLabel(settings.stripePriceIds.premiumAnnual)}
                  </dd>
                </div>
              </dl>
            </section>

            <section className="space-y-3 border-t border-slate-100 pt-5">
              <h2 className="text-sm font-bold text-slate-900">Founding Women</h2>
              <label className="block text-sm font-semibold text-slate-700">
                Cap
                <input
                  type="number"
                  min={1}
                  max={10000}
                  value={settings.foundingCap}
                  onChange={(event) => update("foundingCap", Number(event.target.value))}
                  className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
                />
              </label>
            </section>

            <section className="space-y-3 border-t border-slate-100 pt-5">
              <h2 className="text-sm font-bold text-slate-900">Trial rules</h2>
              <p className="text-xs text-slate-500">
                Trial plan is Premium. Changing a charged price still happens in Stripe
                Dashboard and env.
              </p>
              <label className="block text-sm font-semibold text-slate-700">
                Trial duration (days)
                <input
                  type="number"
                  min={0}
                  max={365}
                  value={settings.trialDurationDays}
                  onChange={(event) => update("trialDurationDays", Number(event.target.value))}
                  className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Trial eligibility
                <select
                  value={settings.trialEligibility}
                  onChange={(event) =>
                    update("trialEligibility", event.target.value as TrialEligibility)
                  }
                  className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
                >
                  {(Object.keys(TRIAL_ELIGIBILITY_LABEL) as TrialEligibility[]).map((value) => (
                    <option key={value} value={value}>
                      {TRIAL_ELIGIBILITY_LABEL[value]}
                    </option>
                  ))}
                </select>
              </label>
              <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                Trial plan: {settings.trialPlan}
              </p>
            </section>

            <section className="space-y-3 border-t border-slate-100 pt-5">
              <h2 className="text-sm font-bold text-slate-900">Display price labels</h2>
              <p className="text-xs text-slate-500">
                These strings are for marketing and admin display only. They do not change
                what Stripe charges.
              </p>
              <label className="block text-sm font-semibold text-slate-700">
                Plus monthly
                <input
                  value={settings.plusPriceLabelMonthly}
                  onChange={(event) => update("plusPriceLabelMonthly", event.target.value)}
                  maxLength={80}
                  className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Plus annual
                <input
                  value={settings.plusPriceLabelAnnual}
                  onChange={(event) => update("plusPriceLabelAnnual", event.target.value)}
                  maxLength={80}
                  className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Premium monthly
                <input
                  value={settings.premiumPriceLabelMonthly}
                  onChange={(event) => update("premiumPriceLabelMonthly", event.target.value)}
                  maxLength={80}
                  className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-700">
                Premium annual
                <input
                  value={settings.premiumPriceLabelAnnual}
                  onChange={(event) => update("premiumPriceLabelAnnual", event.target.value)}
                  maxLength={80}
                  className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
                />
              </label>
            </section>

            {notice && <p className="text-sm text-slate-600">{notice}</p>}
            <button
              type="submit"
              className="h-11 rounded-xl bg-[#7C5CFC] px-5 text-sm font-semibold text-white"
            >
              Save settings
            </button>
          </form>
        )}
      </div>
    </AdminShell>
  );
}
