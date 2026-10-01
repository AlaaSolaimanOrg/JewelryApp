import { requestApi } from "../utils";
import { apiRoutes } from "./apiRoutes";

export interface DateRangePayload {
  dateFrom?: string;
  dateTo?: string;
}

export const getRepairsStats = async (payload: DateRangePayload) => {
  return requestApi("GET", apiRoutes.repairsReports.getRepairsStats, payload);
};

export const getRepairHealthMetrics = async (payload: DateRangePayload) => {
  return requestApi("GET", apiRoutes.repairsReports.getRepairHealthMetrics, payload);
};

export const getRepairAlerts = async () => {
  return requestApi("GET", apiRoutes.repairsReports.getRepairAlerts);
};

export interface RepairsRevenueChartPayload extends DateRangePayload {
  granularity: "Day" | "Month" | "Year";
}

export const getRepairsRevenueChart = async (payload: RepairsRevenueChartPayload) => {
  return requestApi("GET", apiRoutes.repairsReports.getRepairsRevenueChart, payload);
};

export interface RepairsByCustomerPayload extends DateRangePayload {
  search?: string;
}

export const getRepairsByCustomer = async (payload: RepairsByCustomerPayload) => {
  return requestApi("GET", apiRoutes.repairsReports.getRepairsByCustomer, payload);
};

export const getAvgRepairValueHistory = async () => {
  return requestApi("GET", apiRoutes.repairsReports.getAvgRepairValueHistory);
};

export const getRepeatCustomers = async () => {
  return requestApi("GET", apiRoutes.repairsReports.getRepeatCustomers);
};

export const getLongestInShop = async () => {
  return requestApi("GET", apiRoutes.repairsReports.getLongestInShop);
};
