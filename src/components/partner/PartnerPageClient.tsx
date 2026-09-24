"use client";

import React, { useState } from "react";
import PartnerHero from "./PartnerHero";
import PartnerPhilosophy from "./PartnerPhilosophy";
import PartnerDigestSimulator from "./PartnerDigestSimulator";
import PartnerAcademyHub from "./PartnerAcademyHub";
import PartnerConsentSwitchboard from "./PartnerConsentSwitchboard";
import PartnerChallengeCards from "./PartnerChallengeCards";
import PartnerFaq from "./PartnerFaq";
import PartnerCta from "./PartnerCta";

export default function PartnerPageClient() {
  const [activeSection, setActiveSection] = useState<string>("philosophy");

  const handleSelectSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-full">
      {/* 1. Hero with Empathy Focus & Jump Links */}
      <PartnerHero
        activeSection={activeSection}
        onSelectSection={handleSelectSection}
      />

      {/* 2. The Problem & Why: Ending Walking on Eggshells */}
      <PartnerPhilosophy />

      {/* 3. The Sunday Partner Digest Interactive Simulator */}
      <PartnerDigestSimulator />

      {/* 4. The Men's Academy 3-Minute Audio Curriculum Hub */}
      <PartnerAcademyHub />

      {/* 5. Member Privacy & Scoped Consent Switchboard */}
      <PartnerConsentSwitchboard />

      {/* 6. Weekly Couple Challenges & Co-Regulation Habits */}
      <PartnerChallengeCards />

      {/* 7. Couples & Privacy FAQ Accordion */}
      <PartnerFaq />

      {/* 8. Conversion CTA Banner */}
      <PartnerCta />
    </div>
  );
}
