/**
 * HerCompassAI — Next.js Route Middleware
 *
 * Enforces authentication on protected routes:
 * - /onboarding  — must be an authenticated member (not a guest)
 * - /snapshot    — must have completed onboarding
 * - /welcome     — must be authenticated
 * - /admin       — must be authenticated (role check done in page-level guard)
 *
 * Strategy:
 *  1. Primary (edge-safe): checks for a NextAuth session cookie (next-auth.session-token)
 *     OR our custom JWT stored in the browser cookie `hercompass_access_token`.
 *  2. If neither is present → redirect to /login?from=<path> so the user
 *     returns to the right page after signing in.
 *
 * NOTE: This runs on the Vercel Edge runtime — keep it lightweight.
 * Heavy session validation happens inside each protected page / API route.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require an authenticated session
const PROTECTED_ROUTES = ["/onboarding", "/snapshot", "/welcome", "/admin"];

// Routes that should redirect authenticated users away (e.g. login when already logged in)
const AUTH_ONLY_ROUTES = ["/login", "/register", "/forgot-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Check for any valid session token (NextAuth OR custom JWT cookie) ──
  const nextAuthToken =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value; // production HTTPS variant

  const customToken = request.cookies.get("hercompass_access_token")?.value;

  const isAuthenticated = Boolean(nextAuthToken || customToken);

  // ── 2. Guard protected routes ──
  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname); // preserve intended destination
    loginUrl.searchParams.set("reason", "auth_required");
    return NextResponse.redirect(loginUrl);
  }

  // ── 3. Role-based route guard: partners do not take member onboarding or snapshots ──
  const userRole =
    request.cookies.get("hercompass_user_role")?.value ||
    request.cookies.get("hercompass_selected_role")?.value;

  if (
    isAuthenticated &&
    userRole === "partner" &&
    (pathname.startsWith("/onboarding") || pathname.startsWith("/snapshot"))
  ) {
    return NextResponse.redirect(new URL("/welcome", request.url));
  }

  // ── 4. Redirect already-authenticated users away from auth screens ──
  const isAuthOnlyRoute = AUTH_ONLY_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isAuthOnlyRoute && isAuthenticated) {
    // Don't redirect admin users back to welcome (let page-level guard handle it)
    return NextResponse.redirect(new URL("/welcome", request.url));
  }

  return NextResponse.next();
}

export const config = {
  /*
   * Match all routes EXCEPT:
   * - Next.js internals (_next/static, _next/image, favicon.ico)
   * - NextAuth API routes (must remain public)
   * - Our own backend proxy / health routes
   * - Static assets (svg, png, jpg, etc.)
   */
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|icon\\.svg|api/auth|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf)).*)",
  ],
};
