"use client";

import { useRef } from "react";

import { LaunchAlphaCta } from "@/components/site/launch-alpha-cta";
import { ClosingFlowField } from "@/components/v4/closing-field";

import styles from "./blog.module.css";

export function ArticleCta() {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  return (
    <section
      ref={sectionRef}
      className={styles.articleCta}
      aria-labelledby="article-cta-title"
    >
      <ClosingFlowField
        sectionRef={sectionRef}
        copyRef={copyRef}
        ctaRef={ctaRef}
        className={styles.articleCtaCanvas}
        variant="compact"
      />
      <div ref={copyRef} className={styles.articleCtaCopy}>
        <p className={styles.eyebrow}>LIVE ON POLYMARKET</p>
        <h2 id="article-cta-title">Put the next signal in context.</h2>
      </div>
      <LaunchAlphaCta
        ref={ctaRef}
        className={styles.articleCtaAction}
        source="blog_article"
      />
    </section>
  );
}
