import { requestApi } from "../../utils";
import { apiRoutes } from "../apiRoutes";

export const login = async (payload: any) => {
  return requestApi("POST", apiRoutes.auth.login, payload);
};
export const callRefreshToken = async (payload: {
  refreshToken: string | null;
}) => {
  return requestApi("POST", apiRoutes.auth.refreshToken, payload);
};
