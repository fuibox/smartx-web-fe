"use client";

import {
  CandlestickSeries,
  ColorType,
  createChart,
  HistogramSeries,
  type CandlestickData,
  type HistogramData,
  type IChartApi,
  type Time,
  type UTCTimestamp,
} from "lightweight-charts";
import {
  ArrowUpRight,
  ChartCandlestick,
  CircleCheck,
  Crosshair,
  Landmark,
  Radio,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

type Stage = "detect" | "verify" | "execute";

const candleRows: Array<[string, number, number, number, number]> = [
  ["2026-07-01", 57_940, 58_420, 57_630, 58_160],
  ["2026-07-02", 58_160, 58_860, 57_980, 58_720],
  ["2026-07-03", 58_720, 59_060, 58_310, 58_510],
  ["2026-07-04", 58_510, 59_220, 58_400, 59_040],
  ["2026-07-05", 59_040, 59_620, 58_760, 59_410],
  ["2026-07-06", 59_410, 59_780, 58_920, 59_080],
  ["2026-07-07", 59_080, 59_940, 58_970, 59_760],
  ["2026-07-08", 59_760, 60_420, 59_530, 60_230],
  ["2026-07-09", 60_230, 60_760, 59_920, 60_570],
  ["2026-07-10", 60_570, 61_040, 60_260, 60_840],
  ["2026-07-11", 60_840, 61_520, 60_610, 61_340],
  ["2026-07-12", 61_340, 61_740, 60_960, 61_110],
  ["2026-07-13", 61_110, 61_590, 60_880, 61_420],
  ["2026-07-14", 61_420, 62_080, 61_170, 61_880],
];

const candles: CandlestickData<Time>[] = candleRows.map(
  ([time, open, high, low, close]) => ({
  time: (Date.parse(`${time}T00:00:00Z`) / 1000) as UTCTimestamp,
  open,
  high,
  low,
  close,
  }),
);

const volumes: HistogramData<Time>[] = candles.map((candle, index) => ({
  time: candle.time,
  value: 230 + index * 34 + (index % 4) * 82,
  color:
    candle.close >= candle.open
      ? "rgba(8, 223, 181, 0.36)"
      : "rgba(255, 93, 96, 0.34)",
}));

const stageCopy: Record<Stage, { eyebrow: string; value: string }> = {
  detect: { eyebrow: "Breakout above", value: "$61,800" },
  verify: { eyebrow: "Smart money flow", value: "+217.4K BTC" },
  execute: { eyebrow: "Execution route", value: "Buy 61.8K" },
};

function TradingChart({ stage }: { stage: Stage }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const chart = createChart(container, {
      width: container.clientWidth,
      height: container.clientHeight,
      layout: {
        background: { type: ColorType.Solid, color: "#050b0b" },
        textColor: "#657a75",
        fontFamily: "JetBrainsMono, monospace",
        fontSize: 11,
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: "rgba(85, 119, 110, 0.12)" },
        horzLines: { color: "rgba(85, 119, 110, 0.12)" },
      },
      crosshair: {
        vertLine: { color: "rgba(154, 231, 214, 0.32)", width: 1 },
        horzLine: { color: "rgba(154, 231, 214, 0.2)", width: 1 },
      },
      rightPriceScale: {
        borderColor: "rgba(99, 213, 189, 0.16)",
        scaleMargins: { top: 0.1, bottom: 0.22 },
      },
      timeScale: {
        borderColor: "rgba(99, 213, 189, 0.16)",
        timeVisible: false,
        rightOffset: 0.8,
      },
      handleScale: true,
      handleScroll: true,
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#08dfb5",
      downColor: "#ff5d60",
      borderVisible: false,
      wickUpColor: "#5ce8cb",
      wickDownColor: "#ff7779",
      priceLineVisible: true,
      priceLineColor: "rgba(255, 93, 96, 0.7)",
    });
    candleSeries.setData(candles);

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "",
      lastValueVisible: false,
      priceLineVisible: false,
    });
    volumeSeries.setData(volumes);
    volumeSeries.priceScale().applyOptions({
      scaleMargins: { top: 0.82, bottom: 0 },
    });

    chart.timeScale().fitContent();
    chartRef.current = chart;

    const observer = new ResizeObserver(([entry]) => {
      chart.applyOptions({
        width: Math.floor(entry.contentRect.width),
        height: Math.floor(entry.contentRect.height),
      });
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
    };
  }, []);

  return (
    <div className="chart-area" data-stage={stage}>
      <div ref={containerRef} className="chart-canvas" aria-hidden="true" />
      <div className="chart-focus" aria-hidden="true">
        <span />
      </div>
    </div>
  );
}

export function TradingStory() {
  const [stage, setStage] = useState<Stage>("execute");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("1000");
  const [previewReady, setPreviewReady] = useState(false);

  function submitPreview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStage("execute");
    setPreviewReady(true);
  }

  return (
    <section
      className="product-story content-frame"
      id="product"
      aria-labelledby="product-story-title"
      data-reveal-section
    >
      <h2 className="sr-only" id="product-story-title">
        From signal detection to trade execution
      </h2>
      <div className="product-story__route" aria-label="Product story stages">
        <button
          type="button"
          className={stage === "detect" ? "is-active" : ""}
          onClick={() => {
            setStage("detect");
            setPreviewReady(false);
          }}
        >
          <Radio aria-hidden="true" />
          Detect
        </button>
        <button
          type="button"
          className={stage === "verify" ? "is-active" : ""}
          onClick={() => {
            setStage("verify");
            setPreviewReady(false);
          }}
        >
          <ShieldCheck aria-hidden="true" />
          Verify
        </button>
        <button
          type="button"
          className={stage === "execute" ? "is-active" : ""}
          onClick={() => setStage("execute")}
        >
          <Zap aria-hidden="true" />
          Execute
        </button>
      </div>

      <div className="terminal-stage">
        <header className="terminal-stage__header">
          <div className="market-identity">
            <span className="market-identity__asset">B</span>
            <strong>BTC / USD</strong>
            <span>Prediction market</span>
          </div>
          <div className="market-live">
            <span className="status-dot" aria-hidden="true" />
            Live
            <time dateTime="2026-07-14T11:29:44Z">11:29:44</time>
          </div>
        </header>

        <div className="terminal-stage__body">
          <div className="market-chart">
            <div className="market-chart__meta">
              <div>
                <span>BTC / USD</span>
                <strong>$61,880</strong>
              </div>
              <span className="positive">+1.37%</span>
            </div>
            <TradingChart stage={stage} />
          </div>

          <div className="evidence-stack">
            <button
              type="button"
              className={`evidence-card ${stage === "detect" ? "is-active" : ""}`}
              onClick={() => setStage("detect")}
            >
              <span className="evidence-card__index">01</span>
              <Crosshair aria-hidden="true" />
              <span>
                <small>Detect</small>
                <strong>Breakout above $61,800</strong>
              </span>
              <ArrowUpRight aria-hidden="true" />
            </button>

            <button
              type="button"
              className={`evidence-card ${stage === "verify" ? "is-active" : ""}`}
              onClick={() => setStage("verify")}
            >
              <span className="evidence-card__index">02</span>
              <Landmark aria-hidden="true" />
              <span>
                <small>Verify</small>
                <strong>Smart money +217.4K</strong>
              </span>
              <ShieldCheck aria-hidden="true" />
            </button>

            <div className="stage-readout" aria-live="polite">
              <span>{stageCopy[stage].eyebrow}</span>
              <strong>{stageCopy[stage].value}</strong>
            </div>
          </div>

          <form className="trade-ticket" onSubmit={submitPreview}>
            <div className="trade-ticket__title">
              <span className="evidence-card__index">03</span>
              <span>Execute</span>
              <ChartCandlestick aria-hidden="true" />
            </div>

            <div className="trade-side" aria-label="Trade side">
              <button
                type="button"
                className={side === "buy" ? "is-active" : ""}
                onClick={() => {
                  setSide("buy");
                  setPreviewReady(false);
                }}
              >
                Buy
              </button>
              <button
                type="button"
                className={side === "sell" ? "is-active" : ""}
                onClick={() => {
                  setSide("sell");
                  setPreviewReady(false);
                }}
              >
                Sell
              </button>
            </div>

            <label className="trade-field">
              <span>Amount (USD)</span>
              <input
                type="number"
                min="10"
                step="10"
                value={amount}
                onChange={(event) => {
                  setAmount(event.target.value);
                  setPreviewReady(false);
                }}
              />
            </label>

            <dl className="trade-summary">
              <div>
                <dt>Entry price</dt>
                <dd>61.8K</dd>
              </div>
              <div>
                <dt>Est. position</dt>
                <dd>{amount ? `$${Number(amount).toLocaleString()}` : "$0"}</dd>
              </div>
            </dl>

            <button className="trade-submit" type="submit">
              {previewReady ? (
                <>
                  <CircleCheck aria-hidden="true" />
                  Preview ready
                </>
              ) : (
                <>
                  Preview {side} order
                  <ArrowUpRight aria-hidden="true" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
