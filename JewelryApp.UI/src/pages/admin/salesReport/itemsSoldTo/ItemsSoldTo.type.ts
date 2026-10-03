import type { ReportRangePayload } from "../../../../utils";

export interface ItemsSoldToProps {
  range: ReportRangePayload;
  onCorrectSale?: (saleId: string) => void;
}

export interface SoldItem {
  sku?: string;
  productName: string;
  customerName: string;
  saleId: string;
  saleSerialNumber: string;
  quantity: number;
  unitWeight: number;
  weightSummed: number;
  pricePerGram: number;
  subtotal: number;
  latestSaleDate: string;
}
