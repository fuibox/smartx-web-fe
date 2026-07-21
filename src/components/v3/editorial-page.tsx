import Image from "next/image";
import Script from "next/script";
import type { CSSProperties, ReactNode } from "react";

import { ExperienceMotion } from "@/components/experience-motion";
import { OriginalHero } from "@/components/original-hero";
import { createSmartXAppHref } from "@/lib/smartx-links";

import { MemoryVignetteLoader } from "./memory-vignette-loader";
import { SignalFeed } from "./signal-feed";
import { TradeVignette } from "./trade-vignette";
import { WhyVignette } from "./why-vignette";
import styles from "./v3.module.css";

const JOURNAL = [
  {
    date: "Jul 14, 2026",
    datetime: "2026-07-14",
    category: "Product",
    title: "Building the AI Trading Terminal Around You",
  },
  {
    date: "Jul 09, 2026",
    datetime: "2026-07-09",
    category: "Intelligence",
    title: "From Signal Discovery to Trade Action",
  },
  {
    date: "Jul 02, 2026",
    datetime: "2026-07-02",
    category: "Company",
    title: "What We Are Building Next",
  },
] as const;

const MEDIUM_HREF = "https://medium.com/@smartxofficial";

type ModuleProps = {
  color: string;
  name: string;
  status: string;
  flush?: boolean;
  children: ReactNode;
};

/** 终端模块窗：每个产品切片都装在带状态灯的模块 chrome 里。 */
function Module({ color, name, status, flush = false, children }: ModuleProps) {
  return (
    <div className={styles.module} style={{ "--module-color": color } as CSSProperties}>
      <div className={styles.moduleBar}>
        <i aria-hidden="true" />
        <span>{name}</span>
        <b>{status}</b>
      </div>
      {flush ? children : <div className={styles.moduleBody}>{children}</div>}
    </div>
  );
}

/**
 * /v3「终端会话」：sticky 会话状态栏贯穿全页，
 * 四个章节 = 终端的四个模块，1280 容器居中。
 */
export function EditorialPage() {
  return (
    <main className={styles.page}>
      <OriginalHero />

      <div className={styles.sessionBar} aria-label="SmartX session">
        <div className={styles.sessionInner}>
          <span className={styles.sessionStat}>
            <span>Session</span>
            <b>SMX-0721</b>
          </span>
          <span className={styles.sessionStat}>
            <span>Markets scanned</span>
            <b>1,284</b>
          </span>
          <span className={styles.sessionStat}>
            <span>Signals today</span>
            <b>47</b>
          </span>
          <span className={styles.sessionStat}>
            <span>Last signal</span>
            <b>09:42:11</b>
          </span>
          <span className={styles.sessionLive}>
            <i aria-hidden="true" />
            Live
          </span>
        </div>
      </div>

      <div className={styles.flow}>
        <section className={styles.chapter} data-reveal-section aria-labelledby="v3-see">
          <span className={styles.kicker}>01 / Detect</span>
          <h2 id="v3-see" className={styles.statement}>
            See the move.
          </h2>
          <p className={styles.lede}>
            SmartX watches every prediction market at once. Fast moves, smart-money flow,
            news catalysts — signals surface the moment they happen, not after.
          </p>
          <Module color="var(--amber)" name="Signals" status="5 active" flush>
            <SignalFeed />
          </Module>
        </section>

        <section className={styles.chapter} data-reveal-section aria-labelledby="v3-why">
          <span className={styles.kicker}>02 / Understand</span>
          <h2 id="v3-why" className={styles.statement}>
            Know the why.
          </h2>
          <p className={styles.lede}>
            Every signal stays attached to the price that produced it. Evidence lives on
            the chart — not in a report you read later.
          </p>
          <Module color="var(--mint)" name="Market" status="Live">
            <WhyVignette />
          </Module>
        </section>

        <section className={styles.chapter} data-reveal-section aria-labelledby="v3-trade">
          <span className={styles.kicker}>03 / Execute</span>
          <h2 id="v3-trade" className={styles.statement}>
            Make the trade.
          </h2>
          <p className={styles.lede}>
            Act manually, or let a rule act for you — triggers on smart-money flow, price,
            and news fire the moment conditions align.
          </p>
          <Module color="var(--cyan)" name="Execute" status="Armed" flush>
            <TradeVignette />
          </Module>
        </section>

        <section className={styles.chapter} data-reveal-section aria-labelledby="v3-memory">
          <span className={styles.kicker}>
            04 / Learn
            <span className={styles.futureTag}>Future</span>
          </span>
          <h2 id="v3-memory" className={styles.statement}>
            A trade becomes memory.
          </h2>
          <p className={styles.lede}>
            Every decision changes what SmartX notices, trusts, and brings forward next.
            Built from your trades — not your clicks.
          </p>
          <Module color="var(--violet)" name="Memory" status="4 dimensions" flush>
            <MemoryVignetteLoader />
          </Module>
        </section>

        <section className={styles.chapter} data-reveal-section aria-labelledby="v3-journal">
          <div className={styles.journalHead}>
            <h2 id="v3-journal">Latest from SmartX</h2>
            <a href={MEDIUM_HREF} target="_blank" rel="noopener noreferrer">
              View all on Medium →
            </a>
          </div>
          {JOURNAL.map((entry) => (
            <a
              className={styles.journalRow}
              href={MEDIUM_HREF}
              target="_blank"
              rel="noopener noreferrer"
              key={entry.title}
            >
              <time dateTime={entry.datetime}>{entry.date}</time>
              <span>{entry.category}</span>
              <strong>{entry.title}</strong>
            </a>
          ))}
        </section>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <Image src="/assets/smartx-logo.svg" alt="SmartX" width={132} height={26} />
            <p>The AI trading terminal built around you.</p>
          </div>
          <nav className={styles.footerNav} aria-label="Footer">
            <a href={createSmartXAppHref("footer_link")} target="_blank" rel="noopener noreferrer">
              Open terminal
            </a>
            <a
              href="https://smartx.gitbook.io/smartx.docs.io"
              target="_blank"
              rel="noopener noreferrer"
            >
              Docs
            </a>
            <a href="https://x.com/SmartXTerminal" target="_blank" rel="noopener noreferrer">
              X
            </a>
            <a href="https://t.me/+CTeuBkpOxSNkN2Y0" target="_blank" rel="noopener noreferrer">
              Telegram
            </a>
          </nav>
        </div>
        <div className={styles.footerMeta}>
          <span>© SmartX 2026</span>
          <span>Prediction market trading involves risk</span>
        </div>
      </footer>

      <ExperienceMotion />
      <Script src="/smartx-main.js" strategy="afterInteractive" />
    </main>
  );
}
