import { authClient } from "@/lib/auth/authClient";
import type {
  ApiResult,
  ExploreProgressItem,
  MemberAccountData,
  MemberDashboardData,
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
  getNotifications(): Promise<ApiResult<MemberNotificationsData>> {
    return request<MemberNotificationsData>("/api/member/notifications");
  },
  getSubscription(): Promise<ApiResult<MemberSubscriptionData>> {
    return request<MemberSubscriptionData>("/api/member/subscription");
  },
  getAccount(): Promise<ApiResult<MemberAccountData>> {
    return request<MemberAccountData>("/api/member/account");
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
