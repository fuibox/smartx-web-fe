"use client";

import dynamic from "next/dynamic";

const HeroRelayRuntime = dynamic(
  () =>
    import("@/components/motion-lab/hero-relay-runtime").then(
      (module) => module.HeroRelayRuntime,
    ),
  { ssr: false },
);

export function HeroRelayRuntimeLoader() {
  return <HeroRelayRuntime />;
}
