import { BookOpenCheck } from "lucide-react";

/**
 * A compact source card used on recipe and workout detail pages.
 *
 * Each card names the approved source and paraphrases, in plain language, the
 * educational point it supports. It never overstates what the source proves.
 */

interface EvidenceCardMiniProps {
  source: string;
  note: string;
}

export default function EvidenceCardMini({ source, note }: EvidenceCardMiniProps) {
  return (
    <article className="flex gap-3 rounded-2xl border border-slate-200 bg-white p-4">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
        <BookOpenCheck className="h-4 w-4" aria-hidden />
      </span>
      <div className="min-w-0">
        <h4 className="text-sm font-extrabold text-slate-900">{source}</h4>
        <p className="mt-1 text-xs leading-relaxed text-slate-600">{note}</p>
      </div>
    </article>
  );
}