"use client";

import React from "react";
import {
  AlertCircle,
  CheckCircle2,
  HeartHandshake,
  Users,
  Sparkles,
  TrendingUp,
} from "lucide-react";

export default function PartnerPhilosophy() {
  return (
    <section id="philosophy" className="py-12 sm:py-16 lg:py-24 bg-white border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3.5 py-1 text-xs font-semibold text-teal-700 mb-3">
            <Users className="h-3.5 w-3.5" />
            <span>Why Relationship Intelligence Matters</span>
          </div>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Menopause is Biological. The Isolation is Optional.
          </h2>
          <p className="mt-2.5 sm:mt-4 text-xs sm:text-base text-slate-600 leading-relaxed">
            Hormonal fluctuations affect sleep, temperature regulation, mood stability, and cognitive bandwidth.
            When partners lack context, normal physiological symptoms are frequently misread as emotional rejection or marital dissatisfaction.
          </p>
        </div>

        {/* 3 Relational Statistics */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="p-4 sm:p-6 rounded-3xl bg-slate-50 border border-slate-200/80">
            <div className="text-2xl sm:text-4xl font-extrabold text-slate-900">84%</div>
            <div className="text-xs sm:text-sm font-bold text-slate-700 mt-1">Report Relationship Stress</div>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-relaxed">
              Women note that communication tension and sleep disruption are primary midlife relational friction points.
            </p>
          </div>
          <div className="p-4 sm:p-6 rounded-3xl bg-slate-50 border border-slate-200/80">
            <div className="text-2xl sm:text-4xl font-extrabold text-teal-700">72%</div>
            <div className="text-xs sm:text-sm font-bold text-slate-700 mt-1">Partners Want to Help</div>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-relaxed">
              Male partners report wanting to be supportive, but feel they lack practical tools and fear escalating tension.
            </p>
          </div>
          <div className="p-4 sm:p-6 rounded-3xl bg-slate-50 border border-slate-200/80">
            <div className="text-2xl sm:text-4xl font-extrabold text-violet-700">&lt; 60s</div>
            <div className="text-xs sm:text-sm font-bold text-slate-700 mt-1">To Close the Empathy Gap</div>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-1 leading-relaxed">
              A 3-minute Sunday briefing provides full household alignment without requiring long, emotionally draining talks.
            </p>
          </div>
        </div>

        {/* Comparison: The Isolation Trap vs The Co-Regulation Bridge */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          
          {/* Card 1: The Isolation Trap */}
          <div className="p-5 sm:p-7 rounded-3xl bg-rose-50/40 border border-rose-200/70 space-y-4 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-rose-100/80 border border-rose-200 px-3 py-1 text-xs font-bold text-rose-700 mb-3">
                <AlertCircle className="h-3.5 w-3.5" />
                <span>The Traditional Isolation Trap</span>
              </div>
              <h3 className="text-base sm:text-xl font-bold text-slate-900">
                Walking on Eggshells in the Dark
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Without structured insight, small hormonal triggers spiral into household misunderstandings:
              </p>
              
              <ul className="mt-4 space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="h-5 w-5 rounded-full bg-rose-200 text-rose-800 flex items-center justify-center shrink-0 font-bold text-[10px]">✕</span>
                  <span><strong>The &ldquo;What&apos;s Wrong?&rdquo; Loop:</strong> Repeated questioning makes the woman feel interrogated when she simply needs space or cooling.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-5 w-5 rounded-full bg-rose-200 text-rose-800 flex items-center justify-center shrink-0 font-bold text-[10px]">✕</span>
                  <span><strong>Toxic Positivity:</strong> Cliché advice (&ldquo;just relax&rdquo;, &ldquo;get more sleep&rdquo;) invalidates genuine neurochemical fatigue.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-5 w-5 rounded-full bg-rose-200 text-rose-800 flex items-center justify-center shrink-0 font-bold text-[10px]">✕</span>
                  <span><strong>Partner Retreat:</strong> Feeling helpless, the partner withdraws to avoid conflict, leaving the woman isolated in her symptoms.</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-rose-200/60 text-[11px] font-semibold text-rose-800">
              Outcome: Emotional distance, bedtime anxiety, and chronic resentment.
            </div>
          </div>

          {/* Card 2: The HerCompass Co-Regulation Bridge */}
          <div className="p-5 sm:p-7 rounded-3xl bg-teal-50/40 border border-teal-200/70 space-y-4 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-teal-100/80 border border-teal-200 px-3 py-1 text-xs font-bold text-teal-800 mb-3">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>The HerCompass Co-Regulation Bridge</span>
              </div>
              <h3 className="text-base sm:text-xl font-bold text-slate-900">
                Biological Clarity &amp; Actionable Support
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Objective, consented intelligence turns a source of conflict into an opportunity for intimacy:
              </p>
              
              <ul className="mt-4 space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-2.5">
                  <span className="h-5 w-5 rounded-full bg-teal-200 text-teal-800 flex items-center justify-center shrink-0 font-bold text-[10px]">✓</span>
                  <span><strong>Predictive Sunday Briefings:</strong> Partner knows when sleep was interrupted and proactively lowers the bedroom thermostat.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-5 w-5 rounded-full bg-teal-200 text-teal-800 flex items-center justify-center shrink-0 font-bold text-[10px]">✓</span>
                  <span><strong>Scripted Communication Pointers:</strong> Partner receives exact &ldquo;Say This&rdquo; phrases that de-escalate nervous system tension.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="h-5 w-5 rounded-full bg-teal-200 text-teal-800 flex items-center justify-center shrink-0 font-bold text-[10px]">✓</span>
                  <span><strong>Proactive Household Offloading:</strong> Partner handles high-friction chores without the woman having to ask or delegate.</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-teal-200/60 text-[11px] font-semibold text-teal-800">
              Outcome: Deepened trust, reduced household friction, and restored closeness.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
