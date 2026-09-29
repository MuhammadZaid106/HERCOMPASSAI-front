export const exploreCategories = [
  { id: "for-you", label: "For You" },
  { id: "sleep", label: "Sleep" },
  { id: "mood", label: "Mood" },
  { id: "energy", label: "Energy" },
  { id: "nutrition", label: "Nutrition" },
  { id: "movement", label: "Movement" },
  { id: "stress", label: "Stress" },
  { id: "relationships", label: "Relationships" },
  { id: "menopause", label: "Menopause" },
  { id: "partner-support", label: "Partner Support" },
  { id: "mens-academy", label: "Men's Academy" },
  { id: "evidence", label: "Evidence" },
] as const;

export type ExploreCategoryId = (typeof exploreCategories)[number]["id"];
export type ExploreTopicId = Exclude<ExploreCategoryId, "for-you">;

export interface ExploreEvidence {
  source: string;
  note: string;
}

export interface ExploreItem {
  slug: string;
  title: string;
  category: ExploreTopicId;
  minutes: number;
  why: string;
  tryThis: string;
  tryHref: string;
  tryLabel: string;
  evidence: ExploreEvidence[];
  /** Shown in For You when no Snapshot focus matches a topic. */
  starter: boolean;
}

export const exploreItems: ExploreItem[] = [
  {
    slug: "understanding-sleep-changes",
    title: "Understanding sleep changes",
    category: "sleep",
    minutes: 5,
    why: "Sleep can shift in midlife. A short log makes those nights easier to see beside energy and mood.",
    tryThis: "Mark last night’s sleep in today’s check-in.",
    tryHref: "/app/track?tab=sleep",
    tryLabel: "Log sleep",
    evidence: [
      {
        source: "NAMS",
        note: "Educational context on sleep changes in the menopause transition. Not a diagnosis.",
      },
      {
        source: "NIH",
        note: "Public guidance that sleep and daytime energy are worth noticing together.",
      },
    ],
    starter: true,
  },
  {
    slug: "mood-beside-sleep",
    title: "Mood beside sleep",
    category: "mood",
    minutes: 4,
    why: "A lower mood and a harder night can show up in the same week. That is a pattern to notice, not a cause.",
    tryThis: "Give mood a single mark today.",
    tryHref: "/app/track?tab=mood",
    tryLabel: "Log mood",
    evidence: [
      {
        source: "ACOG",
        note: "Mood changes are a recognized part of this life stage for many people. This page does not assess them.",
      },
    ],
    starter: true,
  },
  {
    slug: "energy-across-the-day",
    title: "Energy across the day",
    category: "energy",
    minutes: 4,
    why: "Energy often moves through the day. One mark is enough to see whether that repeats.",
    tryThis: "Mark today’s energy.",
    tryHref: "/app/track?tab=energy",
    tryLabel: "Log energy",
    evidence: [
      {
        source: "Harvard Health",
        note: "General education on daytime energy and rest. Not a treatment plan.",
      },
    ],
    starter: false,
  },
  {
    slug: "a-steady-plate",
    title: "A steady plate",
    category: "nutrition",
    minutes: 5,
    why: "Regular meals are one lifestyle signal you can log beside how the day felt.",
    tryThis: "Record today’s nutrition note in the lifestyle step.",
    tryHref: "/app/track?tab=lifestyle",
    tryLabel: "Open lifestyle",
    evidence: [
      {
        source: "Harvard Health",
        note: "General nutrition education. This is not a prescribed meal plan.",
      },
    ],
    starter: false,
  },
  {
    slug: "low-impact-movement",
    title: "Low-impact movement",
    category: "movement",
    minutes: 4,
    why: "A short walk or stretch is a lifestyle signal, not a workout prescription.",
    tryThis: "Note whether you moved today.",
    tryHref: "/app/track?tab=lifestyle",
    tryLabel: "Log movement",
    evidence: [
      {
        source: "WHO",
        note: "Public activity guidance for adults. Choose what feels workable for you.",
      },
    ],
    starter: false,
  },
  {
    slug: "a-short-reset",
    title: "A short reset",
    category: "stress",
    minutes: 3,
    why: "A brief pause is something you can mark. It does not measure stress clinically.",
    tryThis: "Mark whether you took a short reset today.",
    tryHref: "/app/track?tab=lifestyle",
    tryLabel: "Log a reset",
    evidence: [
      {
        source: "NIH",
        note: "General education on stress and rest. Not a mental-health assessment.",
      },
    ],
    starter: false,
  },
  {
    slug: "talking-about-what-you-notice",
    title: "Talking about what you notice",
    category: "relationships",
    minutes: 5,
    why: "You choose what, if anything, someone close to you hears. Raw logs stay private.",
    tryThis: "Review partner support before you share anything.",
    tryHref: "/app/partner",
    tryLabel: "Review partner support",
    evidence: [
      {
        source: "HerCompass consent",
        note: "Sharing is limited to what you allow, and you can revoke it.",
      },
    ],
    starter: false,
  },
  {
    slug: "what-a-phase-label-means",
    title: "What a phase label means",
    category: "menopause",
    minutes: 5,
    why: "A phase such as perimenopause is context for your Snapshot. It is not a diagnosis from this app.",
    tryThis: "Read the baseline you already built.",
    tryHref: "/app/snapshot",
    tryLabel: "Open Snapshot",
    evidence: [
      {
        source: "NAMS",
        note: "Stage language used for education. Confirm medical questions with a clinician.",
      },
    ],
    starter: true,
  },
  {
    slug: "what-a-partner-can-see",
    title: "What a partner can see",
    category: "partner-support",
    minutes: 4,
    why: "Partner support is optional. A partner never receives your raw health logs.",
    tryThis: "Open the partner page and decide later if you want.",
    tryHref: "/app/partner",
    tryLabel: "Open partner support",
    evidence: [
      {
        source: "HerCompass consent",
        note: "Only a consented summary can be shared, and you can turn it off.",
      },
    ],
    starter: false,
  },
  {
    slug: "support-without-the-raw-log",
    title: "Support without the raw log",
    category: "mens-academy",
    minutes: 4,
    why: "Men’s Academy is for learning how to support someone. It is not a view of private entries.",
    tryThis: "See how partner access is controlled.",
    tryHref: "/app/partner",
    tryLabel: "Review access",
    evidence: [
      {
        source: "HerCompass consent",
        note: "Education for a partner stays separate from your private check-ins.",
      },
    ],
    starter: false,
  },
  {
    slug: "where-guidance-comes-from",
    title: "Where guidance comes from",
    category: "evidence",
    minutes: 4,
    why: "Educational notes on this page name a source body. They do not diagnose or prescribe.",
    tryThis: "Look at the pattern cards built from your own logs.",
    tryHref: "/app/insights",
    tryLabel: "Open insights",
    evidence: [
      { source: "NAMS", note: "Menopause education." },
      { source: "ACOG", note: "Women’s health education." },
      { source: "WHO", note: "Public health guidance." },
      { source: "NIH", note: "Public research summaries." },
      { source: "Harvard Health", note: "General wellness education." },
    ],
    starter: true,
  },
];

export function exploreItem(slug: string): ExploreItem | undefined {
  return exploreItems.find((item) => item.slug === slug);
}

export function categoryForFocus(focus: string | null | undefined): ExploreTopicId | null {
  if (!focus) return null;
  const text = focus.toLowerCase();
  if (text.includes("sleep") || text.includes("rest")) return "sleep";
  if (text.includes("mood") || text.includes("nervous") || text.includes("breath")) return "mood";
  if (text.includes("energy") || text.includes("metabolic")) return "energy";
  if (text.includes("nutri") || text.includes("weight")) return "nutrition";
  if (text.includes("stress")) return "stress";
  if (text.includes("partner") || text.includes("relationship")) return "relationships";
  if (text.includes("vasomotor") || text.includes("symptom") || text.includes("hot")) return "menopause";
  return null;
}

export function itemsForCategory(
  category: ExploreCategoryId,
  focus: string | null | undefined,
): ExploreItem[] {
  if (category === "for-you") {
    const topic = categoryForFocus(focus);
    if (topic) return exploreItems.filter((item) => item.category === topic);
    return exploreItems.filter((item) => item.starter);
  }
  return exploreItems.filter((item) => item.category === category);
}
