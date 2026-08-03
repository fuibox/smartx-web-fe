import type { Metadata } from "next";

import { BlogIndex } from "@/components/blog/blog-index";
import {
  SMARTX_DEFAULT_SOCIAL_IMAGE,
  SMARTX_INDEXABLE_ROBOTS,
  SMARTX_OPEN_GRAPH_DEFAULTS,
  SMARTX_TWITTER_DEFAULTS,
} from "@/lib/site-metadata";

const title = "SmartX Journal | Prediction Market Guides & Research";
const description =
  "Read SmartX Journal for prediction-market guides, product updates, smart money research, and practical analysis for sharper trading decisions.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/blog/",
  },
  robots: SMARTX_INDEXABLE_ROBOTS,
  openGraph: {
    ...SMARTX_OPEN_GRAPH_DEFAULTS,
    title,
    description,
    url: "/blog/",
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

export default async function BlogPage() {
  return <BlogIndex pageNumber={1} />;
}
