"use client";

import {
  CandlestickSeries,
  ColorType,
  CrosshairMode,
  createChart,
  type CandlestickData,
  type Time,
  type UTCTimestamp,
} from "lightweight-charts";
import {
  Activity,
  Check,
  GitCompareArrows,
  Layers3,
  Newspaper,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { useEffect, useRef } from "react";

import { fedRateMarketFixture } from "./market-demo.fixture";
import type { MarketEvidence } from "./market-demo.types";
import styles from "./market-instrument.module.css";

type MarketInstrumentProps = {
  activeEvidenceIndex: number;
  committed: boolean;
  onCommit: () => void;
  onEvidenceChange: (index: number) => void;
};

const START_TIME = Date.UTC(2026, 6, 14, 5, 0, 0) / 1000;
const EVENT_POSITIONS = [
  { left: 19, top: 66 },
  { left: 38, top: 49 },
  { left: 54, top: 58 },
  { left: 69, top: 31 },
  { left: 84, top: 24 },
] as const;

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

function EvidenceIcon({ evidence }: { evidence: MarketEvidence }) {
  if (evidence.tone === "smart") return <WalletCards aria-hidden="true" />;
  if (evidence.tone === "news") return <Newspaper aria-hidden="true" />;
  if (evidence.tone === "structure") return <Layers3 aria-hidden="true" />;
  if (evidence.tone === "related") return <GitCompareArrows aria-hidden="true" />;
  return <TrendingUp aria-hidden="true" />;
}

function ProbabilityChart() {
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

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#0ed5b0",
      downColor: "#d76063",
      borderVisible: false,
      wickUpColor: "#65e4ca",
      wickDownColor: "#dd7b7d",
      priceLineColor: "rgba(8, 223, 181, 0.36)",
      priceLineWidth: 1,
      lastValueVisible: true,
    });
    series.setData(probabilityCandles);
    chart.timeScale().fitContent();

    return () => chart.remove();
  }, []);

  return <div ref={hostRef} className={styles.chartCanvas} />;
}

export function MarketInstrument({
  activeEvidenceIndex,
  committed,
  onCommit,
  onEvidenceChange,
}: MarketInstrumentProps) {
  const evidence = fedRateMarketFixture.evidence;
  const resolvedIndex = Math.min(Math.max(activeEvidenceIndex, 0), evidence.length - 1);
  const activeEvidence = evidence[resolvedIndex];

  return (
    <section className={styles.shell} data-product-frame aria-label="SmartX market instrument">
      <div className={styles.instrument} data-product-part="instrument">
        <header className={styles.marketHeader}>
          <div className={styles.marketIdentity}>
            <span>{fedRateMarketFixture.symbol}</span>
            <div>
              <small>{fedRateMarketFixture.category}</small>
              <strong>{fedRateMarketFixture.question}</strong>
            </div>
          </div>
          <dl>
            <div>
              <dt>Probability</dt>
              <dd>{fedRateMarketFixture.probability}%</dd>
            </div>
            <div>
              <dt>24h move</dt>
              <dd className={styles.positive}>+{fedRateMarketFixture.probabilityDelta}</dd>
            </div>
            <div>
              <dt>Volume</dt>
              <dd>{fedRateMarketFixture.volume}</dd>
            </div>
          </dl>
        </header>

        <div className={styles.chartStage} data-product-chart>
          <div className={styles.chartLabel}>
            <span>YES probability</span>
            <strong>Evidence stays attached to price</strong>
          </div>
          <ProbabilityChart />
          <div className={styles.eventLayer} aria-label="Events on the market chart">
            {evidence.map((item, index) => {
              const position = EVENT_POSITIONS[index] ?? EVENT_POSITIONS[EVENT_POSITIONS.length - 1];
              const active = index === resolvedIndex;

              return (
                <button
                  type="button"
                  className={active ? styles.activeEvent : undefined}
                  data-tone={item.tone}
                  style={{ left: `${position.left}%`, top: `${position.top}%` }}
                  aria-label={`${item.label}: ${item.headline}`}
                  aria-pressed={active}
                  onClick={() => onEvidenceChange(index)}
                  key={item.id}
                >
                  <i aria-hidden="true" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          <div className={styles.latestPoint} aria-hidden="true">
            <i />
            <span>Decision point</span>
            <strong>{fedRateMarketFixture.probability}¢</strong>
          </div>
        </div>

        <nav className={styles.evidenceRail} aria-label="Market evidence">
          {evidence.map((item, index) => (
            <button
              type="button"
              className={index === resolvedIndex ? styles.activeEvidence : undefined}
              data-tone={item.tone}
              aria-pressed={index === resolvedIndex}
              onClick={() => onEvidenceChange(index)}
              key={item.id}
            >
              <EvidenceIcon evidence={item} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <aside className={styles.decision} data-product-part="narrative">
        <div className={styles.decisionIntro}>
          <span>Context converged</span>
          <h2>Make the trade.</h2>
          <p>One market. Five evidence threads. One measured decision.</p>
        </div>

        <div className={styles.activeReadout} data-tone={activeEvidence.tone} aria-live="polite">
          <div>
            <EvidenceIcon evidence={activeEvidence} />
            <span>{activeEvidence.label}</span>
            <time>{activeEvidence.age}</time>
          </div>
          <strong>{activeEvidence.headline}</strong>
          <p>{activeEvidence.detail}</p>
        </div>

        <div className={styles.positionSummary}>
          <span>Selected position</span>
          <strong>YES · {fedRateMarketFixture.probability}¢</strong>
          <small>$1,000 measured entry</small>
        </div>

        <button
          type="button"
          className={`${styles.tradeAction}${committed ? ` ${styles.tradeCommitted}` : ""}`}
          aria-pressed={committed}
          onClick={onCommit}
        >
          <i className={styles.tradeNode} data-trade-node aria-hidden="true">
            {committed ? <Check /> : null}
          </i>
          <span>
            <small>{committed ? "Added to AI Memory" : "Preview execution"}</small>
            <strong>{committed ? "Trade recorded" : "Take position"}</strong>
          </span>
          <Activity aria-hidden="true" />
        </button>
      </aside>
    </section>
  );
}
