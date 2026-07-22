"use client";

import Image from "next/image";
import {
  IoBatteryFull,
  IoCellular,
  IoWifi,
} from "react-icons/io5";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";

import { MEMORY_DOMAINS } from "@/components/memory-demo/memory-demo.fixture";
import type { MemoryDomainId } from "@/components/memory-demo/memory-demo.types";
import { createSmartXAppHref } from "@/lib/smartx-links";

import { ClosingFlowField } from "./closing-field";
import { EvidenceStage, type StageState } from "./evidence-stage";
import { FooterWordmark } from "./footer-wordmark";
import styles from "./story-page.module.css";

const CHAPTERS: Array<{
  id: StageState;
  number: string;
  name: string;
  outcome: string;
  evidence: string;
  href: string;
}> = [
  {
    id: "signals",
    number: "01",
    name: "Signals",
    outcome: "Find what matters before it becomes obvious.",
    evidence: "WALLET · MARKET · WATCHLIST",
    href: "#v4-signals",
  },
  {
    id: "execute",
    number: "02",
    name: "Execute",
    outcome: "Act without leaving the evidence behind.",
    evidence: "ALERT → ORDER → FOLLOW",
    href: "#v4-execute",
  },
  {
    id: "learn",
    number: "03",
    name: "Learn",
    outcome: "Let every decision sharpen what comes next.",
    evidence: "DECISION → USER MODEL → NEXT RANK",
    href: "#v4-learn",
  },
  {
    id: "allinone",
    number: "04",
    name: "All-in-one",
    outcome: "Carry the same intelligence across markets.",
    evidence: "LIVE ON POLYMARKET · FIVE NEXT",
    href: "#v4-venues",
  },
];

const SIGNAL_SOURCES = [
  {
    id: "smart-money",
    label: "Smart money",
    capture: "/assets/h5/smart-money-labels@2x.png",
    captureWidth: 780,
    captureHeight: 1688,
    captureAlt: "SmartX Smart Money list with trader labels and performance history",
    eyebrow: "Trader intelligence",
    headline: "Know why a wallet matters—not only what it earned.",
    detail: "Representative labels reveal the dimensions SmartX reads across every wallet.",
    points: [
      {
        label: "Expertise",
        value: "Sports expert · Crypto specialist · Politics",
        tone: "expert",
      },
      {
        label: "Trading style",
        value: "Swing trader · Short-term · Patient holder",
        tone: "trading",
      },
      {
        label: "Track record",
        value: "Whale · Steady winner · PnL milestone",
        tone: "status",
      },
    ],
    more: "Examples shown. The taxonomy continues across expertise, behavior, and performance.",
  },
  {
    id: "market",
    label: "Market",
    capture: "/assets/h5/market-signals@2x.png",
    captureWidth: 780,
    captureHeight: 1688,
    captureAlt: "SmartX market list with live market signal labels",
    eyebrow: "Market event taxonomy",
    headline: "See what changed before the price alone can explain it.",
    detail: "Representative event labels explain what changed—not only that price moved.",
    points: [
      { label: "Momentum", value: "Fast Move · Volume Surge", tone: "trading" },
      { label: "Flow", value: "Big Orders · Smart Money", tone: "behavior" },
      { label: "Positioning", value: "OI Build Up · Illiquid", tone: "expert" },
    ],
    more: "More event types extend the same momentum, flow, and positioning dimensions.",
  },
  {
    id: "watchlist",
    label: "Watchlist",
    capture: "/assets/h5/watchlist-alert.png",
    captureWidth: 390,
    captureHeight: 844,
    captureAlt: "SmartX Watchlist create alert panel with configurable triggers",
    eyebrow: "Your rules, always watching",
    headline: "Define the exact condition that should bring you back.",
    detail: "Set rules on a market, a metric, or a tracked wallet—then let SmartX monitor it.",
    points: [
      { label: "Metric move", value: "OI or Volume · 1h / 6h threshold", tone: "expert" },
      { label: "Price", value: "YES / NO moves above or below your price", tone: "status" },
      { label: "Radar signals", value: "Fast Move or Smart Money appears", tone: "behavior" },
      { label: "Wallet flow", value: "Tracked wallet buys ≥ your chosen amount", tone: "trading" },
    ],
    more: "Combine market, signal, and wallet conditions around the way you trade.",
  },
] as const;

type SignalSource = (typeof SIGNAL_SOURCES)[number];

const EXECUTE_CAPTURE = {
  src: "/assets/h5/execute@2x.png",
  width: 780,
  height: 1688,
  alt: "SmartX mobile market trade ticket with outcome, amount, and order controls",
} as const;

const EXECUTION_PATHS = [
  {
    id: "recall",
    label: "Recall & trade",
    eyebrow: "SIGNALS · ALERTS · TELEGRAM",
    headline: "The right moment brings you back.",
    detail:
      "Open the exact market and evidence from a SmartX signal, an alert you configured, or—in a future release—Telegram.",
    items: [
      { label: "SmartX signal", detail: "Evidence opens with the market" },
      { label: "Your alert", detail: "Price, OI, volume, or wallet rule" },
      { label: "Telegram", detail: "Trade from the notification · Coming" },
    ],
  },
  {
    id: "follow",
    label: "Strategy follow",
    eyebrow: "MARKET · SMART MONEY · WATCHLIST",
    headline: "Turn a trusted signal into a rule.",
    detail:
      "Keep a follow strategy in Watchlist and let a market event or tracked wallet become the trigger for the next trade.",
    items: [
      { label: "Market signals", detail: "Follow a selected event taxonomy" },
      { label: "Smart Money", detail: "Follow wallets and evidence you trust" },
      { label: "Watchlist strategy", detail: "Keep the trigger visible and editable" },
    ],
  },
] as const;

type ExecutionPath = (typeof EXECUTION_PATHS)[number];

const VENUES = [
  {
    id: "polymarket",
    name: "Polymarket",
    category: "Prediction markets",
    logo: "/assets/venues/polymarket.svg",
    logoWidth: 512,
    logoHeight: 512,
    live: true,
  },
  {
    id: "predict",
    name: "Predict.fun",
    category: "Prediction markets",
    logo: "/assets/venues/predict-fun.png",
    logoWidth: 400,
    logoHeight: 400,
    live: false,
  },
  {
    id: "hyperliquid",
    name: "Hyperliquid",
    category: "Perpetuals",
    logo: "/assets/venues/hyperliquid.png",
    logoWidth: 180,
    logoHeight: 180,
    live: false,
  },
  {
    id: "aster",
    name: "Aster",
    category: "Perpetuals",
    logo: "/assets/venues/aster.svg",
    logoWidth: 121,
    logoHeight: 32,
    live: false,
  },
  {
    id: "bstocks",
    name: "bStocks",
    category: "Onchain stocks",
    logo: "/assets/venues/bstocks.svg",
    logoWidth: 64,
    logoHeight: 64,
    live: false,
  },
  {
    id: "ondo",
    name: "Ondo GM",
    category: "Tokenized markets",
    logo: "/assets/venues/ondo.png",
    logoWidth: 400,
    logoHeight: 400,
    live: false,
  },
] as const;

const MEMORY_CHANGES: Record<
  MemoryDomainId,
  { change: string; status: "Updated" | "Recorded" | "Pending" }
> = {
  interests: { change: "Macro moved up", status: "Updated" },
  signals: { change: "Smart money reinforced", status: "Updated" },
  "trading-style": { change: "Research-first behavior", status: "Recorded" },
  edge: { change: "Wait for the outcome", status: "Pending" },
};

const UPDATE_STORIES = [
  {
    category: "Product",
    date: "Jul 22, 2026",
    dateTime: "2026-07-22",
    title: "Building the AI trading terminal around you",
    excerpt: "Why signals, execution, and Memory belong in one continuous system.",
  },
  {
    category: "Intelligence",
    date: "Jul 15, 2026",
    dateTime: "2026-07-15",
    title: "From signal discovery to trade action",
    excerpt: "How SmartX carries the original evidence from discovery into the order.",
  },
  {
    category: "Company",
    date: "Jul 08, 2026",
    dateTime: "2026-07-08",
    title: "What we are building next",
    excerpt: "The markets and intelligence layers that extend the SmartX terminal.",
  },
] as const;

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function smoothstep(start: number, end: number, value: number) {
  const progress = clamp01((value - start) / (end - start));
  return progress * progress * (3 - 2 * progress);
}

function useReveal<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function StoryIndex() {
  const [activeChapter, setActiveChapter] = useState<StageState | null>(null);
  const [motionChapter, setMotionChapter] = useState<StageState | null>(null);
  const { ref, visible } = useReveal<HTMLElement>(0.18);

  return (
    <section
      ref={ref}
      id="v4-index"
      className={styles.index}
      data-visible={visible}
      aria-labelledby="v4-index-title"
    >
      <div className={styles.indexCurtain} aria-hidden="true" />
      <div className={styles.indexInner}>
        <div className={styles.indexThesis}>
          <p className={styles.kicker}>The system / 00</p>
          <h2 id="v4-index-title">
            Built around
            <br />
            how you trade.
          </h2>
          <p>
            SmartX connects what you notice, how you act, and what it learns—so the
            terminal becomes more personal with every decision.
          </p>
        </div>

        <div className={styles.indexDirectory}>
          <nav
            className={styles.chapterGrid}
            data-has-active={activeChapter !== null}
            aria-label="Product chapters"
          >
            {CHAPTERS.map((chapter) => (
              <a
                className={styles.chapterCell}
                data-active={chapter.id === activeChapter}
                data-dimmed={activeChapter !== null && chapter.id !== activeChapter}
                href={chapter.href}
                onMouseEnter={() => {
                  setActiveChapter(chapter.id);
                  setMotionChapter(chapter.id);
                }}
                onMouseLeave={() => {
                  setActiveChapter(null);
                  setMotionChapter(null);
                }}
                onFocus={(event) => {
                  setActiveChapter(chapter.id);
                  setMotionChapter(
                    event.currentTarget.matches(":focus-visible") ? null : chapter.id,
                  );
                }}
                onBlur={() => {
                  setActiveChapter(null);
                  setMotionChapter(null);
                }}
                key={chapter.id}
              >
                <span className={styles.chapterStage} aria-hidden="true">
                  <EvidenceStage
                    state={chapter.id}
                    className={styles.chapterStageCanvas}
                    showLabels={false}
                    motion={
                      visible &&
                      chapter.id === activeChapter &&
                      motionChapter === chapter.id
                    }
                  />
                </span>
                <span className={styles.chapterNumber}>{chapter.number}</span>
                <span className={styles.chapterCopy}>
                  <strong>{chapter.name}</strong>
                  <small>{chapter.outcome}</small>
                </span>
                <span className={styles.chapterEvidence}>{chapter.evidence}</span>
                <span className={styles.chapterArrow} aria-hidden="true">
                  ↘
                </span>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </section>
  );
}

function SignalTabs({
  activeSource,
  onChange,
}: {
  activeSource: SignalSource;
  onChange: (source: SignalSource) => void;
}) {
  return (
    <div className={styles.signalTabs} aria-label="Signal sources">
      {SIGNAL_SOURCES.map((source, index) => (
        <button
          type="button"
          aria-pressed={activeSource.id === source.id}
          onClick={() => onChange(source)}
          key={source.id}
        >
          <span>{String(index + 1).padStart(2, "0")}</span>
          <strong>{source.label}</strong>
          <i aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}

function SignalReadout({ source }: { source: SignalSource }) {
  return (
    <div className={styles.sourceReadout} aria-live="polite">
      <span>{source.eyebrow}</span>
      <strong>{source.headline}</strong>
      <small>{source.detail}</small>
      <ul>
        {source.points.map((point) => (
          <li data-tone={point.tone} key={point.label}>
            <span>{point.label}</span>
            <strong>{point.value}</strong>
          </li>
        ))}
      </ul>
      <p className={styles.sourceMore}>+ {source.more}</p>
    </div>
  );
}

function ExecutionReadout({
  path,
  onChange,
}: {
  path: ExecutionPath;
  onChange: (path: ExecutionPath) => void;
}) {
  return (
    <div className={styles.executePaths}>
      <div className={styles.executePathTabs} aria-label="Execution paths">
        {EXECUTION_PATHS.map((candidate, index) => (
          <button
            type="button"
            aria-pressed={candidate.id === path.id}
            onClick={() => onChange(candidate)}
            key={candidate.id}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{candidate.label}</strong>
          </button>
        ))}
      </div>
      <div className={styles.executePathReadout} aria-live="polite">
        <span>{path.eyebrow}</span>
        <strong>{path.headline}</strong>
        <small>{path.detail}</small>
        <ul>
          {path.items.map((item) => (
            <li key={item.label}>
              <strong>{item.label}</strong>
              <span>{item.detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ProductPhone({
  source,
  executionActive,
  executionPath,
  className,
  style,
}: {
  source: SignalSource;
  executionActive: boolean;
  executionPath: ExecutionPath;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`${styles.productPhone} ${className ?? ""}`}
      data-execution={executionActive}
      style={style}
      aria-label={executionActive ? "SmartX execution screen example" : "SmartX signal screen example"}
    >
      <i className={styles.phoneVolumeButton} aria-hidden="true" />
      <i className={styles.phonePowerButton} aria-hidden="true" />
      <div className={styles.phoneScreen}>
        <div className={styles.phoneStatusBar} aria-hidden="true">
          <time>9:42</time>
          <span className={styles.dynamicIsland}><i /></span>
          <span className={styles.phoneStatusIcons}>
            <IoCellular aria-hidden="true" />
            <IoWifi aria-hidden="true" />
            <IoBatteryFull aria-hidden="true" />
          </span>
        </div>

        <div
          className={styles.phoneSignalView}
          data-source={source.id}
          aria-hidden={executionActive}
        >
          <Image
            key={source.capture}
            className={styles.phoneCapture}
            src={source.capture}
            alt={source.captureAlt}
            width={source.captureWidth}
            height={source.captureHeight}
            sizes="(max-width: 979px) 350px, 26vw"
            draggable={false}
            unoptimized
          />
        </div>

        <div
          className={styles.phoneExecuteView}
          data-path={executionPath.id}
          aria-hidden={!executionActive}
        >
          <Image
            className={`${styles.phoneCapture} ${styles.phoneExecuteCapture}`}
            src={EXECUTE_CAPTURE.src}
            alt={EXECUTE_CAPTURE.alt}
            width={EXECUTE_CAPTURE.width}
            height={EXECUTE_CAPTURE.height}
            sizes="(max-width: 979px) 350px, 26vw"
            draggable={false}
            unoptimized
          />
        </div>

        <div className={styles.phoneSceneLabel} data-visible={executionActive} aria-hidden="true">
          <span>
            {executionPath.id === "recall"
              ? "ENTRY / SIGNAL ALERT"
              : "FOLLOW / WATCHLIST RULE"}
          </span>
          <i />
        </div>

        <i className={styles.phoneHomeIndicator} aria-hidden="true" />
      </div>
    </div>
  );
}

function JourneyCopy({
  kind,
  source,
  onSourceChange,
  executionPath,
  onExecutionPathChange,
  elementRef,
}: {
  kind: "signals" | "execute";
  source: SignalSource;
  onSourceChange: (source: SignalSource) => void;
  executionPath: ExecutionPath;
  onExecutionPathChange: (path: ExecutionPath) => void;
  elementRef?: RefObject<HTMLDivElement | null>;
}) {
  if (kind === "signals") {
    return (
      <div ref={elementRef} className={`${styles.journeyCopy} ${styles.signalsCopy}`}>
        <p className={styles.kicker}>01 / Signals</p>
        <h2 id="v4-signals-title">
          Signals, before
          <br />
          the crowd.
        </h2>
        <p>
          SmartX brings market movement, proven wallet activity, and the markets you
          follow into one evidence-backed signal.
        </p>
        <SignalTabs activeSource={source} onChange={onSourceChange} />
        <SignalReadout source={source} />
      </div>
    );
  }

  return (
    <div ref={elementRef} className={`${styles.journeyCopy} ${styles.executeCopy}`}>
      <p className={styles.kicker}>02 / Execute</p>
      <h2 id="v4-execute-title">
        From signal to action,
        <br />
        your way.
      </h2>
      <p>
        Return through a signal or alert, trade with its evidence still attached, or
        let a watchlisted strategy follow the market or wallets you trust.
      </p>
      <ExecutionReadout path={executionPath} onChange={onExecutionPathChange} />
    </div>
  );
}

function TradingJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const signalsCopyRef = useRef<HTMLDivElement>(null);
  const executeCopyRef = useRef<HTMLDivElement>(null);
  const [source, setSource] = useState<SignalSource>(SIGNAL_SOURCES[0]);
  const [executionPath, setExecutionPath] = useState<ExecutionPath>(EXECUTION_PATHS[0]);
  const [executionActive, setExecutionActive] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const phone = phoneRef.current;
    const signalsCopy = signalsCopyRef.current;
    const executeCopy = executeCopyRef.current;
    if (!section || !phone || !signalsCopy || !executeCopy) return;

    let frame = 0;
    let previousMode = false;

    const update = () => {
      frame = 0;
      if (
        window.innerWidth < 980 ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      const range = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = clamp01(-section.getBoundingClientRect().top / range);
      const shift = smoothstep(0.32, 0.58, progress);
      const executeOpacity = smoothstep(0.4, 0.55, progress);
      const signalsOpacity = 1 - smoothstep(0.37, 0.515, progress);

      const phoneOffset = Math.round((0.2 - shift * 0.4) * window.innerWidth);
      phone.style.transform = `translate3d(calc(-50% + ${phoneOffset}px), -50%, 0)`;
      signalsCopy.style.opacity = signalsOpacity.toFixed(4);
      signalsCopy.style.transform = `translate3d(${(-28 * shift).toFixed(1)}px, -50%, 0)`;
      executeCopy.style.opacity = executeOpacity.toFixed(4);
      executeCopy.style.transform = `translate3d(${(34 * (1 - shift)).toFixed(1)}px, -50%, 0)`;

      const nextMode = progress > 0.49;
      section.dataset.mode = nextMode ? "execute" : "signals";
      if (nextMode !== previousMode) {
        previousMode = nextMode;
        setExecutionActive(nextMode);
      }
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="v4-signals"
      className={styles.journey}
      aria-label="Signals and execution"
    >
      <span id="v4-execute" className={styles.executeAnchor} aria-hidden="true" />

      <div className={styles.journeyAnimated}>
        <div className={styles.journeySticky}>
          <JourneyCopy
            kind="signals"
            source={source}
            onSourceChange={setSource}
            executionPath={executionPath}
            onExecutionPathChange={setExecutionPath}
            elementRef={signalsCopyRef}
          />
          <div ref={phoneRef} className={styles.journeyPhone}>
            <ProductPhone
              source={source}
              executionActive={executionActive}
              executionPath={executionPath}
            />
          </div>
          <JourneyCopy
            kind="execute"
            source={source}
            onSourceChange={setSource}
            executionPath={executionPath}
            onExecutionPathChange={setExecutionPath}
            elementRef={executeCopyRef}
          />
        </div>
      </div>

      <div className={styles.journeyFallback}>
        <article aria-labelledby="v4-signals-title-static">
          <div>
            <p className={styles.kicker}>01 / Signals</p>
            <h2 id="v4-signals-title-static">Signals, before the crowd.</h2>
            <p>
              SmartX brings market movement, proven wallet activity, and the markets
              you follow into one evidence-backed signal.
            </p>
            <SignalTabs activeSource={source} onChange={setSource} />
            <SignalReadout source={source} />
          </div>
          <ProductPhone
            source={source}
            executionActive={false}
            executionPath={executionPath}
          />
        </article>
        <article aria-labelledby="v4-execute-title-static">
          <ProductPhone source={source} executionActive executionPath={executionPath} />
          <div>
            <p className={styles.kicker}>02 / Execute</p>
            <h2 id="v4-execute-title-static">From signal to action, your way.</h2>
            <p>
              Return through a signal or alert, trade with its evidence attached, or
              let a watchlisted strategy follow the trigger.
            </p>
            <ExecutionReadout path={executionPath} onChange={setExecutionPath} />
          </div>
        </article>
      </div>
    </section>
  );
}

function LoopPacket({
  className,
  tone = "teal",
}: {
  className?: string;
  tone?: "teal" | "muted" | "enriched";
}) {
  return (
    <span
      className={`${styles.loopPacket}${className ? ` ${className}` : ""}`}
      data-tone={tone}
      aria-hidden="true"
    >
      {Array.from({ length: 9 }).map((_, index) => (
        <i style={{ "--packet-cell": index } as CSSProperties} key={index} />
      ))}
    </span>
  );
}

function MemoryLoop() {
  const splitOffsets = ["-213px", "-71px", "71px", "213px"];
  const splitCellCounts = [5, 7, 6, 4];
  const outputCellCounts = [2, 4, 3, 1];
  const mergeOffsets = ["213px", "71px", "-71px", "-213px"];

  return (
    <div
      className={styles.memoryLoop}
      role="img"
      aria-label="The fifth Next Feed candidate enters Memory Reasoner while the queue immediately refills, updates Interest and Signal, records Style, keeps Edge pending, then returns over the first-ranked candidate and fades into the feed"
    >
      <div className={styles.loopFeed} aria-label="Next feed ranking">
        <span className={styles.loopFeedLabel}>NEXT FEED</span>
        <ol>
          {Array.from({ length: 5 }).map((_, index) => (
            <li key={index}>
              <span className={styles.loopRank} aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className={styles.srOnly}>Feed candidate rank {index + 1}</span>
            </li>
          ))}
        </ol>
        <span className={styles.loopFeedQueueViewport} aria-hidden="true">
          <span className={styles.loopFeedQueue}>
            <LoopPacket className={styles.loopFeedReplacement} tone="muted" />
            {Array.from({ length: 5 }).map((_, index) => (
              <LoopPacket
                className={styles.loopFeedCandidate}
                tone="muted"
                key={index}
              />
            ))}
          </span>
        </span>
      </div>

      <span className={styles.loopInputRail} aria-hidden="true" />

      <div className={styles.loopReasoner}>
        <span className={styles.loopReasonerGrid} aria-hidden="true">
          {Array.from({ length: 9 }).map((_, index) => (
            <i style={{ "--cell-index": index } as CSSProperties} key={index} />
          ))}
        </span>
        <strong>MEMORY REASONER</strong>
      </div>

      <span className={styles.loopReceipt}>FED / SMART MONEY</span>

      <span className={styles.loopBranchRail} aria-hidden="true">
        {MEMORY_DOMAINS.map((domain) => (
          <i
            data-state={domain.id === "edge" ? "pending" : "written"}
            style={{ "--memory-color": domain.color } as CSSProperties}
            key={domain.id}
          />
        ))}
      </span>

      <span className={styles.loopSplitPackets} aria-hidden="true">
        {MEMORY_DOMAINS.map((domain, index) => (
          <span
            className={styles.loopSplitPacket}
            data-domain={domain.id}
            data-state={domain.id === "edge" ? "pending" : "written"}
            style={
              {
                "--memory-color": domain.color,
                "--domain-index": index,
                "--split-x": splitOffsets[index],
              } as CSSProperties
            }
            key={domain.id}
          >
            {Array.from({ length: splitCellCounts[index] }).map((_, cellIndex) => (
              <i key={cellIndex} />
            ))}
          </span>
        ))}
      </span>

      <div className={styles.loopAbsorbers} aria-label="Memory dimensions">
        {MEMORY_DOMAINS.map((domain, index) => {
          const change = MEMORY_CHANGES[domain.id];
          const state =
            domain.id === "interests" || domain.id === "signals"
              ? "absorbed"
              : domain.id === "trading-style"
                ? "recorded"
                : "pending";

          return (
            <div
              className={styles.loopAbsorber}
              data-domain={domain.id}
              data-state={state}
              style={
                {
                  "--memory-color": domain.color,
                  "--domain-index": index,
                } as CSSProperties
              }
              aria-label={`${domain.label}: ${change.change}. ${change.status}.`}
              key={domain.id}
            >
              <span className={styles.loopAbsorberMachine} aria-hidden="true">
                <span className={styles.loopCollector}>
                  {Array.from({ length: 7 }).map((_, machineIndex) => (
                    <i key={machineIndex} />
                  ))}
                </span>
                <span className={styles.loopDigestor}>
                  <i />
                  <i />
                  <i />
                </span>
                <span className={styles.loopChamber}>
                  <i />
                </span>
              </span>
              <span className={styles.loopAbsorberOutput} aria-hidden="true">
                {Array.from({ length: outputCellCounts[index] }).map((_, outputIndex) => (
                  <i
                    style={{ "--output-index": outputIndex } as CSSProperties}
                    key={outputIndex}
                  />
                ))}
              </span>
              <span className={styles.loopDomainMeta}>
                <strong>
                  {domain.id === "interests"
                    ? "Interest"
                    : domain.id === "signals"
                      ? "Signal"
                      : domain.shortLabel}
                </strong>
                <small>{change.status}</small>
              </span>
            </div>
          );
        })}
      </div>

      <span className={styles.loopMergeRail} aria-hidden="true">
        {MEMORY_DOMAINS.map((domain) => (
          <i
            data-state={domain.id === "edge" ? "pending" : "written"}
            style={{ "--memory-color": domain.color } as CSSProperties}
            key={domain.id}
          />
        ))}
      </span>

      <span className={styles.loopMergePellets} aria-hidden="true">
        {MEMORY_DOMAINS.map((domain, index) => {
          const state = domain.id === "edge" ? "pending" : "written";

          return (
            <i
              data-state={state}
              style={
                {
                  "--memory-color": domain.color,
                  "--domain-index": index,
                  "--merge-x": mergeOffsets[index],
                } as CSSProperties
              }
              key={domain.id}
            />
          );
        })}
      </span>

      <div className={styles.loopReturnRoute} aria-hidden="true">
        <span className={styles.loopRouteBottom}>
          {Array.from({ length: 4 }).map((_, index) => (
            <i style={{ "--route-index": index } as CSSProperties} key={index} />
          ))}
        </span>
        <span className={styles.loopRouteSide}>
          {Array.from({ length: 6 }).map((_, index) => (
            <i style={{ "--route-index": index } as CSSProperties} key={index} />
          ))}
        </span>
        <span className={styles.loopRouteTop}>
          {Array.from({ length: 6 }).map((_, index) => (
            <i style={{ "--route-index": index } as CSSProperties} key={index} />
          ))}
        </span>
      </div>

      <LoopPacket className={styles.loopReturnPacket} tone="enriched" />

      <p className={styles.srOnly}>
        A trade informed by smart money is absorbed by Market interests and Trusted
        signals, recorded as Trading style, held pending for User edge, and returned
        to rank the next feed.
      </p>
    </div>
  );
}

function LearnSection() {
  const { ref, visible } = useReveal<HTMLElement>(0.25);

  return (
    <section
      ref={ref}
      id="v4-learn"
      className={styles.learn}
      data-visible={visible}
      aria-labelledby="v4-learn-title"
    >
      <div className={styles.sectionInner}>
        <div className={styles.learnCopy}>
          <p className={styles.kicker}>03 / Learn</p>
          <h2 id="v4-learn-title">
            It gets sharper
            <br />
            every trade<span className={styles.learnTitleMark}>.</span>
          </h2>
          <p>
            Every decision becomes Memory. SmartX learns what you follow, which proof
            you trust, how you size a trade, and where your advantage develops—then
            changes what it brings forward next.
          </p>
        </div>

        <MemoryLoop />
      </div>
    </section>
  );
}

function VenuesSection() {
  const { ref, visible } = useReveal<HTMLElement>(0.18);

  return (
    <section
      ref={ref}
      id="v4-venues"
      className={styles.venues}
      data-visible={visible}
      aria-labelledby="v4-venues-title"
    >
      <div className={styles.sectionInner}>
        <header className={styles.venuesHeader}>
          <p className={styles.kicker}>04 / All-in-one</p>
          <h2 id="v4-venues-title">Every venue. One terminal.</h2>
        </header>

        <div className={styles.venueSystem}>
          <span>ONE INTELLIGENCE LAYER</span>
          <Image
            src="/assets/smartx-logo.svg"
            alt=""
            width={218}
            height={42}
            aria-hidden="true"
          />
        </div>

        <div className={styles.venueSpine} aria-hidden="true">
          <i />
        </div>

        <div className={styles.venueGrid}>
          {VENUES.map((venue, index) => (
            <article
              className={styles.venueItem}
              data-live={venue.live}
              data-venue={venue.id}
              style={{ "--venue-index": index } as CSSProperties}
              key={venue.id}
            >
              <div className={styles.venueLogoFrame}>
                <Image
                  src={venue.logo}
                  alt=""
                  width={venue.logoWidth}
                  height={venue.logoHeight}
                  aria-hidden="true"
                />
              </div>
              <div className={styles.venueIdentity}>
                <strong>{venue.name}</strong>
                <span>{venue.category}</span>
              </div>
              <b>{venue.live ? "Live" : "Coming"}</b>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ClosingSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);

  return (
    <section ref={sectionRef} className={styles.closing} aria-labelledby="v4-closing-title">
      <ClosingFlowField sectionRef={sectionRef} copyRef={copyRef} ctaRef={ctaRef} />
      <div ref={copyRef}>
        <p className={styles.kicker}>
          <i className={styles.liveDot} aria-hidden="true" />
          Live on Polymarket
        </p>
        <h2 id="v4-closing-title">
          Trade with a terminal
          <br />
          that gets sharper with you.
        </h2>
      </div>
      <div className={styles.closingActions}>
        <a
          ref={ctaRef}
          className={styles.primaryAction}
          href={createSmartXAppHref("closing_cta")}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>
            <b>Launch SmartX</b>
            <b aria-hidden="true">Launch SmartX</b>
          </span>
          <i aria-hidden="true">↗</i>
        </a>
        <a
          className={styles.secondaryAction}
          href="https://smartx.gitbook.io/smartx.docs.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Read the docs</span>
          <i aria-hidden="true">↗</i>
        </a>
      </div>
    </section>
  );
}

function UpdatesSection() {
  return (
    <section className={styles.updates} aria-labelledby="v4-updates-title">
      <header>
        <p className={styles.kicker}>From SmartX</p>
        <h2 id="v4-updates-title">Updates</h2>
          <span>Product thinking, market intelligence, and what comes next.</span>
      </header>

      <div className={styles.updateList}>
        <article className={styles.featuredUpdate}>
          <div className={styles.updateImage}>
            <Image
              src="/assets/updates/decision-loop.png"
              alt="Abstract SmartX decision loop illustration"
              fill
              sizes="(min-width: 980px) 42vw, 100vw"
            />
          </div>
          <div className={styles.updateMeta}>
            <span>{UPDATE_STORIES[0].category}</span>
            <time dateTime={UPDATE_STORIES[0].dateTime}>{UPDATE_STORIES[0].date}</time>
          </div>
          <h3>{UPDATE_STORIES[0].title}</h3>
          <p>{UPDATE_STORIES[0].excerpt}</p>
        </article>

        <div className={styles.updateRows}>
          {UPDATE_STORIES.slice(1).map((update) => (
            <article key={update.title}>
              <div className={styles.updateMeta}>
                <span>{update.category}</span>
                <time dateTime={update.dateTime}>{update.date}</time>
              </div>
              <h3>{update.title}</h3>
              <p>{update.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function StoryFooter() {
  return (
    <footer id="v4-footer" className={styles.footer}>
      <div className={styles.footerTop}>
        <Image
          src="/assets/smartx-logo.svg"
          alt="SmartX"
          width={218}
          height={42}
          style={{ width: 126, height: "auto" }}
        />
        <nav aria-label="Footer">
          <a href={createSmartXAppHref("footer_link")} target="_blank" rel="noopener noreferrer">
            App
          </a>
          <a
            href="https://smartx.gitbook.io/smartx.docs.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            Docs
          </a>
          <a href="https://x.com/SmartXTerminal" target="_blank" rel="noopener noreferrer">
            X
          </a>
          <a href="https://t.me/+CTeuBkpOxSNkN2Y0" target="_blank" rel="noopener noreferrer">
            Telegram
          </a>
          <a
            href="https://smartx.gitbook.io/smartx.docs.io/9.-terms-of-service"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Service
          </a>
          <a
            href="https://smartx.gitbook.io/smartx.docs.io/10.-privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
        </nav>
      </div>
      <FooterWordmark />
      <div className={styles.footerMeta}>
        <span>© SmartX 2026</span>
      </div>
    </footer>
  );
}

export function V4StoryPage() {
  return (
    <>
      <StoryIndex />
      <TradingJourney />
      <LearnSection />
      <VenuesSection />
      <ClosingSection />
      <UpdatesSection />
      <StoryFooter />
    </>
  );
}
