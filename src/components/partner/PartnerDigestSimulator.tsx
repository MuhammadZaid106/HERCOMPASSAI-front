"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

interface Scenario {
  id: string;
  name: string;
  tag: string;
  bandwidth: string;
  statusColor: string;
  partnerSummary: string;
  householdAction: string;
  sayThis: string;
  avoidThis: string;
  privateDataBlocked: string[];
}

const SCENARIOS: Scenario[] = [
  {
    id: "vasomotor-high",
    name: "High Vasomotor & Restless Nights",
    tag: "High Rest Need",
    bandwidth: "Low Morning Bandwidth (Interrupted Sleep)",
    statusColor: "text-amber-700 bg-amber-50 border-amber-200",
    partnerSummary:
      "Sarah experienced repeated thermoregulatory awakenings over the last 4 nights. She may experience sudden afternoon energy drops and heightened sensory sensitivity.",
    householdAction:
      "Keep bedroom temperature at 67°F before bedtime; proactively handle dinner and kitchen cleanup Thursday through Saturday.",
    sayThis:
      "“I know sleep was tough this week. I've taken care of the errands—take all the time you need to decompress.”",
    avoidThis:
      "“Why are you in such a bad mood today? Did you not sleep again?”",
    privateDataBlocked: [
      "Exact timestamps of 2:14 AM and 4:08 AM hot flushes",
      "Private journaling entries regarding body frustration",
      "Severity logs rated 8/10",
    ],
  },
  {
    id: "fog-career",
    name: "Executive Fog & High-Stakes Work Week",
    tag: "Workforce Focus",
    bandwidth: "Moderate Bandwidth (Afternoon Fatigue)",
    statusColor: "text-indigo-700 bg-indigo-50 border-indigo-200",
    partnerSummary:
      "Sarah is managing high cognitive fatigue alongside major career deadlines. Her focus is optimal before 12:00 PM and drops noticeably by late afternoon.",
    householdAction:
      "Avoid scheduling intense family financial discussions or complex logistics after 8:00 PM; prepare nutrient-dense snacks with healthy fats.",
    sayThis:
      "“You have big meetings this week. Let's make our evenings as quiet and low-demand as possible.”",
    avoidThis:
      "“Did you forget to call the plumber again? You're becoming so absent-minded lately.”",
    privateDataBlocked: [
      "Detailed notes about feeling overwhelmed in quarterly reviews",
      "Daily cognitive fog rating scale",
      "Personal stress self-assessments",
    ],
  },
  {
    id: "balanced",
    name: "Stabilized Equilibrium & Restored Closeness",
    tag: "Optimal Harmony",
    bandwidth: "High Bandwidth (Stable & Recharged)",
    statusColor: "text-teal-700 bg-teal-50 border-teal-200",
    partnerSummary:
      "Sarah's sleep architecture has stabilized with a 28% reduction in night awakenings. Energy and mood bandwidth are steady and receptive to shared activities.",
    householdAction:
      "Great week to plan a relaxing weekend walk, cook a favorite meal together, or enjoy uninterrupted conversation.",
    sayThis:
      "“It's so wonderful seeing your energy steady this week. How would you love to spend our Saturday together?”",
    avoidThis:
      "“Looks like you're finally back to normal.” (Dismisses ongoing recovery)",
    privateDataBlocked: [
      "Magnesium intake dosage and timing logs",
      "Longitudinal hormone baseline data",
      "Private habit streak counts",
    ],
  },
];

export default function PartnerDigestSimulator() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(SCENARIOS[0]);
  const [viewMode, setViewMode] = useState<"partner" | "privacy">("partner");

  return (
    <section id="digest" className="py-12 sm:py-16 lg:py-24 bg-[#FAF9F6] border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3.5 py-1 text-xs font-semibold text-teal-700 mb-3">
            <Calendar className="h-3.5 w-3.5" />
            <span>The Consented Sunday Partner Digest</span>
          </div>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Every Sunday at 8:00 AM: Clarity Delivered Directly to Your Partner.
          </h2>
          <p className="mt-2.5 sm:mt-4 text-xs sm:text-base text-slate-600 leading-relaxed">
            Instead of raw charts, your partner receives an empathetic, 2-minute actionable brief.
            Select a weekly scenario below to simulate what your partner reads—and what is permanently protected.
          </p>
        </div>

        {/* Scenario Selector Pills */}
        <div className="mt-8 flex items-center justify-start sm:justify-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {SCENARIOS.map((scen) => {
            const isSelected = scen.id === selectedScenario.id;
            return (
              <button
                key={scen.id}
                onClick={() => setSelectedScenario(scen)}
                className={`px-3.5 sm:px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? "bg-teal-700 text-white shadow-md shadow-teal-700/20"
                    : "bg-white text-slate-700 border border-slate-200 hover:border-teal-300 hover:bg-teal-50/50"
                }`}
              >
                <span>{scen.name}</span>
                <span className="ml-1.5 opacity-80 text-[10px]">({scen.tag})</span>
              </button>
            );
          })}
        </div>

        {/* Simulator Card */}
        <div className="mt-6 sm:mt-8 rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 lg:p-8 shadow-xl shadow-slate-200/50">
          
          {/* Header Bar with Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                  Delivered Sunday • 08:00 AM
                </span>
                <span className="text-xs text-slate-400">Recipient: David (Partner)</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                Weekly Co-Regulation Briefing for David
              </h3>
            </div>

            {/* Toggle view mode */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
              <button
                onClick={() => setViewMode("partner")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "partner"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Eye className="h-3.5 w-3.5 text-teal-600" />
                <span>Partner Digest</span>
              </button>
              <button
                onClick={() => setViewMode("privacy")}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "privacy"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Lock className="h-3.5 w-3.5 text-rose-600" />
                <span>Private Vault (Blocked)</span>
              </button>
            </div>
          </div>

          {/* Content Container */}
          {viewMode === "partner" ? (
            <div className="mt-5 space-y-5 animate-in fade-in duration-300">
              
              {/* Bandwidth Indicator Banner */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${selectedScenario.statusColor}`}>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider block">Bandwidth Status</span>
                  <div className="text-xs sm:text-sm font-extrabold mt-0.5">{selectedScenario.bandwidth}</div>
                </div>
                <span className="text-[11px] font-semibold bg-white/80 px-2.5 py-1 rounded-lg shrink-0">
                  Consented Signal
                </span>
              </div>

              {/* Empathy Summary */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Weekly Context for Partner
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                  {selectedScenario.partnerSummary}
                </p>
              </div>

              {/* Actionable Household Task */}
              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-100 flex items-start gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-teal-600 text-white shrink-0 mt-0.5">
                  <HeartHandshake className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="text-xs sm:text-sm font-bold text-teal-950">Recommended Actionable Support</h5>
                  <p className="text-xs text-teal-900/90 leading-relaxed mt-0.5">
                    {selectedScenario.householdAction}
                  </p>
                </div>
              </div>

              {/* Speech Guidance: Say This vs Avoid This */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Communication Guidance
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-xs space-y-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      <span>SAY THIS</span>
                    </span>
                    <p className="text-slate-800 font-medium italic leading-relaxed">
                      {selectedScenario.sayThis}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200/80 text-xs space-y-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-800 uppercase tracking-wider">
                      <AlertCircle className="h-3 w-3 text-rose-600" />
                      <span>AVOID THIS</span>
                    </span>
                    <p className="text-slate-800 font-medium italic leading-relaxed">
                      {selectedScenario.avoidThis}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* Private Vault View (Demonstrating Zero Raw Data Exposure) */
            <div className="mt-5 space-y-4 animate-in fade-in duration-300">
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-950 leading-relaxed">
                <strong>Zero Raw Data Exposure Guarantee:</strong> The items below are processed in the woman&apos;s encrypted vault and are <strong>permanently blocked</strong> from the partner digest.
              </div>

              <div className="space-y-2.5">
                {selectedScenario.privateDataBlocked.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-700"
                  >
                    <div className="flex items-center gap-2.5">
                      <EyeOff className="h-4 w-4 text-rose-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-100/80 px-2 py-0.5 rounded-md shrink-0">
                      HARD BLOCKED
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 flex items-center gap-2 text-xs text-slate-600">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>The partner never sees raw timestamps, severity logs, or personal journal entries under any condition.</span>
              </div>
            </div>
          )}

          {/* Footer Callout */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="text-slate-500">
              Delivered automatically via WhatsApp, SMS, or Email according to partner preference.
            </span>
            <Link
              href="/register?type=couple"
              className="inline-flex items-center gap-1.5 font-bold text-teal-700 hover:text-teal-800 transition-colors self-start sm:self-auto"
            >
              <span>Setup Couple Account</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
