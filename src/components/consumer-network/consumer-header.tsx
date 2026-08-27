"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLingui } from "@lingui/react";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";

import { LanguageSwitcher } from "@/components/site/language-switcher";
import { createSmartXAppHref } from "@/lib/smartx-links";

import styles from "./consumer-home.module.css";

const ASSET_ROOT = "/assets/consumer-network";

type ConsumerHeaderProps = {
  active?: "home" | "waitlist";
  placement?: "overlay" | "page";
};

export function ConsumerHeader({
  active = "home",
  placement = "overlay",
}: ConsumerHeaderProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  useLingui();

  return (
    <header className={styles.header} data-placement={placement}>
      <Link href="/" className={styles.headerBrand} aria-label={t`SmartX home`}>
        <span className={styles.brand}>
          <Image
            src={`${ASSET_ROOT}/logo-white.svg`}
            alt=""
            width={34}
            height={28}
            priority
          />
          <span>SmartX</span>
        </span>
      </Link>

      <div className={styles.headerActions}>
        <nav className={styles.primaryNav} aria-label={t`Site navigation`}>
          <Link
            href="/"
            className={active === "home" ? styles.activeLink : undefined}
            aria-current={active === "home" ? "page" : undefined}
          >
            <Trans>Home</Trans>
          </Link>
          <Link
            href="/waitlist/"
            className={active === "waitlist" ? styles.activeLink : undefined}
            aria-current={active === "waitlist" ? "page" : undefined}
          >
            <Trans>Waitlist</Trans>
          </Link>
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
            <Trans>Community</Trans>
          </a>
          <Link href="/blog">
            <Trans>Blog</Trans>
          </Link>
        </nav>
        <LanguageSwitcher />
        <div className={styles.headerTools}>
          <button
            className={styles.mobileMenuButton}
            type="button"
            aria-label={mobileNavOpen ? t`Close navigation` : t`Open navigation`}
            aria-expanded={mobileNavOpen}
            aria-controls="consumer-site-navigation"
            data-open={mobileNavOpen ? "true" : "false"}
            onClick={() => setMobileNavOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
          <a
            className={styles.waitlistButton}
            href={createSmartXAppHref("hero_cta")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Trans>Launch Alpha</Trans>
          </a>
        </div>
      </div>

      <nav
        id="consumer-site-navigation"
        className={styles.mobileNav}
        aria-label={t`Mobile site navigation`}
        hidden={!mobileNavOpen}
      >
        <Link
          href="/"
          className={active === "home" ? styles.activeMobileLink : undefined}
          aria-current={active === "home" ? "page" : undefined}
          onClick={() => setMobileNavOpen(false)}
        >
          <Trans>Home</Trans>
        </Link>
        <Link
          href="/waitlist/"
          className={active === "waitlist" ? styles.activeMobileLink : undefined}
          aria-current={active === "waitlist" ? "page" : undefined}
          onClick={() => setMobileNavOpen(false)}
        >
          <Trans>Waitlist</Trans>
        </Link>
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
          <Trans>Community</Trans>
        </a>
        <Link href="/blog" onClick={() => setMobileNavOpen(false)}>
          <Trans>Blog</Trans>
        </Link>
        <LanguageSwitcher variant="inline" />
      </nav>
    </header>
  );
}
