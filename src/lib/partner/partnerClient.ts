"use client";

import { authClient } from "@/lib/auth/authClient";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

export interface ActivityItem {
  key: string;
  label: string;
  suggestion: string;
  evidenceId: string;
  sourceName: string | null;
}

export interface AcademyListItem {
  slug: string;
  category: string;
  title: string;
  version: string;
  summary: string;
  read: boolean;
}

export interface AcademyLessonDetail extends AcademyListItem {
  evidenceId: string;
  paragraphs: string[];
  sourceName: string | null;
  personalizedParagraph?: string | null;
  safeLine?: string | null;
}

export interface DigestSections {
  whatSheMayBeExperiencing: string | null;
  whatMayHelp: string[];
  howToCommunicate: string[];
  whatToAvoid: string[];
  oneSimpleSupportAction: string | null;
  evidenceIds: string[];
  safeLine?: string | null;
  advancedObservation?: string | null;
}

async function getJson<T>(path: string): Promise<{ ok: true; data: T } | { ok: false; message: string }> {
  try {
    const response = await authClient.authenticatedFetch(`${API_BASE}${path}`);
    const json = (await response.json().catch(() => null)) as { success?: boolean; message?: string; data?: T } | null;
    if (!response.ok || !json?.success || json.data === undefined) {
      return { ok: false, message: json?.message || "We couldn't complete that right now. Your information is safe." };
    }
    return { ok: true, data: json.data };
  } catch {
    return { ok: false, message: "We couldn't reach HerCompass just now. Your information is safe." };
  }
}

export const partnerClient = {
  activities: () => getJson<{ memberFirstName: string; activities: ActivityItem[] }>("/api/partner/activities"),
  academy: () => getJson<{ included: boolean; plusMessage?: string; lessons: AcademyListItem[] }>("/api/partner/academy"),
  lesson: (slug: string) => getJson<{ included: boolean; plusMessage?: string; lesson?: AcademyLessonDetail }>(`/api/partner/academy/${slug}`),
  markLessonRead: async (slug: string) => {
    try {
      const response = await authClient.authenticatedFetch(`${API_BASE}/api/partner/academy/${slug}/read`, { method: "POST" });
      const json = (await response.json().catch(() => null)) as { success?: boolean; message?: string } | null;
      return { ok: Boolean(response.ok && json?.success), message: json?.message || "We couldn't save that." };
    } catch {
      return { ok: false, message: "We couldn't reach HerCompass just now. Your information is safe." };
    }
  },
  support: () =>
    getJson<{
      included: boolean;
      plusMessage?: string;
      memberFirstName?: string;
      lines?: string[];
      sources?: string[];
      safeLine?: string | null;
    }>("/api/partner/support"),
  conversation: () =>
    getJson<{
      included: boolean;
      plusMessage?: string;
      memberFirstName?: string;
      lines?: string[];
      sources?: string[];
      safeLine?: string | null;
    }>("/api/partner/conversation"),
  digest: () =>
    getJson<{
      included: boolean;
      plusMessage?: string;
      memberFirstName?: string;
      weekStart?: string;
      safeLine?: string | null;
      sections?: DigestSections;
      sources?: string[];
    }>("/api/partner/digest"),
};
