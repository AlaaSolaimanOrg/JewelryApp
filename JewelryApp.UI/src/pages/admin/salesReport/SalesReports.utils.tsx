import dateFormat from "dateformat";
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
import { ReportType } from "../../../types/enums";
import type { DateRange, Period } from "./SalesReports.type";

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

const PERIOD_REPORT_TYPE: Record<
  Exclude<Period, "custom" | "all">,
  ReportType
> = {
  today: ReportType.Daily,
  week: ReportType.Weekly,
  month: ReportType.Monthly,
  year: ReportType.Yearly,
};

export const getReportType = (period: Period): ReportType | null =>
  period === "custom" || period === "all" ? null : PERIOD_REPORT_TYPE[period];

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

export const fmtCurrency = (value: number): string => `$${Math.round(value ?? 0).toLocaleString()}`;

export const fmtNumber = (value: number): string => Math.round(value ?? 0).toLocaleString();

export const computePercent = (value: number, max: number): number =>
  max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
