import type { Metadata } from "next";

import { WaitlistExperience } from "@/components/waitlist/waitlist-experience";

export const metadata: Metadata = {
  title: "SmartX Waitlist | Find Your Trading Spirit Animal",
  description:
    "Take a 40-second trading personality test, reveal your spirit animal, and move up the SmartX waitlist.",
  alternates: { canonical: "/waitlist/" },
  robots: { index: false, follow: false },
};

export default function WaitlistPage() {
  return <WaitlistExperience />;
}
