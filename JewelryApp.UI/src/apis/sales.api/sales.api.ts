import type { DiscountType, KaratType, SortDirection } from "../../types/enums";
import { requestApi } from "../../utils";
import { apiRoutes } from "../apiRoutes";

export interface SaleItemPayload {
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
  saleItems: SaleItemPayload[];
}

export const createSale = async (payload: CreateSalePayload) => {
  return requestApi("POST", apiRoutes.sales.createSale, payload);
};

export const getSaleById = async (payload: { saleId: string }) => {
  return requestApi("GET", apiRoutes.sales.getSaleById, payload);
};

export const getSalesList = async (payload: { saleId: string }) => {
  return requestApi("GET", apiRoutes.sales.getSalesList, payload);
};

export const getSalesInsights = async (payload: {
  dateFrom: string;
  dateTo: string;
}) => {
  return requestApi("GET", apiRoutes.sales.getSalesInsights, payload);
};

export const getSoldItems = async (payload: {
  dateFrom: string;
  dateTo: string;
  pageSize: number;
  pageNumber: number;
  sortBy: string;
  sortDirection: SortDirection;
}) => {
  return requestApi("GET", apiRoutes.sales.getSoldItems, payload);
};

export const getSalesCustomers = async (payload: {
  dateFrom: string;
  dateTo: string;
  pageSize: number;
  pageNumber: number;
  sortBy: string;
  sortDirection: SortDirection;
  searchBy: string;
}) => {
  return requestApi("GET", apiRoutes.sales.getSalesCustomers, payload);
};

export const getDashboardInsights = async (payload: {}) => {
  return requestApi("GET", apiRoutes.sales.getDashboardInsights, payload);
};
