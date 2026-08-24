import type { Metadata } from "next";

import { ConsumerHome } from "@/components/consumer-network/consumer-home";
import {
  SMARTX_DEFAULT_SOCIAL_IMAGE,
  SMARTX_INDEXABLE_ROBOTS,
  SMARTX_LOGO_URL,
  SMARTX_OPEN_GRAPH_DEFAULTS,
  SMARTX_ORGANIZATION_ID,
  SMARTX_TWITTER_DEFAULTS,
  SMARTX_WEBSITE_ID,
} from "@/lib/site-metadata";

const title = "SmartX | Trade your edge";
const description =
  "The social trading app for memes, perps, stocks and prediction markets. Follow verified traders and trade in one tap.";
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
      ],
    },
    {
      "@type": "WebSite",
      "@id": SMARTX_WEBSITE_ID,
      url: "https://smartx.io/",
      name: "SmartX",
      inLanguage: "en",
      description,
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
        "Follow verified traders and trade memes, perps, stocks, and prediction markets in one tap.",
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

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <ConsumerHome />
    </>
  );
}
