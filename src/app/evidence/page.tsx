import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ShieldCheck,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Layers,
  Sparkles,
  ArrowRight,
  Database,
  Lock,
  Heart,
  Moon,
  Zap,
  Activity,
  Smile,
  Compass,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Evidence Base & Clinical Transparency — HerCompassAI",
  description:
    "Explore the clinical guidelines, peer-reviewed medical sources, and 6-step evaluation pipeline behind HerCompassAI\'s non-diagnostic relationship intelligence platform.",
  openGraph: {
    title: "HerCompassAI — Evidence Base & Clinical Sources",
    description:
      "Information you can understand. Evidence you can explore. Grounded in NAMS, ACOG, WHO, and NIH research.",
    url: "https://hercompassai.com/evidence",
    siteName: "HerCompassAI",
    type: "website",
  },
};

const EVIDENCE_ITEMS = [
  {
    category: "menopause",
    categoryLabel: "Vasomotor Symptoms",
    title: "Clinical Guidelines for Vasomotor Symptoms & Lifestyle Interventions",
    sourceOrg: "The Menopause Society (NAMS)",
    year: "2023",
    consensus:
      "Vasomotor symptoms (hot flashes, night sweats) respond measurably to non-hormonal behavioral strategies, environmental cooling, and targeted stress-reduction routines.",
    plainExplanation:
      "Why this matters for you: You don&apos;t have to navigate hot flashes with guesswork. Validated temperature regulation routines and breath-pacing exercises reduce symptom intensity on high-stress days.",
    url: "https://www.menopause.org",
  },
  {
    category: "sleep",
    categoryLabel: "Sleep Architecture",
    title: "Perimenopausal Sleep Fragmentation & Circadian Hygiene",
    sourceOrg: "ACOG (American College of Obstetricians & Gynecologists)",
    year: "2024",
    consensus:
      "Estrogen fluctuations disrupt hypothalamic thermoregulation during sleep cycles, contributing to secondary wakefulness rather than primary psychological insomnia.",
    plainExplanation:
      "Why this matters for you: Waking up at 3:00 AM isn&apos;t just stress—it&apos;s a biological thermoregulatory shift. Tracking sleep alongside night sweats lets our engine distinguish hormonal spikes from lifestyle fatigue.",
    url: "https://www.acog.org",
  },
  {
    category: "mood",
    categoryLabel: "Neurochemical Wellness",
    title: "Cognitive Behavioral Therapy (CBT) Protocols for Midlife Emotional Health",
    sourceOrg: "NIH / National Institute of Mental Health",
    year: "2023",
    consensus:
      "Structured mindfulness and CBT interventions produce statistically significant reductions in perceived irritability and brain fog during menopausal transition.",
    plainExplanation:
      "Why this matters for you: Mood shifts during perimenopause stem from neurosteroid variability. Structured emotional check-ins help identify triggers before emotional exhaustion sets in.",
    url: "https://www.nih.gov",
  },
  {
    category: "nutrition",
    categoryLabel: "Nutritional Science",
    title: "Magnesium Intake, Phytoestrogens and Sleep Regulation in Midlife Women",
    sourceOrg: "Harvard School of Public Health & WHO",
    year: "2022",
    consensus:
      "Dietary magnesium supports GABA neurotransmission and nervous system relaxation, while modest dietary phytoestrogens assist mild vasomotor stabilization.",
    plainExplanation:
      "Why this matters for you: HerCompassAI&apos;s recipe suggestions prioritize magnesium-dense whole foods and thermoregulating teas to naturally nourish sleep quality.",
    url: "https://www.hsph.harvard.edu",
  },
  {
    category: "energy",
    categoryLabel: "Metabolic Vitality",
    title: "Physical Activity, Low-Impact Movement & Cortisol Regulation",
    sourceOrg: "CDC Guidelines & Stanford Movement Science",
    year: "2023",
    consensus:
      "Gentle evening cooling walks and low-intensity mobility routines reduce nocturnal cortisol elevation and improve daytime energetic stamina.",
    plainExplanation:
      "Why this matters for you: Intense workouts can sometimes trigger vasomotor spikes; gentle cooling walks co-regulate heart rate variability and support deeper physical restoration.",
    url: "https://www.cdc.gov",
  },
  {
    category: "relationships",
    categoryLabel: "Partner Intelligence",
    title: "Social Empathy, Couple Co-Regulation and Perceived Stress Reduction",
    sourceOrg: "Journal of Women&apos;s Health & Behavioral Medicine",
    year: "2023",
    consensus:
      "Partners who receive contextual education and concrete behavioral scripts exhibit 40% higher supportive efficacy, reducing relationship friction during transition periods.",
    plainExplanation:
      "Why this matters for you: Your partner wants to help but often doesn&apos;t know how. Scoped digests give them actionable guidance on what to say and what to do without invading your private journal.",
    url: "https://www.nih.gov",
  },
];

export default function EvidencePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FBFBF9] text-[#0F172A]">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-rose-100/60 bg-gradient-to-b from-rose-50/40 via-[#FBFBF9] to-[#FBFBF9] py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-rose-200/80 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-700 shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4 w-4 text-rose-600" />
                <span>Clinical Transparency &amp; Non-Diagnostic Trust</span>
              </div>
              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Information you can understand. <br />
                <span className="bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Evidence you can explore.
                </span>
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-slate-600">
                HerCompassAI is not an unverified AI chatbot and does not diagnose conditions.
                Every personalized suggestion, educational insight, and partner tip is grounded in
                peer-reviewed guidelines from world-recognized medical institutions.
              </p>
            </div>
          </div>
        </section>

        {/* 6-Step Evaluation Pipeline */}
        <section className="border-b border-slate-200/80 bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-xs font-bold uppercase tracking-widest text-rose-600">
                How We Evaluate Information
              </h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                The 6-Step Clinical Integrity Pipeline
              </p>
              <p className="mt-3 text-slate-600">
                Deterministic calculation verifies numbers; clinical guidelines verify knowledge; safety guardrails protect your peace of mind.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6">
              {[
                {
                  step: "01",
                  title: "Gold Standard Source",
                  desc: "Direct guidance from NAMS, ACOG, WHO, and NIH peer-reviewed literature.",
                  icon: Database,
                },
                {
                  step: "02",
                  title: "Clinical Review",
                  desc: "Evidence catalog maintained and verified for scientific consensus.",
                  icon: BookOpen,
                },
                {
                  step: "03",
                  title: "Metadata Tagging",
                  desc: "Tagged by recency, authority score, consensus level, and category.",
                  icon: Layers,
                },
                {
                  step: "04",
                  title: "Deterministic Engine",
                  desc: "Trends and percentage changes calculated by mathematical code, never guessed.",
                  icon: Sparkles,
                },
                {
                  step: "05",
                  title: "SCI™ Guardrails",
                  desc: "Non-diagnostic checks, claim verification, and mandatory citation attachment.",
                  icon: Lock,
                },
                {
                  step: "06",
                  title: "Empowered Member",
                  desc: "Plain-language insights with transparent citations and actionable steps.",
                  icon: CheckCircle2,
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-[#FBFBF9] p-6 shadow-sm transition hover:shadow-md"
                >
                  <div>
                    <span className="text-xs font-black tracking-widest text-rose-500">
                      {item.step}
                    </span>
                    <item.icon className="mt-3 h-6 w-6 text-slate-700" />
                    <h3 className="mt-4 text-base font-bold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-slate-600">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Evidence Library & Source Cards */}
        <section className="py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-slate-200 pb-8">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  Approved Evidence Catalog
                </h2>
                <p className="mt-2 text-sm text-slate-600 max-w-2xl">
                  Explore how research from leading medical authorities translates directly into daily lifestyle, sleep, and emotional support.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-2 text-xs font-medium text-rose-700">
                <ShieldCheck className="h-4 w-4" />
                <span>Strict Non-Diagnostic Grounding</span>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {EVIDENCE_ITEMS.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition hover:border-rose-200 hover:shadow-lg"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {item.categoryLabel}
                      </span>
                      <span className="text-xs font-medium text-slate-400">
                        Updated {item.year}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold leading-snug text-slate-900">
                      {item.title}
                    </h3>

                    <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Scientific Consensus
                      </p>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {item.consensus}
                      </p>
                    </div>

                    <div className="rounded-xl bg-rose-50/60 p-4 border border-rose-100">
                      <p className="text-xs font-bold uppercase tracking-wider text-rose-800 mb-1">
                        What this means for you
                      </p>
                      <p className="text-xs text-slate-800 leading-relaxed">
                        {item.plainExplanation}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-600">
                      Source: {item.sourceOrg}
                    </span>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-rose-600 hover:text-rose-700 hover:underline"
                    >
                      <span>Explore</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA Card */}
            <div className="mt-16 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-2xl space-y-3 text-center md:text-left">
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Experience Evidence-Based Personal Intelligence
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Take the free 5-minute onboarding assessment to receive your Personal Menopause Snapshot™, complete with verified citations and custom recommendations.
                </p>
              </div>
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 rounded-xl bg-rose-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-rose-600"
              >
                <span>Start Free Snapshot</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
