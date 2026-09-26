"use client";

import React from "react";
import { Check, Flame, ShieldAlert } from "lucide-react";
import type { OnboardingFormValues } from "@/lib/onboarding/onboardingTypes";

interface Step4SymptomsProps {
  values: OnboardingFormValues;
  onChange: (fields: Partial<OnboardingFormValues>) => void;
  onNext: () => void;
}

const SYMPTOM_OPTIONS = [
  "Hot flashes",
  "Night sweats",
  "Sleep disruption",
  "Daytime fatigue",
  "Brain fog & focus changes",
  "Anxiety & inner tension",
  "Irritability / Mood shifts",
  "Joint stiffness & muscle aches",
  "Headaches or migraines",
  "Metabolic & weight shifts",
  "Palpitations / Fluttering",
  "Skin, hair & tissue dryness",
];

const IMPACT_LEVELS = [
  { id: "not_much", label: "Not much", desc: "Barely affects routines" },
  { id: "a_little", label: "A little", desc: "Noticeable but manageable" },
  { id: "moderately", label: "Moderately", desc: "Interrupts daily tasks occasionally" },
  { id: "a_lot", label: "A lot", desc: "Frequently disrupts work or family" },
  { id: "extremely", label: "Extremely", desc: "Severe day-to-day disruption" },
] as const;

export function Step4Symptoms({ values, onChange, onNext }: Step4SymptomsProps) {
  const toggleSymptom = (sym: string) => {
    const exists = values.primaryHealthConcerns.includes(sym);
    const updated = exists
      ? values.primaryHealthConcerns.filter((s) => s !== sym)
      : [...values.primaryHealthConcerns, sym];
    onChange({ primaryHealthConcerns: updated });
  };

  const isFormValid = values.symptomImpact !== "";

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* Header */}
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Which Experiences Have You Noticed Lately?
        </h2>
        <p className="text-sm text-slate-600">
          Select any changes you&apos;ve experienced over the past few weeks. We treat these as user-reported observations, never as medical diagnoses.
        </p>
      </div>

      {/* Selectable Symptom Chips */}
      <div className="space-y-2.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          Symptom Observations (Select all that apply)
        </label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SYMPTOM_OPTIONS.map((symptom) => {
            const isSelected = values.primaryHealthConcerns.includes(symptom);
            return (
              <button
                key={symptom}
                type="button"
                onClick={() => toggleSymptom(symptom)}
                className={`flex items-center justify-between rounded-xl border p-3 text-left text-xs font-semibold transition active:scale-95 ${
                  isSelected
                    ? "border-violet-600 bg-violet-50 text-violet-900 shadow-sm ring-1 ring-violet-500"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <span>{symptom}</span>
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

      {/* Impact on Day-to-Day Life */}
      <div className="space-y-3 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          How much do these experiences affect your day-to-day life?{" "}
          <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
          {IMPACT_LEVELS.map((lvl) => {
            const isSelected = values.symptomImpact === lvl.id;
            return (
              <button
                key={lvl.id}
                type="button"
                onClick={() => onChange({ symptomImpact: lvl.id })}
                className={`flex flex-col justify-between rounded-xl border p-3 text-left transition ${
                  isSelected
                    ? "border-violet-600 bg-violet-50 text-violet-900 ring-2 ring-violet-500/20 shadow-sm"
                    : "border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className="text-xs font-bold">{lvl.label}</span>
                <span className="text-[10px] text-slate-500 mt-1">{lvl.desc}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Optional Medical Conditions Context */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          Any other diagnosed conditions we should take into account? (Optional)
        </label>
        <input
          type="text"
          value={values.medicalConditions}
          onChange={(e) => onChange({ medicalConditions: e.target.value })}
          placeholder="e.g. Thyroid condition, endometriosis, hypertension"
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
        />
        <p className="text-[11px] text-slate-400">
          Confidential. Used solely to ensure lifestyle suggestions respect your health context.
        </p>
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
          Continue to Sleep & Energy
        </button>
      </div>
    </div>
  );
}
