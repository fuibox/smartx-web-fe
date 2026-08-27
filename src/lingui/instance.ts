import { i18n as linguiI18n } from "@lingui/core";
import { compileMessage } from "@lingui/message-utils/compileMessage";

import { messages as enCatalog } from "@/locales/en/messages";
import { messages as jaCatalog } from "@/locales/ja/messages";
import { messages as koCatalog } from "@/locales/ko/messages";
import { messages as zhCnCatalog } from "@/locales/zh-CN/messages";

export const LOCALE_STORAGE_KEY = "smartx.locale";

export const APP_LOCALES = ["en", "zh-CN", "ko", "ja"] as const;
export type AppLocale = (typeof APP_LOCALES)[number];

export const LOCALE_LABELS: Record<AppLocale, string> = {
  en: "English",
  "zh-CN": "简体中文",
  ko: "한국어",
  ja: "Japan",
};

export function toAppLocale(value: unknown): AppLocale {
  return APP_LOCALES.includes(value as AppLocale) ? (value as AppLocale) : "en";
}

linguiI18n.setMessagesCompiler(compileMessage);
linguiI18n.load("en", enCatalog);
linguiI18n.load("zh-CN", zhCnCatalog);
linguiI18n.load("ko", koCatalog);
linguiI18n.load("ja", jaCatalog);
linguiI18n.activate("en");

export function setAppLocale(next: AppLocale): void {
  if (linguiI18n.locale !== next) linguiI18n.activate(next);
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
  } catch {
    /* ignore */
  }
}

export const i18n = linguiI18n;
