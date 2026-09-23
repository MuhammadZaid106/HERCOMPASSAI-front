"use client";

import React, { useState } from "react";
import {
  FileText,
  UtensilsCrossed,
  Activity,
  HeartHandshake,
  CheckCircle2,
  Lock,
  Sparkles,
  ArrowRight,
  Shield,
} from "lucide-react";
import Link from "next/link";

type TabId = "snapshot" | "nutrition" | "movement" | "partner";

export default function FeatureShowcase() {
  const [activeTab, setActiveTab] = useState<TabId>("snapshot");

  return (
    <section id="features" className="py-24 bg-white border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3.5 py-1 text-xs font-semibold text-violet-700 mb-3">
            <span>HerCompass Intelligence Stack™</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            Intelligent Tools Built for Daily Life & Relationship Health
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Explore how our clinician-backed modules convert personal signals into tangible, everyday relief.
          </p>
        </div>

        {/* Tab Selector Buttons */}
        <div className="mt-10 sm:mt-12 grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-2 sm:gap-2.5">
          {[
            { id: "snapshot", label: "Personal Menopause Snapshot™", shortLabel: "Snapshot™", icon: FileText },
            { id: "nutrition", label: "Adaptive Nutrition Radar", shortLabel: "Nutrition Radar", icon: UtensilsCrossed },
            { id: "movement", label: "Cooling Breath & Movement", shortLabel: "Movement", icon: Activity },
            { id: "partner", label: "Partner Support & Men's Academy", shortLabel: "Partner Support", icon: HeartHandshake },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 rounded-2xl px-3 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
                }`}
              >
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="sm:hidden">{tab.shortLabel}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Feature Display */}
        <div className="mt-6 sm:mt-12 rounded-3xl border border-slate-200 bg-[#FAF9F6] p-5 sm:p-10 lg:p-12 shadow-sm">
          
          {/* TAB 1: Personal Menopause Snapshot */}
          {activeTab === "snapshot" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in-50 duration-300">
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-violet-700 bg-violet-100 px-3 py-1 rounded-full">
                  First 5 Minutes Value
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
                  The 8-Part Personal Menopause Snapshot™
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Rather than making you explore an empty dashboard, HerCompassAI generates a complete,
                  auditable baseline of your symptoms, mood, sleep, energy, and practical next steps.
                </p>
                <ul className="space-y-3 pt-2">
                  {[
                    "Current Symptom & Mood Pattern observations (never clinical labels)",
                    "Evidence-informed recommendations (What, Why, and First Action)",
                    "Next 3 Steps: Today, This Week, and What to Track",
                    "Optional Partner-Support Opportunity suggestion",
                  ].map((pt, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4">
                  <Link
                    href="/onboarding"
                    className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-md hover:bg-violet-700 transition-all"
                  >
                    <span>Generate Your Snapshot</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-md">
                  {/* Card header - stacks on mobile */}
                  <div className="flex flex-col gap-1.5 pb-3 border-b border-slate-100 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-violet-600 flex-shrink-0" />
                      <span className="text-xs font-bold text-slate-900">Snapshot Contract v1.2</span>
                    </div>
                    <span className="self-start text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      ✓ SCI Guardrails: Pass
                    </span>
                  </div>
                  <div className="mt-3 space-y-2.5 text-xs">
                    <div className="p-2.5 sm:p-3 bg-violet-50/60 rounded-xl border border-violet-100">
                      <span className="font-bold text-violet-900 block mb-0.5">Symptom Observation</span>
                      <p className="text-slate-600 leading-relaxed">&quot;Night sweats and sleep latency reported as moderate impact.&quot;</p>
                    </div>
                    <div className="p-2.5 sm:p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
                      <span className="font-bold text-emerald-900 block mb-0.5">Personalized Recommendation</span>
                      <p className="text-slate-600 leading-relaxed">&quot;Increase evening magnesium intake; discontinue caffeine at 2:00 PM.&quot;</p>
                    </div>
                    <div className="p-2.5 sm:p-3 bg-amber-50/60 rounded-xl border border-amber-100">
                      <span className="font-bold text-amber-900 block mb-0.5">Today&apos;s Next Action</span>
                      <p className="text-slate-600 leading-relaxed">&quot;10-minute cooling breath meditation 30 minutes before sleep.&quot;</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Adaptive Nutrition Radar */}
          {activeTab === "nutrition" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in-50 duration-300">
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                  Food as Medicine
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
                  Adaptive Nutrition Radar & Recipe Curation
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Based on your daily logs (such as hot flashes or restless nights), HerCompassAI dynamically
                  identifies nutrient synergies—like magnesium, phytoestrogens, and anti-inflammatory electrolytes.
                </p>
                <div className="space-y-2 pt-2">
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Lavender-Chamomile Sleep Tea:</strong> Calming thermoregulation support.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Spinach &amp; Lentil Magnesium Bowl:</strong> Restores mineral balance after night sweats.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Soy Yogurt &amp; Berry Parfait:</strong> Mild natural phytoestrogen support.</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-md space-y-3">
                  <div className="flex flex-col gap-1 pb-3 border-b border-slate-100 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs font-bold text-slate-900">Today&apos;s Recommended Meal Plan</span>
                    <span className="self-start text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">WHO &amp; NIH Aligned</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 font-bold text-[10px] sm:text-xs flex-shrink-0">
                      Dinner
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">Spinach &amp; Lentil Magnesium Bowl</h4>
                      <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">380mg Magnesium • High fiber • Better sleep</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-700 font-bold text-[10px] sm:text-xs flex-shrink-0">
                      Night
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">Lavender &amp; Chamomile Cooling Infusion</h4>
                      <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5">Nervous system relaxation • Zero stimulants</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Movement & Meditation */}
          {activeTab === "movement" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in-50 duration-300">
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-3 py-1 rounded-full">
                  Nervous System Co-Regulation
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
                  Targeted Movement &amp; Cooling Breathwork
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Menopause is an endocrine shift that impacts autonomic tone. Our guided micro-routines
                  focus on lowering evening cortisol to prevent vasomotor nighttime temperature surges.
                </p>
                <ul className="space-y-3 pt-2">
                  {[
                    "5-minute Cooling Breath technique (proven to lower hot flash severity by up to 18%)",
                    "Low-intensity pelvic floor & restorative evening stretches",
                    "Couple-friendly 15-minute evening cooling stroll suggestion",
                  ].map((pt, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-sky-600 mt-0.5 flex-shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-md space-y-3">
                  <div className="flex flex-col gap-1 pb-3 border-b border-slate-100 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs font-bold text-slate-900">Today&apos;s Active Routine</span>
                    <span className="self-start text-[10px] font-semibold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">ACOG Guideline Grounded</span>
                  </div>
                  <div className="p-3 rounded-xl border border-sky-100 bg-sky-50/50">
                    <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider">Guided Audio Routine</span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1">5-Min Cooling Exhale Meditation</h4>
                    <p className="text-[10px] sm:text-xs text-slate-600 mt-1 leading-relaxed">
                      Reduces sympathetic nervous system tone and lowers nighttime flush probability.
                    </p>
                    <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500">
                      <span>Duration: 5 min</span>
                      <span className="font-semibold text-sky-700 cursor-pointer">Preview Routine →</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Partner Support & Men's Academy */}
          {activeTab === "partner" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center animate-in fade-in-50 duration-300">
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-3 py-1 rounded-full">
                  Couple &amp; Partner Support (CPS)
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug">
                  Support Without Exposing Raw Personal Logs
                </h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Men often want to help, but don&apos;t understand the physiological shifts happening.
                  HerCompassAI bridges the gap with consented weekly digests and the Men&apos;s Academy.
                </p>
                <ul className="space-y-3 pt-2">
                  {[
                    "Member selects exact consent scope (e.g. general trends, never private notes)",
                    "Men&apos;s Academy micro-lessons: empathetic communication & what to avoid",
                    "Weekly joint challenges: 'Cook 2 cooling meals together this week'",
                  ].map((pt, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-rose-600 mt-0.5 flex-shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="lg:col-span-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-md space-y-3">
                  <div className="flex flex-col gap-1.5 pb-3 border-b border-slate-100 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-xs font-bold text-slate-900">Member Privacy Control Panel</span>
                    <span className="self-start text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                      <Lock className="h-3 w-3" /> Consented Scope
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl border border-slate-100 bg-slate-50">
                      <span className="font-semibold text-slate-700">Share Weekly Digest Summary</span>
                      <span className="font-bold text-emerald-600">Enabled</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl border border-slate-100 bg-slate-50">
                      <span className="font-semibold text-slate-700">Share Suggested Joint Meals</span>
                      <span className="font-bold text-emerald-600">Enabled</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl border border-slate-100 bg-slate-50">
                      <span className="font-semibold text-slate-700">Share Raw Daily Notes</span>
                      <span className="font-bold text-slate-400">Locked / Never</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
