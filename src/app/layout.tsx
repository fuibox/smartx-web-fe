import type { Metadata, Viewport } from "next";

import {
  SMARTX_DEFAULT_SOCIAL_IMAGE,
  SMARTX_OPEN_GRAPH_DEFAULTS,
  SMARTX_SITE_URL,
  SMARTX_TWITTER_DEFAULTS,
} from "@/lib/site-metadata";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SMARTX_SITE_URL),
  title: "SmartX for iPhone | Trade your edge",
  description:
    "The social trading app for memes, perps, stocks, and prediction markets. Follow verified traders and trade in one tap.",
  creator: "SmartX",
  publisher: "SmartX",
  referrer: "strict-origin-when-cross-origin",
  icons: {
    icon: "/assets/favicon.ico",
  },
  openGraph: {
    ...SMARTX_OPEN_GRAPH_DEFAULTS,
    title: "SmartX for iPhone | Trade your edge",
    description:
      "The social trading app for memes, perps, stocks, and prediction markets. Follow verified traders and trade in one tap.",
    type: "website",
    images: [SMARTX_DEFAULT_SOCIAL_IMAGE],
  },
  twitter: {
    ...SMARTX_TWITTER_DEFAULTS,
    title: "SmartX for iPhone | Trade your edge",
    description:
      "The social trading app for memes, perps, stocks, and prediction markets. Follow verified traders and trade in one tap.",
    images: [SMARTX_DEFAULT_SOCIAL_IMAGE],
  },
};

export const viewport: Viewport = {
  themeColor: "#010101",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
