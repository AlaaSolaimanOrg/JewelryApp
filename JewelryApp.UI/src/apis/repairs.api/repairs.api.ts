import type {
  ProductCategory,
  ProductType,
  RepairStatus,
  RepairType,
} from "../../types/enums";
import { requestApi } from "../../utils";
import { apiRoutes } from "../apiRoutes";

export const createRepair = async (payload: {
  customerId: string;
  notes: string;
  items: {
    itemType: ProductCategory;
    metal: ProductType;
    weight: number;
    stoneType: string;
    repairType: RepairType;
    notes: string;
    cost: number;
    urgentFee: number;
    discount: number;
    dueDate?: string | null;
  }[];
}) => {
  return requestApi("POST", apiRoutes.repairs.createRepair, payload);
};

export const getRepairs = async (payload: { status?: RepairStatus }) => {
  return requestApi("GET", apiRoutes.repairs.getRepairs, payload);
};

export const getRepairAnalytics = async () => {
  return requestApi("GET", apiRoutes.repairs.getRepairAnalytics);
};
