"use client";

import React, { useState } from "react";
import FeaturesHero, { FeatureCategory } from "./FeaturesHero";
import FeaturesPillarSnapshot from "./FeaturesPillarSnapshot";
import FeaturesPillarTrendEngine from "./FeaturesPillarTrendEngine";
import FeaturesPillarNutritionCooling from "./FeaturesPillarNutritionCooling";
import FeaturesPillarPartnerSupport from "./FeaturesPillarPartnerSupport";
import FeaturesPillarClinicalEvidence from "./FeaturesPillarClinicalEvidence";
import FeaturesComparisonMatrix from "./FeaturesComparisonMatrix";
import FeaturesCtaBanner from "./FeaturesCtaBanner";

export default function FeaturesPageClient() {
  const [selectedCategory, setSelectedCategory] = useState<FeatureCategory>("all");

  const showSnapshot = selectedCategory === "all" || selectedCategory === "snapshot";
  const showTrends = selectedCategory === "all" || selectedCategory === "trends";
  const showLifestyle = selectedCategory === "all" || selectedCategory === "lifestyle";
  const showPartner = selectedCategory === "all" || selectedCategory === "partner";
  const showClinical = selectedCategory === "all" || selectedCategory === "clinical";

  return (
    <div className="flex-1">
      {/* Hero Section with Interactive Category Filter */}
      <FeaturesHero
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Filter Reset Indicator if specific category selected */}
      {selectedCategory !== "all" && (
        <div className="bg-violet-50/80 border-b border-violet-100 py-3 px-4 text-center">
          <p className="text-xs text-violet-800 font-medium inline-flex items-center gap-2">
            <span>Viewing filtered pillar.</span>
            <button
              onClick={() => setSelectedCategory("all")}
              className="font-bold underline hover:text-violet-950 cursor-pointer"
            >
              Show all 6 platform pillars
            </button>
          </p>
        </div>
      )}

      {/* Pillar 01: 5-Min Baseline Snapshot */}
      {showSnapshot && <FeaturesPillarSnapshot />}

      {/* Pillar 02: Under-60s Check-in & Deterministic Trend Engine */}
      {showTrends && <FeaturesPillarTrendEngine />}

      {/* Pillar 03: Adaptive Nutrition & Cooling Protocols */}
      {showLifestyle && <FeaturesPillarNutritionCooling />}

      {/* Pillar 04: Couple & Partner Support (CPS) & Men's Academy */}
      {showPartner && <FeaturesPillarPartnerSupport />}

      {/* Pillar 05 & 06: Clinical SCI Guardrails & Workforce Intelligence */}
      {showClinical && <FeaturesPillarClinicalEvidence />}

      {/* Architectural Comparison Matrix */}
      <FeaturesComparisonMatrix />

      {/* Bottom Conversion Banner */}
      <FeaturesCtaBanner />
    </div>
  );
}
