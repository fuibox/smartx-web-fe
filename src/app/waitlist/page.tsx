import type { Metadata } from "next";
import { Suspense } from "react";

import { WaitlistExperience } from "@/components/waitlist/waitlist-experience";
import { QUIZ_ART_SRCS } from "@/lib/waitlist/persona";
import { loadInviterShareCard, requestOrigin } from "@/lib/waitlist/public-share";
import {
  SMARTX_OPEN_GRAPH_DEFAULTS,
  SMARTX_TWITTER_DEFAULTS,
} from "@/lib/site-metadata";

const DEFAULT_METADATA: Metadata = {
  title: "SmartX Waitlist | Find Your Trader Type",
  description:
    "Take the six-question SmartX trader type test, save your result, and join the invite-only waitlist.",
  alternates: { canonical: "/waitlist/" },
  robots: { index: false, follow: false },
};

type WaitlistPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  searchParams,
}: WaitlistPageProps): Promise<Metadata> {
  const params = await searchParams;
  const rawInvite = Array.isArray(params.invite) ? params.invite[0] : params.invite;
  if (!rawInvite) return DEFAULT_METADATA;

  const card = await loadInviterShareCard(rawInvite);
  if (!card) return DEFAULT_METADATA;

  const origin = await requestOrigin();
  const title = `${card.name} | SmartX Trader Type`;
  const description = card.roast
    ? `“${card.roast}” — Take the six-question test to find your own trader type.`
    : "A friend invited you to find your trader type in six questions.";
  const ogImage = {
    url: `${origin}/waitlist/og/?invite=${card.invite}`,
    width: 1200,
    height: 630,
    alt: `${card.name} — SmartX trader type card`,
  };

  return {
    ...DEFAULT_METADATA,
    title,
    description,
    openGraph: {
      ...SMARTX_OPEN_GRAPH_DEFAULTS,
      title,
      description,
      type: "website",
      url: "/waitlist/",
      images: [ogImage],
    },
    twitter: {
      ...SMARTX_TWITTER_DEFAULTS,
      title,
      description,
      images: [ogImage.url],
    },
  };
}

export default function WaitlistPage() {
  return (
    <>
      {QUIZ_ART_SRCS.map((src) => (
        <link key={src} rel="preload" as="image" href={src} />
      ))}
      <Suspense>
        <WaitlistExperience />
      </Suspense>
    </>
  );
}
