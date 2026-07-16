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
    headline: "Momentum break",
    detail: "+8.2 pts in 14 minutes",
    tone: "fast",
  },
  {
    label: "Smart money flow",
    navLabel: "Smart money",
    headline: "YES +$4.8M",
    detail: "14 tracked wallets accumulating",
    tone: "smart",
  },
  {
    label: "Wallet cohort",
    navLabel: "Wallet cohort",
    headline: "Macro specialists",
    detail: "9 recurring high-conviction wallets",
    tone: "cohort",
  },
  {
    label: "News context",
    navLabel: "News context",
    headline: "CPI miss reprices cuts",
    detail: "Released 2 minutes ago",
    tone: "news",
  },
] as const;
