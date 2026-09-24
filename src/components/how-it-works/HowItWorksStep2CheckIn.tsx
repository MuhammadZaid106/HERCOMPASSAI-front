"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Flame,
  Moon,
  Zap,
  CheckCircle2,
  Calendar,
  Layers,
  Activity,
} from "lucide-react";

export default function HowItWorksStep2CheckIn() {
  const [sleepLogged, setSleepLogged] = useState<"good" | "fair" | "interrupted">("good");
  const [flashesLogged, setFlashesLogged] = useState<number>(1);
  const [energyLogged, setEnergyLogged] = useState<"steady" | "drained" | "peak">("steady");

  // Dynamic calculated preview based on user inputs
  const sleepEfficiency = sleepLogged === "good" ? 92 : sleepLogged === "fair" ? 76 : 58;
  const vasomotorTrend = flashesLogged === 0 ? "-42%" : flashesLogged === 1 ? "-18%" : "+14%";
  const simulatedSeconds = 38;

  return (
    <section id="step-2" className="py-12 sm:py-16 lg:py-24 bg-[#FAF9F6] border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        
        {/* Step Badge & Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-700 mb-3">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">2</span>
            <span>Step 02 — The Under-60-Second Daily Check-In</span>
          </div>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Consistency Without Fatigue. Tap 3 Times and You&apos;re Done.
          </h2>
          <p className="mt-2.5 sm:mt-4 text-xs sm:text-base text-slate-600 leading-relaxed">
            Long medical journals lead to tracking burnout within 10 days. HerCompassAI strips away clutter:
            log your sleep, vasomotor spikes, and energy bandwidth in under 60 seconds before your morning coffee.
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          
          {/* Left Column: Interactive 60s Check-In Simulator */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-5">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-xl shadow-slate-200/50">
              
              {/* Simulator Header with Timer */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">Today&apos;s Morning Check-In</h4>
                    <span className="text-[10px] sm:text-[11px] text-slate-400">Streak: 12 Consecutive Days 🔥</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Avg. Duration</span>
                  <span className="text-xs sm:text-sm font-bold text-indigo-600">{simulatedSeconds} seconds</span>
                </div>
              </div>

              {/* Input 1: Sleep Quality */}
              <div className="mt-4 space-y-2">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Moon className="h-3.5 w-3.5 text-indigo-500" />
                    <span>1. How did you sleep last night?</span>
                  </span>
                  <span className="text-[10px] text-slate-400">1 tap</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: "good", label: "Restful (7h+)" },
                    { key: "fair", label: "1-2 Awakenings" },
                    { key: "interrupted", label: "Night Sweats" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setSleepLogged(opt.key as any)}
                      className={`py-2 px-2 rounded-xl text-center border text-xs font-semibold transition-all cursor-pointer ${
                        sleepLogged === opt.key
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input 2: Vasomotor Spikes */}
              <div className="mt-4 space-y-2">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Flame className="h-3.5 w-3.5 text-rose-500" />
                    <span>2. Approximate hot flash count (last 24h)</span>
                  </span>
                  <span className="text-[10px] text-slate-400">1 tap</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 1, 3, 5].map((count) => (
                    <button
                      key={count}
                      onClick={() => setFlashesLogged(count)}
                      className={`py-2 rounded-xl text-center border text-xs font-semibold transition-all cursor-pointer ${
                        flashesLogged === count
                          ? "bg-rose-500 text-white border-rose-500 shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {count === 0 ? "None" : count === 5 ? "5+" : count}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input 3: Energy Bandwidth */}
              <div className="mt-4 space-y-2">
                <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-amber-500" />
                    <span>3. Energy &amp; cognitive bandwidth today</span>
                  </span>
                  <span className="text-[10px] text-slate-400">1 tap</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: "steady", label: "Steady Energy" },
                    { key: "drained", label: "Brain Fog / Low" },
                    { key: "peak", label: "High Focus" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setEnergyLogged(opt.key as any)}
                      className={`py-2 px-2 rounded-xl text-center border text-xs font-semibold transition-all cursor-pointer ${
                        energyLogged === opt.key
                          ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Check-In Summary Banner */}
              <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-slate-700">Daily Log Instant Complete</span>
                </div>
                <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  Saved Securely
                </span>
              </div>

            </div>
          </div>

          {/* Right Column: Deterministic Trend Calculations & Weekly Shifts */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Live Deterministic Math Output Card */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-xl shadow-slate-200/50">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  <span>Real-Time Longitudinal Aggregations</span>
                </span>
                <span className="text-[10px] text-slate-400">Updated Daily at 06:00 AM</span>
              </div>

              {/* 3 Metric Output Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Metric 1 */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wide block">Sleep Score</span>
                  <div className="text-xl font-extrabold text-slate-900 mt-1">{sleepEfficiency}%</div>
                  <span className={`text-[10px] font-semibold mt-0.5 block ${
                    sleepEfficiency > 75 ? "text-emerald-600" : "text-amber-600"
                  }`}>
                    {sleepEfficiency > 75 ? "+8% vs 30-Day Avg" : "-12% Sleep Deficit"}
                  </span>
                </div>

                {/* Metric 2 */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wide block">Vasomotor 7D</span>
                  <div className="text-xl font-extrabold text-slate-900 mt-1">{vasomotorTrend}</div>
                  <span className="text-[10px] font-semibold text-emerald-600 mt-0.5 block">
                    Cooling Shift
                  </span>
                </div>

                {/* Metric 3 */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wide block">Streak Count</span>
                  <div className="text-xl font-extrabold text-indigo-600 mt-1">12 Days</div>
                  <span className="text-[10px] font-semibold text-slate-500 mt-0.5 block">
                    High Reliability
                  </span>
                </div>

              </div>

              {/* Trigger Insight generated by Trend Engine */}
              <div className="mt-4 p-4 rounded-2xl bg-slate-900 text-white space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold flex items-center gap-1.5 text-teal-300">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Algorithmic Trigger Correlation</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Deterministic Engine</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Your last 14 logs show an <strong>82% statistical correlation</strong> between high evening screen brightness past 10 PM and 3:00 AM thermoregulatory awakenings.
                </p>
              </div>

              {/* Action Suggestion */}
              <div className="mt-4 p-3 rounded-xl bg-violet-50/80 border border-violet-100 flex items-center justify-between text-xs">
                <span className="text-violet-900 font-medium">
                  Prepared for Sunday Weekly Digest synthesis
                </span>
                <span className="text-[11px] font-bold text-violet-700">Auto-Queued</span>
              </div>

            </div>

            {/* Feature Note */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100 text-teal-700 shrink-0 font-bold">
                <Calendar className="h-4 w-4" />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Missed a day? No punitive guilt trips. HerCompassAI uses decay-weighted averages so your trends remain statistically valid even if you travel or forget.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
