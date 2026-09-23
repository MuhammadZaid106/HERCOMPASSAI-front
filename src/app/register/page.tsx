import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, HeartHandshake, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Start Free Trial — HerCompassAI",
  description:
    "Create your HerCompassAI account and begin your relationship-centered menopause wellness journey.",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#FBFBF9] flex flex-col items-center justify-center px-4 py-20">
      {/* Radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-indigo-200/40 via-purple-100/30 to-rose-100/20 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full text-center space-y-8">
        {/* Icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-600 to-violet-600 shadow-2xl shadow-indigo-500/30">
          <HeartHandshake className="h-9 w-9 text-white" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-violet-50/70 px-4 py-1.5 text-xs font-semibold text-violet-700 shadow-sm">
          <Sparkles className="h-3.5 w-3.5" />
          <span>14-Day Free Trial — No Credit Card Required</span>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Registration Is{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              Coming Soon
            </span>
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            We&apos;re finalizing the secure account system. Check back shortly or
            explore the platform to see what&apos;s included in your free trial.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="rounded-3xl border border-slate-200/90 bg-white/95 p-6 shadow-xl shadow-slate-200/60 text-left space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-700">
            Your free trial includes:
          </p>
          {[
            "Personal Menopause Snapshot™ (instant baseline)",
            "14 days of full Plus plan access",
            "Full Partner Digest & Men's Academy",
            "Cancel anytime — no commitment",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 text-sm text-slate-700">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex-shrink-0">
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
