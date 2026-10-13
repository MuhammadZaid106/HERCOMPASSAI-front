"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { memberClient } from "@/lib/member/memberClient";
import { contentClient, type ExploreCard } from "@/lib/member/contentClient";
import {
  exploreCategories,
  itemsForCategory,
  type ExploreCategoryId,
  exploreItems as FALLBACK_ITEMS,
} from "@/lib/explore/catalog";

function buildCategoryLabel(id: string): string {
  return exploreCategories.find((c) => c.id === id)?.label ?? id;
}

function filterByCategory(items: ExploreCard[], category: ExploreCategoryId, focus: string | null): ExploreCard[] {
  if (category === "for-you") {
    // If there's a focus area, show matching items; otherwise show starters
    if (focus) {
      const text = focus.toLowerCase();
      const focusMap: Record<string, string[]> = {
        sleep: ["sleep", "rest"],
        mood: ["mood", "nervous", "breath"],
        energy: ["energy", "metabolic"],
        nutrition: ["nutri", "weight"],
        stress: ["stress"],
        relationships: ["partner", "relationship"],
        menopause: ["vasomotor", "symptom", "hot"],
      };
      for (const [cat, keywords] of Object.entries(focusMap)) {
        if (keywords.some((kw) => text.includes(kw))) {
          return items.filter((item) => item.category === cat);
        }
      }
    }
    return items.filter((item) => item.starter);
  }
  return items.filter((item) => item.category === category);
}

function SkeletonCard() {
  return (
    <li className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse">
      <div className="h-3 w-20 rounded bg-slate-200" />
      <div className="mt-2 h-5 w-3/4 rounded bg-slate-200" />
      <div className="mt-2 space-y-1">
        <div className="h-3 w-full rounded bg-slate-100" />
        <div className="h-3 w-5/6 rounded bg-slate-100" />
      </div>
      <div className="mt-4 h-3 w-16 rounded bg-slate-200" />
    </li>
  );
}

export default function ExplorePage() {
  const [category, setCategory] = useState<ExploreCategoryId>("for-you");
  const [focus, setFocus] = useState<string | null>(null);
  const [apiItems, setApiItems] = useState<ExploreCard[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    // Fetch the user's snapshot focus (for For-You filtering)
    void memberClient.getDashboard().then((result) => {
      if (!active || !result.success || !result.data) return;
      setFocus(result.data.snapshot.dominantFocusArea);
    });

    // Fetch explore items from API (DB-first, falls back to code catalog on backend)
    void contentClient.listExploreItems().then((result) => {
      if (!active) return;
      if (result.success && result.data?.items?.length) {
        setApiItems(result.data.items);
      } else {
        // If API fails entirely, fall back to static catalog client-side
        setApiItems(null);
      }
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  // Use API items if available, else fall back to local catalog
  const allItems: ExploreCard[] = apiItems ?? FALLBACK_ITEMS;
  const items = filterByCategory(allItems, category, focus);
  const matched = category === "for-you" && focus;

  return (
    <div className="space-y-6 animate-fadeIn">
      <header>
        <p className="text-xs font-bold uppercase tracking-wider text-violet-700">
          Explore
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Decide what to explore next
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Short educational notes you can open beside your logs. They explain
          context. They do not diagnose.
        </p>
      </header>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {exploreCategories.map((item) => {
          const selected = item.id === category;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setCategory(item.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
                selected
                  ? "bg-violet-600 text-white"
                  : "bg-white text-slate-700 ring-1 ring-slate-200"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {category === "for-you" && (
        <p className="text-sm leading-relaxed text-slate-600">
          {matched
            ? `For You follows your Snapshot focus: ${focus}.`
            : "For You is a starting set until a Snapshot focus is available."}
        </p>
      )}

      {loading ? (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </ul>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/app/explore/${item.slug}`}
                className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-violet-700">
                  {buildCategoryLabel(item.category)}
                </p>
                <h2 className="mt-2 text-lg font-extrabold tracking-tight text-slate-900">
                  {item.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                  {item.why}
                </p>
                <p className="mt-4 text-xs font-semibold text-slate-500">
                  {item.minutes} minutes
                </p>
              </Link>
            </li>
          ))}
          {items.length === 0 && (
            <li className="col-span-3 rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
              No articles in this category yet.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
