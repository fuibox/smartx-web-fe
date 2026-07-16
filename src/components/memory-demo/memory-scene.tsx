"use client";

import { Line } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, type ElementRef, type MutableRefObject } from "react";
import * as THREE from "three";

import { MEMORY_DOMAINS } from "./memory-demo.fixture";
import type { MemoryDomain, MemoryDomainId } from "./memory-demo.types";

type MemorySceneProps = {
  progress: MutableRefObject<number>;
  activeDomainId: MemoryDomainId;
  onDomainChange: (domainId: MemoryDomainId) => void;
  reducedMotion: boolean;
};

const DOMAIN_ANCHORS = [
  new THREE.Vector3(-1.92, 1.08, 0),
  new THREE.Vector3(1.94, 1.02, 0),
  new THREE.Vector3(1.82, -1.16, 0),
  new THREE.Vector3(-1.9, -1.12, 0),
];

function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function smoothstep(start: number, end: number, value: number) {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
}

function easeOutCubic(value: number) {
  const t = clamp(value);
  return 1 - (1 - t) ** 3;
}

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let next = value;
    next = Math.imul(next ^ (next >>> 15), next | 1);
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function createMemoryCurve(anchor: THREE.Vector3) {
  const control = anchor.clone().multiplyScalar(0.48);
  control.z += 0.48;
  control.y += anchor.y > 0 ? 0.12 : -0.12;
  const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(), control, anchor);
  return { curve, points: curve.getPoints(42) };
}

function MemoryStars({ progress, reducedMotion }: Pick<MemorySceneProps, "progress" | "reducedMotion">) {
  const materialRef = useRef<THREE.PointsMaterial>(null);
  const positions = useMemo(() => {
    const random = seededRandom(4118);
    const values = new Float32Array(280 * 3);
    for (let index = 0; index < 280; index += 1) {
      const angle = random() * Math.PI * 2;
      const radius = 1.4 + random() * 5.1;
      values[index * 3] = Math.cos(angle) * radius;
      values[index * 3 + 1] = Math.sin(angle) * radius * 0.62;
      values[index * 3 + 2] = -0.6 - random() * 2.2;
    }
    return values;
  }, []);

  useFrame(({ clock }) => {
    const material = materialRef.current;
    if (!material) return;
    const reveal = smoothstep(0.82, 0.94, reducedMotion ? 1 : progress.current);
    material.opacity = reveal * (0.18 + Math.sin(clock.elapsedTime * 0.32) * 0.018);
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        color="#6aa8bd"
        size={0.018}
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function DomainCluster({
  domain,
  index,
  active,
  progress,
  reducedMotion,
  onSelect,
}: {
  domain: MemoryDomain;
  index: number;
  active: boolean;
  progress: MutableRefObject<number>;
  reducedMotion: boolean;
  onSelect: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const nodeMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const glowMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const lineRef = useRef<ElementRef<typeof Line>>(null);
  const ringRefs = useRef<THREE.Mesh[]>([]);
  const factorRefs = useRef<THREE.Mesh[]>([]);
  const factorLineRefs = useRef<Array<ElementRef<typeof Line>>>([]);
  const pulseRefs = useRef<THREE.Mesh[]>([]);
  const pulseMaterialRefs = useRef<THREE.MeshBasicMaterial[]>([]);
  const { gl } = useThree();
  const anchor = DOMAIN_ANCHORS[index];
  const { curve, points } = useMemo(() => createMemoryCurve(anchor), [anchor]);
  const factorPositions = useMemo(
    () =>
      domain.dimensions.map((dimension, factorIndex) => {
        const angle = -Math.PI / 2 + (factorIndex / domain.dimensions.length) * Math.PI * 2;
        const radius = 0.48 + dimension.weight / 720;
        return new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          (dimension.weight - 80) / 220,
        );
      }),
    [domain.dimensions],
  );

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    const line = lineRef.current;
    const nodeMaterial = nodeMaterialRef.current;
    const glowMaterial = glowMaterialRef.current;
    if (!group || !line || !nodeMaterial || !glowMaterial) return;

    const value = reducedMotion ? 1 : progress.current;
    const reveal = easeOutCubic(smoothstep(0.855 + index * 0.012, 0.955 + index * 0.008, value));
    const targetScale = reveal * (active ? 1.13 : 0.86);
    const drift = reducedMotion ? 0 : Math.sin(clock.elapsedTime * 0.42 + index) * 0.018;

    group.visible = reveal > 0.01;
    group.position.copy(anchor).multiplyScalar(reveal);
    group.position.z = drift;
    group.scale.setScalar(THREE.MathUtils.damp(group.scale.x || 0.01, targetScale, 9, delta));
    group.rotation.z = clock.elapsedTime * (active ? -0.055 : 0.018) + index * 0.3;

    line.material.opacity = THREE.MathUtils.damp(
      line.material.opacity,
      reveal * (active ? 0.7 : 0.12),
      9,
      delta,
    );
    nodeMaterial.emissiveIntensity = THREE.MathUtils.damp(
      nodeMaterial.emissiveIntensity,
      active ? 1.15 : 0.42,
      8,
      delta,
    );
    glowMaterial.opacity = reveal * (active ? 0.13 : 0.035);

    ringRefs.current.forEach((ring, ringIndex) => {
      ring.rotation.z = clock.elapsedTime * (ringIndex % 2 === 0 ? 0.28 : -0.2) + ringIndex;
      ring.rotation.y = Math.sin(clock.elapsedTime * 0.55 + ringIndex) * 0.12;
      const material = ring.material as THREE.MeshBasicMaterial;
      material.opacity = reveal * (ringIndex === 0 ? 0.42 : active ? 0.24 - ringIndex * 0.045 : 0.015);
    });

    factorRefs.current.forEach((factor, factorIndex) => {
      const selectedScale = active ? 1 + Math.sin(clock.elapsedTime * 1.7 + factorIndex) * 0.08 : 0.72;
      factor.scale.setScalar(THREE.MathUtils.damp(factor.scale.x || 0.01, selectedScale, 10, delta));
      const material = factor.material as THREE.MeshBasicMaterial;
      material.opacity = reveal * (active ? 0.9 : 0.22);
      const factorLine = factorLineRefs.current[factorIndex];
      if (factorLine) factorLine.material.opacity = reveal * (active ? 0.38 : 0.04);
    });

    pulseRefs.current.forEach((pulse, pulseIndex) => {
      const phase = (clock.elapsedTime * (0.12 + index * 0.008) + pulseIndex * 0.31 + index * 0.13) % 1;
      curve.getPointAt(phase, pulse.position);
      const material = pulseMaterialRefs.current[pulseIndex];
      if (material) material.opacity = reveal * Math.sin(phase * Math.PI) * (active ? 0.92 : 0.26);
      pulse.scale.setScalar(0.72 + Math.sin(phase * Math.PI) * (active ? 0.58 : 0.2));
    });
  });

  return (
    <>
      <Line
        ref={lineRef}
        points={points}
        color={domain.color}
        lineWidth={active ? 1.05 : 0.68}
        transparent
        opacity={0}
        depthWrite={false}
        toneMapped={false}
      />
      {[0, 1, 2].map((pulseIndex) => (
        <mesh
          ref={(pulse) => {
            if (pulse) pulseRefs.current[pulseIndex] = pulse;
          }}
          key={pulseIndex}
        >
          <sphereGeometry args={[0.032, 12, 12]} />
          <meshBasicMaterial
            ref={(material) => {
              if (material) pulseMaterialRefs.current[pulseIndex] = material;
            }}
            color={domain.color}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
      <group ref={groupRef} visible={false}>
        <mesh scale={2.6}>
          <sphereGeometry args={[0.22, 24, 24]} />
          <meshBasicMaterial
            ref={glowMaterialRef}
            color={domain.color}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.16, 28, 28]} />
          <meshStandardMaterial
            ref={nodeMaterialRef}
            color="#06110f"
            emissive={domain.color}
            emissiveIntensity={0.42}
            roughness={0.34}
            metalness={0.16}
          />
        </mesh>
        {[0.28, 0.48, 0.66].map((radius, ringIndex) => (
          <mesh
            ref={(ring) => {
              if (ring) ringRefs.current[ringIndex] = ring;
            }}
            rotation={[Math.PI / 2.25 + ringIndex * 0.18, ringIndex * 0.3, ringIndex * 0.42]}
            key={radius}
          >
            <torusGeometry args={[radius, ringIndex === 0 ? 0.007 : 0.004, 8, 96]} />
            <meshBasicMaterial color={domain.color} transparent opacity={0} depthWrite={false} />
          </mesh>
        ))}
        {factorPositions.map((position, factorIndex) => (
          <group key={domain.dimensions[factorIndex].id}>
            <Line
              ref={(line) => {
                if (line) factorLineRefs.current[factorIndex] = line;
              }}
              points={[new THREE.Vector3(), position]}
              color={domain.color}
              lineWidth={0.55}
              transparent
              opacity={0}
              depthWrite={false}
            />
            <mesh
              ref={(factor) => {
                if (factor) factorRefs.current[factorIndex] = factor;
              }}
              position={position}
            >
              <sphereGeometry args={[0.04 + domain.dimensions[factorIndex].weight / 2400, 14, 14]} />
              <meshBasicMaterial
                color={domain.color}
                transparent
                opacity={0}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          </group>
        ))}
        <mesh
          onClick={(event) => {
            event.stopPropagation();
            onSelect();
          }}
          onPointerOver={(event) => {
            event.stopPropagation();
            gl.domElement.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            gl.domElement.style.cursor = "";
          }}
        >
          <sphereGeometry args={[0.74, 18, 18]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
    </>
  );
}

export function MemoryScene({
  progress,
  activeDomainId,
  onDomainChange,
  reducedMotion,
}: MemorySceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Group>(null);
  const coreMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const coreGlowRef = useRef<THREE.MeshBasicMaterial>(null);
  const coreRingRefs = useRef<THREE.Mesh[]>([]);
  const trackRefs = useRef<THREE.Mesh[]>([]);
  const { pointer, size } = useThree();

  const particleShell = useMemo(() => {
    const random = seededRandom(991);
    const values = new Float32Array(150 * 3);
    for (let index = 0; index < 150; index += 1) {
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      const radius = 0.54 + random() * 0.18;
      values[index * 3] = Math.sin(phi) * Math.cos(theta) * radius;
      values[index * 3 + 1] = Math.sin(phi) * Math.sin(theta) * radius;
      values[index * 3 + 2] = Math.cos(phi) * radius;
    }
    return values;
  }, []);

  useFrame(({ clock }, delta) => {
    const group = groupRef.current;
    const core = coreRef.current;
    const coreMaterial = coreMaterialRef.current;
    const coreGlow = coreGlowRef.current;
    if (!group || !core || !coreMaterial || !coreGlow) return;

    const value = reducedMotion ? 1 : progress.current;
    const reveal = smoothstep(0.82, 0.95, value);
    const coreBirth = easeOutCubic(smoothstep(0.84, 0.925, value));
    const mobile = size.width <= 720;

    group.visible = reveal > 0.002;
    group.position.set(mobile ? 0 : -0.78, mobile ? 0.42 : -0.32, -1.7);
    group.scale.setScalar((mobile ? 0.58 : size.width <= 1040 ? 0.9 : 1.05) * reveal);
    group.rotation.x = THREE.MathUtils.damp(group.rotation.x, reducedMotion ? 0 : pointer.y * -0.035, 4, delta);
    group.rotation.y = THREE.MathUtils.damp(group.rotation.y, reducedMotion ? 0 : pointer.x * 0.05, 4, delta);

    core.scale.setScalar(Math.max(0.01, coreBirth * (1 + Math.sin(clock.elapsedTime * 1.7) * 0.018)));
    core.rotation.x += delta * 0.11;
    core.rotation.y += delta * 0.17;
    coreMaterial.emissiveIntensity = 0.7 + coreBirth * 0.85;
    coreGlow.opacity = coreBirth * (0.1 + Math.sin(clock.elapsedTime * 1.8) * 0.02);

    coreRingRefs.current.forEach((ring, index) => {
      ring.rotation.z = clock.elapsedTime * (index % 2 === 0 ? 0.22 : -0.16) + index;
      ring.rotation.y = Math.sin(clock.elapsedTime * 0.42 + index) * 0.12;
      const material = ring.material as THREE.MeshBasicMaterial;
      material.opacity = coreBirth * (0.4 - index * 0.09);
    });

    trackRefs.current.forEach((track, index) => {
      track.rotation.z = clock.elapsedTime * (index === 0 ? 0.024 : -0.018) + index * 0.7;
      const material = track.material as THREE.MeshBasicMaterial;
      material.opacity = reveal * (index === 0 ? 0.12 : 0.055);
    });
  });

  return (
    <group ref={groupRef} visible={false}>
      <MemoryStars progress={progress} reducedMotion={reducedMotion} />
      {[0, 1].map((index) => (
        <mesh
          ref={(track) => {
            if (track) trackRefs.current[index] = track;
          }}
          rotation={[Math.PI / 2, index * 0.28, index * 0.55]}
          key={index}
        >
          <torusGeometry args={[index === 0 ? 2.34 : 1.92, 0.004, 8, 160]} />
          <meshBasicMaterial
            color={index === 0 ? "#08dfb5" : "#3a91ff"}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      ))}

      <group ref={coreRef}>
        <mesh scale={3.1}>
          <sphereGeometry args={[0.25, 28, 28]} />
          <meshBasicMaterial
            ref={coreGlowRef}
            color="#08dfb5"
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[0.46, 4]} />
          <meshStandardMaterial
            ref={coreMaterialRef}
            color="#06110f"
            emissive="#08dfb5"
            emissiveIntensity={0.7}
            roughness={0.28}
            metalness={0.3}
          />
        </mesh>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[particleShell, 3]} />
          </bufferGeometry>
          <pointsMaterial
            color="#9cf5e4"
            size={0.02}
            transparent
            opacity={0.64}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
        {[0.68, 0.88, 1.08].map((radius, index) => (
          <mesh
            ref={(ring) => {
              if (ring) coreRingRefs.current[index] = ring;
            }}
            rotation={[Math.PI / 2 + index * 0.24, index * 0.34, index * 0.2]}
            key={radius}
          >
            <torusGeometry args={[radius, index === 0 ? 0.007 : 0.004, 8, 128]} />
            <meshBasicMaterial
              color={index === 1 ? "#3a91ff" : "#08dfb5"}
              transparent
              opacity={0}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {MEMORY_DOMAINS.map((domain, index) => (
        <DomainCluster
          domain={domain}
          index={index}
          active={domain.id === activeDomainId}
          progress={progress}
          reducedMotion={reducedMotion}
          onSelect={() => onDomainChange(domain.id)}
          key={domain.id}
        />
      ))}
    </group>
  );
}
