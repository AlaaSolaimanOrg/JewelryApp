import type {
  KaratType,
  ProductCategory
} from "../../types/enums";
import { requestApi } from "../../utils";
import { apiRoutes } from "../apiRoutes";
import type { CreateProductPayload } from "./products.api.type";

export const generateSKU = async (payload: {
  karatType: KaratType;
  category: ProductCategory;
}) => {
  return requestApi("GET", apiRoutes.product.generateSku, payload);
};
export const createProduct = async (payload: CreateProductPayload) => {
  return requestApi("POST", apiRoutes.product.createProduct, payload);
};
