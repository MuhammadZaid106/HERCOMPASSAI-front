"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  HeartHandshake,
  Lock,
  Search,
  Sparkles,
  UserRound,
} from "lucide-react";

const config = {
  insights: {
    eyebrow: "Personal insights",
    title: "Your patterns become more useful when you can see them.",
    text: "Keep logging a few signals and this space will explain what is changing, what may be connected, and one small thing to try.",
    icon: Sparkles,
    href: "/app/track",
    action: "Open daily check-in",
  },
  plans: {
    eyebrow: "Plans",
    title: "Choose the depth of support that fits you.",
    text: "Free includes genuine tracking and your Personal Snapshot. Plus and Premium will add deeper personalization through configurable entitlements.",
    icon: Sparkles,
    href: "/app/snapshot",
    action: "View my current value",
  },
  explore: {
    eyebrow: "Explore",
    title: "Useful learning for real life.",
    text: "Educational content, recipes, movement, meditation, evidence explanations, and partner support will gather here as the content library grows.",
    icon: Search,
    href: "/app/track",
    action: "Start with tracking",
  },
  partner: {
    eyebrow: "Partner support",
    title: "You decide what support looks like.",
    text: "Partner support is optional. Sharing scopes, invitations, and revocation remain under your control and never expose raw private logs by default.",
    icon: HeartHandshake,
    href: "/app/account",
    action: "Review privacy settings",
  },
  account: {
    eyebrow: "Your account",
    title: "Keep your information and choices in your hands.",
    text: "Profile, consent, privacy, notifications, partner permissions, subscription, and account security will live here.",
    icon: UserRound,
    href: "/app/notifications",
    action: "Open notifications",
  },
  notifications: {
    eyebrow: "Notifications",
    title: "Stay informed without being overwhelmed.",
    text: "Snapshot updates, tracking reminders, recommendations, partner activity, and important privacy notices will appear here.",
    icon: Lock,
    href: "/app",
    action: "Return home",
  },
  support: {
    eyebrow: "Support",
    title: "Help when you need it.",
    text: "Find answers about getting started, Snapshots, tracking, Partner Support, subscriptions, privacy, and AI insights.",
    icon: BookOpen,
    href: "/app",
    action: "Return home",
  },
} as const;

export function MemberPlaceholder({ kind }: { kind: keyof typeof config }) {
  const item = config[kind];
  const Icon = item.icon;
  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fadeIn">
      <div className="rounded-3xl bg-gradient-to-br from-violet-950 via-indigo-900 to-slate-900 p-7 text-white shadow-xl sm:p-10">
        <span className="text-xs font-bold uppercase tracking-wider text-violet-200">
          {item.eyebrow}
        </span>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {item.title}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-violet-100/90">
          {item.text}
        </p>
        <Link
          href={item.href}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-violet-800"
        >
          <Icon className="h-4 w-4" />
          {item.action}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              This space is ready for your next signal
            </h2>
            <p className="text-sm text-slate-600">
              The dashboard foundation is active. Your personal data remains
              private while each module is connected to its own API.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
