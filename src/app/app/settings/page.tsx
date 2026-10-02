"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { authClient } from "@/lib/auth/authClient";
import { memberClient } from "@/lib/member/memberClient";
import type { MemberAccountData, NotificationPreferences } from "@/lib/member/memberTypes";
import { emitNotificationsChanged } from "@/lib/member/notificationEvents";
import { ONBOARDING_CONSENT_VERSION } from "@/lib/onboarding/onboardingTypes";
import {
  ErrorNotice,
  Field,
  Panel,
  PanelSkeleton,
  PageHeading,
  SaveNote,
  SettingRow,
  SettingsSection,
  Switch,
  dangerButton,
  inputClass,
  linkClass,
  primaryButton,
  secondaryButton,
  type SaveState,
} from "@/components/member/accountUi";

/**
 * The document version a member accepts when allowing personalization here.
 *
 * Read from the onboarding module rather than hard-coded, so this page cannot
 * record agreement to a different version than the questionnaire does. The
 * stored copy travels to the backend, which records what was agreed to instead
 * of assuming the current version.
 */
const CONSENT_VERSION = ONBOARDING_CONSENT_VERSION;

const SECTIONS = [
  { id: "security", label: "Security" },
  { id: "privacy", label: "Privacy" },
  { id: "notifications", label: "Notifications" },
  { id: "plan", label: "Plan" },
  { id: "data", label: "Delete account" },
] as const;

const NOTIFICATION_CHOICES = [
  ["snapshot", "Snapshot updates"],
  ["trackingReminders", "Tracking reminders"],
  ["recommendations", "Recommendations"],
  ["partner", "Partner"],
  ["plans", "Plans"],
  ["account", "Account notices"],
  ["privacySecurity", "Important privacy and security notices"],
] as const;

const DATA_HANDLING = [
  {
    title: "What we collect",
    body: "Your account, your Snapshot answers, and the check-ins you choose to log.",
  },
  {
    title: "Why we collect it",
    body: "So the app can show patterns, a baseline, and a next step.",
  },
  {
    title: "How it is used",
    body: "Software calculates scores and trends. AI wording is used only when your consent allows it.",
  },
  {
    title: "Who can access it",
    body: "You can. A partner cannot, unless you turn sharing on.",
  },
  {
    title: "Partner sharing",
    body: "Sharing is a summary you allow. Raw logs stay private, and you can turn sharing off.",
  },
  {
    title: "Your controls",
    body: "Change consent here, or delete the account at the end of this page. A download of your logs is not available yet.",
  },
];

function formatWhen(value: string | null): string {
  if (!value) return "Not recorded";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not recorded";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function SettingsPage() {
  const { logout } = useAuth();

  const [data, setData] = useState<MemberAccountData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSave, setPasswordSave] = useState<SaveState>(null);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const [activeSessions, setActiveSessions] = useState<number | null>(null);
  const [sessionsSave, setSessionsSave] = useState<SaveState>(null);
  const [isRevokingSessions, setIsRevokingSessions] = useState(false);

  const [consentChoice, setConsentChoice] = useState(false);
  const [consentSave, setConsentSave] = useState<SaveState>(null);
  const [isSavingConsent, setIsSavingConsent] = useState(false);

  const [dailyCheckIn, setDailyCheckIn] = useState(false);
  const [preferencesSave, setPreferencesSave] = useState<SaveState>(null);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);

  const [prefs, setPrefs] = useState<NotificationPreferences | null>(null);
  const [savedPrefs, setSavedPrefs] = useState<NotificationPreferences | null>(null);
  const [prefSave, setPrefSave] = useState<SaveState>(null);
  const [isSavingPrefs, setIsSavingPrefs] = useState(false);

  const [deleteEmail, setDeleteEmail] = useState("");
  const [deleteSave, setDeleteSave] = useState<SaveState>(null);

  useEffect(() => {
    let active = true;
    void memberClient.getAccount().then((result) => {
      if (!active) return;
      if (!result.success || !result.data) {
        setError(result.message || "We couldn't load your settings. Please try again.");
        return;
      }
      setData(result.data);
      setConsentChoice(result.data.consent?.allowsPersonalization ?? false);
      setDailyCheckIn(result.data.preferences.dailyCheckIn);
    });
    void memberClient.getNotificationPreferences().then((result) => {
      if (!active || !result.success || !result.data) return;
      setPrefs(result.data);
      setSavedPrefs(result.data);
    });
    void authClient.getSessions().then((result) => {
      if (!active || !result.success || !result.data) return;
      setActiveSessions(result.data.activeSessions);
    });
    return () => {
      active = false;
    };
  }, []);

  /**
   * Re-reads the account after a change to what the server stores.
   *
   * Consent needs this: the stored record carries a label, a version, and the
   * date it was agreed to, so editing the local copy risks showing a version or
   * date the database does not hold.
   */
  const reloadAccount = (): void => {
    void memberClient.getAccount().then((result) => {
      if (!result.success || !result.data) return;
      setData(result.data);
      setConsentChoice(result.data.consent?.allowsPersonalization ?? false);
      setDailyCheckIn(result.data.preferences.dailyCheckIn);
    });
  };

  const savePassword = (): void => {
    if (newPassword !== confirmPassword) {
      setPasswordSave({ ok: false, note: "The two new passwords do not match." });
      return;
    }
    setIsSavingPassword(true);
    setPasswordSave(null);
    void authClient.changePassword(currentPassword, newPassword).then((result) => {
      setIsSavingPassword(false);
      if (!result.success) {
        setPasswordSave({ ok: false, note: result.message || "We couldn't change your password." });
        return;
      }
      // Cleared on success only, so a failure does not cost a retyped password.
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      const ended = result.data?.endedSessions ?? 0;
      setPasswordSave({
        ok: true,
        note:
          ended > 0
            ? `Password changed. ${ended === 1 ? "1 other session was" : `${ended} other sessions were`} signed out.`
            : "Password changed.",
      });
    });
  };

  const revokeOtherSessions = (): void => {
    setIsRevokingSessions(true);
    setSessionsSave(null);
    void authClient.revokeOtherSessions().then((result) => {
      setIsRevokingSessions(false);
      if (!result.success || !result.data) {
        setSessionsSave({ ok: false, note: result.message || "We couldn't sign those out." });
        return;
      }
      // This session survives by design, so the count lands on 1 rather than 0.
      setActiveSessions(1);
      setSessionsSave({
        ok: true,
        note:
          result.data.revokedSessions === 1
            ? "1 other session signed out."
            : `${result.data.revokedSessions} other sessions signed out.`,
      });
    });
  };

  const saveConsent = (): void => {
    setIsSavingConsent(true);
    setConsentSave(null);
    void memberClient.updateAccountConsent(consentChoice, CONSENT_VERSION).then((result) => {
      setIsSavingConsent(false);
      if (!result.success) {
        setConsentSave({ ok: false, note: result.message || "We couldn't save that choice." });
        return;
      }
      reloadAccount();
      setConsentSave({
        ok: true,
        note: result.data?.allowsPersonalization
          ? "Personalization is on. New Snapshots will use your own entries."
          : "Personalization is off. Your scores and trends are unaffected.",
      });
    });
  };

  const savePreferences = (): void => {
    setIsSavingPreferences(true);
    setPreferencesSave(null);
    void memberClient.updateAccountPreferences(dailyCheckIn).then((result) => {
      setIsSavingPreferences(false);
      if (!result.success) {
        setPreferencesSave({ ok: false, note: result.message || "We couldn't save that." });
        return;
      }
      reloadAccount();
      setPreferencesSave({ ok: true, note: "Saved." });
    });
  };

  const saveNotificationPrefs = (): void => {
    if (!prefs) return;
    setIsSavingPrefs(true);
    setPrefSave(null);
    void memberClient.saveNotificationPreferences(prefs).then((result) => {
      setIsSavingPrefs(false);
      if (!result.success || !result.data) {
        setPrefSave({ ok: false, note: result.message || "We couldn't save those choices." });
        return;
      }
      // The server normalises the row, so the saved copy becomes the new baseline
      // for the unsaved-changes check below.
      setPrefs(result.data);
      setSavedPrefs(result.data);
      setPrefSave({ ok: true, note: "Saved." });
      // Turning a category off hides its history, which changes the bell badge.
      emitNotificationsChanged();
    });
  };

  const deleteAccount = (): void => {
    void memberClient.deleteAccount(deleteEmail).then((result) => {
      if (!result.success) {
        setDeleteSave({ ok: false, note: result.message || "We couldn't delete this account." });
        return;
      }
      void logout();
    });
  };

  if (error) {
    return <ErrorNotice title="We couldn't load your settings." message={error} />;
  }

  if (!data) {
    return <PanelSkeleton lines={5} />;
  }

  const consentChanged = consentChoice !== (data.consent?.allowsPersonalization ?? false);
  const prefsChanged =
    prefs !== null && savedPrefs !== null && JSON.stringify(prefs) !== JSON.stringify(savedPrefs);

  return (
    <div className="space-y-8 animate-fadeIn">
      <PageHeading
        eyebrow="Account"
        title="Settings"
        description="Change how this account behaves. Everything here can be changed again later."
      />

      <div className="grid gap-8 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-12">
        <nav aria-label="Settings sections" className="lg:sticky lg:top-24 lg:self-start">
          <ul className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
            {SECTIONS.map((section) => (
              <li key={section.id} className="shrink-0">
                <a
                  href={`#${section.id}`}
                  className="inline-flex min-h-9 items-center rounded-lg px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <Panel>
          <SettingsSection
            id="security"
            title="Security"
            description="Your password and the devices signed in to this account."
          >
            <div className="grid gap-4 border-b border-slate-200 pb-5 sm:max-w-xl">
              <Field label="Current password">
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  autoComplete="current-password"
                  className={inputClass}
                />
              </Field>
              <Field
                label="New password"
                hint="At least 8 characters, including one uppercase letter and one number."
              >
                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  autoComplete="new-password"
                  className={inputClass}
                />
              </Field>
              <Field label="Confirm new password">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  className={inputClass}
                />
              </Field>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={savePassword}
                  disabled={
                    isSavingPassword || !currentPassword || !newPassword || !confirmPassword
                  }
                  className={primaryButton}
                >
                  {isSavingPassword ? "Saving..." : "Change password"}
                </button>
                <SaveNote state={passwordSave} />
              </div>
              <p className="text-xs leading-relaxed text-slate-500">
                Changing your password signs out every other device. Forgot the current
                one? Recovery is not connected on this server yet, so ask support to help
                you back in.
              </p>
            </div>

            <SettingRow
              label="Signed-in devices"
              description="Each device holds its own session. Signing others out keeps this one."
            >
              <div className="flex flex-col items-end gap-2">
                <p className="text-sm text-slate-700">
                  {activeSessions === null
                    ? "Checking..."
                    : activeSessions === 1
                      ? "1 device"
                      : `${activeSessions} devices`}
                </p>
                <button
                  type="button"
                  onClick={revokeOtherSessions}
                  disabled={isRevokingSessions || activeSessions === null || activeSessions <= 1}
                  className={secondaryButton}
                >
                  {isRevokingSessions ? "Signing out..." : "Sign out other devices"}
                </button>
                <SaveNote state={sessionsSave} />
              </div>
            </SettingRow>
          </SettingsSection>

          <SettingsSection
            id="privacy"
            title="Privacy and consent"
            description="Whether AI wording may be personalised from your own entries."
          >
            <SettingRow
              label="Personalize Snapshot wording"
              description={
                data.consent
                  ? `Currently ${data.consent.typeLabel.toLowerCase()}, agreed ${formatWhen(data.consent.recordedAt)} (version ${data.consent.version}).`
                  : "No consent record yet. The Snapshot is where that choice is first stored."
              }
            >
              <div className="flex flex-col items-end gap-2">
                <Switch
                  checked={consentChoice}
                  onChange={setConsentChoice}
                  disabled={!data.preferences.snapshotComplete}
                  label="Personalize Snapshot wording from my own entries"
                />
                <button
                  type="button"
                  onClick={saveConsent}
                  disabled={isSavingConsent || !consentChanged || !data.preferences.snapshotComplete}
                  className={primaryButton}
                >
                  {isSavingConsent ? "Saving..." : "Save choice"}
                </button>
                <SaveNote state={consentSave} />
              </div>
            </SettingRow>

            <p className="text-xs leading-relaxed text-slate-500">
              Turning this off stops new Snapshots from being written from your data. Your
              scores, trends, and history are calculated by software and stay exactly as
              they are.
              {!data.preferences.snapshotComplete && (
                <>
                  {" "}
                  Complete your{" "}
                  <Link href="/onboarding" className={linkClass}>
                    Snapshot
                  </Link>{" "}
                  first, because consent is recorded against that assessment.
                </>
              )}
            </p>

            <div className="border-t border-slate-200 pt-5">
              <h3 className="text-sm font-semibold text-slate-900">Partner permissions</h3>
              {data.partner ? (
                <p className="mt-1 text-sm text-slate-600">
                  {data.partner.interestLabel}. Sharing is{" "}
                  {data.partner.sharingOn ? "on" : "off"}
                  {data.partner.emailOnFile ? ", with a partner email saved." : "."} A partner
                  never receives your raw logs.
                </p>
              ) : (
                <p className="mt-1 text-sm text-slate-600">
                  Partner choices appear after the{" "}
                  <Link href="/onboarding" className={linkClass}>
                    Snapshot
                  </Link>
                  .
                </p>
              )}
              <Link
                href={data.partner ? "/app/partner" : "/onboarding"}
                className={`mt-2 inline-flex ${linkClass}`}
              >
                {data.partner ? "Review partner support" : "Open the Snapshot"}
              </Link>
            </div>

            <div className="border-t border-slate-200 pt-5">
              <h3 className="text-sm font-semibold text-slate-900">How your data is handled</h3>
              <dl className="mt-3 grid gap-4 sm:grid-cols-2">
                {DATA_HANDLING.map((topic) => (
                  <div key={topic.title}>
                    <dt className="text-sm font-medium text-slate-900">{topic.title}</dt>
                    <dd className="mt-0.5 text-xs leading-relaxed text-slate-500">{topic.body}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </SettingsSection>

          <SettingsSection
            id="notifications"
            title="Notifications"
            description="Which notices reach you, and how often."
          >
            {data.preferences.snapshotComplete && (
              <SettingRow
                label="Daily check-in reminder"
                description="A nudge to log your morning check-in."
              >
                <Switch
                  checked={dailyCheckIn}
                  onChange={setDailyCheckIn}
                  label="Daily check-in reminder"
                />
              </SettingRow>
            )}

            {prefs && (
              <fieldset className="border-t border-slate-200 pt-5">
                <legend className="text-sm font-semibold text-slate-900">Notice types</legend>
                <p className="mt-1 text-xs text-slate-500">
                  {data.notifications.unreadCount === 0
                    ? "You have no unread notices."
                    : `You have ${data.notifications.unreadCount} unread.`}
                </p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {NOTIFICATION_CHOICES.map(([key, label]) => (
                    <li key={key}>
                      <label className="flex min-h-9 items-center gap-3 rounded-lg px-2 text-sm text-slate-700 hover:bg-slate-50">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-slate-300"
                          checked={prefs[key]}
                          onChange={(event) =>
                            setPrefs({ ...prefs, [key]: event.target.checked })
                          }
                        />
                        {label}
                      </label>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={saveNotificationPrefs}
                    disabled={isSavingPrefs || !prefsChanged}
                    className={primaryButton}
                  >
                    {isSavingPrefs ? "Saving..." : "Save notice types"}
                  </button>
                  <SaveNote state={prefSave} />
                  <Link href="/app/notifications" className={linkClass}>
                    Open notifications
                  </Link>
                </div>
              </fieldset>
            )}

            {data.preferences.snapshotComplete && (
              <div className="flex flex-wrap items-center gap-3 border-t border-slate-200 pt-5">
                <button
                  type="button"
                  onClick={savePreferences}
                  disabled={isSavingPreferences || dailyCheckIn === data.preferences.dailyCheckIn}
                  className={secondaryButton}
                >
                  {isSavingPreferences ? "Saving..." : "Save reminder"}
                </button>
                <SaveNote state={preferencesSave} />
                <Link href="/app/snapshot" className={linkClass}>
                  View Snapshot
                </Link>
              </div>
            )}
          </SettingsSection>

          <SettingsSection
            id="plan"
            title="Plan"
            description="What you are signed up for on this account."
          >
            <SettingRow
              label={data.profile.planLabel}
              description="Renewal dates appear when billing is connected. This page does not change your plan."
            >
              <Link
                href="/app/plans"
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Compare plans
              </Link>
            </SettingRow>
          </SettingsSection>

          <SettingsSection
            id="data"
            title="Delete account"
            description="Permanent, and it cannot be undone."
          >
            <div className="grid gap-4 sm:max-w-xl">
              <p className="text-sm text-slate-600">
                This removes the account and the logs stored with it. Type the email on this
                account to confirm.
              </p>
              <Field label={`Confirm with ${data.profile.email}`}>
                <input
                  type="email"
                  value={deleteEmail}
                  onChange={(event) => setDeleteEmail(event.target.value)}
                  placeholder={data.profile.email}
                  autoComplete="off"
                  className={inputClass}
                />
              </Field>
              <div className="flex flex-wrap items-center gap-3">
                <button type="button" onClick={deleteAccount} className={dangerButton}>
                  Delete my account
                </button>
                <SaveNote state={deleteSave} />
              </div>
            </div>
          </SettingsSection>
        </Panel>
      </div>
    </div>
  );
}