export const STORY_STATES = [
  { id: "hero", progress: 0 },
  { id: "signal", progress: 0.18 },
  { id: "lock", progress: 0.29 },
  { id: "inspection", progress: 0.47 },
  { id: "product", progress: 0.74 },
  { id: "memory", progress: 1 },
] as const;

export const STORY_SNAP_POINTS = STORY_STATES.map((state) => state.progress);

export const STORY_MARKET_END = 0.78;

export const STORY_SCROLL_VIEWPORTS = 5;

/**
 * 时间窗口单一来源。
 *
 * MARKET_SCENE 内所有数值使用 market progress（0..1 覆盖 Hero → Product，
 * 即 story progress 0..STORY_MARKET_END）。窗口写作 [start, end]。
 * GSAP timeline 与 WebGL 场景（motion-lab-scene）都从这里取值，
 * 调整节奏只改这一个文件。
 */
export type SceneWindow = readonly [number, number];

export const MARKET_SCENE = {
  hero: {
    /** Hero CanvasTexture 向宇宙交权的总区间终点（market progress） */
    relayEnd: 0.28,
    copyLift: [0.006, 0.146] as SceneWindow,
    canvasFade: [0.045, 0.155] as SceneWindow,
    backdropFade: [0.05, 0.18] as SceneWindow,
    chromeFade: [0.09, 0.17] as SceneWindow,
    textureFade: [0.115, 0.185] as SceneWindow,
    pointerRelease: 0.16,
    rendererPause: 0.13,
    rendererResume: 0.08,
  },
  universe: {
    /** 首次滚动即开始的相机前推，让接力在星场出现前就有纵深运动 */
    cameraApproach: [0.015, 0.15] as SceneWindow,
    heroDepth: [0.08, 0.24] as SceneWindow,
    starsIn: [0.12, 0.28] as SceneWindow,
    starsOut: [0.72, 0.9] as SceneWindow,
    cameraFlight: [0.14, 0.46] as SceneWindow,
    cameraSignalTrack: [0.28, 0.46] as SceneWindow,
    cameraInspection: [0.4, 0.62] as SceneWindow,
    cameraHandoff: [0.64, 0.84] as SceneWindow,
  },
  meteor: {
    appear: [0.08, 0.16] as SceneWindow,
    /** 每颗流星在 [travelStart+delay, travelEnd+delay] 内走完自己的路径 */
    travelStart: 0.13,
    travelEnd: 0.4,
    dimOthersFrom: 0.28,
    lockFocus: [0.29, 0.37] as SceneWindow,
    targetDeparture: [0.48, 0.58] as SceneWindow,
  },
  lock: {
    frameIn: [0.29, 0.36] as SceneWindow,
    frameOut: [0.48, 0.56] as SceneWindow,
    settle: [0.29, 0.4] as SceneWindow,
  },
  planet: {
    reveal: [0.42, 0.58] as SceneWindow,
    morph: [0.66, 0.84] as SceneWindow,
  },
  orbitPath: {
    /** 汇流语言下该弧线只是 orbit-to-chart 变形的载体：
     * 停留在 Know the Why 时不出现，变形启动前一瞬才现身。 */
    reveal: [0.625, 0.675] as SceneWindow,
    morph: [0.66, 0.84] as SceneWindow,
    fadeOut: [0.78, 0.87] as SceneWindow,
  },
  copy: {
    moveIn: 0.13,
    legendIn: 0.16,
    /** SEE THE MOVE 标题与 legend 保持到 Lock 阶段（第二静态屏）再退出 */
    legendOut: 0.33,
    moveOut: 0.34,
    lockIn: 0.32,
    lockOut: 0.45,
    whyIn: 0.43,
    orbitLegendIn: 0.44,
    evidenceIn: 0.45,
    evidenceInteractiveFrom: 0.49,
    whyOut: 0.64,
    evidenceInteractiveTo: 0.655,
    evidenceOut: 0.66,
    orbitLegendOut: 0.66,
  },
  product: {
    bridgeIn: 0.68,
    shellIn: 0.71,
    frameIn: 0.715,
    chartIn: 0.73,
    partsIn: 0.8,
    bridgeOut: 0.81,
    interactiveFrom: 0.84,
  },
  effects: { on: 0.31, off: 0.25 },
} as const;

/** story progress 空间（0..1 覆盖整页）——Product 之后的 Trade→Memory 尾段。 */
export const STORY_TAIL = {
  tradeCommit: 0.82,
  tradeRelease: 0.68,
  decisionBridge: { place: 0.822, show: 0.824, mid: 0.834, dock: 0.872, hide: 0.925 },
  productExit: 0.835,
  memoryIn: 0.855,
  receiptIn: 0.9,
  memoryInteractive: 0.93,
} as const;

/**
 * Know the Why 的 context 卡屏幕位置（stage 百分比）。
 * overlay 用它排版 DOM 卡片，WebGL 场景用它反投影出证据流的起点，
 * 保证"卡片 → 流 → 行星"始终精确对齐。
 */
export const WHY_CONTEXT_PLACEMENTS = [
  { side: "right", left: 66, top: 24 },
  { side: "right", left: 73, top: 47 },
  { side: "right", left: 66, top: 72 },
  { side: "left", left: 35, top: 71 },
] as const;

export const STORY_SIGNAL_TYPES = [
  {
    label: "Fast move",
    value: "+8.2 pts / 14m",
    tone: "fast",
    color: "#ff9b3e",
  },
  {
    label: "Smart money",
    value: "+$4.8M net flow",
    tone: "smart",
    color: "#36c7e8",
  },
  {
    label: "News catalyst",
    value: "CPI miss / 2m",
    tone: "news",
    color: "#ffc45e",
  },
  {
    label: "Market alert",
    value: "Watching for alignment",
    tone: "watch",
    color: "#91aaa4",
  },
] as const;

export const STORY_EVIDENCE = [
  {
    label: "Fast move",
    navLabel: "Fast move",
    metric: "+8.2 pts",
    headline: "Momentum break",
    detail: "+8.2 pts in 14 minutes",
    tone: "fast",
  },
  {
    label: "Smart money flow",
    navLabel: "Smart money",
    metric: "+$4.8M",
    headline: "YES +$4.8M",
    detail: "14 tracked wallets accumulating",
    tone: "smart",
  },
  {
    label: "Wallet cohort",
    navLabel: "Wallet cohort",
    metric: "9 wallets",
    headline: "Macro specialists",
    detail: "9 recurring high-conviction wallets",
    tone: "cohort",
  },
  {
    label: "News context",
    navLabel: "News context",
    metric: "CPI / 2m",
    headline: "CPI miss reprices cuts",
    detail: "Released 2 minutes ago",
    tone: "news",
  },
] as const;
