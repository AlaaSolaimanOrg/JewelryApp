import type { ReactNode } from "react";

export interface ChartExpandModalProps {
  show: boolean;
  title: ReactNode;
  subtitle?: ReactNode;
  onClose: () => void;
  children: ReactNode;
}
