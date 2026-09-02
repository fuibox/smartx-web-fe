import Link from "next/link";

import styles from "./site-chrome.module.css";

export function SiteFooter({ overlay = false }: { overlay?: boolean }) {
  return (
    <footer className={`${styles.footer} ${overlay ? styles.footerOverlay : ""}`}>
      <small>© 2026 SmartX</small>
      <nav className={styles.footerLinks} aria-label="Support and legal">
        <Link href="/support">Support</Link>
        <Link href="/privacy-policy">Privacy Policy</Link>
        <Link href="/terms">Terms of Service</Link>
      </nav>
    </footer>
  );
}
