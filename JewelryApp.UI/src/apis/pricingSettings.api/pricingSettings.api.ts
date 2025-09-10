import type { KaratType, ProductType } from "../../types/enums";
import { requestApi } from "../../utils";
import { apiRoutes } from "../apiRoutes";

export const getGlobalPricingSettings = async (payload: any) => {
  return requestApi(
    "GET",
    apiRoutes.pricingSettings.getGlobalPricingSettings,
    payload
  );
};
export const getPricingSettings = async (payload: {}) => {
  return requestApi(
    "GET",
    apiRoutes.pricingSettings.getPricingSettings,
    payload
  );
};
export const editPricingSettings = async (payload: {
  productType: ProductType;
  karatType: KaratType;
  pricePerGram: number;
}) => {
  return requestApi(
    "PUT",
    apiRoutes.pricingSettings.editPricingSettings,
    payload
  );
};
