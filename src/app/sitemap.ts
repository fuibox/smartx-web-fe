import type { MetadataRoute } from "next";

import { resolveSmartXUrl } from "@/lib/site-metadata";

export const dynamic = "force-static";

const LAST_UPDATED = "2026-09-02";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: resolveSmartXUrl("/"),
      lastModified: LAST_UPDATED,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: resolveSmartXUrl("/support"),
      lastModified: LAST_UPDATED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: resolveSmartXUrl("/privacy-policy"),
      lastModified: LAST_UPDATED,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: resolveSmartXUrl("/terms"),
      lastModified: LAST_UPDATED,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];
}
