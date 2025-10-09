import { KaratType, ProductCategory, ProductType } from "../../../types/enums";

export interface Product {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  karatType?: KaratType | string;
  weight: number | string;
  category: ProductCategory;
  productType: ProductType;
  description: string;
  pricePerGram: number | string;
  price: number;
  images: { imageUrl: string }[];
  manual: boolean;
  subtotal?: string | number;
}

export const initialCustomer = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "(555) 123-4567",
  birthday: "March 15, 1985",
};

export type Customer = typeof initialCustomer;
