export type RepairBoardStatus = "progress" | "done" | "completed" | "cancelled";

export interface Repair {
  id: string;
  repairCode: string;
  slotNumber: number | null;
  customerName: string;
  customerPhone: string;
  notes: string;
  cost: number;
  paid: boolean;
  payMethod: string;
  status: RepairBoardStatus;
  notified: boolean;
  dueDate: string;
  orderDate: string;
  notifiedDate: string | null;
  pickedUpDate: string | null;
  cancelledDate: string | null;
}

export type ActiveViewFilter = "all" | "progress" | "done" | "awaiting";
export type BoardView = "active" | "completed";
