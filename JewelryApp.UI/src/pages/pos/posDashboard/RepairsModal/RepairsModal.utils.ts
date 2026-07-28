export interface Repair {
  id: string;
  repairCode: string;
  customerName: string;
  customerPhone: string;
  notes: string;
  cost: number;
  dueDate: string | null;
  slotNumber: number | null;
}

export type RepairDueStatus = "overdue" | "today" | "upcoming";

export const getDueStatus = (dueDate: string | null): RepairDueStatus => {
  if (!dueDate) return "upcoming";
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  if (due.getTime() < startOfToday.getTime()) return "overdue";
  if (due.getTime() === startOfToday.getTime()) return "today";
  return "upcoming";
};
