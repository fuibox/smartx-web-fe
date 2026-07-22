import type { Metadata } from "next";

import { V4Hero } from "@/components/v4/hero";
import { V4StoryPage } from "@/components/v4/story-page";
import styles from "@/components/v4/v4.module.css";

export const metadata: Metadata = {
  title: "SmartX | The first AI trading terminal that understands you",
  description:
    "SmartX watches every market, learns how you trade, and surfaces the next opportunity before the crowd sees it.",
  robots: { index: false },
};

export default function V4Page() {
  return (
    <main className={styles.page}>
      <V4Hero />
      <V4StoryPage />
    </main>
  );
}
