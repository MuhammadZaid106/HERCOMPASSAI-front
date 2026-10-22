"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { memberClient } from "@/lib/member/memberClient";
import type { ConnectedPartner, MemberAccountData } from "@/lib/member/memberTypes";
import {
  ErrorNotice,
  linkClass,
  PanelSkeleton,
} from "@/components/member/accountUi";
import PrivacyAccordion from "@/components/privacy/PrivacyAccordion";
import ConsentHistoryTimeline, {
  formatDate,
  type PrivacyTimelineEntry,
} from "@/components/privacy/ConsentHistoryTimeline";
import DataControlCard from "@/components/privacy/DataControlCard";
import PartnerSharingSnapshot from "@/components/privacy/PartnerSharingSnapshot";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "partner", label: "Partner sharing" },
  { id: "history", label: "Your history" },
  { id: "handling", label: "How your data works" },
] as const;

const DISCLOSURES = [
  {
    id: "collect",
    title: "What we collect",
    body: "Your account details, your Snapshot answers, the check-ins you choose to log, and whether you have shared anything with a partner. We do not collect information you do not enter.",
  },
  {
    id: "why",
    title: "Why we collect it",
    body: "So the app can build your Snapshot baseline, notice patterns in your own trends, and suggest a next step that may fit a goal you already logged.",
  },
  {
    id: "how",
    title: "How it is used",
    body: "Software calculates your scores and trends from what you log. HerCompass AI wording is used only when your consent is turned on, and it is written from your own entries - never sold, never shared for advertising.",
  },
  {
    id: "access",
    title: "Who can access it",
    body: "You can. A partner cannot, unless you deliberately turn sharing on - and even then, a partner sees a summary you approve, never your raw logs. Admin and support staff only see what is needed to keep the app working.",
  },
  {
    id: "retention",
    title: "How long we keep it",
    body: "Your entries stay until you delete the account or ask us to remove them. Deleting the account removes the account and the logs stored with it.",
  },
  {
    id: "controls",
    title: "Your controls",
    body: "You can change consent in Settings, turn partner sharing on or off on the partner page, manage notifications, or delete the account at the bottom of Settings. Nothing here is locked to support: everything can be changed or revoked by you.",
  },
] as const;

export default function PrivacyCenterPage() {
  const [data, setData] = useState<MemberAccountData | null>(null);
  const [partner, setPartner] = useState<{ partner: ConnectedPartner | null } | null>(null);
  const [snapshotDate, setSnapshotDate] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void memberClient.getAccount().then((result) => {
      if (!active) return;
      if (!result.success || !result.data) {
        setError(result.message || "We couldn't load the privacy center. Please try again.");
        return;
      }
      setData(result.data);
    });
    void memberClient.getPartnerConnection().then((result) => {
      if (active && result.success && result.data) setPartner(result.data);
    });
    void memberClient.getDashboard().then((result) => {
      if (active && result.success && result.data?.onboarding.completed) {
        setSnapshotDate(result.data.onboarding.completedAt);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return <ErrorNotice title="We couldn't load the privacy center." message={error} />;
  }

  if (!data) {
    return <PanelSkeleton lines={4} />;
  }

  const entries: PrivacyTimelineEntry[] = [
    {
      icon: "account",
      label: "Account created",
      date: data.profile.memberSince,
      note: `${data.profile.email} on the ${data.profile.planLabel.toLowerCase()} plan.`,
    },
    {
      icon: "snapshot",
      label: "Snapshot",
      date: snapshotDate,
      note: snapshotDate
        ? "Your baseline is built from the answers you gave. It is a starting point, not a diagnosis."
        : "Not built yet. Complete the Snapshot to create your baseline.",
    },
    data.consent
      ? {
          icon: "consent",
          label: data.consent.allowsPersonalization
            ? "Personalization consent"
            : "Personalization consent (off)",
          date: data.consent.recordedAt,
          note: `Recorded against version ${data.consent.version}. AI wording uses your entries only with this on.`,
        }
      : {
          icon: "consent",
          label: "Personalization consent",
          date: null,
          note: "Recorded the first time you complete the Snapshot. You can change it in Settings.",
        },
    partner?.partner
      ? {
          icon: "partner",
          label: "Partner connected",
          date: partner.partner.joinedAt,
          note: "Only the summaries you approve can be shared. Nothing else moves.",
        }
      : {
          icon: "partner",
          label: "Partner support",
          date: null,
          note: "Not connected. You can invite a partner anytime, or leave it off.",
        },
  ];

  return (
    <div className="animate-fadeIn">
      <header className="border-b border-slate-200 pb-6">
        <p className="text-xs font-bold uppercase tracking-wider text-violet-700">Privacy Center</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Your data, your call
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Everything you log stays private by default. Here is what the app collects, what happens
          with it, and every switch that puts you in charge.
        </p>
      </header>

      <div className="grid gap-8 pt-8 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-12">
        <nav aria-label="Privacy center sections" className="lg:sticky lg:top-24 lg:self-start">
          <ul className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {SECTIONS.map((section) => (
              <li key={section.id} className="shrink-0">
                <a
                  href={`#${section.id}`}
                  className="inline-flex min-h-9 items-center rounded-lg px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 space-y-8">
          <section id="overview" className="scroll-mt-24">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Overview</h2>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <dt className="text-xs font-semibold text-slate-500">Account</dt>
                <dd className="mt-1 break-words text-sm font-semibold text-slate-900">
                  {data.profile.email}
                </dd>
                <dd className="text-xs text-slate-500">
                  Member since {formatDate(data.profile.memberSince)} · {data.profile.planLabel}
                </dd>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <dt className="text-xs font-semibold text-slate-500">Personalization consent</dt>
                <dd className="mt-1 text-sm font-semibold text-slate-900">
                  {data.consent
                    ? data.consent.allowsPersonalization
                      ? "On"
                      : "Off"
                    : "Not recorded yet"}
                </dd>
                <dd className="text-xs text-slate-500">
                  {data.consent
                    ? `Agreed ${formatDate(data.consent.recordedAt)} · version ${data.consent.version}`
                    : "Recorded with your first Snapshot"}
                </dd>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <dt className="text-xs font-semibold text-slate-500">Unread notices</dt>
                <dd className="mt-1 text-sm font-semibold text-slate-900">
                  {data.notifications.unreadCount}
                </dd>
                <dd className="text-xs text-slate-500">
                  <Link href="/app/notifications" className={linkClass}>
                    Open notifications
                  </Link>
                </dd>
              </div>
            </dl>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <DataControlCard
                icon="notifications"
                title="Manage notifications"
                body="Choose which notices reach you, and whether a daily check-in reminder should nudge you."
                href="/app/settings#notifications"
                hrefLabel="Open notice settings"
              />
              <DataControlCard
                icon="delete"
                title="Delete your account"
                body="Permanent and irreversible. Removing the account also removes the logs stored with it."
                href="/app/settings#data"
                hrefLabel="Go to delete account"
              />
            </div>
          </section>

          <section id="partner" className="scroll-mt-24">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                  Partner sharing
                </h2>
                <p className="mt-1 max-w-xl text-sm text-slate-600">
                  Sharing is always a summary you approve. Raw logs never leave your account.
                </p>
              </div>
            </div>
            <div className="mt-4">
              <PartnerSharingSnapshot
                sharingOn={data.partner?.sharingOn ?? false}
                interestLabel={data.partner?.interestLabel ?? null}
                scopes={data.partner?.scopes ?? []}
              />
            </div>
          </section>

          <section id="history" className="scroll-mt-24">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
              Your privacy history
            </h2>
            <p className="mt-1 max-w-xl text-sm text-slate-600">
              The moments that shaped this account, in the order they happened.
            </p>
            <div className="mt-4">
              <ConsentHistoryTimeline entries={entries} />
            </div>
          </section>

          <section id="handling" className="scroll-mt-24">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">
              How your data works
            </h2>
            <p className="mt-1 max-w-xl text-sm text-slate-600">
              Plain answers to the questions members ask most. Nothing here is legal-speak.
            </p>
            <PrivacyAccordion
              items={DISCLOSURES.map((item) => ({
                id: item.id,
                title: item.title,
                children: <p className="max-w-2xl text-sm leading-relaxed text-slate-600">{item.body}</p>,
              }))}
            />
          </section>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border border-slate-200 bg-white px-5 py-4">
            <p className="text-sm font-semibold text-slate-900">More places to look</p>
            <Link href="/app/settings" className={linkClass}>
              Settings
            </Link>
            <Link href="/app/partner" className={linkClass}>
              Partner support
            </Link>
            <Link href="/app/snapshot" className={linkClass}>
              Your Snapshot
            </Link>
            <Link href="/privacy" className={linkClass}>
              Full privacy policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}