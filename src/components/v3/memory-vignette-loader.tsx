"use client";

import dynamic from "next/dynamic";

export const MemoryVignetteLoader = dynamic(
  () => import("./memory-vignette").then((module) => module.MemoryVignette),
  { ssr: false },
);
