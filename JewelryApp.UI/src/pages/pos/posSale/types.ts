import { KaratType, ProductCategory, ProductType } from "../../../types/enums";

export interface Product {
  id: string | null;
  sku: string | null;
  name: string;
  quantity: number;
  quantityForSale: number;
  karatType?: KaratType | null;
  weight: number | string;
  category: ProductCategory;
  productType: ProductType;
  description: string;
  originalPricePerGram: number | string;
  pricePerGram: number | string;
  price: number;
  images: { imageUrl: string }[];
  manual: boolean;
  subtotal?: string | number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  birthday: string;
  totalProductsPurchased: number;
  totalPurchasesValue: number;
}
