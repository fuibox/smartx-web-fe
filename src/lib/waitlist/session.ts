const USER_TOKEN_KEY = "smartx:waitlist:user-token";
const LANDING_INVITE_KEY = "smartx:waitlist:landing-invite";
const QUIZ_DRAFT_KEY = "smartx:waitlist:quiz-draft";
const LEGACY_QUIZ_SESSION_KEY = "smartx:waitlist:quiz-session";
const LEGACY_SESSION_TOKEN_KEY = "smartx:waitlist:session-token";
const LEGACY_RESULT_KEY = "smartx:waitlist-last-result";
const LEGACY_EMAIL_KEY = "smartx:waitlist-session-email";

export type WaitlistQuizDraft = {
  answers: Record<string, string>;
  questionIndex: number;
};

function read(key: string) {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(key) ?? "";
}

function write(key: string, value: string) {
  if (typeof window === "undefined") return;
  if (value) window.localStorage.setItem(key, value);
  else window.localStorage.removeItem(key);
}

function readJson<T>(key: string): T | null {
  const raw = read(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    write(key, "");
    return null;
  }
}

function isStoredInviteCode(value: string) {
  return /^[a-z0-9]{8}$/.test(value.trim().toLowerCase());
}

function dropLegacySession() {
  write(LEGACY_QUIZ_SESSION_KEY, "");
  write(LEGACY_SESSION_TOKEN_KEY, "");
}

export function getUserToken() {
  return read(USER_TOKEN_KEY);
}

export function setUserToken(token: string) {
  write(USER_TOKEN_KEY, token);
  if (token) {
    dropLegacySession();
    clearLandingInvite();
  }
}

export function clearUserToken() {
  write(USER_TOKEN_KEY, "");
}

export function getLandingInvite() {
  const stored = read(LANDING_INVITE_KEY).trim().toLowerCase();
  if (isStoredInviteCode(stored)) {
    dropLegacySession();
    return stored;
  }

  const legacy = readJson<{ inviteCode?: string }>(LEGACY_QUIZ_SESSION_KEY);
  const migrated = (legacy?.inviteCode ?? "").trim().toLowerCase();
  dropLegacySession();
  if (isStoredInviteCode(migrated)) {
    write(LANDING_INVITE_KEY, migrated);
    return migrated;
  }
  return "";
}

export function setLandingInvite(inviteCode: string) {
  const code = inviteCode.trim().toLowerCase();
  if (!isStoredInviteCode(code)) return;
  write(LANDING_INVITE_KEY, code);
  dropLegacySession();
}

export function clearLandingInvite() {
  write(LANDING_INVITE_KEY, "");
  dropLegacySession();
}

export function getQuizDraft(): WaitlistQuizDraft | null {
  const stored = readJson<WaitlistQuizDraft>(QUIZ_DRAFT_KEY);
  if (!stored || typeof stored.answers !== "object" || stored.answers == null) return null;
  return {
    answers: stored.answers,
    questionIndex: Number.isInteger(stored.questionIndex) ? stored.questionIndex : 0,
  };
}

export function setQuizDraft(draft: WaitlistQuizDraft) {
  write(QUIZ_DRAFT_KEY, JSON.stringify(draft));
}

export function clearQuizDraft() {
  write(QUIZ_DRAFT_KEY, "");
}

export function clearWaitlistSession() {
  write(USER_TOKEN_KEY, "");
  clearLandingInvite();
  clearQuizDraft();
  write(LEGACY_RESULT_KEY, "");
  write(LEGACY_EMAIL_KEY, "");
}
