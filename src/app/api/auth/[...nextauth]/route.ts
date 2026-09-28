import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";

// Automatically guarantee the production URL on Vercel so Google OAuth callback never redirects to localhost
if (
  process.env.VERCEL &&
  (!process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL.includes("localhost"))
) {
  process.env.NEXTAUTH_URL = "https://hercompassai.vercel.app";
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        try {
          // A completed Google OAuth flow is a confirmed new session; clear the
          // post-logout marker so edge middleware can reach /app (not signed_out).
          const cookieStore = await cookies();
          cookieStore.delete("hercompass_logout");

          // The backend now verifies the Google ID token itself and trusts none
          // of the claims it used to accept from the body (email/googleId/role).
          const idToken = (account as { id_token?: string }).id_token;
          if (!idToken) {
            console.warn(
              "Google OAuth succeeded but no ID token was returned; skipping backend sync."
            );
            return true;
          }

          const apiUrl =
            process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";
          const res = await fetch(`${apiUrl}/api/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
          });
          const json = await res.json();
          if (res.ok && json.success && json.data?.user) {
            user.id = json.data.user.id;
            (user as { role?: string }).role = json.data.user.role;
            (user as { plan?: string }).plan = json.data.user.plan;
            (user as { backendAccessToken?: string }).backendAccessToken =
              json.data.accessToken;
            (user as { backendRefreshToken?: string }).backendRefreshToken =
              json.data.refreshToken;
          }
        } catch (err) {
          console.error("Failed to sync Google user with Neon PostgreSQL:", err);
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || "member";
        token.plan = (user as { plan?: string }).plan || "free";
        token.backendAccessToken = (user as { backendAccessToken?: string }).backendAccessToken;
        token.backendRefreshToken = (user as { backendRefreshToken?: string }).backendRefreshToken;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = (token.id as string) || (token.sub as string);
        (session.user as { role?: string }).role = (token.role as string) || "member";
        (session.user as { plan?: string }).plan = (token.plan as string) || "free";
        (session.user as { backendAccessToken?: string }).backendAccessToken =
          token.backendAccessToken as string | undefined;
        (session.user as { backendRefreshToken?: string }).backendRefreshToken =
          token.backendRefreshToken as string | undefined;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/welcome`;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "hercompassai_secret_super_key_production_ready_9921",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
