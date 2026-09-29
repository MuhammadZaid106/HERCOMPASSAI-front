export const ONBOARDING_CONSENT_VERSION = "privacy-2026-09-27";

export interface OnboardingFormValues {
  // Version & Consent
  version: string;
  consentAccepted: boolean;
  consentVersion: string;

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
  moodPatterns: string[];
  emotionalGoals: string[];
  meditationFrequency: "daily" | "weekly" | "rarely" | "never" | "";

  // Step 8: Signature Priority Goal
  primaryGoal: string;

  // Step 9: AI Preferences & Partner Connection (CPS)
  dailyCheckinOptIn: boolean;
  preferredRecommendations: string[];
  partnerSupportInterest: "yes" | "maybe" | "not_now" | "not_interested" | "no_partner" | "prefer_not_to_say" | "";
  partnerSupportNeeds: string[];
  partnerEmail: string;
  partnerConsent: boolean;
  partnerSharingScopes: string[];
}

/**
 * Deterministic scores shown as Snapshot cards.
 *
 * Every value is nullable on purpose. The backend used to substitute defaults
 * (45 / 40 / 60 / 65) when a score was missing, which meant a member saw a
 * plausible number that HerCompass had never calculated and could not explain.
 * A dash is honest; an invented score is not.
 */
export interface DeterministicMetrics {
  symptomBurdenScore: number | string | null;
  sleepDisturbanceScore: number | string | null;
  vitalityIndex: number | string | null;
  emotionalBalanceScore: number | string | null;
  dominantFocusArea: number | string | null;
  /** Trend Engine window the gateway read (days). */
  trendRangeDays?: number | null;
  /** Days with at least one logged check-in in that window. */
  trendDaysLogged?: number | null;
  /** Percentage of the window the member logged. */
  trendConsistencyScore?: number | null;
  /** Consecutive days of logging, counting today. */
  trendCheckInStreak?: number | null;
}

/**
 * A verified trend, exactly as the Deterministic Trend Engine calculated it and
 * the AI Gateway restated it. The client renders it; it never derives one.
 */
export interface SnapshotTrend {
  direction: "increasing" | "decreasing" | "stable";
  recentAverage: number | null;
  priorAverage: number | null;
  changePercent: number | null;
  sufficientData: boolean;
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
  recommendations?: Array<{ action: string; why: string; category: string; start?: string }>;
  action?: string;
  status?: string;
  trend?: SnapshotTrend;
}

/** An approved evidence reference the Snapshot was grounded in. */
export interface SnapshotCitation {
  citationId: string;
  sourceName: string;
  title: string;
  publisher: string;
  publicationDate: string;
  reference: string;
  authorityLevel: number;
}

/**
 * Why the AI portion of a Snapshot could not run, in member-safe terms.
 *
 * Carries a classification and an HTTP status only — never a provider message,
 * model id or hostname, because the Snapshot page is member-facing and our
 * misconfiguration is not the member's business. The `reason` exists so the UI
 * can pick the right wording and decide whether to offer a retry, rather than
 * pattern-matching prose.
 */
export interface SnapshotDegradation {
  degraded: true;
  reason:
    | "generation_failed"
    | "schema_invalid"
    | "guardrail_blocked"
    | "integrity_check_failed"
    | "no_evidence"
    | string;
  message: string;
  engines: Array<{
    provider: string;
    kind: string;
    httpStatus: number | null;
    retryable: boolean;
  }>;
  /** True when retrying could plausibly succeed without a config change. */
  retryable: boolean;
}

/** Provenance for the AI event that produced this Snapshot. */
export interface SnapshotGeneration {
  requestId: string;
  resultStatus: "approved" | "approved_with_repairs" | "fallback" | string;
  fallbackUsed: boolean;
  confidenceClass: string | null;
  confidenceScore: number | null;
  safetyStatus: string;
  promptVersion: string;
  evidenceVersion: string;
  sciVersion: string;
  modelVersion: string | null;
  /**
   * Absent when the AI wrote this normally. When present, the member view shows
   * that the numbers below come from their own verified data rather than from
   * the assistant, instead of implying the model answered.
   */
  diagnostics?: SnapshotDegradation;
}

export interface PersonalSnapshotData {
  member: {
    name: string;
    plan: string;
  };
  completedAt: string;
  version: string;
  presentationVersion?: string;
  deterministicMetrics: DeterministicMetrics;
  observations: SnapshotObservation[];
  safetyNotice: string;
  citations?: SnapshotCitation[];
  generation?: SnapshotGeneration;
  confidence?: {
    confidenceClass: string | null;
    confidenceScore: number | null;
    rationale: string[];
  };
}

/**
 * Why a Snapshot could not be shown.
 *
 * The distinction is the whole point: `not_completed` sends a member to
 * onboarding, `consent_required` sends them to their privacy settings, and
 * `ai_unavailable` asks them to retry. Collapsing these into one "not ready"
 * message is what previously made an engine outage look like a member who had
 * never filled in the questionnaire.
 */
export type SnapshotFailureReason =
  | "unauthenticated"
  | "forbidden_role"
  | "not_completed"
  | "consent_required"
  | "ai_unavailable"
  | "network"
  | "unknown";

/**
 * The subset of the member's onboarding record the client needs.
 *
 * Kept narrow on purpose: the client asks "is this finished, and is the consent
 * current" to decide whether the Gateway can even be called, and nothing more.
 * The full profile — and every score inside it — stays server-side.
 */
export interface OnboardingProfileSummary {
  isCompleted: boolean;
  consentType?: string;
  consentStatus?: string;
  completedAt?: string | null;
  [key: string]: unknown;
}

export interface SnapshotResult {
  snapshot: PersonalSnapshotData | null;
  /** False when a stored Snapshot was replayed instead of regenerated. */
  generated: boolean;
  requestId: string | null;
  status: number;
  reason: SnapshotFailureReason | null;
  /** Safe to render verbatim. The backend never sends provider detail here. */
  message: string;
}
