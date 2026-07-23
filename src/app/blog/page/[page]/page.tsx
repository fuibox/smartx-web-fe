import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { BlogIndex } from "@/components/blog/blog-index";
import { getBlogArchivePageCount } from "@/content/blog-repository";

type BlogArchivePageProps = {
  params: Promise<{ page: string }>;
};

export const dynamicParams = false;
export const dynamic = "force-static";

export async function generateStaticParams() {
  const pageCount = await getBlogArchivePageCount();

  // Next static export requires at least one concrete value for a dynamic
  // segment. Page 1 is a canonical redirect only until a real page 2 exists.
  if (pageCount === 1) return [{ page: "1" }];

  return Array.from(
    { length: Math.max(0, pageCount - 1) },
    (_, index) => ({
      page: String(index + 2),
    }),
  );
}

export async function generateMetadata({
  params,
}: BlogArchivePageProps): Promise<Metadata> {
  const pageNumber = Number((await params).page);
  const pageCount = await getBlogArchivePageCount();

  if (pageNumber === 1) {
    return {
      alternates: { canonical: "/blog/" },
      robots: { index: false, follow: true },
    };
  }

  if (
    !Number.isInteger(pageNumber) ||
    pageNumber < 2 ||
    pageNumber > pageCount
  ) {
    return {};
  }

  const title = `SmartX Journal — Page ${pageNumber}`;
  const description =
    "Product thinking, market intelligence, and what comes next from SmartX.";
  const canonical = `/blog/page/${pageNumber}/`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function BlogArchivePage({
  params,
}: BlogArchivePageProps) {
  const pageNumber = Number((await params).page);
  const pageCount = await getBlogArchivePageCount();

  if (pageNumber === 1) redirect("/blog/");

  if (
    !Number.isInteger(pageNumber) ||
    pageNumber < 2 ||
    pageNumber > pageCount
  ) {
    notFound();
  }

  return <BlogIndex pageNumber={pageNumber} />;
}
