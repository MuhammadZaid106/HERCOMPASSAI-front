"use client";

import { useEffect, useState } from "react";
import { AdminDonut } from "@/components/admin/AdminCharts";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  adminClient,
  type AdminPlanCard,
  type SubscriptionStatusCount,
} from "@/lib/admin/adminClient";
import { SUBSCRIPTION_LABEL } from "@/lib/admin/labels";
import { BlockSkeleton } from "@/components/ui/LoadState";

const PLAN_COLOR: Record<string, string> = {
  free: "#94A3B8",
  plus: "#7C5CFC",
  premium: "#6366F1",
};

const STATUS_COLOR: Record<string, string> = {
  none: "#94A3B8",
  active: "#10B981",
  trialing: "#7C5CFC",
  past_due: "#F59E0B",
  canceled: "#64748B",
  other: "#6366F1",
};

export default function AdminSubscriptionsPage() {
  const [plans, setPlans] = useState<AdminPlanCard[] | null>(null);
  const [byStatus, setByStatus] = useState<SubscriptionStatusCount[] | null>(null);
  const [billingConnected, setBillingConnected] = useState(false);
  const [stripeCustomers, setStripeCustomers] = useState(0);
  const [pastDue, setPastDue] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void adminClient.plans().then((result) => {
      if (!active) return;
      if (!result.ok || !result.data) {
        setError(result.message || "Plans are unavailable right now.");
        return;
      }
      setError(null);
      setPlans(result.data.plans);
      setByStatus(result.data.subscriptionByStatus);
      setBillingConnected(result.data.billingConnected);
      setStripeCustomers(result.data.stripeCustomers);
      setPastDue(result.data.pastDue);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <AdminShell title="Subscriptions" subtitle="Plans and who is on each one">
      <div className="space-y-6">
        {plans &&
          (billingConnected ? (
            <p className="max-w-2xl rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-relaxed text-emerald-900">
              Stripe keys are present on this server. Counts below come from member
              accounts after webhook updates — not a live Stripe charge list.
            </p>
          ) : (
            <p className="max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900">
              Billing is not connected, so there are no payments, trials, or failed
              charges to show. The cards below are the plans the product already enforces.
            </p>
          ))}
        {error && (
          <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </p>
        )}
        {!plans && !error && <BlockSkeleton rows={3} />}
        {plans && byStatus && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Stripe customers
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{stripeCustomers}</p>
                <p className="text-xs text-slate-500">member accounts with a customer record</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Past due
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{pastDue}</p>
                <p className="text-xs text-slate-500">members marked past_due after a failed invoice</p>
              </article>
            </div>
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <h2 className="text-sm font-bold text-slate-900">Members by plan</h2>
              <div className="mt-4 w-full min-w-0">
                <AdminDonut
                  empty="Nothing here yet."
                  points={plans.map((plan) => ({
                    label: plan.label,
                    value: plan.memberCount,
                    color: PLAN_COLOR[plan.id],
                  }))}
                />
              </div>
            </section>
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <h2 className="text-sm font-bold text-slate-900">Subscription status</h2>
              <div className="mt-4 w-full min-w-0">
                <AdminDonut
                  empty="Nothing here yet."
                  points={byStatus.map((row) => ({
                    label: SUBSCRIPTION_LABEL[row.status] ?? row.status,
                    value: row.count,
                    color: STATUS_COLOR[row.status],
                  }))}
                />
              </div>
            </section>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {plans.map((plan) => (
                <article key={plan.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                  <p className="text-xs font-bold uppercase tracking-wider text-violet-700">{plan.label}</p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">{plan.memberCount}</p>
                  <p className="text-xs text-slate-500">member accounts</p>
                  <p className="mt-3 text-sm text-slate-700">{plan.summary}</p>
                  <ul className="mt-4 space-y-1.5 text-sm text-slate-600">
                    {plan.included.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </AdminShell>
  );
}
