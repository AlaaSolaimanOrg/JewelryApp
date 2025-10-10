import type { DiscountType, KaratType } from "../../types/enums";
import { requestApi } from "../../utils";
import { apiRoutes } from "../apiRoutes";

export interface SaleItem {
  productId: string;
  productName: string;
  karatType: KaratType;
  weight: number;
  isManualProduct: boolean;
  originalPricePerGram: number;
  overriddenPricePerGram: number;
}

export interface CreateSalePayload {
  customerId: string;
  discount: number;
  discountPercentage: number;
  discountType: DiscountType;
  note: string;
  cashAmount: number;
  cardAmount: number;
  taxe: number;
  saleItems: SaleItem[];
}

export const createSale = async (payload: CreateSalePayload) => {
  return requestApi("POST", apiRoutes.sales.createSale, payload);
};

export const getCustomer = async (payload: { searchBy: string }) => {
  return requestApi("GET", apiRoutes.customers.getCustomer, payload);
};
