"use client";

import React from "react";
import { Check, Utensils, Activity } from "lucide-react";
import type { OnboardingFormValues } from "@/lib/onboarding/onboardingTypes";

interface Step6LifestyleProps {
  values: OnboardingFormValues;
  onChange: (fields: Partial<OnboardingFormValues>) => void;
  onNext: () => void;
}

const DIET_OPTIONS = [
  "Mediterranean",
  "High-Protein",
  "Plant-Forward",
  "Vegetarian",
  "Gluten-Free",
  "Dairy-Free",
  "Low-Inflammatory",
  "No Strict Preference",
];

const ACTIVITY_LEVELS = [
  { id: "sedentary", label: "Mostly sedentary", desc: "Desk work, minimal daily walking" },
  { id: "light", label: "Lightly active", desc: "Occasional walks or light household tasks" },
  { id: "moderate", label: "Moderately active", desc: "30+ mins movement 2-3x per week" },
  { id: "very_active", label: "Very active", desc: "Consistent cardio, sports or strength training" },
] as const;

const EXERCISE_TYPES = [
  "Brisk walking",
  "Strength training",
  "Yoga & mobility",
  "Pilates",
  "Low-impact cycling",
  "Breathwork & stretching",
];

export function Step6Lifestyle({ values, onChange, onNext }: Step6LifestyleProps) {
  const toggleDiet = (diet: string) => {
    const exists = values.dietaryPreferences.includes(diet);
    const updated = exists
      ? values.dietaryPreferences.filter((d) => d !== diet)
      : [...values.dietaryPreferences, diet];
    onChange({ dietaryPreferences: updated });
  };

  const toggleExercise = (ex: string) => {
    const exists = values.exercisePreferences.includes(ex);
    const updated = exists
      ? values.exercisePreferences.filter((e) => e !== ex)
      : [...values.exercisePreferences, ex];
    onChange({ exercisePreferences: updated });
  };

  const isFormValid = values.activityLevel !== "";

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* Header */}
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Nutrition & Movement Habits
        </h2>
        <p className="text-sm text-slate-600">
          Small adjustments in protein distribution and low-impact movement can dramatically stabilize cortisol and energy.
        </p>
      </div>

      {/* Dietary Preferences */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
          <Utensils className="h-4 w-4 text-emerald-600" />
          <span>Dietary Style & Focus (Select any that apply)</span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {DIET_OPTIONS.map((diet) => {
            const isSelected = values.dietaryPreferences.includes(diet);
            return (
              <button
                key={diet}
                type="button"
                onClick={() => toggleDiet(diet)}
                className={`rounded-xl border p-2.5 text-center text-xs font-semibold transition active:scale-95 ${
                  isSelected
                    ? "border-violet-600 bg-violet-50 text-violet-900 shadow-sm ring-1 ring-violet-500"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                {diet}
              </button>
            );
          })}
        </div>
      </div>

      {/* Post-Meal Energy Rating */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          How is your usual energy level after meals?
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { val: 1, label: "Sluggish / Foggy", desc: "Energy drops after eating" },
            { val: 2, label: "Steady / Neutral", desc: "Normal consistent rhythm" },
            { val: 3, label: "Sustained / High", desc: "Energized and clear-headed" },
          ].map((item) => (
            <button
              key={item.val}
              type="button"
              onClick={() => onChange({ energyAfterMealRating: item.val })}
              className={`rounded-xl border p-3 text-left transition ${
                values.energyAfterMealRating === item.val
                  ? "border-violet-600 bg-violet-50 text-violet-900 ring-2 ring-violet-500/20 shadow-sm"
                  : "border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <span className="block text-xs font-bold">{item.label}</span>
              <span className="block text-[10px] text-slate-500 mt-0.5">{item.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Activity Level */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
          <Activity className="h-4 w-4 text-violet-600" />
          <span>Current Activity Level <span className="text-rose-500">*</span></span>
        </div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {ACTIVITY_LEVELS.map((lvl) => {
            const isSelected = values.activityLevel === lvl.id;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => onChange({ activityLevel: lvl.id })}
                className={`rounded-2xl border p-4 text-left transition ${
                  isSelected
                    ? "border-violet-600 bg-violet-50 text-violet-900 ring-2 ring-violet-500/20 shadow-sm"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-slate-900">{lvl.label}</span>
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                      isSelected
                        ? "border-violet-600 bg-violet-600 text-white"
                        : "border-slate-300"
                    }`}
                  >
                    {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                  </div>
                </div>
                <p className="text-xs text-slate-500">{lvl.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preferred Exercise Types */}
      <div className="space-y-2.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          What forms of movement feel best for your body?
        </label>
        <div className="flex flex-wrap gap-2">
          {EXERCISE_TYPES.map((type) => {
            const isSelected = values.exercisePreferences.includes(type);
            return (
              <button
                key={type}
                type="button"
                onClick={() => toggleExercise(type)}
                className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                  isSelected
                    ? "border-violet-600 bg-violet-50 text-violet-900 shadow-sm ring-1 ring-violet-500"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {type}
              </button>
            );
          })}
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
          Continue to Mood & Emotions
        </button>
      </div>
    </div>
  );
}
