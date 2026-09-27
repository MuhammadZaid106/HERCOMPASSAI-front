"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Compass,
  Sparkles,
  ShieldCheck,
  Moon,
  Zap,
  Smile,
  Heart,
  Flame,
  ArrowRight,
  Info,
  CheckCircle2,
  Calendar,
  Lock,
  HeartHandshake,
} from "lucide-react";
import { onboardingClient } from "@/lib/onboarding/onboardingClient";
import type { PersonalSnapshotData } from "@/lib/onboarding/onboardingTypes";
import { useAuth } from "@/lib/auth/AuthContext";

export default function SnapshotPage() {
  const { user } = useAuth();
  const [data, setData] = useState<PersonalSnapshotData | null>(null);
  const [hasSnapshot, setHasSnapshot] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void loadSnapshot();
  }, []);

  if (user && user.role === "partner") {
    return (
      <div className="min-h-screen bg-[#FBFBF9] flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-3xl border border-indigo-200/90 bg-white p-8 shadow-xl space-y-6 text-center animate-fadeIn">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600">
              <HeartHandshake className="h-7 w-7" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-extrabold text-slate-900">Partner Access Notice</h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              The 8-Part Personal Menopause Snapshot™ contains private, raw clinical baseline metrics for member accounts.
            </p>
            <p className="text-xs text-slate-500">
              Your partner companion insights are delivered through the weekly Consented Partner Digest and Men&apos;s Academy.
            </p>
          </div>
          <Link
            href="/app"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm hover:from-indigo-700 hover:to-violet-700 shadow-md transition-all cursor-pointer"
          >
            <span>Return to Partner Portal</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  const loadSnapshot = async () => {
      const res = await onboardingClient.getSnapshot();
      if (res.snapshot) {
        setData(res.snapshot);
        setHasSnapshot(true);
      }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FBFBF9] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-full border-2 border-violet-600 border-t-transparent animate-spin" />
          <p className="text-xs font-semibold text-slate-500">Loading your Snapshot...</p>
        </div>
      </div>
    );
  }

  if (!hasSnapshot) {
    return (
      <div className="min-h-screen bg-[#FBFBF9] px-4 py-12 sm:px-6">
        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center">
          <div className="w-full rounded-3xl border border-violet-200/80 bg-white p-7 text-center shadow-xl shadow-violet-500/5 sm:p-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
              <Sparkles className="h-7 w-7" />
            </div>
            <p className="mt-5 text-xs font-bold uppercase tracking-wider text-violet-700">Your Personal Snapshot</p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Your Snapshot is not ready yet</h1>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-600">Complete the short onboarding assessment so HerCompassAI can create a personal, non-diagnostic view of your current patterns and next steps.</p>
            <Link href="/onboarding" className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 hover:bg-violet-700">Start onboarding <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/app" className="mx-auto mt-4 block text-xs font-semibold text-slate-500 hover:text-violet-700">Return to Home</Link>
          </div>
        </div>
      </div>
    );
  }

  const metrics = data?.deterministicMetrics;

  return (
    <div className="min-h-screen bg-[#FBFBF9] py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-10 animate-fadeIn">
        {/* Top Navigation Bar / Return */}
        <div className="flex items-center justify-between">
          <Link
            href="/welcome"
            className="inline-flex items-center gap-2 text-xs font-bold text-violet-700 hover:text-violet-800 transition"
          >
            ← Return to Member Hub
          </Link>
          <div className="flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Verified Baseline • v{data?.version || "1.0"}</span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 sm:p-10 shadow-xl shadow-slate-200/50 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 bg-linear-to-bl from-violet-200/40 via-rose-100/30 to-transparent rounded-bl-full pointer-events-none" />

          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50/80 px-3.5 py-1 text-xs font-bold text-violet-700">
            <Compass className="h-3.5 w-3.5 text-violet-600" />
            <span>Signature Personal Menopause Snapshot™</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Here&apos;s What We&apos;re Noticing Right Now
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            Synthesized from your 5-minute onboarding assessment. Below is your deterministic baseline across sleep, mood, vasomotor signals, and daily vitality.
          </p>

          {/* Dominant Focus Area Banner */}
          {metrics?.dominantFocusArea && (
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-violet-500/20">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                <span>Primary Clinical Anchor: {metrics.dominantFocusArea}</span>
              </span>
            </div>
          )}
        </div>

        {/* 4 Deterministic Metric Cards */}
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Symptom Burden</span>
              <Flame className="h-4 w-4 text-rose-500" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {metrics?.symptomBurdenScore}
              <span className="text-xs font-medium text-slate-400">/100</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Calculated from reported concerns & severity.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Sleep Disturbance</span>
              <Moon className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {metrics?.sleepDisturbanceScore}
              <span className="text-xs font-medium text-slate-400">/100</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Derived from quality & awakening patterns.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Vitality Index</span>
              <Zap className="h-4 w-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {metrics?.vitalityIndex}
              <span className="text-xs font-medium text-slate-400">/100</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Activity, post-meal energy & routines.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200/90 bg-white p-4.5 shadow-sm space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500">
              <span>Mood Equilibrium</span>
              <Smile className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {metrics?.emotionalBalanceScore}
              <span className="text-xs font-medium text-slate-400">/100</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Normalized balance of positive vs tense states.
            </p>
          </div>
        </div>

        {/* 8 Structured Observations */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            Comprehensive 8-Part Baseline Analysis
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {data?.observations?.map((obs) => (
              <div
                key={obs.id}
                className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-3 transition hover:border-slate-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-800">
                      {obs.id}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-violet-700">
                      {obs.pillar}
                    </span>
                  </div>
                  {obs.status && (
                    <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600">
                      {obs.status}
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900">{obs.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{obs.summary}</p>

                {/* Sub-elements for recommendations */}
                {obs.recommendations && (
                  <div className="grid grid-cols-1 gap-2.5 pt-2 sm:grid-cols-3">
                    {obs.recommendations.map((rec, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-1.5"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700">
                          {rec.category}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900">{rec.action}</h4>
                        <p className="text-[11px] text-slate-500 leading-snug">{rec.why}</p>
                      </div>
                    ))}
                  </div>
                )}

                {obs.action && (
                  <div className="rounded-xl border border-violet-100 bg-violet-50/60 p-3 text-xs font-semibold text-violet-900">
                    💡 {obs.action}
                  </div>
                )}

                {obs.evidenceNote && (
                  <p className="text-[11px] text-slate-400 italic">
                    Source: {obs.evidenceNote}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* SCI Safety Disclaimer Panel */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-5 text-xs text-slate-600 space-y-2">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <Info className="h-4 w-4 text-violet-600" />
            <span>About This Baseline Snapshot</span>
          </div>
          <p className="leading-relaxed">
            {data?.safetyNotice ||
              "This information is intended to support wellness education, personalized reflection, and proactive lifestyle adjustments. It is not a medical diagnosis or treatment plan."}
          </p>
        </div>

        {/* Bottom Pathways */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <Link
            href="/welcome"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-xs font-bold text-white shadow-md transition hover:bg-slate-800"
          >
            <span>Proceed to Member Hub</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/partner"
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <Heart className="h-3.5 w-3.5 text-rose-500" />
            <span>Explore Partner Support & Men&apos;s Academy</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
