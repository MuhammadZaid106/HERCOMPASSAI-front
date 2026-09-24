"use client";

import React, { useState } from "react";
import {
  Headphones,
  Play,
  Pause,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  Volume2,
  ListMusic,
  Share2,
} from "lucide-react";

interface Episode {
  id: string;
  trackNumber: string;
  title: string;
  duration: string;
  category: string;
  description: string;
  takeaway: string;
  listenContext: string;
}

const EPISODES: Episode[] = [
  {
    id: "ep-01",
    trackNumber: "01",
    title: "The Thermostat Myth: Why She Isn't Just 'Hot'",
    duration: "3:12",
    category: "Biological Foundations",
    description:
      "A hot flash is not a feeling of warmth—it is a sudden malfunction of the hypothalamus triggering an emergency fight-or-flight thermoregulatory dump.",
    takeaway:
      "Understand why opening a window or asking 'Are you hot?' misses the biological reality.",
    listenContext: "Great for morning coffee or commute.",
  },
  {
    id: "ep-04",
    trackNumber: "04",
    title: "Why 'Cheer Up' Triggers an Alarm Response",
    duration: "3:40",
    category: "Communication Pointers",
    description:
      "Estrogen drops reduce serotonin receptor density. Mood lability during perimenopause is chemical, not personal resentment toward you.",
    takeaway:
      "Replace 'Cheer up' or 'Don't worry' with nervous system validating statements that quiet the amygdala.",
    listenContext: "Listen before evening household wind-down.",
  },
  {
    id: "ep-08",
    trackNumber: "08",
    title: "Bedtime Co-Regulation & The 67°F Protocol",
    duration: "2:55",
    category: "Sleep & Intimacy",
    description:
      "How dual-zone bedding and a pre-cooled bedroom restore 90 minutes of restorative deep sleep for both partners.",
    takeaway:
      "Simple bedroom adjustments that prevent 3:00 AM awakenings and bedtime anxiety.",
    listenContext: "Practical weekend routine upgrade.",
  },
  {
    id: "ep-12",
    trackNumber: "12",
    title: "Executive Fog: Protecting Her Career Bandwidth",
    duration: "3:25",
    category: "Workplace Support",
    description:
      "Prefrontal glucose hypometabolism can cause terrifying moments of word-retrieval loss in high-performing women. How to be her anchor.",
    takeaway:
      "How to reduce cognitive load at home so she can excel in the boardroom without exhaustion.",
    listenContext: "Recommended for couples with demanding careers.",
  },
];

export default function PartnerAcademyHub() {
  const [activeEpisode, setActiveEpisode] = useState<Episode>(EPISODES[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

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
                <span>Track {activeEpisode.trackNumber} of 16</span>
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
                  {activeEpisode.description}
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
                  <span>{activeEpisode.duration}</span>
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
                  {activeEpisode.listenContext}
                </span>
              </div>

              {/* Takeaway Box */}
              <div className="mt-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-teal-300 font-bold text-[11px]">
                  <Sparkles className="h-3 w-3" />
                  <span>Key Actionable Takeaway for Partner</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {activeEpisode.takeaway}
                </p>
              </div>

            </div>
          </div>

          {/* Right Column: Syllabus Track Selection */}
          <div className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Course Syllabus (Select a Track to Preview)
              </span>
              <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                16 Lessons Total
              </span>
            </div>

            <div className="space-y-2.5">
              {EPISODES.map((ep) => {
                const isSelected = ep.id === activeEpisode.id;
                return (
                  <button
                    key={ep.id}
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
                        {ep.trackNumber}
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
                            <span>{ep.duration}</span>
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
