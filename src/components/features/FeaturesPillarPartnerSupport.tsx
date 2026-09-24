"use client";

import React, { useState } from "react";
import {
  HeartHandshake,
  ShieldCheck,
  Lock,
  Eye,
  CheckCircle2,
  BookOpen,
  MessageSquare,
  Sparkles,
  AlertCircle,
  ToggleRight,
  ToggleLeft,
} from "lucide-react";

export default function FeaturesPillarPartnerSupport() {
  const [viewMode, setViewMode] = useState<"member" | "partner">("partner");
  const [sharingSleep, setSharingSleep] = useState(true);
  const [sharingVasomotor, setSharingVasomotor] = useState(true);

  return (
    <section id="partner" className="py-12 sm:py-16 lg:py-24 bg-[#FAF9F6] border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 mb-3">
            <span>Pillar 04 — Couple &amp; Partner Support (CPS)</span>
          </div>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Menopause is a Shared Journey. Privacy is Non-Negotiable.
          </h2>
          <p className="mt-2.5 sm:mt-4 text-xs sm:text-base text-slate-600 leading-relaxed">
            Partners want to help, but often feel helpless or say the wrong thing. HerCompassAI provides partners with
            clarity and communication guidance—without ever violating the woman&apos;s privacy.
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          
          {/* Left Column: Architectural Privacy Principles */}
          <div className="lg:col-span-6 space-y-3.5 sm:space-y-5">
            
            {/* Guarantee 1 */}
            <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-rose-100 text-rose-600 font-bold shrink-0">
                  <Lock className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Zero Raw Medical Log Exposure</h4>
                  <span className="text-[10px] sm:text-[11px] text-slate-500">Strict Data Boundary</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-9 sm:pl-10.5">
                Partners never see raw menstrual dates, exact severity logs, or personal journaling notes. The platform distills consented signals into actionable household guidance.
              </p>
            </div>

            {/* Guarantee 2 */}
            <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-violet-100 text-violet-700 font-bold shrink-0">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Member-Controlled Scoped Consent</h4>
                  <span className="text-[10px] sm:text-[11px] text-slate-500">Granular &amp; Instant Revocation</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-9 sm:pl-10.5">
                You decide exactly what is included in the weekly digest. You can pause or revoke partner access at any moment with a single click.
              </p>
            </div>

            {/* Guarantee 3: Men's Academy */}
            <div className="p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 font-bold shrink-0">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">The Men&apos;s Academy Curriculum</h4>
                  <span className="text-[10px] sm:text-[11px] text-slate-500">Bite-sized empathy education</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-9 sm:pl-10.5">
                Practical 3-minute audio micro-lessons for male partners covering vasomotor biology, emotional bandwidth, avoiding toxic positivity, and supportive co-regulation.
              </p>
            </div>

          </div>

          {/* Right Column: Interactive View Comparison Toggle */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 lg:p-7 shadow-xl shadow-slate-200/60">
              
              {/* Perspective Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-violet-700">
                    Scoped Consent Demonstration
                  </span>
                  <p className="text-xs text-slate-500">Toggle between viewpoints to see privacy in action</p>
                </div>
                <div className="flex items-center p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setViewMode("member")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      viewMode === "member"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Member&apos;s Private View
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("partner")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      viewMode === "partner"
                        ? "bg-violet-600 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Partner&apos;s Digest View
                  </button>
                </div>
              </div>

              {/* View 1: Member Private View */}
              {viewMode === "member" && (
                <div className="mt-5 space-y-3 animate-in fade-in-50 duration-200">
                  <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200 text-xs flex items-center justify-between">
                    <span className="font-semibold text-rose-800 flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-rose-600" />
                      <span>Confidential Health Log (End-to-End Encrypted)</span>
                    </span>
                    <span className="text-[10px] font-bold text-rose-700 bg-white px-2 py-0.5 rounded-full border border-rose-200">
                      Never Shared
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-500">
                      <span>Diary Entry: Tuesday 11:20 PM</span>
                      <span className="font-mono text-[10px]">Private</span>
                    </div>
                    <p className="text-slate-800 italic leading-relaxed">
                      &ldquo;Woke up drenched in sweat at 2:30 AM again. Felt completely overwhelmed at work during the executive review. Need quiet tonight.&rdquo;
                    </p>
                    <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Vasomotor severity: <strong>Severe (8/10)</strong></span>
                      <span className="text-slate-500">Sleep efficiency: <strong>62%</strong></span>
                    </div>
                  </div>

                  {/* Scoped Sharing Toggles */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <span className="font-bold text-slate-900 block">Manage What Goes to the Partner Digest</span>
                    
                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-700">Share Sleep Quality Summary</span>
                      <button
                        type="button"
                        onClick={() => setSharingSleep(!sharingSleep)}
                        className="text-violet-600"
                      >
                        {sharingSleep ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5 text-slate-400" />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-700">Share Vasomotor Heat Forecast</span>
                      <button
                        type="button"
                        onClick={() => setSharingVasomotor(!sharingVasomotor)}
                        className="text-violet-600"
                      >
                        {sharingVasomotor ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5 text-slate-400" />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-1 text-slate-400">
                      <span>Raw Diary &amp; Clinical Notes</span>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                        Locked / Never
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* View 2: Partner Consented Digest View */}
              {viewMode === "partner" && (
                <div className="mt-5 space-y-3 animate-in fade-in-50 duration-200">
                  <div className="p-3.5 rounded-2xl bg-violet-50/80 border border-violet-200 text-xs flex items-center justify-between">
                    <span className="font-semibold text-violet-900 flex items-center gap-1.5">
                      <HeartHandshake className="h-3.5 w-3.5 text-violet-600" />
                      <span>Weekly Consented Digest: Maria&apos;s Partner</span>
                    </span>
                    <span className="text-[10px] font-bold text-violet-700 bg-white px-2 py-0.5 rounded-full border border-violet-200">
                      Actionable &amp; Safe
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                    {/* Action 1 */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        What to prepare tonight
                      </span>
                      <p className="text-xs font-semibold text-slate-800">
                        Dinner suggestion: Salmon with edamame &amp; steamed greens (high magnesium &amp; omega-3s to support cooling).
                      </p>
                    </div>

                    {/* Action 2 */}
                    <div className="space-y-1 pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                        Communication guidance
                      </span>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        Her fatigue is elevated after poor sleep. Avoid asking &ldquo;What&apos;s for dinner?&rdquo; Instead, offer: <em>&ldquo;I&apos;ve got dinner taken care of. Would you like a quiet walk or some alone time?&rdquo;</em>
                      </p>
                    </div>

                    {/* Action 3: Men's Academy recommendation */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-violet-600" />
                        <span className="font-medium text-slate-800">Men&apos;s Academy: Lesson 4 (Avoiding the &ldquo;Fix-It&rdquo; Trap)</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">3 min</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
