import type { Metadata, Viewport } from "next";

import {
  SMARTX_APP_DESCRIPTION,
  SMARTX_APP_TITLE,
  SMARTX_DEFAULT_SOCIAL_IMAGE,
  SMARTX_OPEN_GRAPH_DEFAULTS,
  SMARTX_SITE_URL,
  SMARTX_TWITTER_DEFAULTS,
} from "@/lib/site-metadata";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SMARTX_SITE_URL),
  title: SMARTX_APP_TITLE,
  description: SMARTX_APP_DESCRIPTION,
  creator: "SmartX",
  publisher: "SmartX",
  referrer: "strict-origin-when-cross-origin",
  icons: {
    icon: "/assets/favicon.ico",
  },
  openGraph: {
    ...SMARTX_OPEN_GRAPH_DEFAULTS,
    title: SMARTX_APP_TITLE,
    description: SMARTX_APP_DESCRIPTION,
    type: "website",
    images: [SMARTX_DEFAULT_SOCIAL_IMAGE],
  },
  twitter: {
    ...SMARTX_TWITTER_DEFAULTS,
    title: SMARTX_APP_TITLE,
    description: SMARTX_APP_DESCRIPTION,
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
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
