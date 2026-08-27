"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLingui } from "@lingui/react";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";

import { BlogThemeToggle } from "@/components/blog/blog-theme-toggle";
import { LanguageSwitcher } from "@/components/site/language-switcher";
import { createSmartXAppHref } from "@/lib/smartx-links";

import styles from "./site-chrome.module.css";

type SiteHeaderProps = {
  active?: "home" | "blog" | "waitlist";
  allowThemeToggle?: boolean;
};

export function SiteHeader({
  active,
  allowThemeToggle = false,
}: SiteHeaderProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  useLingui();

  return (
    <header className={styles.header}>
      <Link className={styles.headerBrand} href="/" aria-label={t`SmartX home`}>
        <Image
          src="/assets/consumer-network/logo-white.svg"
          alt=""
          width={34}
          height={28}
          priority
        />
        <span>SmartX</span>
      </Link>

      <div className={styles.headerActions}>
        <nav className={styles.headerNav} aria-label={t`Site navigation`}>
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
          <Link
            href="/blog"
            className={active === "blog" ? styles.activeLink : undefined}
            aria-current={active === "blog" ? "page" : undefined}
          >
            <Trans>Blog</Trans>
          </Link>
        </nav>

        <LanguageSwitcher />
        <div className={styles.headerTools}>
          {allowThemeToggle ? (
            <span className={styles.desktopThemeToggle}>
              <BlogThemeToggle />
            </span>
          ) : null}
          <a
            className={styles.headerAction}
            href={createSmartXAppHref("blog_header")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Trans>Launch Alpha</Trans>
          </a>
          <button
            className={styles.mobileMenuButton}
            type="button"
            aria-label={mobileNavOpen ? t`Close navigation` : t`Open navigation`}
            aria-expanded={mobileNavOpen}
            aria-controls="blog-mobile-site-navigation"
            data-open={mobileNavOpen ? "true" : "false"}
            onClick={() => setMobileNavOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <nav
        id="blog-mobile-site-navigation"
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
        <Link
          href="/blog"
          className={active === "blog" ? styles.activeMobileLink : undefined}
          aria-current={active === "blog" ? "page" : undefined}
          onClick={() => setMobileNavOpen(false)}
        >
          <Trans>Blog</Trans>
        </Link>
        {allowThemeToggle ? (
          <div className={styles.mobileThemeControl}>
            <span>
              <Trans>Reading theme</Trans>
            </span>
            <BlogThemeToggle />
          </div>
        ) : null}
        <LanguageSwitcher variant="inline" />
      </nav>
    </header>
  );
}
