import { authClient } from "@/lib/auth/authClient";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

export interface RecipeCard {
  slug: string;
  title: string;
  why: string;
  ingredients: string[];
  nutrition: string;
  saved: boolean;
  onPlan: boolean;
}

export interface WorkoutCard {
  slug: string;
  title: string;
  focus: string;
  difficulty: string;
  why: string;
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

interface ApiResult<T> {
  success: boolean;
  message: string;
  data?: T;
}

async function request<T>(path: string, init?: RequestInit): Promise<ApiResult<T>> {
  const response = await authClient.authenticatedFetch(`${API_BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  return (await response.json()) as ApiResult<T>;
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
};
