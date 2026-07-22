import type { Metadata } from "next";

import { HomeRedirect } from "./home-redirect";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function V4Page() {
  return <HomeRedirect />;
}
