import type {
  MeditationCard,
  RecipeCard,
  RecipeCategory,
  WorkoutCard,
  WorkoutCategory,
} from "@/lib/member/contentClient";

/**
 * UI labels and filter options for the recipe and workout libraries.
 *
 * Filters keep each menu short enough to scan on a phone. Fall backs map equal
 * words from a title (e.g. an "evening stretch" row) onto a category when the
 * backend row is an older piece without one.
 */

const RECIPE_LABELS: Record<RecipeCategory | "all", string> = {
  all: "All",
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snacks: "Snacks",
};

export const RECIPE_FILTER_OPTIONS = (Object.keys(RECIPE_LABELS) as Array<keyof typeof RECIPE_LABELS>).map(
  (id) => ({ id, label: RECIPE_LABELS[id] }),
);

const WORKOUT_LABELS: Record<WorkoutCategory | "all", string> = {
  all: "All",
  "low-impact": "Low-Impact",
  strength: "Strength",
  flexibility: "Flexibility",
  cardio: "Cardio",
  breathing: "Breathing",
};

export const WORKOUT_FILTER_OPTIONS = (
  Object.keys(WORKOUT_LABELS) as Array<keyof typeof WORKOUT_LABELS>
).map((id) => ({ id, label: WORKOUT_LABELS[id] }));

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]/g, " ");
}

export function recipeCategoryFor(item: RecipeCard): RecipeCategory {
  if (item.category) return item.category;
  const title = normalize(item.title);
  if (/\bbreakfast|morning|brunch\b/.test(title)) return "breakfast";
  if (/\blunch|midday|salad\b/.test(title)) return "lunch";
  if (/\bsnack|bite\b/.test(title)) return "snacks";
  return "dinner";
}

export function recipeCategoryLabel(item: RecipeCard): string {
  return RECIPE_LABELS[recipeCategoryFor(item)];
}

export function workoutCategoryFor(item: WorkoutCard): WorkoutCategory {
  if (item.category) return item.category;
  const title = normalize(`${item.title} ${item.focus ?? ""}`);
  const focusAreas = (item.focusAreas ?? []).map(normalize).join(" ");
  const haystack = `${title} ${focusAreas}`;
  if (/\bbreath|breathing|calm\b/.test(haystack)) return "breathing";
  if (/\bstretch|flexib|mobility\b/.test(haystack)) return "flexibility";
  if (/\bstrength|resistance|weights|core\b/.test(haystack)) return "strength";
  if (/\bcardio|walk|aerobic|hiit\b/.test(haystack)) return "cardio";
  return "low-impact";
}

export function workoutCategoryLabel(item: WorkoutCard): string {
  return WORKOUT_LABELS[workoutCategoryFor(item)];
}

export function durationLabel(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
}

export type MeditationCategory = "all" | "sleep" | "calm" | "reset";

const MEDITATION_LABELS: Record<MeditationCategory, string> = {
  all: "All",
  sleep: "Sleep",
  calm: "Calm",
  reset: "Wind Down",
};

export const MEDITATION_FILTER_OPTIONS = (
  Object.keys(MEDITATION_LABELS) as MeditationCategory[]
).map((id) => ({ id, label: MEDITATION_LABELS[id] }));

export function meditationCategoryFor(item: MeditationCard): Exclude<MeditationCategory, "all"> {
  const haystack = normalize(`${item.title} ${item.focus}`);
  if (/\bsleep|wind down|bed\b/.test(haystack)) return "sleep";
  if (/\breset|pause|reset\b/.test(haystack)) return "reset";
  return "calm";
}

export function meditationCategoryLabel(item: MeditationCard): string {
  return MEDITATION_LABELS[meditationCategoryFor(item)];
}