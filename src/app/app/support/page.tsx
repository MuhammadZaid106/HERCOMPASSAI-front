"use client";

import { useMemo, useState } from "react";
import { memberClient } from "@/lib/member/memberClient";

const TOPICS = [
  {
    id: "getting_started",
    title: "Getting started",
    body: "Home, a Snapshot, and a daily check-in are the core loop.",
  },
  {
    id: "snapshot",
    title: "Snapshot",
    body: "Your baseline describes patterns. It does not diagnose.",
  },
  {
    id: "tracking",
    title: "Tracking",
    body: "Symptoms, mood, sleep, energy, and lifestyle save one step at a time.",
  },
  {
    id: "partner_support",
    title: "Partner Support",
    body: "Optional. A partner never receives raw logs.",
  },
  {
    id: "subscription",
    title: "Subscription",
    body: "Plans compares Free, Plus, and Premium. Billing is not connected.",
  },
  {
    id: "privacy",
    title: "Privacy",
    body: "Consent and partner sharing are on the Account page.",
  },
  {
    id: "ai_insights",
    title: "AI insights",
    body: "The model explains calculated trends. It does not calculate them.",
  },
] as const;

export default function SupportPage() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<(typeof TOPICS)[number]["id"]>("getting_started");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return TOPICS;
    return TOPICS.filter(
      (item) =>
        item.title.toLowerCase().includes(needle) || item.body.toLowerCase().includes(needle),
    );
  }, [query]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <header>
        <p className="text-xs font-bold uppercase tracking-wider text-violet-700">Support</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          How can we help?
        </h1>
      </header>

      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search"
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
      />

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Popular</h2>
        {visible.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">Nothing here yet. Try another word.</p>
        ) : (
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {visible.map((item) => (
              <li key={item.id} className="rounded-3xl border border-slate-200 bg-white p-4">
                <p className="font-bold text-slate-900">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{item.body}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <form
        className="space-y-3 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6"
        onSubmit={(event) => {
          event.preventDefault();
          setStatus(null);
          setError(null);
          void memberClient.sendSupport(topic, message).then((result) => {
            if (!result.success) {
              setError(result.message || "We couldn't save that message.");
              return;
            }
            setMessage("");
            setStatus("Saved successfully. Your message is on this account.");
          });
        }}
      >
        <h2 className="text-lg font-extrabold text-slate-900">Still need help?</h2>
        <label className="block text-sm font-semibold text-slate-700">
          Topic
          <select
            value={topic}
            onChange={(event) =>
              setTopic(event.target.value as (typeof TOPICS)[number]["id"])
            }
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-3 text-sm font-normal"
          >
            {TOPICS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.title}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold text-slate-700">
          Message
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={4}
            className="mt-1 w-full rounded-2xl border border-slate-200 px-3 py-3 text-sm font-normal"
          />
        </label>
        {error && <p className="text-sm text-rose-700">{error}</p>}
        {status && <p className="text-sm text-slate-700">{status}</p>}
        <button
          type="submit"
          className="min-h-11 rounded-full bg-violet-600 px-5 text-sm font-bold text-white"
        >
          Contact support
        </button>
      </form>
    </div>
  );
}
