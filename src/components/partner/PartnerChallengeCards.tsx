"use client";

import React, { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  Moon,
  Clock,
  HeartHandshake,
  Wind,
  Trophy,
} from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  category: string;
  description: string;
  benefit: string;
  icon: any;
  color: string;
}

const CHALLENGES: Challenge[] = [
  {
    id: "cooling",
    title: "The 67°F Pre-Sleep Cooling Protocol",
    category: "Sleep Harmony",
    description:
      "Partner pre-sets bedroom cooling to 66°F–68°F 45 minutes before bedtime and prepares an extra light cotton layer.",
    benefit: "Reduces 3:00 AM awakenings and prevents middle-of-the-night thermostat battles.",
    icon: Moon,
    color: "from-indigo-500 to-sky-500",
  },
  {
    id: "firewall",
    title: "The 8:30 PM Friction Firewall",
    category: "Communication",
    description:
      "A shared pact: zero high-stakes conversations regarding family budgets, in-laws, or scheduling after 8:30 PM.",
    benefit: "Protects evening autonomic calm and prevents sleep-destroying cortisol spikes.",
    icon: Clock,
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "chore",
    title: "Silent Dinner & Chore Offloading",
    category: "Household Support",
    description:
      "Partner takes total ownership of dinner preparation and cleanup on two designated high-fatigue evenings without asking.",
    benefit: "Removes executive decision fatigue for the woman after a long workday.",
    icon: HeartHandshake,
    color: "from-teal-500 to-emerald-500",
  },
  {
    id: "breathing",
    title: "Co-Regulated Box Breathing (4-4-4-4)",
    category: "Nervous System",
    description:
      "When emotional tension is sensed, sit quietly together for 2 minutes and synchronize four slow breath cycles.",
    benefit: "Down-regulates the sympathetic nervous system and signals physical safety.",
    icon: Wind,
    color: "from-violet-500 to-purple-500",
  },
];

export default function PartnerChallengeCards() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({
    cooling: true,
  });

  const toggleChallenge = (id: string) => {
    setCompleted((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const completedCount = Object.values(completed).filter(Boolean).length;
  const scorePercent = Math.round((completedCount / CHALLENGES.length) * 100);

  return (
    <section id="challenges" className="py-12 sm:py-16 lg:py-24 bg-white border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3.5 py-1 text-xs font-semibold text-teal-700 mb-3">
            <Trophy className="h-3.5 w-3.5" />
            <span>Weekly Couple Habits &amp; Co-Regulation</span>
          </div>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Micro-Challenges that Build Deep Household Harmony.
          </h2>
          <p className="mt-2.5 sm:mt-4 text-xs sm:text-base text-slate-600 leading-relaxed">
            Co-regulation isn&apos;t built through grand gestures; it is formed through small, daily, predictable acts of support.
            Explore our clinically recommended couple micro-habits below.
          </p>
        </div>

        {/* Progress Tracker Banner */}
        <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900">
                Weekly Couple Co-Regulation Score
              </div>
              <div className="text-[11px] text-slate-500">
                {completedCount} of {CHALLENGES.length} challenges practiced this week
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="text-right">
              <span className="text-xs sm:text-sm font-extrabold text-teal-700">{scorePercent}%</span>
              <span className="text-[10px] text-slate-400 block">Team Attunement</span>
            </div>
            <div className="w-24 sm:w-32 h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-600 rounded-full transition-all duration-500"
                style={{ width: `${scorePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {CHALLENGES.map((ch) => {
            const Icon = ch.icon;
            const isDone = completed[ch.id] ?? false;

            return (
              <div
                key={ch.id}
                className={`p-5 sm:p-6 rounded-3xl border transition-all flex flex-col justify-between ${
                  isDone
                    ? "bg-teal-50/30 border-teal-300 shadow-sm"
                    : "bg-white border-slate-200/90 hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-100">
                      {ch.category}
                    </span>
                    <button
                      onClick={() => toggleChallenge(ch.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isDone
                          ? "bg-teal-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>{isDone ? "Practiced" : "Mark Practiced"}</span>
                    </button>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {ch.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {ch.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-teal-800 bg-teal-50/60 p-2.5 rounded-xl">
                  <strong>Relational Payoff:</strong> {ch.benefit}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
