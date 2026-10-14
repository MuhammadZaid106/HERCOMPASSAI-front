"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { billingClient, type BillingStatus } from "@/lib/billing/billingClient";
import {
  CreditCard,
  ExternalLink,
  ShieldCheck,
  Receipt,
  Loader2,
  AlertCircle,
  FileText,
} from "lucide-react";

export default function BillingPage() {
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
        setError(res.message || "Stripe Customer Portal is unavailable.");
      }
    } catch {
      setError("An unexpected error occurred while contacting the billing gateway.");
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FBFBF9] text-[#0F172A]">
      <Navbar />
      <main className="flex-1 py-12 lg:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-rose-600 mb-2">
              <Receipt className="h-4 w-4" />
              <span>Billing &bull; Payment History</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Billing &amp; Invoices
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Access your official payment history, download invoice PDFs, or manage your billing details.
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-3 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
              <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-16 shadow-sm">
              <Loader2 className="h-8 w-8 animate-spin text-rose-600 mb-3" />
              <p className="text-sm font-medium text-slate-600">Loading billing records...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Payment Method Overview */}
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700">
                      <CreditCard className="h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900">Payment Method on File</h2>
                      <p className="text-xs text-slate-500">
                        {status?.hasStripeCustomer ? "Managed securely by Stripe" : "No payment method registered"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleOpenPortal}
                    disabled={portalLoading}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    <span>Update Card</span>
                    <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
                  </button>
                </div>

                <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-slate-400" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">Download Past Invoices</p>
                      <p className="text-xs text-slate-500">All PDF receipts and tax statements are archived in Stripe.</p>
                    </div>
                  </div>
                  <button
                    onClick={handleOpenPortal}
                    disabled={portalLoading}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow hover:bg-slate-800 transition"
                  >
                    <span>View Invoices</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
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
