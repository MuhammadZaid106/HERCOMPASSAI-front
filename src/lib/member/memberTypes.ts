export type TrackingRange = "7d" | "30d" | "90d";

export interface TrackingEntry {
  id: string;
  entryDate: string;
  [key: string]: unknown;
}

export interface DomainLogSummary {
  entryDate: string;
  label: string;
}

export interface DashboardDomainLogs {
  symptom: DomainLogSummary | null;
  mood: DomainLogSummary | null;
  sleep: DomainLogSummary | null;
  energy: DomainLogSummary | null;
}

export type PartnerSupportInterest =
  | "yes"
  | "maybe"
  | "not_now"
  | "not_interested"
  | "no_partner"
  | "prefer_not_to_say";

export interface SnapshotScores {
  symptomBurdenScore: number;
  sleepDisturbanceScore: number;
  vitalityIndex: number;
  emotionalBalanceScore: number;
}

export interface DashboardSnapshot {
  available: boolean;
  dominantFocusArea: string | null;
  scores: SnapshotScores | null;
}

export interface HomeNextStep {
  title: string;
  body: string;
  href: string;
}

export type TrendDirection = "increasing" | "decreasing" | "stable";

export interface DomainTrend {
  trend: TrendDirection;
  changePercent: number | null;
  recentAverage: number | null;
  priorAverage: number | null;
  sufficientData: boolean;
}

export interface TrendEngineOutput {
  rangeDays: number;
  insufficientData: boolean;
  checkInStreak: number;
  consistencyScore: number;
  daysWithAnyEntry: number;
  symptomFrequency: number | null;
  symptoms: DomainTrend;
  mood: DomainTrend;
  sleep: DomainTrend;
  energy: DomainTrend;
  patternIndicators: string[];
}

export interface MemberDashboardData {
  member: { id: string; name: string; plan: "free" | "plus" | "premium" };
  onboarding: { completed: boolean; completedAt: string | null; snapshotAvailable: boolean };
  today: DashboardDomainLogs;
  latest: DashboardDomainLogs;
  checkIn: { loggedToday: number; total: 4 };
  snapshot: DashboardSnapshot;
  nextStep: HomeNextStep;
  trends: TrendEngineOutput;
  deterministicScores: Record<string, unknown> | null;
  partnerSupport: { interest: PartnerSupportInterest | null };
  trackingSummary?: {
    checkInStreak: number;
    consistencyScore7d: number;
    daysWithAnyEntry7d: number;
  };
}

export interface MemberProgressData {
  range: string;
  points: {
    symptoms: Array<{ date: string; value: number }>;
    mood: Array<{ date: string; value: number }>;
    sleep: Array<{ date: string; value: number }>;
    energy: Array<{ date: string; value: number }>;
  };
  averages: { symptoms: number | null; mood: number | null; sleep: number | null; energy: number | null };
  entryCount: number;
  trends: TrendEngineOutput;
}

export interface ApiResult<T> {
  success: boolean;
  message: string;
  data?: T;
}

export interface MemberNotification {
  id: string;
  category: string;
  title: string;
  body: string;
  /** A privacy or security notice, shown with extra weight. */
  important: boolean;
  /** Where opening the notice should take the member, when there is a place. */
  targetUrl: string | null;
  readAt: string | null;
  createdAt: string;
}

export interface MemberNotificationsData {
  notifications: MemberNotification[];
  unreadCount: number;
  /** Total matching rows for the active filter, for "load more". */
  total: number;
  limit: number;
  offset: number;
}

export type MemberPlanId = "free" | "plus" | "premium";
export type PlanAccess = "included" | "limited" | "not_included";

export interface PlanSummary {
  id: MemberPlanId;
  label: string;
  summary: string;
  description: string;
}

export interface PlanComparisonRow {
  id: string;
  label: string;
  access: Record<MemberPlanId, PlanAccess>;
}

export interface NotificationPreferences {
  snapshot: boolean;
  trackingReminders: boolean;
  recommendations: boolean;
  partner: boolean;
  plans: boolean;
  account: boolean;
  privacySecurity: boolean;
}

export interface ExploreProgressItem {
  slug: string;
  saved: boolean;
  completed: boolean;
}

export interface MemberAccountData {
  profile: {
    name: string;
    email: string;
    emailVerified: boolean;
    memberSince: string;
    plan: MemberPlanId;
    planLabel: string;
  };
  preferences: {
    snapshotComplete: boolean;
    dailyCheckIn: boolean;
    recommendations: string[];
  };
  consent: {
    type: string;
    typeLabel: string;
    version: string;
    recordedAt: string | null;
    allowsPersonalization: boolean;
  } | null;
  partner: {
    interest: string | null;
    interestLabel: string;
    sharingOn: boolean;
    scopes: string[];
    emailOnFile: boolean;
  } | null;
  notifications: {
    unreadCount: number;
  };
}

/** Echoed back after a profile save, so the UI reflects stored values. */
export interface MemberProfileUpdate {
  name: string;
  email: string;
}

/**
 * The consent choice as stored after a change.
 *
 * `recordedAt` is when the member agreed, which is not the same as when the
 * account was created: this can be changed at any time from settings.
 */
export interface MemberConsentUpdate {
  allowsPersonalization: boolean;
  type: string;
  version: string;
  recordedAt: string;
}

export interface MemberSubscriptionData {
  plan: MemberPlanId;
  label: string;
  description: string;
  summary: string;
  plans: PlanSummary[];
  comparison: PlanComparisonRow[];
}

export type InsightSection = "changing" | "connected" | "try" | "watch";

export interface InsightCard {
  id: string;
  section: InsightSection;
  title: string;
  body: string;
  href: string;
  hrefLabel: string;
  why: string;
  considered: string[];
}

export interface MemberInsightsData {
  rangeDays: number;
  insufficientData: boolean;
  daysWithAnyEntry: number;
  patterns: Array<{
    label: string;
    direction: TrendDirection | "unknown";
  }>;
  cards: InsightCard[];
  learnMore: Array<{ title: string; body: string; href: string }>;
}