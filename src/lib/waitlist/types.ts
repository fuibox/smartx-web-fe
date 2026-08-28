export type WaitlistStage = "boot" | "gate" | "quiz" | "email" | "verify" | "unlock" | "result";
export type AuthIntent = "create" | "recover";
export type Pole = "DEGEN" | "SNIPER" | "GUT" | "DATA" | "PACK" | "LONE";
export type Stat = "conviction" | "instinct" | "resilience";
export type CommunityChannel = "telegram" | "x";

export type Persona = {
  name: string;
  cn: string;
  code: string;
  mark: string;
  roast: string;
  artSrc: string;
  artAlt: string;
};

export type Outcome = {
  resultId: string;
  persona: Persona;
  poles: readonly [Pole, Pole, Pole];
  stats: Record<Stat, number>;
  bestMatch: Persona;
  rival: Persona;
};

export type QuizOption = {
  optionId: string;
  label: string;
};

export type ApiQuizQuestion = {
  questionId: string;
  dimension: string;
  prompt: string;
  artworkKey: string;
  options: QuizOption[];
};

export type QuizQuestion = ApiQuizQuestion & {
  artSrc: string;
  artAlt: string;
};

export type InviteStatus = 0 | 3;

export type InviteView = {
  exists: boolean;
  status: InviteStatus;
  message: string;
};

export type DimensionView = {
  id: number;
  key: string;
  nameZh: string;
  nameEn: string;
  side: string;
  sideNameZh: string;
  sideNameEn: string;
};

export type AttributeView = {
  id: number;
  key: string;
  nameZh: string;
  nameEn: string;
  value: number;
};

export type PersonaRef = {
  personaId: string;
  nameZh: string;
  nameEn: string;
  imageUrl: string;
};

export type ResultCard = {
  resultId: string;
  personaId: string;
  nameZh: string;
  nameEn: string;
  imageUrl: string;
  descriptionZh: string;
  descriptionEn: string;
  roastZh: string;
  roastEn: string;
  colorTag: string;
  dimensions: DimensionView[];
  attributes: AttributeView[];
  bestMatch: PersonaRef;
  naturalRival: PersonaRef;
  configVersion: string;
};

export type PublicResult = {
  hidden: boolean;
  card: ResultCard | null;
};

export type UserInfo = {
  userId: string;
  email: string;
  joinedAt: number;
  submitted: boolean;
  resultId: string;
  personaId: string;
  imageUrl: string;
  telegramCompleted: number;
  xCompleted: number;
  unlocked: boolean;
  shareCompleted: number;
  inviteCode: string;
  inviteNum: number;
  marketingSubscribed: number;
};

export type LoginResult = {
  token: string;
  userId: string;
  isNewUser: boolean;
  resultId: string;
};

export type MyResultLocked = {
  submitted: boolean;
  locked: true;
  telegramCompleted: number;
  xCompleted: number;
};

export type MyResultUnlocked = ResultCard & {
  submitted: true;
  locked: false;
  rank: number;
  totalUsers: number;
  shareCompleted: number;
  inviteNum: number;
  joinedAt: number;
};

export type MyResult = MyResultLocked | MyResultUnlocked;

export type CommunityInfo = {
  links: {
    telegram: string;
    x: string;
  };
  telegramCompleted: number;
  xCompleted: number;
};

export type CommunityCompleteResult = {
  telegramCompleted: number;
  xCompleted: number;
  unlocked: boolean;
};

export type InviteFriend = {
  userId: string;
  joinedAt: number;
};

export type InviteFriendsView = {
  list: InviteFriend[];
  total: number;
  totalPages: number;
};

export type RankView = {
  rank: number;
  totalUsers: number;
  rankScore: number;
};

export type WaitlistEnvelope<T> = {
  code: number;
  message: string;
  data: T;
};

export class WaitlistApiError extends Error {
  code: number;
  scope: "user" | "public";
  path: string;

  constructor(code: number, message: string, scope: "user" | "public" = "public", path = "") {
    super(message);
    this.name = "WaitlistApiError";
    this.code = code;
    this.scope = scope;
    this.path = path;
  }
}

export function isWaitlistApiError(error: unknown): error is WaitlistApiError {
  return error instanceof WaitlistApiError;
}

export function isUserApiError(error: unknown): error is WaitlistApiError {
  return isWaitlistApiError(error) && error.scope === "user";
}

export function isPublicResultError(error: unknown): error is WaitlistApiError {
  return isWaitlistApiError(error) && error.path === "/waitlist_public/result";
}

export function isUserInfoError(error: unknown): error is WaitlistApiError {
  return isWaitlistApiError(error) && error.path === "/user/info";
}

export function isMissingUserError(error: unknown): error is WaitlistApiError {
  return isWaitlistApiError(error) && error.message === "user not found";
}

export function isUnlockedResult(result: MyResult): result is MyResultUnlocked {
  return result.submitted && !result.locked;
}
