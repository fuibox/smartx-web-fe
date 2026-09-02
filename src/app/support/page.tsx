import type { Metadata } from "next";
import Link from "next/link";

import styles from "@/components/legal/legal-document.module.css";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import {
  SMARTX_DEFAULT_SOCIAL_IMAGE,
  SMARTX_INDEXABLE_ROBOTS,
  SMARTX_OPEN_GRAPH_DEFAULTS,
  SMARTX_TWITTER_DEFAULTS,
} from "@/lib/site-metadata";

const title = "Support | SmartX for iPhone";
const description =
  "Get help with the SmartX iPhone app, account access, privacy requests, and account deletion.";
const supportHref =
  "mailto:support@smartx.io?subject=SmartX%20iOS%20Support";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/support",
  },
  robots: SMARTX_INDEXABLE_ROBOTS,
  openGraph: {
    ...SMARTX_OPEN_GRAPH_DEFAULTS,
    title,
    description,
    url: "/support",
    type: "website",
    images: [SMARTX_DEFAULT_SOCIAL_IMAGE],
  },
  twitter: {
    ...SMARTX_TWITTER_DEFAULTS,
    title,
    description,
    images: [SMARTX_DEFAULT_SOCIAL_IMAGE],
  },
};

export default function SupportPage() {
  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#support-content">
        Skip to support
      </a>
      <SiteHeader />

      <main id="support-content" className={styles.main}>
        <article className={styles.article}>
          <header className={styles.policyHeader}>
            <p className={styles.eyebrow}>SmartX / Support</p>
            <h1>How can we help?</h1>
            <p className={styles.intro}>
              For help with SmartX on iPhone, contact our support team. Include
              your device model, iOS version, SmartX app version, and a short
              description of what happened.
            </p>
            <address className={styles.contactDetails}>
              <div>
                <span>Email</span>
                <a href={supportHref}>Email SmartX Support</a>
              </div>
            </address>
          </header>

          <section className={styles.policySection}>
            <div className={styles.sectionHeading}>
              <span aria-hidden="true">01</span>
              <h2>Account and app support</h2>
            </div>
            <p>
              Contact us if you cannot access your account, encounter unexpected
              behavior, or need help understanding a SmartX feature. Please do not
              send passwords, verification codes, private keys, or seed phrases.
            </p>
          </section>

          <section className={styles.policySection}>
            <div className={styles.sectionHeading}>
              <span aria-hidden="true">02</span>
              <h2>Delete your account</h2>
            </div>
            <p>
              You can delete your SmartX account in the app through{" "}
              <strong>Settings &gt; Account &gt; Delete Account</strong>. If you
              cannot access the app, use the support link above and ask us to help
              with your deletion request.
            </p>
          </section>

          <section className={styles.policySection}>
            <div className={styles.sectionHeading}>
              <span aria-hidden="true">03</span>
              <h2>Privacy and legal</h2>
            </div>
            <p>
              For details about how SmartX handles information, read our{" "}
              <Link href="/privacy-policy">Privacy Policy</Link>. Use of SmartX is
              governed by our <Link href="/terms">Terms of Service</Link>.
            </p>
          </section>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}
