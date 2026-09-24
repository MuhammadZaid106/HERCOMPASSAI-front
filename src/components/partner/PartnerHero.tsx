"use client";

import React from "react";
import Link from "next/link";
import {
  HeartHandshake,
  ArrowRight,
  ShieldCheck,
  Headphones,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from "lucide-react";

interface PartnerHeroProps {
  activeSection: string;
  onSelectSection: (sectionId: string) => void;
}

export default function PartnerHero({ activeSection, onSelectSection }: PartnerHeroProps) {
  const jumpLinks = [
    { id: "philosophy", label: "01. Why CPS?", shortLabel: "Why CPS?" },
    { id: "digest", label: "02. Sunday Digest", shortLabel: "Digest" },
    { id: "academy", label: "03. Men's Academy", shortLabel: "Academy" },
    { id: "privacy", label: "04. Privacy Controls", shortLabel: "Privacy" },
    { id: "challenges", label: "05. Couple Challenges", shortLabel: "Challenges" },
    { id: "faq", label: "06. Couples FAQ", shortLabel: "FAQ" },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/40 via-white to-[#FAF9F6] pt-12 sm:pt-16 lg:pt-20 pb-10 sm:pb-14 border-b border-slate-200/80">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-1/4 -mt-16 h-72 w-72 rounded-full bg-teal-400/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-10 h-64 w-64 rounded-full bg-violet-400/10 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/90 px-3.5 py-1 text-xs font-semibold text-teal-800 shadow-xs backdrop-blur-xs mb-4 sm:mb-6">
            <HeartHandshake className="h-3.5 w-3.5 text-teal-600" />
            <span>Couple &amp; Partner Support (CPS) Architecture</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Menopause is a Shared Journey.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-indigo-600 to-violet-600">
              Navigate It as a Team.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-3.5 sm:mt-5 text-xs sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            Partners want to support, but often don&apos;t know what to say or fear saying the wrong thing.
            HerCompassAI bridges the empathy gap with weekly actionable guidance and 3-minute audio lessons—while keeping raw health logs 100% private.
          </p>

          {/* CTAs */}
          <div className="mt-6 sm:mt-8 flex flex-row flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/register?type=couple"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-600 px-5 sm:px-7 py-2.5 sm:py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-teal-600/25 hover:bg-teal-500 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
            >
              <HeartHandshake className="h-4 w-4 shrink-0" />
              <span>Invite Your Partner (Free Trial)</span>
            </Link>
            <button
              onClick={() => onSelectSection("digest")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white border border-slate-200 px-5 sm:px-7 py-2.5 sm:py-3.5 text-xs sm:text-sm font-bold text-slate-700 shadow-xs hover:bg-slate-50 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
            >
              <span>See Sample Sunday Digest</span>
              <ArrowRight className="h-4 w-4 text-teal-600 shrink-0" />
            </button>
          </div>

          {/* Trust bullet points */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px] sm:text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-600 shrink-0" />
              <span>Zero Raw Logs or Diary Notes Exposed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Headphones className="h-3.5 w-3.5 text-teal-600 shrink-0" />
              <span>3-Min Men&apos;s Academy Audio Lessons</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-teal-600 shrink-0" />
              <span>1-Tap Member Instant Revocation</span>
            </div>
          </div>

        </div>

        {/* Section Navigation Tabs */}
        <div className="mt-10 sm:mt-12 pt-6 border-t border-slate-200/80">
          <div className="text-center mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Explore Partner Support
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
                      ? "bg-teal-700 text-white shadow-sm shadow-teal-600/30"
                      : "bg-white text-slate-600 border border-slate-200/90 hover:border-teal-300 hover:text-teal-700"
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
