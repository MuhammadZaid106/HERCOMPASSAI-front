import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, Lock, EyeOff, Server, FileCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Security & Trust Architecture — HerCompassAI",
  description:
    "Learn about HerCompassAI\'s privacy safeguards: strict non-diagnostic boundaries, zero data sales, granular partner consent, and enterprise encryption.",
  openGraph: {
    title: "HerCompassAI — Security & Trust",
    description: "Your health and relationship data protected with clinical-grade privacy controls.",
    url: "https://hercompassai.com/security",
    siteName: "HerCompassAI",
    type: "website",
  },
};

export default function SecurityPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FBFBF9] text-[#0F172A]">
      <Navbar />
      <main className="flex-1">
        <section className="border-b border-rose-100/60 bg-gradient-to-b from-rose-50/40 to-[#FBFBF9] py-20 text-center">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase text-emerald-800 shadow-sm">
              <ShieldCheck className="h-4 w-4" />
              <span>Trust &amp; Privacy By Design</span>
            </div>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Security, Privacy &amp; Clinical Guardrails
            </h1>
            <p className="mt-4 text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
              We treat your personal wellness and relationship information with the highest standard of ethical guardianship.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "1. Zero Data Monetization",
                  desc: "We will never sell, rent, or broker your personal health, tracking, or survey responses to advertisers, pharmaceutical companies, or third parties.",
                  icon: EyeOff,
                },
                {
                  title: "2. Scoped Partner Switchboard",
                  desc: "Partners only see high-level trends that you explicitly choose to share. You can turn sharing on or off at any moment with immediate effect.",
                  icon: Lock,
                },
                {
                  title: "3. Non-Diagnostic Boundary",
                  desc: "HerCompassAI is strictly a wellness & relationship platform. We enforce automated guardrails that prevent medical diagnosis or ungrounded prescriptions.",
                  icon: FileCheck,
                },
                {
                  title: "4. End-to-End Encryption",
                  desc: "All network traffic is encrypted using TLS 1.3, and all longitudinal data at rest is protected with industry-standard cryptographic safeguards.",
                  icon: Server,
                },
              ].map((item, i) => (
                <div key={i} className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                  <item.icon className="h-8 w-8 text-emerald-600 mb-4" />
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.desc}</p>
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
