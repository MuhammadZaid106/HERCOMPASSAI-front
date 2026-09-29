"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { memberClient } from "@/lib/member/memberClient";
import type { MemberAccountData, NotificationPreferences } from "@/lib/member/memberTypes";

const PRIVACY_TOPICS = [
  {
    title: "What we collect",
    body: "Your account, Snapshot answers, and the check-ins you choose to log.",
  },
  {
    title: "Why we collect it",
    body: "So the app can show patterns, a baseline, and a next step.",
  },
  {
    title: "How it's used",
    body: "Software calculates scores and trends. AI text is used only when your consent allows it.",
  },
  {
    title: "Who can access it",
    body: "You can. A partner cannot, unless you turn sharing on.",
  },
  {
    title: "Partner sharing",
    body: "Sharing is a summary you allow. Raw logs stay private, and you can turn sharing off.",
  },
  {
    title: "AI usage",
    body: "Personalization stays off when consent is assessment only.",
  },
  {
    title: "Data controls",
    body: "You can delete this account from the section below. A download of your logs is not available yet.",
  },
  {
    title: "Consent history",
    body: "The consent section shows the choice currently stored for this account.",
  },
];

const HELP_TOPICS = [
  { title: "Getting started", body: "Home, a Snapshot, and a daily check-in are the core loop." },
  { title: "Snapshot", body: "Your baseline lives on My Snapshot. It describes patterns. It does not diagnose." },
  { title: "Tracking", body: "Symptoms, mood, sleep, energy, and lifestyle are saved one step at a time." },
  { title: "Partner Support", body: "Optional. A partner never receives raw logs." },
  { title: "Subscription", body: "Your plan is shown here and compared on Plans. Billing is not connected." },
  { title: "Privacy", body: "You control consent and partner sharing from this page." },
  { title: "AI insights", body: "Insight cards are calculated from your logs. They are not a diagnosis." },
];

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

function Section({
  title,
  children,
  wide = false,
}: {
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <section
      className={`rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 ${
        wide ? "sm:col-span-2" : ""
      }`}
    >
      <h2 className="text-lg font-extrabold tracking-tight text-slate-900">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-600">{children}</div>
    </section>
  );
}

export default function AccountPage() {
  const { logout } = useAuth();
  const [data, setData] = useState<MemberAccountData | null>(null);
  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);
  const [prefNote, setPrefNote] = useState<string | null>(null);
  const [deleteEmail, setDeleteEmail] = useState("");
  const [deleteNote, setDeleteNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void memberClient.getAccount().then((result) => {
      if (!active) return;
      if (result.success && result.data) setData(result.data);
      else {
        setError(
          result.message ||
            "We couldn't complete that right now. Please try again.",
        );
      }
    });
    void memberClient.getNotificationPreferences().then((result) => {
      if (!active || !result.success || !result.data) return;
      setPrefs(result.data);
    });
    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm leading-relaxed text-rose-800">
        <p className="font-semibold">We couldn&apos;t load your account.</p>
        <p className="mt-1">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-4" aria-busy="true" aria-live="polite">
        <p className="text-sm font-semibold text-slate-500">Preparing your information...</p>
        <div className="h-24 animate-pulse rounded-3xl bg-violet-100" />
        <div className="h-40 animate-pulse rounded-3xl bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="rounded-3xl bg-gradient-to-br from-violet-950 via-indigo-900 to-slate-900 p-6 text-white shadow-xl sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-violet-200">Account</p>
        <h1 className="mt-2 break-words text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.profile.name}
        </h1>
        <p className="mt-2 break-all text-sm text-violet-100">{data.profile.email}</p>
        <dl className="mt-5 grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
          <div className="rounded-2xl bg-white/10 px-4 py-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-violet-200">Plan</dt>
            <dd className="mt-1 font-bold">{data.profile.planLabel}</dd>
          </div>
          <div className="rounded-2xl bg-white/10 px-4 py-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-violet-200">Member since</dt>
            <dd className="mt-1 font-bold">{formatWhen(data.profile.memberSince)}</dd>
          </div>
          <div className="rounded-2xl bg-white/10 px-4 py-3">
            <dt className="text-xs font-semibold uppercase tracking-wide text-violet-200">Email</dt>
            <dd className="mt-1 font-bold">
              {data.profile.emailVerified ? "Verified" : "Not verified yet"}
            </dd>
          </div>
        </dl>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <Section title="Preferences">
          {data.preferences.snapshotComplete ? (
            <>
              <p>
                Daily check-in: {data.preferences.dailyCheckIn ? "on" : "off"}.
              </p>
              <p>
                Recommendation types:{" "}
                {data.preferences.recommendations.length > 0
                  ? data.preferences.recommendations.join(", ")
                  : "none selected"}
                .
              </p>
            </>
          ) : (
            <p>Finish your Snapshot to set these preferences.</p>
          )}
          <Link href={data.preferences.snapshotComplete ? "/app/snapshot" : "/onboarding"} className="inline-flex font-bold text-violet-700">
            {data.preferences.snapshotComplete ? "View Snapshot" : "Start Snapshot"}
          </Link>
        </Section>

        <Section title="Privacy" wide>
          <ul className="grid gap-3 sm:grid-cols-2">
            {PRIVACY_TOPICS.map((topic) => (
              <li key={topic.title} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-bold text-slate-900">{topic.title}</p>
                <p className="mt-1">{topic.body}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Consent">
          {data.consent ? (
            <>
              <p>
                Current choice: {data.consent.typeLabel}. Recorded{" "}
                {formatWhen(data.consent.recordedAt)}. Version {data.consent.version}.
              </p>
              <p>
                {data.consent.allowsPersonalization
                  ? "Wellness personalization is allowed for AI text."
                  : "AI personalization stays off with this choice."}
              </p>
            </>
          ) : (
            <p>No consent record yet. The Snapshot is where that choice is stored.</p>
          )}
        </Section>

        <Section title="Partner permissions">
          {data.partner ? (
            <>
              <p>{data.partner.interestLabel}.</p>
              <p>
                Sharing is {data.partner.sharingOn ? "on" : "off"}.
                {data.partner.emailOnFile
                  ? " A partner email is saved on this account."
                  : " No partner email is saved."}
              </p>
              <p>
                Scopes:{" "}
                {data.partner.scopes.length > 0
                  ? data.partner.scopes.join(", ")
                  : "none selected"}
                .
              </p>
            </>
          ) : (
            <p>Partner choices appear after the Snapshot.</p>
          )}
          <p>A partner never receives your raw logs.</p>
          <Link href="/app/partner" className="inline-flex font-bold text-violet-700">
            Review partner support
          </Link>
        </Section>

        <Section title="Subscription">
          <p>
            Current plan: {data.profile.planLabel}. Renewal dates appear when billing
            is connected. This page does not change your plan.
          </p>
          <Link href="/app/plans" className="inline-flex font-bold text-violet-700">
            Compare plans
          </Link>
        </Section>

        <Section title="Notifications">
          <p>
            {data.notifications.unreadCount === 0
              ? "No unread notices."
              : `${data.notifications.unreadCount} unread.`}
          </p>
          {prefs && (
            <ul className="space-y-2">
              {(
                [
                  ["snapshot", "Snapshot"],
                  ["trackingReminders", "Tracking reminders"],
                  ["recommendations", "Recommendations"],
                  ["partner", "Partner"],
                  ["plans", "Plans"],
                  ["account", "Account"],
                  ["privacySecurity", "Important privacy and security notices"],
                ] as const
              ).map(([key, label]) => (
                <li key={key}>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={prefs[key]}
                      onChange={(event) =>
                        setPrefs({ ...prefs, [key]: event.target.checked })
                      }
                    />
                    {label}
                  </label>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            className="inline-flex min-h-11 items-center rounded-full bg-violet-600 px-5 text-sm font-bold text-white"
            onClick={() => {
              if (!prefs) return;
              void memberClient.saveNotificationPreferences(prefs).then((result) => {
                setPrefNote(
                  result.success
                    ? "Saved successfully."
                    : result.message || "We couldn't save those choices.",
                );
              });
            }}
          >
            Save notification choices
          </button>
          {prefNote && <p>{prefNote}</p>}
          <Link href="/app/notifications" className="inline-flex font-bold text-violet-700">
            Open notifications
          </Link>
        </Section>

        <Section title="Security">
          <p>You are signed in as {data.profile.email}.</p>
          <button
            type="button"
            onClick={() => {
              void logout();
            }}
            className="inline-flex min-h-11 items-center rounded-full bg-slate-900 px-5 text-sm font-bold text-white"
          >
            Log out
          </button>
        </Section>

        <Section title="Delete account">
          <p>
            This removes the account and the logs stored with it. Type the email
            on this account to confirm.
          </p>
          <input
            type="email"
            value={deleteEmail}
            onChange={(event) => setDeleteEmail(event.target.value)}
            placeholder={data.profile.email}
            className="w-full rounded-2xl border border-slate-200 px-3 py-3 text-sm"
          />
          {deleteNote && <p>{deleteNote}</p>}
          <button
            type="button"
            className="inline-flex min-h-11 items-center rounded-full bg-rose-700 px-5 text-sm font-bold text-white"
            onClick={() => {
              void memberClient.deleteAccount(deleteEmail).then((result) => {
                if (!result.success) {
                  setDeleteNote(result.message || "We couldn't delete this account.");
                  return;
                }
                void logout();
              });
            }}
          >
            Delete my account
          </button>
        </Section>

        <Section title="Help" wide>
          <ul className="grid gap-3 sm:grid-cols-2">
            {HELP_TOPICS.map((topic) => (
              <li key={topic.title}>
                <p className="font-bold text-slate-900">{topic.title}</p>
                <p className="mt-1">{topic.body}</p>
              </li>
            ))}
          </ul>
          <Link href="/app/support" className="inline-flex font-bold text-violet-700">
            Open support
          </Link>
        </Section>
      </div>
    </div>
  );
}
