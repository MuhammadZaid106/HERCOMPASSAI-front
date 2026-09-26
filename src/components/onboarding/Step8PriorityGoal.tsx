"use client";

import React from "react";
import { Check, Target, Compass } from "lucide-react";
import type { OnboardingFormValues } from "@/lib/onboarding/onboardingTypes";

interface Step8PriorityGoalProps {
  values: OnboardingFormValues;
  onChange: (fields: Partial<OnboardingFormValues>) => void;
  onNext: () => void;
}

const PRIORITY_GOALS = [
  {
    id: "feel_better_daily",
    title: "Feel better and more comfortable day to day",
    desc: "Reduce the daily drag of fatigue and erratic hot flashes.",
  },
  {
    id: "sleep_deeply",
    title: "Sleep deeply through the night",
    desc: "Calm evening adrenaline and eliminate 3 AM restless wakeups.",
  },
  {
    id: "steady_energy",
    title: "Have steady, dependable daytime energy",
    desc: "Reclaim vitality without needing caffeine or sugar crutches.",
  },
  {
    id: "emotional_calm",
    title: "Feel more emotionally balanced & patient",
    desc: "Soothe sudden irritability and feel fully in control of my reactions.",
  },
  {
    id: "understand_patterns",
    title: "Understand my symptoms and hormonal triggers",
    desc: "Connect the dots between food, sleep, stress, and symptom spikes.",
  },
  {
    id: "nourishing_habits",
    title: "Build sustainable, hormone-friendly routines",
    desc: "Establish low-stress morning and evening rituals that stick.",
  },
  {
    id: "partner_support",
    title: "Help my partner understand and support me",
    desc: "Bridge the empathy gap so my partner knows how to help.",
  },
  {
    id: "transition_confidence",
    title: "Become confident managing this stage of life",
    desc: "Move through midlife with knowledge, community, and pride.",
  },
] as const;

export function Step8PriorityGoal({ values, onChange, onNext }: Step8PriorityGoalProps) {
  const isFormValid = values.primaryGoal !== "";

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700 bg-violet-50 rounded-full px-3 py-0.5">
          <Target className="h-3.5 w-3.5" />
          <span>Signature Anchor</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          If HerCompass Could Help With One Thing First...
        </h2>
        <p className="text-sm text-slate-600">
          What would make the biggest difference in your life right now? Choose your signature priority goal.
        </p>
      </div>

      {/* Single Select Cards */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {PRIORITY_GOALS.map((g) => {
          const isSelected = values.primaryGoal === g.title;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => onChange({ primaryGoal: g.title })}
              className={`flex items-start justify-between rounded-2xl border p-4 text-left transition-all ${
                isSelected
                  ? "border-violet-600 bg-violet-50/80 shadow-md shadow-violet-500/10 ring-2 ring-violet-500/20"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
              }`}
            >
              <div className="pr-3">
                <h3 className="text-sm font-bold text-slate-900">{g.title}</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">{g.desc}</p>
              </div>
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                  isSelected
                    ? "border-violet-600 bg-violet-600 text-white"
                    : "border-slate-300 bg-white"
                }`}
              >
                {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Next */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          disabled={!isFormValid}
          onClick={onNext}
          className={`inline-flex items-center justify-center rounded-xl px-7 py-3 text-sm font-bold shadow-lg transition active:scale-95 ${
            isFormValid
              ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-violet-500/25 hover:opacity-95"
              : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
          }`}
        >
          Continue to AI Guidance & Partner Setup
        </button>
      </div>
    </div>
  );
}
