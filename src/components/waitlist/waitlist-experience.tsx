"use client";

import Image from "next/image";
import Link from "next/link";
import { type FormEvent, useEffect, useMemo, useState } from "react";
import { FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import { ConsumerHeader } from "@/components/consumer-network/consumer-header";

import { renderResultCard, type RenderedResultCard, type ResultCardFormat } from "./result-card-export";
import styles from "./waitlist.module.css";

type Stage = "gate" | "quiz" | "email" | "verify" | "unlock" | "result";
type Dimension = "risk" | "basis" | "mode";
type Stat = "conviction" | "instinct" | "resilience";
type Pole = "DEGEN" | "SNIPER" | "GUT" | "DATA" | "PACK" | "LONE";
type Weight = -2 | -1 | 1 | 2;

type QuizOption = {
  id: "A" | "B" | "C" | "D";
  label: string;
  value: Weight;
  statDelta: Partial<Record<Stat, number>>;
};
type Question = {
  dimension: Dimension;
  prompt: string;
  artSrc: string;
  artAlt: string;
  options: readonly QuizOption[];
};
type Persona = {
  name: string;
  cn: string;
  code: string;
  mark: string;
  roast: string;
  artSrc: string;
  artAlt: string;
};
type Scores = Record<Dimension, number>;
type StatScores = Record<Stat, number>;
type Outcome = {
  persona: Persona;
  poles: readonly [Pole, Pole, Pole];
  rawScores: Scores;
  stats: StatScores;
  resultId: string;
};
type ResultSnapshot = {
  version: 1;
  resultId: string;
  personaMark: string;
  poles: readonly [Pole, Pole, Pole];
  rawScores: Scores;
  stats: StatScores;
};

const QUESTIONS: readonly Question[] = [
  {
    dimension: "risk",
    prompt: "A coin you do not own is up 40%. What do you do?",
    artSrc: "/assets/waitlist/question-1.png",
    artAlt: "A rising market visual climbing translucent steps",
    options: [
      { id: "A", label: "Buy now. Momentum rarely waits.", value: 2, statDelta: { conviction: 15 } },
      { id: "B", label: "Start small and add if it holds.", value: 1, statDelta: { conviction: 10, instinct: 5 } },
      { id: "C", label: "Set an entry and wait for my price.", value: -1, statDelta: { instinct: 10 } },
      { id: "D", label: "Pass. Another setup will come.", value: -2, statDelta: { resilience: 10, instinct: 5 } },
    ],
  },
  {
    dimension: "risk",
    prompt: "Your position moves 20% against you. What happens next?",
    artSrc: "/assets/waitlist/question-2.png",
    artAlt: "A falling red market line approaching a physical stop marker",
    options: [
      { id: "A", label: "Add immediately. The entry just got cheaper.", value: 2, statDelta: { conviction: 15 } },
      { id: "B", label: "Give it more room before I decide.", value: 1, statDelta: { conviction: 10, resilience: 5 } },
      { id: "C", label: "Reduce the position according to plan.", value: -1, statDelta: { resilience: 10, instinct: 5 } },
      { id: "D", label: "Exit. The invalidation level did its job.", value: -2, statDelta: { resilience: 15 } },
    ],
  },
  {
    dimension: "basis",
    prompt: "Before you enter, what makes the idea feel real?",
    artSrc: "/assets/waitlist/question-3.png",
    artAlt: "A magnifying lens inspecting wallet flows and market evidence",
    options: [
      { id: "A", label: "Wallet flows, data, and a clear invalidation.", value: 2, statDelta: { instinct: 15 } },
      { id: "B", label: "A chart structure I can explain.", value: 1, statDelta: { instinct: 10, resilience: 5 } },
      { id: "C", label: "The market mood and momentum feel right.", value: -1, statDelta: { conviction: 5, instinct: 5 } },
      { id: "D", label: "A strong thesis that feels early.", value: -2, statDelta: { conviction: 10, instinct: 5 } },
    ],
  },
  {
    dimension: "basis",
    prompt: "A trader you trust posts a new position. Your first move?",
    artSrc: "/assets/waitlist/question-4.png",
    artAlt: "A lens verifying two overlapping market evidence sheets",
    options: [
      { id: "A", label: "Verify the wallet, structure, and timing.", value: 2, statDelta: { instinct: 15 } },
      { id: "B", label: "Check the chart before doing anything.", value: 1, statDelta: { instinct: 10, resilience: 5 } },
      { id: "C", label: "Open a small starter and keep watching.", value: -1, statDelta: { conviction: 5, instinct: 5 } },
      { id: "D", label: "Follow immediately. The source is the signal.", value: -2, statDelta: { conviction: 10 } },
    ],
  },
  {
    dimension: "mode",
    prompt: "You catch a 10×. Who hears about it first?",
    artSrc: "/assets/waitlist/question-5.png",
    artAlt: "A winning chart on a phone surrounded by message tokens",
    options: [
      { id: "A", label: "Screenshot, group chat, X.", value: 2, statDelta: { conviction: 10 } },
      { id: "B", label: "A close group that followed the trade.", value: 1, statDelta: { conviction: 5, resilience: 5 } },
      { id: "C", label: "One person I trust.", value: -1, statDelta: { resilience: 5, instinct: 5 } },
      { id: "D", label: "No one. The PnL is enough.", value: -2, statDelta: { resilience: 10, instinct: 5 } },
    ],
  },
  {
    dimension: "mode",
    prompt: "The group disagrees with your trade. What changes?",
    artSrc: "/assets/waitlist/question-6.png",
    artAlt: "Four different directional choices surrounding one decision marker",
    options: [
      { id: "A", label: "We debate it, and I adjust if they are right.", value: 2, statDelta: { resilience: 5, instinct: 5 } },
      { id: "B", label: "I listen, then make the final call.", value: 1, statDelta: { instinct: 10, resilience: 5 } },
      { id: "C", label: "I note it, but keep the original plan.", value: -1, statDelta: { conviction: 5, resilience: 10 } },
      { id: "D", label: "Nothing. I execute alone for a reason.", value: -2, statDelta: { conviction: 10, resilience: 5 } },
    ],
  },
];

const PERSONAS: Record<string, Persona> = {
  "DEGEN|GUT|PACK": {
    name: "The Liquidity Donor", cn: "送钱者", code: "APE", mark: "LQD",
    roast: "You’re not trading. You’re funding the ecosystem.",
    artSrc: "/assets/waitlist/personas/ops-meme-v1/lqd-liquidity-donor.png",
    artAlt: "The Liquidity Donor handing cash to a rising candlestick market",
  },
  "DEGEN|GUT|LONE": {
    name: "The All-In Mystic", cn: "梭哈仙人", code: "WOLF", mark: "AIM",
    roast: "Every all-in starts with enlightenment and ends with reincarnation.",
    artSrc: "/assets/waitlist/personas/ops-meme-v1/aim-all-in-mystic.png",
    artAlt: "The All-In Mystic meditating beside an all-in stack of chips",
  },
  "DEGEN|DATA|PACK": {
    name: "The Signal General", cn: "喊单军师", code: "PARROT", mark: "SIG",
    roast: "Three hours of research. Two-word thesis: send it.",
    artSrc: "/assets/waitlist/personas/ops-meme-v1/sig-signal-general.png",
    artAlt: "The Signal General directing followers from a chart-covered strategy table",
  },
  "DEGEN|DATA|LONE": {
    name: "The Candle Prophet", cn: "K线教主", code: "FOX", mark: "CND",
    roast: "You can chart every line except the one marking enough exposure.",
    artSrc: "/assets/waitlist/personas/ops-meme-v1/cnd-candle-prophet.png",
    artAlt: "The Candle Prophet explaining charts beside an oversized position lever",
  },
  "SNIPER|GUT|PACK": {
    name: "The Dip Ringleader", cn: "抄底带头大哥", code: "TURTLE", mark: "DIP",
    roast: "You’re not buying the dip. You’re giving the downtrend a demo.",
    artSrc: "/assets/waitlist/personas/ops-meme-v1/dip-dip-ringleader.png",
    artAlt: "The Dip Ringleader leading followers down a falling candlestick chart",
  },
  "SNIPER|GUT|LONE": {
    name: "The Market Doctor", cn: "行情老中医", code: "BEAR", mark: "DOC",
    roast: "Every symptom diagnosed. Every loss professionally explained.",
    artSrc: "/assets/waitlist/personas/ops-meme-v1/doc-market-doctor.png",
    artAlt: "The Market Doctor listening to a candlestick chart with a stethoscope",
  },
  "SNIPER|DATA|PACK": {
    name: "The Onchain Detective", cn: "链上侦探", code: "WHALE", mark: "CHN",
    roast: "You know everyone’s position except, occasionally, your own.",
    artSrc: "/assets/waitlist/personas/ops-meme-v1/chn-onchain-detective.png",
    artAlt: "The Onchain Detective tracing wallets while ignoring its own losing trade",
  },
  "SNIPER|DATA|LONE": {
    name: "The Limit Sniper", cn: "潜伏狙击手", code: "CAT", mark: "LMT",
    roast: "The limit order was perfect. Shame you two never met again.",
    artSrc: "/assets/waitlist/personas/ops-meme-v1/lmt-limit-sniper.png",
    artAlt: "The Limit Sniper watching price turn just before reaching an entry line",
  },
  OWL: {
    name: "The Risk Monk", cn: "风控大师", code: "OWL", mark: "RSK",
    roast: "They study how to double once. You study how to stay in the game.",
    artSrc: "/assets/waitlist/personas/ops-meme-v1/rsk-risk-monk.png",
    artAlt: "The Risk Monk meditating safely inside a shield during market chaos",
  },
};

const PERSONAS_BY_CODE = Object.values(PERSONAS).reduce<Record<string, Persona>>((index, persona) => {
  index[persona.code] = persona;
  index[persona.mark] = persona;
  return index;
}, {});

const CHEMISTRY: Record<string, { best: string; rival: string }> = {
  LQD: { best: "DIP", rival: "LMT" }, AIM: { best: "DOC", rival: "CHN" },
  SIG: { best: "CHN", rival: "DOC" }, CND: { best: "LMT", rival: "DIP" },
  DIP: { best: "LQD", rival: "CND" }, DOC: { best: "AIM", rival: "SIG" },
  CHN: { best: "SIG", rival: "AIM" }, LMT: { best: "CND", rival: "LQD" },
  RSK: { best: "CHN", rival: "LQD" },
};

const AXES: Record<Dimension, { negative: Pole; positive: Pole }> = {
  risk: { negative: "SNIPER", positive: "DEGEN" },
  basis: { negative: "GUT", positive: "DATA" },
  mode: { negative: "LONE", positive: "PACK" },
};
const DEFAULT_ANSWERS = ["C", "D", "A", "A", "B", "B"] as const;
const WAITLIST_URL = "https://smartx.io/waitlist/";
const OTP_CODE = "824193";
const SNAPSHOT_PREFIX = "smartx:waitlist-result:";
const INVITES_PER_PAGE = 5;
const PROTOTYPE_USED_INVITE_FRAGMENT = "N4Q8";
const USED_INVITE_CODES = new Set(["SMARTX-RSK-USED"]);
const LOCKED_INVITE_CODES = new Set(["SMARTX-RSK-LOCKED"]);

function makeCodes(persona: Persona) {
  const fragments = ["7X2K", "N4Q8", "M9R3", "K2V6", "F8P1", "C5T7", "Y3L9", "H6W4", "B1J8", "D7S2"];
  return fragments.slice(0, persona.mark === "RSK" ? 10 : 5).map((fragment) => `SMARTX-${persona.mark}-${fragment}`);
}

function makeLegacyCodes(persona: Persona) {
  const fragments = ["7X2K", "N4Q8", "M9R3", "K2V6", "F8P1", "C5T7", "Y3L9", "H6W4", "B1J8", "D7S2"];
  return fragments.slice(0, persona.code === "OWL" ? 10 : 5).map((fragment) => `SMARTX-${persona.code}-${fragment}`);
}

const VALID_INVITE_CODES = new Set([
  "123456",
  ...Object.values(PERSONAS).flatMap((persona) => [...makeCodes(persona), ...makeLegacyCodes(persona)]),
]);

function getInviteError(code: string) {
  if (USED_INVITE_CODES.has(code)) return "This invite has already been claimed. Ask for another one.";
  if (LOCKED_INVITE_CODES.has(code)) return "This invite is being used in another session. Try again in 2 minutes.";
  if (!VALID_INVITE_CODES.has(code)) return "Invite code not recognized. Check the code and try again.";
  return "";
}

function hashValue(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36).toUpperCase().padStart(7, "0");
}

function makeResultId(answerIds: readonly string[], identity: string) {
  return `SX-${hashValue(`${answerIds.join("")}:${identity.trim().toLowerCase() || "prototype"}`)}`;
}

function resolveOutcome(answerIds: readonly string[], identity = ""): Outcome {
  const normalized = QUESTIONS.map((question, index) => question.options.find((option) => option.id === answerIds[index]) ?? question.options[0]);
  const rawScores: Scores = { risk: 0, basis: 0, mode: 0 };
  const stats: StatScores = { conviction: 30, instinct: 30, resilience: 30 };
  normalized.forEach((option, index) => {
    rawScores[QUESTIONS[index].dimension] += option.value;
    Object.entries(option.statDelta).forEach(([stat, delta]) => { stats[stat as Stat] += delta; });
  });
  Object.keys(stats).forEach((stat) => { stats[stat as Stat] = Math.max(5, Math.min(99, stats[stat as Stat])); });

  const resolvePole = (dimension: Dimension): Pole => {
    if (rawScores[dimension] > 0) return AXES[dimension].positive;
    if (rawScores[dimension] < 0) return AXES[dimension].negative;
    const lastIndex = QUESTIONS.findLastIndex((question) => question.dimension === dimension);
    return normalized[lastIndex].value > 0 ? AXES[dimension].positive : AXES[dimension].negative;
  };

  const poles = [resolvePole("risk"), resolvePole("basis"), resolvePole("mode")] as const;
  const isRiskMonk = rawScores.risk === -4 && Math.abs(rawScores.basis) !== 4 && Math.abs(rawScores.mode) !== 4;
  const persona = isRiskMonk ? PERSONAS.OWL : PERSONAS[poles.join("|")];
  return { persona, poles, rawScores, stats, resultId: makeResultId(answerIds, identity) };
}

function makeRank(email: string) {
  const seed = [...email].reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return 7_900 + (seed % 1_800);
}

function makeInvitationUrl(code?: string, resultId?: string, useCurrentOrigin = false) {
  const base = useCurrentOrigin && typeof window !== "undefined" ? new URL("/waitlist/", window.location.origin).toString() : WAITLIST_URL;
  const url = new URL(base);
  if (resultId) url.searchParams.set("result", resultId);
  if (code) url.searchParams.set("invite", code);
  return url.toString();
}

function createSnapshot(outcome: Outcome): ResultSnapshot {
  return {
    version: 1, resultId: outcome.resultId, personaMark: outcome.persona.mark,
    poles: outcome.poles, rawScores: outcome.rawScores, stats: outcome.stats,
  };
}

function Brand() {
  return (
    <span className={styles.brand}>
      <Image
        src="/assets/consumer-network/logo-white.svg"
        alt=""
        width={34}
        height={28}
      />
      <span>SmartX</span>
    </span>
  );
}

function QuestionArtwork({ question }: { question: Question }) {
  return (
    <div className={styles.questionArtwork}>
      <Image src={question.artSrc} alt={question.artAlt} fill sizes="(max-width: 860px) 90vw, 540px" priority />
    </div>
  );
}

type PersonaPosterProps = {
  outcome: Outcome;
  preparedCards?: Partial<Record<ResultCardFormat, RenderedResultCard>>;
  exportError?: boolean;
  preview?: boolean;
};

function ScoreAxis({ label, score }: { label: string; score: number }) {
  return (
    <div className={styles.scoreAxis}>
      <div><span>{label}</span><strong>{score}</strong></div>
      <div className={styles.scoreTrack}><i style={{ width: `${score}%` }} /></div>
    </div>
  );
}

function PersonaPoster({ outcome, preparedCards, exportError, preview = false }: PersonaPosterProps) {
  const chemistry = CHEMISTRY[outcome.persona.mark];
  const bestMatch = PERSONAS_BY_CODE[chemistry.best];
  const rival = PERSONAS_BY_CODE[chemistry.rival];

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
        <span>{outcome.poles.join(" · ")}</span>
        <h2>{outcome.persona.name}</h2>
        <p>{outcome.persona.cn}</p>
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
      <blockquote>“{outcome.persona.roast}”</blockquote>
      <section className={styles.chemistryBlock} aria-label="Persona chemistry">
        <div><span>Best match</span><strong>{bestMatch.name}</strong><small>{bestMatch.cn}</small></div>
        <div><span>Natural rival</span><strong>{rival.name}</strong><small>{rival.cn}</small></div>
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
  const [stage, setStage] = useState<Stage>("gate");
  const [inviteCode, setInviteCode] = useState("");
  const [gateError, setGateError] = useState("");
  const [referralSnapshot, setReferralSnapshot] = useState<ResultSnapshot | null>(null);
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpResent, setOtpResent] = useState(false);
  const [telegramOpened, setTelegramOpened] = useState(false);
  const [xOpened, setXOpened] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answerIds, setAnswerIds] = useState<string[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [shared, setShared] = useState(false);
  const [invitePage, setInvitePage] = useState(0);
  const [preparedCards, setPreparedCards] = useState<Partial<Record<ResultCardFormat, RenderedResultCard>>>({});
  const [exportError, setExportError] = useState(false);

  const outcome = useMemo(() => {
    const completeAnswers = answerIds.length === QUESTIONS.length ? answerIds : DEFAULT_ANSWERS;
    return resolveOutcome(completeAnswers, email || inviteCode);
  }, [answerIds, email, inviteCode]);

  const referralOutcome = useMemo<Outcome | null>(() => {
    if (!referralSnapshot) return null;
    const persona = PERSONAS_BY_CODE[referralSnapshot.personaMark];
    return persona ? { ...referralSnapshot, persona } : null;
  }, [referralSnapshot]);

  const codes = useMemo(() => makeCodes(outcome.persona), [outcome.persona]);
  const invitations = useMemo(() => codes
    .map((code, index) => ({ code, index, used: code.endsWith(`-${PROTOTYPE_USED_INVITE_FRAGMENT}`) }))
    .sort((left, right) => Number(left.used) - Number(right.used)), [codes]);
  const invitePageCount = Math.ceil(invitations.length / INVITES_PER_PAGE);
  const visibleInvitations = invitations.slice(invitePage * INVITES_PER_PAGE, (invitePage + 1) * INVITES_PER_PAGE);
  const baseRank = useMemo(() => makeRank(email), [email]);
  const rank = Math.max(1, baseRank - (shared ? 137 : 0));
  const chemistry = CHEMISTRY[outcome.persona.mark];
  const bestMatch = PERSONAS_BY_CODE[chemistry.best];
  const rival = PERSONAS_BY_CODE[chemistry.rival];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("invite")?.trim().toUpperCase();
    const resultId = params.get("result")?.trim();
    if (resultId) {
      const stored = window.localStorage.getItem(`${SNAPSHOT_PREFIX}${resultId}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as Partial<ResultSnapshot>;
          if (parsed.stats && parsed.personaMark && parsed.poles && parsed.rawScores) setReferralSnapshot(parsed as ResultSnapshot);
          else {
            const fallback = resolveOutcome(DEFAULT_ANSWERS, resultId);
            setReferralSnapshot({ ...createSnapshot(fallback), resultId, personaMark: parsed.personaMark ?? fallback.persona.mark });
          }
        }
        catch { window.localStorage.removeItem(`${SNAPSHOT_PREFIX}${resultId}`); }
      } else {
        const legacyPersona = PERSONAS_BY_CODE[resultId.toUpperCase()];
        if (legacyPersona) {
          const fallback = resolveOutcome(DEFAULT_ANSWERS, resultId);
          setReferralSnapshot({ ...createSnapshot(fallback), resultId, personaMark: legacyPersona.mark });
        }
      }
    }
    if (!code) return;
    setInviteCode(code);
    const inviteError = getInviteError(code);
    if (inviteError) { setGateError(inviteError); return; }
    if (!resultId) setStage("quiz");
  }, []);

  useEffect(() => {
    if (stage === "result") window.localStorage.setItem(`${SNAPSHOT_PREFIX}${outcome.resultId}`, JSON.stringify(createSnapshot(outcome)));
  }, [stage, outcome]);

  useEffect(() => {
    if (stage !== "result") return;
    let disposed = false;
    let rendered: RenderedResultCard[] = [];
    setPreparedCards({});
    setExportError(false);
    const data = {
      ...outcome.persona,
      code: outcome.persona.mark,
      poles: outcome.poles,
      scores: outcome.stats,
      bestMatch: { name: bestMatch.name, cn: bestMatch.cn },
      rival: { name: rival.name, cn: rival.cn },
    };
    Promise.all([renderResultCard(data, "story"), renderResultCard(data, "og")])
      .then((cards) => {
        rendered = cards;
        if (disposed) { cards.forEach((card) => URL.revokeObjectURL(card.href)); return; }
        setPreparedCards({ story: cards[0], og: cards[1] });
      })
      .catch(() => { if (!disposed) setExportError(true); });
    return () => { disposed = true; rendered.forEach((card) => URL.revokeObjectURL(card.href)); };
  }, [stage, outcome, bestMatch, rival]);

  const beginQuiz = () => { setGateError(""); setQuestionIndex(0); setAnswerIds([]); setStage("quiz"); };
  const submitGate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedCode = inviteCode.trim().toUpperCase();
    const inviteError = getInviteError(normalizedCode);
    if (inviteError) { setGateError(inviteError); return; }
    setInviteCode(normalizedCode);
    beginQuiz();
  };
  const beginFromReferral = () => {
    const normalizedCode = inviteCode.trim().toUpperCase();
    const inviteError = getInviteError(normalizedCode);
    if (inviteError) { setReferralSnapshot(null); setGateError(inviteError); return; }
    beginQuiz();
  };
  const clearReferral = () => { setReferralSnapshot(null); setInviteCode(""); setGateError(""); window.history.replaceState({}, "", "/waitlist/"); };
  const submitEmail = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setOtp(""); setOtpError(""); setOtpResent(false); setStage("verify"); };
  const submitOtp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (otp !== OTP_CODE) { setOtpError("That code does not match. Check the six digits and try again."); return; }
    setOtpError(""); setTelegramOpened(false); setXOpened(false); setCopiedCode(null); setShared(false); setInvitePage(0); setEmailVerified(true); setStage("unlock");
  };
  const openCommunity = (network: "telegram" | "x") => {
    window.open(network === "telegram" ? "https://t.me/+CTeuBkpOxSNkN2Y0" : "https://x.com/SmartXTerminal", "_blank", "noopener,noreferrer");
    if (network === "telegram") setTelegramOpened(true); else setXOpened(true);
  };
  const answerQuestion = (option: QuizOption) => {
    const nextAnswers = [...answerIds.slice(0, questionIndex), option.id];
    setAnswerIds(nextAnswers);
    if (questionIndex === QUESTIONS.length - 1) { setShared(false); setInvitePage(0); setStage(emailVerified ? "unlock" : "email"); return; }
    setQuestionIndex((current) => current + 1);
  };
  const goBack = () => { if (questionIndex === 0) return; setAnswerIds((current) => current.slice(0, -1)); setQuestionIndex((current) => current - 1); };
  const shareResult = () => {
    const shareUrl = new URL("https://twitter.com/intent/tweet");
    shareUrl.searchParams.set("text", `My SmartX trader type is ${outcome.persona.name}.\n\n“${outcome.persona.roast}”\n\nFind yours in six questions.`);
    shareUrl.searchParams.set("url", makeInvitationUrl(codes[0], outcome.resultId, true));
    window.open(shareUrl.toString(), "_blank", "noopener,noreferrer");
    setShared(true);
  };
  const copyInvitation = async (code?: string) => {
    if (!code) return;
    await navigator.clipboard.writeText(makeInvitationUrl(code, outcome.resultId, true));
    setCopiedCode(code);
    window.setTimeout(() => setCopiedCode(null), 1400);
  };
  return (
    <main className={styles.page} data-stage={stage} data-referral={Boolean(referralOutcome)}>
      <a className={styles.skipLink} href="#waitlist-content">Skip to waitlist</a>
      <div className={styles.ambientBackdrop} aria-hidden="true">
        <Image
          src="/assets/consumer-network/hero-product.png"
          alt=""
          fill
          sizes="100vw"
          priority
        />
      </div>
      <ConsumerHeader active="waitlist" placement="page" />

      <section className={styles.stage} id="waitlist-content" aria-live="polite">
        {stage === "gate" && referralOutcome && (
          <div className={styles.referralStage}>
            <PersonaPoster outcome={referralOutcome} preview />
            <div className={styles.referralCopy}>
              <span className={styles.eyebrow}>A result was shared with you</span>
              <h1>A friend trades like<br />{referralOutcome.persona.name}.</h1>
              <p>Different score, same type—or something else entirely? Six decisions reveal how you trade when it gets real.</p>
              <button className={styles.primaryButton} type="button" onClick={beginFromReferral}>Find my trader type</button>
              <button className={styles.textButton} type="button" onClick={clearReferral}>Use another invite</button>
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
            <form className={styles.gateForm} onSubmit={submitGate}>
              <label htmlFor="invite-code">Invite code</label>
              <div className={styles.inlineField}>
                <input id="invite-code" type="text" autoComplete="off" autoCapitalize="characters" spellCheck={false} placeholder="SMARTX-RSK-7X2K" value={inviteCode} onChange={(event) => { setInviteCode(event.target.value.toUpperCase()); setGateError(""); }} aria-invalid={Boolean(gateError)} aria-describedby={gateError ? "invite-error" : "invite-note"} required />
                <button className={styles.primaryButton} type="submit">Begin</button>
              </div>
              {gateError ? <small className={styles.formError} id="invite-error" role="alert">{gateError}</small> : <small id="invite-note">Strictly invite-only. Your code is reserved when the test begins.</small>}
              <button className={styles.testCodeButton} type="button" onClick={() => { setInviteCode("123456"); setGateError(""); beginQuiz(); }}>Use prototype code</button>
            </form>
          </div>
        )}

        {stage === "quiz" && (
          <div className={styles.quizStage} key={questionIndex}>
            <div className={styles.quizTopline}>
              {questionIndex > 0 ? <button type="button" onClick={goBack}>← Back</button> : <span />}
              <div className={styles.progress} aria-label={`Question ${questionIndex + 1} of ${QUESTIONS.length}`}>
                {QUESTIONS.map((question, index) => <i key={question.prompt} data-active={index <= questionIndex} />)}
              </div>
            </div>
            <div className={styles.quizLayout}>
              <QuestionArtwork question={QUESTIONS[questionIndex]} />
              <div className={styles.questionPanel}>
                <h1>{QUESTIONS[questionIndex].prompt}</h1>
                <div className={styles.optionList}>
                  {QUESTIONS[questionIndex].options.map((option) => (
                    <button type="button" key={option.id} onClick={() => answerQuestion(option)}><i aria-hidden="true" /><span>{option.label}</span></button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {stage === "email" && (
          <div className={styles.formStage}>
            <span className={styles.eyebrow}>Your result is ready</span>
            <h1>Save your result.</h1>
            <p>Bind an email to save your result and join the waitlist.</p>
            <form onSubmit={submitEmail}>
              <label htmlFor="waitlist-email">Email address</label>
              <div className={styles.inlineField}>
                <input id="waitlist-email" type="email" autoComplete="email" placeholder="you@domain.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
                <button className={styles.primaryButton} type="submit">Continue</button>
              </div>
              <small>Prototype only · no data is submitted.</small>
            </form>
          </div>
        )}

        {stage === "verify" && (
          <div className={styles.formStage}>
            <span className={styles.eyebrow}>Check your inbox</span>
            <h1>Six digits.</h1>
            <p>Enter the code sent to <b>{email}</b>.</p>
            <form onSubmit={submitOtp}>
              <label htmlFor="waitlist-otp">Verification code</label>
              <div className={styles.inlineField}>
                <input className={styles.otpInput} id="waitlist-otp" type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={otp} onChange={(event) => { setOtp(event.target.value.replace(/\D/g, "").slice(0, 6)); setOtpError(""); }} aria-invalid={Boolean(otpError)} aria-describedby={otpError ? "otp-error" : "otp-note"} placeholder="••••••" autoFocus required />
                <button className={styles.primaryButton} type="submit">Continue</button>
              </div>
              {otpError ? <small className={styles.formError} id="otp-error" role="alert">{otpError}</small> : <small id="otp-note">Prototype code · <b>{OTP_CODE}</b></small>}
              <div className={styles.formMeta}>
                <button type="button" onClick={() => { setOtpResent(true); setOtpError(""); }}>{otpResent ? "Code sent again" : "Resend code"}</button>
                <button type="button" onClick={() => setStage("email")}>Change email</button>
              </div>
            </form>
          </div>
        )}

        {stage === "unlock" && (
          <div className={styles.unlockStage}>
            <span className={styles.eyebrow}>One last step</span>
            <h1>Unlock your result.</h1>
            <p>Join the SmartX community and follow product updates before your trader type is revealed.</p>
            <div className={styles.unlockTasks}>
              <button type="button" aria-pressed={telegramOpened} data-complete={telegramOpened} onClick={() => openCommunity("telegram")}>
                <FaTelegramPlane aria-hidden="true" />
                <span><b>Join Telegram</b><small>Enter the SmartX community</small></span>
                <strong>{telegramOpened ? "Done ✓" : "Open ↗"}</strong>
              </button>
              <button type="button" aria-pressed={xOpened} data-complete={xOpened} onClick={() => openCommunity("x")}>
                <FaXTwitter aria-hidden="true" />
                <span><b>Follow SmartX on X</b><small>Follow product updates</small></span>
                <strong>{xOpened ? "Done ✓" : "Open ↗"}</strong>
              </button>
            </div>
            <button className={styles.primaryButton} type="button" disabled={!telegramOpened || !xOpened} onClick={() => setStage("result")}>Reveal my result</button>
            <small>Both steps are required to continue.</small>
          </div>
        )}

        {stage === "result" && (
          <div className={styles.resultStage}>
            <PersonaPoster outcome={outcome} preparedCards={preparedCards} exportError={exportError} />
            <aside className={styles.resultPanel}>
              <div className={styles.rankBlock} data-boosted={shared}>
                <span>Waitlist rank</span>
                <strong key={rank}>#{rank.toLocaleString("en-US")}</strong>
                <div className={styles.rankRewards}>
                  <div data-applied={shared}>
                    <span>{shared ? "Share reward applied" : "First result share"}</span>
                    <b>+500 priority</b>
                  </div>
                  <div>
                    <span>Each verified friend</span>
                    <b>+500 priority</b>
                  </div>
                </div>
                <small>Priority improves your score; rank updates against the live waitlist.</small>
                <button className={styles.shareButton} type="button" onClick={shareResult}>{shared ? "Share again" : "Share result"}</button>
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
                      <button type="button" aria-label="Previous five invites" disabled={invitePage === 0} onClick={() => setInvitePage((current) => current - 1)}>←</button>
                      <button type="button" aria-label="Next five invites" disabled={invitePage === invitePageCount - 1} onClick={() => setInvitePage((current) => current + 1)}>→</button>
                    </div>
                  )}
                </header>
                <div className={styles.inviteCardGrid}>
                  {visibleInvitations.map((invitation) => {
                    const shortCode = invitation.code.split("-").at(-1);
                    const isCopied = copiedCode === invitation.code;
                    return (
                      <button
                        className={styles.inviteCodeCard}
                        data-copied={isCopied}
                        data-used={invitation.used}
                        disabled={invitation.used}
                        key={invitation.code}
                        type="button"
                        aria-label={invitation.used ? `Invite ${shortCode} used` : `Copy invite link ${shortCode}`}
                        onClick={() => copyInvitation(invitation.code)}
                      >
                        <header>
                          <span>Invite {String(invitation.index + 1).padStart(2, "0")}</span>
                          <i aria-hidden="true" />
                        </header>
                        <div aria-hidden="true"><strong>{invitation.used ? "—" : isCopied ? "✓" : "↗"}</strong></div>
                        <footer>
                          <span>{shortCode}</span>
                          {(invitation.used || isCopied) && <b>{invitation.used ? "Used" : "Copied"}</b>}
                        </footer>
                      </button>
                    );
                  })}
                </div>
              </section>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
