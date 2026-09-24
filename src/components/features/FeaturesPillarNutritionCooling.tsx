"use client";

import React, { useState, useEffect } from "react";
import {
  Utensils,
  Wind,
  Moon,
  Sparkles,
  CheckCircle2,
  Play,
  RotateCcw,
  Activity,
  Heart,
  Flame,
} from "lucide-react";

export default function FeaturesPillarNutritionCooling() {
  const [breathingPhase, setBreathingPhase] = useState<"Inhale (4s)" | "Hold (4s)" | "Exhale (4s)" | "Hold (4s)">("Inhale (4s)");
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathCounter, setBreathCounter] = useState(4);

  // Simple box breathing simulator
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBreathingActive) {
      timer = setInterval(() => {
        setBreathCounter((prev) => {
          if (prev <= 1) {
            setBreathingPhase((current) => {
              if (current === "Inhale (4s)") return "Hold (4s)";
              if (current === "Hold (4s)") return "Exhale (4s)";
              if (current === "Exhale (4s)") return "Hold (4s)";
              return "Inhale (4s)";
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setBreathCounter(4);
      setBreathingPhase("Inhale (4s)");
    }
    return () => clearInterval(timer);
  }, [isBreathingActive]);

  const nutritionPillars = [
    {
      name: "Phytoestrogen Optimization",
      role: "Gentle plant lignans & isoflavones",
      items: "Ground flaxseed, edamame, organic tempeh, chickpeas",
      clinicalBenefit: "Binds to beta-estrogen receptors to buffer sudden vasomotor temperature spikes.",
    },
    {
      name: "Magnesium Neuro-Relaxation",
      role: "GABA receptor agonist & muscle calm",
      items: "Pumpkin seeds, dark leafy greens, magnesium glycinate",
      clinicalBenefit: "Mitigates nocturnal muscle restlessness and promotes restorative slow-wave sleep.",
    },
    {
      name: "Anti-Inflammatory Vascular Base",
      role: "Endothelial protection & joint ease",
      items: "Wild salmon, walnuts, extra virgin olive oil, turmeric",
      clinicalBenefit: "Dampens systemic inflammatory markers associated with joint stiffness and fatigue.",
    },
  ];

  return (
    <section id="lifestyle" className="py-12 sm:py-16 lg:py-24 bg-white border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 mb-3">
            <span>Pillar 03 — Lifestyle &amp; Physiological Support</span>
          </div>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Adaptive Nutrition Radar &amp; Cooling Protocols
          </h2>
          <p className="mt-2.5 sm:mt-4 text-xs sm:text-base text-slate-600 leading-relaxed">
            Hormonal shifts alter how your body metabolizes carbohydrates, retains electrolytes, and dissipates heat.
            HerCompassAI adapts your daily meal ideas, evening cooling walks, and parasympathetic breathwork to your live symptom signals.
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-stretch">
          
          {/* Left Column: Nutrition Radar */}
          <div className="lg:col-span-6 flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-[#FAF9F6] p-4 sm:p-6 lg:p-8 shadow-sm">
            <div>
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-md shrink-0">
                  <Utensils className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">Adaptive Nutrition Radar</h3>
                  <span className="text-[11px] sm:text-xs text-slate-500">Curated, clinically-sound nutrient pairings</span>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                {nutritionPillars.map((n, i) => (
                  <div
                    key={i}
                    className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5 transition-all hover:border-emerald-300"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{n.name}</h4>
                      <span className="text-[9px] sm:text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 shrink-0">
                        Evidence Grounded
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-700">{n.items}</p>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 leading-snug pt-1 border-t border-slate-100">
                      <strong>Why:</strong> {n.clinicalBenefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px] sm:text-xs text-slate-500">
              <span>Recipes tailored to dietary preference</span>
              <span className="font-semibold text-emerald-700">No restrictive fad diets</span>
            </div>
          </div>

          {/* Right Column: Interactive Cooling & Breathwork Simulator */}
          <div className="lg:col-span-6 flex flex-col justify-between rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 lg:p-8 shadow-xl shadow-slate-200/50">
            <div>
              <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md shrink-0">
                    <Wind className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">Nervous System Cooling Protocols</h3>
                    <span className="text-[11px] sm:text-xs text-slate-500">Parasympathetic Vagus Nerve Activation</span>
                  </div>
                </div>
              </div>

              {/* Protocol Item 1: Evening Cooling Walks */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-3 sm:mb-4 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Moon className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                    <span>15-Minute Evening Cooling Walk</span>
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 shrink-0">
                    Couple Opportunity
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug">
                  Low-intensity movement at dusk signals core body temperature decline, helping counteract nighttime vasomotor spikes while creating space for open partner conversation.
                </p>
              </div>

              {/* Protocol Item 2: Interactive Box Breathing Simulator */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-violet-50/40 border border-indigo-200/80 text-center space-y-3.5 sm:space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">4-4-4-4 Box Breathing Simulator</span>
                  <span className="text-[10px] text-slate-500 font-mono">HRV Co-Regulation</span>
                </div>

                {/* Animated breathing circle */}
                <div className="relative mx-auto flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center">
                  <div
                    className={`absolute inset-0 rounded-full bg-gradient-to-tr from-violet-500/20 to-indigo-500/20 transition-all duration-1000 ${
                      isBreathingActive && breathingPhase.startsWith("Inhale")
                        ? "scale-115 opacity-100"
                        : isBreathingActive && breathingPhase.startsWith("Exhale")
                        ? "scale-85 opacity-50"
                        : "scale-100 opacity-70"
                    }`}
                  />
                  <div className="relative z-10 flex flex-col items-center justify-center text-center">
                    <span className="text-xl sm:text-2xl font-black text-violet-700">{breathCounter}</span>
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 mt-0.5 whitespace-nowrap">
                      {breathingPhase}
                    </span>
                  </div>
                </div>

                {/* Simulator Control */}
                <div className="flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBreathingActive(!isBreathingActive)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-violet-700 transition-all cursor-pointer"
                  >
                    {isBreathingActive ? (
                      <>
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Stop Exercise</span>
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5" />
                        <span>Start 60s Breathing Cycle</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1.5 text-[10px] sm:text-[11px] text-slate-500">
                  <span className="flex items-center gap-1 text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Immediate parasympathetic calming</span>
              </span>
              <span>Can be practiced alone or together</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
