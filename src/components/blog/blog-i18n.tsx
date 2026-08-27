"use client";

import { useLingui } from "@lingui/react";
import { msg } from "@lingui/core/macro";
import type { MessageDescriptor } from "@lingui/core";

import type { BlogCategory } from "@/content/blog-types";

// Blog 页面是服务端组件（SSG）；chrome 文案经这些客户端小组件渲染，
// 才能随语言切换实时更新。文章正文保持英文原文。
const UI_TEXT = {
  skipToLatest: msg`Skip to latest stories`,
  journalTitle: msg`SmartX Journal.`,
  mastheadIntro: msg`Notes on product, markets, and the systems reshaping how people trade.`,
  readDispatch: msg`Read the dispatch`,
  newer: msg`Newer`,
  older: msg`Older`,
  skipToArticle: msg`Skip to article`,
  journal: msg`Journal`,
  inThisDispatch: msg`In this dispatch`,
  fromTheJournal: msg`From the journal`,
} as const satisfies Record<string, MessageDescriptor>;

export type BlogUiTextKey = keyof typeof UI_TEXT;

export function BlogUiText({ k }: { k: BlogUiTextKey }) {
  const { i18n } = useLingui();
  return <>{i18n._(UI_TEXT[k])}</>;
}

const CATEGORY_LABELS: Record<BlogCategory, MessageDescriptor> = {
  Campaign: msg`Campaign`,
  Community: msg`Community`,
  Guide: msg`Guide`,
  Intelligence: msg`Intelligence`,
  Product: msg`Product`,
};

export function BlogCategoryLabel({ category }: { category: BlogCategory }) {
  const { i18n } = useLingui();
  const descriptor = CATEGORY_LABELS[category];
  return <>{descriptor ? i18n._(descriptor) : category}</>;
}

export function BlogReadTime({ minutes }: { minutes: number }) {
  const { i18n } = useLingui();
  return <>{i18n._(msg`${minutes} min read`)}</>;
}

type BlogDateProps = {
  date: string;
  variant?: "long" | "short";
};

export function BlogDate({ date, variant = "long" }: BlogDateProps) {
  const { i18n } = useLingui();
  const formatted = new Intl.DateTimeFormat(i18n.locale || "en", {
    month: "short",
    day: "numeric",
    ...(variant === "long" ? { year: "numeric" } : null),
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
  return <>{formatted}</>;
}
