"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, AlertCircle, Loader2, Mail } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import { authClient } from "@/lib/auth/authClient";
import { useAuth } from "@/lib/auth/AuthContext";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const { user, refreshUser } = useAuth();
  const [phase, setPhase] = useState<"idle" | "working" | "ok" | "error">(
    token ? "working" : "idle",
  );
  const [message, setMessage] = useState<string | null>(null);
  const [resendBusy, setResendBusy] = useState(false);
  const [resendNote, setResendNote] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setPhase("idle");
      setMessage("Open the link from your email, or request a new confirmation from your account.");
      return;
    }

    let active = true;
    setPhase("working");
    void authClient.verifyEmail(token).then(async (result) => {
      if (!active) return;
      if (!result.success) {
        setPhase("error");
        setMessage(result.message || "This confirmation link has expired.");
        return;
      }
      setPhase("ok");
      setMessage(result.message || "Your email is confirmed.");
      if (user) {
        await refreshUser();
      }
    });
    return () => {
      active = false;
    };
  }, [token, user, refreshUser]);

  async function handleResend() {
    setResendBusy(true);
    setResendNote(null);
    const result = await authClient.resendVerification();
    setResendBusy(false);
    setResendNote(result.message || (result.success ? "Check your inbox." : "Could not send just now."));
  }

  return (
    <AuthLayout
      title={
        phase === "ok"
          ? "Email confirmed"
          : phase === "working"
            ? "Confirming your email"
            : "Confirm your email"
      }
      subtitle={
        phase === "ok"
          ? "You can keep using HerCompass with this address."
          : "We use this step so only you can prove this inbox belongs to your account."
      }
      badgeText="Email confirmation"
      badgeIcon={<Mail className="h-3.5 w-3.5" />}
    >
      <div className="space-y-4">
        {phase === "working" && (
          <p className="flex items-center gap-2 text-sm text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin text-violet-600" />
            Checking your confirmation link…
          </p>
        )}

        {phase === "ok" && (
          <p className="flex items-start gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            {message}
          </p>
        )}

        {(phase === "error" || phase === "idle") && message && (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {message}
          </p>
        )}

        {user && !user.emailVerified && (
          <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-700">
              Signed in as <span className="font-semibold">{user.email}</span>. Need a new link?
            </p>
            <button
              type="button"
              disabled={resendBusy}
              onClick={() => void handleResend()}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white disabled:opacity-50"
            >
              {resendBusy ? "Sending…" : "Resend confirmation"}
            </button>
            {resendNote && <p className="text-xs text-slate-600">{resendNote}</p>}
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex h-11 flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800"
          >
            Sign in
          </Link>
          <Link
            href="/app/account"
            className="inline-flex h-11 flex-1 items-center justify-center rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white"
          >
            Open account
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <AuthLayout title="Confirm your email" subtitle="Loading…">
          <Loader2 className="h-5 w-5 animate-spin text-violet-600" />
        </AuthLayout>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
