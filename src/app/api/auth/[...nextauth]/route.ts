import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";

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
          let selectedRole = "member";
          try {
            const cookieStore = await cookies();
            const cookieRole = cookieStore.get("hercompass_selected_role")?.value;
            if (cookieRole === "partner" || cookieRole === "member") {
              selectedRole = cookieRole;
            }
          } catch {
            // fallback if cookies() not available in context
          }

          const apiUrl =
            process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5000";
          const res = await fetch(`${apiUrl}/api/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: user.name || (selectedRole === "partner" ? "Partner" : "Member"),
              email: user.email,
              googleId: account.providerAccountId || user.id,
              role: selectedRole,
              plan: "free",
            }),
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
