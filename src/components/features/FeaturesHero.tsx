"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, CheckCircle2 } from "lucide-react";

export type FeatureCategory =
  | "all"
  | "snapshot"
  | "trends"
  | "lifestyle"
  | "partner"
  | "clinical";

interface FeaturesHeroProps {
  selectedCategory: FeatureCategory;
  onSelectCategory: (category: FeatureCategory) => void;
}

export default function FeaturesHero({
  selectedCategory,
  onSelectCategory,
}: FeaturesHeroProps) {
  const categories: { id: FeatureCategory; label: string; icon: string }[] = [
    { id: "all", label: "All Pillars", icon: "✨" },
    { id: "snapshot", label: "Baseline Snapshot™", icon: "📋" },
    { id: "trends", label: "Deterministic Trend Engine", icon: "📈" },
    { id: "lifestyle", label: "Nutrition & Cooling", icon: "🥑" },
    { id: "partner", label: "Couple & Partner Support (CPS)", icon: "🤝" },
    { id: "clinical", label: "SCI & Evidence Guardrails", icon: "🔬" },
  ];

  return (
    <section className="relative overflow-hidden pt-6 pb-10 sm:pt-12 sm:pb-16 lg:pt-18 lg:pb-20 border-b border-slate-200/80 bg-gradient-to-b from-[#FAF9F6] via-white to-white">
      {/* Serene Ambient Backdrops */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[90vw] max-w-[600px] h-[220px] sm:h-[350px] bg-gradient-to-tr from-purple-200/30 via-indigo-100/25 to-rose-100/20 blur-[100px] sm:blur-[130px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 text-center">
        {/* Trust Pill */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-violet-200/80 bg-violet-50/80 px-3 py-1 text-[11px] sm:text-xs font-semibold text-violet-700 shadow-xs mb-4 sm:mb-5 max-w-full">
          <Sparkles className="h-3.5 w-3.5 text-violet-600 shrink-0" />
          <span className="truncate sm:whitespace-normal">Clinical &amp; Relationship Intelligence Architecture</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.2] sm:leading-[1.15]">
          Engineered for Clinical Precision.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 block sm:inline mt-1 sm:mt-0">
            Designed for Human Connection.
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="mt-3 sm:mt-5 text-xs sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed px-1">
          HerCompassAI bridges the gap between individual midlife physiological shifts and household empathy.
          Explore the six architectural pillars uniting deterministic calculation, empathetic AI translation,
          and private couple co-regulation.
        </p>

        {/* Action CTAs */}
        <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 max-w-md mx-auto w-full">
          <Link
            href="/onboarding"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/35 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles className="h-4 w-4 shrink-0" />
            <span>Start Free 5-Min Assessment</span>
            <ArrowRight className="h-3.5 w-3.5 shrink-0" />
          </Link>
          <Link
            href="/#pricing"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-all hover:border-slate-300"
          >
            <span>Explore Plans</span>
          </Link>
        </div>

        {/* Trust Badges Bar */}
        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-slate-200/60 flex flex-wrap items-center justify-center gap-3 sm:gap-6 lg:gap-8 text-slate-600 text-[11px] sm:text-xs font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 shrink-0" />
            <span>NAMS &amp; ACOG Grounded</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-600 shrink-0" />
            <span>HIPAA-Compliant &amp; Private</span>
          </div>
          <div className="flex items-center gap-1.5">
            <HeartHandshake className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-rose-500 shrink-0" />
            <span>Member-Controlled Consent</span>
          </div>
        </div>

        {/* Interactive Category Filter Pills */}
        <div className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 max-w-4xl mx-auto">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-violet-600 text-white shadow-md shadow-violet-500/25 scale-102"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 border border-slate-200/60"
                }`}
              >
                <span className="shrink-0">{cat.icon}</span>
                <span className="truncate">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
