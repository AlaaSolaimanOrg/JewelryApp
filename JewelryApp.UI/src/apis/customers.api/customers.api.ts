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

export const getCustomers = async (payload: { searchBy: string }) => {
  return requestApi("GET", apiRoutes.customers.getCustomers, payload);
};

export const deleteCustomer = async (payload: { id: string }) => {
  return requestApi("DELETE", apiRoutes.customers.deleteCustomer, payload);
};
export const updateCustomer = async (payload: { id: string }) => {
  return requestApi("PUT", apiRoutes.customers.updateCustomer, payload);
};
