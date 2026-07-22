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
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "SmartX — The AI trading terminal that understands you",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/opengraph-image.png"],
  },
};

export default function Home() {
  return (
    <main className={styles.page}>
      <a className={styles.skipLink} href="#v4-index">
        Skip to product story
      </a>
      <V4Hero />
      <V4StoryPage />
    </main>
  );
}
