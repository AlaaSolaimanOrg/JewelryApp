import type { KaratType, ProductCategory, ProductType } from "../../types/enums";

export interface CreateProductPayload {
  name: string;
  sku: string;
  category: ProductCategory;
  type: ProductType;
  karatType: KaratType;
  description?: string;
  weight: number;
  images: File[]; // maps to IFormFile[]
}