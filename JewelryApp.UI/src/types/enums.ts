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
  Bangles = 7,
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

export enum DiscountType {
  None = 1,
  FixedAmount = 2,
  Percentage = 3,
}

export enum ReturnReason {
  NotAsExpected = 1,
  WrongSize = 2,
  Defective = 3,
  GiftReturn = 4,
  Other = 99,
}

export enum ItemCondition {
  Good = 1,
  NeedsPolishing = 2,
  Damaged = 3,
}

export enum ReturnOption {
  ReturnToStock = 1,
  MeltAfterReturn = 2,
}

export enum RefundMethod {
  Cash = 1,
  Card = 2,
  StoreCredit = 3,
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
  InProgress,
  Completed,
  PickedUp,
}

export enum PaymentStatus {
  Unpaid = 0,
  Paid = 1,
}

export enum RepairPayMethod {
  Unpaid,
  Cash,
  Card,
  Split,
}

export enum ReportType {
  Daily = 0,
  Weekly = 1,
  Monthly = 2,
  Yearly = 3,
  AllTime = 99,
}

export enum LogLevel {
  Info = 1,
  Warning = 2,
  Error = 3,
}
