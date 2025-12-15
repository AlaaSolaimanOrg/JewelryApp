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
export const getProductById = async (payload: {
  id?: string;
  sku?: string;
}) => {
  return requestApi("GET", apiRoutes.product.getProductById, payload);
};

export const createProduct = async (payload: FormData) => {
  return requestApi("POST", apiRoutes.product.createProduct, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const editProduct = async (payload: FormData) => {
  return requestApi("PUT", apiRoutes.product.editProduct, payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteProduct = async (payload: { id: string }) => {
  return requestApi("DELETE", apiRoutes.product.deleteProduct, payload);
};

export const getProductsBySkus = async (payload: { skus: string[] }) => {
  return requestApi("GET", apiRoutes.product.getProductsBySkus, payload);
};

export const exportProductsToExcel = async (payload: any) => {
  return requestApi("GET", apiRoutes.product.exportProductsToExcel, payload, {
    responseType: "blob",
  });
};

export const getInventoryReports = async (payload: {
  dateFrom: string;
  date: string;
}) => {
  return requestApi("GET", apiRoutes.product.getInventoryReports, payload);
};
