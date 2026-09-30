import type { ReactNode } from "react";

export interface ChartPanelProps {
  title: ReactNode;
  subtitle?: ReactNode;
  modalSubtitle?: ReactNode;
  className?: string;
  children: ReactNode;
}
