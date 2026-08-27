"use client";

import Image from "next/image";
import Link from "next/link";
import { useLingui } from "@lingui/react";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";

import { createSmartXAppHref } from "@/lib/smartx-links";

import styles from "./site-chrome.module.css";

const ASSET_ROOT = "/assets/consumer-network";

export function SiteFooter() {
  useLingui();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerDirectory}>
        <div className={styles.footerBrand}>
          <Link className={styles.footerBrandLink} href="/" aria-label={t`SmartX home`}>
            <Image
              src={`${ASSET_ROOT}/logo-black.svg`}
              alt=""
              width={34}
              height={28}
            />
            <span>SmartX</span>
          </Link>

          <div className={styles.socialLinks} aria-label={t`SmartX social links`}>
            <a
              href="https://x.com/SmartXTerminal"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="SmartX on X"
            >
              <Image
                src={`${ASSET_ROOT}/social-x.svg`}
                alt=""
                width={16}
                height={16}
              />
            </a>
            <a
              href="https://t.me/+CTeuBkpOxSNkN2Y0"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="SmartX on Telegram"
            >
              <Image
                src={`${ASSET_ROOT}/social-telegram.svg`}
                alt=""
                width={16}
                height={16}
              />
            </a>
          </div>

          <small className={styles.footerCopyright}>© SmartX 2026</small>
        </div>

        <div className={styles.footerLinks}>
          <nav className={styles.footerGroup} aria-labelledby="footer-product-title">
            <h2 id="footer-product-title">
              <Trans>Product</Trans>
            </h2>
            <a
              href={createSmartXAppHref("footer_link")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Trans>App</Trans>
            </a>
            <Link href="/waitlist/">
              <Trans>Waitlist</Trans>
            </Link>
            <Link href="/blog">
              <Trans>Blog</Trans>
            </Link>
          </nav>
        </div>
      </div>

      <span className={styles.footerWordmark} aria-hidden="true">
        SmartX
      </span>
    </footer>
  );
}
