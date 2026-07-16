"use client";

import { useGSAP } from "@gsap/react";
import { Canvas } from "@react-three/fiber";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import * as THREE from "three";

import { HeroRelayScene } from "./hero-relay-scene";
import styles from "./hero-relay.module.css";

type HeroGridController = {
  getCanvas: () => HTMLCanvasElement | null;
  pause: () => void;
  resume: () => void;
  renderOnce: () => void;
};

declare global {
  interface Window {
    SmartXKineticGrid?: HeroGridController & {
      start: () => void;
      destroy: () => void;
    };
  }
}

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function HeroRelayRuntime() {
  const runtimeRef = useRef<HTMLDivElement>(null);
  const sourceCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const progressRef = useRef(0);
  const sceneProgressRef = useRef(0);
  const rendererPausedRef = useRef(false);
  const [webglReady, setWebglReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useLayoutEffect(() => {
    const root = runtimeRef.current?.closest<HTMLElement>("[data-hero-relay-root]");
    sourceCanvasRef.current = root?.querySelector<HTMLCanvasElement>("#kinetic-grid") ?? null;
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setReducedMotion(media.matches);
    updatePreference();
    media.addEventListener("change", updatePreference);
    document.documentElement.classList.add("hero-relay-active");

    return () => {
      media.removeEventListener("change", updatePreference);
      document.documentElement.classList.remove("hero-relay-active");
      window.SmartXKineticGrid?.resume();
    };
  }, []);

  useGSAP(
    () => {
      if (!webglReady) return;

      const root = runtimeRef.current?.closest<HTMLElement>("[data-hero-relay-root]");
      if (!root) return;

      const stage = root.querySelector<HTMLElement>("[data-hero-relay-stage]");
      const sourceCanvas = root.querySelector<HTMLCanvasElement>("#kinetic-grid");
      const backdrop = root.querySelector<HTMLElement>("[data-hero-backdrop]");
      const source = root.querySelector<HTMLElement>("[data-hero-source]");
      const chrome = root.querySelector<HTMLElement>(".hero-content");
      const heroCopy = root.querySelector<HTMLElement>(".hero-inner");
      const texture = root.querySelectorAll<HTMLElement>(".grain-layer, .scan-layer");
      const copy = root.querySelector<HTMLElement>("[data-relay-copy]");
      if (!stage || !sourceCanvas || !backdrop || !source || !chrome || !heroCopy || !copy) {
        return;
      }

      sourceCanvasRef.current = sourceCanvas;
      window.SmartXKineticGrid?.renderOnce();
      gsap.set(copy, { autoAlpha: 0, y: reducedMotion ? 0 : 26 });
      gsap.set(source, { pointerEvents: "auto" });

      const driver = { progress: 0 };
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * (reducedMotion ? 1.35 : 2.8))}`,
          pin: stage,
          pinSpacing: true,
          scrub: reducedMotion ? 0.25 : 0.48,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline.to(
        driver,
        {
          progress: 1,
          duration: 1,
          onUpdate: () => {
            const value = driver.progress;
            progressRef.current = value;
            sceneProgressRef.current = reducedMotion ? 0.34 : 0.07 + value * 0.37;
            stage.dataset.progress = value.toFixed(3);

            const controller = window.SmartXKineticGrid;
            if (value >= 0.24 && !rendererPausedRef.current && controller) {
              controller.renderOnce();
              controller.pause();
              rendererPausedRef.current = true;
            } else if (value <= 0.18 && rendererPausedRef.current && controller) {
              controller.resume();
              rendererPausedRef.current = false;
            }
          },
        },
        0,
      );

      const sourceStart = reducedMotion ? 0.28 : 0.06;
      const sourceDuration = reducedMotion ? 0.24 : 0.14;
      timeline.to(sourceCanvas, { autoAlpha: 0, duration: sourceDuration }, sourceStart);
      timeline.to(backdrop, { autoAlpha: 0, duration: sourceDuration + 0.03 }, sourceStart + 0.02);
      if (!reducedMotion) {
        timeline.to(
          heroCopy,
          {
            y: () => -Math.min(96, window.innerHeight * 0.1),
            scale: 0.985,
            duration: 0.34,
            ease: "none",
            immediateRender: false,
          },
          0.02,
        );
      }
      timeline.to(
        chrome,
        {
          autoAlpha: 0,
          duration: reducedMotion ? 0.2 : 0.18,
          ease: "power2.in",
          immediateRender: false,
        },
        reducedMotion ? 0.42 : 0.28,
      );
      if (texture.length > 0) {
        timeline.to(texture, { autoAlpha: 0, duration: 0.16 }, reducedMotion ? 0.42 : 0.4);
      }
      timeline.set(source, { pointerEvents: "none" }, reducedMotion ? 0.58 : 0.48);
      timeline.to(
        copy,
        {
          autoAlpha: 1,
          y: 0,
          duration: reducedMotion ? 0.22 : 0.18,
          ease: "power2.out",
        },
        reducedMotion ? 0.64 : 0.58,
      );

      return () => {
        if (rendererPausedRef.current) {
          window.SmartXKineticGrid?.resume();
          rendererPausedRef.current = false;
        }
      };
    },
    { dependencies: [reducedMotion, webglReady], revertOnUpdate: true },
  );

  return (
    <>
      <style jsx global>{`
        html.hero-relay-active {
          scrollbar-width: none;
          background: #020706;
        }

        html.hero-relay-active::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div ref={runtimeRef} className={styles.runtime} aria-hidden="true">
        <Canvas
          className={styles.canvas}
          camera={{ position: [0, 0, 8.2], fov: 44, near: 0.1, far: 60 }}
          dpr={[1, 1.5]}
          gl={{
            alpha: false,
            antialias: true,
            powerPreference: "high-performance",
            toneMapping: THREE.NoToneMapping,
          }}
          onCreated={() => setWebglReady(true)}
        >
          <HeroRelayScene
            progress={progressRef}
            sceneProgress={sceneProgressRef}
            sourceCanvas={sourceCanvasRef}
            reducedMotion={reducedMotion}
          />
        </Canvas>
      </div>
    </>
  );
}
