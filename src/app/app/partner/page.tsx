"use client";

import { useEffect, useState } from "react";
import { memberClient } from "@/lib/member/memberClient";

const SCOPES = [
  { id: "general_support", label: "General support recommendations" },
  { id: "shared_activities", label: "Shared activities" },
  { id: "communication_guidance", label: "Communication guidance" },
] as const;

export default function PartnerPage() {
  const [email, setEmail] = useState("");
  const [sharing, setSharing] = useState(false);
  const [scopes, setScopes] = useState<string[]>([]);
  const [emailOnFile, setEmailOnFile] = useState(false);
  const [ready, setReady] = useState(false);
  const [missingProfile, setMissingProfile] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void memberClient.getAccount().then((result) => {
      if (!active) return;
      if (!result.success || !result.data) {
        setError(result.message || "We couldn't load partner settings.");
        return;
      }
      if (!result.data.partner) {
        setMissingProfile(true);
      } else {
        setSharing(result.data.partner.sharingOn);
        setScopes(result.data.partner.scopes);
        setEmailOnFile(result.data.partner.emailOnFile);
      }
      setReady(true);
    });
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
      scopes: nextSharing ? nextScopes : [],
    });
    if (!result.success) {
      setError(result.message || "We couldn't save partner settings.");
      return;
    }
    setEmailOnFile(Boolean(result.data?.emailOnFile) || emailOnFile || Boolean(email.trim()));
    setEmail("");
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
        <p className="rounded-3xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
          Finish your Snapshot before inviting a partner.
        </p>
      ) : (
        <form
          className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6"
          onSubmit={(event) => {
            event.preventDefault();
            void save();
          }}
        >
          <h2 className="text-lg font-extrabold text-slate-900">Invite by email</h2>
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
            <button
              type="button"
              className="min-h-11 rounded-full border border-slate-300 px-5 text-sm font-bold text-slate-700"
              onClick={() => {
                setSharing(false);
                setScopes([]);
                void save(false, []);
              }}
            >
              Revoke access
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
