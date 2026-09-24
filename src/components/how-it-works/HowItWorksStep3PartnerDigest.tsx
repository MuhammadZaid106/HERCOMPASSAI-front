"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HeartHandshake,
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  Headphones,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  BookOpen,
  MessageCircle,
} from "lucide-react";

export default function HowItWorksStep3PartnerDigest() {
  const [activeTab, setActiveTab] = useState<"partner-view" | "member-controls">("partner-view");
  const [shareSleep, setShareSleep] = useState<boolean>(true);
  const [shareVasomotor, setShareVasomotor] = useState<boolean>(true);
  const [shareWorkload, setShareWorkload] = useState<boolean>(false);

  return (
    <section id="step-3" className="py-12 sm:py-16 lg:py-24 bg-white border-b border-slate-200/80">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        
        {/* Step Badge & Header */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3.5 py-1 text-xs font-semibold text-teal-700 mb-3">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white">3</span>
            <span>Step 03 — Consented Partner Digest &amp; Men&apos;s Academy</span>
          </div>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Stop Having Exhausting Conversations. Let AI Bridge the Empathy Gap.
          </h2>
          <p className="mt-2.5 sm:mt-4 text-xs sm:text-base text-slate-600 leading-relaxed">
            Menopause is a shared journey, but raw health data should remain private. HerCompassAI synthesizes your weekly
            signals into clear, actionable empathy advice for your partner—delivered every Sunday morning without awkward friction.
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          
          {/* Left Column: Why This Changes Relationships */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-5">
            
            {/* The Old Way vs The HerCompass Way */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                The Relational Friction Problem
              </span>
              <div className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 font-bold text-[10px]">✕</div>
                  <p><strong>The Traditional Trap:</strong> The partner notices tension, asks &ldquo;Are you okay?&rdquo;, offers generic advice, or retreats into silence to avoid conflict.</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-5 w-5 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 font-bold text-[10px]">✓</div>
                  <p><strong>The HerCompassAI Loop:</strong> Partner receives an objective Sunday briefing explaining hormone-driven bandwidth, coupled with exact communication tips.</p>
                </div>
              </div>
            </div>

            {/* The Men's Academy Syllabus Preview */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Headphones className="h-4 w-4 text-teal-600" />
                  <span>The Men&apos;s Academy Micro-Lessons</span>
                </h4>
                <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                  3 Min Each
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Male partners don&apos;t read medical textbooks. They listen to high-impact 3-minute audio briefings on their morning commute:
              </p>
              <ul className="space-y-1.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                  <span>Ep 04: The Thermostat Myth &amp; Vasomotor Biology</span>
                </li>
                <li className="flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                  <span>Ep 09: Why &ldquo;Cheer Up&rdquo; Triggers Fight-or-Flight</span>
                </li>
                <li className="flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                  <span>Ep 14: Practical Bedroom Cooling &amp; Sleep Co-Regulation</span>
                </li>
              </ul>
            </div>

            {/* Partner Invitation Button */}
            <div className="pt-1">
              <Link
                href="/register?type=couple"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-teal-500/20 hover:bg-teal-500 active:scale-[0.98] transition-all cursor-pointer"
              >
                <HeartHandshake className="h-4 w-4 shrink-0" />
                <span>Invite Partner with 1-Click Link</span>
              </Link>
            </div>

          </div>

          {/* Right Column: Interactive Digest / Consent Switcher */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-4 sm:p-6 lg:p-7 shadow-xl shadow-slate-200/50">
              
              {/* Tab Selector */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                  <button
                    onClick={() => setActiveTab("partner-view")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === "partner-view"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Sunday Partner Digest
                  </button>
                  <button
                    onClick={() => setActiveTab("member-controls")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      activeTab === "member-controls"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Member Consent Controls
                  </button>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full">
                  <Lock className="h-3 w-3" />
                  <span>Scoped Consent Active</span>
                </div>
              </div>

              {/* Tab 1: Partner View */}
              {activeTab === "partner-view" ? (
                <div className="mt-5 space-y-4 animate-in fade-in duration-300">
                  
                  {/* Digest Header */}
                  <div className="p-4 rounded-2xl bg-linear-to-r from-teal-500/10 via-indigo-500/10 to-transparent border border-teal-200/60">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-teal-900">Partner Weekly Briefing</span>
                      <span className="text-slate-500 text-[11px]">Sunday, 08:00 AM</span>
                    </div>
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                      Summary for David: Navigating Sarah&apos;s Week Ahead
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Based on consented longitudinal signals. No raw logs or private notes are exposed.
                    </p>
                  </div>

                  {/* High-Level Status (Consented signals only) */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wide block">Rest Quality</span>
                      <span className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 block">
                        Interrupted (Night Awakenings)
                      </span>
                      <span className="text-[11px] text-amber-600 font-medium">Extra rest needed mornings</span>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] text-slate-400 uppercase tracking-wide block">Recommended Role</span>
                      <span className="text-xs sm:text-sm font-bold text-teal-700 mt-0.5 block">
                        Active Friction Reducer
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">Handle dinners Thu/Fri</span>
                    </div>
                  </div>

                  {/* Concrete Empathy Guide */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2.5">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-violet-600" />
                      <h5 className="text-xs sm:text-sm font-bold text-slate-900">Recommended Conversation Approach</h5>
                    </div>
                    <div className="p-3 rounded-xl bg-violet-50/70 border border-violet-100 text-xs space-y-1.5">
                      <div className="text-violet-950 font-semibold flex items-center gap-1.5">
                        <span className="text-[10px] bg-violet-200 text-violet-800 px-1.5 py-0.5 rounded font-bold">SAY THIS</span>
                        <span>&ldquo;I notice you had interrupted sleep. I&apos;ve got dinner covered tonight—no rush on anything.&rdquo;</span>
                      </div>
                      <div className="text-rose-950/80 font-medium flex items-center gap-1.5 pt-1 border-t border-violet-200/50">
                        <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-bold">AVOID THIS</span>
                        <span>&ldquo;Are you tired because of your hormones again? You should just sleep earlier.&rdquo;</span>
                      </div>
                    </div>
                  </div>

                  {/* Men's Academy Assigned Audio Lesson */}
                  <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center shrink-0">
                        <Headphones className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">This Week&apos;s 3-Min Lesson</div>
                        <div className="text-[11px] text-slate-300">Ep 06: How Estrogen Fluctuations Impact Autonomic Anxiety</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-teal-400 bg-teal-950/80 border border-teal-800/80 px-2.5 py-1 rounded-lg shrink-0">
                      Play (3:15)
                    </span>
                  </div>

                </div>
              ) : (
                /* Tab 2: Member Scoped Controls */
                <div className="mt-5 space-y-4 animate-in fade-in duration-300">
                  <div className="p-3.5 rounded-2xl bg-violet-50 border border-violet-100 text-xs text-violet-900 leading-relaxed">
                    <strong>Complete Privacy Sovereignty:</strong> You decide precisely what domains are distilled into your partner&apos;s Sunday digest. You can pause or revoke access at any second.
                  </div>

                  <div className="space-y-2.5">
                    {/* Control 1 */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900">Sleep Score &amp; Rest Status</div>
                        <div className="text-[11px] text-slate-500">Allows partner to see sleep trend and morning rest bandwidth</div>
                      </div>
                      <button
                        onClick={() => setShareSleep(!shareSleep)}
                        className={`h-6 w-11 rounded-full transition-colors relative cursor-pointer ${
                          shareSleep ? "bg-teal-600" : "bg-slate-300"
                        }`}
                      >
                        <div className={`h-4 w-4 rounded-full bg-white transition-transform ${
                          shareSleep ? "translate-x-6" : "translate-x-1"
                        }`} />
                      </button>
                    </div>

                    {/* Control 2 */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900">Vasomotor Cooling Guidance</div>
                        <div className="text-[11px] text-slate-500">Provides tips on bedroom temperature and night cooling support</div>
                      </div>
                      <button
                        onClick={() => setShareVasomotor(!shareVasomotor)}
                        className={`h-6 w-11 rounded-full transition-colors relative cursor-pointer ${
                          shareVasomotor ? "bg-teal-600" : "bg-slate-300"
                        }`}
                      >
                        <div className={`h-4 w-4 rounded-full bg-white transition-transform ${
                          shareVasomotor ? "translate-x-6" : "translate-x-1"
                        }`} />
                      </button>
                    </div>

                    {/* Control 3 */}
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-900">Career &amp; Executive Load Signals</div>
                        <div className="text-[11px] text-slate-500">Signals high cognitive fatigue weeks without sharing details</div>
                      </div>
                      <button
                        onClick={() => setShareWorkload(!shareWorkload)}
                        className={`h-6 w-11 rounded-full transition-colors relative cursor-pointer ${
                          shareWorkload ? "bg-teal-600" : "bg-slate-300"
                        }`}
                      >
                        <div className={`h-4 w-4 rounded-full bg-white transition-transform ${
                          shareWorkload ? "translate-x-6" : "translate-x-1"
                        }`} />
                      </button>
                    </div>
                  </div>

                  {/* Absolute Guarantee */}
                  <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 flex items-center gap-2 text-xs text-slate-600">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>Raw diary entries, personal notes, and intimate dates can never be shared under any setting.</span>
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
