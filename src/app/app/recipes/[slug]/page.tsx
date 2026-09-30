"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { contentClient, type RecipeCard } from "@/lib/member/contentClient";

export default function RecipeDetailPage() {
  const params = useParams<{ slug: string }>();
  const [recipe, setRecipe] = useState<RecipeCard | null>(null);
  const [missing, setMissing] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    void contentClient.getRecipe(params.slug).then((result) => {
      if (!result.success || !result.data) {
        setMissing(true);
        return;
      }
      setRecipe(result.data);
    });
  }, [params.slug]);

  async function update(next: { saved: boolean; onPlan: boolean }) {
    if (!recipe) return;
    const result = await contentClient.saveRecipe(recipe.slug, next);
    if (!result.success || !result.data) {
      setNote(result.message || "We couldn't save that.");
      return;
    }
    setRecipe(result.data);
    setNote(next.onPlan ? "Added to your plan." : next.saved ? "Recipe saved." : "Updated.");
  }

  if (missing) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-extrabold text-slate-900">This recipe is not in the library</h1>
        <Link href="/app/recipes" className="mt-4 inline-flex text-sm font-bold text-violet-700">Back to recipes</Link>
      </div>
    );
  }

  if (!recipe) return <p className="text-sm text-slate-500">Loading recipe...</p>;

  return (
    <article className="mx-auto max-w-3xl space-y-6 animate-fadeIn">
      <header>
        <Link href="/app/recipes" className="text-sm font-bold text-violet-700">← Recipes</Link>
        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-violet-700">Personalized recipe</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{recipe.title}</h1>
      </header>
      <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-extrabold text-slate-900">Why it may fit your goals</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{recipe.why}</p>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-extrabold text-slate-900">Ingredients</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
          {recipe.ingredients.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-extrabold text-slate-900">Nutrition</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{recipe.nutrition}</p>
      </section>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button type="button" onClick={() => void update({ saved: !recipe.saved, onPlan: recipe.onPlan })} className="min-h-11 rounded-full bg-violet-600 px-5 text-sm font-bold text-white">
          {recipe.saved ? "Saved" : "Save Recipe"}
        </button>
        <button type="button" onClick={() => void update({ saved: true, onPlan: !recipe.onPlan })} className="min-h-11 rounded-full border border-slate-300 px-5 text-sm font-bold text-slate-800">
          {recipe.onPlan ? "On your plan" : "Add to Plan"}
        </button>
      </div>
      {note && <p className="text-sm text-slate-600">{note}</p>}
    </article>
  );
}
