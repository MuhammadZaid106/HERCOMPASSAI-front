import type { ApiResult } from "@/lib/member/memberTypes";

export type SymptomImpact = "not_at_all" | "a_little" | "somewhat" | "a_lot";
export type SleepQuality = "poor" | "fair" | "good" | "very_good";
export type EnergyPattern =
  | "morning"
  | "afternoon"
  | "evening"
  | "throughout_the_day"
  | "varies";

export type TrackingEntryType =
  | "symptoms"
  | "mood"
  | "sleep"
  | "energy"
  | "lifestyle";

export type TrackingRange = "7d" | "30d" | "90d";

export interface TrackingPayload {
  entryDate?: string;
  [key: string]: unknown;
}

export type TrackingSaveResult = ApiResult<{ entry: Record<string, unknown> }>;

export interface TrackingListEntry {
  id: string;
  entryDate: string;
  [key: string]: unknown;
}

export interface TrackingSummaryData {
  range: TrackingRange;
  entries: {
    symptoms: TrackingListEntry[];
    moods: TrackingListEntry[];
    sleep: TrackingListEntry[];
    energy: TrackingListEntry[];
    lifestyle: TrackingListEntry[];
  };
  counts: {
    symptoms: number;
    moods: number;
    sleep: number;
    energy: number;
    lifestyle: number;
  };
}
