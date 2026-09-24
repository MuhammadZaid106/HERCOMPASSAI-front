"use client";

import React from "react";
import {
  ShieldCheck,
  Lock,
  Key,
  Filter,
  CheckCircle2,
  ArrowRight,
  Database,
  EyeOff,
  UserCheck,
} from "lucide-react";

export default function HowItWorksPrivacyFlow() {
  const steps = [
    {
      num: "01",
      title: "Encrypted Member Vault",
      subtitle: "Personal Health Data",
      description: "Raw symptom logs, diary entries, and cycle dates are encrypted client-side. Only you hold the access key.",
      icon: Lock,
      color: "from-rose-500 to-pink-600",
      bgColor: "bg-rose-50 border-rose-200 text-rose-600",
      guarantee: "100% Private to Member",
    },
    {
      num: "02",
      title: "Deterministic Synthesis",
      subtitle: "Zero-Raw Translation",
      description: "Software converts private timestamps into abstract trends (e.g., 'Rest was interrupted' instead of raw numbers).",
      icon: Filter,
      color: "from-violet-500 to-indigo-600",
      bgColor: "bg-violet-50 border-violet-200 text-violet-600",
      guarantee: "Anonymized Trend Signals",
    },
    {
      num: "03",
      title: "Scoped Consent Gate",
      subtitle: "Member Policy Filter",
      description: "Every signal is evaluated against your active consent toggles. Any revoked category is dropped instantly.",
      icon: Key,
      color: "from-amber-500 to-orange-600",
      bgColor: "bg-amber-50 border-amber-200 text-amber-600",
      guarantee: "Revocable in 1-Click",
    },
    {
      num: "04",
      title: "Consented Partner Digest",
      subtitle: "Actionable Empathy Only",
      description: "Partner receives weekly guidance, Men's Academy audio lessons, and supportive prompts to reduce tension.",
      icon: UserCheck,
      color: "from-teal-500 to-emerald-600",
      bgColor: "bg-teal-50 border-teal-200 text-teal-600",
      guarantee: "No Medical Jargon",
    },
  ];

  return (
    <section id="privacy" className="py-12 sm:py-16 lg:py-24 bg-white border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3.5 py-1 text-xs font-semibold text-teal-700 mb-3">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Zero-Knowledge Scoped Consent Architecture</span>
          </div>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            How Your Privacy is Physically Guaranteed at Every Layer.
          </h2>
          <p className="mt-2.5 sm:mt-4 text-xs sm:text-base text-slate-600 leading-relaxed">
            Many women worry: &ldquo;Will my partner see my personal thoughts or exact symptoms?&rdquo;
            The answer is mathematically <strong>never</strong>. Our architecture isolates raw health logs from partner views by design.
          </p>
        </div>

        {/* 4-Stage Visual Data Flow */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
              >
                <div>
                  {/* Top indicator & icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black tracking-widest text-slate-300">
                      STEP {step.num}
                    </span>
                    <div className={`h-10 w-10 rounded-2xl border flex items-center justify-center font-bold ${step.bgColor}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {step.title}
                  </h3>
                  <div className="text-[11px] font-semibold text-violet-600 mb-2">
                    {step.subtitle}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Bottom Guarantee Badge */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-slate-700">
                  <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                  <span>{step.guarantee}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* The Revocation Guarantee Callout */}
        <div className="mt-8 sm:mt-10 p-4 sm:p-6 rounded-3xl bg-slate-900 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-500/20 text-teal-300 shrink-0 font-bold">
              <EyeOff className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Instant Partner Revocation Guarantee</h4>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                Revoking your partner&apos;s digest takes 1 tap. Their next digest link is invalidated immediately.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-teal-400 bg-teal-950/80 border border-teal-800/80 px-3 py-1.5 rounded-xl shrink-0 self-start sm:self-center">
            Zero Delay Enforcement
          </span>
        </div>

      </div>
    </section>
  );
}
