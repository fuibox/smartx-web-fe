"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import { MEMORY_DOMAINS } from "@/components/memory-demo/memory-demo.fixture";
import { MemoryScene } from "@/components/memory-demo/memory-scene";
import type { MemoryDomainId } from "@/components/memory-demo/memory-demo.types";

import { MemoryRadar } from "./memory-radar";
import styles from "./v3.module.css";

/**
 * MEMORY 模块：全页唯一的 3D 时刻 + vc-demo 的雷达图。
 * 左：Memory Universe；右：雷达 + 维度行 + 摘要。
 */
export function MemoryVignette() {
  const progressRef = useRef(1);
  const [activeDomainId, setActiveDomainId] = useState<MemoryDomainId>("signals");
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  const activeDomain =
    MEMORY_DOMAINS.find((domain) => domain.id === activeDomainId) ?? MEMORY_DOMAINS[0];

  return (
    <div className={styles.memoryGrid}>
      <div className={styles.memoryCanvas} aria-hidden="true">
        <Canvas
          frameloop="always"
          camera={{ position: [-0.78, -0.32, 4.15], fov: 44, near: 0.1, far: 60 }}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        >
          <ambientLight intensity={0.55} color="#e6edf7" />
          <pointLight position={[0, 0, 3]} intensity={5} color="#08dfb5" distance={9} />
          <pointLight position={[-3, 2, 2]} intensity={2} color="#3a91ff" distance={7} />
          <MemoryScene
            progress={progressRef}
            activeDomainId={activeDomainId}
            onDomainChange={setActiveDomainId}
            reducedMotion={reducedMotion}
          />
        </Canvas>
      </div>

      <div className={styles.memoryPanel}>
        <div className={styles.radarHost}>
          <MemoryRadar domain={activeDomain} />
        </div>
        {MEMORY_DOMAINS.map((domain) => (
          <button
            type="button"
            className={styles.memoryDomain}
            data-active={domain.id === activeDomainId}
            aria-pressed={domain.id === activeDomainId}
            style={{ "--domain-color": domain.color } as CSSProperties}
            onClick={() => setActiveDomainId(domain.id)}
            key={domain.id}
          >
            <strong>{domain.shortLabel}</strong>
            <b>{domain.value}</b>
            <p>{domain.updateLabel}</p>
          </button>
        ))}
        <p className={styles.memorySummary}>{activeDomain.summary}</p>
      </div>
    </div>
  );
}
