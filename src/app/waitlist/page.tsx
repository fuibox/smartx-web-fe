import type { Metadata } from "next";
import { Suspense } from "react";

import { WaitlistExperience } from "@/components/waitlist/waitlist-experience";

export const metadata: Metadata = {
  title: "SmartX Waitlist | Find Your Trader Type",
  description:
    "Take the six-question SmartX trader type test, save your result, and join the invite-only waitlist.",
  alternates: { canonical: "/waitlist/" },
  robots: { index: false, follow: false },
};

export default function WaitlistPage() {
  return (
    <Suspense>
      <WaitlistExperience />
    </Suspense>
  );
}
