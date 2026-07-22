"use client";

import { useEffect, useRef, type CSSProperties } from "react";

import styles from "./v4.module.css";

/**
 * EvidenceStage：Index 舞台的像素语义系统。
 * 四章共享一套 cell 网格，四种产品语义（§2.5 语义映射强制）：
 *  - signals   四条带时间戳的来源沿格线汇入一个命中格
 *  - execute   一个 evidence packet 穿过 Signal→Chart→Order→Fill 四段管线
 *  - learn     vc-demo 的 Memory core + 四个有明确含义的 domain cluster
 *  - allinone  六条 venue lane，只有 Live 的车道真正汇入终端块
 * 所有像素由规则放置（无 hash 轮廓），运动只沿网格轴向。
 */

export type StageState = "signals" | "execute" | "learn" | "allinone";

const CELL = 10;

/** 产品信号源 tone 色（smartx-fe-dev 语义色） */
const TONE = {
  teal: "#08dfb5",
  smart: "#36c7e8",
  market: "#ff9b3e",
  watchlist: "#ffc45e",
  dim: "rgba(148, 166, 194, 0.4)",
};

type Cell = { c: number; r: number; color: string; alpha: number; outline?: boolean };

/** 沿曼哈顿路径展开 waypoints 为 cell 序列（只走横竖） */
function manhattan(points: Array<[number, number]>): Array<[number, number]> {
  const cells: Array<[number, number]> = [];
  for (let index = 0; index < points.length - 1; index += 1) {
    let [c, r] = points[index];
    const [tc, tr] = points[index + 1];
    while (c !== tc) {
      cells.push([c, r]);
      c += Math.sign(tc - c);
    }
    while (r !== tr) {
      cells.push([c, r]);
      r += Math.sign(tr - r);
    }
  }
  cells.push(points[points.length - 1]);
  return cells;
}

/** 路径 → 尾淡头亮的 cell 序列 */
function stream(
  points: Array<[number, number]>,
  color: string,
  headAlpha = 0.95,
  tailAlpha = 0.14,
): Cell[] {
  const cells = manhattan(points);
  return cells.map(([c, r], index) => ({
    c,
    r,
    color,
    alpha: tailAlpha + (headAlpha - tailAlpha) * (index / Math.max(1, cells.length - 1)),
  }));
}

function block(
  c0: number,
  r0: number,
  width: number,
  height: number,
  color: string,
  alpha: number,
  outline = false,
): Cell[] {
  const cells: Cell[] = [];
  for (let r = r0; r < r0 + height; r += 1) {
    for (let c = c0; c < c0 + width; c += 1) {
      cells.push({ c, r, color, alpha, outline });
    }
  }
  return cells;
}

function drawSignals(columns: number, rows: number): Cell[] {
  const cx = Math.round(columns * 0.52);
  const cy = Math.round(rows * 0.5);
  // 四条来源流：转折一律发生在离中心 ≥6 格处，末段沿单一轴直线进场，
  // 头部停在命中格外 1 格（空隙让"命中"成为唯一焦点）。
  // 三条真实信号来源（News 产品未上线，不出现）：左 smart money、上 market、右下 watchlist
  const cells: Cell[] = [
    ...stream([[2, cy], [cx - 4, cy]], TONE.smart),
    ...stream([[cx + 8, 1], [cx + 8, cy - 8], [cx + 1, cy - 8], [cx + 1, cy - 4]], TONE.market),
    ...stream(
      [[columns - 3, cy + 6], [cx + 9, cy + 6], [cx + 9, cy + 1], [cx + 4, cy + 1]],
      TONE.watchlist,
    ),
    // 命中格：2×2 亮浅 teal，四周留白一格
    ...block(cx - 1, cy - 1, 2, 2, "#9df5e3", 1),
  ];
  return cells;
}

function drawExecute(columns: number, rows: number): Cell[] {
  const zone = columns / 4;
  const mid = Math.round(rows * 0.52);
  const cells: Cell[] = [];

  // 三条分段线（authored lines ≤3）：用 1 格宽低亮度 cell 列表达，仍是像素语法
  for (let zoneIndex = 1; zoneIndex < 4; zoneIndex += 1) {
    const c = Math.round(zone * zoneIndex);
    for (let r = 2; r < rows - 2; r += 2) {
      cells.push({ c, r, color: TONE.dim, alpha: 0.22 });
    }
  }

  // packet 轨迹：Signal 段直线进入 → Chart 段跟随价格起伏 → Order 段对齐成行 → Fill 段凝成实心块
  const path: Array<[number, number]> = [
    [1, mid],
    [Math.round(zone * 0.9), mid],
    // Chart 段：两次起伏
    [Math.round(zone * 1.25), mid],
    [Math.round(zone * 1.25), mid - 4],
    [Math.round(zone * 1.6), mid - 4],
    [Math.round(zone * 1.6), mid + 2],
    [Math.round(zone * 1.9), mid + 2],
    [Math.round(zone * 1.9), mid - 6],
    // Order 段：回到中线对齐
    [Math.round(zone * 2.3), mid - 6],
    [Math.round(zone * 2.3), mid - 1],
    [Math.round(zone * 2.9), mid - 1],
    // Fill 段
    [Math.round(zone * 3.4), mid - 1],
  ];
  cells.push(...stream(path, TONE.teal, 0.85, 0.12));

  // Order 段：订单行形态（packet 上下各一行短 cells，示意订单簿对齐）
  const orderCol = Math.round(zone * 2.45);
  for (let offset = 0; offset < 4; offset += 1) {
    cells.push({ c: orderCol + offset, r: mid - 3, color: TONE.teal, alpha: 0.28 });
    cells.push({ c: orderCol + offset, r: mid + 1, color: TONE.teal, alpha: 0.28 });
  }

  // Fill 终点：3×3 实心块
  cells.push(...block(Math.round(zone * 3.4), mid - 2, 3, 3, TONE.teal, 1));
  return cells;
}

function drawLearn(columns: number, rows: number): Cell[] {
  const cx = Math.round(columns * 0.52);
  const cy = Math.round(rows * 0.5);
  const anchors = [
    { c: Math.round(columns * 0.2), r: Math.round(rows * 0.24), affected: false },
    { c: Math.round(columns * 0.78), r: Math.round(rows * 0.22), affected: true },
    { c: Math.round(columns * 0.8), r: Math.round(rows * 0.76), affected: true },
    { c: Math.round(columns * 0.18), r: Math.round(rows * 0.78), affected: false },
  ];
  const cells: Cell[] = [...block(cx - 2, cy - 2, 5, 5, TONE.teal, 0.86)];

  anchors.forEach((anchor, index) => {
    const turnColumn = index % 2 === 0 ? cx - 7 : cx + 7;
    cells.push(
      ...stream(
        [
          [cx, cy],
          [turnColumn, cy],
          [turnColumn, anchor.r],
          [anchor.c, anchor.r],
        ],
        anchor.affected ? TONE.teal : TONE.dim,
        anchor.affected ? 0.92 : 0.48,
        0.12,
      ),
      ...block(anchor.c - 1, anchor.r - 1, 3, 3, anchor.affected ? TONE.teal : TONE.dim, anchor.affected ? 0.95 : 0.58),
      { c: anchor.c - 4, r: anchor.r - 3, color: anchor.affected ? TONE.teal : TONE.dim, alpha: 0.46 },
      { c: anchor.c + 4, r: anchor.r - 2, color: anchor.affected ? TONE.teal : TONE.dim, alpha: 0.46 },
      { c: anchor.c + 3, r: anchor.r + 4, color: anchor.affected ? TONE.teal : TONE.dim, alpha: 0.46 },
    );
  });

  // 同一成交回执进入核心；只让 Trusted signals 与 Style 两个集群增强。
  cells.push(...stream([[cx, 1], [cx, cy - 3]], "#9df5e3", 1, 0.22));
  return cells;
}

const VENUES = [
  { key: "polymarket", live: true },
  { key: "predictfun", live: false },
  { key: "hyperliquid", live: false },
  { key: "aster", live: false },
  { key: "bstocks", live: false },
  { key: "ondo", live: false },
] as const;

function drawAllinone(columns: number, rows: number): Cell[] {
  const cells: Cell[] = [];
  const laneLeft = Math.round(columns * 0.24);
  const terminalCol = columns - 11;
  const terminalRow = Math.round(rows * 0.5) - 5;

  // 终端块：右侧 8×10 实心
  cells.push(...block(terminalCol, terminalRow, 8, 10, TONE.teal, 0.88));

  VENUES.forEach((venue, laneIndex) => {
    const r = Math.round(rows * (0.1 + laneIndex * 0.16));
    if (venue.live) {
      // Live 车道：实心、全程、曼哈顿转入终端块
      cells.push(
        ...stream(
          [
            [laneLeft, r],
            [terminalCol - 6, r],
            [terminalCol - 6, terminalRow + 5],
            [terminalCol - 1, terminalRow + 5],
          ],
          TONE.teal,
          0.9,
          0.45,
        ),
      );
    } else {
      // Coming 车道：outline、稀疏、只到中途，不接入终端（诚实表达）
      const reach = Math.round(columns * 0.55);
      for (let c = laneLeft; c < reach; c += 2) {
        cells.push({ c, r, color: TONE.dim, alpha: 0.5, outline: true });
      }
    }
  });
  return cells;
}

const DRAWERS: Record<StageState, (columns: number, rows: number) => Cell[]> = {
  signals: drawSignals,
  execute: drawExecute,
  learn: drawLearn,
  allinone: drawAllinone,
};

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

function revealOrder(state: StageState, cell: Cell, columns: number, rows: number) {
  const centerColumn = columns * 0.52;
  const centerRow = rows * 0.5;
  const distance =
    (Math.abs(cell.c - centerColumn) + Math.abs(cell.r - centerRow)) /
    Math.max(1, columns + rows);

  if (state === "signals") return clamp01(0.62 - distance * 1.8);
  if (state === "execute" || state === "allinone") return clamp01(cell.c / columns);
  return clamp01(distance * 2.2);
}

function drawPacketTrail(
  context: CanvasRenderingContext2D,
  points: Array<[number, number]>,
  progress: number,
  color: string,
) {
  const path = manhattan(points);
  const head = Math.min(path.length - 1, Math.floor(clamp01(progress) * path.length));
  for (let trail = 4; trail >= 0; trail -= 1) {
    const point = path[Math.max(0, head - trail)];
    if (!point) continue;
    context.fillStyle = color;
    context.globalAlpha = 0.18 + (4 - trail) * 0.18;
    context.fillRect(point[0] * CELL + 1, point[1] * CELL + 1, CELL - 3, CELL - 3);
  }
}

function drawMotionPackets(
  context: CanvasRenderingContext2D,
  state: StageState,
  columns: number,
  rows: number,
  progress: number,
) {
  if (progress >= 0.985) return;
  const cx = Math.round(columns * 0.52);
  const cy = Math.round(rows * 0.5);

  if (state === "signals") {
    const paths: Array<{ points: Array<[number, number]>; color: string; delay: number }> = [
      { points: [[2, cy], [cx - 3, cy]], color: TONE.smart, delay: 0 },
      {
        points: [[cx + 8, 1], [cx + 8, cy - 8], [cx + 1, cy - 8], [cx + 1, cy - 3]],
        color: TONE.market,
        delay: 0.1,
      },
      {
        points: [[columns - 3, cy + 6], [cx + 9, cy + 6], [cx + 9, cy + 1], [cx + 3, cy + 1]],
        color: TONE.watchlist,
        delay: 0.2,
      },
    ];
    paths.forEach((path) =>
      drawPacketTrail(
        context,
        path.points,
        clamp01((progress - path.delay) / (0.86 - path.delay)),
        path.color,
      ),
    );
    return;
  }

  if (state === "execute") {
    drawPacketTrail(
      context,
      [
        [1, cy],
        [Math.round(columns * 0.3), cy],
        [Math.round(columns * 0.3), cy - 4],
        [Math.round(columns * 0.5), cy - 4],
        [Math.round(columns * 0.5), cy + 2],
        [Math.round(columns * 0.72), cy + 2],
        [Math.round(columns * 0.72), cy - 1],
        [columns - 10, cy - 1],
      ],
      progress,
      TONE.teal,
    );
    return;
  }

  if (state === "learn") {
    drawPacketTrail(context, [[cx, 1], [cx, cy - 3]], clamp01(progress / 0.62), "#9df5e3");
    if (progress > 0.55) {
      const pulse = 1 - clamp01((progress - 0.55) / 0.43);
      context.globalAlpha = pulse;
      context.fillStyle = TONE.teal;
      context.fillRect(Math.round(columns * 0.78) * CELL, Math.round(rows * 0.22) * CELL, CELL, CELL);
      context.fillRect(Math.round(columns * 0.8) * CELL, Math.round(rows * 0.76) * CELL, CELL, CELL);
    }
    return;
  }

  const terminalColumn = columns - 11;
  const terminalRow = Math.round(rows * 0.5);
  drawPacketTrail(
    context,
    [
      [Math.round(columns * 0.24), Math.round(rows * 0.1)],
      [terminalColumn - 6, Math.round(rows * 0.1)],
      [terminalColumn - 6, terminalRow],
      [terminalColumn - 1, terminalRow],
    ],
    progress,
    TONE.teal,
  );
}

/** 各状态的 DOM 标签（mono 11px，文字不进 Canvas） */
const STAGE_LABELS: Record<
  StageState,
  Array<{ left: string; top: string; text: string; tone?: string; align?: "right" }>
> = {
  signals: [
    { left: "3%", top: "34%", text: "SMART MONEY · 09:41:37", tone: TONE.smart },
    { left: "56%", top: "4%", text: "MARKET · 09:42:11", tone: TONE.market },
    { left: "97%", top: "68%", text: "WATCHLIST · 09:40:02", tone: TONE.watchlist, align: "right" },
    { left: "97%", top: "90%", text: "SIGNAL · YES @ 62.4¢", align: "right" },
  ],
  execute: [
    { left: "3%", top: "6%", text: "SIGNAL" },
    { left: "28%", top: "6%", text: "CHART" },
    { left: "53%", top: "6%", text: "ORDER" },
    { left: "78%", top: "6%", text: "FILL" },
    { left: "97%", top: "66%", text: "FILLED · $1,000 YES @ 62.4¢", align: "right" },
  ],
  learn: [
    { left: "4%", top: "22%", text: "INTERESTS" },
    { left: "96%", top: "20%", text: "TRUSTED SIGNALS", align: "right" },
    { left: "96%", top: "78%", text: "STYLE", align: "right" },
    { left: "4%", top: "80%", text: "EDGE" },
    { left: "52%", top: "5%", text: "TRADE #127 → MEMORY", align: "right" },
  ],
  allinone: [
    { left: "3%", top: "9%", text: "POLYMARKET · LIVE", tone: TONE.teal },
    { left: "3%", top: "25%", text: "PREDICT.FUN · COMING" },
    { left: "3%", top: "41%", text: "HYPERLIQUID · COMING" },
    { left: "3%", top: "57%", text: "ASTER · COMING" },
    { left: "3%", top: "73%", text: "BSTOCKS · COMING" },
    { left: "3%", top: "89%", text: "ONDO GM · COMING" },
    { left: "97%", top: "30%", text: "ONE TERMINAL", align: "right" },
  ],
};

export function EvidenceStage({
  state,
  className,
  showLabels = true,
  motion = true,
}: {
  state: StageState;
  className?: string;
  showLabels?: boolean;
  motion?: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!host || !canvas || !context) return;

    let frame = 0;
    let lastProgress = 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const render = (progress: number, withMotion: boolean) => {
      /* 用布局盒而非视觉盒量测：宿主被 transform 缩放（移动端缩略图）时
         仍按完整网格作画，再由 CSS 缩小 */
      const hostWidth = host.offsetWidth;
      const hostHeight = host.offsetHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.round(hostWidth * dpr);
      const height = Math.round(hostHeight * dpr);
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      canvas.style.width = `${hostWidth}px`;
      canvas.style.height = `${hostHeight}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, hostWidth, hostHeight);

      const columns = Math.floor(hostWidth / CELL);
      const rows = Math.floor(hostHeight / CELL);
      for (const cell of DRAWERS[state](columns, rows)) {
        if (cell.c < 0 || cell.r < 0 || cell.c >= columns || cell.r >= rows) continue;
        const order = revealOrder(state, cell, columns, rows);
        const reveal = easeOutCubic(clamp01((progress - order * 0.42) / 0.58));
        const alpha = cell.alpha * (0.08 + reveal * 0.92);
        if (cell.outline) {
          context.strokeStyle = cell.color;
          context.globalAlpha = alpha;
          context.lineWidth = 1;
          context.strokeRect(cell.c * CELL + 1.5, cell.r * CELL + 1.5, CELL - 4, CELL - 4);
        } else {
          context.fillStyle = cell.color;
          context.globalAlpha = alpha;
          context.fillRect(cell.c * CELL + 1, cell.r * CELL + 1, CELL - 3, CELL - 3);
        }
      }
      if (withMotion) drawMotionPackets(context, state, columns, rows, progress);
      context.globalAlpha = 1;
    };

    if (reduceMotion || !motion) {
      lastProgress = 1;
      render(1, false);
    } else {
      const startedAt = performance.now();
      const tick = (now: number) => {
        lastProgress = clamp01((now - startedAt) / 620);
        render(lastProgress, true);
        if (lastProgress < 1) frame = window.requestAnimationFrame(tick);
      };
      frame = window.requestAnimationFrame(tick);
    }

    const observer = new ResizeObserver(() => render(lastProgress, false));
    observer.observe(host);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [motion, state]);

  return (
    <div ref={hostRef} className={`${styles.stage} ${className ?? ""}`} data-state={state}>
      <canvas ref={canvasRef} aria-hidden="true" />
      {showLabels
        ? STAGE_LABELS[state].map((label) => (
            <span
              className={styles.stageLabel}
              data-align={label.align}
              style={
                {
                  left: label.left,
                  top: label.top,
                  "--label-tone": label.tone ?? "rgba(148, 166, 194, 0.75)",
                } as CSSProperties
              }
              key={label.text}
            >
              {label.text}
            </span>
          ))
        : null}
    </div>
  );
}
