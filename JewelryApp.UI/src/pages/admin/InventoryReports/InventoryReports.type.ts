export type Period = "today" | "week" | "month" | "year" | "all" | "custom";

export interface DateRange {
  dateFrom: string;
  dateTo: string;
}

export interface InventoryStockSummary {
  itemsInStock: number;
  categoriesCount: number;
  totalWeight: number;
  stockValue: number;
}

export interface StockByPurityRow {
  karatType: number;
  grams: number;
  items: number;
  value: number;
}

export interface StockByCategoryRow {
  categoryName: string;
  value: number;
  items: number;
}

export interface AgingBucketRow {
  label: string;
  itemCount: number;
  totalEstimatedValue: number;
  percentage: number;
}

export interface InventoryAging {
  averageDaysInInventory: number;
  averageTurnoverDays: number;
  agingBuckets: AgingBucketRow[];
}

export interface InventoryMovement {
  addedItems: number;
  addedGrams: number;
  soldItems: number;
  soldGrams: number;
  returnedItems: number;
  returnedGrams: number;
  meltedGrams: number;
}

export interface PurityMovementRow {
  karatType: number;
  items: number;
  grams: number;
}

export interface PurityMovement {
  added: PurityMovementRow[];
  returned: PurityMovementRow[];
}

export interface StapleSold {
  name: string;
  specification: string | null;
  stock: number;
  sold: number;
  isLow: boolean;
}
