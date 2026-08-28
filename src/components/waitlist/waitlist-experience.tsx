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
import { notifyError } from "@/components/site/app-notice";
import { isValidEmail, isValidInviteCode, normalizeEmail, normalizeInviteCode, sanitizeInviteCodeInput, waitlistApi } from "@/lib/waitlist/api";
import {
  hydrateQuestions,
  localizedPersonaName,
  localizedPersonaRoast,
  mapCardToOutcome,
  PERSONAS_BY_CODE,
} from "@/lib/waitlist/persona";
import { i18n } from "@/lingui";
import {
  decideWaitlistEntry,
  isOwnResultAvailable,
  rememberWaitlistNotice,
  shareQueryPresent,
  takeWaitlistNotice,
  waitlistPathWithoutShare,
} from "@/lib/waitlist/routing";
import {
  clearQuizDraft,
  clearQuizSession,
  clearWaitlistSession,
  getQuizDraft,
  getQuizSession,
  getSessionTokenForInvite,
  getUserToken,
  setQuizDraft,
  setQuizSession,
  setUserToken,
} from "@/lib/waitlist/session";
import {
  type AuthIntent,
  type CommunityChannel,
  type InviteItem,
  type Outcome,
  type QuizQuestion,
  type ResultCard,
  type UserInfo,
  type WaitlistStage,
  isMissingUserError,
  isUnlockedResult,
  isUserApiError,
  isUserInfoError,
  isWaitlistApiError,
} from "@/lib/waitlist/types";

import { WaitlistActionScope, WaitlistButton } from "./waitlist-button";
import { WaitlistDemoControl, type WaitlistDemoTarget } from "./waitlist-demo-control";

import { renderResultCard, type RenderedResultCard, type ResultCardFormat } from "./result-card-export";
import styles from "./waitlist.module.css";

const WAITLIST_URL = "https://smartx.io/waitlist/";
const PRIORITY_PER_FRIEND = 500;
const PRIORITY_FRIEND_CAP = 5000;
const NO_SAVED_RESULT = "No saved result is linked to this email. Use an invite to take the test.";
const INVALID_EMAIL = "Please enter a valid email address.";
const GENERIC_ERROR = "Something went wrong. Please try again.";
const INVITE_UNRECOGNIZED = "Invite code not recognized. Check the code and try again.";
const INVITE_CLAIMED = "This invite has already been claimed. Ask for another one.";
const INVITE_BUSY = "This invite is being used in another session. Try again shortly.";
const INVITE_EXPIRED = "This invite has expired. Ask for another one.";
const RESERVE_EXPIRED_API = "Invite reservation expired. Reserve again.";
const RESERVE_LIMIT_API = "Invite reservation time limit reached.";
const RENEW_INTERVAL_MS = 90_000;
const INVITES_POLL_MS = 10_000;
const OTP_RESEND_SECONDS = 60;
const OTP_EXPIRE_SECONDS = 600;
const DEFAULT_COMMUNITY = {
  telegram: "https://t.me/SmartX_Community",
  x: "https://x.com/SmartXTerminal",
};

const DEMO_OUTCOME: Outcome = {
  resultId: "demo-result",
  persona: PERSONAS_BY_CODE.SIG,
  poles: ["DEGEN", "DATA", "PACK"],
  stats: { conviction: 86, instinct: 72, resilience: 64 },
  bestMatch: PERSONAS_BY_CODE.CHN,
  rival: PERSONAS_BY_CODE.DOC,
};

// 状态与分支逻辑始终使用英文规范文案（与 API 返回值精确比较）；
// 只在渲染时经此映射表转成当前语言，未知文案原样透出。
const WAITLIST_MESSAGE_L10N: Record<string, MessageDescriptor> = {
  [NO_SAVED_RESULT]: msg`No saved result is linked to this email. Use an invite to take the test.`,
  [INVALID_EMAIL]: msg`Please enter a valid email address.`,
  [GENERIC_ERROR]: msg`Something went wrong. Please try again.`,
  [INVITE_UNRECOGNIZED]: msg`Invite code not recognized. Check the code and try again.`,
  [INVITE_CLAIMED]: msg`This invite has already been claimed. Ask for another one.`,
  [INVITE_BUSY]: msg`This invite is being used in another session. Try again shortly.`,
  [INVITE_EXPIRED]: msg`This invite has expired. Ask for another one.`,
  [RESERVE_LIMIT_API]: msg`Invite reservation time limit reached.`,
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
      invitations: InviteItem[];
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
  if (message === RESERVE_EXPIRED_API || message === INVITE_EXPIRED) return INVITE_EXPIRED;
  if (message === INVITE_UNRECOGNIZED || message === INVITE_CLAIMED || message === INVITE_BUSY) return message;
  return message;
}

function errorMessage(error: unknown) {
  if (isWaitlistApiError(error)) return formatWaitlistCopy(error.message) || GENERIC_ERROR;
  return GENERIC_ERROR;
}

function isUnauthorized(error: unknown) {
  return isWaitlistApiError(error) && error.code === 401;
}

function shouldPurgeOnUserApiError(error: unknown) {
  if (isUnauthorized(error)) return true;
  if (isUserInfoError(error)) return true;
  if (isUserApiError(error) && isMissingUserError(error)) return true;
  return isUserApiError(error) && error.code === 500;
}

function makeInvitationUrl(code?: string, resultId?: string, useCurrentOrigin = false) {
  const base = useCurrentOrigin && typeof window !== "undefined" ? new URL("/waitlist/", window.location.origin).toString() : WAITLIST_URL;
  const url = new URL(base);
  if (resultId) url.searchParams.set("result", resultId);
  if (code) url.searchParams.set("invite", code);
  return url.toString();
}

function reservationToken(data: { sessionToken?: string; token?: string } | null | undefined) {
  return (data?.sessionToken || data?.token || "").trim();
}

function publicShareCard(data: { hidden?: boolean; card?: ResultCard | null } | null) {
  if (!data || data.hidden || !data.card) return null;
  return data.card;
}

async function fetchWorkspace(token: string): Promise<Workspace> {
  const [result, community] = await Promise.all([
    waitlistApi.getMyResult(token),
    waitlistApi.getCommunityInfo(token),
  ]);
  const links = DEFAULT_COMMUNITY;
  const telegramCompleted = community.telegramCompleted === 1;
  const xCompleted = community.xCompleted === 1;

  const toResultWorkspace = async (card: ResultCard & { rank: number; shareCompleted: number }) => {
    const [invites, friends] = await Promise.all([
      waitlistApi.getMyInvites(token),
      waitlistApi.getInviteFriends(token),
    ]);
    return {
      kind: "result" as const,
      outcome: mapCardToOutcome(card),
      rank: card.rank,
      shareCompleted: card.shareCompleted === 1,
      verifiedFriends: friends.total,
      invitations: invites.list,
      links,
      telegramCompleted,
      xCompleted,
    };
  };

  if (isUnlockedResult(result)) return toResultWorkspace(result);

  if (telegramCompleted && xCompleted) {
    const retry = await waitlistApi.getMyResult(token);
    if (isUnlockedResult(retry)) return toResultWorkspace(retry);
  }

  return { kind: "unlock", links, telegramCompleted, xCompleted };
}

function QuestionArtwork({ question }: { question: QuizQuestion }) {
  return (
    <div className={styles.questionArtwork}>
      <Image src={question.artSrc} alt={question.artAlt} fill sizes="(max-width: 880px) 100vw, 50vw" priority />
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
  preparedCards,
  exportError,
  downloads = true,
}: {
  outcome: Outcome;
  preparedCards?: Partial<Record<ResultCardFormat, RenderedResultCard>>;
  exportError?: boolean;
  downloads?: boolean;
}) {
  useLingui();

  return (
    <article className={styles.personaPoster}>
      <div className={styles.posterIdentity}>
        <div className={styles.posterPoles}>
          {outcome.poles.map((pole) => <span key={pole}>{pole}</span>)}
        </div>
        <h2>{localizedPersonaName(outcome.persona)}</h2>
      </div>
      <div className={styles.personaArt}>
        <Image
          src={outcome.persona.artSrc}
          alt={outcome.persona.artAlt}
          fill
          sizes="(max-width: 880px) 90vw, 610px"
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
      {downloads && (
        <section className={styles.cardDownloads} aria-label={t`Download result card`}>
          <span><Trans>Download result</Trans></span>
          <div>
            {preparedCards?.story ? <a href={preparedCards.story.href} download={preparedCards.story.filename}><Image src="/assets/waitlist/download.svg" alt="" width={20} height={20} aria-hidden="true" /><Trans>Story</Trans> <small>1080 × 1920</small></a> : <span>{exportError ? t`Unavailable` : t`Preparing…`}</span>}
            {preparedCards?.og ? <a href={preparedCards.og.href} download={preparedCards.og.filename}><Image src="/assets/waitlist/download.svg" alt="" width={20} height={20} aria-hidden="true" />X / TG <small>1200 × 630</small></a> : <span>{exportError ? t`Unavailable` : t`Preparing…`}</span>}
          </div>
        </section>
      )}
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
  const [sessionToken, setSessionTokenState] = useState("");
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
  const renewalCappedRef = useRef(false);
  const [reserveWarning, setReserveWarning] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [shareCompleted, setShareCompleted] = useState(false);
  const [verifiedFriends, setVerifiedFriends] = useState(0);
  const [invitations, setInvitations] = useState<InviteItem[]>([]);
  const [rank, setRank] = useState<number | null>(null);
  const [preparedCards, setPreparedCards] = useState<Partial<Record<ResultCardFormat, RenderedResultCard>>>({});
  const [exportError, setExportError] = useState(false);
  const [demoActive, setDemoActive] = useState(() => shareParams.get("demo") === "1");
  const [demoTarget, setDemoTarget] = useState<WaitlistDemoTarget>("gate");

  const loggedIn = Boolean(userToken && userInfo);
  const demoVisible = shareParams.get("demo") === "1";
  const hasOwnResult = isOwnResultAvailable({ loggedIn, submitted: Boolean(userInfo?.submitted && userInfo.resultId) });
  const inviteReady = isValidInviteCode(inviteCode);
  const savedPersona = ownOutcome?.persona ?? PERSONAS_BY_CODE[userInfo?.personaId ?? ""];
  const savedPersonaName = savedPersona ? localizedPersonaName(savedPersona) : t`your trader type`;
  const currentQuestion = questions[questionIndex];
  const primaryInvitation = invitations[0] ?? null;
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
      setInvitations(workspace.invitations);
      setStage("result");
      return;
    }
    setVerifiedFriends(0);
    setStage("unlock");
  };

  const persistReservation = (reserved: { sessionToken?: string; token?: string; inviteCode?: string }) => {
    const token = reservationToken(reserved);
    const code = normalizeInviteCode(reserved.inviteCode || inviteCodeRef.current);
    if (!token || !isValidInviteCode(code)) return false;
    setQuizSession({ sessionToken: token, inviteCode: code });
    setSessionTokenState(token);
    setInviteCode(code);
    return true;
  };

  const dropReservation = () => {
    clearQuizSession();
    setSessionTokenState("");
  };

  const resetAuth = () => {
    clearWaitlistSession();
    setUserTokenState("");
    setSessionTokenState("");
    setUserInfo(null);
    setOwnOutcome(null);
    setInvitations([]);
    setRank(null);
    setShareCompleted(false);
    setVerifiedFriends(0);
    setSessionEmail("");
    setEmail("");
    setOtp("");
    setTelegramOpened(false);
    setXOpened(false);
    setAnswers({});
    setQuestionIndex(0);
  };

  const purgeWaitlistClient = (notice = "") => {
    resetAuth();
    setReferralOutcome(null);
    setInviteCode("");
    setGateError(notice);
    setReserveWarning("");
    setPreparedCards({});
    setExportError(false);
    setAuthIntent("create");
    setOtpError("");
    setRecoveryError("");
    clearShareUrl({ hard: shareQueryPresent(), notice });
    setStage("gate");
  };

  const handleUserApiError = (error: unknown) => {
    if (!shouldPurgeOnUserApiError(error)) return false;
    purgeWaitlistClient(errorMessage(error));
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
      const resultId = params.get("result")?.trim() ?? "";
      const urlInviteRaw = (params.get("invite") ?? "").trim();
      const urlInvite = normalizeInviteCode(urlInviteRaw);
      const shareEntry = Boolean(resultId || urlInviteRaw);
      const storedUserToken = getUserToken();
      const storedSession = getQuizSession();
      const quizDraft = getQuizDraft();

      let invite = urlInvite;
      if (urlInvite && storedSession?.inviteCode && storedSession.inviteCode !== urlInvite) {
        clearQuizSession();
      } else if (urlInvite && storedSession?.sessionToken && !storedSession.inviteCode) {
        setQuizSession({ sessionToken: storedSession.sessionToken, inviteCode: urlInvite });
      } else if (!urlInvite && storedSession?.inviteCode) {
        invite = storedSession.inviteCode;
      }

      if (invite) setInviteCode(invite);
      const matchingSession = getSessionTokenForInvite(invite);
      if (matchingSession) setSessionTokenState(matchingSession);
      if (quizDraft) {
        setAnswers(quizDraft.answers);
        setQuestionIndex(quizDraft.questionIndex);
      }

      const resumeInProgress = Boolean(matchingSession) && !storedUserToken;
      const [questionsResult, infoResult, publicResult, inviteCardResult, inviteStatusResult] = await Promise.allSettled([
        waitlistApi.getQuestions().then((data) => hydrateQuestions(data.questions)),
        storedUserToken ? waitlistApi.getUserInfo(storedUserToken) : Promise.resolve(null),
        resultId && !resumeInProgress ? waitlistApi.getPublicResult(resultId) : Promise.resolve(null),
        shareEntry && isValidInviteCode(urlInvite) && !resumeInProgress ? waitlistApi.getInviterCard(urlInvite) : Promise.resolve(null),
        shareEntry && isValidInviteCode(urlInvite) && !resumeInProgress ? waitlistApi.checkInvite(urlInvite) : Promise.resolve(null),
      ]);

      if (cancelled) return;

      if (questionsResult.status === "fulfilled") setQuestions(questionsResult.value);

      let info: UserInfo | null = null;
      if (infoResult.status === "fulfilled") {
        info = infoResult.value;
      } else if (storedUserToken) {
        purgeWaitlistClient(errorMessage(infoResult.reason));
        return;
      }

      if (info && storedUserToken) {
        setUserTokenState(storedUserToken);
        setUserInfo(info);
        setSessionEmail(info.email);
        clearQuizSession();
        setSessionTokenState("");
      }

      if (publicResult.status === "rejected") {
        clearShareUrl({
          hard: true,
          notice: errorMessage(publicResult.reason),
        });
        setStage("gate");
        return;
      }

      const friendCard =
        (publicResult.status === "fulfilled" ? publicShareCard(publicResult.value) : null) ??
        (inviteCardResult.status === "fulfilled" ? inviteCardResult.value : null);
      if (friendCard) setReferralOutcome(mapCardToOutcome(friendCard));

      const inviteView = inviteStatusResult.status === "fulfilled" ? inviteStatusResult.value : null;
      const ownReservation = Boolean(matchingSession) && inviteView?.status === 1;
      const resumeSession = Boolean(matchingSession) && !(info?.submitted && info.resultId) && (inviteView?.status === 0 || inviteView?.status === 1 || !inviteView);

      if (inviteStatusResult.status === "rejected") {
        setGateError(errorMessage(inviteStatusResult.reason));
      } else if (inviteView && inviteView.status !== 0 && !ownReservation) {
        setGateError(formatWaitlistCopy(inviteView.message));
        if (matchingSession && (inviteView.status === 2 || inviteView.status === 3)) dropReservation();
      }

      const route = decideWaitlistEntry({
        hasFriendCard: Boolean(friendCard),
        loggedIn: Boolean(info && storedUserToken),
        submitted: Boolean(info?.submitted && info.resultId),
        unlocked: Boolean(info?.unlocked),
        hasQuizSession: resumeSession,
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
        const [invites, friends, result] = await Promise.all([
          waitlistApi.getMyInvites(userToken),
          waitlistApi.getInviteFriends(userToken),
          waitlistApi.getMyResult(userToken),
        ]);
        setInvitations(invites.list);
        setVerifiedFriends(friends.total);
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

  const syncReservation = async () => {
    const code = inviteCodeRef.current;
    if (!isValidInviteCode(code) || renewalCappedRef.current) return;
    try {
      const renewed = await waitlistApi.renewReserve(code);
      if (reservationToken(renewed)) persistReservation({ ...renewed, inviteCode: code });
      setReserveWarning("");
    } catch (error) {
      if (isWaitlistApiError(error) && error.message === RESERVE_LIMIT_API) {
        renewalCappedRef.current = true;
        setReserveWarning(errorMessage(error));
        return;
      }
      if (isWaitlistApiError(error) && error.message === RESERVE_EXPIRED_API) {
        try {
          persistReservation({ ...(await waitlistApi.reserveInvite(code)), inviteCode: code });
          setReserveWarning("");
        } catch (reserveError) {
          dropReservation();
          setReserveWarning(errorMessage(reserveError));
        }
        return;
      }
      setReserveWarning(errorMessage(error));
    }
  };
  const syncReservationRef = useRef(syncReservation);
  syncReservationRef.current = syncReservation;

  useEffect(() => {
    if (stage !== "quiz") return;
    const timer = window.setInterval(() => {
      void syncReservationRef.current();
    }, RENEW_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [stage]);

  useEffect(() => {
    if (stage !== "result" || !ownOutcome) return;
    let disposed = false;
    let rendered: RenderedResultCard[] = [];
    setPreparedCards({});
    setExportError(false);
    const data = {
      name: localizedPersonaName(ownOutcome.persona),
      code: ownOutcome.persona.mark,
      roast: localizedPersonaRoast(ownOutcome.persona),
      artSrc: ownOutcome.persona.artSrc,
      poles: ownOutcome.poles,
      scores: ownOutcome.stats,
      bestMatch: { name: localizedPersonaName(ownOutcome.bestMatch) },
      rival: { name: localizedPersonaName(ownOutcome.rival) },
      labels: {
        traderType: t`Trader type`,
        bestMatch: t`Best match`,
        naturalRival: t`Natural rival`,
        conviction: t`Conviction`,
        instinct: t`Instinct`,
        resilience: t`Resilience`,
        disclaimer: t`For entertainment only`,
      },
    };
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
  }, [stage, ownOutcome, activeI18n.locale]);

  const ensureQuestions = async () => {
    if (questions.length) return questions;
    const data = await waitlistApi.getQuestions();
    const next = hydrateQuestions(data.questions);
    setQuestions(next);
    return next;
  };

  const showDemoTarget = async (target: WaitlistDemoTarget) => {
    setDemoActive(true);
    setDemoTarget(target);
    setGateError("");
    setReserveWarning("");
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
    setOwnOutcome(DEMO_OUTCOME);
    setRank(8017);
    setShareCompleted(false);
    setVerifiedFriends(0);
    setInvitations([{ code: "smartx01", status: 0, usedAt: null }]);
    setStage("result");
  };

  const exitDemo = () => {
    const url = new URL(window.location.href);
    url.searchParams.delete("demo");
    window.location.assign(url.toString());
  };

  const startQuiz = async (options: { reserve: boolean }) => {
    const reserve = options.reserve && !demoActive;
    if (reserve && !isValidInviteCode(inviteCode)) return;
    setGateError("");
    setReserveWarning("");
    renewalCappedRef.current = false;
    try {
      await ensureQuestions();
      if (reserve) {
        const existingSession = getSessionTokenForInvite(inviteCode);
        if (existingSession) {
          persistReservation({ sessionToken: existingSession, inviteCode });
        } else {
          try {
            const reserved = await waitlistApi.reserveInvite(inviteCode);
            if (!persistReservation({ ...reserved, inviteCode })) {
              dropReservation();
              throw new Error(GENERIC_ERROR);
            }
          } catch (error) {
            dropReservation();
            throw error;
          }
        }
      }
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
    } catch (error) {
      setGateError(errorMessage(error));
    }
  };

  const beginFromReferral = () => {
    if (demoActive || (loggedIn && !hasOwnResult)) return startQuiz({ reserve: false });
    return startQuiz({ reserve: true });
  };

  const beginWithoutInvite = () => {
    setInviteCode("");
    dropReservation();
    return startQuiz({ reserve: false });
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
          clearWaitlistSession();
          setUserTokenState("");
          setSessionTokenState("");
          setUserInfo(null);
          setOwnOutcome(null);
          setInvitations([]);
          setRank(null);
          setShareCompleted(false);
          setVerifiedFriends(0);
          setAnswers({});
          setQuestionIndex(0);
          setInviteCode("");
          setTelegramOpened(false);
          setXOpened(false);
          setOtp("");
          setOtpError("");
          setAuthIntent("recover");
          setRecoveryError("");
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

  const enterAfterLogin = async (token: string, intent: AuthIntent, isNewUser: boolean, resultId: string) => {
    setUserToken(token);
    setUserTokenState(token);
    setSessionTokenState("");
    if (intent === "recover") {
      if (isNewUser || !resultId) {
        resetAuth();
        setRecoveryError(NO_SAVED_RESULT);
        setStage("email");
        return;
      }
      const info = await waitlistApi.getUserInfo(token);
      setUserInfo(info);
      setSessionEmail(info.email);
      clearQuizDraft();
      applyWorkspace(await fetchWorkspace(token));
      return;
    }

    if (!isNewUser) {
      const info = await waitlistApi.getUserInfo(token);
      setUserInfo(info);
      setSessionEmail(info.email);
      clearQuizDraft();
      applyWorkspace(await fetchWorkspace(token));
      return;
    }

    await waitlistApi.submitQuiz(buildQuizAnswers(questions, answersRef.current), token);
    clearQuizDraft();
    const info = await waitlistApi.getUserInfo(token);
    setUserInfo(info);
    setSessionEmail(info.email);
    applyWorkspace(await fetchWorkspace(token));
  };

  const submitOtp = async () => {
    setOtpError("");
    try {
      const login = await waitlistApi.login(email, otp);
      await enterAfterLogin(login.token, authIntent, login.isNewUser, login.resultId);
    } catch (error) {
      if (handleUserApiError(error)) return;
      if (authIntent === "create" && isWaitlistApiError(error) && error.message === INVITE_UNRECOGNIZED && isValidInviteCode(inviteCode)) {
        try {
          persistReservation({ ...(await waitlistApi.reserveInvite(inviteCode)), inviteCode });
          const login = await waitlistApi.login(email, otp);
          await enterAfterLogin(login.token, authIntent, login.isNewUser, login.resultId);
          return;
        } catch (retryError) {
          if (handleUserApiError(retryError)) return;
          setOtpError(errorMessage(retryError));
          return;
        }
      }
      if (authIntent === "create" && isWaitlistApiError(error) && error.message === INVITE_CLAIMED) {
        dropReservation();
        setGateError(errorMessage(error));
        setStage("gate");
        return;
      }
      if (authIntent === "recover" && isWaitlistApiError(error) && /invite code not recognized|user not found/i.test(error.message)) {
        setRecoveryError(NO_SAVED_RESULT);
        setStage("email");
      } else {
        setOtpError(errorMessage(error));
      }
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
        if (!handleUserApiError(error)) setReserveWarning(errorMessage(error));
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
    if (inviteCode && (sessionToken || getQuizSession()?.sessionToken)) {
      await syncReservation();
    }
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

  const reReserveInvite = async () => {
    try {
      persistReservation({ ...(await waitlistApi.reserveInvite(inviteCode)), inviteCode });
      renewalCappedRef.current = false;
      setReserveWarning("");
    } catch (error) {
      dropReservation();
      setReserveWarning(errorMessage(error));
    }
  };

  const openCommunity = async (channel: CommunityChannel) => {
    const href = channel === "telegram" ? communityLinks.telegram : communityLinks.x;
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
    if (!ownOutcome || !primaryInvitation?.code) return;
    const shareUrl = new URL("https://twitter.com/intent/tweet");
    const shareName = localizedPersonaName(ownOutcome.persona);
    const shareRoast = localizedPersonaRoast(ownOutcome.persona);
    shareUrl.searchParams.set("text", `${t`My SmartX trader type is ${shareName}.`}${shareRoast ? `\n\n“${shareRoast}”` : ""}\n\n${t`Find yours in six questions.`}`);
    shareUrl.searchParams.set("url", makeInvitationUrl(primaryInvitation.code, ownOutcome.resultId, true));
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
    if (!code || !ownOutcome) return;
    try {
      await navigator.clipboard.writeText(makeInvitationUrl(code, ownOutcome.resultId, true));
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
            const storedInvite = getQuizSession()?.inviteCode;
            if (isValidInviteCode(next) && storedInvite && storedInvite !== next) {
              dropReservation();
            }
          }}
          aria-invalid={Boolean(gateError)}
          aria-describedby={gateError ? "invite-error" : undefined}
          required
        />
        <WaitlistButton
          className={`${styles.primaryButton} ${styles.inviteEntryButton}`}
          type="submit"
          disabled={!inviteReady}
          onAction={() => startQuiz({ reserve: true })}
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
            <PersonaPoster outcome={referralOutcome} downloads={false} />
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
                  <WaitlistButton className={styles.primaryButton} disabled={!inviteReady} onAction={beginFromReferral}>
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
                <Trans>Back to invite</Trans>
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
            <div className={styles.quizLayout} key={currentQuestion.questionId}>
              <QuestionArtwork question={currentQuestion} />
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
                <h1>{currentQuestion.prompt}</h1>
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
                        <span>{option.label}</span>
                      </WaitlistButton>
                    );
                  })}
                </div>
                {reserveWarning ? (
                  <div className={styles.quizWarning} role="alert">
                    <small>{localizeWaitlistMessage(reserveWarning)}</small>
                    {reserveWarning === INVITE_EXPIRED && (
                      <WaitlistButton className={styles.textButton} onAction={reReserveInvite}>
                        <Trans>Reserve again</Trans>
                      </WaitlistButton>
                    )}
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
                  placeholder="you@domain.com"
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
              label={t`Verified as`}
              compact
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
            <PersonaPoster outcome={ownOutcome} downloads={false} />
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
                  <details className={styles.downloadMenu}>
                    <summary>
                      <Image src="/assets/waitlist/download.svg" alt="" width={20} height={20} aria-hidden="true" />
                      <Trans>Download</Trans>
                    </summary>
                    <div className={styles.downloadOptions} role="group" aria-label={t`Download result card`}>
                      {preparedCards.story && preparedCards.og ? (
                        <>
                          <a href={preparedCards.story.href} download={preparedCards.story.filename}>
                            <span><Trans>Story</Trans></span>
                            <small>1080 × 1920</small>
                          </a>
                          <a href={preparedCards.og.href} download={preparedCards.og.filename}>
                            <span>X / TG</span>
                            <small>1200 × 630</small>
                          </a>
                        </>
                      ) : (
                        <span className={styles.downloadPending}>{exportError ? t`Unavailable` : t`Preparing…`}</span>
                      )}
                    </div>
                  </details>
                  <WaitlistButton className={styles.shareButton} disabled={!primaryInvitation?.code} onAction={shareResult}>
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
                </header>
                <div className={styles.primaryInviteCard} data-empty={primaryInvitation ? undefined : "true"}>
                  <div>
                    <span><Trans>Invite code</Trans></span>
                    <strong>{primaryInvitation?.code || t`Invite link is being prepared`}</strong>
                  </div>
                  <WaitlistButton
                    type="button"
                    lock={false}
                    disabled={!primaryInvitation?.code}
                    onClick={() => { void copyInvitation(primaryInvitation?.code); }}
                  >
                    <Image src="/assets/waitlist/copy.svg" alt="" width={20} height={20} aria-hidden="true" />
                    {copiedCode === primaryInvitation?.code ? t`Copied` : t`Copy link`}
                  </WaitlistButton>
                </div>
              </section>
            </aside>
          </div>
        )}
      </section>
    </main>
    </WaitlistActionScope>
  );
}
