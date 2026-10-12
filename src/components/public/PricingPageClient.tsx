"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronDown,
  HelpCircle,
  Minus,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

type Interval = "month" | "year";
type PlanId = "free" | "plus" | "premium";

interface PlanCard {
  id: PlanId;
  name: string;
  badge: string;
  price: { month: string; year: string };
  period: { month: string; year: string };
  description: string;
  features: string[];
  popular: boolean;
}

const PLANS: PlanCard[] = [
  {
    id: "free",
    name: "Free",
    badge: "Start here",
    price: { month: "$0", year: "$0" },
    period: { month: "forever", year: "forever" },
    description:
      "Your initial Personal Snapshot and the essentials for understanding your own patterns.",
    features: [
      "Personal Menopause Snapshot™",
      "Basic daily tracking",
      "Standard educational guidance",
      "Basic recommendations",
    ],
    popular: false,
  },
  {
    id: "plus",
    name: "Plus",
    badge: "Most popular",
    price: { month: "$5.99", year: "$7.99" },
    period: { month: "per month", year: "per year" },
    description:
      "Full individual intelligence with deeper pattern awareness and partner support.",
    features: [
      "Everything in Free",
      "Unlimited tracking history",
      "Expanded pattern intelligence",
      "7-day personalized wellness focus",
      "Partner digest preview",
    ],
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    badge: "Couple intelligence",
    price: { month: "$9.99", year: "$11.99" },
    period: { month: "per month", year: "per year" },
    description:
      "Advanced personalization, deeper trend calculations, and the full couple experience.",
    features: [
      "Everything in Plus",
      "Advanced AI personalization",
      "Deeper pattern trend calculations",
      "Couple & Partner experience",
      "Men's Academy access",
    ],
    popular: false,
  },
];

interface ComparisonRow {
  label: string;
  access: Record<PlanId, "included" | "limited" | "not_included">;
}

const COMPARISON: ComparisonRow[] = [
  {
    label: "Personal Menopause Snapshot™",
    access: { free: "included", plus: "included", premium: "included" },
  },
  {
    label: "Daily symptom, mood & sleep tracking",
    access: { free: "limited", plus: "included", premium: "included" },
  },
  {
    label: "Tracking history",
    access: { free: "limited", plus: "included", premium: "included" },
  },
  {
    label: "Pattern intelligence",
    access: { free: "limited", plus: "included", premium: "included" },
  },
  {
    label: "Personalized wellness focus plans",
    access: { free: "not_included", plus: "limited", premium: "included" },
  },
  {
    label: "Advanced AI personalization",
    access: { free: "not_included", plus: "not_included", premium: "included" },
  },
  {
    label: "Partner digest",
    access: { free: "not_included", plus: "limited", premium: "included" },
  },
  {
    label: "Full Couple & Partner experience",
    access: { free: "not_included", plus: "not_included", premium: "included" },
  },
  {
    label: "Men's Academy",
    access: { free: "not_included", plus: "not_included", premium: "included" },
  },
];

const FAQS = [
  {
    q: "Can I switch or cancel my plan later?",
    a: "Yes. You can change plans or cancel at any time from your subscription page. Cancellations take effect at the end of your current billing period, and you keep access until then.",
  },
  {
    q: "How is my payment information handled?",
    a: "Payments are processed by Stripe, a PCI-compliant provider. HerCompassAI never stores your full card number. You can update or remove your payment method through the secure billing portal.",
  },
  {
    q: "Does upgrading unlock more of my private data?",
    a: "No. Paid plans add depth — more history, richer patterns, and the partner experience — but they never change how your data is protected. Privacy is identical on every tier.",
  },
  {
    q: "What happens to my data if I stay on Free?",
    a: "Your account and snapshot stay active. You keep basic tracking and educational guidance. Nothing is deleted because you have not upgraded.",
  },
  {
    q: "Do you offer refunds?",
    a: "If something is not right, contact support and we will work it out. Since billing is handled by Stripe, any refund is processed against your original payment method.",
  },
];

function BillingIntervalToggle({
  interval,
  onChange,
}: {
  interval: Interval;
  onChange: (next: Interval) => void;
}) {
  return (
    <div className="mt-7 inline-flex items-center rounded-full border border-slate-200 bg-slate-100 p-1 sm:p-1.5 gap-1">
      <button
        type="button"
        onClick={() => onChange("month")}
        aria-pressed={interval === "month"}
        className={`rounded-full px-3.5 sm:px-4 py-1.5 text-xs font-semibold transition-all ${
          interval === "month" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
        }`}
      >
        Monthly
      </button>
      <button
        type="button"
        onClick={() => onChange("year")}
        aria-pressed={interval === "year"}
        className={`flex items-center gap-1.5 rounded-full px-3.5 sm:px-4 py-1.5 text-xs font-semibold transition-all ${
          interval === "year" ? "bg-violet-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
        }`}
      >
        Annual
        <span className={`text-[10px] font-bold ${interval === "year" ? "text-violet-100" : "text-emerald-600"}`}>
          Save
        </span>
      </button>
    </div>
  );
}

function AccessMark({ access }: { access: "included" | "limited" | "not_included" }) {
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

export default function PricingPageClient() {
  const [interval, setInterval] = useState<Interval>("year");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { user } = useAuth();
  const signedIn = Boolean(user);

  const ctaFor = (plan: PlanCard): { href: string; label: string } => {
    if (plan.id === "free") {
      return { href: "/onboarding", label: "Start free" };
    }
    return {
      href: signedIn
        ? `/upgrade?plan=${plan.id}&interval=${interval}`
        : `/register?plan=${plan.id}`,
      label: `Choose ${plan.name}`,
    };
  };

  return (
    <div className="animate-fadeIn">
      {/* Hero */}
      <section className="relative overflow-hidden pt-12 pb-10 sm:pt-16 sm:pb-14 border-b border-slate-200/80 bg-gradient-to-b from-[#FAF9F6] via-white to-white">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[90vw] max-w-[620px] h-[220px] bg-gradient-to-tr from-purple-200/30 via-indigo-100/25 to-rose-100/20 blur-[110px] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-violet-50/80 px-3.5 py-1 text-xs font-semibold text-violet-700 shadow-xs mb-4">
            <Sparkles className="h-3.5 w-3.5 text-violet-600" />
            <span>Simple, transparent plans</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 max-w-3xl mx-auto leading-[1.15]">
            Transparent plans for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600">
              every stage of your journey.
            </span>
          </h1>
          <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            We charge for depth of personalization, not for access to your own data. Start
            free and upgrade only when you want the app to know you more deeply.
          </p>
          <BillingIntervalToggle interval={interval} onChange={setInterval} />
        </div>
      </section>

      {/* Plan cards */}
      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8 items-stretch">
            {PLANS.map((plan) => {
              const cta = ctaFor(plan);
              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-3xl p-6 lg:p-8 transition-all ${
                    plan.popular
                      ? "border-2 border-violet-500 bg-gradient-to-b from-violet-50/40 via-white to-white shadow-xl shadow-violet-500/15"
                      : "border border-slate-200 bg-white shadow-xs hover:shadow-lg"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-1 text-xs font-bold text-white shadow-md whitespace-nowrap">
                      {plan.badge}
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-xl font-bold text-slate-900">{plan.name}</h2>
                    {!plan.popular && (
                      <span className="rounded-full bg-slate-100 px-3 py-0.5 text-[11px] font-semibold text-slate-600 whitespace-nowrap">
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-slate-900">
                      {plan.price[interval]}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      /{plan.period[interval]}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-slate-600 leading-relaxed min-h-[44px]">
                    {plan.description}
                  </p>

                  <div className="mt-6 flex-1 border-t border-slate-100 pt-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      What is included
                    </span>
                    <ul className="mt-4 space-y-3">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-xs text-slate-700 leading-snug"
                        >
                          <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700">
                            <Check className="h-3 w-3 stroke-[2.5]" />
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={cta.href}
                    className={`mt-8 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                      plan.popular
                        ? "bg-violet-600 text-white shadow-md hover:bg-violet-700 hover:shadow-lg"
                        : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                    }`}
                  >
                    {cta.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature comparison */}
      <section className="py-12 sm:py-16 bg-white border-y border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Compare every capability
          </h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 leading-relaxed">
            A detailed breakdown of what each tier unlocks. Free is genuinely useful; paid
            tiers add depth.
          </p>

          <ul className="mt-6 space-y-3 md:hidden">
            {COMPARISON.map((row) => (
              <li key={row.label} className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="font-bold text-slate-900">{row.label}</p>
                <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
                  {(["free", "plus", "premium"] as PlanId[]).map((planId) => (
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

          <div className="mt-6 hidden overflow-x-auto rounded-3xl border border-slate-200 bg-white md:block">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3 font-semibold">Capability</th>
                  {(["free", "plus", "premium"] as PlanId[]).map((planId) => (
                    <th key={planId} className="px-4 py-3 text-center font-semibold capitalize">
                      {planId}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.label} className="border-b border-slate-100 last:border-0">
                    <th className="px-4 py-3 font-semibold text-slate-800">{row.label}</th>
                    {(["free", "plus", "premium"] as PlanId[]).map((planId) => (
                      <td key={planId} className="px-4 py-3 text-center">
                        <AccessMark access={row.access[planId]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-16 bg-[#FAF9F6]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3.5 py-1 text-xs font-semibold text-violet-700 mb-3">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Billing questions</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Pricing FAQ
          </h2>

          <div className="mt-8 space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.q}
                  className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-slate-50/60 sm:p-5"
                  >
                    <span className="text-sm font-bold text-slate-900">{faq.q}</span>
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-transform duration-200 ${
                        isOpen ? "rotate-180 border-violet-200 bg-violet-50 text-violet-700" : ""
                      }`}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-slate-100 px-4 pb-5 pt-3 text-sm leading-relaxed text-slate-600 sm:px-5 animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Payments secured by Stripe. Cancel anytime.</span>
          </div>
        </div>
      </section>
    </div>
  );
}
