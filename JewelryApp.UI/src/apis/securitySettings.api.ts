import { requestApi } from "../utils";
import { apiRoutes } from "./apiRoutes";

export const getSalesPin = async () => {
  return requestApi("GET", apiRoutes.securitySettings.getSalesPin);
};

export const updateSalesPin = async (payload: { pin: string }) => {
  return requestApi("PUT", apiRoutes.securitySettings.updateSalesPin, payload);
};

export const verifySalesPin = async (payload: { pin: string }) => {
  return requestApi("POST", apiRoutes.securitySettings.verifySalesPin, payload);
};
