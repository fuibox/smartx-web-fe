import type { Metadata } from "next";

import { OriginalHome } from "@/components/original-home";

export const metadata: Metadata = {
  title: "SmartX Original Hero | Visual Reference",
  description: "The original SmartX homepage kept as a visual reference.",
};

export default function OriginalPage() {
  return <OriginalHome />;
}
