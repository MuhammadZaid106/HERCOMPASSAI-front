import { authClient } from "@/lib/auth/authClient";
import type {
  ApiResult,
  ExploreProgressItem,
  MemberAccountData,
  MemberConsentUpdate,
  MemberDashboardData,
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
  getSubscription(): Promise<ApiResult<MemberSubscriptionData>> {
    return request<MemberSubscriptionData>("/api/member/subscription");
  },
  getAccount(): Promise<ApiResult<MemberAccountData>> {
    return request<MemberAccountData>("/api/member/account");
  },
  /**
   * Name only. The backend does not accept an email change here — see the
   * controller for why that needs a confirmation flow first.
   */
  updateProfile(name: string): Promise<ApiResult<MemberProfileUpdate>> {
    return request<MemberProfileUpdate>("/api/member/account/profile", {
      method: "PUT",
      body: JSON.stringify({ name }),
    });
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
  }): Promise<ApiResult<{ partnerConsent: boolean; scopes: string[]; emailOnFile: boolean }>> {
    return request("/api/member/partner", {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },
};
