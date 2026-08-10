import { searchSales } from "../../../../../apis/sales.api/sales.api";
import { SortDirection, type ItemCondition, type ReturnOption, type ReturnReason } from "../../../../../types/enums";
import type {
  ExchangeApplyData,
  ExchangeSearchSale,
  SelectedExchangeItem,
} from "./ExchangeSection.type";

export const formatMoney = (n: number) =>
  "$" + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const SEARCH_PAGE = {
  pageSize: 20,
  pageNumber: 1,
  sortBy: "createdDate",
  sortDirection: SortDirection.Descending,
};

export const searchPastTransactions = async (query: string): Promise<ExchangeSearchSale[]> => {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const digits = trimmed.replace(/\D/g, "");
  const isPhoneLike = digits.length >= 4 && digits.length >= trimmed.replace(/[\s()+-]/g, "").length;
  const isSerialLike = !isPhoneLike && /-/.test(trimmed) && /\d/.test(trimmed);

  const payload = {
    serialNumber: isSerialLike ? trimmed : "",
    customerPhone: isPhoneLike ? digits : "",
    customerName: !isPhoneLike && !isSerialLike ? trimmed : "",
    ...SEARCH_PAGE,
  };

  const response = await searchSales(payload);
  return response?.data ?? [];
};

export const getExchangeTotal = (items: SelectedExchangeItem[]) =>
  items.reduce((sum, i) => sum + i.unitPrice * i.returnQty, 0);

export const buildExchangeApplyData = (
  sale: ExchangeSearchSale,
  items: SelectedExchangeItem[],
  reason: ReturnReason,
  reasonNote: string,
): ExchangeApplyData => ({
  saleId: sale.id,
  saleSerialNumber: sale.serialNumber,
  items: items.map((i) => ({
    saleItemId: i.saleItemId,
    quantityToReturn: i.returnQty,
    reason,
    reasonNote,
    returnAmount: i.unitPrice * i.returnQty,
    condition: i.condition as ItemCondition,
    option: i.dest as ReturnOption,
  })),
});
