"use client";

import React from "react";
import { Check, Info } from "lucide-react";
import type { OnboardingFormValues } from "@/lib/onboarding/onboardingTypes";

interface Step2StageProps {
  values: OnboardingFormValues;
  onChange: (fields: Partial<OnboardingFormValues>) => void;
  onNext: () => void;
}

const PHASES = [
  {
    id: "perimenopause",
    title: "Perimenopause",
    badge: "Active Transition",
    desc: "Cycles becoming irregular; noticing mood shifts, sleep awakenings, or early hot flashes.",
  },
  {
    id: "menopause",
    title: "Menopause",
    badge: "12-Month Milestone",
    desc: "12 consecutive months without a menstrual period; navigating peak hormonal fluctuations.",
  },
  {
    id: "postmenopause",
    title: "Postmenopause",
    badge: "Stabilizing Stage",
    desc: "Beyond the final menstrual transition; focusing on bone density, heart health, and energy.",
  },
  {
    id: "unsure",
    title: "Unsure / Exploring",
    badge: "Pattern Discovery",
    desc: "Experiencing subtle changes and seeking clarity without rushing to a clinical label.",
  },
] as const;

const HT_STATUSES = [
  { id: "yes", label: "Currently taking HRT or supplements" },
  { id: "no", label: "Not taking hormone therapy" },
  { id: "considering", label: "Curious / Considering options" },
] as const;

export function Step2Stage({ values, onChange, onNext }: Step2StageProps) {
  const isFormValid =
    values.age !== "" &&
    Number(values.age) >= 18 &&
    values.menopausePhase !== "" &&
    values.hormoneTherapyStatus !== "";

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* Header */}
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Where Are You in Your Journey?
        </h2>
        <p className="text-sm text-slate-600">
          This helps calibrate your baseline observations against stage-specific physiological markers.
        </p>
      </div>

      {/* Age Input */}
      <div className="space-y-3 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          What is your approximate age? <span className="text-rose-500">*</span>
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="number"
            min={18}
            max={110}
            value={values.age}
            onChange={(e) =>
              onChange({ age: e.target.value === "" ? "" : Number(e.target.value) })
            }
            placeholder="e.g. 48"
            className="w-32 rounded-xl border border-slate-300 px-4 py-2.5 text-base font-semibold text-slate-900 shadow-inner focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
          />
          <div className="flex flex-wrap gap-1.5">
            {[42, 47, 51, 55, 59].map((quickAge) => (
              <button
                key={quickAge}
                type="button"
                onClick={() => onChange({ age: quickAge })}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                  values.age === quickAge
                    ? "border-violet-600 bg-violet-50 text-violet-700 font-bold"
                    : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {quickAge}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menopause Phase Selector Cards */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          Select Your Current Stage <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {PHASES.map((phase) => {
            const isSelected = values.menopausePhase === phase.id;
            return (
              <button
                key={phase.id}
                type="button"
                onClick={() => onChange({ menopausePhase: phase.id })}
                className={`flex flex-col justify-between rounded-2xl border p-4 text-left transition-all ${
                  isSelected
                    ? "border-violet-600 bg-violet-50/70 shadow-md shadow-violet-500/10 ring-2 ring-violet-500/20"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-bold text-slate-900">{phase.title}</span>
                    <span className="text-[10px] font-semibold text-violet-700 bg-violet-100/70 rounded-md px-2 py-0.5">
                      {phase.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{phase.desc}</p>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold">
                  <div
                    className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                      isSelected
                        ? "border-violet-600 bg-violet-600 text-white"
                        : "border-slate-300"
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                  </div>
                  <span className={isSelected ? "text-violet-700" : "text-slate-400"}>
                    {isSelected ? "Selected" : "Select this stage"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hormone Therapy Status */}
      <div className="space-y-3 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Hormone Therapy / Supplement Status <span className="text-rose-500">*</span>
          </label>
          <div className="group relative flex items-center text-slate-400 hover:text-slate-600">
            <Info className="h-3.5 w-3.5 cursor-pointer" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {HT_STATUSES.map((ht) => {
            const isSelected = values.hormoneTherapyStatus === ht.id;
            return (
              <button
                key={ht.id}
                type="button"
                onClick={() => onChange({ hormoneTherapyStatus: ht.id })}
                className={`rounded-xl border px-3.5 py-3 text-left text-xs font-semibold transition ${
                  isSelected
                    ? "border-violet-600 bg-violet-50 text-violet-900 shadow-sm ring-1 ring-violet-500"
                    : "border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center ${
                      isSelected
                        ? "border-violet-600 bg-violet-600 text-white"
                        : "border-slate-300"
                    }`}
                  >
                    {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                  </div>
                  <span>{ht.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Next Button */}
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
          Continue to Primary Goals
        </button>
      </div>
    </div>
  );
}
