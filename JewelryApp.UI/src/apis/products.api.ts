import type { KaratType, ProductCategory } from "../types/enums";
import { requestApi } from "../utils";

export const generateSKU = async (payload: {
  karatType: KaratType;
  category: ProductCategory;
}) => {
  return requestApi("GET", "Product/GenerateSku", payload);
};
