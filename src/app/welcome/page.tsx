"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  User,
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  LogOut,
  Calendar,
  Compass,
  Activity,
  Lock,
  Clock,
  ClipboardList,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { onboardingClient } from "@/lib/onboarding/onboardingClient";

export default function WelcomePage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [onboardingStatus, setOnboardingStatus] = useState<{
    isCompleted: boolean;
    profile?: any;
  } | null>(null);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user && user.role === "member") {
      let isMounted = true;
      onboardingClient
        .getProfile()
        .then((res) => {
          if (isMounted) {
            setOnboardingStatus(res);
            setCheckingOnboarding(false);
          }
        })
        .catch(() => {
          if (isMounted) {
            setOnboardingStatus({ isCompleted: false });
            setCheckingOnboarding(false);
          }
        });

      return () => {
        isMounted = false;
      };
    } else {
      setCheckingOnboarding(false);
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FBFBF9] px-4">
        <div className="relative flex items-center justify-center">
          <div className="h-16 w-16 rounded-full border-4 border-violet-100 border-t-violet-600 animate-spin" />
          <Compass className="absolute h-6 w-6 text-violet-600 animate-pulse" />
        </div>
        <p className="mt-4 text-sm font-medium text-slate-600">
          Loading your personal wellness space...
        </p>
      </div>
    );
  }

  const isMember = user.role === "member";
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const planLabel =
    user.plan === "premium"
      ? "Premium Couple Plan"
      : user.plan === "plus"
      ? "Plus Plan"
      : "Free Baseline Plan";

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-[#0F172A] flex flex-col justify-between">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-xs text-white">
              <Compass className="h-4 w-4" />
            </div>
            <span className="font-bold text-base tracking-tight text-slate-900">
              HerCompass<span className="text-violet-600">AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Authenticated Session
            </span>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/50 transition-all cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Welcome Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-10 shadow-xl shadow-violet-900/10 mb-8">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-violet-200 text-xs font-medium border border-white/10">
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                <span>Welcome to HerCompassAI</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Welcome back, {user.name}!
              </h1>

              <p className="text-sm sm:text-base text-violet-100/90 max-w-xl leading-relaxed">
                {isMember
                  ? "Your personal menopause intelligence space is active. Access your baseline metrics, trend calculations, and non-diagnostic clinical guidance."
                  : "Your couple support portal is ready. Access weekly consented digests, actionable communication guidance, and the Men's Academy."}
              </p>
            </div>

            {/* Profile Avatar / Badge */}
            <div className="flex sm:flex-col items-center gap-3 sm:text-center shrink-0 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-violet-400 to-indigo-300 text-violet-950 font-extrabold text-xl flex items-center justify-center shadow-inner">
                {initials}
              </div>
              <div>
                <p className="text-xs font-semibold text-white truncate max-w-[140px]">
                  {user.name}
                </p>
                <p className="text-[11px] text-violet-200 capitalize">
                  {user.role === "member" ? "Woman / Member" : "Partner / Spouse"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Member Onboarding Status & Priority CTA */}
        {isMember && (
          <div className="mb-8">
            {checkingOnboarding ? (
              <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-xs flex items-center gap-4 animate-pulse">
                <div className="h-12 w-12 rounded-xl bg-violet-100 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-48 bg-violet-100 rounded" />
                  <div className="h-3 w-80 bg-slate-100 rounded" />
                </div>
              </div>
            ) : !onboardingStatus?.isCompleted ? (
              /* State A: Onboarding Incomplete — High Priority Hero CTA */
              <div className="relative overflow-hidden rounded-3xl border-2 border-violet-300/80 bg-gradient-to-br from-violet-50/80 via-white to-indigo-50/80 p-6 sm:p-8 shadow-lg shadow-violet-500/5">
                <div className="absolute top-0 right-0 w-48 h-48 bg-violet-200/30 rounded-full blur-2xl pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-violet-100 text-violet-800 border border-violet-200">
                      <span className="h-2 w-2 rounded-full bg-violet-600 animate-pulse" />
                      Priority Step 1: Initial Baseline Setup
                    </div>
                    <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-violet-600" />
                      Takes ~5 minutes
                    </span>
                  </div>

                  <div className="max-w-2xl mb-6">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                      Take Your 5-Minute Personal Menopause Snapshot™
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      You haven’t completed your baseline assessment yet. Complete our guided 9-step intake to unlock personalized symptom insights, sleep pattern scoring, dietary ideas, and non-diagnostic observational trends.
                    </p>
                  </div>

                  {/* Highlights Pills */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-6 text-xs text-slate-700">
                    <div className="flex items-center gap-2 bg-white/90 border border-violet-100 px-3 py-2 rounded-xl shadow-2xs">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>9 Guided Steps</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/90 border border-violet-100 px-3 py-2 rounded-xl shadow-2xs">
                      <Lock className="h-4 w-4 text-violet-600 shrink-0" />
                      <span>100% Private &amp; Encrypted</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/90 border border-violet-100 px-3 py-2 rounded-xl shadow-2xs">
                      <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
                      <span>Instant 8-Part Snapshot Report</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <Link
                      href="/onboarding"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-md shadow-violet-500/25 hover:shadow-lg hover:shadow-violet-500/35 transition-all text-sm group cursor-pointer"
                    >
                      <ClipboardList className="h-4 w-4" />
                      <span>Start Onboarding Assessment</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <span className="text-xs text-slate-500 text-center sm:text-left sm:ml-2">
                      Auto-saves progress • Resume draft anytime
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              /* State B: Onboarding Completed — Celebration & Quick Access */
              <div className="rounded-2xl border border-emerald-200/90 bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/50 p-6 sm:p-7 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                  <div className="space-y-1.5 max-w-xl">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      Baseline Assessment Active
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                      Your Personal Menopause Snapshot™ is Active
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Your baseline calculations, symptom impact index, and evidence-grounded non-diagnostic summaries are ready.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
                    <Link
                      href="/snapshot"
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-violet-600 hover:bg-violet-700 shadow-xs hover:shadow-md transition-all text-xs group"
                    >
                      <Activity className="h-4 w-4" />
                      <span>View 8-Part Snapshot™</span>
                      <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>

                    <Link
                      href="/onboarding"
                      className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                    >
                      <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
                      <span>Retake Assessment</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* User Account Overview Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs mb-8">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-violet-600" />
            Verified Account Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-400 block font-medium">Account Name</span>
              <span className="text-sm font-semibold text-slate-900 block truncate mt-0.5">
                {user.name}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-400 block font-medium">Email Address</span>
              <span className="text-sm font-semibold text-slate-900 block truncate mt-0.5">
                {user.email}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-400 block font-medium">Role Persona</span>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-violet-700 capitalize mt-0.5">
                {isMember ? (
                  <User className="h-3.5 w-3.5 text-violet-600" />
                ) : (
                  <HeartHandshake className="h-3.5 w-3.5 text-indigo-600" />
                )}
                {user.role}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-400 block font-medium">Subscription Tier</span>
              <span className="text-sm font-semibold text-emerald-700 block capitalize mt-0.5">
                {planLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Action Pathways */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Suggested Next Steps
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Action 1: Dynamic Snapshot / Onboarding */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-violet-300 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="h-9 w-9 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center mb-3">
                  <Activity className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  {onboardingStatus?.isCompleted
                    ? "8-Part Snapshot™ Report"
                    : "5-Min Baseline Snapshot™"}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {onboardingStatus?.isCompleted
                    ? "Review your deterministic symptom impact, hormonal rhythm trends, and sleep scores."
                    : "Log your current cycle phase, sleep metrics, and hot flash patterns for deterministic trend modeling."}
                </p>
              </div>
              <Link
                href={onboardingStatus?.isCompleted ? "/snapshot" : "/onboarding"}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-violet-600 hover:text-violet-800"
              >
                <span>
                  {onboardingStatus?.isCompleted
                    ? "View Full Report"
                    : "Start Assessment"}
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Action 2 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                  <Lock className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  Partner Privacy Scope
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Configure consented partner sharing. Raw notes remain strictly confidential with 1-tap instant revocation.
                </p>
              </div>
              <Link
                href="/partner"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                <span>Manage Consent Scopes</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Action 3 */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <Calendar className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  How The 3 Steps Work
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Discover how HerCompass separates deterministic calculations from non-diagnostic empathetic AI guidance.
                </p>
              </div>
              <Link
                href="/how-it-works"
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-800"
              >
                <span>Explore Methodology</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Regulatory & Safety Disclaimer */}
        <div className="mt-8 p-4 rounded-xl bg-slate-100/70 border border-slate-200/60 text-[11px] text-slate-500 flex items-start gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-slate-700">Educational Wellness Boundary:</strong> HerCompassAI provides observational trends and evidence-grounded lifestyle guidance. It does not provide medical diagnoses, prescriptions, or clinical treatments.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
        HerCompassAI © 2026 — Evidence-backed Menopause &amp; Partner Intelligence
      </footer>
    </div>
  );
}
