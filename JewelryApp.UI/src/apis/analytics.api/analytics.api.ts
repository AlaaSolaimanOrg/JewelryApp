import type { ReportType } from "../../types/enums";
import { requestApi } from "../../utils";
import { apiRoutes } from "../apiRoutes";

export interface AnalyticsFilterPayload {
  dateFrom?: string;
  dateTo?: string;
  reportType: ReportType;
}

export const getSalesOverTime = async (payload: AnalyticsFilterPayload) => {
  return requestApi("GET", apiRoutes.analytics.getSalesOverTime, payload);
};

export const getSalesByCategory = async (payload: AnalyticsFilterPayload) => {
  return requestApi("GET", apiRoutes.analytics.getSalesByCategory, payload);
};

export const getStaffPerformance = async (payload: AnalyticsFilterPayload) => {
  return requestApi("GET", apiRoutes.analytics.getStaffPerformance, payload);
};

export const getAnalyticsSummary = async (payload: AnalyticsFilterPayload) => {
  return requestApi("GET", apiRoutes.analytics.getAnalyticsSummary, payload);
};
