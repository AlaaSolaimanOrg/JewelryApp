export type Period = "today" | "week" | "month" | "year" | "all";

export interface PurityStockRow {
  karat: string;
  grams: number;
  items: number;
  value: number;
}

export interface CategoryStockRow {
  name: string;
  value: number;
}

export interface AgingBucket {
  label: string;
  count: number;
  sub: string;
  valueColor?: string;
}

export interface StapleItem {
  name: string;
  type: string;
  stock: number;
  lowThreshold: number;
  soldByPeriod: Record<Period, number>;
}

export interface PeriodMovement {
  addedItems: number;
  addedGrams: number;
  soldItems: number;
  soldGrams: number;
  returnedItems: number;
  returnedGrams: number;
  meltedGrams: number;
}

export interface PurityMovementRow {
  karat: string;
  items: number;
  grams: number;
}

export interface PurityMovementByPeriod {
  added: PurityMovementRow[];
  returned: PurityMovementRow[];
}

export interface DateRange {
  dateFrom: string;
  dateTo: string;
}
