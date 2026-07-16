import type { Metadata } from "next";

import { FormalNarrativePage } from "@/components/formal-narrative-page";

export const metadata: Metadata = {
  title: "SmartX | See the Move. Know the Why. Make the Trade.",
  description:
    "SmartX connects market movement, evidence, execution, and memory in one AI-native trading terminal.",
};

export default function Home() {
  return <FormalNarrativePage />;
}
