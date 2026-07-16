"use client";

import {
  Activity,
  ArrowUpRight,
  GitCompareArrows,
  Layers3,
  Newspaper,
  Orbit,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { useState } from "react";

import { createSmartXAppHref } from "@/lib/smartx-links";

import { MarketDemoChartView } from "./market-demo-chart-view";
import { fedRateMarketFixture } from "./market-demo.fixture";
import type { MarketDemoData, MarketEvidence } from "./market-demo.types";
import styles from "./market-demo.module.css";

type MarketDemoProps = {
  className?: string;
  data?: MarketDemoData;
};

function EvidenceIcon({ evidence }: { evidence: MarketEvidence }) {
  if (evidence.tone === "smart") return <WalletCards aria-hidden="true" />;
  if (evidence.tone === "news") return <Newspaper aria-hidden="true" />;
  if (evidence.tone === "structure") return <Layers3 aria-hidden="true" />;
  if (evidence.tone === "related") return <GitCompareArrows aria-hidden="true" />;
  return <TrendingUp aria-hidden="true" />;
}

export function MarketDemo({ className, data = fedRateMarketFixture }: MarketDemoProps) {
  const [activeEvidenceId, setActiveEvidenceId] = useState(data.evidence[0]?.id ?? "");
  const [activeRange, setActiveRange] = useState("1D");
  const activeEvidence =
    data.evidence.find((item) => item.id === activeEvidenceId) ?? data.evidence[0];

  return (
    <section className={`${styles.shell}${className ? ` ${className}` : ""}`}>
      <div className={styles.marketArtifact} data-product-frame>
        <header className={styles.header} data-product-part="header">
          <div className={styles.marketIdentity}>
            <span className={styles.marketIcon}>{data.symbol}</span>
            <div>
              <small>{data.category}</small>
              <strong>{data.question}</strong>
            </div>
          </div>
          <div className={styles.liveMarket}>
            <Activity aria-hidden="true" />
            Live market
          </div>
          <dl className={styles.marketMetrics}>
            <div>
              <dt>Probability</dt>
              <dd>{data.probability}%</dd>
            </div>
            <div>
              <dt>24h move</dt>
              <dd className={styles.positive}>+{data.probabilityDelta}</dd>
            </div>
            <div>
              <dt>Volume</dt>
              <dd>{data.volume}</dd>
            </div>
          </dl>
        </header>

        <div className={styles.chartPanel} data-product-part="chart">
          <div className={styles.chartToolbar}>
            <div>
              <span>{data.chart.label}</span>
              <strong>The latest price keeps its evidence attached</strong>
            </div>
            <nav aria-label="Chart range">
              {data.ranges.map((range) => (
                <button
                  type="button"
                  aria-pressed={activeRange === range}
                  className={activeRange === range ? styles.activeRange : undefined}
                  onClick={() => setActiveRange(range)}
                  key={range}
                >
                  {range}
                </button>
              ))}
            </nav>
          </div>
          <div className={styles.chartStage} data-product-chart>
            <MarketDemoChartView activeEvidence={activeEvidence} range={activeRange} />
            <div className={styles.latestPoint} data-latest-market-point aria-hidden="true">
              <i />
              <span>Latest</span>
              <strong>{data.probability}¢</strong>
            </div>
          </div>
        </div>

        <div className={styles.evidenceStrip} data-product-part="signals" aria-label="Market context">
          {data.evidence.map((item) => (
            <button
              type="button"
              aria-pressed={activeEvidenceId === item.id}
              className={activeEvidenceId === item.id ? styles.activeSignal : undefined}
              data-tone={item.tone}
              onClick={() => setActiveEvidenceId(item.id)}
              key={item.id}
            >
              <EvidenceIcon evidence={item} />
              <span>
                <small>{item.label}</small>
                <strong>{item.headline}</strong>
              </span>
              <time>{item.age}</time>
            </button>
          ))}
        </div>
      </div>

      <aside className={styles.tradeNarrative} data-product-part="trade">
        <div className={styles.executeIntro}>
          <span>03 / Execute</span>
          <h2>Make the trade.</h2>
          <p>
            The move becomes a price. The reasons stay attached, so conviction can become a
            position without starting the research over.
          </p>
        </div>

        <div className={styles.decisionAnchor} data-trade-receipt>
          <Orbit aria-hidden="true" />
          <div>
            <span>Context converged at the latest point</span>
            <strong>YES · {data.probability}¢</strong>
            <small>{data.evidence.length} live evidence streams remain in view</small>
          </div>
        </div>

        <div className={styles.executionLogic} aria-label="Decision path">
          <span>Movement</span>
          <i aria-hidden="true" />
          <span>Evidence</span>
          <i aria-hidden="true" />
          <strong>Position</strong>
        </div>

        <a
          className={styles.openMarket}
          href={createSmartXAppHref("market_demo_cta")}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>
            <small>Continue in SmartX</small>
            <strong>Open this market</strong>
          </span>
          <ArrowUpRight aria-hidden="true" />
        </a>
      </aside>
    </section>
  );
}
