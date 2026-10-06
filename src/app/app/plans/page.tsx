"use client";

import { Check, Loader2, Minus, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  billingClient,
  type BillingInterval,
  type BillingStatus,
} from "@/lib/billing/billingClient";
import { memberClient } from "@/lib/member/memberClient";
import type {
  MemberPlanId,
  MemberSubscriptionData,
  PlanAccess,
} from "@/lib/member/memberTypes";

const PLAN_ORDER: MemberPlanId[] = ["free", "plus", "premium"];

function planRank(plan: MemberPlanId): number {
  return PLAN_ORDER.indexOf(plan);
}

function AccessMark({ access }: { access: PlanAccess }) {
  if (access === "included") {
    return (
      <span className="inline-flex items-center justify-center text-violet-700">
        <Check className="h-4 w-4" aria-hidden />
        <span className="sr-only">Included</span>
      </span>
    );
  }
  if (access === "limited") {
    return <span className="text-xs font-semibold text-slate-600">Limited</span>;
  }
  return (
    <span className="inline-flex items-center justify-center text-slate-300">
      <Minus className="h-4 w-4" aria-hidden />
      <span className="sr-only">Not included</span>
    </span>
  );
}

export default function PlansPage() {
  const [data, setData] = useState<MemberSubscriptionData | null>(null);
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [interval, setInterval] = useState<BillingInterval>("month");
  const [pending, setPending] = useState<"plus" | "premium" | "portal" | null>(
    null,
  );
  const [actionError, setActionError] = useState<string | null>(null);
  const [notice, setNotice] = useState<"success" | "cancelled" | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    void Promise.all([
      memberClient.getSubscription(),
      billingClient.getStatus(),
    ]).then(([subscription, billing]) => {
      if (!active) return;
      if (subscription.success && subscription.data) {
        setData(subscription.data);
        setError(null);
      } else {
        setData(null);
        setError(
          subscription.message ||
            "We couldn't complete that right now. Please try again.",
        );
      }
      if (billing.success && billing.data) {
        setStatus(billing.data);
      }
    });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const reload = useCallback(() => {
    setReloadKey((key) => key + 1);
  }, []);

  // Stripe redirects back here with ?status=success or ?status=cancelled.
  // Read it once, clear it from the URL, and refresh the plan when a payment
  // succeeded because the webhook can land a beat after the redirect. The
  // notice state is applied on a timer (not inline in the effect body) so the
  // URL read stays a pure external-system sync.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const result = params.get("status");
    if (result !== "success" && result !== "cancelled") return;

    params.delete("status");
    params.delete("session_id");
    const query = params.toString();
    window.history.replaceState(
      null,
      "",
      window.location.pathname + (query ? `?${query}` : "") + window.location.hash,
    );

    const applyTimer = window.setTimeout(() => setNotice(result), 0);
    const refreshTimer =
      result === "success" ? window.setTimeout(reload, 4000) : null;
    return () => {
      window.clearTimeout(applyTimer);
      if (refreshTimer) window.clearTimeout(refreshTimer);
    };
  }, [reload]);

  async function startCheckout(plan: "plus" | "premium") {
    setActionError(null);
    setPending(plan);
    const result = await billingClient.createCheckoutSession({
      plan,
      interval,
    });
    if (result.success && result.data?.url) {
      window.location.assign(result.data.url);
      return;
    }
    setPending(null);
    setActionError(
      result.message || "We couldn't start checkout. Please try again.",
    );
  }

  async function openPortal() {
    setActionError(null);
    setPending("portal");
    const result = await billingClient.createPortalSession(window.location.href);
    if (result.success && result.data?.url) {
      window.location.assign(result.data.url);
      return;
    }
    setPending(null);
    setActionError(
      result.message || "We couldn't open billing management. Please try again.",
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm leading-relaxed text-rose-800">
        <p className="font-semibold">We couldn&apos;t load plans.</p>
        <p className="mt-1">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-4" aria-busy="true">
        <div className="h-36 animate-pulse rounded-3xl bg-violet-100" />
        <div className="grid gap-3 lg:grid-cols-3">
          <div className="h-40 animate-pulse rounded-3xl bg-slate-100" />
          <div className="h-40 animate-pulse rounded-3xl bg-slate-100" />
          <div className="h-40 animate-pulse rounded-3xl bg-slate-100" />
        </div>
      </div>
    );
  }

  const billingReady = status?.isConfigured !== false;
  const currentRank = planRank(data.plan);
  const plusAdds = data.comparison.filter((row) =>
    row.access.free !== "included" && row.access.plus === "included"
  );

  // When the homepage pricing cards send a logged-in member here (?plan=plus),
  // scroll the requested card into view so the upgrade button is right there.
  useEffect(() => {
    if (data) {
      const requested = new URLSearchParams(window.location.search).get("plan");
      if (requested === "plus" || requested === "premium") {
        const el = document.getElementById(`plan-${requested}`);
        if (el) {
          const delay = window.setTimeout(
            () => el.scrollIntoView({ behavior: "smooth", block: "center" }),
            300,
          );
          return () => window.clearTimeout(delay);
        }
      }
    }
  }, [data]);

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="rounded-3xl bg-gradient-to-br from-violet-950 via-indigo-900 to-slate-900 p-6 text-white shadow-xl sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-violet-200">
          Current plan
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.label}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-violet-100">
          {data.summary} {data.description}
        </p>
        {status && status.hasStripeCustomer && (
          <div className="mt-5">
            <button
              type="button"
              onClick={openPortal}
              disabled={pending !== null}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-violet-900 shadow transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {pending === "portal" ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <ShieldCheck className="h-4 w-4" aria-hidden />
              )}
              Manage billing
            </button>
          </div>
        )}
      </header>

      {notice === "success" && !billingReady && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-800">
          <p className="font-semibold">
            Payment received, but billing isn&apos;t connected on this server.
          </p>
          <p className="mt-1">
            Your plan will update once the Stripe webhook reaches this backend.
            This page refreshes automatically in a few seconds.
          </p>
        </div>
      )}
      {notice === "success" && billingReady && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm leading-relaxed text-emerald-800">
          <p className="font-semibold">Payment successful — welcome aboard.</p>
          <p className="mt-1">
            Your plan will update within a few seconds. This page refreshes
            automatically.
          </p>
        </div>
      )}
      {notice === "cancelled" && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
          Checkout was cancelled. You have not been charged.
        </div>
      )}

      {status && !status.isConfigured && !billingReady && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-800">
          <p className="font-semibold">Billing is not connected yet.</p>
          <p className="mt-1">
            Stripe hasn&apos;t been configured on the server, so plan changes
            aren&apos;t available right now.
          </p>
        </div>
      )}

      {status &&
        data.plan !== "free" &&
        status.subscriptionStatus &&
        !["active", "trialing", "none"].includes(status.subscriptionStatus) && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm leading-relaxed text-rose-800">
            <p className="font-semibold">
              Subscription status: {status.subscriptionStatus.replace("_", " ")}
            </p>
            <p className="mt-1">
              {status.subscriptionStatus === "past_due"
                ? "Check your payment method in billing to keep your plan active."
                : "Open billing management to sort this out."}
            </p>
          </div>
        )}

      {actionError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm leading-relaxed text-rose-800">
          {actionError}
        </div>
      )}

      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
            Plans
          </h2>
          {data.plan === "free" && (
            <div
              role="group"
              aria-label="Billing interval"
              className="inline-flex rounded-full border border-slate-200 bg-white p-1 text-sm font-semibold"
            >
              {(["month", "year"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  aria-pressed={interval === option}
                  onClick={() => setInterval(option)}
                  className={`rounded-full px-4 py-1.5 transition ${
                    interval === option
                      ? "bg-violet-600 text-white shadow"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {option === "month" ? "Monthly" : "Yearly"}
                </button>
              ))}
            </div>
          )}
        </div>
        <ul className="mt-3 grid gap-3 lg:grid-cols-3">
          {data.plans.map((plan) => {
            const current = plan.id === data.plan;
            const isPaid = plan.id !== "free";
            const isUpgrade = planRank(plan.id) > currentRank;

            let cta: React.ReactNode;
            if (current) {
              cta = (
                <span className="mt-4 block rounded-full bg-violet-100 px-4 py-2 text-center text-sm font-bold text-violet-700">
                  Your plan
                </span>
              );
            } else if (isPaid && isUpgrade && data.plan === "free") {
              cta = (
                <button
                  type="button"
                  onClick={() => startCheckout(plan.id as "plus" | "premium")}
                  disabled={!billingReady || pending !== null}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-sm font-bold text-white shadow transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {pending === plan.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  ) : (
                    <Check className="h-4 w-4" aria-hidden />
                  )}
                  {data.plan === "free"
                    ? `Upgrade to ${plan.label}`
                    : `Switch to ${plan.label}`}
                </button>
              );
            } else if (isPaid) {
              cta = (
                <button
                  type="button"
                  onClick={openPortal}
                  disabled={!billingReady || pending !== null}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {pending === "portal" ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  ) : (
                    <ShieldCheck className="h-4 w-4" aria-hidden />
                  )}
                  Switch in billing
                </button>
              );
            } else {
              cta = (
                <button
                  type="button"
                  onClick={openPortal}
                  disabled={!billingReady || pending !== null}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {pending === "portal" ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  ) : (
                    <ShieldCheck className="h-4 w-4" aria-hidden />
                  )}
                  Cancel subscription
                </button>
              );
            }

            return (
              <li
                id={`plan-${plan.id}`}
                key={plan.id}
                className={`flex scroll-mt-20 flex-col rounded-3xl border p-5 ${
                  current
                    ? "border-violet-300 bg-violet-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-wider text-violet-700">
                  {current ? "Your plan" : plan.label}
                </p>
                <h3 className="mt-2 text-lg font-extrabold text-slate-900">
                  {plan.label}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                  {plan.summary}
                </p>
                {isPaid && data.plan === "free" && (
                  <p className="mt-2 text-xs font-semibold text-slate-500">
                    {interval === "month" ? "Billed monthly" : "Billed yearly"}
                    {" · price set securely at checkout"}
                  </p>
                )}
                {cta}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-3xl border border-violet-100 bg-white p-5 sm:p-6">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
          Go deeper with HerCompass Plus
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Plus adds personalized wellness plans and the capabilities below.
          Premium adds multi-week adaptive plans. Payments are handled securely
          by Stripe, and you&apos;ll confirm the exact price before checkout.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {plusAdds.map((row) => (
            <li key={row.id} className="text-sm font-semibold text-slate-800">
              {row.label}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
          What each plan includes
        </h2>
        <ul className="mt-3 space-y-3 md:hidden">
          {data.comparison.map((row) => (
            <li
              key={row.id}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <p className="font-bold text-slate-900">{row.label}</p>
              <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
                {PLAN_ORDER.map((planId) => (
                  <div key={planId}>
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      {planId}
                    </dt>
                    <dd className="mt-1">
                      <AccessMark access={row.access[planId]} />
                    </dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
        <div className="mt-3 hidden overflow-x-auto rounded-3xl border border-slate-200 bg-white md:block">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3 font-semibold">Capability</th>
                {PLAN_ORDER.map((planId) => (
                  <th key={planId} className="px-4 py-3 text-center font-semibold">
                    {planId}
                    {planId === data.plan ? " · yours" : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.comparison.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 last:border-0">
                  <th className="px-4 py-3 font-semibold text-slate-800">
                    {row.label}
                  </th>
                  {PLAN_ORDER.map((planId) => (
                    <td key={planId} className="px-4 py-3 text-center">
                      <AccessMark access={row.access[planId]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}