import { requestApi } from "../../utils";
import { apiRoutes } from "../apiRoutes";

export interface CreateReceiptPrintJobPayload {
  storeId: string;
  printerId: string;
  receiptPayload: {
    html: string;
  };
}

export const createReceiptPrintJob = async (
  payload: CreateReceiptPrintJobPayload,
) => {
  return requestApi("POST", apiRoutes.printJobs.createReceiptPrintJob, payload);
};
