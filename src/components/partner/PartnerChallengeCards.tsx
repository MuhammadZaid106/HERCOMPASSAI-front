"use client";

import React, { useEffect, useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  Moon,
  Clock,
  HeartHandshake,
  Wind,
  Trophy,
} from "lucide-react";
import { partnerClient } from "@/lib/partner/partnerClient";

interface Challenge {
  id: string;
  title: string;
  category: string;
  description: string;
  benefit: string;
}

/** Icon pool: cycles through icons based on challenge index */
const ICON_POOL = [Moon, Clock, HeartHandshake, Wind, Sparkles, Trophy];
const COLOR_POOL = [
  "from-indigo-500 to-sky-500",
  "from-amber-500 to-orange-500",
  "from-teal-500 to-emerald-500",
  "from-violet-500 to-purple-500",
  "from-rose-500 to-pink-500",
  "from-cyan-500 to-blue-500",
];

function SkeletonCard() {
  return (
    <div className="animate-pulse p-5 rounded-3xl border border-slate-200 bg-white space-y-3">
      <div className="flex justify-between">
        <div className="h-4 w-24 rounded bg-slate-200" />
        <div className="h-6 w-20 rounded-xl bg-slate-100" />
      </div>
      <div className="h-5 w-3/4 rounded bg-slate-200" />
      <div className="h-3 w-full rounded bg-slate-100" />
      <div className="h-3 w-5/6 rounded bg-slate-100" />
    </div>
  );
}

export default function PartnerChallengeCards() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void partnerClient.challenges().then((result) => {
      if (!active) return;
      if (result.ok && result.data?.challenges?.length) {
        setChallenges(result.data.challenges);
        // Pre-mark first challenge as practiced (matches original demo behavior)
        if (result.data.challenges[0]) {
          setCompleted({ [result.data.challenges[0].id]: true });
        }
      }
      setLoading(false);
    });
    return () => { active = false; };
  }, []);

  const toggleChallenge = (id: string) => {
    setCompleted((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const completedCount = Object.values(completed).filter(Boolean).length;
  const scorePercent = challenges.length > 0 ? Math.round((completedCount / challenges.length) * 100) : 0;

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
                {completedCount} of {challenges.length} challenges practiced this week
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

        {/* Cards Grid */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : challenges.map((ch, index) => {
                const isDone = completed[ch.id] ?? false;
                const Icon = ICON_POOL[index % ICON_POOL.length];
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
