export interface ExchangeTransactionItem {
  name: string;
  karat: number;
  weight: string;
  sku: string;
  unitPrice: number;
  qty: number;
}

export interface PastTransaction {
  id: string;
  date: string;
  customer: string;
  phone: string;
  desc: string;
  items: ExchangeTransactionItem[];
}

export type ExchangeDestination = "stock" | "melt" | "";

export interface SelectedExchangeItem {
  idx: number;
  name: string;
  karat: number;
  sku: string;
  unitPrice: number;
  purchasedQty: number;
  returnQty: number;
  dest: ExchangeDestination;
}
