import { KaratType } from "../../../../../types/enums";

export interface TradeInRow {
  id: number;
  karat: KaratType | number;
  weight: number;
  pricePerGram: number;
}
