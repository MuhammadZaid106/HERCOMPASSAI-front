"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export default function TrialPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FBFBF9] text-[#0F172A]">
      <Navbar />
      <main className="flex-1 py-16 lg:py-24 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-purple-700 shadow-sm mb-6">
            <Sparkles className="h-4 w-4" />
            <span>14-Day Premium Trial</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            You&apos;ve experienced your Snapshot. <br />
            <span className="bg-gradient-to-r from-purple-600 via-rose-600 to-indigo-600 bg-clip-text text-transparent">
              Ready to go deeper?
            </span>
          </h1>

          <p className="mt-6 text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
            Experience 14 days of unrestricted access to advanced pattern intelligence, personalized cooling meal plans, and partner support modules.
          </p>

          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-left max-w-lg mx-auto space-y-4">
            <div className="flex items-center gap-3 text-xs text-slate-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Zero commitment &bull; cancel anytime</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Full access to Couple &amp; Partner Support (CPS)</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-700">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Men&apos;s Academy bite-sized lessons &amp; scripts</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/upgrade"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-purple-700 transition"
            >
              <span>Start Premium Trial</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/app"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-8 py-3.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
            >
              <span>Keep Exploring Free</span>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
