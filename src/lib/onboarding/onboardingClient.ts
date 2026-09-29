import { authClient } from "../auth/authClient";
import {
  ONBOARDING_CONSENT_VERSION,
  type OnboardingFormValues,
  type PersonalSnapshotData,
} from "./onboardingTypes";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

const DRAFT_STORAGE_KEY = "hercompass_onboarding_draft";

export const initialOnboardingValues: OnboardingFormValues = {
  version: "1.0",
  consentAccepted: false,
  consentVersion: "",
  age: "",
  menopausePhase: "",
  hormoneTherapyStatus: "",
  medicalConditions: "",
  primaryGoals: [],
  primaryHealthConcerns: [],
  symptomImpact: "",
  sleepQuality: "",
  sleepChallenges: [],
  energyLevel: "",
  energyPattern: "",
  dietaryPreferences: [],
  allergies: "",
  energyAfterMealRating: 2,
  activityLevel: "",
  exercisePreferences: [],
  weeklyExerciseMinutes: "",
  lifestyleFocus: [],
  moodBaseline: {
    anxious: 3,
    calm: 3,
    irritable: 3,
    sad: 3,
    happy: 3,
    motivated: 3,
    tired: 3,
  },
  moodOverall: "",
  moodPatterns: [],
  emotionalGoals: [],
  meditationFrequency: "",
  primaryGoal: "",
  dailyCheckinOptIn: true,
  preferredRecommendations: ["Symptom insights", "Meal ideas", "Exercise suggestions"],
  partnerSupportInterest: "",
  partnerSupportNeeds: [],
  partnerEmail: "",
  partnerConsent: false,
  partnerSharingScopes: ["digest_summary", "communication_guidance", "shared_activities"],
};

export const onboardingClient = {
  /**
   * Save draft answers to browser localStorage
   */
  saveDraft(values: Partial<OnboardingFormValues>): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(values));
    } catch {
      // Ignore localStorage errors (e.g. private mode quota)
    }
  },

  /**
   * Retrieve saved draft from localStorage
   */
  getDraft(): OnboardingFormValues {
    if (typeof window === "undefined") return initialOnboardingValues;
    try {
      const stored = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (stored) {
        const draft = { ...initialOnboardingValues, ...JSON.parse(stored) };
        if (draft.consentVersion !== ONBOARDING_CONSENT_VERSION) {
          draft.consentAccepted = false;
          draft.consentVersion = "";
        }
        return draft;
      }
    } catch {
      // Fallback
    }
    return initialOnboardingValues;
  },

  /**
   * Clear draft from localStorage
   */
  clearDraft(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // Ignore
    }
  },

  /**
   * Submit completed onboarding assessment to backend
   */
  async submitAssessment(
    values: OnboardingFormValues
  ): Promise<{ success: boolean; message: string; data?: any }> {
    const payload = {
      version: values.version || "1.0",
      consentAccepted: values.consentAccepted,
      consentVersion: values.consentVersion,
      consentType: "wellness_personalization",
      isCompleted: true,
      age: values.age ? Number(values.age) : null,
      menopausePhase: values.menopausePhase || null,
      hormoneTherapyStatus: values.hormoneTherapyStatus || null,
      primaryGoals: values.primaryGoals,
      primaryHealthConcerns: values.primaryHealthConcerns,
      symptomImpact: values.symptomImpact || null,
      medicalConditions: values.medicalConditions || null,
      sleepQuality: values.sleepQuality || null,
      sleepChallenges: values.sleepChallenges,
      energyLevel: values.energyLevel || null,
      energyPattern: values.energyPattern || null,
      dietaryPreferences: values.dietaryPreferences,
      allergies: values.allergies || null,
      energyAfterMealRating: values.energyAfterMealRating,
      activityLevel: values.activityLevel || null,
      exercisePreferences: values.exercisePreferences,
      weeklyExerciseMinutes: values.weeklyExerciseMinutes || null,
      lifestyleFocus: values.lifestyleFocus,
      moodBaseline: values.moodBaseline,
      moodOverall: values.moodOverall || null,
      moodPatterns: values.moodPatterns,
      emotionalGoals: values.emotionalGoals,
      meditationFrequency: values.meditationFrequency || null,
      primaryGoal: values.primaryGoal || null,
      dailyCheckinOptIn: values.dailyCheckinOptIn,
      preferredRecommendations: values.preferredRecommendations,
      partnerSupportInterest: values.partnerSupportInterest || null,
      partnerSupportNeeds: values.partnerSupportNeeds,
      partnerEmail: values.partnerEmail || null,
      partnerConsent: values.partnerConsent,
      partnerSharingScopes: values.partnerSharingScopes,
    };

    try {
      const res = await authClient.authenticatedFetch(`${API_BASE}/api/onboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        return {
          success: false,
          message: json.message || "Failed to submit assessment",
        };
      }

      onboardingClient.clearDraft();
      return { success: true, message: json.message, data: json.data };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || "Network error submitting onboarding assessment",
      };
    }
  },

  /**
   * Fetch current member's onboarding status
   */
  async getProfile(): Promise<{
    isCompleted: boolean;
    profile?: any;
    error?: string;
  }> {
    const tokens = authClient.getStoredTokens();
    const token = tokens?.accessToken;
    if (!token) return { isCompleted: false };

    try {
      const res = await authClient.authenticatedFetch(`${API_BASE}/api/onboarding/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) return { isCompleted: false, error: json.message };
      return json.data || { isCompleted: false };
    } catch {
      return { isCompleted: false };
    }
  },

  /**
   * Fetch the 8-part Personal Menopause Snapshot
   */
  async getSnapshot(): Promise<{
    snapshot: PersonalSnapshotData | null;
    error?: string;
  }> {
    const tokens = authClient.getStoredTokens();
    const token = tokens?.accessToken;
    if (!token) return { snapshot: null, error: "Authentication required" };

    try {
      const res = await authClient.authenticatedFetch(`${API_BASE}/api/onboarding/snapshot`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) return { snapshot: null, error: json.message };
      return { snapshot: json.data?.snapshot || null };
    } catch (err: any) {
      return { snapshot: null, error: err.message };
    }
  },

  async getSnapshotVersions(): Promise<{
    versions: Array<{
      id: string;
      versionNumber: number;
      completedAt: string;
      dominantFocusArea: string | null;
    }>;
    error?: string;
  }> {
    try {
      const res = await authClient.authenticatedFetch(
        `${API_BASE}/api/onboarding/snapshot/versions`,
      );
      const json = await res.json();
      if (!res.ok) return { versions: [], error: json.message };
      return { versions: json.data?.versions ?? [] };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Network error";
      return { versions: [], error: message };
    }
  },

  async sendSnapshotFeedback(
    rating: "helpful" | "not_helpful",
    comment: string,
  ): Promise<{ ok: boolean; message: string }> {
    try {
      const res = await authClient.authenticatedFetch(
        `${API_BASE}/api/onboarding/snapshot/feedback`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating, comment }),
        },
      );
      const json = await res.json();
      return { ok: res.ok && json.success === true, message: json.message ?? "Saved" };
    } catch {
      return { ok: false, message: "We couldn't save that feedback." };
    }
  },
};
