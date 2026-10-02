export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: "member" | "partner" | "admin";
  plan: "free" | "plus" | "premium";
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Sign-up payload.
 *
 * Deliberately carries no `role` and no `plan`. Both are server-owned: the
 * backend sets them itself and rejects a request that tries to set them, so
 * sending them here could only ever fail. A paid plan arrives through a verified
 * billing event, never through the sign-up form.
 *
 * The persona the person picked on screen stays on the client and is used only
 * to decide where to send them next.
 */
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface AuthSuccessData {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

/**
 * What a password change returns.
 *
 * `endedSessions` is the number of logins that were signed out by the change.
 * The new pair is returned so the member is not signed out of the device they
 * changed the password on.
 */
export interface ChangePasswordData extends AuthSuccessData {
  endedSessions: number;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

const STORAGE_KEYS = {
  USER: "hercompass_user",
  ACCESS_TOKEN: "hercompass_access_token",
  REFRESH_TOKEN: "hercompass_refresh_token",
};

let refreshInFlight: Promise<boolean> | null = null;

export const authClient = {
  /**
   * Register a new member or partner
   */
  async register(payload: RegisterPayload): Promise<ApiResponse<AuthSuccessData>> {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const json: ApiResponse<AuthSuccessData> = await res.json().catch(() => ({
      success: false,
      message: `Server returned ${res.status} ${res.statusText}`,
    }));

    if (res.ok && json.success && json.data) {
      authClient.setSession(json.data.user, {
        accessToken: json.data.accessToken,
        refreshToken: json.data.refreshToken,
      });
    }

    return json;
  },

  /**
   * Log in an existing user
   */
  async login(payload: LoginPayload): Promise<ApiResponse<AuthSuccessData>> {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const json: ApiResponse<AuthSuccessData> = await res.json().catch(() => ({
      success: false,
      message: `Server returned ${res.status} ${res.statusText}`,
    }));

    if (res.ok && json.success && json.data) {
      authClient.setSession(json.data.user, {
        accessToken: json.data.accessToken,
        refreshToken: json.data.refreshToken,
      });
    }

    return json;
  },

  /**
   * Log out and revoke refresh token in database
   */
  async logout(): Promise<void> {
    const tokens = authClient.getStoredTokens();
    authClient.clearSession();

    if (tokens?.refreshToken) {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 4000);
      try {
        await fetch(`${API_BASE}/api/auth/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: tokens.refreshToken }),
          signal: controller.signal,
        });
      } catch {
        // Fallback silently if server unreachable during logout
      } finally {
        window.clearTimeout(timeoutId);
      }
    }
  },

  async refreshSession(): Promise<boolean> {
    if (refreshInFlight) return refreshInFlight;

    refreshInFlight = (async () => {
      const tokens = authClient.getStoredTokens();
      if (!tokens?.refreshToken) return false;

      let response: Response;
      try {
        response = await fetch(`${API_BASE}/api/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: tokens.refreshToken }),
        });
      } catch {
        return false;
      }

      const json: ApiResponse<{ accessToken: string; refreshToken: string }> =
        await response.json().catch(() => ({ success: false, message: "Network error" }));

      if (!response.ok || !json.success || !json.data) {
        if (response.status === 401) authClient.clearSession();
        return false;
      }

      const user = authClient.getStoredUser();
      if (user) {
        authClient.setSession(user, json.data);
      } else {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, json.data.accessToken);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, json.data.refreshToken);
        document.cookie = `hercompass_access_token=${json.data.accessToken}; path=/; max-age=604800; SameSite=Lax`;
      }
      return true;
    })().finally(() => {
      refreshInFlight = null;
    });

    return refreshInFlight;
  },

  async authenticatedFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
    const headers = new Headers(init.headers);
    const currentTokens = authClient.getStoredTokens();
    if (currentTokens?.accessToken) {
      headers.set("Authorization", `Bearer ${currentTokens.accessToken}`);
    }

    const response = await fetch(input, { ...init, headers });
    if (response.status !== 401 || !(await authClient.refreshSession())) return response;

    const refreshedTokens = authClient.getStoredTokens();
    const retryHeaders = new Headers(init.headers);
    if (refreshedTokens?.accessToken) {
      retryHeaders.set("Authorization", `Bearer ${refreshedTokens.accessToken}`);
    }
    return fetch(input, { ...init, headers: retryHeaders });
  },

  async forgotPassword(email: string): Promise<ApiResponse> {
    const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return res.json().catch(() => ({ success: false, message: "Network error" }));
  },

  async resetPassword(token: string, password: string): Promise<ApiResponse> {
    const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    return res.json().catch(() => ({ success: false, message: "Network error" }));
  },

  async getMe(): Promise<ApiResponse<{ user: AuthUser }>> {
    const tokens = authClient.getStoredTokens();
    if (!tokens?.accessToken) {
      return { success: false, message: "No access token found" };
    }

    const res = await authClient.authenticatedFetch(`${API_BASE}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    const json: ApiResponse<{ user: AuthUser }> = await res.json().catch(() => ({
      success: false,
      message: "Network error",
    }));

    if (res.ok && json.success && json.data?.user) {
      authClient.setStoredUser(json.data.user);
    }

    return json;
  },

  /**
   * Replace the password on a signed-in account.
   *
   * The server ends every existing session and hands back a fresh pair, so the
   * new tokens are stored here immediately. Without that the member would keep
   * using a refresh token the server has already revoked and the next request
   * would bounce them to the login page for no reason.
   */
  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<ApiResponse<ChangePasswordData>> {
    const json = await authClient.authenticatedFetch(
      `${API_BASE}/api/auth/change-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      },
    ).then((res) =>
      res.json().catch(() => ({ success: false, message: "Network error" })),
    ) as ApiResponse<ChangePasswordData>;

    if (json.success && json.data?.accessToken && json.data?.refreshToken) {
      authClient.setSession(json.data.user, {
        accessToken: json.data.accessToken,
        refreshToken: json.data.refreshToken,
      });
    }

    return json;
  },

  /**
   * How many logins are currently live for this account.
   *
   * A count, not a list: the backend deliberately does not return per-device
   * rows, because identifying a device would mean trusting a header a client can
   * choose. "Sign out other devices" below is the control that actually matters.
   */
  async getSessions(): Promise<ApiResponse<{ activeSessions: number }>> {
    return authClient
      .authenticatedFetch(`${API_BASE}/api/auth/sessions`)
      .then((res) =>
        res.json().catch(() => ({ success: false, message: "Network error" })),
      ) as Promise<ApiResponse<{ activeSessions: number }>>;
  },

  /**
   * End every session except this one.
   *
   * The current refresh token is sent so the server can tell which lineage this
   * browser belongs to. It is sent in the body, never the query string, so it
   * stays out of access logs.
   */
  async revokeOtherSessions(): Promise<ApiResponse<{ revokedSessions: number }>> {
    const tokens = authClient.getStoredTokens();
    if (!tokens?.refreshToken) {
      return { success: false, message: "No session found to keep" };
    }

    return authClient
      .authenticatedFetch(`${API_BASE}/api/auth/sessions/revoke-others`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: tokens.refreshToken }),
      })
      .then((res) =>
        res.json().catch(() => ({ success: false, message: "Network error" })),
      ) as Promise<ApiResponse<{ revokedSessions: number }>>;
  },

  /**
   * Storage helpers
   */
  setSession(user: AuthUser, tokens: AuthTokens): void {
    if (typeof window === "undefined") return;
    document.cookie = "hercompass_logout=; path=/; max-age=0; SameSite=Lax";
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
    // CRITICAL: Synchronously set cookies so Next.js edge middleware can authenticate the user
    document.cookie = `hercompass_access_token=${tokens.accessToken}; path=/; max-age=604800; SameSite=Lax`;
    document.cookie = `hercompass_user_role=${user.role}; path=/; max-age=604800; SameSite=Lax`;
  },

  clearSession(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    document.cookie = "hercompass_access_token=; path=/; max-age=0; SameSite=Lax";
    document.cookie = "hercompass_user_role=; path=/; max-age=0; SameSite=Lax";
  },

  clearLogoutMarker(): void {
    if (typeof window === "undefined") return;
    document.cookie = "hercompass_logout=; path=/; max-age=0; SameSite=Lax";
  },

  getStoredUser(): AuthUser | null {
    if (typeof window === "undefined") return null;
    const str = localStorage.getItem(STORAGE_KEYS.USER);
    if (!str) return null;
    try {
      return JSON.parse(str) as AuthUser;
    } catch {
      return null;
    }
  },

  setStoredUser(user: AuthUser): void {
    if (typeof window === "undefined") return;
    document.cookie = "hercompass_logout=; path=/; max-age=0; SameSite=Lax";
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    document.cookie = `hercompass_user_role=${user.role}; path=/; max-age=604800; SameSite=Lax`;
  },

  getStoredTokens(): AuthTokens | null {
    if (typeof window === "undefined") return null;
    const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!accessToken || !refreshToken) return null;
    return { accessToken, refreshToken };
  },

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return Boolean(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN));
  },
};
