"use client";

import React, { useState } from "react";
import {
  TrendingDown,
  TrendingUp,
  Calculator,
  Cpu,
  Clock,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function FeaturesPillarTrendEngine() {
  const [timeframe, setTimeframe] = useState<"7d" | "30d">("7d");

  const trendData = {
    "7d": {
      hotFlashChange: "-32%",
      hotFlashTrend: "down",
      hotFlashContext: "4 episodes vs 7 baseline",
      sleepScore: "86/100",
      sleepVariance: "+14 pts improved",
      streak: "7 consecutive days",
      aiInterpretation:
        "Your evening logs show hot flash likelihood decreased notably on days with an evening cooling walk. Nighttime awakenings were concentrated between 2:30 AM and 3:15 AM.",
    },
    "30d": {
      hotFlashChange: "-44%",
      hotFlashTrend: "down",
      hotFlashContext: "Sustained stability across cycle",
      sleepScore: "82/100",
      sleepVariance: "+22 pts vs Month 1",
      streak: "28 of 30 days logged",
      aiInterpretation:
        "Over the past 30 days, your deterministic pattern indicates your longest symptom-free intervals coincided with consistent magnesium intake and structured co-regulation walks with your partner.",
    },
  };

  const activeData = trendData[timeframe];

  return (
    <section
      id="trends"
      className="py-12 sm:py-16 lg:py-24 bg-[#FAF9F6] border-b border-slate-200/80"
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 mb-3">
            <span>Pillar 02 — Mathematical Precision + Empathetic AI</span>
          </div>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Deterministic Engine Calculates. AI Gateway Interprets.
          </h2>
          <p className="mt-2.5 sm:mt-4 text-xs sm:text-base text-slate-600 leading-relaxed">
            Generic chatbots hallucinate statistics and guess medical
            correlations. HerCompassAI separates calculation from
            interpretation: our deterministic kernel computes exact mathematical
            metrics, and our AI interprets verified numbers into soothing, clear
            context.
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
          {/* Left Column: Architectural Contrast */}
          <div className="lg:col-span-6 space-y-3.5 sm:space-y-5">
            {/* Rule Card 1 */}
            <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-violet-100 text-violet-700 font-bold shrink-0">
                  <Calculator className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    1. Deterministic Calculation (Zero Hallucinations)
                  </h4>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono">
                    Engine: TypeScript Math Kernel
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-9 sm:pl-10.5">
                Strict software algorithms calculate percentage changes (e.g.{" "}
                <strong>+22%</strong> symptom frequency), sleep scores, streaks,
                cycle length shifts, and partner digest consent scopes. Never
                delegated to an LLM.
              </p>
            </div>

            {/* Rule Card 2 */}
            <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 font-bold shrink-0">
                  <Cpu className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    2. HerCompass AI Gateway (Llama 3 / Med42)
                  </h4>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 font-mono">
                    SCI Layer: Non-Diagnostic Verifier
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-9 sm:pl-10.5">
                Our AI models only receive verified numbers and approved
                clinical citations. They formulate empathetic observational
                commentary and actionable daily tips, guarded by our Safety
                &amp; Compliance layer.
              </p>
            </div>

            {/* Rule Card 3 */}
            <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold shrink-0">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                    3. Under 60 Seconds Daily Check-In
                  </h4>
                  <span className="text-[10px] sm:text-[11px] text-slate-500">
                    Fast, friction-free logging
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-9 sm:pl-10.5">
                No tedious forms. Four quick taps record sleep, vasomotor
                activity, energy, and mood in under 60 seconds, maintaining
                longitudinal tracking streaks effortlessly.
              </p>
            </div>
          </div>

          {/* Right Column: Live Interactive Simulation */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 lg:p-7 shadow-xl shadow-slate-200/60">
              {/* Header with Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-100 gap-2.5">
                <div>
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-violet-700">
                    Live Calculation Sandbox
                  </span>
                  <p className="text-xs text-slate-500">
                    Real-time deterministic output
                  </p>
                </div>
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl w-full sm:w-auto justify-between sm:justify-start">
                  <button
                    type="button"
                    onClick={() => setTimeframe("7d")}
                    className={`flex-1 sm:flex-initial text-center px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      timeframe === "7d"
                        ? "bg-white text-violet-700 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    7-Day Rolling
                  </button>
                  <button
                    type="button"
                    onClick={() => setTimeframe("30d")}
                    className={`flex-1 sm:flex-initial text-center px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      timeframe === "30d"
                        ? "bg-white text-violet-700 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    30-Day Cycle
                  </button>
                </div>
              </div>

              {/* Verified Deterministic Output Badges */}
              <div className="mt-4 sm:mt-5 grid grid-cols-2 gap-2.5 sm:gap-3">
                <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                      Vasomotor Shift
                    </span>
                    <TrendingDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 shrink-0" />
                  </div>
                  <span className="text-lg sm:text-2xl font-black text-slate-900 mt-1 block">
                    {activeData.hotFlashChange}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold line-clamp-1 sm:line-clamp-none">
                    {activeData.hotFlashContext}
                  </span>
                </div>

                <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                      Sleep Score
                    </span>
                    <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-600 shrink-0" />
                  </div>
                  <span className="text-lg sm:text-2xl font-black text-slate-900 mt-1 block">
                    {activeData.sleepScore}
                  </span>
                  <span className="text-[10px] text-indigo-700 font-semibold line-clamp-1 sm:line-clamp-none">
                    {activeData.sleepVariance}
                  </span>
                </div>
              </div>

              {/* Verification Tag */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-1 text-[11px] px-1 text-slate-500">
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>Deterministic Kernel: Verified</span>
                </span>
                <span className="font-mono text-slate-400">
                  {activeData.streak}
                </span>
              </div>

              {/* AI Gateway Translation Result */}
              <div className="mt-3.5 sm:mt-4 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-violet-50/70 via-purple-50/50 to-indigo-50/40 border border-violet-200/80 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-800">
                    <Sparkles className="h-3.5 w-3.5 text-violet-600 shrink-0" />
                    <span>AI Gateway Observational Synthesis</span>
                  </span>
                  <span className="rounded-full bg-violet-200/60 px-2 py-0.5 text-[9px] font-bold text-violet-800">
                    SCI Guardrails Passed
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  &ldquo;{activeData.aiInterpretation}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
