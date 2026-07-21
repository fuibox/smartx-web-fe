"use client";

import type { MemoryDomain } from "@/components/memory-demo/memory-demo.types";

const SIZE = 260;
const CENTER = SIZE / 2;
const RADIUS = 72;

function polarPoint(angle: number, radius: number) {
  return [CENTER + Math.cos(angle) * radius, CENTER + Math.sin(angle) * radius] as const;
}

/** vc-demo 的雷达图：当前维度的子维度权重构成的多边形。 */
export function MemoryRadar({ domain }: { domain: MemoryDomain }) {
  const dimensions = domain.dimensions;
  const angleFor = (index: number) =>
    -Math.PI / 2 + (index / dimensions.length) * Math.PI * 2;

  const ringPath = (scale: number) =>
    dimensions
      .map((_, index) => polarPoint(angleFor(index), RADIUS * scale).join(","))
      .join(" ");

  const valuePoints = dimensions
    .map((dimension, index) =>
      polarPoint(angleFor(index), (RADIUS * dimension.weight) / 100).join(","),
    )
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      width={SIZE}
      height={SIZE}
      role="img"
      aria-label={`${domain.label} sub-dimension weights`}
    >
      {[0.33, 0.66, 1].map((scale) => (
        <polygon
          points={ringPath(scale)}
          fill="none"
          stroke="#1d3b33"
          strokeWidth="1"
          key={scale}
        />
      ))}
      {dimensions.map((dimension, index) => {
        const [x, y] = polarPoint(angleFor(index), RADIUS);
        return (
          <line
            x1={CENTER}
            y1={CENTER}
            x2={x}
            y2={y}
            stroke="#1d3b33"
            strokeWidth="1"
            key={dimension.id}
          />
        );
      })}
      <g key={domain.id}>
        <polygon
          points={valuePoints}
          fill={domain.color}
          fillOpacity="0.16"
          stroke={domain.color}
          strokeWidth="1.5"
          strokeLinejoin="round"
        >
          <animate attributeName="fill-opacity" from="0" to="0.16" dur="0.4s" />
        </polygon>
        {dimensions.map((dimension, index) => {
          const [x, y] = polarPoint(angleFor(index), (RADIUS * dimension.weight) / 100);
          return <circle cx={x} cy={y} r="2.6" fill={domain.color} key={dimension.id} />;
        })}
      </g>
      {dimensions.map((dimension, index) => {
        const angle = angleFor(index);
        const [x, y] = polarPoint(angle, RADIUS + 16);
        const anchor =
          Math.abs(Math.cos(angle)) < 0.25 ? "middle" : Math.cos(angle) > 0 ? "start" : "end";
        return (
          <g key={dimension.id}>
            <text
              x={x}
              y={y}
              textAnchor={anchor}
              fill="#8fa8a0"
              fontSize="11"
              fontFamily="var(--font-ui)"
            >
              {dimension.label}
            </text>
            <text
              x={x}
              y={y + 13}
              textAnchor={anchor}
              fill={domain.color}
              fontSize="11"
              fontFamily="var(--font-jb)"
            >
              {dimension.weight}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
