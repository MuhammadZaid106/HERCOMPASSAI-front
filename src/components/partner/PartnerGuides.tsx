"use client";

import Link from "next/link";
import { partnerClient, type DigestSections } from "@/lib/partner/partnerClient";
import { partnerPlanText } from "@/lib/partner/partnerPlan";
import { PartnerCrumb, partnerCrumbs } from "./PartnerCrumb";
import { PartnerFrame } from "./PartnerFrame";
import { PartnerState, usePartnerQuery } from "./PartnerState";

function Lines({ title, lines }: { title: string; lines: string[] }) {
  if (lines.length === 0) return null;
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-extrabold text-slate-900">{title}</h2>
      <ul className="mt-3 space-y-2">
        {lines.map((line) => (
          <li key={line} className="text-sm leading-relaxed text-slate-700">
            {line}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PartnerIdeaPage({ kind }: { kind: "support" | "conversation" }) {
  const query = usePartnerQuery(() => (kind === "support" ? partnerClient.support() : partnerClient.conversation()));
  const title = kind === "support" ? "Ideas for today" : "Start a better conversation";
  const crumbs = partnerCrumbs({ label: kind === "support" ? "Support" : "Conversation" });
  if (!query.ready) return <PartnerState title={title} loading crumbs={crumbs} />;
  if (query.error || !query.data) {
    return <PartnerState title="Nothing here yet" body={query.error || "That topic is not shared."} crumbs={crumbs} />;
  }
  if (!query.data.included) {
    return (
      <PartnerState
        title={title}
        kicker="Their plan"
        body={partnerPlanText(query.data.plusMessage)}
        action={{ href: "/partner", label: "Back to Partner home" }}
        crumbs={crumbs}
      />
    );
  }
  return (
    <PartnerFrame>
      <div className="space-y-5">
        <PartnerCrumb items={crumbs} />
        <header className="rounded-3xl bg-gradient-to-br from-violet-950 via-indigo-900 to-slate-900 p-6 text-white sm:p-8">
          <p className="text-xs font-bold uppercase tracking-wider text-violet-200">Partner support</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-violet-100">
            Ideas for supporting {query.data.memberFirstName}. They use the topic she allowed. They do not use her private logs.
          </p>
        </header>
        {query.data.safeLine && (
          <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-slate-700">
            {query.data.safeLine}
          </p>
        )}
        <Lines title={kind === "support" ? "Ways to offer support" : "Ways to ask"} lines={query.data.lines ?? []} />
        {query.data.sources && query.data.sources.length > 0 && (
          <p className="text-xs font-semibold text-slate-500">Sources: {query.data.sources.join(", ")}</p>
        )}
        <Link href="/partner" className="inline-flex text-sm font-bold text-violet-700">
          Back to Partner home
        </Link>
      </div>
    </PartnerFrame>
  );
}

function DigestBody({ sections }: { sections: DigestSections }) {
  return (
    <div className="mt-5 grid gap-4">
      {sections.whatSheMayBeExperiencing && (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-extrabold text-slate-900">What she may be experiencing</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">{sections.whatSheMayBeExperiencing}</p>
        </section>
      )}
      <Lines title="What may help" lines={sections.whatMayHelp} />
      <Lines title="How to communicate" lines={sections.howToCommunicate} />
      <Lines title="What to avoid" lines={sections.whatToAvoid} />
      {sections.oneSimpleSupportAction && (
        <section className="rounded-3xl border border-violet-200 bg-violet-50 p-5 sm:p-6">
          <h2 className="text-lg font-extrabold text-slate-900">One simple support action</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">{sections.oneSimpleSupportAction}</p>
        </section>
      )}
      {sections.advancedObservation && (
        <section className="rounded-3xl border border-indigo-200 bg-indigo-50 p-5 sm:p-6">
          <h2 className="text-lg font-extrabold text-slate-900">A closer look this week</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            This closer look is included with HerCompass Premium. It uses the same shared topics and the same sources.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-slate-700">{sections.advancedObservation}</p>
        </section>
      )}
    </div>
  );
}

export function PartnerDigestPage() {
  const query = usePartnerQuery(() => partnerClient.digest());
  const crumbs = partnerCrumbs({ label: "Digest" });
  if (!query.ready) return <PartnerState title="Weekly partner digest" loading crumbs={crumbs} />;
  if (query.error || !query.data) {
    return <PartnerState title="Nothing here yet" body={query.error || "A weekly guide is not available."} crumbs={crumbs} />;
  }
  if (!query.data.included || !query.data.sections) {
    return (
      <PartnerState
        title="Your weekly support guide"
        kicker="Their plan"
        body={partnerPlanText(query.data.plusMessage)}
        action={{ href: "/partner", label: "Back to Partner home" }}
        crumbs={crumbs}
      />
    );
  }
  return (
    <PartnerFrame>
      <div className="space-y-5">
        <PartnerCrumb items={crumbs} />
        <header className="rounded-3xl bg-gradient-to-br from-violet-950 via-indigo-900 to-slate-900 p-6 text-white sm:p-8">
          <p className="text-xs font-bold uppercase tracking-wider text-violet-200">Partner digest</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Your weekly partner digest</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-violet-100">
            This week for {query.data.memberFirstName}. This is a support guide, not a medical report.
          </p>
        </header>
        {(query.data.safeLine || query.data.sections.safeLine) && (
          <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-slate-700">
            {query.data.safeLine || query.data.sections.safeLine}
          </p>
        )}
        <DigestBody sections={query.data.sections} />
        {query.data.sources && query.data.sources.length > 0 && (
          <p className="text-xs font-semibold text-slate-500">Sources: {query.data.sources.join(", ")}</p>
        )}
      </div>
    </PartnerFrame>
  );
}
