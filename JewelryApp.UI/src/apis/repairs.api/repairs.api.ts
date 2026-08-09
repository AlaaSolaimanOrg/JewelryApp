import type { PaymentStatus, RepairStatus } from "../../types/enums";
import { requestApi } from "../../utils";
import { apiRoutes } from "../apiRoutes";

export const createRepair = async (payload: {
  customerId: string;
  notes: string;
  cost: number;
  paymentStatus: PaymentStatus;
  cashAmount?: number;
  cardAmount?: number;
  dueDate?: string | null;
  receiverName?: string | null;
}) => {
  return requestApi("POST", apiRoutes.repairs.createRepair, payload);
};

export const getRepairs = async (payload: { status?: RepairStatus }) => {
  return requestApi("GET", apiRoutes.repairs.getRepairs, payload);
};

export const updateRepairStatus = async (payload: {
  id: string;
  status: RepairStatus;
  sendSms?: boolean;
  updateItemsPaymentStatus?: boolean;
  newPaymentStatus?: PaymentStatus;
}) => {
  return requestApi("PUT", apiRoutes.repairs.updateRepairStatus, payload);
};

export const updateRepair = async (payload: { id: string; cost: number }) => {
  return requestApi("PUT", apiRoutes.repairs.updateRepair, payload);
};

export const updateRepairPaymentStatus = async (payload: {
  id: string;
  newPaymentStatus: PaymentStatus;
}) => {
  return requestApi(
    "PUT",
    apiRoutes.repairs.updateRepairPaymentStatus,
    payload,
  );
};

export const getRepairById = async (payload: { id: string }) => {
  return requestApi("GET", apiRoutes.repairs.getRepairById, payload);
};
