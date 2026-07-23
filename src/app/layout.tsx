import type { Metadata, Viewport } from "next";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://smartx.io"),
  title: "SmartX | The AI Trading Terminal Built Around You",
  description:
    "SmartX connects live market signals, smart money context, watchlists, and trading in one AI-native terminal.",
  referrer: "strict-origin-when-cross-origin",
  icons: {
    icon: "/assets/favicon.ico",
  },
  verification: {
    google: "ULRDqnBcK_2XDkvPUK6-3ioSqEiAo-wibKnuIcaQYBs",
  },
  openGraph: {
    title: "SmartX | The AI Trading Terminal Built Around You",
    description:
      "See the move, understand the context, and act from one AI-native trading terminal.",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "SmartX — The AI trading terminal that understands you",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartX | The AI Trading Terminal Built Around You",
    description:
      "See the move, understand the context, and act from one AI-native trading terminal.",
    images: ["/opengraph-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#061b17",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
