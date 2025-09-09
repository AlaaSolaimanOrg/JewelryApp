import type { KaratType, ProductCategory } from "../../types/enums";
import { requestApi } from "../../utils";
import { apiRoutes } from "../apiRoutes";

export const generateSKU = async (payload: {
  karatType: KaratType;
  category: ProductCategory;
}) => {
  return requestApi("GET", apiRoutes.product.generateSku, payload);
};

export const getProducts = async (payload: any) => {
  return requestApi("GET", apiRoutes.product.getProducts, payload);
};

export const createProduct = async (payload: FormData) => {
  return requestApi("POST", apiRoutes.product.createProduct, payload, null, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
