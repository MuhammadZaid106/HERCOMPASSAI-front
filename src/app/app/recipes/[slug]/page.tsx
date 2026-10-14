"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Clock, ListOrdered, UtensilsCrossed, Users } from "lucide-react";
import { contentClient, type RecipeCard } from "@/lib/member/contentClient";
import { recipeCategoryLabel } from "@/lib/member/menuLabels";
import EntitlementGate from "@/components/library/EntitlementGate";
import EvidenceCardMini from "@/components/library/EvidenceCardMini";
import RecipeNutritionBadge from "@/components/library/RecipeNutritionBadge";
import SaveToast from "@/components/library/SaveToast";
import { RecipeCardSkeleton } from "@/components/library/DetailSkeletons";

function MetaChip({
  icon: Icon,
  label,
}: {
  icon: typeof Clock;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">
      <Icon className="h-3.5 w-3.5 text-violet-600" aria-hidden />
      {label}
    </span>
  );
}

export default function RecipeDetailPage() {
  const params = useParams<{ slug: string }>();
  const [recipe, setRecipe] = useState<RecipeCard | null>(null);
  const [missing, setMissing] = useState(false);
  const [notes, setNotes] = useState<string | null>(null);

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
      setNotes(result.message || "We couldn't save that.");
      return;
    }
    setRecipe(result.data);
    setNotes(next.onPlan ? "Added to your plan." : next.saved ? "Recipe saved." : "Updated.");
  }

  if (missing) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-extrabold text-slate-900">This recipe is not in the library</h1>
        <Link href="/app/recipes" className="mt-4 inline-flex text-sm font-bold text-violet-700">
          Back to recipes
        </Link>
      </div>
    );
  }

  if (!recipe) return <RecipeCardSkeleton />;

  const gated = !recipe.included;

  return (
    <article className="mx-auto max-w-3xl space-y-6 animate-fadeIn">
      <header>
        <Link href="/app/recipes" className="text-sm font-bold text-violet-700">
          Back to recipes
        </Link>
        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-violet-700">
          Personalized recipe · {recipeCategoryLabel(recipe)}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {recipe.title}
        </h1>
        <div className="mt-4 flex flex-wrap gap-2">
          <MetaChip icon={Clock} label={`${recipe.prepMinutes} min prep`} />
          <MetaChip icon={Users} label={`${recipe.servings} serving${recipe.servings === 1 ? "" : "s"}`} />
          <MetaChip icon={ListOrdered} label={recipe.difficulty} />
        </div>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-extrabold text-slate-900">Why it may fit your goals</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{recipe.why}</p>
      </section>

      {gated && (
        <EntitlementGate description="This recipe is part of Plus and Premium. Your free recipes stay open, and this one unlocks with the upgrade." />
      )}

      <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-900">
          <UtensilsCrossed className="h-4 w-4 text-violet-600" aria-hidden />
          Ingredients
        </h2>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-600">
          {recipe.ingredients.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-5 sm:p-6">
        <h2 className="text-lg font-extrabold text-slate-900">Nutrition</h2>
        <div className="mt-3">
          <RecipeNutritionBadge macros={recipe.macroSummary} fallback="Approximate figures vary by serving." />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-slate-500">{recipe.nutrition}</p>
        <p className="mt-1 text-xs leading-relaxed text-slate-400">
          These are educational estimates, not clinical nutrition advice.
        </p>
      </section>

      {recipe.instructions.length > 0 && (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="text-lg font-extrabold text-slate-900">Make it</h2>
          <ol className="mt-3 space-y-3">
            {recipe.instructions.map((step, index) => (
              <li key={`${recipe.slug}-${index}`} className="flex gap-3 text-sm leading-relaxed text-slate-700">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-extrabold text-violet-800">
                  {index + 1}
                </span>
                <span className="pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {recipe.evidence.length > 0 && (
        <section>
          <h2 className="text-lg font-extrabold text-slate-900">Evidence behind this idea</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {recipe.evidence.map((source) => (
              <EvidenceCardMini key={source.source} source={source.source} note={source.note} />
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => void update({ saved: !recipe.saved, onPlan: recipe.onPlan })}
          disabled={gated}
          className="min-h-11 rounded-full bg-violet-600 px-5 text-sm font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {recipe.saved ? "Saved" : "Save Recipe"}
        </button>
        <button
          type="button"
          onClick={() => void update({ saved: true, onPlan: !recipe.onPlan })}
          disabled={gated}
          className="min-h-11 rounded-full border border-slate-300 px-5 text-sm font-bold text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {recipe.onPlan ? "On your plan" : "Add to Plan"}
        </button>
      </div>

      <p className="text-xs leading-relaxed text-slate-500">
        This is educational context. It does not diagnose, prescribe, or replace care from a clinician.
      </p>

      {notes && <SaveToast key={notes} message={notes} />}
    </article>
  );
}