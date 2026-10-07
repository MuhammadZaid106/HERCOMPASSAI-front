"use client";

import Link from "next/link";
import { partnerClient } from "@/lib/partner/partnerClient";
import { PartnerCrumb, partnerCrumbs } from "./PartnerCrumb";
import { PartnerFrame } from "./PartnerFrame";
import { PartnerState, usePartnerQuery } from "./PartnerState";

export function PartnerActivitiesPage() {
  const query = usePartnerQuery(() => partnerClient.activities());
  const crumbs = partnerCrumbs({ label: "Activities" });
  if (!query.ready) {
    return <PartnerState title="Shared activities" loading crumbs={crumbs} />;
  }
  if (query.error || !query.data) {
    return (
      <PartnerState
        title="Nothing here yet"
        body={query.error || "Shared activities stay hidden until that topic is on."}
        action={{ href: "/partner", label: "Back to Partner home" }}
        crumbs={crumbs}
      />
    );
  }
  return (
    <PartnerFrame>
      <PartnerCrumb items={crumbs} />
      <header className="rounded-3xl bg-gradient-to-br from-violet-950 via-indigo-900 to-slate-900 p-6 text-white sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-violet-200">Shared activity</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Try something together</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-violet-100">
          These are suggestions for time with {query.data.memberFirstName}. They do not record a health log, and they
          do not say anyone’s sleep or mood changed.
        </p>
      </header>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2">
        {query.data.activities.map((activity) => (
          <li key={activity.key} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-extrabold text-slate-900">{activity.label}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{activity.suggestion}</p>
            {activity.sourceName && (
              <p className="mt-3 text-xs font-semibold text-slate-500">Source: {activity.sourceName}</p>
            )}
          </li>
        ))}
      </ul>
      <Link href="/partner" className="mt-6 inline-flex text-sm font-bold text-violet-700">
        Back to Partner home
      </Link>
    </PartnerFrame>
  );
}
