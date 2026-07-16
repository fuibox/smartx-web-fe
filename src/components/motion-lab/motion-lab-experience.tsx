"use client";

import { useGSAP } from "@gsap/react";
import { Canvas } from "@react-three/fiber";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { MotionLabNarrativeOverlay } from "./motion-lab-narrative-overlay";
import { MotionLabScene, type HandoffAnchorRef } from "./motion-lab-scene";
import styles from "./motion-lab.module.css";
import { STORY_SCROLL_VIEWPORTS, STORY_SNAP_POINTS, STORY_STATES } from "./story.config";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type MotionLabExperienceProps = {
  semanticSnap?: boolean;
};

export function MotionLabExperience({ semanticSnap = false }: MotionLabExperienceProps) {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const handoffAnchorRef = useRef<HandoffAnchorRef["current"]>({
    left: 0.22,
    top: 0.26,
    width: 0.54,
    height: 0.5,
  });
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(media.matches);
    updatePreference();
    media.addEventListener("change", updatePreference);
    document.documentElement.classList.add("motion-lab-active");

    return () => {
      media.removeEventListener("change", updatePreference);
      document.documentElement.classList.remove("motion-lab-active");
    };
  }, []);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const chart = rootRef.current?.querySelector<SVGElement>("[data-product-chart]");
    const bridge = rootRef.current?.querySelector<SVGElement>("[data-chart-bridge]");
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
      const root = rootRef.current;
      const stage = stageRef.current;
      if (!root || !stage) return;

      const productShell = "[data-product-shell]";
      const productFrame = "[data-product-frame]";
      const productChart = '[data-product-part="chart"]';
      const productParts = '[data-product-part]:not([data-product-part="chart"])';
      const chartBridge = "[data-chart-bridge]";

      if (reducedMotion) {
        progressRef.current = 0.82;
        stage.dataset.progress = "0.820";
        if (semanticSnap) stage.dataset.snapState = "product";
        gsap.set("[data-lab-hero]", { autoAlpha: 0 });
        gsap.set("[data-scene-copy]", { autoAlpha: 0 });
        gsap.set("[data-evidence]", { autoAlpha: 0 });
        gsap.set(productShell, { autoAlpha: 1, pointerEvents: "auto" });
        gsap.set(productFrame, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set("[data-product-part]", { autoAlpha: 1, x: 0, y: 0 });
        gsap.set(chartBridge, { autoAlpha: 0 });
        gsap.set("[data-trade-copy]", { autoAlpha: 1, y: 0 });
        return;
      }

      const chartClip = () =>
        window.innerWidth <= 720
          ? "inset(16% 0% 15% 0%)"
          : "inset(16% 21% 4% 19%)";
      const settleProduct = () => {
        gsap.set(productShell, { autoAlpha: 1, pointerEvents: "auto" });
        gsap.set(productFrame, { clipPath: "inset(0% 0% 0% 0%)" });
        gsap.set("[data-product-part]", { autoAlpha: 1, x: 0, y: 0 });
        gsap.set(chartBridge, { autoAlpha: 0 });
      };

      gsap.set(productShell, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(productFrame, { clipPath: chartClip });
      gsap.set(productChart, { autoAlpha: 0 });
      gsap.set(productParts, { autoAlpha: 0 });
      gsap.set(chartBridge, { autoAlpha: 0 });

      const driver = { progress: 0 };
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () =>
            `+=${Math.round(window.innerHeight * (semanticSnap ? STORY_SCROLL_VIEWPORTS : 5.4))}`,
          pin: stage,
          pinSpacing: true,
          scrub: semanticSnap ? 0.45 : 0.65,
          snap: semanticSnap
            ? {
                snapTo: STORY_SNAP_POINTS,
                directional: true,
                delay: 0.1,
                duration: { min: 0.28, max: 0.9 },
                ease: "power2.inOut",
                inertia: false,
              }
            : undefined,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onLeave: settleProduct,
        },
      });

      timeline.to(
        driver,
        {
          progress: 1,
          duration: 10,
          onUpdate: () => {
            progressRef.current = driver.progress;
            stage.dataset.progress = driver.progress.toFixed(3);
            if (semanticSnap) {
              const nearestState = STORY_STATES.reduce((nearest, state) =>
                Math.abs(state.progress - driver.progress) <
                Math.abs(nearest.progress - driver.progress)
                  ? state
                  : nearest,
              );
              stage.dataset.snapState = nearestState.id;
            }
          },
        },
        0,
      );

      timeline.to("[data-lab-hero]", { autoAlpha: 0, y: -36, duration: 0.8 }, 0.45);
      timeline.fromTo(
        "[data-move-copy]",
        { autoAlpha: 0, y: 28 },
        { autoAlpha: 1, y: 0, duration: 0.55 },
        1.55,
      );
      timeline.to("[data-move-copy]", { autoAlpha: 0, y: -24, duration: 0.45 }, 3.15);
      timeline.fromTo(
        "[data-lock-copy]",
        { autoAlpha: 0, x: 24 },
        { autoAlpha: 1, x: 0, duration: 0.48 },
        3.1,
      );
      timeline.to("[data-lock-copy]", { autoAlpha: 0, x: -20, duration: 0.42 }, 4.25);
      timeline.fromTo(
        "[data-why-copy]",
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.55 },
        4.1,
      );
      timeline.fromTo(
        "[data-evidence]",
        { autoAlpha: 0, scale: 0.96 },
        { autoAlpha: 1, scale: 1, duration: 0.55, stagger: 0.16 },
        4.55,
      );
      timeline.to("[data-why-copy]", { autoAlpha: 0, y: -22, duration: 0.4 }, 6.15);
      timeline.to("[data-evidence]", { autoAlpha: 0, scale: 0.98, duration: 0.38 }, 6.35);
      timeline.fromTo(chartBridge, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.55 }, 7.2);
      timeline.fromTo(productShell, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45 }, 7.55);
      timeline.set(productChart, { autoAlpha: 1 }, 7.55);
      timeline.fromTo(
        productFrame,
        { clipPath: chartClip },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.95,
          ease: "power2.inOut",
        },
        7.72,
      );
      timeline.fromTo(
        '[data-product-part="header"]',
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.62, ease: "power2.out" },
        8.15,
      );
      timeline.fromTo(
        '[data-product-part="signals"]',
        { autoAlpha: 0, x: 22 },
        { autoAlpha: 1, x: 0, duration: 0.72, ease: "power2.out" },
        8.32,
      );
      timeline.fromTo(
        '[data-product-part="trade"]',
        { autoAlpha: 0, x: -22 },
        { autoAlpha: 1, x: 0, duration: 0.72, ease: "power2.out" },
        8.45,
      );
      timeline.to(chartBridge, { autoAlpha: 0, duration: 0.6 }, 8.02);
      timeline.set(productShell, { pointerEvents: "auto" }, 8.82);
      timeline.fromTo(
        "[data-trade-copy]",
        { autoAlpha: 0, y: 22 },
        { autoAlpha: 1, y: 0, duration: 0.52 },
        8.76,
      );
    },
    {
      scope: rootRef,
      dependencies: [reducedMotion, semanticSnap],
      revertOnUpdate: true,
    },
  );

  return (
    <main
      ref={rootRef}
      className={styles.lab}
      data-reduced-motion={reducedMotion}
      data-semantic-snap={semanticSnap}
    >
      <style jsx global>{`
        html.motion-lab-active {
          scrollbar-width: none;
          background: #020706;
        }

        html.motion-lab-active::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div ref={stageRef} className={styles.stage} data-testid="motion-stage" data-progress="0.000">
        <Canvas
          className={styles.canvas}
          camera={{ position: [0, 0, 8.2], fov: 44, near: 0.1, far: 60 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
          fallback={<div className={styles.canvasFallback}>WebGL unavailable</div>}
        >
          <MotionLabScene
            progress={progressRef}
            reducedMotion={reducedMotion}
            handoffAnchor={handoffAnchorRef}
          />
        </Canvas>

        <div className={styles.grain} aria-hidden="true" />
        <div className={styles.scanlines} aria-hidden="true" />

        <MotionLabNarrativeOverlay
          showStudyChrome
          showStudyHero
          showScrollMarker
          studyId={semanticSnap ? "02" : "01"}
        />
      </div>
    </main>
  );
}
