"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, CheckCircle2, ChevronRight } from "lucide-react";

interface HowItWorksHeroProps {
  activeSection: string;
  onSelectSection: (sectionId: string) => void;
}

export default function HowItWorksHero({ activeSection, onSelectSection }: HowItWorksHeroProps) {
  const jumpLinks = [
    { id: "step-1", label: "01. Baseline Snapshot", shortLabel: "01. Snapshot" },
    { id: "step-2", label: "02. Daily Check-In", shortLabel: "02. Check-In" },
    { id: "step-3", label: "03. Partner Digest", shortLabel: "03. Partner" },
    { id: "architecture", label: "Architecture & SCI™", shortLabel: "SCI™ Engine" },
    { id: "privacy", label: "Privacy Model", shortLabel: "Privacy" },
    { id: "journey", label: "Couple Journey", shortLabel: "Journey" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-violet-50/50 via-white to-[#FBFBF9] pt-12 sm:pt-16 lg:pt-20 pb-10 sm:pb-14 border-b border-slate-200/80">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 -mt-20 h-72 w-72 rounded-full bg-violet-400/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-10 h-64 w-64 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-3.5 py-1 text-xs font-semibold text-violet-700 shadow-xs backdrop-blur-xs mb-4 sm:mb-6">
            <Sparkles className="h-3.5 w-3.5 text-violet-600" />
            <span>The HerCompassAI Operating System</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            From Daily Signals to <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">Empathetic Clarity</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-3.5 sm:mt-5 text-xs sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Traditional health apps force tedious tracking that leaves women overwhelmed and partners in the dark.
            HerCompassAI uses a simple 3-step loop: calculate deterministically, interpret empathetically, and bridge couples privately.
          </p>

          {/* CTAs */}
          <div className="mt-6 sm:mt-8 flex flex-row flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 px-5 sm:px-7 py-2.5 sm:py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-violet-600/25 hover:bg-violet-500 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Take 5-Min Free Assessment</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
            <Link
              href="/register?type=couple"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white border border-slate-200 px-5 sm:px-7 py-2.5 sm:py-3.5 text-xs sm:text-sm font-bold text-slate-700 shadow-xs hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
            >
              <HeartHandshake className="h-4 w-4 text-violet-600 shrink-0" />
              <span>Explore Partner Experience</span>
            </Link>
          </div>

          {/* Trust bullet points */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px] sm:text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 shrink-0" />
              <span>No Medical Jargon</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-600 shrink-0" />
              <span>Zero Raw Data Exposed to Partner</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-teal-600 shrink-0" />
              <span>Deterministic Precision</span>
            </div>
          </div>

        </div>

        {/* Section Navigation Tabs */}
        <div className="mt-10 sm:mt-12 pt-6 border-t border-slate-200/80">
          <div className="text-center mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Jump to Chapter
            </span>
          </div>

          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none px-1">
            {jumpLinks.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectSection(item.id)}
                  className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? "bg-violet-600 text-white shadow-sm shadow-violet-500/30"
                      : "bg-white text-slate-600 border border-slate-200/90 hover:border-violet-300 hover:text-violet-600"
                  }`}
                >
                  <span className="sm:hidden">{item.shortLabel}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                  <ChevronRight className={`h-3 w-3 transition-transform ${isActive ? "rotate-90" : ""}`} />
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
