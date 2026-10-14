"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth/AuthContext";
import { billingClient, type BillingStatus } from "@/lib/billing/billingClient";
import {
  CreditCard,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Loader2,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function SubscriptionPage() {
  const { user, loading: authLoading } = useAuth();
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    billingClient
      .getStatus()
      .then((res) => {
        if (!mounted) return;
        if (res.success && res.data) {
          setStatus(res.data);
        } else {
          setError(res.message || "Failed to load billing status");
        }
      })
      .catch(() => {
        if (mounted) setError("Could not connect to billing service");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleOpenPortal = async () => {
    setPortalLoading(true);
    setError(null);
    try {
      const returnUrl = typeof window !== "undefined" ? window.location.href : undefined;
      const res = await billingClient.createPortalSession(returnUrl);
      if (res.success && res.data?.url) {
        window.location.href = res.data.url;
      } else {
        setError(res.message || "Stripe Customer Portal is not available right now.");
      }
    } catch {
      setError("An unexpected error occurred while reaching the billing portal.");
    } finally {
      setPortalLoading(false);
    }
  };

  const planName = status?.plan ? status.plan.toUpperCase() : "FREE BASELINE";

  return (
    <div className="flex min-h-screen flex-col bg-[#FBFBF9] text-[#0F172A]">
      <Navbar />
      <main className="flex-1 py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-600 mb-2">
              <CreditCard className="h-4 w-4" />
              <span>Membership &bull; Plan Management</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Subscription &amp; Plan
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Manage your tier, renewal dates, and billing preferences through our secure Stripe portal.
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
              <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
              <span>{error}</span>
            </div>
          )}

          {loading || authLoading ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-16 shadow-sm">
              <Loader2 className="h-8 w-8 animate-spin text-rose-600 mb-3" />
              <p className="text-sm font-medium text-slate-600">Loading your subscription details...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Active Plan Card */}
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Plan</span>
                    <div className="mt-1 flex items-center gap-3">
                      <h2 className="text-2xl font-black text-slate-900">{planName}</h2>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                        {status?.hasActiveSubscription ? "Active Subscription" : "Core Access"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href="/upgrade"
                      className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-semibold text-white shadow hover:bg-rose-700 transition"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Change Plan</span>
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
                  <div>
                    <span className="text-xs text-slate-400 font-medium">Billing Period</span>
                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {status?.hasActiveSubscription ? "Monthly / Annual" : "Complimentary"}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium">Payment Status</span>
                    <p className="mt-1 text-sm font-bold text-slate-800 capitalize">
                      {status?.subscriptionStatus || "Good Standing"}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-medium">Stripe Customer</span>
                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {status?.hasStripeCustomer ? "Connected" : "Not yet enrolled"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stripe Management Portal Card */}
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">Manage Payment Method &amp; Invoices</h3>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                    Update your credit card on file, view past receipt invoices, or cancel recurring billing securely via Stripe.
                  </p>
                </div>
                <button
                  onClick={handleOpenPortal}
                  disabled={portalLoading}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition shrink-0 disabled:opacity-60"
                >
                  {portalLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-slate-600" />
                  ) : (
                    <>
                      <span>Open Customer Portal</span>
                      <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
                    </>
                  )}
                </button>
              </div>

              {/* Entitlement Breakdown */}
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900">Your Plan Entitlements</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Personal Menopause Snapshot™ access</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Deterministic Trend Calculations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Clinical Evidence Transparency</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Couple &amp; Partner Privacy Safeguards</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
