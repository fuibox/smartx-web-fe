import type { Metadata } from "next";

import { V4Hero } from "@/components/v4/hero";
import { V4StoryPage } from "@/components/v4/story-page";
import styles from "@/components/v4/v4.module.css";
import { getLatestBlogPosts } from "@/content/blog-repository";
import {
  SMARTX_DEFAULT_SOCIAL_IMAGE,
  SMARTX_INDEXABLE_ROBOTS,
  SMARTX_LOGO_URL,
  SMARTX_OPEN_GRAPH_DEFAULTS,
  SMARTX_ORGANIZATION_ID,
  SMARTX_TWITTER_DEFAULTS,
  SMARTX_WEBSITE_ID,
} from "@/lib/site-metadata";

const title = "SmartX | The first AI trading terminal that understands you";
const description =
  "SmartX watches every market, learns how you trade, and surfaces the next opportunity before the crowd sees it.";
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": SMARTX_ORGANIZATION_ID,
      name: "SmartX",
      url: "https://smartx.io/",
      logo: {
        "@type": "ImageObject",
        "@id": "https://smartx.io/#logo",
        url: SMARTX_LOGO_URL,
        contentUrl: SMARTX_LOGO_URL,
        width: 218,
        height: 42,
      },
      description,
      sameAs: [
        "https://x.com/SmartXTerminal",
        "https://t.me/SmartX_Community",
        "https://smartx.gitbook.io/smartx.docs.io",
      ],
    },
    {
      "@type": "WebSite",
      "@id": SMARTX_WEBSITE_ID,
      url: "https://smartx.io/",
      name: "SmartX",
      inLanguage: "en",
      description: "The first AI trading terminal that understands you",
      publisher: { "@id": SMARTX_ORGANIZATION_ID },
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://smartx.io/#app",
      name: "SmartX",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      inLanguage: "en",
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
  robots: SMARTX_INDEXABLE_ROBOTS,
  openGraph: {
    ...SMARTX_OPEN_GRAPH_DEFAULTS,
    title,
    description,
    url: "/",
    type: "website",
    images: [SMARTX_DEFAULT_SOCIAL_IMAGE],
  },
  twitter: {
    ...SMARTX_TWITTER_DEFAULTS,
    title,
    description,
    images: [SMARTX_DEFAULT_SOCIAL_IMAGE],
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
