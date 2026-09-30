"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { contentClient, type WorkoutCard } from "@/lib/member/contentClient";

export default function WorkoutDetailPage() {
  const params = useParams<{ slug: string }>();
  const [workout, setWorkout] = useState<WorkoutCard | null>(null);
  const [missing, setMissing] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    void contentClient.getWorkout(params.slug).then((result) => {
      if (!result.success || !result.data) {
        setMissing(true);
        return;
      }
      setWorkout(result.data);
    });
  }, [params.slug]);

  async function update(next: { saved: boolean; started: boolean }) {
    if (!workout) return;
    const result = await contentClient.saveWorkout(workout.slug, next);
    if (!result.success || !result.data) {
      setNote(result.message || "We couldn't save that.");
      return;
    }
    setWorkout(result.data);
    setNote(next.started ? "Session started." : next.saved ? "Session saved." : "Updated.");
  }

  if (missing) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <h1 className="text-xl font-extrabold text-slate-900">This session is not in the library</h1>
        <Link href="/app/workouts" className="mt-4 inline-flex text-sm font-bold text-violet-700">Back to workouts</Link>
      </div>
    );
  }

  if (!workout) return <p className="text-sm text-slate-500">Loading session...</p>;

  return (
    <article className="mx-auto max-w-3xl space-y-6 animate-fadeIn">
      <header>
        <Link href="/app/workouts" className="text-sm font-bold text-violet-700">← Workouts</Link>
        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-violet-700">Recommended movement</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{workout.title}</h1>
      </header>
      <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
        <p className="text-sm text-slate-700"><span className="font-bold">Focus: </span>{workout.focus}</p>
        <p className="mt-2 text-sm text-slate-700"><span className="font-bold">Difficulty: </span>{workout.difficulty}</p>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{workout.why}</p>
      </section>
      <div className="flex flex-col gap-2 sm:flex-row">
        <button type="button" onClick={() => void update({ saved: workout.saved, started: true })} className="min-h-11 rounded-full bg-violet-600 px-5 text-sm font-bold text-white">
          {workout.started ? "Started" : "Start Workout"}
        </button>
        <button type="button" onClick={() => void update({ saved: !workout.saved, started: workout.started })} className="min-h-11 rounded-full border border-slate-300 px-5 text-sm font-bold text-slate-800">
          {workout.saved ? "Saved" : "Save"}
        </button>
      </div>
      {note && <p className="text-sm text-slate-600">{note}</p>}
    </article>
  );
}
