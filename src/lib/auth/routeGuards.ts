/**
 * Client-side route guards.
 *
 * These decide where to *send* someone, nothing more. The real enforcement lives
 * in the backend (`requireAuth` / `requireStaff`), so a member who ignores these
 * helpers still gets a 403 on every admin endpoint. What is worth getting right
 * here is the destination, because a wrong one produces a confusing bounce:
 * someone signed in as a member who opens `/admin` used to be thrown to
 * `/login`, which looks like their session had expired and loses whatever they
 * were doing.
 */

export type StaffRole = "admin" | "developer";

/**
 * Staff roles that may open the admin area.
 *
 * Mirrors `STAFF_ROLES` in the backend `roleMiddleware`. The two lists must
 * agree: if a role is added here but not there, the UI offers an admin screen
 * the API refuses. The reverse is the worse case, so this list stays the
 * narrower one.
 */
export function isStaff(role: string | undefined | null): boolean {
  return role === "admin" || role === "developer";
}

/**
 * Where a signed-in person should land.
 *
 * A member opens the member dashboard, a partner opens Partner Support, and
 * staff open the admin panel. A missing role is treated as a member.
 */
export function homeRouteForRole(role: string | undefined | null): string {
  if (role === "partner") return "/partner";
  if (role === "admin" || role === "developer") return "/admin";
  return "/app";
}