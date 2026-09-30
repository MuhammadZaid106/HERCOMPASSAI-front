"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { authClient } from "@/lib/auth/authClient";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

interface InviteView {
  status: string;
  invitedEmail: string;
  mayShare: string[];
  notShared: string[];
}

function InviteScreen() {
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const router = useRouter();
  const { user, loading, register } = useAuth();
  const [invite, setInvite] = useState<InviteView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [welcome, setWelcome] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("This invitation link is missing.");
      return;
    }
    void fetch(`${API_BASE}/api/partner/invite/${encodeURIComponent(token)}`)
      .then(async (response) => {
        const json = await response.json();
        if (!response.ok) {
          setError(json.message || "This invitation is no longer open.");
          return;
        }
        setInvite(json.data as InviteView);
      })
      .catch(() => setError("We couldn't open this invitation."));
  }, [token]);

  async function accept() {
    setBusy(true);
    setError(null);
    const response = await authClient.authenticatedFetch(
      `${API_BASE}/api/partner/invite/${encodeURIComponent(token)}/accept`,
      { method: "POST" },
    );
    const json = await response.json();
    setBusy(false);
    if (!response.ok) {
      setError(json.message || "We couldn't join Partner Support.");
      return;
    }
    setWelcome(true);
  }

  async function decline() {
    setBusy(true);
    const response = await fetch(`${API_BASE}/api/partner/invite/${encodeURIComponent(token)}/decline`, {
      method: "POST",
    });
    const json = await response.json();
    setBusy(false);
    setError(json.message || "You declined Partner Support. Nothing was shared.");
    setInvite((current) => (current ? { ...current, status: "declined" } : current));
  }

  async function createAccount(event: FormEvent) {
    event.preventDefault();
    if (!invite) return;
    setBusy(true);
    setError(null);
    const result = await register({
      name,
      email: invite.invitedEmail,
      password,
      role: "partner",
    });
    setBusy(false);
    if (!result.success) {
      setError(result.message || "We couldn't create that account.");
      return;
    }
    await accept();
  }

  if (welcome) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16">
        <p className="text-xs font-bold uppercase tracking-wider text-violet-700">Partner Support</p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Welcome</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          You joined HerCompassAI Partner Support. You will not see personal symptoms, raw tracking logs, or private notes.
        </p>
        <Link href="/welcome" className="mt-6 inline-flex rounded-full bg-violet-600 px-5 py-3 text-sm font-bold text-white">
          Continue
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg space-y-6 px-4 py-10 sm:py-16">
      <header>
        <p className="text-xs font-bold uppercase tracking-wider text-violet-700">Partner Support</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">You&apos;ve been invited to HerCompassAI Partner Support</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Partner support is a consented summary. You can decline, and you can leave later.
        </p>
      </header>
      {error && <p className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
      {invite && invite.status === "sent" && (
        <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">What may be shared</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
              {invite.mayShare.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">What is not shared</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
              {invite.notShared.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          {loading ? (
            <p className="text-sm text-slate-500">Checking your session...</p>
          ) : user ? (
            <div className="flex flex-col gap-2 sm:flex-row">
              <button type="button" disabled={busy} onClick={() => void accept()} className="min-h-11 rounded-full bg-violet-600 px-5 text-sm font-bold text-white">
                Accept Partner Support
              </button>
              <button type="button" disabled={busy} onClick={() => void decline()} className="min-h-11 rounded-full border border-slate-300 px-5 text-sm font-bold text-slate-800">
                Decline
              </button>
            </div>
          ) : (
            <form onSubmit={(event) => void createAccount(event)} className="space-y-3">
              <p className="text-sm text-slate-600">Create the partner account for {invite.invitedEmail}, or sign in if you already have one.</p>
              <input value={name} onChange={(event) => setName(event.target.value)} required placeholder="Your name" className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" />
              <input value={invite.invitedEmail} readOnly className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm" />
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} placeholder="Password" className="w-full rounded-xl border border-slate-200 px-3 py-3 text-sm" />
              <button type="submit" disabled={busy} className="min-h-11 w-full rounded-full bg-violet-600 px-5 text-sm font-bold text-white sm:w-auto">
                Create partner account
              </button>
              <button
                type="button"
                className="block text-sm font-bold text-violet-700"
                onClick={() => router.push(`/login?from=${encodeURIComponent(`/partner/invite?token=${token}`)}`)}
              >
                I already have an account
              </button>
            </form>
          )}
        </section>
      )}
    </main>
  );
}

export default function PartnerInvitePage() {
  return (
    <Suspense fallback={<main className="px-4 py-16 text-sm text-slate-500">Opening the invitation...</main>}>
      <InviteScreen />
    </Suspense>
  );
}
