import type { Metadata } from "next";

export const SMARTX_SITE_URL = "https://smartx.fun/";
export const SMARTX_SITE_NAME = "SmartX";
export const SMARTX_HERO_TITLE = "On-chain data, made clear.";
export const SMARTX_APP_TITLE = `SmartX for iPhone | ${SMARTX_HERO_TITLE}`;
export const SMARTX_APP_DESCRIPTION =
  "Explore smart money activity and token data, all in one place.";
export const SMARTX_ORGANIZATION_ID = `${SMARTX_SITE_URL}#org`;
export const SMARTX_WEBSITE_ID = `${SMARTX_SITE_URL}#site`;
export const SMARTX_LOGO_URL = `${SMARTX_SITE_URL}assets/smartx-logo.svg`;

export const SMARTX_DEFAULT_SOCIAL_IMAGE = {
  url: "/social-preview.png",
  width: 1200,
  height: 630,
  alt: `SmartX for iPhone — ${SMARTX_HERO_TITLE}`,
} as const;

export const SMARTX_OPEN_GRAPH_DEFAULTS = {
  siteName: SMARTX_SITE_NAME,
  locale: "en_US",
} as const;

export const SMARTX_TWITTER_DEFAULTS = {
  card: "summary_large_image",
} as const;

export const SMARTX_INDEXABLE_ROBOTS = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-video-preview": -1,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
} satisfies NonNullable<Metadata["robots"]>;

export function resolveSmartXUrl(pathOrUrl: string) {
  return new URL(pathOrUrl, SMARTX_SITE_URL).toString();
}
