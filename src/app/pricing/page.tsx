import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingSection from "@/components/PricingSection";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing & Plans — HerCompassAI",
  description:
    "Flexible, transparent tiers for personalized menopause intelligence. Start free with your Personal Menopause Snapshot™, or unlock deeper pattern tracking and partner support.",
  openGraph: {
    title: "HerCompassAI — Transparent Membership Plans",
    description: "Personal intelligence, not feature restrictions. Free, Plus, and Premium tiers.",
    url: "https://hercompassai.com/pricing",
    siteName: "HerCompassAI",
    type: "website",
  },
};

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FBFBF9] text-[#0F172A]">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="relative overflow-hidden border-b border-rose-100/60 bg-gradient-to-b from-rose-50/40 via-[#FBFBF9] to-[#FBFBF9] py-16 lg:py-20 text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-200/80 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-rose-700 shadow-sm backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-rose-600" />
              <span>Personal Intelligence &bull; Transparent Tiers</span>
            </div>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Plans Built for Support, <br />
              <span className="bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Not Artificial Feature Walls.
              </span>
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Every woman receives full access to our 5-minute Personal Menopause Snapshot™ and core tracking. Upgrade when you are ready for deeper AI pattern recognition and partner empathy.
            </p>
          </div>
        </section>

        {/* Pricing Cards Component */}
        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <PricingSection />
          </div>
        </section>

        {/* Comparison Matrix */}
        <section className="border-t border-slate-200 bg-white py-16 lg:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Compare Plan Entitlements
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                A clear, server-enforced entitlement system designed around clinical trust.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="p-4 sm:p-5">Platform Feature</th>
                    <th className="p-4 sm:p-5 text-center">Free Baseline</th>
                    <th className="p-4 sm:p-5 text-center text-rose-600 bg-rose-50/50">HerCompass Plus</th>
                    <th className="p-4 sm:p-5 text-center text-purple-700 bg-purple-50/50">HerCompass Premium</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold">Personal Menopause Snapshot™</td>
                    <td className="p-4 sm:p-5 text-center text-emerald-600 font-bold">Initial Assessment</td>
                    <td className="p-4 sm:p-5 text-center bg-rose-50/20 text-emerald-600 font-bold">Monthly Updates</td>
                    <td className="p-4 sm:p-5 text-center bg-purple-50/20 text-emerald-600 font-bold">Bi-Weekly Re-Assessments</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold">Longitudinal Wellness Tracking</td>
                    <td className="p-4 sm:p-5 text-center">30-day History</td>
                    <td className="p-4 sm:p-5 text-center bg-rose-50/20 text-emerald-600 font-bold">Unlimited History</td>
                    <td className="p-4 sm:p-5 text-center bg-purple-50/20 text-emerald-600 font-bold">Unlimited History</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold">Deterministic Trend Calculations</td>
                    <td className="p-4 sm:p-5 text-center">Core Frequencies</td>
                    <td className="p-4 sm:p-5 text-center bg-rose-50/20 text-emerald-600 font-bold">Expanded Correlations</td>
                    <td className="p-4 sm:p-5 text-center bg-purple-50/20 text-emerald-600 font-bold">Advanced Multivariable Trends</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold">Partner Support & Scoped Digest</td>
                    <td className="p-4 sm:p-5 text-center text-slate-400">&mdash;</td>
                    <td className="p-4 sm:p-5 text-center bg-rose-50/20 text-emerald-600 font-bold">Weekly Digest &amp; Tips</td>
                    <td className="p-4 sm:p-5 text-center bg-purple-50/20 text-emerald-600 font-bold">Full CPS &amp; Men&apos;s Academy</td>
                  </tr>
                  <tr>
                    <td className="p-4 sm:p-5 font-semibold">Clinical Evidence & Citations</td>
                    <td className="p-4 sm:p-5 text-center text-emerald-600 font-bold">Full Transparency</td>
                    <td className="p-4 sm:p-5 text-center bg-rose-50/20 text-emerald-600 font-bold">Full Transparency</td>
                    <td className="p-4 sm:p-5 text-center bg-purple-50/20 text-emerald-600 font-bold">Full Transparency</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
