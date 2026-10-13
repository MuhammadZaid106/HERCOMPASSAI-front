"use client";

import React, { useEffect, useState } from "react";
import {
  Headphones,
  Play,
  Pause,
  Clock,
  Sparkles,
  Volume2,
} from "lucide-react";
import type { AcademyListItem } from "@/lib/partner/partnerClient";

// Extend AcademyListItem locally with rich fields that the API returns
interface EpisodeDisplay extends Partial<AcademyListItem> {
  slug: string;
  title: string;
  category: "basics" | "daily-life" | "relationship" | "workplace" | "sleep-intimacy" | string;
  trackNumber: string;
  duration: string;
  description: string;
  takeaway: string;
  listenContext: string;
  summary: string;
  read: boolean;
}

// Static fallback episodes — shown while loading or if API is unreachable
const FALLBACK_EPISODES: EpisodeDisplay[] = [
  {
    slug: "menopause-basics",
    trackNumber: "01",
    title: "Menopause basics",
    category: "basics",
    duration: "3:00",
    description: "A short orientation for someone supporting a partner.",
    takeaway: "Your role is practical support. Her care choices stay with her and her clinician.",
    listenContext: "Great for morning coffee or commute.",
    summary: "A short orientation for someone supporting a partner.",
    read: false,
  },
  {
    slug: "what-may-be-changing",
    trackNumber: "02",
    title: "What may be changing",
    category: "basics",
    duration: "3:00",
    description: "How to talk about change without guessing a cause.",
    takeaway: "Ask what would help today instead of deciding what she is feeling.",
    listenContext: "Listen before a conversation.",
    summary: "How to talk about change without guessing a cause.",
    read: false,
  },
  {
    slug: "mood",
    trackNumber: "03",
    title: "Mood",
    category: "daily-life",
    duration: "3:00",
    description: "Stay beside her without treating a hard day as a diagnosis.",
    takeaway: "Patience and a simple question are enough to start.",
    listenContext: "Recommended before evening household wind-down.",
    summary: "Stay beside her without treating a hard day as a diagnosis.",
    read: false,
  },
  {
    slug: "communication",
    trackNumber: "04",
    title: "Communication",
    category: "relationship",
    duration: "3:00",
    description: "One question that leaves the answer with her.",
    takeaway: 'Try: "How can I support you this week?" Then wait.',
    listenContext: "Recommended for couples with demanding careers.",
    summary: "One question that leaves the answer with her.",
    read: false,
  },
];

function SkeletonTrack() {
  return (
    <div className="animate-pulse w-full p-3.5 rounded-2xl border border-slate-200 flex items-center gap-3">
      <div className="h-8 w-8 rounded-xl bg-slate-200 shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 w-3/4 rounded bg-slate-200" />
        <div className="h-2.5 w-1/2 rounded bg-slate-100" />
      </div>
    </div>
  );
}

export default function PartnerAcademyHub() {
  const [episodes, setEpisodes] = useState<EpisodeDisplay[]>(FALLBACK_EPISODES);
  const [activeEpisode, setActiveEpisode] = useState<EpisodeDisplay>(FALLBACK_EPISODES[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(16);

  useEffect(() => {
    let active = true;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";
    fetch(`${apiUrl}/api/public/academy/episodes`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active) return;
        const fetched = data?.data?.episodes as EpisodeDisplay[] | undefined;
        if (fetched && fetched.length > 0) {
          setEpisodes(fetched);
          setActiveEpisode(fetched[0]);
          setTotalCount(Math.max(fetched.length, 16));
        }
        setLoading(false);
      })
      .catch(() => {
        if (!active) return;
        setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const togglePlay = () => setIsPlaying((p) => !p);

  return (
    <section id="academy" className="py-12 sm:py-16 lg:py-24 bg-white border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-700 mb-3">
            <Headphones className="h-3.5 w-3.5" />
            <span>The Men&apos;s Academy Curriculum</span>
          </div>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            3-Minute Audio Lessons. Zero Medical Jargon. Maximum Empathy.
          </h2>
          <p className="mt-2.5 sm:mt-4 text-xs sm:text-base text-slate-600 leading-relaxed">
            Men don&apos;t want 300-page textbooks. They want direct, practical coaching.
            The Men&apos;s Academy delivers bite-sized audio lessons designed for the morning commute or dog walk.
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">

          {/* Left Column: Interactive Audio Player */}
          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-3xl border border-slate-800 bg-slate-950 p-5 sm:p-7 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

              {/* Player Top Meta */}
              <div className="flex items-center justify-between text-xs text-slate-400 pb-4 border-b border-slate-800">
                <span className="flex items-center gap-1.5 text-teal-400 font-bold uppercase tracking-wider text-[10px]">
                  <Volume2 className="h-3.5 w-3.5" />
                  <span>The Men&apos;s Academy Audio Player</span>
                </span>
                <span>Track {activeEpisode.trackNumber ?? "—"} of {totalCount}</span>
              </div>

              {/* Active Track Info */}
              <div className="mt-5 space-y-2">
                <span className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider">
                  {activeEpisode.category}
                </span>
                <h3 className="text-base sm:text-xl font-extrabold text-white leading-snug">
                  {activeEpisode.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {activeEpisode.description ?? activeEpisode.summary}
                </p>
              </div>

              {/* Simulated Progress Bar */}
              <div className="mt-6 space-y-1.5">
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r from-teal-400 to-indigo-500 rounded-full transition-all duration-300 ${
                      isPlaying ? "w-2/5 animate-pulse" : "w-1/6"
                    }`}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>{isPlaying ? "01:14" : "00:32"}</span>
                  <span>{activeEpisode.duration ?? "3:00"}</span>
                </div>
              </div>

              {/* Player Controls */}
              <div className="mt-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="h-12 w-12 rounded-2xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-teal-500/30 hover:bg-teal-400 active:scale-95 transition-all cursor-pointer"
                    aria-label={isPlaying ? "Pause Lesson" : "Play Lesson"}
                  >
                    {isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
                  </button>
                  <div>
                    <span className="text-xs font-bold text-white block">
                      {isPlaying ? "Playing Audio Stream..." : "Tap to Listen Sample"}
                    </span>
                    <span className="text-[10px] text-slate-400">Narrated by Clinical Experts</span>
                  </div>
                </div>

                <span className="text-[11px] text-slate-400 font-medium bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
                  {activeEpisode.listenContext ?? "Great for commute."}
                </span>
              </div>

              {/* Takeaway Box */}
              {(activeEpisode.takeaway ?? activeEpisode.summary) && (
                <div className="mt-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-teal-300 font-bold text-[11px]">
                    <Sparkles className="h-3 w-3" />
                    <span>Key Actionable Takeaway for Partner</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {activeEpisode.takeaway ?? activeEpisode.summary}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Syllabus Track Selection */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Course Syllabus (Select a Track to Preview)
              </span>
              <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                {totalCount} Lessons Total
              </span>
            </div>

            <div className="space-y-2.5">
              {loading
                ? Array.from({ length: 4 }).map((_, i) => <SkeletonTrack key={i} />)
                : episodes.map((ep) => {
                    const isSelected = ep.slug === activeEpisode.slug;
                    return (
                      <button
                        key={ep.slug}
                        onClick={() => {
                          setActiveEpisode(ep);
                          setIsPlaying(true);
                        }}
                        className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? "bg-slate-50 border-teal-600 shadow-sm"
                            : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            isSelected ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600"
                          }`}>
                            {ep.trackNumber ?? "—"}
                          </div>
                          <div>
                            <div className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                              {ep.title}
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                              <span>{ep.category}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{ep.duration ?? "3:00"}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className={`h-7 w-7 rounded-xl border flex items-center justify-center shrink-0 ${
                          isSelected ? "border-teal-600 bg-teal-50 text-teal-700" : "border-slate-200 text-slate-400"
                        }`}>
                          <Play className="h-3 w-3 fill-current ml-0.5" />
                        </div>
                      </button>
                    );
                  })}
            </div>

            <div className="pt-2 text-center sm:text-left">
              <span className="text-xs text-slate-500">
                New episodes added monthly covering HRT discussions, relationship intimacy, and sleep hygiene.
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
