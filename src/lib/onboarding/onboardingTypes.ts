export interface OnboardingFormValues {
  // Version & Consent
  version: string;
  consentAccepted: boolean;

  // Step 2: Demographics & Phase
  age: number | "";
  menopausePhase: "perimenopause" | "menopause" | "postmenopause" | "unsure" | "";
  hormoneTherapyStatus: "yes" | "no" | "considering" | "";
  medicalConditions: string;

  // Step 3: Intent & Primary Goals
  primaryGoals: string[];

  // Step 4: Symptoms
  primaryHealthConcerns: string[];
  symptomImpact: "not_much" | "a_little" | "moderately" | "a_lot" | "extremely" | "prefer_not_to_say" | "";

  // Step 5: Sleep & Energy
  sleepQuality: "very_good" | "good" | "mixed" | "difficult" | "very_difficult" | "prefer_not_to_say" | "";
  sleepChallenges: string[];
  energyLevel: "high" | "good" | "up_and_down" | "often_low" | "very_low" | "prefer_not_to_say" | "";
  energyPattern: "morning" | "afternoon" | "evening" | "throughout_the_day" | "varies" | "prefer_not_to_say" | "";

  // Step 6: Nutrition & Lifestyle
  dietaryPreferences: string[];
  allergies: string;
  energyAfterMealRating: number; // 1, 2, or 3
  activityLevel: "sedentary" | "light" | "moderate" | "very_active" | "";
  exercisePreferences: string[];
  weeklyExerciseMinutes: "0-30" | "30-60" | "60-90" | "90plus" | "";
  lifestyleFocus: string[];

  // Step 7: Mood & Emotional Baseline
  moodBaseline: {
    anxious: number;
    calm: number;
    irritable: number;
    sad: number;
    happy: number;
    motivated: number;
    tired: number;
  };
  moodOverall: "doing_well" | "mostly_okay" | "some_challenges" | "significant_challenges" | "prefer_not_to_say" | "";
  emotionalGoals: string[];
  meditationFrequency: "daily" | "weekly" | "rarely" | "never" | "";

  // Step 8: Signature Priority Goal
  primaryGoal: string;

  // Step 9: AI Preferences & Partner Connection (CPS)
  dailyCheckinOptIn: boolean;
  preferredRecommendations: string[];
  partnerSupportInterest: "yes" | "maybe" | "not_now" | "not_interested" | "no_partner" | "prefer_not_to_say" | "";
  partnerEmail: string;
  partnerConsent: boolean;
  partnerSharingScopes: string[];
}

export interface DeterministicMetrics {
  symptomBurdenScore: number;
  sleepDisturbanceScore: number;
  vitalityIndex: number;
  emotionalBalanceScore: number;
  dominantFocusArea: string;
  calculatedAt?: string;
}

export interface SnapshotObservation {
  id: number;
  pillar: string;
  title: string;
  summary?: string;
  score?: number;
  impact?: string;
  evidenceNote?: string;
  vitalityIndex?: number;
  preferences?: string[];
  recommendations?: Array<{ action: string; why: string; category: string }>;
  action?: string;
  status?: string;
}

export interface PersonalSnapshotData {
  member: {
    name: string;
    plan: string;
  };
  completedAt: string;
  version: string;
  deterministicMetrics: DeterministicMetrics;
  observations: SnapshotObservation[];
  safetyNotice: string;
}
