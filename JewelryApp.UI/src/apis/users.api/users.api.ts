import { requestApi } from "../../utils";
import { apiRoutes } from "../apiRoutes";

export const getAllUsers = async (payload) => {
  return requestApi("GET", apiRoutes.users.getAllUsers, payload);
};

export const getAllRoles = async () => {
  return requestApi("GET", apiRoutes.users.getAllRoles);
};

export const softDeleteUser = async (payload: { userId: string }) => {
  return requestApi(
    "DELETE",
    `${apiRoutes.users.softDeleteUser}/${payload.userId}`
  );
};

export const createUser = async (payload: {
  userName: string;
  email: string;
  password: string;
  roles: string[];
}) => {
  return requestApi("POST", apiRoutes.users.createUser, payload);
};

export const updateUser = async (payload: {
  userId: string;
  userName: string;
  isactive: boolean;
  roles: string[];
}) => {
  return requestApi(
    "PUT",
    `${apiRoutes.users.updateUser}/${payload.userId}`,
    payload
  );
};

export const getUserById = async (payload: { userId: string }) => {
  return requestApi("GET", `${apiRoutes.users.getUserById}/${payload.userId}`);
};

export const getUserInfo = async () => {
  return requestApi("GET", apiRoutes.users.getUserInfo);
};
