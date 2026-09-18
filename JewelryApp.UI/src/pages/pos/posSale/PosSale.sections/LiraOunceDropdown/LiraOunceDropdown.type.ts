import type { Product } from "../../types";

export interface BullionProducts {
  liras: Product[];
  ounces: Product[];
}

export interface LiraOunceDropdownProps {
  selectedIds: (string | null)[];
  onProductSelected: (product: Product) => void;
}

export interface BullionGroupProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  items: Product[];
  isLoading: boolean;
  selectedIds: (string | null)[];
  onSelect: (product: Product) => void;
}
