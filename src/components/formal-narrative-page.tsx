import Script from "next/script";

import relayStyles from "@/components/motion-lab/hero-relay.module.css";
import motionStyles from "@/components/motion-lab/motion-lab.module.css";
import { ExperienceMotion } from "@/components/experience-motion";
import { NarrativeEpilogue } from "@/components/narrative-epilogue";
import { OriginalHero } from "@/components/original-hero";
import { ReducedNarrativeFallback } from "@/components/reduced-narrative-fallback";

import { IntegratedNarrativeRuntimeLoader } from "@/components/motion-lab/integrated-narrative-runtime-loader";

export function FormalNarrativePage() {
  return (
    <>
      <main
        className={`${relayStyles.relay} ${motionStyles.lab}`}
        data-integrated-narrative-root
      >
        <div
          className={`${relayStyles.stage} ${motionStyles.stage}`}
          data-integrated-narrative-stage
          data-progress="0.000"
          data-snap-state="hero"
        >
          <IntegratedNarrativeRuntimeLoader />
          <div className={relayStyles.backdrop} data-hero-backdrop aria-hidden="true" />
          <div className={relayStyles.heroSource} data-hero-source>
            <OriginalHero />
          </div>
        </div>
      </main>
      <ReducedNarrativeFallback />
      <ExperienceMotion />
      <NarrativeEpilogue />
      <Script src="/smartx-main.js" strategy="afterInteractive" />
    </>
  );
}
