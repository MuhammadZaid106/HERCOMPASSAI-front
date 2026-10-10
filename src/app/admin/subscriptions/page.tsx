"use client";

import { useEffect, useState } from "react";
import { AdminDonut } from "@/components/admin/AdminCharts";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  adminClient,
  type AdminBillingDesk,
  type AdminPlanCard,
  type SubscriptionStatusCount,
} from "@/lib/admin/adminClient";
import { PLAN_LABEL, SUBSCRIPTION_LABEL, shortDate } from "@/lib/admin/labels";
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

function formatAmount(cents: number | null, currency: string | null): string {
  if (cents == null) return "—";
  const code = (currency ?? "usd").toUpperCase();
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency: code,
    }).format(cents / 100);
  } catch {
    return `${(cents / 100).toFixed(2)} ${code}`;
  }
}

export default function AdminSubscriptionsPage() {
  const [plans, setPlans] = useState<AdminPlanCard[] | null>(null);
  const [byStatus, setByStatus] = useState<SubscriptionStatusCount[] | null>(null);
  const [billingConnected, setBillingConnected] = useState(false);
  const [stripeCustomers, setStripeCustomers] = useState(0);
  const [pastDue, setPastDue] = useState(0);
  const [desk, setDesk] = useState<AdminBillingDesk | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [gfUserId, setGfUserId] = useState("");
  const [gfLabel, setGfLabel] = useState("");
  const [gfNote, setGfNote] = useState("");

  function load() {
    void adminClient.plans().then((result) => {
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
      setDesk(result.data.billingDesk);
    });
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <AdminShell title="Subscriptions" subtitle="Plans and who is on each one">
      <div className="space-y-6">
        {plans &&
          (billingConnected ? (
            <p className="max-w-2xl rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-relaxed text-emerald-900">
              Stripe keys are present on this server. Counts below come from member
              accounts and webhook events — not a live Stripe invoice pull.
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
        {notice && <p className="text-sm text-slate-600">{notice}</p>}
        {!plans && !error && <BlockSkeleton rows={3} />}
        {plans && byStatus && desk && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
              <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Currently trialing
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-900">{desk.trials.length}</p>
                <p className="text-xs text-slate-500">members with subscription status trialing</p>
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

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <h2 className="text-sm font-bold text-slate-900">Recent payments</h2>
              <p className="mt-1 text-xs text-slate-500">
                Webhook events stored after Checkout and invoice updates.
              </p>
              {desk.recentEvents.length === 0 ? (
                <p className="mt-4 rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-600">
                  No payment events recorded yet.
                </p>
              ) : (
                <ul className="mt-4 divide-y divide-slate-100">
                  {desk.recentEvents.map((event) => (
                    <li key={event.id} className="flex flex-wrap items-baseline justify-between gap-2 py-3">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900">{event.summary}</p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {event.memberFirstName} · {event.type} · {event.status}
                          {event.plan ? ` · ${PLAN_LABEL[event.plan] ?? event.plan}` : ""}
                        </p>
                      </div>
                      <div className="text-right text-xs text-slate-500">
                        <p className="font-semibold text-slate-700">
                          {formatAmount(event.amountCents, event.currency)}
                        </p>
                        <p>{shortDate(event.occurredAt)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <h2 className="text-sm font-bold text-slate-900">Failed payments</h2>
              <p className="mt-1 text-xs text-slate-500">Events marked failed or past due.</p>
              {desk.failedPayments.length === 0 ? (
                <p className="mt-4 rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-600">
                  No failed payments recorded.
                </p>
              ) : (
                <ul className="mt-4 divide-y divide-slate-100">
                  {desk.failedPayments.map((row) => (
                    <li key={row.id} className="flex flex-wrap items-baseline justify-between gap-2 py-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{row.summary}</p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {row.memberFirstName} · {row.status}
                        </p>
                      </div>
                      <p className="text-xs text-slate-500">{shortDate(row.occurredAt)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <h2 className="text-sm font-bold text-slate-900">Trials</h2>
              <p className="mt-1 text-xs text-slate-500">Members currently marked trialing.</p>
              {desk.trials.length === 0 ? (
                <p className="mt-4 rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-600">
                  No members are trialing right now.
                </p>
              ) : (
                <ul className="mt-4 divide-y divide-slate-100">
                  {desk.trials.map((row) => (
                    <li key={row.userId} className="flex flex-wrap items-baseline justify-between gap-2 py-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{row.memberFirstName}</p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {row.email} · {PLAN_LABEL[row.plan] ?? row.plan}
                        </p>
                      </div>
                      <p className="text-xs text-slate-500">
                        {row.trialEndsAt ? `Ends ${shortDate(row.trialEndsAt)}` : "End date not stored"}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <h2 className="text-sm font-bold text-slate-900">Grandfathered plans</h2>
              <p className="mt-1 text-xs text-slate-500">
                Staff support notes only. This does not lock a Stripe price by itself.
              </p>
              <form
                className="mt-4 grid gap-3 sm:grid-cols-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  setNotice(null);
                  void adminClient
                    .saveGrandfathered({
                      userId: gfUserId.trim(),
                      label: gfLabel.trim(),
                      note: gfNote.trim(),
                    })
                    .then((result) => {
                      if (!result.ok) {
                        setError(result.message || "That grandfathered mark was not saved.");
                        return;
                      }
                      setError(null);
                      setGfUserId("");
                      setGfLabel("");
                      setGfNote("");
                      setNotice("Grandfathered price saved.");
                      load();
                    });
                }}
              >
                <label className="text-sm font-semibold text-slate-700">
                  Member user id
                  <input
                    value={gfUserId}
                    onChange={(event) => setGfUserId(event.target.value)}
                    required
                    className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700">
                  Price label
                  <input
                    value={gfLabel}
                    onChange={(event) => setGfLabel(event.target.value)}
                    required
                    maxLength={80}
                    className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
                  />
                </label>
                <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                  Note (optional)
                  <input
                    value={gfNote}
                    onChange={(event) => setGfNote(event.target.value)}
                    maxLength={280}
                    className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
                  />
                </label>
                <button
                  type="submit"
                  className="h-11 rounded-xl bg-[#7C5CFC] px-5 text-sm font-semibold text-white sm:col-span-2 sm:w-fit"
                >
                  Save grandfathered mark
                </button>
              </form>
              {desk.grandfathered.length === 0 ? (
                <p className="mt-4 rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-600">
                  No grandfathered marks yet.
                </p>
              ) : (
                <ul className="mt-4 divide-y divide-slate-100">
                  {desk.grandfathered.map((row) => (
                    <li key={row.id} className="py-3">
                      <p className="text-sm font-semibold text-slate-900">
                        {row.memberFirstName} · {row.label}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {row.email || row.userId}
                        {row.note ? ` · ${row.note}` : ""}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <h2 className="text-sm font-bold text-slate-900">Promotions</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">{desk.promotionsNote}</p>
            </section>
          </>
        )}
      </div>
    </AdminShell>
  );
}
