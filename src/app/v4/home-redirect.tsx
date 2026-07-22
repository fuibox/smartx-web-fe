"use client";

import Link from "next/link";
import { useEffect } from "react";

export function HomeRedirect() {
  useEffect(() => {
    window.location.replace(`/${window.location.search}${window.location.hash}`);
  }, []);

  return (
    <main>
      <p>
        SmartX has moved to <Link href="/">smartx.io</Link>.
      </p>
    </main>
  );
}
