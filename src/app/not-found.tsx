"use client";

import Image from "next/image";
import Link from "next/link";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";

import styles from "./not-found.module.css";

export default function NotFound() {
  useLingui();

  return (
    <main className={styles.page}>
      <header>
        <Image src="/assets/smartx-logo.svg" alt="SmartX" width={218} height={42} priority />
      </header>
      <section aria-labelledby="not-found-title">
        <p>
          <Trans>404 / SIGNAL LOST</Trans>
        </p>
        <h1 id="not-found-title">
          <Trans>This market moved.</Trans>
        </h1>
        <span>
          <Trans>The page you requested is no longer at this address.</Trans>
        </span>
        <Link href="/">
          <Trans>Return to SmartX</Trans> <i aria-hidden="true">→</i>
        </Link>
      </section>
      <div className={styles.field} aria-hidden="true">
        {Array.from({ length: 28 }).map((_, index) => <i key={index} />)}
      </div>
    </main>
  );
}
