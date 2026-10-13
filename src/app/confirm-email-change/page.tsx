"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, AlertCircle, Loader2, Mail } from "lucide-react";
import AuthLayout from "@/components/auth/AuthLayout";
import { authClient } from "@/lib/auth/authClient";
import { useAuth } from "@/lib/auth/AuthContext";

function ConfirmEmailChangeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const { user, refreshUser } = useAuth();
  const [phase, setPhase] = useState<"idle" | "working" | "ok" | "error">(
    token ? "working" : "idle",
  );
  const [message, setMessage] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setPhase("idle");
      setMessage(
        "Open the link from the confirmation email, or start again from your account.",
      );
      return;
    }

    let active = true;
    setPhase("working");
    void authClient.confirmEmailChange(token).then(async (result) => {
      if (!active) return;
      if (!result.success) {
        setPhase("error");
        setMessage(result.message || "This confirmation link has expired.");
        return;
      }
      setPhase("ok");
      setNewEmail(result.data?.email ?? null);
      setMessage(result.message || "Your email address is updated.");
      if (user) {
        await refreshUser();
      }
    });
    return () => {
      active = false;
    };
  }, [token, user, refreshUser]);

  return (
    <AuthLayout
      title={
        phase === "ok"
          ? "Email updated"
          : phase === "working"
            ? "Confirming your new email"
            : "Confirm your new email"
      }
      subtitle={
        phase === "ok"
          ? "Sign in with this address from now on."
          : "We ask the new inbox to confirm so only you can finish the change."
      }
      badgeText="Email change"
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
            <span>
              {message}
              {newEmail ? (
                <>
                  {" "}
                  Your address is now <span className="font-semibold">{newEmail}</span>.
                </>
              ) : null}
            </span>
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

export default function ConfirmEmailChangePage() {
  return (
    <Suspense
      fallback={
        <AuthLayout title="Confirm your new email" subtitle="Loading…">
          <Loader2 className="h-5 w-5 animate-spin text-violet-600" />
        </AuthLayout>
      }
    >
      <ConfirmEmailChangeContent />
    </Suspense>
  );
}
