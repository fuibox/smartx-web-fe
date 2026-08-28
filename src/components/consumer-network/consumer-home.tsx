"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

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
    description: "Trade as smoothly as shopping.",
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

function ClosingGlowField() {
  return (
    <Image
      className={styles.closingGlowImage}
      src={`${ASSET_ROOT}/closing-dot-waves.webp`}
      alt=""
      fill
      sizes="100vw"
    />
  );
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

function LaunchAlphaLink() {
  return (
    <a
      className={styles.waitlistButton}
      href={createSmartXAppHref("hero_cta")}
      target="_blank"
      rel="noopener noreferrer"
    >
      Launch Alpha
    </a>
  );
}

function WaitlistButton({ placement }: { placement: "hero" | "closing" }) {
  const [comingSoon, setComingSoon] = useState(false);

  useEffect(() => {
    if (!comingSoon) return;
    const timeout = window.setTimeout(() => setComingSoon(false), 2200);
    return () => window.clearTimeout(timeout);
  }, [comingSoon]);

  return (
    <button
      className={styles.waitlistButton}
      type="button"
      onClick={() => setComingSoon(true)}
      data-placement={placement}
      aria-live="polite"
    >
      {comingSoon ? "Coming soon" : "Join the Waitlist"}
    </button>
  );
}

function Hero() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isVisible = true;

    const syncPlayback = () => {
      if (reduceMotion.matches || !isVisible) {
        video.pause();
        return;
      }

      void video.play().catch(() => {
        // The poster remains visible if a browser blocks autoplay.
      });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        syncPlayback();
      },
      { threshold: 0.05 },
    );

    observer.observe(video);
    reduceMotion.addEventListener("change", syncPlayback);
    syncPlayback();

    return () => {
      observer.disconnect();
      reduceMotion.removeEventListener("change", syncPlayback);
    };
  }, []);

  return (
    <section className={styles.hero} aria-labelledby="consumer-hero-title">
      <div className={styles.heroMedia} aria-hidden="true">
        <Image
          className={styles.heroPoster}
          src={`${ASSET_ROOT}/hero-film-poster.jpg`}
          alt=""
          fill
          sizes="100vw"
          priority
        />
        <video
          ref={videoRef}
          className={styles.heroVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
        >
          <source src={`${ASSET_ROOT}/hero-film.mp4`} type="video/mp4" />
        </video>
      </div>
      <div className={styles.heroShade} aria-hidden="true" />

      <header className={styles.header}>
        <Link href="/" className={styles.headerBrand} aria-label="SmartX home">
          <Brand />
        </Link>

        <div className={styles.headerActions}>
          <nav className={styles.primaryNav} aria-label="Site navigation">
            <a
              href="https://x.com/SmartXTerminal"
              target="_blank"
              rel="noopener noreferrer"
            >
              X
            </a>
            <a
              href="https://t.me/+CTeuBkpOxSNkN2Y0"
              target="_blank"
              rel="noopener noreferrer"
            >
              Community
            </a>
            <Link href="/blog">Blog</Link>
          </nav>
          <button
            className={styles.mobileMenuButton}
            type="button"
            aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileNavOpen}
            aria-controls="mobile-site-navigation"
            data-open={mobileNavOpen ? "true" : "false"}
            onClick={() => setMobileNavOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
          <LaunchAlphaLink />
        </div>

        <nav
          id="mobile-site-navigation"
          className={styles.mobileNav}
          aria-label="Mobile site navigation"
          hidden={!mobileNavOpen}
        >
          <a
            href="https://x.com/SmartXTerminal"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileNavOpen(false)}
          >
            X
          </a>
          <a
            href="https://t.me/+CTeuBkpOxSNkN2Y0"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileNavOpen(false)}
          >
            Community
          </a>
          <Link href="/blog" onClick={() => setMobileNavOpen(false)}>
            Blog
          </Link>
        </nav>
      </header>

      <div className={styles.heroCopy}>
        <h1 id="consumer-hero-title">Trade your edge.</h1>
        <div className={styles.heroSubcopy}>
          <p className={styles.heroLedeDesktop}>
            <span>
              The social trading app for memes, perps, stocks and prediction markets.
            </span>
            <span>Follow verified traders and trade in one tap.</span>
          </p>
          <p className={styles.heroLedeMobile}>
            <span>The social trading app for memes, perps,</span>
            <span>stocks and prediction markets. Follow</span>
            <span>verified traders and trade in one tap.</span>
          </p>
          <div className={styles.heroActionAnchor}>
            <WaitlistButton placement="hero" />
            <div className={styles.heroBacking}>
              <div className={styles.heroBackingLockup}>
                <span>Backed by</span>
                <Image
                  className={styles.yziLabsLogo}
                  src={`${ASSET_ROOT}/yzi-labs-white.png`}
                  alt="YZi Labs"
                  width={1280}
                  height={427}
                />
              </div>
            </div>
          </div>
        </div>
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
          src={`${ASSET_ROOT}/performance-product-latest.webp`}
          alt="SmartX Square and People screens showing a verified social feed and trader leaderboard"
          width={2894}
          height={3943}
          sizes="(max-width: 620px) 100vw, (min-width: 1440px) 678px, 47vw"
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
      <div className={styles.discoveryVisual}>
        <Image
          className={styles.discoveryScene}
          src={`${ASSET_ROOT}/discovery-scene-latest.webp`}
          alt="SmartX mobile signals feed on a dark trading console"
          width={2492}
          height={1600}
          sizes="(max-width: 620px) 720px, 1246px"
        />
      </div>

      <div className={`${styles.storyCopy} ${styles.discoveryCopy}`}>
        <div>
          <span className={styles.eyebrow}>Personalized for you</span>
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
      <div className={styles.accountVisual} aria-hidden="true">
        <Image
          className={styles.accountImage}
          src={`${ASSET_ROOT}/account-hub-network-brand-teal.webp`}
          alt=""
          fill
          sizes="100vw"
        />
        <div className={styles.accountShade} />
      </div>

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
        <ClosingGlowField />
      </div>
      <div className={styles.closingCopy}>
        <div>
          <h2 id="closing-title">Be early</h2>
          <p>The Consumer Trading Network is taking shape.</p>
        </div>
        <WaitlistButton placement="closing" />
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
