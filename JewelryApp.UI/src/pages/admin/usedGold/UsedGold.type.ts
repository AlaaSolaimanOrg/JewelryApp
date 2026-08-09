export type HistoryType = "purchase" | "melt" | "stock";

export type Period = "month" | "year" | "all";

export interface GoldPool {
  weight: number;
  cost: number;
  totalInvested: number;
}

export interface UsedGoldHistoryEntry {
  id: number;
  date: string;
  type: HistoryType;
  desc: string;
  notes: string;
  karat: number | "mixed";
  weight: number;
  cost: number;
}
