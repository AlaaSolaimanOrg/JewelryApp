import { searchSales } from "../../../../../apis/sales.api";
import {
  ReturnReason,
  SortDirection,
  type ItemCondition,
  type ReturnOption,
} from "../../../../../types/enums";
import type {
  ExchangeApplyData,
  ExchangeItemGroup,
  ExchangeSearchSale,
  SelectedExchangeItem,
} from "./ExchangeSection.type";

export const formatMoney = (n: number) =>
  "$" +
  Math.abs(n).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const SEARCH_PAGE = {
  pageSize: 20,
  pageNumber: 1,
  sortBy: "createdDate",
  sortDirection: SortDirection.Descending,
};

export const searchPastTransactions = async (
  query: string,
): Promise<ExchangeSearchSale[]> => {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const digits = trimmed.replace(/\D/g, "");
  const isPhoneLike =
    digits.length >= 4 &&
    digits.length >= trimmed.replace(/[\s()+-]/g, "").length;
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
  items.reduce((sum, i) => sum + i.returnAmount, 0);

export const groupItemsBySale = (items: SelectedExchangeItem[]): ExchangeItemGroup[] =>
  items.reduce<ExchangeItemGroup[]>((groups, item) => {
    const group = groups.find((g) => g.saleId === item.saleId);
    if (group) {
      group.items.push(item);
      return groups;
    }
    return [
      ...groups,
      { saleId: item.saleId, saleSerialNumber: item.saleSerialNumber, items: [item] },
    ];
  }, []);

export const buildExchangeApplyData = (items: SelectedExchangeItem[]): ExchangeApplyData[] =>
  groupItemsBySale(items).map((group) => ({
    saleId: group.saleId,
    saleSerialNumber: group.saleSerialNumber,
    items: group.items.map((i) => ({
      saleItemId: i.saleItemId,
      quantityToReturn: i.returnQty,
      reason: i.reason as ReturnReason,
      reasonNote: i.reason === ReturnReason.Other ? i.reasonNote : undefined,
      returnAmount: i.returnAmount,
      condition: i.condition as ItemCondition,
      option: i.dest as ReturnOption,
    })),
  }));
