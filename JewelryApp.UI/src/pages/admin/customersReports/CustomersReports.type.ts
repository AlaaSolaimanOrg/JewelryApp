export type Period = "today" | "week" | "month" | "year" | "all" | "custom";

export interface DateRange {
  dateFrom: string;
  dateTo: string;
}

export interface PeriodChartPoint {
  label: string;
  value: number;
}

export interface CustomerReportRow {
  name: string;
  phone: string;
  purchases: number;
  items: number;
  spent: number;
  avgDiscount: number;
  since: string;
  lastPurchase: string;
}

export interface PeriodData {
  active: number;
  newCustomers: number;
  revenue: number;
  newRevenue: number;
  returningRevenue: number;
  avgDiscount: number;
  chart: PeriodChartPoint[];
  customers: CustomerReportRow[];
}

export interface TierMember {
  name: string;
  spent: number;
  purchases: number;
}

export interface CustomerTier {
  name: string;
  minLabel: string;
  color: string;
  bg: string;
  count: number;
  total: number;
  members: TierMember[];
}

export interface AtRiskCustomer {
  name: string;
  lifetime: number;
  purchases: number;
  daysSinceLastPurchase: number;
}
