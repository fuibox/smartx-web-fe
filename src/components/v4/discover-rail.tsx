"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, type CSSProperties } from "react";

import styles from "./v4.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * 01 Discover：pinned 横向场景。
 * 层次化排列：领先证明（全幅）→ Smart money 特写卡 → Market/News 双卡叠放 → 自定义信号错位卡。
 * 标签复用产品类目样式（Expert 蓝 / Trading 金 / Status 青，见 CLAUDE.md 铁律 4）。
 */

const TAG_GROUPS = [
  {
    label: "Domain",
    category: "expert",
    tags: ["Crypto Expert", "Politics Expert"],
  },
  {
    label: "Style",
    category: "trading",
    tags: ["Swing", "Veteran"],
  },
  {
    label: "Track record",
    category: "status",
    tags: ["Whale", "+$1M PnL", "WR 71%"],
  },
] as const;

const RULE_LINES = [
  ["IF", "Smart money net flow ≥ $2M / 10m"],
  ["AND", "YES price < 70¢"],
  ["THEN", "Buy YES $1,000"],
] as const;

const KLINE_PATH =
  "M0,78 C24,74 40,66 64,67 C88,68 100,58 124,56 C148,54 160,60 184,48 C208,36 224,40 248,26 C262,18 276,20 288,14";

export function DiscoverRail() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (window.innerWidth < 980) return;

      const distance = () => track.scrollWidth - window.innerWidth;
      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className={styles.rail} aria-labelledby="v4-discover">
      <div ref={trackRef} className={styles.railTrack}>
        {/* 停靠 0：章节开场 */}
        <article className={`${styles.railPanel} ${styles.railIntro}`}>
          <p className={styles.chapterKicker}>01 / Signals</p>
          <h2 id="v4-discover" className={styles.chapterTitle}>
            Signals, before
            <br />
            the crowd.
          </h2>
          <p className={styles.chapterLede}>
            Four signal streams, one feed. Smart money, market structure, breaking news,
            and your own rules — everything that moves a market, the moment it moves.
          </p>
        </article>

        {/* 停靠 1：Smart money 特写卡 */}
        <div className={styles.railGroup}>
          <article className={`${styles.railCard} ${styles.railFeature}`}>
            <p className={styles.panelKicker}>
              Signal source <b data-live>Live</b>
            </p>
            <h3 className={styles.panelTitle}>Smart money signals</h3>
            <p className={styles.panelCopy}>
              Follow the wallets that win. SmartX profiles thousands of proven traders
              onchain — what they&apos;re good at, how they trade, and how much they&apos;ve
              made — then tells you the moment they move with size.
            </p>
            <div className={styles.tagGroups}>
              {TAG_GROUPS.map((group, groupIndex) => (
                <div className={styles.tagGroup} key={group.label}>
                  <span>{group.label}</span>
                  <div>
                    {group.tags.map((tag, tagIndex) => (
                      <b
                        data-cat={group.category}
                        style={
                          { "--tag-i": groupIndex * 3 + tagIndex } as CSSProperties
                        }
                        key={tag}
                      >
                        {tag}
                      </b>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>

        {/* 停靠 2：Market + News 双卡叠放 */}
        <div className={`${styles.railGroup} ${styles.railStack}`}>
          <article className={styles.railCard}>
            <p className={styles.panelKicker}>
              Signal source <b data-live>Live</b>
            </p>
            <h3 className={styles.panelTitleSm}>Market signals</h3>
            <p className={styles.panelCopy}>
              Price and flow, decoded. Velocity breaks, order concentration, OI build-ups
              — the tape tells you before the headlines do.
            </p>
            <svg
              className={styles.panelKline}
              viewBox="0 0 300 96"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="v4KlineFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="rgba(8, 223, 181, 0.2)" />
                  <stop offset="1" stopColor="rgba(8, 223, 181, 0)" />
                </linearGradient>
              </defs>
              <line x1="0" y1="44" x2="300" y2="44" stroke="#1e293b" strokeWidth="1" />
              <line x1="0" y1="78" x2="300" y2="78" stroke="#1e293b" strokeWidth="1" />
              <path d={`${KLINE_PATH} L300,96 L0,96 Z`} fill="url(#v4KlineFill)" />
              <path
                d={KLINE_PATH}
                fill="none"
                stroke="#08dfb5"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle className={styles.klineMarker} cx="184" cy="48" r="3.5" fill="#ffb03b" />
              <text x="184" y="66" textAnchor="middle" fill="#ffb03b" fontSize="11">
                Fast move
              </text>
              <circle cx="288" cy="14" r="3" fill="#08dfb5" />
              <text x="288" y="34" textAnchor="end" fill="#08dfb5" fontSize="11">
                68.4¢
              </text>
            </svg>
          </article>

          <article className={styles.railCard}>
            <p className={styles.panelKicker}>
              Signal source <b>Coming</b>
            </p>
            <h3 className={styles.panelTitleSm}>News signals</h3>
            <p className={styles.panelCopy}>
              News, timed to the tick. Breaking catalysts are mapped to the markets they
              move the moment they hit.
            </p>
            <div className={styles.newsMap} aria-hidden="true">
              <span className={styles.newsChip}>CPI miss · 2m ago</span>
              <i className={styles.newsWire} />
              <span className={styles.marketChip}>Fed rate cut · Yes 68.4¢</span>
            </div>
          </article>
        </div>

        {/* 停靠 3：自定义信号（垂直错位） */}
        <div className={`${styles.railGroup} ${styles.railOffset}`}>
          <article className={styles.railCard}>
            <p className={styles.panelKicker}>
              Signal source <b>Coming</b>
            </p>
            <h3 className={styles.panelTitleSm}>Your own signals</h3>
            <p className={styles.panelCopy}>
              Your rules, always on. Set conditions on flow, price, and news — SmartX
              watches around the clock so you don&apos;t have to.
            </p>
            <div className={styles.ruleCard} aria-hidden="true">
              {RULE_LINES.map(([keyword, clause], index) => (
                <p style={{ "--rule-i": index } as CSSProperties} key={keyword}>
                  <code>{keyword}</code>
                  {clause}
                </p>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
