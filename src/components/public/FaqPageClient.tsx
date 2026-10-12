"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Clock,
  CreditCard,
  HelpCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  Activity,
} from "lucide-react";

const CATEGORIES = [
  "All",
  "Account",
  "Onboarding & Snapshot",
  "Tracking",
  "AI & Privacy",
  "Partner Support",
  "Billing",
] as const;

type Category = (typeof CATEGORIES)[number];

interface FaqItem {
  category: Exclude<Category, "All">;
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    category: "Account",
    q: "How do I create an account?",
    a: "Use the free assessment to begin. You can start the snapshot first and create your sign-in details at the end, so the questions feel like a guided welcome rather than a form.",
  },
  {
    category: "Account",
    q: "Can I use HerCompassAI with a partner?",
    a: "Yes. Your partner joins through an invitation you control. They get a lightweight experience with no medical profile to fill out, and you decide at all times what is shared.",
  },
  {
    category: "Account",
    q: "How do I delete my account?",
    a: "Account deletion is available from your settings page. It permanently removes your data. Because this cannot be undone, the flow requires a confirmation step.",
  },
  {
    category: "Onboarding & Snapshot",
    q: "What is the Personal Menopause Snapshot™?",
    a: "It is a short, structured check-in that produces a baseline across symptoms, sleep, vitality, and emotional balance. It gives you a starting picture you can compare against over time.",
  },
  {
    category: "Onboarding & Snapshot",
    q: "How long does the snapshot take?",
    a: "Around five minutes. You can pause and return if you are interrupted — your answers are saved as you go.",
  },
  {
    category: "Onboarding & Snapshot",
    q: "Do I need the snapshot to use the app?",
    a: "The snapshot personalizes everything, so we strongly recommend it. Without it, tracking still works, but insights are generic because there is no baseline to compare against.",
  },
  {
    category: "Tracking",
    q: "What can I track from day to day?",
    a: "Symptoms, mood, sleep, and energy, using quick check-ins designed to take under a minute. The point is consistency, not exhaustive detail.",
  },
  {
    category: "Tracking",
    q: "How does the app find patterns?",
    a: "A deterministic engine calculates changes from your own entries — it does not guess. AI then interprets those calculated patterns in plain language, and only when consent allows personalization.",
  },
  {
    category: "Tracking",
    q: "What if I miss days?",
    a: "Nothing breaks. The engine accounts for gaps and tells you honestly when there is not yet enough data to draw a conclusion, rather than inventing one.",
  },
  {
    category: "AI & Privacy",
    q: "Does the AI diagnose me?",
    a: "No. HerCompassAI is non-diagnostic by design. Guardrails remove diagnostic language, dosage advice, and clinical prescriptions from AI output. We explain and observe; your clinician decides.",
  },
  {
    category: "AI & Privacy",
    q: "Is my data sold or shared?",
    a: "Never. Your data is not sold. It is not shared with advertisers. Partner visibility is entirely member-controlled and limited to consented, high-level summaries.",
  },
  {
    category: "AI & Privacy",
    q: "How is my information protected?",
    a: "Data is encrypted in transit and at rest, access is role-scoped, and we practice data minimization — we collect what the service needs and not more. See the Security page for details.",
  },
  {
    category: "Partner Support",
    q: "Can my partner see my raw symptom logs?",
    a: "No. Partners only receive consented, high-level summaries such as \"sleep was interrupted this week.\" Cycle dates, timestamps, and private notes are never exposed.",
  },
  {
    category: "Partner Support",
    q: "What is the Men's Academy?",
    a: "A five-module curriculum that helps partners understand the biology, mood, sleep, communication, and intimacy aspects of the transition. It is included with Premium.",
  },
  {
    category: "Partner Support",
    q: "How much time does partner support take?",
    a: "Under five minutes a week for the digest, plus optional short Academy lessons whenever they have a spare moment.",
  },
  {
    category: "Billing",
    q: "What plans are available?",
    a: "Free, Plus, and Premium. Free covers the snapshot and basic tracking; Plus adds deeper pattern intelligence and partner digest preview; Premium adds advanced personalization, the couple experience, and the Men's Academy.",
  },
  {
    category: "Billing",
    q: "How do I change or cancel my plan?",
    a: "From your subscription page you can change plans or open the secure billing portal to cancel. Cancelling keeps your access until the end of the paid period.",
  },
  {
    category: "Billing",
    q: "Who processes my payment?",
    a: "Stripe, a PCI-compliant payment provider. HerCompassAI never stores your full card number; billing details are managed in Stripe's secure portal.",
  },
];

const CATEGORY_ICONS: Record<Exclude<Category, "All">, React.ElementType> = {
  Account: Users,
  "Onboarding & Snapshot": Sparkles,
  Tracking: Activity,
  "AI & Privacy": ShieldCheck,
  "Partner Support": Users,
  Billing: CreditCard,
};

export default function FaqPageClient() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category>("All");
  const [openKey, setOpenKey] = useState<string | null>("Account-0");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQS.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const matchesQuery =
        q.length === 0 ||
        item.q.toLowerCase().includes(q) ||
        item.a.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <div className="animate-fadeIn">
      {/* Hero */}
      <section className="relative overflow-hidden pt-12 pb-10 sm:pt-16 sm:pb-14 border-b border-slate-200/80 bg-gradient-to-b from-[#FAF9F6] via-white to-white">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[90vw] max-w-[620px] h-[220px] bg-gradient-to-tr from-purple-200/30 via-indigo-100/25 to-rose-100/20 blur-[110px] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-violet-50/80 px-3.5 py-1 text-xs font-semibold text-violet-700 shadow-xs mb-4">
            <HelpCircle className="h-3.5 w-3.5 text-violet-600" />
            <span>Help Center</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Frequently asked questions
          </h1>
          <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Search or browse by topic. If your question is not here, our support team is a
            message away.
          </p>

          <div className="relative mx-auto mt-7 max-w-xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search questions and answers"
              aria-label="Search frequently asked questions"
              className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
            />
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10 sm:py-14 bg-[#FAF9F6]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by topic">
            {CATEGORIES.map((item) => {
              const isActive = category === item;
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setCategory(item)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-violet-600 text-white shadow-md shadow-violet-500/25"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {item}
                </button>
              );
            })}
          </div>

          {filtered.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-10 text-center">
              <HelpCircle className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-3 text-sm font-semibold text-slate-700">
                No questions match your search.
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Try a different word, or{" "}
                <Link href="/contact" className="font-semibold text-violet-700 hover:text-violet-800">
                  contact support
                </Link>
                .
              </p>
            </div>
          ) : (
            <ul className="mt-8 space-y-3">
              {filtered.map((item, index) => {
                const key = `${item.category}-${index}`;
                const isOpen = openKey === key;
                const Icon = CATEGORY_ICONS[item.category];
                return (
                  <li
                    key={key}
                    className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenKey(isOpen ? null : key)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-slate-50/60 sm:p-5"
                    >
                      <span className="flex min-w-0 items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            {item.category}
                          </span>
                          <span className="block text-sm font-bold text-slate-900">
                            {item.q}
                          </span>
                        </span>
                      </span>
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
                        {item.a}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* Still need help */}
      <section className="py-12 sm:py-16 bg-white border-t border-slate-200/80">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <Clock className="mx-auto h-7 w-7 text-violet-600" />
          <h2 className="mt-3 text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
            Still have a question?
          </h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">
            Reach member support, clinical advisory, or partnership inquiries from one
            place.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition-all hover:-translate-y-0.5"
          >
            Contact us
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
