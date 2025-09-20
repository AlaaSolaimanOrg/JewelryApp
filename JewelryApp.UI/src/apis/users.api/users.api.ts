import { requestApi } from "../../utils";
import { apiRoutes } from "../apiRoutes";

export const getAllUsers = async () => {
  return requestApi("GET", apiRoutes.users.getAllUsers);
};

export const getAllRoles = async () => {
  return requestApi("GET", apiRoutes.users.getAllRoles);
};
