import type { Metadata, Viewport } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "SmartX | The AI Trading Terminal Built Around You",
  description:
    "SmartX connects live market signals, smart money context, watchlists, and trading in one AI-native terminal.",
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
  },
  twitter: {
    card: "summary",
    title: "SmartX | The AI Trading Terminal Built Around You",
    description:
      "See the move, understand the context, and act from one AI-native trading terminal.",
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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
