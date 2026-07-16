"use client";

import type { MutableRefObject } from "react";

import { MemoryScene } from "@/components/memory-demo/memory-scene";
import type { MemoryDomainId } from "@/components/memory-demo/memory-demo.types";

import { RelayTexture } from "./hero-relay-scene";
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
  activeEvidenceIndex: number;
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
  activeEvidenceIndex,
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
        showHeroGrid={false}
        activeEvidenceIndex={activeEvidenceIndex}
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
