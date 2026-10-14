"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock, Users } from "lucide-react";
import { contentClient, type RecipeCard } from "@/lib/member/contentClient";
import { RECIPE_FILTER_OPTIONS, recipeCategoryFor, recipeCategoryLabel } from "@/lib/member/menuLabels";
import ContentFilterBar from "@/components/library/ContentFilterBar";
import EntitlementGate from "@/components/library/EntitlementGate";
import RecipeNutritionBadge from "@/components/library/RecipeNutritionBadge";
import LibraryCardSkeleton from "@/components/library/LibraryCardSkeleton";

type RecipeFilter = (typeof RECIPE_FILTER_OPTIONS)[number]["id"];

export default function RecipesPage() {
  const [items, setItems] = useState<RecipeCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<RecipeFilter>("all");

  useEffect(() => {
    let active = true;
    void contentClient.listRecipes().then((result) => {
      if (!active) return;
      setLoading(false);
      if (!result.success || !result.data) {
        setError(result.message || "Recipes are unavailable right now.");
        return;
      }
      setItems(result.data.items);
    });
    return () => {
      active = false;
    };
  }, []);

  const visible = items.filter((item) => recipeCategoryFor(item) === filter || filter === "all");
  const gated = visible.find((item) => !item.included);

  return (
    <div className="space-y-6 animate-fadeIn">
      <header>
        <p className="text-xs font-bold uppercase tracking-wider text-violet-700">Nutrition</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Recipes</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Food ideas that may fit a goal you already logged. They are educational. They are not a prescribed diet.
        </p>
      </header>

      {error && <p className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}

      <ContentFilterBar
        label="Filter recipes by meal"
        options={RECIPE_FILTER_OPTIONS}
        active={filter}
        onChange={setFilter}
      />

      {loading ? (
        <LibraryCardSkeleton />
      ) : visible.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
          Nothing here yet.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <Link
              key={item.slug}
              href={`/app/recipes/${item.slug}`}
              className="flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold uppercase tracking-wider text-violet-700">
                  {recipeCategoryLabel(item)}
                </p>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                  {item.difficulty}
                </span>
              </div>
              <h2 className="mt-2 text-lg font-extrabold tracking-tight text-slate-900">{item.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{item.why}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  {item.prepMinutes} min prep
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" aria-hidden />
                  {item.servings} serving{item.servings === 1 ? "" : "s"}
                </span>
              </div>
              <div className="mt-3">
                <RecipeNutritionBadge macros={item.macroSummary} />
              </div>
              {!item.included && (
                <p className="mt-3 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-bold text-violet-800">
                  Go deeper with HerCompass Plus.
                </p>
              )}
            </Link>
          ))}
        </div>
      )}

      {gated && (
        <div className="flex justify-center">
          <div className="w-full max-w-3xl">
            <EntitlementGate
              description="Some recipes in the library are part of Plus and Premium. They sit beside your free meals and open whenever you upgrade."
            />
          </div>
        </div>
      )}

      <p className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs leading-relaxed text-slate-500">
        Nutrition figures shown are approximate and educational. They are not clinical nutrition advice. Free recipes are
        included with every plan.
      </p>
    </div>
  );
}