import Image from "next/image";
import Link from "next/link";

import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <header>
        <Image src="/assets/smartx-logo.svg" alt="SmartX" width={218} height={42} priority />
      </header>
      <section aria-labelledby="not-found-title">
        <p>404 / SIGNAL LOST</p>
        <h1 id="not-found-title">This market moved.</h1>
        <span>The page you requested is no longer at this address.</span>
        <Link href="/">Return to SmartX <i aria-hidden="true">→</i></Link>
      </section>
      <div className={styles.field} aria-hidden="true">
        {Array.from({ length: 28 }).map((_, index) => <i key={index} />)}
      </div>
    </main>
  );
}
