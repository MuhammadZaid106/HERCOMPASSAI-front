"use client";

import { useEffect, useState, type FormEvent } from "react";
import { communityClient, type CommunityBoard } from "@/lib/member/communityClient";
import { BlockSkeleton } from "@/components/ui/LoadState";

export default function CommunityPage() {
  const [board, setBoard] = useState<CommunityBoard | null>(null);
  const [topic, setTopic] = useState<string>("sleep");
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    void communityClient.board().then((result) => {
      if (!result.success || !result.data) {
        setError(result.message || "Community notes are unavailable right now. Your information is safe.");
        return;
      }
      setBoard(result.data);
      setTopic(result.data.topics[0]?.id ?? "sleep");
    });
  }, []);

  async function send(event: FormEvent) {
    event.preventDefault();
    setNote(null);
    setError(null);
    setSending(true);
    const result = await communityClient.post({ topic, body: draft });
    setSending(false);
    if (!result.success || !result.data?.note) {
      setError(result.message || "We couldn't save that note. Your information is safe.");
      return;
    }
    setBoard((current) =>
      current ? { ...current, notes: [result.data!.note, ...current.notes] } : current,
    );
    setDraft("");
    setNote("Your note is waiting for review. Other members will see it after it is approved.");
  }

  if (error && !board) {
    return <p className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</p>;
  }

  if (!board) {
    return <BlockSkeleton rows={3} />;
  }

  const selected = board.topics.find((item) => item.id === topic) ?? board.topics[0];
  const visible = board.notes.filter((item) => item.topic === selected?.id);

  return (
    <div className="space-y-6 animate-fadeIn">
      <header>
        <p className="text-xs font-bold uppercase tracking-wider text-violet-700">Community</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Community notes
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">{board.notice}</p>
      </header>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {board.topics.map((item) => {
          const active = item.id === selected?.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTopic(item.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
                active ? "bg-violet-600 text-white" : "bg-white text-slate-700 ring-1 ring-slate-200"
              }`}
            >
              {item.title}
            </button>
          );
        })}
      </div>

      {selected && (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="text-lg font-extrabold text-slate-900">{selected.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{selected.starter}</p>
        </section>
      )}

      {visible.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-600">
          Nothing here yet. The starter above is the topic until a note is approved.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {visible.map((item) => (
            <li key={item.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-violet-700">
                {item.firstName}
                {item.status === "pending" ? " · waiting for review" : ""}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">{item.body}</p>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={(event) => void send(event)} className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="text-lg font-extrabold text-slate-900">Leave a note</h2>
        <p className="mt-1 text-sm text-slate-600">Up to 280 characters. It stays private until staff approve it.</p>
        <textarea
          value={draft}
          maxLength={280}
          onChange={(event) => setDraft(event.target.value)}
          className="mt-3 min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm"
          placeholder="A short note in your own words"
        />
        <p className="mt-1 text-xs text-slate-500">{draft.trim().length} / 280</p>
        {error && <p className="mt-2 text-sm text-rose-700">{error}</p>}
        {note && <p className="mt-2 text-sm text-slate-700">{note}</p>}
        <button
          type="submit"
          disabled={sending || draft.trim().length === 0}
          className="mt-3 min-h-11 rounded-full bg-violet-600 px-5 text-sm font-bold text-white disabled:opacity-50"
        >
          {sending ? "Sending..." : "Send note"}
        </button>
      </form>
    </div>
  );
}
