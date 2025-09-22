import { requestApi } from "../../utils";
import { apiRoutes } from "../apiRoutes";

export const addProductToCart = async (payload: { productId: string }) => {
  return requestApi("POST", apiRoutes.cart.addProductToCart, payload);
};

export const getCartProducts = async (payload) => {
  return requestApi("GET", apiRoutes.cart.getCartProducts, payload);
};

export const deleteCart = async () => {
  return requestApi("DELETE", apiRoutes.cart.deleteCart);
};

export const removeProductFromCart = async (payload: { productId: string }) => {
  return requestApi("POST", apiRoutes.cart.removeProductFromCart, payload);
};
