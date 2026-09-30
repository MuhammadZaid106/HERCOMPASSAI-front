"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Activity,
  Check,
  Droplets,
  Heart,
  Moon,
  Smile,
  Sparkles,
  Users,
  Utensils,
  Zap,
} from "lucide-react";
import { trackingClient } from "@/lib/tracking/trackingClient";

type Tab = "symptoms" | "mood" | "sleep" | "energy" | "lifestyle";

const tabs: Array<{ id: Tab; label: string; icon: typeof Activity }> = [
  { id: "symptoms", label: "Symptoms", icon: Activity },
  { id: "mood", label: "Mood", icon: Smile },
  { id: "sleep", label: "Sleep", icon: Moon },
  { id: "energy", label: "Energy", icon: Zap },
  { id: "lifestyle", label: "Lifestyle", icon: Heart },
];

const symptomOptions = [
  "Hot flashes",
  "Night sweats",
  "Headaches",
  "Joint discomfort",
  "Sleep changes",
  "Fatigue",
  "Brain fog",
  "Mood changes",
];
const moodFaces = [
  { level: 1, face: "😔", label: "Very low" },
  { level: 2, face: "😕", label: "Low" },
  { level: 3, face: "😐", label: "Okay" },
  { level: 4, face: "🙂", label: "Good" },
  { level: 5, face: "😊", label: "Very good" },
];
const moodTags = [
  "Calm",
  "Stressed",
  "Irritable",
  "Anxious",
  "Overwhelmed",
  "Positive",
  "Tired",
];
const sleepChallenges = [
  "Waking up",
  "Stress",
  "Temperature",
  "Night sweats",
  "Routine",
  "Other",
];

function isTrackTab(value: string | null): value is Tab {
  return tabs.some((item) => item.id === value);
}

function nextTab(current: Tab): Tab | null {
  const index = tabs.findIndex((item) => item.id === current);
  return tabs[index + 1]?.id ?? null;
}

export default function TrackPage() {
  const [tab, setTab] = useState<Tab>("symptoms");
  const [savedTabs, setSavedTabs] = useState<Tab[]>([]);
  const [finished, setFinished] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [impact, setImpact] = useState("somewhat");
  const [mood, setMood] = useState(3);
  const [selectedMoodTags, setSelectedMoodTags] = useState<string[]>([]);
  const [sleepQuality, setSleepQuality] = useState("good");
  const [selectedSleepChallenges, setSelectedSleepChallenges] = useState<string[]>([]);
  const [sleepHours, setSleepHours] = useState("7");
  const [energy, setEnergy] = useState(3);
  const [energyPattern, setEnergyPattern] = useState("varies");
  const [movement, setMovement] = useState(3);
  const [nutrition, setNutrition] = useState(3);
  const [hydration, setHydration] = useState(3);
  const [stress, setStress] = useState(3);
  const [relaxation, setRelaxation] = useState(false);
  const [social, setSocial] = useState(3);
  const [routine, setRoutine] = useState(3);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("tab");
    if (isTrackTab(requested)) setTab(requested);
  }, []);

  const openTab = (id: Tab) => {
    setTab(id);
    setStatus(null);
    setFinished(false);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", id);
    window.history.replaceState(null, "", `${url.pathname}${url.search}`);
  };

  const toggle = (
    items: string[],
    value: string,
    setter: (next: string[]) => void,
  ) =>
    setter(
      items.includes(value)
        ? items.filter((item) => item !== value)
        : [...items, value],
    );

  const save = async () => {
    setBusy(true);
    setStatus(null);
    const result =
      tab === "symptoms"
        ? await trackingClient.saveSymptoms({ symptoms, impactLevel: impact })
        : tab === "mood"
          ? await trackingClient.saveMood({
              moodLevel: mood,
              moodTags: selectedMoodTags,
            })
          : tab === "sleep"
            ? await trackingClient.saveSleep({
                quality: sleepQuality,
                durationMinutes: Math.round(Number(sleepHours) * 60),
                sleepChallenges: selectedSleepChallenges,
              })
            : tab === "energy"
              ? await trackingClient.saveEnergy({
                  energyLevel: energy,
                  energyPattern,
                })
              : await trackingClient.saveLifestyle({
                  movementLevel: movement,
                  nutritionRating: nutrition,
                  hydrationRating: hydration,
                  stressLevel: stress,
                  relaxationCompleted: relaxation,
                  socialConnection: social,
                  routineConsistency: routine,
                });

    setBusy(false);
    if (!result.success) {
      setStatus(result.message || "We couldn't save that. Please try again.");
      return;
    }

    setSavedTabs((current) => (current.includes(tab) ? current : [...current, tab]));
    const upcoming = nextTab(tab);
    if (upcoming) {
      openTab(upcoming);
      return;
    }
    setFinished(true);
    setStatus("Today’s check-in is saved.");
  };

  const stepIndex = tabs.findIndex((item) => item.id === tab);
  const current = tabs[stepIndex];

  return (
    <div className="space-y-5 animate-fadeIn sm:space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-violet-700">
          Daily check-in
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          A short check-in, one step at a time
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Symptoms, mood, sleep, energy, then lifestyle. Saving moves you to the
          next step. These are personal observations, not a diagnosis.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>
            Step {stepIndex + 1} of {tabs.length}
          </span>
          <span className="text-violet-700">{current.label}</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-violet-600 transition-all"
            style={{ width: `${((stepIndex + 1) / tabs.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
        {tabs.map(({ id, label, icon: Icon }, index) => {
          const active = tab === id;
          const saved = savedTabs.includes(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => openTab(id)}
              className={`flex min-h-14 min-w-[5.75rem] shrink-0 flex-col items-center justify-center gap-1 rounded-2xl border px-3 text-[11px] font-bold sm:min-w-0 sm:flex-1 sm:text-xs ${active ? "border-violet-600 bg-violet-600 text-white shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:border-violet-200"}`}
            >
              {saved && !active ? (
                <Check className="h-4 w-4 text-emerald-600" />
              ) : (
                <Icon className="h-4 w-4" />
              )}
              <span>
                {index + 1}. {label}
              </span>
            </button>
          );
        })}
      </div>

      <section className="rounded-3xl border border-slate-200/90 bg-white p-4 shadow-sm sm:p-8">
        {tab === "symptoms" && (
          <div className="space-y-6">
            <Header
              icon={Activity}
              title="How are you feeling today?"
              text="Select anything you've noticed."
            />
            <div>
              <Label>Select all that apply</Label>
              <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 lg:grid-cols-4">
                {symptomOptions.map((item) => (
                  <ChoiceButton
                    key={item}
                    selected={symptoms.includes(item)}
                    onClick={() => toggle(symptoms, item, setSymptoms)}
                  >
                    {symptoms.includes(item) && (
                      <Check className="mr-1 inline h-3.5 w-3.5" />
                    )}
                    {item}
                  </ChoiceButton>
                ))}
              </div>
            </div>
            <div>
              <Label>How much did this affect your day?</Label>
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                {[
                  ["not_at_all", "Not at all"],
                  ["a_little", "A little"],
                  ["somewhat", "Somewhat"],
                  ["a_lot", "A lot"],
                ].map(([id, label]) => (
                  <ChoiceButton
                    key={id}
                    selected={impact === id}
                    onClick={() => setImpact(id)}
                  >
                    {label}
                  </ChoiceButton>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "mood" && (
          <div className="space-y-6">
            <Header
              icon={Smile}
              title="How are you feeling today?"
              text="Pick the face that fits. Extra words are optional."
            />
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {moodFaces.map((item) => (
                <button
                  key={item.level}
                  type="button"
                  aria-pressed={mood === item.level}
                  onClick={() => setMood(item.level)}
                  className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl border px-1 py-2 text-center sm:min-h-20 ${mood === item.level ? "border-violet-500 bg-violet-50 text-violet-800 ring-1 ring-violet-500/20" : "border-slate-200 bg-white text-slate-600"}`}
                >
                  <span className="text-2xl sm:text-3xl" aria-hidden>
                    {item.face}
                  </span>
                  <span className="text-[10px] font-bold leading-tight sm:text-xs">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
            <div>
              <Label>Anything else you noticed? Optional</Label>
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                {moodTags.map((item) => (
                  <ChoiceButton
                    key={item}
                    selected={selectedMoodTags.includes(item)}
                    onClick={() =>
                      toggle(selectedMoodTags, item, setSelectedMoodTags)
                    }
                  >
                    {item}
                  </ChoiceButton>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "sleep" && (
          <div className="space-y-6">
            <Header
              icon={Moon}
              title="How did you sleep?"
              text="Quality, roughly how long, and anything that got in the way."
            />
            <div>
              <Label>Sleep quality</Label>
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                {[
                  ["poor", "Poor"],
                  ["fair", "Fair"],
                  ["good", "Good"],
                  ["very_good", "Very good"],
                ].map(([id, label]) => (
                  <ChoiceButton
                    key={id}
                    selected={sleepQuality === id}
                    onClick={() => setSleepQuality(id)}
                  >
                    {label}
                  </ChoiceButton>
                ))}
              </div>
            </div>
            <div>
              <Label>Approximate hours</Label>
              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={sleepHours}
                onChange={(event) => setSleepHours(event.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 sm:w-40"
              />
            </div>
            <div>
              <Label>What affected your sleep?</Label>
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
                {sleepChallenges.map((item) => (
                  <ChoiceButton
                    key={item}
                    selected={selectedSleepChallenges.includes(item)}
                    onClick={() =>
                      toggle(
                        selectedSleepChallenges,
                        item,
                        setSelectedSleepChallenges,
                      )
                    }
                  >
                    {item}
                  </ChoiceButton>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "energy" && (
          <div className="space-y-6">
            <Header
              icon={Zap}
              title="How was your energy today?"
              text="Mark the overall level, from low to high."
            />
            <Scale
              value={energy}
              setValue={setEnergy}
              labels={["Low", "Below average", "Okay", "Good", "High"]}
            />
            <div>
              <Label>When was it most challenging?</Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                {[
                  ["morning", "Morning"],
                  ["afternoon", "Afternoon"],
                  ["evening", "Evening"],
                  ["throughout_the_day", "All day"],
                  ["varies", "Varies"],
                ].map(([id, label]) => (
                  <ChoiceButton
                    key={id}
                    selected={energyPattern === id}
                    onClick={() => setEnergyPattern(id)}
                  >
                    {label}
                  </ChoiceButton>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "lifestyle" && (
          <div className="space-y-6">
            <Header
              icon={Heart}
              title="What supported your day?"
              text="Small signals for the routines worth repeating."
            />
            <div className="grid gap-5 md:grid-cols-2">
              <MetricChoice label="Movement" value={movement} setValue={setMovement} icon={Activity} />
              <MetricChoice label="Nutrition" value={nutrition} setValue={setNutrition} icon={Utensils} />
              <MetricChoice label="Hydration" value={hydration} setValue={setHydration} icon={Droplets} />
              <MetricChoice label="Stress" value={stress} setValue={setStress} icon={Sparkles} />
              <MetricChoice label="Social connection" value={social} setValue={setSocial} icon={Users} />
              <MetricChoice label="Routine" value={routine} setValue={setRoutine} icon={Check} />
            </div>
            <button
              type="button"
              aria-pressed={relaxation}
              onClick={() => setRelaxation((current) => !current)}
              className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-bold ${relaxation ? "border-violet-500 bg-violet-50 text-violet-800" : "border-slate-200 bg-white text-slate-700"}`}
            >
              Relaxation
              <span className="text-xs font-semibold">{relaxation ? "Done today" : "Not today"}</span>
            </button>
          </div>
        )}

        {status && (
          <div
            className={`mt-6 rounded-xl border p-3 text-sm font-semibold ${status === "Today’s check-in is saved." ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}
          >
            <p>{status}</p>
            {finished && (
              <Link href="/app" className="mt-2 inline-flex text-sm font-bold text-emerald-800 underline">
                Return to Home
              </Link>
            )}
          </div>
        )}

        <div className="mt-7">
          <button
            type="button"
            onClick={() => void save()}
            disabled={busy}
            className="w-full rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-500/20 hover:bg-violet-700 disabled:opacity-50 sm:w-auto"
          >
            {busy
              ? "Saving..."
              : nextTab(tab)
                ? "Save today’s check-in"
                : "Save and finish"}
          </button>
          {nextTab(tab) && (
            <p className="mt-2 text-xs text-slate-500">
              This saves {current.label.toLowerCase()} and opens{" "}
              {tabs[stepIndex + 1].label}.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function ChoiceButton({
  selected,
  children,
  onClick,
}: {
  selected: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-12 rounded-xl border px-3 py-3 text-left text-sm font-semibold transition ${selected ? "border-violet-500 bg-violet-50 text-violet-800 ring-1 ring-violet-500/20" : "border-slate-200 bg-white text-slate-700 hover:border-violet-200 hover:bg-slate-50"}`}
    >
      {children}
    </button>
  );
}

function Header({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Activity;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <h2 className="text-lg font-extrabold text-slate-900 sm:text-xl">{title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-slate-600">{text}</p>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-700">
      {children}
    </p>
  );
}

function Scale({
  value,
  setValue,
  labels,
}: {
  value: number;
  setValue: (value: number) => void;
  labels: string[];
}) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-[10px] font-bold uppercase tracking-wide text-slate-400">
        <span>Low</span>
        <span>High</span>
      </div>
      <input
        type="range"
        min="1"
        max="5"
        value={value}
        aria-valuetext={labels[value - 1]}
        onChange={(event) => setValue(Number(event.target.value))}
        className="w-full accent-violet-600"
      />
      <div className="mt-2 flex justify-between gap-1 text-[10px] font-semibold leading-tight text-slate-500 sm:text-[11px]">
        {labels.map((label, index) => (
          <span
            key={index}
            className={`min-w-0 flex-1 text-center ${value === index + 1 ? "text-violet-700" : ""} ${label ? "" : "invisible"}`}
          >
            {label || "·"}
          </span>
        ))}
      </div>
    </div>
  );
}

function MetricChoice({
  label,
  value,
  setValue,
  icon: Icon,
}: {
  label: string;
  value: number;
  setValue: (value: number) => void;
  icon: typeof Activity;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-3 sm:p-4">
      <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800">
        <Icon className="h-4 w-4 shrink-0 text-violet-600" />
        {label}
      </div>
      <Scale
        value={value}
        setValue={setValue}
        labels={["Low", "", "Okay", "", "High"]}
      />
    </div>
  );
}
