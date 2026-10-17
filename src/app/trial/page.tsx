"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/auth/AuthContext";
import { memberClient } from "@/lib/member/memberClient";
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Activity,
  Flame,
  Moon,
  Brain,
  Zap,
  Lock,
  Compass,
  Check,
  AlertCircle,
  LogIn,
  UserPlus,
  X,
} from "lucide-react";

interface SymptomScenario {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  nutritionRadar: {
    lowNutrients: string[];
    score: number;
    recipes: string[];
    action: string;
  };
  predictiveInsight: {
    percentage: string;
    text: string;
    confidence: "High" | "Moderate";
  };
  cpsDigest: {
    partnerTip: string;
    sharedActivity: string;
  };
  academyLesson: {
    title: string;
    doThis: string;
    avoidThis: string;
  };
}

const SYMPTOM_SCENARIOS: SymptomScenario[] = [
  {
    id: "night_sweats",
    name: "Night Sweats & Flushing",
    icon: Flame,
    tag: "Vasomotor Regulation",
    nutritionRadar: {
      lowNutrients: ["Magnesium", "Phytoestrogens", "Electrolytes"],
      score: 54,
      recipes: ["Lavender-chamomile sleep infusion", "Spinach + lentil magnesium bowl", "Soy yogurt + antioxidant berries"],
      action: "Increase magnesium-rich greens and evening cooling hydration.",
    },
    predictiveInsight: {
      percentage: "25%",
      text: "Sleep score is 25% likely to improve if magnesium intake is increased and caffeine is avoided after 2 PM.",
      confidence: "High",
    },
    cpsDigest: {
      partnerTip: "Maria is focusing on magnesium-rich meals to reduce night sweats. Tip: Consider preparing the recommended cooling dinner together.",
      sharedActivity: "Couple Challenge: Complete 3 calming 15-minute evening walks this week.",
    },
    academyLesson: {
      title: "Understanding Temperature Spikes",
      doThis: "Keep bedroom cool (65°F/18°C) and offer an ice water tumbler without fuss.",
      avoidThis: "Don't question or minimize her discomfort during sudden heat flushes.",
    },
  },
  {
    id: "insomnia",
    name: "Sleep Disruption & 3 AM Waking",
    icon: Moon,
    tag: "Circadian Rhythm",
    nutritionRadar: {
      lowNutrients: ["L-Theanine", "Tryptophan", "Vitamin D3"],
      score: 61,
      recipes: ["Warm spiced pumpkin seed milk", "Tart cherry chamomile elixir", "Quinoa avocado thermoregulating bowl"],
      action: "Support natural melatonin pathways with evening complex amino acids.",
    },
    predictiveInsight: {
      percentage: "18%",
      text: "Nighttime waking frequency drops by up to 18% when an evening 10-minute cooling breath meditation is logged.",
      confidence: "High",
    },
    cpsDigest: {
      partnerTip: "Maria is resetting her sleep window. Tip: Keep bedroom lighting low and wind down devices 45 minutes before sleep.",
      sharedActivity: "Couple Challenge: 10-minute screen-free wind down before bed.",
    },
    academyLesson: {
      title: "Nighttime Architecture",
      doThis: "Support uninterrupted quiet rest; encourage daytime naps when appropriate.",
      avoidThis: "Don't schedule tense discussions right before bed.",
    },
  },
  {
    id: "stress",
    name: "High Stress & Cortisol Spikes",
    icon: Zap,
    tag: "Autonomic Nervous System",
    nutritionRadar: {
      lowNutrients: ["B-Complex Vitamins", "Zinc", "Omega-3 EPA"],
      score: 48,
      recipes: ["Steamed wild salmon with steamed greens", "Chia walnut restorative pudding", "Ashwagandha calming broth"],
      action: "Counteract adrenal drain with anti-inflammatory omegas and B vitamins.",
    },
    predictiveInsight: {
      percentage: "32%",
      text: "Cortisol spikes correlate with 32% heavier evening fatigue when lunch protein is below 25g.",
      confidence: "Moderate",
    },
    cpsDigest: {
      partnerTip: "Work has been unusually stressful this week. Tip: A short evening walk together has helped restore calm in past stressful weeks.",
      sharedActivity: "Couple Challenge: 15-minute unplugged evening stroll.",
    },
    academyLesson: {
      title: "Stress Co-Regulation",
      doThis: "Listen empathetically for 5 minutes without offering immediate problem-solving.",
      avoidThis: "Don't say 'just relax' or dismiss physical fatigue.",
    },
  },
  {
    id: "brain_fog",
    name: "Brain Fog & Focus Gaps",
    icon: Brain,
    tag: "Neuroendocrine Support",
    nutritionRadar: {
      lowNutrients: ["Choline", "Polyphenols", "Iron"],
      score: 58,
      recipes: ["Blueberry rosemary brain-fuel smoothie", "Egg yolk & spinach breakfast skillet", "Walnut pomegranate recovery salad"],
      action: "Optimize acetylcholine production and cerebral blood flow.",
    },
    predictiveInsight: {
      percentage: "21%",
      text: "Cognitive clarity scores improve by 21% following 3 consecutive days of hydration tracking.",
      confidence: "Moderate",
    },
    cpsDigest: {
      partnerTip: "Maria is balancing busy mental load. Tip: Coordinate family schedules together early in the week to lighten cognitive strain.",
      sharedActivity: "Couple Challenge: 5-minute Sunday morning schedule alignment.",
    },
    academyLesson: {
      title: "Neuro-Supportive Partnership",
      doThis: "Write shared tasks on a central board and follow through reliably.",
      avoidThis: "Don't tease or express impatience when words or dates are temporarily forgotten.",
    },
  },
];

function TrialContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [selectedScenario, setSelectedScenario] = useState<SymptomScenario>(SYMPTOM_SCENARIOS[0]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [trialStatus, setTrialStatus] = useState<{
    isTrialActive?: boolean;
    daysRemaining?: number;
    plan?: string;
  } | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const shouldAutoActivate = searchParams.get("action") === "activate";

  // Check trial status if logged in
  useEffect(() => {
    if (user) {
      memberClient.getTrialStatus().then((res) => {
        if (res.success && res.data) {
          setTrialStatus(res.data);
        }
      });
    }
  }, [user]);

  // Handle auto-activation when arriving back from login/register with ?action=activate
  useEffect(() => {
    if (user && shouldAutoActivate && !isActivating) {
      handleStartTrial();
    }
  }, [user, shouldAutoActivate]);

  const handleStartTrial = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setIsActivating(true);
    setErrorMessage(null);
    try {
      const res = await memberClient.startTrial();
      if (res.success && res.data) {
        setSuccessBanner("🎉 Your 14-Day Free Premium Trial is now active! Entering your space...");
        setTrialStatus({
          isTrialActive: true,
          daysRemaining: res.data.daysRemaining || 14,
          plan: "premium",
        });
        setTimeout(() => {
          router.push("/app");
        }, 1200);
      } else {
        setErrorMessage(res.message || "Failed to activate trial. Please try again.");
      }
    } catch {
      setErrorMessage("Network error connecting to trial service. Please check your connection.");
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FBFBF9] text-[#0F172A]">
      <Navbar />

      <main className="flex-1 py-12 lg:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          
          {/* Top Pill & Hero */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-violet-700 shadow-xs mb-6">
              <Sparkles className="h-4 w-4 text-violet-600" />
              <span>14-Day Free Premium Trial • Zero Commitment</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
              Experience Your Snapshot. <br />
              <span className="bg-gradient-to-r from-violet-600 via-rose-500 to-indigo-600 bg-clip-text text-transparent">
                Ready to go deeper?
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Test drive the complete <strong className="text-slate-900 font-semibold">HerCompass Intelligence Stack™</strong>. 
              Get full access to Nutrition Radar, predictive correlation percentages, and mutual couple challenges.
            </p>

            {successBanner && (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800 animate-fadeIn">
                {successBanner}
              </div>
            )}

            {errorMessage && (
              <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-800 animate-fadeIn">
                {errorMessage}
              </div>
            )}

            {trialStatus?.isTrialActive && (
              <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-indigo-200 bg-indigo-50/90 px-6 py-3 text-sm text-indigo-900">
                <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0" />
                <span>
                  <strong>Your Premium Trial is active!</strong> {trialStatus.daysRemaining} days remaining.
                </span>
                <Link
                  href="/app"
                  className="ml-2 font-bold underline hover:text-indigo-700"
                >
                  Go to Dashboard →
                </Link>
              </div>
            )}
          </div>

          {/* Interactive Feature Demo: Maria's Story Scenario Explorer */}
          <section className="mt-16 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-violet-700">
                  Interactive Intelligence Demo
                </p>
                <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
                  Select a symptom to see how Premium personalizes your care
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Based on Maria&apos;s real-life perimenopause journey across Nutrition, Predictive Insights &amp; Partner Support.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 self-start sm:self-auto">
                <ShieldCheck className="h-4 w-4" />
                <span>Clinician-Verified Evidence</span>
              </div>
            </div>

            {/* Symptom Selector Tabs */}
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {SYMPTOM_SCENARIOS.map((sc) => {
                const Icon = sc.icon;
                const active = selectedScenario.id === sc.id;
                return (
                  <button
                    key={sc.id}
                    type="button"
                    onClick={() => setSelectedScenario(sc)}
                    className={`flex items-center gap-2.5 rounded-2xl px-4 py-3 text-left text-xs font-bold transition-all ${
                      active
                        ? "bg-violet-700 text-white shadow-md shadow-violet-700/20"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/60"
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-violet-600"}`} />
                    <span className="truncate">{sc.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic 4-Layer Feature Grid */}
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              
              {/* Layer 1: Nutrition Radar */}
              <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/50 p-5 hover:border-violet-300 transition">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-violet-700">
                      Layer 1 • Nutrition Radar
                    </span>
                    <span className="text-xs font-extrabold text-slate-700">
                      {selectedScenario.nutritionRadar.score}/100
                    </span>
                  </div>
                  <h3 className="mt-2 text-sm font-bold text-slate-900">
                    Deficit &amp; Cooling Meals
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {selectedScenario.nutritionRadar.lowNutrients.map((n) => (
                      <span
                        key={n}
                        className="rounded-lg bg-rose-50 border border-rose-200 px-2 py-0.5 text-[10px] font-semibold text-rose-700"
                      >
                        Low {n}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                    {selectedScenario.nutritionRadar.action}
                  </p>
                </div>
                <div className="mt-4 border-t border-slate-200/70 pt-3">
                  <p className="text-[10px] font-bold uppercase text-slate-500">Suggested Recipes</p>
                  <ul className="mt-1 space-y-1 text-xs text-slate-700">
                    {selectedScenario.nutritionRadar.recipes.map((r) => (
                      <li key={r} className="truncate">• {r}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Layer 2: Predictive Correlation */}
              <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/50 p-5 hover:border-indigo-300 transition">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">
                      Layer 2 • AI Predictions
                    </span>
                    <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-extrabold text-indigo-800">
                      {selectedScenario.predictiveInsight.confidence} Conf.
                    </span>
                  </div>
                  <h3 className="mt-2 text-sm font-bold text-slate-900">
                    Intervention Trajectory
                  </h3>
                  <div className="mt-3 rounded-xl bg-white border border-indigo-100 p-3 shadow-xs">
                    <span className="text-2xl font-black text-indigo-700">
                      +{selectedScenario.predictiveInsight.percentage}
                    </span>
                    <p className="text-[11px] font-semibold text-slate-500 mt-0.5">Estimated Improvement</p>
                  </div>
                  <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                    {selectedScenario.predictiveInsight.text}
                  </p>
                </div>
                <div className="mt-4 border-t border-slate-200/70 pt-3">
                  <p className="text-[10px] text-slate-500 italic">
                    Grounded in North American Menopause Society (NAMS) guidelines.
                  </p>
                </div>
              </div>

              {/* Layer 3: Couple & Partner Support */}
              <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/50 p-5 hover:border-rose-300 transition">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">
                      Layer 3 • Partner Support (CPS)
                    </span>
                    <HeartHandshake className="h-4 w-4 text-rose-600" />
                  </div>
                  <h3 className="mt-2 text-sm font-bold text-slate-900">
                    Private Scoped Digest
                  </h3>
                  <div className="mt-3 rounded-xl bg-rose-50/80 border border-rose-100 p-3">
                    <p className="text-xs text-rose-950 font-medium leading-relaxed">
                      &ldquo;{selectedScenario.cpsDigest.partnerTip}&rdquo;
                    </p>
                  </div>
                </div>
                <div className="mt-4 border-t border-slate-200/70 pt-3">
                  <p className="text-[10px] font-bold uppercase text-slate-500">Mutual Challenge</p>
                  <p className="mt-1 text-xs text-slate-800 font-semibold">
                    {selectedScenario.cpsDigest.sharedActivity}
                  </p>
                </div>
              </div>

              {/* Layer 4: Men's Academy Bite-Sized Lesson */}
              <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/50 p-5 hover:border-amber-300 transition">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                      Layer 4 • Men&apos;s Academy
                    </span>
                    <Brain className="h-4 w-4 text-amber-700" />
                  </div>
                  <h3 className="mt-2 text-sm font-bold text-slate-900">
                    {selectedScenario.academyLesson.title}
                  </h3>
                  <div className="mt-3 space-y-2">
                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-2 text-xs text-emerald-950">
                      <span className="font-bold text-emerald-800">Do this:</span> {selectedScenario.academyLesson.doThis}
                    </div>
                    <div className="rounded-xl bg-slate-100 border border-slate-200 p-2 text-xs text-slate-800">
                      <span className="font-bold text-rose-700">Avoid:</span> {selectedScenario.academyLesson.avoidThis}
                    </div>
                  </div>
                </div>
                <div className="mt-4 border-t border-slate-200/70 pt-3">
                  <p className="text-[10px] text-slate-500">
                    Private coaching lessons to foster connection without awkwardness.
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* Trial Entitlements Comparison & Activation Box */}
          <section className="mt-16 rounded-3xl bg-gradient-to-br from-violet-950 via-indigo-900 to-slate-900 p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-500/20 px-3.5 py-1 text-xs font-bold text-violet-200 border border-violet-400/30">
                <Sparkles className="h-3.5 w-3.5" />
                No Credit Card Required
              </span>

              <h2 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight">
                Start your 14-day Premium Trial today.
              </h2>
              
              <p className="mt-3 text-sm sm:text-base text-violet-200 leading-relaxed max-w-xl mx-auto">
                Experience full personalization risk-free. If you choose not to subscribe, your account simply returns to our generous Free Baseline with all your tracking data safe.
              </p>

              <div className="mt-8 grid sm:grid-cols-2 gap-3 text-left max-w-lg mx-auto">
                <div className="flex items-center gap-2.5 text-xs text-violet-100">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Unlimited Nutrition Radar &amp; Recipes</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-violet-100">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Predictive Symptom Correlation Engine</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-violet-100">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Couple &amp; Partner Support (CPS)</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-violet-100">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Men&apos;s Academy coaching modules</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                {user ? (
                  trialStatus?.isTrialActive ? (
                    <Link
                      href="/app"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-extrabold text-violet-950 shadow-lg hover:bg-violet-50 transition"
                    >
                      <span>Open Your Premium Space</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled={isActivating}
                      onClick={handleStartTrial}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 px-8 py-4 text-sm font-extrabold text-white shadow-lg hover:brightness-110 active:scale-98 transition disabled:opacity-50"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>{isActivating ? "Activating Trial..." : "Activate My 14-Day Free Trial"}</span>
                    </button>
                  )
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowLoginModal(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 text-sm font-extrabold text-violet-950 shadow-lg hover:bg-violet-50 active:scale-98 transition"
                  >
                    <Sparkles className="h-4 w-4 text-violet-600" />
                    <span>Start 14-Day Free Premium Trial</span>
                    <ArrowRight className="h-4 w-4 text-violet-600" />
                  </button>
                )}

                <Link
                  href="/app"
                  className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl border border-violet-400/30 bg-violet-900/40 px-6 py-4 text-sm font-semibold text-violet-200 hover:bg-violet-900/60 transition"
                >
                  <span>Keep Exploring Free</span>
                </Link>
              </div>

              <p className="mt-4 text-[11px] text-violet-300">
                Cancel anytime with zero charges • Personal health data stays strictly private
              </p>
            </div>
          </section>

        </div>
      </main>

      <Footer />

      {/* Logged-Out Prompt Modal: User must login/register to continue with trial */}
      {showLoginModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs animate-fadeIn"
          onClick={() => setShowLoginModal(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl text-slate-900 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700 mb-4">
              <Lock className="h-6 w-6" />
            </div>

            <h3 className="text-xl font-extrabold text-slate-900">
              Sign in to claim your 14-Day Trial
            </h3>

            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              To activate and continue your free 14-day Premium Trial, please create your personal wellness account or sign in.
            </p>

            <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-600 space-y-1.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Zero cost, no credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span>Your trial progress and Snapshot are automatically saved</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/register?from=/trial?action=activate&plan=premium"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 px-4 text-sm font-bold text-white shadow-md hover:bg-violet-700 transition"
              >
                <UserPlus className="h-4 w-4" />
                <span>Create Free Account &amp; Continue</span>
              </Link>

              <Link
                href="/login?from=/trial?action=activate"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-3 px-4 text-sm font-bold text-slate-700 hover:bg-slate-50 transition"
              >
                <LogIn className="h-4 w-4" />
                <span>Log In with Existing Account</span>
              </Link>
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                className="text-xs text-slate-500 hover:text-slate-800 underline"
              >
                Continue previewing without an account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrialPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FBFBF9]" />}>
      <TrialContent />
    </Suspense>
  );
}
