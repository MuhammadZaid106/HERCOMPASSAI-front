"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  GraduationCap,
  Heart,
  Moon,
  Sparkles,
  MessageSquare,
  Brain,
  XCircle,
} from "lucide-react";

const MODULES = [
  {
    number: 1,
    title: "Menopause 101",
    subtitle: "What's actually happening biologically",
    description:
      "A plain-language walkthrough of the hormonal shift, its timeline, and why symptoms vary so much from person to person.",
    duration: "12 min",
    icon: Brain,
  },
  {
    number: 2,
    title: "Mood & Emotional Fluctuations",
    subtitle: "Moving past frustration",
    description:
      "Why irritability and low mood are physiological as much as emotional, and how to respond without taking it personally.",
    duration: "10 min",
    icon: Heart,
  },
  {
    number: 3,
    title: "Sleep & Fatigue",
    subtitle: "Navigating night sweats and insomnia",
    description:
      "The mechanics of disrupted sleep in midlife and the practical routines that make rest more likely.",
    duration: "11 min",
    icon: Moon,
  },
  {
    number: 4,
    title: "Communication Mastery",
    subtitle: "What not to say & what to do instead",
    description:
      "Real phrases that help, real phrases that hurt, and how to keep a hard conversation from becoming a fight.",
    duration: "14 min",
    icon: MessageSquare,
  },
  {
    number: 5,
    title: "Intimacy & Physical Changes",
    subtitle: "Empathy-led connection",
    description:
      "Navigating physical change and desire with patience, consent, and a focus on closeness rather than performance.",
    duration: "13 min",
    icon: Sparkles,
  },
];

const SCENARIOS = [
  {
    label: "A hot flash at dinner",
    doThis: "Lower the room temperature, offer water, and carry on the conversation normally.",
    notThat: "Announce it to the table or ask loudly if she's okay.",
  },
  {
    label: "She snaps over something small",
    doThis: "Give it a beat, then respond to the feeling: \"That sounds really frustrating.\"",
    notThat: "Snap back or point out that it wasn't a big deal.",
  },
  {
    label: "She cancels plans because of fatigue",
    doThis: "Support the rest and offer to reschedule yourself so she doesn't have to.",
    notThat: "Guilt-trip or quiz her about why she's tired.",
  },
  {
    label: "She wants to talk about symptoms",
    doThis: "Listen first. Ask what would help before offering solutions.",
    notThat: "Immediately suggest a remedy or compare it to your own experience.",
  },
];

export default function MensAcademyPageClient() {
  const [activeScenario, setActiveScenario] = useState(0);
  const scenario = SCENARIOS[activeScenario];

  return (
    <div className="animate-fadeIn">
      {/* Hero */}
      <section className="relative overflow-hidden pt-12 pb-12 sm:pt-16 sm:pb-16 border-b border-slate-200/80 bg-gradient-to-b from-[#FAF9F6] via-white to-white">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[90vw] max-w-[620px] h-[220px] bg-gradient-to-tr from-indigo-200/30 via-violet-100/25 to-rose-100/20 blur-[110px] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold text-indigo-700 shadow-xs mb-4">
            <GraduationCap className="h-3.5 w-3.5 text-indigo-600" />
            <span>Men&apos;s Academy</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.15]">
            Understand More.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600">
              Support Better.
            </span>
          </h1>
          <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A five-module curriculum built for partners who were never taught this — short,
            honest, and free of jargon. Learn at your own pace, on your own time.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:-translate-y-0.5"
            >
              Begin with the snapshot
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/partner-support"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50"
            >
              See partner support
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Full Men&apos;s Academy access is included with Premium.
          </p>
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              The curriculum
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Five modules, each around ten minutes. Start anywhere — most partners begin
              with Menopause 101.
            </p>
          </div>

          <ol className="mt-8 space-y-3">
            {MODULES.map((module) => {
              const Icon = module.icon;
              return (
                <li
                  key={module.number}
                  className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-[#FBFBF9] p-5 transition-shadow hover:shadow-lg sm:flex-row sm:items-center"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-violet-600 to-indigo-600 text-white shadow-sm">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-violet-600">
                        Module {module.number}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                        <Clock className="h-3 w-3" />
                        {module.duration}
                      </span>
                    </div>
                    <h3 className="mt-1 text-base font-bold text-slate-900">
                      {module.title}
                    </h3>
                    <p className="text-sm font-semibold text-slate-500">{module.subtitle}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                      {module.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Do this, not that */}
      <section className="py-12 sm:py-16 lg:py-20 bg-[#FAF9F6] border-y border-slate-200/80">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              &ldquo;Do This, Not That&rdquo;
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Pick a moment you have actually lived through. The difference is usually one
              small choice.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {SCENARIOS.map((item, index) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setActiveScenario(index)}
                aria-pressed={activeScenario === index}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  activeScenario === index
                    ? "bg-violet-600 text-white shadow-md shadow-violet-500/25"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6">
              <div className="flex items-center gap-2 text-emerald-800">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-bold uppercase tracking-wider">Do this</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-emerald-900">
                {scenario.doThis}
              </p>
            </div>
            <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-6">
              <div className="flex items-center gap-2 text-rose-800">
                <XCircle className="h-5 w-5" />
                <span className="text-sm font-bold uppercase tracking-wider">Not that</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-rose-900">
                {scenario.notThat}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Ready to go deeper?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            The full Academy, weekly partner digest, and the couple experience are all part
            of Premium.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/upgrade?plan=premium"
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/25 transition-all hover:-translate-y-0.5"
            >
              Unlock Premium
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-xs transition-all hover:bg-slate-50"
            >
              Compare plans
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
