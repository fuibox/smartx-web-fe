"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

import { createSmartXAppHref } from "@/lib/smartx-links";

import {
  NetworkProductPreview,
  type NetworkPreviewKind,
} from "./network-product-previews";
import styles from "./consumer-home.module.css";

const ASSET_ROOT = "/assets/consumer-network";

const networkFeatures = [
  {
    number: "No. 01",
    title: "Verified, not claimed",
    description:
      "Every track record comes from real positions, real PnL, real history.",
    preview: "verified" satisfies NetworkPreviewKind,
    motion: "performance",
  },
  {
    number: "No. 02",
    title: "Picked for you",
    description:
      "The traders and markets in your feed match what you trade.",
    preview: "personalized" satisfies NetworkPreviewKind,
    motion: "discovery",
  },
  {
    number: "No. 03",
    title: "One tap to trade",
    description: "Trade as smooth as shopping.",
    preview: "trade" satisfies NetworkPreviewKind,
    motion: "account",
  },
] as const;

const performanceSteps = ["Performance", "Rank", "Audience", "Income"];

function useSectionReveals() {
  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      sections.forEach((section) => section.setAttribute("data-visible", "true"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const section = entry.target as HTMLElement;
          const keepsLooping = section.dataset.looping === "true";

          if (keepsLooping) {
            section.setAttribute(
              "data-visible",
              entry.isIntersecting ? "true" : "false",
            );
            return;
          }

          if (!entry.isIntersecting) return;
          section.setAttribute("data-visible", "true");
          observer.unobserve(section);
        });
      },
      { rootMargin: "0px 0px -12%", threshold: 0.2 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
}

function Brand({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <span className={styles.brand} data-tone={tone}>
      <Image
        src={`${ASSET_ROOT}/logo-${tone === "light" ? "white" : "black"}.svg`}
        alt=""
        width={34}
        height={28}
      />
      <span>SmartX</span>
    </span>
  );
}

function WaitlistLink({ placement }: { placement: "hero" | "closing" }) {
  return (
    <a
      className={styles.waitlistButton}
      href={createSmartXAppHref(
        placement === "hero" ? "hero_cta" : "closing_cta",
      )}
      target="_blank"
      rel="noopener noreferrer"
    >
      Join the Waitlist
    </a>
  );
}

function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="consumer-hero-title">
      <div className={styles.heroImage} aria-hidden="true">
        <Image
          src={`${ASSET_ROOT}/hero-product.png`}
          alt=""
          fill
          sizes="(min-width: 1440px) 1425px, 100vw"
          priority
        />
      </div>
      <div className={styles.heroShade} aria-hidden="true" />

      <header className={styles.header}>
        <Link href="/" className={styles.headerBrand} aria-label="SmartX home">
          <Brand />
        </Link>

        <div className={styles.headerActions}>
          <nav className={styles.primaryNav} aria-label="Site navigation">
            <a href="#product">Product</a>
            <Link href="/blog">Blog</Link>
          </nav>
          <WaitlistLink placement="hero" />
        </div>
      </header>

      <div className={styles.heroCopy}>
        <h1 id="consumer-hero-title">Trade your edge.</h1>
        <p>
          <span>
            The social trading app for memes, perps, stocks and prediction markets.
          </span>
          <span>Follow verified traders and trade in one tap.</span>
        </p>
        <WaitlistLink placement="hero" />
      </div>
    </section>
  );
}

function NetworkSection() {
  return (
    <section
      id="network"
      className={styles.network}
      aria-labelledby="network-title"
      data-reveal
      data-looping="true"
    >
      <h2 id="network-title">
        <strong>Follow the best. Not the loudest.</strong>{" "}
        <span>
          Every trader on SmartX is verified by real trades — and your feed is
          shaped by how you trade.
        </span>
      </h2>

      <div className={styles.networkGrid}>
        {networkFeatures.map((feature) => (
          <article className={styles.networkFeature} key={feature.number}>
            <span className={styles.featureNumber}>{feature.number}</span>
            <div className={styles.featureArt} data-motion={feature.motion}>
              <NetworkProductPreview kind={feature.preview} />
            </div>
            <div className={styles.featureCopy}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function PerformanceSection() {
  return (
    <section
      id="product"
      className={`${styles.storySection} ${styles.performance}`}
      aria-labelledby="performance-title"
      data-reveal
    >
      <div className={styles.performanceProduct}>
        <Image
          src={`${ASSET_ROOT}/performance-product.png`}
          alt="Two SmartX mobile product screens showing a personalized trade idea and live markets"
          width={910}
          height={895}
          sizes="(min-width: 1440px) 910px, 58vw"
        />
      </div>

      <div className={styles.storyCopy}>
        <div>
          <span className={styles.eyebrow}>The trader content economy</span>
          <h2 id="performance-title">Turn influence into income</h2>
        </div>
        <p>
          Post opinions backed by your real positions. Climb the leaderboard,
          grow your following, and earn a share of the revenue you create.
        </p>
        <div className={styles.performanceFlow} aria-label={performanceSteps.join(" to ")}>
          {performanceSteps.map((step, index) => (
            <span className={styles.performanceStep} key={step}>
              <span>{step}</span>
              {index < performanceSteps.length - 1 ? (
                <Image
                  src={`${ASSET_ROOT}/flow-arrow.svg`}
                  alt=""
                  width={20}
                  height={20}
                />
              ) : null}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function DiscoverySection() {
  return (
    <section
      className={`${styles.storySection} ${styles.discovery}`}
      aria-labelledby="discovery-title"
      data-reveal
    >
      <Image
        className={styles.discoveryLandscape}
        src={`${ASSET_ROOT}/discovery-landscape.png`}
        alt=""
        fill
        sizes="100vw"
      />
      <div className={styles.discoveryShade} aria-hidden="true" />
      <Image
        className={styles.discoveryProduct}
        src={`${ASSET_ROOT}/discovery-product.png`}
        alt="SmartX personalized account screen"
        width={888}
        height={857}
        sizes="(min-width: 1440px) 888px, 68vw"
      />

      <div className={`${styles.storyCopy} ${styles.discoveryCopy}`}>
        <div>
          <span className={styles.eyebrow}>PERSONALIZED FOR YOU</span>
          <h2 id="discovery-title">The next opportunity finds you.</h2>
        </div>
        <p>
          No more scrolling through noise. SmartX learns what you trade and
          shows you the traders and markets that fit
        </p>
        <p className={styles.storyTrail}>Discover · Follow · Copy</p>
      </div>
    </section>
  );
}

function AccountSection() {
  return (
    <section
      className={`${styles.storySection} ${styles.account}`}
      aria-labelledby="account-title"
      data-reveal
    >
      <Image
        className={styles.accountImage}
        src={`${ASSET_ROOT}/account-network.png`}
        alt=""
        fill
        sizes="100vw"
      />
      <div className={styles.accountShade} aria-hidden="true" />

      <div className={`${styles.storyCopy} ${styles.accountCopy}`}>
        <div>
          <span className={styles.eyebrow}>No barriers for new users</span>
          <h2 id="account-title">
            One Account.
            <br />
            Every Market.
          </h2>
        </div>
        <p>
          Fund with fiat. Skip gas and bridging. Trade across markets with one
          SmartX balance.
        </p>
        <p className={styles.storyTrail}>Fiat in · Markets open · Chains invisible</p>
      </div>
    </section>
  );
}

function ClosingSection() {
  return (
    <section
      className={styles.closing}
      aria-labelledby="closing-title"
      data-reveal
    >
      <div className={styles.closingField} aria-hidden="true">
        <Image
          className={styles.closingDots}
          src={`${ASSET_ROOT}/cta-dots.png`}
          alt=""
          width={1280}
          height={1920}
          sizes="1920px"
        />
      </div>
      <div className={styles.closingCopy}>
        <div>
          <h2 id="closing-title">Be early</h2>
          <p>The Consumer Trading Network is taking shape.</p>
        </div>
        <WaitlistLink placement="closing" />
      </div>
    </section>
  );
}

function ConsumerFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerDirectory}>
        <div className={styles.footerBrand}>
          <Brand tone="dark" />
          <div className={styles.socialLinks} aria-label="SmartX social links">
            <a
              href="https://x.com/SmartXTerminal"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="SmartX on X"
            >
              <Image src={`${ASSET_ROOT}/social-x.svg`} alt="" width={16} height={16} />
            </a>
            <a
              href="https://t.me/+CTeuBkpOxSNkN2Y0"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="SmartX on Telegram"
            >
              <Image
                src={`${ASSET_ROOT}/social-telegram.svg`}
                alt=""
                width={16}
                height={16}
              />
            </a>
          </div>
          <small>© SmartX 2026</small>
        </div>

        <div className={styles.footerLinks}>
          <nav aria-labelledby="consumer-footer-product">
            <h2 id="consumer-footer-product">Product</h2>
            <a
              href={createSmartXAppHref("footer_link")}
              target="_blank"
              rel="noopener noreferrer"
            >
              App
            </a>
            <Link href="/blog">Blog</Link>
          </nav>
        </div>
      </div>
      <span className={styles.footerWordmark} aria-hidden="true">
        SmartX
      </span>
    </footer>
  );
}

export function ConsumerHome() {
  useSectionReveals();

  return (
    <main className={styles.page}>
      <a className={styles.skipLink} href="#network">
        Skip to the SmartX network story
      </a>
      <Hero />
      <NetworkSection />
      <PerformanceSection />
      <DiscoverySection />
      <AccountSection />
      <ClosingSection />
      <ConsumerFooter />
    </main>
  );
}
