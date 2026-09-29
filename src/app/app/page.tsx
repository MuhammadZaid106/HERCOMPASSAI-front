"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { greetingForHour } from "@/lib/member/homeDisplay";
import { memberClient } from "@/lib/member/memberClient";
import type { MemberDashboardData } from "@/lib/member/memberTypes";
import { CheckInGrid } from "@/components/member/home/CheckInGrid";
import { HomeSupportRow } from "@/components/member/home/HomeSupportRow";
import { NextStepCard } from "@/components/member/home/NextStepCard";
import { SnapshotCard } from "@/components/member/home/SnapshotCard";
import { TodayPictureCard } from "@/components/member/home/TodayPictureCard";

export default function MemberHomePage() {
  const { user } = useAuth();
  const [data, setData] = useState<MemberDashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    setGreeting(greetingForHour(new Date().getHours()));
  }, []);

  useEffect(() => {
    let active = true;
    void memberClient.getDashboard().then((result) => {
      if (!active) return;
      if (result.success && result.data) setData(result.data);
      else {
        setError(
          result.message ||
            "We couldn't complete that right now. Your information has been saved. Please try again.",
        );
      }
    });
    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm leading-relaxed text-rose-800">
        <p className="font-semibold">We couldn&apos;t complete that right now.</p>
        <p className="mt-1">{error}</p>
        <p className="mt-2 text-rose-700">
          Your information has been saved. Please try again.
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-4" aria-busy="true" aria-live="polite">
        <p className="text-sm font-semibold text-slate-500">
          Preparing your information...
        </p>
        <div className="h-16 animate-pulse rounded-2xl bg-slate-100" />
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="h-72 animate-pulse rounded-3xl bg-violet-100" />
          <div className="h-72 animate-pulse rounded-3xl bg-slate-100" />
        </div>
      </div>
    );
  }

  const firstName = user?.name?.split(" ")[0] || data.member.name.split(" ")[0];

  return (
    <div className="space-y-6 animate-fadeIn">
      <header>
        <p className="text-xs font-bold uppercase tracking-wider text-violet-700">
          Home
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {greeting}, {firstName}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          HerCompass shows what is changing in the patterns you log. It does
          not diagnose or prescribe.
        </p>
      </header>

      <div className="grid items-stretch gap-4 lg:grid-cols-[1.4fr_1fr]">
        <SnapshotCard snapshot={data.snapshot} />
        <TodayPictureCard trends={data.trends} />
      </div>

      <CheckInGrid
        today={data.today}
        latest={data.latest}
        loggedToday={data.checkIn.loggedToday}
        total={data.checkIn.total}
      />

      <NextStepCard step={data.nextStep} />

      <HomeSupportRow
        interest={data.partnerSupport.interest}
        plan={data.member.plan}
      />
    </div>
  );
}
