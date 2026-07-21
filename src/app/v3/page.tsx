import type { Metadata } from "next";

import { EditorialPage } from "@/components/v3/editorial-page";

export const metadata: Metadata = {
  title: "SmartX v3 | The terminal is the hero",
  description:
    "Editorial prototype: real product vignettes, one signal spine, typography-led rhythm.",
  robots: { index: false },
};

export default function V3Page() {
  return <EditorialPage />;
}
