"use client";

import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";

import { createSmartXAppHref } from "@/lib/smartx-links";

import styles from "./blog-article.module.css";

export function ArticleCta() {
  useLingui();

  return (
    <section
      className={styles.articleCta}
      aria-labelledby="article-cta-title"
    >
      <div className={styles.articleCtaCopy}>
        <p>
          <Trans>SmartX / Early access</Trans>
        </p>
        <h2 id="article-cta-title">
          <Trans>The Consumer Trading Network is taking shape.</Trans>
        </h2>
      </div>
      <a
        className={styles.articleCtaAction}
        href={createSmartXAppHref("blog_article")}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Trans>Join the Waitlist</Trans>
      </a>
    </section>
  );
}
