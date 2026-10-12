import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Compass,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Men\'s Academy — HerCompassAI",
  description:
    "Understand More. Support Better. A clinical, empathy-driven curriculum designed for male partners navigating perimenopause and menopause alongside their partners.",
  openGraph: {
    title: "HerCompassAI — Men\'s Academy",
    description: "Actionable guidance and lessons for partners. Menopause 101, communication, and support.",
    url: "https://hercompassai.com/mens-academy",
    siteName: "HerCompassAI",
    type: "website",
  },
};

export default function MensAcademyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FBFBF9] text-[#0F172A]">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-rose-100/60 bg-gradient-to-b from-rose-50/40 via-[#FBFBF9] to-[#FBFBF9] py-20 lg:py-28 text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-200/80 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-purple-700 shadow-sm backdrop-blur-sm">
              <Compass className="h-4 w-4 text-purple-600" />
              <span>Partner Education &amp; Empathy</span>
            </div>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Understand More. <br />
              <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-rose-600 bg-clip-text text-transparent">
                Support Better.
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Most men want to support their partner during menopause, but don&apos;t know what she&apos;s experiencing or what to do. Men&apos;s Academy replaces confusion with clarity and actionable behavioral steps.
            </p>
            <div className="mt-8 flex justify-center">
              <Link
                href="/partner/academy"
                className="inline-flex items-center gap-2 rounded-xl bg-purple-700 px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-purple-800"
              >
                <span>Enter Academy Lessons</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Curriculum Preview */}
        <section className="py-20 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-xs font-bold uppercase tracking-widest text-purple-600">The Curriculum</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Bite-Sized, Practical Lessons
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  mod: "Module 1",
                  title: "Menopause 101",
                  desc: "What is biologically happening with estrogen, progesterone, and body temperature. Dismantling the myths.",
                },
                {
                  mod: "Module 2",
                  title: "Mood & Brain Fog",
                  desc: "Why irritability or forgetfulness occurs and how to avoid taking emotional turbulence personally.",
                },
                {
                  mod: "Module 3",
                  title: "Sleep & Night Sweats",
                  desc: "Understanding sleep architecture disruption and creating a sleep-promoting cooling bedroom environment.",
                },
                {
                  mod: "Module 4",
                  title: "Communication Mastery",
                  desc: "Conversational frameworks that de-escalate tension and replace defensiveness with genuine presence.",
                },
                {
                  mod: "Module 5",
                  title: "Intimacy & Relationship Changes",
                  desc: "Navigating physical comfort, emotional safety, and reigniting intimacy with patience and care.",
                },
                {
                  mod: "Module 6",
                  title: "Shared Couple Routines",
                  desc: "Weekly shared activities like walks, balanced meals, and wind-down rituals to co-regulate together.",
                },
              ].map((m, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm hover:shadow-md transition">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-600">{m.mod}</span>
                  <h3 className="mt-2 text-lg font-bold text-slate-900">{m.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* "Do This, Not That" Interactive Component */}
        <section className="border-t border-slate-200 bg-slate-50 py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-xs font-bold uppercase tracking-widest text-purple-600">Practical Scenarios</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">What to Say vs. What to Avoid</p>
            </div>

            <div className="space-y-6">
              {[
                {
                  scenario: "She mentions feeling overwhelmed and exhausted after work.",
                  avoid: "\"Are you sure it\'s not just in your head or stress?\"",
                  tryThis: "\"I hear you. Dinner is taken care of tonight—would you like to rest, or would you like to talk about it?\"",
                },
                {
                  scenario: "She wakes up at 2:00 AM drenched in sweat and irritable.",
                  avoid: "\"Can\'t you just go back to sleep? You\'re keeping me awake.\"",
                  tryThis: "\"Let me grab you a glass of ice water and a fresh towel. Take all the time you need.\"",
                },
                {
                  scenario: "She feels self-conscious about physical bodily changes.",
                  avoid: "\"You should just try going on a strict diet.\"",
                  tryThis: "\"Your body is doing a lot right now and I admire your strength. I love you exactly as you are.\"",
                },
              ].map((item, i) => (
                <div key={i} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
                  <h3 className="text-base font-bold text-slate-900 mb-4">Scenario: {item.scenario}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="rounded-xl bg-red-50/70 border border-red-100 p-4">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase text-red-700 mb-1">
                        <XCircle className="h-4 w-4" />
                        <span>Avoid Saying</span>
                      </div>
                      <p className="text-xs text-red-900 italic">{item.avoid}</p>
                    </div>
                    <div className="rounded-xl bg-emerald-50/70 border border-emerald-100 p-4">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase text-emerald-700 mb-1">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Try Saying Instead</span>
                      </div>
                      <p className="text-xs text-emerald-900 italic font-medium">{item.tryThis}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
