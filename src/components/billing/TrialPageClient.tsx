"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  Check,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import {
  billingClient,
  type BillingInterval,
} from "@/lib/billing/billingClient";
import { useBillingOverview } from "@/lib/billing/useBillingOverview";
import {
  ErrorNotice,
  PageHeading,
  PanelSkeleton,
  primaryButton,
  secondaryButton,
} from "@/components/member/accountUi";

function parseInterval(value: string | null): BillingInterval | null {
  return value === "month" || value === "year" ? value : null;
}

const PREMIUM_HIGHLIGHTS = [
  "Multi-week adaptive wellness plans that adjust as your data changes",
  "Everything in Plus, plus advanced personalization",
  "Priority access to new HerCompassAI guidance features",
  "Full insight history and deeper pattern analysis",
];

export default function TrialPageClient() {
  const searchParams = useSearchParams();
  const { subscription, status, loading, error, reload } = useBillingOverview();
  const [interval, setInterval] = useState<BillingInterval>(
    parseInterval(searchParams.get("interval")) ?? "year",
  );
  const [pending, setPending] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  if (error) {
    return (
      <div className="space-y-4">
        <PageHeading eyebrow="Billing" title="Try Premium" />
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
        <PageHeading eyebrow="Billing" title="Try Premium" />
        <PanelSkeleton lines={4} />
      </div>
    );
  }

  const billingReady = status?.isConfigured !== false;
  const alreadyPremium = subscription.plan === "premium";

  async function startCheckout() {
    setActionError(null);
    setPending(true);
    const result = await billingClient.createCheckoutSession({
      plan: "premium",
      interval,
    });
    if (result.success && result.data?.url) {
      window.location.assign(result.data.url);
      return;
    }
    setPending(false);
    setActionError(
      result.message || "We couldn't start checkout. Please try again.",
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <PageHeading
        eyebrow="Billing"
        title="Try Premium"
        description="Premium is our most complete plan. See what it adds, then start with secure checkout."
      />

      {alreadyPremium ? (
        <div className="rounded-3xl border border-violet-200 bg-violet-50 p-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold text-violet-700 shadow-xs">
            <Sparkles className="h-3.5 w-3.5" />
            Already active
          </span>
          <h2 className="mt-3 text-xl font-extrabold text-slate-900">
            You&apos;re on Premium
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-700">
            You already have everything Premium offers. Review your subscription or
            manage billing any time.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/account/subscription" className={primaryButton}>
              View subscription
            </Link>
            <Link href="/account/billing" className={secondaryButton}>
              Payment & invoices
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <section className="rounded-3xl bg-linear-to-br from-violet-950 via-indigo-900 to-slate-900 p-6 text-white shadow-xl sm:p-7">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-violet-100">
                <Sparkles className="h-3.5 w-3.5" />
                Premium
              </span>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Adaptive guidance, built around you
              </h2>
              <ul className="mt-5 space-y-3">
                {PREMIUM_HIGHLIGHTS.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-violet-50">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-violet-300" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6">
              {status && !status.isConfigured ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-800">
                  <p className="font-semibold">Billing is not connected yet.</p>
                  <p className="mt-1">
                    Stripe hasn&apos;t been configured on the server, so premium
                    checkout is unavailable right now.
                  </p>
                </div>
              ) : (
                <>
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
                  <p className="mt-4 text-2xl font-extrabold text-slate-900">
                    {interval === "month" ? "Billed monthly" : "Billed yearly"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Exact price is set securely at checkout.
                  </p>
                </>
              )}

              {actionError && (
                <div className="mt-4">
                  <ErrorNotice
                    title="We couldn't start checkout."
                    message={actionError}
                  />
                </div>
              )}

              <button
                type="button"
                onClick={startCheckout}
                disabled={!billingReady || pending}
                className={`${primaryButton} mt-5 w-full`}
              >
                {pending ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <ArrowRight className="h-4 w-4" aria-hidden />
                )}
                Continue to secure checkout
              </button>
              <Link
                href="/app"
                className={`${secondaryButton} mt-3 w-full`}
              >
                Keep exploring with Free
              </Link>

              <div className="mt-4 flex items-start gap-2 text-[11px] leading-relaxed text-slate-500">
                <RefreshCw className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                <p>
                  We don&apos;t run a free trial yet: checkout starts your Premium
                  subscription and you can change or cancel it any time from billing.
                </p>
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Payments are processed securely by Stripe.
              </p>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
