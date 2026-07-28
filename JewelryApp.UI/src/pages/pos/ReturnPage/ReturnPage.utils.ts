import { ReturnReason } from "../../../types/enums";
import type { SaleItem, TransactionItem } from "./ReturnPage.type";

export const formatCurrency = (n: number) =>
  "$" +
  Math.abs(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const mapSaleItemsToTransactionItems = (
  saleItems: SaleItem[],
): TransactionItem[] =>
  saleItems.map((item) => ({
    id: item.id,
    productImage: item.productImage,
    name: item.productName,
    icon: item.productName.toLowerCase().includes("ring") ? "ring" : "gem",
    karat: item.karat,
    weight: item.weight + "g",
    unitPrice: item.quantity > 0 ? item.subtotalAfterDiscount / item.quantity : 0,
    qtyPurchased: item.quantity,
    qtyToReturn: 0,
    apiAmountReturned: item.amountReturned,
    returnAmount: 0,
    selected: false,
    quantityReturned: item.quantityReturned || 0,
    returnReason: null,
    otherReason: "",
    condition: null,
    returnOption: null,
  }));

export const isSelectionValid = (item: TransactionItem) => {
  if (!item.returnReason || !item.condition || !item.returnOption) return false;
  if (item.returnReason === ReturnReason.Other && !item.otherReason.trim())
    return false;
  return item.qtyToReturn > 0;
};
