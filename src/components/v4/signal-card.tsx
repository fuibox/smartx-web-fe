"use client";

import { forwardRef } from "react";

import styles from "./v4.module.css";

/**
 * SignalProCard 的官网复刻——字段结构与 smartx-fe-dev 真实信号卡一致：
 * 市场问句 → MetaStatLine（SM OI% · Spr · Ends）→ 迷你走势 → 信号行
 * （Buy +$X on Yes @ ¢ · since signal ↗）→ 交易者行（WR · 30D PnL）。
 * 唯一的 art direction：字号从产品的 10px 提升到 ≥11px。
 */

const KLINE_PATH =
  "M0,44 C10,42 18,38 28,39 C38,40 44,34 54,33 C64,32 70,26 80,27 C90,28 96,22 106,20 C116,18 124,21 134,17 C144,13 152,14 162,10 C172,6 180,8 188,5";

export const SignalCard = forwardRef<HTMLDivElement, { className?: string }>(
  function SignalCard({ className }, ref) {
    return (
      <div ref={ref} className={`${styles.signalCard} ${className ?? ""}`}>
        <header className={styles.cardHead}>
          <strong>Will the Fed cut rates at the September meeting?</strong>
          <span className={styles.cardLive}>
            <i aria-hidden="true" />
            Live
          </span>
        </header>

        <p className={styles.cardMeta}>
          <span>
            SM OI% <b data-teal>34.2%</b>
          </span>
          <span>
            Spr <b>0.8¢</b>
          </span>
          <span>
            Ends <b>42d</b>
          </span>
        </p>

        <svg
          className={styles.cardKline}
          viewBox="0 0 188 48"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d={`${KLINE_PATH} L188,48 L0,48 Z`} fill="rgba(8, 223, 181, 0.09)" />
          <path
            d={KLINE_PATH}
            fill="none"
            stroke="#08dfb5"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="188" cy="5" r="3" fill="#08dfb5">
            <animate attributeName="opacity" values="1;0.35;1" dur="2.2s" repeatCount="indefinite" />
          </circle>
        </svg>

        <p className={styles.cardSignal}>
          <b className={styles.cardBuy}>BUY</b>
          <span data-teal>+$48.2K</span>
          <span data-dim>on</span>
          <span data-teal>Yes</span>
          <span data-dim>@</span>
          <span>62.4¢</span>
          <span className={styles.cardDelta}>since signal ↗ +6.0¢</span>
        </p>

        <footer className={styles.cardActor}>
          <i aria-hidden="true">W</i>
          <span className={styles.cardAddress}>0xd486…d7F7</span>
          <span className={styles.cardTag}>Whale</span>
          <span className={styles.cardStats}>
            WR <b>71%</b> · 30D PnL <b data-teal>+$182K</b>
          </span>
        </footer>
      </div>
    );
  },
);
