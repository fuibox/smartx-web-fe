import type { Metadata } from "next";

import { FormalNarrativePage } from "@/components/formal-narrative-page";

export const metadata: Metadata = {
  title: "SmartX Narrative | Decision becomes memory.",
  description: "The SmartX product narrative from signal discovery to AI Memory.",
};

export default function IntegratedNarrativePage() {
  return <FormalNarrativePage />;
}
