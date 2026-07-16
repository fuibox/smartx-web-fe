import type { MarketDemoData, TradeMemoryEvent } from "./market-demo.types";
import { createMarketChartPaths } from "./market-demo-chart";

const chartPaths = createMarketChartPaths();

export const fedRateMarketFixture: MarketDemoData = {
  id: "fed-september-rate-cut",
  category: "Macro / Monetary policy",
  question: "Will the Fed cut rates at the September meeting?",
  symbol: "F",
  probability: 68.4,
  probabilityDelta: 11.8,
  volume: "$18.6M",
  evidence: [
    {
      id: "fast-move-14m",
      label: "Fast move",
      headline: "Probability +8.2 pts in 14m",
      detail: "Velocity broke the market's 30-day range.",
      age: "2m ago",
      tone: "fast",
    },
    {
      id: "smart-money-entry",
      label: "Smart money",
      headline: "YES net flow +$4.8M",
      detail: "14 tracked wallets are accumulating.",
      age: "7m ago",
      tone: "smart",
    },
    {
      id: "cpi-rate-context",
      label: "News",
      headline: "CPI miss reprices cuts",
      detail: "The latest print shifted rate expectations.",
      age: "11m ago",
      tone: "news",
    },
    {
      id: "capital-structure",
      label: "Capital structure",
      headline: "YES takes 63% of 1h flow",
      detail: "Large orders are concentrated above 66¢.",
      age: "Live",
      tone: "structure",
    },
    {
      id: "related-markets",
      label: "Related markets",
      headline: "2Y yield market -3.1 pts",
      detail: "Adjacent rate markets confirm the direction.",
      age: "4m ago",
      tone: "related",
    },
  ],
  ranges: ["1H", "1D", "1W", "ALL"],
  chart: {
    label: "YES probability",
    linePath: chartPaths.linePath,
    areaPath: chartPaths.areaPath,
    endpoint: chartPaths.endpoint,
    times: ["10:00", "14:00", "18:00", "22:00"],
  },
  outcomes: [
    { id: "yes", label: "Buy Yes", price: 68.4 },
    { id: "no", label: "Buy No", price: 31.6 },
  ],
  defaultAmount: 1000,
};

export const fedRateTradeMemoryEvent = {
  eventId: "fed-september-rate-cut-yes-1000",
  marketId: fedRateMarketFixture.id,
  marketQuestion: fedRateMarketFixture.question,
  outcome: "yes",
  amount: fedRateMarketFixture.defaultAmount,
  price: fedRateMarketFixture.outcomes[0].price,
  probabilityAtDecision: fedRateMarketFixture.probability,
  evidenceIds: fedRateMarketFixture.evidence.map((item) => item.id),
  source: "website-demo",
} satisfies TradeMemoryEvent;
