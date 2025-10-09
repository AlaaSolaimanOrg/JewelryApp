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

export interface Customer {
  name: string;
  email: string;
  phoneNumber: string;
  birthday: string;
}
