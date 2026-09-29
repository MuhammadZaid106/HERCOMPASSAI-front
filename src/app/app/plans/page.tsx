"use client";

import { Check, Minus } from "lucide-react";
import { useEffect, useState } from "react";
import { memberClient } from "@/lib/member/memberClient";
import type {
  MemberPlanId,
  MemberSubscriptionData,
  PlanAccess,
} from "@/lib/member/memberTypes";

const PLAN_ORDER: MemberPlanId[] = ["free", "plus", "premium"];

function AccessMark({ access }: { access: PlanAccess }) {
  if (access === "included") {
    return (
      <span className="inline-flex items-center justify-center text-violet-700">
        <Check className="h-4 w-4" aria-hidden />
        <span className="sr-only">Included</span>
      </span>
    );
  }
  if (access === "limited") {
    return <span className="text-xs font-semibold text-slate-600">Limited</span>;
  }
  return (
    <span className="inline-flex items-center justify-center text-slate-300">
      <Minus className="h-4 w-4" aria-hidden />
      <span className="sr-only">Not included</span>
    </span>
  );
}

export default function PlansPage() {
  const [data, setData] = useState<MemberSubscriptionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void memberClient.getSubscription().then((result) => {
      if (!active) return;
      if (result.success && result.data) setData(result.data);
      else {
        setError(
          result.message ||
            "We couldn't complete that right now. Please try again.",
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
        <p className="font-semibold">We couldn&apos;t load plans.</p>
        <p className="mt-1">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-4" aria-busy="true">
        <div className="h-36 animate-pulse rounded-3xl bg-violet-100" />
        <div className="grid gap-3 lg:grid-cols-3">
          <div className="h-40 animate-pulse rounded-3xl bg-slate-100" />
          <div className="h-40 animate-pulse rounded-3xl bg-slate-100" />
          <div className="h-40 animate-pulse rounded-3xl bg-slate-100" />
        </div>
      </div>
    );
  }

  const plusAdds = data.comparison.filter(
    (row) => row.access.free !== "included" && row.access.plus === "included",
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      <header className="rounded-3xl bg-gradient-to-br from-violet-950 via-indigo-900 to-slate-900 p-6 text-white shadow-xl sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-violet-200">
          Current plan
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {data.label}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-violet-100">
          {data.summary} {data.description}
        </p>
      </header>

      <section>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
          Plans
        </h2>
        <ul className="mt-3 grid gap-3 lg:grid-cols-3">
          {data.plans.map((plan) => {
            const current = plan.id === data.plan;
            return (
              <li
                key={plan.id}
                className={`rounded-3xl border p-5 ${
                  current
                    ? "border-violet-300 bg-violet-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-wider text-violet-700">
                  {current ? "Your plan" : plan.label}
                </p>
                <h3 className="mt-2 text-lg font-extrabold text-slate-900">
                  {plan.label}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {plan.summary}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-3xl border border-violet-100 bg-white p-5 sm:p-6">
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
          Go deeper with HerCompass Plus
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Plus adds personalized wellness plans and the capabilities below.
          Premium adds multi-week adaptive plans. Prices stay configurable and
          are not shown here. Billing is not connected, so your plan does not
          change from this page.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {plusAdds.map((row) => (
            <li key={row.id} className="text-sm font-semibold text-slate-800">
              {row.label}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
          What each plan includes
        </h2>
        <ul className="mt-3 space-y-3 md:hidden">
          {data.comparison.map((row) => (
            <li
              key={row.id}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <p className="font-bold text-slate-900">{row.label}</p>
              <dl className="mt-3 grid grid-cols-3 gap-2 text-center">
                {PLAN_ORDER.map((planId) => (
                  <div key={planId}>
                    <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      {planId}
                    </dt>
                    <dd className="mt-1">
                      <AccessMark access={row.access[planId]} />
                    </dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
        <div className="mt-3 hidden overflow-x-auto rounded-3xl border border-slate-200 bg-white md:block">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3 font-semibold">Capability</th>
                {PLAN_ORDER.map((planId) => (
                  <th key={planId} className="px-4 py-3 text-center font-semibold">
                    {planId}
                    {planId === data.plan ? " · yours" : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.comparison.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 last:border-0">
                  <th className="px-4 py-3 font-semibold text-slate-800">
                    {row.label}
                  </th>
                  {PLAN_ORDER.map((planId) => (
                    <td key={planId} className="px-4 py-3 text-center">
                      <AccessMark access={row.access[planId]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
