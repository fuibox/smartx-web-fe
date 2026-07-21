"use client";

import {
  Activity,
  Check,
  GitCompareArrows,
  Layers3,
  Newspaper,
  TrendingUp,
  WalletCards,
} from "lucide-react";

import { fedRateMarketFixture } from "./market-demo.fixture";
import type { MarketEvidence } from "./market-demo.types";
import { EVENT_POSITIONS, ProbabilityChart } from "./probability-chart";
import styles from "./market-instrument.module.css";

type MarketInstrumentProps = {
  activeEvidenceIndex: number;
  committed: boolean;
  onCommit: () => void;
  onEvidenceChange: (index: number) => void;
};

function EvidenceIcon({ evidence }: { evidence: MarketEvidence }) {
  if (evidence.tone === "smart") return <WalletCards aria-hidden="true" />;
  if (evidence.tone === "news") return <Newspaper aria-hidden="true" />;
  if (evidence.tone === "structure") return <Layers3 aria-hidden="true" />;
  if (evidence.tone === "related") return <GitCompareArrows aria-hidden="true" />;
  return <TrendingUp aria-hidden="true" />;
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
          <ProbabilityChart className={styles.chartCanvas} />
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

        <div className={styles.strategyCard} aria-label="Automation strategy">
          <header>
            <span>Automation</span>
            <b>Triggered · 2m ago</b>
          </header>
          <p className={styles.strategyRule}>
            <code>IF</code> Smart money net flow ≥ $2M / 10m
            <code>AND</code> YES &lt; 70¢
            <code>THEN</code> Buy YES $1,000
          </p>
          <div className={styles.strategyMeta}>
            <svg viewBox="0 0 96 26" aria-hidden="true">
              <polyline points="0,20 12,18 22,19 32,15 44,16 54,11 66,12 78,7 88,8 96,4" />
            </svg>
            <div>
              <strong>+18.4%</strong>
              <span>30d simulated</span>
            </div>
          </div>
          <div className={styles.copyTradeRow}>
            <WalletCards aria-hidden="true" />
            <span>Mirror 9 macro-specialist wallets</span>
            <b>Coming</b>
          </div>
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
