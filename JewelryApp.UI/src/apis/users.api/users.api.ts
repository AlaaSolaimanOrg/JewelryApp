import { requestApi } from "../../utils";
import { apiRoutes } from "../apiRoutes";

export const getAllUsers = async () => {
  return requestApi("GET", apiRoutes.users.getAllUsers);
};

export const getAllRoles = async () => {
  return requestApi("GET", apiRoutes.users.getAllRoles);
};

export const softDeleteUser = async (payload: { userId: string }) => {
  return requestApi("DELETE", apiRoutes.users.softDeleteUser, payload);
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
  email: string;
  password: string;
  roles: string[];
}) => {
  return requestApi(
    "PUT",
    apiRoutes.users.updateUser,
    payload,
    {},
    { userId: payload.userId }
  );
};

export const getUserById = async (payload: { userId: string }) => {
  return requestApi("GET", `${apiRoutes.users.getUserById}/${payload.userId}`);
};
