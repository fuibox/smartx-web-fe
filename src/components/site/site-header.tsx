"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import styles from "./site-chrome.module.css";

export function SiteHeader() {
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
          <Link href="/support">Support</Link>
          <Link href="/privacy-policy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </nav>

        <div className={styles.headerTools}>
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
        <Link href="/support" onClick={() => setMobileNavOpen(false)}>
          Support
        </Link>
        <Link href="/privacy-policy" onClick={() => setMobileNavOpen(false)}>
          Privacy
        </Link>
        <Link href="/terms" onClick={() => setMobileNavOpen(false)}>
          Terms
        </Link>
      </nav>
    </header>
  );
}
