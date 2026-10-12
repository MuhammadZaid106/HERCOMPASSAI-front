"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { billingClient, type BillingInterval } from "@/lib/billing/billingClient";
import {
  Sparkles,
  Check,
  Loader2,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export default function UpgradePage() {
  const [interval, setInterval] = useState<BillingInterval>("year");
  const [loadingPlan, setLoadingPlan] = useState<"plus" | "premium" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async (plan: "plus" | "premium") => {
    setLoadingPlan(plan);
    setError(null);
    try {
      const res = await billingClient.createCheckoutSession({
        plan,
        interval,
        successUrl: `${window.location.origin}/app?billing=success`,
        cancelUrl: `${window.location.origin}/upgrade?billing=cancel`,
      });

      if (res.success && res.data?.url) {
        window.location.href = res.data.url;
      } else {
        setError(res.message || "Checkout session could not be created.");
      }
    } catch {
      setError("An unexpected error occurred while connecting to the checkout gateway.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FBFBF9] text-[#0F172A]">
      <Navbar />
      <main className="flex-1 py-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-700 shadow-sm mb-4">
              <Sparkles className="h-4 w-4" />
              <span>Upgrade Your Experience</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Unlock Advanced Personalization
            </h1>
            <p className="mt-4 text-base text-slate-600 leading-relaxed">
              Step into deeper AI trend interpretation, personalized recipes and cooling routines, and privacy-scoped partner empathy.
            </p>

            {/* Interval Switcher */}
            <div className="mt-8 inline-flex items-center rounded-2xl bg-slate-100 p-1.5 border border-slate-200">
              <button
                type="button"
                onClick={() => setInterval("month")}
                className={`rounded-xl px-5 py-2 text-xs font-bold transition ${
                  interval === "month"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Monthly Billing
              </button>
              <button
                type="button"
                onClick={() => setInterval("year")}
                className={`rounded-xl px-5 py-2 text-xs font-bold transition flex items-center gap-2 ${
                  interval === "year"
                    ? "bg-white text-rose-600 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>Annual Billing</span>
                <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-extrabold text-rose-700">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-8 mx-auto max-w-2xl flex items-center gap-3 rounded-2xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
              <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Upgrade Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plus Card */}
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col justify-between hover:border-rose-200 transition">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900">HerCompass Plus</h3>
                  <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-700">Popular</span>
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">
                    {interval === "year" ? "$99" : "$12"}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    /{interval === "year" ? "year" : "month"}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-600">
                  Ideal for women wanting continuous trend analysis and personalized weekly focus routines.
                </p>

                <ul className="mt-6 space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-6">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Unlimited daily tracking history</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Expanded correlation trend engine</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Personalized 7-day nutrition & cooling plan</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Weekly partner summary digest</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleCheckout("plus")}
                disabled={Boolean(loadingPlan)}
                className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-xs font-semibold text-white shadow hover:bg-slate-800 transition disabled:opacity-60"
              >
                {loadingPlan === "plus" ? (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                ) : (
                  <>
                    <span>Upgrade to Plus</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>

            {/* Premium Card */}
            <div className="rounded-3xl border-2 border-purple-500 bg-white p-8 shadow-md flex flex-col justify-between relative">
              <div className="absolute -top-3 right-8 rounded-full bg-purple-600 px-3 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider">
                Full Experience
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">HerCompass Premium</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">
                    {interval === "year" ? "$199" : "$24"}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    /{interval === "year" ? "year" : "month"}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-600">
                  Comprehensive intelligence with Couple &amp; Partner Support (CPS) and complete Men&apos;s Academy access.
                </p>

                <ul className="mt-6 space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-6">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-purple-600 shrink-0" />
                    <span>Everything in HerCompass Plus</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-purple-600 shrink-0" />
                    <span>Advanced multivariable pattern intelligence</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-purple-600 shrink-0" />
                    <span>Full Couple &amp; Partner Support (CPS)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-purple-600 shrink-0" />
                    <span>Complete Men&apos;s Academy modules &amp; challenges</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleCheckout("premium")}
                disabled={Boolean(loadingPlan)}
                className="mt-8 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 py-3 text-xs font-semibold text-white shadow-lg hover:bg-purple-700 transition disabled:opacity-60"
              >
                {loadingPlan === "premium" ? (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                ) : (
                  <>
                    <span>Upgrade to Premium</span>
                    <Sparkles className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
