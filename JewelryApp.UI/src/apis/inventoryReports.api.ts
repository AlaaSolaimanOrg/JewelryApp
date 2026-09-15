import { requestApi } from "../utils";
import { apiRoutes } from "./apiRoutes";

export interface DateRangePayload {
  dateFrom?: string;
  dateTo?: string;
}

export const getInventoryAging = async () => {
  return requestApi("GET", apiRoutes.inventoryReports.getInventoryAging);
};

export const getInventoryStockSummary = async () => {
  return requestApi("GET", apiRoutes.inventoryReports.getInventoryStockSummary);
};

export const getStockByPurity = async () => {
  return requestApi("GET", apiRoutes.inventoryReports.getStockByPurity);
};

export const getStockByCategory = async () => {
  return requestApi("GET", apiRoutes.inventoryReports.getStockByCategory);
};

export const getInventoryMovement = async (payload: DateRangePayload) => {
  return requestApi("GET", apiRoutes.inventoryReports.getInventoryMovement, payload);
};

export const getMovementByPurity = async (payload: DateRangePayload) => {
  return requestApi("GET", apiRoutes.inventoryReports.getMovementByPurity, payload);
};

export const getStaplesSold = async (payload: DateRangePayload) => {
  return requestApi("GET", apiRoutes.inventoryReports.getStaplesSold, payload);
};
