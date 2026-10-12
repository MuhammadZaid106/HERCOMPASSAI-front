"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  CalendarClock,
  ExternalLink,
  FileSearch,
  FlaskConical,
  Layers,
  ShieldCheck,
  Sparkles,
  Tags,
} from "lucide-react";

const PIPELINE = [
  {
    title: "Source",
    description:
      "A clinical guideline, systematic review, or peer-reviewed study is identified before any guidance is written.",
    icon: BookOpen,
  },
  {
    title: "Evidence Review",
    description:
      "Our clinical reviewers confirm the source applies to perimenopause and menopause care and note its strength.",
    icon: FileSearch,
  },
  {
    title: "Metadata",
    description:
      "Each statement is tagged with its category, publication date, and the organizations that support it.",
    icon: Tags,
  },
  {
    title: "AI Interpretation",
    description:
      "Language models translate the finding into plain, everyday English without adding new claims.",
    icon: BrainCircuit,
  },
  {
    title: "Safety Validation",
    description:
      "Guardrails screen for diagnostic language, dosage advice, and anything outside wellness scope.",
    icon: ShieldCheck,
  },
  {
    title: "Member Experience",
    description:
      "You see a short, calm explanation with the citation attached, ready to explore or bring to your clinician.",
    icon: Sparkles,
  },
] as const;

const CATEGORIES = [
  "All",
  "Menopause",
  "Sleep",
  "Mood",
  "Stress",
  "Energy",
  "Nutrition",
  "Movement",
  "Relationships",
  "Lifestyle",
] as const;

type EvidenceCategory = (typeof CATEGORIES)[number];

interface EvidenceCard {
  id: string;
  category: Exclude<EvidenceCategory, "All">;
  sources: string[];
  what: string;
  why: string;
  updated: string;
  href: string;
}

const CARDS: EvidenceCard[] = [
  {
    id: "vasomotor",
    category: "Menopause",
    sources: ["NAMS", "ACOG"],
    what:
      "Vasomotor symptoms such as hot flashes and night sweats are common during the menopause transition and can persist for years after the final period.",
    why:
      "Knowing this is expected — not a sign something is wrong — helps you name what is happening and track it calmly instead of worrying in isolation.",
    updated: "March 2025",
    href: "https://www.menopause.org/for-women",
  },
  {
    id: "sleep",
    category: "Sleep",
    sources: ["NIH", "Harvard T.H. Chan"],
    what:
      "Sleep disruption in midlife is often driven by a mix of hormonal change, night sweats, stress, and age-related sleep shifts rather than a single cause.",
    why:
      "Because the causes stack, small evening-routine changes can meaningfully improve rest even when hormones are not the whole story.",
    updated: "February 2025",
    href: "https://www.nia.nih.gov/health/sleep",
  },
  {
    id: "mood",
    category: "Mood",
    sources: ["WHO", "NAMS"],
    what:
      "Mood changes during the transition are influenced by fluctuating hormones, sleep loss, and life stressors, and are not simply a matter of willpower.",
    why:
      "Treating low mood as a whole-body pattern — instead of a personal failing — opens the door to support that actually helps.",
    updated: "January 2025",
    href: "https://www.who.int/health-topics/mental-health",
  },
  {
    id: "stress",
    category: "Stress",
    sources: ["NIH", "Harvard T.H. Chan"],
    what:
      "Chronic stress amplifies many menopause symptoms, and brief, consistent calm-down practices can lower the load on the nervous system.",
    why:
      "A two-minute breathing practice is a realistic first step that does not demand a schedule overhaul to be effective.",
    updated: "December 2024",
    href: "https://www.health.harvard.edu/topics/stress",
  },
  {
    id: "energy",
    category: "Energy",
    sources: ["USPSTF", "NIH"],
    what:
      "Daytime fatigue in midlife frequently tracks with sleep quality, activity levels, and mood rather than a single vitamin deficiency.",
    why:
      "Looking at energy alongside sleep and movement avoids chasing fixes that miss the actual driver.",
    updated: "November 2024",
    href: "https://www.uspreventiveservicestaskforce.org/",
  },
  {
    id: "nutrition",
    category: "Nutrition",
    sources: ["ACOG", "WHO"],
    what:
      "Adequate calcium, vitamin D, protein, and fiber support bone, muscle, and heart health as estrogen levels decline.",
    why:
      "Ordinary meals can carry these nutrients, so improvements do not require a rigid or expensive diet.",
    updated: "October 2024",
    href: "https://www.acog.org/womens-health",
  },
  {
    id: "movement",
    category: "Movement",
    sources: ["USPSTF", "ACOG"],
    what:
      "Regular weight-bearing and muscle-strengthening activity helps protect bone density and supports mood and sleep during the transition.",
    why:
      "Consistency matters more than intensity, which is why we suggest short, repeatable sessions over heroic workouts.",
    updated: "September 2024",
    href: "https://www.uspreventiveservicestaskforce.org/",
  },
  {
    id: "relationships",
    category: "Relationships",
    sources: ["NIH", "WHO"],
    what:
      "Partner understanding and open communication are associated with better emotional wellbeing during the menopause transition.",
    why:
      "Shared language lowers household friction, which is why the partner experience focuses on empathy rather than symptom tracking.",
    updated: "August 2024",
    href: "https://www.nia.nih.gov/health/menopause",
  },
  {
    id: "lifestyle",
    category: "Lifestyle",
    sources: ["NAMS", "Harvard T.H. Chan"],
    what:
      "Alcohol, caffeine, and room temperature can each trigger or worsen night sweats and sleep disruption for some people.",
    why:
      "Naming personal triggers turns vague discomfort into something specific you can adjust and measure.",
    updated: "July 2024",
    href: "https://www.menopause.org/for-women",
  },
];

function EvidenceEvaluationPipeline() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3.5 py-1 text-xs font-semibold text-violet-700 mb-3">
            <Layers className="h-3.5 w-3.5" />
            <span>How Guidance Is Evaluated</span>
          </div>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            From clinical source to your screen — six transparent steps
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Every recommendation follows the same review path. Nothing is fabricated, and
            every step leaves an audit trail.
          </p>
        </div>

        <ol className="mt-8 sm:mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PIPELINE.map((step, index) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                className="relative rounded-2xl border border-slate-200 bg-[#FBFBF9] p-5 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-violet-600 to-indigo-600 text-white shadow-sm">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-violet-600">
                    Step {index + 1}
                  </span>
                </div>
                <h3 className="mt-3.5 text-sm font-bold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                  {step.description}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export default function EvidencePageClient() {
  const [activeCategory, setActiveCategory] = useState<EvidenceCategory>("All");

  const cards = useMemo(
    () =>
      activeCategory === "All"
        ? CARDS
        : CARDS.filter((card) => card.category === activeCategory),
    [activeCategory],
  );

  return (
    <div className="animate-fadeIn">
      {/* Hero */}
      <section className="relative overflow-hidden pt-12 pb-12 sm:pt-16 sm:pb-16 border-b border-slate-200/80 bg-gradient-to-b from-[#FAF9F6] via-white to-white">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[90vw] max-w-[620px] h-[220px] bg-gradient-to-tr from-purple-200/30 via-indigo-100/25 to-rose-100/20 blur-[110px] pointer-events-none" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200/80 bg-violet-50/80 px-3.5 py-1 text-xs font-semibold text-violet-700 shadow-xs mb-4">
            <FlaskConical className="h-3.5 w-3.5 text-violet-600" />
            <span>Evidence Base Transparency</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.15]">
            Information you can understand.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600">
              Evidence you can explore.
            </span>
          </h1>
          <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            HerCompassAI never asks you to take our word for it. Every insight is grounded
            in published clinical guidance, cited openly, and written in language that
            respects your intelligence and your time.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#library"
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:-translate-y-0.5"
            >
              <BookOpen className="h-4 w-4" />
              Browse the evidence
            </a>
            <Link
              href="/how-it-works#architecture"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50"
            >
              How the engine works
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <EvidenceEvaluationPipeline />

      {/* Library + filter */}
      <section id="library" className="scroll-mt-24 py-12 sm:py-16 lg:py-20 bg-[#FAF9F6]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Evidence library
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Filter by the area of health you are curious about. Each card shows the
              scientific consensus and, below it, why it matters in everyday life.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter evidence by category">
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-violet-600 text-white shadow-md shadow-violet-500/25"
                      : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <article
                key={card.id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-shadow hover:shadow-lg"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-violet-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-violet-700">
                    {card.category}
                  </span>
                  <div className="flex flex-wrap justify-end gap-1">
                    {card.sources.map((source) => (
                      <span
                        key={source}
                        className="rounded-full border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-500"
                      >
                        {source}
                      </span>
                    ))}
                  </div>
                </div>

                <h3 className="mt-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  What the evidence says
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-700">
                  {card.what}
                </p>

                <h3 className="mt-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Why this matters
                </h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600">
                  {card.why}
                </p>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-500">
                    <CalendarClock className="h-3.5 w-3.5" />
                    Updated {card.updated}
                  </span>
                  <a
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-violet-700 hover:text-violet-800"
                  >
                    Citation
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Non-diagnostic disclaimer */}
      <section className="py-12 sm:py-16 bg-white border-t border-slate-200/80">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-200 bg-[#FBFBF9] p-6 sm:p-8 text-center">
            <ShieldCheck className="mx-auto h-8 w-8 text-emerald-600" />
            <h2 className="mt-3 text-lg sm:text-xl font-bold text-slate-900">
              Educational, never diagnostic
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              This library explains published evidence. It does not diagnose, prescribe, or
              replace your clinician. Bring anything you find useful to your next
              appointment — that conversation is where real decisions belong.
            </p>
            <Link
              href="/onboarding"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-500/25 transition-all hover:-translate-y-0.5"
            >
              Start your free snapshot
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
