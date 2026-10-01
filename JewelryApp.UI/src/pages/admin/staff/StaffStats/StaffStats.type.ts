export interface UserStats {
  totalStaff: number;
  activeStaff: number;
  inactiveStaff: number;
  adminsCount: number;
  terminalsCount: number;
}

export interface StaffStatsProps {
  stats: UserStats | null;
}
