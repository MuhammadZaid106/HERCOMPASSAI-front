/**
 * Cross-component signal that the notification list has changed.
 *
 * The bell lives in the shell, while the list, the read actions and the
 * preference toggles live on separate routes. They cannot share React state
 * without a provider wrapping every member page, so whichever screen makes the
 * change announces it and the shell re-reads the badge.
 */
export const NOTIFICATIONS_CHANGED = "hercompass:notifications-changed";

export function emitNotificationsChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED));
}
