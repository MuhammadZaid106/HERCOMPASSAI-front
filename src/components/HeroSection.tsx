"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  TrendingUp,
  Flame,
  Moon,
  HeartHandshake,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Activity,
  Star,
  Users,
  Award,
  ChevronRight,
  Play,
} from "lucide-react";

export default function HeroSection() {
  const [selectedSymptom, setSelectedSymptom] = useState<number>(0);

  const symptomFocuses = [
    {
      label: "Hot Flashes",
      stat: "-18% severity in 2 wks",
      headline: "Vasomotor Regulation",
      detail:
        "Mitigate sudden temperature spikes with clinical evening cooling strolls and electrolyte rebalancing.",
      citation: "ACOG Perimenopausal Guidelines 2023",
      tag: "Vasomotor Telemetry",
    },
    {
      label: "Restless Sleep",
      stat: "+28% deep sleep",
      headline: "Endocrine Wind-Down Protocol",
      detail:
        "Improve sleep latency by 25 minutes using magnesium-synergized dinners and evening autonomic cooling.",
      citation: "Stanford Sleep & Hormone Regulation Study",
      tag: "Sleep Architecture",
    },
    {
      label: "Brain Fog & Mood",
      stat: "90% emotional stability",
      headline: "Autonomic Nervous Balance",
      detail:
        "Correlation-backed routines mitigate emotional exhaustion and restore daytime cognitive focus.",
      citation: "NAMS Behavioral Health Consensus",
      tag: "Cognitive Energy",
    },
    {
      label: "Energy & Vitality",
      stat: "+35% afternoon stamina",
      headline: "Phytoestrogen & Mineral Radar",
      detail:
        "Targeted nutrition guidance replaces guessing with verified anti-inflammatory dietary strategies.",
      citation: "WHO Midlife Nutritional Science",
      tag: "Metabolic Vitality",
    },
    {
      label: "Couple Connection",
      stat: "Zero-friction digests",
      headline: "Consented Partner Co-Regulation",
      detail:
        "Partners receive actionable Monday suggestions ('Prepare dinner together') with zero raw logs exposed.",
      citation: "CPS Strict Privacy Framework",
      tag: "Relationship Health",
    },
  ];

  const activeFocus = symptomFocuses[selectedSymptom];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FBFBF9] via-[#FAF9F5] to-white pt-8 pb-16 sm:pt-12 sm:pb-24 lg:pt-16 lg:pb-28">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-gradient-to-br from-violet-200/35 via-purple-100/25 to-amber-100/20 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[350px] bg-gradient-to-tr from-sky-100/30 via-indigo-100/20 to-rose-100/15 blur-[100px] pointer-events-none -z-10" />

      {/* Subtle background overlay image for atmospheric depth on larger screens */}
      <div
        className="absolute top-0 right-0 bottom-0 w-full lg:w-3/5 bg-no-repeat bg-right-top bg-cover opacity-[0.07] pointer-events-none -z-10"
        style={{ backgroundImage: `url('/images/landing/hero-woman.webp')` }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: High-converting Copy & Dynamic Symptoms */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Top Pill Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 shadow-xs mb-5">
              <span>UNDERSTANDING MENOPAUSE. TOGETHER.</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Menopause Is a Journey. You Don&apos;t Have to Navigate It Alone.{" "}
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600">
                Understand More. Connect Better. Navigate It Together.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              HerCompassAI helps women understand what they&apos;re experiencing, helps men learn what their partners may be going through, and gives couples practical ways to communicate and support each other.
            </p>

            {/* Interactive Symptom Focus Selector (Inspired by Evernow) */}
            <div className="mt-7 w-full max-w-2xl rounded-2xl border border-slate-200/80 bg-white/80 p-4 sm:p-5 shadow-xs backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Personalized guidance for your priority:</span>
                <span className="text-[11px] font-semibold text-violet-700 lowercase">
                  click to preview telemetry
                </span>
              </div>

              {/* Clickable Symptom Pills */}
              <div className="flex flex-wrap gap-2">
                {symptomFocuses.map((s, idx) => {
                  const isActive = selectedSymptom === idx;
                  return (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => setSelectedSymptom(idx)}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isActive
                          ? "bg-violet-600 text-white shadow-md shadow-violet-500/25 ring-2 ring-violet-400/30 scale-[1.02]"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900"
                      }`}
                    >
                      <span>{s.label}</span>
                      <span
                        className={`text-[10px] rounded-full px-1.5 py-0.2 ${
                          isActive
                            ? "bg-violet-800 text-violet-100 font-bold"
                            : "bg-white text-slate-600 font-medium border border-slate-200"
                        }`}
                      >
                        {s.stat}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Insight Banner for Selected Symptom */}
              <div className="mt-3.5 rounded-xl bg-violet-50/70 border border-violet-100 p-3 text-xs text-slate-700 transition-all animate-in fade-in-50 duration-200">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-violet-950">
                    <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                    <span>{activeFocus.headline}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-violet-700 bg-white px-2 py-0.5 rounded-md border border-violet-100">
                    {activeFocus.tag}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed font-normal">
                  {activeFocus.detail}
                </p>
                <div className="mt-2 pt-2 border-t border-violet-200/40 text-[10px] text-slate-500 font-medium flex items-center justify-between">
                  <span>Evidence: {activeFocus.citation}</span>
                  <Link href="/evidence" className="text-violet-700 font-semibold hover:underline">
                    Clinical Note →
                  </Link>
                </div>
              </div>
            </div>

            {/* CTAs and Micro-copy */}
            <div className="mt-7 flex flex-col items-stretch gap-3 w-full max-w-xs sm:flex-row sm:items-center sm:max-w-none sm:w-auto">
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/35 hover:-translate-y-0.5 active:translate-y-0"
              >
                <Sparkles className="h-4 w-4 text-violet-200" />
                <span>Start Your Free Personal Snapshot</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 shadow-xs hover:border-violet-300 hover:bg-violet-50/40 hover:text-violet-900 transition-all"
              >
                <span>Explore How HerCompassAI Works →</span>
              </Link>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 font-medium">
              <span>✓ 100% Free Baseline Assessment</span>
              <span>✓ No Credit Card Required</span>
              <span>✓ Strict Member Consent</span>
            </div>



          </div>

          {/* RIGHT COLUMN: Dual Journey Showcase (For Her & For Him) */}
          <div className="lg:col-span-5 relative">
            {/* Atmospheric Outer Glow */}
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-violet-400/20 via-purple-300/15 to-amber-200/20 blur-2xl opacity-70" />

            {/* Main Visual Container */}
            <div className="relative rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xl shadow-slate-200/50">
              {/* Dual Cards Grid: For Her & For Him */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* Card 1: For Her */}
                <div className="flex flex-col">
                  <div className="relative h-48 sm:h-44 w-full rounded-2xl overflow-hidden bg-slate-100 shadow-xs">
                    <img
                      src="/images/landing/for-her.jpg"
                      alt="Midlife woman smiling in kitchen"
                      className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-3.5 text-base font-bold text-slate-900">
                    For Her
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    Understand your experiences. Discover possible patterns. Choose what you share.
                  </p>
                </div>

                {/* Card 2: For Him */}
                <div className="flex flex-col">
                  <div className="relative h-48 sm:h-44 w-full rounded-2xl overflow-hidden bg-slate-100 shadow-xs">
                    <img
                      src="/images/landing/for-him.jpg"
                      alt="Couple sitting together on couch having a conversation"
                      className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-3.5 text-base font-bold text-slate-900">
                    For Him
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    Learn what she may be experiencing. Discover how to offer meaningful support.
                  </p>
                </div>
              </div>

              {/* Bottom Tagline & Narrative */}
              <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                <h4 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
                  Better Understanding. Stronger Connection.
                </h4>
                <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                  A shared journey, with her privacy and choices at the center.
                </p>
              </div>
            </div>
          </div>

        </div>



      </div>
    </section>
  );
}
