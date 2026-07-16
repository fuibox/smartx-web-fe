"use client";

import {
  AreaSeries,
  ColorType,
  CrosshairMode,
  createChart,
  type IChartApi,
  type UTCTimestamp,
} from "lightweight-charts";
import { useEffect, useMemo, useRef } from "react";

import type { MarketEvidence } from "./market-demo.types";
import styles from "./market-demo.module.css";

type MarketDemoChartViewProps = {
  activeEvidence: MarketEvidence;
  range: string;
};

const POINT_COUNT = 96;
const START_TIME = Date.UTC(2026, 6, 14, 6, 0, 0) / 1000;

function createMarketSeries() {
  return Array.from({ length: POINT_COUNT }, (_, index) => {
    const ratio = index / (POINT_COUNT - 1);
    const broadMove = 45.8 + ratio * 22.6;
    const marketNoise = Math.sin(ratio * Math.PI * 5.1) * 3.1 + Math.sin(ratio * 18.2) * 1.15;

    return {
      time: (START_TIME + index * 600) as UTCTimestamp,
      value: index === POINT_COUNT - 1 ? 68.4 : Number((broadMove + marketNoise).toFixed(2)),
    };
  });
}

const visiblePointsByRange: Record<string, number> = {
  "1H": 12,
  "1D": 48,
  "1W": 76,
  ALL: POINT_COUNT,
};

export function MarketDemoChartView({ activeEvidence, range }: MarketDemoChartViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesData = useMemo(createMarketSeries, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#53647a",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        fontSize: 10,
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: "rgba(45, 66, 83, 0.34)" },
        horzLines: { color: "rgba(45, 66, 83, 0.34)" },
      },
      crosshair: {
        mode: CrosshairMode.Magnet,
        vertLine: {
          color: "rgba(143, 174, 169, 0.42)",
          labelBackgroundColor: "#15312f",
        },
        horzLine: {
          color: "rgba(143, 174, 169, 0.3)",
          labelBackgroundColor: "#15312f",
        },
      },
      rightPriceScale: {
        borderColor: "rgba(61, 84, 101, 0.44)",
        scaleMargins: { top: 0.14, bottom: 0.12 },
      },
      timeScale: {
        borderColor: "rgba(61, 84, 101, 0.44)",
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 3,
        barSpacing: 9,
      },
      handleScroll: false,
      handleScale: false,
      localization: {
        priceFormatter: (price: number) => `${price.toFixed(1)}%`,
      },
    });

    const series = chart.addSeries(AreaSeries, {
      lineColor: "#08dfb5",
      topColor: "rgba(8, 223, 181, 0.24)",
      bottomColor: "rgba(8, 223, 181, 0.012)",
      lineWidth: 2,
      crosshairMarkerBackgroundColor: "#08dfb5",
      crosshairMarkerBorderColor: "#d8fff7",
      crosshairMarkerRadius: 4,
      priceLineColor: "rgba(8, 223, 181, 0.34)",
      priceLineWidth: 1,
      lastValueVisible: true,
    });
    series.setData(seriesData);
    chartRef.current = chart;

    return () => {
      chartRef.current = null;
      chart.remove();
    };
  }, [seriesData]);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    const visiblePoints = visiblePointsByRange[range] ?? POINT_COUNT;
    chart.timeScale().setVisibleLogicalRange({
      from: Math.max(0, POINT_COUNT - visiblePoints - 1),
      to: POINT_COUNT + 2,
    });
  }, [range]);

  return (
    <div className={styles.liveChart}>
      <div ref={containerRef} className={styles.liveChartCanvas} />
      <div className={styles.chartCallout} data-tone={activeEvidence.tone}>
        <span>{activeEvidence.label}</span>
        <strong>{activeEvidence.headline}</strong>
        <p>{activeEvidence.detail}</p>
        <small>{activeEvidence.age}</small>
      </div>
    </div>
  );
}
