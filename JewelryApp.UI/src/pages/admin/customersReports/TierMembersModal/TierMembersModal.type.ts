import type { CustomerTier } from "../CustomersReports.type";

export interface TierMembersModalProps {
  show: boolean;
  tier: CustomerTier | null;
  onClose: () => void;
}
