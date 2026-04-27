const canvas = document.getElementById("kinetic-grid");
const ctx = canvas.getContext("2d");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const state = {
  width: 0,
  height: 0,
  dpr: 1,
  cols: 0,
  rows: 0,
  spacingX: 0,
  spacingY: 0,
  startX: 0,
  startY: 0,
  overscan: 0,
  lastTime: 0,
  signalClock: 0,
  signalEvery: 0.92,
  autoSweepClock: 0,
  autoSweepEvery: 10,
  screenFlash: 0,
  pointerDown: false,
  nodeCount: 0,
  posX: new Float32Array(),
  posY: new Float32Array(),
  velX: new Float32Array(),
  velY: new Float32Array(),
  restX: new Float32Array(),
  restY: new Float32Array(),
  springs: [],
  signals: [],
  sweeps: [],
  findings: [],
  focusCell: null,
  introPrimed: false,
};

const config = {
  damping: 0.982,
  returnForce: 0.0028,
  springStrength: 0.082,
  pointerStrength: 2.35,
  pointerDragStrength: 0.92,
  pointerRadius: 2.15,
  spacingMin: 34,
  spacingMax: 46,
  overscanFactor: 5.25,
  signalRadius: 58,
  signalPush: 0.12,
  signalGather: 0.1,
  signalSamples: 9,
  signalTrail: 0.26,
  signalSpeedMin: 0.16,
  signalSpeedMax: 0.26,
};

const labelPools = {
  user: [
    { text: "Politics Expert", tone: "expert", icon: "civic" },
    { text: "Crypto Expert", tone: "expert", icon: "coin" },
    { text: "Sports Expert", tone: "expert", icon: "sports" },
    { text: "Trump Expert", tone: "hot", icon: "flame" },
    { text: "Iran Expert", tone: "hot", icon: "flame" },
    { text: "Basketball Expert", tone: "hot", icon: "flame" },
    { text: "Soccer Expert", tone: "hot", icon: "flame" },
    { text: "Whale", tone: "status", icon: "whale" },
    { text: "Steady", tone: "status", icon: "medal" },
    { text: "Contrarian", tone: "status", icon: "brain" },
    { text: "Pnl $100K+", tone: "status", icon: "pnl" },
    { text: "Pnl $500K+", tone: "status", icon: "pnl" },
    { text: "Pnl $1M+", tone: "status", icon: "pnl" },
    { text: "Swing", tone: "style", icon: "wave" },
    { text: "Closing", tone: "style", icon: "spiral" },
    { text: "Short-term", tone: "style", icon: "short" },
    { text: "Veteran", tone: "style", icon: "veteran" },
    { text: "Newbie", tone: "style", icon: "spark" },
    { text: "Flipper", tone: "behavior", icon: "flip" },
    { text: "One-Hit Wonder", tone: "behavior", icon: "oneHit" },
    { text: "Market Maker/Bot", tone: "behavior", icon: "bot" },
    { text: "Macro Expert", tone: "expert", icon: "civic" },
    { text: "Election Expert", tone: "expert", icon: "civic" },
    { text: "Policy Expert", tone: "expert", icon: "civic" },
    { text: "AI Expert", tone: "expert", icon: "brain" },
    { text: "Crypto Whale", tone: "status", icon: "whale" },
    { text: "Early Mover", tone: "status", icon: "bolt" },
    { text: "High Conviction", tone: "status", icon: "target" },
    { text: "Sharp Money", tone: "status", icon: "target" },
    { text: "Repeat Winner", tone: "status", icon: "medal" },
    { text: "Momentum", tone: "style", icon: "wave" },
    { text: "Liquidity Hunter", tone: "style", icon: "target" },
    { text: "News Sensitive", tone: "behavior", icon: "alert" },
  ],
  market: [
    { text: "Smart Money", tone: "signalSmart", icon: "target" },
    { text: "Fast Move", tone: "signalFast", icon: "bolt" },
    { text: "Big Orders", tone: "signalOrder", icon: "order" },
    { text: "OI Build-Up", tone: "signalOi", icon: "stack" },
    { text: "Illiquid", tone: "signalRisk", icon: "alert" },
    { text: "Volume Surge", tone: "signalVolume", icon: "chart" },
  ],
};

const labelToneStyles = {
  expert: {
    fill: [83, 131, 230, 0.15],
    stroke: [97, 152, 255, 0.56],
    text: [163, 199, 255, 1],
  },
  hot: {
    fill: [255, 93, 96, 0.12],
    stroke: [255, 138, 141, 0.52],
    text: [255, 194, 196, 1],
  },
  status: {
    fill: [33, 186, 222, 0.14],
    stroke: [35, 214, 255, 0.5],
    text: [149, 235, 255, 1],
  },
  style: {
    fill: [255, 180, 77, 0.14],
    stroke: [188, 156, 102, 0.9],
    text: [255, 224, 171, 1],
  },
  behavior: {
    fill: [115, 83, 230, 0.13],
    stroke: [181, 97, 255, 0.44],
    text: [232, 198, 255, 1],
  },
  market: {
    fill: [8, 223, 181, 0.12],
    stroke: [92, 232, 203, 0.5],
    text: [182, 255, 240, 1],
  },
  metric: {
    fill: [124, 137, 152, 0.13],
    stroke: [134, 147, 166, 0.42],
    text: [203, 213, 225, 1],
  },
  signalSmart: {
    fill: [33, 186, 222, 0.15],
    stroke: [35, 214, 255, 0.66],
    text: [149, 235, 255, 1],
  },
  signalFast: {
    fill: [255, 155, 62, 0.14],
    stroke: [255, 155, 62, 0.62],
    text: [255, 196, 140, 1],
  },
  signalOrder: {
    fill: [255, 190, 82, 0.13],
    stroke: [230, 188, 107, 0.62],
    text: [255, 223, 167, 1],
  },
  signalOi: {
    fill: [83, 131, 230, 0.14],
    stroke: [97, 152, 255, 0.6],
    text: [163, 199, 255, 1],
  },
  signalRisk: {
    fill: [255, 93, 96, 0.12],
    stroke: [255, 138, 141, 0.58],
    text: [255, 194, 196, 1],
  },
  signalVolume: {
    fill: [188, 96, 230, 0.13],
    stroke: [213, 116, 255, 0.62],
    text: [239, 182, 255, 1],
  },
};

const labelMetrics = {
  height: 20,
  iconSize: 13,
  iconLeft: 7,
  iconTextGap: 4,
  textRight: 10,
};

labelMetrics.iconCenter = labelMetrics.iconLeft + labelMetrics.iconSize * 0.5;
labelMetrics.textLeft = labelMetrics.iconLeft + labelMetrics.iconSize + labelMetrics.iconTextGap;

const tagIconMeta = {
  civic: { path: "./assets/tag-icons/civic.svg", tones: ["expert"], inset: [0.93, 0, 0.93, 1] },
  coin: { path: "./assets/tag-icons/coin.svg", tones: ["expert"], inset: [0, 0, 1, 1] },
  sports: { path: "./assets/tag-icons/sports.svg", tones: ["expert"], inset: [0.93, 0.93, 0.93, 0.93] },
  flame: { path: "./assets/tag-icons/flame.svg", tones: ["hot"], inset: [0, 0, 0, 0] },
  whale: { path: "./assets/tag-icons/whale.svg", tones: ["status"], inset: [0, 0, 0, 0] },
  medal: { path: "./assets/tag-icons/medal.svg", tones: ["status"], inset: [0, 0, 0, 0] },
  brain: { path: "./assets/tag-icons/brain.svg", tones: ["status"], inset: [0, 0, 0, 0] },
  pnl: { path: "./assets/tag-icons/pnl.svg", tones: ["status"], inset: [0, 0, 0, 0] },
  wave: { path: "./assets/tag-icons/wave.svg", tones: ["style"], inset: [0, 0, 0, 0] },
  spiral: { path: "./assets/tag-icons/spiral.svg", tones: ["style"], inset: [0, 0, 0, 0] },
  short: { path: "./assets/tag-icons/short.svg", tones: ["style"], inset: [0, 0, 0, 0] },
  veteran: { path: "./assets/tag-icons/veteran.svg", tones: ["style"], inset: [1, 1, 1, 1] },
  spark: { path: "./assets/tag-icons/spark.svg", tones: ["style"], inset: [0, 0, 0, 0] },
  flip: { path: "./assets/tag-icons/flip.svg", tones: ["behavior"], inset: [0, 0, 0, 0] },
  oneHit: { path: "./assets/tag-icons/oneHit.svg", tones: ["behavior"], inset: [0, 0, 0, 0] },
  bot: { path: "./assets/tag-icons/bot.svg", tones: ["behavior"], inset: [0, 0, 0, 0] },
};

const tagIconImages = Object.fromEntries(
  Object.entries(tagIconMeta).map(([name, meta]) => {
    const image = new Image();
    image.decoding = "async";
    image.src = meta.path;
    return [name, image];
  }),
);

const labelRectCache = {
  width: 0,
  height: 0,
  rects: [],
};

function prepareCalibrationText() {
  const targets = document.querySelectorAll("[data-calibrate-text]");

  for (const target of targets) {
    const text = target.textContent || "";
    target.textContent = "";
    target.style.setProperty("--char-count", text.length);

    for (const [index, char] of [...text].entries()) {
      const span = document.createElement("span");
      span.className = "hero-title__char";
      span.setAttribute("aria-hidden", "true");
      span.style.setProperty("--char-index", index);
      span.style.setProperty("--char-delay", `${160 + index * 38}ms`);
      span.textContent = char === " " ? "\u00a0" : char;
      target.append(span);
    }
  }
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

function smootherStep(value) {
  const t = clamp(value, 0, 1);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function easeOutCubic(value) {
  const t = clamp(value, 0, 1);
  return 1 - Math.pow(1 - t, 3);
}

function easeInOutSine(value) {
  return -(Math.cos(Math.PI * clamp(value, 0, 1)) - 1) * 0.5;
}

function indexFor(col, row) {
  return row * state.cols + col;
}

function clampCell(cell) {
  return {
    col: clamp(cell.col, 0, state.cols - 1),
    row: clamp(cell.row, 0, state.rows - 1),
  };
}

function cellForIndex(index) {
  return {
    col: index % state.cols,
    row: Math.floor(index / state.cols),
  };
}

function pointForCell(cell) {
  const index = indexFor(cell.col, cell.row);
  return {
    x: state.restX[index],
    y: state.restY[index],
    index,
  };
}

function cellFromPoint(x, y) {
  return {
    col: clamp(Math.round((x - state.startX) / state.spacingX), 0, state.cols - 1),
    row: clamp(Math.round((y - state.startY) / state.spacingY), 0, state.rows - 1),
  };
}

function visibleBounds(padding = 2) {
  const minCol = clamp(Math.ceil((0 - state.startX) / state.spacingX) + padding, 0, state.cols - 1);
  const maxCol = clamp(Math.floor((state.width - state.startX) / state.spacingX) - padding, 0, state.cols - 1);
  const minRow = clamp(Math.ceil((0 - state.startY) / state.spacingY) + padding, 0, state.rows - 1);
  const maxRow = clamp(Math.floor((state.height - state.startY) / state.spacingY) - padding, 0, state.rows - 1);

  return { minCol, maxCol, minRow, maxRow };
}

function randomInt(min, max) {
  return Math.floor(lerp(min, max + 1, Math.random()));
}

function rgba(color, alphaScale = 1) {
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${(color[3] * alphaScale).toFixed(3)})`;
}

function labelOffsetForPoint(index, source) {
  const x = state.restX[index];
  const y = state.restY[index];
  const sourceDx = source ? x - source.x : x - state.width * 0.5;
  const sourceDy = source ? y - source.y : y - state.height * 0.45;
  const sideX = Math.abs(sourceDx) > state.spacingX * 0.7 ? Math.sign(sourceDx) : x < state.width * 0.5 ? 1 : -1;
  const sideY = Math.abs(sourceDy) > state.spacingY * 0.7 ? Math.sign(sourceDy) : y < state.height * 0.45 ? 1 : -1;

  return {
    x: sideX >= 0 ? 17 : -17,
    y: sideY >= 0 ? 14 : -30,
    anchor: sideX >= 0 ? "left" : "right",
  };
}

function countFindingLabels(kind = null) {
  return state.findings.filter((finding) => finding.label && (!kind || finding.kind === kind)).length;
}

function pickLabelCandidate(type) {
  const isMobile = state.width < 720;
  const pool = labelPools[type].filter((item) => !isMobile || item.text.length <= 14);

  return pool[randomInt(0, pool.length - 1)] ?? null;
}

function pickFindingLabel(kind, strength, options = {}) {
  if (reduceMotion.matches || options.allowLabel === false) {
    return null;
  }

  const forceLabel = options.forceLabel === true;
  const isMobile = state.width < 720;
  const activeLabels = countFindingLabels();
  const activeKindLabels = countFindingLabels(kind);
  const maxLabels = isMobile ? 2 : 4;

  if (activeLabels >= maxLabels && !forceLabel) {
    return null;
  }

  if (kind === "manual") {
    const maxManualLabels = isMobile ? 1 : 3;
    if ((activeKindLabels >= maxManualLabels || strength < 0.58) && !forceLabel) {
      return null;
    }
  } else {
    const maxAutoLabels = isMobile ? 1 : 2;
    const autoProbability = options.probability ?? 0.3;

    if ((activeKindLabels >= maxAutoLabels || strength < 0.7 || Math.random() > autoProbability) && !forceLabel) {
      return null;
    }
  }

  const type = kind === "manual" ? (Math.random() > 0.55 ? "market" : "user") : Math.random() > 0.48 ? "user" : "market";
  const candidate = pickLabelCandidate(type);

  if (!candidate) {
    return null;
  }

  return {
    type,
    text: candidate.text,
    tone: candidate.tone,
    icon: candidate.icon ?? null,
    offset: options.offset ?? labelOffsetForPoint(options.index, options.source),
    lifeBias: type === "market" ? -0.2 : 0,
  };
}

function expandedRect(rect, padding) {
  return {
    left: Math.max(0, rect.left - padding),
    top: Math.max(0, rect.top - padding),
    right: Math.min(state.width, rect.right + padding),
    bottom: Math.min(state.height, rect.bottom + padding),
  };
}

function getProtectedRects() {
  if (labelRectCache.width === state.width && labelRectCache.height === state.height && labelRectCache.rects.length > 0) {
    return labelRectCache.rects;
  }

  const protectedTargets = [
    { selector: ".site-header", padding: 18 },
    { selector: ".hero-title", padding: 46 },
    { selector: ".hero-body", padding: 40 },
    { selector: ".hero-cta", padding: 20 },
  ];
  labelRectCache.width = state.width;
  labelRectCache.height = state.height;
  labelRectCache.rects = protectedTargets
    .map((target) => {
      const rect = document.querySelector(target.selector)?.getBoundingClientRect();
      return rect && rect.width > 0 && rect.height > 0 ? expandedRect(rect, target.padding) : null;
    })
    .filter(Boolean);

  return labelRectCache.rects;
}

function rectsOverlap(a, b) {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

function rectContainsPoint(rect, point) {
  return point.x >= rect.left && point.x <= rect.right && point.y >= rect.top && point.y <= rect.bottom;
}

function randomVisibleCell(options = {}) {
  const bounds = visibleBounds(options.padding ?? 3);
  const top = options.top ?? 0.12;
  const bottom = options.bottom ?? 0.76;
  const minRow = Math.round(lerp(bounds.minRow, bounds.maxRow, top));
  const maxRow = Math.round(lerp(bounds.minRow, bounds.maxRow, bottom));

  return {
    col: randomInt(bounds.minCol, bounds.maxCol),
    row: randomInt(Math.min(minRow, maxRow), Math.max(minRow, maxRow)),
  };
}

function randomEdgeCell() {
  const bounds = visibleBounds(2);
  const side = Math.floor(Math.random() * 3);
  const minRow = Math.round(lerp(bounds.minRow, bounds.maxRow, 0.08));
  const maxRow = Math.round(lerp(bounds.minRow, bounds.maxRow, 0.72));

  if (side === 0) {
    return {
      col: bounds.minCol,
      row: randomInt(minRow, maxRow),
    };
  }

  if (side === 1) {
    return {
      col: bounds.maxCol,
      row: randomInt(minRow, maxRow),
    };
  }

  return {
    col: randomInt(bounds.minCol, bounds.maxCol),
    row: bounds.minRow,
  };
}

function selectSignalTarget() {
  if (!state.focusCell || Math.random() < 0.22) {
    state.focusCell = randomVisibleCell({ top: 0.18, bottom: 0.62, padding: 5 });
  }

  if (Math.random() < 0.72) {
    return state.focusCell;
  }

  return randomVisibleCell({ top: 0.16, bottom: 0.74, padding: 4 });
}

function pushRouteCell(route, cell) {
  const previous = route[route.length - 1];
  const next = clampCell(cell);

  if (!previous || previous.col !== next.col || previous.row !== next.row) {
    route.push(next);
  }
}

function cellKey(cell) {
  return `${cell.col},${cell.row}`;
}

function edgeKey(a, b) {
  const aKey = `${a.col},${a.row}`;
  const bKey = `${b.col},${b.row}`;
  return aKey < bKey ? `${aKey}:${bKey}` : `${bKey}:${aKey}`;
}

function manhattanDistance(a, b) {
  return Math.abs(a.col - b.col) + Math.abs(a.row - b.row);
}

function routeNeighbors(cell) {
  return [
    { col: cell.col + 1, row: cell.row, axis: "x" },
    { col: cell.col - 1, row: cell.row, axis: "x" },
    { col: cell.col, row: cell.row + 1, axis: "y" },
    { col: cell.col, row: cell.row - 1, axis: "y" },
  ].filter((next) => next.col >= 0 && next.col < state.cols && next.row >= 0 && next.row < state.rows);
}

function chooseRouteStep(current, target, route, usedEdges, visitedCells, context) {
  const previous = route.length > 1 ? route[route.length - 2] : null;
  const currentDistance = manhattanDistance(current, target);
  const candidates = routeNeighbors(current)
    .map((candidate) => {
      const distance = manhattanDistance(candidate, target);
      return {
        ...candidate,
        distance,
        gain: currentDistance - distance,
        visited: visitedCells.has(cellKey(candidate)),
        used: usedEdges.has(edgeKey(current, candidate)),
        reverse: previous && previous.col === candidate.col && previous.row === candidate.row,
      };
    })
    .filter((candidate) => {
      if (candidate.reverse || candidate.used) {
        return false;
      }

      if (candidate.col === target.col && candidate.row === target.row) {
        return true;
      }

      if (candidate.gain > 0) {
        return !candidate.visited;
      }

      return (
        candidate.gain === 0 &&
        !candidate.visited &&
        context.detoursUsed < context.detourBudget &&
        context.stepsSinceCloser < 2
      );
    });

  if (candidates.length === 0) {
    return routeNeighbors(current)
      .filter((candidate) => !previous || previous.col !== candidate.col || previous.row !== candidate.row)
      .sort((a, b) => manhattanDistance(a, target) - manhattanDistance(b, target))[0];
  }

  candidates.sort((a, b) => {
    const scoreA =
      a.gain * 5 -
      a.distance * 0.5 +
      (a.axis !== context.lastAxis ? 0.45 : 0) +
      (a.gain === 0 ? -1.25 : 0) +
      Math.random() * 0.7;
    const scoreB =
      b.gain * 5 -
      b.distance * 0.5 +
      (b.axis !== context.lastAxis ? 0.45 : 0) +
      (b.gain === 0 ? -1.25 : 0) +
      Math.random() * 0.7;
    return scoreB - scoreA;
  });

  return candidates[0];
}

function buildRouteCells(startCell, targetCell, options = {}) {
  const route = [];
  const target = clampCell(targetCell);
  let current = clampCell(startCell);
  const distance = manhattanDistance(current, target);
  const maxSteps = options.maxSteps ?? Math.min(distance + randomInt(4, 8), options.kind === "manual" ? 30 : 36);
  const context = {
    detoursUsed: 0,
    detourBudget: options.detourBudget ?? (options.kind === "manual" ? 2 : randomInt(2, 4)),
    stepsSinceCloser: 0,
    lastAxis: null,
  };
  const usedEdges = new Set();
  const visitedCells = new Set();

  pushRouteCell(route, current);
  visitedCells.add(cellKey(current));

  while (route.length < maxSteps && manhattanDistance(current, target) > 0) {
    const next = chooseRouteStep(current, target, route, usedEdges, visitedCells, context);

    if (!next) {
      break;
    }

    const previousDistance = manhattanDistance(current, target);
    const nextDistance = manhattanDistance(next, target);
    usedEdges.add(edgeKey(current, next));
    pushRouteCell(route, next);
    current = route[route.length - 1];
    visitedCells.add(cellKey(current));
    context.lastAxis = next.axis;

    if (nextDistance < previousDistance) {
      context.stepsSinceCloser = 0;
    } else {
      context.detoursUsed += 1;
      context.stepsSinceCloser += 1;
    }
  }

  while (manhattanDistance(current, target) > 0 && route.length < maxSteps + distance + 4) {
    const dx = target.col - current.col;
    const dy = target.row - current.row;
    const axis = Math.abs(dx) >= Math.abs(dy) && dx !== 0 ? "x" : "y";
    const next = {
      col: current.col + (axis === "x" ? Math.sign(dx) : 0),
      row: current.row + (axis === "y" ? Math.sign(dy) : 0),
    };
    pushRouteCell(route, next);
    current = route[route.length - 1];
  }

  return route;
}

function buildRouteSegments(route) {
  const segments = [];
  let totalLength = 0;

  for (let i = 0; i < route.length - 1; i += 1) {
    const start = pointForCell(route[i]);
    const end = pointForCell(route[i + 1]);
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.hypot(dx, dy);

    if (length < 0.01) {
      continue;
    }

    segments.push({
      x1: start.x,
      y1: start.y,
      x2: end.x,
      y2: end.y,
      dirX: dx / length,
      dirY: dy / length,
      length,
      offset: totalLength,
    });
    totalLength += length;
  }

  return { segments, totalLength };
}

function pointOnSignal(signal, t) {
  const distance = clamp(t, 0, 1) * signal.totalLength;
  const lastSegment = signal.segments[signal.segments.length - 1];

  for (const segment of signal.segments) {
    if (distance <= segment.offset + segment.length) {
      const local = (distance - segment.offset) / segment.length;
      return {
        x: lerp(segment.x1, segment.x2, local),
        y: lerp(segment.y1, segment.y2, local),
        dirX: segment.dirX,
        dirY: segment.dirY,
      };
    }
  }

  return {
    x: lastSegment.x2,
    y: lastSegment.y2,
    dirX: lastSegment.dirX,
    dirY: lastSegment.dirY,
  };
}

function rebuildGrid() {
  const baseSpacing = clamp(
    Math.round(Math.min(state.width, state.height) / 20),
    config.spacingMin,
    config.spacingMax
  );

  state.spacingX = baseSpacing;
  state.spacingY = baseSpacing;
  state.overscan = Math.round(baseSpacing * config.overscanFactor);
  state.cols = Math.ceil((state.width + state.overscan * 2) / state.spacingX) + 1;
  state.rows = Math.ceil((state.height + state.overscan * 2) / state.spacingY) + 1;
  state.startX = -state.overscan;
  state.startY = -state.overscan;
  state.nodeCount = state.cols * state.rows;
  state.posX = new Float32Array(state.nodeCount);
  state.posY = new Float32Array(state.nodeCount);
  state.velX = new Float32Array(state.nodeCount);
  state.velY = new Float32Array(state.nodeCount);
  state.restX = new Float32Array(state.nodeCount);
  state.restY = new Float32Array(state.nodeCount);
  state.springs = [];
  state.signals = [];
  state.sweeps = [];
  state.findings = [];
  state.focusCell = null;

  for (let row = 0; row < state.rows; row += 1) {
    for (let col = 0; col < state.cols; col += 1) {
      const i = indexFor(col, row);
      const x = state.startX + col * state.spacingX;
      const y = state.startY + row * state.spacingY;
      state.restX[i] = x;
      state.restY[i] = y;
      state.posX[i] = x;
      state.posY[i] = y;
    }
  }

  for (let row = 0; row < state.rows; row += 1) {
    for (let col = 0; col < state.cols; col += 1) {
      const i = indexFor(col, row);
      if (col < state.cols - 1) {
        state.springs.push(i, indexFor(col + 1, row), state.spacingX);
      }
      if (row < state.rows - 1) {
        state.springs.push(i, indexFor(col, row + 1), state.spacingY);
      }
    }
  }
}

function resize() {
  state.dpr = Math.min(window.devicePixelRatio || 1, 2);
  state.width = window.innerWidth;
  state.height = window.innerHeight;
  canvas.width = Math.round(state.width * state.dpr);
  canvas.height = Math.round(state.height * state.dpr);
  canvas.style.width = `${state.width}px`;
  canvas.style.height = `${state.height}px`;
  ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
  rebuildGrid();

  if (!reduceMotion.matches && !state.introPrimed) {
    primeIntroSignals();
    state.introPrimed = true;
    return;
  }

  if (!reduceMotion.matches) {
    spawnSignal();
    spawnSignal();
  }
}

function buildSweepCandidates(x, y, maxRadius) {
  const center = cellFromPoint(x, y);
  const searchRadius = Math.ceil(maxRadius / Math.max(state.spacingX, state.spacingY));
  const candidates = [];
  const desiredCount = randomInt(5, 8);

  for (let row = center.row - searchRadius; row <= center.row + searchRadius; row += 1) {
    if (row < 0 || row >= state.rows) {
      continue;
    }

    for (let col = center.col - searchRadius; col <= center.col + searchRadius; col += 1) {
      if (col < 0 || col >= state.cols) {
        continue;
      }

      const point = pointForCell({ col, row });
      const distance = Math.hypot(point.x - x, point.y - y);

      if (distance > maxRadius * 0.96 || distance < state.spacingX * 0.54) {
        continue;
      }

      const angle = Math.atan2(point.y - y, point.x - x);
      const distanceScore = distance / maxRadius;
      candidates.push({
        index: point.index,
        distance,
        distanceScore,
        angle,
        jitter: Math.random(),
        triggered: false,
      });
    }
  }

  const selected = [];
  const radialTargets = Array.from({ length: desiredCount }, (_, index) => {
    const step = (index + 0.34 + Math.random() * 0.32) / desiredCount;
    return lerp(0.18, 0.92, step);
  }).sort(() => Math.random() - 0.5);

  const angleDistance = (a, b) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));

  for (const targetRadius of radialTargets) {
    let minAngleGap = (Math.PI * 2) / (desiredCount + 1) * 0.46;
    let picked = null;

    while (!picked && minAngleGap > 0.08) {
      const pool = candidates.filter(
        (candidate) =>
          !selected.includes(candidate) &&
          selected.every((item) => angleDistance(candidate.angle, item.angle) > minAngleGap)
      );

      pool.sort((a, b) => {
        const scoreA = Math.abs(a.distanceScore - targetRadius) + a.jitter * 0.22;
        const scoreB = Math.abs(b.distanceScore - targetRadius) + b.jitter * 0.22;
        return scoreA - scoreB;
      });

      picked = pool[0] ?? null;
      minAngleGap *= 0.62;
    }

    if (picked) {
      selected.push(picked);
    }
  }

  candidates.sort((a, b) => a.jitter - b.jitter);

  for (const candidate of candidates) {
    if (selected.length >= desiredCount) {
      break;
    }

    if (!selected.includes(candidate)) {
      selected.push(candidate);
    }
  }

  return selected.map((candidate, order) => {
    const tier = order < 2 ? 1 : order < 5 ? 0.74 : 0.48;
    return {
      ...candidate,
      strength: tier + Math.random() * 0.12,
      revealDistance: candidate.distance * (0.9 + Math.random() * 0.14),
    };
  });
}

function spawnSweep(x, y) {
  const maxRadius = clamp(Math.min(state.width, state.height) * 0.76, 270, 480);

  state.sweeps.push({
    x,
    y,
    age: 0,
    life: 1.18,
    maxRadius,
    candidates: buildSweepCandidates(x, y, maxRadius),
    labelBudget: state.width < 720 ? 1 : randomInt(2, 3),
    labelsIssued: 0,
    phase: Math.random() * Math.PI * 2,
  });

  if (state.sweeps.length > 4) {
    state.sweeps.shift();
  }
}

function randomAutoSweepPoint() {
  const protectedRects = getProtectedRects();
  const margin = Math.max(28, Math.min(state.width, state.height) * 0.06);
  const minX = margin;
  const maxX = Math.max(minX, state.width - margin);
  const minY = margin;
  const maxY = Math.max(minY, state.height - margin);

  for (let attempt = 0; attempt < 36; attempt += 1) {
    const point = {
      x: lerp(minX, maxX, Math.random()),
      y: lerp(minY, maxY, Math.random()),
    };

    if (!protectedRects.some((rect) => rectContainsPoint(rect, point))) {
      return point;
    }
  }

  return {
    x: lerp(minX, maxX, Math.random()),
    y: lerp(state.height * 0.62, maxY, Math.random()),
  };
}

function triggerAutoSweep() {
  if (state.width <= 0 || state.height <= 0 || state.nodeCount === 0) {
    return;
  }

  const point = randomAutoSweepPoint();
  applyImpulseFromPoint(point.x, point.y, config.pointerStrength * 0.86);
}

function applyImpulseFromPoint(x, y, strength = config.pointerStrength, shouldSweep = true) {
  const radius = config.pointerRadius * Math.max(state.spacingX, state.spacingY);

  for (let i = 0; i < state.nodeCount; i += 1) {
    const dx = state.restX[i] - x;
    const dy = state.restY[i] - y;
    const distance = Math.hypot(dx, dy);

    if (distance < radius && distance > 0.01) {
      const falloff = 1 - distance / radius;
      const eased = falloff * falloff;
      state.velX[i] += (dx / distance) * strength * eased;
      state.velY[i] += (dy / distance) * strength * eased;
    }
  }

  if (shouldSweep) {
    spawnSweep(x, y);
    state.screenFlash = Math.max(state.screenFlash, 0.006);
  }
}

function spawnSignal(options = {}) {
  if (state.cols < 2 || state.rows < 2) {
    return;
  }

  const targetCell = options.targetCell ?? selectSignalTarget();
  const startCell = options.startCell ?? randomEdgeCell();
  const route = buildRouteCells(startCell, targetCell, options.routeOptions ?? { kind: options.kind ?? "auto" });
  const { segments, totalLength } = buildRouteSegments(route);
  const trail = options.trail ?? config.signalTrail + Math.random() * 0.08;
  const progress = options.progress ?? 0;

  if (segments.length === 0) {
    return;
  }

  state.signals.push({
    segments,
    totalLength,
    targetIndex: pointForCell(targetCell).index,
    progress,
    tailProgress: options.tailProgress ?? Math.max(0, progress - trail),
    speed: options.speed ?? lerp(config.signalSpeedMin, config.signalSpeedMax, Math.random()),
    radius: options.radius ?? config.signalRadius * (0.9 + Math.random() * 0.35),
    intensity: options.intensity ?? 0.42 + Math.random() * 0.42,
    trail,
    kind: options.kind ?? "auto",
    delay: options.delay ?? 0,
    strength: options.strength ?? 0.76,
    resolved: false,
    resolveAge: 0,
    phase: Math.random() * Math.PI * 2,
  });

  if (state.signals.length > 18) {
    state.signals.shift();
  }
}

function primeIntroSignals() {
  const introSignals = Math.min(5, Math.max(3, Math.round(state.width / 360)));
  state.focusCell = randomVisibleCell({ top: 0.2, bottom: 0.58, padding: 5 });

  for (let i = 0; i < introSignals; i += 1) {
    spawnSignal({
      progress: 0.04 + i * 0.08,
      speed: 0.2 + i * 0.018,
      intensity: 0.32 + i * 0.045,
      radius: config.signalRadius * (0.9 + i * 0.06),
      trail: config.signalTrail + 0.08,
      targetCell: state.focusCell,
    });
  }

  state.signalClock = 0.18;
  state.screenFlash = Math.max(state.screenFlash, 0.006);
}

function applySignalField(x, y, dirX, dirY, radius, intensity) {
  const perpX = -dirY;
  const perpY = dirX;

  for (let i = 0; i < state.nodeCount; i += 1) {
    const dx = state.restX[i] - x;
    const dy = state.restY[i] - y;
    const distance = Math.hypot(dx, dy);

    if (distance >= radius) {
      continue;
    }

    const falloff = 1 - distance / radius;
    const weight = intensity * falloff * falloff;
    const side = dx * perpX + dy * perpY;
    const ribbon = 1 - Math.min(Math.abs(side) / radius, 1);
    const stream = weight * config.signalPush * (0.55 + ribbon * 0.45);
    const gather = weight * config.signalGather * (0.35 + ribbon * 0.65);

    state.velX[i] += dirX * stream;
    state.velY[i] += dirY * stream;
    state.velX[i] += -perpX * (side / radius) * gather;
    state.velY[i] += -perpY * (side / radius) * gather;
  }
}

function addFinding(index, strength = 1, kind = "auto", options = {}) {
  if (index < 0 || index >= state.nodeCount) {
    return null;
  }

  const source = options.source ?? null;
  const label =
    options.label === undefined
      ? pickFindingLabel(kind, strength, {
          ...options,
          index,
          source,
        })
      : options.label;
  const finding = {
    index,
    age: 0,
    life: (options.life ?? (kind === "manual" ? 3.8 : 3.35)) + (label?.lifeBias ?? 0),
    strength,
    kind,
    phase: Math.random() * Math.PI * 2,
    label,
  };

  state.findings.push(finding);

  if (state.findings.length > 18) {
    state.findings.shift();
  }

  return finding;
}

function updateFindings(dt) {
  for (let i = state.findings.length - 1; i >= 0; i -= 1) {
    const finding = state.findings[i];
    finding.age += dt;

    if (finding.age >= finding.life) {
      state.findings.splice(i, 1);
    }
  }
}

function updateSweeps(dt) {
  for (let sweepIndex = state.sweeps.length - 1; sweepIndex >= 0; sweepIndex -= 1) {
    const sweep = state.sweeps[sweepIndex];
    sweep.age += dt;
    const progress = clamp(sweep.age / sweep.life, 0, 1);
    const radius = easeOutCubic(progress) * sweep.maxRadius;

    for (const candidate of sweep.candidates) {
      if (candidate.triggered || candidate.revealDistance > radius) {
        continue;
      }

      candidate.triggered = true;
      const finding = addFinding(candidate.index, candidate.strength, "manual", {
        allowLabel: sweep.labelsIssued < sweep.labelBudget,
        forceLabel: sweep.labelsIssued === 0,
        source: {
          x: sweep.x,
          y: sweep.y,
        },
      });

      if (finding?.label) {
        sweep.labelsIssued += 1;
      }

      const point = {
        x: state.restX[candidate.index],
        y: state.restY[candidate.index],
      };
      const dx = point.x - sweep.x;
      const dy = point.y - sweep.y;
      const distance = Math.hypot(dx, dy) || 1;
      state.velX[candidate.index] += (dx / distance) * candidate.strength * 1.2;
      state.velY[candidate.index] += (dy / distance) * candidate.strength * 1.2;
    }

    if (sweep.age > sweep.life + 0.38) {
      state.sweeps.splice(sweepIndex, 1);
    }
  }
}

function signalHeadProgress(signal) {
  if (signal.resolved) {
    return 1;
  }

  const raw = clamp(signal.progress, 0, 1);
  const finish = raw > 0.9 ? smootherStep((raw - 0.9) / 0.1) : 0;
  const drift = Math.sin(raw * Math.PI * 5.5 + signal.phase) * 0.014 * (1 - finish);
  const hesitation = (raw > 0.72 ? smootherStep((raw - 0.72) / 0.22) * 0.045 : 0) * (1 - finish);
  const wanderingHead = clamp(raw + drift - hesitation, 0, 1);

  return lerp(wanderingHead, 1, finish);
}

function updateSignals(dt, time) {
  for (let signalIndex = state.signals.length - 1; signalIndex >= 0; signalIndex -= 1) {
    const signal = state.signals[signalIndex];
    if (signal.delay > 0) {
      signal.delay -= dt;
      continue;
    }

    const pulse = 0.84 + Math.sin(time * 1.7 + signal.phase) * 0.16;
    const approach =
      signal.kind === "manual" ? 1 : signal.progress > 0.72 ? 1 - smootherStep((signal.progress - 0.72) / 0.24) * 0.32 : 1;

    if (!signal.resolved) {
      signal.progress += dt * signal.speed * pulse * approach;
    }

    const head = signalHeadProgress(signal);

    if ((signal.progress >= 1 || head >= 0.985) && !signal.resolved) {
      addFinding(signal.targetIndex, signal.kind === "manual" ? signal.strength : 0.76, signal.kind, {
        probability: signal.kind === "auto" ? 0.3 : undefined,
      });
      signal.resolved = true;
      signal.resolveAge = 0;
    }

    if (signal.resolved) {
      signal.resolveAge += dt;
      const catchupSpeed = signal.kind === "manual" ? 0.78 : 0.84;
      const pullWindow = signal.kind === "manual" ? 0.75 : 0.46;
      const finalPull = smootherStep(signal.resolveAge / pullWindow) * (signal.kind === "manual" ? 0.22 : 0.34);
      signal.tailProgress += dt * (catchupSpeed + finalPull);
    } else {
      signal.tailProgress = Math.max(signal.tailProgress, Math.max(0, head - signal.trail));
    }

    if ((signal.resolved && 1 - signal.tailProgress < 0.015) || signal.tailProgress >= 0.998) {
      state.signals.splice(signalIndex, 1);
      continue;
    }

    const tail = clamp(signal.tailProgress, 0, head);
    const sampleCount = config.signalSamples;

    for (let sample = 0; sample < sampleCount; sample += 1) {
      const sampleT = lerp(tail, head, sampleCount === 1 ? 1 : sample / (sampleCount - 1));
      const point = pointOnSignal(signal, sampleT);
      const trailWeight = (sampleT - tail) / Math.max(head - tail, 0.001);
      const breathe = 0.92 + Math.sin(time * 3.8 + signal.phase + sampleT * 12) * 0.08;
      const strength = signal.intensity * (0.4 + trailWeight * 0.6) * breathe;
      const radius = signal.radius * (0.72 + trailWeight * 0.38);
      applySignalField(point.x, point.y, point.dirX, point.dirY, radius, strength);
    }
  }
}

function simulate() {
  const springCount = state.springs.length / 3;

  for (let spring = 0; spring < springCount; spring += 1) {
    const offset = spring * 3;
    const a = state.springs[offset];
    const b = state.springs[offset + 1];
    const rest = state.springs[offset + 2];
    const dx = state.posX[b] - state.posX[a];
    const dy = state.posY[b] - state.posY[a];
    const distance = Math.hypot(dx, dy);

    if (distance < 0.001) {
      continue;
    }

    const stretch = distance - rest;
    const force = (config.springStrength * stretch) / distance;
    const fx = dx * force;
    const fy = dy * force;

    state.velX[a] += fx;
    state.velY[a] += fy;
    state.velX[b] -= fx;
    state.velY[b] -= fy;
  }

  for (let i = 0; i < state.nodeCount; i += 1) {
    state.velX[i] += (state.restX[i] - state.posX[i]) * config.returnForce;
    state.velY[i] += (state.restY[i] - state.posY[i]) * config.returnForce;
    state.velX[i] *= config.damping;
    state.velY[i] *= config.damping;
    state.posX[i] += state.velX[i];
    state.posY[i] += state.velY[i];
  }
}

function tensionColor(tension) {
  const value = clamp(tension, 0, 1);

  if (value < 0.24) {
    const t = value / 0.24;
    return {
      r: 20 + t * 14,
      g: 78 + t * 36,
      b: 66 + t * 28,
      a: 0.12 + t * 0.1,
    };
  }

  if (value < 0.62) {
    const t = (value - 0.24) / 0.38;
    return {
      r: 24 + t * 34,
      g: 94 + t * 70,
      b: 78 + t * 76,
      a: 0.22 + t * 0.24,
    };
  }

  const t = (value - 0.62) / 0.38;
  return {
    r: 58 + t * 92,
    g: 164 + t * 66,
    b: 154 + t * 78,
    a: 0.46 + t * 0.28,
  };
}

function renderSignals() {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  for (const signal of state.signals) {
    if (signal.delay > 0) {
      continue;
    }

    const head = signalHeadProgress(signal);
    const tail = clamp(signal.tailProgress ?? Math.max(0, head - signal.trail), 0, head);

    if (head <= 0 || head - tail < 0.002) {
      continue;
    }

    const laneAlpha = signal.kind === "manual" ? 0.07 : 0.042;
    const coreAlpha = signal.kind === "manual" ? 0.34 : 0.24;
    strokeSignalComet(signal, tail, head, 3.5, laneAlpha, "90, 222, 200");
    strokeSignalComet(signal, tail, head, 0.92, coreAlpha, "220, 255, 247");

    const headPoint = pointOnSignal(signal, head);
    const marker = signal.kind === "manual" ? 2.9 : 2.1;
    const resolveFadeWindow = signal.kind === "manual" ? 0.34 : 0.22;
    const resolveFade = signal.resolved ? 1 - smootherStep(signal.resolveAge / resolveFadeWindow) : 1;
    const headAlpha = (signal.resolved ? 0.18 : 0.28 + signal.intensity * 0.32) * resolveFade;

    if (headAlpha > 0.012) {
      const markerSize = marker * (0.72 + resolveFade * 0.28);
      ctx.fillStyle = `rgba(215, 255, 247, ${headAlpha.toFixed(3)})`;
      ctx.fillRect(headPoint.x - markerSize * 0.5, headPoint.y - markerSize * 0.5, markerSize, markerSize);
    }
  }

  ctx.restore();
}

function strokeSignalComet(signal, fromT, toT, maxWidth, baseAlpha, color) {
  const span = toT - fromT;

  if (span <= 0.002) {
    return;
  }

  const intakeFade = signal.resolved ? 0.72 + (1 - signal.tailProgress) * 0.28 : 1;
  const bedAlpha = baseAlpha * signal.intensity * 0.22 * intakeFade;
  strokeSignalPath(signal, fromT, toT, maxWidth * 0.42, `rgba(${color}, ${bedAlpha.toFixed(3)})`);

  const pieces = signal.kind === "manual" ? 24 : 30;
  const step = span / pieces;
  const overlap = step * 0.86;

  for (let piece = 0; piece < pieces; piece += 1) {
    const localStart = piece / pieces;
    const localEnd = (piece + 1) / pieces;
    const localCenter = (localStart + localEnd) * 0.5;
    const start = fromT + span * localStart - overlap * 0.5;
    const end = fromT + span * localEnd + overlap * 0.5;
    const headWeight = smootherStep(localCenter);
    const tailWeight = smootherStep(clamp(localCenter * 1.16, 0, 1));
    const alpha = baseAlpha * signal.intensity * (0.18 + headWeight * 0.82) * tailWeight * intakeFade;
    const width = lerp(maxWidth * 0.16, maxWidth, headWeight);

    strokeSignalPath(signal, start, end, width, `rgba(${color}, ${alpha.toFixed(3)})`);
  }
}

function strokeSignalPath(signal, fromT, toT, lineWidth, strokeStyle) {
  const startDistance = clamp(fromT, 0, 1) * signal.totalLength;
  const endDistance = clamp(toT, 0, 1) * signal.totalLength;
  let hasPath = false;

  ctx.beginPath();
  ctx.lineCap = "square";
  ctx.lineJoin = "miter";

  for (const segment of signal.segments) {
    const segmentStart = segment.offset;
    const segmentEnd = segment.offset + segment.length;
    const clippedStart = Math.max(startDistance, segmentStart);
    const clippedEnd = Math.min(endDistance, segmentEnd);

    if (clippedEnd <= clippedStart) {
      continue;
    }

    const t0 = (clippedStart - segmentStart) / segment.length;
    const t1 = (clippedEnd - segmentStart) / segment.length;
    const x0 = lerp(segment.x1, segment.x2, t0);
    const y0 = lerp(segment.y1, segment.y2, t0);
    const x1 = lerp(segment.x1, segment.x2, t1);
    const y1 = lerp(segment.y1, segment.y2, t1);

    if (!hasPath) {
      ctx.moveTo(x0, y0);
      hasPath = true;
    } else {
      ctx.lineTo(x0, y0);
    }

    ctx.lineTo(x1, y1);
  }

  if (!hasPath) {
    return;
  }

  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
}

function renderSweeps(time) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  for (const sweep of state.sweeps) {
    const progress = clamp(sweep.age / sweep.life, 0, 1);
    const radius = easeOutCubic(progress) * sweep.maxRadius;
    const fade = 1 - smootherStep(Math.max(0, progress - 0.64) / 0.36);
    const ripple = Math.sin(time * 7 + sweep.phase) * 0.5 + 0.5;
    const spoke = sweep.phase + easeInOutSine(progress) * Math.PI * 1.15;
    const wedge = 0.72 - progress * 0.18;
    const gradient = ctx.createRadialGradient(sweep.x, sweep.y, 0, sweep.x, sweep.y, Math.max(radius, 1));

    gradient.addColorStop(0, `rgba(190, 255, 242, ${(0.018 * fade).toFixed(3)})`);
    gradient.addColorStop(0.62, `rgba(96, 224, 203, ${(0.044 * fade).toFixed(3)})`);
    gradient.addColorStop(1, "rgba(12, 62, 52, 0)");

    ctx.beginPath();
    ctx.moveTo(sweep.x, sweep.y);
    ctx.arc(sweep.x, sweep.y, radius, spoke - wedge, spoke + wedge * 0.48);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(sweep.x, sweep.y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(203, 255, 245, ${(0.17 * fade).toFixed(3)})`;
    ctx.lineWidth = 0.7 + ripple * 0.5;
    ctx.stroke();

    if (radius > state.spacingX * 1.4) {
      ctx.beginPath();
      ctx.arc(sweep.x, sweep.y, radius - state.spacingX * 1.25, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(98, 220, 199, ${(0.048 * fade).toFixed(3)})`;
      ctx.lineWidth = 0.55;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.moveTo(sweep.x, sweep.y);
    ctx.lineTo(sweep.x + Math.cos(spoke) * radius, sweep.y + Math.sin(spoke) * radius);
    ctx.strokeStyle = `rgba(228, 255, 250, ${(0.11 * fade).toFixed(3)})`;
    ctx.lineWidth = 0.7;
    ctx.stroke();
  }

  ctx.restore();
}

function labelAlphaForFinding(finding) {
  const progress = clamp(finding.age / finding.life, 0, 1);
  const enter = smootherStep(finding.age / 0.28);
  const exit = 1 - smootherStep(Math.max(0, progress - 0.68) / 0.32);
  const kindWeight = finding.kind === "manual" ? 0.95 : 0.68;

  return enter * exit * kindWeight * clamp(0.72 + finding.strength * 0.24, 0, 1);
}

function uniqueOffsets(offsets) {
  const seen = new Set();
  return offsets.filter((offset) => {
    const key = `${offset.x},${offset.y},${offset.anchor}`;
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function labelRectForOffset(point, width, height, offset) {
  const left = offset.anchor === "right" ? point.x + offset.x - width : point.x + offset.x;
  const top = point.y + offset.y;

  return {
    left,
    top,
    right: left + width,
    bottom: top + height,
  };
}

function resolveLabelLayout(finding, point, occupiedRects) {
  const label = finding.label;
  const height = labelMetrics.height;
  const width =
    Math.ceil(ctx.measureText(label.text).width) +
    (label.icon
      ? labelMetrics.textLeft + labelMetrics.textRight
      : labelMetrics.iconLeft + labelMetrics.textRight);
  const margin = 12;
  const baseOffset = label.offset ?? labelOffsetForPoint(finding.index);
  const candidateOffsets = uniqueOffsets([
    baseOffset,
    { x: 17, y: -30, anchor: "left" },
    { x: 17, y: 14, anchor: "left" },
    { x: -17, y: -30, anchor: "right" },
    { x: -17, y: 14, anchor: "right" },
  ]);

  for (const offset of candidateOffsets) {
    const rect = labelRectForOffset(point, width, height, offset);
    const inBounds =
      rect.left >= margin && rect.right <= state.width - margin && rect.top >= margin && rect.bottom <= state.height - margin;
    const hasCollision = occupiedRects.some((occupied) => rectsOverlap(rect, occupied));

    if (inBounds && !hasCollision) {
      return {
        rect,
        offset,
        width,
        height,
      };
    }
  }

  return null;
}

function drawFigmaTagIcon(icon, x, y, label, alpha) {
  const meta = tagIconMeta[icon];
  const image = tagIconImages[icon];

  if (!meta || !image?.complete || !image.naturalWidth || label?.type !== "user" || !meta.tones.includes(label.tone)) {
    return false;
  }

  const [left, top, right, bottom] = meta.inset;
  const iconLeft = x - labelMetrics.iconSize * 0.5;
  const iconTop = y - labelMetrics.iconSize * 0.5;

  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    image,
    iconLeft + left,
    iconTop + top,
    labelMetrics.iconSize - left - right,
    labelMetrics.iconSize - top - bottom,
  );
  ctx.restore();
  return true;
}

function drawSignalIcon(icon, x, y, tone, alpha, label = null) {
  if (drawFigmaTagIcon(icon, x, y, label, alpha)) {
    return;
  }

  ctx.save();
  ctx.strokeStyle = rgba(tone.text, alpha);
  ctx.fillStyle = rgba(tone.text, alpha);
  ctx.lineWidth = 1.35;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (icon === "target") {
    ctx.beginPath();
    ctx.arc(x, y, 5.4, 0, Math.PI * 2);
    ctx.moveTo(x - 8, y);
    ctx.lineTo(x - 4.2, y);
    ctx.moveTo(x + 4.2, y);
    ctx.lineTo(x + 8, y);
    ctx.moveTo(x, y - 8);
    ctx.lineTo(x, y - 4.2);
    ctx.moveTo(x, y + 4.2);
    ctx.lineTo(x, y + 8);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y, 1.9, 0, Math.PI * 2);
    ctx.stroke();
  } else if (icon === "bolt") {
    ctx.beginPath();
    ctx.moveTo(x + 1, y - 8);
    ctx.lineTo(x - 4.2, y + 0.4);
    ctx.lineTo(x + 0.4, y + 0.4);
    ctx.lineTo(x - 1, y + 8);
    ctx.lineTo(x + 5.2, y - 1.1);
    ctx.lineTo(x + 0.7, y - 1.1);
    ctx.closePath();
    ctx.stroke();
  } else if (icon === "order") {
    ctx.beginPath();
    ctx.arc(x, y, 5.5, 0.25, Math.PI * 1.78);
    ctx.lineTo(x - 2.2, y - 5.4);
    ctx.moveTo(x, y);
    ctx.lineTo(x + 4.1, y - 2.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + 6.1, y - 3.8, 1.4, 0, Math.PI * 2);
    ctx.fill();
  } else if (icon === "stack") {
    ctx.strokeRect(x - 6.5, y + 0.4, 9, 5);
    ctx.strokeRect(x - 2.5, y - 5.5, 9, 5);
    ctx.beginPath();
    ctx.moveTo(x + 4.5, y - 7.8);
    ctx.lineTo(x + 7.2, y - 7.8);
    ctx.lineTo(x + 7.2, y - 5);
    ctx.stroke();
  } else if (icon === "alert") {
    ctx.beginPath();
    ctx.moveTo(x, y - 7.2);
    ctx.lineTo(x + 7.1, y + 6);
    ctx.lineTo(x - 7.1, y + 6);
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y - 2.3);
    ctx.lineTo(x, y + 2.2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y + 4.7, 0.7, 0, Math.PI * 2);
    ctx.fill();
  } else if (icon === "civic") {
    ctx.beginPath();
    ctx.moveTo(x - 7.2, y - 1.8);
    ctx.lineTo(x, y - 7.2);
    ctx.lineTo(x + 7.2, y - 1.8);
    ctx.moveTo(x - 5.4, y - 1.8);
    ctx.lineTo(x - 5.4, y + 5.4);
    ctx.moveTo(x, y - 1.8);
    ctx.lineTo(x, y + 5.4);
    ctx.moveTo(x + 5.4, y - 1.8);
    ctx.lineTo(x + 5.4, y + 5.4);
    ctx.moveTo(x - 7, y + 5.4);
    ctx.lineTo(x + 7, y + 5.4);
    ctx.stroke();
  } else if (icon === "coin") {
    ctx.beginPath();
    ctx.arc(x, y, 6.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x - 1.8, y - 4.2);
    ctx.lineTo(x - 1.8, y + 4.2);
    ctx.moveTo(x - 2.8, y - 3.6);
    ctx.lineTo(x + 1.4, y - 3.6);
    ctx.quadraticCurveTo(x + 4.2, y - 3.6, x + 4.2, y - 1.3);
    ctx.quadraticCurveTo(x + 4.2, y + 0.4, x + 1.4, y + 0.4);
    ctx.moveTo(x - 2.8, y + 0.4);
    ctx.lineTo(x + 1.8, y + 0.4);
    ctx.quadraticCurveTo(x + 4.4, y + 0.4, x + 4.4, y + 2.4);
    ctx.quadraticCurveTo(x + 4.4, y + 4.2, x + 1.3, y + 4.2);
    ctx.lineTo(x - 2.8, y + 4.2);
    ctx.stroke();
  } else if (icon === "sports") {
    ctx.beginPath();
    ctx.arc(x, y, 6.2, 0, Math.PI * 2);
    ctx.moveTo(x - 6.2, y);
    ctx.quadraticCurveTo(x, y - 2.2, x + 6.2, y);
    ctx.moveTo(x - 6.2, y);
    ctx.quadraticCurveTo(x, y + 2.2, x + 6.2, y);
    ctx.moveTo(x, y - 6.2);
    ctx.quadraticCurveTo(x - 2, y, x, y + 6.2);
    ctx.moveTo(x, y - 6.2);
    ctx.quadraticCurveTo(x + 2, y, x, y + 6.2);
    ctx.stroke();
  } else if (icon === "flame") {
    ctx.beginPath();
    ctx.moveTo(x - 0.6, y + 6.6);
    ctx.bezierCurveTo(x - 6.1, y + 3.9, x - 4.8, y - 2.1, x - 1.5, y - 4.8);
    ctx.bezierCurveTo(x - 1.6, y - 1.4, x + 2.3, y - 2.5, x + 1.7, y - 7.4);
    ctx.bezierCurveTo(x + 6.2, y - 3.8, x + 6.2, y + 3.2, x + 0.7, y + 6.6);
    ctx.stroke();
  } else if (icon === "whale") {
    ctx.beginPath();
    ctx.moveTo(x - 7.2, y + 1.1);
    ctx.quadraticCurveTo(x - 3.2, y - 5.8, x + 4.8, y - 2.6);
    ctx.quadraticCurveTo(x + 7.6, y - 1.3, x + 7.1, y + 1.8);
    ctx.quadraticCurveTo(x + 2.1, y + 6.1, x - 5.9, y + 3.4);
    ctx.lineTo(x - 7.2, y + 1.1);
    ctx.moveTo(x + 5.6, y - 2.1);
    ctx.lineTo(x + 8.2, y - 5.2);
    ctx.moveTo(x + 5.7, y - 1.5);
    ctx.lineTo(x + 8.8, y + 0.4);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x - 2.2, y - 1.1, 0.7, 0, Math.PI * 2);
    ctx.fill();
  } else if (icon === "medal") {
    ctx.beginPath();
    ctx.moveTo(x - 3.6, y - 7);
    ctx.lineTo(x - 1.1, y - 2.6);
    ctx.moveTo(x + 3.6, y - 7);
    ctx.lineTo(x + 1.1, y - 2.6);
    ctx.arc(x, y + 1.8, 4.8, 0, Math.PI * 2);
    ctx.stroke();
  } else if (icon === "brain") {
    ctx.beginPath();
    ctx.arc(x - 3.5, y - 2.2, 2.7, Math.PI * 0.3, Math.PI * 1.75);
    ctx.arc(x + 0.8, y - 3.2, 3.1, Math.PI * 1.05, Math.PI * 2.15);
    ctx.arc(x + 3.8, y + 0.6, 2.8, Math.PI * 1.45, Math.PI * 0.55, true);
    ctx.arc(x - 1.8, y + 2.6, 3.1, Math.PI * 0.05, Math.PI * 1.08);
    ctx.moveTo(x, y - 5.4);
    ctx.lineTo(x, y + 5.6);
    ctx.stroke();
  } else if (icon === "pnl") {
    ctx.beginPath();
    ctx.moveTo(x - 7, y - 2.5);
    ctx.lineTo(x + 6.5, y - 2.5);
    ctx.lineTo(x + 3.8, y - 5.2);
    ctx.moveTo(x + 6.5, y - 2.5);
    ctx.lineTo(x + 3.8, y + 0.2);
    ctx.moveTo(x - 1.2, y - 2.5);
    ctx.lineTo(x - 1.2, y + 6.2);
    ctx.stroke();
  } else if (icon === "wave") {
    ctx.beginPath();
    for (let i = 0; i <= 18; i += 1) {
      const t = i / 18;
      const px = x - 7.5 + t * 15;
      const py = y + Math.sin(t * Math.PI * 4) * 4.4;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  } else if (icon === "spiral") {
    ctx.beginPath();
    for (let i = 0; i <= 28; i += 1) {
      const t = i / 28;
      const angle = t * Math.PI * 3.2;
      const radius = 1.2 + t * 5.5;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  } else if (icon === "short") {
    ctx.beginPath();
    ctx.moveTo(x - 7.3, y);
    ctx.lineTo(x + 5, y);
    ctx.moveTo(x - 7.3, y);
    ctx.lineTo(x - 5.2, y - 2.1);
    ctx.moveTo(x - 7.3, y);
    ctx.lineTo(x - 5.2, y + 2.1);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x + 6.5, y, 1.2, 0, Math.PI * 2);
    ctx.fill();
  } else if (icon === "veteran") {
    ctx.beginPath();
    ctx.moveTo(x - 5, y - 6);
    ctx.lineTo(x + 5, y - 6);
    ctx.lineTo(x + 3.2, y + 2.2);
    ctx.quadraticCurveTo(x, y + 5.6, x - 3.2, y + 2.2);
    ctx.closePath();
    ctx.moveTo(x - 5, y - 3.7);
    ctx.lineTo(x - 7.4, y - 2.3);
    ctx.moveTo(x + 5, y - 3.7);
    ctx.lineTo(x + 7.4, y - 2.3);
    ctx.stroke();
  } else if (icon === "spark") {
    ctx.beginPath();
    ctx.moveTo(x, y - 7.2);
    ctx.lineTo(x + 2.1, y - 2.1);
    ctx.lineTo(x + 7.2, y);
    ctx.lineTo(x + 2.1, y + 2.1);
    ctx.lineTo(x, y + 7.2);
    ctx.lineTo(x - 2.1, y + 2.1);
    ctx.lineTo(x - 7.2, y);
    ctx.lineTo(x - 2.1, y - 2.1);
    ctx.closePath();
    ctx.stroke();
  } else if (icon === "flip") {
    ctx.beginPath();
    ctx.moveTo(x - 7.2, y - 5.2);
    ctx.lineTo(x - 2, y - 1.2);
    ctx.lineTo(x - 7.2, y + 2.8);
    ctx.closePath();
    ctx.moveTo(x + 7.2, y + 5.2);
    ctx.lineTo(x + 2, y + 1.2);
    ctx.lineTo(x + 7.2, y - 2.8);
    ctx.closePath();
    ctx.moveTo(x - 0.8, y - 5.8);
    ctx.lineTo(x + 1.8, y - 3.2);
    ctx.moveTo(x + 0.8, y + 5.8);
    ctx.lineTo(x - 1.8, y + 3.2);
    ctx.stroke();
  } else if (icon === "bot") {
    ctx.strokeRect(x - 6.4, y - 2.8, 12.8, 7.8);
    ctx.beginPath();
    ctx.moveTo(x, y - 2.8);
    ctx.lineTo(x, y - 6);
    ctx.arc(x, y - 6.8, 1, 0, Math.PI * 2);
    ctx.moveTo(x - 2.8, y + 1);
    ctx.lineTo(x - 2.8, y + 1.1);
    ctx.moveTo(x + 2.8, y + 1);
    ctx.lineTo(x + 2.8, y + 1.1);
    ctx.stroke();
  } else if (icon === "oneHit") {
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.moveTo(x - 7.4, y);
    ctx.lineTo(x + 7.4, y);
    ctx.moveTo(x, y - 7.4);
    ctx.lineTo(x, y + 7.4);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.moveTo(x - 7, y + 6);
    ctx.lineTo(x - 7, y - 5);
    ctx.moveTo(x - 7, y + 6);
    ctx.lineTo(x + 7, y + 6);
    ctx.moveTo(x - 4.5, y + 2.5);
    ctx.lineTo(x - 1.5, y - 0.5);
    ctx.lineTo(x + 1.7, y + 1.3);
    ctx.lineTo(x + 5.8, y - 4.5);
    ctx.stroke();
  }

  ctx.restore();
}

function drawFindingLabel(finding, point, layout, alpha) {
  const label = finding.label;
  const tone = labelToneStyles[label.tone] ?? labelToneStyles.status;
  const rect = layout.rect;
  const midY = rect.top + layout.height * 0.5;
  const lineEndX = layout.offset.anchor === "right" ? rect.right : rect.left;
  const firstBendX = point.x + (lineEndX > point.x ? 8 : -8);

  ctx.beginPath();
  ctx.moveTo(point.x, point.y);
  ctx.lineTo(firstBendX, point.y);
  ctx.lineTo(lineEndX, midY);
  ctx.strokeStyle = rgba(tone.stroke, alpha * 0.72);
  ctx.lineWidth = 0.65;
  ctx.stroke();

  ctx.fillStyle = rgba(tone.fill, alpha);
  ctx.strokeStyle = rgba(tone.stroke, alpha);
  ctx.lineWidth = 1;
  ctx.fillRect(rect.left + 0.5, rect.top + 0.5, layout.width - 1, layout.height - 1);
  ctx.strokeRect(rect.left + 0.5, rect.top + 0.5, layout.width - 1, layout.height - 1);

  if (label.icon) {
    drawSignalIcon(label.icon, rect.left + labelMetrics.iconCenter, midY, tone, alpha, label);
  }

  ctx.fillStyle = rgba(tone.text, alpha);
  ctx.fillText(label.text, rect.left + (label.icon ? labelMetrics.textLeft : labelMetrics.iconLeft), midY + 0.5);
}

function renderFindings(time) {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";

  for (const finding of state.findings) {
    const progress = clamp(finding.age / finding.life, 0, 1);
    const point = {
      x: state.posX[finding.index],
      y: state.posY[finding.index],
    };
    const pulse = 0.82 + Math.sin(time * 5.2 + finding.phase) * 0.18;
    const alpha = (1 - progress) * finding.strength * pulse;
    const size = finding.kind === "manual" ? 4.2 : 3.3;

    ctx.fillStyle = `rgba(218, 255, 247, ${(0.18 + alpha * 0.42).toFixed(3)})`;
    ctx.fillRect(point.x - size * 0.5, point.y - size * 0.5, size, size);

    ctx.strokeStyle = `rgba(120, 232, 212, ${(alpha * 0.2).toFixed(3)})`;
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(point.x - size * 2.1, point.y);
    ctx.lineTo(point.x - size * 0.95, point.y);
    ctx.moveTo(point.x + size * 0.95, point.y);
    ctx.lineTo(point.x + size * 2.1, point.y);
    ctx.moveTo(point.x, point.y - size * 2.1);
    ctx.lineTo(point.x, point.y - size * 0.95);
    ctx.moveTo(point.x, point.y + size * 0.95);
    ctx.lineTo(point.x, point.y + size * 2.1);
    ctx.stroke();
  }

  ctx.restore();

  const labeledFindings = state.findings.filter((finding) => finding.label);
  if (labeledFindings.length === 0) {
    return;
  }

  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.font = "10px JetBrainsMono, monospace";
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";

  const occupiedRects = [...getProtectedRects()];
  labeledFindings.sort((a, b) => b.strength - a.strength);

  for (const finding of labeledFindings) {
    const alpha = labelAlphaForFinding(finding);

    if (alpha < 0.04) {
      continue;
    }

    const point = {
      x: state.posX[finding.index],
      y: state.posY[finding.index],
    };
    const layout = resolveLabelLayout(finding, point, occupiedRects);

    if (!layout) {
      continue;
    }

    drawFindingLabel(finding, point, layout, alpha);
    occupiedRects.push(expandedRect(layout.rect, 4));
  }

  ctx.restore();
}

function renderGrid(time) {
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = reduceMotion.matches ? "rgba(6, 25, 21, 0.95)" : "rgba(6, 25, 21, 0.5)";
  ctx.fillRect(0, 0, state.width, state.height);

  if (state.screenFlash > 0.001) {
    ctx.fillStyle = `rgba(110, 232, 210, ${state.screenFlash.toFixed(4)})`;
    ctx.fillRect(0, 0, state.width, state.height);
    state.screenFlash *= 0.88;
  }

  const avgSpacing = (state.spacingX + state.spacingY) * 0.5;
  const tensionScale = 1 / (avgSpacing * 0.4);
  const breathe = 0.86 + Math.sin(time * 0.62) * 0.08;
  const springCount = state.springs.length / 3;

  ctx.globalCompositeOperation = "lighter";
  ctx.lineCap = "round";

  for (let spring = 0; spring < springCount; spring += 1) {
    const offset = spring * 3;
    const a = state.springs[offset];
    const b = state.springs[offset + 1];
    const rest = state.springs[offset + 2];
    const dx = state.posX[b] - state.posX[a];
    const dy = state.posY[b] - state.posY[a];
    const distance = Math.hypot(dx, dy);
    const stretch = Math.abs(distance - rest);
    const tension = stretch * tensionScale;
    const color = tensionColor(tension);

    ctx.beginPath();
    ctx.moveTo(state.posX[a], state.posY[a]);
    ctx.lineTo(state.posX[b], state.posY[b]);
    ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${((0.022 + tension * 0.042) * breathe).toFixed(4)})`;
    ctx.lineWidth = 1.4 + tension * 2.1;
    ctx.stroke();
  }

  for (let spring = 0; spring < springCount; spring += 1) {
    const offset = spring * 3;
    const a = state.springs[offset];
    const b = state.springs[offset + 1];
    const rest = state.springs[offset + 2];
    const dx = state.posX[b] - state.posX[a];
    const dy = state.posY[b] - state.posY[a];
    const distance = Math.hypot(dx, dy);
    const stretch = Math.abs(distance - rest);
    const tension = stretch * tensionScale;
    const color = tensionColor(tension);

    ctx.beginPath();
    ctx.moveTo(state.posX[a], state.posY[a]);
    ctx.lineTo(state.posX[b], state.posY[b]);
    ctx.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${((0.066 + tension * 0.15) * breathe).toFixed(4)})`;
    ctx.lineWidth = 0.34 + tension * 0.72;
    ctx.stroke();
  }

  renderSweeps(time);
  renderSignals();
  renderFindings(time);

  for (let i = 0; i < state.nodeCount; i += 1) {
    const speed = Math.hypot(state.velX[i], state.velY[i]);
    const brightness = clamp(speed * 0.18, 0, 1);

    if (brightness < 0.025 && !reduceMotion.matches) {
      continue;
    }

    const alpha = reduceMotion.matches ? 0.1 : 0.075 + brightness * 0.24;
    const radius = reduceMotion.matches ? 0.72 : 0.5 + brightness * 0.75;

    ctx.beginPath();
    ctx.arc(state.posX[i], state.posY[i], radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(126, 230, 208, ${alpha.toFixed(3)})`;
    ctx.fill();
  }

}

function tick(now) {
  const time = now * 0.001;
  const dt = state.lastTime === 0 ? 0.016 : Math.min(time - state.lastTime, 0.1);
  state.lastTime = time;

  if (!reduceMotion.matches) {
    state.signalClock += dt;
    if (state.signalClock >= state.signalEvery) {
      spawnSignal();
      state.signalClock = 0;
      state.signalEvery = 0.96 + Math.random() * 1.18;
    }

    state.autoSweepClock += dt;
    if (state.autoSweepClock >= state.autoSweepEvery && !state.pointerDown) {
      triggerAutoSweep();
      state.autoSweepClock = 0;
    }

    updateSignals(dt, time);
    updateSweeps(dt);
    updateFindings(dt);
    simulate();
  }

  renderGrid(time);
  window.requestAnimationFrame(tick);
}

function pointerPosition(event) {
  if ("touches" in event && event.touches.length > 0) {
    return {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
  }

  return {
    x: event.clientX,
    y: event.clientY,
  };
}

window.addEventListener("pointerdown", (event) => {
  if (reduceMotion.matches) {
    return;
  }

  state.pointerDown = true;
  state.autoSweepClock = 0;
  const point = pointerPosition(event);
  applyImpulseFromPoint(point.x, point.y);
});

window.addEventListener("pointermove", (event) => {
  if (!state.pointerDown || reduceMotion.matches) {
    return;
  }

  const point = pointerPosition(event);
  applyImpulseFromPoint(point.x, point.y, config.pointerDragStrength, false);
});

window.addEventListener("pointerup", () => {
  state.pointerDown = false;
});

window.addEventListener("pointercancel", () => {
  state.pointerDown = false;
});

window.addEventListener("resize", resize);
reduceMotion.addEventListener("change", () => {
  state.lastTime = 0;
  resize();
});

prepareCalibrationText();
resize();
renderGrid(0);
window.requestAnimationFrame(tick);
