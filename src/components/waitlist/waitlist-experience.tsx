"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useLingui } from "@lingui/react";
import { msg, t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import type { MessageDescriptor } from "@lingui/core";

import { ConsumerHeader } from "@/components/consumer-network/consumer-header";
import { notifyError, notifyNotice } from "@/components/site/app-notice";
import { isInviteAccepted, inviteCheckMessage, isValidEmail, isValidInviteCode, normalizeEmail, normalizeInviteCode, sanitizeInviteCodeInput, waitlistApi } from "@/lib/waitlist/api";
import {
  hydrateQuestions,
  localizedPersonaName,
  localizedPersonaRoast,
  localizedPole,
  mapCardToOutcome,
  PERSONAS_BY_CODE,
  prefetchQuizArtwork,
  QUIZ_ART_SRCS,
} from "@/lib/waitlist/persona";
import { localizedOptionLabel, localizedQuestionPrompt } from "@/lib/waitlist/quiz-i18n";
import {
  copyShareImage,
  createImagePreviewUrl,
  downloadShareImage,
  isAndroid,
  isIOS,
  isMobileSharePlatform,
  SHARE_IMAGE_EXT,
  shareFileName,
  type ShareImageAction,
  type ShareImageActionResult,
} from "@/lib/waitlist/share-image";
import { i18n } from "@/lingui";
import {
  areCommunityTasksDone,
  decideWaitlistEntry,
  isCommunityChannelDone,
  isOwnResultAvailable,
  rememberWaitlistNotice,
  shareQueryPresent,
  takeWaitlistNotice,
  waitlistPathWithoutShare,
} from "@/lib/waitlist/routing";
import {
  clearLandingInvite,
  clearQuizDraft,
  clearUserToken,
  getLandingInvite,
  getQuizDraft,
  getUserToken,
  setLandingInvite,
  setQuizDraft,
  setUserToken,
} from "@/lib/waitlist/session";
import {
  type AuthIntent,
  type CommunityChannel,
  type Outcome,
  type QuizQuestion,
  type ResultCard,
  type UserInfo,
  type WaitlistStage,
  isMissingUserError,
  isUnlockedResult,
  isWaitlistApiError,
} from "@/lib/waitlist/types";

import { WaitlistActionScope, WaitlistButton } from "./waitlist-button";
import { WaitlistDemoControl, type WaitlistDemoTarget } from "./waitlist-demo-control";

import { renderResultCard, type RenderedResultCard, type ResultCardFormat } from "./result-card-export";
import styles from "./waitlist.module.css";

const WAITLIST_URL = "https://smartx.io/waitlist/";
const PRIORITY_PER_FRIEND = 500;
const PRIORITY_FRIEND_CAP = 5000;
const NO_SAVED_RESULT = "No saved result is linked to this email. Take the test to create one.";
const INVALID_EMAIL = "Please enter a valid email address.";
const GENERIC_ERROR = "Something went wrong. Please try again.";
const INVITE_UNRECOGNIZED = "Invite code not recognized. Check the code and try again.";
const SESSION_EXPIRED = "Authorization error";
const INVALID_ANSWERS = "invalid answers";
const INVITES_POLL_MS = 10_000;
const OTP_RESEND_SECONDS = 60;
const OTP_EXPIRE_SECONDS = 300;
const DEFAULT_COMMUNITY = {
  telegram: "https://t.me/SmartX_Community",
  x: "https://x.com/SmartXTerminal",
};

function resolveCommunityHref(value: string | undefined, fallback: string) {
  const href = value?.trim() ?? "";
  if (!href) return fallback;
  try {
    const url = new URL(href);
    if (url.protocol !== "http:" && url.protocol !== "https:") return fallback;
    return href;
  } catch {
    return fallback;
  }
}

function communityLinksFrom(info: { links?: { telegram?: string; x?: string } } | null | undefined) {
  return {
    telegram: resolveCommunityHref(info?.links?.telegram, DEFAULT_COMMUNITY.telegram),
    x: resolveCommunityHref(info?.links?.x, DEFAULT_COMMUNITY.x),
  };
}

const DEMO_OUTCOME: Outcome = {
  resultId: "demo-result",
  persona: PERSONAS_BY_CODE.SIG,
  poles: ["DEGEN", "DATA", "PACK"],
  stats: { conviction: 86, instinct: 72, resilience: 64 },
  bestMatch: PERSONAS_BY_CODE.CHN,
  rival: PERSONAS_BY_CODE.DOC,
};

const HIDDEN_DEMO_OUTCOME: Outcome = {
  resultId: "demo-result-rsk",
  persona: PERSONAS_BY_CODE.RSK,
  poles: ["SNIPER", "DATA", "LONE"],
  stats: { conviction: 40, instinct: 38, resilience: 92 },
  bestMatch: PERSONAS_BY_CODE.CHN,
  rival: PERSONAS_BY_CODE.LQD,
};

// 状态与分支逻辑始终使用英文规范文案（与 API 返回值精确比较）；
// 只在渲染时经此映射表转成当前语言，未知文案原样透出。
const WAITLIST_MESSAGE_L10N: Record<string, MessageDescriptor> = {
  [NO_SAVED_RESULT]: msg`No saved result is linked to this email. Take the test to create one.`,
  [INVALID_EMAIL]: msg`Please enter a valid email address.`,
  [GENERIC_ERROR]: msg`Something went wrong. Please try again.`,
  [INVITE_UNRECOGNIZED]: msg`Invite code not recognized. Check the code and try again.`,
  [SESSION_EXPIRED]: msg`Your session expired. Sign in again to continue.`,
  [INVALID_ANSWERS]: msg`Those answers didn’t go through. Check all six questions and try again.`,
  "Verification code is incorrect or expired": msg`Verification code is incorrect or expired`,
  "Please wait before requesting a new code.": msg`Please wait before requesting a new code.`,
  "Email send limit exceeded. Try again later.": msg`Email send limit exceeded. Try again later.`,
  "Failed to send verification code": msg`Failed to send verification code`,
  "Too many requests. Try again later.": msg`Too many requests. Try again later.`,
  "service is busy": msg`Service is busy. Try again in a moment.`,
  "request too many times": msg`Too many requests. Try again later.`,
  "result not found": msg`That result could not be found.`,
  "user not found": msg`No account was found for this email.`,
  "Quiz not submitted yet": msg`Finish the test before unlocking your result.`,
  "parameters missing": msg`Required information is missing. Try again.`,
  "invalid channel": msg`That community step could not be recorded. Try again.`,
  "authorization required": msg`Your session expired. Sign in again to continue.`,
};

function localizeWaitlistMessage(message: string) {
  if (!message) return message;
  const descriptor = WAITLIST_MESSAGE_L10N[message];
  return descriptor ? i18n._(descriptor) : message;
}

type Workspace =
  | {
      kind: "result";
      outcome: Outcome;
      rank: number;
      shareCompleted: boolean;
      verifiedFriends: number;
      inviteCode: string;
      links: { telegram: string; x: string };
      telegramCompleted: boolean;
      xCompleted: boolean;
    }
  | {
      kind: "unlock";
      links: { telegram: string; x: string };
      telegramCompleted: boolean;
      xCompleted: boolean;
    };

function buildQuizAnswers(questions: QuizQuestion[], answers: Record<string, string>) {
  return Object.fromEntries(
    questions
      .map((question) => [question.questionId, answers[question.questionId]] as const)
      .filter((entry): entry is readonly [string, string] => Boolean(entry[1])),
  );
}

function remainingSeconds(until: number, now: number) {
  return Math.max(0, Math.ceil((until - now) / 1000));
}

function formatClock(total: number) {
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function formatWaitlistCopy(message: string) {
  if (message === "ERROR") return GENERIC_ERROR;
  return message;
}

function errorMessage(error: unknown) {
  if (isWaitlistApiError(error)) return formatWaitlistCopy(error.message) || GENERIC_ERROR;
  return GENERIC_ERROR;
}

function isUnauthorized(error: unknown) {
  return isWaitlistApiError(error) && error.code === 401;
}

function isExpiredSession(error: unknown) {
  return isUnauthorized(error) || isMissingUserError(error);
}

function makeInvitationUrl(code?: string, useCurrentOrigin = false) {
  const base = useCurrentOrigin && typeof window !== "undefined" ? new URL("/waitlist/", window.location.origin).toString() : WAITLIST_URL;
  const url = new URL(base);
  if (code) url.searchParams.set("invite", code);
  return url.toString();
}

function publicShareCard(data: { hidden?: boolean; card?: ResultCard | null } | null) {
  if (!data || data.hidden || !data.card) return null;
  return data.card;
}

async function fetchWorkspace(token: string): Promise<Workspace> {
  const [result, community, info] = await Promise.all([
    waitlistApi.getMyResult(token),
    waitlistApi.getCommunityInfo(token),
    waitlistApi.getUserInfo(token),
  ]);
  const links = communityLinksFrom(community);
  const telegramCompleted = isCommunityChannelDone(info.telegramCompleted, community.telegramCompleted);
  const xCompleted = isCommunityChannelDone(info.xCompleted, community.xCompleted);
  const communityDone = telegramCompleted && xCompleted;

  const toResultWorkspace = async (card: ResultCard & { rank: number; shareCompleted: number; inviteNum?: number }) => {
  return {
      kind: "result" as const,
      outcome: mapCardToOutcome(card),
      rank: card.rank,
      shareCompleted: card.shareCompleted === 1,
      verifiedFriends: Number.isFinite(info.inviteNum) ? info.inviteNum : Number(card.inviteNum) || 0,
      inviteCode: info.inviteCode || "",
      links,
      telegramCompleted,
      xCompleted,
    };
  };

  if (communityDone && isUnlockedResult(result)) return toResultWorkspace(result);

  if (communityDone) {
    const retry = await waitlistApi.getMyResult(token);
    if (isUnlockedResult(retry)) return toResultWorkspace(retry);
  }

  return { kind: "unlock", links, telegramCompleted, xCompleted };
}

function QuestionArtwork({
  question,
  questions,
}: {
  question: QuizQuestion;
  questions: QuizQuestion[];
}) {
  const layers = questions.length ? questions : [question];

  return (
    <div className={styles.questionArtwork}>
      {layers.map((item) => {
        const active = item.questionId === question.questionId;
        return (
          <div
            key={item.questionId}
            className={styles.questionArtLayer}
            data-active={active ? "true" : undefined}
          >
            <Image
              src={item.artSrc}
              alt={active ? item.artAlt : ""}
              fill
              sizes="(max-width: 750px) 100vw, 50vw"
              priority
              loading="eager"
              aria-hidden={!active}
            />
          </div>
        );
      })}
    </div>
  );
}

function ScoreAxis({ label, score }: { label: string; score: number }) {
  return (
    <div className={styles.scoreAxis}>
      <div><span>{label}</span><strong>{score}</strong></div>
      <div className={styles.scoreTrack}><i style={{ width: `${score}%` }} /></div>
    </div>
  );
}

function AccountSession({
  email,
  label,
  compact,
  place,
  onSignOut,
}: {
  email: string;
  label: string;
  compact?: boolean;
  place?: "copy" | "scene";
  onSignOut: () => void;
}) {
  useLingui();

  return (
    <div className={styles.accountStrip} data-compact={compact ? "true" : undefined} data-place={place}>
      <div>
        <span>{label}</span>
        <strong>{email || t`Email verified`}</strong>
      </div>
      <WaitlistButton type="button" onClick={onSignOut}>
        <Trans>Sign out</Trans>
      </WaitlistButton>
    </div>
  );
}

function PersonaPoster({
  outcome,
}: {
  outcome: Outcome;
}) {
  useLingui();

  return (
    <article className={styles.personaPoster}>
      <div className={styles.posterIdentity}>
        <div className={styles.posterPoles}>
          {outcome.poles.map((pole) => <span key={pole}>{localizedPole(pole)}</span>)}
        </div>
        <h2>{localizedPersonaName(outcome.persona)}</h2>
      </div>
      <div className={styles.personaArt}>
        <Image
          src={outcome.persona.artSrc}
          alt={outcome.persona.artAlt}
          fill
          sizes="(max-width: 880px) 320px, 400px"
          priority
        />
      </div>
      <div className={styles.posterScores}>
        <ScoreAxis label={t`Conviction`} score={outcome.stats.conviction} />
        <ScoreAxis label={t`Instinct`} score={outcome.stats.instinct} />
        <ScoreAxis label={t`Resilience`} score={outcome.stats.resilience} />
      </div>
      {outcome.persona.roast ? <blockquote>{localizedPersonaRoast(outcome.persona)}</blockquote> : null}
      <section className={styles.chemistryBlock} aria-label={t`Persona chemistry`}>
        <div><span><Trans>Best match</Trans></span><strong>{localizedPersonaName(outcome.bestMatch)}</strong></div>
        <div><span><Trans>Natural rival</Trans></span><strong>{localizedPersonaName(outcome.rival)}</strong></div>
      </section>
    </article>
  );
}

export function WaitlistExperience() {
  const { i18n: activeI18n } = useLingui();
  const router = useRouter();
  const pathname = usePathname();
  const shareParams = useSearchParams();
  const routerRef = useRef(router);
  routerRef.current = router;
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;
  const [stage, setStage] = useState<WaitlistStage>("boot");
  const [inviteCode, setInviteCode] = useState("");
  const [gateError, setGateError] = useState("");
  const [referralOutcome, setReferralOutcome] = useState<Outcome | null>(null);
  const [ownOutcome, setOwnOutcome] = useState<Outcome | null>(null);
  const [userToken, setUserTokenState] = useState("");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [authIntent, setAuthIntent] = useState<AuthIntent>("create");
  const [email, setEmail] = useState("");
  const [sessionEmail, setSessionEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpResendAt, setOtpResendAt] = useState(0);
  const [otpExpireAt, setOtpExpireAt] = useState(0);
  const [nowMs, setNowMs] = useState(0);
  const [recoveryError, setRecoveryError] = useState("");
  const [telegramOpened, setTelegramOpened] = useState(false);
  const [xOpened, setXOpened] = useState(false);
  const [communityLinks, setCommunityLinks] = useState(DEFAULT_COMMUNITY);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const inviteCodeRef = useRef(inviteCode);
  inviteCodeRef.current = inviteCode;
  const [quizWarning, setQuizWarning] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [shareCompleted, setShareCompleted] = useState(false);
  const [verifiedFriends, setVerifiedFriends] = useState(0);
  const [ownInviteCode, setOwnInviteCode] = useState("");
  const [rank, setRank] = useState<number | null>(null);
  const [preparedCards, setPreparedCards] = useState<Partial<Record<ResultCardFormat, RenderedResultCard>>>({});
  const [exportError, setExportError] = useState(false);
  const [sharePreview, setSharePreview] = useState<{ url: string; tip: string } | null>(null);
  const [exporting, setExporting] = useState(false);
  const preparedCardsRef = useRef(preparedCards);
  preparedCardsRef.current = preparedCards;
  const [demoActive, setDemoActive] = useState(() => shareParams.get("demo") === "1");
  const [demoTarget, setDemoTarget] = useState<WaitlistDemoTarget>("gate");

  useEffect(() => {
    prefetchQuizArtwork();
  }, []);

  const loggedIn = Boolean(userToken && userInfo);
  const demoVisible = shareParams.get("demo") === "1";
  const hasOwnResult = isOwnResultAvailable({ loggedIn, submitted: Boolean(userInfo?.submitted && userInfo.resultId) });
  const inviteReady = isValidInviteCode(inviteCode);
  const savedPersona = ownOutcome?.persona ?? PERSONAS_BY_CODE[userInfo?.personaId ?? ""];
  const savedPersonaName = savedPersona ? localizedPersonaName(savedPersona) : t`your trader type`;
  const currentQuestion = questions[questionIndex];
  const verifiedEmail = userInfo?.email || sessionEmail || email;
  const friendRewardApplied = verifiedFriends > 0;
  const friendPriority = Math.min(
    PRIORITY_FRIEND_CAP,
    Math.max(PRIORITY_PER_FRIEND, PRIORITY_PER_FRIEND * verifiedFriends),
  );
  const clock = nowMs || (otpExpireAt || otpResendAt ? Date.now() : 0);
  const otpCooldown = otpResendAt ? remainingSeconds(otpResendAt, clock) : 0;
  const otpExpiresIn = otpExpireAt ? remainingSeconds(otpExpireAt, clock) : 0;

  const clearShareUrl = (options?: { hard?: boolean; notice?: string }) => {
    if (typeof window === "undefined") return;
    const dirty = shareQueryPresent() || Boolean(shareParams.get("result") || shareParams.get("invite"));
    const next = waitlistPathWithoutShare();
    if (!dirty) {
      if (options?.notice) setGateError(options.notice);
      return;
    }
    if (options?.hard) {
      if (options.notice) rememberWaitlistNotice(options.notice);
      window.location.replace(next);
      return;
    }
    window.history.replaceState(window.history.state, "", next);
    routerRef.current.replace(next || pathnameRef.current, { scroll: false });
  };

  const applyWorkspace = (workspace: Workspace) => {
    setCommunityLinks(workspace.links);
    setTelegramOpened(workspace.telegramCompleted);
    setXOpened(workspace.xCompleted);
    if (workspace.kind === "result") {
      setOwnOutcome(workspace.outcome);
      setRank(workspace.rank);
      setShareCompleted(workspace.shareCompleted);
      setVerifiedFriends(workspace.verifiedFriends);
      setOwnInviteCode(workspace.inviteCode);
      setStage("result");
      return;
    }
    setVerifiedFriends(0);
    setOwnInviteCode("");
    setStage("unlock");
  };

  const persistLandingInvite = (code: string) => {
    const next = normalizeInviteCode(code);
    if (!isValidInviteCode(next)) return false;
    setLandingInvite(next);
    setInviteCode(next);
    return true;
  };

  const dropLandingInvite = () => {
    clearLandingInvite();
  };

  const resetAuth = (options?: { keepDraft?: boolean }) => {
    clearUserToken();
    setUserTokenState("");
    setUserInfo(null);
    setOwnOutcome(null);
    setOwnInviteCode("");
    setRank(null);
    setShareCompleted(false);
    setVerifiedFriends(0);
    setSessionEmail("");
    setEmail("");
    setOtp("");
    setTelegramOpened(false);
    setXOpened(false);
    if (!options?.keepDraft) {
      clearQuizDraft();
      setAnswers({});
      setQuestionIndex(0);
    }
  };

  const handleExpiredUserSession = (error: unknown) => {
    const hadResult = Boolean(userInfo?.submitted && userInfo.resultId);
    const draft = getQuizDraft();
    const hasDraft = Boolean(draft && Object.keys(draft.answers).length);
    resetAuth({ keepDraft: true });
    setOtp("");
    setOtpError("");
    const message = errorMessage(error);
    if (hadResult) {
      setAuthIntent("recover");
      setRecoveryError(message === SESSION_EXPIRED ? message : SESSION_EXPIRED);
      setStage("email");
      return;
    }
    if (hasDraft) {
      setAuthIntent("create");
      setRecoveryError(message === SESSION_EXPIRED ? message : SESSION_EXPIRED);
      setStage("email");
      return;
    }
    setGateError(message === "user not found" ? message : SESSION_EXPIRED);
    setStage("gate");
  };

  const handleUserApiError = (error: unknown) => {
    if (!isExpiredSession(error)) return false;
    handleExpiredUserSession(error);
    return true;
  };
  const handleUserApiErrorRef = useRef(handleUserApiError);
  handleUserApiErrorRef.current = handleUserApiError;

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const pendingNotice = takeWaitlistNotice();
      if (pendingNotice) setGateError(pendingNotice);

    const params = new URLSearchParams(window.location.search);
      const urlInviteRaw = (params.get("invite") ?? "").trim();
      const urlInvite = normalizeInviteCode(urlInviteRaw);
      const shareEntry = Boolean(urlInviteRaw);
      const storedUserToken = getUserToken();
      const quizDraft = getQuizDraft();
      const storedInvite = getLandingInvite();

      let invite = urlInvite || storedInvite;
      if (urlInvite) {
        persistLandingInvite(urlInvite);
        invite = urlInvite;
      } else if (storedInvite) {
        invite = storedInvite;
      }

      if (invite) setInviteCode(invite);
      if (quizDraft) {
        setAnswers(quizDraft.answers);
        setQuestionIndex(quizDraft.questionIndex);
      }

      const [questionsResult, infoResult, publicResult, inviteCardResult, inviteStatusResult] = await Promise.allSettled([
        waitlistApi.getQuestions().then((data) => hydrateQuestions(data.questions)),
        storedUserToken ? waitlistApi.getUserInfo(storedUserToken) : Promise.resolve(null),
        shareEntry && isValidInviteCode(urlInvite) ? waitlistApi.getPublicResult(urlInvite) : Promise.resolve(null),
        shareEntry && isValidInviteCode(urlInvite) ? waitlistApi.getInviterCard(urlInvite) : Promise.resolve(null),
        isValidInviteCode(invite) ? waitlistApi.checkInvite(invite) : Promise.resolve(null),
      ]);

      if (cancelled) return;

      if (questionsResult.status === "fulfilled") {
        setQuestions(questionsResult.value);
        prefetchQuizArtwork(questionsResult.value.map((item) => item.artSrc));
      }

      let info: UserInfo | null = null;
      if (infoResult.status === "fulfilled") {
        info = infoResult.value;
      } else if (storedUserToken) {
        if (isExpiredSession(infoResult.reason)) {
          clearUserToken();
      } else {
          setGateError(errorMessage(infoResult.reason));
          setStage("gate");
          return;
        }
      }

      if (info && storedUserToken) {
        setUserTokenState(storedUserToken);
        setUserInfo(info);
        setSessionEmail(info.email);
        if (info.inviteCode) setOwnInviteCode(info.inviteCode);
      }

      const friendCard =
        (publicResult.status === "fulfilled" ? publicShareCard(publicResult.value) : null) ??
        (inviteCardResult.status === "fulfilled" ? inviteCardResult.value : null);
      if (friendCard) setReferralOutcome(mapCardToOutcome(friendCard));

      const inviteView = inviteStatusResult.status === "fulfilled" ? inviteStatusResult.value : null;
      const inviteRejected = inviteStatusResult.status === "rejected";
      const inviteBlocked = Boolean(invite) && (inviteRejected || !isInviteAccepted(inviteView));
      if (inviteRejected) {
        dropLandingInvite();
        setGateError(errorMessage(inviteStatusResult.reason));
      } else if (inviteBlocked) {
        dropLandingInvite();
        setGateError(inviteCheckMessage(inviteView, INVITE_UNRECOGNIZED));
      } else if (isInviteAccepted(inviteView) && invite) {
        persistLandingInvite(invite);
      }

      const route = decideWaitlistEntry({
        hasFriendCard: Boolean(friendCard),
        loggedIn: Boolean(info && storedUserToken),
        submitted: Boolean(info?.submitted && info.resultId),
        unlocked: Boolean(info?.unlocked) && areCommunityTasksDone(info),
        hasQuizProgress: Boolean(quizDraft && Object.keys(quizDraft.answers).length),
      });

      if ((route.stage === "result" || route.stage === "unlock") && storedUserToken) {
        try {
          applyWorkspace(await fetchWorkspace(storedUserToken));
        } catch (error) {
          if (!handleUserApiError(error)) {
            setGateError(errorMessage(error));
            setStage("gate");
          }
        }
        return;
      }

      if (route.stage === "quiz" && questionsResult.status !== "fulfilled") {
        setGateError(errorMessage(questionsResult.reason));
        setStage("gate");
        return;
      }

      if (inviteBlocked && route.stage === "quiz") {
        setStage("gate");
        return;
      }

      if (route.stage === "quiz") clearShareUrl();
      setStage(route.stage);
    }

    bootstrap().catch(() => {
      if (!cancelled) {
        setGateError(GENERIC_ERROR);
        setStage("gate");
      }
    });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only bootstrap
  }, []);

  useEffect(() => {
    if (stage !== "verify") return;
    setNowMs(Date.now());
    const timer = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [stage]);

  useEffect(() => {
    if (stage !== "quiz" && stage !== "email" && stage !== "verify") return;
    setQuizDraft({ answers, questionIndex });
  }, [answers, questionIndex, stage]);

  useEffect(() => {
    if (demoActive || stage !== "result" || !userToken) return;
    let inFlight = false;
    const pollInvites = async () => {
      if (inFlight || document.hidden) return;
      inFlight = true;
      try {
        const [info, result] = await Promise.all([
          waitlistApi.getUserInfo(userToken),
          waitlistApi.getMyResult(userToken),
        ]);
        setUserInfo(info);
        setVerifiedFriends(Number.isFinite(info.inviteNum) ? info.inviteNum : 0);
        if (info.inviteCode) setOwnInviteCode(info.inviteCode);
        if (isUnlockedResult(result)) {
          setRank(result.rank);
          setShareCompleted(result.shareCompleted === 1);
        }
      } catch (error) {
        handleUserApiErrorRef.current(error);
      } finally {
        inFlight = false;
      }
    };
    const timer = window.setInterval(() => {
      void pollInvites();
    }, INVITES_POLL_MS);
    return () => window.clearInterval(timer);
  }, [demoActive, stage, userToken]);

  const resultCardData = (outcome: Outcome) => ({
    name: localizedPersonaName(outcome.persona),
    code: outcome.persona.mark,
    roast: localizedPersonaRoast(outcome.persona),
    artSrc: outcome.persona.artSrc,
    localArtSrc: PERSONAS_BY_CODE[outcome.persona.mark]?.artSrc
      || PERSONAS_BY_CODE[outcome.persona.code]?.artSrc,
    poles: outcome.poles.map(localizedPole),
    scores: outcome.stats,
    rank: rank ?? 0,
    labels: {
      traderType: t`Trader type`,
      waitlistRank: t`Waitlist rank`,
      conviction: t`Conviction`,
      instinct: t`Instinct`,
      resilience: t`Resilience`,
    },
  });

  useEffect(() => {
    if (stage !== "result" || !ownOutcome) return;
    let disposed = false;
    let rendered: RenderedResultCard[] = [];
    setPreparedCards({});
    setExportError(false);
    const data = resultCardData(ownOutcome);
    Promise.all([renderResultCard(data, "story"), renderResultCard(data, "og")])
      .then((cards) => {
        rendered = cards;
        if (disposed) {
          cards.forEach((card) => URL.revokeObjectURL(card.href));
          return;
        }
        setPreparedCards({ story: cards[0], og: cards[1] });
      })
      .catch(() => {
        if (!disposed) setExportError(true);
      });
    return () => {
      disposed = true;
      rendered.forEach((card) => URL.revokeObjectURL(card.href));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- render from outcome, locale, and rank
  }, [stage, ownOutcome, activeI18n.locale, rank]);

  const ensureQuestions = async () => {
    if (questions.length) return questions;
    const data = await waitlistApi.getQuestions();
    const next = hydrateQuestions(data.questions);
    prefetchQuizArtwork(next.map((item) => item.artSrc));
    setQuestions(next);
    return next;
  };

  const showDemoTarget = async (target: WaitlistDemoTarget) => {
    setDemoActive(true);
    setDemoTarget(target);
    setGateError("");
    setQuizWarning("");
    setRecoveryError("");
    setOtpError("");
    setPreparedCards({});
    setExportError(false);

    if (target.startsWith("quiz-")) {
      try {
        const nextQuestions = await ensureQuestions();
        const requested = Number(target.slice("quiz-".length)) - 1;
        setQuestionIndex(Math.min(Math.max(requested, 0), Math.max(nextQuestions.length - 1, 0)));
        setReferralOutcome(null);
        setStage("quiz");
      } catch (error) {
        setGateError(errorMessage(error));
        setStage("gate");
      }
      return;
    }

    if (target === "referral") {
      setReferralOutcome(DEMO_OUTCOME);
      setInviteCode("smartx01");
      setStage("gate");
      return;
    }

    setReferralOutcome(null);
    if (target === "gate") {
      setInviteCode("");
      setStage("gate");
      return;
    }
    if (target === "email-create" || target === "email-recover") {
      setAuthIntent(target === "email-recover" ? "recover" : "create");
      setEmail("");
      setStage("email");
      return;
    }
    if (target === "verify") {
      setAuthIntent("create");
      setEmail("demo@smartx.io");
      setOtp("");
      setStage("verify");
      return;
    }
    if (target === "unlock" || target === "unlock-ready") {
      const completed = target === "unlock-ready";
      setSessionEmail("demo@smartx.io");
      setTelegramOpened(completed);
      setXOpened(completed);
      setStage("unlock");
      return;
    }

    setSessionEmail("demo@smartx.io");
    setOwnOutcome(target === "result-hidden" ? HIDDEN_DEMO_OUTCOME : DEMO_OUTCOME);
    setRank(8017);
    setShareCompleted(false);
    setVerifiedFriends(2);
    setOwnInviteCode("smartx01");
    setStage("result");
  };

  const exitDemo = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("demo");
    window.location.assign(url.toString());
  };

  const verifyLandingInvite = async (code: string) => {
    const next = normalizeInviteCode(code);
    if (!isValidInviteCode(next)) {
      dropLandingInvite();
      setGateError(INVITE_UNRECOGNIZED);
      return false;
    }
    try {
      const view = await waitlistApi.checkInvite(next);
      if (isInviteAccepted(view)) {
        persistLandingInvite(next);
        setGateError("");
        return true;
      }
      dropLandingInvite();
      setGateError(inviteCheckMessage(view, INVITE_UNRECOGNIZED));
      return false;
    } catch (error) {
      dropLandingInvite();
      setGateError(errorMessage(error));
      return false;
    }
  };

  const enterQuiz = async () => {
    setQuizWarning("");
    await ensureQuestions();
    setAuthIntent("create");
    const draft = getQuizDraft();
    if (!draft || !Object.keys(draft.answers).length) {
      setQuestionIndex(0);
      setAnswers({});
    } else {
      setAnswers(draft.answers);
      setQuestionIndex(draft.questionIndex);
    }
    clearShareUrl();
    setStage("quiz");
  };

  const startQuiz = async () => {
    try {
      if (!demoActive) {
        const allowed = await verifyLandingInvite(inviteCodeRef.current);
        if (!allowed) return;
      }
      setGateError("");
      await enterQuiz();
    } catch (error) {
      setGateError(errorMessage(error));
    }
  };

  const beginFromReferral = () => startQuiz();

  const beginWithoutInvite = async () => {
    if (normalizeInviteCode(inviteCodeRef.current)) {
      await startQuiz();
      return;
    }
    setGateError("");
    dropLandingInvite();
    setInviteCode("");
    try {
      await enterQuiz();
    } catch (error) {
      setGateError(errorMessage(error));
    }
  };

  const beginResultRecovery = () => {
    setAuthIntent("recover");
    setEmail("");
    setOtp("");
    setOtpError("");
    setRecoveryError("");
    setStage("email");
  };

  const viewSavedResult = async () => {
    if (!userToken) return;
    try {
      applyWorkspace(await fetchWorkspace(userToken));
    } catch (error) {
      if (!handleUserApiError(error)) notifyError(localizeWaitlistMessage(errorMessage(error)));
    }
  };

  const signOutWaitlist = () => {
    resetAuth();
    setInviteCode("");
    setReferralOutcome(null);
    setGateError("");
    setStage("gate");
  };

  const submitEmail = async () => {
    setRecoveryError("");
    setOtpError("");
    const nextEmail = normalizeEmail(email);
    if (!isValidEmail(nextEmail)) {
      setRecoveryError(INVALID_EMAIL);
      return;
    }
    setEmail(nextEmail);
    try {
      if (authIntent === "create") {
        const check = await waitlistApi.checkEmailRegistered(nextEmail);
        if (check?.registered === true) {
          clearQuizDraft();
          answersRef.current = {};
          setAnswers({});
          setQuestionIndex(0);
          setOtp("");
          setOtpError("");
          setRecoveryError("");
          setAuthIntent("recover");
          setStage("email");
          return;
        }
      }
      await waitlistApi.sendEmailCode(nextEmail);
      setOtp("");
      const now = Date.now();
      setNowMs(now);
      setOtpResendAt(now + OTP_RESEND_SECONDS * 1000);
      setOtpExpireAt(now + OTP_EXPIRE_SECONDS * 1000);
      setStage("verify");
    } catch (error) {
      setRecoveryError(errorMessage(error));
    }
  };

  const resendCode = async () => {
    if (otpCooldown > 0) return;
    try {
      await waitlistApi.sendEmailCode(email);
      setOtpError("");
      const now = Date.now();
      setNowMs(now);
      setOtpResendAt(now + OTP_RESEND_SECONDS * 1000);
      setOtpExpireAt(now + OTP_EXPIRE_SECONDS * 1000);
    } catch (error) {
      setOtpError(errorMessage(error));
    }
  };

  const enterAfterLogin = async (token: string, isNewUser: boolean, resultId: string) => {
    setUserToken(token);
    setUserTokenState(token);

    if (isNewUser) {
      try {
        await waitlistApi.submitQuiz(buildQuizAnswers(questions, answersRef.current), token);
      } catch (error) {
        if (handleUserApiError(error)) return;
        setQuizWarning(errorMessage(error));
        await ensureQuestions();
        setStage("quiz");
        return;
      }
      clearQuizDraft();
      const info = await waitlistApi.getUserInfo(token);
      setUserInfo(info);
      setSessionEmail(info.email);
      applyWorkspace(await fetchWorkspace(token));
      return;
    }

    const info = await waitlistApi.getUserInfo(token);
    setUserInfo(info);
    setSessionEmail(info.email);
    if (resultId || info.submitted) {
      clearQuizDraft();
      applyWorkspace(await fetchWorkspace(token));
      return;
    }

    const localAnswers = buildQuizAnswers(questions, answersRef.current);
    if (questions.length && Object.keys(localAnswers).length === questions.length) {
      try {
        await waitlistApi.submitQuiz(localAnswers, token);
        clearQuizDraft();
        applyWorkspace(await fetchWorkspace(token));
        return;
      } catch (error) {
        if (handleUserApiError(error)) return;
        setQuizWarning(errorMessage(error));
      }
    }

    await ensureQuestions();
    setStage("quiz");
  };

  const resolveLoginInvite = () => {
    const typed = normalizeInviteCode(inviteCodeRef.current);
    if (isValidInviteCode(typed)) return typed;
    const stored = getLandingInvite();
    return isValidInviteCode(stored) ? stored : "";
  };

  const submitOtp = async () => {
    setOtpError("");
    const loginInvite = resolveLoginInvite();
    try {
      const login = await waitlistApi.login(email, otp, loginInvite || undefined);
      await enterAfterLogin(login.token, login.isNewUser, login.resultId);
    } catch (error) {
      if (handleUserApiError(error)) return;
      if (isWaitlistApiError(error) && error.message === INVITE_UNRECOGNIZED && loginInvite) {
        try {
          dropLandingInvite();
          setInviteCode("");
          const login = await waitlistApi.login(email, otp);
          await enterAfterLogin(login.token, login.isNewUser, login.resultId);
          return;
        } catch (retryError) {
          if (handleUserApiError(retryError)) return;
          setOtpError(errorMessage(retryError));
          return;
        }
      }
      setOtpError(errorMessage(error));
    }
  };

  const finishQuiz = async () => {
    if (userToken) {
      try {
        await waitlistApi.submitQuiz(buildQuizAnswers(questions, answersRef.current), userToken);
        clearQuizDraft();
        const info = await waitlistApi.getUserInfo(userToken);
        setUserInfo(info);
        applyWorkspace(await fetchWorkspace(userToken));
      } catch (error) {
        if (!handleUserApiError(error)) setQuizWarning(errorMessage(error));
      }
      return;
    }
    setAuthIntent("create");
    setStage("email");
  };

  const answerQuestion = async (optionId: string) => {
    if (!currentQuestion) return;
    const nextAnswers = { ...answers, [currentQuestion.questionId]: optionId };
    answersRef.current = nextAnswers;
    setAnswers(nextAnswers);
    if (questionIndex === questions.length - 1) {
      await finishQuiz();
      return;
    }
    setQuestionIndex((current) => current + 1);
  };

  const goBack = () => {
    if (questionIndex === 0) {
      setStage("gate");
      return;
    }
    setQuestionIndex((current) => current - 1);
  };

  const openCommunity = async (channel: CommunityChannel) => {
    const fallback = channel === "telegram" ? DEFAULT_COMMUNITY.telegram : DEFAULT_COMMUNITY.x;
    const href = resolveCommunityHref(
      channel === "telegram" ? communityLinks.telegram : communityLinks.x,
      fallback,
    );
    window.open(href, "_blank", "noopener,noreferrer");
    if (demoActive) {
      if (channel === "telegram") setTelegramOpened(true);
      else setXOpened(true);
      return;
    }
    if (!userToken) return;
    try {
      const result = await waitlistApi.completeCommunity(channel, userToken);
      setTelegramOpened(result.telegramCompleted === 1);
      setXOpened(result.xCompleted === 1);
      if (!areCommunityTasksDone(result) && !result.unlocked) return;
      const workspace = await fetchWorkspace(userToken);
      if (workspace.kind === "result") applyWorkspace(workspace);
    } catch (error) {
      if (!handleUserApiError(error)) notifyError(localizeWaitlistMessage(errorMessage(error)));
    }
  };

  const revealResult = async () => {
    if (demoActive) {
      await showDemoTarget("result");
      return;
    }
    if (!userToken) return;
    try {
      applyWorkspace(await fetchWorkspace(userToken));
    } catch (error) {
      if (!handleUserApiError(error)) notifyError(localizeWaitlistMessage(errorMessage(error)));
    }
  };

  const shareResult = async () => {
    if (!ownOutcome || !ownInviteCode) return;
    const shareUrl = new URL("https://twitter.com/intent/tweet");
    const shareName = localizedPersonaName(ownOutcome.persona);
    const shareRoast = localizedPersonaRoast(ownOutcome.persona);
    shareUrl.searchParams.set("text", `${t`My SmartX trader type is ${shareName}.`}${shareRoast ? `\n\n“${shareRoast}”` : ""}\n\n${t`Find yours in six questions.`}`);
    shareUrl.searchParams.set("url", makeInvitationUrl(ownInviteCode, true));
    window.open(shareUrl.toString(), "_blank", "noopener,noreferrer");
    if (!userToken || shareCompleted || demoActive) return;
    try {
      await waitlistApi.shareComplete(userToken);
      const nextRank = await waitlistApi.getRank(userToken);
      setShareCompleted(true);
      setRank(nextRank.rank);
    } catch (error) {
      if (!handleUserApiError(error)) notifyError(localizeWaitlistMessage(errorMessage(error)));
    }
  };

  const copyInvitation = async (code?: string) => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(makeInvitationUrl(code, true));
    setCopiedCode(code);
    window.setTimeout(() => setCopiedCode(null), 1400);
    } catch (error) {
      notifyError(
        errorMessage(error) === GENERIC_ERROR
          ? t`Couldn’t copy the invite link. Try again.`
          : localizeWaitlistMessage(errorMessage(error)),
      );
    }
  };

  const shareImageFeedback = (action: ShareImageAction, result: Exclude<ShareImageActionResult, "cancelled">) => {
    if (result === "clipboard") return t`Copied Success!`;
    if (result === "share") return t`Selection successful`;
    if (result === "download") return t`Image saved.`;
    if (result === "tab") return t`Image opened in a new tab. Long press to save.`;
    if (isIOS()) {
      return action === "copy" ? t`Long press the image and tap Copy.` : t`Long press the image and tap Save Image.`;
    }
    if (isAndroid()) {
      return action === "copy" ? t`Long press the image and tap Copy image.` : t`Long press the image and tap Download image.`;
    }
    return action === "copy" ? t`Long press the image to save or copy.` : t`Long press the image to save to your album.`;
  };

  const closeSharePreview = () => {
    setSharePreview((current) => {
      if (current?.url.startsWith("blob:")) URL.revokeObjectURL(current.url);
      return null;
    });
  };

  const applyShareResult = (action: ShareImageAction, result: ShareImageActionResult, blob: Blob) => {
    if (result === "cancelled") return;
    const tip = shareImageFeedback(action, result);
    if (result === "preview") {
      setSharePreview((current) => {
        if (current?.url.startsWith("blob:")) URL.revokeObjectURL(current.url);
        return { url: createImagePreviewUrl(blob), tip };
      });
    }
    notifyNotice(tip);
  };

  const runDownloadButtonAction = (card: RenderedResultCard) => {
    const fileName = shareFileName(card.filename);
    const pending = isMobileSharePlatform()
      ? copyShareImage(card.blob, fileName)
      : downloadShareImage(card.blob, fileName, card.href);
    return pending
      .then((result) => applyShareResult(isMobileSharePlatform() ? "copy" : "download", result, card.blob))
      .catch(() => notifyError(t`Couldn’t export the image. Try again.`));
  };

  const downloadResultCard = () => {
    const card = preparedCardsRef.current.story;
    if (card) {
      void runDownloadButtonAction(card);
      return;
    }

    if (!ownOutcome || exporting) {
      notifyNotice(t`Preparing…`);
      return;
    }

    setExporting(true);
    void renderResultCard(resultCardData(ownOutcome), "story")
      .then((rendered) => {
        setPreparedCards((current) => ({ ...current, story: rendered }));
        setExportError(false);
        return runDownloadButtonAction(rendered);
      })
      .catch(() => {
        setExportError(true);
        notifyError(t`Couldn’t export the image. Try again.`);
      })
      .finally(() => setExporting(false));
  };

  const onPreparedDownloadClick = (event: { preventDefault: () => void }) => {
    const card = preparedCardsRef.current.story;
    if (!card) {
      event.preventDefault();
      downloadResultCard();
      return;
    }

    if (isMobileSharePlatform()) {
      event.preventDefault();
      void runDownloadButtonAction(card);
      return;
    }

    notifyNotice(t`Image saved.`);
  };

  const inviteForm = (
    <>
      <label htmlFor="invite-code">
        <Trans>Invite Code</Trans>
      </label>
      <div className={styles.inlineField}>
        <input
          id="invite-code"
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          maxLength={8}
          pattern="[a-z0-9]{8}"
          placeholder={t`Please enter the invitation code.`}
          value={inviteCode}
          onChange={(event) => {
            const next = sanitizeInviteCodeInput(event.target.value);
            setInviteCode(next);
            setGateError("");
            const storedInvite = getLandingInvite();
            if (isValidInviteCode(next)) {
              persistLandingInvite(next);
            } else if (storedInvite && storedInvite !== next) {
              dropLandingInvite();
            }
          }}
          aria-invalid={Boolean(gateError)}
          aria-describedby={gateError ? "invite-error" : undefined}
        />
        <WaitlistButton
          className={`${styles.primaryButton} ${styles.inviteEntryButton}`}
          type="submit"
          disabled={!inviteReady}
          onAction={() => startQuiz()}
        >
          <Trans>Start with invite</Trans>
        </WaitlistButton>
      </div>
      {gateError ? <small className={styles.formError} id="invite-error" role="alert">{localizeWaitlistMessage(gateError)}</small> : null}
    </>
  );

  return (
    <WaitlistActionScope>
    <main className={styles.page} data-stage={stage} data-referral={Boolean(referralOutcome)}>
      {demoVisible ? (
        <WaitlistDemoControl
          className={styles.demoControl}
          value={demoTarget}
          questionCount={questions.length}
          onSelect={(target) => { void showDemoTarget(target); }}
          onExit={exitDemo}
        />
      ) : null}
      <a className={styles.skipLink} href="#waitlist-content">
        <Trans>Skip to waitlist</Trans>
      </a>
      <div className={styles.ambientBackdrop} aria-hidden="true">
        {stage === "gate" && !referralOutcome ? (
          <div className={styles.gateBackdrop}>
            <Image src="/assets/waitlist/waitlist-intro.png" alt="" fill sizes="70vw" priority />
      </div>
        ) : stage === "email" || stage === "verify" || stage === "unlock" ? (
          <div className={styles.flowBackdrop}>
            <Image src="/assets/waitlist/waitlist-verification.png" alt="" fill sizes="50vw" priority />
          </div>
        ) : (
          <Image src="/assets/consumer-network/hero-product.png" alt="" fill sizes="100vw" priority />
        )}
      </div>
      <ConsumerHeader active="waitlist" placement="page" />

      <section className={styles.stage} id="waitlist-content" aria-live="polite">
        {stage === "boot" && (
          <div className={styles.formStage}>
            <span className={styles.eyebrow}>
              <Trans>Waitlist</Trans>
            </span>
            <h1>
              <Trans>Loading your session.</Trans>
            </h1>
            <p>
              <Trans>Checking invite, result, and sign-in state.</Trans>
            </p>
          </div>
        )}

        {stage === "gate" && referralOutcome && (
          <div className={styles.resultStage} data-shared-result="true">
            <PersonaPoster outcome={referralOutcome} />
            <aside className={`${styles.resultPanel} ${styles.referralResultPanel}`}>
              <span className={styles.eyebrow}>
                <Trans>A result was shared with you</Trans>
              </span>
              <h1>
                <Trans>
                  A friend trades like{" "}
                  <span className={styles.referralPersona}>
                    {localizedPersonaName(referralOutcome.persona)}.
                  </span>
                </Trans>
              </h1>
              <p>
                <Trans>Different score, same type—or something else entirely? Six decisions reveal how you trade when it gets real.</Trans>
              </p>
              {loggedIn && (
                <AccountSession
                  email={verifiedEmail}
                  label={t`Verified as`}
                  place="copy"
                  onSignOut={signOutWaitlist}
                />
              )}
              {hasOwnResult ? (
                <div className={styles.referralReturn}>
                  <WaitlistButton className={styles.primaryButton} onAction={viewSavedResult}>
                    <Trans>View my result</Trans>
                  </WaitlistButton>
                  <small>
                    <Trans>Your result is saved as {savedPersonaName}.</Trans>
                  </small>
            </div>
              ) : loggedIn ? (
                <WaitlistButton className={styles.primaryButton} onAction={beginFromReferral}>
                  <Trans>Find my trader type</Trans>
                </WaitlistButton>
              ) : (
                <>
                  <WaitlistButton className={styles.primaryButton} onAction={beginFromReferral}>
                    <Trans>Find my trader type</Trans>
                  </WaitlistButton>
                  <WaitlistButton className={styles.textButton} onClick={beginResultRecovery}>
                    <Trans>Already tested? View my result</Trans>
                  </WaitlistButton>
                  {gateError && (
                    <div className={styles.referralError} role="alert">
                      <small>{localizeWaitlistMessage(gateError)}</small>
                    </div>
                  )}
                </>
              )}
            </aside>
          </div>
        )}

        {stage === "gate" && !referralOutcome && (
          <div className={styles.gateStage}>
            <div className={styles.gateCopy}>
              <h1>
                <Trans>How do you trade<br />{" "}when it gets <em>real?</em></Trans>
              </h1>
              <p>
                <Trans>Six decisions reveal your risk, signal, and social instincts.</Trans>
              </p>
            </div>
            <form className={styles.gateForm} onSubmit={(event) => event.preventDefault()}>
              <WaitlistButton
                className={`${styles.primaryButton} ${styles.naturalEntryButton}`}
                type="button"
                onAction={beginWithoutInvite}
              >
                <Trans>Start the test</Trans>
              </WaitlistButton>
              <small className={styles.naturalEntryHint}>
                <Trans>No invite needed</Trans>
              </small>
              <div className={styles.inviteChoice}>
                <span><Trans>Have an invite code?</Trans></span>
              </div>
              <div className={styles.inviteCodeGroup}>
                {inviteForm}
              </div>
              <div className={styles.gateFormMeta}>
                <WaitlistButton className={styles.textButton} onClick={beginResultRecovery}>
                  <Trans>Already tested? View my result</Trans>
                </WaitlistButton>
              </div>
            </form>
          </div>
        )}

        {stage === "quiz" && !currentQuestion && (
          <div className={styles.formStage}>
            <span className={styles.eyebrow}>
              <Trans>Waitlist</Trans>
            </span>
            <h1>
              <Trans>Couldn’t load the test.</Trans>
            </h1>
            <p>
              <Trans>The questions didn’t come through. Check your connection and try again.</Trans>
            </p>
            <form onSubmit={(event) => event.preventDefault()}>
              <WaitlistButton className={styles.primaryButton} onClick={() => setStage("gate")}>
                <Trans>Back to start</Trans>
              </WaitlistButton>
            </form>
              </div>
        )}

        {stage === "quiz" && currentQuestion && (
          <div className={styles.quizStage}>
            {loggedIn && (
              <AccountSession
                email={verifiedEmail}
                label={t`Verified as`}
                place="scene"
                onSignOut={signOutWaitlist}
              />
            )}
            <div className={styles.quizLayout}>
              <QuestionArtwork question={currentQuestion} questions={questions} />
              <div className={styles.questionPanel}>
                <div className={styles.quizTopline}>
                  <WaitlistButton type="button" onClick={goBack}>
                    <Image src="/assets/waitlist/arrow-right.svg" alt="" width={16} height={16} aria-hidden="true" />
                    <Trans>Back</Trans>
                  </WaitlistButton>
                  <p>
                    <Trans>Question</Trans>{" "}<strong>{questionIndex + 1}</strong>{" / "}{questions.length}
                  </p>
                </div>
                <div
                  className={styles.progress}
                  aria-label={t`Question ${questionIndex + 1} of ${questions.length}`}
                  style={{
                    "--quiz-progress": `${questionIndex === 0 ? 0 : ((questionIndex + 1) / questions.length) * 100}%`,
                  } as CSSProperties}
                >
                  <i aria-hidden="true" />
                </div>
                <h1>{localizedQuestionPrompt(currentQuestion)}</h1>
                <div className={styles.optionList}>
                  {currentQuestion.options.map((option) => {
                    const selected = answers[currentQuestion.questionId] === option.optionId;
                    return (
                      <WaitlistButton
                        type="button"
                        data-selected={selected}
                        key={option.optionId}
                        onClick={() => {
                          void answerQuestion(option.optionId);
                        }}
                      >
                        <Image
                          src={selected ? "/assets/waitlist/checkbox-selected.svg" : "/assets/waitlist/checkbox.svg"}
                          alt=""
                          width={26}
                          height={26}
                          aria-hidden="true"
                        />
                        <span>{localizedOptionLabel(option)}</span>
                      </WaitlistButton>
                    );
                  })}
                </div>
                {quizWarning ? (
                  <div className={styles.quizWarning} role="alert">
                    <small>{localizeWaitlistMessage(quizWarning)}</small>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}

        {stage === "email" && (
          <div className={styles.formStage}>
            <span className={styles.eyebrow}>{authIntent === "recover" ? t`Already tested?` : t`Your result is ready`}</span>
            <h1>{authIntent === "recover" ? t`Find your result.` : t`Save your result.`}</h1>
            <p>{authIntent === "recover" ? t`Enter the email you used. We’ll send a six-digit code.` : t`Bind an email to save your result and join the waitlist.`}</p>
            <form onSubmit={(event) => event.preventDefault()}>
              <label htmlFor="waitlist-email">
                <Trans>Email address</Trans>
              </label>
              <div className={styles.inlineField}>
                <input
                  id="waitlist-email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder={t`you@domain.com`}
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setRecoveryError("");
                  }}
                  aria-invalid={Boolean(recoveryError)}
                  required
                />
                <WaitlistButton className={styles.primaryButton} type="submit" onAction={submitEmail}>
                  {authIntent === "recover" ? t`Send code` : t`Continue`}
                </WaitlistButton>
              </div>
              <small className={styles.formHint}>
                <Trans>We’ll use this to save your result and send waitlist updates.</Trans>
              </small>
              {recoveryError ? <small className={styles.formError} role="alert">{localizeWaitlistMessage(recoveryError)}</small> : null}
              {authIntent === "recover" && (
                <WaitlistButton className={styles.recoveryBack} onClick={() => { setRecoveryError(""); setStage("gate"); }}>
                  <Trans>← Back</Trans>
                </WaitlistButton>
              )}
            </form>
          </div>
        )}

        {stage === "verify" && (
          <div className={styles.formStage}>
            <span className={styles.eyebrow}>
              <Trans>Verification</Trans>
            </span>
            <h1>
              <Trans>Check your inbox</Trans>
            </h1>
            <p>
              <Trans>Enter the code sent to <b>{email}</b>.</Trans>
            </p>
            <form onSubmit={(event) => event.preventDefault()}>
              <label htmlFor="waitlist-otp">
                <Trans>Verification code</Trans>
              </label>
              <div className={styles.inlineField}>
                <div className={styles.otpField}>
                  <input
                    className={styles.otpInput}
                    id="waitlist-otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]{6}"
                    maxLength={6}
                    value={otp}
                    placeholder={t`Six-digit code`}
                    onChange={(event) => { setOtp(event.target.value.replace(/\D/g, "").slice(0, 6)); setOtpError(""); }}
                    aria-invalid={Boolean(otpError)}
                    aria-describedby="otp-note"
                    autoFocus
                    required
                  />
                  <div className={styles.otpBoxes} aria-hidden="true">
                    {Array.from({ length: 6 }, (_, index) => (
                      <span
                        key={index}
                        data-active={index === Math.min(otp.length, 5) && otp.length < 6 ? "true" : undefined}
                        data-filled={otp[index] ? "true" : undefined}
                      >
                        {otp[index] || ""}
                      </span>
                    ))}
              </div>
                </div>
                <WaitlistButton className={styles.primaryButton} type="submit" onAction={submitOtp}>
                  <Trans>Continue</Trans>
                </WaitlistButton>
              </div>
              <small id="otp-note" className={styles.otpStatus} aria-live="polite">
                {otpExpiresIn > 0 ? t`The code expires in ${formatClock(otpExpiresIn)}.` : t`The code has expired. Resend to get a new one.`}
              </small>
              {otpError ? <small className={styles.formError} id="otp-error" role="alert">{localizeWaitlistMessage(otpError)}</small> : null}
              <div className={styles.formMeta}>
                <WaitlistButton type="button" onClick={() => setStage("email")}>
                  <Trans>Change Email</Trans>
                </WaitlistButton>
                <WaitlistButton type="button" disabled={otpCooldown > 0} onAction={resendCode}>
                  <Trans>Resend Code</Trans>
                </WaitlistButton>
              </div>
            </form>
          </div>
        )}

        {stage === "unlock" && (
          <div className={styles.unlockStage}>
            <span className={styles.eyebrow}>
              <Trans>One last step</Trans>
            </span>
            <h1>
              <Trans>Unlock your result</Trans>
            </h1>
            <p>
              <Trans>Join the SmartX community and follow product updates before your trader type is revealed.</Trans>
            </p>
            <AccountSession
              email={verifiedEmail}
              label={t`Signed in as`}
              onSignOut={signOutWaitlist}
            />
            <div className={styles.unlockTasks}>
              <WaitlistButton type="button" aria-pressed={telegramOpened} data-complete={telegramOpened} onAction={() => openCommunity("telegram")}>
                <Image src="/assets/waitlist/telegram.svg" alt="" width={32} height={32} aria-hidden="true" />
                <span><b><Trans>Join Telegram</Trans></b><small><Trans>Enter the SmartX community</Trans></small></span>
                <strong>
                  {telegramOpened ? t`Completed` : <><Trans>Open</Trans><Image src="/assets/waitlist/arrow-right.svg" alt="" width={24} height={24} aria-hidden="true" /></>}
                </strong>
              </WaitlistButton>
              <WaitlistButton type="button" aria-pressed={xOpened} data-complete={xOpened} onAction={() => openCommunity("x")}>
                <Image src="/assets/waitlist/x.svg" alt="" width={32} height={32} aria-hidden="true" />
                <span><b><Trans>Follow SmartX on X</Trans></b><small><Trans>Follow product updates</Trans></small></span>
                <strong>
                  {xOpened ? t`Completed` : <><Trans>Open</Trans><Image src="/assets/waitlist/arrow-right.svg" alt="" width={24} height={24} aria-hidden="true" /></>}
                </strong>
              </WaitlistButton>
            </div>
            <WaitlistButton className={styles.primaryButton} disabled={!telegramOpened || !xOpened} onAction={revealResult}>
              <Trans>Reveal my result</Trans>
            </WaitlistButton>
            <small>
              <Trans>Both steps are required to continue.</Trans>
            </small>
          </div>
        )}

        {stage === "result" && ownOutcome && (
          <div className={styles.resultStage}>
            <PersonaPoster outcome={ownOutcome} />
            <aside className={styles.resultPanel}>
              <AccountSession email={verifiedEmail} label={t`Signed in as`} onSignOut={signOutWaitlist} />
              <div className={styles.rankBlock} data-boosted={shareCompleted}>
                <span>
                  <Trans>Waitlist rank</Trans>
                </span>
                <strong key={rank ?? "pending"}>#{(rank ?? 0).toLocaleString("en-US")}</strong>
                <div className={styles.rankRewards}>
                  <div data-applied={shareCompleted}>
                    <span>{shareCompleted ? t`Share recorded` : t`First result share`}</span>
                    <b>
                      <Trans>+500 priority</Trans>
                    </b>
                  </div>
                  <div data-applied={friendRewardApplied}>
                    <span>
                      {friendRewardApplied
                        ? t`Each verified friend (+${verifiedFriends})`
                        : t`Each verified friend`}
                    </span>
                    <b>
                      <Trans>+{friendPriority.toLocaleString("en-US")} priority</Trans>
                    </b>
                  </div>
                </div>
                <small>
                  <Trans>Priority improves your score; rank updates against the live waitlist.</Trans>
                </small>
                <div className={styles.resultActions}>
                  {preparedCards.story ? (
                    <a
                      className={styles.downloadButton}
                      href={preparedCards.story.href}
                      download={`${shareFileName(preparedCards.story.filename)}.${SHARE_IMAGE_EXT}`}
                      onClick={onPreparedDownloadClick}
                    >
                      <Image src="/assets/waitlist/download.svg" alt="" width={20} height={20} aria-hidden="true" />
                      <Trans>Download</Trans>
                    </a>
                  ) : (
                    <button
                      type="button"
                      className={styles.downloadButton}
                      disabled={exporting || !exportError}
                      title={exportError ? t`Couldn’t export the image. Try again.` : undefined}
                      onClick={downloadResultCard}
                    >
                      <Image src="/assets/waitlist/download.svg" alt="" width={20} height={20} aria-hidden="true" />
                      {exportError ? t`Download` : t`Preparing…`}
                    </button>
                  )}
                  <WaitlistButton className={styles.shareButton} disabled={!ownInviteCode} onAction={shareResult}>
                    {shareCompleted ? t`Share again` : t`Share result`}
                  </WaitlistButton>
                </div>
              </div>
              <section className={styles.invitationDeck} aria-label={t`Your invitation link`}>
                <header>
                  <div>
                    <span>
                      <Trans>Your invite link</Trans>
                    </span>
                    <p>
                      <Trans>Share one link with every friend you invite.</Trans>
                    </p>
                  </div>
                  {verifiedFriends > 0 ? (
                    <p className={styles.inviteCount}>
                      {t`${verifiedFriends} friends joined via your invite.`}
                    </p>
                  ) : null}
                </header>
                <div className={styles.primaryInviteCard} data-empty={ownInviteCode ? undefined : "true"}>
                  <div>
                    <span><Trans>Invite code</Trans></span>
                    <strong>{ownInviteCode || t`Invite link is being prepared`}</strong>
                  </div>
                  <WaitlistButton
                        type="button"
                    lock={false}
                    disabled={!ownInviteCode}
                    onClick={() => { void copyInvitation(ownInviteCode); }}
                  >
                    <Image src="/assets/waitlist/copy.svg" alt="" width={20} height={20} aria-hidden="true" />
                    {copiedCode === ownInviteCode ? t`Copied` : t`Copy link`}
                  </WaitlistButton>
                </div>
              </section>
            </aside>
          </div>
        )}
      </section>
    </main>
    {sharePreview ? (
      <div className={styles.sharePreview} onClick={closeSharePreview}>
        <p>{sharePreview.tip}</p>
        {/* Native img so mobile long-press copy/save works. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={sharePreview.url} alt={t`Share image`} onClick={(event) => event.stopPropagation()} />
        <WaitlistButton type="button" lock={false} onAction={closeSharePreview}>
          <Trans>Close</Trans>
        </WaitlistButton>
      </div>
    ) : null}
    <div className={styles.artPrefetch} aria-hidden="true">
      {QUIZ_ART_SRCS.map((src) => (
        // Prefetch into the HTTP cache before the quiz mounts.
        // eslint-disable-next-line @next/next/no-img-element
        <img key={src} src={src} alt="" />
      ))}
    </div>
    </WaitlistActionScope>
  );
}
