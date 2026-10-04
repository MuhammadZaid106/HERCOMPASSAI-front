/** Matches the partner API when a response has no plan sentence yet. */
export const PARTNER_PLAN_FALLBACK = "The member you support needs HerCompass Plus or Premium to open this.";

export function partnerPlanText(message?: string | null): string {
  const text = message?.trim();
  return text && text.length > 0 ? text : PARTNER_PLAN_FALLBACK;
}
