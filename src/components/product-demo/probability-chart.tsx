"use client";

import {
  AreaSeries,
  CandlestickSeries,
  ColorType,
  CrosshairMode,
  createChart,
  createSeriesMarkers,
  type CandlestickData,
  type SeriesMarker,
  type Time,
  type UTCTimestamp,
} from "lightweight-charts";
import { useEffect, useRef } from "react";

import { fedRateMarketFixture } from "./market-demo.fixture";

const START_TIME = Date.UTC(2026, 6, 14, 5, 0, 0) / 1000;

/** 证据 pin 在图表上的锚点（left 为时间轴百分比，top 供 DOM 交互层使用）。 */
export const EVENT_POSITIONS = [
  { left: 19, top: 66 },
  { left: 38, top: 49 },
  { left: 54, top: 58 },
  { left: 69, top: 31 },
  { left: 84, top: 24 },
] as const;

export const EVENT_TONE_COLORS: Record<string, string> = {
  fast: "#ff9b3e",
  smart: "#36c7e8",
  news: "#ffc45e",
  structure: "#bca6f5",
  related: "#74d19b",
};

/** 策略触发发生的 K 线序号——与策略卡的 "Triggered" 状态对应。 */
const STRATEGY_TRIGGER_INDEX = 66;

function createProbabilityCandles(): CandlestickData<Time>[] {
  let previousClose = 56.8;

  return Array.from({ length: 72 }, (_, index) => {
    const ratio = index / 71;
    const trend = 56.2 + ratio * 11.5;
    const wave = Math.sin(ratio * Math.PI * 4.6) * 1.65 + Math.sin(ratio * 19.4) * 0.48;
    const close = index === 71 ? 68.4 : Number((trend + wave).toFixed(2));
    const open = Number(previousClose.toFixed(2));
    const spread = 0.32 + Math.abs(Math.sin(index * 1.71)) * 0.54;
    const high = Number((Math.max(open, close) + spread).toFixed(2));
    const low = Number((Math.min(open, close) - spread * 0.82).toFixed(2));
    previousClose = close;

    return {
      time: (START_TIME + index * 900) as UTCTimestamp,
      open,
      high,
      low,
      close,
    };
  });
}

const probabilityCandles = createProbabilityCandles();

type ProbabilityChartProps = {
  className?: string;
  /** candles = 叙事版；area = 预测市场产品的概率面积图形态 */
  variant?: "candles" | "area";
};

export function ProbabilityChart({ className, variant = "candles" }: ProbabilityChartProps) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const chart = createChart(host, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#71847f",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        fontSize: 10,
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: "rgba(90, 127, 119, 0.11)" },
        horzLines: { color: "rgba(90, 127, 119, 0.13)" },
      },
      crosshair: {
        mode: CrosshairMode.Magnet,
        vertLine: {
          color: "rgba(154, 231, 214, 0.34)",
          labelBackgroundColor: "#10302a",
        },
        horzLine: {
          color: "rgba(154, 231, 214, 0.24)",
          labelBackgroundColor: "#10302a",
        },
      },
      rightPriceScale: {
        borderColor: "rgba(97, 136, 127, 0.22)",
        scaleMargins: { top: 0.12, bottom: 0.12 },
      },
      timeScale: {
        borderColor: "rgba(97, 136, 127, 0.22)",
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 3,
        barSpacing: 10,
      },
      handleScroll: false,
      handleScale: false,
      localization: {
        priceFormatter: (price: number) => `${price.toFixed(1)}%`,
      },
    });

    const series =
      variant === "area"
        ? chart.addSeries(AreaSeries, {
            lineColor: "#08dfb5",
            lineWidth: 2,
            topColor: "rgba(8, 223, 181, 0.22)",
            bottomColor: "rgba(8, 223, 181, 0)",
            priceLineColor: "rgba(8, 223, 181, 0.36)",
            priceLineWidth: 1,
            lastValueVisible: true,
            crosshairMarkerRadius: 4,
          })
        : chart.addSeries(CandlestickSeries, {
            upColor: "#0ed5b0",
            downColor: "#d76063",
            borderVisible: false,
            wickUpColor: "#65e4ca",
            wickDownColor: "#dd7b7d",
            priceLineColor: "rgba(8, 223, 181, 0.36)",
            priceLineWidth: 1,
            lastValueVisible: true,
          });
    if (variant === "area") {
      series.setData(
        probabilityCandles.map((candle) => ({ time: candle.time, value: candle.close })),
      );
    } else {
      series.setData(probabilityCandles);
    }

    // 信号事件锚定到真实时间轴：证据不是漂浮标签，而是时间序列上的事件。
    const evidenceMarkers: SeriesMarker<Time>[] = fedRateMarketFixture.evidence.map(
      (item, index) => {
        const candleIndex = Math.round(
          ((EVENT_POSITIONS[index]?.left ?? 84) / 100) * (probabilityCandles.length - 1),
        );
        return {
          time: probabilityCandles[candleIndex].time,
          position: "belowBar",
          shape: "circle",
          size: 0.6,
          color: EVENT_TONE_COLORS[item.tone] ?? "#91aaa4",
        };
      },
    );
    evidenceMarkers.push({
      time: probabilityCandles[STRATEGY_TRIGGER_INDEX].time,
      position: "aboveBar",
      shape: "arrowDown",
      size: 1,
      color: "#08dfb5",
      text: "AUTO",
    });
    const markers = createSeriesMarkers(series, evidenceMarkers);
    chart.timeScale().fitContent();

    return () => {
      markers.detach();
      chart.remove();
    };
  }, [variant]);

  return <div ref={hostRef} className={className} />;
}
