"use client";

import { useCallback, useEffect, useState } from "react";
import { billingClient, type BillingStatus } from "@/lib/billing/billingClient";
import { memberClient } from "@/lib/member/memberClient";
import type { MemberSubscriptionData } from "@/lib/member/memberTypes";

export interface BillingOverview {
  subscription: MemberSubscriptionData | null;
  status: BillingStatus | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

/**
 * Shared loader for the subscription and billing screens.
 *
 * Both pages need the member's plan plus the Stripe status, so this
 * fetches them together and exposes a `reload` for post-checkout refresh.
 * Every `setState` happens inside `.then()`, which keeps the mount effect
 * free of synchronous state updates.
 */
export function useBillingOverview(): BillingOverview {
  const [subscription, setSubscription] = useState<MemberSubscriptionData | null>(null);
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    void Promise.all([
      memberClient.getSubscription(),
      billingClient.getStatus(),
    ]).then(([subscriptionResult, billingResult]) => {
      if (!active) return;
      if (subscriptionResult.success && subscriptionResult.data) {
        setSubscription(subscriptionResult.data);
        setError(null);
      } else {
        setSubscription(null);
        setError(
          subscriptionResult.message ||
            "We couldn't load your subscription. Please try again.",
        );
      }
      if (billingResult.success && billingResult.data) {
        setStatus(billingResult.data);
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const reload = useCallback(() => {
    setLoading(true);
    setReloadKey((key) => key + 1);
  }, []);

  return { subscription, status, loading, error, reload };
}
