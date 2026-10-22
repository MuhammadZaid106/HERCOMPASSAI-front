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
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/90 bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-violet-700 shadow-xs mb-5 backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-violet-600 animate-pulse" />
              <span>Relationship Intelligence</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              Feel Like Yourself Again.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600">
                Navigate Menopause Together.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="mt-5 text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-2xl font-normal">
              A relationship intelligence platform that translates daily hormone signals into{" "}
              <span className="font-semibold text-slate-800">
                restorative sleep, cooling routines, and member-controlled partner digests
              </span>
              . Grounded in science. Backed by specialists. Designed for real couples.
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
                <span>Take Free Assessment</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 shadow-xs hover:border-violet-300 hover:bg-violet-50/40 hover:text-violet-900 transition-all"
              >
                <span>Explore Science &amp; Features</span>
              </Link>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 font-medium">
              <span>✓ 100% Free Baseline Assessment</span>
              <span>✓ No Credit Card Required</span>
              <span>✓ Strict Member Consent</span>
            </div>

            {/* Social Proof with Real Avatars (Inspired by Balance & Evernow) */}
            <div className="mt-8 flex flex-wrap items-center gap-3 pt-6 border-t border-slate-200/70 w-full">
              <div className="flex -space-x-2 overflow-hidden">
                <img
                  src="/images/landing/hero-woman.webp"
                  alt="Member Maria"
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                />
                <img
                  src="/images/landing/care-plan.webp"
                  alt="Member Sarah"
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                />
                <img
                  src="/images/landing/specialist-nurse.jpg"
                  alt="Clinician specialist"
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                />
                <img
                  src="/images/landing/consultation-smiling.jpg"
                  alt="Member Elena"
                  className="inline-block h-9 w-9 rounded-full ring-2 ring-white object-cover"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="font-bold text-slate-900 ml-1 text-xs">4.9/5 Rating</span>
                </div>
                <span className="text-[11px] text-slate-600">
                  Empowering over <strong className="text-slate-800">12,500+ women &amp; partners</strong> across midlife
                </span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Elevated Photographic Showcase with Floating Telemetry Cards */}
          <div className="lg:col-span-5 relative">
            {/* Atmospheric Outer Glow */}
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-violet-400/25 via-purple-300/20 to-amber-200/25 blur-2xl opacity-75" />

            {/* Main Visual Container */}
            <div className="relative rounded-3xl border border-slate-200/90 bg-white p-3 sm:p-4 shadow-2xl shadow-slate-300/40 overflow-hidden">
              
              {/* Cinematic Woman & Warmth Photography Frame */}
              <div className="relative h-[480px] sm:h-[530px] w-full rounded-2xl overflow-hidden bg-slate-900">
                <img
                  src="/images/landing/hero-woman.webp"
                  alt="Confident, healthy midlife woman smiling in sunlight"
                  className="h-full w-full object-cover object-top opacity-95 transition-transform duration-700 hover:scale-105"
                />

                {/* Subtle dark gradient overlay at top & bottom for card readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />

                {/* FLOATING GLASS CARD 1: Restorative Sleep (Top Left) */}
                <div className="absolute top-4 left-4 rounded-2xl bg-white/90 backdrop-blur-md p-3 shadow-xl border border-white/60 max-w-[210px] animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 flex-shrink-0 shadow-xs">
                      <Moon className="h-4.5 w-4.5 stroke-[2.2]" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-slate-900">Sleep Score: 90%</div>
                      <div className="text-[10px] text-emerald-600 font-semibold">+28% Deep REM Rest</div>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-slate-100 text-[9px] text-slate-500 flex items-center justify-between">
                    <span>Average 7.6 hrs</span>
                    <span className="text-emerald-700 font-semibold">Restorative</span>
                  </div>
                </div>

                {/* FLOATING GLASS CARD 2: Clinical Guideline Badge (Top Right) */}
                <div className="absolute top-4 right-4 rounded-xl bg-slate-900/80 backdrop-blur-md px-3 py-1.5 text-white border border-white/20 shadow-lg flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-violet-400" />
                  <span className="text-[10px] font-semibold">ACOG &amp; NAMS Verified</span>
                </div>

                {/* FLOATING GLASS CARD 3: Hot Flash Risk Mitigation (Center Right) */}
                <div className="absolute top-1/2 -translate-y-1/2 right-4 rounded-2xl bg-white/90 backdrop-blur-md p-3 shadow-xl border border-white/60 max-w-[190px] hidden sm:block animate-in fade-in duration-700">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-600 flex-shrink-0">
                      <Flame className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-900">Hot Flash Risk: 6%</span>
                      <p className="text-[9px] text-rose-700 font-semibold">Down 18% with cooling walks</p>
                    </div>
                  </div>
                </div>

                {/* FLOATING GLASS CARD 4: Partner Support & Consented Digest (Bottom) */}
                <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-slate-900/90 text-white backdrop-blur-md p-3.5 shadow-2xl border border-white/15 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600 text-white shadow-xs">
                        <HeartHandshake className="h-4 w-4" />
                      </div>
                      <span className="text-xs font-bold text-violet-200">
                        Consented Partner Digest
                      </span>
                    </div>
                    <span className="rounded-full bg-emerald-500/20 text-emerald-300 px-2 py-0.5 text-[9px] font-bold border border-emerald-500/30">
                      Zero Raw Logs Shared
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-200 leading-snug">
                    {"\"Partner received actionable Monday guide: Prepare tonight's magnesium dinner together & take a 15-min calm cooling walk.\""}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
                    <span>Maria, 47 &amp; Mark, 50 • Perimenopause Track</span>
                    <span className="text-violet-300 font-semibold flex items-center gap-1">
                      Co-Regulation Active <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Micro Trust Indicator beneath Visual */}
            <div className="mt-3 flex items-center justify-center gap-6 text-[11px] font-semibold text-slate-500">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> CQC Standard Benchmarked
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> ORCHA Digital Health Level
              </span>
            </div>

          </div>

        </div>

        {/* BOTTOM METRICS IMPACT BAR (Across full width) */}
        <div className="mt-14 sm:mt-18 pt-8 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center sm:text-left">
          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              -18%
            </span>
            <span className="text-xs font-semibold text-violet-700 mt-0.5">
              Vasomotor Severity
            </span>
            <p className="text-[11px] text-slate-500 mt-1">
              Average reduction in hot flash frequency in first 14 days
            </p>
          </div>

          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              90%
            </span>
            <span className="text-xs font-semibold text-emerald-600 mt-0.5">
              Restorative Sleep Index
            </span>
            <p className="text-[11px] text-slate-500 mt-1">
              Fall asleep 25 min faster with adaptive wind-down protocols
            </p>
          </div>

          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              12,500+
            </span>
            <span className="text-xs font-semibold text-indigo-600 mt-0.5">
              Women &amp; Partners
            </span>
            <p className="text-[11px] text-slate-500 mt-1">
              Navigating perimenopause and menopause with mutual confidence
            </p>
          </div>

          <div className="flex flex-col">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              100%
            </span>
            <span className="text-xs font-semibold text-amber-600 mt-0.5">
              Member-Controlled Privacy
            </span>
            <p className="text-[11px] text-slate-500 mt-1">
              Partners receive high-level empathy digests, never raw private diaries
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
