export type MarketEvidenceTone = "fast" | "smart" | "news" | "structure" | "related";

export type MarketEvidence = {
  id: string;
  label: string;
  headline: string;
  detail: string;
  age: string;
  tone: MarketEvidenceTone;
};

export type MarketOutcome = {
  id: "yes" | "no";
  label: string;
  price: number;
};

export type MarketDemoData = {
  id: string;
  category: string;
  question: string;
  symbol: string;
  probability: number;
  probabilityDelta: number;
  volume: string;
  evidence: MarketEvidence[];
  ranges: string[];
  chart: {
    label: string;
    linePath: string;
    areaPath: string;
    endpoint: [number, number];
    times: string[];
  };
  outcomes: MarketOutcome[];
  defaultAmount: number;
};

export type TradeMemoryEvent = {
  eventId: string;
  marketId: string;
  marketQuestion: string;
  outcome: MarketOutcome["id"];
  amount: number;
  price: number;
  probabilityAtDecision: number;
  evidenceIds: string[];
  source: "website-demo";
};
