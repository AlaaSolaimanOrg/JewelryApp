import { requestApi } from "../utils";
import { apiRoutes } from "./apiRoutes";

export interface DateRangePayload {
  dateFrom?: string;
  dateTo?: string;
}

export const getCustomerBaseStats = async () => {
  return requestApi("GET", apiRoutes.customersReports.getCustomerBaseStats);
};

export const getCustomerTiers = async () => {
  return requestApi("GET", apiRoutes.customersReports.getCustomerTiers);
};

export const getAtRiskCustomers = async () => {
  return requestApi("GET", apiRoutes.customersReports.getAtRiskCustomers);
};

export const getCustomerActivityStats = async (payload: DateRangePayload) => {
  return requestApi("GET", apiRoutes.customersReports.getCustomerActivityStats, payload);
};

export interface NewCustomersChartPayload extends DateRangePayload {
  granularity: "Day" | "Month" | "Year";
}

export const getNewCustomersChart = async (payload: NewCustomersChartPayload) => {
  return requestApi("GET", apiRoutes.customersReports.getNewCustomersChart, payload);
};

export interface TopCustomersReportPayload extends DateRangePayload {
  search?: string;
}

export const getTopCustomersReport = async (payload: TopCustomersReportPayload) => {
  return requestApi("GET", apiRoutes.customersReports.getTopCustomersReport, payload);
};
