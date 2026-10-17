import { authClient } from "@/lib/auth/authClient";
import type {
  ApiResult,
  ExploreProgressItem,
  MemberAccountData,
  MemberConsentUpdate,
  MemberDashboardData,
  ConnectedPartner,
  MemberProfileUpdate,
  NotificationPreferences,
  MemberInsightsData,
  MemberNotificationsData,
  MemberProgressData,
  MemberSubscriptionData,
  TrackingRange,
} from "./memberTypes";

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

export const memberClient = {
  getDashboard(): Promise<ApiResult<MemberDashboardData>> {
    return request<MemberDashboardData>("/api/member/dashboard");
  },
  getProgress(range: TrackingRange): Promise<ApiResult<MemberProgressData>> {
    return request<MemberProgressData>(`/api/member/progress?range=${range}`);
  },
  getInsights(): Promise<ApiResult<MemberInsightsData>> {
    return request<MemberInsightsData>("/api/member/insights");
  },
  getNotifications(
    options: {
      limit?: number;
      offset?: number;
      category?: string;
      unread?: boolean;
    } = {},
  ): Promise<ApiResult<MemberNotificationsData>> {
    const params = new URLSearchParams();
    if (options.limit !== undefined) params.set("limit", String(options.limit));
    if (options.offset !== undefined) params.set("offset", String(options.offset));
    if (options.category) params.set("category", options.category);
    if (options.unread) params.set("unread", "true");
    const query = params.toString();
    return request<MemberNotificationsData>(
      `/api/member/notifications${query ? `?${query}` : ""}`,
    );
  },
  markNotificationRead(
    notificationId: string,
  ): Promise<ApiResult<{ id: string; unreadCount: number }>> {
    return request<{ id: string; unreadCount: number }>(
      `/api/member/notifications/${notificationId}/read`,
      { method: "PATCH" },
    );
  },
  markAllNotificationsRead(): Promise<
    ApiResult<{ markedRead: number; unreadCount: number }>
  > {
    return request<{ markedRead: number; unreadCount: number }>(
      "/api/member/notifications/read-all",
      { method: "POST" },
    );
  },
  startTrial(): Promise<ApiResult<{ plan: string; subscriptionStatus: string; trialEndsAt: string; daysRemaining: number }>> {
    return request("/api/member/trial/start", { method: "POST" });
  },
  getTrialStatus(): Promise<ApiResult<{ plan: string; subscriptionStatus: string; isTrialActive: boolean; trialEndsAt: string | null; daysRemaining: number; eligibleForTrial: boolean }>> {
    return request("/api/member/trial/status");
  },
  getSubscription(): Promise<ApiResult<MemberSubscriptionData>> {
    return request<MemberSubscriptionData>("/api/member/subscription");
  },
  getAccount(): Promise<ApiResult<MemberAccountData>> {
    return request<MemberAccountData>("/api/member/account");
  },
  /**
   * Name only. Email changes use `authClient.requestEmailChange` + confirm link.
   */
  updateProfile(name: string): Promise<ApiResult<MemberProfileUpdate>> {
    return request<MemberProfileUpdate>("/api/member/account/profile", {
      method: "PUT",
      body: JSON.stringify({ name }),
    });
  },

  /**
   * Downloads a JSON file of this member's own account data.
   * Returns a failure message when the response is not a file.
   */
  async downloadAccountExport(): Promise<
    | { success: true; filename: string }
    | { success: false; message: string }
  > {
    try {
      const response = await authClient.authenticatedFetch(
        `${API_BASE}/api/member/account/export`,
      );
      if (!response.ok) {
        const json = (await response.json().catch(() => null)) as {
          message?: string;
        } | null;
        return {
          success: false,
          message: json?.message || "We couldn't prepare your download.",
        };
      }
      const blob = await response.blob();
      const disposition = response.headers.get("Content-Disposition") ?? "";
      const match = /filename="([^"]+)"/.exec(disposition);
      const filename =
        match?.[1] ?? `hercompass-export-${new Date().toISOString().slice(0, 10)}.json`;
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      anchor.click();
      URL.revokeObjectURL(url);
      return { success: true, filename };
    } catch {
      return {
        success: false,
        message: "We couldn't reach HerCompass just now. Your information is safe.",
      };
    }
  },
  updateAccountPreferences(dailyCheckIn: boolean): Promise<ApiResult<{ dailyCheckIn: boolean }>> {
    return request<{ dailyCheckIn: boolean }>("/api/member/account/preferences", {
      method: "PUT",
      body: JSON.stringify({ dailyCheckIn }),
    });
  },
  /**
   * Grants or withdraws permission for AI text to be personalised from the
   * member's own entries. Withdrawing does not delete anything.
   */
  updateAccountConsent(
    allowsPersonalization: boolean,
    consentVersion: string,
  ): Promise<ApiResult<MemberConsentUpdate>> {
    return request<MemberConsentUpdate>("/api/member/account/consent", {
      method: "PUT",
      body: JSON.stringify({ allowsPersonalization, consentVersion }),
    });
  },
  deleteAccount(confirmEmail: string): Promise<ApiResult<null>> {
    return request<null>("/api/member/account/delete", {
      method: "POST",
      body: JSON.stringify({ confirmEmail }),
    });
  },
  getNotificationPreferences(): Promise<ApiResult<NotificationPreferences>> {
    return request<NotificationPreferences>("/api/member/notification-preferences");
  },
  saveNotificationPreferences(
    preferences: NotificationPreferences,
  ): Promise<ApiResult<NotificationPreferences>> {
    return request<NotificationPreferences>("/api/member/notification-preferences", {
      method: "PUT",
      body: JSON.stringify(preferences),
    });
  },
  getExploreProgress(): Promise<ApiResult<{ items: ExploreProgressItem[] }>> {
    return request<{ items: ExploreProgressItem[] }>("/api/member/explore-progress");
  },
  saveExploreProgress(
    slug: string,
    progress: { saved: boolean; completed: boolean },
  ): Promise<ApiResult<ExploreProgressItem>> {
    return request<ExploreProgressItem>(`/api/member/explore-progress/${slug}`, {
      method: "PUT",
      body: JSON.stringify(progress),
    });
  },
  sendSupport(topic: string, message: string): Promise<ApiResult<{ id: string }>> {
    return request<{ id: string }>("/api/member/support", {
      method: "POST",
      body: JSON.stringify({ topic, message }),
    });
  },
  savePartnerSettings(body: {
    partnerEmail?: string;
    partnerConsent: boolean;
    scopes: string[];
  }): Promise<ApiResult<{ partnerConsent: boolean; scopes: string[]; emailOnFile: boolean; inviteSent?: boolean; inviteUrl?: string | null }>> {
    return request("/api/member/partner", {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },
  createPartnerInviteLink(): Promise<ApiResult<{ inviteUrl: string }>> {
    return request("/api/member/partner/invite-link", { method: "POST" });
  },
  getPartnerConnection(): Promise<ApiResult<{ partner: ConnectedPartner | null }>> {
    return request("/api/member/partner/connection");
  },
  revokePartnerConnection(): Promise<ApiResult<{ partner: null }>> {
    return request("/api/member/partner/revoke", { method: "POST" });
  },
};
