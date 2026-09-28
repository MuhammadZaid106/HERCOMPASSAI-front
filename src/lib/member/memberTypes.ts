export type TrackingRange = "7d" | "30d" | "90d";

export interface TrackingEntry {
  id: string;
  entryDate: string;
  [key: string]: unknown;
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
  today: {
    symptom: TrackingEntry | null;
    mood: TrackingEntry | null;
    sleep: TrackingEntry | null;
    energy: TrackingEntry | null;
  };
  deterministicScores: Record<string, unknown> | null;
  partnerSupport: { interest: string | null };
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
  readAt: string | null;
  createdAt: string;
}

export interface MemberNotificationsData {
  notifications: MemberNotification[];
  unreadCount: number;
}

export interface MemberSubscriptionData {
  plan: "free" | "plus" | "premium";
  label: string;
  description: string;
}