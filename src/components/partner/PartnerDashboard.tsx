"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  BookOpen,
  Footprints,
  HandHeart,
  HeartHandshake,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { authClient } from "@/lib/auth/authClient";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

interface PartnerHomeOff {
  connected: false;
  access?: "off";
}

interface PartnerHomeOn {
  connected: true;
  access: "on";
  memberFirstName: string;
  generalSupport: boolean;
  sharedActivities: boolean;
  communicationGuidance: boolean;
  digestIncluded: boolean;
}

type PartnerHome = PartnerHomeOff | PartnerHomeOn;

const ACTIVITIES = [
  "Walk together",
  "Relaxation",
  "Meal preparation",
  "Conversation",
  "Sleep routine",
  "Fun activity",
  "Connection",
];

function StatusPill({ on }: { on: boolean }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
        on ? "bg-emerald-50 text-emerald-800" : "bg-slate-100 text-slate-500"
      }`}
    >
      {on ? "Shared" : "Not shared"}
    </span>
  );
}

function SupportCard({
  icon,
  eyebrow,
  title,
  shared,
  children,
}: {
  icon: ReactNode;
  eyebrow: string;
  title: string;
  shared: boolean;
  children: ReactNode;
}) {
  return (
    <section
      className={`flex h-full flex-col rounded-3xl border p-5 shadow-sm sm:p-6 ${
        shared ? "border-slate-200 bg-white" : "border-dashed border-slate-200 bg-slate-50/80"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ${
            shared ? "bg-violet-50 text-violet-700" : "bg-white text-slate-400"
          }`}
        >
          {icon}
        </span>
        <StatusPill on={shared} />
      </div>
      <p className="mt-4 text-[11px] font-bold uppercase tracking-wider text-violet-700">{eyebrow}</p>
      <h2 className="mt-1 text-lg font-extrabold tracking-tight text-slate-900">{title}</h2>
      <div className="mt-3 text-sm leading-relaxed text-slate-600">{children}</div>
    </section>
  );
}

export function PartnerDashboard() {
  const { user, logout } = useAuth();
  const [home, setHome] = useState<PartnerHome | null>(null);
  const [error, setError] = useState<string | null>(null);
  const partnerName = user?.name?.trim().split(/\s+/)[0];

  useEffect(() => {
    let active = true;
    void authClient
      .authenticatedFetch(`${API_BASE}/api/partner/home`)
      .then(async (response) => {
        const body = (await response.json()) as { success?: boolean; message?: string; data?: PartnerHome };
        if (!active) return;
        if (!response.ok || !body.success || !body.data) {
          setError(body.message || "We couldn't open Partner Support just now.");
          return;
        }
        setHome(body.data);
      })
      .catch(() => {
        if (active) setError("We couldn't reach HerCompass just now. Refresh this page.");
      });
    return () => {
      active = false;
    };
  }, []);

  const connected = home?.connected === true;

  return (
    <div className="min-h-screen bg-[#FBFBF9] text-slate-900">
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3.5 sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white">
              <HeartHandshake className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold tracking-tight">HerCompassAI</p>
              <p className="text-[11px] font-semibold text-slate-500">Partner home</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void logout()}
            className="shrink-0 rounded-full border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-violet-950 via-indigo-900 to-slate-900 p-6 text-white shadow-xl shadow-violet-900/10 sm:p-8">
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-violet-400/20 blur-3xl" />
          <div className="relative">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-violet-100">
                <Sparkles className="h-3.5 w-3.5 text-amber-200" />
                {connected ? "Sharing is on" : home?.access === "off" ? "Sharing is off" : "Not connected"}
              </span>
            </div>
            <h1 className="mt-4 max-w-xl text-3xl font-extrabold tracking-tight sm:text-4xl">
              {partnerName ? `${partnerName}, how can you support today?` : "How can you support today?"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-violet-100/90 sm:text-base">
              This home is your side of Partner Support. It shows only what your partner chose to share.
              Personal symptoms, raw check-ins, and private notes stay on their account.
            </p>
          </div>
        </section>

        {error && (
          <p className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">{error}</p>
        )}

        {!error && !home && (
          <p className="mt-5 text-sm text-slate-500">Preparing your information...</p>
        )}

        {home && !home.connected && home.access !== "off" && (
          <section className="mt-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-extrabold tracking-tight">Nothing here yet</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-600">
              You do not have an accepted invitation. When a member invites you and you accept, this page fills in
              with the kinds of support they turned on.
            </p>
            <ol className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                ["1", "They invite you", "The email comes from their account, not from a health record."],
                ["2", "You accept", "Accepting joins Partner Support. It does not open their logs."],
                ["3", "They choose sharing", "Only the topics they leave on appear as cards below."],
              ].map(([step, title, body]) => (
                <li key={step} className="rounded-2xl bg-violet-50/70 p-4">
                  <span className="text-xs font-extrabold text-violet-700">{step}</span>
                  <p className="mt-1 text-sm font-extrabold text-slate-900">{title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">{body}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {home && !home.connected && home.access === "off" && (
          <section className="mt-5 rounded-3xl border border-amber-200 bg-amber-50/80 p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-amber-700">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900">Partner access has been revoked</h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-700">
                  Sharing is off. This screen no longer shows a name or support cards. If they invite you again, you
                  will see only what they choose to share.
                </p>
              </div>
            </div>
          </section>
        )}

        {connected && home.connected && (
          <div className="mt-5 space-y-4">
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-violet-700">Who this is for</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight">
                You are connected with {home.memberFirstName}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                The cards below are the support they allowed. A dashed card is a topic they have not shared. It stays
                empty on purpose.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700">
                  General support <StatusPill on={home.generalSupport} />
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700">
                  Conversation <StatusPill on={home.communicationGuidance} />
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700">
                  Time together <StatusPill on={home.sharedActivities} />
                </span>
              </div>
            </section>

            <div className="grid gap-4 sm:grid-cols-2">
              <SupportCard
                icon={<Sparkles className="h-5 w-5" />}
                eyebrow="Understand"
                title="Learn what may be changing"
                shared={home.generalSupport}
              >
                {home.generalSupport
                  ? "This card is for patterns they chose to share. It describes support. It does not diagnose."
                  : "This part has not been shared."}
              </SupportCard>
              <SupportCard
                icon={<HandHeart className="h-5 w-5" />}
                eyebrow="Support"
                title="Ideas for today"
                shared={home.generalSupport}
              >
                {home.generalSupport
                  ? "Ask what would be welcome today, then follow that answer."
                  : "This part has not been shared."}
              </SupportCard>
              <SupportCard
                icon={<MessageCircle className="h-5 w-5" />}
                eyebrow="Communicate"
                title="Start a better conversation"
                shared={home.communicationGuidance}
              >
                {home.communicationGuidance ? (
                  <p className="rounded-2xl bg-violet-50 px-4 py-3 text-base font-semibold text-violet-950">
                    “How can I support you this week?”
                  </p>
                ) : (
                  "This part has not been shared."
                )}
              </SupportCard>
              <SupportCard
                icon={<Footprints className="h-5 w-5" />}
                eyebrow="Shared Activity"
                title="Try something together"
                shared={home.sharedActivities}
              >
                {home.sharedActivities ? (
                  <ul className="flex flex-wrap gap-2">
                    {ACTIVITIES.map((activity) => (
                      <li
                        key={activity}
                        className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700"
                      >
                        {activity}
                      </li>
                    ))}
                  </ul>
                ) : (
                  "This part has not been shared."
                )}
              </SupportCard>
            </div>

            <section className="rounded-3xl border border-violet-200 bg-violet-50/70 p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-violet-700">
                    <BookOpen className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-violet-700">Partner Digest</p>
                    <h2 className="mt-1 text-lg font-extrabold tracking-tight">Your weekly support guide</h2>
                  </div>
                </div>
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
                    home.digestIncluded ? "bg-white text-violet-800" : "bg-white text-slate-500"
                  }`}
                >
                  {home.digestIncluded ? "On this plan" : "Plus"}
                </span>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-700">
                {home.digestIncluded
                  ? "A weekly guide is part of their plan. It is not ready yet, so this card stays empty until that guide exists. It will not list symptoms or check-ins."
                  : "Go deeper with HerCompass Plus. A weekly guide is not part of the current plan, so there is nothing to preview here."}
              </p>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
