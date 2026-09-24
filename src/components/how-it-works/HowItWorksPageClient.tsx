"use client";

import React, { useState } from "react";
import HowItWorksHero from "./HowItWorksHero";
import HowItWorksStep1Snapshot from "./HowItWorksStep1Snapshot";
import HowItWorksStep2CheckIn from "./HowItWorksStep2CheckIn";
import HowItWorksStep3PartnerDigest from "./HowItWorksStep3PartnerDigest";
import HowItWorksArchitecture from "./HowItWorksArchitecture";
import HowItWorksPrivacyFlow from "./HowItWorksPrivacyFlow";
import HowItWorksUserJourney from "./HowItWorksUserJourney";
import HowItWorksCta from "./HowItWorksCta";

export default function HowItWorksPageClient() {
  const [activeSection, setActiveSection] = useState<string>("step-1");

  const handleSelectSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-full">
      {/* 1. Hero with Jump Links */}
      <HowItWorksHero
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
      />

      {/* 2. Step 1: 5-Minute Baseline Snapshot */}
      <HowItWorksStep1Snapshot />

      {/* 3. Step 2: Under-60s Daily Check-In */}
      <HowItWorksStep2CheckIn />

      {/* 4. Step 3: Consented Partner Digest & Co-Regulation */}
      <HowItWorksStep3PartnerDigest />

      {/* 5. Under the Hood: Deterministic vs AI & SCI™ Pipeline */}
      <HowItWorksArchitecture />

      {/* 6. Zero-Knowledge Privacy Architecture & Consent Lifecycle */}
      <HowItWorksPrivacyFlow />

      {/* 7. Real-world Couple Journey (Maria & David 30-Day Timeline) */}
      <HowItWorksUserJourney />

      {/* 8. Conversion CTA Banner */}
      <HowItWorksCta />
    </div>
  );
}
