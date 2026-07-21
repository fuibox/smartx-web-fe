"use client";

import type { MutableRefObject } from "react";

import { MemoryScene } from "@/components/memory-demo/memory-scene";
import type { MemoryDomainId } from "@/components/memory-demo/memory-demo.types";

import { RelayTexture } from "./relay-texture";
import { MotionLabScene, type HandoffAnchorRef, type LockCopyRef } from "./motion-lab-scene";

type IntegratedNarrativeSceneProps = {
  storyProgress: MutableRefObject<number>;
  marketProgress: MutableRefObject<number>;
  relayProgress: MutableRefObject<number>;
  sourceCanvas: MutableRefObject<HTMLCanvasElement | null>;
  handoffAnchor: HandoffAnchorRef;
  lockCopyRef: LockCopyRef;
  reducedMotion: boolean;
  enablePostprocessing: boolean;
  activeEvidenceRef: MutableRefObject<number>;
  orbitLabels: MutableRefObject<HTMLElement | null>;
  activeDomainId: MemoryDomainId;
  onDomainChange: (domainId: MemoryDomainId) => void;
};

export function IntegratedNarrativeScene({
  storyProgress,
  marketProgress,
  relayProgress,
  sourceCanvas,
  handoffAnchor,
  lockCopyRef,
  reducedMotion,
  enablePostprocessing,
  activeEvidenceRef,
  orbitLabels,
  activeDomainId,
  onDomainChange,
}: IntegratedNarrativeSceneProps) {
  return (
    <>
      <MotionLabScene
        progress={marketProgress}
        reducedMotion={reducedMotion}
        handoffAnchor={handoffAnchor}
        lockCopyRef={lockCopyRef}
        enablePostprocessing={enablePostprocessing}
        activeEvidenceRef={activeEvidenceRef}
        orbitLabels={orbitLabels}
      />
      <MemoryScene
        progress={storyProgress}
        activeDomainId={activeDomainId}
        onDomainChange={onDomainChange}
        reducedMotion={reducedMotion}
      />
      <RelayTexture
        progress={relayProgress}
        sourceCanvas={sourceCanvas}
        reducedMotion={reducedMotion}
      />
    </>
  );
}
