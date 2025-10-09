import { requestApi } from "../../utils";
import { apiRoutes } from "../apiRoutes";

export const createCustomer = async (payload: {
  name: string;
  email: string;
  phoneNumber: string;
  birthday: string;
}) => {
  return requestApi("POST", apiRoutes.customers.createCustomer, payload);
};

export const getCustomer = async (payload: { searchBy: string }) => {
  return requestApi("GET", apiRoutes.customers.getCustomer, payload);
};
