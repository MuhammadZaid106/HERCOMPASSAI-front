export const SCOPE_LABEL: Record<string, string> = {
  general_support: "General support",
  shared_activities: "Shared activities",
  communication_guidance: "Communication guidance",
};

export const INVITE_LABEL: Record<string, string> = {
  none: "None",
  sent: "Waiting",
  accepted: "Accepted",
  declined: "Declined",
  revoked: "Revoked",
};

export const PLAN_LABEL: Record<string, string> = {
  free: "Free",
  plus: "Plus",
  premium: "Premium",
};

export const ROLE_LABEL: Record<string, string> = {
  member: "Member",
  partner: "Partner",
  admin: "Admin",
  developer: "Developer",
};

export const ACCOUNT_LABEL: Record<string, string> = {
  confirmed: "Email confirmed",
  unconfirmed: "Email not confirmed",
};

export const SUBSCRIPTION_LABEL: Record<string, string> = {
  none: "No subscription",
  active: "Active",
  trialing: "Trialing",
  past_due: "Past due",
  canceled: "Canceled",
  other: "Other",
};

export const CONTENT_KIND_LABEL: Record<string, string> = {
  recipe: "Recipe",
  workout: "Workout",
  meditation: "Meditation",
  article: "Article",
  mens_academy: "Men's Academy",
  partner_content: "Partner content",
  evidence_explanation: "Evidence explanation",
  educational: "Educational",
};

export const EVIDENCE_LIFECYCLE_LABEL: Record<string, string> = {
  submitted: "Submitted",
  reviewed: "Reviewed",
  approved: "Approved",
  active: "Active",
  review_due: "Review due",
  retired: "Retired",
};

export const TRIAL_ELIGIBILITY_LABEL: Record<string, string> = {
  none: "None",
  invite_only: "Invite only",
  all_free: "All free members",
};

export function shortDay(isoDay: string): string {
  const date = new Date(`${isoDay}T00:00:00.000Z`);
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function shortDate(iso: string): string {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}
