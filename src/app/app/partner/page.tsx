"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ConnectedPartnerCard } from "@/components/member/ConnectedPartnerCard";
import { memberClient } from "@/lib/member/memberClient";
import type { ConnectedPartner } from "@/lib/member/memberTypes";

const SCOPES = [
  { id: "general_support", label: "General support recommendations" },
  { id: "shared_activities", label: "Shared activities" },
  { id: "communication_guidance", label: "Communication guidance" },
] as const;

/** Keeps only topics this page can save. Older profiles used digest_summary for general support. */
function normalizeScopes(scopes: string[]): string[] {
  const mapped = scopes.map((scope) => (scope === "digest_summary" ? "general_support" : scope));
  return SCOPES.map((scope) => scope.id).filter((id) => mapped.includes(id));
}

export default function PartnerPage() {
  const [email, setEmail] = useState("");
  const [sharing, setSharing] = useState(false);
  const [scopes, setScopes] = useState<string[]>([]);
  const [emailOnFile, setEmailOnFile] = useState(false);
  const [ready, setReady] = useState(false);
  const [missingProfile, setMissingProfile] = useState(false);
  const [connected, setConnected] = useState<ConnectedPartner | null>(null);
  const [confirmingRevoke, setConfirmingRevoke] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [revokedNote, setRevokedNote] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [linkNote, setLinkNote] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void Promise.all([memberClient.getAccount(), memberClient.getPartnerConnection()]).then(
      ([account, connection]) => {
        if (!active) return;
        if (!account.success || !account.data) {
          setError(account.message || "We couldn't load partner settings.");
          return;
        }
        if (!account.data.partner) {
          setMissingProfile(true);
        } else {
          setSharing(account.data.partner.sharingOn);
          setScopes(normalizeScopes(account.data.partner.scopes));
          setEmailOnFile(account.data.partner.emailOnFile);
        }
        if (connection.success && connection.data) {
          setConnected(connection.data.partner);
        }
        setReady(true);
      },
    );
    return () => {
      active = false;
    };
  }, []);

  function toggleScope(id: string) {
    setScopes((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  async function save(nextSharing = sharing, nextScopes = scopes) {
    setMessage(null);
    setError(null);
    const result = await memberClient.savePartnerSettings({
      partnerEmail: email,
      partnerConsent: nextSharing,
      scopes: nextSharing ? normalizeScopes(nextScopes) : [],
    });
    if (!result.success) {
      setError(result.message || "We couldn't save partner settings.");
      return;
    }
    setEmailOnFile(Boolean(result.data?.emailOnFile) || emailOnFile || Boolean(email.trim()));
    setEmail("");
    setInviteUrl(result.data?.inviteUrl ?? null);
    setMessage(
      !nextSharing
        ? "Partner access is off. Raw logs stay private."
        : result.data?.inviteSent
          ? "Partner settings saved. The invitation email is on its way."
          : email.trim()
            ? "Partner settings saved. The invitation is stored, but the email could not be sent yet."
            : "Partner settings saved. Add an email to send the invitation.",
    );
  }

  async function revokeAccess() {
    setRevoking(true);
    setError(null);
    const result = await memberClient.revokePartnerConnection();
    setRevoking(false);
    if (!result.success) {
      setError(result.message || "We couldn't revoke access. Your information is safe.");
      return;
    }
    setConnected(null);
    setSharing(false);
    setScopes([]);
    setEmail("");
    setEmailOnFile(false);
    setInviteUrl(null);
    setLinkNote(null);
    setConfirmingRevoke(false);
    setRevokedNote("Access is revoked. You can invite someone else. Raw logs stay private.");
  }

  async function currentInviteUrl(): Promise<string | null> {
    if (inviteUrl) return inviteUrl;
    setLinkNote(null);
    setError(null);
    const result = await memberClient.createPartnerInviteLink();
    if (!result.success || !result.data?.inviteUrl) {
      setLinkNote(result.message || "Turn sharing on and save a partner email first.");
      return null;
    }
    setInviteUrl(result.data.inviteUrl);
    setLinkNote("This link replaces the previous invitation that has not been accepted yet.");
    return result.data.inviteUrl;
  }

  async function copyInvite() {
    const url = await currentInviteUrl();
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setLinkNote("Invitation link copied.");
    } catch {
      setLinkNote("Select the link above and copy it.");
    }
  }

  async function textInvite() {
    const url = await currentInviteUrl();
    if (!url) return;
    const text = `You've been invited to HerCompassAI Partner Support. Review the invitation: ${url}`;
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: "HerCompassAI Partner Support", text, url });
        return;
      } catch {
        return;
      }
    }
    window.location.href = `sms:?&body=${encodeURIComponent(text)}`;
  }

  if (error && !ready) {
    return (
      <p className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-800">
        {error}
      </p>
    );
  }

  if (!ready) {
    return <p className="text-sm font-semibold text-slate-500">Preparing your information...</p>;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-sm">
        <Link href="/app" className="font-semibold text-violet-700 hover:text-violet-800">
          Home
        </Link>
        <span className="text-slate-400" aria-hidden="true">
          /
        </span>
        <span className="font-semibold text-slate-700">Partner</span>
      </nav>
      <header className="rounded-3xl bg-gradient-to-br from-violet-950 via-indigo-900 to-slate-900 p-6 text-white sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-violet-200">Partner support</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
          You decide what support looks like
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-violet-100">
          A partner only receives the summary you allow. Personal symptom details and raw
          tracking stay private.
        </p>
      </header>

      {missingProfile ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
          <p className="text-sm text-slate-600">
            Finish your Snapshot before inviting a partner.
          </p>
          <Link
            href="/onboarding"
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-violet-600 px-5 text-sm font-bold text-white"
          >
            Open the Snapshot
          </Link>
        </div>
      ) : connected ? (
        <>
          {error && <p className="text-sm text-rose-700">{error}</p>}
          <ConnectedPartnerCard
            partner={connected}
            confirming={confirmingRevoke}
            revoking={revoking}
            onAskRevoke={() => setConfirmingRevoke(true)}
            onCancelRevoke={() => setConfirmingRevoke(false)}
            onConfirmRevoke={() => void revokeAccess()}
          />
        </>
      ) : (
        <form
          className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6"
          onSubmit={(event) => {
            event.preventDefault();
            void save();
          }}
        >
          <h2 className="text-lg font-extrabold text-slate-900">
            {revokedNote ? "Add a partner" : "Invite by email"}
          </h2>
          {revokedNote && <p className="text-sm text-slate-700">{revokedNote}</p>}
          <p className="text-sm text-slate-600">
            {emailOnFile
              ? "A partner email is already saved. Enter a new one only if you want to replace it."
              : "Not right now is fine. Leave this blank until you want to invite someone."}
          </p>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="partner@email.com"
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          />

          <h2 className="pt-2 text-lg font-extrabold text-slate-900">Your partner sharing settings</h2>
          <ul className="space-y-2">
            {SCOPES.map((scope) => (
              <li key={scope.id}>
                <label className="flex items-start gap-3 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={scopes.includes(scope.id)}
                    onChange={() => toggleScope(scope.id)}
                  />
                  {scope.label}
                </label>
              </li>
            ))}
            <li className="text-sm text-slate-500">Personal symptom details — not shared</li>
            <li className="text-sm text-slate-500">Personal tracking information — not shared</li>
          </ul>

          <label className="flex items-start gap-3 text-sm font-semibold text-slate-800">
            <input
              type="checkbox"
              className="mt-1"
              checked={sharing}
              onChange={(event) => setSharing(event.target.checked)}
            />
            Share the selected summary with this partner
          </label>

          {error && <p className="text-sm text-rose-700">{error}</p>}
          {message && <p className="text-sm text-slate-700">{message}</p>}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="min-h-11 rounded-full bg-violet-600 px-5 text-sm font-bold text-white"
            >
              Save my preferences
            </button>
            {sharing && (
              <button
                type="button"
                className="min-h-11 rounded-full border border-slate-300 px-5 text-sm font-bold text-slate-700"
                onClick={() => {
                  setSharing(false);
                  setScopes([]);
                  setInviteUrl(null);
                  void save(false, []);
                }}
              >
                Turn sharing off
              </button>
            )}
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h2 className="text-lg font-extrabold text-slate-900">Invite another way</h2>
            <p className="mt-1 text-sm text-slate-600">
              Copy the link, or open a text message with it. A fresh link replaces the previous one that has not been accepted yet.
            </p>
            {inviteUrl && (
              <p className="mt-3 break-all rounded-2xl bg-violet-50 px-4 py-3 text-xs text-slate-700">{inviteUrl}</p>
            )}
            {linkNote && <p className="mt-2 text-sm text-slate-700">{linkNote}</p>}
            <div className="mt-3 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="min-h-11 rounded-full border border-slate-300 px-5 text-sm font-bold text-slate-700"
                onClick={() => void copyInvite()}
              >
                Copy invitation
              </button>
              <button
                type="button"
                className="min-h-11 rounded-full border border-slate-300 px-5 text-sm font-bold text-slate-700"
                onClick={() => void textInvite()}
              >
                Invite by text
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
