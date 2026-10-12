"use client";

import Link from "next/link";
import { useState } from "react";
import {
  CreditCard,
  ExternalLink,
  FileText,
  Loader2,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { billingClient } from "@/lib/billing/billingClient";
import { useBillingOverview } from "@/lib/billing/useBillingOverview";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  ErrorNotice,
  PageHeading,
  Panel,
  PanelSkeleton,
  ReadOnlyValue,
  SettingRow,
  SettingsSection,
  secondaryButton,
} from "@/components/member/accountUi";

export default function BillingPageClient() {
  const { user } = useAuth();
  const { subscription, status, loading, error, reload } = useBillingOverview();
  const [pending, setPending] = useState<"portal" | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function openPortal() {
    setActionError(null);
    setPending("portal");
    const result = await billingClient.createPortalSession("/app/account/billing");
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
        <PageHeading eyebrow="Billing" title="Payment & invoices" />
        <ErrorNotice title="We couldn't load billing." message={error} />
        <button type="button" onClick={reload} className={secondaryButton}>
          Try again
        </button>
      </div>
    );
  }

  if (loading || !subscription) {
    return (
      <div className="space-y-4">
        <PageHeading eyebrow="Billing" title="Payment & invoices" />
        <PanelSkeleton lines={4} />
      </div>
    );
  }

  const billingReady = status?.isConfigured !== false;
  const hasCustomer = status?.hasStripeCustomer ?? false;
  const isFree = subscription.plan === "free";

  return (
    <div className="space-y-6 animate-fadeIn">
      <PageHeading
        eyebrow="Billing"
        title="Payment & invoices"
        description="HerCompassAI never stores your card details. Payment methods and receipts are kept with Stripe, our payment processor."
      />

      {status && !status.isConfigured && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-800">
          <p className="font-semibold">Billing is not connected yet.</p>
          <p className="mt-1">
            Stripe hasn&apos;t been configured on the server, so payment management
            is unavailable right now.
          </p>
        </div>
      )}

      {actionError && (
        <ErrorNotice title="We couldn't complete that." message={actionError} />
      )}

      <Panel>
        <SettingsSection
          id="payment-method"
          title="Payment method"
          description="Add or update the card used for your subscription."
          actions={
            hasCustomer ? (
              <button
                type="button"
                onClick={openPortal}
                disabled={!billingReady || pending !== null}
                className={secondaryButton}
              >
                {pending === "portal" ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <CreditCard className="h-4 w-4" aria-hidden />
                )}
                Update
              </button>
            ) : undefined
          }
        >
          <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-[#FBFBF9] p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
              <CreditCard className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <p className="text-sm font-bold text-slate-900">
                {hasCustomer ? "Card on file with Stripe" : "No payment method yet"}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                {hasCustomer
                  ? "Your card details are stored securely by Stripe and never touch HerCompassAI servers. Update the card from billing management."
                  : isFree
                    ? "You're on the free plan, so no payment method is needed. Add one when you upgrade."
                    : "Add a payment method to keep your subscription active."}
              </p>
            </div>
          </div>
        </SettingsSection>
      </Panel>

      <Panel>
        <SettingsSection
          id="invoices"
          title="Invoices & receipts"
          description="Download past invoices and receipts from the secure portal."
        >
          <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-[#FBFBF9] p-4">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <FileText className="h-5 w-5" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-slate-900">
                {isFree ? "No invoices yet" : "Your invoice history is with Stripe"}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                {isFree
                  ? "Invoices appear here once you start a paid plan."
                  : "Open billing management to view or download every invoice and receipt."}
              </p>
            </div>
          </div>
          {!isFree && (
            <button
              type="button"
              onClick={openPortal}
              disabled={!billingReady || pending !== null}
              className={secondaryButton}
            >
              {pending === "portal" ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <ExternalLink className="h-4 w-4" aria-hidden />
              )}
              View invoices
            </button>
          )}
        </SettingsSection>
      </Panel>

      <Panel>
        <SettingsSection
          id="billing-email"
          title="Billing email"
          description="Receipts and renewal notices are sent here."
        >
          <SettingRow label="Email on file" description="Managed by the payment processor.">
            <span className="inline-flex items-center gap-2 text-sm text-slate-700">
              <Mail className="h-4 w-4 text-slate-400" aria-hidden />
              <ReadOnlyValue>{user?.email || "Not set"}</ReadOnlyValue>
            </span>
          </SettingRow>
          <SettingRow label="Current plan" description="Change or cancel any time.">
            <ReadOnlyValue>{subscription.label}</ReadOnlyValue>
          </SettingRow>
        </SettingsSection>
      </Panel>

      <div className="flex items-start gap-2 rounded-2xl border border-violet-100 bg-violet-50 p-4 text-xs leading-relaxed text-violet-900">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" aria-hidden />
        <p>
          HerCompassAI does not sell your data and never stores raw card numbers.
          All payments are processed by Stripe under PCI-compliant infrastructure.
          See our <Link href="/security" className="font-semibold underline">security page</Link> for details.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/app/account/subscription" className={secondaryButton}>
          Back to subscription
        </Link>
        <Link href="/upgrade" className={secondaryButton}>
          Change plan
        </Link>
      </div>
    </div>
  );
}
