export enum KaratType {
  Karat18 = 18,
  Karat21 = 21,
  Karat22 = 22,
  Karat24 = 24,
}

export enum ProductCategory {
  Necklaces = 1,
  Bracelets = 2,
  Rings = 3,
  Earrings = 4,
  Pendants = 5,
  Bullion = 6,
}

export enum ProductType {
  Gold = 1,
  Silver = 2,
}

export enum SortDirection {
  Ascending,
  Descending,
}

export enum Currency {
  USD = 0,
  CAD = 1,
}

export enum PricingSettingEntryType {
  Manual = 1,
  ApiIntegration = 2,
}

export enum OrderDiscount {
  Percentage = 1,
  FixedAmount = 2,
}

export enum DatePillFilter {
  Today = 1,
  ThisWeek = 2,
  ThisMonth = 3,
  ThisYear = 4,
  All = 5,
}

export enum DiscountType {
  None = 1,
  FixedAmount = 2,
  Percentage = 3,
}

export enum CustomerFilter {
  New = 1,
  Returning,
}

export enum ReturnReason {
  Defective = "Defective",
  WrongItem = "WrongItem",
  ChangedMind = "ChangedMind",
  Other = "Other",
}

export enum ItemCondition {
  New = "New",
  Used = "Used",
  Damaged = "Damaged",
}

export enum ReturnOption {
  Refund = "Refund",
  Exchange = "Exchange",
  StoreCredit = "StoreCredit",
}

export enum RepairType {
  Resize,
  Solder,
  StoneReplacement,
  StoneTightening,
  Polishing,
  Cleaning,
  Plating,
  Engraving,
  FixOrChangeLock,
  AddGold,
}

export enum RepairStatus {
  Received,
  InProgress,
  Ready,
  Completed,
  PickedUp,
}

export enum PaymentStatus {
  Unpaid,
  Paid,
  Partial,
}

export enum ReportType {
  Daily = 0,
  Weekly = 1,
  Monthly = 2,
  Yearly = 3,
}
