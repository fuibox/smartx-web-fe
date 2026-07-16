const CHART_WIDTH = 760;
const CHART_HEIGHT = 320;
const CHART_SAMPLES = 128;
const CHART_HORIZONTAL_INSET = 4;

function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

export function sampleMarketChart(ratio: number) {
  const position = clamp(ratio);
  const wave = Math.sin(position * Math.PI * 5.2) * 18 + Math.sin(position * 19) * 6;
  const y = 256 - position * 202 - wave;
  return clamp(y / CHART_HEIGHT, 0.08, 0.92);
}

export function sampleMarketChartX(ratio: number) {
  const position = clamp(ratio);
  return (
    CHART_HORIZONTAL_INSET + position * (CHART_WIDTH - CHART_HORIZONTAL_INSET * 2)
  ) / CHART_WIDTH;
}

export function createMarketChartPaths() {
  const points = Array.from({ length: CHART_SAMPLES }, (_, index) => {
    const ratio = index / (CHART_SAMPLES - 1);
    return [
      sampleMarketChartX(ratio) * CHART_WIDTH,
      sampleMarketChart(ratio) * CHART_HEIGHT,
    ] as const;
  });
  const linePath = points
    .map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ");
  const [endpointX, endpointY] = points.at(-1) ?? [CHART_WIDTH, 54];

  return {
    linePath,
    areaPath: `${linePath} L${CHART_WIDTH - CHART_HORIZONTAL_INSET} ${CHART_HEIGHT} L${CHART_HORIZONTAL_INSET} ${CHART_HEIGHT} Z`,
    endpoint: [endpointX, endpointY] as [number, number],
  };
}
