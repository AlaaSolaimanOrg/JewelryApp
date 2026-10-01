export interface InventorySummaryData {
  totalProducts: number;
  totalQuantity: number;
  totalWeight: number;
  totalValue: number;
}

export interface InventorySummaryProps {
  summary: InventorySummaryData | null;
}
