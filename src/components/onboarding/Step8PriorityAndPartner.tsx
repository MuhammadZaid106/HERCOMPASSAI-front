"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import type { OnboardingFormValues } from "@/lib/onboarding/onboardingTypes";
import { Step8PriorityGoal } from "./Step8PriorityGoal";
import { Step9PartnerAndAi } from "./Step9PartnerAndAi";

interface Step8PriorityAndPartnerProps {
  values: OnboardingFormValues;
  onChange: (fields: Partial<OnboardingFormValues>) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function Step8PriorityAndPartner({
  values,
  onChange,
  onSubmit,
  isSubmitting,
}: Step8PriorityAndPartnerProps) {
  const canSubmit = values.primaryGoal !== "" && values.partnerSupportInterest !== "";

  return (
    <div className="space-y-8 animate-fadeIn">
      <Step8PriorityGoal values={values} onChange={onChange} onNext={onSubmit} showNext={false} />
      <div className="border-t border-slate-200 pt-8">
        <Step9PartnerAndAi
          values={values}
          onChange={onChange}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          showSubmit={false}
        />
      </div>
      <div className="flex justify-end border-t border-slate-200 pt-5">
        <button
          type="button"
          disabled={!canSubmit || isSubmitting}
          onClick={onSubmit}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-9 py-4 text-base font-bold text-white shadow-xl shadow-violet-500/30 transition-all hover:opacity-95 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? "Synthesizing Your Snapshot..." : "Generate My Personal Snapshot"}
          {!isSubmitting && <ArrowRight className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
