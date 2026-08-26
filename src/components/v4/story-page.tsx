"use client";

import Image from "next/image";
import Link from "next/link";
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
import { JoinWaitlistCta } from "@/components/site/join-waitlist-cta";
import { SiteFooter } from "@/components/site/site-footer";
import type { BlogPostSummary } from "@/content/blog-types";
import { formatBlogDate } from "@/lib/blog-format";

import { ClosingFlowField } from "./closing-field";
import { EvidenceStage, type StageState } from "./evidence-stage";
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
    headline: "See why a wallet matters beyond PnL.",
    detail: "",
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
    eyebrow: "Market intelligence",
    headline: "See the signals behind the move.",
    detail: "",
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
    eyebrow: "Custom alerts",
    headline: "Set the conditions. SmartX keeps watch.",
    detail: "",
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

const EXECUTE_CAPTURES = {
  recall: {
    src: "/assets/h5/execute@2x.png",
    width: 780,
    height: 1688,
    alt: "SmartX mobile market trade ticket with outcome, amount, and order controls",
  },
  follow: {
    src: "/assets/h5/strategy-follow@2x.png",
    width: 780,
    height: 1688,
    alt: "SmartX Watchlist with active price, signal, market metric, and wallet rules",
  },
} as const;

const EXECUTION_PATHS = [
  {
    id: "recall",
    label: "Recall & trade",
    eyebrow: "SIGNALS · ALERTS · TELEGRAM",
    headline: "Return with the evidence intact.",
    items: [
      { label: "SmartX signal", detail: "Opens the exact market" },
      { label: "Your alert", detail: "Returns to the matched condition" },
      { label: "Telegram", detail: "Trade from notification · Coming" },
    ],
    capture: EXECUTE_CAPTURES.recall,
  },
  {
    id: "follow",
    label: "Strategy follow",
    eyebrow: "WATCHLIST RULES · AUTO-EXECUTION COMING",
    headline: "Turn a trusted signal into a rule.",
    items: [
      { label: "Market signals", detail: "Choose the event trigger" },
      { label: "Smart Money", detail: "Choose wallets to follow" },
      { label: "Watchlist rule", detail: "Review, pause, or edit" },
    ],
    capture: EXECUTE_CAPTURES.follow,
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
  edge: { change: "Entry timing noted", status: "Recorded" },
};

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
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting);
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible, active };
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
            Built around{" "}
            <br />
            how you trade.
          </h2>
          <p>
            <span className={styles.ledeDesktop}>
              SmartX connects what you notice, how you act, and what it learns—so the
              terminal becomes more personal with every decision.
            </span>
            <span className={styles.ledeMobile}>
              SmartX connects what you notice, how you act, and what it learns.
            </span>
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
      {source.detail ? <small>{source.detail}</small> : null}
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
            key={executionPath.capture.src}
            className={`${styles.phoneCapture} ${styles.phoneExecuteCapture}`}
            src={executionPath.capture.src}
            alt={executionPath.capture.alt}
            width={executionPath.capture.width}
            height={executionPath.capture.height}
            sizes="(max-width: 979px) 350px, 26vw"
            draggable={false}
            unoptimized
          />
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
          Signals, before{" "}
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
        From signal
        <br />
        to trade.
      </h2>
      <p>
        Trade from a signal now—or let a strategy follow the next one.
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
              <span className={styles.ledeDesktop}>
                SmartX brings market movement, proven wallet activity, and the markets
                you follow into one evidence-backed signal.
              </span>
              <span className={styles.ledeMobile}>
                Market moves, proven wallets, and your watchlist—one evidence-backed
                signal.
              </span>
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
            <h2 id="v4-execute-title-static">From signal to trade.</h2>
            <p>
              <span className={styles.ledeDesktop}>
                Trade from a signal now—or let a strategy follow the next one.
              </span>
              <span className={styles.ledeMobile}>
                Trade now, or let a strategy follow the next signal.
              </span>
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
  const domainArrivalDelays = ["0ms", "70ms", "140ms", "210ms"];
  const domainWriteDelays = ["0ms", "70ms", "140ms", "300ms"];

  return (
    <div
      className={styles.memoryLoop}
      role="img"
      aria-label="The fifth Next Feed candidate enters Memory Reasoner, updates Interest and Signal, records Style and Edge, then the enriched memory returns to the feed and visibly re-ranks it: the third candidate is promoted to the top while a new candidate refills the queue"
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
        {MEMORY_DOMAINS.map((domain, index) => (
          <i
            data-state={"written"}
            style={
              {
                "--memory-color": domain.color,
                "--domain-arrival-delay": domainArrivalDelays[index],
              } as CSSProperties
            }
            key={domain.id}
          />
        ))}
      </span>

      <span className={styles.loopSplitPackets} aria-hidden="true">
        {MEMORY_DOMAINS.map((domain, index) => (
          <span
            className={styles.loopSplitPacket}
            data-domain={domain.id}
            data-state={"written"}
            style={
              {
                "--memory-color": domain.color,
                "--domain-index": index,
                "--split-x": splitOffsets[index],
                "--domain-arrival-delay": domainArrivalDelays[index],
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
              : "recorded";

          return (
            <div
              className={styles.loopAbsorber}
              data-domain={domain.id}
              data-state={state}
              style={
                {
                  "--memory-color": domain.color,
                  "--domain-index": index,
                  "--domain-write-delay": domainWriteDelays[index],
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
        {MEMORY_DOMAINS.map((domain, index) => (
          <i
            data-state={"written"}
            style={
              {
                "--memory-color": domain.color,
                "--domain-write-delay": domainWriteDelays[index],
              } as CSSProperties
            }
            key={domain.id}
          />
        ))}
      </span>

      <span className={styles.loopMergePellets} aria-hidden="true">
        {MEMORY_DOMAINS.map((domain, index) => {
          const state = "written";

          return (
            <i
              data-state={state}
              style={
                {
                  "--memory-color": domain.color,
                  "--domain-index": index,
                  "--merge-x": mergeOffsets[index],
                  "--domain-write-delay": domainWriteDelays[index],
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

      {/* 移动端：吸收器机器图形换成四条记忆域状态行（语义直读，桌面隐藏） */}
      <div className={styles.loopMobileSummary} aria-hidden="true">
        {MEMORY_DOMAINS.map((domain) => {
          const change = MEMORY_CHANGES[domain.id];
          return (
            <span
              style={{ "--memory-color": domain.color } as CSSProperties}
              data-state={change.status.toLowerCase()}
              key={domain.id}
            >
              <i />
              <strong>
                {domain.id === "interests"
                  ? "Interest"
                  : domain.id === "signals"
                    ? "Signal"
                    : domain.shortLabel}
              </strong>
              <em>{change.change}</em>
              <b>{change.status}</b>
            </span>
          );
        })}
      </div>

      {/* 移动端单列流的回流表意（桌面隐藏，桌面用完整回流路线） */}
      <span className={styles.loopMobileReturn} aria-hidden="true">
        <LoopPacket tone="enriched" />
        <b>RANKS THE NEXT FEED ↺</b>
      </span>

      <p className={styles.srOnly}>
        A trade informed by smart money is absorbed by Market interests and Trusted
        signals, recorded as Trading style, noted as User edge, and returned
        to rank the next feed.
      </p>
    </div>
  );
}

function LearnSection() {
  const { ref, visible, active } = useReveal<HTMLElement>(0.25);

  return (
    <section
      ref={ref}
      id="v4-learn"
      className={styles.learn}
      data-visible={visible}
      data-active={active}
      aria-labelledby="v4-learn-title"
    >
      <div className={styles.sectionInner}>
        <div className={styles.learnCopy}>
          <p className={styles.kicker}>03 / Learn</p>
          <h2 id="v4-learn-title">
            It gets sharper{" "}
            <br />
            every trade<span className={styles.learnTitleMark}>.</span>
          </h2>
          <p>
            <span className={styles.ledeDesktop}>
              Every decision becomes Memory. SmartX learns what you follow, which proof
              you trust, how you size a trade, and where your advantage develops—then
              changes what it brings forward next.
            </span>
            <span className={styles.ledeMobile}>
              Every decision becomes Memory—and changes what SmartX brings you next.
            </span>
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
          {/* 显式空格：移动端隐藏 <br> 后两段仍需分词 */}
          Trade with a terminal{" "}
          <br />
          that gets sharper with you.
        </h2>
      </div>
      <div className={styles.closingActions}>
        <JoinWaitlistCta
          ref={ctaRef}
          className={styles.primaryAction}
        />
      </div>
    </section>
  );
}

function UpdatesSection({
  updates,
}: {
  updates: readonly BlogPostSummary[];
}) {
  const homepageUpdates = updates.slice(0, 3);
  const featuredUpdate = homepageUpdates[0];

  if (!featuredUpdate) return null;

  return (
    <section id="v4-updates" className={styles.updates} aria-labelledby="v4-updates-title">
      <header>
        <p className={styles.kicker}>From SmartX</p>
        <h2 id="v4-updates-title">Updates</h2>
        <div className={styles.updatesHeaderAside}>
          <span>Product thinking, market intelligence, and what comes next.</span>
          <Link
            className={styles.updatesSeeAll}
            href="/blog"
          >
            <span>See all</span>
            <i aria-hidden="true">↗</i>
          </Link>
        </div>
      </header>

      <div className={styles.updateList}>
        <article className={styles.featuredUpdate}>
          <Link
            className={styles.updateStoryLink}
            href={`/blog/${featuredUpdate.slug}`}
            aria-label={`${featuredUpdate.title} — read article`}
          >
            <div className={styles.updateImage}>
              <Image
                src={featuredUpdate.cover.src}
                alt={featuredUpdate.cover.alt}
                fill
                sizes="(min-width: 980px) 42vw, 100vw"
              />
            </div>
            <div className={styles.updateMeta}>
              <span>{featuredUpdate.category}</span>
              <time dateTime={featuredUpdate.publishedAt}>
                {formatBlogDate(featuredUpdate.publishedAt)}
              </time>
            </div>
            <h3>{featuredUpdate.title}</h3>
            <p>{featuredUpdate.excerpt}</p>
          </Link>
        </article>

        <div className={styles.updateRows}>
          {homepageUpdates.slice(1).map((update) => (
            <article key={update.title}>
              <Link
                className={styles.updateStoryLink}
                href={`/blog/${update.slug}`}
                aria-label={`${update.title} — read article`}
              >
                <div className={styles.updateMeta}>
                  <span>{update.category}</span>
                  <time dateTime={update.publishedAt}>
                    {formatBlogDate(update.publishedAt)}
                  </time>
                </div>
                <h3>{update.title}</h3>
                <p>{update.excerpt}</p>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function V4StoryPage({
  updates,
}: {
  updates: readonly BlogPostSummary[];
}) {
  return (
    <>
      <StoryIndex />
      <TradingJourney />
      <LearnSection />
      <VenuesSection />
      <ClosingSection />
      <UpdatesSection updates={updates} />
      <SiteFooter />
    </>
  );
}
