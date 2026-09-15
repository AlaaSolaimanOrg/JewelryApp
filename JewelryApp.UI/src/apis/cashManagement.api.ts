import type { CashBoxType, SortDirection } from "../types/enums";
import { requestApi } from "../utils";
import { apiRoutes } from "./apiRoutes";

export const getCashBalances = async () => {
  return requestApi("GET", apiRoutes.cashManagement.getCashBalances);
};

export const getCashTransactions = async (payload: {
  boxType?: CashBoxType;
  searchBy?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: SortDirection;
}) => {
  return requestApi(
    "GET",
    apiRoutes.cashManagement.getCashTransactions,
    payload,
  );
};

export const addExpense = async (payload: {
  category: string;
  amount: number;
  notes: string;
}) => {
  return requestApi("POST", apiRoutes.cashManagement.addExpense, payload);
};

export const manualCashIn = async (payload: {
  source: string;
  amount: number;
  notes?: string;
}) => {
  return requestApi("POST", apiRoutes.cashManagement.manualCashIn, payload);
};

export const transferIncome = async (payload: {
  customerName: string;
  amount: number;
  destination?: string;
  notes?: string;
}) => {
  return requestApi("POST", apiRoutes.cashManagement.transferIncome, payload);
};

export const moveMoney = async (payload: {
  fromBox: CashBoxType;
  amount: number;
  reason?: string;
}) => {
  return requestApi("POST", apiRoutes.cashManagement.moveMoney, payload);
};
