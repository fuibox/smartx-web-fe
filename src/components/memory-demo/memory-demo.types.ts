export type MemoryDomainId = "interests" | "signals" | "trading-style" | "edge";

export type MemoryDimension = {
  id: string;
  label: string;
  description: string;
  weight: number;
};

export type MemoryDomain = {
  id: MemoryDomainId;
  label: string;
  shortLabel: string;
  summary: string;
  updateLabel: string;
  value: number;
  previous: number;
  color: string;
  dimensions: MemoryDimension[];
};
