import type { ReactNode } from "react";

export interface ReportStatCardProps {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  accentColor?: string;
  valueColor?: string;
}
