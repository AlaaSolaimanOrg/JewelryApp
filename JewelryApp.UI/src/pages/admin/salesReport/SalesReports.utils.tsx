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
import type { DateRange, Period, StaticPeriodStats } from "./SalesReports.type";

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

/* ─────────────────────────────────────────────────────────────
   Static (mock) data — no backing API exists for these figures.
   Values mirror the approved sales-reports design per period.
───────────────────────────────────────────────────────────── */

export const MOCK_STATIC: Record<Exclude<Period, "custom">, StaticPeriodStats> = {
  today: {
    refunds: 3205,
    itemsSold: 38,
    avgSale: 2207,
    transactions: 31,
    unitsChart: [
      { label: "9am", value: 2 },
      { label: "10am", value: 5 },
      { label: "11am", value: 7 },
      { label: "12pm", value: 4 },
      { label: "1pm", value: 3 },
      { label: "2pm", value: 5 },
      { label: "3pm", value: 6 },
      { label: "4pm", value: 4 },
      { label: "5pm", value: 2 },
    ],
    topCustomers: [
      { name: "Hanan Saleh", transactions: 3, spent: 9840 },
      { name: "Ahmad Khalil", transactions: 1, spent: 5459 },
      { name: "Sara Mansour", transactions: 2, spent: 4893 },
      { name: "Walk-in", transactions: 8, spent: 4210 },
      { name: "Mariam Taha", transactions: 1, spent: 3293 },
    ],
  },
  week: {
    refunds: 12480,
    itemsSold: 241,
    avgSale: 2205,
    transactions: 187,
    unitsChart: [
      { label: "Mon", value: 31 },
      { label: "Tue", value: 28 },
      { label: "Wed", value: 38 },
      { label: "Thu", value: 33 },
      { label: "Fri", value: 45 },
      { label: "Sat", value: 50 },
      { label: "Sun", value: 16 },
    ],
    topCustomers: [
      { name: "Rajaa Annouka", transactions: 4, spent: 28400 },
      { name: "Hanan Saleh", transactions: 5, spent: 22180 },
      { name: "Zainab Al Mutlak", transactions: 2, spent: 18920 },
      { name: "Ahmad Khalil", transactions: 3, spent: 15630 },
      { name: "Fatima Hassan", transactions: 4, spent: 14210 },
    ],
  },
  month: {
    refunds: 51280,
    itemsSold: 1067,
    avgSale: 2236,
    transactions: 824,
    unitsChart: [
      { label: "Week 1", value: 248 },
      { label: "Week 2", value: 271 },
      { label: "Week 3", value: 259 },
      { label: "Week 4", value: 289 },
    ],
    topCustomers: [
      { name: "Zainab Al Mutlak", transactions: 8, spent: 84200 },
      { name: "Rajaa Annouka", transactions: 11, spent: 71800 },
      { name: "Hanan Saleh", transactions: 14, spent: 65300 },
      { name: "Ali Mahmoud", transactions: 6, spent: 48900 },
      { name: "Sara Mansour", transactions: 9, spent: 44100 },
    ],
  },
  year: {
    refunds: 248600,
    itemsSold: 5641,
    avgSale: 2149,
    transactions: 4382,
    unitsChart: [
      { label: "Jan", value: 892 },
      { label: "Feb", value: 836 },
      { label: "Mar", value: 981 },
      { label: "Apr", value: 938 },
      { label: "May", value: 927 },
      { label: "Jun", value: 1067 },
    ],
    topCustomers: [
      { name: "Zainab Al Mutlak", transactions: 34, spent: 312400 },
      { name: "Rajaa Annouka", transactions: 48, spent: 288700 },
      { name: "Hanan Saleh", transactions: 52, spent: 241900 },
      { name: "Ahmad Khalil", transactions: 29, spent: 198400 },
      { name: "Ali Mahmoud", transactions: 22, spent: 176200 },
    ],
  },
  all: {
    refunds: 684200,
    itemsSold: 15233,
    avgSale: 2096,
    transactions: 11847,
    unitsChart: [
      { label: "2023", value: 2241 },
      { label: "2024", value: 3684 },
      { label: "2025", value: 3667 },
      { label: "2026", value: 5641 },
    ],
    topCustomers: [
      { name: "Zainab Al Mutlak", transactions: 96, spent: 824100 },
      { name: "Rajaa Annouka", transactions: 131, spent: 761300 },
      { name: "Hanan Saleh", transactions: 142, spent: 638200 },
      { name: "Ousama Adi", transactions: 88, spent: 540800 },
      { name: "Ahmad Khalil", transactions: 74, spent: 498200 },
    ],
  },
};

export const scaleStaticForCustomRange = (dateFrom: string, dateTo: string): StaticPeriodStats => {
  const fd = new Date(`${dateFrom}T12:00:00`);
  const td = new Date(`${dateTo}T12:00:00`);
  const [from, to] = td < fd ? [td, fd] : [fd, td];
  const days = Math.round((to.getTime() - from.getTime()) / 864e5) + 1;
  const ratio = days / 30;
  const m = MOCK_STATIC.month;

  return {
    refunds: Math.round(m.refunds * ratio),
    itemsSold: Math.max(1, Math.round(m.itemsSold * ratio)),
    avgSale: m.avgSale,
    transactions: Math.max(1, Math.round(m.transactions * ratio)),
    unitsChart: m.unitsChart.map((u) => ({ ...u, value: Math.max(1, Math.round(u.value * ratio)) })),
    topCustomers: m.topCustomers.map((c) => ({
      ...c,
      transactions: Math.max(1, Math.round(c.transactions * ratio)),
      spent: Math.round(c.spent * ratio),
    })),
  };
};
