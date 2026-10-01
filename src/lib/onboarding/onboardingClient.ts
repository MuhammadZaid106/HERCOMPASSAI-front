import { authClient } from "../auth/authClient";
import {
  AI_CONNECTION_MESSAGE,
  AI_UNREADABLE_RESPONSE_MESSAGE,
  NETWORK_ERROR_STATUS,
  aiErrorMessage,
  reasonFromErrorBody,
  resolveReason,
} from "../ai/aiErrors";
import {
  ONBOARDING_CONSENT_VERSION,
  type OnboardingFormValues,
  type OnboardingProfileSummary,
  type PersonalSnapshotData,
  type SnapshotResult,
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
  ): Promise<{ success: boolean; message: string; data?: unknown }> {
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
    } catch {
      // The browser only reaches here for a transport failure, so a member needs
      // a connection message — never `err.message`, which reads "Failed to
      // fetch" and says nothing about their saved answers.
      return {
        success: false,
        message: AI_CONNECTION_MESSAGE,
      };
    }
  },

  /**
   * Fetch current member's onboarding status
   */
  async getProfile(): Promise<{
    isCompleted: boolean;
    profile?: OnboardingProfileSummary;
    error?: string;
  }> {
    const tokens = authClient.getStoredTokens();
    const token = tokens?.accessToken;
    if (!token) return { isCompleted: false };

    try {
      const res = await authClient.authenticatedFetch(`${API_BASE}/api/onboarding/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) {
        return { isCompleted: false, error: aiErrorMessage(res.status, json?.message) };
      }
      return json.data || { isCompleted: false };
    } catch {
      return { isCompleted: false, error: AI_CONNECTION_MESSAGE };
    }
  },

  /**
   * Fetch the 8-part Personal Menopause Snapshot.
   *
   * This is the one place a member-facing page talks to the AI Gateway, and the
   * distinction it has to preserve is *why* a Snapshot is missing. The old
   * version returned `{ snapshot: null, error }` and every caller rendered the
   * same "not ready yet" line, so a Gateway outage looked identical to a member
   * who had never finished onboarding — and, worse, an expired token looked
   * like missing data. `SnapshotResult` carries the status, the machine-readable
   * reason and a message that is safe to render verbatim, so the page can offer
   * "finish onboarding", "review consent" or "try again" as appropriate.
   */
  async getSnapshot(options: { refresh?: boolean } = {}): Promise<SnapshotResult> {
    const tokens = authClient.getStoredTokens();
    if (!tokens?.accessToken) {
      return {
        snapshot: null,
        generated: false,
        requestId: null,
        status: 401,
        reason: "unauthenticated",
        message: aiErrorMessage(401, null),
      };
    }

    const query = options.refresh ? "?refresh=true" : "";

    try {
      const res = await authClient.authenticatedFetch(
        `${API_BASE}/api/onboarding/snapshot${query}`,
        { headers: { Authorization: `Bearer ${tokens.accessToken}` } }
      );
      const json = await res.json().catch(() => null);
      const reason = reasonFromErrorBody(json);

      if (!res.ok) {
        return {
          snapshot: null,
          generated: false,
          requestId: null,
          status: res.status,
          reason: reason ?? resolveReason(res.status, "unknown"),
          message: aiErrorMessage(res.status, json?.message),
        };
      }

      if (json?.success !== true) {
        return {
          snapshot: null,
          generated: false,
          requestId: null,
          status: res.status,
          reason: "unknown",
          message: AI_UNREADABLE_RESPONSE_MESSAGE,
        };
      }

      return {
        snapshot: (json.data?.snapshot as PersonalSnapshotData | undefined) ?? null,
        generated: json.data?.generated === true,
        requestId: json.data?.requestId ?? null,
        status: res.status,
        reason: null,
        message: "",
      };
    } catch {
      return {
        snapshot: null,
        generated: false,
        requestId: null,
        status: NETWORK_ERROR_STATUS,
        reason: "network",
        message: AI_CONNECTION_MESSAGE,
      };
    }
  },

  async getSnapshotVersions(): Promise<{
    versions: Array<{
      id: string;
      versionNumber: number;
      completedAt: string;
      dominantFocusArea: string | null;
      /**
       * The narrative as it was shown for this version, or null when the version
       * was recorded before narratives were captured. Null means "not recorded",
       * not "the same as your latest Snapshot".
       */
      payload: Record<string, unknown> | null;
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

  /**
   * Rate the Snapshot.
   *
   * `report_concern` is offered here as well as on the AI surfaces. A member
   * reading their Snapshot is exactly where someone is most likely to spot
   * something that should not have been said, so it needs the same route to a
   * human that the AI pages have.
   */
  async sendSnapshotFeedback(
    rating: "helpful" | "not_helpful" | "report_concern",
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
