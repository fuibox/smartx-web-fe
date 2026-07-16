import type { Metadata } from "next";
import Script from "next/script";

import { OriginalHero } from "@/components/original-hero";
import styles from "@/components/motion-lab/hero-relay.module.css";

import { HeroRelayRuntimeLoader } from "./hero-relay-runtime-loader";

export const metadata: Metadata = {
  title: "Hero Relay | SmartX Motion Lab",
  description: "Original SmartX hero to market-universe renderer relay study.",
};

export default function HeroRelayPage() {
  return (
    <>
      <main className={styles.relay} data-hero-relay-root>
        <div className={styles.stage} data-hero-relay-stage data-progress="0.000">
          <HeroRelayRuntimeLoader />
          <div className={styles.backdrop} data-hero-backdrop aria-hidden="true" />
          <div className={styles.heroSource} data-hero-source>
            <OriginalHero />
          </div>
          <section className={styles.sceneCopy} data-relay-copy aria-label="See the move">
            <span>01 / Detect</span>
            <h2>See the move.</h2>
          </section>
        </div>
      </main>
      <Script src="/smartx-main.js" strategy="afterInteractive" />
    </>
  );
}
