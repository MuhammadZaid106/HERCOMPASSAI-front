"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowUpRight,
  CalendarClock,
  Check,
  CreditCard,
  Loader2,
  Minus,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { billingClient } from "@/lib/billing/billingClient";
import { useBillingOverview } from "@/lib/billing/useBillingOverview";
import {
  ErrorNotice,
  PageHeading,
  Panel,
  PanelSkeleton,
  SettingsSection,
  dangerButton,
  primaryButton,
  secondaryButton,
} from "@/components/member/accountUi";

function statusBadge(status: string): { label: string; className: string } {
  switch (status) {
    case "active":
      return { label: "Active", className: "bg-emerald-100 text-emerald-800" };
    case "trialing":
      return { label: "Trialing", className: "bg-violet-100 text-violet-800" };
    case "past_due":
      return { label: "Past due", className: "bg-amber-100 text-amber-800" };
    case "canceled":
      return { label: "Cancelled", className: "bg-rose-100 text-rose-800" };
    case "incomplete":
      return { label: "Incomplete", className: "bg-amber-100 text-amber-800" };
    default:
      return { label: "No subscription", className: "bg-slate-100 text-slate-700" };
  }
}

export default function SubscriptionPageClient() {
  const { subscription, status, loading, error, reload } = useBillingOverview();
  const [pending, setPending] = useState<"portal" | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function openPortal() {
    setActionError(null);
    setPending("portal");
    const result = await billingClient.createPortalSession("/app/account/subscription");
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
      <div className="space-y-4">
        <PageHeading eyebrow="Billing" title="Subscription" />
        <ErrorNotice title="We couldn't load your subscription." message={error} />
        <button type="button" onClick={reload} className={secondaryButton}>
          Try again
        </button>
      </div>
    );
  }

  if (loading || !subscription) {
    return (
      <div className="space-y-4">
        <PageHeading eyebrow="Billing" title="Subscription" />
        <PanelSkeleton lines={5} />
      </div>
    );
  }

  const billingReady = status?.isConfigured !== false;
  const isFree = subscription.plan === "free";
  const badge = statusBadge(status?.subscriptionStatus ?? "none");
  const included = subscription.comparison.filter(
    (row) => row.access[subscription.plan] === "included",
  );
  const notIncluded = subscription.comparison.filter(
    (row) => row.access[subscription.plan] === "not_included",
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      <PageHeading
        eyebrow="Billing"
        title="Subscription"
        description="Your plan, what it includes, and how to change it."
      />

      <section className="rounded-3xl bg-linear-to-br from-violet-950 via-indigo-900 to-slate-900 p-6 text-white shadow-xl sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-violet-200">
              Current plan
            </p>
            <h2 className="mt-1.5 text-3xl font-extrabold tracking-tight">
              {subscription.label}
            </h2>
            {status && (
              <span
                className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${badge.className}`}
              >
                {badge.label}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            {!isFree ? (
              <button
                type="button"
                onClick={openPortal}
                disabled={!billingReady || pending !== null}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-bold text-violet-900 shadow transition hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pending === "portal" ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <ShieldCheck className="h-4 w-4" aria-hidden />
                )}
                Manage billing
              </button>
            ) : (
              <Link
                href="/upgrade"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-white px-4 text-sm font-bold text-violet-900 shadow transition hover:bg-violet-100"
              >
                <Sparkles className="h-4 w-4" aria-hidden />
                Upgrade plan
              </Link>
            )}
            <Link
              href="/app/plans"
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/30 px-4 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Compare plans
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-violet-100">
          {subscription.summary} {subscription.description}
        </p>
      </section>

      {status && !status.isConfigured && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-800">
          <p className="font-semibold">Billing is not connected yet.</p>
          <p className="mt-1">
            Stripe hasn&apos;t been configured on the server, so plan changes are
            unavailable right now.
          </p>
        </div>
      )}

      {status &&
        !isFree &&
        !["active", "trialing", "none"].includes(status.subscriptionStatus) && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm leading-relaxed text-rose-800">
            <p className="font-semibold capitalize">
              Subscription status: {status.subscriptionStatus.replace("_", " ")}
            </p>
            <p className="mt-1">
              {status.subscriptionStatus === "past_due"
                ? "Update your payment method to keep your plan active."
                : "Open billing management to sort this out."}
            </p>
          </div>
        )}

      {actionError && (
        <ErrorNotice title="We couldn't complete that." message={actionError} />
      )}

      <Panel>
        <SettingsSection
          id="renewal"
          title="Renewal & billing"
          description="Payment details, invoices, and renewal dates live in the secure Stripe portal."
        >
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
            <CalendarClock className="h-4 w-4 text-slate-400" aria-hidden />
            <span>
              {isFree
                ? "No renewal — you're on the free plan."
                : "Your next renewal date and receipts are shown in billing management."}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-700">
            <CreditCard className="h-4 w-4 text-slate-400" aria-hidden />
            <span>
              {status?.hasStripeCustomer
                ? "A payment method is on file with Stripe."
                : "No payment method on file yet."}
            </span>
          </div>
        </SettingsSection>
      </Panel>

      <Panel>
        <SettingsSection
          id="included"
          title={`Included in ${subscription.label}`}
          description="The capabilities your current plan unlocks."
        >
          <ul className="grid gap-2 sm:grid-cols-2">
            {included.map((row) => (
              <li
                key={row.id}
                className="flex items-start gap-2 text-sm font-semibold text-slate-800"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                {row.label}
              </li>
            ))}
          </ul>
          {notIncluded.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Available on higher plans
              </p>
              <ul className="mt-2 space-y-1">
                {notIncluded.map((row) => (
                  <li
                    key={row.id}
                    className="flex items-start gap-2 text-xs text-slate-500"
                  >
                    <Minus className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                    {row.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </SettingsSection>
      </Panel>

      {!isFree && (
        <Panel>
          <SettingsSection
            id="cancel"
            title="Cancel subscription"
            description="Cancelling stops future renewals. You keep access until the end of the current billing period."
          >
            <button
              type="button"
              onClick={openPortal}
              disabled={!billingReady || pending !== null}
              className={dangerButton}
            >
              {pending === "portal" ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <CreditCard className="h-4 w-4" aria-hidden />
              )}
              Cancel in billing
            </button>
          </SettingsSection>
        </Panel>
      )}

      <div className="flex flex-wrap gap-3">
        <Link href="/app/account/billing" className={secondaryButton}>
          Payment & invoices
        </Link>
        <Link href="/upgrade" className={primaryButton}>
          {isFree ? "Upgrade" : "Change plan"}
        </Link>
      </div>
    </div>
  );
}
