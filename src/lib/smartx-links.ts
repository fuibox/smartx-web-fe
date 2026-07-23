const SMARTX_APP_URL = "https://app.smartx.io/";

export type SmartXAppContent =
  | "hero_cta"
  | "market_demo_cta"
  | "closing_cta"
  | "footer_link"
  | "blog_header"
  | "blog_article";

export function createSmartXAppHref(
  content: SmartXAppContent,
) {
  const params = new URLSearchParams({
    utm_source: "smartx_website",
    utm_medium: "website",
    utm_campaign: "homepage_launch",
    utm_content: content,
  });

  return `${SMARTX_APP_URL}?${params.toString()}`;
}
