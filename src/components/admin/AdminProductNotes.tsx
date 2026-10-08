"use client";

import { useEffect, useState } from "react";
import { adminClient, type ProductNote } from "@/lib/admin/adminClient";
import { shortDate } from "@/lib/admin/labels";
import { TableSkeleton } from "@/components/ui/LoadState";

const THEMES = [
  "value",
  "friction",
  "trust",
  "ai_quality",
  "safety",
  "partner",
  "workplace",
  "retention",
  "missing",
  "payment",
] as const;

export function AdminProductNotes() {
  const [notes, setNotes] = useState<ProductNote[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  function load() {
    void adminClient.productNotes().then((result) => {
      if (!result.ok || !result.data) {
        setError(result.message || "Product notes are unavailable right now.");
        setNotes(null);
        return;
      }
      setError(null);
      setNotes(result.data.notes);
    });
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="mt-10 space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Product notes</h2>
        <p className="mt-1 max-w-2xl text-sm text-slate-600">
          These are the messages members already sent to support. A theme is a staff mark.
        </p>
      </div>
      {error && (
        <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </p>
      )}
      {!notes && !error && <TableSkeleton rows={3} />}
      {notes && notes.length === 0 && (
        <p className="rounded-2xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-600">
          Nothing here yet.
        </p>
      )}
      {notes && notes.length > 0 && (
        <ul className="space-y-3">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} onSaved={load} onError={setError} />
          ))}
        </ul>
      )}
    </section>
  );
}

function NoteCard({
  note,
  onSaved,
  onError,
}: {
  note: ProductNote;
  onSaved: () => void;
  onError: (message: string) => void;
}) {
  const [theme, setTheme] = useState(note.theme ?? "value");
  const [severity, setSeverity] = useState<string>(note.severity ?? "low");
  const [decision, setDecision] = useState<string>(note.decision ?? "open");
  const [resolution, setResolution] = useState(note.resolution);

  return (
    <li className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-semibold text-slate-900">{note.memberFirstName}</p>
        <p className="text-xs text-slate-500">{shortDate(note.createdAt)}</p>
      </div>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-violet-700">{note.topic}</p>
      {note.cohortName && <p className="mt-1 text-xs text-slate-500">{note.cohortName}</p>}
      <p className="mt-2 text-sm leading-relaxed text-slate-700">{note.message}</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <select
          aria-label="Theme"
          value={theme}
          onChange={(event) => setTheme(event.target.value)}
          className="h-10 rounded-xl border border-slate-300 px-2 text-sm"
        >
          {THEMES.map((item) => (
            <option key={item} value={item}>
              {item.replace("_", " ")}
            </option>
          ))}
        </select>
        <select
          aria-label="Severity"
          value={severity}
          onChange={(event) => setSeverity(event.target.value)}
          className="h-10 rounded-xl border border-slate-300 px-2 text-sm"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select
          aria-label="Decision"
          value={decision}
          onChange={(event) => setDecision(event.target.value)}
          className="h-10 rounded-xl border border-slate-300 px-2 text-sm"
        >
          <option value="open">Open</option>
          <option value="accepted">Accepted</option>
          <option value="parked">Parked</option>
        </select>
      </div>
      <textarea
        aria-label="Resolution"
        value={resolution}
        onChange={(event) => setResolution(event.target.value)}
        rows={2}
        placeholder="Resolution"
        className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
      />
      <button
        type="button"
        className="mt-2 h-10 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white"
        onClick={() => {
          void adminClient
            .saveProductNote(note.id, { theme, severity, decision, resolution })
            .then((result) => {
              if (!result.ok) {
                onError(result.message || "That note was not saved.");
                return;
              }
              onSaved();
            });
        }}
      >
        Save review
      </button>
    </li>
  );
}
