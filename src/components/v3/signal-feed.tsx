"use client";

import { Crosshair } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";

import styles from "./v3.module.css";

/** 真实产品语义的信号流 fixture：SmartX 实际推送的信号类型。 */
const FEED_ROWS = [
  {
    tone: "fast",
    color: "var(--amber)",
    label: "Fast move",
    detail: "Fed September rate cut · velocity broke 30-day range",
    value: "+8.2 pts / 14m",
    time: "09:42:11",
  },
  {
    tone: "smart",
    color: "var(--cyan)",
    label: "Smart money",
    detail: "14 tracked wallets accumulating YES",
    value: "+$4.8M net flow",
    time: "09:41:37",
  },
  {
    tone: "news",
    color: "var(--gold)",
    label: "News catalyst",
    detail: "CPI miss reprices rate expectations",
    value: "CPI / 2m",
    time: "09:40:02",
  },
  {
    tone: "structure",
    color: "var(--violet)",
    label: "Capital structure",
    detail: "Large orders concentrated above 66¢",
    value: "YES 63% of 1h flow",
    time: "09:38:54",
  },
  {
    tone: "related",
    color: "var(--leaf)",
    label: "Related market",
    detail: "2Y yield market confirms direction",
    value: "-3.1 pts",
    time: "09:37:29",
  },
] as const;

/**
 * SIGNALS 模块：信号按序抵达（stagger），
 * 之后一个平静的 live 高亮循环扫过各行，锁定提示常驻模块底部。
 */
export function SignalFeed() {
  const [liveIndex, setLiveIndex] = useState(-1);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) {
      setLocked(true);
      setLiveIndex(1);
      return;
    }

    let step = 0;
    const id = window.setInterval(() => {
      step += 1;
      const next = step % (FEED_ROWS.length + 2);
      if (next < FEED_ROWS.length) setLiveIndex(next);
      if (step > FEED_ROWS.length) setLocked(true);
    }, 2400);
    return () => window.clearInterval(id);
  }, []);

  return (
    <>
      <div role="log" aria-label="Live SmartX signals">
        {FEED_ROWS.map((row, index) => (
          <div
            className={styles.feedRow}
            data-live={index === liveIndex}
            style={
              {
                "--row-color": row.color,
                "--row-delay": `${120 + index * 110}ms`,
              } as CSSProperties
            }
            key={row.label}
          >
            <strong>{row.label}</strong>
            <p>{row.detail}</p>
            <span className={styles.feedValue}>
              <b>{row.value}</b>
              <time>{row.time}</time>
            </span>
          </div>
        ))}
      </div>
      <p className={styles.feedFooter} data-visible={locked}>
        <Crosshair aria-hidden="true" />
        Signal locked — four independent threads point at one market
      </p>
    </>
  );
}
