import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeaturesPageClient from "@/components/features/FeaturesPageClient";

export const metadata: Metadata = {
  title: "Platform Features & Architecture — HerCompassAI",
  description:
    "Explore the six architectural pillars of HerCompassAI: 5-minute Baseline Snapshot, Deterministic Trend Engine, Adaptive Nutrition Radar, Couple & Partner Support (CPS), and Clinical SCI™ Guardrails.",
  openGraph: {
    title: "HerCompassAI — Features & Platform Architecture",
    description:
      "A relationship-centered menopause wellness platform combining clinician-backed guidance, deterministic calculation, and privacy-first partner empathy.",
    url: "https://hercompassai.com/features",
    siteName: "HerCompassAI",
    type: "website",
  },
};

export default function FeaturesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FBFBF9] text-[#0F172A]">
      {/* Sticky Header */}
      <Navbar />

      {/* Main Feature Content */}
      <main className="flex-1">
        <FeaturesPageClient />
      </main>

      {/* Footer & Clinical Disclaimer */}
      <Footer />
    </div>
  );
}
