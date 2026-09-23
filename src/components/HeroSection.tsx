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
  ChevronRight,
  Eye,
  Shield,
  Activity,
  ArrowRight,
} from "lucide-react";

type MetricType = "mood" | "flash" | "sleep" | "partner";

export default function HeroSection() {
  const [activeMetric, setActiveMetric] = useState<MetricType>("sleep");
  const [activeTab, setActiveTab] = useState<"member" | "partner">("member");

  const insights: Record<
    MetricType,
    { title: string; detail: string; citation: string; badge: string }
  > = {
    mood: {
      title: "Mood Pattern: Stable & Supported",
      detail:
        "Mood score reached 100 ↗ this week (+14% increase). Correlation observed between consistent evening wind-down routine and reduced daytime emotional reactivity.",
      citation: "Evidence: NIH / NAMS Behavioral Health Guidelines",
      badge: "High Consistency",
    },
    flash: {
      title: "Vasomotor Symptom Risk: 6% (Low)",
      detail:
        "Hot flash likelihood reduced significantly from previous 32% baseline. Nighttime temperature spikes were mitigated on days with 15-min evening cooling walks.",
      citation: "Evidence: ACOG Perimenopausal Guidelines 2023",
      badge: "Down 18% WoW",
    },
    sleep: {
      title: "Sleep Quality Score: 90% (Restorative)",
      detail:
        "7.6 hours average rest. Falling asleep latency improved by 25 minutes after incorporating magnesium-rich dinners and avoiding afternoon caffeine.",
      citation: "Evidence: Stanford Sleep & Hormone Regulation Study",
      badge: "Deep Sleep +28%",
    },
    partner: {
      title: "Consented Digest Delivered to Partner",
      detail:
        "Partner read the Monday summary and received actionable advice: 'Support Maria with a calm evening walk and prepare magnesium-rich dinner together.'",
      citation: "Privacy: Zero raw symptom logs exposed",
      badge: "Co-Regulation Active",
    },
  };

  return (
    <section className="relative overflow-hidden pt-10 pb-20 lg:pt-16 lg:pb-28">
      {/* Background radial glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-violet-200/40 via-purple-100/30 to-amber-100/20 blur-[110px] pointer-events-none -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Top Pill Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-violet-50/70 px-3.5 py-1.5 text-xs font-semibold text-violet-700 shadow-sm mb-6">
              <span className="flex h-2 w-2 rounded-full bg-violet-600 animate-pulse" />
              <span>Evidence-Based Relationship & Midlife Intelligence</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              Navigate Menopause —{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600">
                Together.
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl font-normal">
              A relationship-centered wellness platform that combines
              clinician-backed guidance, longitudinal tracking, and safe AI
              insights to help women and their partners build{" "}
              <span className="font-semibold text-slate-800">
                predictability, connection, and confidence
              </span>
              .
            </p>

            {/* Dual CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-7 py-4 text-base font-semibold text-white shadow-xl shadow-violet-500/25 transition-all hover:shadow-2xl hover:shadow-violet-500/35 hover:-translate-y-0.5 active:translate-y-0 text-center"
              >
                <Sparkles className="h-5 w-5 text-violet-200" />
                <span>Take 5-Min Free Snapshot</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white/80 px-6 py-4 text-base font-semibold text-slate-700 backdrop-blur-sm transition-all hover:border-violet-300 hover:bg-violet-50/50 hover:text-violet-900 text-center"
              >
                <span>Start Free Trial</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-slate-200/70 w-full">
              <div className="flex items-center gap-2.5 text-slate-700">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
                </div>
                <span className="text-xs font-semibold">
                  Backed by Clinicians (ACOG & NAMS)
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-100 text-sky-600">
                  <Activity className="h-4 w-4 stroke-[2.5]" />
                </div>
                <span className="text-xs font-semibold">
                  AI-Powered Predictive Insights
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                  <HeartHandshake className="h-4 w-4 stroke-[2.5]" />
                </div>
                <span className="text-xs font-semibold">
                  Designed for Couples & Privacy
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Redesigned Interactive Weekly Snapshot */}
          <div className="lg:col-span-5 relative">
            {/* Soft decorative glow */}
            <div className="absolute -inset-1.5 rounded-3xl bg-gradient-to-r from-violet-400/20 via-purple-300/20 to-indigo-400/20 blur-xl opacity-70" />

            <div className="relative rounded-3xl border border-slate-200/90 bg-white/95 p-6 shadow-2xl shadow-slate-200/60 backdrop-blur-sm">
              {/* Card Header & View Switcher */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      Weekly Snapshot
                    </h3>
                    <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-[11px] font-semibold text-violet-700">
                      Live Preview
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Maria, 47 • Perimenopause Pattern • Week 4
                  </p>
                </div>

                {/* Perspective Toggle: Member vs Partner */}
                <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200/60">
                  <button
                    type="button"
                    onClick={() => setActiveTab("member")}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                      activeTab === "member"
                        ? "bg-white text-violet-700 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Her View
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("partner")}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                      activeTab === "partner"
                        ? "bg-white text-violet-700 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Partner View
                  </button>
                </div>
              </div>

              {/* Conditional Content based on Tab */}
              {activeTab === "member" ? (
                <>
                  {/* Interactive 4-Metric Grid */}
                  <div className="mt-5 grid grid-cols-2 gap-3.5">
                    {/* Mood Trend */}
                    <button
                      type="button"
                      onClick={() => setActiveMetric("mood")}
                      className={`text-left rounded-2xl p-4 transition-all duration-200 border ${
                        activeMetric === "mood"
                          ? "bg-violet-50/90 border-violet-400 ring-2 ring-violet-400/20 shadow-sm"
                          : "bg-violet-50/30 border-violet-100/70 hover:bg-violet-50/60"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                        <span>Mood Trend</span>
                        <TrendingUp className="h-3.5 w-3.5 text-violet-600" />
                      </div>
                      <div className="mt-2.5 flex items-baseline gap-1.5">
                        <span className="text-2xl font-bold text-slate-900">
                          100
                        </span>
                        <span className="text-sm font-bold text-violet-600">
                          ↗
                        </span>
                      </div>
                      <span className="mt-1 inline-block text-[10px] font-semibold text-violet-700">
                        Top Stability
                      </span>
                    </button>

                    {/* Hot Flash Risk */}
                    <button
                      type="button"
                      onClick={() => setActiveMetric("flash")}
                      className={`text-left rounded-2xl p-4 transition-all duration-200 border ${
                        activeMetric === "flash"
                          ? "bg-rose-50/90 border-rose-400 ring-2 ring-rose-400/20 shadow-sm"
                          : "bg-rose-50/30 border-rose-100/70 hover:bg-rose-50/60"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                        <span>Hot Flash Risk</span>
                        <Flame className="h-3.5 w-3.5 text-rose-500" />
                      </div>
                      <div className="mt-2.5 flex items-baseline gap-1.5">
                        <span className="text-2xl font-bold text-slate-900">
                          6%
                        </span>
                        <span className="text-xs font-semibold text-emerald-600">
                          (-18%)
                        </span>
                      </div>
                      <span className="mt-1 inline-block text-[10px] font-semibold text-rose-700">
                        Very Low Risk
                      </span>
                    </button>

                    {/* Sleep Score */}
                    <button
                      type="button"
                      onClick={() => setActiveMetric("sleep")}
                      className={`text-left rounded-2xl p-4 transition-all duration-200 border ${
                        activeMetric === "sleep"
                          ? "bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-400/20 shadow-sm"
                          : "bg-emerald-50/30 border-emerald-100/70 hover:bg-emerald-50/60"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                        <span>Sleep Score</span>
                        <Moon className="h-3.5 w-3.5 text-emerald-600" />
                      </div>
                      <div className="mt-2.5 flex items-baseline gap-1.5">
                        <span className="text-2xl font-bold text-slate-900">
                          90%
                        </span>
                        <span className="text-xs font-semibold text-emerald-600">
                          7.6 hrs
                        </span>
                      </div>
                      <span className="mt-1 inline-block text-[10px] font-semibold text-emerald-700">
                        Deep Sleep Up
                      </span>
                    </button>

                    {/* Partner Read */}
                    <button
                      type="button"
                      onClick={() => setActiveMetric("partner")}
                      className={`text-left rounded-2xl p-4 transition-all duration-200 border ${
                        activeMetric === "partner"
                          ? "bg-amber-50/90 border-amber-400 ring-2 ring-amber-400/20 shadow-sm"
                          : "bg-amber-50/30 border-amber-100/70 hover:bg-amber-50/60"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                        <span>Partner Read</span>
                        <HeartHandshake className="h-3.5 w-3.5 text-amber-600" />
                      </div>
                      <div className="mt-2.5 flex items-baseline gap-1.5">
                        <span className="text-2xl font-bold text-slate-900">
                          Yes
                        </span>
                        <span className="text-xs font-medium text-amber-700">
                          Mon 8:15 AM
                        </span>
                      </div>
                      <span className="mt-1 inline-block text-[10px] font-semibold text-amber-700">
                        Consented Digest
                      </span>
                    </button>
                  </div>

                  {/* Dynamic AI Interpretation Drawer */}
                  <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200/80 p-4 transition-all animate-in fade-in-50 duration-300">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-violet-600" />
                        <h4 className="text-xs font-bold text-slate-900">
                          {insights[activeMetric].title}
                        </h4>
                      </div>
                      <span className="rounded-md bg-white px-2 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-200">
                        {insights[activeMetric].badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {insights[activeMetric].detail}
                    </p>
                    <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-200/60 text-[10px] text-slate-400 font-medium">
                      <span>{insights[activeMetric].citation}</span>
                      <span className="text-violet-600 font-semibold cursor-pointer hover:underline">
                        View Science Note →
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                /* Partner Perspective View */
                <div className="mt-5 space-y-3.5 animate-in fade-in-50 duration-200">
                  <div className="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-amber-900">
                        Partner Digest Summary (What He Sees)
                      </span>
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                        Privacy Preserved
                      </span>
                    </div>
                    <p className="text-xs text-amber-900/90 leading-relaxed">
                      &quot;Maria is focusing on magnesium-rich meals and sleep
                      recovery this week. Her stress is trending lower, but
                      evenings are her key wind-down time.&quot;
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2.5">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>Suggested Partner Support Action</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <strong>Do:</strong> Offer to prepare tonight&apos;s
                      spinach-lentil dinner together or invite her for a
                      15-minute calm cooling walk.
                    </p>
                    <p className="text-xs text-slate-500">
                      <strong>Avoid:</strong> Heavy problem-solving or late
                      evening caffeine.
                    </p>
                  </div>
                </div>
              )}

              {/* Bottom Privacy Statement */}
              <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-[11px] font-medium text-slate-600">
                    Consented Scoped Digest — Raw health logs are never shared.
                  </span>
                </div>
                <Link
                  href="/partner"
                  className="text-[11px] font-semibold text-violet-600 hover:text-violet-800 whitespace-nowrap"
                >
                  Learn how CPS works →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
