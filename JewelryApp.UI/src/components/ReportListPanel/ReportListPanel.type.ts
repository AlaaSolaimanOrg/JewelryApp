export interface ReportListRow {
  key: string;
  primary: string;
  secondary?: string;
  value: string;
  valueColor?: string;
}

export interface ReportListPanelProps {
  title: string;
  rows: ReportListRow[];
  emptyMessage: string;
  search?: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  };
}
