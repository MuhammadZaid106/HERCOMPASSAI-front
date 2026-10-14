"use client";

import { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw, SkipForward } from "lucide-react";

/**
 * A timed, step-by-step guide used by workouts and meditation.
 *
 * The timer counts down each step and advances automatically when a step hits
 * zero. It is a visual pace-keeper only - there is no audio in v1 - and every
 * session page keeps a non-diagnostic note beside it. Progress is shown as a
 * ring plus a linear bar so both glance and exact reading work.
 */

export interface StepTimerStep {
  label: string;
  seconds: number;
  detail?: string;
}

export function clock(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

interface StepTimerProps {
  steps: StepTimerStep[];
  onComplete?: () => void;
  autoStart?: boolean;
}

export default function StepTimer({ steps, onComplete, autoStart = false }: StepTimerProps) {
  const [running, setRunning] = useState(autoStart);
  const [stepIndex, setStepIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(() => steps[0]?.seconds ?? 0);
  const [finished, setFinished] = useState(false);

  const totalSeconds = useMemo(
    () => steps.reduce((sum, step) => sum + Math.max(step.seconds, 0), 0),
    [steps],
  );

  useEffect(() => {
    if (!running || finished) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current > 1) return current - 1;
        if (stepIndex < steps.length - 1) {
          // Advance the step and start its clock together so the ring never
          // shows a stale value.
          setStepIndex(stepIndex + 1);
          return steps[stepIndex + 1]?.seconds ?? 0;
        }
        setRunning(false);
        setFinished(true);
        if (onComplete) onComplete();
        return 0;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running, finished, stepIndex, steps, onComplete]);

  // Guard against an empty list so the page never crashes on bad data.
  if (steps.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white px-4 py-6 text-center text-sm text-slate-500">
        Nothing to follow along with yet.
      </div>
    );
  }

  const elapsed = Math.max(totalSeconds - steps.reduce((sum, step, index) => sum + (index < stepIndex ? step.seconds : 0), 0) - secondsLeft, 0);
  const progress = totalSeconds > 0 ? elapsed / totalSeconds : 0;
  const ringRadius = 54;
  const ringCircumference = 2 * Math.PI * ringRadius;

  function restart() {
    setStepIndex(0);
    setSecondsLeft(steps[0]?.seconds ?? 0);
    setFinished(false);
    setRunning(true);
  }

  function nextStep() {
    if (stepIndex >= steps.length - 1) {
      setFinished(true);
      setRunning(false);
      if (onComplete) onComplete();
      return;
    }
    setRunning(false);
    setStepIndex((index) => index + 1);
    setRunning(true);
  }

  const current = steps[stepIndex];
  const mutedButton =
    "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-slate-300 px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      {finished ? (
        <div className="flex flex-col items-center gap-4 py-6 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Complete</p>
          <h3 className="text-lg font-extrabold text-slate-900">Well done</h3>
          <p className="max-w-md text-sm leading-relaxed text-slate-600">
            You followed every step. The timer is visual only - pause and stop
            whenever your body asks you to.
          </p>
          <button type="button" onClick={restart} className={mutedButton}>
            <RotateCcw className="h-4 w-4" aria-hidden />
            Restart
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
            <div className="relative flex h-32 w-32 items-center justify-center">
              <svg viewBox="0 0 128 128" className="h-32 w-32 -rotate-90">
                <circle cx="64" cy="64" r={ringRadius} fill="none" stroke="#E2E8F0" strokeWidth="10" />
                <circle
                  cx="64"
                  cy="64"
                  r={ringRadius}
                  fill="none"
                  stroke="#7C3AED"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={ringCircumference}
                  strokeDashoffset={ringCircumference * (1 - progress)}
                  className="transition-[stroke-dashoffset] duration-1000 ease-linear"
                />
              </svg>
              <span className="absolute text-2xl font-extrabold tabular-nums text-slate-900">
                {clock(secondsLeft)}
              </span>
            </div>
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <p className="text-[11px] font-bold uppercase tracking-wider text-violet-700">
                Step {stepIndex + 1} of {steps.length}
              </p>
              <h3 className="mt-1 text-xl font-extrabold tracking-tight text-slate-900">
                {current.label}
              </h3>
              {current.detail && (
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{current.detail}</p>
              )}
            </div>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-linear-to-r from-violet-600 to-indigo-500 transition-[width] duration-1000 ease-linear"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
          </div>

          <ol className="mt-5 space-y-2">
            {steps.map((step, index) => (
              <li
                key={`${step.label}-${index}`}
                aria-current={index === stepIndex ? "step" : undefined}
                className={`flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-sm ${
                  index === stepIndex
                    ? "bg-violet-50 font-bold text-violet-900 ring-1 ring-violet-200"
                    : index < stepIndex
                      ? "text-slate-500"
                      : "text-slate-700"
                }`}
              >
                <span className="min-w-0 leading-snug">{step.label}</span>
                <span className="shrink-0 text-xs font-semibold tabular-nums text-slate-400">
                  {clock(step.seconds)}
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => setRunning((value) => !value)}
              className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-violet-600 px-5 text-sm font-bold text-white transition hover:bg-violet-700"
            >
              {running ? (
                <>
                  <Pause className="h-4 w-4" aria-hidden />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" aria-hidden />
                  Resume
                </>
              )}
            </button>
            <button
              type="button"
              onClick={nextStep}
              disabled={stepIndex >= steps.length - 1}
              className={mutedButton}
            >
              <SkipForward className="h-4 w-4" aria-hidden />
              Next step
            </button>
            <button type="button" onClick={restart} className={mutedButton}>
              <RotateCcw className="h-4 w-4" aria-hidden />
              Restart
            </button>
          </div>

          <p className="mt-4 text-[11px] leading-relaxed text-slate-400">
            This timer is a visual pace-keeper. Pause or stop any time - your
            body decides the pace.
          </p>
        </>
      )}
    </div>
  );
}