import type { MemoryDomain } from "./memory-demo.types";

export const MEMORY_DOMAINS: MemoryDomain[] = [
  {
    id: "interests",
    label: "Market interests",
    shortLabel: "Interests",
    summary: "The markets, themes, and assets SmartX should bring forward first.",
    updateLabel: "Macro focus strengthened",
    value: 84,
    previous: 78,
    color: "#36c7e8",
    dimensions: [
      {
        id: "macro",
        label: "Macro",
        weight: 86,
        description: "Rates, CPI, liquidity, and central-bank-sensitive markets move higher in relevance.",
      },
      {
        id: "crypto",
        label: "Crypto",
        weight: 90,
        description: "Crypto-native and ETF-linked markets remain a recurring focus.",
      },
      {
        id: "stocks-etfs",
        label: "Stocks & ETFs",
        weight: 78,
        description: "Equities, sector funds, and event-linked markets stay connected to the macro view.",
      },
    ],
  },
  {
    id: "signals",
    label: "Trusted signals",
    shortLabel: "Signals",
    summary: "The evidence SmartX should assemble before it escalates an opportunity.",
    updateLabel: "Proof pattern reinforced",
    value: 91,
    previous: 86,
    color: "#08dfb5",
    dimensions: [
      {
        id: "smart-money",
        label: "Smart money",
        weight: 94,
        description: "Tracked-wallet flow remains a leading proof layer before action.",
      },
      {
        id: "news",
        label: "News context",
        weight: 86,
        description: "The catalyst must explain why the market is moving, not merely repeat the move.",
      },
      {
        id: "price-move",
        label: "Market movement",
        weight: 83,
        description: "Fast probability shifts trigger inspection when they align with other evidence.",
      },
    ],
  },
  {
    id: "trading-style",
    label: "Trading style",
    shortLabel: "Style",
    summary: "How this user moves from evidence to sizing, execution, and follow-through.",
    updateLabel: "Proof-first execution recorded",
    value: 78,
    previous: 72,
    color: "#ffc45e",
    dimensions: [
      {
        id: "research-first",
        label: "Research first",
        weight: 84,
        description: "Related context is reviewed before committing capital.",
      },
      {
        id: "starter-size",
        label: "Starter sizing",
        weight: 76,
        description: "Initial position size stays measured while a thesis develops.",
      },
      {
        id: "alert-first",
        label: "Alert first",
        weight: 82,
        description: "Trigger conditions often precede a larger follow-up decision.",
      },
    ],
  },
  {
    id: "edge",
    label: "User edge",
    shortLabel: "Edge",
    summary: "Where SmartX can infer advantage only after entry and follow-through are observed.",
    updateLabel: "Entry recorded — outcome pending",
    value: 81,
    previous: 76,
    color: "#ff9b3e",
    dimensions: [
      {
        id: "entry-timing",
        label: "Entry timing",
        weight: 82,
        description: "This entry becomes useful evidence only after subsequent market movement.",
      },
      {
        id: "signal-interpretation",
        label: "Signal interpretation",
        weight: 88,
        description: "SmartX checks whether the evidence acted on remains valid after execution.",
      },
      {
        id: "follow-through",
        label: "Follow-through",
        weight: 77,
        description: "Adds, exits, and protection decisions complete the learning chain.",
      },
    ],
  },
];
