import { requestApi } from "../../utils";
import { apiRoutes } from "../apiRoutes";

export const addProductToCart = async (payload: { productId: string }) => {
  return requestApi("POST", apiRoutes.cart.addProductToCart, payload);
};
