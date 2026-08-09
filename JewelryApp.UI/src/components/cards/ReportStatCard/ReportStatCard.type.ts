import type { ReactNode } from "react";

export interface ReportStatCardProps {
  label: string;
  value: string;
  sub?: ReactNode;
  accentColor?: string;
  valueColor?: string;
}
