import type { Metadata } from "next";

import { BlogIndex } from "@/components/blog/blog-index";

const title = "SmartX Journal | Product thinking and market intelligence";
const description =
  "Product thinking, market intelligence, and what comes next from SmartX.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/blog/",
  },
  openGraph: {
    title,
    description,
    url: "/blog/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default async function BlogPage() {
  return <BlogIndex pageNumber={1} />;
}
