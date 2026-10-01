import type { Product } from "../../types";

export interface BullionProducts {
  liras: Product[];
  ounces: Product[];
}

export interface LiraOunceDropdownProps {
  selectedIds: (string | null)[];
  onProductSelected: (product: Product) => void;
}

export type BullionCategory = keyof BullionProducts;
