"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";

/**
 * The soft upsell shown when a member opens a Plus-only card.
 *
 * It never reads "locked". A preview stays visible above it (title, why), and
 * this card names what the upgrade would add instead of blocking the content.
 */

interface EntitlementGateProps {
  headline?: string;
  description: string;
  ctaLabel?: string;
}

export default function EntitlementGate({
  headline = "Go deeper with HerCompass Plus",
  description,
  ctaLabel = "See what Plus includes",
}: EntitlementGateProps) {
  return (
    <section className="rounded-3xl border border-violet-200 bg-violet-50 p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-violet-600 to-indigo-600 text-white shadow-sm">
          <Sparkles className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-extrabold tracking-tight text-slate-900">{headline}</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-700">{description}</p>
          <Link
            href="/upgrade"
            className="mt-4 inline-flex min-h-11 items-center rounded-full bg-violet-600 px-5 text-sm font-bold text-white transition hover:bg-violet-700"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}