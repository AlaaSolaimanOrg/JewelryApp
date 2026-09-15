import type {
  ItemCondition,
  RefundMethod,
  ReturnItemsView,
  ReturnOption,
  ReturnReason,
  SortDirection,
} from "../../types/enums";
import { requestApi } from "../../utils";
import { apiRoutes } from "../apiRoutes";

export const createReturn = async (payload: {
  saleId: string;
  refundMethod?: RefundMethod;
  items: {
    saleItemId: string;
    quantityToReturn: number;
    reason: ReturnReason | null;
    reasonNote?: string;
    returnAmount: number;
    condition: ItemCondition | null;
    option: ReturnOption| null;
  }[];
}) => {
  return requestApi("POST", apiRoutes.returns.createReturn, payload);
};

export const getReturnItems = async (payload: {
  searchBy?: string;
  view: ReturnItemsView;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: SortDirection;
}) => {
  return requestApi("GET", apiRoutes.returns.getReturnItems, payload);
};

export const getReturnItemsCounts = async () => {
  return requestApi("GET", apiRoutes.returns.getReturnItemsCounts);
};

export const markReturnItemsPrinted = async (payload: {
  returnItemIds: string[];
}) => {
  return requestApi("POST", apiRoutes.returns.markReturnItemsPrinted, payload);
};
