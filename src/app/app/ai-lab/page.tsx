"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  FlaskConical,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { onboardingClient } from "@/lib/onboarding/onboardingClient";
import {
  aiClient,
  type AiGenerateData,
  type AiRating,
} from "@/lib/ai/aiClient";

type LabState = "idle" | "running" | "done" | "error";

interface ProfileStatus {
  isCompleted: boolean;
  consentType?: string;
  error?: string;
}

function hintFor(status: number, message: string): string {
  if (status === 401)
    return "Session expired or invalid — log out and log back in.";
  if (status === 403 && message.toLowerCase().includes("health"))
    return "Engine health is restricted to admin/developer. Generation works for members.";
  if (status === 403)
    return "Consent missing or revoked — re-submit onboarding with consentType `wellness_personalization`.";
  if (status === 404)
    return "No completed assessment found — finish the 5-minute onboarding first.";
  if (status === 503)
    return "AI gateway disabled or no engine configured. Check the backend .env (AI_GATEWAY_ENABLED, *_PROVIDER_URL, *_MODEL).";
  return message;
}

export default function AiLabPage() {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<ProfileStatus | null>(null);
  const [state, setState] = useState<LabState>("idle");
  const [result, setResult] = useState<AiGenerateData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [healthDump, setHealthDump] = useState<unknown>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [lastKind, setLastKind] = useState<"snapshot" | "insight">("insight");

  const refreshProfile = useCallback(async () => {
    const res = await onboardingClient.getProfile();
    setProfile({
      isCompleted: Boolean(res.isCompleted),
      consentType: res.profile?.consentType as string | undefined,
      error: res.error,
    });
  }, []);

  useEffect(() => {
    if (loading || !user) return;
    let cancelled = false;
    void (async () => {
      const res = await onboardingClient.getProfile();
      if (cancelled) return;
      setProfile({
        isCompleted: Boolean(res.isCompleted),
        consentType: res.profile?.consentType as string | undefined,
        error: res.error,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [loading, user]);

  async function runGenerate(kind: "snapshot" | "insight") {
    setState("running");
    setResult(null);
    setError(null);
    setFeedbackMsg(null);
    setLastKind(kind);
    const res = await aiClient.generate(kind);
    if (res.ok && res.data) {
      setResult(res.data);
      setState("done");
    } else {
      setError(hintFor(res.status, res.message));
      setState("error");
    }
  }

  async function runHealth() {
    setState("running");
    setResult(null);
    setHealthDump(null);
    setError(null);
    const res = await aiClient.health();
    setState("done");
    if (res.ok) {
      setHealthDump(res.data ?? {});
    } else {
      setError(hintFor(res.status, res.message));
    }
  }

  async function submitFeedback(rating: AiRating) {
    if (!result) return;
    setFeedbackMsg(null);
    const res = await aiClient.feedback({
      requestId: result.meta.requestId,
      feature: aiClient.endpoints(lastKind).feature,
      rating,
    });
    setFeedbackMsg(res.message);
  }

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  const consentOk = profile?.isCompleted && profile.consentType === "wellness_personalization";

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-violet-600">
            Gateway test bench
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
            AI Lab
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Calls the backend AI Gateway with your real member token. Verify which
            engine actually answered by checking{" "}
            <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-xs text-violet-700">
              meta.modelVersion
            </code>
          </p>
        </div>
        <button
          type="button"
          onClick={() => void refreshProfile()}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh status
        </button>
      </header>

      {/* Status card */}
      <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
        <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
          <FlaskConical className="h-4 w-4 text-violet-600" />
          Prerequisites
        </h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex items-center gap-2">
            {user ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
            )}
            Authenticated as <strong>{user.name || user.email}</strong> (
            {user.role} · {user.plan})
          </li>
          <li className="flex items-center gap-2 text-slate-600">
            {profile?.isCompleted ? (
              profile.consentType === "wellness_personalization" ? (
                <>
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  Onboarding complete with current consent (
                  <code className="font-mono text-xs">{profile.consentType}</code>)
                </>
              ) : (
                <>
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
                  Onboarding exists but consent type is{" "}
                  <code className="font-mono text-xs">{profile.consentType ?? "unknown"}</code> —
                  <Link href="/onboarding" className="font-semibold text-violet-700 underline">
                    re-submit onboarding
                  </Link>{" "}
                  (the backend treats anything except{" "}
                  <code className="font-mono text-xs">wellness_personalization</code> as no
                  consent)
                </>
              )
            ) : profile === null ? (
              <>
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-violet-600" />
                Checking onboarding status…
              </>
            ) : (
              <>
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />
                No completed assessment —{" "}
                <Link href="/onboarding" className="font-semibold text-violet-700 underline">
                  complete onboarding
                </Link>{" "}
                before generating (otherwise the Gateway returns 404)
              </>
            )}
          </li>
        </ul>
      </section>

      {/* Actions */}
      {!consentOk ? (
        <section className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
          <div>
            <p className="font-semibold">The Gateway will not generate yet.</p>
            <p className="mt-1 text-amber-700">
              It requires a completed assessment with explicit
              <code className="mx-1 rounded bg-amber-100 px-1 font-mono text-xs">
                wellness_personalization
              </code>
              consent, read server-side — a client can never grant it itself.
            </p>
          </div>
        </section>
      ) : (
        <section className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={state === "running"}
            onClick={() => void runGenerate("insight")}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 disabled:opacity-50"
          >
            {state === "running" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Generate AI insight
          </button>
          <button
            type="button"
            disabled={state === "running"}
            onClick={() => void runGenerate("snapshot")}
            className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-100 disabled:opacity-50"
          >
            {state === "running" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Stethoscope className="h-4 w-4" />
            )}
            Generate full snapshot
          </button>
          <div className="mx-1 h-6 w-px bg-slate-200" aria-hidden />
          <button
            type="button"
            disabled={state === "running"}
            onClick={() => void runHealth()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
          >
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Engine health
          </button>
        </section>
      )}

      {/* Output */}
      {state === "running" && (
        <section className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
          <Loader2 className="h-5 w-5 animate-spin text-violet-600" />
          Calling the AI Gateway… deterministic scoring and evidence retrieval can
          take a few seconds.
        </section>
      )}

      {error && (
        <section className="space-y-2 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">
          <p className="font-semibold">Request failed</p>
          <p className="text-rose-700">{error}</p>
        </section>
      )}

      {healthDump ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Engine health
          </p>
          <pre className="mt-3 max-h-80 overflow-auto rounded-xl bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-100">
            {JSON.stringify(healthDump, null, 2) ?? ""}
          </pre>
        </section>
      ) : null}

      {result ? (
        <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {result.meta.resultStatus}
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 font-mono">
              modelVersion: {result.meta.modelVersion}
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 font-mono">
              promptVersion: {result.meta.promptVersion}
            </span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 font-mono">
              requestId: {result.meta.requestId.slice(0, 8)}…
            </span>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Output
            </p>
            <pre className="mt-2 max-h-96 overflow-auto whitespace-pre-wrap rounded-xl bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-100">
              {JSON.stringify(result.output, null, 2) ?? ""}
            </pre>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Was this useful?
            </span>
            <button
              type="button"
              onClick={() => void submitFeedback("helpful")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
              Helpful
            </button>
            <button
              type="button"
              onClick={() => void submitFeedback("not_helpful")}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <ThumbsDown className="h-3.5 w-3.5" />
              Not helpful
            </button>
            {feedbackMsg && (
              <span className="text-xs font-medium text-emerald-700">{feedbackMsg}</span>
            )}
          </div>
        </section>
      ) : null}
    </div>
  );
}