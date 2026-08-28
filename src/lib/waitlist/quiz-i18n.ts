import { msg } from "@lingui/core/macro";
import type { MessageDescriptor } from "@lingui/core";

import { i18n } from "@/lingui";

import type { QuizOption, QuizQuestion } from "./types";

const QUIZ_PROMPT_BY_ID: Record<string, MessageDescriptor> = {
  R1: msg`A coin you do not own is up 40%. What do you do?`,
  R2: msg`Your position moves 20% against you. What happens next?`,
  D1: msg`Before entering a trade, what convinces you most?`,
  D2: msg`A trader you trust posts a high-conviction call. What do you do?`,
  S1: msg`You catch a 10×. Who hears first?`,
  S2: msg`Your group chat strongly disagrees with your trade. What do you do?`,
};

const QUIZ_OPTION_BY_ID: Record<string, MessageDescriptor> = {
  R1_A: msg`Buy now. Momentum rarely waits.`,
  R1_B: msg`Start small now and add if it holds.`,
  R1_C: msg`Set my entry and wait.`,
  R1_D: msg`Pass. No setup, no trade.`,
  R2_A: msg`Add immediately. The market is improving my entry.`,
  R2_B: msg`Give it more room before deciding.`,
  R2_C: msg`Reduce the position according to plan.`,
  R2_D: msg`Exit at invalidation. No debate.`,
  D1_A: msg`Wallet flows, data, and a clear invalidation level.`,
  D1_B: msg`Chart structure and price confirmation.`,
  D1_C: msg`The market's mood and momentum.`,
  D1_D: msg`A strong thesis that simply feels early.`,
  D2_A: msg`Verify it with onchain data and market structure.`,
  D2_B: msg`Check the chart before taking a position.`,
  D2_C: msg`Open a small starter because I trust the source.`,
  D2_D: msg`Follow immediately. Conviction is contagious.`,
  S1_A: msg`Screenshot, group chat, X.`,
  S1_B: msg`My close trading group.`,
  S1_C: msg`One trusted friend, maybe.`,
  S1_D: msg`No one. I take profit and keep moving.`,
  S2_A: msg`Debate it with the group and adjust if they have a point.`,
  S2_B: msg`Listen first, then decide.`,
  S2_C: msg`Note the feedback but keep my plan.`,
  S2_D: msg`Ignore the noise and execute alone.`,
};

const QUIZ_PROMPT_BY_TEXT: Record<string, MessageDescriptor> = Object.fromEntries(
  Object.values(QUIZ_PROMPT_BY_ID).map((descriptor) => [descriptor.message || descriptor.id || "", descriptor]),
);

const QUIZ_OPTION_BY_TEXT: Record<string, MessageDescriptor> = Object.fromEntries(
  Object.values(QUIZ_OPTION_BY_ID).map((descriptor) => [descriptor.message || descriptor.id || "", descriptor]),
);

export function localizedQuestionPrompt(question: Pick<QuizQuestion, "questionId" | "prompt">) {
  const descriptor = QUIZ_PROMPT_BY_ID[question.questionId] ?? QUIZ_PROMPT_BY_TEXT[question.prompt];
  return descriptor ? i18n._(descriptor) : question.prompt;
}

export function localizedOptionLabel(option: Pick<QuizOption, "optionId" | "label">) {
  const descriptor = QUIZ_OPTION_BY_ID[option.optionId] ?? QUIZ_OPTION_BY_TEXT[option.label];
  return descriptor ? i18n._(descriptor) : option.label;
}
