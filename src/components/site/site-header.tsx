import Image from "next/image";
import Link from "next/link";

import styles from "./site-chrome.module.css";

export function SiteHeader() {

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
    </header>
  );
}
