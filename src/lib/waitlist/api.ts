import { getUserToken } from "./session";
import {
  type CommunityChannel,
  type CommunityCompleteResult,
  type CommunityInfo,
  type InviteFriendsView,
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
  } = {},
) {
  const url = new URL(path, `${apiBase()}/`);
  Object.entries(options.query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  });

  const headers: Record<string, string> = { Accept: "application/json" };
  if (options.body !== undefined) headers["Content-Type"] = "application/json";

  if (path.startsWith("/user/")) {
    const userToken = options.userToken || getUserToken();
    if (userToken) headers.Authorization = authValue(userToken);
  }
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

function readInviteView(raw: unknown): InviteView | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  const nested = obj.data;
  if (nested && typeof nested === "object" && ("status" in nested || "exists" in nested)) {
    return readInviteView(nested);
  }
  if (!("status" in obj) && !("exists" in obj)) return null;
  const status = Number(obj.status);
  return {
    exists: obj.exists === true,
    status: status === 0 ? 0 : 3,
    message: typeof obj.message === "string" ? obj.message : "",
  };
}

/** `check_invite` 以 data.status 为准：0 可用，3 无效。外层 code 200 / message SUCCESS 只表示请求成功。 */
export function isInviteAccepted(view: InviteView | null | undefined): boolean {
  const parsed = readInviteView(view);
  return Boolean(parsed && parsed.status === 0 && parsed.exists);
}

export function inviteCheckMessage(view: InviteView | null | undefined, fallback: string) {
  const parsed = readInviteView(view);
  const text = parsed?.message.trim() ?? "";
  if (!text || text.toUpperCase() === "SUCCESS") return fallback;
  return text;
}

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(value));
}

export const waitlistApi = {
  getQuestions() {
    return waitlistRequest<{ questions: ApiQuizQuestion[] }>("/quiz/questions");
  },

  async checkInvite(inviteCode: string) {
    const data = await waitlistRequest<InviteView>("/waitlist_public/check_invite", {
      query: { inviteCode: normalizeInviteCode(inviteCode) },
    });
    return (
      readInviteView(data) ?? {
        exists: false,
        status: 3 as const,
        message: "",
      }
    );
  },

  async getInviterCard(inviteCode: string) {
    const data = await waitlistRequest<ResultCard | Record<string, never>>("/waitlist_public/inviter_card", {
      query: { inviteCode: normalizeInviteCode(inviteCode) },
    });
    return isResultCard(data) ? data : null;
  },

  getPublicResult(invite: string) {
    return waitlistRequest<PublicResult>("/waitlist_public/result", {
      query: { inviteCode: normalizeInviteCode(invite) },
    });
  },

  checkEmailRegistered(email: string) {
    return waitlistRequest<{ registered: boolean } | null>("/waitlist_public/check_email_registered", {
      query: { email: normalizeEmail(email) },
    });
  },

  checkEmailCode(email: string) {
    return waitlistRequest<{ valid: boolean; expireSeconds: number | null }>("/waitlist_public/check_email_code", {
      query: { email: normalizeEmail(email) },
    });
  },

  sendEmailCode(email: string) {
    return waitlistRequest<true>("/quiz/send_email_code", {
      method: "POST",
      body: { email: email.trim().toLowerCase() },
    });
  },

  login(email: string, code: string, inviteCode?: string) {
    const body: { email: string; code: string; inviteCode?: string } = {
      email: email.trim().toLowerCase(),
      code,
    };
    const invite = inviteCode ? normalizeInviteCode(inviteCode) : "";
    if (isValidInviteCode(invite)) body.inviteCode = invite;
    return waitlistRequest<LoginResult>("/quiz/login", {
      method: "POST",
      body,
    });
  },

  submitQuiz(answers: Record<string, string>, userToken: string) {
    return waitlistRequest<{ resultId: string }>("/user/submit_quiz", {
      method: "POST",
      body: { answers },
      userToken,
    });
  },

  getQuizStatus(userToken: string) {
    return waitlistRequest<{ submitted: boolean; resultId: string }>("/user/quiz_status", { userToken });
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

  async getInviteFriends(userToken: string) {
    const data = await waitlistRequest<InviteFriendsView>("/user/invite_friends", {
      query: { pageIndex: 1, pageSize: 1 },
      userToken,
    });
    const total = Number(data?.total);
    return {
      list: data?.list ?? [],
      total: Number.isFinite(total) && total > 0 ? Math.floor(total) : 0,
      totalPages: Number(data?.totalPages) || 0,
    };
  },

  getUserInfo(userToken: string) {
    return waitlistRequest<UserInfo>("/user/info", { userToken });
  },
};
