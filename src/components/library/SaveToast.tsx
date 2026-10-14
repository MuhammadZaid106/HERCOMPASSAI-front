"use client";

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";

/**
 * A transient toast confirming saves and plan additions.
 *
 * Pages render it with a `key={message}` so every new message remounts the
 * toast, slides in fresh, and dismisses itself after a beat. Keeping it local
 * means one component tables the state for an entire library page instead of
 * wiring a global store.
 */

interface SaveToastProps {
  message: string;
  durationMs?: number;
}

const DEFAULT_TOAST_MS = 2600;

export default function SaveToast({ message, durationMs = DEFAULT_TOAST_MS }: SaveToastProps) {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setHidden(true), durationMs);
    return () => window.clearTimeout(timer);
  }, [durationMs]);

  if (hidden) return null;

  return (
    <div role="status" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      <p className="flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg">
        <CheckCircle2 className="h-4 w-4 text-emerald-400" aria-hidden />
        {message}
      </p>
    </div>
  );
}