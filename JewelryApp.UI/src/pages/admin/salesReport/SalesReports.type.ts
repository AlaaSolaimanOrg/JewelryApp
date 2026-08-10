export type Period = "today" | "week" | "month" | "year" | "all" | "custom";

export interface DateRange {
  dateFrom: string;
  dateTo: string;
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface TopCustomer {
  name: string;
  transactions: number;
  spent: number;
}

export interface StaticPeriodStats {
  refunds: number;
  itemsSold: number;
  avgSale: number;
  transactions: number;
  unitsChart: ChartPoint[];
  topCustomers: TopCustomer[];
}
