"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth/authClient";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

export interface PartnerHomeOff {
  connected: false;
  access?: "off";
}

export interface PartnerHomeOn {
  connected: true;
  access: "on";
  memberFirstName: string;
  generalSupport: boolean;
  sharedActivities: boolean;
  communicationGuidance: boolean;
  digestIncluded: boolean;
}

export type PartnerHome = PartnerHomeOff | PartnerHomeOn;

export function usePartnerHome() {
  const [home, setHome] = useState<PartnerHome | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    void authClient
      .authenticatedFetch(`${API_BASE}/api/partner/home`)
      .then(async (response) => {
        const body = (await response.json()) as { success?: boolean; message?: string; data?: PartnerHome };
        if (!active) return;
        if (!response.ok || !body.success || !body.data) {
          setError(body.message || "We couldn't open Partner Support just now.");
          return;
        }
        setError(null);
        setHome(body.data);
      })
      .catch(() => {
        if (active) setError("We couldn't reach HerCompass just now. Refresh this page.");
      });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  return { home, error, reload: () => setReloadKey((value) => value + 1) };
}

export async function updatePartnerName(name: string): Promise<{ ok: boolean; message: string; name?: string }> {
  try {
    const response = await authClient.authenticatedFetch(`${API_BASE}/api/partner/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const body = (await response.json()) as { success?: boolean; message?: string; data?: { name?: string } };
    return {
      ok: Boolean(response.ok && body.success),
      message: body.message || "We couldn't save your name.",
      name: body.data?.name,
    };
  } catch {
    return { ok: false, message: "We couldn't reach HerCompass just now. Refresh this page." };
  }
}

export async function leavePartnerSupport(): Promise<{ ok: boolean; message: string }> {
  try {
    const response = await authClient.authenticatedFetch(`${API_BASE}/api/partner/leave`, { method: "POST" });
    const body = (await response.json()) as { success?: boolean; message?: string };
    return { ok: Boolean(response.ok && body.success), message: body.message || "We couldn't leave Partner Support just now." };
  } catch {
    return { ok: false, message: "We couldn't reach HerCompass just now. Refresh this page." };
  }
}
