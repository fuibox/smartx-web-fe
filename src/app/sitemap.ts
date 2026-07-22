import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://smartx.io/",
      lastModified: "2026-07-22",
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
