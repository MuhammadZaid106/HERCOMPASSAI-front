"use client";

import Link from "next/link";
import { partnerClient, type DigestSections } from "@/lib/partner/partnerClient";
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
  if (!query.ready) return <PartnerState title={title} body="Preparing your information..." />;
  if (query.error || !query.data) {
    return <PartnerState title="Nothing here yet" body={query.error || "That topic is not shared."} />;
  }
  if (!query.data.included) {
    return (
      <PartnerState
        title={title}
        body={query.data.plusMessage || "Go deeper with HerCompass Plus."}
        action={{ href: "/partner", label: "Back to Partner home" }}
      />
    );
  }
  return (
    <PartnerFrame>
      <div className="space-y-5">
        <header className="rounded-3xl bg-gradient-to-br from-violet-950 via-indigo-900 to-slate-900 p-6 text-white sm:p-8">
          <p className="text-xs font-bold uppercase tracking-wider text-violet-200">Partner support</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-violet-100">
            Ideas for supporting {query.data.memberFirstName}. They use the topic she allowed. They do not use her private logs.
          </p>
        </header>
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
    </div>
  );
}

export function PartnerDigestPage() {
  const query = usePartnerQuery(() => partnerClient.digest());
  if (!query.ready) return <PartnerState title="Weekly partner digest" body="Preparing your information..." />;
  if (query.error || !query.data) {
    return <PartnerState title="Nothing here yet" body={query.error || "A weekly guide is not available."} />;
  }
  if (!query.data.included || !query.data.sections) {
    return (
      <PartnerState
        title="Your weekly support guide"
        body={query.data.plusMessage || "Go deeper with HerCompass Plus."}
        action={{ href: "/partner", label: "Back to Partner home" }}
      />
    );
  }
  return (
    <PartnerFrame>
      <div className="space-y-5">
        <header className="rounded-3xl bg-gradient-to-br from-violet-950 via-indigo-900 to-slate-900 p-6 text-white sm:p-8">
          <p className="text-xs font-bold uppercase tracking-wider text-violet-200">Partner digest</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Your weekly partner digest</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-violet-100">
            This week for {query.data.memberFirstName}. This is a support guide, not a medical report.
          </p>
        </header>
        <DigestBody sections={query.data.sections} />
        {query.data.sources && query.data.sources.length > 0 && (
          <p className="text-xs font-semibold text-slate-500">Sources: {query.data.sources.join(", ")}</p>
        )}
      </div>
    </PartnerFrame>
  );
}
