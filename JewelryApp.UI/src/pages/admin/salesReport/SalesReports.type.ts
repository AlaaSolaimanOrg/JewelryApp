export type Period = "today" | "week" | "month" | "year" | "all" | "custom";

export interface DateRange {
  dateFrom: string;
  dateTo: string;
}

export interface ChartPoint {
  label: string;
  value: number;
}
