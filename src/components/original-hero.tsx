import Image from "next/image";
import { ArrowUpRight, BookOpen } from "lucide-react";
import { SiTelegram, SiX } from "react-icons/si";

import { createSmartXAppHref } from "@/lib/smartx-links";

import { HeroScrollCue } from "./hero-scroll-cue";

const heroCommunityLinks = [
  { label: "X", href: "https://x.com/SmartXTerminal", Icon: SiX },
  { label: "Telegram", href: "https://t.me/+CTeuBkpOxSNkN2Y0", Icon: SiTelegram },
];

export function OriginalHero() {
  return (
    <section
      className="page-shell page-shell--cosmic"
      id="top"
      aria-labelledby="hero-title"
    >
      <canvas id="kinetic-grid" className="kinetic-grid" aria-hidden="true" />
      <div className="grain-layer" aria-hidden="true" />
      <div className="scan-layer" aria-hidden="true" />

      <div className="hero-content">
        <header className="site-header reveal reveal-interface">
          <a className="brand-mark" href="#top" aria-label="SmartX home">
            <Image
              className="brand-mark__full"
              src="/assets/smartx-logo.svg"
              alt="SmartX"
              width={218}
              height={43}
              priority
            />
          </a>

          <nav className="signal-nav" aria-label="SmartX links">
            <span className="signal-nav__stamp" aria-hidden="true">
              SMARTX &copy;2026
            </span>
            <span className="signal-nav__divider" aria-hidden="true" />
            {heroCommunityLinks.map(({ label, href, Icon }) => (
              <a
                className="signal-link"
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`SmartX on ${label}`}
                data-label={label}
                key={label}
              >
                <Icon className="signal-link__brand-icon" aria-hidden="true" />
              </a>
            ))}
            <a
              className="signal-link"
              href="https://smartx.gitbook.io/smartx.docs.io"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="SmartX Docs"
              data-label="Docs"
            >
              <BookOpen className="signal-link__brand-icon" aria-hidden="true" />
            </a>
          </nav>
        </header>

        <div className="hero">
          <div className="hero-inner">
            <h1
              className="hero-title reveal reveal-title-lock"
              id="hero-title"
              aria-label="The AI Trading Terminal Built Around You"
            >
              <span className="hero-title__line">
                <span
                  className="hero-title__phrase hero-title__phrase--first"
                  data-calibrate-text
                >
                  The AI Trading Terminal
                </span>
              </span>
              <span className="hero-title__line">
                <span
                  className="hero-title__phrase hero-title__phrase--second"
                  data-calibrate-text
                >
                  Built Around You
                </span>
              </span>
            </h1>
            <p className="hero-body reveal reveal-copy">
              Alpha tuned to your focus, edge, and style
            </p>

            <a
              className="hero-cta reveal reveal-control"
              href={createSmartXAppHref("hero_cta")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Launch SmartX app"
            >
              <span className="hero-cta__label">
                <span className="hero-cta__text hero-cta__text--default">Launch App</span>
                <span className="hero-cta__text hero-cta__text--hover" aria-hidden="true">
                  Open SmartX
                </span>
              </span>
              <span className="hero-cta__icon" aria-hidden="true">
                <ArrowUpRight />
              </span>
            </a>
          </div>
        </div>
        <HeroScrollCue />
      </div>
    </section>
  );
}
