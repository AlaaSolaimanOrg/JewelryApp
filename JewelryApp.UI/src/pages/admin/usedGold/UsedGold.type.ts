export type HistoryType = "purchase" | "melt" | "stock";

export enum Period {
  Today = "today",
  Week = "week",
  Month = "month",
  Year = "year",
  All = "all",
}

export interface GoldPool {
  weight: number;
  cost: number;
  totalInvested: number;
}

export interface PoolsResult {
  pools: Record<number, GoldPool>;
  currentPools: Record<number, GoldPool>;
  periodPurchaseCount: number;
  periodSpent: number;
  periodSpentCash: number;
  periodSpentCard: number;
}

export interface UsedGoldHistoryEntry {
  id: string;
  date: string;
  type: HistoryType;
  sellerName: string;
  notes: string;
  karat: number | null;
  weight: number;
  cost: number;
}
