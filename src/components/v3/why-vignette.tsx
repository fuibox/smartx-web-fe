"use client";

import { useEffect, useRef, useState } from "react";

import { fedRateMarketFixture } from "@/components/product-demo/market-demo.fixture";
import { ProbabilityChart } from "@/components/product-demo/probability-chart";

import styles from "./v3.module.css";

/**
 * MARKET 模块：概率面积图（证据 pin 钉在时间轴）+ 证据 rail——
 * 与真实产品市场详情页同构：图表在上，evidence rail 在下。
 */
export function WhyVignette() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeRange, setActiveRange] = useState("1D");
  const interactedRef = useRef(false);
  const evidence = fedRateMarketFixture.evidence;
  const activeEvidence = evidence[activeIndex];

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    const id = window.setInterval(() => {
      if (interactedRef.current) return;
      setActiveIndex((index) => (index + 1) % evidence.length);
    }, 3400);
    return () => window.clearInterval(id);
  }, [evidence.length]);

  return (
    <>
      <div className={styles.marketMeta}>
        <div>
          <small>{fedRateMarketFixture.category}</small>
          <strong>{fedRateMarketFixture.question}</strong>
        </div>
        <dl>
          <div>
            <dt>Probability</dt>
            <dd>{fedRateMarketFixture.probability}%</dd>
          </div>
          <div>
            <dt>24h move</dt>
            <dd data-positive>+{fedRateMarketFixture.probabilityDelta}</dd>
          </div>
          <div>
            <dt>Volume</dt>
            <dd>{fedRateMarketFixture.volume}</dd>
          </div>
        </dl>
      </div>

      <div className={styles.rangeRow} role="group" aria-label="Chart range">
        {fedRateMarketFixture.ranges.map((range) => (
          <button
            type="button"
            data-active={range === activeRange}
            aria-pressed={range === activeRange}
            onClick={() => setActiveRange(range)}
            key={range}
          >
            {range}
          </button>
        ))}
      </div>

      <div className={styles.chartHost}>
        <ProbabilityChart className={styles.chartCanvas} variant="area" />
      </div>

      <nav className={styles.evidenceRail} aria-label="Market evidence">
        {evidence.map((item, index) => (
          <button
            type="button"
            className={styles.evidenceChip}
            data-tone={item.tone}
            data-active={index === activeIndex}
            aria-pressed={index === activeIndex}
            onClick={() => {
              interactedRef.current = true;
              setActiveIndex(index);
            }}
            key={item.id}
          >
            <span>{item.label}</span>
            <b>{item.headline}</b>
          </button>
        ))}
      </nav>
      <p className={styles.evidenceDetail} aria-live="polite">
        <b>{activeEvidence.headline}</b>
        {activeEvidence.detail} · {activeEvidence.age}
      </p>
    </>
  );
}
