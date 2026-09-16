export type Period = "month" | "year" | "all" | "custom";

export interface DateRange {
  dateFrom: string;
  dateTo: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface RepairsStats {
  repairCount: number;
  totalRevenue: number;
  paidCount: number;
  totalAll: number;
  unpaidTotal: number;
  unpaidCount: number;
  avgVal: number;
  avgTurn: number;
}

export interface RepairHealthMetrics {
  onTimeRate: number;
  onTimeCount: number;
  collectRate: number;
  cancelRate: number;
  cancelCount: number;
  completedCount: number;
  totalCount: number;
}

export interface RepairAlert {
  repairId: string;
  customer: string;
  message: string;
  cost: number;
  priority: number;
}

export interface CustomerRevenueRow {
  name: string;
  revenue: number;
  count: number;
}

export interface AvgValueHistoryRow {
  label: string;
  avg: number;
  count: number;
  total: number;
}

export interface RepeatCustomerRow {
  name: string;
  count: number;
}

export interface LongestInShopRow {
  repairId: string;
  customer: string;
  days: number;
}
