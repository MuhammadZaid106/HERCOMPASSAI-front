/**
 * HerCompassAI — Next.js Route Middleware
 *
 * Enforces authentication on protected routes:
 * - /onboarding  — must be an authenticated member (not a guest)
 * - /snapshot    — must have completed onboarding
 * - /app         — must be an authenticated member
 * - /admin       — must be authenticated (role check done in page-level guard)
 * - /partner/consent, /partner/permissions, /partner/settings, /partner/account — signed-in partner pages. The public /partner page and /partner/invite stay open.
 *
 * Strategy:
 *  1. Primary (edge-safe): checks for a NextAuth session cookie (next-auth.session-token)
 *     OR our custom JWT stored in the browser cookie `hercompass_access_token`.
 *  2. A persistent signed-out marker overrides stale NextAuth cookies until a
 *     fresh login clears it.
 *  3. If neither is present → redirect to /login?from=<path> so the user
 *     returns to the right page after signing in.
 *
 * NOTE: This file was `middleware.ts` until Next.js 16 deprecated that name in favour of `proxy.ts`. Renamed to clear the build warning; behaviour is unchanged.\n *\n * NOTE: This runs on the Vercel Edge runtime — keep it lightweight.
 * Heavy session validation happens inside each protected page / API route.
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { homeRouteForRole } from "./lib/auth/routeGuards";

// Routes that require an authenticated session
const PROTECTED_ROUTES = [
  "/onboarding",
  "/snapshot",
  "/app",
  "/admin",
  "/partner/consent",
  "/partner/permissions",
  "/partner/settings",
  "/partner/account",
];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Check for any valid session token (NextAuth OR custom JWT cookie) ──
  const nextAuthToken =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value; // production HTTPS variant

  const customToken = request.cookies.get("hercompass_access_token")?.value;
  const logoutRequested = request.cookies.get("hercompass_logout")?.value === "1";

  const isAuthenticated = Boolean(nextAuthToken || customToken);
  const userRole =
    request.cookies.get("hercompass_user_role")?.value ||
    request.cookies.get("hercompass_selected_role")?.value;

  // ── 2. Guard protected routes ──
  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // A logout marker takes precedence over stale NextAuth cookies. Keep the
  // marker while the user is on login; a successful new session removes it.
  if (logoutRequested && isProtected) {
    return NextResponse.redirect(new URL("/login?reason=signed_out", request.url));
  }

  if (pathname === "/welcome" || pathname.startsWith("/welcome/")) {
    if (!isAuthenticated || logoutRequested) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.redirect(new URL(homeRouteForRole(userRole), request.url));
  }

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname); // preserve intended destination
    loginUrl.searchParams.set("reason", "auth_required");
    return NextResponse.redirect(loginUrl);
  }

  // ── 3. Role-based route guards ──
  // Partners do not take member onboarding or snapshots; staff belong in /admin.
  if (isAuthenticated && (pathname.startsWith("/onboarding") || pathname.startsWith("/snapshot"))) {
    if (userRole === "partner") {
      return NextResponse.redirect(new URL("/partner", request.url));
    }
    if (userRole === "admin" || userRole === "developer") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  /*
   * A signed-in non-staff member opening /admin goes to their own dashboard,
   * not to /login. Sending them to /login looked like their session had expired
   * and discarded whatever they were doing.
   *
   * This is UX only. `hercompass_user_role` is a client-writable cookie, so a
   * member could forge "admin" here and see nothing but their own render error —
   * the actual protection is `requireStaff` on every /api/admin route, which
   * verifies the role from the signed JWT rather than from anything in the
   * browser. The page-level guard in /app/admin repeats the check against the
   * real user object for the same reason.
   */
  if (isAuthenticated && pathname.startsWith("/admin")) {
    if (userRole !== "admin" && userRole !== "developer") {
      return NextResponse.redirect(new URL(homeRouteForRole(userRole), request.url));
    }
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
