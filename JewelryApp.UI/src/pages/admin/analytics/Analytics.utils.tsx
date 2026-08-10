import { ReportType } from "../../../types/enums";

export const fmtCurrency = (value: number): string =>
  `$${Math.round(value ?? 0).toLocaleString()}`;

export const fmtNumber = (value: number): string =>
  Math.round(value ?? 0).toLocaleString();

export const REPORT_TYPE_OPTIONS: { value: ReportType; label: string }[] = [
  { value: ReportType.AllTime, label: "All time" },
  { value: ReportType.Daily, label: "Daily" },
  { value: ReportType.Weekly, label: "Weekly" },
  { value: ReportType.Monthly, label: "Monthly" },
  { value: ReportType.Yearly, label: "Yearly" },
];

export const RETENTION_COLORS = [
  "var(--admin-gold)",
  "var(--admin-blue)",
  "var(--admin-green)",
  "var(--admin-purple)",
  "var(--admin-amber)",
];

export const KARAT_LINE_COLORS: Record<number, string> = {
  18: "#e6a23c",
  21: "#d4a017",
  22: "#5ba3e6",
  24: "#4caf7c",
};

export const computePercent = (value: number, max: number): number =>
  max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
