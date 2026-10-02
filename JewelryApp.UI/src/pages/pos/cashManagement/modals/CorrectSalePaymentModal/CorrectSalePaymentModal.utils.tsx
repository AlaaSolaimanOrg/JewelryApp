import { getSaleById } from "../../../../../apis/sales.api";
import { checkRequestSucceeded } from "../../../../../utils";
import type { CorrectionPayMethod, SaleLookup } from "./CorrectSalePaymentModal.type";

export const fetchSale = async (saleId: string): Promise<SaleLookup | null> => {
  const response = await getSaleById({ saleId });
  return checkRequestSucceeded(response?.statusCode) && response?.data
    ? response.data
    : null;
};

export const detectPayMethod = (sale: SaleLookup): CorrectionPayMethod => {
  const cash = sale.cashAmount ?? 0;
  const card = sale.cardAmount ?? 0;
  if (cash > 0 && card > 0) return "split";
  return card > 0 ? "card" : "cash";
};

export const roundMoney = (n: number) => Math.round(n * 100) / 100;
