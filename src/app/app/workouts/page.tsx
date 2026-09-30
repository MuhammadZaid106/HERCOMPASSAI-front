"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { contentClient, type WorkoutCard } from "@/lib/member/contentClient";

export default function WorkoutsPage() {
  const [items, setItems] = useState<WorkoutCard[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void contentClient.listWorkouts().then((result) => {
      if (!result.success || !result.data) {
        setError(result.message || "Sessions are unavailable right now.");
        return;
      }
      setItems(result.data.items);
    });
  }, []);

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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {items.map((item) => (
          <Link key={item.slug} href={`/app/workouts/${item.slug}`} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="text-lg font-extrabold text-slate-900">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{item.focus}</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">{item.difficulty}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
