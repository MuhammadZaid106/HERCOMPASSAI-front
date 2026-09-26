"use client";

import React from "react";
import { Check, Heart, Shield, Bell, ArrowRight } from "lucide-react";
import type { OnboardingFormValues } from "@/lib/onboarding/onboardingTypes";

interface Step9PartnerAndAiProps {
  values: OnboardingFormValues;
  onChange: (fields: Partial<OnboardingFormValues>) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const PARTNER_INTERESTS = [
  { id: "yes", label: "Yes, I'd like partner support" },
  { id: "maybe", label: "Maybe later" },
  { id: "not_now", label: "Not right now / Private" },
  { id: "no_partner", label: "I don't have a partner" },
] as const;

const RECOMMENDATION_TYPES = [
  "Symptom insights & triggers",
  "Nourishing meal & snack ideas",
  "Cooling breathwork & resets",
  "Targeted mobility & movement",
  "Communication & partner tips",
];

export function Step9PartnerAndAi({
  values,
  onChange,
  onSubmit,
  isSubmitting,
}: Step9PartnerAndAiProps) {
  const toggleRec = (rec: string) => {
    const exists = values.preferredRecommendations.includes(rec);
    const updated = exists
      ? values.preferredRecommendations.filter((r) => r !== rec)
      : [...values.preferredRecommendations, rec];
    onChange({ preferredRecommendations: updated });
  };

  const showPartnerInvite =
    values.partnerSupportInterest === "yes" || values.partnerSupportInterest === "maybe";

  return (
    <div className="space-y-7 animate-fadeIn">
      {/* Header */}
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          AI Personalization & Partner Support
        </h2>
        <p className="text-sm text-slate-600">
          Decide how HerCompassAI interacts with your daily routine and whether you wish to invite someone you trust.
        </p>
      </div>

      {/* Daily Check-in Opt-in Toggle */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
        <div className="space-y-1 pr-4">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-violet-600" />
            <span className="text-sm font-bold text-slate-900">
              60-Second Daily Morning Check-in
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Receive a gentle daily prompt to log symptoms and mood in under a minute, training your personalized Trend Engine.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onChange({ dailyCheckinOptIn: !values.dailyCheckinOptIn })}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            values.dailyCheckinOptIn ? "bg-violet-600" : "bg-slate-300"
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              values.dailyCheckinOptIn ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Recommendation Focus */}
      <div className="space-y-2.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          What guidance formats are most helpful to you?
        </label>
        <div className="flex flex-wrap gap-2">
          {RECOMMENDATION_TYPES.map((rec) => {
            const isSelected = values.preferredRecommendations.includes(rec);
            return (
              <button
                key={rec}
                type="button"
                onClick={() => toggleRec(rec)}
                className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                  isSelected
                    ? "border-violet-600 bg-violet-50 text-violet-900 shadow-sm ring-1 ring-violet-500"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {rec}
              </button>
            );
          })}
        </div>
      </div>

      {/* Couple & Partner Support (CPS) */}
      <div className="space-y-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-rose-500" />
          <span className="text-sm font-bold text-slate-900">
            Couple & Partner Support (CPS)
          </span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Would support from a partner or spouse be meaningful to you?
        </p>

        {/* Options */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {PARTNER_INTERESTS.map((opt) => {
            const isSelected = values.partnerSupportInterest === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange({ partnerSupportInterest: opt.id })}
                className={`rounded-xl border p-3 text-left text-xs font-semibold transition ${
                  isSelected
                    ? "border-violet-600 bg-violet-50 text-violet-900 ring-2 ring-violet-500/20 shadow-sm"
                    : "border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{opt.label}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-violet-600 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Conditional Partner Invitation Box */}
        {showPartnerInvite && (
          <div className="mt-4 pt-4 border-t border-slate-100 space-y-3.5 animate-fadeIn">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Partner&apos;s Email (Optional)
              </label>
              <input
                type="email"
                value={values.partnerEmail}
                onChange={(e) => onChange({ partnerEmail: e.target.value })}
                placeholder="partner@example.com"
                className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            {/* Privacy Scope Notice */}
            <div className="rounded-xl border border-amber-200/70 bg-amber-50/60 p-3.5 space-y-2 text-xs text-amber-900">
              <div className="flex items-center gap-1.5 font-bold">
                <Shield className="h-3.5 w-3.5 text-amber-700" />
                <span>Strict Partner Privacy Boundary</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-800">
                Partners <strong>never</strong> receive raw symptom entries or private notes. They only receive a high-level weekly Sunday digest with empathy tips and communication prompts.
              </p>
              <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={values.partnerConsent}
                  onChange={(e) => onChange({ partnerConsent: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded border-amber-300 text-violet-600 focus:ring-violet-500"
                />
                <span className="text-[11px] font-semibold text-amber-950">
                  I consent to sharing an empathetic weekly summary with my partner. I understand I can revoke this at any time with 1 tap.
                </span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-3">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={onSubmit}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-9 py-4 text-base font-bold text-white shadow-xl shadow-violet-500/30 transition-all hover:opacity-95 active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Synthesizing Your Snapshot...</span>
          ) : (
            <>
              <span>Generate My Personal Snapshot</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
