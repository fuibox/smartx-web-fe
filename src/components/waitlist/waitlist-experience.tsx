"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState, type CSSProperties } from "react";
import { FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import { renderResultCard, type RenderedResultCard, type ResultCardFormat } from "./result-card-export";
import styles from "./waitlist.module.css";

type Stage = "gate" | "quiz" | "email" | "verify" | "result";
type Dimension = "risk" | "signal" | "social";
type Pole = "DEGEN" | "SNIPER" | "GUT" | "DATA" | "PACK" | "LONE";
type Stat = "conviction" | "instinct" | "resilience";

type QuizOption = {
  id: "A" | "B" | "C" | "D";
  label: string;
  pole: Pole;
  stats: Partial<Record<Stat, number>>;
};

type Question = {
  dimension: Dimension;
  prompt: string;
  options: readonly QuizOption[];
};

type Animal = {
  name: string;
  cn: string;
  code: string;
  rarity: number;
  verdict: string;
  partner: string;
  enemy: string;
};

const QUESTIONS: readonly Question[] = [
  {
    dimension: "signal",
    prompt: "You wake in the middle of the night. What calls you first?",
    options: [
      { id: "A", label: "The chart. If I am awake, the market must be saying something.", pole: "DATA", stats: { instinct: 10 } },
      { id: "B", label: "The price. One glance tells me the mood.", pole: "GUT", stats: { resilience: 10 } },
      { id: "C", label: "The timeline. I want to know what everyone is seeing.", pole: "GUT", stats: { instinct: 5, conviction: 5 } },
      { id: "D", label: "Nothing. Sleep is the best stop-loss.", pole: "DATA", stats: { resilience: 15 } },
    ],
  },
  {
    dimension: "risk",
    prompt: "A coin you do not own is up 40%. What do you do?",
    options: [
      { id: "A", label: "Buy now. Momentum rarely waits.", pole: "DEGEN", stats: { conviction: 15 } },
      { id: "B", label: "Open the chart for research. The order is already placed.", pole: "DEGEN", stats: { conviction: 10, instinct: 5 } },
      { id: "C", label: "Set my entry and wait.", pole: "SNIPER", stats: { instinct: 10 } },
      { id: "D", label: "Watch. Every spike eventually cools.", pole: "SNIPER", stats: { resilience: 10, instinct: 5 } },
    ],
  },
  {
    dimension: "social",
    prompt: "Your position drops 30%. Who hears about it?",
    options: [
      { id: "A", label: "The group chat. Shared pain is lighter.", pole: "PACK", stats: { conviction: 5 } },
      { id: "B", label: "No one. I close it and move on.", pole: "LONE", stats: { resilience: 15 } },
      { id: "C", label: "Everyone. I buy more and call the dip.", pole: "PACK", stats: { conviction: 15 } },
      { id: "D", label: "Only me. Some losses stay private.", pole: "LONE", stats: { resilience: 10 } },
    ],
  },
  {
    dimension: "signal",
    prompt: "Where do your strongest trade ideas come from?",
    options: [
      { id: "A", label: "Charts and data.", pole: "DATA", stats: { instinct: 15 } },
      { id: "B", label: "Wallets I quietly track.", pole: "DATA", stats: { instinct: 10, conviction: 5 } },
      { id: "C", label: "The group chat, right after someone says ‘send it.’", pole: "GUT", stats: { conviction: 10 } },
      { id: "D", label: "Instinct. The idea arrives before the evidence.", pole: "GUT", stats: { conviction: 10, instinct: 5 } },
    ],
  },
  {
    dimension: "risk",
    prompt: "What kind of leverage feels right?",
    options: [
      { id: "A", label: "Spot only. Patience is enough.", pole: "SNIPER", stats: { resilience: 15 } },
      { id: "B", label: "3×. Enough power, enough restraint.", pole: "SNIPER", stats: { resilience: 10 } },
      { id: "C", label: "20×. Otherwise the market feels too quiet.", pole: "DEGEN", stats: { conviction: 15 } },
      { id: "D", label: "Whatever makes the liquidation price look theoretical.", pole: "DEGEN", stats: { conviction: 10, instinct: -5 } },
    ],
  },
  {
    dimension: "social",
    prompt: "You catch a 10×. Who hears first?",
    options: [
      { id: "A", label: "Screenshot, group chat, X.", pole: "PACK", stats: { conviction: 10 } },
      { id: "B", label: "Nowhere. I take profit and keep it quiet.", pole: "LONE", stats: { resilience: 10, instinct: 5 } },
      { id: "C", label: "My friends. Good fortune should be shared.", pole: "PACK", stats: { conviction: 10, resilience: 5 } },
      { id: "D", label: "Back into the market. My game, my pace.", pole: "LONE", stats: { conviction: 10, resilience: 5 } },
    ],
  },
];

const ANIMALS: Record<string, Animal> = {
  "DEGEN|GUT|PACK": { name: "Degen Ape", cn: "梭哈猿", code: "APE", rarity: 17, verdict: "You do not trade. You donate to the market — and once in a while, it builds you a statue.", partner: "Moon Wolf", enemy: "Shadow Cat" },
  "DEGEN|GUT|LONE": { name: "Moon Wolf", cn: "月嚎狼", code: "WOLF", rarity: 11, verdict: "You howl once, then bet everything. The pack follows the sound — into glory or the void.", partner: "Degen Ape", enemy: "Diamond Turtle" },
  "DEGEN|DATA|PACK": { name: "Echo Parrot", cn: "复读鹦鹉", code: "PARROT", rarity: 14, verdict: "The group says send it, you send it. Good news: you are never alone. Bad news: you get liquidated together.", partner: "Whale Whisperer", enemy: "Hibernating Bear" },
  "DEGEN|DATA|LONE": { name: "Chart Fox", cn: "图表狐", code: "FOX", rarity: 15, verdict: "You have drawn more trendlines than life plans. Shame the market does not read your charts.", partner: "Shadow Cat", enemy: "Degen Ape" },
  "SNIPER|GUT|PACK": { name: "Diamond Turtle", cn: "钻石龟", code: "TURTLE", rarity: 13, verdict: "Your bags survived three bear markets. Not faith — you forgot the password.", partner: "Hibernating Bear", enemy: "Moon Wolf" },
  "SNIPER|GUT|LONE": { name: "Hibernating Bear", cn: "冬眠熊", code: "BEAR", rarity: 5, verdict: "You sleep through 99% of the market. The 1% you are awake, something gets mauled.", partner: "Diamond Turtle", enemy: "Echo Parrot" },
  "SNIPER|DATA|PACK": { name: "Whale Whisperer", cn: "鲸语者", code: "WHALE", rarity: 9, verdict: "You do not trade. You stalk the people who do. When the smart money moves, you move — eventually.", partner: "Echo Parrot", enemy: "The Owl" },
  "SNIPER|DATA|LONE": { name: "Shadow Cat", cn: "影猫", code: "CAT", rarity: 12, verdict: "You lurk for three months for one strike. The day you strike, the exchange goes down.", partner: "Chart Fox", enemy: "Degen Ape" },
  OWL: { name: "The Owl", cn: "猫头鹰", code: "OWL", rarity: 4, verdict: "Awake while everyone celebrates. Calm while everyone panics. We built SmartX looking for you.", partner: "Shadow Cat", enemy: "None on record" },
};

const OWL_SIGNATURE = ["D", "D", "B", "A", "B", "B"] as const;
const AXES: Record<Dimension, readonly Pole[]> = {
  risk: ["DEGEN", "SNIPER"],
  signal: ["GUT", "DATA"],
  social: ["PACK", "LONE"],
};
const ROMAN = ["I", "II", "III", "IV", "V", "VI"] as const;
const WAITLIST_URL = "https://smartx.io/waitlist/";
const OTP_CODE = "824193";

function clampScore(value: number) {
  return Math.min(99, Math.max(5, value));
}

function resolvePole(answers: readonly QuizOption[], dimension: Dimension) {
  const relevant = answers.filter((_, index) => QUESTIONS[index].dimension === dimension);
  const [first, second] = AXES[dimension];
  const firstCount = relevant.filter((answer) => answer.pole === first).length;
  const secondCount = relevant.filter((answer) => answer.pole === second).length;
  if (firstCount === secondCount) return relevant.at(-1)?.pole ?? first;
  return firstCount > secondCount ? first : second;
}

function resolveOutcome(answerIds: readonly string[]) {
  const answers = answerIds.map((answerId, index) => (
    QUESTIONS[index].options.find((option) => option.id === answerId) ?? QUESTIONS[index].options[0]
  ));
  const owlHits = answerIds.filter((answerId, index) => answerId === OWL_SIGNATURE[index]).length;
  const risk = resolvePole(answers, "risk");
  const signal = resolvePole(answers, "signal");
  const social = resolvePole(answers, "social");
  const animal = owlHits >= 4 ? ANIMALS.OWL : ANIMALS[`${risk}|${signal}|${social}`];
  const stats = answers.reduce(
    (total, answer) => ({
      conviction: total.conviction + (answer.stats.conviction ?? 0),
      instinct: total.instinct + (answer.stats.instinct ?? 0),
      resilience: total.resilience + (answer.stats.resilience ?? 0),
    }),
    { conviction: 30, instinct: 30, resilience: 30 },
  );

  return {
    animal,
    poles: [risk, signal, social],
    stats: {
      conviction: clampScore(stats.conviction),
      instinct: clampScore(stats.instinct),
      resilience: clampScore(stats.resilience),
    },
  };
}

function makeCodes(animal: Animal) {
  const fragments = ["7X2K", "N4Q8", "M9R3", "K2V6", "F8P1", "C5T7", "Y3L9", "H6W4", "B1J8", "D7S2"];
  const count = animal.code === "OWL" ? 10 : 5;
  return fragments.slice(0, count).map((fragment) => `SMARTX-${animal.code}-${fragment}`);
}

const VALID_INVITE_CODES = new Set(
  ["123456", ...Object.values(ANIMALS).flatMap((animal) => makeCodes(animal))],
);

function makePosition(email: string) {
  const seed = [...email].reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return 7_900 + (seed % 1_800);
}

function makeInvitationUrl(code?: string) {
  const url = new URL(WAITLIST_URL);
  if (code) url.searchParams.set("invite", code);
  return url.toString();
}

export function WaitlistExperience() {
  const [stage, setStage] = useState<Stage>("gate");
  const [inviteCode, setInviteCode] = useState("");
  const [gateError, setGateError] = useState("");
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
  const [inviteIndex, setInviteIndex] = useState(0);
  const [preparedCards, setPreparedCards] = useState<Partial<Record<ResultCardFormat, RenderedResultCard>>>({});
  const [exportError, setExportError] = useState(false);

  const outcome = useMemo(() => {
    if (answerIds.length !== QUESTIONS.length) return resolveOutcome(OWL_SIGNATURE);
    return resolveOutcome(answerIds);
  }, [answerIds]);
  const codes = useMemo(() => makeCodes(outcome.animal), [outcome.animal]);
  const basePosition = useMemo(() => makePosition(email), [email]);
  const position = Math.max(1, basePosition - (shared ? 500 : 0));
  const selectedCode = codes.at(inviteIndex);
  const invitationUrl = makeInvitationUrl(selectedCode);
  const socialReady = telegramOpened && xOpened;
  const signsRemaining = Number(!telegramOpened) + Number(!xOpened);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("invite")?.trim().toUpperCase();
    if (!code) return;
    setInviteCode(code);
    if (VALID_INVITE_CODES.has(code)) {
      setStage("quiz");
      return;
    }
    setGateError("This invite code isn’t valid.");
  }, []);

  useEffect(() => {
    if (stage !== "result") return;
    let disposed = false;
    let rendered: RenderedResultCard[] = [];
    setPreparedCards({});
    setExportError(false);
    const data = {
      ...outcome.animal,
      poles: outcome.poles,
      stats: outcome.stats,
    };
    Promise.all([
      renderResultCard(data, "story"),
      renderResultCard(data, "og"),
    ]).then((cards) => {
      rendered = cards;
      if (disposed) {
        cards.forEach((card) => URL.revokeObjectURL(card.href));
        return;
      }
      setPreparedCards({ story: cards[0], og: cards[1] });
    }).catch(() => {
      if (!disposed) setExportError(true);
    });
    return () => {
      disposed = true;
      rendered.forEach((card) => URL.revokeObjectURL(card.href));
    };
  }, [stage, outcome]);

  const submitGate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedCode = inviteCode.trim().toUpperCase();
    if (!VALID_INVITE_CODES.has(normalizedCode)) {
      setGateError("This invite code isn’t valid.");
      return;
    }
    setInviteCode(normalizedCode);
    setGateError("");
    setQuestionIndex(0);
    setAnswerIds([]);
    setStage("quiz");
  };

  const submitEmail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setOtp("");
    setOtpError("");
    setOtpResent(false);
    setStage("verify");
  };

  const submitOtp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (otp !== OTP_CODE) {
      setOtpError("That code does not match. Check the six digits and try again.");
      return;
    }
    setOtpError("");
    setTelegramOpened(false);
    setXOpened(false);
    setCopiedCode(null);
    setShared(false);
    setInviteIndex(0);
    setEmailVerified(true);
    setStage("result");
  };

  const openCommunity = (network: "telegram" | "x") => {
    const url = network === "telegram"
      ? "https://t.me/+CTeuBkpOxSNkN2Y0"
      : "https://x.com/SmartXTerminal";
    window.open(url, "_blank", "noopener,noreferrer");
    if (network === "telegram") setTelegramOpened(true);
    if (network === "x") setXOpened(true);
  };

  const answerQuestion = (option: QuizOption) => {
    const nextAnswers = [...answerIds.slice(0, questionIndex), option.id];
    setAnswerIds(nextAnswers);
    if (questionIndex === QUESTIONS.length - 1) {
      setShared(false);
      setInviteIndex(0);
      setStage(emailVerified ? "result" : "email");
      return;
    }
    setQuestionIndex((current) => current + 1);
  };

  const goBack = () => {
    if (questionIndex === 0) return;
    setAnswerIds((current) => current.slice(0, -1));
    setQuestionIndex((current) => current - 1);
  };

  const shareResult = () => {
    const identity = outcome.animal.code === "OWL" ? "I’m The Owl" : `I’m a ${outcome.animal.name}`;
    const text = `${identity} — rarer than ${100 - outcome.animal.rarity}% of traders.\n\nConviction ${outcome.stats.conviction} · Instinct ${outcome.stats.instinct} · Resilience ${outcome.stats.resilience}\n\nFind your Trading Spirit Animal.`;
    const shareUrl = new URL("https://twitter.com/intent/tweet");
    shareUrl.searchParams.set("text", text);
    shareUrl.searchParams.set("url", makeInvitationUrl());
    window.open(shareUrl.toString(), "_blank", "noopener,noreferrer");
    setShared(true);
  };

  const shareInvitation = () => {
    if (!selectedCode) return;
    const shareUrl = new URL("https://twitter.com/intent/tweet");
    shareUrl.searchParams.set("text", `I have a one-time SmartX invite. Claim invite ${ROMAN[inviteIndex] ?? inviteIndex + 1} before someone else does.`);
    shareUrl.searchParams.set("url", invitationUrl);
    window.open(shareUrl.toString(), "_blank", "noopener,noreferrer");
  };

  const copyInvitation = async (code?: string) => {
    const copyKey = code ?? "activity";
    await navigator.clipboard.writeText(makeInvitationUrl(code));
    setCopiedCode(copyKey);
    window.setTimeout(() => setCopiedCode(null), 1400);
  };

  const restart = () => {
    setStage("quiz");
    setTelegramOpened(false);
    setXOpened(false);
    setQuestionIndex(0);
    setAnswerIds([]);
    setCopiedCode(null);
    setShared(false);
    setInviteIndex(0);
    setPreparedCards({});
    setExportError(false);
  };

  return (
    <main className={styles.page}>
      <a className={styles.skipLink} href="#waitlist-content">Skip to waitlist</a>

      <header className={styles.header}>
        <Link href="/" aria-label="SmartX home" className={styles.logo}>
          <Image src="/assets/smartx-logo.svg" alt="" width={218} height={42} priority />
        </Link>
        <span className={styles.prototypeFlag}>Prototype · No data saved</span>
      </header>

      <section className={styles.stage} id="waitlist-content" aria-live="polite">
        {stage === "gate" && (
          <div className={styles.gateStage}>
            <h1>Enter your<br /><em>invite.</em></h1>
            <p className={styles.lede}>
              Use your one-time invite to unlock the 40-second trader type test.
            </p>
            <form className={styles.gateForm} onSubmit={submitGate}>
              <label htmlFor="invite-code">Invite code</label>
              <div className={styles.inputRow}>
                <input
                  id="invite-code"
                  type="text"
                  autoComplete="off"
                  autoCapitalize="characters"
                  spellCheck={false}
                  placeholder="SMARTX-OWL-7X2K"
                  value={inviteCode}
                  onChange={(event) => {
                    setInviteCode(event.target.value.toUpperCase());
                    setGateError("");
                  }}
                  aria-invalid={Boolean(gateError)}
                  aria-describedby={gateError ? "invite-error" : "invite-note"}
                  required
                />
                <button type="submit"><span>Continue</span><i aria-hidden="true">→</i></button>
              </div>
              {gateError
                ? <small className={styles.gateError} id="invite-error" role="alert">{gateError}</small>
                : <small id="invite-note">Each invite can be claimed once. It is reserved while you finish the test.</small>}
            </form>
          </div>
        )}

        {stage === "email" && (
          <div className={styles.joinStage}>
            <h1>Save your<em>result.</em></h1>
            <p className={styles.lede}>
              Enter your email to reveal your trader type and activate your waitlist position.
            </p>
            <form className={styles.joinForm} onSubmit={submitEmail}>
              <label htmlFor="waitlist-email">Email address</label>
              <div className={styles.inputRow}>
                <input
                  id="waitlist-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@domain.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
                <button type="submit"><span>Save my result</span><i aria-hidden="true">→</i></button>
              </div>
              <small>Prototype only · your email stays in this browser and is not submitted.</small>
            </form>
          </div>
        )}

        {stage === "verify" && (
          <div className={styles.otpStage}>
            <h1>Confirm your<br /><em>email.</em></h1>
            <p className={styles.lede}>
              We sent a six-digit code to <b>{email}</b>. Verify it to activate your waitlist position.
            </p>
            <form className={styles.otpForm} onSubmit={submitOtp}>
              <label htmlFor="waitlist-otp">Verification code</label>
              <input
                className={styles.otpInput}
                id="waitlist-otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                value={otp}
                onChange={(event) => {
                  setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));
                  setOtpError("");
                }}
                aria-invalid={Boolean(otpError)}
                aria-describedby={otpError ? "otp-error" : "otp-note"}
                placeholder="••••••"
                autoFocus
                required
              />
              <button className={styles.verifyButton} type="submit">
                <span>Activate my position</span><i aria-hidden="true">→</i>
              </button>
              {otpError
                ? <small className={styles.otpError} id="otp-error" role="alert">{otpError}</small>
                : <small id="otp-note">Prototype verification code · <b>{OTP_CODE}</b></small>}
              <div className={styles.otpMeta}>
                <button type="button" onClick={() => { setOtpResent(true); setOtpError(""); }}>Resend code</button>
                <span>{otpResent ? "A new code was sent." : "Code expires in 10 minutes."}</span>
                <button type="button" onClick={() => { setEmailVerified(false); setStage("email"); }}>Change email</button>
              </div>
            </form>
          </div>
        )}

        {stage === "quiz" && (
          <div className={styles.quizStage} key={questionIndex}>
            <div className={styles.quizTopline}>
              {questionIndex > 0 ? <button className={styles.backButton} type="button" onClick={goBack}>← Previous</button> : <span />}
              <span aria-label={`Question ${questionIndex + 1} of ${QUESTIONS.length}`}>{questionIndex + 1} / {QUESTIONS.length}</span>
            </div>
            <header className={styles.questionHeader}>
              <h1>{QUESTIONS[questionIndex].prompt}</h1>
            </header>
            <div className={styles.cardSpread}>
              {QUESTIONS[questionIndex].options.map((option, index) => (
                <button type="button" key={option.id} onClick={() => answerQuestion(option)}>
                  <span className={styles.cardRoman}>{ROMAN[index]}</span>
                  <span className={styles.cardArt} aria-hidden="true">
                    <Image
                      src={`/assets/waitlist/cards/q${questionIndex + 1}-${option.id.toLowerCase()}.webp`}
                      alt=""
                      fill
                      priority={index === 0}
                      sizes="(max-width: 520px) calc(100vw - 80px), (max-width: 820px) 44vw, 280px"
                    />
                  </span>
                  <span className={styles.cardAnswer}>{option.label}</span>
                  <small>Select <i aria-hidden="true">→</i></small>
                </button>
              ))}
            </div>
          </div>
        )}

        {stage === "result" && (
          <div className={styles.resultStage}>
            <article className={styles.resultCard} data-owl={outcome.animal.code === "OWL"}>
              <span className={styles.resultSheen} aria-hidden="true" />
              <header>
                <Image className={styles.resultLogo} src="/assets/smartx-logo.svg" alt="SmartX" width={218} height={42} />
                <span>Trading Spirit Animal</span>
              </header>
              <div className={styles.resultIdentity}>
                <p>{outcome.animal.code === "OWL" ? "Hidden gilded edition · 4%" : "Your trading spirit is"}</p>
                <h1>{outcome.animal.name}</h1>
                <span>{outcome.animal.cn}</span>
              </div>
              <div className={styles.resultArtwork}>
                <Image
                  src={`/assets/waitlist/spirits/${outcome.animal.code.toLowerCase()}.webp`}
                  alt={`${outcome.animal.name} celestial tarot illustration`}
                  fill
                  sizes="240px"
                  priority
                />
                <span>{outcome.poles.join(" · ")}</span>
              </div>
              <blockquote>“{outcome.animal.verdict}”</blockquote>
              <div className={styles.statList}>
                {Object.entries(outcome.stats).map(([label, score]) => (
                  <div key={label}>
                    <span>{label}</span>
                    <i><b style={{ "--score": `${score}%` } as CSSProperties} /></i>
                    <strong>{score}</strong>
                  </div>
                ))}
              </div>
              <div className={styles.affinityRow}>
                <div><span>Best match</span><strong>{outcome.animal.partner}</strong></div>
                <div><span>Natural rival</span><strong>{outcome.animal.enemy}</strong></div>
              </div>
              <section className={styles.cardDownloads}>
                <header><span>Download result</span><b>PNG</b></header>
                <div>
                  {preparedCards.story ? (
                    <a href={preparedCards.story.href} download={preparedCards.story.filename}>
                      <span>Story</span><small>1080 × 1920</small>
                    </a>
                  ) : (
                    <span className={styles.savePlaceholder}><span>Story</span><small>{exportError ? "Unavailable" : "Preparing…"}</small></span>
                  )}
                  {preparedCards.og ? (
                    <a href={preparedCards.og.href} download={preparedCards.og.filename}>
                      <span>X / OG</span><small>1200 × 630</small>
                    </a>
                  ) : (
                    <span className={styles.savePlaceholder}><span>X / OG</span><small>{exportError ? "Unavailable" : "Preparing…"}</small></span>
                  )}
                </div>
              </section>
              <footer><span>Rarer than {100 - outcome.animal.rarity}% of traders</span><b>For entertainment, not financial advice.</b></footer>
            </article>

            <aside className={styles.accessPanel}>
              <div className={styles.rankPanel} data-boosted={shared}>
                <div>
                  <span>Your waitlist position</span>
                  <strong key={position}>#{position.toLocaleString("en-US")}</strong>
                  <small>{shared ? "Shared · moved up 500 places" : "Email verified · position active"}</small>
                </div>
                <p><b>+500 places</b><span>for every trader who enters through one of your invitation links</span></p>
              </div>

              <section className={styles.growthPanel}>
                <header>
                  <span>Share & invite</span>
                  <b>{codes.length} invites</b>
                </header>
                {!shared ? (
                  <>
                    <p>Complete both, then share your result to unlock invites and move up 500 places.</p>
                    <div className={styles.growthSteps}>
                      <button type="button" data-complete={telegramOpened} onClick={() => openCommunity("telegram")}>
                        <FaTelegramPlane aria-hidden="true" />
                        <b>Join Telegram</b>
                        <i>{telegramOpened ? "Done ✓" : "Open ↗"}</i>
                      </button>
                      <button type="button" data-complete={xOpened} onClick={() => openCommunity("x")}>
                        <FaXTwitter aria-hidden="true" />
                        <b>Follow on X</b>
                        <i>{xOpened ? "Done ✓" : "Open ↗"}</i>
                      </button>
                    </div>
                    <button className={styles.growthButton} type="button" disabled={!socialReady} onClick={shareResult}>
                      {socialReady ? "Share result & unlock" : `${signsRemaining} ${signsRemaining === 1 ? "step" : "steps"} remaining`}
                      <span>{socialReady ? "↗" : ""}</span>
                    </button>
                  </>
                ) : (
                  <section className={styles.invitationDeck} aria-label="Invitation card deck">
                    <div className={styles.inviteCard} data-owl={outcome.animal.code === "OWL"} key={selectedCode}>
                      <header><span>SmartX invite</span><b>One-time · No. {inviteIndex + 1}</b></header>
                      <div className={styles.inviteSigil} aria-hidden="true">✦</div>
                      {selectedCode && <strong>{selectedCode}</strong>}
                      <code>{invitationUrl.replace("https://", "")}</code>
                      <footer><span>Unused</span><b>Claim once</b></footer>
                    </div>
                    <div className={styles.deckActions}>
                      <button type="button" onClick={() => copyInvitation(selectedCode)}>
                        {copiedCode === selectedCode ? "Invitation copied ✓" : "Copy this invitation"}
                      </button>
                      <button type="button" onClick={shareInvitation}>Send on X ↗</button>
                    </div>
                    <div className={styles.deckNavigation}>
                      <button type="button" disabled={inviteIndex === 0} onClick={() => setInviteIndex((current) => current - 1)}>← Previous</button>
                      <span>{inviteIndex + 1} of {codes.length}</span>
                      <button type="button" disabled={inviteIndex === codes.length - 1} onClick={() => setInviteIndex((current) => current + 1)}>Next →</button>
                    </div>
                  </section>
                )}
              </section>
              <button className={styles.restartButton} type="button" onClick={restart}>Take the test again</button>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
