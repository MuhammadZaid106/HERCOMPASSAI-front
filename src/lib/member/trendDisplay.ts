import type { DomainTrend, TrendDirection } from "./memberTypes";

export function trendLabel(direction: TrendDirection): string {
  if (direction === "increasing") return "Trending up";
  if (direction === "decreasing") return "Trending down";
  return "Mostly stable";
}

export function formatChangePercent(change: number | null): string {
  if (change === null) return "—";
  const sign = change > 0 ? "+" : "";
  return `${sign}${change}%`;
}

export function trendSummaryLine(
  domain: DomainTrend,
  label: string,
): string | null {
  if (!domain.sufficientData) return null;
  return `${label} is ${trendLabel(domain.trend).toLowerCase()} (${formatChangePercent(domain.changePercent)} vs prior period in this window).`;
}
