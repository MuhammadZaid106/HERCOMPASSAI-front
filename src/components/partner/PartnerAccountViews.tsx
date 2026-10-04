"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { authClient } from "@/lib/auth/authClient";
import {
  PageHeading,
  SaveNote,
  inputClass,
  primaryButton,
  type SaveState,
} from "@/components/member/accountUi";
import { PartnerCrumb, partnerCrumbs } from "./PartnerCrumb";
import { PartnerFrame } from "./PartnerFrame";
import { ConnectedMemberCard } from "./ConnectedMemberCard";
import { updatePartnerName, usePartnerHome, type PartnerHomeOn } from "./usePartnerHome";

const NEVER_SHARED = ["Personal symptoms", "Raw check-ins", "Private notes"];

function PageState({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">{body}</p>
    </section>
  );
}

function ConnectionGate({
  children,
}: {
  children: (home: PartnerHomeOn) => ReactNode;
}) {
  const { home, error } = usePartnerHome();
  if (error) {
    return <p className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</p>;
  }
  if (!home) return <p className="text-sm text-slate-500">Preparing your information...</p>;
  if (!home.connected && home.access === "off") {
    return (
      <PageState
        title="Partner access has been revoked"
        body="Sharing is off. This screen no longer shows a name or support topics."
      />
    );
  }
  if (!home.connected) {
    return (
      <PageState
        title="Nothing here yet"
        body="Accept an invitation first. Accepting joins Partner Support. It does not open their logs."
      />
    );
  }
  return <>{children(home)}</>;
}

export function PartnerConsentPage() {
  return (
    <PartnerFrame>
      <PartnerCrumb items={partnerCrumbs({ label: "Consent" })} />
      <header className="rounded-3xl bg-linear-to-br from-violet-950 via-indigo-900 to-slate-900 p-6 text-white sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-violet-200">Consent</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">What you accepted</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-violet-100">
          You can leave at any time from{" "}
          <Link href="/partner/settings" className="font-bold text-white underline">
            Settings
          </Link>
          . Leaving stops sharing on the next load.
        </p>
      </header>
      <div className="mt-5">
        <ConnectionGate>
          {(home) => (
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-extrabold tracking-tight">
                You joined Partner Support with {home.memberFirstName}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                You may see the topics they left on. You do not see a diagnosis, a score, or a private note.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-slate-700">
                <li>General support — {home.generalSupport ? "shared" : "not shared"}</li>
                <li>Conversation — {home.communicationGuidance ? "shared" : "not shared"}</li>
                <li>Time together — {home.sharedActivities ? "shared" : "not shared"}</li>
              </ul>
              <h3 className="mt-6 text-sm font-extrabold text-slate-900">Never shared</h3>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                {NEVER_SHARED.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          )}
        </ConnectionGate>
      </div>
    </PartnerFrame>
  );
}

export function PartnerPermissionsPage() {
  return (
    <PartnerFrame>
      <PartnerCrumb items={partnerCrumbs({ label: "Permissions" })} />
      <header className="rounded-3xl bg-linear-to-br from-violet-950 via-indigo-900 to-slate-900 p-6 text-white sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-violet-200">Permissions</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">What they chose to share</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-violet-100">
          You can read these topics. You cannot turn one on. Your partner edits that on their account.
        </p>
      </header>
      <div className="mt-5">
        <ConnectionGate>
          {(home) => (
            <ul className="grid gap-3 sm:grid-cols-2">
              {[
                ["General support recommendations", home.generalSupport],
                ["Communication guidance", home.communicationGuidance],
                ["Shared activities", home.sharedActivities],
                ["Personal symptom details", false],
                ["Personal tracking information", false],
              ].map(([label, on]) => (
                <li key={String(label)} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <p className="text-sm font-extrabold text-slate-900">{label}</p>
                  <p className={`mt-2 text-xs font-bold uppercase tracking-wide ${on ? "text-emerald-800" : "text-slate-500"}`}>
                    {on ? "Shared" : "Not shared"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </ConnectionGate>
      </div>
    </PartnerFrame>
  );
}

export function PartnerSettingsPage() {
  const { home, error, reload } = usePartnerHome();

  return (
    <PartnerFrame>
      <PartnerCrumb items={partnerCrumbs({ label: "Settings" })} />
      <header className="rounded-3xl bg-linear-to-br from-violet-950 via-indigo-900 to-slate-900 p-6 text-white sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-violet-200">Settings</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Your side of Partner Support</h1>
      </header>

      <div className="mt-5 space-y-4">
        {error && <p className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</p>}
        {!error && !home && <p className="text-sm text-slate-500">Preparing your information...</p>}
        {home?.connected && <ConnectedMemberCard home={home} onLeft={reload} />}
        {home && !home.connected && (
          <PageState
            title={home.access === "off" ? "Partner access has been revoked" : "Nothing here yet"}
            body={
              home.access === "off"
                ? "Sharing is off. You can still sign out of this account."
                : "Accept an invitation before this page has a connection to manage."
            }
          />
        )}
      </div>
    </PartnerFrame>
  );
}

function initials(name: string, email: string): string {
  const source = name.trim() || email.split("@")[0] || "Partner";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

function formatWhen(value: string | undefined): string {
  if (!value) return "Not recorded";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not recorded";
  return date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function PartnerAccountPage() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [plan, setPlan] = useState(user?.plan ?? "free");
  const [joined, setJoined] = useState<string | undefined>(user?.createdAt);
  const [save, setSave] = useState<SaveState>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    void authClient.getMe().then((result) => {
      if (!active || !result.success || !result.data?.user) return;
      const account = result.data.user;
      setName(account.name);
      setEmail(account.email);
      setPlan(account.plan);
      setJoined(account.createdAt);
    });
    return () => {
      active = false;
    };
  }, []);

  async function saveName() {
    if (name.trim().length < 2) {
      setSave({ ok: false, note: "Enter a name of at least 2 characters." });
      return;
    }
    setSaving(true);
    setSave(null);
    const result = await updatePartnerName(name.trim());
    setSaving(false);
    if (!result.ok) {
      setSave({ ok: false, note: result.message });
      return;
    }
    if (result.name) setName(result.name);
    await refreshUser();
    setSave({ ok: true, note: "Name updated." });
  }

  const displayName = name.trim() || "Partner";

  return (
    <PartnerFrame>
      <PartnerCrumb items={partnerCrumbs({ label: "Account" })} />
      <div className="animate-fadeIn">
        <PageHeading
          title="Account"
          description="How you appear in Partner Support, and the details tied to your sign-in."
        />
        <div className="grid gap-10 pt-8 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <span
              aria-hidden="true"
              className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-900 text-2xl font-bold text-white"
            >
              {initials(displayName, email)}
            </span>
            <h2 className="mt-4 break-words text-lg font-bold tracking-tight text-slate-900">{displayName}</h2>
            <p className="mt-0.5 break-words text-sm text-slate-600">{email}</p>
            <dl className="mt-5 space-y-2.5 border-t border-slate-200 pt-5 text-sm">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-slate-500">Role</dt>
                <dd className="font-medium capitalize text-slate-900">Partner</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-slate-500">Plan</dt>
                <dd className="font-medium capitalize text-slate-900">{plan}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-slate-500">Joined</dt>
                <dd className="font-medium text-slate-900">{formatWhen(joined)}</dd>
              </div>
            </dl>
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Details</h2>
            <dl className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
              <div className="grid gap-2 py-5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:items-start sm:gap-6">
                <dt className="pt-2 text-sm font-medium text-slate-500">Name</dt>
                <dd>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      autoComplete="name"
                      aria-label="Name"
                      className={`${inputClass} sm:max-w-xs`}
                    />
                    <button
                      type="button"
                      onClick={() => void saveName()}
                      disabled={saving || name.trim() === (user?.name ?? "")}
                      className={primaryButton}
                    >
                      {saving ? "Saving..." : "Save"}
                    </button>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">Shown in the partner workspace.</p>
                  <SaveNote state={save} />
                </dd>
              </div>
              <div className="grid gap-2 py-5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:items-start sm:gap-6">
                <dt className="pt-2 text-sm font-medium text-slate-500">Email address</dt>
                <dd>
                  <p className="break-words text-sm text-slate-900">{email}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    This is the address your invitation was sent to.
                  </p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </PartnerFrame>
  );
}
