import React from "react";
import Link from "next/link";
import { Sparkles, Clock, HeartHandshake, ArrowRight, Check } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      step: "01",
      badge: "First 5 Minutes",
      title: "Discover Your Baseline Snapshot",
      desc: "Complete a friendly, 5-minute interactive onboarding covering your symptoms, mood, sleep, and lifestyle. Instantly receive your 8-part Personal Menopause Snapshot™.",
      highlights: [
        "Non-diagnostic, observational language",
        "Instant clarity on personal patterns",
        "Immediate personalized next steps",
      ],
      icon: Sparkles,
      color: "from-violet-500 to-indigo-600",
    },
    {
      step: "02",
      badge: "Under 60 Seconds Daily",
      title: "Log Daily & Unlock Predictive Insights",
      desc: "Check in with your daily sleep, mood, energy, and symptoms. Our deterministic engine computes mathematical trends while AI translates them into adaptive nutrition & cooling routines.",
      highlights: [
        "Quick tap-to-log interface",
        "Nutrition Radar (e.g. magnesium & phytoestrogens)",
        "Movement and breathwork suggestions",
      ],
      icon: Clock,
      color: "from-indigo-600 to-sky-600",
    },
    {
      step: "03",
      badge: "Couple & Partner Support (CPS)",
      title: "Consented Digest & Men’s Academy",
      desc: "Invite your partner with strict, member-controlled privacy. Partners receive weekly actionable digests—what to prepare, how to support, and what to avoid—never your raw medical logs.",
      highlights: [
        "Revocable, scoped sharing consent",
        "Men’s Academy empathy micro-lessons",
        "Household alignment & co-regulation",
      ],
      icon: HeartHandshake,
      color: "from-purple-600 to-rose-500",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#FBFBF9] relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 mb-3">
            <span>A Simple, Science-Backed System</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Clarity, Connection, and Confidence in Every Cycle
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            From your very first 5 minutes to everyday household harmony, HerCompassAI transforms
            uncertainty into predictable, supportive routines.
          </p>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm transition-all hover:shadow-xl hover:border-violet-300 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-black text-slate-200 tracking-wider">
                      {item.step}
                    </span>
                    <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700 border border-violet-100">
                      {item.badge}
                    </span>
                  </div>

                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${item.color} text-white shadow-md mb-5`}>
                    <Icon className="h-6 w-6 stroke-[2.2]" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {item.desc}
                  </p>
                </div>

                <ul className="space-y-2.5 pt-6 border-t border-slate-100 text-xs text-slate-700">
                  {item.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 flex-shrink-0">
                        <Check className="h-3 w-3 stroke-[2.5]" />
                      </div>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom Callout */}
        <div className="mt-12 sm:mt-16 text-center">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 rounded-xl sm:rounded-2xl bg-slate-900 px-5 sm:px-7 py-3 sm:py-4 text-sm font-semibold text-white shadow-md hover:bg-slate-800 transition-all hover:shadow-lg"
          >
            <span>Experience Step 1 Now</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
