import Image from "next/image";

import { MemoryRadar } from "@/components/v3/memory-radar";
import { MEMORY_DOMAINS } from "@/components/memory-demo/memory-demo.fixture";
import { createSmartXAppHref } from "@/lib/smartx-links";

import styles from "./v4.module.css";

/**
 * V4 后续章节（内容优先，动效后置——见 CLAUDE.md TODO）。
 * 02 Execute：左手机框（真实移动端市场页结构）右文案。
 * 03 Learn：AI Flywheel + Memory 雷达，讲 compounding gap。
 * 04 All-in-one：集成状态墙（产品中心，无背书内容）。
 */

const FLYWHEEL_STEPS = [
  { label: "Discover", detail: "Signals find you" },
  { label: "Execute", detail: "One-flow trading" },
  { label: "Review", detail: "Every decision logged" },
  { label: "Learn", detail: "Memory sharpens the feed" },
] as const;

const VENUES = [
  { name: "Polymarket", status: "live", detail: "Prediction markets" },
  { name: "Predict.fun", status: "coming", detail: "Prediction markets" },
  { name: "Hyperliquid", status: "coming", detail: "Perps" },
  { name: "Aster", status: "coming", detail: "Perps" },
  { name: "bStocks", status: "coming", detail: "Onchain stocks" },
] as const;

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

const PHONE_KLINE =
  "M0,58 C16,55 28,48 44,49 C60,50 68,42 84,40 C100,38 108,43 124,36 C140,29 150,31 166,22 C178,15 190,17 200,10";

export function ExecuteSection() {
  return (
    <section className={styles.section} aria-labelledby="v4-execute">
      <div className={styles.sectionGrid}>
        <div className={styles.phoneFrame} aria-hidden="true">
          <div className={styles.phoneScreen}>
            <div className={styles.phoneHeader}>
              <small>Macro / Monetary policy</small>
              <strong>Will the Fed cut rates at the September meeting?</strong>
              <div className={styles.phoneStats}>
                <span>
                  Prob <b>68.4%</b>
                </span>
                <span>
                  24h <b data-teal>+11.8</b>
                </span>
                <span>
                  Vol <b>$18.6M</b>
                </span>
              </div>
            </div>
            <svg
              className={styles.phoneKline}
              viewBox="0 0 200 68"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="v4PhoneFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="rgba(8, 223, 181, 0.2)" />
                  <stop offset="1" stopColor="rgba(8, 223, 181, 0)" />
                </linearGradient>
              </defs>
              <path d={`${PHONE_KLINE} L200,68 L0,68 Z`} fill="url(#v4PhoneFill)" />
              <path
                d={PHONE_KLINE}
                fill="none"
                stroke="#08dfb5"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            <div className={styles.phoneSignal}>
              <b>BUY</b> +$48.2K on Yes @ 62.4¢
            </div>
            <div className={styles.phoneOutcomes}>
              <button type="button" data-side="yes" tabIndex={-1}>
                Yes 68.4¢
              </button>
              <button type="button" data-side="no" tabIndex={-1}>
                No 31.6¢
              </button>
            </div>
            <div className={styles.phoneSheet}>
              <span>Take position</span>
              <b>$1,000 · YES</b>
            </div>
          </div>
        </div>

        <div>
          <p className={styles.chapterKicker}>02 / Execute</p>
          <h2 id="v4-execute" className={styles.chapterTitle}>
            Signal to order,
            <br />
            one motion.
          </h2>
          <p className={styles.chapterLede}>
            Tap a signal, see the evidence on the chart, and take the position — without
            leaving the flow. Charts, order book, and execution live in one screen, on
            desktop and mobile.
          </p>
          <ul className={styles.featureList}>
            <li>Evidence stays attached to the price that produced it</li>
            <li>One-tap outcomes with live pricing</li>
            <li>Positions and orders in the same view</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export function LearnSection() {
  const signalsDomain =
    MEMORY_DOMAINS.find((domain) => domain.id === "signals") ?? MEMORY_DOMAINS[0];

  return (
    <section className={styles.section} aria-labelledby="v4-learn">
      <p className={styles.chapterKicker}>
        03 / Learn
        <span className={styles.futureTag}>Future</span>
      </p>
      <h2 id="v4-learn" className={styles.chapterTitle}>
        It gets sharper
        <br />
        every trade.
      </h2>
      <p className={styles.chapterLede}>
        Every decision you make — what you open, trust, and trade — becomes memory.
        SmartX turns it into a profile of how you trade, and uses it to rank what you see
        next. The longer you trade, the wider the gap.
      </p>

      <div className={styles.learnGrid}>
        <ol className={styles.flywheel}>
          {FLYWHEEL_STEPS.map((step, index) => (
            <li key={step.label}>
              <i>{String(index + 1).padStart(2, "0")}</i>
              <strong>{step.label}</strong>
              <span>{step.detail}</span>
            </li>
          ))}
        </ol>
        <div className={styles.radarPanel}>
          <MemoryRadar domain={signalsDomain} />
          <p>
            Four memory dimensions — interests, trusted signals, trading style, edge —
            built from your trades, not your clicks.
          </p>
        </div>
      </div>
    </section>
  );
}

export function VenuesSection() {
  return (
    <section className={styles.section} aria-labelledby="v4-venues">
      <p className={styles.chapterKicker}>04 / All-in-one</p>
      <h2 id="v4-venues" className={styles.chapterTitle}>
        Every venue.
        <br />
        One terminal.
      </h2>
      <p className={styles.chapterLede}>
        SmartX starts with prediction markets and extends to every market you trade —
        one account, one memory, one edge.
      </p>

      <div className={styles.venueWall}>
        {VENUES.map((venue) => (
          <div
            className={styles.venueCard}
            data-live={venue.status === "live"}
            key={venue.name}
          >
            <strong>{venue.name}</strong>
            <span>{venue.detail}</span>
            <b>{venue.status === "live" ? "Live" : "Coming"}</b>
          </div>
        ))}
      </div>
    </section>
  );
}

export function EpilogueSection() {
  return (
    <>
      <section className={styles.section} aria-labelledby="v4-journal">
        <div className={styles.journalHead}>
          <h2 id="v4-journal">Latest from SmartX</h2>
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

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <Image src="/assets/smartx-logo.svg" alt="SmartX" width={126} height={25} />
            <p>The AI trading terminal that understands you.</p>
          </div>
          <nav className={styles.footerNav} aria-label="Footer">
            <a
              href={createSmartXAppHref("footer_link")}
              target="_blank"
              rel="noopener noreferrer"
            >
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
    </>
  );
}
