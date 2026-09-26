"use client";

import React from "react";
import { Sparkles, Shield, HeartHandshake, Compass, ArrowRight } from "lucide-react";

interface Step1WelcomeProps {
  onStart: () => void;
}

export function Step1Welcome({ onStart }: Step1WelcomeProps) {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Hero Badge */}
      <div className="text-center space-y-4">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white shadow-xl shadow-violet-500/25 ring-8 ring-violet-50">
          <Compass className="h-8 w-8 animate-spin-slow" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-violet-50/70 px-4 py-1 text-xs font-semibold text-violet-700 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Milestone 1 • The 5-Minute Baseline</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Welcome to Your Personal{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-rose-500">
              Menopause Snapshot™
            </span>
          </h1>
          <p className="text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Menopause is personal. Answer a few friendly questions about what you&apos;re experiencing right now, and HerCompass will synthesize your comprehensive 8-part baseline pattern.
          </p>
        </div>
      </div>

      {/* 3 Core Value Pillars */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200/90 bg-white/80 p-4.5 shadow-sm space-y-2 backdrop-blur-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Pattern Clarity</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Uncover how sleep, mood, energy, and vasomotor symptoms interact day-to-day.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white/80 p-4.5 shadow-sm space-y-2 backdrop-blur-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <Shield className="h-4.5 w-4.5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">100% Private</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            HIPAA-aware security. You own your health data; partner sharing is always scoped and optional.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white/80 p-4.5 shadow-sm space-y-2 backdrop-blur-sm">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
            <HeartHandshake className="h-4.5 w-4.5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Empathetic Action</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Evidence-grounded guidance (NAMS/ACOG) translated into realistic daily rituals.
          </p>
        </div>
      </div>

      {/* Privacy Notice Box */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-xs text-slate-600 space-y-1.5">
        <p className="font-semibold text-slate-800">
          Clinical Credibility Without Clinical Intimidation
        </p>
        <p className="leading-relaxed">
          HerCompassAI is a relationship-centered wellness intelligence platform. It does not provide medical diagnoses or prescriptions. Your answers are protected and used exclusively to personalize your experience.
        </p>
      </div>

      {/* Primary CTA */}
      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={onStart}
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-violet-500/25 transition-all hover:opacity-95 hover:shadow-violet-500/35 active:scale-95"
        >
          <span>Create My Free Snapshot</span>
          <ArrowRight className="h-4 w-4" />
        </button>
        <p className="mt-3 text-xs text-slate-400">
          Takes ~4 minutes • You can adjust responses anytime
        </p>
      </div>
    </div>
  );
}
