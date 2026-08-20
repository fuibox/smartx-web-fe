"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState, type CSSProperties } from "react";
import { FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import { renderResultCard, type RenderedResultCard, type ResultCardFormat } from "./result-card-export";
import styles from "./waitlist.module.css";

type Stage = "gate" | "join" | "verify" | "connect" | "quiz" | "result";
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
  context: string;
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
    context: "03:17 · THE HOUSE OF SIGNAL",
    prompt: "You wake in the middle of the night. What calls you first?",
    options: [
      { id: "A", label: "The chart. If I am awake, the market must be saying something.", pole: "DATA", stats: { instinct: 10 } },
      { id: "B", label: "The price. One glance is enough to know the mood.", pole: "GUT", stats: { resilience: 10 } },
      { id: "C", label: "The timeline. I need to hear what the crowd is whispering.", pole: "GUT", stats: { instinct: 5, conviction: 5 } },
      { id: "D", label: "Nothing. Sleep is the oldest and best stop-loss.", pole: "DATA", stats: { resilience: 15 } },
    ],
  },
  {
    dimension: "risk",
    context: "+40% · THE HOUSE OF RISK",
    prompt: "A coin you do not own rises 40%. Which path appears?",
    options: [
      { id: "A", label: "Enter now. The portal may close before I hesitate.", pole: "DEGEN", stats: { conviction: 15 } },
      { id: "B", label: "Open the chart for research. The order is already placed.", pole: "DEGEN", stats: { conviction: 10, instinct: 5 } },
      { id: "C", label: "Mark my price and wait for the market to return to me.", pole: "SNIPER", stats: { instinct: 10 } },
      { id: "D", label: "Watch from afar. Every comet eventually loses its fire.", pole: "SNIPER", stats: { resilience: 10, instinct: 5 } },
    ],
  },
  {
    dimension: "social",
    context: "−30% · THE HOUSE OF TRIBE",
    prompt: "Your position falls 30%. Who witnesses the loss?",
    options: [
      { id: "A", label: "The group chat. Shared pain is lighter pain.", pole: "PACK", stats: { conviction: 5 } },
      { id: "B", label: "No one. I close the position and close the door.", pole: "LONE", stats: { resilience: 15 } },
      { id: "C", label: "Everyone. I buy more and call the tribe to the dip.", pole: "PACK", stats: { conviction: 15 } },
      { id: "D", label: "Only me. Some grief belongs off-chain.", pole: "LONE", stats: { resilience: 10 } },
    ],
  },
  {
    dimension: "signal",
    context: "SOURCE · THE HOUSE OF SIGNAL",
    prompt: "Where do your strongest trade ideas reveal themselves?",
    options: [
      { id: "A", label: "In charts and data. Numbers leave fewer ghosts.", pole: "DATA", stats: { instinct: 15 } },
      { id: "B", label: "In the wallets I quietly follow through the night.", pole: "DATA", stats: { instinct: 10, conviction: 5 } },
      { id: "C", label: "In the group chat, just after somebody says ‘send it.’", pole: "GUT", stats: { conviction: 10 } },
      { id: "D", label: "In dreams, showers, and unexplainable conviction.", pole: "GUT", stats: { conviction: 10, instinct: 5 } },
    ],
  },
  {
    dimension: "risk",
    context: "LEVERAGE · THE HOUSE OF RISK",
    prompt: "The cards offer leverage. What do you accept?",
    options: [
      { id: "A", label: "Spot only. Patience is leverage enough.", pole: "SNIPER", stats: { resilience: 15 } },
      { id: "B", label: "Three times. Enough power, enough restraint.", pole: "SNIPER", stats: { resilience: 10 } },
      { id: "C", label: "Twenty times or the future feels too quiet.", pole: "DEGEN", stats: { conviction: 15 } },
      { id: "D", label: "Whatever makes ‘liquidation price’ sound theoretical.", pole: "DEGEN", stats: { conviction: 10, instinct: -5 } },
    ],
  },
  {
    dimension: "social",
    context: "10× · THE HOUSE OF TRIBE",
    prompt: "You catch a 10×. Where does the story travel next?",
    options: [
      { id: "A", label: "Screenshot, group chat, X — the ritual order.", pole: "PACK", stats: { conviction: 10 } },
      { id: "B", label: "Nowhere. I take profit and let the myth stay mine.", pole: "LONE", stats: { resilience: 10, instinct: 5 } },
      { id: "C", label: "To my friends. Good fortune should feed the table.", pole: "PACK", stats: { conviction: 10, resilience: 5 } },
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
const STAGES = ["gate", "join", "verify", "connect", "quiz", "result"] as const;
const STAGE_LABELS: Record<Stage, string> = {
  gate: "Gate",
  join: "Enter",
  verify: "Verify",
  connect: "Align",
  quiz: "Reading",
  result: "Reveal",
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
  Object.values(ANIMALS).flatMap((animal) => makeCodes(animal)),
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
  const [acceptedInviteCode, setAcceptedInviteCode] = useState("");
  const [gateError, setGateError] = useState("");
  const [email, setEmail] = useState("");
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
      setAcceptedInviteCode(code);
      setStage("join");
      return;
    }
    setGateError("This invitation is not recognized by the circle.");
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
      setGateError("This invitation is not recognized by the circle.");
      return;
    }
    setInviteCode(normalizedCode);
    setAcceptedInviteCode(normalizedCode);
    setGateError("");
    setStage("join");
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
    setQuestionIndex(0);
    setAnswerIds([]);
    setCopiedCode(null);
    setShared(false);
    setInviteIndex(0);
    setStage("connect");
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
      setStage("result");
      return;
    }
    setQuestionIndex((current) => current + 1);
  };

  const goBack = () => {
    if (questionIndex === 0) {
      setStage("connect");
      return;
    }
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
    shareUrl.searchParams.set("text", `A private SmartX passage is open. Claim invitation ${ROMAN[inviteIndex] ?? inviteIndex + 1} before it closes.`);
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
    setStage("join");
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
        <nav aria-label="Site">
          <Link href="/">Home</Link>
          <Link href="/waitlist" aria-current="page">Waitlist</Link>
          <Link href="/blog">Blog</Link>
          <a href="https://smartx.gitbook.io/smartx.docs.io" target="_blank" rel="noopener noreferrer">Docs</a>
        </nav>
        <span className={styles.prototypeFlag}>Prototype · No data saved</span>
      </header>

      <div className={styles.stageRail} aria-label="Waitlist progress">
        {STAGES.map((item, index) => {
          const current = STAGES.indexOf(stage);
          const state = index === current ? "active" : index < current ? "done" : "idle";
          return (
            <span key={item} data-state={state}>
              <b>{ROMAN[index]}</b>
              <i>{STAGE_LABELS[item]}</i>
            </span>
          );
        })}
      </div>

      <section className={styles.stage} id="waitlist-content" aria-live="polite">
        {stage === "gate" && (
          <div className={styles.gateStage}>
            <div className={styles.gateSigil} aria-hidden="true"><span>✦</span><i /></div>
            <p className={styles.kicker}>Invitation only · The first gate</p>
            <h1>The circle opens<br /><em>by invitation.</em></h1>
            <p className={styles.lede}>
              SmartX is admitting a small first circle of traders. Present a valid invitation
              to enter the Trading Oracle and reserve your waitlist position.
            </p>
            <form className={styles.gateForm} onSubmit={submitGate}>
              <label htmlFor="invite-code">Invitation code</label>
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
                <button type="submit"><span>Verify invitation</span><i aria-hidden="true">→</i></button>
              </div>
              {gateError
                ? <small className={styles.gateError} id="invite-error" role="alert">{gateError}</small>
                : <small id="invite-note">Codes inside invitation links are verified automatically.</small>}
            </form>
          </div>
        )}

        {stage === "join" && (
          <div className={styles.joinStage}>
            {acceptedInviteCode && <div className={styles.admissionTag}>Admitted by <b>{acceptedInviteCode}</b></div>}
            <span className={styles.oracleMark} aria-hidden="true">✦</span>
            <p className={styles.kicker}>SmartX presents · The Trading Oracle</p>
            <h1>Read the market.<em>Reveal yourself.</em></h1>
            <p className={styles.lede}>
              Six cards trace how you read a signal, face a risk, and move with the crowd.
              Enter the circle to reveal your trading spirit — and your place in the SmartX waitlist.
            </p>
            <div className={styles.axisLegend} aria-label="Three traits revealed">
              <span><b>I</b> Signal</span>
              <span><b>II</b> Risk</span>
              <span><b>III</b> Tribe</span>
            </div>
            <form className={styles.joinForm} onSubmit={submitEmail}>
              <label htmlFor="waitlist-email">Enter the circle</label>
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
                <button type="submit"><span>Begin the reading</span><i aria-hidden="true">→</i></button>
              </div>
              <small>Exploration prototype · your email stays in this browser and is not submitted.</small>
            </form>
            <dl className={styles.joinFacts}>
              <div><dt>The spread</dt><dd>6 cards</dd></div>
              <div><dt>The ritual</dt><dd>≈ 40 seconds</dd></div>
              <div><dt>The reveal</dt><dd>8 spirits + 1 hidden</dd></div>
            </dl>
          </div>
        )}

        {stage === "verify" && (
          <div className={styles.otpStage}>
            <div className={styles.otpSeal} aria-hidden="true"><span>✦</span><i /></div>
            <p className={styles.kicker}>Email confirmation · Double opt-in</p>
            <h1>Confirm the signal.<br /><em>Seal your place.</em></h1>
            <p className={styles.lede}>
              We sent a six-digit verification code to <b>{email}</b>. Your waitlist position
              is reserved only after the address is confirmed.
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
                <span>Verify email</span><i aria-hidden="true">→</i>
              </button>
              {otpError
                ? <small className={styles.otpError} id="otp-error" role="alert">{otpError}</small>
                : <small id="otp-note">Prototype verification code · <b>{OTP_CODE}</b></small>}
              <div className={styles.otpMeta}>
                <button type="button" onClick={() => { setOtpResent(true); setOtpError(""); }}>Resend code</button>
                <span>{otpResent ? "A new code was sent." : "Code expires in 10 minutes."}</span>
                <button type="button" onClick={() => setStage("join")}>Change email</button>
              </div>
            </form>
          </div>
        )}

        {stage === "connect" && (
          <div className={styles.connectStage}>
            <div className={styles.connectCopy}>
              <p className={styles.kicker}>Before the cards are dealt</p>
              <h1>Align with<br /><em>the circle.</em></h1>
              <p className={styles.lede}>
                Open both SmartX channels so the oracle can find you when the gate opens.
                A click counts as complete for this prototype — there is no account verification.
              </p>
              <blockquote>“Every good signal begins as a quiet conversation.”</blockquote>
            </div>
            <div className={styles.communityTasks}>
              <p>Complete both signs</p>
              <button type="button" data-complete={telegramOpened} onClick={() => openCommunity("telegram")}>
                <span className={styles.taskIcon}><FaTelegramPlane aria-hidden="true" /></span>
                <span className={styles.taskCopy}><b>Join the Telegram</b><small>SmartX community & early signals</small></span>
                <i>{telegramOpened ? "Opened ✓" : "Open ↗"}</i>
              </button>
              <button type="button" data-complete={xOpened} onClick={() => openCommunity("x")}>
                <span className={styles.taskIcon}><FaXTwitter aria-hidden="true" /></span>
                <span className={styles.taskCopy}><b>Follow on X</b><small>@SmartXTerminal</small></span>
                <i>{xOpened ? "Opened ✓" : "Open ↗"}</i>
              </button>
              <button
                className={styles.continueButton}
                type="button"
                disabled={!socialReady}
                onClick={() => setStage("quiz")}
              >
                <span>{socialReady ? "Draw the first card" : `${signsRemaining} ${signsRemaining === 1 ? "sign remains" : "signs remain"}`}</span>
                <i aria-hidden="true">→</i>
              </button>
              <button className={styles.textButton} type="button" onClick={() => setStage("join")}>← Change email</button>
            </div>
          </div>
        )}

        {stage === "quiz" && (
          <div className={styles.quizStage} key={questionIndex}>
            <div className={styles.quizTopline}>
              <button className={styles.backButton} type="button" onClick={goBack}>← Previous</button>
              <div className={styles.starProgress} aria-label={`Question ${questionIndex + 1} of ${QUESTIONS.length}`}>
                {QUESTIONS.map((_, index) => <i key={index} data-filled={index <= questionIndex}>✦</i>)}
              </div>
              <span>{ROMAN[questionIndex]} / VI</span>
            </div>
            <header className={styles.questionHeader}>
              <p className={styles.kicker}>{QUESTIONS[questionIndex].context}</p>
              <h1>{QUESTIONS[questionIndex].prompt}</h1>
              <span>Choose the card that answers before you do.</span>
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
                      sizes="(max-width: 520px) calc(100vw - 80px), (max-width: 820px) 44vw, 280px"
                    />
                  </span>
                  <span className={styles.cardAnswer}>{option.label}</span>
                  <small>Choose this card <i aria-hidden="true">→</i></small>
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
              <footer><span>Rarer than {100 - outcome.animal.rarity}% of traders</span><b>For entertainment, not financial advice.</b></footer>
            </article>

            <aside className={styles.accessPanel}>
              <div className={styles.rankPanel} data-boosted={shared}>
                <div>
                  <span>Current waitlist position</span>
                  <strong key={position}>#{position.toLocaleString("en-US")}</strong>
                  <small>{shared ? "Result shared · advanced 500 places" : "Share your result to advance 500 places"}</small>
                </div>
                <p><b>+500 places</b><span>for every trader who enters through one of your invitation links</span></p>
              </div>

              <section className={styles.savePanel}>
                <header><span>Save result card</span><b>PNG</b></header>
                <div>
                  {preparedCards.story ? (
                    <a href={preparedCards.story.href} download={preparedCards.story.filename}>
                      <span>Story / Mobile</span><small>1080 × 1920 · Download</small>
                    </a>
                  ) : (
                    <span className={styles.savePlaceholder}><span>Story / Mobile</span><small>{exportError ? "Unavailable" : "Preparing 1080 × 1920…"}</small></span>
                  )}
                  {preparedCards.og ? (
                    <a href={preparedCards.og.href} download={preparedCards.og.filename}>
                      <span>X / OG Image</span><small>1200 × 630 · Download</small>
                    </a>
                  ) : (
                    <span className={styles.savePlaceholder}><span>X / OG Image</span><small>{exportError ? "Unavailable" : "Preparing 1200 × 630…"}</small></span>
                  )}
                </div>
              </section>

              <header className={styles.inviteHeader}>
                <p className={styles.kicker}>Invitation cards · {codes.length} issued</p>
                <h2>{shared ? "Private passages, dealt one at a time." : "Share once. Break the seal."}</h2>
              </header>

              {!shared ? (
                <div className={styles.inviteLocked} data-owl={outcome.animal.code === "OWL"}>
                  <div className={styles.lockedStack} aria-hidden="true">
                    <i /><i /><i /><span>{codes.length}</span>
                  </div>
                  <div><b>{codes.length} one-time invitation cards</b><p>Share your result on X to unlock the deck and move 500 places forward.</p></div>
                  <button type="button" onClick={shareResult}>Share result & unlock <span>↗</span></button>
                </div>
              ) : (
                <section className={styles.invitationDeck} aria-label="Invitation card deck">
                  <div className={styles.inviteCard} data-owl={outcome.animal.code === "OWL"} key={selectedCode}>
                    <header><span>Private passage</span><b>One-time · No. {inviteIndex + 1}</b></header>
                    <div className={styles.inviteSigil} aria-hidden="true">✦</div>
                    {selectedCode && <strong>{selectedCode}</strong>}
                    <code>{invitationUrl.replace("https://", "")}</code>
                    <footer><span>Unused</span><b>Claim once · then sealed</b></footer>
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
              <button className={styles.restartButton} type="button" onClick={restart}>Read the cards again</button>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
