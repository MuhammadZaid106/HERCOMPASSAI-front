"use client";

import React from "react";
import { Smile, HeartHandshake } from "lucide-react";
import type { OnboardingFormValues } from "@/lib/onboarding/onboardingTypes";

interface Step7MoodProps {
  values: OnboardingFormValues;
  onChange: (fields: Partial<OnboardingFormValues>) => void;
  onNext: () => void;
}

const MOOD_STATES = [
  { key: "calm", label: "Calm & Centered", emoji: "😌" },
  { key: "happy", label: "Joy & Contentment", emoji: "😊" },
  { key: "motivated", label: "Drive & Motivation", emoji: "💪" },
  { key: "anxious", label: "Anxiety or Restlessness", emoji: "😰" },
  { key: "irritable", label: "Irritability or Short Fuse", emoji: "😠" },
  { key: "tired", label: "Mental Exhaustion", emoji: "😴" },
] as const;

const EMOTIONAL_GOALS = [
  "Less daily anxiety",
  "Smoother mood transitions",
  "Greater patience with family",
  "Sharper mental focus",
  "Feeling more like myself",
];

const MEDITATION_FREQUENCIES = [
  { id: "daily", label: "Daily" },
  { id: "weekly", label: "1–3x Weekly" },
  { id: "rarely", label: "Rarely" },
  { id: "never", label: "Never" },
] as const;

export function Step7Mood({ values, onChange, onNext }: Step7MoodProps) {
  const updateMoodSlider = (key: string, val: number) => {
    onChange({
      moodBaseline: {
        ...values.moodBaseline,
        [key]: val,
      },
    });
  };

  const toggleGoal = (goal: string) => {
    const exists = values.emotionalGoals.includes(goal);
    const updated = exists
      ? values.emotionalGoals.filter((g) => g !== goal)
      : [...values.emotionalGoals, goal];
    onChange({ emotionalGoals: updated });
  };

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* Header */}
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Mood & Emotional Equilibrium
        </h2>
        <p className="text-sm text-slate-600">
          Estrogen receptors in the brain interact closely with serotonin and GABA. Rate how you&apos;ve felt emotionally over the last 2 weeks.
        </p>
      </div>

      {/* Sliders Grid */}
      <div className="space-y-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
          <Smile className="h-4 w-4 text-violet-600" />
          <span>Baseline Emotional Rhythm (1 = Low / Rare, 5 = High / Frequent)</span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {MOOD_STATES.map((state) => {
            const currentVal = values.moodBaseline[state.key] ?? 3;
            return (
              <div
                key={state.key}
                className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 space-y-2"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{state.emoji}</span>
                    <span>{state.label}</span>
                  </div>
                  <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-violet-700 font-extrabold text-xs">
                    {currentVal} / 5
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={currentVal}
                  onChange={(e) => updateMoodSlider(state.key, Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-violet-600 focus:outline-none"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>Infrequent</span>
                  <span>Moderate</span>
                  <span>Frequent</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Emotional Goals */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
          <HeartHandshake className="h-4 w-4 text-rose-500" />
          <span>What emotional milestones matter most to you?</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {EMOTIONAL_GOALS.map((goal) => {
            const isSelected = values.emotionalGoals.includes(goal);
            return (
              <button
                key={goal}
                type="button"
                onClick={() => toggleGoal(goal)}
                className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                  isSelected
                    ? "border-violet-600 bg-violet-50 text-violet-900 shadow-sm ring-1 ring-violet-500"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {goal}
              </button>
            );
          })}
        </div>
      </div>

      {/* Meditation / Mindfulness Frequency */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          How often do you currently practice meditation, breathwork, or prayer?
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {MEDITATION_FREQUENCIES.map((freq) => {
            const isSelected = values.meditationFrequency === freq.id;
            return (
              <button
                key={freq.id}
                type="button"
                onClick={() => onChange({ meditationFrequency: freq.id })}
                className={`rounded-xl border p-2.5 text-center text-xs font-semibold transition ${
                  isSelected
                    ? "border-violet-600 bg-violet-50 text-violet-900 ring-2 ring-violet-500/20 shadow-sm"
                    : "border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {freq.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Next */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-7 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition active:scale-95 hover:opacity-95"
        >
          Continue to Signature Goal
        </button>
      </div>
    </div>
  );
}
