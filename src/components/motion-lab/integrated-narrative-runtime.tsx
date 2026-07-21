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
  MARKET_SCENE,
  STORY_MARKET_END,
  STORY_SCROLL_VIEWPORTS,
  STORY_SNAP_POINTS,
  STORY_STATES,
  STORY_TAIL,
  type SceneWindow,
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
  const orbitLabelsRef = useRef<HTMLElement | null>(null);
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
    orbitLabelsRef.current =
      runtimeRef.current?.querySelector<HTMLElement>("[data-why-orbit-legend]") ?? null;
  }, []);

  // 停留在 Know the Why 时按时间轮播四个证据维度（每档 3.4s，播完停在最后一档）；
  // 用户手动点击后停止自动轮播，离开区间由 timeline onUpdate 复位。
  useEffect(() => {
    let enteredAt: number | null = null;
    const id = window.setInterval(() => {
      const stage = document.querySelector<HTMLElement>("[data-integrated-narrative-stage]");
      if (stage?.dataset.snapState !== "inspection") {
        enteredAt = null;
        return;
      }
      if (evidenceInteractedRef.current) return;
      if (enteredAt === null) enteredAt = Date.now();
      const nextIndex = Math.min(3, Math.floor((Date.now() - enteredAt) / 3400));
      if (nextIndex !== activeEvidenceIndexRef.current) {
        activeEvidenceIndexRef.current = nextIndex;
        setActiveEvidenceIndex(nextIndex);
      }
    }, 400);
    return () => window.clearInterval(id);
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
      const orbitLegend = "[data-why-orbit-legend]";
      const memoryLayer = "[data-memory-layer]";
      const memoryReceipt = "[data-memory-receipt]";
      const decisionBridge = runtime.querySelector<HTMLElement>("[data-decision-bridge]");
      const tradeNode = runtime.querySelector<HTMLElement>("[data-trade-node]");
      const memoryCoreAnchor = runtime.querySelector<HTMLElement>("[data-memory-core-anchor]");
      const marketTime = (value: number) => value * STORY_MARKET_END;
      const windowAt = (window: SceneWindow) => marketTime(window[0]);
      const windowDuration = (window: SceneWindow) => marketTime(window[1] - window[0]);
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
      gsap.set(orbitLegend, { autoAlpha: 0, y: 12, pointerEvents: "none" });
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
          scrub: 0.5,
          snap: {
            snapTo: STORY_SNAP_POINTS,
            directional: true,
            delay: 0.12,
            // 吸附时长放宽：过渡里的镜头/交接演出需要可读，不能被 0.5s 内闪完
            duration: { min: 0.55, max: 1.2 },
            ease: "power1.inOut",
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
            relayProgressRef.current = clamp(value / marketTime(MARKET_SCENE.hero.relayEnd));
            stage.dataset.progress = value.toFixed(3);

            // 证据切换不再由滚动位置驱动（会被磁吸一闪而过），
            // 改为下方 interval 在 inspection 停留期间按时间轮播；离开区间时复位。
            if (marketValue < 0.38 || marketValue > 0.69) {
              evidenceInteractedRef.current = false;
            }

            if (value >= STORY_TAIL.tradeCommit && !tradeCommittedRef.current) {
              tradeCommittedRef.current = true;
              setTradeCommitted(true);
            } else if (value <= STORY_TAIL.tradeRelease && tradeCommittedRef.current) {
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
            if (value >= marketTime(MARKET_SCENE.hero.rendererPause) && !rendererPausedRef.current && controller) {
              controller.renderOnce();
              controller.pause();
              rendererPausedRef.current = true;
            } else if (value <= marketTime(MARKET_SCENE.hero.rendererResume) && rendererPausedRef.current && controller) {
              controller.resume();
              rendererPausedRef.current = false;
            }

            if (value >= marketTime(MARKET_SCENE.effects.on) && !effectsEnabledRef.current) {
              effectsEnabledRef.current = true;
              setEffectsEnabled(true);
            } else if (value <= marketTime(MARKET_SCENE.effects.off) && effectsEnabledRef.current) {
              effectsEnabledRef.current = false;
              setEffectsEnabled(false);
            }
          },
        },
        0,
      );

      const { hero, copy, product } = MARKET_SCENE;
      timeline.to(
        sourceCanvas,
        { autoAlpha: 0, duration: windowDuration(hero.canvasFade) },
        windowAt(hero.canvasFade),
      );
      timeline.to(
        backdrop,
        { autoAlpha: 0, duration: windowDuration(hero.backdropFade) },
        windowAt(hero.backdropFade),
      );
      timeline.to(
        heroCopy,
        {
          y: () => -Math.min(150, window.innerHeight * 0.16),
          scale: 0.97,
          duration: windowDuration(hero.copyLift),
          ease: "power2.inOut",
          immediateRender: false,
        },
        windowAt(hero.copyLift),
      );
      timeline.to(
        chrome,
        {
          autoAlpha: 0,
          duration: windowDuration(hero.chromeFade),
          ease: "power2.in",
          immediateRender: false,
        },
        windowAt(hero.chromeFade),
      );
      timeline.to(
        sourceTexture,
        { autoAlpha: 0, duration: windowDuration(hero.textureFade) },
        windowAt(hero.textureFade),
      );
      timeline.set(source, { pointerEvents: "none" }, marketTime(hero.pointerRelease));

      timeline.fromTo(
        "[data-move-copy]",
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: marketTime(0.09), ease: "power2.out" },
        marketTime(copy.moveIn),
      );
      timeline.fromTo(
        "[data-signal-legend]",
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: marketTime(0.09), ease: "power2.out" },
        marketTime(copy.legendIn),
      );
      timeline.to("[data-move-copy]", { autoAlpha: 0, y: -22, duration: marketTime(0.05) }, marketTime(copy.moveOut));
      timeline.to("[data-signal-legend]", { autoAlpha: 0, y: -10, duration: marketTime(0.05) }, marketTime(copy.legendOut));
      timeline.fromTo(
        "[data-lock-copy]",
        { autoAlpha: 0, y: 8 },
        { autoAlpha: 1, y: 0, duration: marketTime(0.07), ease: "power2.out" },
        marketTime(copy.lockIn),
      );
      timeline.to("[data-lock-copy]", { autoAlpha: 0, y: -6, duration: marketTime(0.055) }, marketTime(copy.lockOut));
      timeline.fromTo(
        "[data-why-copy]",
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: marketTime(0.08), ease: "power2.out" },
        marketTime(copy.whyIn),
      );
      timeline.fromTo(
        "[data-evidence-panel]",
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: marketTime(0.08), ease: "power2.out" },
        marketTime(copy.evidenceIn),
      );
      timeline.fromTo(
        orbitLegend,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: marketTime(0.08), ease: "power2.out" },
        marketTime(copy.orbitLegendIn),
      );
      timeline.set("[data-evidence-panel]", { pointerEvents: "auto" }, marketTime(copy.evidenceInteractiveFrom));
      timeline.to("[data-why-copy]", { autoAlpha: 0, y: -20, duration: marketTime(0.055) }, marketTime(copy.whyOut));
      timeline.set("[data-evidence-panel]", { pointerEvents: "none" }, marketTime(copy.evidenceInteractiveTo));
      timeline.to(orbitLegend, { autoAlpha: 0, y: -8, duration: marketTime(0.055) }, marketTime(copy.orbitLegendOut));
      timeline.to("[data-evidence-panel]", { autoAlpha: 0, y: -8, duration: marketTime(0.055) }, marketTime(copy.evidenceOut));
      timeline.fromTo(chartBridge, { autoAlpha: 0 }, { autoAlpha: 1, duration: marketTime(0.07) }, marketTime(product.bridgeIn));
      timeline.fromTo(productShell, { autoAlpha: 0 }, { autoAlpha: 1, duration: marketTime(0.06) }, marketTime(product.shellIn));
      timeline.fromTo(
        productFrame,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: marketTime(0.07), ease: "power2.out" },
        marketTime(product.frameIn),
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
        marketTime(product.chartIn),
      );
      timeline.fromTo(
        productParts,
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: marketTime(0.085), ease: "power2.out" },
        marketTime(product.partsIn),
      );
      timeline.to(chartBridge, { autoAlpha: 0, duration: marketTime(0.06) }, marketTime(product.bridgeOut));
      timeline.set(productShell, { pointerEvents: "auto" }, marketTime(product.interactiveFrom));

      timeline.call(() => placeDecisionBridge(tradeNode), [], STORY_TAIL.decisionBridge.place);
      if (decisionBridge) {
        timeline.to(decisionBridge, { autoAlpha: 1, duration: 0.018 }, STORY_TAIL.decisionBridge.show);
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
          STORY_TAIL.decisionBridge.mid,
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
          STORY_TAIL.decisionBridge.dock,
        );
        timeline.to(
          decisionBridge,
          { autoAlpha: 0, scale: 0.42, duration: 0.035 },
          STORY_TAIL.decisionBridge.hide,
        );
      }

      timeline.set(productShell, { pointerEvents: "none" }, STORY_TAIL.productExit);
      timeline.to(
        productShell,
        { autoAlpha: 0, y: -18, scale: 0.99, duration: 0.07, ease: "power2.inOut" },
        STORY_TAIL.productExit,
      );
      timeline.fromTo(
        memoryLayer,
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.08, ease: "power2.out" },
        STORY_TAIL.memoryIn,
      );
      timeline.to(memoryReceipt, { autoAlpha: 1, duration: 0.035 }, STORY_TAIL.receiptIn);
      timeline.set(canvasLayer, { pointerEvents: "auto" }, STORY_TAIL.memoryInteractive);

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
              activeEvidenceRef={activeEvidenceIndexRef}
              orbitLabels={orbitLabelsRef}
              activeDomainId={activeDomainId}
              onDomainChange={setActiveDomainId}
            />
          </Canvas>
        </div>
        <div className={motionStyles.grain} aria-hidden="true" />
        <div className={motionStyles.scanlines} aria-hidden="true" />
        <MotionLabNarrativeOverlay
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
