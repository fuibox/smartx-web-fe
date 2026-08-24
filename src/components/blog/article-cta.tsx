import { createSmartXAppHref } from "@/lib/smartx-links";

import styles from "./blog-article.module.css";

export function ArticleCta() {
  return (
    <section
      className={styles.articleCta}
      aria-labelledby="article-cta-title"
    >
      <div className={styles.articleCtaCopy}>
        <p>SmartX / Early access</p>
        <h2 id="article-cta-title">
          The Consumer Trading Network is taking shape.
        </h2>
      </div>
      <a
        className={styles.articleCtaAction}
        href={createSmartXAppHref("blog_article")}
        target="_blank"
        rel="noopener noreferrer"
      >
        Join the Waitlist
      </a>
    </section>
  );
}
