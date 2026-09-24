"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Activity,
  Flame,
  Moon,
  Brain,
  Zap,
  Smile,
  Shield,
  Heart,
} from "lucide-react";

export default function FeaturesPillarSnapshot() {
  const [activeProfile, setActiveProfile] = useState<"maria" | "elena">("maria");

  const profiles = {
    maria: {
      name: "Maria, 47",
      stage: "Perimenopause (Estrogen Fluctuations)",
      vasomotor: { score: "Moderate Risk (38%)", trend: "Down from 46% baseline", color: "text-amber-600 bg-amber-50" },
      sleep: { score: "68/100 (Fragmented)", note: "Average 2 nocturnal wakes between 2-4 AM", color: "text-indigo-600 bg-indigo-50" },
      mood: { score: "Elevated Irritability Day 18-22", note: "Correlates with luteal phase drop", color: "text-purple-600 bg-purple-50" },
      action: "15-min evening cooling routine + 300mg magnesium glycinate dinner pairing",
    },
    elena: {
      name: "Elena, 52",
      stage: "Late Transition / Menopause",
      vasomotor: { score: "Low Risk (14%)", trend: "Stabilized over 6 weeks", color: "text-emerald-600 bg-emerald-50" },
      sleep: { score: "84/100 (Restorative)", note: "REM efficiency stabilized with cooling mattress cadence", color: "text-emerald-600 bg-emerald-50" },
      mood: { score: "Stable & Predictable", note: "Joint co-regulation routines with spouse active", color: "text-violet-600 bg-violet-50" },
      action: "Maintain morning natural sunlight exposure + Mediterranean phytoestrogen lunch",
    },
  };

  const selected = profiles[activeProfile];

  const domains = [
    { title: "Vasomotor Dynamics", icon: Flame, desc: "Hot flash frequency, nocturnal temperature surges, and heat triggers." },
    { title: "Sleep Architecture", icon: Moon, desc: "Deep sleep cycles, 3 AM waking episodes, and restlessness patterns." },
    { title: "Mood & Resilience", icon: Smile, desc: "Luteal phase irritability, sudden anxiety spikes, and emotional bandwidth." },
    { title: "Cognitive Focus", icon: Brain, desc: "Midday word recall, working memory clarity, and meeting concentration." },
    { title: "Energy & Cortisol", icon: Zap, desc: "Morning waking momentum versus mid-afternoon energy troughs." },
    { title: "Joint & Tissue Comfort", icon: Activity, desc: "Morning stiffness, musculoskeletal inflammation, and collagen resilience." },
    { title: "Intimacy & Connection", icon: Heart, desc: "Libido pacing, comfort communication, and physical connection." },
    { title: "Couple Alignment", icon: Shield, desc: "Partner awareness, shared household tasks, and empathy synchrony." },
  ];

  return (
    <section id="snapshot" className="py-12 sm:py-16 lg:py-24 bg-white border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 mb-3">
            <span>Pillar 01 — Baseline Intelligence</span>
          </div>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            The 5-Minute Personal Menopause Snapshot™
          </h2>
          <p className="mt-2.5 sm:mt-4 text-xs sm:text-base text-slate-600 leading-relaxed">
            Most health apps start with an empty dashboard that asks you to log data for weeks before offering value.
            HerCompassAI starts with an immediate, clinician-grounded baseline across 8 critical domains.
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          
          {/* Left Column: 8 Domains Grid */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6">
            <h3 className="text-sm sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-600 shrink-0" />
              <span>8 Comprehensive Assessment Domains</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {domains.map((d, i) => {
                const Icon = d.icon;
                return (
                  <div
                    key={i}
                    className="p-2.5 sm:p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-50 transition-all hover:border-violet-200"
                  >
                    <div className="flex items-center gap-2.5 mb-1">
                      <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-xl bg-violet-100/80 text-violet-700 shrink-0">
                        <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {d.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug pl-8 sm:pl-0">
                      {d.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl border border-emerald-200/70 bg-emerald-50/60 text-xs text-emerald-900 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Strict Non-Diagnostic Observational Tone</span>
              </span>
              <p className="text-[11px] text-emerald-800/80 leading-relaxed">
                HerCompassAI never issues clinical diagnoses (e.g. &ldquo;You have Major Depression&rdquo;). Instead, it mirrors verified observational language: &ldquo;Your logs suggest an energy dip corresponding with nighttime temperature spikes.&rdquo;
              </p>
            </div>
          </div>

          {/* Right Column: Interactive Snapshot Preview */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-slate-200/90 bg-[#FAF9F6] p-4 sm:p-6 lg:p-7 shadow-xl shadow-slate-200/50">
              
              {/* Profile Scenario Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-200 gap-2.5">
                <div>
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-violet-700">
                    Live Snapshot Preview
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">{selected.name}</p>
                </div>
                <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-slate-200 w-full sm:w-auto justify-between sm:justify-start">
                  <button
                    type="button"
                    onClick={() => setActiveProfile("maria")}
                    className={`flex-1 sm:flex-initial text-center px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeProfile === "maria"
                        ? "bg-violet-600 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Scenario A
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveProfile("elena")}
                    className={`flex-1 sm:flex-initial text-center px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeProfile === "elena"
                        ? "bg-violet-600 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Scenario B
                  </button>
                </div>
              </div>

              {/* Status Pill */}
              <div className="mt-3.5 flex flex-wrap items-center justify-between gap-1.5 text-xs">
                <span className="text-slate-500 font-medium">Hormonal Stage:</span>
                <span className="font-semibold text-slate-800 bg-white px-2.5 py-0.5 rounded-full border border-slate-200 text-[10px] sm:text-[11px]">
                  {selected.stage}
                </span>
              </div>

              {/* Metrics Breakdown Cards */}
              <div className="mt-3.5 space-y-2.5 sm:space-y-3">
                <div className="p-3 sm:p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Flame className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                      <span>Vasomotor Risk Score</span>
                    </span>
                    <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full ${selected.vasomotor.color}`}>
                      {selected.vasomotor.score}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{selected.vasomotor.trend}</p>
                </div>

                <div className="p-3 sm:p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Moon className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                      <span>Sleep Architecture Quality</span>
                    </span>
                    <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full ${selected.sleep.color}`}>
                      {selected.sleep.score}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{selected.sleep.note}</p>
                </div>

                <div className="p-3 sm:p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Smile className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                      <span>Emotional Co-Regulation</span>
                    </span>
                    <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full ${selected.mood.color}`}>
                      {selected.mood.score}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{selected.mood.note}</p>
                </div>
              </div>

              {/* Recommended Next Step Box */}
              <div className="mt-3.5 p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700">
                  Recommended Action For Tonight
                </span>
                <p className="text-xs font-semibold text-slate-800 mt-1 leading-snug">
                  {selected.action}
                </p>
              </div>

              {/* CTA link */}
              <div className="mt-4 pt-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] sm:text-xs text-slate-500">Takes under 5 minutes</span>
                <Link
                  href="/onboarding"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-700 hover:text-violet-800 transition-colors"
                >
                  <span>Generate Your Baseline</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
