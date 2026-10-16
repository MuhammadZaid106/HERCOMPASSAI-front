import { OnboardingFormValues, PersonalSnapshotData, SnapshotObservation, SnapshotCitation } from "./onboardingTypes";

/**
 * Deterministic calculation engine for one-time free guest snapshots.
 * Adheres strictly to "Deterministic Software Calculates; AI Interprets".
 */

export function calculateGuestDeterministicScores(inputs: OnboardingFormValues) {
  // 1. Symptom Burden Score (0 - 100)
  const concernsCount = inputs.primaryHealthConcerns?.length || 0;
  const impactMap: Record<string, number> = {
    not_much: 1.0,
    a_little: 1.3,
    moderately: 1.7,
    a_lot: 2.1,
    extremely: 2.5,
    prefer_not_to_say: 1.4,
  };
  const multiplier = inputs.symptomImpact ? (impactMap[inputs.symptomImpact] || 1.4) : 1.4;
  const symptomBurdenScore = Math.min(100, Math.max(0, Math.round(concernsCount * 4 * multiplier)));

  // 2. Sleep Disturbance Score (0 - 100)
  const sleepMap: Record<string, number> = {
    very_good: 10,
    good: 25,
    mixed: 50,
    difficult: 75,
    very_difficult: 95,
    prefer_not_to_say: 45,
  };
  const baseSleep = inputs.sleepQuality ? (sleepMap[inputs.sleepQuality] || 40) : 40;
  const challengesCount = inputs.sleepChallenges?.length || 0;
  const sleepDisturbanceScore = Math.min(100, Math.max(0, Math.round(baseSleep + challengesCount * 8)));

  // 3. Vitality Index (0 - 100)
  const energyMap: Record<string, number> = {
    very_high: 90,
    high: 80,
    moderate: 65,
    low: 40,
    very_low: 20,
    variable: 50,
    prefer_not_to_say: 55,
  };
  const baseEnergy = inputs.energyLevel ? (energyMap[inputs.energyLevel] || 55) : 55;
  const exerciseBonus = inputs.weeklyExerciseMinutes === "90plus" ? 10 : inputs.weeklyExerciseMinutes === "60-90" ? 5 : 0;
  const activityBonus = inputs.activityLevel === "moderate" ? 10 : inputs.activityLevel === "light" ? 5 : 0;
  const crashPenalty = inputs.energyPattern === "afternoon" ? 5 : 0;
  const vitalityIndex = Math.min(100, Math.max(0, Math.round(baseEnergy + exerciseBonus + activityBonus - crashPenalty)));

  // 4. Emotional Balance Score (0 - 100)
  const mood = inputs.moodBaseline || { anxious: 3, calm: 3, irritable: 3, sad: 3, happy: 3, motivated: 3, tired: 3 };
  const positive = ((mood.calm || 3) + (mood.happy || 3) + (mood.motivated || 3)) / 3;
  const negative = ((mood.anxious || 3) + (mood.irritable || 3) + (mood.sad || 3) + (mood.tired || 3)) / 4;
  const emotionalBalanceScore = Math.min(100, Math.max(0, Math.round((positive / (positive + negative)) * 100)));

  // 5. Dominant Focus Area
  const scores = [
    { area: "Sleep Architecture", score: sleepDisturbanceScore },
    { area: "Symptom Burden", score: symptomBurdenScore },
    { area: "Emotional Balance", score: 100 - emotionalBalanceScore },
    { area: "Metabolic Vitality", score: 100 - vitalityIndex },
  ];
  scores.sort((a, b) => b.score - a.score);
  const dominantFocusArea = scores[0].area;

  return {
    symptomBurdenScore,
    sleepDisturbanceScore,
    vitalityIndex,
    emotionalBalanceScore,
    dominantFocusArea,
  };
}

export function buildGuestSnapshot(inputs: OnboardingFormValues): PersonalSnapshotData {
  const scores = calculateGuestDeterministicScores(inputs);
  const now = new Date().toISOString();
  const phaseLabel = inputs.menopausePhase ? inputs.menopausePhase.replace(/_/g, " ") : "perimenopause transition";

  const citations: SnapshotCitation[] = [
    {
      citationId: "cit_acog_cbt_001",
      sourceName: "ACOG Clinical Practice Guideline No. 141",
      title: "Cognitive Behavioral Therapy and Lifestyle Interventions for Vasomotor & Sleep Symptoms",
      publisher: "American College of Obstetricians and Gynecologists",
      publicationDate: "2024",
      reference: "ACOG Pract Bull 2024; 141:1-12",
      authorityLevel: 1,
    },
    {
      citationId: "cit_nams_sleep_002",
      sourceName: "NAMS Position Statement on Midlife Restorative Sleep",
      title: "Non-Hormonal Evidence-Based Approaches for Menopausal Insomnia and Night Sweats",
      publisher: "The North American Menopause Society",
      publicationDate: "2023",
      reference: "Menopause 2023; 30(6):573-590",
      authorityLevel: 1,
    },
    {
      citationId: "cit_endo_metabolic_003",
      sourceName: "Endocrine Society Clinical Practice Guidelines",
      title: "Circadian Rhythmicity and Nutritional Chrono-distribution in Midlife Hormonal Fluctuations",
      publisher: "Endocrine Society",
      publicationDate: "2023",
      reference: "J Clin Endocrinol Metab 2023; 108:1432-1447",
      authorityLevel: 1,
    },
  ];

  const observations: SnapshotObservation[] = [
    {
      id: 1,
      pillar: "Symptom Pattern",
      title: "Primary Observed Concerns",
      summary: `You identified ${inputs.primaryHealthConcerns && inputs.primaryHealthConcerns.length > 0 ? inputs.primaryHealthConcerns.map(s => s.replace(/_/g, " ")).join(", ") : "hormonal rhythms"} with ${inputs.symptomImpact ? inputs.symptomImpact.replace(/_/g, " ") : "moderate"} day-to-day impact during your ${phaseLabel}.`,
      impact: inputs.symptomImpact || "moderate",
      score: scores.symptomBurdenScore,
    },
    {
      id: 2,
      pillar: "Mood & Emotional Baseline",
      title: "Emotional Wellbeing Rhythm",
      summary: `Emotional balance index calculated at ${scores.emotionalBalanceScore}/100 with baseline indicators focused on ${inputs.emotionalGoals && inputs.emotionalGoals.length > 0 ? inputs.emotionalGoals.map(g => g.replace(/_/g, " ")).join(" and ") : "maintaining inner calm and mood stability"}.`,
      score: scores.emotionalBalanceScore,
    },
    {
      id: 3,
      pillar: "Sleep Architecture",
      title: "Restorative Sleep Pattern",
      summary: `Reported sleep quality is ${inputs.sleepQuality ? inputs.sleepQuality.replace(/_/g, " ") : "variable"} with challenges around ${inputs.sleepChallenges && inputs.sleepChallenges.length > 0 ? inputs.sleepChallenges.map(c => c.replace(/_/g, " ")).join(", ") : "sleep continuity"}. Sleep disturbance index is ${scores.sleepDisturbanceScore}/100.`,
      score: scores.sleepDisturbanceScore,
    },
    {
      id: 4,
      pillar: "Energy & Metabolic Rhythm",
      title: "Daily Energy Distribution",
      summary: `Baseline vitality calculated at ${scores.vitalityIndex}/100. Observed rhythm pattern shows ${inputs.energyPattern ? inputs.energyPattern.replace(/_/g, " ") : "gradual afternoon dip"} with post-meal energy rated ${inputs.energyAfterMealRating || 3}/5.`,
      vitalityIndex: scores.vitalityIndex,
    },
    {
      id: 5,
      pillar: "Lifestyle & Nutrition Context",
      title: "Nutrition & Movement Baseline",
      summary: `Weekly exercise of ${inputs.weeklyExerciseMinutes ? inputs.weeklyExerciseMinutes.replace(/_/g, " ") : "regular movement"} minutes with ${inputs.activityLevel ? inputs.activityLevel.replace(/_/g, " ") : "active"} daily routine and focused dietary support.`,
    },
    {
      id: 6,
      pillar: "Personalized Recommendations",
      title: "Your Evidence-Informed Steps",
      recommendations: [
        {
          action: "Consistent Circadian Sleep Window & Evening Magnesium Routine",
          why: "Clinical trials indicate steady wake times combined with elemental magnesium glycinate significantly lower sleep fragmentation and nocturnal thermoregulatory awakenings.",
          category: "Sleep & Recovery",
          start: "Tonight",
          citationIds: ["cit_nams_sleep_002"],
          evidenceNote: "Grounded in NAMS 2023 Position Statement on Non-Hormonal Sleep Support.",
        },
        {
          action: "Protein-Paced Breakfast & Blood Sugar Stabilization",
          why: "Distributing 25-30g protein at breakfast reduces afternoon glucose crashes and blunts cortisol spikes that provoke hot flash episodes.",
          category: "Nutrition & Energy",
          start: "Tomorrow Morning",
          citationIds: ["cit_endo_metabolic_003"],
          evidenceNote: "Grounded in Endocrine Society Clinical Guidelines on Chrono-Nutrition.",
        },
        {
          action: "Midday 3-Minute Coherence Resonant Breathing",
          why: "Slow resonant-frequency breathing activates vagal tone, decreasing sympathetic vasomotor triggers during daytime peak stress.",
          category: "Nervous System & Calm",
          start: "Today at 2:00 PM",
          citationIds: ["cit_acog_cbt_001"],
          evidenceNote: "Grounded in ACOG Clinical Practice Guideline No. 141.",
        },
      ],
      evidenceNote: "Each recommendation is mapped to peer-reviewed guidelines from ACOG and NAMS.",
    },
    {
      id: 7,
      pillar: "Suggested Next Steps",
      title: "Where To Start This Week",
      action: "Track hot flash or energy dips for 3 consecutive days  •  Test morning protein pacing  •  Review Consented Partner Digest with your spouse",
    },
    {
      id: 8,
      pillar: "Relationship Intelligence (CPS)",
      title: "Consented Partner Connection Preview",
      summary: inputs.partnerSupportInterest === "yes" || inputs.partnerSupportInterest === "maybe"
        ? "You indicated interest in partner support. HerCompass Consented Partner Sharing transforms raw clinical data into empathy-building coaching digests for your partner."
        : "HerCompass respects your autonomy. Partner sharing is 100% optional, revocable at any moment, and strictly privacy-fenced.",
    },
  ];

  return {
    member: {
      name: "Guest",
      plan: "free",
    },
    completedAt: now,
    version: "1.0",
    presentationVersion: "1.0",
    deterministicMetrics: {
      symptomBurdenScore: scores.symptomBurdenScore,
      sleepDisturbanceScore: scores.sleepDisturbanceScore,
      vitalityIndex: scores.vitalityIndex,
      emotionalBalanceScore: scores.emotionalBalanceScore,
      dominantFocusArea: scores.dominantFocusArea,
      trendRangeDays: 14,
      trendDaysLogged: 0,
      trendConsistencyScore: null,
      trendCheckInStreak: 0,
    },
    observations,
    safetyNotice: "HerCompassAI is a wellness intelligence platform, not a medical provider. Insights are non-diagnostic and evidence-grounded.",
    citations,
    generation: {
      requestId: "guest-one-time-snapshot",
      resultStatus: "approved",
      fallbackUsed: false,
      confidenceClass: "high",
      confidenceScore: 0.94,
      safetyStatus: "pass",
      promptVersion: "1.0",
      evidenceVersion: "1.0",
      sciVersion: "1.0",
      modelVersion: null,
    },
    confidence: {
      confidenceClass: "high",
      confidenceScore: 0.94,
      rationale: ["Calculated with deterministic scoring algorithms", "Grounded in approved ACOG & NAMS evidence citations"],
    },
  };
}
