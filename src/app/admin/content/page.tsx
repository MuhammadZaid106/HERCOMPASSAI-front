"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminClient, type AdminContentPiece } from "@/lib/admin/adminClient";
import { TableSkeleton } from "@/components/ui/LoadState";

const STATUSES = ["draft", "in_review", "published", "archived"] as const;

export default function AdminContentPage() {
  const [kind, setKind] = useState("");
  const [pieces, setPieces] = useState<AdminContentPiece[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [newKind, setNewKind] = useState<"recipe" | "workout" | "meditation">("recipe");
  const [why, setWhy] = useState("");

  function load(nextKind: string) {
    void adminClient.content(nextKind).then((result) => {
      if (!result.ok || !result.data) {
        setError(result.message || "Content is unavailable right now.");
        setPieces(null);
        return;
      }
      setError(null);
      setPieces(result.data.pieces);
    });
  }

  useEffect(() => {
    load(kind);
  }, [kind]);

  return (
    <AdminShell title="Content" subtitle="Recipes, workouts, and meditations">
      <div className="space-y-6">
        <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
          A published piece is what members see. Academy lessons stay in code,
          because they are tied to approved evidence cards.
        </p>
        {error && (
          <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </p>
        )}
        <form
          className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            const body =
              newKind === "recipe"
                ? { why, ingredients: [], nutrition: "", focusHints: [] }
                : newKind === "workout"
                  ? { why, focus: "", difficulty: "Beginner", focusHints: [] }
                  : { why, focus: "", minutes: 5, tier: "plus", focusHints: [], steps: [] };
            void adminClient
              .createContent({ kind: newKind, title, slug, body })
              .then((result) => {
                if (!result.ok) {
                  setError(result.message || "That draft was not saved.");
                  return;
                }
                setTitle("");
                setSlug("");
                setWhy("");
                setError(null);
                load(kind);
              });
          }}
        >
          <label className="text-sm font-semibold text-slate-700">
            Kind
            <select
              value={newKind}
              onChange={(event) => setNewKind(event.target.value as typeof newKind)}
              className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
            >
              <option value="recipe">Recipe</option>
              <option value="workout">Workout</option>
              <option value="meditation">Meditation</option>
            </select>
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Title
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Slug
            <input
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
              required
              pattern="[a-z0-9-]+"
              className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
            Why this is here
            <textarea
              value={why}
              onChange={(event) => setWhy(event.target.value)}
              required
              rows={3}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-normal"
            />
          </label>
          <button type="submit" className="h-11 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white sm:col-span-2">
            Save draft
          </button>
        </form>
        <label className="block max-w-xs text-sm font-semibold text-slate-700">
          Show
          <select
            value={kind}
            onChange={(event) => setKind(event.target.value)}
            className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm font-normal"
          >
            <option value="">All kinds</option>
            <option value="recipe">Recipes</option>
            <option value="workout">Workouts</option>
            <option value="meditation">Meditations</option>
          </select>
        </label>
        {!pieces && !error && <TableSkeleton rows={4} />}
        {pieces && pieces.length === 0 && (
          <p className="rounded-2xl border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-600">
            Nothing here yet.
          </p>
        )}
        {pieces && pieces.length > 0 && (
          <ul className="space-y-3">
            {pieces.map((piece) => (
              <li key={piece.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {piece.kind} · {piece.status.replace("_", " ")}
                </p>
                <p className="mt-1 font-semibold text-slate-900">{piece.title}</p>
                <p className="mt-1 text-xs text-slate-500">{piece.slug}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {STATUSES.map((status) => (
                    <button
                      key={status}
                      type="button"
                      disabled={piece.status === status}
                      className="h-9 rounded-lg border border-slate-300 px-3 text-xs font-semibold text-slate-700 disabled:opacity-40"
                      onClick={() => {
                        void adminClient.updateContent(piece.id, { status }).then((result) => {
                          if (!result.ok) {
                            setError(result.message || "That status was not saved.");
                            return;
                          }
                          load(kind);
                        });
                      }}
                    >
                      {status.replace("_", " ")}
                    </button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminShell>
  );
}
