"use client";

import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { memberClient } from "@/lib/member/memberClient";
import type { MemberSubscriptionData } from "@/lib/member/memberTypes";

export default function PlansPage() {
  const [data, setData] = useState<MemberSubscriptionData | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    void memberClient.getSubscription().then((result) => {
      if (result.success && result.data) setData(result.data);
      else setError(result.message);
    });
  }, []);
  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fadeIn">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-violet-700">
          Plans
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
          Your support, at your pace
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Your current plan is read from your member account. Pricing and future
          entitlements remain configurable.
        </p>
      </div>
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}
      {!data ? (
        <div className="h-48 animate-pulse rounded-3xl bg-slate-100" />
      ) : (
        <>
          <section className="rounded-3xl bg-linear-to-br from-violet-950 via-indigo-900 to-slate-900 p-7 text-white shadow-xl sm:p-9">
            <p className="text-xs font-bold uppercase tracking-wider text-violet-200">
              Current plan
            </p>
            <h2 className="mt-2 text-3xl font-extrabold">{data.label}</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-violet-100/90">
              {data.description}
            </p>
            <span className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold capitalize text-violet-800">
              <Check className="h-4 w-4" />
              {data.plan} access active
            </span>
          </section>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              "Personal Snapshot",
              "Basic tracking",
              "Evidence-informed guidance",
            ].map((feature) => (
              <div
                key={feature}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <Sparkles className="h-5 w-5 text-violet-600" />
                <p className="mt-3 text-sm font-bold text-slate-900">
                  {feature}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Available in your current experience.
                </p>
              </div>
            ))}
          </div>
          <Link
            href="/app"
            className="inline-flex text-sm font-bold text-violet-700 hover:text-violet-900"
          >
            Return to Home
          </Link>
        </>
      )}
    </div>
  );
}
