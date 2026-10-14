import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Eye,
  Sparkles,
  Lock,
  Footprints,
  Coffee,
  Moon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Couple & Partner Support (CPS) — HerCompassAI",
  description:
    "Menopause affects more than one person. Support can too. Explore HerCompassAI\'s privacy-scoped partner digest, communication scripts, and shared routines.",
  openGraph: {
    title: "HerCompassAI — Partner Support Experience",
    description: "Actionable empathy without invading privacy. Bridging understanding between partners.",
    url: "https://hercompassai.com/partner-support",
    siteName: "HerCompassAI",
    type: "website",
  },
};

export default function PartnerSupportPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FBFBF9] text-[#0F172A]">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-rose-100/60 bg-gradient-to-b from-rose-50/40 via-[#FBFBF9] to-[#FBFBF9] py-20 lg:py-28 text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200/80 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-700 shadow-sm backdrop-blur-sm">
              <HeartHandshake className="h-4 w-4 text-rose-600" />
              <span>Couple &amp; Partner Support (CPS)</span>
            </div>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Menopause affects more than one person. <br />
              <span className="bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Support can too.
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              HerCompassAI helps partners understand what someone may be experiencing and provides practical, non-intrusive ways to offer meaningful daily support.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-rose-700"
              >
                <span>Start as a Member</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/partner/academy"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <span>Explore Partner Academy</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Four Pillars */}
        <section className="py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-xs font-bold uppercase tracking-widest text-rose-600">The Four Pillars</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                How HerCompassAI Transforms Partner Empathy
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "1. Understand",
                  desc: "Learn about biological transitions and changing sleep, temperature, or mood patterns without having to guess.",
                  icon: Eye,
                  color: "text-blue-600 bg-blue-50 border-blue-100",
                },
                {
                  title: "2. Communicate",
                  desc: "Receive conversational guidance on supportive phrasing, avoiding unhelpful comments, and validating experiences.",
                  icon: MessageCircle,
                  color: "text-purple-600 bg-purple-50 border-purple-100",
                },
                {
                  title: "3. Support",
                  desc: "Discover simple daily micro-actions: preparing a cooling bedtime tea, handling evening chores, or giving space.",
                  icon: HeartHandshake,
                  color: "text-rose-600 bg-rose-50 border-rose-100",
                },
                {
                  title: "4. Connect",
                  desc: "Participate in low-pressure shared routines like evening cooling walks and stress-regulation rituals.",
                  icon: Footprints,
                  color: "text-emerald-600 bg-emerald-50 border-emerald-100",
                },
              ].map((p, i) => (
                <div key={i} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md transition">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${p.color} mb-5`}>
                    <p.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{p.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Privacy Safeguard Callout */}
        <section className="border-y border-slate-200 bg-slate-50 py-16">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 shadow-sm flex flex-col md:flex-row items-center gap-8">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
                <Lock className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">
                  Total Privacy Control Belongs to the Member
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Partners never see raw diary notes, medical logs, or unapproved entries. The member maintains full granular consent, selecting exactly which scopes (sleep summaries, communication suggestions, or shared activity challenges) are shared. Sharing can be revoked at any instant.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
