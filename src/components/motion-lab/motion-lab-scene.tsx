"use client";

import { AdaptiveDpr, Line } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { damp3, dampLookAt } from "maath/easing";
import { useMemo, useRef, type ElementRef, type MutableRefObject } from "react";
import * as THREE from "three";

import {
  sampleMarketChart,
  sampleMarketChartX,
} from "@/components/product-demo/market-demo-chart";

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
  risk: "#ff6d70",
};

function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function smoothstep(start: number, end: number, value: number) {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
}

function smootherstep(start: number, end: number, value: number) {
  const t = clamp((value - start) / (end - start));
  return t * t * t * (t * (t * 6 - 15) + 10);
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
    const flight = smoothstep(0.14, 0.46, rawProgress);
    const signalTrack = smoothstep(0.28, 0.46, rawProgress);
    const inspection = smoothstep(0.4, 0.62, rawProgress);
    const handoff = smoothstep(0.64, 0.84, rawProgress);

    flightPath.getPointAt(flight, positionTarget);
    positionTarget.x = lerp(positionTarget.x, 0.42, signalTrack) - handoff * 0.42;
    positionTarget.y = lerp(positionTarget.y, -0.08, inspection) + handoff * 0.08;
    positionTarget.z += handoff * 1.9;

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

function HeroGrid({ progress, reducedMotion }: SceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.LineBasicMaterial>(null);
  const pointMaterialRef = useRef<THREE.PointsMaterial>(null);

  const { linePositions, pointPositions } = useMemo(() => {
    const lines: number[] = [];
    const points: number[] = [];
    const columns = 22;
    const rows = 14;
    const width = 15;
    const height = 9;

    for (let column = 0; column <= columns; column += 1) {
      const x = -width / 2 + (width * column) / columns;
      lines.push(x, -height / 2, 0, x, height / 2, 0);
    }

    for (let row = 0; row <= rows; row += 1) {
      const y = -height / 2 + (height * row) / rows;
      lines.push(-width / 2, y, 0, width / 2, y, 0);
    }

    for (let row = 0; row <= rows; row += 1) {
      for (let column = 0; column <= columns; column += 1) {
        points.push(
          -width / 2 + (width * column) / columns,
          -height / 2 + (height * row) / rows,
          0,
        );
      }
    }

    return {
      linePositions: new Float32Array(lines),
      pointPositions: new Float32Array(points),
    };
  }, []);

  useFrame(() => {
    const group = groupRef.current;
    const material = materialRef.current;
    const pointMaterial = pointMaterialRef.current;
    if (!group || !material || !pointMaterial) return;

    const value = reducedMotion ? 0.18 : progress.current;
    const depth = smoothstep(0.02, 0.23, value);
    const fade = 1 - smootherstep(0.19, 0.3, value);

    group.rotation.x = 0;
    group.position.y = 0;
    group.position.z = lerp(-1.8, 2.75, depth);
    group.scale.setScalar(lerp(1, 2.85, depth));
    material.opacity = 0.2 * fade;
    pointMaterial.opacity = 0.48 * fade;
  });

  return (
    <group ref={groupRef}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          ref={materialRef}
          color={SIGNAL_COLORS.primary}
          transparent
          opacity={0.2}
          depthWrite={false}
        />
      </lineSegments>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pointPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={pointMaterialRef}
          color="#9ae8d8"
          size={0.028}
          transparent
          opacity={0.48}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  );
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
    const fadeIn = smoothstep(0.12, 0.28, value);
    const fadeOut = 1 - smoothstep(0.72, 0.9, value);
    const heroDepth = 1 - smoothstep(0.08, 0.24, value);
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
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={`
          attribute float aSize;
          uniform float uProgress;
          uniform float uPixelRatio;
          uniform float uTime;
          varying float vDepth;

          void main() {
            vec3 transformed = position;
            float travel = uProgress * 33.0;
            transformed.z = mod(position.z + travel + 30.0, 32.0) - 30.0;
            transformed.x += sin(position.z * 0.41 + uTime * 0.09) * 0.12;
            transformed.y += cos(position.x * 0.72 + uTime * 0.07) * 0.08;
            vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
            vDepth = smoothstep(-30.0, 1.0, transformed.z);
            gl_PointSize = min(7.0, aSize * uPixelRatio * (38.0 / max(1.0, -mvPosition.z)));
            gl_Position = projectionMatrix * mvPosition;
          }
        `}
        fragmentShader={`
          uniform float uOpacity;
          varying float vDepth;

          void main() {
            vec2 centered = gl_PointCoord - vec2(0.5);
            float distanceFromCenter = length(centered);
            float alpha = smoothstep(0.5, 0.04, distanceFromCenter);
            vec3 color = mix(vec3(0.19, 0.50, 0.56), vec3(0.62, 0.96, 0.88), vDepth);
            gl_FragColor = vec4(color, alpha * uOpacity);
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

const METEORS: MeteorConfig[] = [
  {
    start: [-6.4, 2.4, -8],
    controlA: [-4.4, 3.1, -7.1],
    controlB: [1.8, -0.1, -4.8],
    end: [5.5, -2.4, -4],
    color: SIGNAL_COLORS.fast,
    delay: 0,
  },
  {
    start: [6.3, 1.8, -9.5],
    controlA: [5.1, 2.7, -8.1],
    controlB: [2.4, 0.44, -4.1],
    end: [0, -0.05, -2.8],
    color: "#91aaa4",
    delay: 0.035,
    target: true,
  },
  {
    start: [-4.8, -2.5, -9],
    controlA: [-3.1, -3.1, -8.2],
    controlB: [2.8, 0.6, -7.1],
    end: [6.5, 1.3, -6],
    color: SIGNAL_COLORS.smart,
    delay: 0.08,
  },
  {
    start: [5.8, -1.8, -10.5],
    controlA: [3.4, -2.8, -10.2],
    controlB: [-1.8, 0.9, -9.1],
    end: [-5.5, 2.6, -8],
    color: SIGNAL_COLORS.orders,
    delay: 0.13,
  },
];

function Meteor({ config, progress, reducedMotion }: SceneProps & { config: MeteorConfig }) {
  const headRef = useRef<THREE.Group>(null);
  const headMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const headGlowMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
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
  const tangent = useMemo(() => new THREE.Vector3(), []);
  const forward = useMemo(() => new THREE.Vector3(0, 0, 1), []);
  const baseColor = useMemo(() => new THREE.Color(config.color), [config.color]);
  const selectedColor = useMemo(() => new THREE.Color(SIGNAL_COLORS.primary), []);
  const currentColor = useMemo(() => new THREE.Color(config.color), [config.color]);

  useFrame(({ gl, clock, size }, delta) => {
    const head = headRef.current;
    const coreLine = coreLineRef.current;
    const tailGeometry = tailGeometryRef.current;
    const tailMaterial = tailMaterialRef.current;
    const headMaterial = headMaterialRef.current;
    const headGlowMaterial = headGlowMaterialRef.current;
    if (!head || !coreLine || !tailGeometry || !tailMaterial || !headMaterial || !headGlowMaterial) return;

    const value = reducedMotion ? 0.34 : progress.current;
    const local = smoothstep(0.13 + config.delay, 0.4 + config.delay, value);
    const targetHold = config.target ? 1 - smoothstep(0.43, 0.55, value) : 1;
    const lockFocus = config.target ? smoothstep(0.29, 0.37, value) : 0;
    const backgroundSignal = config.target ? 1 : 1 - smoothstep(0.3, 0.43, value) * 0.78;
    const visible = smoothstep(0.08, 0.16, value) * (1 - smoothstep(0.56, 0.68, value));
    const flickerWave = 0.5 + 0.5 * Math.sin(clock.elapsedTime * (1.4 + config.delay * 2.8) + config.delay * 42);
    const flicker = reducedMotion ? 1 : 0.82 + flickerWave * 0.18;
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
    curve.getTangentAt(local, tangent).normalize();
    tangent.x *= viewportXScale;
    tangent.normalize();
    head.quaternion.setFromUnitVectors(forward, tangent);
    const speedStretch = 1 + Math.min(velocityRef.current * 0.28, 0.8);
    head.scale.set(
      config.target ? lerp(0.72, 1.05, local) : 0.78,
      config.target ? lerp(0.72, 1.05, local) : 0.78,
      speedStretch,
    );

    currentColor.lerpColors(baseColor, selectedColor, lockFocus);
    tailMaterial.uniforms.uColor.value.copy(currentColor);
    coreLine.material.color.copy(currentColor);
    headMaterial.color.copy(currentColor);
    headGlowMaterial.color.copy(currentColor);

    const opacity = visible * targetHold * backgroundSignal * flicker;
    head.visible = opacity > 0.01;
    coreLine.material.opacity = opacity * (config.target ? 0.76 : 0.44);
    tailMaterial.uniforms.uOpacity.value = opacity * (config.target ? 0.9 : 0.62);
    tailMaterial.uniforms.uPixelRatio.value = Math.min(gl.getPixelRatio(), 1.5);
    headMaterial.opacity = opacity;
    headGlowMaterial.opacity = opacity * 0.16;
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
              gl_FragColor = vec4(uColor, (core + halo) * vAlpha * uOpacity);
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
        <mesh>
          <sphereGeometry args={[0.085, 20, 20]} />
          <meshBasicMaterial
            ref={headMaterialRef}
            color={config.color}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
        <mesh scale={2.15}>
          <sphereGeometry args={[0.085, 16, 16]} />
          <meshBasicMaterial
            ref={headGlowMaterialRef}
            color={config.color}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
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
    const show = smoothstep(0.29, 0.36, value) * (1 - smoothstep(0.48, 0.56, value));
    const targetProgress = smoothstep(0.13 + targetConfig.delay, 0.4 + targetConfig.delay, value);
    const viewportXScale = size.width <= 720 ? 0.42 : size.width <= 980 ? 0.78 : 1;
    targetCurve.getPointAt(targetProgress, group.position);
    group.position.x *= viewportXScale;
    group.scale.setScalar(lerp(1.45, 0.92, smoothstep(0.29, 0.4, value)));
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

function ellipseArcPoints(
  radiusX: number,
  radiusY: number,
  start: number,
  end: number,
  segments = 180,
) {
  return Array.from({ length: segments }, (_, index) => {
    const angle = lerp(start, end, index / (segments - 1));
    return new THREE.Vector3(Math.cos(angle) * radiusX, Math.sin(angle) * radiusY, 0);
  });
}

export function MotionLabUniversePrelude({
  progress,
  reducedMotion,
  driveCamera = true,
  showHeroGrid = true,
}: SceneProps & { driveCamera?: boolean; showHeroGrid?: boolean }) {
  return (
    <>
      {driveCamera ? <SceneDirector progress={progress} reducedMotion={reducedMotion} /> : null}
      {showHeroGrid ? <HeroGrid progress={progress} reducedMotion={reducedMotion} /> : null}
      <SignalField progress={progress} reducedMotion={reducedMotion} />
      {METEORS.map((config, index) => (
        <Meteor
          key={`${config.color}-${index}`}
          config={config}
          progress={progress}
          reducedMotion={reducedMotion}
        />
      ))}
    </>
  );
}

function PlanetInspection({
  progress,
  reducedMotion,
  handoffAnchor,
  activeEvidenceIndex,
}: SceneProps & { handoffAnchor: HandoffAnchorRef; activeEvidenceIndex: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const shellMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const pointMaterialRef = useRef<THREE.PointsMaterial>(null);
  const coreMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const atmosphereMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const orbitLinesRef = useRef<Array<ElementRef<typeof Line>>>([]);
  const markerRefs = useRef<THREE.Mesh[]>([]);
  const { camera } = useThree();
  const endpointTarget = useMemo(() => new THREE.Vector3(), []);
  const projected = useMemo(() => new THREE.Vector3(), []);
  const direction = useMemo(() => new THREE.Vector3(), []);

  const orbitSpecs = useMemo(
    () => [
      { radiusX: 1.56, radiusY: 0.54, start: -2.82, end: -2.82 + Math.PI * 2, rotation: [0.16, 0.18, 0.05] as const, color: SIGNAL_COLORS.primary },
      { radiusX: 1.92, radiusY: 0.76, start: -0.42, end: -0.42 + Math.PI * 2, rotation: [-0.08, -0.12, -0.09] as const, color: SIGNAL_COLORS.smart },
      { radiusX: 2.28, radiusY: 0.98, start: -2.58, end: -2.58 + Math.PI * 2, rotation: [0.24, 0.08, 0.14] as const, color: SIGNAL_COLORS.orders },
      { radiusX: 2.66, radiusY: 1.14, start: 0.2, end: 0.2 + Math.PI * 2, rotation: [-0.18, 0.12, -0.16] as const, color: SIGNAL_COLORS.fast },
    ],
    [],
  );
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

  useFrame((state, delta) => {
    const group = groupRef.current;
    const shellMaterial = shellMaterialRef.current;
    const pointMaterial = pointMaterialRef.current;
    const coreMaterial = coreMaterialRef.current;
    const atmosphereMaterial = atmosphereMaterialRef.current;
    if (!group || !shellMaterial || !pointMaterial || !coreMaterial || !atmosphereMaterial) return;

    const value = reducedMotion ? 0.6 : progress.current;
    const reveal = smoothstep(0.42, 0.58, value);
    const morph = smoothstep(0.66, 0.84, value);
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
    atmosphereMaterial.uniforms.uOpacity.value = reveal * lerp(0.2, 0.38, morph);
    orbitLinesRef.current.forEach((line, index) => {
      const active = index === Math.min(Math.max(activeEvidenceIndex, 0), orbitSpecs.length - 1);
      const targetOpacity = reveal * (1 - morph) * (active ? 0.68 : 0.16);
      line.material.opacity = THREE.MathUtils.damp(line.material.opacity, targetOpacity, 10, delta);
    });
    markerRefs.current.forEach((marker, index) => {
      const spec = orbitSpecs[index];
      const active = index === Math.min(Math.max(activeEvidenceIndex, 0), orbitSpecs.length - 1);
      const angle = spec.start + ((state.clock.elapsedTime * (0.08 + index * 0.018) + index * 0.21) % 1) * (spec.end - spec.start);
      marker.position.set(Math.cos(angle) * spec.radiusX, Math.sin(angle) * spec.radiusY, 0);
      marker.scale.setScalar(active ? 1.08 : 0.66);
      marker.visible = active && reveal * (1 - morph) > 0.02;
    });
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[1, 64, 40]} />
        <meshStandardMaterial
          ref={coreMaterialRef}
          color="#03110e"
          emissive="#075044"
          emissiveIntensity={0.34}
          roughness={0.52}
          metalness={0.14}
          transparent
          opacity={0}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1.025, 3]} />
        <meshBasicMaterial
          ref={shellMaterialRef}
          color={SIGNAL_COLORS.primary}
          wireframe
          transparent
          opacity={0}
          depthWrite={false}
        />
      </mesh>
      <points>
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
      <mesh scale={1.14}>
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
      {orbitSpecs.map((spec, index) => (
        <group rotation={[...spec.rotation]} key={`${spec.color}-${index}`}>
          <Line
            ref={(line) => {
              if (line) orbitLinesRef.current[index] = line;
            }}
            points={ellipseArcPoints(spec.radiusX, spec.radiusY, spec.start, spec.end)}
            color={spec.color}
            lineWidth={index === 0 ? 1.05 : 0.82}
            transparent
            opacity={0}
            depthTest={false}
            depthWrite={false}
            toneMapped={false}
          />
          <mesh
            ref={(marker) => {
              if (marker) markerRefs.current[index] = marker;
            }}
          >
            <sphereGeometry args={[index === 0 ? 0.045 : 0.034, 14, 14]} />
            <meshBasicMaterial
              color={spec.color}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              toneMapped={false}
            />
          </mesh>
        </group>
      ))}
    </group>
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
    const reveal = smoothstep(0.48, 0.6, value);
    const morph = smoothstep(0.66, 0.84, value);
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
    material.opacity = reveal * (1 - smoothstep(0.78, 0.87, value)) * 0.86;
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
  showHeroGrid = true,
  activeEvidenceIndex = 0,
}: SceneProps & {
  handoffAnchor: HandoffAnchorRef;
  lockCopyRef?: LockCopyRef;
  enablePostprocessing?: boolean;
  showHeroGrid?: boolean;
  activeEvidenceIndex?: number;
}) {
  return (
    <>
      <color attach="background" args={["#020706"]} />
      <fog attach="fog" args={["#020706", 8, 31]} />
      <ambientLight intensity={0.42} color="#c4fff2" />
      <pointLight position={[2.8, 2.2, 4]} intensity={7} color="#08dfb5" distance={14} />
      <pointLight position={[-4, -1.6, 1]} intensity={3} color="#36c7e8" distance={12} />

      <SceneDirector progress={progress} reducedMotion={reducedMotion} />
      {showHeroGrid ? <HeroGrid progress={progress} reducedMotion={reducedMotion} /> : null}
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
        activeEvidenceIndex={activeEvidenceIndex}
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
