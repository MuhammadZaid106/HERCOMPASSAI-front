"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { memberClient } from "@/lib/member/memberClient";
import type { MemberAccountData } from "@/lib/member/memberTypes";
import {
  ErrorNotice,
  PageHeading,
  PanelSkeleton,
  SaveNote,
  inputClass,
  linkClass,
  primaryButton,
  secondaryButton,
  type SaveState,
} from "@/components/member/accountUi";

function formatWhen(value: string | null): string {
  if (!value) return "Not recorded";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not recorded";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function initials(name: string, email: string): string {
  const source = name.trim() || email.split("@")[0] || "Member";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return source.slice(0, 2).toUpperCase();
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="shrink-0 text-slate-500">{label}</dt>
      <dd className="min-w-0 break-words text-right font-medium text-slate-900">{value}</dd>
    </div>
  );
}

function Detail({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2 py-5 sm:grid-cols-[11rem_minmax(0,1fr)] sm:items-start sm:gap-6">
      <dt className="pt-2 text-sm font-medium text-slate-500">{label}</dt>
      <dd className="min-w-0 text-sm text-slate-900">
        {children}
        {hint && <p className="mt-1 text-xs leading-relaxed text-slate-500">{hint}</p>}
      </dd>
    </div>
  );
}

export default function AccountPage() {
  const { user, refreshUser } = useAuth();

  const [data, setData] = useState<MemberAccountData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [nameSave, setNameSave] = useState<SaveState>(null);
  const [isSavingName, setIsSavingName] = useState(false);

  useEffect(() => {
    let active = true;
    void memberClient.getAccount().then((result) => {
      if (!active) return;
      if (!result.success || !result.data) {
        setError(result.message || "We couldn't load your profile. Please try again.");
        return;
      }
      setData(result.data);
      setName(result.data.profile.name);
    });
    return () => {
      active = false;
    };
  }, []);

  const saveName = (): void => {
    if (name.trim().length < 2) {
      setNameSave({ ok: false, note: "Enter a name of at least 2 characters." });
      return;
    }
    setIsSavingName(true);
    setNameSave(null);
    void memberClient.updateProfile(name.trim()).then((result) => {
      setIsSavingName(false);
      if (!result.success || !result.data) {
        setNameSave({ ok: false, note: result.message || "We couldn't save your name." });
        return;
      }
      const savedName = result.data.name;
      // The shell header and the initials beside this form both read the name
      // from the auth session, so it has to be refreshed or the old name stays.
      void refreshUser();
      setData((current) =>
        current ? { ...current, profile: { ...current.profile, name: savedName } } : current,
      );
      setName(savedName);
      setNameSave({ ok: true, note: "Name updated." });
    });
  };

  if (error) {
    return <ErrorNotice title="We couldn't load your profile." message={error} />;
  }

  if (!data) {
    return <PanelSkeleton lines={3} />;
  }

  const displayName = data.profile.name || "Member";
  const nameUnchanged = name.trim() === data.profile.name;

  return (
    <div className="animate-fadeIn">
      <PageHeading
        title="Profile"
        description="How you appear in this workspace, and the details tied to your sign-in."
      />

      <div className="grid gap-10 pt-8 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <span
            aria-hidden="true"
            className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-900 text-2xl font-bold text-white"
          >
            {initials(displayName, data.profile.email)}
          </span>

          <h2 className="mt-4 break-words text-lg font-bold tracking-tight text-slate-900">
            {displayName}
          </h2>
          <p className="mt-0.5 break-words text-sm text-slate-600">{data.profile.email}</p>

          <dl className="mt-5 space-y-2.5 border-t border-slate-200 pt-5 text-sm">
            <Fact label="Plan" value={data.profile.planLabel} />
            <Fact label="Member since" value={formatWhen(data.profile.memberSince)} />
          </dl>

          <Link href="/app/settings" className={`mt-6 ${secondaryButton} w-full`}>
            Account settings
          </Link>
        </div>

        <div className="min-w-0">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Details
          </h2>

          <dl className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
            <Detail label="Name" hint="Shown across the app instead of your email address.">
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
                  onClick={saveName}
                  disabled={isSavingName || nameUnchanged}
                  className={primaryButton}
                >
                  {isSavingName ? "Saving..." : "Save"}
                </button>
              </div>
              <SaveNote state={nameSave} />
            </Detail>

            <Detail
              label="Email address"
              hint="Changing the address requires confirming the new address by email, which is not connected yet. Contact support to change it."
            >
              <p className="break-words">{data.profile.email}</p>
              <p
                className={`mt-1 text-xs font-semibold ${
                  data.profile.emailVerified ? "text-emerald-700" : "text-amber-700"
                }`}
              >
                {data.profile.emailVerified ? "Verified" : "Not verified yet"}
              </p>
            </Detail>

            <Detail label="Snapshot">
              <Link
                href={data.preferences.snapshotComplete ? "/app/snapshot" : "/onboarding"}
                className={linkClass}
              >
                {data.preferences.snapshotComplete ? "View Snapshot" : "Start Snapshot"}
              </Link>
            </Detail>

            <Detail label="Partner sharing">
              <Link href="/app/partner" className={linkClass}>
                {data.partner ? "Review partner permissions" : "Set up partner support"}
              </Link>
            </Detail>
          </dl>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/app/plans" className={linkClass}>
              Plans
            </Link>
            <Link href="/app/support" className={linkClass}>
              Support
            </Link>
          </div>

          {user?.email && user.email !== data.profile.email && (
            <p className="mt-6 text-xs text-slate-500">
              Your signed-in session still shows {user.email}. Sign out and back in if this
              looks wrong.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}