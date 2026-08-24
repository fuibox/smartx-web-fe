import Image from "next/image";
import Link from "next/link";

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
          <Link href="/#product">Product</Link>
          <Link
            href="/blog"
            className={active === "blog" ? styles.activeLink : undefined}
            aria-current={active === "blog" ? "page" : undefined}
          >
            Blog
          </Link>
        </nav>

        <div className={styles.headerTools}>
          {allowThemeToggle ? <BlogThemeToggle /> : null}
          <a
            className={styles.headerAction}
            href={createSmartXAppHref("blog_header")}
            target="_blank"
            rel="noopener noreferrer"
          >
            Join the Waitlist
          </a>
        </div>
      </div>
    </header>
  );
}
