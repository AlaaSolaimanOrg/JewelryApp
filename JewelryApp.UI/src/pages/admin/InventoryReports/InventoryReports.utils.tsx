import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import dateFormat from "dateformat";
import type { DateRange, Period } from "./InventoryReports.type";

export const PERIOD_LABELS: Record<Period, string> = {
  today: "Today",
  week: "This week",
  month: "This month",
  year: "This year",
  all: "All time",
  custom: "Custom range",
};

export const fmtCurrency = (value: number): string =>
  `$${Math.round(value ?? 0).toLocaleString()}`;

export const fmtNumber = (value: number): string =>
  Math.round(value ?? 0).toLocaleString();

export const computeBarPercent = (value: number, max: number): number =>
  max > 0 ? Math.max(1, Math.round((value / max) * 100)) : 1;

export const largestRemainderRound = (values: number[], total = 100): number[] => {
  const sum = values.reduce((a, b) => a + b, 0);
  if (sum <= 0) return values.map(() => 0);

  const raw = values.map((v) => (v / sum) * total);
  const floors = raw.map((v) => Math.floor(v));
  const remainders = raw.map((v, i) => v - floors[i]);

  const remaining = total - floors.reduce((a, b) => a + b, 0);
  const order = remainders
    .map((_, i) => i)
    .sort((a, b) => remainders[b] - remainders[a]);

  const result = [...floors];
  for (let i = 0; i < remaining; i++) {
    result[order[i]] += 1;
  }
  return result;
};

const fmtDateTime = (d: Date) => dateFormat(d, "yyyy-mm-dd HH:MM:ss");

export const getPeriodRange = (period: Exclude<Period, "custom">): DateRange => {
  const today = new Date();
  switch (period) {
    case "today":
      return { dateFrom: fmtDateTime(startOfDay(today)), dateTo: fmtDateTime(endOfDay(today)) };
    case "week":
      return {
        dateFrom: fmtDateTime(startOfWeek(today, { weekStartsOn: 1 })),
        dateTo: fmtDateTime(endOfWeek(today, { weekStartsOn: 1 })),
      };
    case "month":
      return { dateFrom: fmtDateTime(startOfMonth(today)), dateTo: fmtDateTime(endOfMonth(today)) };
    case "year":
      return { dateFrom: fmtDateTime(startOfYear(today)), dateTo: fmtDateTime(endOfYear(today)) };
    case "all":
      return { dateFrom: "", dateTo: "" };
  }
};

export const getCustomRange = (dateFrom: string, dateTo: string): DateRange => {
  const fd = new Date(`${dateFrom}T00:00:00`);
  const td = new Date(`${dateTo}T23:59:59`);
  const [from, to] = td < fd ? [td, fd] : [fd, td];
  return { dateFrom: fmtDateTime(from), dateTo: fmtDateTime(to) };
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const formatRangeLabel = (dateFrom: string, dateTo: string): string => {
  const fd = new Date(`${dateFrom}T12:00:00`);
  const td = new Date(`${dateTo}T12:00:00`);
  const [from, to] = td < fd ? [td, fd] : [fd, td];
  return `${MONTHS[from.getMonth()]} ${from.getDate()} – ${MONTHS[to.getMonth()]} ${to.getDate()}, ${to.getFullYear()}`;
};
