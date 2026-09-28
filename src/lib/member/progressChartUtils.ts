import type { TrackingRange } from "./memberTypes";

export type ProgressMetricKey = "symptoms" | "mood" | "sleep" | "energy";

const METRIC_META: Record<
  ProgressMetricKey,
  { title: string; unit: string; max: number; valueLabel: (value: number) => string }
> = {
  symptoms: {
    title: "Symptoms",
    unit: "symptoms logged that day",
    max: 8,
    valueLabel: (v) => (v === 1 ? "1 symptom" : `${v} symptoms`),
  },
  mood: {
    title: "Mood",
    unit: "level 1 (low) to 5 (high)",
    max: 5,
    valueLabel: (v) => `${v}/5 mood`,
  },
  sleep: {
    title: "Sleep",
    unit: "quality 1 (poor) to 4 (very good)",
    max: 4,
    valueLabel: (v) => {
      const labels = ["", "Poor", "Fair", "Good", "Very good"];
      return labels[v] ? `${labels[v]} sleep` : `${v}/4`;
    },
  },
  energy: {
    title: "Energy",
    unit: "level 1 (low) to 5 (high)",
    max: 5,
    valueLabel: (v) => `${v}/5 energy`,
  },
};

export function getMetricChartMeta(key: ProgressMetricKey) {
  return METRIC_META[key];
}

export function rangeToDays(range: TrackingRange): number {
  return range === "90d" ? 90 : range === "30d" ? 30 : 7;
}

function toLocalDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Calendar days in the window (oldest → newest), local YYYY-MM-DD */
export function buildTimelineDates(range: TrackingRange, today = new Date()): string[] {
  const days = rangeToDays(range);
  const end = new Date(today);
  end.setHours(12, 0, 0, 0);
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(end.getDate() - i);
    dates.push(toLocalDateKey(d));
  }
  return dates;
}

export function formatTimelineDayLabel(dateStr: string, range: TrackingRange): string {
  const d = new Date(`${dateStr}T12:00:00`);
  if (range === "7d") {
    return d.toLocaleDateString(undefined, { weekday: "short" });
  }
  return d.toLocaleDateString(undefined, { month: "numeric", day: "numeric" });
}

export function formatTimelineDateShort(dateStr: string): string {
  const d = new Date(`${dateStr}T12:00:00`);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function pointsByDate(
  points: Array<{ date: string; value: number }>,
): Map<string, number> {
  const map = new Map<string, number>();
  for (const p of points) {
    const key =
      typeof p.date === "string" && p.date.length >= 10
        ? p.date.slice(0, 10)
        : String(p.date);
    map.set(key, p.value);
  }
  return map;
}
