"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLingui } from "@lingui/react";
import { t } from "@lingui/core/macro";

import {
  APP_LOCALES,
  LOCALE_LABELS,
  setAppLocale,
  toAppLocale,
  type AppLocale,
} from "@/lingui";

import styles from "./language-switcher.module.css";

const SHORT_LABELS: Record<AppLocale, string> = {
  en: "EN",
  "zh-CN": "中文",
  ko: "한국어",
  ja: "Japan",
};

/* 内联 SVG 旗帜（不用 emoji：Windows 下 emoji 旗帜会退化成字母） */
const FLAG_ART: Record<AppLocale, React.ReactNode> = {
  en: (
    <>
      <rect width="20" height="20" fill="#F4F6F8" />
      {[0, 3.08, 6.15, 9.23, 12.31, 15.38, 18.46].map((y) => (
        <rect key={y} x="0" y={y} width="20" height="1.54" fill="#D80027" />
      ))}
      <rect x="0" y="0" width="10" height="10.8" fill="#2E4593" />
      {[
        [2.3, 2.2],
        [5.1, 2.2],
        [7.9, 2.2],
        [3.7, 4.4],
        [6.5, 4.4],
        [2.3, 6.6],
        [5.1, 6.6],
        [7.9, 6.6],
        [3.7, 8.8],
        [6.5, 8.8],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="0.5" fill="#F4F6F8" />
      ))}
    </>
  ),
  "zh-CN": (
    <>
      <rect width="20" height="20" fill="#EE1C25" />
      <polygon
        fill="#FFDA44"
        points="6.5,3.3 7.23,5.49 9.54,5.51 7.69,6.89 8.38,9.09 6.5,7.75 4.62,9.09 5.31,6.89 3.46,5.51 5.77,5.49"
      />
      {[
        [11.6, 3.4],
        [13.2, 5.6],
        [13.2, 8.3],
        [11.6, 10.5],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="0.75" fill="#FFDA44" />
      ))}
    </>
  ),
  ko: (
    <>
      <rect width="20" height="20" fill="#F4F6F8" />
      <circle cx="10" cy="10" r="4.5" fill="#0047A0" />
      <path
        fill="#CD2E3A"
        d="M5.5,10 A4.5,4.5 0 0 1 14.5,10 A2.25,2.25 0 0 1 10,10 A2.25,2.25 0 0 0 5.5,10 Z"
      />
      {/* 四卦：乾(左上实) / 坎(右上) / 离(左下) / 坤(右下断) */}
      <g fill="#17171B">
        <g transform="rotate(-45 10 10)">
          <rect x="8.1" y="1.35" width="3.8" height="0.66" rx="0.2" />
          <rect x="8.1" y="2.5" width="3.8" height="0.66" rx="0.2" />
          <rect x="8.1" y="3.65" width="3.8" height="0.66" rx="0.2" />
          <rect x="8.1" y="15.69" width="1.72" height="0.66" rx="0.2" />
          <rect x="10.18" y="15.69" width="1.72" height="0.66" rx="0.2" />
          <rect x="8.1" y="16.84" width="1.72" height="0.66" rx="0.2" />
          <rect x="10.18" y="16.84" width="1.72" height="0.66" rx="0.2" />
          <rect x="8.1" y="17.99" width="1.72" height="0.66" rx="0.2" />
          <rect x="10.18" y="17.99" width="1.72" height="0.66" rx="0.2" />
        </g>
        <g transform="rotate(45 10 10)">
          <rect x="8.1" y="1.35" width="1.72" height="0.66" rx="0.2" />
          <rect x="10.18" y="1.35" width="1.72" height="0.66" rx="0.2" />
          <rect x="8.1" y="2.5" width="3.8" height="0.66" rx="0.2" />
          <rect x="8.1" y="3.65" width="1.72" height="0.66" rx="0.2" />
          <rect x="10.18" y="3.65" width="1.72" height="0.66" rx="0.2" />
          <rect x="8.1" y="15.69" width="3.8" height="0.66" rx="0.2" />
          <rect x="8.1" y="16.84" width="1.72" height="0.66" rx="0.2" />
          <rect x="10.18" y="16.84" width="1.72" height="0.66" rx="0.2" />
          <rect x="8.1" y="17.99" width="3.8" height="0.66" rx="0.2" />
        </g>
      </g>
    </>
  ),
  ja: (
    <>
      <rect width="20" height="20" fill="#F4F6F8" />
      <circle cx="10" cy="10" r="4.5" fill="#D80027" />
    </>
  ),
};

function LocaleFlag({ locale }: { locale: AppLocale }) {
  const clipId = useId();
  return (
    <svg
      className={styles.flag}
      viewBox="0 0 20 20"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id={clipId}>
          <circle cx="10" cy="10" r="10" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>{FLAG_ART[locale]}</g>
    </svg>
  );
}

type LanguageSwitcherProps = {
  /** menu：按钮 + 浮层（桌面 header）；inline：一排选项（移动端导航内） */
  variant?: "menu" | "inline";
};

export function LanguageSwitcher({ variant = "menu" }: LanguageSwitcherProps) {
  const { i18n } = useLingui();
  const locale = toAppLocale(i18n.locale);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (variant === "inline") {
    return (
      <div className={styles.inline} role="group" aria-label={t`Language`}>
        {APP_LOCALES.map((code) => (
          <button
            key={code}
            type="button"
            className={styles.inlineOption}
            data-active={code === locale ? "true" : "false"}
            aria-pressed={code === locale}
            onClick={() => setAppLocale(code)}
          >
            <LocaleFlag locale={code} />
            {SHORT_LABELS[code]}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        className={styles.trigger}
        aria-label={`${t`Language`}: ${LOCALE_LABELS[locale]}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <LocaleFlag locale={locale} />
      </button>
      {open ? (
        <ul className={styles.menu} role="listbox" aria-label={t`Language`}>
          {APP_LOCALES.map((code) => (
            <li key={code}>
              <button
                type="button"
                role="option"
                aria-selected={code === locale}
                className={styles.option}
                data-active={code === locale ? "true" : "false"}
                onClick={() => {
                  setAppLocale(code);
                  setOpen(false);
                }}
              >
                <LocaleFlag locale={code} />
                {LOCALE_LABELS[code]}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
