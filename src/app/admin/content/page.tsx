"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  adminClient,
  type AdminContentPiece,
  type ContentKind,
} from "@/lib/admin/adminClient";
import { CONTENT_KIND_LABEL } from "@/lib/admin/labels";
import { TableSkeleton } from "@/components/ui/LoadState";

const STATUSES = ["draft", "in_review", "published", "archived"] as const;

const ALL_KINDS: ContentKind[] = [
  "recipe",
  "workout",
  "meditation",
  "article",
  "mens_academy",
  "partner_content",
  "evidence_explanation",
  "educational",
];

const PROSE_KINDS: ContentKind[] = ["article", "partner_content", "educational"];

function buildBody(
  kind: ContentKind,
  fields: {
    why: string;
    summary: string;
    paragraphs: string;
    evidenceIds: string;
    academyCategory: "basics" | "daily-life" | "relationship";
    academyEvidenceId: string;
  },
): Record<string, unknown> {
  const paragraphList = fields.paragraphs
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (kind === "recipe") {
    return { why: fields.why, ingredients: [], nutrition: "", focusHints: [] };
  }
  if (kind === "workout") {
    return { why: fields.why, focus: "", difficulty: "Beginner", focusHints: [] };
  }
  if (kind === "meditation") {
    return {
      why: fields.why,
      focus: "",
      minutes: 5,
      tier: "plus",
      focusHints: [],
      steps: [],
    };
  }
  if (kind === "mens_academy") {
    return {
      category: fields.academyCategory,
      version: "1",
      evidenceId: fields.academyEvidenceId.trim(),
      summary: fields.summary.trim(),
      paragraphs: paragraphList.length > 0 ? paragraphList : [fields.summary.trim() || "Draft"],
    };
  }
  if (kind === "evidence_explanation") {
    const ids = fields.evidenceIds
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
    return {
      evidenceIds: ids,
      summary: fields.summary.trim(),
      paragraphs: paragraphList.length > 0 ? paragraphList : [fields.summary.trim() || "Draft"],
    };
  }
  return {
    summary: fields.summary.trim(),
    paragraphs: paragraphList.length > 0 ? paragraphList : [fields.summary.trim() || "Draft"],
  };
}

export default function AdminContentPage() {
  const [kind, setKind] = useState("");
  const [pieces, setPieces] = useState<AdminContentPiece[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [newKind, setNewKind] = useState<ContentKind>("recipe");
  const [why, setWhy] = useState("");
  const [summary, setSummary] = useState("");
  const [paragraphs, setParagraphs] = useState("");
  const [evidenceIds, setEvidenceIds] = useState("");
  const [academyCategory, setAcademyCategory] = useState<"basics" | "daily-life" | "relationship">(
    "basics",
  );
  const [academyEvidenceId, setAcademyEvidenceId] = useState("");

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

  const showWhy = newKind === "recipe" || newKind === "workout" || newKind === "meditation";
  const showProse = PROSE_KINDS.includes(newKind) || newKind === "evidence_explanation";
  const showAcademy = newKind === "mens_academy";

  return (
    <AdminShell title="Content" subtitle="Library pieces across member and partner surfaces">
      <div className="space-y-6">
        <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
          A published piece is what members or partners can read when that route is wired.
          Evidence explanations require catalog ids that are still active.
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
            const body = buildBody(newKind, {
              why,
              summary,
              paragraphs,
              evidenceIds,
              academyCategory,
              academyEvidenceId,
            });
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
                setSummary("");
                setParagraphs("");
                setEvidenceIds("");
                setAcademyEvidenceId("");
                setError(null);
                load(kind);
              });
          }}
        >
          <label className="text-sm font-semibold text-slate-700">
            Kind
            <select
              value={newKind}
              onChange={(event) => setNewKind(event.target.value as ContentKind)}
              className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
            >
              {ALL_KINDS.map((value) => (
                <option key={value} value={value}>
                  {CONTENT_KIND_LABEL[value]}
                </option>
              ))}
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
          {showWhy && (
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
          )}
          {(showProse || showAcademy) && (
            <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
              Summary
              <textarea
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                required
                rows={2}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-normal"
              />
            </label>
          )}
          {(showProse || showAcademy) && (
            <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
              Paragraphs (one per line)
              <textarea
                value={paragraphs}
                onChange={(event) => setParagraphs(event.target.value)}
                rows={4}
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-normal"
              />
            </label>
          )}
          {newKind === "evidence_explanation" && (
            <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
              Evidence ids (comma-separated)
              <input
                value={evidenceIds}
                onChange={(event) => setEvidenceIds(event.target.value)}
                required
                placeholder="ev-nams-100, ev-acog-200"
                className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
              />
            </label>
          )}
          {showAcademy && (
            <>
              <label className="text-sm font-semibold text-slate-700">
                Academy category
                <select
                  value={academyCategory}
                  onChange={(event) =>
                    setAcademyCategory(
                      event.target.value as "basics" | "daily-life" | "relationship",
                    )
                  }
                  className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
                >
                  <option value="basics">Basics</option>
                  <option value="daily-life">Daily life</option>
                  <option value="relationship">Relationship</option>
                </select>
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Grounding evidence id
                <input
                  value={academyEvidenceId}
                  onChange={(event) => setAcademyEvidenceId(event.target.value)}
                  required
                  className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
                />
              </label>
            </>
          )}
          <button
            type="submit"
            className="h-11 rounded-xl bg-[#7C5CFC] px-5 text-sm font-semibold text-white sm:col-span-2"
          >
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
            {ALL_KINDS.map((value) => (
              <option key={value} value={value}>
                {CONTENT_KIND_LABEL[value]}
              </option>
            ))}
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
                  {CONTENT_KIND_LABEL[piece.kind] ?? piece.kind} ·{" "}
                  {piece.status.replace("_", " ")}
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
