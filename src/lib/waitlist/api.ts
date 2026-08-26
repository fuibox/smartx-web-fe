import { getQuizSession, getSessionTokenForInvite, getUserToken } from "./session";
import {
  type CommunityChannel,
  type CommunityCompleteResult,
  type CommunityInfo,
  type InviteItem,
  type InviteView,
  type LoginResult,
  type MyResult,
  type PublicResult,
  type ApiQuizQuestion,
  type RankView,
  type ResultCard,
  type UserInfo,
  type WaitlistEnvelope,
  WaitlistApiError,
} from "./types";

const DEFAULT_API_BASE = "https://waitlist-test-api.smartx.io";
const GENERIC_ERROR = "Something went wrong. Please try again.";

function apiBase() {
  return (process.env.NEXT_PUBLIC_WAITLIST_API_BASE ?? DEFAULT_API_BASE).replace(/\/$/, "");
}

function authValue(token: string) {
  return `jwt ${token}`;
}

export function resolveWaitlistAssetUrl(url: string) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url) || url.startsWith("data:") || url.startsWith("/assets/")) return url;
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("/")) return `${apiBase()}${url}`;
  return url;
}

async function waitlistRequest<T>(
  path: string,
  options: {
    method?: "GET" | "POST";
    query?: Record<string, string | number | undefined>;
    body?: unknown;
    userToken?: string;
    sessionToken?: string;
  } = {},
) {
  const url = new URL(path, `${apiBase()}/`);
  Object.entries(options.query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  });

  const headers: Record<string, string> = { Accept: "application/json" };
  if (options.body !== undefined) headers["Content-Type"] = "application/json";

  const userToken = options.userToken || getUserToken();
  const sessionToken = options.sessionToken || getQuizSession()?.sessionToken || "";
  if (userToken) headers.Authorization = authValue(userToken);
  if (sessionToken) headers["x-session-token"] = authValue(sessionToken);
  const scope = path.startsWith("/user/") ? "user" : "public";

  let payload: WaitlistEnvelope<T>;
  try {
    const response = await fetch(url, {
      method: options.method ?? "GET",
      headers,
      cache: "no-store",
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
    payload = (await response.json()) as WaitlistEnvelope<T>;
  } catch {
    throw new WaitlistApiError(500, GENERIC_ERROR, scope, path);
  }

  const code = Number(payload?.code);
  if (code !== 200) {
    throw new WaitlistApiError(
      Number.isFinite(code) ? code : 500,
      code === 500 ? GENERIC_ERROR : payload?.message || GENERIC_ERROR,
      scope,
      path,
    );
  }

  return payload.data;
}

function isResultCard(value: unknown): value is ResultCard {
  if (!value || typeof value !== "object") return false;
  const card = value as Partial<ResultCard>;
  return Boolean(card.resultId && card.personaId);
}

export function normalizeInviteCode(value: string) {
  return value.trim().toLowerCase();
}

export function sanitizeInviteCodeInput(value: string) {
  return normalizeInviteCode(value).replace(/[^a-z0-9]/g, "").slice(0, 8);
}

export function isValidInviteCode(value: string) {
  return /^[a-z0-9]{8}$/.test(normalizeInviteCode(value));
}

export const waitlistApi = {
  getQuestions() {
    return waitlistRequest<{ questions: ApiQuizQuestion[] }>("/quiz/questions");
  },

  checkInvite(inviteCode: string) {
    return waitlistRequest<InviteView>("/waitlist_public/check_invite", {
      query: { inviteCode: normalizeInviteCode(inviteCode) },
    });
  },

  reserveInvite(inviteCode: string) {
    const code = normalizeInviteCode(inviteCode);
    getSessionTokenForInvite(code);
    return waitlistRequest<{ sessionToken: string; inviteCode: string; reservedSeconds: number }>(
      "/waitlist_public/reserve_invite",
      {
        method: "POST",
        body: { inviteCode: code },
      },
    );
  },

  renewReserve(inviteCode: string) {
    const code = normalizeInviteCode(inviteCode);
    getSessionTokenForInvite(code);
    return waitlistRequest<{
      expireSeconds: number;
      sessionToken?: string;
      token?: string;
      inviteCode?: string;
    }>("/waitlist_public/renew_reserve", {
      method: "POST",
      body: { inviteCode: code },
    });
  },

  async getInviterCard(inviteCode: string) {
    const data = await waitlistRequest<ResultCard | Record<string, never>>("/waitlist_public/inviter_card", {
      query: { inviteCode: normalizeInviteCode(inviteCode) },
    });
    return isResultCard(data) ? data : null;
  },

  getPublicResult(resultId: string) {
    return waitlistRequest<PublicResult>("/waitlist_public/result", {
      query: { resultId },
    });
  },

  checkEmailRegistered(email: string) {
    return waitlistRequest<{ registered: boolean }>("/waitlist_public/check_email_registered", {
      query: { email: email.trim().toLowerCase() },
    });
  },

  sendEmailCode(email: string) {
    return waitlistRequest<true>("/quiz/send_email_code", {
      method: "POST",
      body: { email: email.trim().toLowerCase() },
    });
  },

  login(email: string, code: string) {
    return waitlistRequest<LoginResult>("/quiz/login", {
      method: "POST",
      body: { email: email.trim().toLowerCase(), code },
    });
  },

  submitQuiz(answers: Record<string, string>, userToken: string) {
    return waitlistRequest<{ resultId: string }>("/user/submit_quiz", {
      method: "POST",
      body: { answers },
      userToken,
    });
  },

  getMyResult(userToken: string) {
    return waitlistRequest<MyResult>("/user/my_result", { userToken });
  },

  getCommunityInfo(userToken: string) {
    return waitlistRequest<CommunityInfo>("/user/community_info", { userToken });
  },

  completeCommunity(channel: CommunityChannel, userToken: string) {
    return waitlistRequest<CommunityCompleteResult>("/user/community_complete", {
      method: "POST",
      body: { channel },
      userToken,
    });
  },

  shareComplete(userToken: string) {
    return waitlistRequest<true>("/user/share_complete", {
      method: "POST",
      userToken,
    });
  },

  getRank(userToken: string) {
    return waitlistRequest<RankView>("/user/rank", { userToken });
  },

  getMyInvites(userToken: string) {
    return waitlistRequest<{ list: InviteItem[] }>("/user/my_invites", { userToken });
  },

  getUserInfo(userToken: string) {
    return waitlistRequest<UserInfo>("/user/info", { userToken });
  },
};
