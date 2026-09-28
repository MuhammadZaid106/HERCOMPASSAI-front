"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

interface Step3PrivacyConsentProps {
  accepted: boolean;
  onChange: (accepted: boolean) => void;
  onNext: () => void;
}

export function Step3PrivacyConsent({ accepted, onChange, onNext }: Step3PrivacyConsentProps) {
  return (
    <div className="space-y-7 animate-fadeIn">
      <div className="space-y-2">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Your information matters.</h1>
        <p className="text-sm leading-relaxed text-slate-600">
          To create your Snapshot, we collect the onboarding responses you choose to provide about symptoms, mood, sleep, energy, lifestyle, and personal goals. We use them to personalize non-diagnostic wellness insights and practical next steps.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-600">
        Partner sharing is optional and only follows the preferences and consent you set. Review how information is handled in our{" "}
        <Link href="/privacy" target="_blank" rel="noreferrer" className="font-semibold text-violet-700 underline underline-offset-2">
          Privacy Policy
        </Link>.
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-violet-700"
        />
        <span className="text-sm font-medium leading-relaxed text-slate-700">
          I have reviewed the Privacy Policy and agree to use my onboarding responses to create my personalized Snapshot.
        </span>
      </label>

      <div className="flex justify-end">
        <button
          type="button"
          disabled={!accepted}
          onClick={onNext}
          className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          I Understand &amp; Continue <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}