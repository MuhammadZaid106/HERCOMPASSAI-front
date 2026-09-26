"use client";

import React from "react";
import { ArrowLeft, Clock, ShieldCheck, Check } from "lucide-react";

interface ProgressHeaderProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  canGoBack: boolean;
  estimatedMinutes?: number;
}

export function OnboardingProgressHeader({
  currentStep,
  totalSteps,
  onBack,
  canGoBack,
  estimatedMinutes = 3,
}: ProgressHeaderProps) {
  const percentage = Math.round(((currentStep - 1) / (totalSteps - 1)) * 100);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Back Button or Brand Anchor */}
        <div className="flex items-center gap-3">
          {canGoBack ? (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 active:scale-95"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 font-bold text-white shadow-sm text-xs">
                HC
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 hidden sm:inline">
                HerCompass Assessment
              </span>
            </div>
          )}
        </div>

        {/* Center Progress Counter */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-slate-800">
            Step {currentStep} of {totalSteps}
          </span>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
            <Clock className="h-3 w-3 text-violet-600" />
            <span>~{estimatedMinutes} min remaining</span>
          </div>
        </div>

        {/* Right Privacy Indicator */}
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded-full px-2.5 py-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span className="hidden sm:inline">Confidential & Encrypted</span>
          <span className="sm:hidden">Private</span>
        </div>
      </div>

      {/* Animated Gradient Progress Track */}
      <div className="h-1.5 w-full bg-slate-100 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-600 via-indigo-500 to-rose-400 transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </header>
  );
}
