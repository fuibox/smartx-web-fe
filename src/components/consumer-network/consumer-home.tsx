"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useLingui } from "@lingui/react";
import { msg, t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";

import { createSmartXAppHref } from "@/lib/smartx-links";

import { ConsumerHeader } from "./consumer-header";
import {
  NetworkProductPreview,
  type NetworkPreviewKind,
} from "./network-product-previews";
import styles from "./consumer-home.module.css";

const ASSET_ROOT = "/assets/consumer-network";

const networkFeatures = [
  {
    number: "No. 01",
    title: msg`Verified, not claimed`,
    description: msg`Every track record comes from real positions, real PnL, real history.`,
    preview: "verified" satisfies NetworkPreviewKind,
    motion: "performance",
  },
  {
    number: "No. 02",
    title: msg`Picked for you`,
    description: msg`The traders and markets in your feed match what you trade.`,
    preview: "personalized" satisfies NetworkPreviewKind,
    motion: "discovery",
  },
  {
    number: "No. 03",
    title: msg`One tap to trade`,
    description: msg`Trade as smoothly as shopping.`,
    preview: "trade" satisfies NetworkPreviewKind,
    motion: "account",
  },
] as const;

const performanceSteps = [msg`Performance`, msg`Rank`, msg`Audience`, msg`Income`];

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

function WaitlistButton({ placement }: { placement: "hero" | "closing" }) {
  return (
    <Link
      className={styles.waitlistButton}
      href="/waitlist/"
      data-placement={placement}
    >
      <Trans>Join the Waitlist</Trans>
    </Link>
  );
}

function Hero() {
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

      <ConsumerHeader />

      <div className={styles.heroCopy}>
        <h1 id="consumer-hero-title">
          <Trans>Trade your edge.</Trans>
        </h1>
        <div className={styles.heroSubcopy}>
          <p className={styles.heroLedeDesktop}>
            <span>
              <Trans>
                The social trading app for memes, perps, stocks and prediction markets.
              </Trans>
            </span>
            <span>
              <Trans>Follow verified traders and trade in one tap.</Trans>
            </span>
          </p>
          <p className={styles.heroLedeMobile}>
            <Trans>
              <span>The social trading app for memes, perps,</span>
              <span>stocks and prediction markets. Follow</span>
              <span>verified traders and trade in one tap.</span>
            </Trans>
          </p>
          <WaitlistButton placement="hero" />
        </div>
      </div>
    </section>
  );
}

function NetworkSection() {
  const { i18n } = useLingui();

  return (
    <section
      id="network"
      className={styles.network}
      aria-labelledby="network-title"
      data-reveal
      data-looping="true"
    >
      <h2 id="network-title">
        <strong>
          <Trans>Follow the best. Not the loudest.</Trans>
        </strong>{" "}
        <span>
          <Trans>
            Every trader on SmartX is verified by real trades — and your feed is
            shaped by how you trade.
          </Trans>
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
              <h3>{i18n._(feature.title)}</h3>
              <p>{i18n._(feature.description)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function PerformanceSection() {
  const { i18n } = useLingui();

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
          alt={t`SmartX Square and People screens showing a verified social feed and trader leaderboard`}
          width={2894}
          height={3943}
          sizes="(max-width: 620px) 100vw, (min-width: 1440px) 678px, 47vw"
        />
      </div>

      <div className={styles.storyCopy}>
        <div>
          <span className={styles.eyebrow}>
            <Trans>The trader content economy</Trans>
          </span>
          <h2 id="performance-title">
            <Trans>Turn influence into income</Trans>
          </h2>
        </div>
        <p>
          <Trans>
            Post opinions backed by your real positions. Climb the leaderboard,
            grow your following, and earn a share of the revenue you create.
          </Trans>
        </p>
        <div
          className={styles.performanceFlow}
          aria-label={performanceSteps.map((step) => i18n._(step)).join(" to ")}
        >
          {performanceSteps.map((step, index) => (
            <span className={styles.performanceStep} key={step.id}>
              <span>{i18n._(step)}</span>
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
  useLingui();

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
          alt={t`SmartX mobile signals feed on a dark trading console`}
          width={2492}
          height={1600}
          sizes="(max-width: 620px) 720px, 1246px"
        />
      </div>

      <div className={`${styles.storyCopy} ${styles.discoveryCopy}`}>
        <div>
          <span className={styles.eyebrow}>
            <Trans>Personalized for you</Trans>
          </span>
          <h2 id="discovery-title">
            <Trans>The next opportunity finds you.</Trans>
          </h2>
        </div>
        <p>
          <Trans>
            No more scrolling through noise. SmartX learns what you trade and
            shows you the traders and markets that fit
          </Trans>
        </p>
        <p className={styles.storyTrail}>
          <Trans>Discover · Follow · Copy</Trans>
        </p>
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
          <span className={styles.eyebrow}>
            <Trans>No barriers for new users</Trans>
          </span>
          <h2 id="account-title">
            <Trans>
              One Account.
              <br />
              Every Market.
            </Trans>
          </h2>
        </div>
        <p>
          <Trans>
            Fund with fiat. Skip gas and bridging. Trade across markets with one
            SmartX balance.
          </Trans>
        </p>
        <p className={styles.storyTrail}>
          <Trans>Fiat in · Markets open · Chains invisible</Trans>
        </p>
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
          <h2 id="closing-title">
            <Trans>Be early</Trans>
          </h2>
          <p>
            <Trans>The Consumer Trading Network is taking shape.</Trans>
          </p>
        </div>
        <WaitlistButton placement="closing" />
      </div>
    </section>
  );
}

function ConsumerFooter() {
  useLingui();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerDirectory}>
        <div className={styles.footerBrand}>
          <Brand tone="dark" />
          <div className={styles.socialLinks} aria-label={t`SmartX social links`}>
            <a
              href="https://x.com/SmartXTerminal"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t`SmartX on X`}
            >
              <Image src={`${ASSET_ROOT}/social-x.svg`} alt="" width={16} height={16} />
            </a>
            <a
              href="https://t.me/+CTeuBkpOxSNkN2Y0"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t`SmartX on Telegram`}
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
            <h2 id="consumer-footer-product">
              <Trans>Product</Trans>
            </h2>
            <a
              href={createSmartXAppHref("footer_link")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Trans>App</Trans>
            </a>
            <Link href="/waitlist/">
              <Trans>Waitlist</Trans>
            </Link>
            <Link href="/blog">
              <Trans>Blog</Trans>
            </Link>
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
        <Trans>Skip to the SmartX network story</Trans>
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
