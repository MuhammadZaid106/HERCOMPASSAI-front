"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Compass, Lock, ArrowRight, HeartHandshake, ShieldAlert } from "lucide-react";
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

  // ALL HOOKS MUST BE DECLARED BEFORE ANY CONDITIONAL EARLY RETURN.
  // React Error #310 is caused by calling hooks after an early return.
  // We use a lazy initializer on useState to restore the draft synchronously
  // on mount, avoiding the need for a separate useEffect after early returns.

  const [currentStep, setCurrentStep] = useState(1);

  const [values, setValues] = useState<OnboardingFormValues>(() => {
    const draft = onboardingClient.getDraft();
    return draft ?? initialOnboardingValues;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auth + Role guard - declared BEFORE all early returns (Rules of Hooks)
  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.replace("/login?from=/onboarding&reason=auth_required");
      return;
    }
    if (user && (user.role === "partner" || user.role === "admin")) {
      router.replace(user.role === "admin" ? "/admin" : "/welcome");
    }
  }, [authLoading, isAuthenticated, user, router]);

  // Loading state while auth resolves
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

  // Not authenticated
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
              Your Personal Menopause Snapshot is tied to your account so your
              progress and insights are securely saved. Please sign in or create
              a free account to begin.
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

  // Partner guard - onboarding is ONLY for member accounts
  if (user && user.role === "partner") {
    return (
      <div className="min-h-screen bg-[#FBFBF9] flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-3xl border border-indigo-200/90 bg-white p-8 shadow-xl space-y-6 text-center animate-fadeIn">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600">
              <HeartHandshake className="h-7 w-7" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-extrabold text-slate-900">Partner Account Detected</h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              The 5-Minute Baseline Snapshot is tailored for women members
              tracking hormonal rhythms and symptoms. Partners do not take this
              assessment.
            </p>
            <p className="text-xs text-slate-500">
              Your partner companion portal delivers insights via the Consented
              Partner Digest and Men&apos;s Academy.
            </p>
          </div>
          <Link
            href="/welcome"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-sm hover:from-indigo-700 hover:to-violet-700 shadow-md transition-all cursor-pointer"
          >
            <span>Return to Partner Welcome Portal</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Admin guard - admins manage the platform, they do not take member onboarding
  if (user && user.role === "admin") {
    return (
      <div className="min-h-screen bg-[#FBFBF9] flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-3xl border border-amber-200/90 bg-white p-8 shadow-xl space-y-6 text-center animate-fadeIn">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200 text-amber-600">
              <ShieldAlert className="h-7 w-7" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-extrabold text-slate-900">Admin Account Detected</h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              The 5-Minute Baseline Snapshot is exclusively for women member
              accounts. As an admin, please use the admin panel to manage the
              platform.
            </p>
            <p className="text-xs text-slate-500">
              Admin accounts manage platform settings, users, and system configurations.
            </p>
          </div>
          <Link
            href="/admin"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm hover:from-amber-600 hover:to-orange-600 shadow-md transition-all cursor-pointer"
          >
            <span>Go to Admin Panel</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Authenticated member - render the wizard

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
        setCurrentStep(10);
        return;
      }

      if (!result.success) {
        setErrorMessage(result.message || "Failed to submit assessment.");
        setIsSubmitting(false);
        return;
      }

      setCurrentStep(10);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] flex flex-col">
      {currentStep > 1 && currentStep <= TOTAL_STEPS && (
        <OnboardingProgressHeader
          currentStep={currentStep}
          totalSteps={TOTAL_STEPS}
          onBack={handleBack}
          canGoBack={currentStep > 1}
          estimatedMinutes={Math.max(1, Math.round((TOTAL_STEPS - currentStep) * 0.5))}
        />
      )}

      <main className="flex-1 flex flex-col justify-center py-8 px-4 sm:px-6">
        <div className="relative mx-auto w-full max-w-2xl">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-gradient-to-tr from-violet-200/35 via-rose-100/25 to-amber-100/15 blur-[100px] pointer-events-none" />

          {errorMessage && (
            <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-700 shadow-sm animate-fadeIn">
              {errorMessage}
            </div>
          )}

          <div className="relative z-10">
            {currentStep === 1 && <Step1Welcome onStart={handleNext} />}
            {currentStep === 2 && (
              <Step2Stage values={values} onChange={updateValues} onNext={handleNext} />
            )}
            {currentStep === 3 && (
              <Step3Goals values={values} onChange={updateValues} onNext={handleNext} />
            )}
            {currentStep === 4 && (
              <Step4Symptoms values={values} onChange={updateValues} onNext={handleNext} />
            )}
            {currentStep === 5 && (
              <Step5SleepEnergy values={values} onChange={updateValues} onNext={handleNext} />
            )}
            {currentStep === 6 && (
              <Step6Lifestyle values={values} onChange={updateValues} onNext={handleNext} />
            )}
            {currentStep === 7 && (
              <Step7Mood values={values} onChange={updateValues} onNext={handleNext} />
            )}
            {currentStep === 8 && (
              <Step8PriorityGoal values={values} onChange={updateValues} onNext={handleNext} />
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
