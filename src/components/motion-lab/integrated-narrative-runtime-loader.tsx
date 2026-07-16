"use client";

import dynamic from "next/dynamic";

const IntegratedNarrativeRuntime = dynamic(
  () =>
    import("@/components/motion-lab/integrated-narrative-runtime").then(
      (module) => module.IntegratedNarrativeRuntime,
    ),
  { ssr: false },
);

export function IntegratedNarrativeRuntimeLoader() {
  return <IntegratedNarrativeRuntime />;
}
