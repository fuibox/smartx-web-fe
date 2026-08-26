const USER_TOKEN_KEY = "smartx:waitlist:user-token";
const QUIZ_SESSION_KEY = "smartx:waitlist:quiz-session";
const QUIZ_DRAFT_KEY = "smartx:waitlist:quiz-draft";
const LEGACY_SESSION_TOKEN_KEY = "smartx:waitlist:session-token";
const LEGACY_RESULT_KEY = "smartx:waitlist-last-result";
const LEGACY_EMAIL_KEY = "smartx:waitlist-session-email";

export type WaitlistQuizSession = {
  sessionToken: string;
  inviteCode: string;
};

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

export function getUserToken() {
  return read(USER_TOKEN_KEY);
}

export function setUserToken(token: string) {
  write(USER_TOKEN_KEY, token);
  if (token) clearQuizSession();
}

export function clearUserToken() {
  write(USER_TOKEN_KEY, "");
}

export function getQuizSession(): WaitlistQuizSession | null {
  const stored = readJson<WaitlistQuizSession>(QUIZ_SESSION_KEY);
  if (!stored?.sessionToken) {
    if (stored) write(QUIZ_SESSION_KEY, "");
    return null;
  }
  return {
    sessionToken: stored.sessionToken,
    inviteCode: stored.inviteCode || "",
  };
}

export function setQuizSession(session: WaitlistQuizSession) {
  if (!session.sessionToken) return;
  write(
    QUIZ_SESSION_KEY,
    JSON.stringify({
      sessionToken: session.sessionToken,
      inviteCode: session.inviteCode || "",
    }),
  );
  write(LEGACY_SESSION_TOKEN_KEY, "");
}

export function clearQuizSession() {
  write(QUIZ_SESSION_KEY, "");
  write(LEGACY_SESSION_TOKEN_KEY, "");
}

export function getSessionTokenForInvite(inviteCode: string) {
  const stored = getQuizSession();
  const code = inviteCode.trim().toLowerCase();
  if (!stored) return "";
  if (stored.inviteCode && stored.inviteCode !== code) {
    clearQuizSession();
    return "";
  }
  if (!stored.inviteCode && code) {
    setQuizSession({ sessionToken: stored.sessionToken, inviteCode: code });
  }
  return stored.sessionToken;
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
  clearQuizSession();
  clearQuizDraft();
  write(LEGACY_RESULT_KEY, "");
  write(LEGACY_EMAIL_KEY, "");
}
