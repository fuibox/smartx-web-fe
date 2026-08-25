"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { BlogThemeToggle } from "@/components/blog/blog-theme-toggle";
import { createSmartXAppHref } from "@/lib/smartx-links";

import styles from "./site-chrome.module.css";

type SiteHeaderProps = {
  active?: "blog";
  allowThemeToggle?: boolean;
};

export function SiteHeader({
  active,
  allowThemeToggle = false,
}: SiteHeaderProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <header className={styles.header}>
      <Link className={styles.headerBrand} href="/" aria-label="SmartX home">
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
        <nav className={styles.headerNav} aria-label="Site navigation">
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
          <Link
            href="/blog"
            className={active === "blog" ? styles.activeLink : undefined}
            aria-current={active === "blog" ? "page" : undefined}
          >
            Blog
          </Link>
        </nav>

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
            Launch Alpha
          </a>
          <button
            className={styles.mobileMenuButton}
            type="button"
            aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"}
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
        <Link
          href="/blog"
          className={active === "blog" ? styles.activeMobileLink : undefined}
          aria-current={active === "blog" ? "page" : undefined}
          onClick={() => setMobileNavOpen(false)}
        >
          Blog
        </Link>
        {allowThemeToggle ? (
          <div className={styles.mobileThemeControl}>
            <span>Reading theme</span>
            <BlogThemeToggle />
          </div>
        ) : null}
      </nav>
    </header>
  );
}
