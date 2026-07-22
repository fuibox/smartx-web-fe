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
  const heroRef = useRef<HTMLElement>(null);
  const scrollRef = useRef(0);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        scrollRef.current = 0;
        hero.style.opacity = "1";
        hero.style.transform = "none";
        return;
      }
      const progress = Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 1.05)));
      scrollRef.current = progress;
      hero.style.opacity = `${Math.max(0, 1 - progress * 1.6)}`;
      hero.style.transform = `translate3d(0, ${(-46 * progress).toFixed(1)}px, 0)`;
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
    <div className={styles.heroRoot}>
      <DitherField scrollRef={scrollRef} />

      <header className={styles.siteHeader}>
        <span className={styles.wordmark}>
          <Image
            src="/assets/smartx-logo.svg"
            alt="SmartX"
            width={218}
            height={42}
            style={{ width: 126, height: "auto" }}
            priority
          />
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

      <section ref={heroRef} className={styles.hero} aria-labelledby="v4-title">
        <p className={styles.heroKicker}>AI trading terminal · Live beta</p>
        <h1 id="v4-title" className={styles.heroTitle}>
          The AI Trading Terminal{" "}
          <br />
          That Understands You
        </h1>
        <p className={styles.heroLede}>
          <span className={styles.ledeDesktop}>
            The first terminal that watches every market, learns how you trade, and
            puts the next opportunity in front of you — before the crowd sees it.
          </span>
          <span className={styles.ledeMobile}>
            Watches every market, learns how you trade, and surfaces the next move
            first.
          </span>
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
              <b aria-hidden="true">Launch App</b>
            </span>
            <i aria-hidden="true">↗</i>
          </a>
        </div>
        <span className={styles.heroHint}>Scroll ↓</span>
      </section>
    </div>
  );
}
