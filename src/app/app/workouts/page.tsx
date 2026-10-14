"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Clock, ListChecks } from "lucide-react";
import { contentClient, type WorkoutCard } from "@/lib/member/contentClient";
import {
  WORKOUT_FILTER_OPTIONS,
  durationLabel,
  workoutCategoryFor,
  workoutCategoryLabel,
} from "@/lib/member/menuLabels";
import ContentFilterBar from "@/components/library/ContentFilterBar";
import EntitlementGate from "@/components/library/EntitlementGate";
import LibraryCardSkeleton from "@/components/library/LibraryCardSkeleton";

type WorkoutFilter = (typeof WORKOUT_FILTER_OPTIONS)[number]["id"];

export default function WorkoutsPage() {
  const [items, setItems] = useState<WorkoutCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<WorkoutFilter>("all");

  useEffect(() => {
    let active = true;
    void contentClient.listWorkouts().then((result) => {
      if (!active) return;
      setLoading(false);
      if (!result.success || !result.data) {
        setError(result.message || "Sessions are unavailable right now.");
        return;
      }
      setItems(result.data.items);
    });
    return () => {
      active = false;
    };
  }, []);

  const visible = items.filter((item) => workoutCategoryFor(item) === filter || filter === "all");
  const gated = visible.find((item) => !item.included);

  return (
    <div className="space-y-6 animate-fadeIn">
      <header>
        <p className="text-xs font-bold uppercase tracking-wider text-violet-700">Movement</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Workouts</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Short movement ideas. Stop if something hurts. These are not a training prescription.
        </p>
      </header>

      {error && <p className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}

      <ContentFilterBar
        label="Filter workouts by type"
        options={WORKOUT_FILTER_OPTIONS}
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
              href={`/app/workouts/${item.slug}`}
              className="flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold uppercase tracking-wider text-violet-700">
                  {workoutCategoryLabel(item)}
                </p>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                  {item.difficulty}
                </span>
              </div>
              <h2 className="mt-2 text-lg font-extrabold tracking-tight text-slate-900">{item.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{item.focus}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" aria-hidden />
                  {durationLabel(item.durationMinutes)}
                </span>
                {item.exercises.length > 0 && (
                  <span className="inline-flex items-center gap-1">
                    <ListChecks className="h-3.5 w-3.5" aria-hidden />
                    {item.exercises.length} moves
                  </span>
                )}
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
              description="Some sessions in the library are part of Plus and Premium. Your free workouts stay open, and the rest unlock with the upgrade."
            />
          </div>
        </div>
      )}

      <p className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs leading-relaxed text-slate-500">
        Stop any session if something hurts. These are activity ideas, not a training prescription.
      </p>
    </div>
  );
}