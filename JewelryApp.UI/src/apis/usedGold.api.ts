import type { SortDirection, UsedGoldPayMethod } from "../types/enums";
import { requestApi } from "../utils";
import { apiRoutes } from "./apiRoutes";

export const createUsedGoldPurchase = async (payload: {
  customerId: string;
  payMethod: UsedGoldPayMethod;
  notes?: string;
  items: {
    karat: number;
    weight: number;
    pricePerGram: number;
  }[];
}) => {
  return requestApi("POST", apiRoutes.usedGold.createPurchase, payload);
};

export const getUsedGoldPools = async (payload: {
  period?: "month" | "year" | "all";
  month?: number;
  year?: number;
}) => {
  return requestApi("GET", apiRoutes.usedGold.getPools, payload);
};

export const getUsedGoldHistory = async (payload: {
  searchBy?: string;
  typeFilter?: string;
  period?: "month" | "year" | "all";
  month?: number;
  year?: number;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: SortDirection;
}) => {
  return requestApi("GET", apiRoutes.usedGold.getHistory, payload);
};

export const sendToMelt = async (payload: { totalWeight: number; notes?: string }) => {
  return requestApi("POST", apiRoutes.usedGold.sendToMelt, payload);
};

export const returnToStock = async (payload: {
  karat: number;
  weight: number;
  notes?: string;
}) => {
  return requestApi("POST", apiRoutes.usedGold.returnToStock, payload);
};
