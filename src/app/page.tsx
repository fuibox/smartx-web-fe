import type { Metadata } from "next";

import { V4Hero } from "@/components/v4/hero";
import { V4StoryPage } from "@/components/v4/story-page";
import styles from "@/components/v4/v4.module.css";

const title = "SmartX | The first AI trading terminal that understands you";
const description =
  "SmartX watches every market, learns how you trade, and surfaces the next opportunity before the crowd sees it.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title,
    description,
    url: "/",
    type: "website",
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
};

export default function Home() {
  return (
    <main className={styles.page}>
      <V4Hero />
      <V4StoryPage />
    </main>
  );
}
