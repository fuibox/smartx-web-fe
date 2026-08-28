import type { WaitlistStage } from "./types";

export const WAITLIST_PATH = "/waitlist/";
const SHARE_NOTICE_KEY = "smartx:waitlist:share-notice";

export type WaitlistEntryKind = "direct" | "friend";

export type WaitlistRoute = {
  stage: Exclude<WaitlistStage, "boot" | "email" | "verify">;
  entry: WaitlistEntryKind;
};

/**
 * Direct + logged in with a result → own unlock/result.
 * Friend + logged in with a result → stay on the shared result first.
 * Local quiz draft (refresh mid-test) → resume quiz.
 * Logged in without a submitted result → resume quiz.
 * Friend + logged out → referral gate.
 * Direct + logged out → start gate (invite optional).
 */
/** Telegram / X flags are API `1`/`0`. Result is only shown after both are done. */
export function areCommunityTasksDone(flags?: {
  telegramCompleted?: number;
  xCompleted?: number;
} | null) {
  return flags?.telegramCompleted === 1 && flags?.xCompleted === 1;
}

export function isCommunityChannelDone(...flags: Array<number | undefined>) {
  return flags.some((flag) => flag === 1);
}

/**
 * Direct + logged in with a result → own unlock/result.
 * Friend + logged in with a result → stay on the shared result first.
 * Local quiz draft (refresh mid-test) → resume quiz.
 * Logged in without a submitted result → resume quiz.
 * Friend + logged out → referral gate.
 * Direct + logged out → start gate (invite optional).
 */
export function decideWaitlistEntry(input: {
  hasFriendCard: boolean;
  loggedIn: boolean;
  submitted: boolean;
  unlocked: boolean;
  hasQuizProgress?: boolean;
}): WaitlistRoute {
  if (input.loggedIn && input.submitted) {
    if (input.hasFriendCard) return { stage: "gate", entry: "friend" };
    return { stage: input.unlocked ? "result" : "unlock", entry: "direct" };
  }

  if (input.hasQuizProgress || (input.loggedIn && !input.submitted)) {
    return { stage: "quiz", entry: input.hasFriendCard ? "friend" : "direct" };
  }

  if (input.hasFriendCard) {
    return { stage: "gate", entry: "friend" };
  }

  return { stage: "gate", entry: "direct" };
}

export function isOwnResultAvailable(input: { loggedIn: boolean; submitted: boolean }) {
  return input.loggedIn && input.submitted;
}

export function waitlistPathWithoutShare(href?: string) {
  const url = new URL(href ?? (typeof window !== "undefined" ? window.location.href : WAITLIST_PATH), "https://smartx.io");
  url.searchParams.delete("result");
  url.searchParams.delete("invite");
  const search = url.searchParams.toString();
  return `${url.pathname || WAITLIST_PATH}${search ? `?${search}` : ""}${url.hash}`;
}

export function rememberWaitlistNotice(message: string) {
  if (typeof window === "undefined" || !message) return;
  window.sessionStorage.setItem(SHARE_NOTICE_KEY, message);
}

export function takeWaitlistNotice() {
  if (typeof window === "undefined") return "";
  const value = window.sessionStorage.getItem(SHARE_NOTICE_KEY) ?? "";
  if (value) window.sessionStorage.removeItem(SHARE_NOTICE_KEY);
  return value;
}

export function shareQueryPresent(href?: string) {
  const url = new URL(href ?? (typeof window !== "undefined" ? window.location.href : WAITLIST_PATH), "https://smartx.io");
  return url.searchParams.has("result") || url.searchParams.has("invite");
}
