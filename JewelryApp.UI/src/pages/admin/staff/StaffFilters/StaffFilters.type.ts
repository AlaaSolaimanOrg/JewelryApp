import type { ChangeEvent } from "react";

export interface StaffFiltersProps {
  roleFilter: string;
  onRoleFilterChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
}
