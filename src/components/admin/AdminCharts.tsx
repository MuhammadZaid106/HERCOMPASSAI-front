"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface ChartPoint {
  label: string;
  value: number;
  color?: string;
}

const COLORS = ["#7C5CFC", "#6366F1", "#E8A598", "#5EAE8A"];

function DataList({ points }: { points: ChartPoint[] }) {
  return (
    <ul className="sr-only">
      {points.map((point) => (
        <li key={point.label}>
          {point.label}: {point.value}
        </li>
      ))}
    </ul>
  );
}

export function AdminBarChart({
  points,
  empty,
}: {
  points: ChartPoint[];
  empty: string;
}) {
  if (points.every((point) => point.value === 0)) {
    return (
      <p className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
        {empty}
      </p>
    );
  }

  return (
    <div className="h-64 w-full min-w-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={points} margin={{ top: 8, right: 4, left: -12, bottom: 8 }}>
          <CartesianGrid stroke="#E2E8F0" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "#64748B" }}
            interval={0}
            angle={-35}
            textAnchor="end"
            height={52}
          />
          <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#64748B" }} width={36} />
          <Tooltip
            cursor={{ fill: "rgba(124, 92, 252, 0.08)" }}
            contentStyle={{
              borderRadius: 12,
              borderColor: "#E2E8F0",
              fontSize: 12,
            }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={28}>
            {points.map((point, index) => (
              <Cell key={point.label} fill={point.color ?? COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <DataList points={points} />
    </div>
  );
}

export function AdminDonut({
  points,
  empty,
}: {
  points: ChartPoint[];
  empty: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  const total = points.reduce((sum, point) => sum + point.value, 0);
  if (total === 0) {
    return (
      <p className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
        {empty}
      </p>
    );
  }

  const slices = points.filter((point) => point.value > 0);

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
      <div className="h-44 w-44 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="value"
              nameKey="label"
              innerRadius={52}
              outerRadius={74}
              paddingAngle={2}
              stroke="none"
            >
              {slices.map((point, index) => (
                <Cell
                  key={point.label}
                  fill={point.color ?? COLORS[index % COLORS.length]}
                  opacity={!active || active === point.label ? 1 : 0.28}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                borderColor: "#E2E8F0",
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="min-w-0 flex-1 space-y-2">
        {points.map((point, index) => {
          const color = point.color ?? COLORS[index % COLORS.length];
          const share = Math.round((point.value / total) * 100);
          const on = active === point.label;
          return (
            <li key={point.label}>
              <button
                type="button"
                onMouseEnter={() => setActive(point.label)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(point.label)}
                onBlur={() => setActive(null)}
                aria-pressed={on}
                className={`w-full rounded-xl border px-3 py-2.5 text-left transition ${
                  on ? "border-violet-300 bg-violet-50" : "border-slate-200 bg-slate-50 hover:border-slate-300"
                }`}
              >
                <span className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex min-w-0 items-center gap-2 text-slate-700">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                    <span className="truncate font-semibold">{point.label}</span>
                  </span>
                  <span className="font-bold tabular-nums text-slate-900">{point.value}</span>
                </span>
                <span className="mt-2 flex items-center gap-2">
                  <span className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-white">
                    <span
                      className="block h-full rounded-full"
                      style={{ width: `${share}%`, backgroundColor: color }}
                    />
                  </span>
                  <span className="w-9 text-right text-[11px] font-semibold text-slate-500">{share}%</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <DataList points={points} />
    </div>
  );
}
