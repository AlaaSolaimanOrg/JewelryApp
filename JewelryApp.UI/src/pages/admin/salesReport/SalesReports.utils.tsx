import type { Period } from "./SalesReports.type";

export const PERIODS: Exclude<Period, "custom">[] = [
  "today",
  "week",
  "month",
  "year",
  "all",
];

export const PERIOD_LABELS: Record<Period, string> = {
  today: "Today",
  week: "This week",
  month: "This month",
  year: "This year",
  all: "All time",
  custom: "Custom range",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const formatRangeLabel = (dateFrom: string, dateTo: string): string => {
  const fd = new Date(`${dateFrom}T12:00:00`);
  const td = new Date(`${dateTo}T12:00:00`);
  const [from, to] = td < fd ? [td, fd] : [fd, td];
  return `${MONTHS[from.getMonth()]} ${from.getDate()} – ${MONTHS[to.getMonth()]} ${to.getDate()}, ${to.getFullYear()}`;
};

export const fmtCurrency = (value: number): string => `$${Math.round(value ?? 0).toLocaleString()}`;

export const fmtNumber = (value: number): string => Math.round(value ?? 0).toLocaleString();

export const computePercent = (value: number, max: number): number =>
  max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
