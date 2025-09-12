import type { SortDirection } from "./enums";

export interface SortCriteria {
  sortBy: string;
  sortDirection?: SortDirection;
}
