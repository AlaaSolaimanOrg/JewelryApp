import { requestApi } from "../utils";
import { apiRoutes } from "./apiRoutes";

export const getLowStockThreshold = async () => {
  return requestApi("GET", apiRoutes.inventorySettings.getLowStockThreshold);
};

export const updateLowStockThreshold = async (payload: {
  threshold: number;
}) => {
  return requestApi(
    "PUT",
    apiRoutes.inventorySettings.updateLowStockThreshold,
    payload,
  );
};
