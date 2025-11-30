import type {
  ItemCondition,
  ReturnOption,
  ReturnReason,
} from "../../types/enums";
import { requestApi } from "../../utils";
import { apiRoutes } from "../apiRoutes";

export const createReturn = async (payload: {
  saleId: string;
  items: {
    saleItemId: string;
    quantityToReturn: number;
    reason: ReturnReason | null;
    reasonNote?: string;
    returnAmount: number;
    condition: ItemCondition | null;
    option: ReturnOption| null;
  }[];
}) => {
  return requestApi("POST", apiRoutes.returns.createReturn, payload);
};
