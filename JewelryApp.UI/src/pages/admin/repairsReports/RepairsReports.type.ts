export type RepairRecordStatus =
  | "progress"
  | "ready"
  | "notified"
  | "completed"
  | "cancelled";

export interface RepairRecord {
  id: string;
  customer: string;
  phone: string;
  notes: string;
  cost: number;
  paid: boolean;
  status: RepairRecordStatus;
  orderDate: string;
  dueDate: string;
  pickedUpDate: string | null;
}

export type Period = "month" | "year" | "all" | "custom";

export interface DateRange {
  dateFrom: string;
  dateTo: string;
}

export interface ChartDataPoint {
  label: string;
  value: number;
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
  id: string;
  customer: string;
  days: number;
}

export interface RepairAlert {
  repairId: string;
  customer: string;
  message: string;
  cost: number;
  priority: number;
}

export interface RepairStats {
  repairCount: number;
  prevRepairCount: number | null;
  totalRevenue: number;
  prevRevenue: number | null;
  paidCount: number;
  totalAll: number;
  unpaidTotal: number;
  unpaidCount: number;
  avgVal: number;
  avgTurn: number;
  periodLabel: string;
  prevLabel: string;
}

export interface ChartResult {
  title: string;
  data: ChartDataPoint[];
}

export interface HealthMetrics {
  onTimeRate: number;
  onTimeCount: number;
  collectRate: number;
  cancelRate: number;
  cancelCount: number;
  completedCount: number;
  totalCount: number;
}
