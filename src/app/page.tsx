import type { Metadata } from "next";

import { V4Hero } from "@/components/v4/hero";
import { V4StoryPage } from "@/components/v4/story-page";
import styles from "@/components/v4/v4.module.css";
import { getLatestBlogPosts } from "@/content/blog-repository";

const title = "SmartX | The first AI trading terminal that understands you";
const description =
  "SmartX watches every market, learns how you trade, and surfaces the next opportunity before the crowd sees it.";
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://smartx.io/#org",
      name: "SmartX",
      url: "https://smartx.io/",
      logo: "https://smartx.io/opengraph-image.png",
      description,
      sameAs: [
        "https://x.com/SmartXTerminal",
        "https://t.me/SmartX_Community",
        "https://smartx.gitbook.io/smartx.docs.io",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://smartx.io/#site",
      url: "https://smartx.io/",
      name: "SmartX",
      description: "The first AI trading terminal that understands you",
      publisher: { "@id": "https://smartx.io/#org" },
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://smartx.io/#app",
      name: "SmartX",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      url: "https://app.smartx.io/",
      image: "https://smartx.io/opengraph-image.png",
      description:
        "The AI trading terminal that watches every market, learns how you trade, and surfaces the next opportunity before the crowd.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  ],
};

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

export default async function Home() {
  const homepageUpdates = await getLatestBlogPosts(3);

  return (
    <main className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <a className={styles.skipLink} href="#v4-index">
        Skip to product story
      </a>
      <V4Hero />
      <V4StoryPage updates={homepageUpdates} />
    </main>
  );
}
