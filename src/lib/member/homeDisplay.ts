import type {
  DashboardDomainLogs,
  DomainLogSummary,
  PartnerSupportInterest,
  TrendEngineOutput,
} from "./memberTypes";
import { formatChangePercent, trendLabel } from "./trendDisplay";

export type CheckInKey = keyof DashboardDomainLogs;

export function greetingForHour(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

/** Format a YYYY-MM-DD key without shifting the calendar day. */
export function formatLogDate(isoDate: string): string {
  const [year, month, day] = isoDate.slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return isoDate;
  return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

export function checkInStatus(
  today: DomainLogSummary | null,
  latest: DomainLogSummary | null,
): { title: string; detail: string } {
  if (today) return { title: "Logged today", detail: today.label };
  if (latest) {
    return {
      title: `Last logged ${formatLogDate(latest.entryDate)}`,
      detail: latest.label,
    };
  }
  return { title: "Not logged yet", detail: "Add today's entry" };
}

export function homePictureLine(trends: TrendEngineOutput): string {
  const noted = trends.patternIndicators[0];
  if (noted) return noted;

  const domains: Array<[string, TrendEngineOutput["sleep"]]> = [
    ["sleep", trends.sleep],
    ["mood", trends.mood],
    ["energy", trends.energy],
    ["symptom entries", trends.symptoms],
  ];
  for (const [label, domain] of domains) {
    if (!domain.sufficientData || domain.changePercent === null) continue;
    return `Your logs suggest ${label} is ${trendLabel(domain.trend).toLowerCase()} compared with the earlier part of this week (${formatChangePercent(domain.changePercent)}).`;
  }
  return "Your picture builds after a few check-ins. Each log makes the pattern easier to see.";
}

export function partnerPrompt(interest: PartnerSupportInterest | null): {
  title: string;
  body: string;
} {
  if (interest === "yes" || interest === "maybe") {
    return {
      title: "Could partner support help?",
      body: "You left the door open. A partner only receives what you consent to share — never your raw logs.",
    };
  }
  if (interest === "not_now") {
    return {
      title: "Partner support can wait",
      body: "You chose not right now. Your entries stay private until you decide otherwise.",
    };
  }
  if (interest === "not_interested" || interest === "no_partner") {
    return {
      title: "This space stays yours",
      body: "Partner support is optional. Nothing is shared unless you set that up later.",
    };
  }
  return {
    title: "Could partner support help?",
    body: "You can decide later. Partners never receive your raw logs.",
  };
}
