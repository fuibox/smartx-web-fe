"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

import { createSmartXAppHref } from "@/lib/smartx-links";

import { DitherField } from "./dither-field";
import styles from "./v4.module.css";

/**
 * V4 Hero：居中大字号像素标语（沿用原 smartx.io 的排场），
 * 抖动纹理只存在于右缘与底部过渡带，中央阅读区干净。
 */
export function V4Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const progress = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 1.05)));
      scrollRef.current = progress;
      root.style.setProperty("--hero-p", progress.toFixed(4));
    };
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.heroRoot}>
      <DitherField scrollRef={scrollRef} />

      <header className={styles.siteHeader}>
        <span className={styles.wordmark}>
          <Image src="/assets/smartx-logo.svg" alt="SmartX" width={126} height={25} priority />
        </span>
        <nav aria-label="Site">
          <a href="https://x.com/SmartXTerminal" target="_blank" rel="noopener noreferrer">
            X
          </a>
          <a href="https://t.me/+CTeuBkpOxSNkN2Y0" target="_blank" rel="noopener noreferrer">
            Telegram
          </a>
          <a
            href="https://smartx.gitbook.io/smartx.docs.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            Docs
          </a>
        </nav>
      </header>

      <section className={styles.hero} aria-labelledby="v4-title">
        <p className={styles.heroKicker}>AI trading terminal · Live beta</p>
        <h1 id="v4-title" className={styles.heroTitle}>
          The AI Trading Terminal
          <br />
          That Understands You
        </h1>
        <p className={styles.heroLede}>
          The first terminal that watches every market, learns how you trade, and puts
          the next opportunity in front of you — before the crowd sees it.
        </p>
        <div className={styles.heroActions}>
          <a
            className={styles.heroCta}
            href={createSmartXAppHref("hero_cta")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className={styles.ctaLabel}>
              <b>Launch App</b>
              <b aria-hidden="true">Open SmartX</b>
            </span>
            <i aria-hidden="true">↗</i>
          </a>
        </div>
        <span className={styles.heroHint}>Scroll ↓</span>
      </section>
    </div>
  );
}
