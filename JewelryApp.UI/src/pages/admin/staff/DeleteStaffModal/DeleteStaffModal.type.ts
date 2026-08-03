import type { User } from "../Staff.utils";

export interface DeleteStaffModalProps {
  user: User | null;
  onClose: () => void;
  onDeleted: () => void;
}
