import { msg } from "@lingui/core/macro";
import type { MessageDescriptor } from "@lingui/core";

import { i18n } from "@/lingui";

import { resolveWaitlistAssetUrl } from "./api";
import type {
  ApiQuizQuestion,
  AttributeView,
  DimensionView,
  Outcome,
  Persona,
  PersonaRef,
  Pole,
  QuizQuestion,
  ResultCard,
  Stat,
} from "./types";

export const PERSONAS: Record<string, Persona> = {
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
    name: "The Send-It Strategist", cn: "喊单军师", code: "PARROT", mark: "SIG",
    roast: "Three hours of research. Two-word thesis: send it.",
    artSrc: "/assets/waitlist/personas/ops-meme-v1/sig-signal-general.png",
    artAlt: "The Send-It Strategist directing followers from a chart-covered strategy table",
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
    name: "The Vibes Doctor", cn: "行情老中医", code: "BEAR", mark: "DOC",
    roast: "Every symptom diagnosed. Every loss professionally explained.",
    artSrc: "/assets/waitlist/personas/ops-meme-v1/doc-market-doctor.png",
    artAlt: "The Vibes Doctor listening to a candlestick chart with a stethoscope",
  },
  "SNIPER|DATA|PACK": {
    name: "The Onchain Paparazzi", cn: "链上侦探", code: "WHALE", mark: "CHN",
    roast: "You know everyone’s position except, occasionally, your own.",
    artSrc: "/assets/waitlist/personas/ops-meme-v1/chn-onchain-detective.png",
    artAlt: "The Onchain Paparazzi tracing wallets while ignoring its own losing trade",
  },
  "SNIPER|DATA|LONE": {
    name: "The Limit Sniper", cn: "潜伏狙击手", code: "CAT", mark: "LMT",
    roast: "The limit order was perfect. Shame you two never met again.",
    artSrc: "/assets/waitlist/personas/ops-meme-v1/lmt-limit-sniper.png",
    artAlt: "The Limit Sniper watching price turn just before reaching an entry line",
  },
  RSK: {
    name: "The Risk Monk", cn: "风控大师", code: "OWL", mark: "RSK",
    roast: "They study how to double once. You study how to stay in the game.",
    artSrc: "/assets/waitlist/personas/ops-meme-v1/rsk-risk-monk.png",
    artAlt: "The Risk Monk meditating safely inside a shield during market chaos",
  },
};

export const PERSONAS_BY_CODE = Object.values(PERSONAS).reduce<Record<string, Persona>>((index, persona) => {
  index[persona.code] = persona;
  index[persona.mark] = persona;
  return index;
}, {});

// 人格文案的多语言目录（按 mark 索引）。API 只提供 nameEn/nameZh/roastEn，
// ko/ja（以及 zh 的 roast）由本地目录补齐；未知人格回退 API 英文原文。
const PERSONA_L10N: Record<string, { name: MessageDescriptor; roast: MessageDescriptor }> = {
  LQD: {
    name: msg`The Liquidity Donor`,
    roast: msg`You’re not trading. You’re funding the ecosystem.`,
  },
  AIM: {
    name: msg`The All-In Mystic`,
    roast: msg`Every all-in starts with enlightenment and ends with reincarnation.`,
  },
  SIG: {
    name: msg`The Send-It Strategist`,
    roast: msg`Three hours of research. Two-word thesis: send it.`,
  },
  CND: {
    name: msg`The Candle Prophet`,
    roast: msg`You can chart every line except the one marking enough exposure.`,
  },
  DIP: {
    name: msg`The Dip Ringleader`,
    roast: msg`You’re not buying the dip. You’re giving the downtrend a demo.`,
  },
  DOC: {
    name: msg`The Vibes Doctor`,
    roast: msg`Every symptom diagnosed. Every loss professionally explained.`,
  },
  CHN: {
    name: msg`The Onchain Paparazzi`,
    roast: msg`You know everyone’s position except, occasionally, your own.`,
  },
  LMT: {
    name: msg`The Limit Sniper`,
    roast: msg`The limit order was perfect. Shame you two never met again.`,
  },
  RSK: {
    name: msg`The Risk Monk`,
    roast: msg`They study how to double once. You study how to stay in the game.`,
  },
};

function personaL10n(persona: Pick<Persona, "mark" | "code">) {
  return PERSONA_L10N[persona.mark] ?? PERSONA_L10N[persona.code];
}

export function localizedPersonaName(persona: Persona): string {
  if (i18n.locale === "en") return persona.name;
  if (i18n.locale === "zh-CN" && persona.cn) return persona.cn;
  const entry = personaL10n(persona);
  return entry ? i18n._(entry.name) : persona.name;
}

export function localizedPersonaRoast(persona: Persona): string {
  if (!persona.roast || i18n.locale === "en") return persona.roast;
  const entry = personaL10n(persona);
  return entry ? i18n._(entry.roast) : persona.roast;
}

const POLE_L10N: Record<Pole, MessageDescriptor> = {
  DEGEN: msg`DEGEN`,
  SNIPER: msg`SNIPER`,
  GUT: msg`GUT`,
  DATA: msg`DATA`,
  PACK: msg`PACK`,
  LONE: msg`LONE`,
};

export function localizedPole(pole: Pole): string {
  return i18n._(POLE_L10N[pole]);
}

const CHEMISTRY: Record<string, { best: string; rival: string }> = {
  LQD: { best: "DIP", rival: "LMT" }, AIM: { best: "DOC", rival: "CHN" },
  SIG: { best: "CHN", rival: "DOC" }, CND: { best: "LMT", rival: "DIP" },
  DIP: { best: "LQD", rival: "CND" }, DOC: { best: "AIM", rival: "SIG" },
  CHN: { best: "SIG", rival: "AIM" }, LMT: { best: "CND", rival: "LQD" },
  RSK: { best: "CHN", rival: "LQD" },
};

const SIDE_TO_POLE: Record<string, Pole> = {
  degen: "DEGEN",
  sniper: "SNIPER",
  gut: "GUT",
  data: "DATA",
  pack: "PACK",
  lone: "LONE",
};

const QUESTION_ART: Record<string, { src: string; alt: string }> = {
  art_r1: { src: "/assets/waitlist/question-1.png", alt: "A rising market visual climbing translucent steps" },
  art_r2: { src: "/assets/waitlist/question-2.png", alt: "A falling red market line approaching a physical stop marker" },
  art_d1: { src: "/assets/waitlist/question-3.png", alt: "A magnifying lens inspecting wallet flows and market evidence" },
  art_d2: { src: "/assets/waitlist/question-4.png", alt: "A lens verifying two overlapping market evidence sheets" },
  art_s1: { src: "/assets/waitlist/question-5.png", alt: "A winning chart on a phone surrounded by message tokens" },
  art_s2: { src: "/assets/waitlist/question-6.png", alt: "Four different directional choices surrounding one decision marker" },
};

const QUESTION_ART_BY_INDEX = Object.values(QUESTION_ART);

export const QUIZ_ART_SRCS = QUESTION_ART_BY_INDEX.map((item) => item.src);

const prefetchedQuizArt = new Set<string>();

export function prefetchQuizArtwork(extraSrcs: readonly string[] = []) {
  if (typeof window === "undefined") return;
  for (const src of [...QUIZ_ART_SRCS, ...extraSrcs]) {
    if (!src || prefetchedQuizArt.has(src)) continue;
    prefetchedQuizArt.add(src);
    const image = new window.Image();
    image.decoding = "async";
    image.src = src;
    void image.decode?.().catch(() => undefined);
  }
}

if (typeof window !== "undefined") prefetchQuizArtwork();

export function hydrateQuestions(questions: ApiQuizQuestion[]): QuizQuestion[] {
  return questions.map((question, index) => {
    const art = QUESTION_ART[question.artworkKey] ?? QUESTION_ART_BY_INDEX[index] ?? QUESTION_ART.art_r1;
    return { ...question, artSrc: art.src, artAlt: art.alt };
  });
}

function fallbackPersona(personaId = "LQD"): Persona {
  return PERSONAS_BY_CODE[personaId] ?? PERSONAS_BY_CODE.LQD;
}

function polesForPersona(mark: string): readonly [Pole, Pole, Pole] {
  if (mark === "RSK") return ["SNIPER", "DATA", "LONE"];
  const entry = Object.entries(PERSONAS).find(([, persona]) => persona.mark === mark);
  if (entry?.[0].includes("|")) return entry[0].split("|") as [Pole, Pole, Pole];
  return ["DEGEN", "GUT", "PACK"];
}

function polesFromDimensions(dimensions: DimensionView[] | undefined, personaId: string): readonly [Pole, Pole, Pole] {
  const mapped = (dimensions ?? [])
    .map((item) => SIDE_TO_POLE[item.side?.toLowerCase() ?? ""])
    .filter((pole): pole is Pole => Boolean(pole));
  if (mapped.length === 3) return [mapped[0], mapped[1], mapped[2]];
  return polesForPersona(personaId);
}

function mapStats(attributes: AttributeView[] | undefined): Record<Stat, number> {
  const stats: Record<Stat, number> = { conviction: 50, instinct: 50, resilience: 50 };
  (attributes ?? []).forEach((item) => {
    if (item.key === "conviction" || item.key === "instinct" || item.key === "resilience") {
      stats[item.key] = item.value;
    }
  });
  return stats;
}

function mapPersona(personaId: string, overrides?: Partial<Persona> & { imageUrl?: string }): Persona {
  const fallback = fallbackPersona(personaId);
  return {
    name: overrides?.name || fallback.name,
    cn: overrides?.cn || fallback.cn,
    code: personaId || fallback.mark,
    mark: personaId || fallback.mark,
    roast: overrides?.roast || fallback.roast,
    artSrc: resolveWaitlistAssetUrl(overrides?.imageUrl || "") || overrides?.artSrc || fallback.artSrc,
    artAlt: overrides?.artAlt || fallback.artAlt,
  };
}

function mapPersonaRef(ref: PersonaRef | undefined, fallbackId: string): Persona {
  return mapPersona(ref?.personaId || fallbackId, {
    name: ref?.nameEn,
    cn: ref?.nameZh,
    imageUrl: ref?.imageUrl,
  });
}

export function mapCardToOutcome(card: ResultCard): Outcome {
  const persona = mapPersona(card.personaId, {
    name: card.nameEn,
    cn: card.nameZh,
    roast: card.roastEn,
    imageUrl: card.imageUrl,
  });
  const chemistry = CHEMISTRY[persona.mark] ?? CHEMISTRY.LQD;
  return {
    resultId: card.resultId,
    persona,
    poles: polesFromDimensions(card.dimensions, persona.mark),
    stats: mapStats(card.attributes),
    bestMatch: mapPersonaRef(card.bestMatch, chemistry.best),
    rival: mapPersonaRef(card.naturalRival, chemistry.rival),
  };
}
