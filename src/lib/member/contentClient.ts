import { authClient } from "@/lib/auth/authClient";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

export interface RecipeMacros {
  proteinG: number;
  carbsG: number;
  fatG: number;
  caloriesKcal: number;
}

export interface ContentEvidence {
  source: string;
  note: string;
}

export type RecipeCategory = "breakfast" | "lunch" | "dinner" | "snacks";

export interface RecipeCard {
  slug: string;
  title: string;
  why: string;
  ingredients: string[];
  nutrition: string;
  category: RecipeCategory;
  prepMinutes: number;
  servings: number;
  difficulty: string;
  instructions: string[];
  macroSummary: RecipeMacros | null;
  included: boolean;
  evidence: ContentEvidence[];
  saved: boolean;
  onPlan: boolean;
}

export type WorkoutCategory =
  | "low-impact"
  | "flexibility"
  | "strength"
  | "cardio"
  | "breathing";

export interface WorkoutExercise {
  title: string;
  detail: string;
  reps: string;
  seconds?: number;
}

export interface WorkoutCard {
  slug: string;
  title: string;
  focus: string;
  difficulty: string;
  why: string;
  category: WorkoutCategory;
  durationMinutes: number;
  focusAreas: string[];
  included: boolean;
  exercises: WorkoutExercise[];
  evidence: ContentEvidence[];
  saved: boolean;
  started: boolean;
}

export interface MeditationCard {
  slug: string;
  title: string;
  focus: string;
  minutes: number;
  included: boolean;
  saved: boolean;
  started: boolean;
  why: string;
  steps: string[] | null;
  sourceName: string;
  sourceYear: number;
  sourceNote: string;
  plusMessage: string | null;
}

export interface ExploreEvidence {
  source: string;
  note: string;
}

export interface ExploreCard {
  slug: string;
  title: string;
  category: string;
  minutes: number;
  why: string;
  tryThis: string;
  tryHref: string;
  tryLabel: string;
  evidence: ExploreEvidence[];
  starter: boolean;
  sections?: Array<{ heading: string; body: string }>;
  actions?: Array<{ label: string; href: string }>;
}

interface ApiResult<T> {
  success: boolean;
  message: string;
  data?: T;
}

async function request<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const response = await authClient.authenticatedFetch(`${API_BASE}${path}`, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
    return (await response.json().catch(() => ({
      success: false,
      message: "Network error",
    }))) as ApiResult<T>;
  } catch {
    return {
      success: false,
      message: "We couldn't reach HerCompass just now. Your information is safe.",
    };
  }
}

export const contentClient = {
  listRecipes: () => request<{ items: RecipeCard[] }>("/api/member/recipes"),
  getRecipe: (slug: string) => request<RecipeCard>(`/api/member/recipes/${slug}`),
  saveRecipe: (slug: string, body: { saved: boolean; onPlan: boolean }) =>
    request<RecipeCard>(`/api/member/recipes/${slug}`, { method: "PUT", body: JSON.stringify(body) }),
  listWorkouts: () => request<{ items: WorkoutCard[] }>("/api/member/workouts"),
  getWorkout: (slug: string) => request<WorkoutCard>(`/api/member/workouts/${slug}`),
  saveWorkout: (slug: string, body: { saved: boolean; started: boolean }) =>
    request<WorkoutCard>(`/api/member/workouts/${slug}`, { method: "PUT", body: JSON.stringify(body) }),
  listMeditations: () =>
    request<{ suggestion: string; suggestedSlug: string; items: MeditationCard[] }>("/api/member/meditation"),
  getMeditation: (slug: string) => request<MeditationCard>(`/api/member/meditation/${slug}`),
  saveMeditation: (slug: string, body: { saved: boolean; started: boolean }) =>
    request<MeditationCard>(`/api/member/meditation/${slug}`, { method: "PUT", body: JSON.stringify(body) }),
  listExploreItems: () => request<{ items: ExploreCard[] }>("/api/member/explore"),
  getExploreItem: (slug: string) => request<ExploreCard>(`/api/member/explore/${slug}`),
};
