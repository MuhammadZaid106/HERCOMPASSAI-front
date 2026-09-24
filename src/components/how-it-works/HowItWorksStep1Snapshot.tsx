"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  Flame,
  Moon,
  Brain,
  Smile,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  HelpCircle,
} from "lucide-react";

interface SymptomPreset {
  id: string;
  name: string;
  tag: string;
  vasomotorScore: number;
  sleepScore: number;
  fogScore: number;
  moodScore: number;
  dominantDomain: string;
  aiObservation: string;
  firstStep: string;
}

const PRESETS: SymptomPreset[] = [
  {
    id: "vasomotor",
    name: "Vasomotor & Night Sweats",
    tag: "Most Common (78%)",
    vasomotorScore: 78,
    sleepScore: 62,
    fogScore: 40,
    moodScore: 55,
    dominantDomain: "Vasomotor Instability",
    aiObservation:
      "Your baseline indicates that night-time vasomotor episodes are the primary driver of morning fatigue, rather than primary sleep architecture disruption. Thermoregulatory spikes peak between 2:00 AM and 4:30 AM.",
    firstStep: "Establish a 66°F–68°F bedroom cooling threshold paired with magnesium glycinate 300mg 45 min before sleep.",
  },
  {
    id: "brainfog",
    name: "Executive Fog & Fatigue",
    tag: "Workforce Impact (64%)",
    vasomotorScore: 35,
    sleepScore: 58,
    fogScore: 82,
    moodScore: 68,
    dominantDomain: "Cognitive Bandwidth",
    aiObservation:
      "Your logs highlight sharp afternoon cognitive dips between 1:30 PM and 3:30 PM. This pattern suggests estrogen-mediated glucose metabolism shifts in the prefrontal cortex during high cognitive load.",
    firstStep: "Implement 25-minute focus blocks with 5-minute visual resets; schedule high-stakes decision meetings before 11:30 AM.",
  },
  {
    id: "mood",
    name: "Mood Lability & Anxiety",
    tag: "Relationship Stressor (71%)",
    vasomotorScore: 48,
    sleepScore: 74,
    fogScore: 52,
    moodScore: 86,
    dominantDomain: "Neurochemical Sensitivity",
    aiObservation:
      "Your baseline reveals acute emotional spikes that precede physical hot flashes by 10 to 15 minutes. This is an authentic autonomic nervous system surge, not sudden psychological irritability.",
    firstStep: "Adopt the 4-4-4-4 Box Breathing protocol at first sign of chest constriction; enable Partner Co-Regulation mode.",
  },
];

export default function HowItWorksStep1Snapshot() {
  const [selectedPreset, setSelectedPreset] = useState<SymptomPreset>(PRESETS[0]);
  const [customVasomotor, setCustomVasomotor] = useState<number>(PRESETS[0].vasomotorScore);

  const handleSelectPreset = (preset: SymptomPreset) => {
    setSelectedPreset(preset);
    setCustomVasomotor(preset.vasomotorScore);
  };

  return (
    <section id="step-1" className="py-12 sm:py-16 lg:py-24 bg-white border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        
        {/* Step Badge & Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3.5 py-1 text-xs font-semibold text-violet-700 mb-3">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-600 text-[10px] font-bold text-white">1</span>
            <span>Step 01 — The 5-Minute Baseline Snapshot™</span>
          </div>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            No 100-Question Quizzes. Just 5 Minutes to Deep Health Clarity.
          </h2>
          <p className="mt-2.5 sm:mt-4 text-xs sm:text-base text-slate-600 leading-relaxed">
            Menopause is not a single symptom; it is an interconnected physiological cascade. Our clinically validated
            onboarding maps your unique baseline across 8 critical domains to create your personal digital compass.
          </p>
        </div>

        {/* Interactive Showcase Grid */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          
          {/* Left Column: Preset Selector & Methodology */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            
            {/* Preset Selector */}
            <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 sm:p-5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 block">
                Select a Common Profile to Preview
              </span>
              <div className="space-y-2">
                {PRESETS.map((preset) => {
                  const isSelected = selectedPreset.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "bg-white border-violet-500 shadow-sm shadow-violet-200/50"
                          : "bg-white/60 border-slate-200 hover:border-violet-200 hover:bg-white"
                      }`}
                    >
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-slate-900">{preset.name}</div>
                        <span className="text-[10px] sm:text-[11px] text-violet-600 font-medium">{preset.tag}</span>
                      </div>
                      <div className={`h-4 w-4 rounded-full border flex items-center justify-center ${
                        isSelected ? "border-violet-600 bg-violet-600 text-white" : "border-slate-300"
                      }`}>
                        {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* How It Works Behind the Scenes */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sliders className="h-4 w-4 text-violet-600" />
                <span>Deterministic Calculation Layer</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                The software runs weighted scoring models calibrated against NAMS and Greene Climacteric scales.
                It produces clean, deterministic index scores—zero hallucinated guesswork.
              </p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Assessment Completion:</span>
                <span className="font-semibold text-emerald-600">~4 min 45 sec</span>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-1">
              <Link
                href="/onboarding"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-violet-500/20 hover:bg-violet-500 active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Take Your Free 5-Min Baseline Snapshot</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>
            </div>

          </div>

          {/* Right Column: Live Interactive Snapshot Results Preview */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 lg:p-7 shadow-xl shadow-slate-100/80">
              
              {/* Snapshot Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md">
                      Live Assessment Output
                    </span>
                    <span className="text-xs text-slate-400">ID: #BL-7049</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                    Personal Baseline Topography
                  </h3>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-[11px] text-slate-400 block">Dominant Driver</span>
                  <span className="text-xs sm:text-sm font-bold text-violet-700">{selectedPreset.dominantDomain}</span>
                </div>
              </div>

              {/* 4 Interactive Domain Score Bars */}
              <div className="mt-5 space-y-3.5">
                
                {/* Vasomotor */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Flame className="h-3.5 w-3.5 text-rose-500" />
                      <span>Vasomotor Instability (Hot Flashes / Flushes)</span>
                    </span>
                    <span className="font-bold text-slate-900">{customVasomotor}/100</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full transition-all duration-500"
                      style={{ width: `${customVasomotor}%` }}
                    />
                  </div>
                </div>

                {/* Sleep */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Moon className="h-3.5 w-3.5 text-indigo-500" />
                      <span>Sleep Architecture &amp; Night Awakenings</span>
                    </span>
                    <span className="font-bold text-slate-900">{selectedPreset.sleepScore}/100</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${selectedPreset.sleepScore}%` }}
                    />
                  </div>
                </div>

                {/* Brain Fog */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Brain className="h-3.5 w-3.5 text-amber-500" />
                      <span>Cognitive Speed &amp; Executive Focus</span>
                    </span>
                    <span className="font-bold text-slate-900">{selectedPreset.fogScore}/100</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-500"
                      style={{ width: `${selectedPreset.fogScore}%` }}
                    />
                  </div>
                </div>

                {/* Mood */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Smile className="h-3.5 w-3.5 text-teal-500" />
                      <span>Autonomic Nervous System Regulation</span>
                    </span>
                    <span className="font-bold text-slate-900">{selectedPreset.moodScore}/100</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-teal-500 rounded-full transition-all duration-500"
                      style={{ width: `${selectedPreset.moodScore}%` }}
                    />
                  </div>
                </div>

              </div>

              {/* Empathetic AI Gateway Observational Interpretation */}
              <div className="mt-5 p-4 rounded-2xl bg-violet-50/80 border border-violet-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-violet-900 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-violet-600" />
                    <span>AI Observational Interpretation (Non-Diagnostic)</span>
                  </span>
                  <span className="text-[10px] text-violet-600 font-medium">Llama 3 + SCI Guardrails</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  &ldquo;{selectedPreset.aiObservation}&rdquo;
                </p>
              </div>

              {/* Actionable First Step */}
              <div className="mt-4 p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-100 flex items-start gap-2.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-600 text-white shrink-0 mt-0.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-emerald-950">Immediate Actionable Focus</h5>
                  <p className="text-[11px] sm:text-xs text-emerald-900/90 leading-relaxed mt-0.5">
                    {selectedPreset.firstStep}
                  </p>
                </div>
              </div>

              {/* Strict Medical Disclaimer Notice */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 text-[10px] text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                <span>Observations ground deterministic score models. No diagnostic or prescription claims.</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
