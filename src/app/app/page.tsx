"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Moon,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { memberClient } from "@/lib/member/memberClient";
import type { MemberDashboardData } from "@/lib/member/memberTypes";

function StatusCard({
  label,
  value,
  icon: Icon,
  href,
}: {
  label: string;
  value: string;
  icon: typeof Activity;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md"
    >
      <div className="flex items-center justify-between text-xs font-bold text-slate-500">
        <span>{label}</span>
        <Icon className="h-4 w-4 text-violet-600" />
      </div>
      <p className="mt-3 text-sm font-bold text-slate-900">{value}</p>
    </Link>
  );
}

export default function MemberHomePage() {
  const { user } = useAuth();
  const [data, setData] = useState<MemberDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void memberClient.getDashboard().then((result) => {
      if (!active) return;
      if (result.success && result.data) setData(result.data);
      else setError(result.message);
    });
    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm font-semibold text-rose-700">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-48 rounded-3xl bg-violet-100" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-24 rounded-2xl bg-slate-100" />
          <div className="h-24 rounded-2xl bg-slate-100" />
        </div>
      </div>
    );
  }

  const firstName = user?.name?.split(" ")[0] || data.member.name.split(" ")[0];
  const snapshotHref = data.onboarding.snapshotAvailable
    ? "/app/snapshot"
    : "/onboarding";

  return (
    <div className="space-y-6 animate-fadeIn">
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-violet-950 via-indigo-900 to-slate-900 p-6 text-white shadow-xl shadow-violet-900/10 sm:p-9">
        <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="relative max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-violet-100">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" />
            Your personal intelligence space
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Good morning, {firstName}
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-violet-100/90">
            See what you have shared, choose one small action for today, and
            keep building your personal picture over time.
          </p>
          <Link
            href={snapshotHref}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-violet-800 shadow-lg transition hover:bg-violet-50"
          >
            <Sparkles className="h-4 w-4" />
            {data.onboarding.snapshotAvailable
              ? "View My Snapshot"
              : "Create My Snapshot"}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatusCard
          label="Symptoms"
          value={data.today.symptom ? "Logged today" : "Not logged yet"}
          icon={Activity}
          href="/app/track?tab=symptoms"
        />
        <StatusCard
          label="Mood"
          value={data.today.mood ? "Logged today" : "Not logged yet"}
          icon={TrendingUp}
          href="/app/track?tab=mood"
        />
        <StatusCard
          label="Sleep"
          value={data.today.sleep ? "Logged today" : "Not logged yet"}
          icon={Moon}
          href="/app/track?tab=sleep"
        />
        <StatusCard
          label="Energy"
          value={data.today.energy ? "Logged today" : "Not logged yet"}
          icon={Zap}
          href="/app/track?tab=energy"
        />
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-violet-700">
                Today&apos;s focus
              </p>
              <h2 className="mt-1 text-xl font-extrabold text-slate-900">
                Build one useful signal
              </h2>
            </div>
            <Clock3 className="h-5 w-5 text-violet-600" />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            A quick check-in helps you notice patterns without turning your day
            into a questionnaire.
          </p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            <Link
              href="/app/track"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white hover:bg-violet-700"
            >
              <Activity className="h-4 w-4" />
              Open daily check-in
            </Link>
            <Link
              href="/app/progress"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              <TrendingUp className="h-4 w-4" />
              See my progress
            </Link>
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-5 shadow-sm sm:p-6">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <CheckCircle2 className="h-4 w-4" />
            Private by design
          </div>
          <h2 className="mt-3 text-lg font-extrabold text-slate-900">
            You stay in control
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Your personal entries remain private. Partner support is optional
            and controlled by your consent settings.
          </p>
          <Link
            href="/app/account"
            className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-emerald-800"
          >
            Review privacy settings <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
