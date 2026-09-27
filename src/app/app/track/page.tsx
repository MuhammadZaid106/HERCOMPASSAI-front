"use client";

import { useState } from "react";
import {
  Activity,
  Check,
  Droplets,
  Heart,
  Moon,
  Smile,
  Sparkles,
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
      className={`rounded-xl border px-3 py-3 text-left text-sm font-semibold transition ${selected ? "border-violet-500 bg-violet-50 text-violet-800 ring-1 ring-violet-500/20" : "border-slate-200 bg-white text-slate-700 hover:border-violet-200 hover:bg-slate-50"}`}
    >
      {children}
    </button>
  );
}

export default function TrackPage() {
  const [tab, setTab] = useState<Tab>("symptoms");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [impact, setImpact] = useState("somewhat");
  const [mood, setMood] = useState(3);
  const [selectedMoodTags, setSelectedMoodTags] = useState<string[]>([]);
  const [sleepQuality, setSleepQuality] = useState("good");
  const [selectedSleepChallenges, setSelectedSleepChallenges] = useState<
    string[]
  >([]);
  const [sleepHours, setSleepHours] = useState("7");
  const [energy, setEnergy] = useState(3);
  const [energyPattern, setEnergyPattern] = useState("varies");
  const [movement, setMovement] = useState(3);
  const [nutrition, setNutrition] = useState(3);
  const [hydration, setHydration] = useState(3);
  const [stress, setStress] = useState(3);

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
                });
    setStatus(result.success ? "Saved successfully." : result.message);
    setBusy(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-violet-700">
          Daily check-in
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
          What would you like to notice today?
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          A few structured signals are enough. Optional notes can add context,
          but you never need to write an essay.
        </p>
      </div>
      <div className="grid grid-cols-5 gap-1 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm sm:gap-2 sm:p-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setTab(id);
              setStatus(null);
            }}
            className={`flex min-h-16 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-bold sm:text-xs ${tab === id ? "bg-violet-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"}`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      <section className="rounded-3xl border border-slate-200/90 bg-white p-5 shadow-sm sm:p-8">
        {tab === "symptoms" && (
          <div className="space-y-6">
            <Header
              icon={Activity}
              title="How are you feeling today?"
              text="Select anything you've noticed. These are personal observations, not diagnoses."
            />
            <div>
              <Label>Select all that apply</Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
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
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
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
              text="Choose a simple level, then add any words that fit."
            />
            <Scale
              value={mood}
              setValue={setMood}
              labels={["Very low", "Low", "Okay", "Good", "Very good"]}
            />
            <div>
              <Label>Anything else you noticed?</Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
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
              text="A simple sleep check-in helps connect rest with your daytime experience."
            />
            <div>
              <Label>Sleep quality</Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
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
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
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
              text="Notice the overall level and when the day felt most difficult."
            />
            <Scale
              value={energy}
              setValue={setEnergy}
              labels={["Low", "Below average", "Okay", "Good", "High"]}
            />
            <div>
              <Label>When was it most challenging?</Label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
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
              text="These small signals help you see which routines are worth repeating."
            />
            <MetricChoice
              label="Movement"
              value={movement}
              setValue={setMovement}
              icon={Activity}
            />
            <MetricChoice
              label="Nutrition"
              value={nutrition}
              setValue={setNutrition}
              icon={Utensils}
            />
            <MetricChoice
              label="Hydration"
              value={hydration}
              setValue={setHydration}
              icon={Droplets}
            />
            <MetricChoice
              label="Stress"
              value={stress}
              setValue={setStress}
              icon={Sparkles}
            />
          </div>
        )}
        {status && (
          <div
            className={`mt-6 rounded-xl border p-3 text-sm font-semibold ${status === "Saved successfully." ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}
          >
            {status}
          </div>
        )}
        <div className="mt-7 flex justify-end">
          <button
            type="button"
            onClick={() => void save()}
            disabled={busy}
            className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 hover:bg-violet-700 disabled:opacity-50"
          >
            {busy ? "Saving..." : "Save today’s check-in"}
          </button>
        </div>
      </section>
    </div>
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
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-600">{text}</p>
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
      <Label>Choose a level</Label>
      <input
        type="range"
        min="1"
        max="5"
        value={value}
        onChange={(event) => setValue(Number(event.target.value))}
        className="w-full accent-violet-600"
      />
      <div className="mt-2 flex justify-between text-[11px] font-semibold text-slate-500">
        {labels.map((label) => (
          <span key={label}>{label}</span>
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
    <div>
      <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-800">
        <Icon className="h-4 w-4 text-violet-600" />
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
