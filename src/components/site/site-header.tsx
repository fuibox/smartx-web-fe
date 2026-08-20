import Image from "next/image";
import Link from "next/link";

import { BlogThemeToggle } from "@/components/blog/blog-theme-toggle";
import { LaunchAlphaCta } from "@/components/site/launch-alpha-cta";

import styles from "./site-chrome.module.css";

type SiteHeaderProps = {
  active?: "blog" | "waitlist";
};

export function SiteHeader({ active }: SiteHeaderProps) {
  return (
    <header className={styles.header}>
      <Link className={styles.headerLogo} href="/" aria-label="SmartX home">
        <Image src="/assets/smartx-logo.svg" alt="" width={218} height={42} priority />
      </Link>

      <nav className={styles.headerNav} aria-label="Site">
        <Link href="/" className={active ? undefined : styles.activeLink}>
          Home
        </Link>
        <Link
          href="/waitlist"
          className={active === "waitlist" ? styles.activeLink : undefined}
        >
          Waitlist
        </Link>
        <Link href="/blog" className={active === "blog" ? styles.activeLink : undefined}>
          Blog
        </Link>
        <a
          href="https://smartx.gitbook.io/smartx.docs.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          Docs
        </a>
      </nav>

      <div className={styles.headerTools}>
        <BlogThemeToggle />
        <LaunchAlphaCta
          className={styles.headerAction}
          source="blog_header"
        />
      </div>
    </header>
  );
}
