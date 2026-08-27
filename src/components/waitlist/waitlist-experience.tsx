"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import { ConsumerHeader } from "@/components/consumer-network/consumer-header";
import { notifyError } from "@/components/site/app-notice";
import { isValidEmail, isValidInviteCode, normalizeEmail, normalizeInviteCode, sanitizeInviteCodeInput, waitlistApi } from "@/lib/waitlist/api";
import { hydrateQuestions, isRiskMonk, mapCardToOutcome, PERSONAS_BY_CODE } from "@/lib/waitlist/persona";
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

import { renderResultCard, type RenderedResultCard, type ResultCardFormat } from "./result-card-export";
import styles from "./waitlist.module.css";

const WAITLIST_URL = "https://smartx.io/waitlist/";
const INVITES_PER_PAGE = 5;
const PRIORITY_PER_FRIEND = 500;
const PRIORITY_FRIEND_CAP = 5000;
const NO_SAVED_RESULT = "No saved result is linked to this email. Use an invite to take the test.";
const INVALID_EMAIL = "Please enter a valid email address.";
const GENERIC_ERROR = "Something went wrong. Please try again.";
const INVITE_UNRECOGNIZED = "Invite code not recognized. Check the code and try again.";
const INVITE_CLAIMED = "This invite has already been claimed. Ask for another one.";
const INVITE_BUSY = "This invite is being used in another session. Try again shortly.";
const INVITE_EXPIRED = "This invite has expired. Ask for another one.";
const INVITE_RESERVED = "Your invite is reserved for this session.";
const RESERVE_EXPIRED_API = "Invite reservation expired. Reserve again.";
const RESERVE_LIMIT_API = "Invite reservation time limit reached.";
const RENEW_INTERVAL_MS = 90_000;
const INVITES_POLL_MS = 10_000;
const OTP_RESEND_SECONDS = 60;
const OTP_EXPIRE_SECONDS = 600;
const DEFAULT_COMMUNITY = {
  telegram: "https://t.me/+CTeuBkpOxSNkN2Y0",
  x: "https://x.com/SmartXTerminal",
};

const INVITE_CARD_STATES = {
  0: { label: "", mark: "↗", available: true },
  1: { label: "Held", mark: "—", available: false },
  2: { label: "Used", mark: "—", available: false },
  3: { label: "Invalid", mark: "—", available: false },
} as const;

function inviteCardState(status: number) {
  return INVITE_CARD_STATES[status as 0 | 1 | 2 | 3] ?? INVITE_CARD_STATES[3];
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
  const links = {
    telegram: community.links?.telegram || DEFAULT_COMMUNITY.telegram,
    x: community.links?.x || DEFAULT_COMMUNITY.x,
  };
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

function Brand() {
  return (
    <span className={styles.brand}>
      <Image src="/assets/consumer-network/logo-white.svg" alt="" width={34} height={28} />
      <span>SmartX</span>
    </span>
  );
}

function QuestionArtwork({ question }: { question: QuizQuestion }) {
  return (
    <div className={styles.questionArtwork}>
      <Image src={question.artSrc} alt={question.artAlt} fill sizes="(max-width: 860px) 90vw, 540px" priority />
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
  return (
    <div className={styles.accountStrip} data-compact={compact ? "true" : undefined} data-place={place}>
      <div>
        <span>{label}</span>
        <strong>{email || "Email verified"}</strong>
      </div>
      <WaitlistButton type="button" onClick={onSignOut}>Sign out</WaitlistButton>
    </div>
  );
}

function PersonaPoster({
  outcome,
  preparedCards,
  exportError,
  preview = false,
}: {
  outcome: Outcome;
  preparedCards?: Partial<Record<ResultCardFormat, RenderedResultCard>>;
  exportError?: boolean;
  preview?: boolean;
}) {
  return (
    <article className={styles.personaPoster} data-preview={preview}>
      {preview && (
        <header>
          <Link href="/" aria-label="SmartX home" className={styles.posterLogo}>
            <Brand />
          </Link>
        </header>
      )}
      <div className={styles.posterIdentity}>
        {!isRiskMonk(outcome.persona.mark) && <span>{outcome.poles.join(" · ")}</span>}
        <h2>{outcome.persona.name}</h2>
      </div>
      <div className={styles.personaArt}>
        <Image
          src={outcome.persona.artSrc}
          alt={outcome.persona.artAlt}
          fill
          sizes={preview ? "(max-width: 880px) 90vw, 520px" : "(max-width: 880px) 90vw, 610px"}
          priority={!preview}
        />
      </div>
      <div className={styles.posterScores}>
        <ScoreAxis label="Conviction" score={outcome.stats.conviction} />
        <ScoreAxis label="Instinct" score={outcome.stats.instinct} />
        <ScoreAxis label="Resilience" score={outcome.stats.resilience} />
      </div>
      {outcome.persona.roast ? <blockquote>“{outcome.persona.roast}”</blockquote> : null}
      <section className={styles.chemistryBlock} aria-label="Persona chemistry">
        <div><span>Best match</span><strong>{outcome.bestMatch.name}</strong></div>
        <div><span>Natural rival</span><strong>{outcome.rival.name}</strong></div>
      </section>
      {!preview && (
        <section className={styles.cardDownloads} aria-label="Download result card">
          <span>Download result</span>
          <div>
            {preparedCards?.story ? <a href={preparedCards.story.href} download={preparedCards.story.filename}>Story <small>1080 × 1920</small></a> : <span>{exportError ? "Unavailable" : "Preparing…"}</span>}
            {preparedCards?.og ? <a href={preparedCards.og.href} download={preparedCards.og.filename}>X / OG <small>1200 × 630</small></a> : <span>{exportError ? "Unavailable" : "Preparing…"}</span>}
          </div>
        </section>
      )}
    </article>
  );
}

export function WaitlistExperience() {
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
  const [showInviteSwitch, setShowInviteSwitch] = useState(false);
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
  const [otpResent, setOtpResent] = useState(false);
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
  const shareDialogRef = useRef<HTMLDialogElement>(null);
  const [selectedShareCode, setSelectedShareCode] = useState("");
  const [reserveWarning, setReserveWarning] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [shareCompleted, setShareCompleted] = useState(false);
  const [verifiedFriends, setVerifiedFriends] = useState(0);
  const [invitePage, setInvitePage] = useState(0);
  const [invitations, setInvitations] = useState<InviteItem[]>([]);
  const [rank, setRank] = useState<number | null>(null);
  const [preparedCards, setPreparedCards] = useState<Partial<Record<ResultCardFormat, RenderedResultCard>>>({});
  const [exportError, setExportError] = useState(false);

  const loggedIn = Boolean(userToken && userInfo);
  const hasOwnResult = isOwnResultAvailable({ loggedIn, submitted: Boolean(userInfo?.submitted && userInfo.resultId) });
  const inviteReady = isValidInviteCode(inviteCode);
  const savedPersonaName = ownOutcome?.persona.name ?? PERSONAS_BY_CODE[userInfo?.personaId ?? ""]?.name ?? "your trader type";
  const currentQuestion = questions[questionIndex];
  const invitePageCount = Math.max(1, Math.ceil(invitations.length / INVITES_PER_PAGE));
  const visibleInvitations = invitations.slice(invitePage * INVITES_PER_PAGE, (invitePage + 1) * INVITES_PER_PAGE);
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
      setInvitePage(0);
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
    setShowInviteSwitch(false);
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

      if (friendCard && !isValidInviteCode(invite)) setShowInviteSwitch(true);

      const inviteView = inviteStatusResult.status === "fulfilled" ? inviteStatusResult.value : null;
      const ownReservation = Boolean(matchingSession) && inviteView?.status === 1;
      const resumeSession = Boolean(matchingSession) && !(info?.submitted && info.resultId) && (inviteView?.status === 0 || inviteView?.status === 1 || !inviteView);

      if (inviteStatusResult.status === "rejected") {
        setGateError(errorMessage(inviteStatusResult.reason));
        if (friendCard) setShowInviteSwitch(true);
      } else if (inviteView && inviteView.status !== 0 && !ownReservation) {
        setGateError(formatWaitlistCopy(inviteView.message));
        if (matchingSession && (inviteView.status === 2 || inviteView.status === 3)) dropReservation();
        if (friendCard) setShowInviteSwitch(true);
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
    if (stage !== "result" || !userToken) return;
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
  }, [stage, userToken]);

  useEffect(() => {
    if (!selectedShareCode) return;
    const selected = invitations.find((item) => item.code === selectedShareCode);
    if (!selected || selected.status !== 0) setSelectedShareCode("");
  }, [invitations, selectedShareCode]);

  useEffect(() => {
    if (stage === "result") return;
    shareDialogRef.current?.close();
    setSelectedShareCode("");
  }, [stage]);

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
      ...ownOutcome.persona,
      code: ownOutcome.persona.mark,
      poles: ownOutcome.poles,
      scores: ownOutcome.stats,
      bestMatch: { name: ownOutcome.bestMatch.name, cn: ownOutcome.bestMatch.cn },
      rival: { name: ownOutcome.rival.name, cn: ownOutcome.rival.cn },
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
  }, [stage, ownOutcome]);

  const ensureQuestions = async () => {
    if (questions.length) return questions;
    const data = await waitlistApi.getQuestions();
    const next = hydrateQuestions(data.questions);
    setQuestions(next);
    return next;
  };

  const startQuiz = async (options: { reserve: boolean }) => {
    if (options.reserve && !isValidInviteCode(inviteCode)) return;
    setGateError("");
    setReserveWarning("");
    renewalCappedRef.current = false;
    try {
      await ensureQuestions();
      if (options.reserve) {
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
      if (referralOutcome) setShowInviteSwitch(true);
    }
  };

  const beginFromReferral = () => {
    if (loggedIn && !hasOwnResult) return startQuiz({ reserve: false });
    return startQuiz({ reserve: true });
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
      if (!handleUserApiError(error)) notifyError(errorMessage(error));
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
      setOtpResent(false);
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
      setOtpResent(true);
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
    if (questionIndex === 0) return;
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
    if (!userToken) return;
    try {
      const result = await waitlistApi.completeCommunity(channel, userToken);
      setTelegramOpened(result.telegramCompleted === 1);
      setXOpened(result.xCompleted === 1);
    } catch (error) {
      if (!handleUserApiError(error)) notifyError(errorMessage(error));
    }
  };

  const revealResult = async () => {
    if (!userToken) return;
    try {
      applyWorkspace(await fetchWorkspace(userToken));
    } catch (error) {
      if (!handleUserApiError(error)) notifyError(errorMessage(error));
    }
  };

  const openSharePicker = async () => {
    setSelectedShareCode("");
    if (userToken) {
      try {
        const invites = await waitlistApi.getMyInvites(userToken);
        setInvitations(invites.list);
      } catch (error) {
        if (handleUserApiError(error)) return;
      }
    }
    shareDialogRef.current?.showModal();
  };

  const closeSharePicker = () => {
    shareDialogRef.current?.close();
    setSelectedShareCode("");
  };

  const shareResult = async () => {
    if (!ownOutcome || !selectedShareCode) return;
    const selected = invitations.find((item) => item.code === selectedShareCode);
    if (!selected || selected.status !== 0) return;
    const shareUrl = new URL("https://twitter.com/intent/tweet");
    shareUrl.searchParams.set("text", `My SmartX trader type is ${ownOutcome.persona.name}.${ownOutcome.persona.roast ? `\n\n“${ownOutcome.persona.roast}”` : ""}\n\nFind yours in six questions.`);
    shareUrl.searchParams.set("url", makeInvitationUrl(selected.code, ownOutcome.resultId, true));
    window.open(shareUrl.toString(), "_blank", "noopener,noreferrer");
    closeSharePicker();
    if (!userToken || shareCompleted) return;
    try {
      await waitlistApi.shareComplete(userToken);
      const nextRank = await waitlistApi.getRank(userToken);
      setShareCompleted(true);
      setRank(nextRank.rank);
    } catch (error) {
      if (!handleUserApiError(error)) notifyError(errorMessage(error));
    }
  };

  const copyInvitation = async (code?: string) => {
    if (!code || !ownOutcome) return;
    try {
      await navigator.clipboard.writeText(makeInvitationUrl(code, ownOutcome.resultId, true));
      setCopiedCode(code);
      window.setTimeout(() => setCopiedCode(null), 1400);
    } catch (error) {
      notifyError(errorMessage(error) === GENERIC_ERROR ? "Couldn’t copy the invite link. Try again." : errorMessage(error));
    }
  };

  const inviteForm = (
    <>
      <label htmlFor="invite-code">Invite code</label>
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
          placeholder="8-character code"
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
          aria-describedby={gateError ? "invite-note invite-error" : "invite-note"}
          required
        />
        <WaitlistButton
          className={styles.primaryButton}
          type="submit"
          disabled={!inviteReady}
          onAction={() => startQuiz({ reserve: true })}
        >
          Begin
        </WaitlistButton>
      </div>
      <small id="invite-note" className={styles.formHint}>Strictly invite-only. Your code is reserved when the test begins.</small>
      {gateError ? <small className={styles.formError} id="invite-error" role="alert">{gateError}</small> : null}
    </>
  );

  return (
    <WaitlistActionScope>
    <main className={styles.page} data-stage={stage} data-referral={Boolean(referralOutcome)}>
      <a className={styles.skipLink} href="#waitlist-content">Skip to waitlist</a>
      <div className={styles.ambientBackdrop} aria-hidden="true">
        <Image src="/assets/consumer-network/hero-product.png" alt="" fill sizes="100vw" priority />
      </div>
      <ConsumerHeader active="waitlist" placement="page" />

      <section className={styles.stage} id="waitlist-content" aria-live="polite">
        {stage === "boot" && (
          <div className={styles.formStage}>
            <span className={styles.eyebrow}>Waitlist</span>
            <h1>Loading your session.</h1>
            <p>Checking invite, result, and sign-in state.</p>
          </div>
        )}

        {stage === "gate" && referralOutcome && (
          <div className={styles.referralStage}>
            <PersonaPoster outcome={referralOutcome} preview />
            <div className={styles.referralCopy}>
              <span className={styles.eyebrow}>A result was shared with you</span>
              <h1>A friend trades like <span className={styles.referralPersona}>{referralOutcome.persona.name}.</span></h1>
              <p>Different score, same type—or something else entirely? Six decisions reveal how you trade when it gets real.</p>
              {loggedIn && (
                <AccountSession
                  email={verifiedEmail}
                  label="Verified as"
                  place="copy"
                  onSignOut={signOutWaitlist}
                />
              )}
              {hasOwnResult ? (
                <div className={styles.referralReturn}>
                  <WaitlistButton className={styles.primaryButton} onAction={viewSavedResult}>
                    View my result
                  </WaitlistButton>
                  <small>Your result is saved as {savedPersonaName}.</small>
                </div>
              ) : loggedIn ? (
                <WaitlistButton className={styles.primaryButton} onAction={beginFromReferral}>
                  Find my trader type
                </WaitlistButton>
              ) : (
                <>
                  {!showInviteSwitch && (
                    <WaitlistButton className={styles.primaryButton} disabled={!inviteReady} onAction={beginFromReferral}>
                      Find my trader type
                    </WaitlistButton>
                  )}
                  {showInviteSwitch && (
                    <form className={styles.gateForm} onSubmit={(event) => event.preventDefault()}>
                      {inviteForm}
                    </form>
                  )}
                  <WaitlistButton className={styles.textButton} onClick={beginResultRecovery}>Already tested? View my result</WaitlistButton>
                  {gateError && !showInviteSwitch && (
                    <div className={styles.referralError} role="alert">
                      <small>{gateError}</small>
                      <WaitlistButton className={styles.textButton} onClick={() => setShowInviteSwitch(true)}>Use another invite</WaitlistButton>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {stage === "gate" && !referralOutcome && (
          <div className={styles.gateStage}>
            <div className={styles.gateCopy}>
              <span className={styles.eyebrow}>The SmartX trader type test</span>
              <h1>How do you trade<br />when it gets <em>real?</em></h1>
              <p>Six decisions reveal your risk, signal, and social instincts.</p>
            </div>
            <form className={styles.gateForm} onSubmit={(event) => event.preventDefault()}>
              {inviteForm}
              <div className={styles.gateFormMeta}>
                <WaitlistButton className={styles.textButton} onClick={beginResultRecovery}>Already tested? View my result</WaitlistButton>
              </div>
            </form>
          </div>
        )}

        {stage === "quiz" && !currentQuestion && (
          <div className={styles.formStage}>
            <span className={styles.eyebrow}>Waitlist</span>
            <h1>Couldn’t load the test.</h1>
            <p>The questions didn’t come through. Check your connection and try again.</p>
            <form onSubmit={(event) => event.preventDefault()}>
              <WaitlistButton className={styles.primaryButton} onClick={() => setStage("gate")}>Back to invite</WaitlistButton>
            </form>
          </div>
        )}

        {stage === "quiz" && currentQuestion && (
          <div className={styles.quizStage}>
            {loggedIn && (
              <AccountSession
                email={verifiedEmail}
                label="Verified as"
                place="scene"
                onSignOut={signOutWaitlist}
              />
            )}
            <div className={styles.quizTopline}>
              {questionIndex > 0 ? <WaitlistButton type="button" onClick={goBack}>← Back</WaitlistButton> : <span />}
              <div className={styles.progress} aria-label={`Question ${questionIndex + 1} of ${questions.length}`}>
                {questions.map((question, index) => <i key={question.questionId} data-active={index <= questionIndex} />)}
              </div>
            </div>
            <div className={styles.quizLayout} key={currentQuestion.questionId}>
              <QuestionArtwork question={currentQuestion} />
              <div className={styles.questionPanel}>
                <h1>{currentQuestion.prompt}</h1>
                <div className={styles.optionList}>
                  {currentQuestion.options.map((option) => (
                    <WaitlistButton type="button" key={option.optionId} onAction={() => answerQuestion(option.optionId)}>
                      <i aria-hidden="true" /><span>{option.label}</span>
                    </WaitlistButton>
                  ))}
                </div>
                {reserveWarning ? (
                  <div className={styles.quizWarning} role="alert">
                    <small>{reserveWarning}</small>
                    {reserveWarning === INVITE_EXPIRED && (
                      <WaitlistButton className={styles.textButton} onAction={reReserveInvite}>Reserve again</WaitlistButton>
                    )}
                  </div>
                ) : (
                  <small className={styles.quizHint}>{INVITE_RESERVED}</small>
                )}
              </div>
            </div>
          </div>
        )}

        {stage === "email" && (
          <div className={styles.formStage}>
            <span className={styles.eyebrow}>{authIntent === "recover" ? "Already tested?" : "Your result is ready"}</span>
            <h1>{authIntent === "recover" ? "Find your result." : "Save your result."}</h1>
            <p>{authIntent === "recover" ? "Enter the email you used. We’ll send a six-digit code." : "Bind an email to keep it and create your waitlist position."}</p>
            <form onSubmit={(event) => event.preventDefault()}>
              <label htmlFor="waitlist-email">Email address</label>
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
                  {authIntent === "recover" ? "Send code" : "Continue"}
                </WaitlistButton>
              </div>
              <small className={styles.formHint}>We’ll use this to save your result and send waitlist updates.</small>
              {recoveryError ? <small className={styles.formError} role="alert">{recoveryError}</small> : null}
              {authIntent === "recover" && (
                <WaitlistButton className={styles.recoveryBack} onClick={() => { setRecoveryError(""); setStage("gate"); }}>
                  ← Back
                </WaitlistButton>
              )}
            </form>
          </div>
        )}

        {stage === "verify" && (
          <div className={styles.formStage}>
            <span className={styles.eyebrow}>Check your inbox</span>
            <h1>Six digits.</h1>
            <p>Enter the code sent to <b>{email}</b>.</p>
            <form onSubmit={(event) => event.preventDefault()}>
              <label htmlFor="waitlist-otp">Verification code</label>
              <div className={styles.inlineField}>
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
                  placeholder="••••••"
                  autoFocus
                  required
                />
                <WaitlistButton className={styles.primaryButton} type="submit" onAction={submitOtp}>
                  Continue
                </WaitlistButton>
              </div>
              <small id="otp-note" className={styles.formHint} aria-live="polite">
                {otpExpiresIn > 0 ? `The code expires in ${formatClock(otpExpiresIn)}.` : "The code has expired. Resend to get a new one."}
              </small>
              {otpError ? <small className={styles.formError} id="otp-error" role="alert">{otpError}</small> : null}
              <div className={styles.formMeta}>
                <WaitlistButton type="button" disabled={otpCooldown > 0} onAction={resendCode}>
                  {otpCooldown > 0 ? `Resend in ${otpCooldown}s` : otpResent ? "Code sent again" : "Resend code"}
                </WaitlistButton>
                <WaitlistButton type="button" onClick={() => setStage("email")}>Change email</WaitlistButton>
              </div>
            </form>
          </div>
        )}

        {stage === "unlock" && (
          <div className={styles.unlockStage}>
            <span className={styles.eyebrow}>One last step</span>
            <h1>Unlock your result.</h1>
            <p>Join the SmartX community and follow product updates before your trader type is revealed.</p>
            <AccountSession
              email={verifiedEmail}
              label="Verified as"
              compact
              onSignOut={signOutWaitlist}
            />
            <div className={styles.unlockTasks}>
              <WaitlistButton type="button" aria-pressed={telegramOpened} data-complete={telegramOpened} onAction={() => openCommunity("telegram")}>
                <FaTelegramPlane aria-hidden="true" />
                <span><b>Join Telegram</b><small>Enter the SmartX community</small></span>
                <strong>{telegramOpened ? "Done ✓" : "Open ↗"}</strong>
              </WaitlistButton>
              <WaitlistButton type="button" aria-pressed={xOpened} data-complete={xOpened} onAction={() => openCommunity("x")}>
                <FaXTwitter aria-hidden="true" />
                <span><b>Follow SmartX on X</b><small>Follow product updates</small></span>
                <strong>{xOpened ? "Done ✓" : "Open ↗"}</strong>
              </WaitlistButton>
            </div>
            <WaitlistButton className={styles.primaryButton} disabled={!telegramOpened || !xOpened} onAction={revealResult}>
              Reveal my result
            </WaitlistButton>
            <small>Both steps are required to continue.</small>
          </div>
        )}

        {stage === "result" && ownOutcome && (
          <div className={styles.resultStage}>
            <PersonaPoster outcome={ownOutcome} preparedCards={preparedCards} exportError={exportError} />
            <aside className={styles.resultPanel}>
              <AccountSession email={verifiedEmail} label="Signed in as" onSignOut={signOutWaitlist} />
              <div className={styles.rankBlock} data-boosted={shareCompleted}>
                <span>Waitlist rank</span>
                <strong key={rank ?? "pending"}>#{(rank ?? 0).toLocaleString("en-US")}</strong>
                <div className={styles.rankRewards}>
                  <div data-applied={shareCompleted}>
                    <span>{shareCompleted ? "Share recorded" : "First result share"}</span>
                    <b>+500 priority</b>
                  </div>
                  <div data-applied={friendRewardApplied}>
                    <span>Each verified friend{friendRewardApplied ? ` (+${verifiedFriends})` : ""}</span>
                    <b>+{friendPriority.toLocaleString("en-US")} priority</b>
                  </div>
                </div>
                <small>Priority improves your score; rank updates against the live waitlist.</small>
                <WaitlistButton className={styles.shareButton} onAction={openSharePicker}>
                  {shareCompleted ? "Share again" : "Share result"}
                </WaitlistButton>
              </div>
              <section className={styles.invitationDeck} aria-label="One-time invitation cards">
                <header>
                  <div>
                    <span>Invite friends</span>
                    <p>Each link can be claimed once.</p>
                  </div>
                  {invitePageCount > 1 && (
                    <div className={styles.inviteNavigation}>
                      <b>{invitePage * INVITES_PER_PAGE + 1}–{Math.min((invitePage + 1) * INVITES_PER_PAGE, invitations.length)}</b>
                      <WaitlistButton type="button" aria-label="Previous five invites" disabled={invitePage === 0} onClick={() => setInvitePage((current) => current - 1)}>←</WaitlistButton>
                      <WaitlistButton type="button" aria-label="Next five invites" disabled={invitePage === invitePageCount - 1} onClick={() => setInvitePage((current) => current + 1)}>→</WaitlistButton>
                    </div>
                  )}
                </header>
                <div className={styles.inviteCardGrid}>
                  {visibleInvitations.map((invitation, index) => {
                    const card = inviteCardState(invitation.status);
                    const isCopied = card.available && copiedCode === invitation.code;
                    const absoluteIndex = invitePage * INVITES_PER_PAGE + index;
                    const statusLabel = isCopied ? "Copied" : card.label;
                    return (
                      <WaitlistButton
                        className={styles.inviteCodeCard}
                        data-copied={isCopied}
                        data-status={invitation.status}
                        disabled={!card.available}
                        key={invitation.code}
                        type="button"
                        lock={false}
                        aria-label={
                          card.available
                            ? `Copy invite link ${invitation.code}`
                            : `Invite ${invitation.code} ${card.label.toLowerCase()}`
                        }
                        onClick={() => {
                          void copyInvitation(invitation.code);
                        }}
                      >
                        <header>
                          <span>Invite {String(absoluteIndex + 1).padStart(2, "0")}</span>
                          <i aria-hidden="true" />
                        </header>
                        <div aria-hidden="true"><strong>{isCopied ? "✓" : card.mark}</strong></div>
                        <footer>
                          <span>{invitation.code}</span>
                          {statusLabel ? <b>{statusLabel}</b> : null}
                        </footer>
                      </WaitlistButton>
                    );
                  })}
                </div>
              </section>
            </aside>
          </div>
        )}
      </section>
      <dialog
        ref={shareDialogRef}
        className={styles.shareDialog}
        aria-labelledby="share-invite-title"
        onClose={() => setSelectedShareCode("")}
        onClick={(event) => {
          const box = event.currentTarget.getBoundingClientRect();
          const outside = event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom;
          if (outside) event.currentTarget.close();
        }}
      >
        <div className={styles.shareDialogPanel}>
          <header>
            <strong id="share-invite-title">Choose invite</strong>
            <p>Unused codes only.</p>
          </header>
          {invitations.some((item) => item.status === 0) ? (
            <div className={styles.shareInviteList} role="listbox" aria-label="Invite codes">
              {invitations.map((invitation) => {
                const card = inviteCardState(invitation.status);
                const selected = selectedShareCode === invitation.code;
                return (
                  <WaitlistButton
                    key={invitation.code}
                    className={styles.shareInviteOption}
                    type="button"
                    role="option"
                    lock={false}
                    aria-selected={selected}
                    data-selected={selected}
                    data-status={invitation.status}
                    disabled={!card.available}
                    onClick={() => {
                      if (!card.available) return;
                      setSelectedShareCode(invitation.code);
                    }}
                  >
                    <i aria-hidden="true" />
                    <span>{invitation.code}</span>
                    {card.label ? <b>{card.label}</b> : null}
                  </WaitlistButton>
                );
              })}
            </div>
          ) : (
            <p className={styles.shareInviteEmpty}>No unused invites left.</p>
          )}
          <div className={styles.shareDialogActions}>
            <WaitlistButton className={styles.textButton} type="button" lock={false} onClick={closeSharePicker}>Cancel</WaitlistButton>
            <WaitlistButton className={styles.shareDialogShare} type="button" disabled={!selectedShareCode} onAction={shareResult}>
              Share
            </WaitlistButton>
          </div>
        </div>
      </dialog>
    </main>
    </WaitlistActionScope>
  );
}
