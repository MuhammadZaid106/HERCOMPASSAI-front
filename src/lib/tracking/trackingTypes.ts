import type { ApiResult } from "@/lib/member/memberTypes";

export type SymptomImpact = "not_at_all" | "a_little" | "somewhat" | "a_lot";
export type SleepQuality = "poor" | "fair" | "good" | "very_good";
export type EnergyPattern =
  | "morning"
  | "afternoon"
  | "evening"
  | "throughout_the_day"
  | "varies";

export interface TrackingPayload {
  entryDate?: string;
  [key: string]: unknown;
}

export type TrackingSaveResult = ApiResult<{ entry: Record<string, unknown> }>;
