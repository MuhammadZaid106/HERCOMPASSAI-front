"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Compass, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { OnboardingProgressHeader } from "./OnboardingProgressHeader";
import { Step1Welcome } from "./Step1Welcome";
import { Step2Stage } from "./Step2Stage";
import { Step3Goals } from "./Step3Goals";
import { Step4Symptoms } from "./Step4Symptoms";
import { Step5SleepEnergy } from "./Step5SleepEnergy";
import { Step6Lifestyle } from "./Step6Lifestyle";
import { Step7Mood } from "./Step7Mood";
import { Step8PriorityGoal } from "./Step8PriorityGoal";
import { Step9PartnerAndAi } from "./Step9PartnerAndAi";
import { Step10Generating } from "./Step10Generating";
import {
  onboardingClient,
  initialOnboardingValues,
} from "@/lib/onboarding/onboardingClient";
import type { OnboardingFormValues } from "@/lib/onboarding/onboardingTypes";
import { useAuth } from "@/lib/auth/AuthContext";

const TOTAL_STEPS = 9;

export function OnboardingWizard() {
  const router = useRouter();
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [values, setValues] = useState<OnboardingFormValues>(initialOnboardingValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ── Auth guard: redirect unauthenticated visitors ──
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login?from=/onboarding&reason=auth_required");
    }
  }, [authLoading, isAuthenticated, router]);

  // ── Loading state while auth resolves ──
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FBFBF9] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center">
            <div className="absolute h-20 w-20 rounded-full bg-violet-500/15 blur-xl animate-pulse" />
            <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 shadow-xl text-white">
              <Compass className="h-7 w-7 animate-spin-slow" />
            </div>
          </div>
          <p className="text-xs font-semibold text-slate-500">Verifying your session...</p>
        </div>
      </div>
    );
  }

  // ── Not authenticated: show lock screen (middleware should have caught this, but belt-and-suspenders) ──
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FBFBF9] flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-3xl border border-slate-200/90 bg-white p-8 shadow-xl space-y-6 text-center animate-fadeIn">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 border border-violet-200 text-violet-600">
              <Lock className="h-7 w-7" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-extrabold text-slate-900">Sign In to Continue</h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your Personal Menopause Snapshot™ is tied to your account so your progress and insights are securely saved. Please sign in or create a free account to begin.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link
              href="/login?from=/onboarding"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition hover:opacity-95 active:scale-95"
            >
              <span>Sign In to My Account</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register?from=/onboarding"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95"
            >
              Create Free Account
            </Link>
          </div>
          <p className="text-[11px] text-slate-400">
            Free forever. No credit card required. Your data stays private.
          </p>
        </div>
      </div>
    );
  }

  // Restore draft on mount
  useEffect(() => {
    const draft = onboardingClient.getDraft();
    if (draft) {
      setValues(draft);
    }
  }, []);


  // Auto-save changes to draft
  const updateValues = (fields: Partial<OnboardingFormValues>) => {
    setValues((prev) => {
      const updated = { ...prev, ...fields };
      onboardingClient.saveDraft(updated);
      return updated;
    });
  };

  const handleNext = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setErrorMessage(null);
    setCurrentStep((prev) => Math.min(prev + 1, 10));
  };

  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setErrorMessage(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await onboardingClient.submitAssessment(values);
      if (!result.success && result.message.includes("Authentication required")) {
        // Unauthenticated visitor completed assessment: preserve in local storage and show generating
        setCurrentStep(10);
        return;
      }

      if (!result.success) {
        setErrorMessage(result.message || "Failed to submit assessment.");
        setIsSubmitting(false);
        return;
      }

      // Transition to generation screen
      setCurrentStep(10);
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] flex flex-col">
      {/* Progress Top Bar (Only visible after welcome screen, before generating) */}
      {currentStep > 1 && currentStep <= TOTAL_STEPS && (
        <OnboardingProgressHeader
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          onBack={handleBack}
          canGoBack={currentStep > 1}
          estimatedMinutes={Math.max(1, Math.round((TOTAL_STEPS - currentStep) * 0.5))}
        />
      )}

      {/* Main Container */}
      <main className="flex-1 flex flex-col justify-center py-8 px-4 sm:px-6">
        <div className="relative mx-auto w-full max-w-2xl">
          {/* Ambient Lighting Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-gradient-to-tr from-violet-200/35 via-rose-100/25 to-amber-100/15 blur-[100px] pointer-events-none" />

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 shadow-sm animate-fadeIn">
              {errorMessage}
            </div>
          )}

          {/* Steps */}
          <div className="relative z-10">
            {currentStep === 1 && <Step1Welcome onStart={handleNext} />}
            {currentStep === 2 && (
              <Step2Stage
                values={values}
                onChange={updateValues}
                onNext={handleNext}
              />
            )}
            {currentStep === 3 && (
              <Step3Goals
                values={values}
                onChange={updateValues}
                onNext={handleNext}
              />
            )}
            {currentStep === 4 && (
              <Step4Symptoms
                values={values}
                onChange={updateValues}
                onNext={handleNext}
              />
            )}
            {currentStep === 5 && (
              <Step5SleepEnergy
                values={values}
                onChange={updateValues}
                onNext={handleNext}
              />
            )}
            {currentStep === 6 && (
              <Step6Lifestyle
                values={values}
                onChange={updateValues}
                onNext={handleNext}
              />
            )}
            {currentStep === 7 && (
              <Step7Mood
                values={values}
                onChange={updateValues}
                onNext={handleNext}
              />
            )}
            {currentStep === 8 && (
              <Step8PriorityGoal
                values={values}
                onChange={updateValues}
                onNext={handleNext}
              />
            )}
            {currentStep === 9 && (
              <Step9PartnerAndAi
                values={values}
                onChange={updateValues}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            )}
            {currentStep === 10 && (
              <Step10Generating
                onComplete={() => {
                  router.push("/snapshot");
                }}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
