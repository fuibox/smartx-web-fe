import type { MetadataRoute } from "next";

import { resolveSmartXUrl, SMARTX_SITE_URL } from "@/lib/site-metadata";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: resolveSmartXUrl("/sitemap.xml"),
    host: new URL(SMARTX_SITE_URL).origin,
  };
}
