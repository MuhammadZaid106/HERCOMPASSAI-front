"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown, Flag, Loader2 } from "lucide-react";
import { aiClient, type AiFeature, type AiRating } from "@/lib/ai/aiClient";
import { AI_CONNECTION_MESSAGE } from "@/lib/ai/aiErrors";

/**
 * AI feedback control: Helpful / Not helpful / Report a concern.
 *
 * All three ratings are offered everywhere, because they do different jobs.
 * "Helpful" and "Not helpful" are quality signal. "Report a concern" is the one
 * that reaches a human: on the backend it opens a high-severity row in the review
 * queue (`ai_flags`), which is the only path from a member to a reviewer.
 *
 * Previously the rating lived only on the AI Lab test bench, so the one control
 * that matters for safety had no place on a page a member would actually visit.
 *
 * A concern always asks for a note. "Report a concern" with no explanation gives a
 * reviewer nothing to act on, and the member has already decided it is worth their
 * time, so asking is not a burden — skipping is the escape hatch.
 */
export interface AiFeedbackControlProps {
  /** The Gateway request this feedback is about. */
  requestId: string;
  feature: AiFeature;
  /** Tailwind text sizing to match the surrounding surface. */
  size?: "sm" | "md";
  className?: string;
}

type FeedbackState = "idle" | "sending" | "sent" | "error";

export default function AiFeedbackControl({
  requestId,
  feature,
  size = "sm",
  className = "",
}: AiFeedbackControlProps) {
  const [state, setState] = useState<FeedbackState>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [askingWhy, setAskingWhy] = useState(false);
  const [note, setNote] = useState("");

  const buttonBase =
    size === "sm"
      ? "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs"
      : "inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm";
  const idleButton = `${buttonBase} border-slate-200 font-semibold text-slate-600 transition hover:bg-slate-50`;

  async function send(rating: AiRating, comment?: string) {
    setState("sending");
    const res = await aiClient.feedback({ requestId, feature, rating, comment });

    if (res.ok) {
      setState("sent");
      setMessage(res.message || "Thank you — your feedback has been recorded.");
      setNote("");
      setAskingWhy(false);
      return;
    }

    // A 503 here means the backend had nowhere to record it. Saying "thank you"
    // would be a lie, and for "Report a concern" it is the one thing this control
    // must never do — the member would believe a human had been told.
    setState("error");
    setMessage(res.message || AI_CONNECTION_MESSAGE);
  }

  if (state === "sent") {
    return (
      <p className={`text-xs font-medium text-emerald-700 ${className}`} role="status">
        {message}
      </p>
    );
  }

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Was this useful?
        </span>
        <button
          type="button"
          disabled={state === "sending"}
          onClick={() => void send("helpful")}
          className={idleButton}
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          Helpful
        </button>
        <button
          type="button"
          disabled={state === "sending"}
          onClick={() => void send("not_helpful")}
          className={idleButton}
        >
          <ThumbsDown className="h-3.5 w-3.5" />
          Not helpful
        </button>
        <button
          type="button"
          disabled={state === "sending"}
          onClick={() => setAskingWhy((open) => !open)}
          className={`${buttonBase} border-rose-200 font-semibold text-rose-700 transition hover:bg-rose-50`}
        >
          <Flag className="h-3.5 w-3.5" />
          Report a concern
        </button>
        {state === "sending" && (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" aria-hidden />
        )}
      </div>

      {askingWhy && (
        <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50/60 p-3">
          <label
            htmlFor={`concern-${requestId}`}
            className="block text-xs font-semibold text-rose-900"
          >
            What concerned you?
          </label>
          <p className="mt-1 text-xs text-rose-800/80">
            This goes to our review team. Please don&apos;t include medical details we
            don&apos;t need.
          </p>
          <textarea
            id={`concern-${requestId}`}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
            placeholder="For example: it told me to stop taking a medication."
            className="mt-2 w-full rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-rose-400"
          />
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={state === "sending"}
              onClick={() => void send("report_concern", note.trim() || undefined)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
            >
              Send to the review team
            </button>
            <button
              type="button"
              onClick={() => setAskingWhy(false)}
              className="rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {message && state === "error" && (
        <p className="mt-2 text-xs font-medium text-rose-700" role="alert">
          {message}
        </p>
      )}
    </div>
  );
}
