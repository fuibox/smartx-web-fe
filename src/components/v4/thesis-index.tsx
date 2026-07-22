"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";

import styles from "./v4.module.css";

const FIELD_COLUMNS = 38;

const FIELD_RANGES = [
  [21, 24],
  [17, 28],
  [13, 31],
  [10, 34],
  [7, 36],
  [5, 33],
  [8, 37],
  [3, 34],
  [0, 29],
  [4, 36],
  [9, 37],
  [6, 31],
  [12, 35],
  [15, 34],
  [11, 29],
  [17, 31],
  [20, 28],
  [22, 26],
] as const;

const INDEX_ITEMS = [
  {
    number: "02",
    name: "Execute",
    outcome: "Carry the evidence into the order.",
    href: "#v4-execute",
    status: "Live beta",
    evidence: "SIGNAL → CHART → ORDER",
  },
  {
    number: "03",
    name: "Learn",
    outcome: "Every decision compounds into memory.",
    href: "#v4-learn",
    status: "Future",
    evidence: "INTEREST · SIGNALS · STYLE · EDGE",
  },
  {
    number: "04",
    name: "All-in-one",
    outcome: "One terminal across every market.",
    href: "#v4-venues",
    status: "1 live · 4 coming",
    evidence: "POLYMARKET / HYPERLIQUID / ASTER",
  },
] as const;

type PixelStyle = CSSProperties & {
  "--pixel-alpha": number;
};

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function smoothstep(edge0: number, edge1: number, value: number) {
  const progress = clamp01((value - edge0) / (edge1 - edge0));
  return progress * progress * (3 - 2 * progress);
}

function DecisionField({ fieldRef }: { fieldRef: RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={fieldRef} className={styles.decisionField} aria-hidden="true">
      <span className={styles.fieldAxis} data-axis="x" />
      <span className={styles.fieldAxis} data-axis="y" />
      <div className={styles.decisionMatrix}>
        {FIELD_RANGES.map(([start, end], rowIndex) => {
          return (
            <span
              className={styles.decisionRow}
              key={`${start}-${end}-${rowIndex}`}
            >
              {Array.from({ length: FIELD_COLUMNS }, (_, columnIndex) => {
                if (columnIndex < start || columnIndex > end) return null;

                const hash = ((rowIndex + 3) * 29 + (columnIndex + 5) * 17) % 100;
                const isEdge = columnIndex === start || columnIndex === end;
                const isNode = (rowIndex * 11 + columnIndex * 7) % 31 === 0;
                const shouldRender = isEdge || isNode || hash < 72;
                if (!shouldRender) return null;

                const alpha = isNode ? 1 : isEdge ? 0.72 : 0.24 + (hash % 42) / 70;

                return (
                  <i
                    className={styles.decisionPixel}
                    data-node={isNode || undefined}
                    style={
                      {
                        gridColumn: columnIndex + 1,
                        "--pixel-alpha": Number(alpha.toFixed(2)),
                      } as PixelStyle
                    }
                    key={columnIndex}
                  />
                );
              })}
            </span>
          );
        })}
      </div>
      <span className={styles.fieldReadout}>ADAPTIVE DECISION FIELD / 00</span>
    </div>
  );
}

export function ThesisIndex() {
  const sectionRef = useRef<HTMLElement>(null);
  const moverRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef<HTMLDivElement>(null);
  const identityRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const chainRef = useRef<HTMLDivElement>(null);
  const indexRef = useRef<HTMLDivElement>(null);
  const indexHeaderRef = useRef<HTMLDivElement>(null);
  const indexStackRef = useRef<HTMLDivElement>(null);
  const indexReadyRef = useRef(false);
  const signalsActiveRef = useRef(false);
  const [indexReady, setIndexReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const mover = moverRef.current;
    const scale = scaleRef.current;
    const identity = identityRef.current;
    const field = fieldRef.current;
    const chain = chainRef.current;
    const index = indexRef.current;
    const indexHeader = indexHeaderRef.current;
    const indexStack = indexStackRef.current;

    if (
      !section ||
      !mover ||
      !scale ||
      !identity ||
      !field ||
      !chain ||
      !index ||
      !indexHeader ||
      !indexStack
    ) {
      return;
    }

    let frame = 0;
    let lastProgress = -1;
    let wasStatic = false;

    const setReady = (ready: boolean) => {
      if (indexReadyRef.current === ready) return;
      indexReadyRef.current = ready;
      setIndexReady(ready);
    };

    const setSignalsActive = (active: boolean) => {
      if (signalsActiveRef.current === active) return;
      signalsActiveRef.current = active;
      section.dataset.signalsActive = active ? "true" : "false";
    };

    const update = () => {
      frame = 0;

      const staticLayout =
        window.innerWidth < 980 ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (staticLayout) {
        setReady(true);
        setSignalsActive(false);
        if (wasStatic) return;
        wasStatic = true;
        lastProgress = -1;
        mover.style.transform = "none";
        scale.style.transform = "none";
        identity.style.opacity = "1";
        identity.style.transform = "none";
        chain.style.opacity = "1";
        chain.style.transform = "none";
        field.style.opacity = "1";
        index.style.opacity = "1";
        index.style.transform = "none";
        indexHeader.style.opacity = "1";
        indexStack.style.opacity = "1";
        indexStack.style.transform = "none";
        return;
      }

      wasStatic = false;
      const scrollRange = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = clamp01(-section.getBoundingClientRect().top / scrollRange);
      if (Math.abs(progress - lastProgress) < 0.0001) return;
      lastProgress = progress;
      const thesisMove = smoothstep(0.24, 0.54, progress);
      const copyOut = smoothstep(0.3, 0.52, progress);
      const indexIn = smoothstep(0.4, 0.64, progress);
      const signalsExpand = smoothstep(0.84, 0.99, progress);

      mover.style.transform = `translate3d(${(-30 * thesisMove).toFixed(3)}vw, 0, 0)`;
      scale.style.transform = `scale(${(1 - thesisMove * 0.54).toFixed(4)})`;
      identity.style.opacity = (1 - copyOut).toFixed(4);
      identity.style.transform = `translate3d(0, ${(-18 * copyOut).toFixed(2)}px, 0)`;
      chain.style.opacity = (1 - copyOut).toFixed(4);
      chain.style.transform = `translate3d(0, ${(-18 * copyOut).toFixed(2)}px, 0)`;
      field.style.opacity = (1 - signalsExpand * 0.36).toFixed(4);
      index.style.opacity = indexIn.toFixed(4);
      index.style.transform = `translate3d(${((1 - indexIn) * 100).toFixed(3)}%, 0, 0)`;
      indexHeader.style.opacity = (1 - signalsExpand).toFixed(4);
      indexStack.style.opacity = (1 - signalsExpand).toFixed(4);
      indexStack.style.transform = `translate3d(${(signalsExpand * 100).toFixed(3)}%, 0, 0)`;
      setSignalsActive(signalsExpand > 0.62);
      setReady(indexIn > 0.55);
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
      className={styles.thesisIndex}
      aria-label="How SmartX works and chapter index"
    >
      <div className={styles.thesisSticky}>
        <div className={styles.thesisRules} aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </div>

        <div ref={moverRef} className={styles.thesisMover}>
          <div ref={scaleRef} className={styles.thesisScale}>
            <div ref={identityRef} className={styles.thesisIdentity}>
              <p className={styles.thesisKicker}>00 / The system</p>
              <h2 id="v4-thesis" className={styles.thesisTitle}>
                Built around
                <br />
                how you trade.
              </h2>
              <p className={styles.thesisLede}>
                Signals, execution, and memory work as one — so every decision sharpens
                what comes next.
              </p>
            </div>

            <DecisionField fieldRef={fieldRef} />

            <div
              ref={chainRef}
              className={styles.thesisChain}
              aria-label="SmartX decision system"
            >
              <span>
                <b>01</b>
                Signals discover
              </span>
              <span>
                <b>02</b>
                Execute responds
              </span>
              <span>
                <b>03</b>
                Memory compounds
              </span>
            </div>
          </div>
        </div>

        <div
          ref={indexRef}
          className={styles.indexLayer}
          aria-hidden={!indexReady}
          aria-label="Product chapters"
          data-ready={indexReady}
        >
          <div ref={indexHeaderRef} className={styles.indexHeader} aria-hidden="true">
            <span>Chapter index</span>
            <span>01 — 04</span>
          </div>

          <a
            className={`${styles.indexCell} ${styles.indexSignal}`}
            href="#v4-discover"
            tabIndex={indexReady ? undefined : -1}
          >
            <span className={styles.indexOrdinal}>01</span>
            <span className={styles.indexCopy}>
              <strong className={styles.indexName}>Signals</strong>
              <span className={styles.indexOutcome}>
                See what moves before it becomes obvious.
              </span>
            </span>
            <span className={`${styles.indexEvidence} ${styles.signalEvidence}`}>
              <small>SMART MONEY / 12:42:08</small>
              <b>BUY +$48.2K</b>
              <em>YES @ 62.4¢ · +6.0¢</em>
            </span>
            <span className={styles.indexEnter}>Explore signals ↘</span>
          </a>

          <div ref={indexStackRef} className={styles.indexStack}>
            {INDEX_ITEMS.map((item) => (
              <a
                className={`${styles.indexCell} ${styles.indexStackCell}`}
                href={item.href}
                tabIndex={indexReady ? undefined : -1}
                key={item.number}
              >
                <span className={styles.indexOrdinal}>{item.number}</span>
                <span className={styles.indexCopy}>
                  <strong className={styles.indexName}>{item.name}</strong>
                  <span className={styles.indexOutcome}>{item.outcome}</span>
                </span>
                <span className={styles.indexEvidence}>
                  <small>{item.status}</small>
                  <b>{item.evidence}</b>
                </span>
                <span className={styles.indexEnter}>View chapter ↘</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
