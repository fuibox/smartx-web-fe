import type { Metadata } from "next";

import { ConsumerHome } from "@/components/consumer-network/consumer-home";
import {
  SMARTX_APP_DESCRIPTION,
  SMARTX_APP_TITLE,
  SMARTX_DEFAULT_SOCIAL_IMAGE,
  SMARTX_INDEXABLE_ROBOTS,
  SMARTX_LOGO_URL,
  SMARTX_OPEN_GRAPH_DEFAULTS,
  SMARTX_ORGANIZATION_ID,
  SMARTX_SITE_URL,
  SMARTX_TWITTER_DEFAULTS,
  SMARTX_WEBSITE_ID,
} from "@/lib/site-metadata";

const title = SMARTX_APP_TITLE;
const description = SMARTX_APP_DESCRIPTION;
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": SMARTX_ORGANIZATION_ID,
      name: "SmartX",
      url: SMARTX_SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: SMARTX_LOGO_URL,
        contentUrl: SMARTX_LOGO_URL,
        width: 218,
        height: 42,
      },
      description,
    },
    {
      "@type": "WebSite",
      "@id": SMARTX_WEBSITE_ID,
      url: SMARTX_SITE_URL,
      name: "SmartX for iPhone",
      inLanguage: "en",
      description,
      publisher: { "@id": SMARTX_ORGANIZATION_ID },
    },
    {
      "@type": "MobileApplication",
      "@id": `${SMARTX_SITE_URL}#ios-app`,
      name: "SmartX",
      applicationCategory: "FinanceApplication",
      operatingSystem: "iOS",
      inLanguage: "en",
      url: SMARTX_SITE_URL,
      image: SMARTX_LOGO_URL,
      description,
      publisher: { "@id": SMARTX_ORGANIZATION_ID },
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
