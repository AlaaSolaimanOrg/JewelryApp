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

export interface PeriodStats {
  purchaseCount: number;
  spent: number;
  spentCash: number;
  spentCard: number;
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
