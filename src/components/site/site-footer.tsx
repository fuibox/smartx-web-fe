import Image from "next/image";
import Link from "next/link";
import { FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import { FooterWordmark } from "@/components/v4/footer-wordmark";
import { createSmartXAppHref } from "@/lib/smartx-links";

import styles from "./site-chrome.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerDirectory}>
        <div className={styles.footerBrand}>
          <Image
            src="/assets/smartx-logo.svg"
            alt="SmartX"
            width={218}
            height={42}
            style={{ width: 132, height: "auto" }}
          />
          <div className={styles.socialLinks} aria-label="SmartX social links">
            <a
              href="https://x.com/SmartXTerminal"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="SmartX on X"
            >
              <FaXTwitter aria-hidden="true" />
            </a>
            <a
              href="https://t.me/+CTeuBkpOxSNkN2Y0"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="SmartX on Telegram"
            >
              <FaTelegramPlane aria-hidden="true" />
            </a>
          </div>
          <span className={styles.footerCopyright}>© SmartX 2026</span>
        </div>

        <nav className={styles.footerGroup} aria-labelledby="footer-product-title">
          <h2 id="footer-product-title">Product</h2>
          <a
            href={createSmartXAppHref("footer_link")}
            target="_blank"
            rel="noopener noreferrer"
          >
            App
          </a>
          <Link href="/waitlist">Waitlist</Link>
          <Link href="/blog">Blog</Link>
          <a
            href="https://smartx.gitbook.io/smartx.docs.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            Docs
          </a>
        </nav>

        <nav className={styles.footerGroup} aria-labelledby="footer-legal-title">
          <h2 id="footer-legal-title">Legal</h2>
          <a
            href="https://smartx.gitbook.io/smartx.docs.io/terms-of-service"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Service
          </a>
          <a
            href="https://smartx.gitbook.io/smartx.docs.io/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
        </nav>
      </div>

      <FooterWordmark />
    </footer>
  );
}
