"use client";

import { useGSAP } from "@gsap/react";
import { Canvas } from "@react-three/fiber";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";

import { MemoryOverlay } from "@/components/memory-demo/memory-overlay";
import type { MemoryDomainId } from "@/components/memory-demo/memory-demo.types";
import { fedRateTradeMemoryEvent } from "@/components/product-demo/market-demo.fixture";
import type { TradeMemoryEvent } from "@/components/product-demo/market-demo.types";

import { IntegratedNarrativeScene } from "./integrated-narrative-scene";
import runtimeStyles from "./integrated-narrative-runtime.module.css";
import { MotionLabNarrativeOverlay } from "./motion-lab-narrative-overlay";
import type { HandoffAnchorRef } from "./motion-lab-scene";
import motionStyles from "./motion-lab.module.css";
import {
  STORY_MARKET_END,
  STORY_SCROLL_VIEWPORTS,
  STORY_SNAP_POINTS,
  STORY_STATES,
} from "./story.config";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

export function IntegratedNarrativeRuntime() {
  const runtimeRef = useRef<HTMLDivElement>(null);
  const sourceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const storyProgressRef = useRef(0);
  const marketProgressRef = useRef(0);
  const relayProgressRef = useRef(0);
  const rendererPausedRef = useRef(false);
  const effectsEnabledRef = useRef(false);
  const evidenceInteractedRef = useRef(false);
  const activeEvidenceIndexRef = useRef(0);
  const tradeCommittedRef = useRef(false);
  const handoffAnchorRef = useRef<HandoffAnchorRef["current"]>({
    left: 0.22,
    top: 0.26,
    width: 0.54,
    height: 0.5,
  });
  const lockCopyRef = useRef<HTMLDivElement>(null);
  const [webglReady, setWebglReady] = useState(false);
  const [effectsEnabled, setEffectsEnabled] = useState(false);
  const [narrativeActive, setNarrativeActive] = useState(true);
  const [activeEvidenceIndex, setActiveEvidenceIndex] = useState(0);
  const [activeDomainId, setActiveDomainId] = useState<MemoryDomainId>("signals");
  const [tradeCommitted, setTradeCommitted] = useState(false);
  const [tradeEvent] = useState<TradeMemoryEvent | null>(fedRateTradeMemoryEvent);
  const [reducedMotion, setReducedMotion] = useState(false);

  const handleEvidenceChange = useCallback((index: number) => {
    evidenceInteractedRef.current = true;
    activeEvidenceIndexRef.current = index;
    setActiveEvidenceIndex(index);
  }, []);

  const handleTradeCommit = useCallback(() => {
    tradeCommittedRef.current = true;
    setTradeCommitted(true);
  }, []);

  useLayoutEffect(() => {
    const root = runtimeRef.current?.closest<HTMLElement>("[data-integrated-narrative-root]");
    sourceCanvasRef.current = root?.querySelector<HTMLCanvasElement>("#kinetic-grid") ?? null;
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(media.matches);
    updatePreference();
    media.addEventListener("change", updatePreference);
    document.documentElement.classList.add("motion-lab-active");

    return () => {
      media.removeEventListener("change", updatePreference);
      document.documentElement.classList.remove("motion-lab-active");
      window.SmartXKineticGrid?.resume();
    };
  }, []);

  useLayoutEffect(() => {
    const root = runtimeRef.current?.closest<HTMLElement>("[data-integrated-narrative-root]");
    const stage = root?.querySelector<HTMLElement>("[data-integrated-narrative-stage]");
    const chart = runtimeRef.current?.querySelector<HTMLElement>("[data-product-chart]");
    const bridge = runtimeRef.current?.querySelector<SVGElement>("[data-chart-bridge]");
    if (!stage || !chart || !bridge) return;

    const updateAnchor = () => {
      const stageRect = stage.getBoundingClientRect();
      const chartRect = chart.getBoundingClientRect();
      if (stageRect.width === 0 || stageRect.height === 0) return;

      handoffAnchorRef.current = {
        left: (chartRect.left - stageRect.left) / stageRect.width,
        top: (chartRect.top - stageRect.top) / stageRect.height,
        width: chartRect.width / stageRect.width,
        height: chartRect.height / stageRect.height,
      };
      bridge.style.left = `${chartRect.left - stageRect.left}px`;
      bridge.style.top = `${chartRect.top - stageRect.top}px`;
      bridge.style.width = `${chartRect.width}px`;
      bridge.style.height = `${chartRect.height}px`;
    };

    const observer = new ResizeObserver(updateAnchor);
    observer.observe(stage);
    observer.observe(chart);
    const frame = requestAnimationFrame(updateAnchor);
    window.addEventListener("resize", updateAnchor);
    ScrollTrigger.addEventListener("refresh", updateAnchor);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", updateAnchor);
      ScrollTrigger.removeEventListener("refresh", updateAnchor);
    };
  }, []);

  useGSAP(
    () => {
      if (!webglReady) return;

      const runtime = runtimeRef.current;
      const root = runtime?.closest<HTMLElement>("[data-integrated-narrative-root]");
      const stage = root?.querySelector<HTMLElement>("[data-integrated-narrative-stage]");
      const sourceCanvas = root?.querySelector<HTMLCanvasElement>("#kinetic-grid");
      const backdrop = root?.querySelector<HTMLElement>("[data-hero-backdrop]");
      const source = root?.querySelector<HTMLElement>("[data-hero-source]");
      const chrome = root?.querySelector<HTMLElement>(".hero-content");
      const heroCopy = root?.querySelector<HTMLElement>(".hero-inner");
      const sourceTexture = root?.querySelectorAll<HTMLElement>(".grain-layer, .scan-layer");
      if (
        !runtime ||
        !stage ||
        !sourceCanvas ||
        !backdrop ||
        !source ||
        !chrome ||
        !heroCopy ||
        !sourceTexture
      ) {
        return;
      }

      const productShell = "[data-product-shell]";
      const canvasLayer = "[data-webgl-layer]";
      const productFrame = '[data-product-part="instrument"]';
      const productChart = "[data-product-chart]";
      const productParts = '[data-product-part="narrative"]';
      const chartBridge = "[data-chart-bridge]";
      const memoryLayer = "[data-memory-layer]";
      const memoryReceipt = "[data-memory-receipt]";
      const decisionBridge = runtime.querySelector<HTMLElement>("[data-decision-bridge]");
      const tradeNode = runtime.querySelector<HTMLElement>("[data-trade-node]");
      const memoryCoreAnchor = runtime.querySelector<HTMLElement>("[data-memory-core-anchor]");
      const marketTime = (value: number) => value * STORY_MARKET_END;
      const chartClip = () => "inset(0% 0% 0% 100%)";
      const relativeRect = (element: HTMLElement | null) => {
        const runtimeRect = runtime.getBoundingClientRect();
        const elementRect = element?.getBoundingClientRect() ?? runtimeRect;
        return {
          left: elementRect.left - runtimeRect.left,
          top: elementRect.top - runtimeRect.top,
          width: elementRect.width,
          height: elementRect.height,
        };
      };
      const placeDecisionBridge = (element: HTMLElement | null) => {
        if (!decisionBridge) return;
        const rect = relativeRect(element);
        gsap.set(decisionBridge, {
          left: rect.left + rect.width / 2 - 11,
          top: rect.top + rect.height / 2 - 11,
          x: 0,
          y: 0,
          scale: 1,
        });
      };

      sourceCanvasRef.current = sourceCanvas;
      window.SmartXKineticGrid?.renderOnce();
      gsap.set(source, { pointerEvents: "auto" });
      gsap.set("[data-scene-copy]", { autoAlpha: 0 });
      gsap.set("[data-signal-legend]", { autoAlpha: 0, y: 12 });
      gsap.set("[data-evidence-panel]", { autoAlpha: 0, y: 12, pointerEvents: "none" });
      gsap.set(productShell, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(canvasLayer, { pointerEvents: "none" });
      gsap.set(productFrame, { autoAlpha: 0, y: 12 });
      gsap.set(productChart, { autoAlpha: 0, clipPath: chartClip });
      gsap.set(productParts, { autoAlpha: 0, y: 16 });
      gsap.set(chartBridge, { autoAlpha: 0 });
      gsap.set(memoryLayer, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(memoryReceipt, { autoAlpha: 0 });
      if (decisionBridge) gsap.set(decisionBridge, { autoAlpha: 0 });

      if (reducedMotion) {
        storyProgressRef.current = 0;
        marketProgressRef.current = 0;
        relayProgressRef.current = 0;
        stage.dataset.progress = "0.000";
        stage.dataset.snapState = "hero";
        gsap.set(source, { autoAlpha: 1, pointerEvents: "auto" });
        gsap.set(backdrop, { autoAlpha: 1 });
        gsap.set(sourceCanvas, { autoAlpha: 1 });
        gsap.set(chrome, { autoAlpha: 1 });
        gsap.set(heroCopy, { autoAlpha: 1, y: 0, scale: 1 });
        gsap.set(sourceTexture, { autoAlpha: 1 });
        gsap.set(productShell, { autoAlpha: 0, pointerEvents: "none" });
        window.SmartXKineticGrid?.pause();
        rendererPausedRef.current = true;
        return;
      }

      const driver = { progress: 0 };
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * STORY_SCROLL_VIEWPORTS)}`,
          pin: stage,
          pinSpacing: true,
          scrub: 0.32,
          snap: {
            snapTo: STORY_SNAP_POINTS,
            directional: true,
            delay: 0.1,
            duration: { min: 0.24, max: 0.58 },
            ease: "power1.out",
            inertia: false,
          },
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onEnter: () => setNarrativeActive(true),
          onEnterBack: () => setNarrativeActive(true),
          onLeave: () => setNarrativeActive(false),
          onLeaveBack: () => setNarrativeActive(false),
        },
      });

      timeline.to(
        driver,
        {
          progress: 1,
          duration: 1,
          onUpdate: () => {
            const value = driver.progress;
            const marketValue = clamp(value / STORY_MARKET_END);
            storyProgressRef.current = value;
            marketProgressRef.current = marketValue;
            relayProgressRef.current = clamp(value / marketTime(0.28));
            stage.dataset.progress = value.toFixed(3);

            if (marketValue >= 0.41 && marketValue <= 0.65) {
              if (!evidenceInteractedRef.current) {
                const nextEvidenceIndex = Math.min(
                  3,
                  Math.max(0, Math.floor((marketValue - 0.41) / 0.05)),
                );
                if (nextEvidenceIndex !== activeEvidenceIndexRef.current) {
                  activeEvidenceIndexRef.current = nextEvidenceIndex;
                  setActiveEvidenceIndex(nextEvidenceIndex);
                }
              }
            } else if (marketValue < 0.38 || marketValue > 0.69) {
              evidenceInteractedRef.current = false;
            }

            if (value >= 0.82 && !tradeCommittedRef.current) {
              tradeCommittedRef.current = true;
              setTradeCommitted(true);
            } else if (value <= 0.68 && tradeCommittedRef.current) {
              tradeCommittedRef.current = false;
              setTradeCommitted(false);
            }

            const nearestState = STORY_STATES.reduce((nearest, state) =>
              Math.abs(state.progress - value) < Math.abs(nearest.progress - value)
                ? state
                : nearest,
            );
            stage.dataset.snapState = nearestState.id;

            const controller = window.SmartXKineticGrid;
            if (value >= marketTime(0.13) && !rendererPausedRef.current && controller) {
              controller.renderOnce();
              controller.pause();
              rendererPausedRef.current = true;
            } else if (value <= marketTime(0.08) && rendererPausedRef.current && controller) {
              controller.resume();
              rendererPausedRef.current = false;
            }

            if (value >= marketTime(0.31) && !effectsEnabledRef.current) {
              effectsEnabledRef.current = true;
              setEffectsEnabled(true);
            } else if (value <= marketTime(0.25) && effectsEnabledRef.current) {
              effectsEnabledRef.current = false;
              setEffectsEnabled(false);
            }
          },
        },
        0,
      );

      timeline.to(sourceCanvas, { autoAlpha: 0, duration: marketTime(0.11) }, marketTime(0.045));
      timeline.to(backdrop, { autoAlpha: 0, duration: marketTime(0.13) }, marketTime(0.05));
      timeline.to(
        heroCopy,
        {
          y: () => -Math.min(84, window.innerHeight * 0.09),
          scale: 0.99,
          duration: marketTime(0.14),
          ease: "power2.inOut",
          immediateRender: false,
        },
        marketTime(0.006),
      );
      timeline.to(
        chrome,
        { autoAlpha: 0, duration: marketTime(0.08), ease: "power2.in", immediateRender: false },
        marketTime(0.09),
      );
      timeline.to(sourceTexture, { autoAlpha: 0, duration: marketTime(0.07) }, marketTime(0.115));
      timeline.set(source, { pointerEvents: "none" }, marketTime(0.16));

      timeline.fromTo(
        "[data-move-copy]",
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: marketTime(0.09), ease: "power2.out" },
        marketTime(0.13),
      );
      timeline.fromTo(
        "[data-signal-legend]",
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: marketTime(0.09), ease: "power2.out" },
        marketTime(0.16),
      );
      timeline.to("[data-move-copy]", { autoAlpha: 0, y: -22, duration: marketTime(0.05) }, marketTime(0.26));
      timeline.to("[data-signal-legend]", { autoAlpha: 0, y: -10, duration: marketTime(0.05) }, marketTime(0.255));
      timeline.fromTo(
        "[data-lock-copy]",
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: marketTime(0.07), ease: "power2.out" },
        marketTime(0.32),
      );
      timeline.to("[data-lock-copy]", { autoAlpha: 0, y: -6, duration: marketTime(0.055) }, marketTime(0.45));
      timeline.fromTo(
        "[data-why-copy]",
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: marketTime(0.08), ease: "power2.out" },
        marketTime(0.43),
      );
      timeline.fromTo(
        "[data-evidence-panel]",
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: marketTime(0.08), ease: "power2.out" },
        marketTime(0.45),
      );
      timeline.set("[data-evidence-panel]", { pointerEvents: "auto" }, marketTime(0.49));
      timeline.to("[data-why-copy]", { autoAlpha: 0, y: -20, duration: marketTime(0.055) }, marketTime(0.64));
      timeline.set("[data-evidence-panel]", { pointerEvents: "none" }, marketTime(0.655));
      timeline.to("[data-evidence-panel]", { autoAlpha: 0, y: -8, duration: marketTime(0.055) }, marketTime(0.66));
      timeline.fromTo(chartBridge, { autoAlpha: 0 }, { autoAlpha: 1, duration: marketTime(0.07) }, marketTime(0.68));
      timeline.fromTo(productShell, { autoAlpha: 0 }, { autoAlpha: 1, duration: marketTime(0.06) }, marketTime(0.71));
      timeline.fromTo(
        productFrame,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: marketTime(0.07), ease: "power2.out" },
        marketTime(0.715),
      );
      timeline.fromTo(
        productChart,
        { autoAlpha: 0, clipPath: chartClip },
        {
          autoAlpha: 1,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: marketTime(0.13),
          ease: "power2.inOut",
        },
        marketTime(0.73),
      );
      timeline.fromTo(
        productParts,
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: marketTime(0.085), ease: "power2.out" },
        marketTime(0.8),
      );
      timeline.to(chartBridge, { autoAlpha: 0, duration: marketTime(0.06) }, marketTime(0.81));
      timeline.set(productShell, { pointerEvents: "auto" }, marketTime(0.84));

      timeline.call(() => placeDecisionBridge(tradeNode), [], 0.822);
      if (decisionBridge) {
        timeline.to(decisionBridge, { autoAlpha: 1, duration: 0.018 }, 0.824);
        timeline.to(
          decisionBridge,
          {
            left: () => {
              const from = relativeRect(tradeNode);
              const to = relativeRect(memoryCoreAnchor);
              return (from.left + from.width / 2 + to.left + to.width / 2) / 2 + 44;
            },
            top: () => {
              const from = relativeRect(tradeNode);
              const to = relativeRect(memoryCoreAnchor);
              return (from.top + from.height / 2 + to.top + to.height / 2) / 2 - 62;
            },
            scale: 0.9,
            duration: 0.045,
            ease: "power2.inOut",
          },
          0.834,
        );
        timeline.to(
          decisionBridge,
          {
            left: () => {
              const target = relativeRect(memoryCoreAnchor);
              return target.left + target.width / 2 - 11;
            },
            top: () => {
              const target = relativeRect(memoryCoreAnchor);
              return target.top + target.height / 2 - 11;
            },
            scale: 0.72,
            duration: 0.07,
            ease: "power2.inOut",
          },
          0.872,
        );
        timeline.to(decisionBridge, { autoAlpha: 0, scale: 0.42, duration: 0.035 }, 0.925);
      }

      timeline.set(productShell, { pointerEvents: "none" }, 0.835);
      timeline.to(
        productShell,
        { autoAlpha: 0, y: -18, scale: 0.99, duration: 0.07, ease: "power2.inOut" },
        0.835,
      );
      timeline.fromTo(
        memoryLayer,
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.08, ease: "power2.out" },
        0.855,
      );
      timeline.to(memoryReceipt, { autoAlpha: 1, duration: 0.035 }, 0.9);
      timeline.set(canvasLayer, { pointerEvents: "auto" }, 0.93);

      return () => {
        if (rendererPausedRef.current) {
          window.SmartXKineticGrid?.resume();
          rendererPausedRef.current = false;
        }
      };
    },
    {
      scope: runtimeRef,
      dependencies: [reducedMotion, webglReady],
      revertOnUpdate: true,
    },
  );

  return (
    <>
      <style jsx global>{`
        html.motion-lab-active {
          scrollbar-width: none;
          background: #020706;
        }

        html.motion-lab-active::-webkit-scrollbar {
          display: none;
        }

        @media (prefers-reduced-motion: reduce) {
          html.motion-lab-active {
            scrollbar-width: auto;
          }

          html.motion-lab-active::-webkit-scrollbar {
            display: block;
          }
        }
      `}</style>
      <div ref={runtimeRef} className={runtimeStyles.runtime}>
        <div className={runtimeStyles.canvasLayer} data-webgl-layer aria-hidden="true">
          <Canvas
            className={runtimeStyles.canvas}
            frameloop={narrativeActive ? "always" : "demand"}
            camera={{ position: [0, 0, 8.2], fov: 44, near: 0.1, far: 60 }}
            dpr={[1, 1.5]}
            gl={{
              alpha: false,
              antialias: true,
              powerPreference: "high-performance",
              toneMapping: THREE.NoToneMapping,
            }}
            fallback={<div className={motionStyles.canvasFallback}>WebGL unavailable</div>}
            onCreated={() => setWebglReady(true)}
          >
            <IntegratedNarrativeScene
              storyProgress={storyProgressRef}
              marketProgress={marketProgressRef}
              relayProgress={relayProgressRef}
              sourceCanvas={sourceCanvasRef}
              handoffAnchor={handoffAnchorRef}
              lockCopyRef={lockCopyRef}
              reducedMotion={reducedMotion}
              enablePostprocessing={effectsEnabled}
              activeEvidenceIndex={activeEvidenceIndex}
              activeDomainId={activeDomainId}
              onDomainChange={setActiveDomainId}
            />
          </Canvas>
        </div>
        <div className={motionStyles.grain} aria-hidden="true" />
        <div className={motionStyles.scanlines} aria-hidden="true" />
        <MotionLabNarrativeOverlay
          showTradeCopy={false}
          activeEvidenceIndex={activeEvidenceIndex}
          onEvidenceChange={handleEvidenceChange}
          lockCopyRef={lockCopyRef}
          tradeCommitted={tradeCommitted}
          onTradeCommit={handleTradeCommit}
        />
        <MemoryOverlay
          activeDomainId={activeDomainId}
          onDomainChange={setActiveDomainId}
          tradeEvent={tradeEvent}
        />
      </div>
    </>
  );
}
