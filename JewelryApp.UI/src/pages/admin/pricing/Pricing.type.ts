import { KaratType, ProductType } from "../../../types/enums";

export interface PriceItem {
  productType: ProductType;
  karatType: KaratType;
  pricePerGram: number;
}

export interface KaratCardViewModel {
  karatType: KaratType;
  karatLabel: string;
  stockGrams: number;
  price: number | null;
  changed: boolean;
  deltaDirection: "up" | "down" | "none";
  deltaText: string;
  valueImpact: number;
}
