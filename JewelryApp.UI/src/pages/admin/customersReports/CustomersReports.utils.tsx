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
import type { DateRange, Period } from "./CustomersReports.type";

export const PERIOD_LABELS: Record<Period, string> = {
  today: "Today",
  week: "This week",
  month: "This month",
  year: "This year",
  all: "All time",
  custom: "Custom range",
};

/** Presentation-only styling per tier name — the API returns names/thresholds, not colors. */
export const TIER_STYLES: Record<string, { color: string; bg: string }> = {
  VIP: { color: "var(--admin-gold)", bg: "var(--admin-gold-bg)" },
  GOLD: { color: "var(--admin-amber)", bg: "rgba(230, 162, 60, 0.12)" },
  SILVER: { color: "var(--admin-purple)", bg: "rgba(155, 141, 230, 0.12)" },
  BRONZE: { color: "var(--admin-blue)", bg: "rgba(91, 163, 230, 0.12)" },
  REGULAR: { color: "var(--admin-t4)", bg: "var(--admin-bg4)" },
};

export const fmtCurrency = (value: number): string =>
  `$${Math.round(value ?? 0).toLocaleString()}`;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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

export const formatRangeLabel = (dateFrom: string, dateTo: string): string => {
  const fd = new Date(`${dateFrom}T12:00:00`);
  const td = new Date(`${dateTo}T12:00:00`);
  const [from, to] = td < fd ? [td, fd] : [fd, td];
  return `${MONTHS[from.getMonth()]} ${from.getDate()} – ${MONTHS[to.getMonth()]} ${to.getDate()}, ${to.getFullYear()}`;
};

/** Chart bucket size: daily within a week/month/short custom range, monthly across a year, yearly for all-time. */
export const getChartGranularity = (
  period: Period,
  range: DateRange | null,
): "Day" | "Month" | "Year" => {
  if (period === "today" || period === "week" || period === "month") return "Day";
  if (period === "year") return "Month";
  if (period === "custom" && range) {
    const span =
      (new Date(`${range.dateTo}T12:00:00`).getTime() - new Date(`${range.dateFrom}T12:00:00`).getTime()) /
        864e5 +
      1;
    return span <= 31 ? "Day" : "Month";
  }
  return "Year";
};

export function formatSince(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).getFullYear().toString();
}

export function formatLastPurchase(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const today = new Date();
  const days = Math.round(
    (new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime() -
      new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()) /
      864e5,
  );
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "1 week ago";
  if (days < 30) return `${Math.round(days / 7)} weeks ago`;
  if (days < 60) return "1 month ago";
  return `${Math.round(days / 30)} months ago`;
}
