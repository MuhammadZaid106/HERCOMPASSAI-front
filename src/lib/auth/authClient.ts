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

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: "member" | "partner";
  plan?: "free" | "plus" | "premium";
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

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";

const STORAGE_KEYS = {
  USER: "hercompass_user",
  ACCESS_TOKEN: "hercompass_access_token",
  REFRESH_TOKEN: "hercompass_refresh_token",
};

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
    if (tokens?.refreshToken) {
      try {
        await fetch(`${API_BASE}/api/auth/logout`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: tokens.refreshToken }),
        });
      } catch {
        // Fallback silently if server unreachable during logout
      }
    }
    authClient.clearSession();
  },

  /**
   * Fetch current authenticated user from backend using Bearer token
   */
  async getMe(): Promise<ApiResponse<{ user: AuthUser }>> {
    const tokens = authClient.getStoredTokens();
    if (!tokens?.accessToken) {
      return { success: false, message: "No access token found" };
    }

    const res = await fetch(`${API_BASE}/api/auth/me`, {
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
   * Storage helpers
   */
  setSession(user: AuthUser, tokens: AuthTokens): void {
    if (typeof window === "undefined") return;
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
