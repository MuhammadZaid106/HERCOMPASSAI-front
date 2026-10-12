import { Info } from "lucide-react";

/**
 * A compact safety note shown under every Snapshot observation.
 *
 * Recommendations in a Snapshot are educational ideas that may fit the goals a
 * member already logged. The note says that plainly and points to a clinician
 * for anything that actually bothers someone - never claiming the app treats,
 * cures, or diagnoses.
 */

interface SnapshotSafetyDisclosureProps {
  /** Optional backing phrase; defaults to the standard disclaimer. */
  note?: string;
}

export default function SnapshotSafetyDisclosure({ note }: SnapshotSafetyDisclosureProps) {
  return (
    <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-3">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-violet-600" aria-hidden />
      <p className="text-[11px] leading-relaxed text-slate-600">
        <span className="font-bold text-slate-800">This is context, not a prescription.</span>{" "}
        {note ??
          "These recommendations are educational ideas that may fit your current goals. They do not diagnose, treat, or replace talking with a clinician about anything that bothers you."}
      </p>
    </div>
  );
}