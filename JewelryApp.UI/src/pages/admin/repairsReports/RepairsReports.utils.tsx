import type { DateRange, Period } from "./RepairsReports.type";

export const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const fmtShort = (n: number): string => `$${Math.round(n ?? 0)}`;

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function daysInMonth(month: number, year: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Full-month or full-year range (as plain date strings) for the given selection. */
export function getPeriodRange(
  period: Exclude<Period, "custom">,
  selMonth: number,
  selYear: number,
): DateRange | null {
  if (period === "month") {
    return {
      dateFrom: `${selYear}-${pad2(selMonth + 1)}-01`,
      dateTo: `${selYear}-${pad2(selMonth + 1)}-${pad2(daysInMonth(selMonth, selYear))}`,
    };
  }
  if (period === "year") {
    return { dateFrom: `${selYear}-01-01`, dateTo: `${selYear}-12-31` };
  }
  return null; // "all" — no range
}

/** The equivalent range one month/year back, used for the vs-previous-period comparison. */
export function getPreviousPeriodRange(
  period: Exclude<Period, "custom">,
  selMonth: number,
  selYear: number,
): DateRange | null {
  if (period === "month") {
    const pm = selMonth === 0 ? 11 : selMonth - 1;
    const py = selMonth === 0 ? selYear - 1 : selYear;
    return getPeriodRange("month", pm, py);
  }
  if (period === "year") {
    return getPeriodRange("year", selMonth, selYear - 1);
  }
  return null;
}

export function getPreviousPeriodLabel(
  period: Exclude<Period, "custom">,
  selMonth: number,
  selYear: number,
): string {
  if (period === "month") return selMonth === 0 ? MONTHS[11] : MONTHS[selMonth - 1];
  if (period === "year") return `${selYear - 1}`;
  return "";
}

export function formatRangeLabel(dateFrom: string, dateTo: string): string {
  const fd = new Date(`${dateFrom}T12:00:00`);
  const td = new Date(`${dateTo}T12:00:00`);
  const [from, to] = td < fd ? [td, fd] : [fd, td];
  return `${MONTHS[from.getMonth()]} ${from.getDate()} – ${MONTHS[to.getMonth()]} ${to.getDate()}, ${to.getFullYear()}`;
}

export function getPeriodLabel(
  period: Period,
  selMonth: number,
  selYear: number,
  customRange: DateRange | null,
): string {
  if (period === "month") return `${MONTHS[selMonth]} ${selYear}`;
  if (period === "year") return `${selYear}`;
  if (period === "custom" && customRange) return formatRangeLabel(customRange.dateFrom, customRange.dateTo);
  return "All time";
}

/** Chart bucket size: daily within a month/short custom range, monthly across a year, yearly for all-time. */
export function getChartGranularity(
  period: Period,
  range: DateRange | null,
): "Day" | "Month" | "Year" {
  if (period === "month") return "Day";
  if (period === "year") return "Month";
  if (period === "custom" && range) {
    const span =
      (new Date(`${range.dateTo}T12:00:00`).getTime() - new Date(`${range.dateFrom}T12:00:00`).getTime()) /
        864e5 +
      1;
    return span <= 31 ? "Day" : "Month";
  }
  return "Year";
}

export function getChartTitle(
  period: Period,
  selMonth: number,
  selYear: number,
  customRange: DateRange | null,
): string {
  const label = getPeriodLabel(period, selMonth, selYear, customRange);
  if (period === "month" || period === "custom") return `Daily revenue — ${label}`;
  if (period === "year") return `Monthly revenue — ${label}`;
  return "Yearly revenue — all time";
}
