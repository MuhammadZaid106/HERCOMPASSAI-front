"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import type { OnboardingFormValues } from "@/lib/onboarding/onboardingTypes";
import { Step3Goals } from "./Step3Goals";
import { Step4Symptoms } from "./Step4Symptoms";

interface Step3GoalsAndSymptomsProps {
  values: OnboardingFormValues;
  onChange: (fields: Partial<OnboardingFormValues>) => void;
  onNext: () => void;
}

export function Step3GoalsAndSymptoms({
  values,
  onChange,
  onNext,
}: Step3GoalsAndSymptomsProps) {
  const canContinue =
    values.primaryGoals.length > 0 && values.symptomImpact !== "";

  return (
    <div className="space-y-8 animate-fadeIn">
      <Step3Goals values={values} onChange={onChange} onNext={onNext} showNext={false} />
      <div className="border-t border-slate-200 pt-8">
        <Step4Symptoms values={values} onChange={onChange} onNext={onNext} showNext={false} />
      </div>
      <div className="flex items-center justify-between border-t border-slate-200 pt-5">
        <span className="text-xs text-slate-500">
          Select at least one goal and an impact level to continue.
        </span>
        <button
          type="button"
          disabled={!canContinue}
          onClick={onNext}
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3 text-sm font-bold shadow-lg transition active:scale-95 ${
            canContinue
              ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-violet-500/25 hover:opacity-95"
              : "cursor-not-allowed bg-slate-200 text-slate-400 shadow-none"
          }`}
        >
          Continue to Sleep & Energy
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
