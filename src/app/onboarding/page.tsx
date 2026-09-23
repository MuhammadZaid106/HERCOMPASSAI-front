import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ArrowLeft, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "5-Min Free Snapshot — HerCompassAI",
  description:
    "Start your personalized menopause snapshot. Answer a few friendly questions and receive your 8-part Baseline Report instantly.",
};

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-[#FBFBF9] flex flex-col items-center justify-center px-4 py-20">
      {/* Radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-violet-200/40 via-purple-100/30 to-amber-100/20 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full text-center space-y-8">
        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-violet-600 to-indigo-600 shadow-2xl shadow-violet-500/30">
          <Sparkles className="h-9 w-9 text-white" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-violet-50/70 px-4 py-1.5 text-xs font-semibold text-violet-700 shadow-sm">
          <Clock className="h-3.5 w-3.5" />
          <span>5-Minute Personal Menopause Snapshot™</span>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Your Onboarding Is{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
              Coming Soon
            </span>
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            We&apos;re building the full interactive onboarding experience. In the
            meantime, explore the landing page to learn what your personalized
            snapshot will include.
          </p>
        </div>

        {/* Card Preview */}
        <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 shadow-xl shadow-slate-200/60 text-left space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-violet-700">
            What you&apos;ll get in 5 minutes:
          </p>
          {[
            "Current symptom & mood pattern observations",
            "Evidence-informed personalized next steps",
            "Nutrition & movement micro-recommendations",
            "Optional partner digest setup",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 text-sm text-slate-700">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex-shrink-0">
                ✓
              </span>
              {item}
            </div>
          ))}
        </div>

        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-violet-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}
