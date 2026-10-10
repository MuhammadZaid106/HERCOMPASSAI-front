"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  adminClient,
  type AdminEvidenceRow,
  type AdminEvidenceSubmission,
  type EvidenceLifecycleStatus,
} from "@/lib/admin/adminClient";
import { EVIDENCE_LIFECYCLE_LABEL, shortDate } from "@/lib/admin/labels";
import { TableSkeleton } from "@/components/ui/LoadState";

const LIFECYCLE_ACTIONS: EvidenceLifecycleStatus[] = [
  "submitted",
  "reviewed",
  "approved",
  "active",
  "review_due",
  "retired",
];

export default function AdminEvidencePage() {
  const [draft, setDraft] = useState("");
  const [query, setQuery] = useState("");
  const [records, setRecords] = useState<AdminEvidenceRow[] | null>(null);
  const [submissions, setSubmissions] = useState<AdminEvidenceSubmission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [clinicianNames, setClinicianNames] = useState<Record<string, string>>({});
  const [submitForm, setSubmitForm] = useState({
    evidenceId: "",
    sourceName: "",
    organization: "",
    topic: "",
    publicationDate: "",
    urlOrIdentifier: "",
    evidenceCategory: "medical",
    summary: "",
  });

  useEffect(() => {
    let active = true;
    void adminClient.evidence(query).then((result) => {
      if (!active) return;
      if (!result.ok || !result.data) {
        setError(result.message || "The evidence catalog is unavailable right now.");
        setRecords(null);
        return;
      }
      setError(null);
      setRecords(result.data.records);
      setSubmissions(result.data.submissions ?? []);
      const names: Record<string, string> = {};
      for (const record of result.data.records) {
        names[record.evidenceId] = record.clinicianReviewerName ?? "";
      }
      for (const row of result.data.submissions ?? []) {
        if (!(row.evidenceId in names)) {
          names[row.evidenceId] = row.clinicianReviewerName ?? "";
        }
      }
      setClinicianNames(names);
    });
    return () => {
      active = false;
    };
  }, [query, refresh]);

  function setLifecycle(evidenceId: string, status: EvidenceLifecycleStatus) {
    setNotice(null);
    void adminClient
      .setEvidenceStatus(evidenceId, status, {
        clinicianReviewerName: clinicianNames[evidenceId] ?? "",
        note: "",
      })
      .then((result) => {
        if (!result.ok) {
          setError(result.message || "That status was not saved.");
          return;
        }
        setError(null);
        setNotice(`Marked ${EVIDENCE_LIFECYCLE_LABEL[status] ?? status}.`);
        setRefresh((value) => value + 1);
      });
  }

  return (
    <AdminShell title="Evidence" subtitle="Approved sources used to ground guidance">
      <div className="space-y-5">
        <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
          Move sources through submitted → reviewed → approved → active. Gateway
          retrieval uses active sources. Add a clinician name when signing off.
        </p>
        {error && (
          <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </p>
        )}
        {notice && <p className="text-sm text-slate-600">{notice}</p>}

        <form
          className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            setNotice(null);
            void adminClient.submitEvidence(submitForm).then((result) => {
              if (!result.ok) {
                setError(result.message || "That source was not submitted.");
                return;
              }
              setError(null);
              setNotice("Source submitted.");
              setSubmitForm({
                evidenceId: "",
                sourceName: "",
                organization: "",
                topic: "",
                publicationDate: "",
                urlOrIdentifier: "",
                evidenceCategory: "medical",
                summary: "",
              });
              setRefresh((value) => value + 1);
            });
          }}
        >
          <h2 className="text-sm font-bold text-slate-900 sm:col-span-2">Submit a new source</h2>
          <label className="text-sm font-semibold text-slate-700">
            Evidence id
            <input
              value={submitForm.evidenceId}
              onChange={(event) =>
                setSubmitForm((current) => ({ ...current, evidenceId: event.target.value }))
              }
              required
              placeholder="ev-nams-example"
              pattern="ev-[A-Za-z0-9-]+"
              className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Source name
            <input
              value={submitForm.sourceName}
              onChange={(event) =>
                setSubmitForm((current) => ({ ...current, sourceName: event.target.value }))
              }
              required
              className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Organization
            <input
              value={submitForm.organization}
              onChange={(event) =>
                setSubmitForm((current) => ({ ...current, organization: event.target.value }))
              }
              required
              className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Topic
            <input
              value={submitForm.topic}
              onChange={(event) =>
                setSubmitForm((current) => ({ ...current, topic: event.target.value }))
              }
              required
              className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            Publication date
            <input
              value={submitForm.publicationDate}
              onChange={(event) =>
                setSubmitForm((current) => ({ ...current, publicationDate: event.target.value }))
              }
              className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700">
            URL or identifier
            <input
              value={submitForm.urlOrIdentifier}
              onChange={(event) =>
                setSubmitForm((current) => ({ ...current, urlOrIdentifier: event.target.value }))
              }
              className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
            />
          </label>
          <label className="text-sm font-semibold text-slate-700 sm:col-span-2">
            Summary
            <textarea
              value={submitForm.summary}
              onChange={(event) =>
                setSubmitForm((current) => ({ ...current, summary: event.target.value }))
              }
              rows={2}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-normal"
            />
          </label>
          <button
            type="submit"
            className="h-11 rounded-xl bg-[#7C5CFC] px-5 text-sm font-semibold text-white sm:col-span-2 sm:w-fit"
          >
            Submit source
          </button>
        </form>

        <form
          className="flex flex-col gap-3 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            setQuery(draft);
          }}
        >
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">Search sources</span>
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Search source, publisher, or citation"
              className="h-11 w-full rounded-xl border border-slate-300 bg-white pr-3 pl-10 text-sm text-slate-900 outline-none focus:border-violet-500"
            />
          </label>
          <button
            type="submit"
            className="h-11 rounded-xl bg-[#7C5CFC] px-5 text-sm font-semibold text-white"
          >
            Search
          </button>
        </form>

        {!records && !error && <TableSkeleton rows={6} />}

        {submissions.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Submissions</h2>
            <ul className="space-y-3">
              {submissions.map((row) => (
                <li key={row.evidenceId} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-semibold text-slate-900">{row.sourceName}</p>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {EVIDENCE_LIFECYCLE_LABEL[row.status] ?? row.status} · v{row.version}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    {row.organization} · {row.topic}
                  </p>
                  {row.summary && <p className="mt-2 text-sm text-slate-700">{row.summary}</p>}
                  <label className="mt-3 block max-w-sm text-sm font-semibold text-slate-700">
                    Clinician reviewer name
                    <input
                      value={clinicianNames[row.evidenceId] ?? ""}
                      onChange={(event) =>
                        setClinicianNames((current) => ({
                          ...current,
                          [row.evidenceId]: event.target.value,
                        }))
                      }
                      className="mt-1 h-10 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
                    />
                  </label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {LIFECYCLE_ACTIONS.map((status) => (
                      <button
                        key={status}
                        type="button"
                        disabled={row.status === status}
                        className="h-9 rounded-lg border border-slate-300 px-3 text-xs font-semibold text-slate-700 disabled:opacity-40"
                        onClick={() => setLifecycle(row.evidenceId, status)}
                      >
                        {EVIDENCE_LIFECYCLE_LABEL[status]}
                      </button>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {records && records.length === 0 && submissions.length === 0 && (
          <p className="rounded-2xl border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-600">
            Nothing here yet.
          </p>
        )}
        {records && records.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-sm font-bold text-slate-900">Catalog</h2>
            <ul className="space-y-3">
              {records.map((record) => (
                <li key={record.evidenceId} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-semibold text-slate-900">{record.sourceName}</p>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {EVIDENCE_LIFECYCLE_LABEL[record.lifecycleStatus] ?? record.lifecycleStatus}
                      {" · "}v{record.version}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{record.publisher}</p>
                  <dl className="mt-3 grid gap-2 text-xs text-slate-500 sm:grid-cols-2">
                    <div>
                      <dt className="font-semibold">Category</dt>
                      <dd className="mt-0.5 text-slate-800">{record.sourceCategory}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Published</dt>
                      <dd className="mt-0.5 text-slate-800">{shortDate(record.publicationDate)}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Citation</dt>
                      <dd className="mt-0.5 font-mono text-slate-800">{record.citationId}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold">Clinician review</dt>
                      <dd className="mt-0.5 text-slate-800">
                        {record.clinicianReviewerName.trim()
                          ? record.clinicianReviewerName
                          : record.clinicianReview === "signed"
                            ? "Signed"
                            : "Pending a named reviewer"}
                      </dd>
                    </div>
                  </dl>
                  <label className="mt-3 block max-w-sm text-sm font-semibold text-slate-700">
                    Clinician reviewer name
                    <input
                      value={clinicianNames[record.evidenceId] ?? ""}
                      onChange={(event) =>
                        setClinicianNames((current) => ({
                          ...current,
                          [record.evidenceId]: event.target.value,
                        }))
                      }
                      className="mt-1 h-10 w-full rounded-xl border border-slate-300 px-3 text-sm font-normal"
                    />
                  </label>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {LIFECYCLE_ACTIONS.map((status) => (
                      <button
                        key={status}
                        type="button"
                        disabled={record.lifecycleStatus === status}
                        className="h-9 rounded-lg border border-slate-300 px-3 text-xs font-semibold text-slate-700 disabled:opacity-40"
                        onClick={() => setLifecycle(record.evidenceId, status)}
                      >
                        {EVIDENCE_LIFECYCLE_LABEL[status]}
                      </button>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </AdminShell>
  );
}
