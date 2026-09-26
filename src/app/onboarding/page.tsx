import type { Metadata } from "next";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

export const metadata: Metadata = {
  title: "5-Min Personal Menopause Snapshot™ — HerCompassAI",
  description:
    "Answer a few friendly questions about what you are experiencing. Synthesize your personalized 8-part Baseline Snapshot with evidence-informed next steps.",
};

export default function OnboardingPage() {
  return <OnboardingWizard />;
}
