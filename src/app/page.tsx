import React from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import EvidenceProof from "@/components/EvidenceProof";
import HowItWorks from "@/components/HowItWorks";
import FeatureShowcase from "@/components/FeatureShowcase";
import StoryComparison from "@/components/StoryComparison";
import PricingSection from "@/components/PricingSection";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FBFBF9] text-[#0F172A]">
      {/* Sticky Header */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1">
        {/* Redesigned Hero with Interactive Weekly Snapshot */}
        <HeroSection />

        {/* Clinical Evidence Authorities */}
        <EvidenceProof />

        {/* 3-Step Journey */}
        <HowItWorks />

        {/* Feature Deep Dive (Snapshot, Nutrition, Movement, CPS) */}
        <FeatureShowcase />

        {/* Maria's Real Story vs Traditional Confusion */}
        <StoryComparison />

        {/* Transparent Freemium & Subscription Tiers */}
        <PricingSection />

        {/* Frequently Asked Questions */}
        <FaqSection />
      </main>

      {/* Footer & Clinical Disclaimer */}
      <Footer />
    </div>
  );
}
