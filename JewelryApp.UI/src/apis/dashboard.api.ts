import { requestApi } from "../utils";
import { apiRoutes } from "./apiRoutes";

export const getPosDashboardStats = async () => {
  return requestApi("GET", apiRoutes.dashboard.getPosDashboardStats);
};

export const getAdminSalesSummary = async () => {
  return requestApi("GET", apiRoutes.dashboard.getAdminSalesSummary);
};

export const getAdminCashGoldSnapshot = async () => {
  return requestApi("GET", apiRoutes.dashboard.getAdminCashGoldSnapshot);
};

export const getAdminRepairsStats = async () => {
  return requestApi("GET", apiRoutes.dashboard.getAdminRepairsStats);
};

export const getAdminInventorySnapshot = async () => {
  return requestApi("GET", apiRoutes.dashboard.getAdminInventorySnapshot);
};

export const getAdminAttentionItems = async () => {
  return requestApi("GET", apiRoutes.dashboard.getAdminAttentionItems);
};
