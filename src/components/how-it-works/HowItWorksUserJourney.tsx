"use client";

import React, { useState } from "react";
import {
  Users,
  HeartHandshake,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Moon,
  MessageCircle,
} from "lucide-react";

export default function HowItWorksUserJourney() {
  const [activeWeek, setActiveWeek] = useState<number>(1);

  const timeline = [
    {
      week: 0,
      title: "Week 0: The Silent Disconnect",
      subtitle: "Walking on Eggshells",
      memberState: "Maria woke at 3 AM drenched in sweat, exhausted, feeling disconnected from her own body and anxious about upcoming work presentations.",
      partnerState: "David noticed her withdrawal, assumed she was angry at him, and retreated to his home office to avoid sparking an argument.",
      outcome: "High household friction, zero shared understanding.",
      tag: "Before HerCompassAI",
      color: "border-slate-300 bg-slate-50",
    },
    {
      week: 1,
      title: "Week 1: The 5-Minute Baseline Snapshot™",
      subtitle: "A Name for the Symptoms",
      memberState: "Maria completed the 5-min snapshot. Learned her night awakenings were vasomotor spikes, not primary depression or sleep disorders.",
      partnerState: "David listened to his first 3-min Men's Academy episode: 'The Thermostat Myth'. Understood the physiological mechanism of night sweats.",
      outcome: "Blame evaporated; replaced by shared biological clarity.",
      tag: "Baseline Clarity",
      color: "border-violet-300 bg-violet-50/50",
    },
    {
      week: 2,
      title: "Week 2: Under-60s Daily Check-Ins",
      subtitle: "Deterministic Pattern Recognition",
      memberState: "Maria logged 3 taps daily. The trend engine detected that evening caffeine past 3 PM preceded 80% of her midnight surges.",
      partnerState: "Sunday digest advised: 'Expect lower morning energy Thursday—step in with school drop-off and avoid late discussions.'",
      outcome: "Proactive partner support without Maria having to ask.",
      tag: "Pattern Detection",
      color: "border-indigo-300 bg-indigo-50/50",
    },
    {
      week: 4,
      title: "Week 4: Co-Regulated Harmony",
      subtitle: "Predictability & Closeness",
      memberState: "Bedroom cooled to 67°F + magnesium protocol reduced night sweats by 38%. Sleep architecture restored to 88% efficiency.",
      partnerState: "David feels empowered, confident, and deeply attuned. Communication tension reduced to near zero.",
      outcome: "Relationship strengthened during life's most intense hormonal transition.",
      tag: "Lasting Harmony",
      color: "border-teal-300 bg-teal-50/50",
    },
  ];

  const currentTimeline = timeline.find((t) => t.week === activeWeek) || timeline[1];

  return (
    <section id="journey" className="py-12 sm:py-16 lg:py-24 bg-[#FAF9F6] border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3.5 py-1 text-xs font-semibold text-violet-700 mb-3">
            <Users className="h-3.5 w-3.5" />
            <span>Real-World Transformation</span>
          </div>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Maria &amp; David: 30 Days From Confusion to Co-Regulation.
          </h2>
          <p className="mt-2.5 sm:mt-4 text-xs sm:text-base text-slate-600 leading-relaxed">
            See how the HerCompassAI 3-step loop restored sleep, mental clarity, and marital closeness over 4 simple weeks.
          </p>
        </div>

        {/* Timeline Stepper Tabs */}
        <div className="mt-8 sm:mt-10 grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          {timeline.map((item) => {
            const isSelected = item.week === activeWeek;
            return (
              <button
                key={item.week}
                onClick={() => setActiveWeek(item.week)}
                className={`p-3 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white border-violet-600 shadow-md shadow-violet-500/10"
                    : "bg-white/60 border-slate-200 hover:border-violet-300 hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] sm:text-xs font-bold text-violet-700">
                    {item.week === 0 ? "Before" : `Week 0${item.week}`}
                  </span>
                  <div className={`h-2 w-2 rounded-full ${isSelected ? "bg-violet-600" : "bg-slate-300"}`} />
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">{item.subtitle}</div>
              </button>
            );
          })}
        </div>

        {/* Active Journey Stage Card */}
        <div className="mt-6 rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 lg:p-8 shadow-xl shadow-slate-200/60">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2 mb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 bg-violet-50 px-2 py-0.5 rounded-md">
                {currentTimeline.tag}
              </span>
              <h3 className="text-base sm:text-xl font-extrabold text-slate-900 mt-1">
                {currentTimeline.title}
              </h3>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Stage: {currentTimeline.subtitle}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            {/* Maria's Experience (Member) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-900">
                <span className="h-6 w-6 rounded-full bg-rose-200 text-rose-700 flex items-center justify-center font-bold text-[10px]">M</span>
                <span>Maria (The Member)</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {currentTimeline.memberState}
              </p>
            </div>

            {/* David's Experience (Partner) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/50 border border-teal-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-900">
                <span className="h-6 w-6 rounded-full bg-teal-200 text-teal-700 flex items-center justify-center font-bold text-[10px]">D</span>
                <span>David (The Partner)</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {currentTimeline.partnerState}
              </p>
            </div>

          </div>

          {/* Outcome Result Box */}
          <div className="mt-5 p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
              <span className="text-xs text-slate-200 font-medium">
                <strong>Result:</strong> {currentTimeline.outcome}
              </span>
            </div>
            <span className="text-[11px] font-bold text-teal-400 bg-teal-950/80 border border-teal-800/80 px-2.5 py-1 rounded-lg shrink-0 hidden sm:inline">
              Verified Case Study
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
