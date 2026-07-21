"use client";

import { AdaptiveDpr, Line } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { damp3, dampLookAt } from "maath/easing";
import {
  useMemo,
  useRef,
  type ElementRef,
  type MutableRefObject,
} from "react";
import * as THREE from "three";

import {
  sampleMarketChart,
  sampleMarketChartX,
} from "@/components/product-demo/market-demo-chart";

import { MARKET_SCENE, WHY_CONTEXT_PLACEMENTS, type SceneWindow } from "./story.config";

type ProgressRef = { current: number };

export type HandoffAnchorRef = {
  current: {
    left: number;
    top: number;
    width: number;
    height: number;
  };
};

export type LockCopyRef = MutableRefObject<HTMLDivElement | null>;

type SceneProps = {
  progress: ProgressRef;
  reducedMotion: boolean;
};

const SIGNAL_COLORS = {
  primary: "#08dfb5",
  smart: "#36c7e8",
  fast: "#ff9b3e",
  orders: "#ffc45e",
  cohort: "#88b8d8",
  risk: "#ff6d70",
};

function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function smoothstep(start: number, end: number, value: number) {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
}

function windowStep(window: SceneWindow, value: number) {
  return smoothstep(window[0], window[1], value);
}

function lerp(start: number, end: number, amount: number) {
  return start + (end - start) * amount;
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

function screenPointToWorld(
  camera: THREE.Camera,
  normalizedX: number,
  normalizedY: number,
  planeZ: number,
  target: THREE.Vector3,
  projected: THREE.Vector3,
  direction: THREE.Vector3,
) {
  projected.set(normalizedX * 2 - 1, 1 - normalizedY * 2, 0.5).unproject(camera);
  direction.copy(projected).sub(camera.position).normalize();
  const distance = (planeZ - camera.position.z) / direction.z;
  return target.copy(camera.position).add(direction.multiplyScalar(distance));
}

function SceneDirector({ progress, reducedMotion }: SceneProps) {
  const { camera } = useThree();
  const positionTarget = useMemo(() => new THREE.Vector3(), []);
  const lookAtTarget = useMemo(() => new THREE.Vector3(), []);
  const flightPath = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.08, 8.2),
        new THREE.Vector3(0.03, 0.04, 7.55),
        new THREE.Vector3(0.28, -0.02, 6.15),
        new THREE.Vector3(0.42, -0.08, 5.1),
      ]),
    [],
  );

  useFrame((_, delta) => {
    const rawProgress = reducedMotion ? 0.78 : progress.current;
    const approach = windowStep(MARKET_SCENE.universe.cameraApproach, rawProgress);
    const flight = windowStep(MARKET_SCENE.universe.cameraFlight, rawProgress);
    const signalTrack = windowStep(MARKET_SCENE.universe.cameraSignalTrack, rawProgress);
    const inspection = windowStep(MARKET_SCENE.universe.cameraInspection, rawProgress);
    const handoff = windowStep(MARKET_SCENE.universe.cameraHandoff, rawProgress);

    flightPath.getPointAt(flight, positionTarget);
    positionTarget.x = lerp(positionTarget.x, 0.42, signalTrack) - handoff * 0.42;
    positionTarget.y = lerp(positionTarget.y, -0.08, inspection) + handoff * 0.08;
    positionTarget.z += (1 - approach) * 0.5 + handoff * 1.9;

    lookAtTarget.set(
      lerp(0, -0.55, handoff),
      lerp(0, -0.28, handoff),
      lerp(-4.2, -1.6, handoff),
    );

    if (reducedMotion) {
      camera.position.copy(positionTarget);
      camera.lookAt(lookAtTarget);
    } else {
      damp3(camera.position, positionTarget, 0.28, delta, 18);
      dampLookAt(camera, lookAtTarget, 0.26, delta, 18);
    }

    if (camera instanceof THREE.PerspectiveCamera) {
      const nextFov = lerp(44, 48, flight) - handoff * 3;
      if (Math.abs(camera.fov - nextFov) > 0.02) {
        camera.fov = reducedMotion
          ? nextFov
          : THREE.MathUtils.damp(camera.fov, nextFov, 9, delta);
        camera.updateProjectionMatrix();
      }
    }
  });

  return null;
}

function SignalField({ progress, reducedMotion }: SceneProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const positions = useMemo(() => {
    const random = seededRandom(20260714);
    const data = new Float32Array(720 * 3);

    for (let index = 0; index < 720; index += 1) {
      data[index * 3] = (random() - 0.5) * 18;
      data[index * 3 + 1] = (random() - 0.5) * 11;
      data[index * 3 + 2] = -2 - random() * 28;
    }

    return data;
  }, []);

  const sizes = useMemo(() => {
    const random = seededRandom(91);
    return new Float32Array(Array.from({ length: 720 }, () => 0.55 + random() * 1.45));
  }, []);

  const twinklePhases = useMemo(() => {
    const random = seededRandom(137);
    return new Float32Array(Array.from({ length: 720 }, () => random()));
  }, []);

  const twinkleAmplitudes = useMemo(() => {
    const random = seededRandom(211);
    return new Float32Array(
      Array.from({ length: 720 }, () => (random() > 0.82 ? 0.12 + random() * 0.08 : 0.035 + random() * 0.055)),
    );
  }, []);

  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uOpacity: { value: 0 },
      uPixelRatio: { value: 1 },
      uTime: { value: 0 },
    }),
    [],
  );

  useFrame(({ gl, clock }) => {
    const material = materialRef.current;
    if (!material) return;

    const value = reducedMotion ? 0.48 : progress.current;
    const fadeIn = windowStep(MARKET_SCENE.universe.starsIn, value);
    const fadeOut = 1 - windowStep(MARKET_SCENE.universe.starsOut, value);
    const heroDepth = 1 - windowStep(MARKET_SCENE.universe.heroDepth, value);
    material.uniforms.uProgress.value = value;
    material.uniforms.uOpacity.value = (heroDepth * 0.12 + fadeIn * 0.82) * fadeOut;
    material.uniforms.uPixelRatio.value = Math.min(gl.getPixelRatio(), 1.5);
    material.uniforms.uTime.value = reducedMotion ? 0 : clock.elapsedTime;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
        <bufferAttribute attach="attributes-aTwinklePhase" args={[twinklePhases, 1]} />
        <bufferAttribute attach="attributes-aTwinkleAmplitude" args={[twinkleAmplitudes, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`
          attribute float aSize;
          attribute float aTwinklePhase;
          attribute float aTwinkleAmplitude;
          uniform float uProgress;
          uniform float uPixelRatio;
          uniform float uTime;
          varying float vDepth;
          varying float vTwinklePhase;
          varying float vTwinkleAmplitude;

          void main() {
            vec3 transformed = position;
            float travel = uProgress * 33.0;
            transformed.z = mod(position.z + travel + 30.0, 32.0) - 30.0;
            transformed.x += sin(position.z * 0.41 + uTime * 0.09) * 0.12;
            transformed.y += cos(position.x * 0.72 + uTime * 0.07) * 0.08;
            vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
            vDepth = smoothstep(-30.0, 1.0, transformed.z);
            vTwinklePhase = aTwinklePhase;
            vTwinkleAmplitude = aTwinkleAmplitude;
            gl_PointSize = min(7.0, aSize * uPixelRatio * (38.0 / max(1.0, -mvPosition.z)));
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          uniform float uOpacity;
          uniform float uTime;
          varying float vDepth;
          varying float vTwinklePhase;
          varying float vTwinkleAmplitude;

          void main() {
            vec2 centered = gl_PointCoord - vec2(0.5);
            float distanceFromCenter = length(centered);
            float alpha = smoothstep(0.5, 0.04, distanceFromCenter);
            float twinkle = 1.0 + sin(uTime * (0.72 + vTwinklePhase * 1.24) + vTwinklePhase * 24.0) * vTwinkleAmplitude;
            vec3 color = mix(vec3(0.19, 0.50, 0.56), vec3(0.62, 0.96, 0.88), vDepth);
            gl_FragColor = vec4(color, alpha * uOpacity * twinkle);
          }
        `}
      />
    </points>
  );
}

type MeteorConfig = {
  start: [number, number, number];
  controlA: [number, number, number];
  controlB: [number, number, number];
  end: [number, number, number];
  color: string;
  delay: number;
  target?: boolean;
};

/**
 * 所有流星共享同一个方位（左上 → 右下），与首屏 cosmic 流星雨保持连续；
 * 只有目标流星的终点固定在行星揭示锚点（0, -0.05, -2.8）。
 * 路径避免让流星头部停留在左侧中带（SEE THE MOVE 标题区）。
 */
const METEORS: MeteorConfig[] = [
  {
    start: [-7.2, 3.4, -7.5],
    controlA: [-3.8, 3.0, -6.6],
    controlB: [1.2, 2.2, -5.4],
    end: [4.6, 1.4, -4.6],
    color: SIGNAL_COLORS.fast,
    delay: 0,
  },
  {
    start: [-6.0, 2.8, -9.8],
    controlA: [-3.6, 2.4, -7.6],
    controlB: [-1.4, 1.0, -4.6],
    end: [0, -0.05, -2.8],
    color: "#91aaa4",
    delay: 0.035,
    target: true,
  },
  {
    start: [-3.6, 1.6, -10.5],
    controlA: [-0.6, 0.8, -9.4],
    controlB: [3.4, -0.6, -7.8],
    end: [6.4, -1.8, -6.5],
    color: SIGNAL_COLORS.smart,
    delay: 0.08,
  },
  {
    start: [0.4, 3.8, -8.5],
    controlA: [2.4, 3.0, -7.4],
    controlB: [4.8, 1.6, -6.2],
    end: [6.8, 0.2, -5.2],
    color: SIGNAL_COLORS.orders,
    delay: 0.13,
  },
];

function Meteor({ config, progress, reducedMotion }: SceneProps & { config: MeteorConfig }) {
  const headRef = useRef<THREE.Group>(null);
  const headSpriteRef = useRef<THREE.Mesh>(null);
  const headMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const headUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(config.color) },
      uOpacity: { value: 0 },
      uIntensity: { value: 1 },
      uGlint: { value: 0 },
    }),
    [config.color],
  );
  const tailGeometryRef = useRef<THREE.BufferGeometry>(null);
  const tailMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const coreLineRef = useRef<ElementRef<typeof Line>>(null);
  const velocityRef = useRef(0);
  const lastProgressRef = useRef(0);
  const trailPositionArray = useMemo(() => new Float32Array(44 * 3), []);
  const coreTrailPositionArray = useMemo(() => new Float32Array(44 * 3), []);
  const initialTrailPoints = useMemo(
    () => Array.from({ length: 44 }, () => new THREE.Vector3(...config.start)),
    [config.start],
  );
  const tailSizes = useMemo(
    () => new Float32Array(Array.from({ length: 44 }, (_, index) => 0.75 + (index / 43) ** 2 * 2.6)),
    [],
  );
  const tailAlphas = useMemo(
    () => new Float32Array(Array.from({ length: 44 }, (_, index) => (index / 43) ** 1.9)),
    [],
  );
  const tailUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color(config.color) },
      uOpacity: { value: 0 },
      uPixelRatio: { value: 1 },
    }),
    [config.color],
  );
  const curve = useMemo(
    () =>
      new THREE.CubicBezierCurve3(
        new THREE.Vector3(...config.start),
        new THREE.Vector3(...config.controlA),
        new THREE.Vector3(...config.controlB),
        new THREE.Vector3(...config.end),
      ),
    [config],
  );
  const samplePoint = useMemo(() => new THREE.Vector3(), []);
  const baseColor = useMemo(() => new THREE.Color(config.color), [config.color]);
  const selectedColor = useMemo(() => new THREE.Color(SIGNAL_COLORS.primary), []);
  const currentColor = useMemo(() => new THREE.Color(config.color), [config.color]);

  useFrame(({ gl, camera, clock, size }, delta) => {
    const head = headRef.current;
    const coreLine = coreLineRef.current;
    const tailGeometry = tailGeometryRef.current;
    const tailMaterial = tailMaterialRef.current;
    const headMaterial = headMaterialRef.current;
    if (!head || !coreLine || !tailGeometry || !tailMaterial || !headMaterial) return;

    const meteorWindows = MARKET_SCENE.meteor;
    const value = reducedMotion ? 0.34 : progress.current;
    const arrival = meteorWindows.travelEnd + config.delay;
    const local = smoothstep(meteorWindows.travelStart + config.delay, arrival, value);
    const lockFocus = config.target ? windowStep(meteorWindows.lockFocus, value) : 0;
    const departureStart = config.target ? meteorWindows.targetDeparture[0] : arrival + 0.015;
    const departureEnd = config.target ? meteorWindows.targetDeparture[1] : arrival + 0.1;
    const visible =
      windowStep(meteorWindows.appear, value) *
      (1 - smoothstep(departureStart, departureEnd, value));
    const backgroundSignal = config.target
      ? 1
      : 1 - smoothstep(meteorWindows.dimOthersFrom, arrival + 0.04, value) * 0.42;
    const idleAmount = 1 - Math.min(1, velocityRef.current * 2.2);
    const pulseWave =
      0.5 + 0.5 * Math.sin(clock.elapsedTime * (2.1 + config.delay * 3.5) + config.delay * 42);
    const flicker = reducedMotion ? 1 : 0.86 + pulseWave * 0.14;
    const viewportXScale = size.width <= 720 ? 0.42 : size.width <= 980 ? 0.78 : 1;

    const instantVelocity = Math.min(
      2.4,
      Math.abs(value - lastProgressRef.current) / Math.max(delta, 1 / 120),
    );
    velocityRef.current = THREE.MathUtils.damp(velocityRef.current, instantVelocity, 8, delta);
    lastProgressRef.current = value;

    const tailSpan = clamp(0.085 + velocityRef.current * 0.055, 0.085, 0.2);
    for (let index = 0; index < 44; index += 1) {
      const ratio = index / 43;
      const sample = clamp(local - tailSpan * (1 - ratio));
      curve.getPointAt(sample, samplePoint);
      const wake = Math.sin(index * 1.73 + config.delay * 80) * 0.018 * (1 - ratio);
      trailPositionArray[index * 3] = samplePoint.x * viewportXScale + wake;
      trailPositionArray[index * 3 + 1] = samplePoint.y + wake * 0.46;
      trailPositionArray[index * 3 + 2] = samplePoint.z;
      coreTrailPositionArray[index * 3] = samplePoint.x * viewportXScale;
      coreTrailPositionArray[index * 3 + 1] = samplePoint.y;
      coreTrailPositionArray[index * 3 + 2] = samplePoint.z;
    }
    coreLine.geometry.setPositions(coreTrailPositionArray);
    const tailPosition = tailGeometry.getAttribute("position") as THREE.BufferAttribute;
    tailPosition.needsUpdate = true;

    curve.getPointAt(local, samplePoint);
    head.position.set(samplePoint.x * viewportXScale, samplePoint.y, samplePoint.z);
    head.scale.setScalar(config.target ? lerp(0.85, 1.2, local) : 0.9);
    if (headSpriteRef.current) {
      headSpriteRef.current.quaternion.copy(camera.quaternion);
    }

    currentColor.lerpColors(baseColor, selectedColor, lockFocus);
    tailMaterial.uniforms.uColor.value.copy(currentColor);
    coreLine.material.color.copy(currentColor);
    headMaterial.uniforms.uColor.value.copy(currentColor);

    const opacity = visible * backgroundSignal * flicker;
    head.visible = opacity > 0.01;
    coreLine.material.opacity = opacity * (config.target ? 0.76 : 0.44);
    tailMaterial.uniforms.uOpacity.value = opacity * (config.target ? 0.9 : 0.62);
    tailMaterial.uniforms.uPixelRatio.value = Math.min(gl.getPixelRatio(), 1.5);

    // 脉冲走亮度 uniform（禁止几何缩放脉冲）；静止时呼吸更明显，滚动时收敛。
    headMaterial.uniforms.uOpacity.value = opacity;
    headMaterial.uniforms.uIntensity.value = reducedMotion
      ? 1
      : 1 + pulseWave * (0.18 + idleAmount * 0.4);
    headMaterial.uniforms.uGlint.value = config.target
      ? lockFocus * (0.55 + pulseWave * 0.45)
      : 0;
  });

  return (
    <>
      <points frustumCulled={false}>
        <bufferGeometry ref={tailGeometryRef}>
          <bufferAttribute attach="attributes-position" args={[trailPositionArray, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[tailSizes, 1]} />
          <bufferAttribute attach="attributes-aAlpha" args={[tailAlphas, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={tailMaterialRef}
          uniforms={tailUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexShader={`
            attribute float aSize;
            attribute float aAlpha;
            uniform float uPixelRatio;
            varying float vAlpha;

            void main() {
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              vAlpha = aAlpha;
              gl_PointSize = min(14.0, aSize * uPixelRatio * (22.0 / max(1.0, -mvPosition.z)));
              gl_Position = projectionMatrix * mvPosition;
            }
          `}
          fragmentShader={`
            uniform vec3 uColor;
            uniform float uOpacity;
            varying float vAlpha;

            void main() {
              vec2 point = gl_PointCoord - vec2(0.5);
              float radius = length(point);
              float core = smoothstep(0.48, 0.03, radius);
              float halo = smoothstep(0.5, 0.18, radius) * 0.34;
              vec3 color = mix(uColor, vec3(1.0), pow(vAlpha, 3.0) * 0.45);
              gl_FragColor = vec4(color, (core + halo) * vAlpha * uOpacity);
            }
          `}
        />
      </points>
      <Line
        ref={coreLineRef}
        points={initialTrailPoints}
        color={config.color}
        lineWidth={config.target ? 1.15 : 0.72}
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
      <group ref={headRef}>
        <mesh ref={headSpriteRef}>
          <planeGeometry args={[0.55, 0.55]} />
          <shaderMaterial
            ref={headMaterialRef}
            uniforms={headUniforms}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            vertexShader={`
              varying vec2 vUv;

              void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `}
            fragmentShader={`
              uniform vec3 uColor;
              uniform float uOpacity;
              uniform float uIntensity;
              uniform float uGlint;
              varying vec2 vUv;

              void main() {
                vec2 centered = vUv - 0.5;
                float dist = length(centered);
                float core = exp(-dist * dist * 220.0);
                float halo = exp(-dist * dist * 26.0) * 0.5;
                float rays = (exp(-abs(centered.x) * 34.0) + exp(-abs(centered.y) * 34.0))
                  * exp(-dist * 5.0) * 0.6 * uGlint;
                vec3 color = mix(uColor, vec3(1.0), clamp(core * 0.9, 0.0, 1.0));
                float alpha = (core + halo + rays) * uOpacity * uIntensity;
                gl_FragColor = vec4(color, alpha);
              }
            `}
          />
        </mesh>
      </group>
    </>
  );
}

function TargetLock({ progress, reducedMotion, lockCopyRef }: SceneProps & { lockCopyRef?: LockCopyRef }) {
  const groupRef = useRef<THREE.Group>(null);
  const linesRef = useRef<Array<ElementRef<typeof Line>>>([]);
  const { camera, size } = useThree();
  const projected = useMemo(() => new THREE.Vector3(), []);
  const targetConfig = METEORS.find((meteor) => meteor.target) ?? METEORS[1];
  const targetCurve = useMemo(
    () =>
      new THREE.CubicBezierCurve3(
        new THREE.Vector3(...targetConfig.start),
        new THREE.Vector3(...targetConfig.controlA),
        new THREE.Vector3(...targetConfig.controlB),
        new THREE.Vector3(...targetConfig.end),
      ),
    [targetConfig],
  );

  const corners = useMemo(
    () => [
      [new THREE.Vector3(-0.4, 0.24, 0), new THREE.Vector3(-0.4, 0.4, 0), new THREE.Vector3(-0.24, 0.4, 0)],
      [new THREE.Vector3(0.24, 0.4, 0), new THREE.Vector3(0.4, 0.4, 0), new THREE.Vector3(0.4, 0.24, 0)],
      [new THREE.Vector3(-0.4, -0.24, 0), new THREE.Vector3(-0.4, -0.4, 0), new THREE.Vector3(-0.24, -0.4, 0)],
      [new THREE.Vector3(0.24, -0.4, 0), new THREE.Vector3(0.4, -0.4, 0), new THREE.Vector3(0.4, -0.24, 0)],
    ],
    [],
  );

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;
    const value = reducedMotion ? 0.42 : progress.current;
    const show =
      windowStep(MARKET_SCENE.lock.frameIn, value) *
      (1 - windowStep(MARKET_SCENE.lock.frameOut, value));
    const targetProgress = smoothstep(
      MARKET_SCENE.meteor.travelStart + targetConfig.delay,
      MARKET_SCENE.meteor.travelEnd + targetConfig.delay,
      value,
    );
    const viewportXScale = size.width <= 720 ? 0.42 : size.width <= 980 ? 0.78 : 1;
    targetCurve.getPointAt(targetProgress, group.position);
    group.position.x *= viewportXScale;
    group.scale.setScalar(lerp(1.45, 0.92, windowStep(MARKET_SCENE.lock.settle, value)));
    group.rotation.z = Math.sin(value * 14) * 0.012;
    linesRef.current.forEach((line) => {
      line.material.opacity = show * 0.82;
    });

    if (lockCopyRef?.current) {
      group.getWorldPosition(projected).project(camera);
      const anchorX = (projected.x * 0.5 + 0.5) * size.width;
      const anchorY = (-projected.y * 0.5 + 0.5) * size.height;
      const cardWidth = size.width <= 720 ? Math.min(320, size.width - 36) : Math.min(360, size.width * 0.42);
      const gap = size.width <= 720 ? 16 : 24;
      const left = size.width > 720 || anchorX > size.width * 0.62
        ? anchorX - cardWidth - gap
        : anchorX + gap;
      const clampedLeft = Math.min(Math.max(left, 18), Math.max(18, size.width - cardWidth - 18));
      const clampedTop = Math.min(Math.max(anchorY, size.height * 0.2), size.height * 0.82);
      lockCopyRef.current.style.setProperty("--lock-left", `${clampedLeft}px`);
      lockCopyRef.current.style.setProperty("--lock-top", `${clampedTop}px`);
    }
  });

  return (
    <group ref={groupRef}>
      {corners.map((points, index) => (
        <Line
          key={index}
          ref={(line) => {
            if (line) linesRef.current[index] = line;
          }}
          points={points}
          color={SIGNAL_COLORS.primary}
          lineWidth={1.15}
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
        />
      ))}
    </group>
  );
}

/**
 * Know the Why 的证据汇流（方案 A）：四条数据流从 context 卡（WHY_CONTEXT_PLACEMENTS
 * 反投影到世界空间）流向行星表面——运动方向即语义：证据流入市场，汇聚成一个价格。
 * 激活维度的流更亮更快，命中点带脉冲。
 */
const EVIDENCE_STREAMS = [
  { tone: "fast", color: "#ff9b3e", bend: 0.5, speed: 0.22, phase: 0 },
  { tone: "smart", color: "#36c7e8", bend: -0.38, speed: 0.2, phase: 0.35 },
  { tone: "cohort", color: "#88b8d8", bend: 0.42, speed: 0.18, phase: 0.62 },
  { tone: "news", color: "#ffc45e", bend: -0.46, speed: 0.21, phase: 0.18 },
] as const;

const STREAM_LINE_SEGMENTS = 24;
const STREAM_PARTICLES = 12;

type ActiveEvidenceRef = { current: number };
type OrbitLabelsRef = MutableRefObject<HTMLElement | null>;

function PlanetInspection({
  progress,
  reducedMotion,
  handoffAnchor,
  activeEvidenceRef,
  orbitLabels,
}: SceneProps & {
  handoffAnchor: HandoffAnchorRef;
  activeEvidenceRef?: ActiveEvidenceRef;
  orbitLabels?: OrbitLabelsRef;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const shellMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const pointMaterialRef = useRef<THREE.PointsMaterial>(null);
  const coreMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const atmosphereMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const streamLineRefs = useRef<Array<ElementRef<typeof Line> | null>>([]);
  const streamGeometryRefs = useRef<Array<THREE.BufferGeometry | null>>([]);
  const streamMaterialRefs = useRef<Array<THREE.ShaderMaterial | null>>([]);
  const impactRefs = useRef<Array<THREE.Mesh | null>>([]);
  const impactMaterialRefs = useRef<Array<THREE.MeshBasicMaterial | null>>([]);
  const centerAnchorRef = useRef<THREE.Object3D>(null);
  const streamLinePositions = useMemo(
    () => EVIDENCE_STREAMS.map(() => new Float32Array((STREAM_LINE_SEGMENTS + 1) * 3)),
    [],
  );
  const streamLineInitialPoints = useMemo(
    () =>
      EVIDENCE_STREAMS.map(() =>
        Array.from({ length: STREAM_LINE_SEGMENTS + 1 }, () => new THREE.Vector3()),
      ),
    [],
  );
  const streamParticlePositions = useMemo(
    () => EVIDENCE_STREAMS.map(() => new Float32Array(STREAM_PARTICLES * 3)),
    [],
  );
  const streamParticleAlphas = useMemo(
    () => EVIDENCE_STREAMS.map(() => new Float32Array(STREAM_PARTICLES)),
    [],
  );
  const streamUniforms = useMemo(
    () =>
      EVIDENCE_STREAMS.map((spec) => ({
        uColor: { value: new THREE.Color(spec.color) },
        uOpacity: { value: 0 },
        uPixelRatio: { value: 1 },
      })),
    [],
  );
  const streamCurve = useMemo(
    () =>
      new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ),
    [],
  );
  const { camera } = useThree();
  const endpointTarget = useMemo(() => new THREE.Vector3(), []);
  const projected = useMemo(() => new THREE.Vector3(), []);
  const direction = useMemo(() => new THREE.Vector3(), []);
  const labelWorld = useMemo(() => new THREE.Vector3(), []);
  const planetWorld = useMemo(() => new THREE.Vector3(), []);
  const streamStart = useMemo(() => new THREE.Vector3(), []);
  const streamEnd = useMemo(() => new THREE.Vector3(), []);
  const toPlanet = useMemo(() => new THREE.Vector3(), []);
  const streamPerp = useMemo(() => new THREE.Vector3(), []);
  const streamSample = useMemo(() => new THREE.Vector3(), []);

  const surfacePoints = useMemo(() => {
    const random = seededRandom(731);
    const positions = new Float32Array(240 * 3);
    for (let index = 0; index < 240; index += 1) {
      const y = 1 - (index / 239) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = Math.PI * (3 - Math.sqrt(5)) * index + random() * 0.08;
      positions[index * 3] = Math.cos(theta) * radius * 1.035;
      positions[index * 3 + 1] = y * 1.035;
      positions[index * 3 + 2] = Math.sin(theta) * radius * 1.035;
    }
    return positions;
  }, []);
  const atmosphereUniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color("#2de2c0") },
      uOpacity: { value: 0 },
    }),
    [],
  );

  useFrame((state) => {
    const group = groupRef.current;
    const shellMaterial = shellMaterialRef.current;
    const pointMaterial = pointMaterialRef.current;
    const coreMaterial = coreMaterialRef.current;
    const atmosphereMaterial = atmosphereMaterialRef.current;
    if (!group || !shellMaterial || !pointMaterial || !coreMaterial || !atmosphereMaterial) return;

    const value = reducedMotion ? 0.6 : progress.current;
    const reveal = windowStep(MARKET_SCENE.planet.reveal, value);
    const morph = windowStep(MARKET_SCENE.planet.morph, value);
    const breathe = 1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.012 * (1 - morph);
    const inspectionScale = state.size.width <= 720 ? 0.52 : state.size.width <= 980 ? 0.8 : 1;
    const anchor = handoffAnchor.current;
    screenPointToWorld(
      camera,
      anchor.left + anchor.width * sampleMarketChartX(1),
      anchor.top + anchor.height * sampleMarketChart(1),
      -0.42,
      endpointTarget,
      projected,
      direction,
    );

    group.position.set(
      lerp(0, endpointTarget.x, morph),
      lerp(-0.05, endpointTarget.y, morph),
      lerp(-2.8, endpointTarget.z, morph),
    );
    group.scale.setScalar(
      lerp(0.08, 1, reveal) * lerp(1, 0.055, morph) * breathe * inspectionScale,
    );
    group.rotation.y = state.clock.elapsedTime * 0.08 * (1 - morph);
    group.rotation.z = morph * -0.02;

    shellMaterial.opacity = reveal * (1 - morph) * 0.055;
    coreMaterial.opacity = reveal * lerp(0.88, 0.96, morph);
    pointMaterial.opacity = reveal * (1 - morph) * 0.2;
    atmosphereMaterial.uniforms.uOpacity.value = reveal * lerp(0.12, 0.26, morph);

    const streamVisibility = reveal * (1 - morph);
    const activeIndex = activeEvidenceRef?.current ?? 0;
    const labelsElement = orbitLabels?.current ?? null;
    const time = state.clock.elapsedTime;
    const pixelRatio = Math.min(state.gl.getPixelRatio(), 1.5);

    group.getWorldPosition(planetWorld);
    const surfaceRadius = 0.74 * group.scale.x * 1.06;

    EVIDENCE_STREAMS.forEach((spec, index) => {
      const line = streamLineRefs.current[index];
      const geometry = streamGeometryRefs.current[index];
      const material = streamMaterialRefs.current[index];
      const impact = impactRefs.current[index];
      const impactMaterial = impactMaterialRefs.current[index];
      if (!line || !geometry || !material || !impact || !impactMaterial) return;

      const isActive = index === activeIndex;
      const placement = WHY_CONTEXT_PLACEMENTS[index];

      // 起点：context 卡的屏幕位置反投影到行星所在深度平面
      screenPointToWorld(
        camera,
        placement.left / 100,
        placement.top / 100,
        planetWorld.z,
        streamStart,
        projected,
        direction,
      );
      // 终点：行星表面朝向卡片的一侧
      toPlanet.copy(streamStart).sub(planetWorld);
      const startDistance = Math.max(0.001, toPlanet.length());
      toPlanet.divideScalar(startDistance);
      streamEnd.copy(planetWorld).addScaledVector(toPlanet, surfaceRadius);
      // 控制点：中点加垂直弯曲，形成轻微弧线
      streamPerp.set(-toPlanet.y, toPlanet.x, 0);
      streamCurve.v0.copy(streamStart);
      streamCurve.v2.copy(streamEnd);
      streamCurve.v1
        .copy(streamStart)
        .add(streamEnd)
        .multiplyScalar(0.5)
        .addScaledVector(streamPerp, spec.bend * 0.24 * startDistance);

      const linePositionArray = streamLinePositions[index];
      for (let step = 0; step <= STREAM_LINE_SEGMENTS; step += 1) {
        streamCurve.getPoint(step / STREAM_LINE_SEGMENTS, streamSample);
        linePositionArray[step * 3] = streamSample.x;
        linePositionArray[step * 3 + 1] = streamSample.y;
        linePositionArray[step * 3 + 2] = streamSample.z;
      }
      line.geometry.setPositions(linePositionArray);
      line.material.opacity = streamVisibility * (isActive ? 0.48 : 0.15);
      line.material.linewidth = isActive ? 1.4 : 1;

      // 粒子沿曲线向行星流动——方向即语义：证据流入市场
      const flowSpeed = reducedMotion ? 0 : spec.speed * (isActive ? 1.7 : 1);
      const particlePositionArray = streamParticlePositions[index];
      const particleAlphaArray = streamParticleAlphas[index];
      for (let particle = 0; particle < STREAM_PARTICLES; particle += 1) {
        const phase = (time * flowSpeed + spec.phase + particle / STREAM_PARTICLES) % 1;
        streamCurve.getPoint(phase, streamSample);
        particlePositionArray[particle * 3] = streamSample.x;
        particlePositionArray[particle * 3 + 1] = streamSample.y;
        particlePositionArray[particle * 3 + 2] = streamSample.z;
        particleAlphaArray[particle] =
          Math.sin(phase * Math.PI) ** 0.6 * (0.3 + 0.7 * phase);
      }
      geometry.getAttribute("position").needsUpdate = true;
      geometry.getAttribute("aAlpha").needsUpdate = true;
      material.uniforms.uOpacity.value = streamVisibility * (isActive ? 0.95 : 0.28);
      material.uniforms.uPixelRatio.value = pixelRatio;

      // 命中脉冲：证据抵达市场的落点
      const impactPulse = 0.5 + 0.5 * Math.sin(time * 3.1 + spec.phase * 7);
      impact.position.copy(streamEnd);
      impact.scale.setScalar((isActive ? 1 : 0.55) * (1 + impactPulse * 0.35));
      impactMaterial.opacity =
        streamVisibility * (isActive ? 0.42 + impactPulse * 0.26 : 0.12);
    });

    if (labelsElement && centerAnchorRef.current && streamVisibility > 0.01) {
      centerAnchorRef.current.getWorldPosition(labelWorld).project(camera);
      labelsElement.style.setProperty(
        "--orbit-center-x",
        `${((labelWorld.x * 0.5 + 0.5) * state.size.width).toFixed(1)}px`,
      );
      labelsElement.style.setProperty(
        "--orbit-center-y",
        `${((-labelWorld.y * 0.5 + 0.5) * state.size.height).toFixed(1)}px`,
      );
    }
  });

  return (
    <>
    <group ref={groupRef}>
      <mesh renderOrder={0}>
        <sphereGeometry args={[0.74, 64, 40]} />
        <meshStandardMaterial
          ref={coreMaterialRef}
          color="#03110e"
          emissive="#075044"
          emissiveIntensity={0.34}
          roughness={0.52}
          metalness={0.14}
          transparent
          opacity={0}
          depthWrite
        />
      </mesh>
      <mesh renderOrder={0}>
        <icosahedronGeometry args={[0.77, 1]} />
        <meshBasicMaterial
          ref={shellMaterialRef}
          color={SIGNAL_COLORS.primary}
          wireframe
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
      <points scale={0.74}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[surfacePoints, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={pointMaterialRef}
          color="#7df5df"
          size={0.018}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <mesh scale={0.86}>
        <sphereGeometry args={[1, 48, 32]} />
        <shaderMaterial
          ref={atmosphereMaterialRef}
          uniforms={atmosphereUniforms}
          transparent
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          vertexShader={`
            varying float vFresnel;

            void main() {
              vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
              vec3 viewNormal = normalize(normalMatrix * normal);
              vec3 viewDirection = normalize(-viewPosition.xyz);
              vFresnel = pow(1.0 - abs(dot(viewNormal, viewDirection)), 2.25);
              gl_Position = projectionMatrix * viewPosition;
            }
          `}
          fragmentShader={`
            uniform vec3 uColor;
            uniform float uOpacity;
            varying float vFresnel;

            void main() {
              gl_FragColor = vec4(uColor, vFresnel * uOpacity);
            }
          `}
        />
      </mesh>
      <object3D ref={centerAnchorRef} position={[0, -1.28, 0]} />
    </group>
    {EVIDENCE_STREAMS.map((spec, index) => (
      <group key={spec.tone}>
        <Line
          ref={(line) => {
            streamLineRefs.current[index] = line;
          }}
          points={streamLineInitialPoints[index]}
          color={spec.color}
          lineWidth={1}
          transparent
          opacity={0}
          depthWrite={false}
          toneMapped={false}
        />
        <points frustumCulled={false}>
          <bufferGeometry
            ref={(geometry) => {
              streamGeometryRefs.current[index] = geometry as THREE.BufferGeometry | null;
            }}
          >
            <bufferAttribute
              attach="attributes-position"
              args={[streamParticlePositions[index], 3]}
            />
            <bufferAttribute
              attach="attributes-aAlpha"
              args={[streamParticleAlphas[index], 1]}
            />
          </bufferGeometry>
          <shaderMaterial
            ref={(material) => {
              streamMaterialRefs.current[index] = material;
            }}
            uniforms={streamUniforms[index]}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            vertexShader={`
              attribute float aAlpha;
              uniform float uPixelRatio;
              varying float vAlpha;

              void main() {
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                vAlpha = aAlpha;
                gl_PointSize = min(9.0, (2.4 + aAlpha * 3.6) * uPixelRatio * (16.0 / max(1.0, -mvPosition.z)));
                gl_Position = projectionMatrix * mvPosition;
              }
            `}
            fragmentShader={`
              uniform vec3 uColor;
              uniform float uOpacity;
              varying float vAlpha;

              void main() {
                vec2 centered = gl_PointCoord - vec2(0.5);
                float radius = length(centered);
                float core = smoothstep(0.5, 0.06, radius);
                gl_FragColor = vec4(uColor, core * vAlpha * uOpacity);
              }
            `}
          />
        </points>
        <mesh
          ref={(mesh) => {
            impactRefs.current[index] = mesh;
          }}
        >
          <sphereGeometry args={[0.05, 12, 12]} />
          <meshBasicMaterial
            ref={(material) => {
              impactMaterialRefs.current[index] = material;
            }}
            color={spec.color}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>
    ))}
    </>
  );
}

function OrbitToChart({
  progress,
  reducedMotion,
  handoffAnchor,
}: SceneProps & { handoffAnchor: HandoffAnchorRef }) {
  const geometryRef = useRef<THREE.BufferGeometry>(null);
  const materialRef = useRef<THREE.LineBasicMaterial>(null);
  const positions = useMemo(() => new Float32Array(128 * 3), []);
  const { camera } = useThree();
  const finalPoint = useMemo(() => new THREE.Vector3(), []);
  const projected = useMemo(() => new THREE.Vector3(), []);
  const direction = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const geometry = geometryRef.current;
    const material = materialRef.current;
    if (!geometry || !material) return;

    const value = reducedMotion ? 0.82 : progress.current;
    const reveal = windowStep(MARKET_SCENE.orbitPath.reveal, value);
    const morph = windowStep(MARKET_SCENE.orbitPath.morph, value);
    const anchor = handoffAnchor.current;
    const inspectionScale = state.size.width <= 720 ? 0.52 : state.size.width <= 980 ? 0.8 : 1;

    for (let index = 0; index < 128; index += 1) {
      const ratio = index / 127;
      const angle = Math.PI * (1 - ratio);
      const orbitX = Math.cos(angle) * 2.3 * inspectionScale;
      const orbitY = Math.sin(angle) * 1.02 * inspectionScale;
      screenPointToWorld(
        camera,
        anchor.left + anchor.width * sampleMarketChartX(ratio),
        anchor.top + anchor.height * sampleMarketChart(ratio),
        -0.42,
        finalPoint,
        projected,
        direction,
      );

      positions[index * 3] = lerp(orbitX, finalPoint.x, morph);
      positions[index * 3 + 1] = lerp(orbitY, finalPoint.y, morph);
      positions[index * 3 + 2] = lerp(-2.78, finalPoint.z, morph);
    }

    const attribute = geometry.getAttribute("position") as THREE.BufferAttribute;
    attribute.needsUpdate = true;
    material.opacity = reveal * (1 - windowStep(MARKET_SCENE.orbitPath.fadeOut, value)) * 0.86;
  });

  return (
    <line>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        ref={materialRef}
        color={SIGNAL_COLORS.primary}
        transparent
        opacity={0}
        depthWrite={false}
      />
    </line>
  );
}

export function MotionLabScene({
  progress,
  reducedMotion,
  handoffAnchor,
  lockCopyRef,
  enablePostprocessing = true,
  activeEvidenceRef,
  orbitLabels,
}: SceneProps & {
  handoffAnchor: HandoffAnchorRef;
  lockCopyRef?: LockCopyRef;
  enablePostprocessing?: boolean;
  activeEvidenceRef?: ActiveEvidenceRef;
  orbitLabels?: OrbitLabelsRef;
}) {
  return (
    <>
      <color attach="background" args={["#020706"]} />
      <fog attach="fog" args={["#020706", 8, 31]} />
      <ambientLight intensity={0.42} color="#c4fff2" />
      <pointLight position={[2.8, 2.2, 4]} intensity={7} color="#08dfb5" distance={14} />
      <pointLight position={[-4, -1.6, 1]} intensity={3} color="#36c7e8" distance={12} />

      <SceneDirector progress={progress} reducedMotion={reducedMotion} />
      <SignalField progress={progress} reducedMotion={reducedMotion} />
      {METEORS.map((config, index) => (
        <Meteor
          key={`${config.color}-${index}`}
          config={config}
          progress={progress}
          reducedMotion={reducedMotion}
        />
      ))}
      <TargetLock progress={progress} reducedMotion={reducedMotion} lockCopyRef={lockCopyRef} />
      <PlanetInspection
        progress={progress}
        reducedMotion={reducedMotion}
        handoffAnchor={handoffAnchor}
        activeEvidenceRef={activeEvidenceRef}
        orbitLabels={orbitLabels}
      />
      <OrbitToChart
        progress={progress}
        reducedMotion={reducedMotion}
        handoffAnchor={handoffAnchor}
      />
      {!reducedMotion && enablePostprocessing ? (
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom
            intensity={0.38}
            luminanceThreshold={0.62}
            luminanceSmoothing={0.34}
            mipmapBlur
          />
        </EffectComposer>
      ) : null}
      <AdaptiveDpr pixelated />
    </>
  );
}
