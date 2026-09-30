"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { contentClient, type RecipeCard } from "@/lib/member/contentClient";

export default function RecipesPage() {
  const [items, setItems] = useState<RecipeCard[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void contentClient.listRecipes().then((result) => {
      if (!result.success || !result.data) {
        setError(result.message || "Recipes are unavailable right now.");
        return;
      }
      setItems(result.data.items);
    });
  }, []);

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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((item) => (
          <Link key={item.slug} href={`/app/recipes/${item.slug}`} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-extrabold text-slate-900">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.why}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
