"use client";

import { useLayoutEffect, useMemo, useState, type ReactNode } from "react";
import { LinguiContext } from "@lingui/react";

import { type AppLocale, i18n, LOCALE_STORAGE_KEY, toAppLocale } from "./instance";

function syncDocumentLocale(locale: AppLocale): void {
  if (typeof document === "undefined") return;

  document.documentElement.lang = locale;
  document.documentElement.dataset.locale = locale;
}

function readStoredLocale(): AppLocale {
  try {
    return toAppLocale(window.localStorage.getItem(LOCALE_STORAGE_KEY));
  } catch {
    return "en";
  }
}

function revealTranslatedDocument(): void {
  document.documentElement.removeAttribute("data-i18n-pending");
  document.getElementById("smartx-i18n-boot")?.remove();
}

export function LinguiProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<AppLocale>("en");
  const [ready, setReady] = useState(false);

  useLayoutEffect(() => {
    const stored = readStoredLocale();
    if (i18n.locale !== stored) i18n.activate(stored);
    syncDocumentLocale(stored);
    setLocale(stored);
    setReady(true);

    return i18n.on("change", () => {
      const next = toAppLocale(i18n.locale);
      syncDocumentLocale(next);
      setLocale(next);
    });
  }, []);

  useLayoutEffect(() => {
    if (ready) revealTranslatedDocument();
  }, [ready, locale]);

  const context = useMemo(
    () => ({
      i18n,
      _: i18n.t.bind(i18n),
    }),
    // i18n 是可变单例；靠 locale 变化产出新 context 值，驱动消费组件重渲染。
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale],
  );

  return <LinguiContext.Provider value={context}>{children}</LinguiContext.Provider>;
}
