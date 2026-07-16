"use client";

import { BrainCircuit, Check, CircleDot } from "lucide-react";
import type { CSSProperties } from "react";

import type { TradeMemoryEvent } from "@/components/product-demo/market-demo.types";

import { MEMORY_DOMAINS } from "./memory-demo.fixture";
import styles from "./memory-demo.module.css";
import type { MemoryDomain, MemoryDomainId } from "./memory-demo.types";

type MemoryOverlayProps = {
  activeDomainId: MemoryDomainId;
  onDomainChange: (domainId: MemoryDomainId) => void;
  tradeEvent: TradeMemoryEvent | null;
};

const amountFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

function getTradeLearning(domain: MemoryDomain, event: TradeMemoryEvent | null) {
  if (!event) return "This example decision shows what SmartX would retain after execution.";
  if (domain.id === "interests") return "Rates and central-bank markets move higher in future discovery.";
  if (domain.id === "signals") return "A proof-first recommendation pattern is reinforced.";
  if (domain.id === "trading-style") return `A measured $${amountFormatter.format(event.amount)} entry records sizing preference.`;
  return "The entry is stored now; advantage is inferred only after follow-through.";
}

export function MemoryOverlay({
  activeDomainId,
  onDomainChange,
  tradeEvent,
}: MemoryOverlayProps) {
  const activeDomain =
    MEMORY_DOMAINS.find((domain) => domain.id === activeDomainId) ?? MEMORY_DOMAINS[0];
  const eventOutcome = tradeEvent?.outcome.toUpperCase() ?? "YES";
  const eventAmount = amountFormatter.format(tradeEvent?.amount ?? 1000);
  const eventPrice = tradeEvent?.price ?? 68.4;

  return (
    <section className={styles.memoryLayer} data-memory-layer aria-label="SmartX AI Memory">
      <div className={styles.memoryIntro}>
        <span>Learning system</span>
        <h2>A trade becomes memory.</h2>
        <p>Each decision changes what SmartX notices, trusts, and brings forward next.</p>
      </div>

      <div className={styles.coreAnchor} data-memory-core-anchor aria-hidden="true" />

      <aside className={styles.memoryPanel}>
        <div className={styles.eventReceipt} data-memory-receipt>
          {tradeEvent ? <Check aria-hidden="true" /> : <CircleDot aria-hidden="true" />}
          <div>
            <span>{tradeEvent ? "Decision added to Memory" : "Example memory update"}</span>
            <strong>{eventOutcome} · ${eventAmount} at {eventPrice}¢</strong>
          </div>
        </div>

        <nav className={styles.domainNav} aria-label="AI Memory dimensions">
          {MEMORY_DOMAINS.map((domain) => (
            <button
              type="button"
              aria-pressed={domain.id === activeDomainId}
              className={domain.id === activeDomainId ? styles.activeDomain : undefined}
              style={{ "--memory-color": domain.color } as CSSProperties}
              onClick={() => onDomainChange(domain.id)}
              key={domain.id}
            >
              <i aria-hidden="true" />
              <span>{domain.shortLabel}</span>
              <small>{domain.updateLabel}</small>
              <b>{domain.value}</b>
            </button>
          ))}
        </nav>

        <div
          className={styles.domainDetail}
          style={{ "--memory-color": activeDomain.color } as CSSProperties}
          aria-live="polite"
        >
          <div className={styles.detailHeading}>
            <BrainCircuit aria-hidden="true" />
            <span>{activeDomain.updateLabel}</span>
          </div>
          <h3>{activeDomain.label}</h3>
          <p>{activeDomain.summary}</p>
          <strong className={styles.learnedLine}>{getTradeLearning(activeDomain, tradeEvent)}</strong>
          <div className={styles.dimensionLine} aria-label={`${activeDomain.label} dimensions`}>
            {activeDomain.dimensions.map((dimension) => (
              <span key={dimension.id}>{dimension.label}</span>
            ))}
          </div>
        </div>
      </aside>

      <div className={styles.exitHorizon} data-memory-exit aria-hidden="true" />
    </section>
  );
}
