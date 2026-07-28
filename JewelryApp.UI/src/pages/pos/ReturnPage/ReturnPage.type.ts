import type {
  ItemCondition,
  KaratType,
  ReturnOption,
  ReturnReason,
} from "../../../types/enums";

export interface TransactionItem {
  id: string;
  name: string;
  icon: "ring" | "gem";
  karat: KaratType;
  weight: string;
  unitPrice: number;
  qtyPurchased: number;
  qtyToReturn: number;
  apiAmountReturned: number; // value that came from the API
  returnAmount: number; // editable amount entered by user for this return
  selected: boolean;
  returnReason: ReturnReason | null;
  otherReason: string;
  condition: ItemCondition | null;
  returnOption: ReturnOption | null;
  productImage?: string;
  quantityReturned: number;
}

export interface SaleItem {
  id: string;
  productName: string;
  productImage: string;
  sku: string;
  karat: KaratType;
  weight: number;
  pricePerGram: number;
  subtotalAfterDiscount: number;
  subtotalBeforeDiscount: number;
  quantity: number;
  quantityReturned: number;
  amountReturned: number;
}

export interface Sale {
  id: string;
  serialNumber: string;
  createdDate: string;
  staffName: string;
  customerName: string;
  customerPhone: string;
  totalBeforeDiscount: number;
  total: number;
  cashAmount: number;
  cardAmount: number;
  tax: number;
  discount: number;
  totalReturnAmount: number;
  saleItems: SaleItem[];
}

export interface SearchSale {
  id: string;
  serialNumber: string;
  createdDate: string;
  staffName: string;
  customerName: string;
  customerPhone: string;
  total: number;
}

export type SearchTab = "receipt" | "phone" | "name";

export type RefundMethod = "Cash" | "Card";
