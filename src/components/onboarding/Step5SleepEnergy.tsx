"use client";

import React from "react";
import { Check, Moon, Zap } from "lucide-react";
import type { OnboardingFormValues } from "@/lib/onboarding/onboardingTypes";

interface Step5SleepEnergyProps {
  values: OnboardingFormValues;
  onChange: (fields: Partial<OnboardingFormValues>) => void;
  onNext: () => void;
}

const SLEEP_QUALITIES = [
  { id: "very_good", label: "Very good", desc: "Sound, deep sleep most nights" },
  { id: "good", label: "Good", desc: "Generally restful with minor waking" },
  { id: "mixed", label: "Mixed", desc: "Good nights alternating with poor nights" },
  { id: "difficult", label: "Difficult", desc: "Frequent restless nights or waking early" },
  { id: "very_difficult", label: "Very difficult", desc: "Consistently broken or sparse rest" },
] as const;

const SLEEP_CHALLENGES = [
  "Trouble falling asleep",
  "Waking around 2–4 AM",
  "Night sweats / temperature surges",
  "Waking up unrefreshed",
  "Racing thoughts / bedtime anxiety",
  "Early morning wakeups",
];

const ENERGY_LEVELS = [
  { id: "high", label: "High", emoji: "⚡" },
  { id: "good", label: "Good", emoji: "✨" },
  { id: "up_and_down", label: "Up & down", emoji: "〰️" },
  { id: "often_low", label: "Often low", emoji: "🔋" },
  { id: "very_low", label: "Very low", emoji: "🪫" },
] as const;

const ENERGY_WINDOWS = [
  { id: "morning", label: "Morning" },
  { id: "afternoon", label: "Afternoon" },
  { id: "evening", label: "Evening" },
  { id: "throughout_the_day", label: "All day" },
  { id: "varies", label: "Varies" },
] as const;

export function Step5SleepEnergy({ values, onChange, onNext }: Step5SleepEnergyProps) {
  const toggleChallenge = (item: string) => {
    const exists = values.sleepChallenges.includes(item);
    const updated = exists
      ? values.sleepChallenges.filter((c) => c !== item)
      : [...values.sleepChallenges, item];
    onChange({ sleepChallenges: updated });
  };

  const isFormValid = values.sleepQuality !== "" && values.energyLevel !== "";

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* Header */}
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Sleep & Energy Rhythm
        </h2>
        <p className="text-sm text-slate-600">
          Hormonal shifts directly affect circadian thermoregulation and daytime cortisol. Let&apos;s map your pattern.
        </p>
      </div>

      {/* Sleep Quality */}
      <div className="space-y-3 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
          <Moon className="h-4 w-4 text-indigo-600" />
          <span>How has your sleep quality been lately? <span className="text-rose-500">*</span></span>
        </div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-5">
          {SLEEP_QUALITIES.map((q) => {
            const isSelected = values.sleepQuality === q.id;
            return (
              <button
                key={q.id}
                type="button"
                onClick={() => onChange({ sleepQuality: q.id })}
                className={`flex flex-col justify-between rounded-xl border p-3 text-left transition ${
                  isSelected
                    ? "border-violet-600 bg-violet-50 text-violet-900 ring-2 ring-violet-500/20 shadow-sm"
                    : "border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className="text-xs font-bold">{q.label}</span>
                <span className="text-[10px] text-slate-500 mt-1 leading-snug">{q.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sleep Challenges */}
      <div className="space-y-2.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          What is most challenging about your sleep? (Select all that apply)
        </label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {SLEEP_CHALLENGES.map((ch) => {
            const isSelected = values.sleepChallenges.includes(ch);
            return (
              <button
                key={ch}
                type="button"
                onClick={() => toggleChallenge(ch)}
                className={`flex items-center justify-between rounded-xl border p-3 text-left text-xs font-semibold transition active:scale-95 ${
                  isSelected
                    ? "border-violet-600 bg-violet-50 text-violet-900 shadow-sm ring-1 ring-violet-500"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <span>{ch}</span>
                <div
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-md border ml-2 ${
                    isSelected
                      ? "border-violet-600 bg-violet-600 text-white"
                      : "border-slate-300 bg-slate-50"
                  }`}
                >
                  {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Energy Level */}
      <div className="space-y-3 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
          <Zap className="h-4 w-4 text-amber-500" />
          <span>How would you describe your energy lately? <span className="text-rose-500">*</span></span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {ENERGY_LEVELS.map((lvl) => {
            const isSelected = values.energyLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => onChange({ energyLevel: lvl.id })}
                className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition ${
                  isSelected
                    ? "border-violet-600 bg-violet-50 text-violet-900 ring-2 ring-violet-500/20 shadow-sm"
                    : "border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className="text-base">{lvl.emoji}</span>
                <span>{lvl.label}</span>
              </button>
            );
          })}
        </div>

        {/* When energy is most challenging */}
        <div className="pt-3 border-t border-slate-100">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-2">
            When is your energy most challenging?
          </label>
          <div className="flex flex-wrap gap-2">
            {ENERGY_WINDOWS.map((win) => {
              const isSelected = values.energyPattern === win.id;
              return (
                <button
                  key={win.id}
                  type="button"
                  onClick={() => onChange({ energyPattern: win.id })}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                    isSelected
                      ? "border-violet-600 bg-violet-50 text-violet-700 font-bold"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {win.label}
                </button>
              );
            })}
          </div>
        </div>
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
          Continue to Nutrition & Lifestyle
        </button>
      </div>
    </div>
  );
}
