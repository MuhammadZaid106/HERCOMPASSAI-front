import { authClient } from "@/lib/auth/authClient";
import type { ApiResult, MemberPlanId } from "@/lib/member/memberTypes";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:5000";

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiResult<T>> {
  try {
    const response = await authClient.authenticatedFetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
    return (await response
      .json()
      .catch(() => ({
        success: false,
        message: "Network error",
      }))) as ApiResult<T>;
  } catch {
    return {
      success: false,
      message: "We couldn't reach HerCompass just now. Your information is safe.",
    };
  }
}

export type BillingInterval = "month" | "year";

/**
 * What GET /api/billing/status returns.
 *
 * `isConfigured` is false when the server has no Stripe secret key, so the UI
 * can say billing is unavailable instead of failing on every button press.
 * `subscriptionStatus` is the raw Stripe status ("active", "past_due",
 * "canceled", …) or "none".
 */
export interface BillingStatus {
  isConfigured: boolean;
  plan: MemberPlanId;
  subscriptionStatus: string;
  hasStripeCustomer: boolean;
  hasActiveSubscription: boolean;
}

/** The Checkout Session Stripe redirects the browser to. */
export interface CheckoutSessionData {
  sessionId: string;
  url: string | null;
}

/** The Stripe Customer Portal URL for changing or cancelling a subscription. */
export interface PortalSessionData {
  url: string;
}

export const billingClient = {
  getStatus(): Promise<ApiResult<BillingStatus>> {
    return request<BillingStatus>("/api/billing/status");
  },
  createCheckoutSession(input: {
    plan: "plus" | "premium";
    interval: BillingInterval;
    successUrl?: string;
    cancelUrl?: string;
  }): Promise<ApiResult<CheckoutSessionData>> {
    return request<CheckoutSessionData>("/api/billing/checkout-session", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
  createPortalSession(returnUrl?: string): Promise<ApiResult<PortalSessionData>> {
    return request<PortalSessionData>("/api/billing/portal", {
      method: "POST",
      body: JSON.stringify({ returnUrl }),
    });
  },
};
