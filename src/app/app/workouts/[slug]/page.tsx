"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Clock, Dumbbell, TimerReset } from "lucide-react";
import { contentClient, type WorkoutCard } from "@/lib/member/contentClient";
import { durationLabel, workoutCategoryLabel } from "@/lib/member/menuLabels";
import EntitlementGate from "@/components/library/EntitlementGate";
import EvidenceCardMini from "@/components/library/EvidenceCardMini";
import SaveToast from "@/components/library/SaveToast";
import StepTimer, { type StepTimerStep } from "@/components/library/StepTimer";
import { WorkoutCardSkeleton } from "@/components/library/DetailSkeletons";

const DEFAULT_MOVE_SECONDS = 45;

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

export default function WorkoutDetailPage() {
  const params = useParams<{ slug: string }>();
  const [workout, setWorkout] = useState<WorkoutCard | null>(null);
  const [missing, setMissing] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [gating, setGating] = useState(false);

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
    setGating(true);
    const result = await contentClient.saveWorkout(workout.slug, next);
    setGating(false);
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
        <Link href="/app/workouts" className="mt-4 inline-flex text-sm font-bold text-violet-700">
          Back to workouts
        </Link>
      </div>
    );
  }

  if (!workout) return <WorkoutCardSkeleton />;

  const gated = !workout.included;
  const steps: StepTimerStep[] =
    workout.exercises.length > 0
      ? workout.exercises.map((exercise) => ({
          label: exercise.title,
          seconds: exercise.seconds ?? DEFAULT_MOVE_SECONDS,
          detail: exercise.reps,
        }))
      : [
          {
            label: workout.title,
            seconds: workout.durationMinutes * 60,
            detail: workout.focus,
          },
        ];

  return (
    <article className="mx-auto max-w-3xl space-y-6 animate-fadeIn">
      <header>
        <Link href="/app/workouts" className="text-sm font-bold text-violet-700">
          Back to workouts
        </Link>
        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-violet-700">
          Recommended movement · {workoutCategoryLabel(workout)}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{workout.title}</h1>
        <div className="mt-4 flex flex-wrap gap-2">
          <MetaChip icon={Clock} label={durationLabel(workout.durationMinutes)} />
          <MetaChip icon={TimerReset} label={workout.difficulty} />
        </div>
      </header>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-900">
          <Dumbbell className="h-4 w-4 text-violet-600" aria-hidden />
          About this session
        </h2>
        <p className="mt-2 text-sm text-slate-700">
          <span className="font-bold">Focus: </span>
          {workout.focus}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{workout.why}</p>
      </section>

      {gated && (
        <EntitlementGate description="This session is part of Plus and Premium. Your free workouts stay open, and this one unlocks with the upgrade." />
      )}

      {!gated && (
        <>
          <StepTimer
            steps={steps}
            autoStart={workout.started}
            onComplete={() => setNote("Session finished. Well done.")}
          />
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => void update({ saved: workout.saved, started: true })}
              disabled={gating}
              className="min-h-11 rounded-full bg-violet-600 px-5 text-sm font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {workout.started ? "Started" : "Start Workout"}
            </button>
            <button
              type="button"
              onClick={() => void update({ saved: !workout.saved, started: workout.started })}
              disabled={gating}
              className="min-h-11 rounded-full border border-slate-300 px-5 text-sm font-bold text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {workout.saved ? "Saved" : "Save"}
            </button>
          </div>
        </>
      )}

      {workout.evidence.length > 0 && (
        <section>
          <h2 className="text-lg font-extrabold text-slate-900">Evidence behind this session</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {workout.evidence.map((source) => (
              <EvidenceCardMini key={source.source} source={source.source} note={source.note} />
            ))}
          </div>
        </section>
      )}

      <p className="text-xs leading-relaxed text-slate-500">
        This is educational context. It does not diagnose, prescribe, or replace care from a clinician. Stop if
        something hurts.
      </p>

      {note && <SaveToast key={note} message={note} />}
    </article>
  );
}