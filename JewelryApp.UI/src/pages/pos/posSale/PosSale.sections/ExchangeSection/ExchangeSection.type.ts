import type { ItemCondition, KaratType, ReturnOption, ReturnReason } from "../../../../../types/enums";

export interface ExchangeSaleItem {
  id: string;
  productName: string;
  productImage?: string;
  sku?: string;
  karat: KaratType;
  weight: number;
  subtotalAfterDiscount: number;
  quantity: number;
  quantityReturned: number;
}

export interface ExchangeSearchSale {
  id: string;
  serialNumber: string;
  createdDate: string;
  customerName: string;
  customerPhone: string;
  total: number;
  saleItems: ExchangeSaleItem[];
}

export interface SelectedExchangeItem {
  saleId: string;
  saleSerialNumber: string;
  saleItemId: string;
  name: string;
  karat: KaratType;
  sku?: string;
  unitPrice: number;
  purchasedQty: number;
  alreadyReturnedQty: number;
  returnQty: number;
  returnAmount: number;
  reason: ReturnReason | "";
  reasonNote: string;
  dest: ReturnOption | "";
  condition: ItemCondition | "";
}

export interface ExchangeItemGroup {
  saleId: string;
  saleSerialNumber: string;
  items: SelectedExchangeItem[];
}

export interface ExchangeApplyData {
  saleId: string;
  saleSerialNumber: string;
  items: {
    saleItemId: string;
    quantityToReturn: number;
    reason: ReturnReason;
    reasonNote?: string;
    returnAmount: number;
    condition: ItemCondition;
    option: ReturnOption;
  }[];
}
