"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession, signOut as nextAuthSignOut } from "next-auth/react";
import {
  authClient,
  type AuthUser,
  type LoginPayload,
  type RegisterPayload,
  type ApiResponse,
  type AuthSuccessData,
} from "./authClient";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<ApiResponse<AuthSuccessData>>;
  register: (payload: RegisterPayload) => Promise<ApiResponse<AuthSuccessData>>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: nextAuthSession, status: nextAuthStatus } = useSession();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (nextAuthStatus === "loading") {
      return;
    }

    if (nextAuthStatus === "authenticated" && nextAuthSession?.user) {
      const u = nextAuthSession.user as {
        id?: string;
        name?: string | null;
        email?: string | null;
        role?: "member" | "partner" | "admin";
        plan?: "free" | "plus" | "premium";
        backendAccessToken?: string;
        backendRefreshToken?: string;
      };

      // Check if user explicitly selected a role on login/register screen
      const storedRole =
        typeof window !== "undefined"
          ? (localStorage.getItem("hercompass_selected_role") as "member" | "partner" | null)
          : null;

      const effectiveRole: "member" | "partner" | "admin" =
        (u.role as "member" | "partner" | "admin") || storedRole || "member";

      const googleUser: AuthUser = {
        id: u.id || `google-${u.email || "user"}`,
        name: u.name || (effectiveRole === "partner" ? "Partner" : "Member"),
        email: u.email || "",
        role: effectiveRole,
        plan: u.plan || "free",
        emailVerified: true,
      };

      setUser(googleUser);

      if (u.backendAccessToken && u.backendRefreshToken) {
        authClient.setSession(googleUser, {
          accessToken: u.backendAccessToken,
          refreshToken: u.backendRefreshToken,
        });
      } else {
        authClient.setStoredUser(googleUser);
      }

      setLoading(false);
      return;
    }

    // Check custom JWT stored session if not signed in through NextAuth
    const storedUser = authClient.getStoredUser();
    if (storedUser) {
      setUser(storedUser);
      // Validate session with backend
      authClient
        .getMe()
        .then((res) => {
          if (res.success && res.data?.user) {
            setUser(res.data.user);
          }
        })
        .finally(() => setLoading(false));
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [nextAuthSession, nextAuthStatus]);

  const login = async (payload: LoginPayload) => {
    const res = await authClient.login(payload);
    if (res.success && res.data) {
      setUser(res.data.user);
    }
    return res;
  };

  const register = async (payload: RegisterPayload) => {
    const res = await authClient.register(payload);
    if (res.success && res.data) {
      setUser(res.data.user);
    }
    return res;
  };

  const logout = async () => {
    // Clear local access immediately so protected UI cannot remain stuck on a loading state.
    authClient.clearSession();
    setUser(null);

    // Remote revocation is best effort and must not block navigation away from the page.
    void authClient.logout();
    if (nextAuthSession) {
      void nextAuthSignOut({ redirect: false }).catch(() => {
        // Local session cleanup above is sufficient if NextAuth is unavailable.
      });
    }
  };

  const refreshUser = async () => {
    if (nextAuthSession?.user) {
      return;
    }
    const res = await authClient.getMe();
    if (res.success && res.data?.user) {
      setUser(res.data.user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
