import type { LogLevel, SortDirection } from "../../types/enums";
import { requestApi } from "../../utils";
import { apiRoutes } from "../apiRoutes";

export const getLogs = async (payload: {
  pageNumber: number;
  pageSize: number;
  sortBy?: string;
  sortDirection: SortDirection;
  logLevel: LogLevel;
  searchBy: string;
}) => {
  return requestApi("GET", apiRoutes.logs.getLogs, payload);
};

export const deleteLogs = async (payload: { logIds: string[] }) => {
  return requestApi("DELETE", apiRoutes.logs.deleteLogs, payload);
};
