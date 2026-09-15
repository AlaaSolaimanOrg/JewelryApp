import { requestApi } from "../../utils";
import { apiRoutes } from "../apiRoutes";

export const getUserStats = async () => {
  return requestApi("GET", apiRoutes.users.getUserStats);
};
