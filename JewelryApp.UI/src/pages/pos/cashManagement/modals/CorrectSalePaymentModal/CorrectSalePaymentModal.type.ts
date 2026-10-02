export type CorrectionPayMethod = "cash" | "card" | "split";

export interface SaleLookup {
  id: string;
  serialNumber: string;
  customerName: string;
  total: number;
  cashAmount: number | null;
  cardAmount: number | null;
}
