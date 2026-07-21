"use client";

import {
  Activity,
  BellRing,
  Crosshair,
  Newspaper,
  Tags,
  WalletCards,
} from "lucide-react";
import type { CSSProperties, MutableRefObject } from "react";

import { MarketInstrument } from "@/components/product-demo/market-instrument";
import { createMarketChartPaths } from "@/components/product-demo/market-demo-chart";

import styles from "./motion-lab.module.css";
import {
  STORY_EVIDENCE,
  STORY_SCROLL_VIEWPORTS,
  STORY_SIGNAL_TYPES,
  STORY_STATES,
  WHY_CONTEXT_PLACEMENTS,
} from "./story.config";

const handoffChartPaths = createMarketChartPaths();

type MotionLabNarrativeOverlayProps = {
  activeEvidenceIndex?: number;
  onEvidenceChange?: (index: number) => void;
  tradeCommitted?: boolean;
  onTradeCommit?: () => void;
  lockCopyRef?: MutableRefObject<HTMLDivElement | null>;
};

const storyLabels = {
  hero: "Start",
  signal: "Detect",
  lock: "Focus",
  inspection: "Understand",
  product: "Act",
  memory: "Learn",
} as const;


function SignalIcon({ tone }: { tone: (typeof STORY_SIGNAL_TYPES)[number]["tone"] }) {
  if (tone === "smart") return <WalletCards aria-hidden="true" />;
  if (tone === "news") return <Newspaper aria-hidden="true" />;
  if (tone === "watch") return <BellRing aria-hidden="true" />;
  return <Activity aria-hidden="true" />;
}

function EvidenceIcon({ index }: { index: number }) {
  if (index === 1) return <WalletCards aria-hidden="true" />;
  if (index === 2) return <Tags aria-hidden="true" />;
  if (index === 3) return <Newspaper aria-hidden="true" />;
  return <Activity aria-hidden="true" />;
}

function StoryProgress() {
  const moveToState = (progress: number) => {
    const root = document.querySelector<HTMLElement>("[data-integrated-narrative-root]");
    if (!root) return;

    const rootTop = window.scrollY + root.getBoundingClientRect().top;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({
      top: rootTop + window.innerHeight * STORY_SCROLL_VIEWPORTS * progress,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <nav className={styles.storyProgress} aria-label="SmartX story chapters">
      {STORY_STATES.map((state) => (
        <button
          type="button"
          data-state={state.id}
          aria-label={`Go to ${storyLabels[state.id]}`}
          onClick={() => moveToState(state.progress)}
          key={state.id}
        >
          <i aria-hidden="true" />
          <span>{storyLabels[state.id]}</span>
        </button>
      ))}
    </nav>
  );
}

export function MotionLabNarrativeOverlay({
  activeEvidenceIndex = 0,
  onEvidenceChange = () => undefined,
  tradeCommitted = false,
  onTradeCommit = () => undefined,
  lockCopyRef,
}: MotionLabNarrativeOverlayProps) {
  const resolvedEvidenceIndex = Math.min(
    Math.max(activeEvidenceIndex, 0),
    STORY_EVIDENCE.length - 1,
  );
  const activeEvidence = STORY_EVIDENCE[resolvedEvidenceIndex];

  return (
    <>
      <StoryProgress />

      <section className={`${styles.sceneCopy} ${styles.moveCopy}`} data-scene-copy data-move-copy>
        <span>Market movement</span>
        <h2>See the move.</h2>
      </section>

      <section className={styles.signalLegend} data-signal-legend aria-label="Live signal types">
        <span>What SmartX is seeing</span>
        <div>
          {STORY_SIGNAL_TYPES.map((signal) => (
            <div
              style={{ "--signal-color": signal.color } as CSSProperties}
              data-tone={signal.tone}
              key={signal.label}
            >
              <SignalIcon tone={signal.tone} />
              <span>{signal.label}</span>
              <strong>{signal.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <div ref={lockCopyRef} className={styles.lockCopy} data-scene-copy data-lock-copy>
        <Crosshair aria-hidden="true" />
        <span>Signal locked</span>
        <strong>One market worth your attention</strong>
        <small>Four independent signals converge</small>
      </div>

      <section className={`${styles.sceneCopy} ${styles.whyCopy}`} data-scene-copy data-why-copy>
        <span>Decision context</span>
        <h2>Know the why.</h2>
        <p>Four signal threads converge on one price.</p>
      </section>

      <section className={styles.evidenceExplorer} data-evidence-panel aria-label="Inspect market evidence">
        <header data-tone={activeEvidence.tone} aria-live="polite">
          <span>Why it matters · {activeEvidence.label}</span>
          <strong>{activeEvidence.headline}</strong>
          <p>{activeEvidence.detail}</p>
        </header>
        <nav aria-label="Evidence dimensions">
          {STORY_EVIDENCE.map((item, index) => (
            <button
              type="button"
              data-tone={item.tone}
              data-evidence-index={index}
              aria-pressed={index === resolvedEvidenceIndex}
              onClick={() => onEvidenceChange(index)}
              key={item.label}
            >
              <EvidenceIcon index={index} />
              <span>{item.navLabel}</span>
            </button>
          ))}
        </nav>
      </section>

      <section
        className={styles.orbitLegend}
        data-why-orbit-legend
        aria-label="Decision map"
        data-active-index={resolvedEvidenceIndex}
      >
        <div className={styles.orbitCenter}>
          <span>MARKET NODE</span>
          <strong>68.4¢</strong>
          <small>4 signals aligned</small>
        </div>

        {STORY_EVIDENCE.map((item, index) => {
          const placement = WHY_CONTEXT_PLACEMENTS[index];
          return (
            <button
              type="button"
              className={styles.orbitKey}
              data-tone={item.tone}
              data-active={index === resolvedEvidenceIndex}
              data-side={placement.side}
              aria-pressed={index === resolvedEvidenceIndex}
              onClick={() => onEvidenceChange(index)}
              style={
                { left: `${placement.left}%`, top: `${placement.top}%` } as CSSProperties
              }
              key={item.label}
            >
              <span>{item.navLabel}</span>
              <strong>{item.metric}</strong>
              <small>{item.headline}</small>
            </button>
          );
        })}
      </section>

      <svg
        className={styles.chartBridge}
        viewBox="0 0 760 320"
        preserveAspectRatio="none"
        data-chart-bridge
        aria-hidden="true"
      >
        <path d={handoffChartPaths.linePath} />
        <circle cx={handoffChartPaths.endpoint[0]} cy={handoffChartPaths.endpoint[1]} r="4" />
      </svg>

      <div className={styles.productHandoff} data-product-shell data-testid="product-handoff">
        <MarketInstrument
          activeEvidenceIndex={activeEvidenceIndex}
          committed={tradeCommitted}
          onCommit={onTradeCommit}
          onEvidenceChange={onEvidenceChange}
        />
      </div>

      <div className={styles.decisionBridge} data-decision-bridge aria-hidden="true">
        <i />
      </div>

    </>
  );
}
