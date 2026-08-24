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

function ClosingOrbitField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionQuery.matches;
    let visible = false;
    let animationFrame = 0;
    let lastFrameAt = 0;
    let width = 0;
    let height = 0;

    const rings = [
      { radiusX: 0.168, radiusY: 0.25, markers: 64, period: 11 },
      { radiusX: 0.323, radiusY: 0.475, markers: 92, period: 17 },
      { radiusX: 0.5, radiusY: 0.855, markers: 128, period: 26 },
    ] as const;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const nextWidth = Math.max(1, Math.round(rect.width));
      const nextHeight = Math.max(1, Math.round(rect.height));
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      if (
        nextWidth === width &&
        nextHeight === height &&
        canvas.width === Math.round(nextWidth * pixelRatio)
      ) {
        return;
      }

      width = nextWidth;
      height = nextHeight;
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const draw = (time: number) => {
      resize();
      context.clearRect(0, 0, width, height);

      if (reducedMotion) return;

      const centerX = width / 2;
      const centerY = height / 2;

      context.lineCap = "round";

      rings.forEach((ring, ringIndex) => {
        const radiusX = width * ring.radiusX;
        const radiusY = height * ring.radiusY;
        const phase =
          ((time / 1000) * Math.PI * 2) / ring.period + ringIndex * 1.65;
        const sigma = 0.22 + ringIndex * 0.035;

        for (let marker = 0; marker < ring.markers; marker += 1) {
          const angle = (marker / ring.markers) * Math.PI * 2;
          const delta = Math.atan2(
            Math.sin(angle - phase),
            Math.cos(angle - phase),
          );
          const highlight = Math.exp(
            -(delta * delta) / (2 * sigma * sigma),
          );

          if (highlight < 0.025) continue;

          const x = centerX + Math.cos(angle) * radiusX;
          const y = centerY + Math.sin(angle) * radiusY;
          const depth = 0.72 + ((Math.sin(angle) + 1) / 2) * 0.28;
          const alpha = highlight * depth * (0.7 - ringIndex * 0.08);
          const lineHeight = 18 + highlight * 12;

          context.beginPath();
          context.moveTo(x, y - lineHeight / 2);
          context.lineTo(x, y + lineHeight / 2);
          context.lineWidth = 3.2;
          context.strokeStyle = `rgba(238, 238, 238, ${alpha})`;
          context.stroke();
        }
      });
    };

    const tick = (time: number) => {
      if (!visible || reducedMotion) {
        animationFrame = 0;
        return;
      }

      if (time - lastFrameAt >= 1000 / 30) {
        draw(time);
        lastFrameAt = time;
      }
      animationFrame = window.requestAnimationFrame(tick);
    };

    const start = () => {
      if (animationFrame || reducedMotion || !visible) return;
      animationFrame = window.requestAnimationFrame(tick);
    };

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          draw(performance.now());
          start();
        } else if (animationFrame) {
          window.cancelAnimationFrame(animationFrame);
          animationFrame = 0;
        }
      },
      { threshold: 0.08 },
    );

    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw(reducedMotion ? 0 : performance.now());
    });

    const handleMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion = event.matches;
      if (reducedMotion && animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
      draw(performance.now());
      start();
    };

    resize();
    draw(performance.now());
    visibilityObserver.observe(canvas);
    resizeObserver.observe(canvas);
    motionQuery.addEventListener("change", handleMotionChange);

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      motionQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return (
    <>
      <Image
        className={styles.closingOrbitBase}
        src={`${ASSET_ROOT}/be-early-orbit-base.png`}
        alt=""
        fill
        sizes="100vw"
      />
      <canvas ref={canvasRef} className={styles.closingOrbitCanvas} />
    </>
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
          <LaunchAlphaLink />
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
        <WaitlistButton placement="hero" />
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
        <ClosingOrbitField />
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
