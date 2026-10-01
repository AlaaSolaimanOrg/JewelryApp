export interface GoldRow {
  id: number;
  karat: number;
  weight: number;
  pricePerGram: number;
}

export interface Seller {
  id: string;
  name: string;
  phone: string;
}

export type PayMethod = "cash" | "eTransfer";
