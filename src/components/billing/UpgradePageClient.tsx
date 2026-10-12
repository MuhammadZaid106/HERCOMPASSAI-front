"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Check,
  Loader2,
  Minus,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import {
  billingClient,
  type BillingInterval,
} from "@/lib/billing/billingClient";
import { useBillingOverview } from "@/lib/billing/useBillingOverview";
import type { MemberPlanId } from "@/lib/member/memberTypes";
import {
  ErrorNotice,
  PageHeading,
  PanelSkeleton,
  linkClass,
  primaryButton,
  secondaryButton,
} from "@/components/member/accountUi";

const PLAN_ORDER: MemberPlanId[] = ["free", "plus", "premium"];

function planRank(plan: MemberPlanId): number {
  return PLAN_ORDER.indexOf(plan);
}

function parsePlan(value: string | null): "plus" | "premium" | null {
  return value === "plus" || value === "premium" ? value : null;
}

function parseInterval(value: string | null): BillingInterval | null {
  return value === "month" || value === "year" ? value : null;
}

export default function UpgradePageClient() {
  const searchParams = useSearchParams();
  const { subscription, status, loading, error, reload } = useBillingOverview();

  const requestedPlan = parsePlan(searchParams.get("plan"));
  const requestedInterval = parseInterval(searchParams.get("interval"));

  const [interval, setInterval] = useState<BillingInterval>(
    requestedInterval ?? "year",
  );
  const [pending, setPending] = useState<"plus" | "premium" | "portal" | null>(
    null,
  );
  const [actionError, setActionError] = useState<string | null>(null);

  if (error) {
    return (
      <div className="space-y-4">
        <PageHeading eyebrow="Billing" title="Upgrade your plan" />
        <ErrorNotice title="We couldn't load your plan." message={error} />
        <button type="button" onClick={reload} className={secondaryButton}>
          Try again
        </button>
      </div>
    );
  }

  if (loading || !subscription) {
    return (
      <div className="space-y-4">
        <PageHeading eyebrow="Billing" title="Upgrade your plan" />
        <PanelSkeleton lines={4} />
      </div>
    );
  }

  const currentPlan = subscription.plan;
  const currentRank = planRank(currentPlan);
  const billingReady = status?.isConfigured !== false;

  const defaultTarget: "plus" | "premium" | null =
    currentPlan === "free" ? "plus" : currentPlan === "plus" ? "premium" : null;
  const targetPlan = requestedPlan && planRank(requestedPlan) > currentRank
    ? requestedPlan
    : defaultTarget;

  const targetPlanSummary = targetPlan
    ? subscription.plans.find((plan) => plan.id === targetPlan)
    : undefined;

  const gained = targetPlan
    ? subscription.comparison.filter(
        (row) =>
          row.access[currentPlan] !== "included" &&
          row.access[targetPlan] === "included",
      )
    : [];

  async function startCheckout(plan: "plus" | "premium") {
    setActionError(null);
    setPending(plan);
    const result = await billingClient.createCheckoutSession({ plan, interval });
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
    const result = await billingClient.createPortalSession("/account/subscription");
    if (result.success && result.data?.url) {
      window.location.assign(result.data.url);
      return;
    }
    setPending(null);
    setActionError(
      result.message || "We couldn't open billing management. Please try again.",
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <PageHeading
        eyebrow="Billing"
        title="Upgrade your plan"
        description="Unlock personalized wellness plans and adaptive guidance. Payments are handled securely by Stripe, and you confirm the exact price before checkout."
      />

      {status && !status.isConfigured && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-800">
          <p className="font-semibold">Billing is not connected yet.</p>
          <p className="mt-1">
            Stripe hasn&apos;t been configured on the server, so plan changes are
            unavailable right now.
          </p>
        </div>
      )}

      {actionError && (
        <ErrorNotice title="We couldn't complete that." message={actionError} />
      )}

      {targetPlan === null ? (
        <div className="rounded-3xl border border-violet-200 bg-violet-50 p-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold text-violet-700 shadow-xs">
            <Sparkles className="h-3.5 w-3.5" />
            Highest tier
          </span>
          <h2 className="mt-3 text-xl font-extrabold text-slate-900">
            You&apos;re already on Premium
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-700">
            You have access to everything HerCompassAI offers. Manage your billing
            or review your subscription details any time.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={openPortal}
              disabled={!billingReady || pending !== null}
              className={primaryButton}
            >
              {pending === "portal" ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <ShieldCheck className="h-4 w-4" aria-hidden />
              )}
              Manage billing
            </button>
            <Link href="/account/subscription" className={secondaryButton}>
              View subscription
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-600">
              Upgrading from{" "}
              <span className="font-bold text-slate-900">
                {subscription.label}
              </span>
            </p>
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
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
            <section className="rounded-3xl border border-slate-200 bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-violet-700">
                Recommended
              </p>
              <h2 className="mt-2 text-2xl font-extrabold text-slate-900">
                {targetPlanSummary?.label ?? targetPlan}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {targetPlanSummary?.summary}
              </p>
              <p className="mt-3 text-xs font-semibold text-slate-500">
                {interval === "month" ? "Billed monthly" : "Billed yearly"} · price
                set securely at checkout
              </p>

              {gained.length > 0 && (
                <div className="mt-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    What you unlock
                  </p>
                  <ul className="mt-2 space-y-2">
                    {gained.map((row) => (
                      <li
                        key={row.id}
                        className="flex items-start gap-2 text-sm font-semibold text-slate-800"
                      >
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                          aria-hidden
                        />
                        {row.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                type="button"
                onClick={() => startCheckout(targetPlan)}
                disabled={!billingReady || pending !== null}
                className={`${primaryButton} mt-6 w-full`}
              >
                {pending === targetPlan ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <ArrowRight className="h-4 w-4" aria-hidden />
                )}
                Continue to checkout
              </button>
              <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Cancel or change any time from billing.
              </p>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-[#FBFBF9] p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Compare plans
              </h2>
              <ul className="mt-3 space-y-3">
                {subscription.plans.map((plan) => {
                  const isCurrent = plan.id === currentPlan;
                  const isTarget = plan.id === targetPlan;
                  return (
                    <li
                      key={plan.id}
                      className={`rounded-2xl border p-4 ${
                        isTarget
                          ? "border-violet-300 bg-violet-50"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-slate-900">{plan.label}</p>
                        {isCurrent && (
                          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-600">
                            Current
                          </span>
                        )}
                        {isTarget && (
                          <span className="rounded-full bg-violet-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                            Upgrading to
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                        {plan.summary}
                      </p>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-4 flex items-center justify-between gap-2 text-xs">
                <Link href="/account/billing" className={linkClass}>
                  Manage payment method
                </Link>
                <Link
                  href="/app/plans"
                  className="font-semibold text-slate-600 hover:text-slate-900"
                >
                  Full comparison
                </Link>
              </div>
            </section>
          </div>

          <section className="rounded-3xl border border-violet-100 bg-white p-6">
            <h2 className="text-base font-bold text-slate-900">
              Everything in {targetPlanSummary?.label ?? targetPlan}
            </h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {subscription.comparison
                .filter((row) => row.access[targetPlan] === "included")
                .map((row) => (
                  <li
                    key={row.id}
                    className="flex items-start gap-2 text-sm font-semibold text-slate-800"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-violet-600"
                      aria-hidden
                    />
                    {row.label}
                  </li>
                ))}
            </ul>
            <ul className="mt-4 space-y-1">
              {subscription.comparison
                .filter((row) => row.access[targetPlan] === "not_included")
                .map((row) => (
                  <li
                    key={row.id}
                    className="flex items-start gap-2 text-xs text-slate-500"
                  >
                    <Minus className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                    {row.label} — not included
                  </li>
                ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
