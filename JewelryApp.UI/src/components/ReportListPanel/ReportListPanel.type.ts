import type { ReactNode } from "react";

export interface ReportListRow {
  key: string;
  primary: string;
  secondary?: string;
  value: string;
  valueColor?: string;
  valueBg?: string;
}

export interface ReportListPanelProps {
  title: ReactNode;
  subtitle?: ReactNode;
  rows: ReportListRow[];
  emptyMessage: string;
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
}
