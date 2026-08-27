import type { Metadata, Viewport } from "next";

import "@fontsource/ibm-plex-serif/400.css";
import "@fontsource/ibm-plex-serif/500.css";
import "@fontsource/ibm-plex-serif/600.css";

import { AppNoticeHost } from "@/components/site/app-notice";
import { LinguiProvider } from "@/lingui";
import { LOCALE_BOOT_SCRIPT } from "@/lingui/boot-script";
import {
  SMARTX_DEFAULT_SOCIAL_IMAGE,
  SMARTX_OPEN_GRAPH_DEFAULTS,
  SMARTX_SITE_URL,
  SMARTX_TWITTER_DEFAULTS,
} from "@/lib/site-metadata";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SMARTX_SITE_URL),
  title: "SmartX | The AI Trading Terminal Built Around You",
  description:
    "SmartX connects live market signals, smart money context, watchlists, and trading in one AI-native terminal.",
  creator: "SmartX",
  publisher: "SmartX",
  referrer: "strict-origin-when-cross-origin",
  icons: {
    icon: "/assets/favicon.ico",
  },
  verification: {
    google: "ULRDqnBcK_2XDkvPUK6-3ioSqEiAo-wibKnuIcaQYBs",
  },
  openGraph: {
    ...SMARTX_OPEN_GRAPH_DEFAULTS,
    title: "SmartX | The AI Trading Terminal Built Around You",
    description:
      "See the move, understand the context, and act from one AI-native trading terminal.",
    type: "website",
    images: [SMARTX_DEFAULT_SOCIAL_IMAGE],
  },
  twitter: {
    ...SMARTX_TWITTER_DEFAULTS,
    title: "SmartX | The AI Trading Terminal Built Around You",
    description:
      "See the move, understand the context, and act from one AI-native trading terminal.",
    images: [SMARTX_DEFAULT_SOCIAL_IMAGE],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#061b17",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: LOCALE_BOOT_SCRIPT }}
        />
      </head>
      <body>
        <LinguiProvider>
          <AppNoticeHost />
          {children}
        </LinguiProvider>
      </body>
    </html>
  );
}
