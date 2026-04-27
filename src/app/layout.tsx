import type { Metadata, Viewport } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "SmartX | Trade Conviction Before Consensus",
  description:
    "SmartX distills prediction flow, smart money behavior, and live context into actionable signals for prediction market traders.",
  icons: {
    icon: "/assets/favicon.ico",
  },
  openGraph: {
    title: "SmartX | Trade Conviction Before Consensus",
    description:
      "Distill prediction flow, smart money behavior, and live context into actionable market signals.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "SmartX | Trade Conviction Before Consensus",
    description:
      "Distill prediction flow, smart money behavior, and live context into actionable market signals.",
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
