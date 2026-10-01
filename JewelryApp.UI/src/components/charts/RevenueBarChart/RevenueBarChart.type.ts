export interface RevenueBarChartPoint {
  label: string;
  value: number;
}

export interface RevenueBarChartProps {
  data: RevenueBarChartPoint[];
  formatValue: (value: number) => string;
  color?: string;
}
