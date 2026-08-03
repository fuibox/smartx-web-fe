import type { MetadataRoute } from "next";

import {
  getBlogArchivePageCount,
  listAllPublishedBlogPosts,
} from "@/content/blog-repository";
import { resolveSmartXUrl } from "@/lib/site-metadata";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, pageCount] = await Promise.all([
    listAllPublishedBlogPosts(),
    getBlogArchivePageCount(),
  ]);
  const latestBlogUpdate =
    posts[0]?.updatedAt ?? posts[0]?.publishedAt ?? "2026-07-23";

  return [
    {
      url: "https://smartx.io/",
      lastModified: latestBlogUpdate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://smartx.io/blog/",
      lastModified: latestBlogUpdate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...Array.from(
      { length: Math.max(0, pageCount - 1) },
      (_, index) => ({
        url: `https://smartx.io/blog/page/${index + 2}/`,
        lastModified: latestBlogUpdate,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }),
    ),
    ...posts.map((post) => ({
      url: `https://smartx.io/blog/${post.slug}/`,
      lastModified: post.updatedAt ?? post.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      images: [resolveSmartXUrl(post.cover.src)],
    })),
  ];
}
