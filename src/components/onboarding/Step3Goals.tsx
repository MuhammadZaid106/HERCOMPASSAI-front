"use client";

import React from "react";
import { Check, Sparkles } from "lucide-react";
import type { OnboardingFormValues } from "@/lib/onboarding/onboardingTypes";

interface Step3GoalsProps {
  values: OnboardingFormValues;
  onChange: (fields: Partial<OnboardingFormValues>) => void;
  onNext: () => void;
}

const GOAL_OPTIONS = [
  {
    id: "understand_experience",
    label: "Understanding what I'm experiencing",
    category: "Clarity",
    desc: "Make sense of changing hormonal rhythms and physical signals.",
  },
  {
    id: "manage_symptoms",
    label: "Managing vasomotor symptoms (hot flashes, night sweats)",
    category: "Comfort",
    desc: "Identify practical cooling habits and proactive daily triggers.",
  },
  {
    id: "improve_sleep",
    label: "Restoring deep, uninterrupted sleep",
    category: "Restoration",
    desc: "Address 3 AM awakenings and cultivate reliable circadian wind-downs.",
  },
  {
    id: "stabilize_mood",
    label: "Emotional balance & stress reduction",
    category: "Wellbeing",
    desc: "Reduce sudden irritability, tension, and feelings of being overwhelmed.",
  },
  {
    id: "boost_energy",
    label: "Sustaining daytime energy & alertness",
    category: "Vitality",
    desc: "Overcome heavy morning fatigue and mid-afternoon energy crashes.",
  },
  {
    id: "nutrition_habits",
    label: "Nutrition, hydration & metabolic rhythm",
    category: "Nutrition",
    desc: "Incorporate hormone-supportive, cooling, and nutrient-dense meals.",
  },
  {
    id: "gentle_movement",
    label: "Low-impact exercise & joint mobility",
    category: "Movement",
    desc: "Maintain lean muscle mass, protect joints, and stimulate circulation.",
  },
  {
    id: "partner_support",
    label: "Helping my partner understand and support me",
    category: "Couples",
    desc: "Strengthen empathy and replace awkward tension with clear communication.",
  },
] as const;

export function Step3Goals({ values, onChange, onNext }: Step3GoalsProps) {
  const toggleGoal = (id: string) => {
    const exists = values.primaryGoals.includes(id);
    const updated = exists
      ? values.primaryGoals.filter((g) => g !== id)
      : [...values.primaryGoals, id];
    onChange({ primaryGoals: updated });
  };

  const hasSelected = values.primaryGoals.length > 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700 bg-violet-50 rounded-full px-3 py-0.5">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Intent Calibration</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          What Would You Most Like Help With?
        </h2>
        <p className="text-sm text-slate-600">
          Choose all areas that resonate. We prioritize these when generating your baseline insights.
        </p>
      </div>

      {/* Multi-Select Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {GOAL_OPTIONS.map((goal) => {
          const isSelected = values.primaryGoals.includes(goal.id);
          return (
            <button
              key={goal.id}
              type="button"
              onClick={() => toggleGoal(goal.id)}
              className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition-all active:scale-[0.99] ${
                isSelected
                  ? "border-violet-600 bg-violet-50/80 shadow-md shadow-violet-500/10 ring-2 ring-violet-500/20"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-violet-700">
                    {goal.category}
                  </span>
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded-md border transition ${
                      isSelected
                        ? "border-violet-600 bg-violet-600 text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                </div>
                <h3 className="text-sm font-bold text-slate-900">{goal.label}</h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">{goal.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer / Next */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-slate-500">
          {values.primaryGoals.length} goal{values.primaryGoals.length === 1 ? "" : "s"} selected
        </span>
        <button
          type="button"
          disabled={!hasSelected}
          onClick={onNext}
          className={`inline-flex items-center justify-center rounded-xl px-7 py-3 text-sm font-bold shadow-lg transition active:scale-95 ${
            hasSelected
              ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-violet-500/25 hover:opacity-95"
              : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
          }`}
        >
          Continue to Symptoms
        </button>
      </div>
    </div>
  );
}
