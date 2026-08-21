"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import { renderResultCard, type RenderedResultCard, type ResultCardFormat } from "./result-card-export";
import styles from "./waitlist.module.css";

type Stage = "gate" | "quiz" | "email" | "verify" | "result";
type Dimension = "risk" | "signal" | "social";
type Pole = "DEGEN" | "SNIPER" | "GUT" | "DATA" | "PACK" | "LONE";

type QuizOption = {
  id: "A" | "B" | "C" | "D";
  label: string;
  pole: Pole;
};

type Question = {
  dimension: Dimension;
  prompt: string;
  options: readonly QuizOption[];
};

type Persona = {
  name: string;
  cn: string;
  code: string;
  mark: string;
  description: string;
  roast: string;
};

const QUESTIONS: readonly Question[] = [
  {
    dimension: "signal",
    prompt: "You wake in the middle of the night. What calls you first?",
    options: [
      { id: "A", label: "The chart. If I am awake, the market must be saying something.", pole: "DATA" },
      { id: "B", label: "The price. One glance tells me the mood.", pole: "GUT" },
      { id: "C", label: "The timeline. I want to know what everyone is seeing.", pole: "GUT" },
      { id: "D", label: "Nothing. Sleep is the best stop-loss.", pole: "DATA" },
    ],
  },
  {
    dimension: "risk",
    prompt: "A coin you do not own is up 40%. What do you do?",
    options: [
      { id: "A", label: "Buy now. Momentum rarely waits.", pole: "DEGEN" },
      { id: "B", label: "Open the chart for research. The order is already placed.", pole: "DEGEN" },
      { id: "C", label: "Set my entry and wait.", pole: "SNIPER" },
      { id: "D", label: "Watch. Every spike eventually cools.", pole: "SNIPER" },
    ],
  },
  {
    dimension: "social",
    prompt: "Your position drops 30%. Who hears about it?",
    options: [
      { id: "A", label: "The group chat. Shared pain is lighter.", pole: "PACK" },
      { id: "B", label: "No one. I close it and move on.", pole: "LONE" },
      { id: "C", label: "Everyone. I buy more and call the dip.", pole: "PACK" },
      { id: "D", label: "Only me. Some losses stay private.", pole: "LONE" },
    ],
  },
  {
    dimension: "signal",
    prompt: "Where do your strongest trade ideas come from?",
    options: [
      { id: "A", label: "Charts and data.", pole: "DATA" },
      { id: "B", label: "Wallets I quietly track.", pole: "DATA" },
      { id: "C", label: "The group chat, right after someone says ‘send it.’", pole: "GUT" },
      { id: "D", label: "Instinct. The idea arrives before the evidence.", pole: "GUT" },
    ],
  },
  {
    dimension: "risk",
    prompt: "What kind of leverage feels right?",
    options: [
      { id: "A", label: "Spot only. Patience is enough.", pole: "SNIPER" },
      { id: "B", label: "3×. Enough power, enough restraint.", pole: "SNIPER" },
      { id: "C", label: "20×. Otherwise the market feels too quiet.", pole: "DEGEN" },
      { id: "D", label: "Whatever makes the liquidation price look theoretical.", pole: "DEGEN" },
    ],
  },
  {
    dimension: "social",
    prompt: "You catch a 10×. Who hears first?",
    options: [
      { id: "A", label: "Screenshot, group chat, X.", pole: "PACK" },
      { id: "B", label: "Nowhere. I take profit and keep it quiet.", pole: "LONE" },
      { id: "C", label: "My friends. Good fortune should be shared.", pole: "PACK" },
      { id: "D", label: "Back into the market. My game, my pace.", pole: "LONE" },
    ],
  },
];

const PERSONAS: Record<string, Persona> = {
  "DEGEN|GUT|PACK": {
    name: "The Liquidity Donor",
    cn: "送钱者",
    code: "APE",
    mark: "LQD",
    description: "You chase heat, trust the vibe, and usually bring the group chat with you. Wherever the market needs liquidity, your wallet arrives first.",
    roast: "You’re not trading. You’re funding the ecosystem.",
  },
  "DEGEN|GUT|LONE": {
    name: "The All-In Mystic",
    cn: "梭哈仙人",
    code: "WOLF",
    mark: "AIM",
    description: "You do not need a poll or a spreadsheet. You have a feeling—and right before every all-in, it feels like enlightenment.",
    roast: "Every all-in starts with enlightenment and ends with reincarnation.",
  },
  "DEGEN|DATA|PACK": {
    name: "The Signal General",
    cn: "喊单军师",
    code: "PARROT",
    mark: "SIG",
    description: "Charts checked. Wallets tracked. Three hours of analysis later, the strategy still comes down to two words: send it. Naturally, everyone must hear about it.",
    roast: "Three hours of research. Two-word thesis: send it.",
  },
  "DEGEN|DATA|LONE": {
    name: "The Candle Prophet",
    cn: "K线教主",
    code: "FOX",
    mark: "CND",
    description: "You trust candles, structure, and support levels more than people. Your system explains almost everything—except, occasionally, your position size.",
    roast: "You can chart every line except the one marking enough exposure.",
  },
  "SNIPER|GUT|PACK": {
    name: "The Dip Ringleader",
    cn: "抄底带头大哥",
    code: "TURTLE",
    mark: "DIP",
    description: "You do not chase; you wait for the pullback. Once your gut calls the bottom, the whole group chat gets recruited to buy it with you.",
    roast: "You’re not buying the dip. You’re giving the downtrend a demo.",
  },
  "SNIPER|GUT|LONE": {
    name: "The Market Doctor",
    cn: "行情老中医",
    code: "BEAR",
    mark: "DOC",
    description: "You do not rush and you do not need the crowd. Other traders read indicators; you take the market’s pulse and decide whether its complexion looks healthy.",
    roast: "Every symptom diagnosed. Every loss professionally explained.",
  },
  "SNIPER|DATA|PACK": {
    name: "The Onchain Detective",
    cn: "链上侦探",
    code: "WHALE",
    mark: "CHN",
    description: "Charts, flows, smart wallets—you inspect everything. You know who moved, what they bought, and where the money went before the group chat asks.",
    roast: "You know everyone’s position except, occasionally, your own.",
  },
  "SNIPER|DATA|LONE": {
    name: "The Limit Sniper",
    cn: "潜伏狙击手",
    code: "CAT",
    mark: "LMT",
    description: "The thesis is ready and the entry is precise. You will wait as long as it takes—even when the market has no intention of coming back for you.",
    roast: "The limit order was perfect. Shame you two never met again.",
  },
  OWL: {
    name: "The Risk Monk",
    cn: "风控大师",
    code: "OWL",
    mark: "RSK",
    description: "Low leverage. Clean exits. Profits taken without ceremony. While everyone hunts the next 10×, you make sure there is a next trade.",
    roast: "They study how to double once. You study how to stay in the game.",
  },
};

const PERSONAS_BY_CODE = Object.values(PERSONAS).reduce<Record<string, Persona>>((index, persona) => {
  index[persona.code] = persona;
  index[persona.mark] = persona;
  return index;
}, {});

const OWL_SIGNATURE = ["D", "D", "B", "A", "B", "B"] as const;
const AXES: Record<Dimension, readonly Pole[]> = {
  risk: ["DEGEN", "SNIPER"],
  signal: ["GUT", "DATA"],
  social: ["PACK", "LONE"],
};
const WAITLIST_URL = "https://smartx.io/waitlist/";
const OTP_CODE = "824193";

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
  return {
    persona: owlHits >= 4 ? PERSONAS.OWL : PERSONAS[`${risk}|${signal}|${social}`],
    poles: [risk, signal, social],
  };
}

function makeCodes(persona: Persona) {
  const fragments = ["7X2K", "N4Q8", "M9R3", "K2V6", "F8P1", "C5T7", "Y3L9", "H6W4", "B1J8", "D7S2"];
  const count = persona.mark === "RSK" ? 10 : 5;
  return fragments.slice(0, count).map((fragment) => `SMARTX-${persona.mark}-${fragment}`);
}

function makeLegacyCodes(persona: Persona) {
  const fragments = ["7X2K", "N4Q8", "M9R3", "K2V6", "F8P1", "C5T7", "Y3L9", "H6W4", "B1J8", "D7S2"];
  const count = persona.code === "OWL" ? 10 : 5;
  return fragments.slice(0, count).map((fragment) => `SMARTX-${persona.code}-${fragment}`);
}

const VALID_INVITE_CODES = new Set([
  "123456",
  ...Object.values(PERSONAS).flatMap((persona) => [...makeCodes(persona), ...makeLegacyCodes(persona)]),
]);

function makePosition(email: string) {
  const seed = [...email].reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return 7_900 + (seed % 1_800);
}

function makeInvitationUrl(code?: string, resultCode?: string) {
  const url = new URL(WAITLIST_URL);
  if (resultCode) url.searchParams.set("result", resultCode);
  if (code) url.searchParams.set("invite", code);
  return url.toString();
}

function ArtworkPlaceholder({ label, compact = false }: { label: string; compact?: boolean }) {
  return (
    <span className={styles.artPlaceholder} data-compact={compact} aria-label="Artwork placeholder">
      <span>{label}</span>
      <small>Artwork direction TBD</small>
    </span>
  );
}

type PersonaPosterProps = {
  persona: Persona;
  poles?: readonly string[];
  preparedCards?: Partial<Record<ResultCardFormat, RenderedResultCard>>;
  exportError?: boolean;
  preview?: boolean;
};

function PersonaPoster({ persona, poles, preparedCards, exportError, preview = false }: PersonaPosterProps) {
  return (
    <article className={styles.personaPoster} data-preview={preview}>
      <header>
        <Image src="/assets/smartx-logo.svg" alt="SmartX" width={218} height={42} />
        <span>Trader type</span>
      </header>
      <div className={styles.posterIdentity}>
        <span>{poles?.join(" · ") ?? "A friend’s result"}</span>
        <h2>{persona.name}</h2>
        <p>{persona.cn}</p>
      </div>
      <ArtworkPlaceholder label={persona.mark} compact={preview} />
      <p className={styles.posterDescription}>{persona.description}</p>
      <blockquote>“{persona.roast}”</blockquote>
      {!preview && (
        <section className={styles.cardDownloads} aria-label="Download result card">
          <span>Download result</span>
          <div>
            {preparedCards?.story ? (
              <a href={preparedCards.story.href} download={preparedCards.story.filename}>Story <small>1080 × 1920</small></a>
            ) : (
              <span>{exportError ? "Story unavailable" : "Preparing story…"}</span>
            )}
            {preparedCards?.og ? (
              <a href={preparedCards.og.href} download={preparedCards.og.filename}>X / OG <small>1200 × 630</small></a>
            ) : (
              <span>{exportError ? "OG unavailable" : "Preparing OG…"}</span>
            )}
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
  const [sharedPersonaCode, setSharedPersonaCode] = useState<string | null>(null);
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
  const referralPersona = sharedPersonaCode ? PERSONAS_BY_CODE[sharedPersonaCode] : null;
  const codes = useMemo(() => makeCodes(outcome.persona), [outcome.persona]);
  const basePosition = useMemo(() => makePosition(email), [email]);
  const position = Math.max(1, basePosition - (shared ? 500 : 0));
  const selectedCode = codes.at(inviteIndex);
  const invitationUrl = makeInvitationUrl(selectedCode, outcome.persona.mark);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("invite")?.trim().toUpperCase();
    const resultCode = params.get("result")?.trim().toUpperCase();
    if (resultCode && PERSONAS_BY_CODE[resultCode]) setSharedPersonaCode(resultCode);
    if (!code) return;
    setInviteCode(code);
    if (!VALID_INVITE_CODES.has(code)) {
      setGateError("This invite code isn’t valid.");
      return;
    }
    if (!resultCode) setStage("quiz");
  }, []);

  useEffect(() => {
    if (stage !== "result") return;
    let disposed = false;
    let rendered: RenderedResultCard[] = [];
    setPreparedCards({});
    setExportError(false);
    const data = { ...outcome.persona, code: outcome.persona.mark, poles: outcome.poles };
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
  }, [stage, outcome]);

  const beginQuiz = () => {
    setGateError("");
    setQuestionIndex(0);
    setAnswerIds([]);
    setStage("quiz");
  };

  const submitGate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedCode = inviteCode.trim().toUpperCase();
    if (!VALID_INVITE_CODES.has(normalizedCode)) {
      setGateError("This invite code isn’t valid.");
      return;
    }
    setInviteCode(normalizedCode);
    beginQuiz();
  };

  const beginFromReferral = () => {
    const normalizedCode = inviteCode.trim().toUpperCase();
    if (!VALID_INVITE_CODES.has(normalizedCode)) {
      setSharedPersonaCode(null);
      setGateError("That invitation has expired. Enter another code to continue.");
      return;
    }
    beginQuiz();
  };

  const clearReferral = () => {
    setSharedPersonaCode(null);
    setInviteCode("");
    setGateError("");
    window.history.replaceState({}, "", "/waitlist/");
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
    const url = network === "telegram" ? "https://t.me/+CTeuBkpOxSNkN2Y0" : "https://x.com/SmartXTerminal";
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
    const shareUrl = new URL("https://twitter.com/intent/tweet");
    shareUrl.searchParams.set("text", `My SmartX trader type is ${outcome.persona.name}.\n\n“${outcome.persona.roast}”\n\nFind yours in six questions.`);
    shareUrl.searchParams.set("url", makeInvitationUrl(codes[0], outcome.persona.mark));
    window.open(shareUrl.toString(), "_blank", "noopener,noreferrer");
    setShared(true);
  };

  const shareInvitation = () => {
    if (!selectedCode) return;
    const shareUrl = new URL("https://twitter.com/intent/tweet");
    shareUrl.searchParams.set("text", `I got ${outcome.persona.name} on the SmartX trader type test. Use my one-time invite to find yours.`);
    shareUrl.searchParams.set("url", invitationUrl);
    window.open(shareUrl.toString(), "_blank", "noopener,noreferrer");
  };

  const copyInvitation = async (code?: string) => {
    const copyKey = code ?? "activity";
    await navigator.clipboard.writeText(makeInvitationUrl(code, outcome.persona.mark));
    setCopiedCode(copyKey);
    window.setTimeout(() => setCopiedCode(null), 1400);
  };

  const restart = () => {
    setStage("quiz");
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
        <span>Invite-only alpha</span>
      </header>

      <section className={styles.stage} id="waitlist-content" aria-live="polite">
        {stage === "gate" && referralPersona && (
          <div className={styles.referralStage}>
            <PersonaPoster persona={referralPersona} preview />
            <div className={styles.referralCopy}>
              <span className={styles.eyebrow}>A friend sent you their result</span>
              <h1>Think you trade<br />differently?</h1>
              <p>Six questions reveal the habits behind your entries, exits, and group-chat confidence.</p>
              <button className={styles.primaryButton} type="button" onClick={beginFromReferral}>
                Find my trader type <span>→</span>
              </button>
              <button className={styles.textButton} type="button" onClick={clearReferral}>Use another invite</button>
            </div>
          </div>
        )}

        {stage === "gate" && !referralPersona && (
          <div className={styles.gateStage}>
            <div className={styles.gateCopy}>
              <span className={styles.eyebrow}>The SmartX trader type test</span>
              <h1>What kind of trader are you—<em>really?</em></h1>
              <p>Six questions. Nine trading personas. One result your group chat may already know.</p>
            </div>
            <form className={styles.gateForm} onSubmit={submitGate}>
              <label htmlFor="invite-code">Invite code</label>
              <input
                id="invite-code"
                type="text"
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                placeholder="SMARTX-RSK-7X2K"
                value={inviteCode}
                onChange={(event) => {
                  setInviteCode(event.target.value.toUpperCase());
                  setGateError("");
                }}
                aria-invalid={Boolean(gateError)}
                aria-describedby={gateError ? "invite-error" : "invite-note"}
                required
              />
              <button className={styles.primaryButton} type="submit">Reveal my type <span>→</span></button>
              {gateError ? (
                <small className={styles.formError} id="invite-error" role="alert">{gateError}</small>
              ) : (
                <small id="invite-note">Your invite is reserved for this session after validation.</small>
              )}
              <button className={styles.testCodeButton} type="button" onClick={() => { setInviteCode("123456"); setGateError(""); }}>
                Use prototype code 123456
              </button>
            </form>
          </div>
        )}

        {stage === "quiz" && (
          <div className={styles.quizStage} key={questionIndex}>
            <div className={styles.quizControls}>
              {questionIndex > 0 ? <button type="button" onClick={goBack}>← Back</button> : <span />}
              <div className={styles.progress} aria-label={`Question ${questionIndex + 1} of ${QUESTIONS.length}`}>
                {QUESTIONS.map((question, index) => <i key={question.prompt} data-active={index <= questionIndex} />)}
              </div>
            </div>
            <h1>{QUESTIONS[questionIndex].prompt}</h1>
            <div className={styles.optionGrid}>
              {QUESTIONS[questionIndex].options.map((option) => (
                <button type="button" key={option.id} onClick={() => answerQuestion(option)}>
                  <ArtworkPlaceholder label={option.id} compact />
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {stage === "email" && (
          <div className={styles.formStage}>
            <span className={styles.eyebrow}>Your result is ready</span>
            <h1>Keep it.</h1>
            <p>Bind an email to save your result and activate your waitlist position.</p>
            <form onSubmit={submitEmail}>
              <label htmlFor="waitlist-email">Email address</label>
              <input
                id="waitlist-email"
                type="email"
                autoComplete="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <button className={styles.primaryButton} type="submit">Continue <span>→</span></button>
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
              <button className={styles.primaryButton} type="submit">See my result <span>→</span></button>
              {otpError ? (
                <small className={styles.formError} id="otp-error" role="alert">{otpError}</small>
              ) : (
                <small id="otp-note">Prototype code · <b>{OTP_CODE}</b></small>
              )}
              <div className={styles.formMeta}>
                <button type="button" onClick={() => { setOtpResent(true); setOtpError(""); }}>
                  {otpResent ? "Code sent again" : "Resend code"}
                </button>
                <button type="button" onClick={() => setStage("email")}>Change email</button>
              </div>
            </form>
          </div>
        )}

        {stage === "result" && (
          <div className={styles.resultStage}>
            <PersonaPoster
              persona={outcome.persona}
              poles={outcome.poles}
              preparedCards={preparedCards}
              exportError={exportError}
            />
            <aside className={styles.resultPanel}>
              <span className={styles.eyebrow}>Email verified · position active</span>
              <div className={styles.rankBlock} data-boosted={shared}>
                <span>Your waitlist position</span>
                <strong key={position}>#{position.toLocaleString("en-US")}</strong>
                <small>{shared ? "Result shared · moved up 500 places" : "Share your result to move up 500 places"}</small>
              </div>

              <section className={styles.communityBlock}>
                <header><h2>Stay close to SmartX</h2><span>Optional</span></header>
                <div>
                  <button type="button" data-complete={telegramOpened} onClick={() => openCommunity("telegram")}>
                    <FaTelegramPlane aria-hidden="true" /><span>Join Telegram</span><b>{telegramOpened ? "Opened ✓" : "↗"}</b>
                  </button>
                  <button type="button" data-complete={xOpened} onClick={() => openCommunity("x")}>
                    <FaXTwitter aria-hidden="true" /><span>Follow on X</span><b>{xOpened ? "Opened ✓" : "↗"}</b>
                  </button>
                </div>
              </section>

              {!shared ? (
                <button className={styles.shareButton} type="button" onClick={shareResult}>
                  Share result & unlock invites <span>↗</span>
                </button>
              ) : (
                <section className={styles.invitationDeck} aria-label="Invitation card deck">
                  <header><span>Your one-time invites</span><b>{inviteIndex + 1} / {codes.length}</b></header>
                  <div className={styles.inviteCodeCard}>
                    <span>{outcome.persona.name}</span>
                    <strong>{selectedCode}</strong>
                    <small>One claim · includes your result preview</small>
                  </div>
                  <div className={styles.inviteActions}>
                    <button type="button" onClick={() => copyInvitation(selectedCode)}>
                      {copiedCode === selectedCode ? "Copied ✓" : "Copy link"}
                    </button>
                    <button type="button" onClick={shareInvitation}>Send on X ↗</button>
                  </div>
                  <div className={styles.inviteNavigation}>
                    <button type="button" disabled={inviteIndex === 0} onClick={() => setInviteIndex((current) => current - 1)}>←</button>
                    <button type="button" disabled={inviteIndex === codes.length - 1} onClick={() => setInviteIndex((current) => current + 1)}>→</button>
                  </div>
                </section>
              )}
              <button className={styles.restartButton} type="button" onClick={restart}>Take the test again</button>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
