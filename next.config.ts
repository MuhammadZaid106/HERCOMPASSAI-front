import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/onboarding/:path*",
        destination: "http://localhost:8001/api/onboarding/:path*",
      },
      {
        source: "/api/tracking/:path*",
        destination: "http://localhost:8001/api/tracking/:path*",
      },
      {
        source: "/api/member/:path*",
        destination: "http://localhost:8001/api/member/:path*",
      },
      {
        source: "/api/ai/:path*",
        destination: "http://localhost:8001/api/ai/:path*",
      },
      {
        source: "/api/partner/:path*",
        destination: "http://localhost:8001/api/partner/:path*",
      },
      {
        source: "/api/admin/:path*",
        destination: "http://localhost:8001/api/admin/:path*",
      },
      {
        source: "/api/billing/:path*",
        destination: "http://localhost:8001/api/billing/:path*",
      },
      {
        source: "/api/public/:path*",
        destination: "http://localhost:8001/api/public/:path*",
      },
      {
        source: "/api/auth/login",
        destination: "http://localhost:8001/api/auth/login",
      },
      {
        source: "/api/auth/register",
        destination: "http://localhost:8001/api/auth/register",
      },
      {
        source: "/api/auth/google",
        destination: "http://localhost:8001/api/auth/google",
      },
      {
        source: "/api/auth/me",
        destination: "http://localhost:8001/api/auth/me",
      },
      {
        source: "/api/auth/refresh",
        destination: "http://localhost:8001/api/auth/refresh",
      },
      {
        source: "/api/auth/logout",
        destination: "http://localhost:8001/api/auth/logout",
      },
      {
        source: "/api/auth/change-password",
        destination: "http://localhost:8001/api/auth/change-password",
      },
      {
        source: "/api/auth/sessions/:path*",
        destination: "http://localhost:8001/api/auth/sessions/:path*",
      },
      {
        source: "/api/auth/verify-email",
        destination: "http://localhost:8001/api/auth/verify-email",
      },
      {
        source: "/api/auth/resend-verification",
        destination: "http://localhost:8001/api/auth/resend-verification",
      },
      {
        source: "/api/auth/forgot-password",
        destination: "http://localhost:8001/api/auth/forgot-password",
      },
      {
        source: "/api/auth/reset-password",
        destination: "http://localhost:8001/api/auth/reset-password",
      },
      {
        source: "/api/auth/request-email-change",
        destination: "http://localhost:8001/api/auth/request-email-change",
      },
      {
        source: "/api/auth/confirm-email-change",
        destination: "http://localhost:8001/api/auth/confirm-email-change",
      },
    ];
  },
};

export default nextConfig;
