import type { Metadata } from "next";
import Link from "next/link";

import { SiteHeader } from "@/components/site/site-header";

import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "Page Not Found | SmartX",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#not-found-content">
        Skip to page message
      </a>
      <SiteHeader />

      <main id="not-found-content" className={styles.main}>
        <section className={styles.content} aria-labelledby="not-found-title">
          <p className={styles.eyebrow}>404 / Page not found</p>
          <h1 id="not-found-title">There&apos;s nothing here.</h1>
          <p className={styles.description}>
            The page you&apos;re looking for doesn&apos;t exist, or the link has
            changed.
          </p>
          <Link className={styles.primaryAction} href="/">
            Back to SmartX
          </Link>
        </section>
      </main>
    </div>
  );
}
