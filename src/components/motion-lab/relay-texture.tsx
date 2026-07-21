"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";

type RelayTextureProps = {
  progress: MutableRefObject<number>;
  sourceCanvas: MutableRefObject<HTMLCanvasElement | null>;
  reducedMotion: boolean;
};

export function RelayTexture({ progress, sourceCanvas, reducedMotion }: RelayTextureProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const canvasTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const textureSizeRef = useRef({ width: 0, height: 0 });
  const fallbackTexture = useMemo(() => {
    const texture = new THREE.DataTexture(
      new Uint8Array([6, 25, 21, 255]),
      1,
      1,
      THREE.RGBAFormat,
    );
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return texture;
  }, []);
  const uniforms = useMemo(
    () => ({
      uTexture: { value: fallbackTexture as THREE.Texture },
      uProgress: { value: 0 },
      uReducedMotion: { value: 0 },
    }),
    [fallbackTexture],
  );

  useEffect(
    () => () => {
      canvasTextureRef.current?.dispose();
      fallbackTexture.dispose();
    },
    [fallbackTexture],
  );

  useFrame(() => {
    const material = materialRef.current;
    if (!material) return;

    const canvas = sourceCanvas.current;
    if (
      canvasTextureRef.current &&
      canvas &&
      (textureSizeRef.current.width !== canvas.width ||
        textureSizeRef.current.height !== canvas.height)
    ) {
      canvasTextureRef.current.dispose();
      canvasTextureRef.current = null;
    }

    if (!canvasTextureRef.current && canvas && canvas.width > 1 && canvas.height > 1) {
      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      canvasTextureRef.current = texture;
      textureSizeRef.current = { width: canvas.width, height: canvas.height };
      material.uniforms.uTexture.value = texture;
    }

    const texture = canvasTextureRef.current;
    if (texture && progress.current < 0.72) {
      texture.needsUpdate = true;
    }

    material.uniforms.uProgress.value = progress.current;
    material.uniforms.uReducedMotion.value = reducedMotion ? 1 : 0;
  });

  return (
    <mesh frustumCulled={false} renderOrder={100}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
        toneMapped={false}
        vertexShader={`
          varying vec2 vUv;

          void main() {
            vUv = uv;
            gl_Position = vec4(position.xy, 0.0, 1.0);
          }
        `}
        fragmentShader={`
          uniform sampler2D uTexture;
          uniform float uProgress;
          uniform float uReducedMotion;
          varying vec2 vUv;

          float easeInOut(float value) {
            float t = clamp(value, 0.0, 1.0);
            return t * t * (3.0 - 2.0 * t);
          }

          void main() {
            vec2 centered = vUv - 0.5;
            float radius = length(centered);
            float travel = easeInOut((uProgress - 0.08) / 0.70) * (1.0 - uReducedMotion);
            float lens = 1.0 + travel * (1.75 + radius * 0.9);
            vec2 sampleUv = 0.5 + centered / lens;

            vec2 direction = radius > 0.0001 ? centered / radius : vec2(0.0);
            float current = sin(radius * 31.0 - travel * 7.0);
            sampleUv += direction * current * 0.0022 * travel * (1.0 - travel);

            vec4 source = texture2D(uTexture, sampleUv);
            float normalFade = 1.0 - smoothstep(0.42, 0.86, uProgress);
            float reducedFade = 1.0 - smoothstep(0.42, 0.86, uProgress);
            float alpha = mix(normalFade, reducedFade, uReducedMotion);
            float centerLift = travel * smoothstep(0.72, 0.0, radius) * 0.05;

            gl_FragColor = vec4(source.rgb + centerLift, source.a * alpha);
          }
        `}
      />
    </mesh>
  );
}
