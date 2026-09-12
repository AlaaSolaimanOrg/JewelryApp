import type { UsedGoldPayMethod } from "../../types/enums";
import { requestApi } from "../../utils";
import { apiRoutes } from "../apiRoutes";

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
