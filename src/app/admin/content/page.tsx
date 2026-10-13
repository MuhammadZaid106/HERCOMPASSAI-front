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
  "partner_activity",
  "couple_challenge",
  "explore",
  "evidence_explanation",
  "educational",
];

const PROSE_KINDS: ContentKind[] = ["article", "partner_content", "educational"];

interface BuildFields {
  why: string;
  summary: string;
  paragraphs: string;
  evidenceIds: string;
  ingredients: string;
  nutrition: string;
  focusHints: string;
  workoutFocus: string;
  difficulty: string;
  meditationFocus: string;
  meditationMinutes: number;
  meditationTier: "free" | "plus";
  meditationSteps: string;
  academyCategory: "basics" | "daily-life" | "relationship" | "workplace" | "sleep-intimacy";
  academyEvidenceId: string;
  academyTrackNumber: string;
  academyDuration: string;
  academyTakeaway: string;
  academyListenContext: string;
  activityLabel: string;
  activitySuggestion: string;
  activityEvidenceId: string;
  challengeCategory: string;
  challengeDescription: string;
  challengeBenefit: string;
}

function buildBody(kind: ContentKind, fields: BuildFields): Record<string, unknown> {
  const paragraphList = fields.paragraphs
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const hints = fields.focusHints
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);

  if (kind === "recipe") {
    const ingredientList = fields.ingredients
      .split("\n")
      .map((i) => i.trim())
      .filter(Boolean);
    return {
      why: fields.why.trim(),
      ingredients: ingredientList,
      nutrition: fields.nutrition.trim() || "Balanced protein, healthy fats, fiber.",
      focusHints: hints.length > 0 ? hints : ["energy", "cooling"],
    };
  }

  if (kind === "workout") {
    return {
      focus: fields.workoutFocus.trim() || "Mobility & Strength",
      difficulty: fields.difficulty || "Beginner",
      why: fields.why.trim(),
      focusHints: hints.length > 0 ? hints : ["mobility", "gentle"],
    };
  }

  if (kind === "meditation") {
    const stepList = fields.meditationSteps
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    return {
      why: fields.why.trim(),
      focus: fields.meditationFocus.trim() || "Evening Calm",
      minutes: Number(fields.meditationMinutes) || 5,
      tier: fields.meditationTier,
      focusHints: hints.length > 0 ? hints : ["sleep", "stress"],
      steps: stepList.length > 0 ? stepList : ["Find a comfortable seated position.", "Focus on gentle breathing."],
    };
  }

  if (kind === "mens_academy") {
    return {
      category: fields.academyCategory,
      version: "1.0",
      evidenceId: fields.academyEvidenceId.trim(),
      summary: fields.summary.trim(),
      paragraphs: paragraphList.length > 0 ? paragraphList : [fields.summary.trim() || "Draft"],
      trackNumber: fields.academyTrackNumber.trim() || "01",
      duration: fields.academyDuration.trim() || "3:00",
      takeaway: fields.academyTakeaway.trim() || fields.summary.trim(),
      listenContext: fields.academyListenContext.trim() || "Recommended listening for partners.",
    };
  }

  if (kind === "partner_activity") {
    return {
      label: fields.activityLabel.trim() || fields.why.trim() || "Shared Walk",
      suggestion: fields.activitySuggestion.trim() || fields.why.trim() || "A gentle walk together.",
      evidenceId: fields.activityEvidenceId.trim() || "ev-nams-001",
    };
  }

  if (kind === "couple_challenge") {
    return {
      category: fields.challengeCategory.trim() || "Sleep Harmony",
      description: fields.challengeDescription.trim() || fields.summary.trim() || "Cooling evening protocol.",
      benefit: fields.challengeBenefit.trim() || "Reduces middle-of-the-night awakenings.",
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

  // Shared fields
  const [why, setWhy] = useState("");
  const [summary, setSummary] = useState("");
  const [paragraphs, setParagraphs] = useState("");
  const [evidenceIds, setEvidenceIds] = useState("");
  const [focusHints, setFocusHints] = useState("");

  // Recipe fields
  const [ingredients, setIngredients] = useState("");
  const [nutrition, setNutrition] = useState("");

  // Workout fields
  const [workoutFocus, setWorkoutFocus] = useState("");
  const [difficulty, setDifficulty] = useState("Beginner");

  // Meditation fields
  const [meditationFocus, setMeditationFocus] = useState("");
  const [meditationMinutes, setMeditationMinutes] = useState(5);
  const [meditationTier, setMeditationTier] = useState<"free" | "plus">("plus");
  const [meditationSteps, setMeditationSteps] = useState("");

  // Men's Academy fields
  const [academyCategory, setAcademyCategory] = useState<
    "basics" | "daily-life" | "relationship" | "workplace" | "sleep-intimacy"
  >("basics");
  const [academyEvidenceId, setAcademyEvidenceId] = useState("");
  const [academyTrackNumber, setAcademyTrackNumber] = useState("01");
  const [academyDuration, setAcademyDuration] = useState("3:00");
  const [academyTakeaway, setAcademyTakeaway] = useState("");
  const [academyListenContext, setAcademyListenContext] = useState("");

  // Partner Activity fields
  const [activityLabel, setActivityLabel] = useState("");
  const [activitySuggestion, setActivitySuggestion] = useState("");
  const [activityEvidenceId, setActivityEvidenceId] = useState("");

  // Couple Challenge fields
  const [challengeCategory, setChallengeCategory] = useState("Sleep Harmony");
  const [challengeDescription, setChallengeDescription] = useState("");
  const [challengeBenefit, setChallengeBenefit] = useState("");

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
  const showActivity = newKind === "partner_activity";
  const showChallenge = newKind === "couple_challenge";

  function resetForm() {
    setTitle("");
    setSlug("");
    setWhy("");
    setSummary("");
    setParagraphs("");
    setEvidenceIds("");
    setFocusHints("");
    setIngredients("");
    setNutrition("");
    setWorkoutFocus("");
    setMeditationFocus("");
    setMeditationSteps("");
    setAcademyEvidenceId("");
    setAcademyTakeaway("");
    setAcademyListenContext("");
    setActivityLabel("");
    setActivitySuggestion("");
    setActivityEvidenceId("");
    setChallengeDescription("");
    setChallengeBenefit("");
    setError(null);
  }

  return (
    <AdminShell title="Content" subtitle="Library pieces across member and partner surfaces">
      <div className="space-y-6">
        <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
          A published piece is what members or partners can read across the platform.
          Create recipes, workouts, meditations, articles, partner activities, or Academy lessons below.
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
              ingredients,
              nutrition,
              focusHints,
              workoutFocus,
              difficulty,
              meditationFocus,
              meditationMinutes,
              meditationTier,
              meditationSteps,
              academyCategory,
              academyEvidenceId,
              academyTrackNumber,
              academyDuration,
              academyTakeaway,
              academyListenContext,
              activityLabel,
              activitySuggestion,
              activityEvidenceId,
              challengeCategory,
              challengeDescription,
              challengeBenefit,
            });
            void adminClient
              .createContent({ kind: newKind, title, slug, body })
              .then((result) => {
                if (!result.ok) {
                  setError(result.message || "That draft was not saved.");
                  return;
                }
                resetForm();
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
                  {CONTENT_KIND_LABEL[value] ?? value}
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
              placeholder="e.g. Mediterranean Cooling Bowl"
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
              placeholder="e.g. mediterranean-cooling-bowl"
              className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
            />
          </label>

          {/* Focus hints for wellness pieces */}
          {(newKind === "recipe" || newKind === "workout" || newKind === "meditation") && (
            <label className="text-sm font-semibold text-slate-700">
              Focus tags (comma-separated)
              <input
                value={focusHints}
                onChange={(event) => setFocusHints(event.target.value)}
                placeholder="e.g. cooling, sleep, energy, bone"
                className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
              />
            </label>
          )}

          {showWhy && (
            <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
              Why this is here
              <textarea
                value={why}
                onChange={(event) => setWhy(event.target.value)}
                required
                rows={2}
                placeholder="Clinical or nutritional rationale..."
                className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-normal"
              />
            </label>
          )}

          {/* Recipe fields */}
          {newKind === "recipe" && (
            <>
              <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                Ingredients (one per line)
                <textarea
                  value={ingredients}
                  onChange={(event) => setIngredients(event.target.value)}
                  rows={3}
                  placeholder="1 cup cooked quinoa&#10;1/2 ripe avocado&#10;1 cup fresh spinach"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-normal"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                Nutrition macro summary
                <input
                  value={nutrition}
                  onChange={(event) => setNutrition(event.target.value)}
                  placeholder="e.g. 420 kcal | 18g Protein | 16g Healthy Fats | 9g Fiber"
                  className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
                />
              </label>
            </>
          )}

          {/* Workout fields */}
          {newKind === "workout" && (
            <>
              <label className="text-sm font-semibold text-slate-700">
                Focus Area
                <input
                  value={workoutFocus}
                  onChange={(event) => setWorkoutFocus(event.target.value)}
                  placeholder="e.g. Pelvic Mobility & Restorative Flow"
                  className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Difficulty
                <select
                  value={difficulty}
                  onChange={(event) => setDifficulty(event.target.value)}
                  className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Gentle">Gentle</option>
                </select>
              </label>
            </>
          )}

          {/* Meditation fields */}
          {newKind === "meditation" && (
            <>
              <label className="text-sm font-semibold text-slate-700">
                Focus
                <input
                  value={meditationFocus}
                  onChange={(event) => setMeditationFocus(event.target.value)}
                  placeholder="e.g. Down-Regulating Breathwork"
                  className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Duration (minutes)
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={meditationMinutes}
                  onChange={(event) => setMeditationMinutes(Number(event.target.value))}
                  className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Tier Access
                <select
                  value={meditationTier}
                  onChange={(event) => setMeditationTier(event.target.value as "free" | "plus")}
                  className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
                >
                  <option value="free">Free Tier</option>
                  <option value="plus">Plus / Premium</option>
                </select>
              </label>
              <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                Guidance Steps (one per line)
                <textarea
                  value={meditationSteps}
                  onChange={(event) => setMeditationSteps(event.target.value)}
                  rows={3}
                  placeholder="Settle into a comfortable posture&#10;Inhale for 4 seconds, exhale for 6 seconds&#10;Notice tension gently releasing"
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-normal"
                />
              </label>
            </>
          )}

          {/* Academy fields */}
          {showAcademy && (
            <>
              <label className="text-sm font-semibold text-slate-700">
                Academy category
                <select
                  value={academyCategory}
                  onChange={(event) =>
                    setAcademyCategory(
                      event.target.value as "basics" | "daily-life" | "relationship" | "workplace" | "sleep-intimacy",
                    )
                  }
                  className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
                >
                  <option value="basics">Basics</option>
                  <option value="daily-life">Daily life</option>
                  <option value="relationship">Relationship</option>
                  <option value="workplace">Workplace</option>
                  <option value="sleep-intimacy">Sleep & Intimacy</option>
                </select>
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Grounding evidence id
                <input
                  value={academyEvidenceId}
                  onChange={(event) => setAcademyEvidenceId(event.target.value)}
                  required
                  placeholder="ev-nams-001"
                  className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Track Number
                <input
                  value={academyTrackNumber}
                  onChange={(event) => setAcademyTrackNumber(event.target.value)}
                  placeholder="01"
                  className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Duration (e.g. 3:15)
                <input
                  value={academyDuration}
                  onChange={(event) => setAcademyDuration(event.target.value)}
                  placeholder="3:15"
                  className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                Key Partner Takeaway
                <input
                  value={academyTakeaway}
                  onChange={(event) => setAcademyTakeaway(event.target.value)}
                  placeholder="Clear observational guideline for the partner..."
                  className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
                />
              </label>
            </>
          )}

          {/* Partner Activity fields */}
          {showActivity && (
            <>
              <label className="text-sm font-semibold text-slate-700">
                Activity Label
                <input
                  value={activityLabel}
                  onChange={(event) => setActivityLabel(event.target.value)}
                  placeholder="e.g. Dimmed Light Tea Routine"
                  className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Evidence ID
                <input
                  value={activityEvidenceId}
                  onChange={(event) => setActivityEvidenceId(event.target.value)}
                  placeholder="ev-nams-001"
                  className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                Supportive Suggestion
                <textarea
                  value={activitySuggestion}
                  onChange={(event) => setActivitySuggestion(event.target.value)}
                  rows={2}
                  placeholder="A low-pressure routine to share in the evening..."
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-normal"
                />
              </label>
            </>
          )}

          {/* Couple Challenge fields */}
          {showChallenge && (
            <>
              <label className="text-sm font-semibold text-slate-700">
                Challenge Category
                <input
                  value={challengeCategory}
                  onChange={(event) => setChallengeCategory(event.target.value)}
                  placeholder="Sleep Harmony / Communication"
                  className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                Measurable Benefit
                <input
                  value={challengeBenefit}
                  onChange={(event) => setChallengeBenefit(event.target.value)}
                  placeholder="Prevents late night cortisol spikes..."
                  className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
                Challenge Description
                <textarea
                  value={challengeDescription}
                  onChange={(event) => setChallengeDescription(event.target.value)}
                  rows={2}
                  placeholder="Actionable shared agreement..."
                  className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-normal"
                />
              </label>
            </>
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
                {CONTENT_KIND_LABEL[value] ?? value}
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
