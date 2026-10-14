import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, Heart, Sparkles, Compass, CheckCircle2, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us & Our Mission — HerCompassAI",
  description:
    "HerCompassAI is not another generic menopause blog. We are an evidence-backed relationship & personal intelligence platform built for women and their partners.",
  openGraph: {
    title: "About HerCompassAI",
    description: "Our mission, clinical approach, and vision for menopause intelligence.",
    url: "https://hercompassai.com/about",
    siteName: "HerCompassAI",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FBFBF9] text-[#0F172A]">
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-rose-100/60 bg-gradient-to-b from-rose-50/40 to-[#FBFBF9] py-20 lg:py-28 text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase text-rose-700 shadow-sm">
              <Compass className="h-4 w-4" />
              <span>Our Vision</span>
            </div>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Transforming the Menopause Journey <br />
              <span className="bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Into Clarity &amp; Connection.
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              We built HerCompassAI because women deserve better than fragmented internet advice and ungrounded AI guesses. We combine deterministic trend science, peer-reviewed clinical guidelines, and privacy-first partner empathy.
            </p>
          </div>
        </section>

        <section className="py-20 lg:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">Why HerCompassAI Exists</h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  More than 1 billion women worldwide will be navigating perimenopause and menopause by 2030. Yet the status quo forces women to endure unverified forum tips, dismissive clinical experiences, and strained relationship dynamics.
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  HerCompassAI is built around the fundamental truth that menopause changes physiology, sleep, and emotional rhythm—and that understanding these patterns brings predictability back to daily life.
                </p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm space-y-4">
                <h3 className="font-bold text-slate-900">The 3 Core Commitments</h3>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Deterministic Software:</strong> Calculations, trends, and frequencies are calculated by exact software code, never hallucinated.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Clinical Evidence:</strong> All insights reference gold-standard guidance from NAMS, ACOG, WHO, and NIH.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Partner Empathy:</strong> Bringing partners into the loop with actionable support without compromising member privacy.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
