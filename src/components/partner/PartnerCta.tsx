"use client";

import React from "react";
import Link from "next/link";
import { HeartHandshake, ArrowRight, ShieldCheck, CheckCircle2, Sparkles } from "lucide-react";

export default function PartnerCta() {
  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-b from-[#FAF9F6] to-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950 p-5 sm:p-10 lg:p-16 text-white shadow-2xl overflow-hidden">
          
          {/* Ambient Background Glows */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 h-80 w-80 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-80 w-80 rounded-full bg-violet-600/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-500/15 px-3.5 py-1 text-xs font-semibold text-teal-200 mb-4 sm:mb-6 backdrop-blur-xs">
              <Sparkles className="h-3.5 w-3.5 text-teal-300" />
              <span>Transform Your Relationship Through Midlife</span>
            </div>

            <h2 className="text-xl sm:text-3xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Bring Connection and Predictability to Your Home.
            </h2>

            <p className="mt-3.5 sm:mt-5 text-xs sm:text-base lg:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Replace awkward conversations, guesswork, and emotional distance with evidence-grounded insights
              and weekly empathy briefings tailored for your partnership.
            </p>

            {/* CTAs */}
            <div className="mt-6 sm:mt-10 flex flex-row flex-wrap items-center justify-center gap-3 sm:gap-4">
              <Link
                href="/register?type=couple"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-600 px-5 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg shadow-teal-600/30 hover:bg-teal-500 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
              >
                <HeartHandshake className="h-4 w-4 shrink-0" />
                <span>Invite Your Partner (Free Trial)</span>
              </Link>

              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 border border-white/20 px-5 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-white hover:bg-white/20 active:scale-[0.98] transition-all cursor-pointer backdrop-blur-xs whitespace-nowrap"
              >
                <span>Take 5-Min Assessment First</span>
                <ArrowRight className="h-4 w-4 text-teal-300 shrink-0" />
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="mt-8 pt-6 border-t border-slate-700/60 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs text-slate-400">
              <div className="flex items-center justify-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-teal-400 shrink-0" />
                <span>Zero-Knowledge Partner Privacy</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-teal-400 shrink-0" />
                <span>1-Tap Instant Consent Revocation</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <Sparkles className="h-4 w-4 text-teal-400 shrink-0" />
                <span>Under 5 Minutes Weekly Commitment</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
