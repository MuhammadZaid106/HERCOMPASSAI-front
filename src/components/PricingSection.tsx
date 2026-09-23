"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Sparkles, ArrowRight } from "lucide-react";

export default function PricingSection() {
  const [annualBilling, setAnnualBilling] = useState(true);

  const tiers = [
    {
      name: "Free",
      badge: "Genuinely Useful",
      price: "$0",
      period: "forever",
      description: "Start understanding your baseline with genuine, science-grounded value from day one.",
      features: [
        "Initial Personal Menopause Snapshot™",
        "Daily symptom, mood, sleep & energy tracking",
        "Basic deterministic trend engine",
        "Limited evidence-grounded AI insights",
        "Curated starter recipes & educational library",
        "Limited partner invite preview",
      ],
      ctaText: "Start Free Today",
      ctaHref: "/onboarding",
      popular: false,
    },
    {
      name: "Plus",
      badge: "Most Popular",
      price: annualBilling ? "$9.99" : "$12.99",
      period: "per month",
      description: "Complete individual intelligence + full Partner Support & Men's Academy access.",
      features: [
        "Everything in Free, plus:",
        "Unlimited longitudinal tracking & history",
        "Full Adaptive Nutrition Radar & recipe curation",
        "Cooling breathwork & nervous system workouts",
        "Full Consented Partner Digest (weekly delivery)",
        "Complete Men’s Academy empathy micro-courses",
        "Direct evidence citation inspection",
      ],
      ctaText: "Start 14-Day Free Trial",
      ctaHref: "/register?plan=plus",
      popular: true,
    },
    {
      name: "Premium",
      badge: "Full Relationship Intelligence",
      price: annualBilling ? "$15.99" : "$19.99",
      period: "per month",
      description: "Advanced AI pattern forecasting, multi-week plans, and joint couple wellness challenges.",
      features: [
        "Everything in Plus, plus:",
        "Advanced predictive trend forecasting",
        "Multi-week personalized hormonal wellness plans",
        "Shared Couple Challenges (co-regulation goals)",
        "Advanced wearable sync integration (future)",
        "Priority clinical knowledge updates",
        "Dedicated VIP support",
      ],
      ctaText: "Start 14-Day Free Trial",
      ctaHref: "/register?plan=premium",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Title & Billing Toggle */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3.5 py-1 text-xs font-semibold text-violet-700 mb-3">
            <span>Simple, Transparent Plans</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Invest in Predictability and Connection
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Free forever for core tracking. Upgrade when you desire deeper partner intelligence and adaptive AI.
          </p>

          {/* Toggle */}
          <div className="mt-6 sm:mt-8 inline-flex items-center rounded-full bg-slate-100 p-1 sm:p-1.5 border border-slate-200 gap-1">
            <button
              type="button"
              onClick={() => setAnnualBilling(false)}
              className={`rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold transition-all whitespace-nowrap ${
                !annualBilling
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setAnnualBilling(true)}
              className={`flex items-center gap-1 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold transition-all whitespace-nowrap ${
                annualBilling
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Annual</span>
              <span className="rounded-full bg-violet-200/40 px-1.5 py-0.5 text-[9px] sm:text-[10px] text-white font-bold">
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-10 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8 items-stretch">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col justify-between rounded-2xl sm:rounded-3xl p-5 sm:p-8 transition-all ${
                tier.popular
                  ? "border-2 border-violet-500 bg-gradient-to-b from-violet-50/40 via-white to-white shadow-2xl shadow-violet-500/20 ring-4 ring-violet-500/15"
                  : "border border-slate-200 bg-white shadow-sm hover:shadow-lg"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-1 text-xs font-bold text-white shadow-md">
                  {tier.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                  {!tier.popular && (
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
                      {tier.badge}
                    </span>
                  )}
                </div>

                <div className="mt-5 sm:mt-6 flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">{tier.price}</span>
                  <span className="text-xs text-slate-500 font-medium">/{tier.period}</span>
                </div>
                <p className="mt-3 text-xs text-slate-600 leading-relaxed min-h-[36px]">
                  {tier.description}
                </p>

                <div className="mt-6 pt-6 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Included Features:
                  </span>
                  <ul className="mt-4 space-y-3">
                    {tier.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <div className="flex h-4 w-4 items-center justify-center rounded-full bg-violet-100 text-violet-700 flex-shrink-0 mt-0.5">
                          <Check className="h-3 w-3 stroke-[2.5]" />
                        </div>
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <Link
                  href={tier.ctaHref}
                  className={`w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                    tier.popular
                      ? "bg-violet-600 text-white shadow-md hover:bg-violet-700 hover:shadow-lg"
                      : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                  }`}
                >
                  <span>{tier.ctaText}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
