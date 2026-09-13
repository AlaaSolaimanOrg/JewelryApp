import { requestApi } from "../../utils";
import { apiRoutes } from "../apiRoutes";

export const getPosDashboardStats = async () => {
  return requestApi("GET", apiRoutes.dashboard.getPosDashboardStats);
};
