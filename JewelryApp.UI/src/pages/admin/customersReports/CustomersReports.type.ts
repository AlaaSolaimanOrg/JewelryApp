export type Period = "today" | "week" | "month" | "year" | "all" | "custom";

export interface DateRange {
  dateFrom: string;
  dateTo: string;
}

export interface ChartDataPoint {
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
  since: string | null;
  lastPurchase: string | null;
}

export interface CustomerBaseStats {
  totalCustomers: number;
  newThisYear: number;
  repeatRate: number;
  repeatCount: number;
  avgLifetimeValue: number;
  goingQuiet: number;
}

export interface CustomerActivityStats {
  active: number;
  newCustomers: number;
  revenue: number;
  newRevenue: number;
  returningRevenue: number;
  avgDiscount: number;
}

export interface TierMember {
  name: string;
  spent: number;
  purchases: number;
}

export interface CustomerTier {
  name: string;
  minLabel: string;
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
