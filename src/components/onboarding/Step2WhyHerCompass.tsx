"use client";

import React from "react";
import { ArrowRight, HeartPulse, Moon, Sparkles, Zap } from "lucide-react";

interface Step2WhyHerCompassProps {
  onNext: () => void;
}

export function Step2WhyHerCompass({ onNext }: Step2WhyHerCompassProps) {
  return (
    <div className="space-y-7 animate-fadeIn">
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-violet-700">A clearer picture</p>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Let&apos;s make this personal.</h1>
        <p className="max-w-xl text-sm leading-relaxed text-slate-600">
          Your answers help HerCompassAI understand patterns across symptoms, mood, sleep, energy, and lifestyle so your Snapshot can offer relevant wellness insights and practical next steps.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Symptoms", icon: HeartPulse },
          { label: "Mood", icon: Sparkles },
          { label: "Sleep", icon: Moon },
          { label: "Energy", icon: Zap },
        ].map(({ label, icon: Icon }) => (
          <div key={label} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-700">
            <Icon className="h-4 w-4 text-violet-600" />
            {label}
          </div>
        ))}
      </div>

      <p className="text-xs leading-relaxed text-slate-500">
        Your Personal Menopause Snapshot provides wellness information, not a medical diagnosis.
      </p>

      <div className="flex justify-end">
        <button type="button" onClick={onNext} className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-violet-800">
          Continue <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}